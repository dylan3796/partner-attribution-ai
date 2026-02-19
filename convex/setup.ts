import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Apply a program template (create org + initial config)
export const applyTemplate = mutation({
  args: {
    orgName: v.string(),
    templateId: v.string(),
    attributionModel: v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based")
    ),
    defaultCommissionRate: v.number(),
    payoutFrequency: v.string(),
    requireDealRegistration: v.boolean(),
    enableMDF: v.boolean(),
    selectedTiers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Create organization
    const orgId = await ctx.db.insert("organizations", {
      name: args.orgName,
      email: `admin@${args.orgName.toLowerCase().replace(/\s+/g, "")}.com`, // Placeholder
      apiKey: `pk_live_${crypto.randomUUID().replace(/-/g, "")}`, // Cryptographically secure API key
      plan: "growth",
      defaultAttributionModel: args.attributionModel,
      createdAt: Date.now(),
    });

    // Log setup completion
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      userId: "system",
      action: "organization_created",
      entityType: "organization",
      entityId: orgId,
      metadata: JSON.stringify({
        templateId: args.templateId,
        commissionRate: args.defaultCommissionRate,
        payoutFrequency: args.payoutFrequency,
        tiers: args.selectedTiers,
      }),
      createdAt: Date.now(),
    });

    return {
      organizationId: orgId,
      success: true,
    };
  },
});

// Create sample partner (for demo/testing)
export const createSamplePartner = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    email: v.string(),
    type: v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    ),
    commissionRate: v.number(),
    tier: v.optional(v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    )),
  },
  handler: async (ctx, args) => {
    const partnerId = await ctx.db.insert("partners", {
      organizationId: args.organizationId,
      name: args.name,
      email: args.email,
      type: args.type,
      tier: args.tier,
      commissionRate: args.commissionRate,
      status: "active",
      createdAt: Date.now(),
    });

    // Create a user for the partner (for portal access)
    await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      organizationId: args.organizationId,
      role: "partner",
      partnerId,
      createdAt: Date.now(),
    });

    return partnerId;
  },
});
