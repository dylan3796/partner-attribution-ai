/**
 * Win/Loss Analysis — deep dive into deal outcomes by partner, product, and time.
 * Powers /dashboard/reports/win-loss
 */
import { query } from "./_generated/server";
import { getOrg } from "./lib/getOrg";

export const getWinLossAnalysis = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return null;

    const [deals, partners, touchpoints] = await Promise.all([
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("partners")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("touchpoints")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
    ]);

    const partnerMap = new Map(partners.map((p) => [p._id, p]));

    const wonDeals = deals.filter((d) => d.status === "won");
    const lostDeals = deals.filter((d) => d.status === "lost");
    const closedDeals = [...wonDeals, ...lostDeals];

    // Overall stats
    const totalWon = wonDeals.length;
    const totalLost = lostDeals.length;
    const totalClosed = closedDeals.length;
    const overallWinRate = totalClosed > 0 ? totalWon / totalClosed : 0;
    const avgWonSize = totalWon > 0 ? wonDeals.reduce((s, d) => s + d.amount, 0) / totalWon : 0;
    const avgLostSize = totalLost > 0 ? lostDeals.reduce((s, d) => s + d.amount, 0) / totalLost : 0;
    const totalWonRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
    const totalLostRevenue = lostDeals.reduce((s, d) => s + d.amount, 0);

    // Deal velocity (time from creation to close)
    function daysToClose(deal: typeof deals[0]): number | null {
      if (!deal.closedAt) return null;
      return Math.max(1, Math.round((deal.closedAt - deal.createdAt) / 86400000));
    }

    const wonVelocities = wonDeals.map(daysToClose).filter((d): d is number => d !== null);
    const lostVelocities = lostDeals.map(daysToClose).filter((d): d is number => d !== null);
    const avgWonVelocity = wonVelocities.length > 0 ? Math.round(wonVelocities.reduce((s, d) => s + d, 0) / wonVelocities.length) : 0;
    const avgLostVelocity = lostVelocities.length > 0 ? Math.round(lostVelocities.reduce((s, d) => s + d, 0) / lostVelocities.length) : 0;

    // Win rate by partner (only partners with closed deals)
    const partnerStats = new Map<string, { name: string; won: number; lost: number; wonRevenue: number; lostRevenue: number; tier: string; type: string }>();

    for (const deal of closedDeals) {
      // Find partner via touchpoints or registeredBy
      let partnerId = deal.registeredBy;
      if (!partnerId) {
        const tp = touchpoints.find((t) => t.dealId === deal._id);
        if (tp) partnerId = tp.partnerId;
      }
      if (!partnerId) continue;

      const partner = partnerMap.get(partnerId);
      if (!partner) continue;

      const key = partnerId;
      const existing = partnerStats.get(key) || { name: partner.name, won: 0, lost: 0, wonRevenue: 0, lostRevenue: 0, tier: partner.tier || "bronze", type: partner.type || "referral" };
      if (deal.status === "won") {
        existing.won++;
        existing.wonRevenue += deal.amount;
      } else {
        existing.lost++;
        existing.lostRevenue += deal.amount;
      }
      partnerStats.set(key, existing);
    }

    const byPartner = Array.from(partnerStats.values())
      .map((p) => ({
        ...p,
        total: p.won + p.lost,
        winRate: (p.won + p.lost) > 0 ? p.won / (p.won + p.lost) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // Win rate by product
    const productStats = new Map<string, { won: number; lost: number; wonRevenue: number; lostRevenue: number }>();
    for (const deal of closedDeals) {
      const product = deal.productName || "Untagged";
      const existing = productStats.get(product) || { won: 0, lost: 0, wonRevenue: 0, lostRevenue: 0 };
      if (deal.status === "won") {
        existing.won++;
        existing.wonRevenue += deal.amount;
      } else {
        existing.lost++;
        existing.lostRevenue += deal.amount;
      }
      productStats.set(product, existing);
    }

    const byProduct = Array.from(productStats.entries())
      .map(([name, s]) => ({
        name,
        ...s,
        total: s.won + s.lost,
        winRate: (s.won + s.lost) > 0 ? s.won / (s.won + s.lost) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // Win rate by deal size bucket
    function sizeBucket(amount: number): string {
      if (amount < 10000) return "< $10K";
      if (amount < 25000) return "$10K–$25K";
      if (amount < 50000) return "$25K–$50K";
      if (amount < 100000) return "$50K–$100K";
      return "$100K+";
    }

    const sizeStats = new Map<string, { won: number; lost: number }>();
    for (const deal of closedDeals) {
      const bucket = sizeBucket(deal.amount);
      const existing = sizeStats.get(bucket) || { won: 0, lost: 0 };
      if (deal.status === "won") existing.won++;
      else existing.lost++;
      sizeStats.set(bucket, existing);
    }

    const bucketOrder = ["< $10K", "$10K–$25K", "$25K–$50K", "$50K–$100K", "$100K+"];
    const byDealSize = bucketOrder
      .filter((b) => sizeStats.has(b))
      .map((name) => {
        const s = sizeStats.get(name)!;
        return { name, ...s, total: s.won + s.lost, winRate: (s.won + s.lost) > 0 ? s.won / (s.won + s.lost) : 0 };
      });

    // Monthly trend (last 6 months)
    const now = Date.now();
    const monthlyTrend: { month: string; won: number; lost: number; winRate: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
      const monthLabel = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

      const monthWon = closedDeals.filter((deal) => deal.status === "won" && deal.closedAt && deal.closedAt >= monthStart && deal.closedAt < monthEnd).length;
      const monthLost = closedDeals.filter((deal) => deal.status === "lost" && deal.closedAt && deal.closedAt >= monthStart && deal.closedAt < monthEnd).length;
      const monthTotal = monthWon + monthLost;

      monthlyTrend.push({
        month: monthLabel,
        won: monthWon,
        lost: monthLost,
        winRate: monthTotal > 0 ? monthWon / monthTotal : 0,
      });
    }

    // Touchpoint analysis — avg touchpoints on won vs lost deals
    const wonTouchpointCounts: number[] = [];
    const lostTouchpointCounts: number[] = [];
    for (const deal of closedDeals) {
      const count = touchpoints.filter((t) => t.dealId === deal._id).length;
      if (deal.status === "won") wonTouchpointCounts.push(count);
      else lostTouchpointCounts.push(count);
    }
    const avgWonTouchpoints = wonTouchpointCounts.length > 0 ? Math.round((wonTouchpointCounts.reduce((s, c) => s + c, 0) / wonTouchpointCounts.length) * 10) / 10 : 0;
    const avgLostTouchpoints = lostTouchpointCounts.length > 0 ? Math.round((lostTouchpointCounts.reduce((s, c) => s + c, 0) / lostTouchpointCounts.length) * 10) / 10 : 0;

    // Top won deals
    const topWonDeals = wonDeals
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((d) => {
        const partner = d.registeredBy ? partnerMap.get(d.registeredBy) : null;
        return {
          name: d.name,
          amount: d.amount,
          product: d.productName || "—",
          partner: partner?.name || "Direct",
          daysToClose: daysToClose(d),
        };
      });

    // Recent losses
    const recentLosses = lostDeals
      .sort((a, b) => (b.closedAt || b.createdAt) - (a.closedAt || a.createdAt))
      .slice(0, 5)
      .map((d) => {
        const partner = d.registeredBy ? partnerMap.get(d.registeredBy) : null;
        return {
          name: d.name,
          amount: d.amount,
          product: d.productName || "—",
          partner: partner?.name || "Direct",
          closedAt: d.closedAt || d.createdAt,
        };
      });

    return {
      summary: {
        totalWon,
        totalLost,
        totalClosed,
        overallWinRate,
        avgWonSize,
        avgLostSize,
        totalWonRevenue,
        totalLostRevenue,
        avgWonVelocity,
        avgLostVelocity,
        avgWonTouchpoints,
        avgLostTouchpoints,
      },
      byPartner,
      byProduct,
      byDealSize,
      monthlyTrend,
      topWonDeals,
      recentLosses,
    };
  },
});
