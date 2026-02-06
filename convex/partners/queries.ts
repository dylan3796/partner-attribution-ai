/**
 * Partner queries
 */

import { query } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey } from "../lib/helpers"
import { paginationOptsValidator } from "convex/server"

/**
 * List partners with pagination
 */
export const list = query({
  args: {
    apiKey: v.string(),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending")
    )),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    let query = ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))

    // Filter by status if provided
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status))
    }

    return await query.order("desc").paginate(args.paginationOpts)
  },
})

/**
 * Get a single partner by ID
 */
export const get = query({
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

    // Verify ownership
    if (partner.organizationId !== org._id) {
      throw new Error("Unauthorized")
    }

    return partner
  },
})

/**
 * Get partner performance stats
 */
export const getStats = query({
  args: {
    apiKey: v.string(),
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const partner = await ctx.db.get(args.partnerId)
    if (!partner || partner.organizationId !== org._id) {
      throw new Error("Partner not found or unauthorized")
    }

    // Get all touchpoints by this partner
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .collect()

    // Get unique deals
    const uniqueDealIds = [...new Set(touchpoints.map((tp) => tp.dealId))]

    // Get attributions for this partner
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .collect()

    // Calculate stats
    const totalAttributedRevenue = attributions.reduce((sum, a) => sum + a.amount, 0)
    const totalCommission = attributions.reduce((sum, a) => sum + a.commissionAmount, 0)

    return {
      touchpointsCount: touchpoints.length,
      dealsInvolvedCount: uniqueDealIds.length,
      attributionsCount: attributions.length,
      totalAttributedRevenue,
      totalCommission,
      avgAttributionPercentage:
        attributions.length > 0
          ? attributions.reduce((sum, a) => sum + a.percentage, 0) / attributions.length
          : 0,
    }
  },
})

/**
 * Search partners by name or email
 */
export const search = query({
  args: {
    apiKey: v.string(),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    const allPartners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect()

    // Simple text search (case-insensitive)
    const searchLower = args.searchTerm.toLowerCase()
    const filtered = allPartners.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
    )

    const limit = args.limit || 50
    return filtered.slice(0, limit)
  },
})
