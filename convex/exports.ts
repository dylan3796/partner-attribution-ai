import { query } from "./_generated/server";
import { getOrg } from "./lib/getOrg";

/**
 * Export queries — return full datasets for CSV download.
 * All org-scoped via getOrg.
 */

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return { partners: 0, deals: 0, payouts: 0, touchpoints: 0, auditLog: 0, commissionRules: 0, products: 0 };

    const [partners, deals, payouts, touchpoints, auditLog, commissionRules, products] = await Promise.all([
      ctx.db.query("partners").withIndex("by_organization", (q) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("deals").withIndex("by_organization", (q) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("payouts").withIndex("by_organization", (q) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("touchpoints").withIndex("by_organization", (q: any) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("audit_log").withIndex("by_organization", (q) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("commissionRules").withIndex("by_organization", (q) => q.eq("organizationId", org._id)).collect(),
      ctx.db.query("products").withIndex("by_organization", (q) => q.eq("organizationId", org._id)).collect(),
    ]);

    return {
      partners: partners.length,
      deals: deals.length,
      payouts: payouts.length,
      touchpoints: touchpoints.length,
      auditLog: auditLog.length,
      commissionRules: commissionRules.length,
      products: products.length,
    };
  },
});

export const getAllTouchpoints = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();

    // Enrich with partner and deal names
    const enriched = await Promise.all(
      touchpoints.map(async (tp) => {
        const partner = tp.partnerId ? await ctx.db.get(tp.partnerId) : null;
        const deal = tp.dealId ? await ctx.db.get(tp.dealId) : null;
        return {
          ...tp,
          partnerName: (partner as any)?.name ?? "",
          dealName: (deal as any)?.name ?? "",
        };
      })
    );

    return enriched;
  },
});

export const getAllPayouts = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();

    const enriched = await Promise.all(
      payouts.map(async (p) => {
        const partner = p.partnerId ? await ctx.db.get(p.partnerId) : null;
        return {
          ...p,
          partnerName: (partner as any)?.name ?? "",
        };
      })
    );

    return enriched;
  },
});

export const getAllDeals = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    return ctx.db
      .query("deals")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();
  },
});

export const getAllAuditLog = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    return ctx.db
      .query("audit_log")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();
  },
});
