import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

async function defaultOrg(ctx: any) {
  return await ctx.db.query("organizations").first();
}

// ── Queries ────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];

    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();

    // Enrich with partner data
    return await Promise.all(
      payouts.map(async (payout) => {
        const partner = await ctx.db.get(payout.partnerId);
        return { ...payout, partner: partner ?? undefined };
      })
    );
  },
});

// ── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    partnerId: v.id("partners"),
    amount: v.number(),
    period: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found. Run seed data first.");
    return await ctx.db.insert("payouts", {
      organizationId: org._id,
      partnerId: args.partnerId,
      amount: args.amount,
      status: "pending_approval",
      period: args.period,
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});

export const approve = mutation({
  args: { id: v.id("payouts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "approved",
      approvedAt: Date.now(),
    });
    return { success: true };
  },
});

export const reject = mutation({
  args: {
    id: v.id("payouts"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "rejected",
      notes: args.notes,
    });
    return { success: true };
  },
});

export const markPaid = mutation({
  args: { id: v.id("payouts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "paid",
      paidAt: Date.now(),
      paidVia: "manual",
    });
    return { success: true };
  },
});

// ── Stripe Connect Mutations ────────────────────────────────────────────────

/**
 * Mark payout as processing (before Stripe transfer)
 */
export const markProcessing = mutation({
  args: { id: v.id("payouts") },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.id);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "approved") {
      throw new Error("Payout must be approved before processing");
    }
    await ctx.db.patch(args.id, {
      status: "processing",
    });
    return { success: true };
  },
});

/**
 * Mark payout as paid via Stripe (called after successful transfer)
 */
export const markPaidViaStripe = mutation({
  args: {
    id: v.id("payouts"),
    stripeTransferId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "paid",
      paidAt: Date.now(),
      paidVia: "stripe",
      stripeTransferId: args.stripeTransferId,
    });
    return { success: true };
  },
});

/**
 * Mark payout as failed (Stripe transfer failed)
 */
export const markFailed = mutation({
  args: {
    id: v.id("payouts"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
      stripeError: args.error,
    });
    return { success: true };
  },
});

/**
 * Update partner's Stripe Connect account info
 */
export const updatePartnerStripeAccount = mutation({
  args: {
    partnerId: v.id("partners"),
    stripeAccountId: v.string(),
    stripeOnboardingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.partnerId, {
      stripeAccountId: args.stripeAccountId,
      stripeOnboardingUrl: args.stripeOnboardingUrl,
      stripeOnboarded: false,
    });
    return { success: true };
  },
});

/**
 * Update partner's Stripe onboarding status
 */
export const updatePartnerStripeOnboarded = mutation({
  args: {
    partnerId: v.id("partners"),
    stripeOnboarded: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.partnerId, {
      stripeOnboarded: args.stripeOnboarded,
      // Clear the onboarding URL once completed
      ...(args.stripeOnboarded ? { stripeOnboardingUrl: undefined } : {}),
    });
    return { success: true };
  },
});

/**
 * Get partner by Stripe account ID (for webhook handling)
 */
export const getPartnerByStripeAccount = query({
  args: { stripeAccountId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("partners")
      .withIndex("by_stripe_account", (q) => q.eq("stripeAccountId", args.stripeAccountId))
      .first();
  },
});

/**
 * Get payout by Stripe transfer ID (for webhook handling)
 */
export const getPayoutByStripeTransfer = query({
  args: { stripeTransferId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payouts")
      .withIndex("by_stripe_transfer", (q) => q.eq("stripeTransferId", args.stripeTransferId))
      .first();
  },
});
