/**
 * Analytics Queries
 * 
 * Dashboard and reporting queries for the attribution platform.
 */

import { query } from "../_generated/server";
import { v } from "convex/values";
import { getOrgFromApiKey } from "../lib/helpers";

/**
 * Get overview statistics for the dashboard
 * Returns key metrics at a glance
 */
export const getOverview = query({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey);

    // Fetch all core data in parallel
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
    ]);

    // Calculate partner stats
    const activePartners = partners.filter((p) => p.status === "active").length;
    const pendingPartners = partners.filter((p) => p.status === "pending").length;

    // Calculate deal stats
    const openDeals = deals.filter((d) => d.status === "open");
    const wonDeals = deals.filter((d) => d.status === "won");
    const lostDeals = deals.filter((d) => d.status === "lost");
    
    const totalRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);
    const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;
    const pipelineValue = openDeals.reduce((sum, d) => sum + d.amount, 0);
    
    // Win rate (only for closed deals)
    const closedDeals = wonDeals.length + lostDeals.length;
    const winRate = closedDeals > 0 ? (wonDeals.length / closedDeals) * 100 : 0;

    // Calculate commission stats
    const totalCommissions = attributions.reduce((sum, a) => sum + a.commissionAmount, 0);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentDeals = deals.filter((d) => d.createdAt > thirtyDaysAgo);
    const recentWonDeals = recentDeals.filter((d) => d.status === "won");
    const recentRevenue = recentWonDeals.reduce((sum, d) => sum + d.amount, 0);

    // Top partners by attributed revenue (using equal_split model as default)
    const partnerRevenueMap = new Map<string, { name: string; revenue: number; deals: number }>();
    
    for (const attr of attributions) {
      if (attr.model === "equal_split") {
        const existing = partnerRevenueMap.get(attr.partnerId);
        const partner = partners.find((p) => p._id === attr.partnerId);
        
        if (existing) {
          existing.revenue += attr.amount;
          existing.deals += 1;
        } else {
          partnerRevenueMap.set(attr.partnerId, {
            name: partner?.name || "Unknown Partner",
            revenue: attr.amount,
            deals: 1,
          });
        }
      }
    }
    
    const topPartners = Array.from(partnerRevenueMap.entries())
      .map(([id, data]) => ({ partnerId: id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      // Summary stats
      summary: {
        totalPartners: partners.length,
        activePartners,
        pendingPartners,
        totalDeals: deals.length,
        openDeals: openDeals.length,
        wonDeals: wonDeals.length,
        lostDeals: lostDeals.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        avgDealSize: Math.round(avgDealSize * 100) / 100,
        pipelineValue: Math.round(pipelineValue * 100) / 100,
        winRate: Math.round(winRate * 100) / 100,
        touchpointsCount: touchpoints.length,
        attributionsCount: attributions.length,
        totalCommissions: Math.round(totalCommissions * 100) / 100,
      },
      
      // Recent activity (30 days)
      recent: {
        dealsCreated: recentDeals.length,
        dealsWon: recentWonDeals.length,
        revenue: Math.round(recentRevenue * 100) / 100,
      },
      
      // Top performers
      topPartners,
      
      // Organization info
      organization: {
        name: org.name,
        plan: org.plan,
      },
    };
  },
});

/**
 * Get revenue by period (for charts)
 */
