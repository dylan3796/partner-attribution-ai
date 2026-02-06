/**
 * Touchpoint queries
 */

import { query } from "../_generated/server"
import { v } from "convex/values"
import { getOrgFromApiKey } from "../lib/helpers"

/**
 * List touchpoints by deal
 */
export const listByDeal = query({
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

    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .order("desc")
      .collect()

    // Enrich with partner data
    const enriched = await Promise.all(
      touchpoints.map(async (tp) => {
        const partner = await ctx.db.get(tp.partnerId)
        return {
          ...tp,
          partner,
        }
      })
    )

    return enriched
  },
})

/**
 * List touchpoints by partner
 */
export const listByPartner = query({
  args: {
    apiKey: v.string(),
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)

    // Verify partner ownership
    const partner = await ctx.db.get(args.partnerId)
    if (!partner || partner.organizationId !== org._id) {
      throw new Error("Partner not found or unauthorized")
    }

    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .order("desc")
      .collect()

    // Enrich with deal data
    const enriched = await Promise.all(
      touchpoints.map(async (tp) => {
        const deal = await ctx.db.get(tp.dealId)
        return {
          ...tp,
          deal,
        }
      })
    )

    return enriched
  },
})

/**
 * Get a single touchpoint
 */
export const get = query({
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

    // Verify ownership via deal
    const deal = await ctx.db.get(touchpoint.dealId)
    if (!deal || deal.organizationId !== org._id) {
      throw new Error("Unauthorized")
    }

    return touchpoint
  },
})
