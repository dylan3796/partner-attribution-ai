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

    // Check if another user with the same email domain already has an org
    // (team members joining an existing org)
    const domain = args.email.split("@")[1] ?? "";
    const existingUsers = await ctx.db.query("users").collect();
    const sameOrgUser = existingUsers.find(
      (u) => u.email.endsWith("@" + domain) && domain !== "gmail.com" && domain !== "outlook.com" && domain !== "hotmail.com" && domain !== "yahoo.com"
    );

    let orgId;
    if (sameOrgUser) {
      // Join existing org (same company domain)
      orgId = sameOrgUser.organizationId;
    } else {
      // Create a new org for this user — true multi-tenancy
      const displayName = args.name ?? args.email.split("@")[0];
      orgId = await ctx.db.insert("organizations", {
        name: `${displayName}'s Program`,
        email: args.email,
        apiKey: `cpk_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
        plan: "starter",
        createdAt: Date.now(),
      });
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name ?? args.email,
      organizationId: orgId,
      role: sameOrgUser ? "member" : "admin",
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
