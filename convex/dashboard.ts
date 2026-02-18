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
