/**
 * Revenue Intelligence — deep analytics on partner-attributed revenue.
 * Powers /dashboard/reports/revenue
 */
import { query } from "./_generated/server";
import { getOrg } from "./lib/getOrg";

export const getRevenueIntelligence = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return null;

    const [deals, partners, payouts, attributions] = await Promise.all([
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("partners")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("payouts")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("attributions")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
    ]);

    const partnerMap = new Map(partners.map((p: any) => [p._id, p]));
    const wonDeals = deals.filter((d: any) => d.status === "won");
    const totalRevenue = wonDeals.reduce((s: number, d: any) => s + d.amount, 0);

    // --- Revenue by Partner Type ---
    const revenueByType: Record<string, { revenue: number; deals: number; partners: Set<string> }> = {};
    for (const deal of wonDeals) {
      if (!deal.registeredBy) continue;
      const partner = partnerMap.get(deal.registeredBy);
      if (!partner) continue;
      const type = partner.type || "unknown";
      if (!revenueByType[type]) revenueByType[type] = { revenue: 0, deals: 0, partners: new Set() };
      revenueByType[type].revenue += deal.amount;
      revenueByType[type].deals += 1;
      revenueByType[type].partners.add(partner._id);
    }
    const byType = Object.entries(revenueByType).map(([type, data]) => ({
      type,
      revenue: data.revenue,
      deals: data.deals,
      partners: data.partners.size,
    })).sort((a, b) => b.revenue - a.revenue);

    // --- Revenue by Tier ---
    const revenueByTier: Record<string, { revenue: number; deals: number; partners: Set<string> }> = {};
    for (const deal of wonDeals) {
      if (!deal.registeredBy) continue;
      const partner = partnerMap.get(deal.registeredBy);
      if (!partner) continue;
      const tier = partner.tier || "untiered";
      if (!revenueByTier[tier]) revenueByTier[tier] = { revenue: 0, deals: 0, partners: new Set() };
      revenueByTier[tier].revenue += deal.amount;
      revenueByTier[tier].deals += 1;
      revenueByTier[tier].partners.add(partner._id);
    }
    const byTier = Object.entries(revenueByTier).map(([tier, data]) => ({
      tier,
      revenue: data.revenue,
      deals: data.deals,
      partners: data.partners.size,
    })).sort((a, b) => b.revenue - a.revenue);

    // --- Monthly Revenue Trend (last 12 months) ---
    const now = Date.now();
    const months: { key: string; label: string; start: number; end: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth();
      const start = new Date(y, m, 1).getTime();
      const end = new Date(y, m + 1, 1).getTime();
      const label = d.toLocaleString("en-US", { month: "short" });
      months.push({ key: `${y}-${String(m + 1).padStart(2, "0")}`, label, start, end });
    }

    const monthlyRevenue = months.map(({ key, label, start, end }) => {
      let partnerSourced = 0;
      let direct = 0;
      for (const deal of wonDeals) {
        const closedAt = deal.closedAt || deal._creationTime;
        if (closedAt >= start && closedAt < end) {
          if (deal.registeredBy) {
            partnerSourced += deal.amount;
          } else {
            direct += deal.amount;
          }
        }
      }
      return { month: label, key, partnerSourced, direct, total: partnerSourced + direct };
    });

    // --- Top Deals ---
    const topDeals = wonDeals
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 10)
      .map((deal: any) => {
        const partner = deal.registeredBy ? partnerMap.get(deal.registeredBy) : null;
        return {
          id: deal._id,
          name: deal.name,
          amount: deal.amount,
          product: deal.productName || null,
          partnerName: partner?.name || null,
          partnerType: partner?.type || null,
          partnerTier: partner?.tier || null,
          closedAt: deal.closedAt || deal._creationTime,
        };
      });

    // --- Revenue Concentration ---
    const partnerRevenue: Record<string, { name: string; revenue: number; type: string; tier: string }> = {};
    for (const deal of wonDeals) {
      if (!deal.registeredBy) continue;
      const partner = partnerMap.get(deal.registeredBy);
      if (!partner) continue;
      const pid = partner._id;
      if (!partnerRevenue[pid]) {
        partnerRevenue[pid] = { name: partner.name, revenue: 0, type: partner.type, tier: partner.tier || "untiered" };
      }
      partnerRevenue[pid].revenue += deal.amount;
    }
    const sortedPartners = Object.values(partnerRevenue).sort((a, b) => b.revenue - a.revenue);
    const partnerSourcedTotal = sortedPartners.reduce((s, p) => s + p.revenue, 0);

    // Concentration: % from top 1, top 3, top 5
    const top1Rev = sortedPartners.slice(0, 1).reduce((s, p) => s + p.revenue, 0);
    const top3Rev = sortedPartners.slice(0, 3).reduce((s, p) => s + p.revenue, 0);
    const top5Rev = sortedPartners.slice(0, 5).reduce((s, p) => s + p.revenue, 0);

    const concentration = {
      top1Pct: partnerSourcedTotal > 0 ? Math.round((top1Rev / partnerSourcedTotal) * 100) : 0,
      top3Pct: partnerSourcedTotal > 0 ? Math.round((top3Rev / partnerSourcedTotal) * 100) : 0,
      top5Pct: partnerSourcedTotal > 0 ? Math.round((top5Rev / partnerSourcedTotal) * 100) : 0,
      totalPartners: sortedPartners.length,
    };

    // --- Commission Efficiency ---
    const totalCommissions = payouts
      .filter((p: any) => p.status === "paid" || p.status === "pending_approval")
      .reduce((s: number, p: any) => s + p.amount, 0);
    const commissionToRevenueRatio = totalRevenue > 0 ? totalCommissions / totalRevenue : 0;

    // --- Avg Deal Size by Type ---
    const avgDealByType = byType.map((t) => ({
      type: t.type,
      avgDealSize: t.deals > 0 ? Math.round(t.revenue / t.deals) : 0,
    }));

    // --- Summary Stats ---
    const partnerSourcedRevenue = wonDeals
      .filter((d: any) => d.registeredBy)
      .reduce((s: number, d: any) => s + d.amount, 0);
    const partnerSourcedPct = totalRevenue > 0 ? Math.round((partnerSourcedRevenue / totalRevenue) * 100) : 0;

    // --- Partner Profitability Analysis ---
    // Build payout totals by partner
    const payoutsByPartner = new Map<string, number>();
    for (const p of payouts) {
      if (p.status === "paid" || p.status === "pending_approval" || p.status === "approved") {
        const current = payoutsByPartner.get(p.partnerId) ?? 0;
        payoutsByPartner.set(p.partnerId, current + p.amount);
      }
    }

    // Build attribution commission totals by partner (for partners without payouts yet)
    const attrCommissionByPartner = new Map<string, number>();
    for (const a of attributions) {
      if (a.model === "role_based") {
        const current = attrCommissionByPartner.get(a.partnerId) ?? 0;
        attrCommissionByPartner.set(a.partnerId, current + a.commissionAmount);
      }
    }

    // Compute per-partner profitability
    const partnerProfitability = Object.entries(partnerRevenue).map(([pid, data]) => {
      const partner = partnerMap.get(pid);
      const commissionsPaid = payoutsByPartner.get(pid) ?? 0;
      const commissionsAccrued = attrCommissionByPartner.get(pid) ?? 0;
      // Use actual payouts if available, otherwise use attribution-based commissions
      const totalCost = commissionsPaid > 0 ? commissionsPaid : commissionsAccrued;
      const netRevenue = data.revenue - totalCost;
      const margin = data.revenue > 0 ? (netRevenue / data.revenue) * 100 : 0;
      const partnerDeals = wonDeals.filter((d: any) => d.registeredBy === pid);
      const avgDealSize = partnerDeals.length > 0 ? data.revenue / partnerDeals.length : 0;

      // ROI: revenue generated per dollar of commission paid
      const roi = totalCost > 0 ? data.revenue / totalCost : 0;

      return {
        partnerId: pid,
        name: data.name,
        type: data.type,
        tier: data.tier,
        grossRevenue: Math.round(data.revenue),
        commissionCost: Math.round(totalCost),
        netRevenue: Math.round(netRevenue),
        margin: Math.round(margin * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        dealCount: partnerDeals.length,
        avgDealSize: Math.round(avgDealSize),
        commissionRate: partner?.commissionRate ?? 0,
      };
    }).sort((a, b) => b.netRevenue - a.netRevenue);

    // Profitability by type
    const profitByType = byType.map((t) => {
      const typePartners = partnerProfitability.filter((p) => p.type === t.type);
      const grossRevenue = typePartners.reduce((s, p) => s + p.grossRevenue, 0);
      const commissionCost = typePartners.reduce((s, p) => s + p.commissionCost, 0);
      const netRevenue = grossRevenue - commissionCost;
      return {
        type: t.type,
        grossRevenue,
        commissionCost,
        netRevenue,
        margin: grossRevenue > 0 ? Math.round(((netRevenue / grossRevenue) * 100) * 100) / 100 : 0,
        partnerCount: typePartners.length,
        avgRoi: typePartners.length > 0
          ? Math.round((typePartners.reduce((s, p) => s + p.roi, 0) / typePartners.length) * 100) / 100
          : 0,
      };
    });

    // Profitability by tier
    const profitByTier = byTier.map((t) => {
      const tierPartners = partnerProfitability.filter((p) => p.tier === t.tier);
      const grossRevenue = tierPartners.reduce((s, p) => s + p.grossRevenue, 0);
      const commissionCost = tierPartners.reduce((s, p) => s + p.commissionCost, 0);
      const netRevenue = grossRevenue - commissionCost;
      return {
        tier: t.tier,
        grossRevenue,
        commissionCost,
        netRevenue,
        margin: grossRevenue > 0 ? Math.round(((netRevenue / grossRevenue) * 100) * 100) / 100 : 0,
        partnerCount: tierPartners.length,
        avgRoi: tierPartners.length > 0
          ? Math.round((tierPartners.reduce((s, p) => s + p.roi, 0) / tierPartners.length) * 100) / 100
          : 0,
      };
    });

    // Overall program profitability
    const totalGrossPartnerRevenue = partnerProfitability.reduce((s, p) => s + p.grossRevenue, 0);
    const totalCommissionCost = partnerProfitability.reduce((s, p) => s + p.commissionCost, 0);
    const totalNetRevenue = totalGrossPartnerRevenue - totalCommissionCost;
    const unprofitablePartners = partnerProfitability.filter((p) => p.netRevenue < 0);

    return {
      summary: {
        totalRevenue,
        partnerSourcedRevenue,
        partnerSourcedPct,
        totalDeals: wonDeals.length,
        avgDealSize: wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0,
        totalCommissions,
        commissionToRevenueRatio: Math.round(commissionToRevenueRatio * 10000) / 100, // e.g. 12.5%
        activePartners: partners.filter((p: any) => p.status === "active").length,
      },
      byType,
      byTier,
      monthlyRevenue,
      topDeals,
      concentration,
      avgDealByType,
      topPartners: sortedPartners.slice(0, 10),
      profitability: {
        programOverview: {
          grossPartnerRevenue: totalGrossPartnerRevenue,
          totalCommissionCost,
          netPartnerRevenue: totalNetRevenue,
          programMargin: totalGrossPartnerRevenue > 0
            ? Math.round(((totalNetRevenue / totalGrossPartnerRevenue) * 100) * 100) / 100
            : 0,
          programRoi: totalCommissionCost > 0
            ? Math.round((totalGrossPartnerRevenue / totalCommissionCost) * 100) / 100
            : 0,
          unprofitablePartnerCount: unprofitablePartners.length,
          unprofitableRevenueLoss: unprofitablePartners.reduce((s, p) => s + p.netRevenue, 0),
        },
        byPartner: partnerProfitability.slice(0, 20),
        byType: profitByType,
        byTier: profitByTier,
      },
    };
  },
});
