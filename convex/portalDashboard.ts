import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Portal Dashboard queries — partner-scoped, real Convex data.
 * Replaces demo-data helpers (getPartnerStats, getPartnerDeals, getPartnerTouchpoints).
 */

export const getStats = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    const partner = await ctx.db.get(partnerId);
    if (!partner) return null;

    // Fetch partner's payouts
    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect();

    // Fetch partner's touchpoints to find associated deals
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect();

    const dealIds = [...new Set(touchpoints.map((tp) => tp.dealId))];

    // Also include deals registered by this partner
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", partner.organizationId))
      .collect();

    const registeredDealIds = allDeals
      .filter((d) => d.registeredBy === partnerId)
      .map((d) => d._id);

    const relevantDealIdSet = new Set([...dealIds, ...registeredDealIds]);
    const deals = allDeals.filter((d) => relevantDealIdSet.has(d._id));

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 86400000;
    const ninetyDaysAgo = now - 90 * 86400000;

    const paid = payouts.filter((p) => p.status === "paid");
    const pending = payouts.filter(
      (p) => p.status === "pending_approval" || p.status === "approved" || p.status === "processing"
    );

    const totalEarned = paid.reduce((s, p) => s + p.amount, 0);
    const pendingAmount = pending.reduce((s, p) => s + p.amount, 0);
    const paidThisMonth = paid
      .filter((p) => p.paidAt && p.paidAt >= thirtyDaysAgo)
      .reduce((s, p) => s + p.amount, 0);
    const paidThisQuarter = paid
      .filter((p) => p.paidAt && p.paidAt >= ninetyDaysAgo)
      .reduce((s, p) => s + p.amount, 0);

    const openDeals = deals.filter((d) => d.status === "open");
    const wonDeals = deals.filter((d) => d.status === "won");

    return {
      totalEarned,
      pending: pendingAmount,
      paidThisMonth,
      paidThisQuarter,
      dealsInPipeline: openDeals.length,
      activeDeals: openDeals.length + wonDeals.length,
      totalDeals: deals.length,
      wonDeals: wonDeals.length,
      totalRevenue: wonDeals.reduce((s, d) => s + d.amount, 0),
    };
  },
});

export const getDeals = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    const partner = await ctx.db.get(partnerId);
    if (!partner) return [];

    // Get deals via touchpoints
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect();
    const touchpointDealIds = new Set(touchpoints.map((tp) => tp.dealId));

    // Get deals registered by this partner
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", partner.organizationId))
      .collect();

    return allDeals
      .filter((d) => touchpointDealIds.has(d._id) || d.registeredBy === partnerId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getRecentTouchpoints = query({
  args: { partnerId: v.id("partners"), limit: v.optional(v.number()) },
  handler: async (ctx, { partnerId, limit }) => {
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect();

    // Sort by most recent and limit
    const sorted = touchpoints.sort((a, b) => b.createdAt - a.createdAt);
    const limited = sorted.slice(0, limit ?? 10);

    // Enrich with deal names
    const enriched = await Promise.all(
      limited.map(async (tp) => {
        const deal = await ctx.db.get(tp.dealId);
        return {
          ...tp,
          dealName: deal?.name ?? "Unknown Deal",
          dealAmount: deal?.amount ?? 0,
          dealStatus: deal?.status ?? "open",
        };
      })
    );

    return enriched;
  },
});

export const getPayouts = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect();

    return payouts.sort((a, b) => b.createdAt - a.createdAt);
  },
});
