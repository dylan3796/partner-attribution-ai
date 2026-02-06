/**
 * Organization mutations
 */

import { mutation } from "../_generated/server"
import { v } from "convex/values"
import { generateApiKey } from "../lib/helpers"
import { validateEmail, validateNotEmpty } from "../lib/validation"

/**
 * Create a new organization
 * This is typically called during signup
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    plan: v.optional(v.union(
      v.literal("starter"),
      v.literal("growth"),
      v.literal("enterprise")
    )),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    validateNotEmpty(args.name, "Organization name")
    validateEmail(args.email)

    // Check if organization with this email already exists
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existing) {
      throw new Error("Organization with this email already exists")
    }

    // Generate API key
    const apiKey = generateApiKey()

    // Create organization
    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      email: args.email,
      apiKey,
      plan: args.plan || "starter",
      createdAt: Date.now(),
    })

    return {
      _id: orgId,
      apiKey, // Return API key only once, on creation
    }
  },
})

/**
 * Update organization details
 */
export const update = mutation({
  args: {
    apiKey: v.string(),
    name: v.optional(v.string()),
    plan: v.optional(v.union(
      v.literal("starter"),
      v.literal("growth"),
      v.literal("enterprise")
    )),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_apiKey", (q) => q.eq("apiKey", args.apiKey))
      .unique()

    if (!org) {
      throw new Error("Invalid API key")
    }

    // Build update object
    const updates: any = {}
    if (args.name) {
      validateNotEmpty(args.name, "Organization name")
      updates.name = args.name
    }
    if (args.plan) {
      updates.plan = args.plan
    }

    // Update
    await ctx.db.patch(org._id, updates)

    return { success: true }
  },
})

/**
 * Regenerate API key
 * USE WITH CAUTION: This will invalidate the old API key
 */
export const regenerateApiKey = mutation({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_apiKey", (q) => q.eq("apiKey", args.apiKey))
      .unique()

    if (!org) {
      throw new Error("Invalid API key")
    }

    // Generate new API key
    const newApiKey = generateApiKey()

    // Update
    await ctx.db.patch(org._id, { apiKey: newApiKey })

    return {
      apiKey: newApiKey,
      warning: "Old API key has been invalidated",
    }
  },
})
