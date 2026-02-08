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
    userId: v.optional(v.id("users")),
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

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: "partner.created",
      entityType: "partner",
      entityId: partnerId,
      changes: JSON.stringify({
        name: args.name,
        email: args.email,
        type: args.type,
        commissionRate: args.commissionRate,
      }),
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
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }

    verifyOwnership(partner.organizationId, org._id)

    // Build update object and track changes
    const updates: any = {}
    const changes: Record<string, { from: any; to: any }> = {}

    if (args.name !== undefined) {
      validateNotEmpty(args.name, "Partner name")
      changes.name = { from: partner.name, to: args.name }
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

      changes.email = { from: partner.email, to: args.email }
      updates.email = args.email
    }

    if (args.type !== undefined) {
      changes.type = { from: partner.type, to: args.type }
      updates.type = args.type
    }

    if (args.commissionRate !== undefined) {
      validatePercentage(args.commissionRate)
      changes.commissionRate = { from: partner.commissionRate, to: args.commissionRate }
      updates.commissionRate = args.commissionRate
    }

    if (args.status !== undefined) {
      changes.status = { from: partner.status, to: args.status }
      updates.status = args.status
    }

    // Update
    await ctx.db.patch(args.partnerId, updates)

    // Audit log
    if (Object.keys(changes).length > 0) {
      await ctx.db.insert("audit_log", {
        organizationId: org._id,
        userId: args.userId,
        action: "partner.updated",
        entityType: "partner",
        entityId: args.partnerId,
        changes: JSON.stringify(changes),
        createdAt: Date.now(),
      })
    }

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
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }

    verifyOwnership(partner.organizationId, org._id)

    await ctx.db.patch(args.partnerId, { status: "active" })

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: "partner.activated",
      entityType: "partner",
      entityId: args.partnerId,
      changes: JSON.stringify({ status: { from: partner.status, to: "active" } }),
      createdAt: Date.now(),
    })

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
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }

    verifyOwnership(partner.organizationId, org._id)

    await ctx.db.patch(args.partnerId, { status: "inactive" })

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: "partner.deactivated",
      entityType: "partner",
      entityId: args.partnerId,
      changes: JSON.stringify({ status: { from: partner.status, to: "inactive" } }),
      createdAt: Date.now(),
    })

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
    userId: v.optional(v.id("users")),
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

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: "partner.deleted",
      entityType: "partner",
      entityId: args.partnerId,
      metadata: JSON.stringify({ name: partner.name, email: partner.email }),
      createdAt: Date.now(),
    })

    return { success: true }
  },
})
