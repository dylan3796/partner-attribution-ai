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

/**
 * Get real-time action items for the dashboard widget.
 * Replaces hardcoded values with actual Convex data.
 */
export const getActionItems = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org)
      return {
        tierReviewsPending: 0,
        partnersOnboarding: 0,
        unpaidCommissions: 0,
        pendingInvites: 0,
        emailTriggersActive: 0,
        emailTriggersTotal: 0,
        pendingMdfRequests: 0,
        pendingDealRegs: 0,
      };

    const [partners, payouts, invites, emailTemplates, mdfRequests, deals] =
      await Promise.all([
        ctx.db
          .query("partners")
          .withIndex("by_organization", (q: any) =>
            q.eq("organizationId", org._id)
          )
          .collect(),
        ctx.db
          .query("payouts")
          .withIndex("by_org_and_status", (q: any) =>
            q.eq("organizationId", org._id).eq("status", "pending_approval")
          )
          .collect(),
        ctx.db
          .query("partnerInvites")
          .withIndex("by_organization", (q: any) =>
            q.eq("organizationId", org._id)
          )
          .collect(),
        ctx.db
          .query("email_templates")
          .withIndex("by_organization", (q: any) =>
            q.eq("organizationId", org._id)
          )
          .collect(),
        ctx.db
          .query("mdfRequests")
          .withIndex("by_organization", (q: any) =>
            q.eq("organizationId", org._id)
          )
          .collect(),
        ctx.db
          .query("deals")
          .withIndex("by_organization", (q: any) =>
            q.eq("organizationId", org._id)
          )
          .collect(),
      ]);

    // Partners in "pending" status = still onboarding
    const partnersOnboarding = partners.filter(
      (p: any) => p.status === "pending"
    ).length;

    // Tier reviews: active partners without a tier assigned (need review)
    const tierReviewsPending = partners.filter(
      (p: any) => p.status === "active" && !p.tier
    ).length;

    // Unpaid commissions total
    const unpaidCommissions = payouts.reduce(
      (s: number, p: any) => s + p.amount,
      0
    );

    // Pending invites (not yet accepted)
    const pendingInvites = invites.filter(
      (i: any) => i.status === "pending"
    ).length;

    // Email triggers: enabled / total
    const enabledEmails = emailTemplates.filter(
      (t: any) => t.enabled
    ).length;

    // Pending MDF requests
    const pendingMdf = mdfRequests.filter(
      (r: any) => r.status === "pending"
    ).length;

    // Pending deal registrations
    const pendingDealRegs = deals.filter(
      (d: any) => d.registrationStatus === "pending"
    ).length;

    return {
      tierReviewsPending,
      partnersOnboarding,
      unpaidCommissions,
      pendingInvites,
      emailTriggersActive: enabledEmails,
      emailTriggersTotal: emailTemplates.length,
      pendingMdfRequests: pendingMdf,
      pendingDealRegs,
    };
  },
});

// ============================================================================
// Dashboard Sparkline Trends (12 monthly data points)
// ============================================================================

/**
 * Compute 12-month rolling trend data for dashboard sparklines.
 * Returns arrays for revenue, pipeline, partner count, and win rate.
 */
export const getTrends = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) {
      return {
        revenue: [] as number[],
        pipeline: [] as number[],
        partners: [] as number[],
        winRate: [] as number[],
      };
    }

    const [deals, partners] = await Promise.all([
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
    ]);

    const now = Date.now();
    const MS_PER_MONTH = 30.44 * 24 * 60 * 60 * 1000; // avg days/month

    // Build 12 monthly buckets (index 0 = 12 months ago, index 11 = current month)
    const revenue: number[] = [];
    const pipeline: number[] = [];
    const partnerCounts: number[] = [];
    const winRates: number[] = [];

    for (let i = 11; i >= 0; i--) {
      const monthEnd = now - i * MS_PER_MONTH;
      const monthStart = monthEnd - MS_PER_MONTH;

      // Revenue: cumulative won deals up to this month
      const wonByMonth = deals.filter(
        (d: any) => d.status === "won" && d.createdAt <= monthEnd
      );
      revenue.push(wonByMonth.reduce((s: number, d: any) => s + d.amount, 0));

      // Pipeline: open deals that existed during this month
      const openByMonth = deals.filter(
        (d: any) =>
          d.createdAt <= monthEnd &&
          (d.status === "open" || (d.status === "won" && d.createdAt > monthStart))
      );
      pipeline.push(openByMonth.reduce((s: number, d: any) => s + d.amount, 0));

      // Partners: count of partners created up to this month
      const partnersByMonth = partners.filter(
        (p: any) => p.createdAt <= monthEnd
      );
      partnerCounts.push(partnersByMonth.length);

      // Win rate: won / (won + lost) for deals closed up to this month
      const closedByMonth = deals.filter(
        (d: any) =>
          (d.status === "won" || d.status === "lost") &&
          d.createdAt <= monthEnd
      );
      const wonCount = closedByMonth.filter((d: any) => d.status === "won").length;
      const closedCount = closedByMonth.length;
      winRates.push(closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0);
    }

    return { revenue, pipeline, partners: partnerCounts, winRate: winRates };
  },
});

