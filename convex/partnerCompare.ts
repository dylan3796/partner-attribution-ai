import { query } from "./_generated/server";
import { v } from "convex/values";
import { getOrgId } from "./lib/getOrg";

/**
 * Get detailed comparison data for 2-4 partners.
 * Returns per-partner metrics: revenue, deals, win rate, touchpoints,
 * commission earned, health indicators, and monthly trends.
 */
export const getComparison = query({
  args: { partnerIds: v.array(v.id("partners")) },
  handler: async (ctx, { partnerIds }) => {
    const orgId = await getOrgId(ctx);
    if (!orgId || partnerIds.length === 0) return [];

    const now = Date.now();
    const MS_30D = 30 * 24 * 60 * 60 * 1000;
    const MS_90D = 90 * 24 * 60 * 60 * 1000;

    // Fetch all org data once
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const allTouchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const allPayouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const results = [];

    for (const pid of partnerIds) {
      const partner = await ctx.db.get(pid);
      if (!partner || partner.organizationId !== orgId) continue;

      // Deals
      const deals = allDeals.filter((d) => d.registeredBy === pid);
      const wonDeals = deals.filter((d) => d.status === "won");
      const totalRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
      const totalPipeline = deals
        .filter((d) => d.status !== "won" && d.status !== "lost")
        .reduce((s, d) => s + d.amount, 0);
      const winRate = deals.length > 0
        ? Math.round((wonDeals.length / deals.length) * 100)
        : 0;
      const avgDealSize = wonDeals.length > 0
        ? Math.round(totalRevenue / wonDeals.length)
        : 0;

      // Recent activity (90d)
      const dealsLast90 = deals.filter((d) => d.createdAt > now - MS_90D).length;
      const dealsLast30 = deals.filter((d) => d.createdAt > now - MS_30D).length;

      // Touchpoints
      const touchpoints = allTouchpoints.filter((t) => t.partnerId === pid);
      const touchpointsLast90 = touchpoints.filter((t) => t.createdAt > now - MS_90D).length;
      const lastActivity = Math.max(
        ...touchpoints.map((t) => t.createdAt),
        ...deals.map((d) => d.createdAt),
        0
      );

      // Touchpoint type breakdown
      const tpTypes: Record<string, number> = {};
      for (const tp of touchpoints) {
        tpTypes[tp.type] = (tpTypes[tp.type] || 0) + 1;
      }

      // Payouts
      const payouts = allPayouts.filter((p) => p.partnerId === pid);
      const totalEarned = payouts
        .filter((p) => p.status === "paid")
        .reduce((s, p) => s + p.amount, 0);
      const pendingPayout = payouts
        .filter((p) => p.status === "pending_approval" || p.status === "approved")
        .reduce((s, p) => s + p.amount, 0);

      // Monthly revenue (last 6 months)
      const monthlyRevenue: { month: string; revenue: number; deals: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
        const monthDeals = wonDeals.filter(
          (deal) => deal.createdAt >= monthStart && deal.createdAt < monthEnd
        );
        monthlyRevenue.push({
          month: d.toLocaleDateString("en-US", { month: "short" }),
          revenue: monthDeals.reduce((s, deal) => s + deal.amount, 0),
          deals: monthDeals.length,
        });
      }

      results.push({
        _id: partner._id,
        name: partner.name,
        email: partner.email,
        type: partner.type,
        tier: partner.tier ?? "bronze",
        status: partner.status,
        commissionRate: partner.commissionRate,
        territory: partner.territory ?? "",
        tags: (partner as any).tags ?? [],
        contactName: partner.contactName ?? "",
        // Metrics
        totalRevenue,
        totalPipeline,
        totalDeals: deals.length,
        wonDeals: wonDeals.length,
        winRate,
        avgDealSize,
        dealsLast30,
        dealsLast90,
        totalTouchpoints: touchpoints.length,
        touchpointsLast90,
        touchpointTypes: tpTypes,
        totalEarned,
        pendingPayout,
        lastActivity: lastActivity || 0,
        monthlyRevenue,
      });
    }

    return results;
  },
});
