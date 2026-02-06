/**
 * Deal queries
 */

import { query } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey } from "../lib/helpers"
import { paginationOptsValidator } from "convex/server"

/**
 * List deals with pagination
 */
export const list = query({
  args: {
    apiKey: v.string(),
    status: v.optional(v.union(
      v.literal("open"),
      v.literal("won"),
      v.literal("lost")
    )),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    let query = ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))

    // Filter by status if provided
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status))
    }

    return await query.order("desc").paginate(args.paginationOpts)
  },
})

/**
 * Get a single deal by ID
 */
export const get = query({
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

    // Verify ownership
    if (deal.organizationId !== org._id) {
      throw new Error("Unauthorized")
    }

    return deal
  },
})

/**
 * Get deal with all related data (touchpoints, attributions)
 */
export const getWithDetails = query({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const deal = await ctx.db.get(args.dealId)
    if (!deal || deal.organizationId !== org._id) {
      throw new Error("Deal not found or unauthorized")
    }

    // Get touchpoints
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect()

    // Get partner details for touchpoints
    const partnerIds = [...new Set(touchpoints.map((tp) => tp.partnerId))]
    const partners = await Promise.all(
      partnerIds.map((id) => ctx.db.get(id))
    )
    const partnersMap = Object.fromEntries(
      partners.filter((p) => p !== null).map((p) => [p!._id, p])
    )

    // Get attributions if deal is closed and won
    let attributions = []
    if (deal.status === "won") {
      attributions = await ctx.db
        .query("attributions")
        .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
        .collect()
    }

    return {
      deal,
      touchpoints: touchpoints.map((tp) => ({
        ...tp,
        partner: partnersMap[tp.partnerId],
      })),
      attributions,
      partnersInvolved: partners.filter((p) => p !== null),
    }
  },
})

/**
 * Get deal statistics (for dashboard)
 */
export const getStatsByStatus = query({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect()

    const open = deals.filter((d) => d.status === "open")
    const won = deals.filter((d) => d.status === "won")
    const lost = deals.filter((d) => d.status === "lost")

    const totalRevenue = won.reduce((sum, d) => sum + d.amount, 0)
    const avgDealSize = won.length > 0 ? totalRevenue / won.length : 0

    return {
      total: deals.length,
      open: open.length,
      won: won.length,
      lost: lost.length,
      totalRevenue,
      avgDealSize: Math.round(avgDealSize * 100) / 100,
      winRate: deals.length > 0 ? (won.length / (won.length + lost.length)) * 100 : 0,
    }
  },
})