/**
 * Program Health Score — composite 0-100 score for VP executive reporting.
 * Synthesizes: partner activity, deal velocity, payout health, program growth.
 */
export const getProgramHealth = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return null;

    const [deals, partners, payouts, touchpoints] = await Promise.all([
      ctx.db.query("deals").withIndex("by_organization", (q: any) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("partners").withIndex("by_organization", (q: any) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("payouts").withIndex("by_organization", (q: any) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("touchpoints").withIndex("by_organization", (q: any) => q.eq("organizationId", org._id)).collect(),
    ]);

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

    // ── 1. Partner Engagement (0-25) ──
    // % of active partners with a touchpoint in last 90 days
    const activePartners = partners.filter((p: any) => p.status === "active");
    const totalActive = activePartners.length;
    const engagedPartners = totalActive > 0
      ? activePartners.filter((p: any) => {
          return touchpoints.some((t: any) => t.partnerId === p._id && t.createdAt >= ninetyDaysAgo);
        }).length
      : 0;
    const engagementRate = totalActive > 0 ? engagedPartners / totalActive : 0;
    const engagementScore = Math.round(Math.min(engagementRate * 1.25, 1) * 25); // 80%+ engagement = full marks

    // ── 2. Deal Velocity (0-25) ──
    // Based on win rate and recent deal activity
    const closedDeals = deals.filter((d: any) => d.status === "won" || d.status === "lost");
    const wonDeals = deals.filter((d: any) => d.status === "won");
    const winRate = closedDeals.length > 0 ? wonDeals.length / closedDeals.length : 0;
    const recentDeals = deals.filter((d: any) => d.createdAt >= thirtyDaysAgo);
    const dealActivity = Math.min(recentDeals.length / 5, 1); // 5+ deals in 30 days = full activity
    const velocityScore = Math.round((winRate * 0.6 + dealActivity * 0.4) * 25);

    // ── 3. Payout Health (0-25) ──
    // Low pending-to-total ratio = healthy
    const totalPayouts = payouts.length;
    const pendingPayouts = payouts.filter((p: any) => p.status === "pending_approval" || p.status === "pending");
    const paidPayouts = payouts.filter((p: any) => p.status === "paid");
    const payoutRatio = totalPayouts > 0 ? paidPayouts.length / totalPayouts : 1;
    const payoutScore = Math.round(payoutRatio * 25);

    // ── 4. Program Growth (0-25) ──
    // New partners and deals in last 30 days relative to total
    const newPartners30d = partners.filter((p: any) => p.createdAt >= thirtyDaysAgo).length;
    const partnerGrowth = totalActive > 0 ? Math.min(newPartners30d / totalActive, 1) : (newPartners30d > 0 ? 1 : 0);
    const newDeals30d = deals.filter((d: any) => d.createdAt >= thirtyDaysAgo).length;
    const dealGrowth = deals.length > 0 ? Math.min(newDeals30d / Math.max(deals.length * 0.2, 1), 1) : (newDeals30d > 0 ? 1 : 0);
    const growthScore = Math.round((partnerGrowth * 0.5 + dealGrowth * 0.5) * 25);

    const overall = engagementScore + velocityScore + payoutScore + growthScore;

    return {
      overall,
      categories: {
        engagement: { score: engagementScore, max: 25, label: "Partner Engagement", detail: `${engagedPartners}/${totalActive} active in 90d` },
        velocity: { score: velocityScore, max: 25, label: "Deal Velocity", detail: `${Math.round(winRate * 100)}% win rate` },
        payouts: { score: payoutScore, max: 25, label: "Payout Health", detail: `${pendingPayouts.length} pending` },
        growth: { score: growthScore, max: 25, label: "Program Growth", detail: `+${newPartners30d} partners, +${newDeals30d} deals (30d)` },
      },
    };
  },
});
