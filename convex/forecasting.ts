import { query } from "./_generated/server";
import { getOrgId } from "./lib/getOrg";

export const getForecastData = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return { pipeline: [], monthlyRevenue: {}, partnerGrowth: {}, avgMonthlyRevenue: 0, totalPartners: 0, totalOpenPipeline: 0 };

    const [deals, partners, attributions] = await Promise.all([
      ctx.db.query("deals").withIndex("by_organization", (q) => q.eq("organizationId", orgId)).collect(),
      ctx.db.query("partners").withIndex("by_organization", (q) => q.eq("organizationId", orgId)).collect(),
      ctx.db.query("attributions").withIndex("by_organization", (q) => q.eq("organizationId", orgId)).collect(),
    ]);

    // Build partner lookup
    const partnerMap = new Map(partners.map((p) => [p._id, p]));

    // Build attribution-by-deal lookup for O(1) access
    const attrByDeal = new Map<string, typeof attributions[number]>();
    for (const a of attributions) {
      if (!attrByDeal.has(a.dealId)) {
        attrByDeal.set(a.dealId, a);
      }
    }

    // Pipeline deals (open deals)
    const pipeline = deals
      .filter((d) => d.status === "open")
      .map((d) => {
        const partner = d.registeredBy ? partnerMap.get(d.registeredBy) : null;
        // Find attribution partner if no registeredBy
        const attr = attrByDeal.get(d._id);
        const attrPartner = attr ? partnerMap.get(attr.partnerId) : null;
        const p = partner || attrPartner;
        return {
          id: d._id,
          dealName: d.name,
          partnerName: p?.name ?? "Direct",
          value: d.amount,
          commissionRate: (p?.commissionRate ?? 15) / 100,
          expectedClose: d.expectedCloseDate ?? d.createdAt + 90 * 86400000, // default 90 days out
          stage: d.registrationStatus === "pending" ? "Pending" : "Active",
        };
      });

    // Historical: won deals grouped by month
    const wonDeals = deals.filter((d) => d.status === "won" && d.closedAt);
    const monthlyRevenue: Record<string, number> = {};
    for (const d of wonDeals) {
      const date = new Date(d.closedAt!);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + d.amount;
    }

    // Partner growth: new partners per month (last 6 months)
    const partnerGrowth: Record<string, number> = {};
    for (const p of partners) {
      const date = new Date(p.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      partnerGrowth[key] = (partnerGrowth[key] || 0) + 1;
    }

    // Compute total recurring commission from won deals
    const totalWonAmount = wonDeals.reduce((s, d) => s + d.amount, 0);
    const avgMonthlyRevenue = Object.keys(monthlyRevenue).length > 0
      ? totalWonAmount / Object.keys(monthlyRevenue).length
      : 0;

    return {
      pipeline,
      monthlyRevenue,
      partnerGrowth,
      avgMonthlyRevenue,
      totalPartners: partners.length,
      totalOpenPipeline: pipeline.reduce((s, d) => s + d.value, 0),
    };
  },
});
