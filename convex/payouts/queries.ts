import { v } from "convex/values";
import { query } from "../_generated/server";

/**
 * Get all payouts for an organization
 */
export const list = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(
      v.union(
        v.literal("pending_approval"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("processing"),
        v.literal("paid"),
        v.literal("failed")
      )
    ),
    partnerId: v.optional(v.id("partners")),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId));

    let payouts = await query.collect();

    // Filter by status if provided
    if (args.status) {
      payouts = payouts.filter((p) => p.status === args.status);
    }

    // Filter by partner if provided
    if (args.partnerId) {
      payouts = payouts.filter((p) => p.partnerId === args.partnerId);
    }

    return payouts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get a single payout by ID
 */
export const get = query({
  args: {
    payoutId: v.id("payouts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.payoutId);
  },
});

/**
 * Get payouts for a specific partner
 */
export const listByPartner = query({
  args: {
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payouts")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .order("desc")
      .collect();
  },
});

/**
 * Get pending payouts (for approval workflows)
 */
export const listPending = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payouts")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", args.organizationId).eq("status", "pending_approval")
      )
      .order("desc")
      .collect();
  },
});

/**
 * Get payout statistics for an organization
 */
export const stats = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const allPayouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    const pending = allPayouts.filter((p) => p.status === "pending_approval");
    const approved = allPayouts.filter((p) => p.status === "approved");
    const paid = allPayouts.filter((p) => p.status === "paid");
    const rejected = allPayouts.filter((p) => p.status === "rejected");
    const processing = allPayouts.filter((p) => p.status === "processing");
    const failed = allPayouts.filter((p) => p.status === "failed");

    return {
      total: {
        count: allPayouts.length,
        amount: allPayouts.reduce((sum, p) => sum + p.amount, 0),
      },
      pending: {
        count: pending.length,
        amount: pending.reduce((sum, p) => sum + p.amount, 0),
      },
      approved: {
        count: approved.length,
        amount: approved.reduce((sum, p) => sum + p.amount, 0),
      },
      paid: {
        count: paid.length,
        amount: paid.reduce((sum, p) => sum + p.amount, 0),
      },
      rejected: {
        count: rejected.length,
        amount: rejected.reduce((sum, p) => sum + p.amount, 0),
      },
      processing: {
        count: processing.length,
        amount: processing.reduce((sum, p) => sum + p.amount, 0),
      },
      failed: {
        count: failed.length,
        amount: failed.reduce((sum, p) => sum + p.amount, 0),
      },
    };
  },
});

/**
 * Get payout history with partner details
 */
export const listWithPartners = query({
  args: {
    organizationId: v.id("organizations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let payouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect();

    if (args.limit) {
      payouts = payouts.slice(0, args.limit);
    }

    // Enrich with partner data
    const enriched = await Promise.all(
      payouts.map(async (payout) => {
        const partner = await ctx.db.get(payout.partnerId);
        return {
          ...payout,
          partner: partner
            ? {
                _id: partner._id,
                name: partner.name,
                email: partner.email,
                type: partner.type,
                commissionRate: partner.commissionRate,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get partner payout summary (lifetime earnings)
 */
export const partnerSummary = query({
  args: {
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .collect();

    const paid = payouts.filter((p) => p.status === "paid");
    const pending = payouts.filter((p) => p.status === "pending_approval");
    const approved = payouts.filter((p) => p.status === "approved");

    return {
      totalEarned: paid.reduce((sum, p) => sum + p.amount, 0),
      totalPending: pending.reduce((sum, p) => sum + p.amount, 0),
      totalApproved: approved.reduce((sum, p) => sum + p.amount, 0),
      payoutCount: paid.length,
      lastPayoutDate: paid.length > 0 ? Math.max(...paid.map((p) => p.paidAt || 0)) : null,
    };
  },
});

/**
 * Get payouts by period
 */
export const listByPeriod = query({
  args: {
    organizationId: v.id("organizations"),
    period: v.string(),
  },
  handler: async (ctx, args) => {
    const allPayouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    return allPayouts
      .filter((p) => p.period === args.period)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});
