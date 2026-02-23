import { query } from "./_generated/server";

export const getBenchmarks = query({
  args: {},
  handler: async (ctx) => {
    const partners = await ctx.db.query("partners").collect();
    const deals = await ctx.db.query("deals").collect();
    const attributions = await ctx.db.query("attributions").collect();
    const payouts = await ctx.db.query("payouts").collect();

    // Build per-partner metrics
    const benchmarks = partners.map((p) => {
      const partnerDeals = deals.filter(
        (d) => d.registeredBy === p._id || attributions.some((a) => a.partnerId === p._id && a.dealId === d._id)
      );
      const wonDeals = partnerDeals.filter((d) => d.status === "won");
      const openDeals = partnerDeals.filter((d) => d.status === "open");
      const totalDeals = partnerDeals.length;
      const winRate = totalDeals > 0 ? Math.round((wonDeals.length / totalDeals) * 100) : 0;
      const revenue = wonDeals.reduce((s, d) => s + d.amount, 0);
      const avgDealSize = wonDeals.length > 0 ? Math.round(revenue / wonDeals.length) : 0;
      const pipelineValue = openDeals.reduce((s, d) => s + d.amount, 0);
      const partnerPayouts = payouts.filter((py) => py.partnerId === p._id);
      const totalPaid = partnerPayouts.reduce((s, py) => s + py.amount, 0);

      return {
        id: p._id,
        name: p.name,
        tier: p.tier || "bronze",
        type: p.type,
        commissionRate: p.commissionRate,
        revenue,
        deals: totalDeals,
        wonDeals: wonDeals.length,
        winRate,
        avgDealSize,
        pipelineValue,
        totalPaid,
      };
    });

    // Program averages
    const activePartners = benchmarks.filter((b) => b.deals > 0);
    const avgRevenue = activePartners.length > 0 ? Math.round(activePartners.reduce((s, b) => s + b.revenue, 0) / activePartners.length) : 0;
    const avgWinRate = activePartners.length > 0 ? Math.round(activePartners.reduce((s, b) => s + b.winRate, 0) / activePartners.length) : 0;
    const avgDealSize = activePartners.length > 0 ? Math.round(activePartners.reduce((s, b) => s + b.avgDealSize, 0) / activePartners.length) : 0;
    const avgDeals = activePartners.length > 0 ? Math.round(activePartners.reduce((s, b) => s + b.deals, 0) / activePartners.length) : 0;

    // Tier distribution
    const tierDist: Record<string, number> = {};
    for (const p of partners) {
      const t = p.tier || "bronze";
      tierDist[t] = (tierDist[t] || 0) + 1;
    }

    return {
      benchmarks: benchmarks.sort((a, b) => b.revenue - a.revenue),
      averages: { revenue: avgRevenue, winRate: avgWinRate, avgDealSize, deals: avgDeals },
      tierDistribution: tierDist,
      totalPartners: partners.length,
    };
  },
});
