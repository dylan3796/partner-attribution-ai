import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Retrieve the first (only) organization, or null if not yet seeded */
import { getOrg } from "./lib/getOrg";

async function defaultOrg(ctx: any) {
  return await getOrg(ctx);
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

    // Batch-fetch all unique deals referenced by touchpoints and attributions
    const uniqueDealIds = [...new Set([
      ...touchpoints.map((tp) => tp.dealId),
      ...attributions.map((attr) => attr.dealId),
    ])];
    const dealResults = await Promise.all(uniqueDealIds.map((id) => ctx.db.get(id)));
    const dealMap = new Map(dealResults.filter(Boolean).map((d) => [d!._id, d]));

    // Enrich touchpoints with deal info
    const enrichedTouchpoints = touchpoints.map((tp) => ({
      ...tp,
      deal: dealMap.get(tp.dealId) ?? null,
    }));

    // Enrich attributions with deal info
    const enrichedAttributions = attributions.map((attr) => ({
      ...attr,
      deal: dealMap.get(attr.dealId) ?? null,
    }));

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
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

export const updateTags = mutation({
  args: {
    id: v.id("partners"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { tags: args.tags });
    return { success: true };
  },
});

// ── Bulk Operations ───────────────────────────────────────────────────────

export const bulkAddTag = mutation({
  args: {
    ids: v.array(v.id("partners")),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    let updated = 0;
    for (const id of args.ids) {
      const partner = await ctx.db.get(id);
      if (!partner) continue;
      const tags = partner.tags ?? [];
      if (!tags.includes(args.tag)) {
        await ctx.db.patch(id, { tags: [...tags, args.tag] });
        updated++;
      }
    }
    return { updated };
  },
});

export const bulkRemoveTag = mutation({
  args: {
    ids: v.array(v.id("partners")),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    let updated = 0;
    for (const id of args.ids) {
      const partner = await ctx.db.get(id);
      if (!partner) continue;
      const tags = partner.tags ?? [];
      if (tags.includes(args.tag)) {
        await ctx.db.patch(id, { tags: tags.filter((t) => t !== args.tag) });
        updated++;
      }
    }
    return { updated };
  },
});

export const bulkUpdateTier = mutation({
  args: {
    ids: v.array(v.id("partners")),
    tier: v.union(v.literal("bronze"), v.literal("silver"), v.literal("gold"), v.literal("platinum")),
  },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.patch(id, { tier: args.tier });
    }
    return { updated: args.ids.length };
  },
});

export const bulkUpdateStatus = mutation({
  args: {
    ids: v.array(v.id("partners")),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.patch(id, { status: args.status });
    }
    return { updated: args.ids.length };
  },
});

export const remove = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const listAllTags = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();
    const tagSet = new Set<string>();
    for (const p of partners) {
      if (p.tags) {
        for (const t of p.tags) tagSet.add(t);
      }
    }
    return Array.from(tagSet).sort();
  },
});

// ── Enhanced Queries ────────────────────────────────────────────────────────

export const listWithStats = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];

    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();

    // Fetch all deals and payouts for the org upfront (avoid N+1 per partner)
    const [allDeals, allPayouts] = await Promise.all([
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("payouts")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
    ]);

    // Group deals by registeredBy partner
    const dealsByPartner = new Map<string, typeof allDeals>();
    for (const d of allDeals) {
      if (d.registeredBy) {
        const arr = dealsByPartner.get(d.registeredBy) ?? [];
        arr.push(d);
        dealsByPartner.set(d.registeredBy, arr);
      }
    }

    // Group payouts by partner
    const payoutsByPartner = new Map<string, typeof allPayouts>();
    for (const p of allPayouts) {
      const arr = payoutsByPartner.get(p.partnerId) ?? [];
      arr.push(p);
      payoutsByPartner.set(p.partnerId, arr);
    }

    return partners.map((partner) => {
      const deals = dealsByPartner.get(partner._id) ?? [];
      const wonDeals = deals.filter((d) => d.status === "won");
      const revenue = wonDeals.reduce((s, d) => s + d.amount, 0);
      const payouts = payoutsByPartner.get(partner._id) ?? [];

      return {
        ...partner,
        dealCount: deals.length,
        wonDealCount: wonDeals.length,
        revenue,
        pendingPayouts: payouts.filter((p) => p.status === "pending_approval").length,
        totalPaid: payouts
          .filter((p) => p.status === "paid")
          .reduce((s, p) => s + p.amount, 0),
      };
    });
  },
});
