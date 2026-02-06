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
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }

    verifyOwnership(deal.organizationId, org._id)

    // Build update object
    const updates: any = {}

    if (args.name !== undefined) {
      validateNotEmpty(args.name, "Deal name")
      updates.name = args.name
    }

    if (args.amount !== undefined) {
      validatePositiveAmount(args.amount)
      updates.amount = args.amount
    }

    // Update
    await ctx.db.patch(args.dealId, updates)

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

    return { success: true }
  },
})
