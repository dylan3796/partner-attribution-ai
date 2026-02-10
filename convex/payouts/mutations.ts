import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

/**
 * Create a new payout
 * Status: pending_approval by default
 */
export const create = mutation({
  args: {
    partnerId: v.id("partners"),
    amount: v.number(),
    period: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const partner = await ctx.db.get(args.partnerId);
    if (!partner) throw new Error("Partner not found");

    const payoutId = await ctx.db.insert("payouts", {
      organizationId: partner.organizationId,
      partnerId: args.partnerId,
      amount: args.amount,
      status: "pending_approval",
      period: args.period,
      notes: args.notes,
      createdAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: partner.organizationId,
      action: "payout.created",
      entityType: "payout",
      entityId: payoutId,
      metadata: JSON.stringify({
        partnerId: args.partnerId,
        amount: args.amount,
        period: args.period || "—",
      }),
      createdAt: Date.now(),
    });

    return payoutId;
  },
});

/**
 * Approve a payout
 * Must be in pending_approval status
 */
export const approve = mutation({
  args: {
    payoutId: v.id("payouts"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.payoutId);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "pending_approval") {
      throw new Error(`Cannot approve payout with status: ${payout.status}`);
    }

    const now = Date.now();
    await ctx.db.patch(args.payoutId, {
      status: "approved",
      approvedBy: args.userId,
      approvedAt: now,
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: payout.organizationId,
      userId: args.userId,
      action: "payout.approved",
      entityType: "payout",
      entityId: args.payoutId,
      metadata: JSON.stringify({
        amount: payout.amount,
        partnerId: payout.partnerId,
      }),
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Reject a payout
 * Must be in pending_approval status
 */
export const reject = mutation({
  args: {
    payoutId: v.id("payouts"),
    userId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.payoutId);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "pending_approval") {
      throw new Error(`Cannot reject payout with status: ${payout.status}`);
    }

    const now = Date.now();
    await ctx.db.patch(args.payoutId, {
      status: "rejected",
      approvedBy: args.userId,
      approvedAt: now,
      notes: args.notes || payout.notes,
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: payout.organizationId,
      userId: args.userId,
      action: "payout.rejected",
      entityType: "payout",
      entityId: args.payoutId,
      metadata: JSON.stringify({
        amount: payout.amount,
        partnerId: payout.partnerId,
        reason: args.notes || "No reason provided",
      }),
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Mark payout as paid
 * Must be in approved status
 */
export const markPaid = mutation({
  args: {
    payoutId: v.id("payouts"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.payoutId);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "approved") {
      throw new Error(`Cannot mark payout as paid with status: ${payout.status}`);
    }

    const now = Date.now();
    await ctx.db.patch(args.payoutId, {
      status: "paid",
      paidAt: now,
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: payout.organizationId,
      userId: args.userId,
      action: "payout.paid",
      entityType: "payout",
      entityId: args.payoutId,
      metadata: JSON.stringify({
        amount: payout.amount,
        partnerId: payout.partnerId,
      }),
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Mark payout as processing (optional intermediate state)
 */
export const markProcessing = mutation({
  args: {
    payoutId: v.id("payouts"),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.payoutId);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "approved") {
      throw new Error(`Cannot mark payout as processing with status: ${payout.status}`);
    }

    await ctx.db.patch(args.payoutId, {
      status: "processing",
    });

    return { success: true };
  },
});

/**
 * Mark payout as failed (from processing)
 */
export const markFailed = mutation({
  args: {
    payoutId: v.id("payouts"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.payoutId);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "processing") {
      throw new Error(`Cannot mark payout as failed with status: ${payout.status}`);
    }

    await ctx.db.patch(args.payoutId, {
      status: "failed",
      notes: args.notes || payout.notes,
    });

    return { success: true };
  },
});

/**
 * Update payout details (before approval only)
 */
export const update = mutation({
  args: {
    payoutId: v.id("payouts"),
    amount: v.optional(v.number()),
    period: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.payoutId);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "pending_approval") {
      throw new Error("Can only update payouts in pending_approval status");
    }

    const updates: Partial<Doc<"payouts">> = {};
    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.period !== undefined) updates.period = args.period;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.payoutId, updates);

    return { success: true };
  },
});

/**
 * Delete a payout (pending only)
 */
export const deletePayout = mutation({
  args: {
    payoutId: v.id("payouts"),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.payoutId);
    if (!payout) throw new Error("Payout not found");
    if (payout.status !== "pending_approval") {
      throw new Error("Can only delete payouts in pending_approval status");
    }

    await ctx.db.delete(args.payoutId);

    return { success: true };
  },
});

/**
 * Bulk approve payouts
 */
export const bulkApprove = mutation({
  args: {
    payoutIds: v.array(v.id("payouts")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let approved = 0;
    let skipped = 0;

    for (const payoutId of args.payoutIds) {
      const payout = await ctx.db.get(payoutId);
      if (!payout || payout.status !== "pending_approval") {
        skipped++;
        continue;
      }

      await ctx.db.patch(payoutId, {
        status: "approved",
        approvedBy: args.userId,
        approvedAt: now,
      });

      // Audit log
      await ctx.db.insert("audit_log", {
        organizationId: payout.organizationId,
        userId: args.userId,
        action: "payout.approved",
        entityType: "payout",
        entityId: payoutId,
        metadata: JSON.stringify({
          amount: payout.amount,
          partnerId: payout.partnerId,
          bulk: true,
        }),
        createdAt: now,
      });

      approved++;
    }

    return { approved, skipped };
  },
});

/**
 * Calculate pending commission total for a partner
 * (helper for auto-generating payouts)
 */
export const calculatePendingCommissions = mutation({
  args: {
    partnerId: v.id("partners"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const partner = await ctx.db.get(args.partnerId);
    if (!partner) throw new Error("Partner not found");

    // Get all won deals for this partner in the period
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .collect();

    let total = 0;
    for (const attr of attributions) {
      // Check date range if provided
      if (args.startDate && attr.calculatedAt < args.startDate) continue;
      if (args.endDate && attr.calculatedAt > args.endDate) continue;

      // Verify deal is won
      const deal = await ctx.db.get(attr.dealId);
      if (deal?.status === "won") {
        total += attr.commissionAmount;
      }
    }

    return {
      partnerId: args.partnerId,
      partnerName: partner.name,
      totalCommission: total,
      attributionCount: attributions.length,
    };
  },
});
