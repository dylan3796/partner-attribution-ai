import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Provision a user record from Clerk identity.
 * Called on dashboard mount — idempotent (skips if user exists).
 */
export const provision = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      // Update last login
      await ctx.db.patch(existing._id, { lastLoginAt: Date.now() });
      return existing._id;
    }

    // Get or create org — for now, assign to first org (single-tenant beta)
    // TODO: Multi-org support — create new org per signup
    const org = await ctx.db.query("organizations").first();
    if (!org) {
      // No org exists yet — create a default one
      const orgId = await ctx.db.insert("organizations", {
        name: args.name ? `${args.name}'s Program` : "My Partner Program",
        email: args.email,
        apiKey: `cpk_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
        plan: "starter",
        createdAt: Date.now(),
      });

      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name ?? args.email,
        organizationId: orgId,
        role: "admin",
        createdAt: Date.now(),
      });
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name ?? args.email,
      organizationId: org._id,
      role: "admin",
      createdAt: Date.now(),
    });
  },
});

/**
 * Get the current user by Clerk ID.
 */
export const getByClerKId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});
