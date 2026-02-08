/**
 * Deal mutations
 */

import { mutation } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey, verifyOwnership } from "../lib/helpers"
import { validateNotEmpty, validatePositiveAmount } from "../lib/validation"

/**
 * Create a new deal
 */
export const create = mutation({
  args: {
    apiKey: v.string(),
    name: v.string(),
    amount: v.number(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Validate inputs
    validateNotEmpty(args.name, "Deal name")
    validatePositiveAmount(args.amount)

    // Create deal
    const dealId = await ctx.db.insert("deals", {
      organizationId: org._id,
      name: args.name,
      amount: args.amount,
      status: "open",
      createdAt: Date.now(),
    })

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: "deal.created",
      entityType: "deal",
      entityId: dealId,
      changes: JSON.stringify({ name: args.name, amount: args.amount }),
      createdAt: Date.now(),
    })

    return dealId
  },
})

/**
 * Update deal details
 */
export const update = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    name: v.optional(v.string()),
    amount: v.optional(v.number()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }

    verifyOwnership(deal.organizationId, org._id)

    // Build update object and track changes
    const updates: any = {}
    const changes: Record<string, { from: any; to: any }> = {}

    if (args.name !== undefined) {
      validateNotEmpty(args.name, "Deal name")
      changes.name = { from: deal.name, to: args.name }
      updates.name = args.name
    }

    if (args.amount !== undefined) {
      validatePositiveAmount(args.amount)
      changes.amount = { from: deal.amount, to: args.amount }
      updates.amount = args.amount
    }

    // Update
    await ctx.db.patch(args.dealId, updates)

    // Audit log
    if (Object.keys(changes).length > 0) {
      await ctx.db.insert("audit_log", {
        organizationId: org._id,
        userId: args.userId,
        action: "deal.updated",
        entityType: "deal",
        entityId: args.dealId,
        changes: JSON.stringify(changes),
        createdAt: Date.now(),
      })
    }

    return { success: true }
  },
})

/**
 * Close a deal (won or lost)
 * This triggers attribution calculation if status is "won"
 */
export const close = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    status: v.union(v.literal("won"), v.literal("lost")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }

    verifyOwnership(deal.organizationId, org._id)

    // Check if already closed
    if (deal.status !== "open") {
      throw new Error(`Deal is already ${deal.status}`)
    }

    // Close deal
    await ctx.db.patch(args.dealId, {
      status: args.status,
      closedAt: Date.now(),
    })

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: args.status === "won" ? "deal.won" : "deal.lost",
      entityType: "deal",
      entityId: args.dealId,
      changes: JSON.stringify({
        status: { from: "open", to: args.status },
      }),
      metadata: JSON.stringify({
        dealName: deal.name,
        amount: deal.amount,
      }),
      createdAt: Date.now(),
    })

    // Note: Attribution calculation is done separately via attributions/mutations.ts
    // This keeps concerns separated and allows for recalculation if needed

    return { success: true }
  },
})

/**
 * Reopen a closed deal
 */
export const reopen = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }

    verifyOwnership(deal.organizationId, org._id)

    // Check if deal is closed
    if (deal.status === "open") {
      throw new Error("Deal is already open")
    }

    const previousStatus = deal.status

    // Reopen deal
    await ctx.db.patch(args.dealId, {
      status: "open",
      closedAt: undefined,
    })

    // Delete existing attributions if any
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    for (const attribution of attributions) {
      await ctx.db.delete(attribution._id)
    }

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: "deal.reopened",
      entityType: "deal",
      entityId: args.dealId,
      changes: JSON.stringify({
        status: { from: previousStatus, to: "open" },
      }),
      metadata: JSON.stringify({
        attributionsDeleted: attributions.length,
      }),
      createdAt: Date.now(),
    })

    return { success: true }
  },
})

/**
 * Delete a deal
 */
export const remove = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }

    verifyOwnership(deal.organizationId, org._id)

    // Delete associated touchpoints
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    for (const tp of touchpoints) {
      await ctx.db.delete(tp._id)
    }

    // Delete associated attributions
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    for (const attr of attributions) {
      await ctx.db.delete(attr._id)
    }

    // Delete deal
    await ctx.db.delete(args.dealId)

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: args.userId,
      action: "deal.deleted",
      entityType: "deal",
      entityId: args.dealId,
      metadata: JSON.stringify({
        dealName: deal.name,
        amount: deal.amount,
        touchpointsDeleted: touchpoints.length,
        attributionsDeleted: attributions.length,
      }),
      createdAt: Date.now(),
    })

    return { success: true }
  },
})
