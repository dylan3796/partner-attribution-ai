/**
 * Dashboard stats queries — reads from real Convex data.
 */
import { query } from "./_generated/server";
import { v } from "convex/values";

import { getOrg } from "./lib/getOrg";
async function defaultOrg(ctx: any) {
  return await getOrg(ctx);
}

const EMPTY_STATS = {
  totalRevenue: 0,
  pipelineValue: 0,
  totalDeals: 0,
  openDeals: 0,
  wonDeals: 0,
  lostDeals: 0,
  activePartners: 0,
  totalPartners: 0,
  winRate: 0,
  avgDealSize: 0,
  totalCommissions: 0,
  pendingPayouts: 0,
};

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return EMPTY_STATS;

    const [deals, partners, payouts, attributions] = await Promise.all([
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q: any) =>
          q.eq("organizationId", org._id)
        )
        .collect(),
      ctx.db
        .query("partners")
        .withIndex("by_organization", (q: any) =>
          q.eq("organizationId", org._id)
        )
        .collect(),
      ctx.db
        .query("payouts")
        .withIndex("by_organization", (q: any) =>
          q.eq("organizationId", org._id)
        )
        .collect(),
      ctx.db
        .query("attributions")
        .withIndex("by_organization", (q: any) =>
          q.eq("organizationId", org._id)
        )
        .collect(),
    ]);

    const wonDeals = deals.filter((d: any) => d.status === "won");
    const openDeals = deals.filter((d: any) => d.status === "open");
    const lostDeals = deals.filter((d: any) => d.status === "lost");
    const totalRevenue = wonDeals.reduce((s: number, d: any) => s + d.amount, 0);
    const pipelineValue = openDeals.reduce(
      (s: number, d: any) => s + d.amount,
      0
    );
    const closedCount = wonDeals.length + lostDeals.length;
    const activePartners = partners.filter((p: any) => p.status === "active");
    const pendingPays = payouts.filter(
      (p: any) => p.status === "pending_approval"
    );

    return {
      totalRevenue,
      pipelineValue,
      totalDeals: deals.length,
      openDeals: openDeals.length,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
      activePartners: activePartners.length,
      totalPartners: partners.length,
      winRate:
        closedCount > 0
          ? Math.round((wonDeals.length / closedCount) * 100)
          : 0,
      avgDealSize:
        wonDeals.length > 0
          ? Math.round(totalRevenue / wonDeals.length)
          : 0,
      totalCommissions: Math.round(
        attributions
          .filter((a: any) => a.model === "role_based")
          .reduce((s: number, a: any) => s + a.commissionAmount, 0)
      ),
      pendingPayouts: pendingPays.reduce((s: number, p: any) => s + p.amount, 0),
    };
  },
});

export const getRecentDeals = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("deals")
      .withIndex("by_organization", (q: any) =>
        q.eq("organizationId", org._id)
      )
      .order("desc")
      .take(5);
  },
});

export const getTopPartners = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("partners")
      .withIndex("by_org_and_status", (q: any) =>
        q.eq("organizationId", org._id).eq("status", "active")
      )
      .take(5);
  },
});

export const getPendingPayouts = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_org_and_status", (q: any) =>
        q.eq("organizationId", org._id).eq("status", "pending_approval")
      )
      .collect();
    return await Promise.all(
      payouts.map(async (payout: any) => {
        const partner = await ctx.db.get(payout.partnerId);
        return { ...payout, partner: partner ?? undefined };
      })
    );
  },
});

export const getRecentAuditLog = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("audit_log")
      .withIndex("by_organization", (q: any) =>
        q.eq("organizationId", org._id)
      )
      .order("desc")
      .take(5);
  },
});

export const getAuditLog = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("audit_log")
      .withIndex("by_organization", (q: any) =>
        q.eq("organizationId", org._id)
      )
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const getOrganization = query({
  args: {},
  handler: async (ctx) => {
    return await getOrg(ctx);
  },
});

// ============================================================================
// Reports & Analytics Queries
// ============================================================================

type AttributionModel = "equal_split" | "first_touch" | "last_touch" | "time_decay" | "role_based";
const MODELS: AttributionModel[] = ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"];

/**
 * Get partner-by-model attribution data for leaderboards and radar charts
 */
