import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
    });
    return { success: true };
  },
});
