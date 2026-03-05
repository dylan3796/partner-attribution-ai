import { query } from "./_generated/server";
import { getOrgId } from "./lib/getOrg";

/**
 * Partner Leaderboard — ranks partners by revenue, deals, win rate, and engagement.
 * Composite score determines overall rank. Supports time period filtering.
 */
export const getRankings = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return { partners: [], periods: { thirtyDay: [], ninetyDay: [], allTime: [] } };

    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    if (partners.length === 0) return { partners: [], periods: { thirtyDay: [], ninetyDay: [], allTime: [] } };

    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const now = Date.now();
    const MS_30D = 30 * 24 * 60 * 60 * 1000;
    const MS_90D = 90 * 24 * 60 * 60 * 1000;

    function computeForPeriod(sinceTs: number) {
      const activePartners = partners.filter((p) => p.status === "active" || p.status === "pending");

      const ranked = activePartners.map((partner) => {
        const pid = partner._id;

        // Deals in period
        const partnerDeals = deals.filter(
          (d) => d.registeredBy === pid && d.createdAt > sinceTs
        );
        const wonDeals = partnerDeals.filter((d) => d.status === "won");
        const revenue = wonDeals.reduce((s, d) => s + d.amount, 0);
        const totalDeals = partnerDeals.length;
        const winRate = totalDeals > 0 ? wonDeals.length / totalDeals : 0;

        // Touchpoints in period
        const tpCount = touchpoints.filter(
          (t) => t.partnerId === pid && t.createdAt > sinceTs
        ).length;

        // Commissions earned in period
        const partnerPayouts = payouts.filter(
          (p) => p.partnerId === pid && p.createdAt > sinceTs
        );
        const commissionsEarned = partnerPayouts
          .filter((p) => p.status === "paid")
          .reduce((s, p) => s + p.amount, 0);
        const commissionsPending = partnerPayouts
          .filter((p) => p.status !== "paid" && p.status !== "rejected")
          .reduce((s, p) => s + p.amount, 0);

        // Composite score (0-100): revenue 35%, deals 25%, win rate 20%, engagement 20%
        const maxRevenue = 100000; // scale for scoring
        const revenueScore = Math.min(revenue / maxRevenue, 1) * 100;
        const dealScore = Math.min(totalDeals / 10, 1) * 100;
        const winRateScore = winRate * 100;
        const engagementScore = Math.min(tpCount / 8, 1) * 100;

        const composite = Math.round(
          revenueScore * 0.35 +
          dealScore * 0.25 +
          winRateScore * 0.2 +
          engagementScore * 0.2
        );

        return {
          id: pid,
          name: partner.name,
          tier: partner.tier ?? "bronze",
          type: partner.type ?? "reseller",
          email: partner.email,
          revenue,
          totalDeals,
          wonDeals: wonDeals.length,
          winRate: Math.round(winRate * 100),
          touchpoints: tpCount,
          commissionsEarned,
          commissionsPending,
          composite,
        };
      });

      // Sort by composite, then revenue as tiebreaker
      ranked.sort((a, b) => b.composite - a.composite || b.revenue - a.revenue);

      // Assign ranks (handle ties)
      let rank = 1;
      return ranked.map((p, i) => {
        if (i > 0 && p.composite < ranked[i - 1].composite) {
          rank = i + 1;
        }
        return { ...p, rank };
      });
    }

    return {
      partners: partners.filter((p) => p.status === "active" || p.status === "pending").length,
      periods: {
        thirtyDay: computeForPeriod(now - MS_30D),
        ninetyDay: computeForPeriod(now - MS_90D),
        allTime: computeForPeriod(0),
      },
    };
  },
});
