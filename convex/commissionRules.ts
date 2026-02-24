import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { getOrg } from "./lib/getOrg";
async function defaultOrg(ctx: any) {
  return await getOrg(ctx);
}

const partnerTypeValidator = v.optional(
  v.union(
    v.literal("affiliate"),
    v.literal("referral"),
    v.literal("reseller"),
    v.literal("integration")
  )
);

const partnerTierValidator = v.optional(
  v.union(
    v.literal("bronze"),
    v.literal("silver"),
    v.literal("gold"),
    v.literal("platinum")
  )
);

// ── List all rules for the org ───────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("commissionRules")
      .withIndex("by_org_priority", (q) => q.eq("organizationId", org._id))
      .collect();
  },
});

// ── Create a rule ────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    name: v.string(),
    partnerType: partnerTypeValidator,
    partnerTier: partnerTierValidator,
    productLine: v.optional(v.string()),
    rate: v.number(),
    minDealSize: v.optional(v.number()),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found.");

    return await ctx.db.insert("commissionRules", {
      organizationId: org._id,
      name: args.name,
      partnerType: args.partnerType,
      partnerTier: args.partnerTier,
      productLine: args.productLine,
      rate: args.rate,
      minDealSize: args.minDealSize,
      priority: args.priority,
      createdAt: Date.now(),
    });
  },
});

// ── Update a rule ────────────────────────────────────────────────────────

export const update = mutation({
  args: {
    id: v.id("commissionRules"),
    name: v.optional(v.string()),
    partnerType: partnerTypeValidator,
    partnerTier: partnerTierValidator,
    productLine: v.optional(v.string()),
    rate: v.optional(v.number()),
    minDealSize: v.optional(v.number()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    // Remove undefined fields
    const cleaned = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleaned);
  },
});

// ── Delete a rule ────────────────────────────────────────────────────────

export const remove = mutation({
  args: { id: v.id("commissionRules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ── Match: find the best rule for a given partner + deal ─────────────────

export const match = query({
  args: {
    partnerId: v.id("partners"),
    dealAmount: v.number(),
    productLine: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const partner = await ctx.db.get(args.partnerId);
    if (!partner) return null;

    const rules = await ctx.db
      .query("commissionRules")
      .withIndex("by_org_priority", (q) =>
        q.eq("organizationId", partner.organizationId)
      )
      .collect();

    // Find first matching rule (sorted by priority via index)
    for (const rule of rules) {
      if (rule.partnerType && rule.partnerType !== partner.type) continue;
      if (rule.partnerTier && rule.partnerTier !== (partner.tier ?? "bronze")) continue;
      if (rule.productLine && rule.productLine !== args.productLine) continue;
      if (rule.minDealSize && args.dealAmount < rule.minDealSize) continue;
      return rule;
    }

    // No match — return default
    return { name: "Default", rate: partner.commissionRate, priority: 999 };
  },
});
