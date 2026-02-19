/**
 * Dashboard stats queries — reads from real Convex data.
 */
import { query } from "./_generated/server";

async function defaultOrg(ctx: any) {
  return await ctx.db.query("organizations").first();
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
