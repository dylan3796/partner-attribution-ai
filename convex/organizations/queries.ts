/**
 * Organization queries
 */

import { query } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey } from "../lib/helpers"

/**
 * Get organization by API key
 * Used for authentication
 */
export const getByApiKey = query({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const org = await getOrgFromApiKey(ctx, args.apiKey)
      
      // Don't return sensitive fields
      return {
        _id: org._id,
        name: org.name,
        email: org.email,
        plan: org.plan,
      }
    } catch (error) {
      // Don't expose that API key is invalid (security)
      return null
    }
  },
})

/**
 * Get organization stats
 * Dashboard overview data
 */
export const getStats = query({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Get counts
    const [partners, deals, touchpoints, attributions] = await Promise.all([
      ctx.db
        .query("partners")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
      
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
      
      ctx.db
        .query("touchpoints")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
      
      ctx.db
        .query("attributions")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
    ])

    // Calculate stats
    const activePartners = partners.filter((p) => p.status === "active").length
    const openDeals = deals.filter((d) => d.status === "open").length
    const wonDeals = deals.filter((d) => d.status === "won")
    const totalRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0)
    const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0

    return {
      partnersCount: partners.length,
      activePartnersCount: activePartners,
      dealsCount: deals.length,
      openDealsCount: openDeals,
      wonDealsCount: wonDeals.length,
      totalRevenue,
      avgDealSize: Math.round(avgDealSize * 100) / 100,
      touchpointsCount: touchpoints.length,
      attributionsCount: attributions.length,
    }
  },
})
