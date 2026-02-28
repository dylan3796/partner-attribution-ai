import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Get subscription for the current user by userId */
export const getSubscriptionByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

/** Get subscription by Stripe customer ID (used in webhooks) */
export const getSubscriptionByCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", stripeCustomerId)
      )
      .unique();
  },
});

/** Get subscription by Stripe subscription ID */
export const getSubscriptionByStripeId = query({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, { stripeSubscriptionId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", stripeSubscriptionId)
      )
      .unique();
  },
});

/** Upsert subscription (called from billing webhook) */
export const upsertSubscription = mutation({
  args: {
    userId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    plan: v.union(v.literal("starter"), v.literal("growth")),
    interval: v.union(v.literal("month"), v.literal("year")),
    status: v.union(
      v.literal("active"),
      v.literal("trialing"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("incomplete")
    ),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        stripePriceId: args.stripePriceId,
        plan: args.plan,
        interval: args.interval,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("subscriptions", args);
    }
  },
});

/** Store Stripe customer ID on first checkout */
export const createSubscriptionRecord = mutation({
  args: {
    userId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    plan: v.union(v.literal("starter"), v.literal("growth")),
    interval: v.union(v.literal("month"), v.literal("year")),
    status: v.union(
      v.literal("active"),
      v.literal("trialing"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("incomplete")
    ),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subscriptions", {
      ...args,
      cancelAtPeriodEnd: false,
    });
  },
});