export const getPartnerModelData = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return { partnerData: {}, partners: [] };

    const [partners, attributions] = await Promise.all([
      ctx.db
        .query("partners")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("attributions")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
    ]);

    // Aggregate by partner and model
    const partnerData: Record<string, Record<string, {
      revenue: number;
      commission: number;
      deals: string[];
      pct: number;
      count: number;
    }>> = {};

    for (const a of attributions) {
      if (!partnerData[a.partnerId]) partnerData[a.partnerId] = {};
      if (!partnerData[a.partnerId][a.model]) {
        partnerData[a.partnerId][a.model] = {
          revenue: 0,
          commission: 0,
          deals: [],
          pct: 0,
          count: 0,
        };
      }
      const entry = partnerData[a.partnerId][a.model];
      entry.revenue += a.amount;
      entry.commission += a.commissionAmount;
      if (!entry.deals.includes(a.dealId)) entry.deals.push(a.dealId);
      entry.pct += a.percentage;
      entry.count += 1;
    }

    return {
      partnerData,
      partners: partners.map((p: any) => ({
        _id: p._id,
        name: p.name,
        type: p.type,
        tier: p.tier,
        commissionRate: p.commissionRate,
      })),
    };
  },
});

/**
 * Get model comparison totals for bar chart
 */
export const getModelComparison = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];

    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();

    const totals: Record<string, { revenue: number; commission: number; deals: Set<string> }> = {};
    for (const m of MODELS) {
      totals[m] = { revenue: 0, commission: 0, deals: new Set() };
    }

    for (const a of attributions) {
      if (totals[a.model]) {
        totals[a.model].revenue += a.amount;
        totals[a.model].commission += a.commissionAmount;
        totals[a.model].deals.add(a.dealId);
      }
    }

    return MODELS.map((m) => ({
      model: m,
      revenue: Math.round(totals[m].revenue),
      commission: Math.round(totals[m].commission),
      deals: totals[m].deals.size,
    }));
  },
});

/**
 * Get all attributions for CSV export
 */
export const getAllAttributions = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];

    const [attributions, partners, deals] = await Promise.all([
      ctx.db
        .query("attributions")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("partners")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
    ]);

    const partnerMap = new Map(partners.map((p: any) => [p._id, p]));
    const dealMap = new Map(deals.map((d: any) => [d._id, d]));

    return attributions.map((a: any) => ({
      ...a,
      partner: partnerMap.get(a.partnerId),
      deal: dealMap.get(a.dealId),
    }));
  },
});

/**
 * Get pipeline deals with partner enrichment for the Pipeline page
 */
export const getPipelineDeals = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return { open: [], won: [], lost: [], total: 0, openValue: 0, wonValue: 0, lostValue: 0 };
    
    const [deals, touchpoints, partners, attributions] = await Promise.all([
      ctx.db.query("deals")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db.query("touchpoints")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db.query("partners")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db.query("attributions")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
    ]);
    
    const partnerMap = new Map(partners.map((p: any) => [p._id, p]));
    
    // Enrich deals with partner info and touchpoints
    const enriched = deals.map((d: any) => {
      const dealTouchpoints = touchpoints.filter((t: any) => t.dealId === d._id);
      const dealAttributions = attributions.filter((a: any) => a.dealId === d._id);
      const registeredPartner = d.registeredBy ? partnerMap.get(d.registeredBy) : null;
      
      // Get all partners who touched this deal
      const involvedPartners = [...new Set(dealTouchpoints.map((t: any) => t.partnerId))]
        .map((pid: any) => {
          const partner = partnerMap.get(pid);
          const attr = dealAttributions.find((a: any) => a.partnerId === pid);
          return partner ? {
            _id: partner._id,
            name: partner.name,
            tier: partner.tier,
            type: partner.type,
            attributionPct: attr?.percentage ?? 0,
          } : null;
        })
        .filter(Boolean);
      
      return {
        ...d,
        registeredPartner: registeredPartner ? {
          _id: registeredPartner._id,
          name: registeredPartner.name,
          tier: registeredPartner.tier,
        } : null,
        touchpoints: dealTouchpoints.map((t: any) => ({
          _id: t._id,
          type: t.type,
          partnerId: t.partnerId,
          partnerName: partnerMap.get(t.partnerId)?.name ?? "Unknown",
          createdAt: t.createdAt,
        })),
        involvedPartners,
      };
    });
    
    const open = enriched.filter((d: any) => d.status === "open");
    const won = enriched.filter((d: any) => d.status === "won");
    const lost = enriched.filter((d: any) => d.status === "lost");
    
    return {
      open,
      won,
      lost,
      total: enriched.length,
      openValue: open.reduce((s: number, d: any) => s + d.amount, 0),
      wonValue: won.reduce((s: number, d: any) => s + d.amount, 0),
      lostValue: lost.reduce((s: number, d: any) => s + d.amount, 0),
    };
  },
});

