import { query } from "./_generated/server";

export const getCohorts = query({
  args: {},
  handler: async (ctx) => {
    const partners = await ctx.db.query("partners").collect();
    const deals = await ctx.db.query("deals").collect();
    const attributions = await ctx.db.query("attributions").collect();

    const now = Date.now();
    const ninetyDaysAgo = now - 90 * 86400000;

    // Group partners by join month
    const cohortMap: Record<string, {
      month: string;
      partners: string[];
      partnerIds: Set<string>;
      totalRevenue: number;
      totalCommissionRate: number;
      dealsWon: number;
      activeCount: number;
    }> = {};

    for (const p of partners) {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!cohortMap[key]) {
        cohortMap[key] = {
          month: key,
          partners: [],
          partnerIds: new Set(),
          totalRevenue: 0,
          totalCommissionRate: 0,
          dealsWon: 0,
          activeCount: 0,
        };
      }

      const c = cohortMap[key];
      c.partners.push(p.name);
      c.partnerIds.add(p._id);
      c.totalCommissionRate += p.commissionRate;

      // Find deals for this partner
      const partnerDeals = deals.filter(
        (deal) => deal.registeredBy === p._id || attributions.some((a) => a.partnerId === p._id && a.dealId === deal._id)
      );
      const wonDeals = partnerDeals.filter((deal) => deal.status === "won");
      c.dealsWon += wonDeals.length;
      c.totalRevenue += wonDeals.reduce((s, deal) => s + deal.amount, 0);

      // Active if has a deal in last 90 days
      const hasRecentDeal = partnerDeals.some((deal) => deal.createdAt > ninetyDaysAgo);
      if (hasRecentDeal) c.activeCount++;
    }

    const cohorts = Object.values(cohortMap)
      .map((c) => ({
        month: c.month,
        partnerCount: c.partners.length,
        partnerNames: c.partners,
        totalRevenue: c.totalRevenue,
        avgCommissionRate: c.partners.length > 0 ? Math.round(c.totalCommissionRate / c.partners.length) : 0,
        dealsWon: c.dealsWon,
        activeCount: c.activeCount,
        retentionRate: c.partners.length > 0 ? Math.round((c.activeCount / c.partners.length) * 100) : 0,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return cohorts;
  },
});
