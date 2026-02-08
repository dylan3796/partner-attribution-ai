/**
 * Approval workflow queries
 */

import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * List all pending approvals for an organization.
 */
export const listPending = query({
  args: {
    organizationId: v.id("organizations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const approvals = await ctx.db
      .query("approval_workflows")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", args.organizationId).eq("status", "pending")
      )
      .order("desc")
      .take(limit);

    // Enrich with requester info
    const enriched = await Promise.all(
      approvals.map(async (approval) => {
        const requester = await ctx.db.get(approval.requestedBy);
        return {
          ...approval,
          requesterName: requester?.name ?? "Unknown",
          requesterEmail: requester?.email ?? "Unknown",
        };
      })
    );

    return enriched;
  },
});

/**
 * Get approval status for a specific entity.
 * Returns the most recent approval workflow entry.
 */
export const getByEntity = query({
  args: {
    organizationId: v.id("organizations"),
    entityType: v.union(
      v.literal("payout"),
      v.literal("attribution"),
      v.literal("partner_tier_change")
    ),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    // Query all approvals for this org and find matching entity
    const approvals = await ctx.db
      .query("approval_workflows")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .collect();

    const matching = approvals.find(
      (a) => a.entityType === args.entityType && a.entityId === args.entityId
    );

    if (!matching) {
      return null;
    }

    // Enrich with user info
    const requester = await ctx.db.get(matching.requestedBy);
    const reviewer = matching.reviewedBy
      ? await ctx.db.get(matching.reviewedBy)
      : null;

    return {
      ...matching,
      requesterName: requester?.name ?? "Unknown",
      requesterEmail: requester?.email ?? "Unknown",
      reviewerName: reviewer?.name ?? undefined,
      reviewerEmail: reviewer?.email ?? undefined,
    };
  },
});
