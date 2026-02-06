/**
 * Attribution mutations
 */

import { mutation } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey, verifyOwnership } from "../lib/helpers"
import { calculateAttribution } from "../lib/attribution"

/**
 * Calculate attribution for a deal
 * This should be called after a deal is closed as "won"
 * 
 * Calculates attribution using all 5 models and stores results
 */
export const calculate = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    models: v.optional(v.array(v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based")
    ))),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Get deal
    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }
    verifyOwnership(deal.organizationId, org._id)

    // Check if deal is won
    if (deal.status !== "won") {
      throw new Error("Can only calculate attribution for won deals")
    }

    // Get touchpoints
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    if (touchpoints.length === 0) {
      throw new Error("Cannot calculate attribution without touchpoints")
    }

    // Get partners to fetch commission rates
    const partnerIds = [...new Set(touchpoints.map((tp) => tp.partnerId))]
    const partners = await Promise.all(partnerIds.map((id) => ctx.db.get(id)))
    const partnersMap = Object.fromEntries(
      partners.filter((p) => p !== null).map((p) => [p!._id, p])
    )

    // Determine which models to calculate
    const modelsToCalculate = args.models || [
      "equal_split",
      "first_touch",
      "last_touch",
      "time_decay",
      "role_based",
    ]

    // Delete existing attributions for these models
    const existingAttributions = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    for (const attr of existingAttributions) {
      if (modelsToCalculate.includes(attr.model as any)) {
        await ctx.db.delete(attr._id)
      }
    }

    // Calculate and store attributions for each model
    const results = []

    for (const model of modelsToCalculate) {
      console.log(`Calculating ${model} attribution for deal ${args.dealId}`)
      
      const startTime = Date.now()
      
      // Calculate attribution percentages
      const attributions = calculateAttribution(touchpoints, model)
      
      const calculationTime = Date.now() - startTime
      console.log(`${model} calculated in ${calculationTime}ms`)

      // Store results
      for (const attr of attributions) {
        const partner = partnersMap[attr.partnerId]
        if (!partner) continue

        const amount = (deal.amount * attr.percentage) / 100
        const commissionAmount = (amount * partner.commissionRate) / 100

        const attrId = await ctx.db.insert("attributions", {
          organizationId: org._id,
          dealId: args.dealId,
          partnerId: attr.partnerId,
          model,
          percentage: attr.percentage,
          amount: Math.round(amount * 100) / 100, // Round to cents
          commissionAmount: Math.round(commissionAmount * 100) / 100,
          calculatedAt: Date.now(),
        })

        results.push({
          _id: attrId,
          model,
          partner: partner.name,
          percentage: attr.percentage,
          amount,
          commissionAmount,
        })
      }
    }

    return {
      success: true,
      dealId: args.dealId,
      modelsCalculated: modelsToCalculate,
      results,
    }
  },
})

/**
 * Recalculate attribution for a deal
 * Use if touchpoints were modified or to update with new models
 */
export const recalculate = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    // Reuse the calculate mutation
    return await calculate(ctx, { ...args, models: undefined })
  },
})

/**
 * Delete all attributions for a deal
 * Used when reopening a deal
 */
export const deleteByDeal = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Verify deal ownership
    const deal = await ctx.db.get(args.dealId)
    if (!deal || deal.organizationId !== org._id) {
      throw new Error("Deal not found or unauthorized")
    }

    // Delete all attributions
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    for (const attr of attributions) {
      await ctx.db.delete(attr._id)
    }

    return {
      success: true,
      deletedCount: attributions.length,
    }
  },
})
