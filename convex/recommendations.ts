/**
 * Partner Recommendations — AI-powered partner matching based on historical deal data.
 */
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getOrg } from "./lib/getOrg";

/**
 * For a specific deal, find partners who have won similar deals (by size).
 */
export const getForDeal = query({
  args: { dealId: v.id("deals") },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) return [];

    const deal = await ctx.db.get(args.dealId);
    if (!deal) return [];

    // Find won deals in similar size range (0.3x to 3x)
    const wonDeals = await ctx.db
      .query("deals")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", org._id).eq("status", "won")
      )
      .collect();

    const similar = wonDeals.filter(
      (d) =>
        d._id !== deal._id &&
        d.amount >= deal.amount * 0.3 &&
        d.amount <= deal.amount * 3
    );

    // Aggregate partner performance on similar deals
    const partnerScores: Record<
      string,
      { wins: number; revenue: number; partnerId: string }
    > = {};

    for (const sDeal of similar) {
      const attributions = await ctx.db
        .query("attributions")
        .withIndex("by_deal", (q) => q.eq("dealId", sDeal._id))
        .collect();

      for (const attr of attributions) {
        const pid = attr.partnerId as string;
        if (!partnerScores[pid]) {
          partnerScores[pid] = { wins: 0, revenue: 0, partnerId: pid };
        }
        partnerScores[pid].wins += 1;
        partnerScores[pid].revenue += sDeal.amount;
      }
    }

    // Also count partners who registered similar won deals (no attribution needed)
    for (const sDeal of similar) {
      if (sDeal.registeredBy) {
        const pid = sDeal.registeredBy as string;
        if (!partnerScores[pid]) {
          partnerScores[pid] = { wins: 0, revenue: 0, partnerId: pid };
        }
        partnerScores[pid].wins += 1;
        partnerScores[pid].revenue += sDeal.amount;
      }
    }

    const ranked = Object.values(partnerScores)
      .sort((a, b) => b.wins - a.wins || b.revenue - a.revenue)
      .slice(0, 5);

    // Hydrate with partner details
    const results = [];
    for (const r of ranked) {
      const partner = await ctx.db.get(r.partnerId as Id<"partners">);
      if (!partner || partner.status !== "active") continue;
      results.push({
        partnerId: r.partnerId,
        name: partner.name,
        tier: partner.tier ?? "bronze",
        type: partner.type,
        wins: r.wins,
        revenue: r.revenue,
      });
    }
    return results;
  },
});

/**
 * General partner recommendations ranked by composite score:
 * win rate (40%) + revenue contribution (40%) + deal volume (20%)
 */
export const getTopRecommended = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];

    const partners = await ctx.db
      .query("partners")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", org._id).eq("status", "active")
      )
      .collect();

    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();

    // Build a map of partnerId → deals (via registeredBy)
    const partnerDeals: Record<string, typeof allDeals> = {};
    for (const deal of allDeals) {
      if (deal.registeredBy) {
        const pid = deal.registeredBy as string;
        if (!partnerDeals[pid]) partnerDeals[pid] = [];
        partnerDeals[pid].push(deal);
      }
    }

    // Also check attributions
    const allAttributions = await ctx.db
      .query("attributions")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();

    for (const attr of allAttributions) {
      const pid = attr.partnerId as string;
      const deal = allDeals.find((d) => (d._id as string) === (attr.dealId as string));
      if (deal) {
        if (!partnerDeals[pid]) partnerDeals[pid] = [];
        // avoid duplicates
        if (!partnerDeals[pid].some((d) => (d._id as string) === (deal._id as string))) {
          partnerDeals[pid].push(deal);
        }
      }
    }

    const maxRevenue = Math.max(
      ...partners.map((p) => {
        const deals = partnerDeals[p._id as string] ?? [];
        return deals
          .filter((d) => d.status === "won")
          .reduce((s, d) => s + (d.amount || 0), 0);
      }),
      1
    );

    const maxDeals = Math.max(
      ...partners.map((p) => {
        const deals = partnerDeals[p._id as string] ?? [];
        return deals.filter((d) => d.status === "won").length;
      }),
      1
    );

    const results = partners.map((partner) => {
      const deals = partnerDeals[partner._id as string] ?? [];
      const wonDeals = deals.filter((d) => d.status === "won");
      const openDeals = deals.filter((d) => d.status === "open");
      const winRate = deals.length > 0 ? wonDeals.length / deals.length : 0;
      const totalRevenue = wonDeals.reduce((s, d) => s + (d.amount || 0), 0);
      const pipeline = openDeals.reduce((s, d) => s + (d.amount || 0), 0);

      const score =
        winRate * 0.4 +
        (totalRevenue / maxRevenue) * 0.4 +
        (wonDeals.length / maxDeals) * 0.2;

      return {
        partner: {
          _id: partner._id,
          name: partner.name,
          tier: partner.tier ?? "bronze",
          type: partner.type,
          email: partner.email,
          commissionRate: partner.commissionRate,
        },
        winRate,
        totalRevenue,
        pipeline,
        dealCount: deals.length,
        wonCount: wonDeals.length,
        recommendationScore: score,
      };
    });

    return results
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 10);
  },
});

/**
 * Get open deals (for the "recommendations per deal" section).
 */
export const getOpenDeals = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];

    return await ctx.db
      .query("deals")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", org._id).eq("status", "open")
      )
      .collect();
  },
});
