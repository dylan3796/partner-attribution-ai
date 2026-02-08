/**
 * Audit log queries
 */

import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * List audit entries for an organization.
 * Supports filtering by entityType and date range.
 * Returns most recent first, paginated.
 */
export const listByOrg = query({
  args: {
    organizationId: v.id("organizations"),
    entityType: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let entries = await ctx.db
      .query("audit_log")
      .withIndex("by_org_and_date", (q) => {
        let query = q.eq("organizationId", args.organizationId);
        if (args.startDate !== undefined) {
          query = query.gte("createdAt", args.startDate);
        }
        if (args.endDate !== undefined) {
          query = query.lte("createdAt", args.endDate);
        }
        return query;
      })
      .order("desc")
      .collect();

    // Filter by entityType in memory if provided
    if (args.entityType) {
      entries = entries.filter((e) => e.entityType === args.entityType);
    }

    return entries.slice(0, limit);
  },
});

/**
 * List all audit entries for a specific entity (e.g. a specific partner or deal).
 */
export const listByEntity = query({
  args: {
    entityType: v.string(),
    entityId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const entries = await ctx.db
      .query("audit_log")
      .withIndex("by_entity", (q) =>
        q.eq("entityType", args.entityType).eq("entityId", args.entityId)
      )
      .order("desc")
      .take(limit);

    return entries;
  },
});

/**
 * List all audit entries by a specific user.
 */
export const listByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const entries = await ctx.db
      .query("audit_log")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return entries;
  },
});
