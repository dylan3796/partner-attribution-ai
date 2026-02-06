/**
 * Partner mutations
 */

import { mutation } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey, verifyOwnership } from "../lib/helpers"
import { validateEmail, validateNotEmpty, validatePercentage } from "../lib/validation"

/**
 * Create a new partner
 */
export const create = mutation({
  args: {
    apiKey: v.string(),
    name: v.string(),
    email: v.string(),
    type: v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    ),
    commissionRate: v.number(),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Validate inputs
    validateNotEmpty(args.name, "Partner name")
    validateEmail(args.email)
    validatePercentage(args.commissionRate)

    // Check for duplicate email within this organization
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existing && existing.organizationId === org._id) {
      throw new Error("Partner with this email already exists in your organization")
    }

    // Create partner
    const partnerId = await ctx.db.insert("partners", {
      organizationId: org._id,
      name: args.name,
      email: args.email,
      type: args.type,
      commissionRate: args.commissionRate,
      status: "pending",
      createdAt: Date.now(),
    })

    return partnerId
  },
})

/**
 * Update partner details
 */
export const update = mutation({
  args: {
    apiKey: v.string(),
    partnerId: v.id("partners"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    )),
    commissionRate: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending")
    )),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }

    verifyOwnership(partner.organizationId, org._id)

    // Build update object
    const updates: any = {}

    if (args.name !== undefined) {
      validateNotEmpty(args.name, "Partner name")
      updates.name = args.name
    }

    if (args.email !== undefined) {
      validateEmail(args.email)
      
      // Check for duplicate email (excluding current partner)
      const existing = await ctx.db
        .query("partners")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first()

      if (existing && existing._id !== args.partnerId && existing.organizationId === org._id) {
        throw new Error("Another partner with this email already exists")
      }

      updates.email = args.email
    }

    if (args.type !== undefined) {
      updates.type = args.type
    }

    if (args.commissionRate !== undefined) {
      validatePercentage(args.commissionRate)
      updates.commissionRate = args.commissionRate
    }

    if (args.status !== undefined) {
      updates.status = args.status
    }

    // Update
    await ctx.db.patch(args.partnerId, updates)

    return { success: true }
  },
})

/**
 * Activate a partner
 */
export const activate = mutation({
  args: {
    apiKey: v.string(),
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }

    verifyOwnership(partner.organizationId, org._id)

    await ctx.db.patch(args.partnerId, { status: "active" })

    return { success: true }
  },
})

/**
 * Deactivate a partner
 */
export const deactivate = mutation({
  args: {
    apiKey: v.string(),
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }

    verifyOwnership(partner.organizationId, org._id)

    await ctx.db.patch(args.partnerId, { status: "inactive" })

    return { success: true }
  },
})

/**
 * Delete a partner
 * Note: This is a soft delete (status = inactive)
 * Consider adding a hard delete option later if needed
 */
export const remove = mutation({
  args: {
    apiKey: v.string(),
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }

    verifyOwnership(partner.organizationId, org._id)

    // Check if partner has any touchpoints
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .first()

    if (touchpoints) {
      throw new Error(
        "Cannot delete partner with existing touchpoints. Deactivate instead."
      )
    }

    // Hard delete if no touchpoints
    await ctx.db.delete(args.partnerId)

    return { success: true }
  },
})