export const getRevenueByPeriod = query({
  args: {
    apiKey: v.string(),
    period: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
    daysBack: v.optional(v.number()), // Default 30
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey);
    const daysBack = args.daysBack ?? 30;
    const cutoffDate = Date.now() - daysBack * 24 * 60 * 60 * 1000;

    // Get won deals in the period
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "won"),
          q.gte(q.field("closedAt"), cutoffDate)
        )
      )
      .collect();

    // Group by period
    const periodData = new Map<string, { revenue: number; deals: number }>();

    for (const deal of deals) {
      const closedAt = deal.closedAt || deal.createdAt;
      const date = new Date(closedAt);
      
      let periodKey: string;
      
      if (args.period === "daily") {
        periodKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else if (args.period === "weekly") {
        // Get start of week (Sunday)
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        periodKey = startOfWeek.toISOString().split("T")[0];
      } else {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
      }
      
      const existing = periodData.get(periodKey);
      if (existing) {
        existing.revenue += deal.amount;
        existing.deals += 1;
      } else {
        periodData.set(periodKey, { revenue: deal.amount, deals: 1 });
      }
    }

    // Convert to array and sort by date
    const results = Array.from(periodData.entries())
      .map(([period, data]) => ({
        period,
        revenue: Math.round(data.revenue * 100) / 100,
        deals: data.deals,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    return results;
  },
});

/**
 * Get attribution distribution across models
 */
export const getAttributionDistribution = query({
  args: {
    apiKey: v.string(),
    dealId: v.optional(v.id("deals")),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey);

    let attributionsQuery = ctx.db
      .query("attributions")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id));

    if (args.dealId) {
      attributionsQuery = attributionsQuery.filter((q) =>
        q.eq(q.field("dealId"), args.dealId)
      );
    }

    const attributions = await attributionsQuery.collect();

    // Group by model
    const modelDistribution = new Map<string, { 
      count: number; 
      totalAmount: number;
      totalCommission: number;
    }>();

    for (const attr of attributions) {
      const existing = modelDistribution.get(attr.model);
      if (existing) {
        existing.count += 1;
        existing.totalAmount += attr.amount;
        existing.totalCommission += attr.commissionAmount;
      } else {
        modelDistribution.set(attr.model, {
          count: 1,
          totalAmount: attr.amount,
          totalCommission: attr.commissionAmount,
        });
      }
    }

    return Array.from(modelDistribution.entries())
      .map(([model, data]) => ({
        model,
        attributionCount: data.count,
        totalAmount: Math.round(data.totalAmount * 100) / 100,
        totalCommission: Math.round(data.totalCommission * 100) / 100,
        avgAmount: Math.round((data.totalAmount / data.count) * 100) / 100,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  },
});

/**
 * Get partner performance ranking
 */
export const getPartnerRanking = query({
  args: {
    apiKey: v.string(),
    model: v.optional(v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey);
    const limit = args.limit ?? 10;
    const model = args.model ?? "equal_split";

    // Get all attributions for the specified model
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_model", (q) => q.eq("model", model))
      .filter((q) => q.eq(q.field("organizationId"), org._id))
      .collect();

    // Get partners
    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();
    
    const partnerMap = new Map(partners.map((p) => [p._id, p]));

    // Aggregate by partner
    const partnerStats = new Map<string, {
      partnerId: string;
      name: string;
      type: string;
      commissionRate: number;
      totalRevenue: number;
      totalCommission: number;
      dealsCount: number;
      avgPercentage: number;
    }>();

    for (const attr of attributions) {
      const partner = partnerMap.get(attr.partnerId);
      if (!partner) continue;

      const existing = partnerStats.get(attr.partnerId);
      if (existing) {
        existing.totalRevenue += attr.amount;
        existing.totalCommission += attr.commissionAmount;
        existing.dealsCount += 1;
        existing.avgPercentage += attr.percentage;
      } else {
        partnerStats.set(attr.partnerId, {
          partnerId: attr.partnerId,
          name: partner.name,
          type: partner.type,
          commissionRate: partner.commissionRate,
          totalRevenue: attr.amount,
          totalCommission: attr.commissionAmount,
          dealsCount: 1,
          avgPercentage: attr.percentage,
        });
      }
    }

    // Calculate averages and sort
    const results = Array.from(partnerStats.values())
      .map((stats) => ({
        ...stats,
        totalRevenue: Math.round(stats.totalRevenue * 100) / 100,
        totalCommission: Math.round(stats.totalCommission * 100) / 100,
        avgPercentage: Math.round((stats.avgPercentage / stats.dealsCount) * 100) / 100,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);

    return {
      model,
      partners: results,
    };
  },
});
