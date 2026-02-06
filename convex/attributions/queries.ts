/**
 * Attribution queries
 */

import { query } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey } from "../lib/helpers"

/**
 * Get attributions for a deal
 * Returns all attribution models calculated for this deal
 */
export const getByDeal = query({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    model: v.optional(v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based")
    )),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Verify deal ownership
    const deal = await ctx.db.get(args.dealId)
    if (!deal || deal.organizationId !== org._id) {
      throw new Error("Deal not found or unauthorized")
    }

    let query = ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))

    // Filter by model if specified
    if (args.model) {
      query = query.filter((q) => q.eq(q.field("model"), args.model))
    }

    const attributions = await query.collect()

    // Enrich with partner data
    const enriched = await Promise.all(
      attributions.map(async (attr) => {
        const partner = await ctx.db.get(attr.partnerId)
        return {
          ...attr,
          partner,
        }
      })
    )

    return enriched
  },
})

/**
 * Get attributions for a partner
 * Shows all deals this partner got credit for
 */
export const getByPartner = query({
  args: {
    apiKey: v.string(),
    partnerId: v.id("partners"),
    model: v.optional(v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based")
    )),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Verify partner ownership
    const partner = await ctx.db.get(args.partnerId)
    if (!partner || partner.organizationId !== org._id) {
      throw new Error("Partner not found or unauthorized")
    }

    let query = ctx.db
      .query("attributions")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))

    // Filter by model if specified
    if (args.model) {
      query = query.filter((q) => q.eq(q.field("model"), args.model))
    }

    const attributions = await query.order("desc").collect()

    // Enrich with deal data
    const enriched = await Promise.all(
      attributions.map(async (attr) => {
        const deal = await ctx.db.get(attr.dealId)
        return {
          ...attr,
          deal,
        }
      })
    )

    return enriched
  },
})

/**
 * Get attribution analytics
 * Aggregated stats across all deals and partners
 */
export const getAnalytics = query({
  args: {
    apiKey: v.string(),
    model: v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based")
    ),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Get all attributions for this model
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_model", (q) => q.eq("model", args.model))
      .filter((q) => q.eq(q.field("organizationId"), org._id))
      .collect()

    // Aggregate by partner
    const partnerStats: Record<string, {
      partnerId: string
      partnerName: string
      dealsCount: number
      totalRevenue: number
      totalCommission: number
      avgPercentage: number
    }> = {}

    for (const attr of attributions) {
      const partner = await ctx.db.get(attr.partnerId)
      if (!partner) continue

      if (!partnerStats[attr.partnerId]) {
        partnerStats[attr.partnerId] = {
          partnerId: attr.partnerId,
          partnerName: partner.name,
          dealsCount: 0,
          totalRevenue: 0,
          totalCommission: 0,
          avgPercentage: 0,
        }
      }

      const stats = partnerStats[attr.partnerId]
      stats.dealsCount++
      stats.totalRevenue += attr.amount
      stats.totalCommission += attr.commissionAmount
      stats.avgPercentage += attr.percentage
    }

    // Calculate averages
    const results = Object.values(partnerStats).map((stats) => ({
      ...stats,
      avgPercentage: stats.avgPercentage / stats.dealsCount,
    }))

    // Sort by total revenue
    results.sort((a, b) => b.totalRevenue - a.totalRevenue)

    return {
      model: args.model,
      partners: results,
      summary: {
        totalDeals: new Set(attributions.map((a) => a.dealId)).size,
        totalRevenue: attributions.reduce((sum, a) => sum + a.amount, 0),
        totalCommissions: attributions.reduce((sum, a) => sum + a.commissionAmount, 0),
      },
    }
  },
})

/**
 * Compare attribution models for a specific deal
 * Shows how different models would attribute credit
 */
export const compareModels = query({
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

    // Get all attributions for this deal (all models)
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    // Group by model
    const byModel: Record<string, any[]> = {}
    for (const attr of attributions) {
      if (!byModel[attr.model]) {
        byModel[attr.model] = []
      }
      
      const partner = await ctx.db.get(attr.partnerId)
      byModel[attr.model].push({
        ...attr,
        partner,
      })
    }

    return {
      deal,
      models: byModel,
    }
  },
})