/**
 * Get partner performance data for Incentives page (calculated from real data)
 */
export const getPartnerPerformance = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    
    const [partners, deals, touchpoints, attributions] = await Promise.all([
      ctx.db.query("partners")
        .withIndex("by_org_and_status", (q: any) => q.eq("organizationId", org._id).eq("status", "active"))
        .collect(),
      ctx.db.query("deals")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db.query("touchpoints")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db.query("attributions")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
    ]);
    
    return partners.map((partner: any) => {
      const partnerTouchpoints = touchpoints.filter((t: any) => t.partnerId === partner._id);
      const dealIds = [...new Set(partnerTouchpoints.map((t: any) => t.dealId))];
      const partnerDeals = dealIds.map((id: any) => deals.find((d: any) => d._id === id)).filter(Boolean);
      const partnerAttributions = attributions.filter((a: any) => a.partnerId === partner._id);
      
      const wonDeals = partnerDeals.filter((d: any) => d.status === "won");
      const openDeals = partnerDeals.filter((d: any) => d.status === "open");
      const registeredDeals = deals.filter((d: any) => d.registeredBy === partner._id);
      
      const totalRevenue = partnerAttributions.reduce((s: number, a: any) => s + a.amount, 0);
      const totalCommission = partnerAttributions.reduce((s: number, a: any) => s + a.commissionAmount, 0);
      const openPipeline = openDeals.reduce((s: number, d: any) => s + d.amount, 0);
      
      // Calculate incentive eligibility thresholds
      const metrics = {
        dealsWon: wonDeals.length,
        dealsOpen: openDeals.length,
        dealsRegistered: registeredDeals.length,
        totalRevenue,
        totalCommission,
        openPipeline,
        touchpointCount: partnerTouchpoints.length,
        avgDealSize: wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0,
      };
      
      // Determine incentive eligibility based on performance
      const incentives = {
        spifEligible: metrics.dealsWon >= 3, // SPIF for 3+ closed deals
        bonusEligible: metrics.totalRevenue >= 100000, // Bonus for $100k+ revenue
        acceleratorEligible: metrics.dealsWon >= 5 && metrics.totalRevenue >= 200000, // Top performers
        dealRegBonus: metrics.dealsRegistered >= 2, // Deal registration bonus
      };
      
      return {
        ...partner,
        metrics,
        incentives,
        rank: 0, // Will be calculated after sorting
      };
    }).sort((a: any, b: any) => b.metrics.totalRevenue - a.metrics.totalRevenue)
      .map((p: any, idx: number) => ({ ...p, rank: idx + 1 }));
  },
});

/**
 * Get channel conflicts: deals with touchpoints from multiple partners
 */
export const getChannelConflicts = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    
    const deals = await ctx.db.query("deals")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .filter((q: any) => q.eq(q.field("status"), "open"))
      .collect();
    
    const touchpoints = await ctx.db.query("touchpoints")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();
    
    const partners = await ctx.db.query("partners")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();
    
    const partnerMap = new Map(partners.map((p: any) => [p._id.toString(), p]));
    
    // Find deals with multiple partner touchpoints
    const conflicts: any[] = [];
    
    for (const deal of deals) {
      const dealTouchpoints = touchpoints.filter((t: any) => t.dealId.toString() === deal._id.toString());
      const partnerIds = [...new Set(dealTouchpoints.map((t: any) => t.partnerId.toString()))];
      
      if (partnerIds.length > 1) {
        const involvedPartners = partnerIds.map((id: string) => {
          const partner = partnerMap.get(id);
          return partner ? { id, name: partner.name } : { id, name: "Unknown" };
        });
        
        conflicts.push({
          _id: deal._id,
          dealName: deal.name,
          dealAmount: deal.amount,
          status: "open", // These are detected conflicts, not yet resolved
          involvedPartners,
          touchpointCount: dealTouchpoints.length,
        });
      }
    }
    
    return conflicts;
  },
});
