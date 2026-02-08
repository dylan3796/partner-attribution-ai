/**
 * Approval workflow mutations
 */

import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Create a new approval request.
 */
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    entityType: v.union(
      v.literal("payout"),
      v.literal("attribution"),
      v.literal("partner_tier_change")
    ),
    entityId: v.string(),
    requestedBy: v.id("users"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify the requesting user exists and belongs to the org
    const user = await ctx.db.get(args.requestedBy);
    if (!user) {
      throw new Error("Requesting user not found");
    }
    if (user.organizationId !== args.organizationId) {
      throw new Error("User does not belong to this organization");
    }

    // Check for existing pending approval on this entity
    const existing = await ctx.db
      .query("approval_workflows")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", args.organizationId).eq("status", "pending")
      )
      .collect();

    const duplicate = existing.find(
      (a) => a.entityType === args.entityType && a.entityId === args.entityId
    );

    if (duplicate) {
      throw new Error(
        `A pending approval already exists for this ${args.entityType}`
      );
    }

    const approvalId = await ctx.db.insert("approval_workflows", {
      organizationId: args.organizationId,
      entityType: args.entityType,
      entityId: args.entityId,
      status: "pending",
      requestedBy: args.requestedBy,
      notes: args.notes,
      createdAt: Date.now(),
    });

    // Log audit entry
    await ctx.db.insert("audit_log", {
      organizationId: args.organizationId,
      userId: args.requestedBy,
      action: `${args.entityType}.approval_requested`,
      entityType: args.entityType,
      entityId: args.entityId,
      metadata: JSON.stringify({ approvalId }),
      createdAt: Date.now(),
    });

    return approvalId;
  },
});

/**
 * Approve a pending approval request.
 * Must be an admin or manager, and cannot be the requester.
 */
export const approve = mutation({
  args: {
    approvalId: v.id("approval_workflows"),
    reviewerId: v.id("users"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const approval = await ctx.db.get(args.approvalId);
    if (!approval) {
      throw new Error("Approval request not found");
    }

    if (approval.status !== "pending") {
      throw new Error(`Approval is already ${approval.status}`);
    }

    // Verify reviewer exists and has permission
    const reviewer = await ctx.db.get(args.reviewerId);
    if (!reviewer) {
      throw new Error("Reviewer not found");
    }

    if (reviewer.organizationId !== approval.organizationId) {
      throw new Error("Reviewer does not belong to this organization");
    }

    if (reviewer.role !== "admin" && reviewer.role !== "manager") {
      throw new Error("Only admins and managers can approve requests");
    }

    // Cannot approve your own request
    if (args.reviewerId === approval.requestedBy) {
      throw new Error("Cannot approve your own request");
    }

    const now = Date.now();

    // Update approval
    await ctx.db.patch(args.approvalId, {
      status: "approved",
      reviewedBy: args.reviewerId,
      reviewedAt: now,
      notes: args.notes ?? approval.notes,
    });

    // If this is a payout approval, update the payout's approval status
    if (approval.entityType === "payout") {
      // Try to find and update the payout
      const payouts = await ctx.db
        .query("payouts")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", approval.organizationId)
        )
        .collect();

      const payout = payouts.find(
        (p) => p._id.toString() === approval.entityId
      );

      if (payout) {
        await ctx.db.patch(payout._id, {
          approvalStatus: "approved",
          approvedBy: args.reviewerId,
          approvedAt: now,
        });
      }
    }

    // Log audit entry
    await ctx.db.insert("audit_log", {
      organizationId: approval.organizationId,
      userId: args.reviewerId,
      action: `${approval.entityType}.approved`,
      entityType: approval.entityType,
      entityId: approval.entityId,
      metadata: JSON.stringify({
        approvalId: args.approvalId,
        notes: args.notes,
      }),
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Reject a pending approval request.
 * Must be an admin or manager, and cannot be the requester.
 */
export const reject = mutation({
  args: {
    approvalId: v.id("approval_workflows"),
    reviewerId: v.id("users"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const approval = await ctx.db.get(args.approvalId);
    if (!approval) {
      throw new Error("Approval request not found");
    }

    if (approval.status !== "pending") {
      throw new Error(`Approval is already ${approval.status}`);
    }

    // Verify reviewer exists and has permission
    const reviewer = await ctx.db.get(args.reviewerId);
    if (!reviewer) {
      throw new Error("Reviewer not found");
    }

    if (reviewer.organizationId !== approval.organizationId) {
      throw new Error("Reviewer does not belong to this organization");
    }

    if (reviewer.role !== "admin" && reviewer.role !== "manager") {
      throw new Error("Only admins and managers can reject requests");
    }

    const now = Date.now();

    // Update approval
    await ctx.db.patch(args.approvalId, {
      status: "rejected",
      reviewedBy: args.reviewerId,
      reviewedAt: now,
      notes: args.notes ?? approval.notes,
    });

    // If this is a payout approval, update the payout's approval status
    if (approval.entityType === "payout") {
      const payouts = await ctx.db
        .query("payouts")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", approval.organizationId)
        )
        .collect();

      const payout = payouts.find(
        (p) => p._id.toString() === approval.entityId
      );

      if (payout) {
        await ctx.db.patch(payout._id, {
          approvalStatus: "rejected",
        });
      }
    }

    // Log audit entry
    await ctx.db.insert("audit_log", {
      organizationId: approval.organizationId,
      userId: args.reviewerId,
      action: `${approval.entityType}.rejected`,
      entityType: approval.entityType,
      entityId: approval.entityId,
      metadata: JSON.stringify({
        approvalId: args.approvalId,
        notes: args.notes,
      }),
      createdAt: now,
    });

    return { success: true };
  },
});
