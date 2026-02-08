/**
 * Audit log mutations
 */

import { mutation, internalMutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Log an audit entry.
 * 
 * This is an internal mutation designed to be called from other mutations.
 * For external use (e.g. from the client), use the public `log` mutation below.
 */
export const logInternal = internalMutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.optional(v.id("users")),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    changes: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auditId = await ctx.db.insert("audit_log", {
      organizationId: args.organizationId,
      userId: args.userId,
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId,
      changes: args.changes,
      metadata: args.metadata,
      createdAt: Date.now(),
    });

    return auditId;
  },
});

/**
 * Public mutation to log an audit entry.
 * Can be called from the client or via `npx convex run`.
 */
export const log = mutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.optional(v.id("users")),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    changes: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auditId = await ctx.db.insert("audit_log", {
      organizationId: args.organizationId,
      userId: args.userId,
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId,
      changes: args.changes,
      metadata: args.metadata,
      createdAt: Date.now(),
    });

    return auditId;
  },
});
