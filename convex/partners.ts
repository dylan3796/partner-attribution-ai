import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Retrieve the first (only) organization, or null if not yet seeded */
async function defaultOrg(ctx: any) {
  return await ctx.db.query("organizations").first();
}

// ── Queries ────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("partners")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    const partner = await ctx.db.get(args.id);
    if (!partner) return null;

    // Fetch related deals (registered by this partner)
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_registered_partner", (q) => q.eq("registeredBy", args.id))
      .collect();

    // Fetch payouts for this partner
    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.id))
      .collect();

    // Fetch touchpoints for this partner
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.id))
      .collect();

    // Fetch attributions for this partner
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.id))
      .collect();

    // Enrich touchpoints with deal info
    const enrichedTouchpoints = await Promise.all(
      touchpoints.map(async (tp) => {
        const deal = await ctx.db.get(tp.dealId);
        return { ...tp, deal };
      })
    );

    // Enrich attributions with deal info
    const enrichedAttributions = await Promise.all(
      attributions.map(async (attr) => {
        const deal = await ctx.db.get(attr.dealId);
        return { ...attr, deal };
      })
    );

    return {
      ...partner,
      deals,
      payouts,
      touchpoints: enrichedTouchpoints,
      attributions: enrichedAttributions,
    };
  },
});

export const getPayoutsForPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payouts")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .collect();
  },
});

export const getDealsForPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deals")
      .withIndex("by_registered_partner", (q) => q.eq("registeredBy", args.partnerId))
      .collect();
  },
});

// ── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    type: v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    ),
    tier: v.optional(
      v.union(
        v.literal("bronze"),
        v.literal("silver"),
        v.literal("gold"),
        v.literal("platinum")
      )
    ),
    commissionRate: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending")
    ),
    contactName: v.optional(v.string()),
    territory: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found. Run seed data first.");
    return await ctx.db.insert("partners", {
      ...args,
      organizationId: org._id,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("partners"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("pending")
      )
    ),
    tier: v.optional(
      v.union(
        v.literal("bronze"),
        v.literal("silver"),
        v.literal("gold"),
        v.literal("platinum")
      )
    ),
    commissionRate: v.optional(v.number()),
    territory: v.optional(v.string()),
    notes: v.optional(v.string()),
    contactName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

export const remove = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
