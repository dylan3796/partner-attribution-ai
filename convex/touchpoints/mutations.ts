/**
 * Touchpoint mutations
 */

import { mutation } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey, verifyOwnership } from "../lib/helpers"

/**
 * Create a new touchpoint
 */
export const create = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    partnerId: v.id("partners"),
    type: v.union(
      v.literal("referral"),
      v.literal("demo"),
      v.literal("content_share"),
      v.literal("introduction"),
      v.literal("proposal"),
      v.literal("negotiation")
    ),
    weight: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Verify deal ownership
    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }
    verifyOwnership(deal.organizationId, org._id)

    // Verify partner ownership
    const partner = await ctx.db.get(args.partnerId)
    if (!partner) {
      throw new Error("Partner not found")
    }
    verifyOwnership(partner.organizationId, org._id)

    // Check if deal is still open
    if (deal.status !== "open") {
      throw new Error("Cannot add touchpoints to a closed deal")
    }

    // Create touchpoint
    const touchpointId = await ctx.db.insert("touchpoints", {
      organizationId: org._id,
      dealId: args.dealId,
      partnerId: args.partnerId,
      type: args.type,
      weight: args.weight,
      notes: args.notes,
      createdAt: Date.now(),
    })

    return touchpointId
  },
})

/**
 * Update touchpoint
 */
export const update = mutation({
  args: {
    apiKey: v.string(),
    touchpointId: v.id("touchpoints"),
    type: v.optional(v.union(
      v.literal("referral"),
      v.literal("demo"),
      v.literal("content_share"),
      v.literal("introduction"),
      v.literal("proposal"),
      v.literal("negotiation")
    )),
    weight: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const touchpoint = await ctx.db.get(args.touchpointId)
    if (!touchpoint) {
      throw new Error("Touchpoint not found")
    }

    // Verify ownership via organization
    verifyOwnership(touchpoint.organizationId, org._id)

    // Check if deal is still open
    const deal = await ctx.db.get(touchpoint.dealId)
    if (!deal || deal.status !== "open") {
      throw new Error("Cannot update touchpoints on a closed deal")
    }

    // Build update object
    const updates: any = {}
    if (args.type !== undefined) updates.type = args.type
    if (args.weight !== undefined) updates.weight = args.weight
    if (args.notes !== undefined) updates.notes = args.notes

    // Update
    await ctx.db.patch(args.touchpointId, updates)

    return { success: true }
  },
})

/**
 * Delete touchpoint
 */
export const remove = mutation({
  args: {
    apiKey: v.string(),
    touchpointId: v.id("touchpoints"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const touchpoint = await ctx.db.get(args.touchpointId)
    if (!touchpoint) {
      throw new Error("Touchpoint not found")
    }

    // Verify ownership
    verifyOwnership(touchpoint.organizationId, org._id)

    // Check if deal is still open
    const deal = await ctx.db.get(touchpoint.dealId)
    if (!deal || deal.status !== "open") {
      throw new Error("Cannot delete touchpoints from a closed deal")
    }

    // Delete
    await ctx.db.delete(args.touchpointId)

    return { success: true }
  },
})
