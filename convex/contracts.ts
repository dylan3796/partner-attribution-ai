import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const contracts = await ctx.db.query("contracts").collect();
    // Enrich with partner name
    const enriched = await Promise.all(
      contracts.map(async (c) => {
        const partner = await ctx.db.get(c.partnerId);
        return {
          ...c,
          partnerName: partner?.name ?? "Unknown",
          partnerTier: partner?.tier ?? "bronze",
        };
      })
    );
    return enriched;
  },
});

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    title: v.string(),
    type: v.union(
      v.literal("partner_agreement"),
      v.literal("reseller"),
      v.literal("referral"),
      v.literal("oem"),
      v.literal("technology"),
      v.literal("co_sell")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("expiring_soon"),
      v.literal("expired"),
      v.literal("pending_renewal"),
      v.literal("draft"),
      v.literal("terminated")
    ),
    value: v.number(),
    commissionRate: v.number(),
    territory: v.optional(v.string()),
    autoRenew: v.boolean(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    signedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("contracts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    contractId: v.id("contracts"),
    status: v.union(
      v.literal("active"),
      v.literal("expiring_soon"),
      v.literal("expired"),
      v.literal("pending_renewal"),
      v.literal("draft"),
      v.literal("terminated")
    ),
  },
  handler: async (ctx, { contractId, status }) => {
    await ctx.db.patch(contractId, { status, updatedAt: Date.now() });
  },
});

export const seed = mutation({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    // Check if contracts already seeded
    const existing = await ctx.db.query("contracts").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).first();
    if (existing) return { seeded: false, message: "Contracts already exist" };

    const partners = await ctx.db.query("partners").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect();
    if (partners.length < 3) return { seeded: false, message: "Need at least 3 partners" };

    const now = Date.now();
    const contracts = [
      {
        organizationId, partnerId: partners[0]._id,
        title: "Strategic Partner Agreement 2025", type: "partner_agreement" as const,
        status: "active" as const, value: 500000, commissionRate: 25,
        territory: "North America", autoRenew: true,
        startDate: "2025-01-15", endDate: "2026-01-14",
        signedBy: "VP Partnerships", notes: "Includes co-marketing budget of $50k",
        createdAt: now, updatedAt: now,
      },
      {
        organizationId, partnerId: partners[1]._id,
        title: "Authorized Reseller Agreement", type: "reseller" as const,
        status: "expiring_soon" as const, value: 250000, commissionRate: 20,
        territory: "EMEA", autoRenew: false,
        startDate: "2024-06-01", endDate: "2026-03-01",
        signedBy: "Director of Alliances", notes: "Renewal discussion scheduled",
        createdAt: now, updatedAt: now,
      },
      {
        organizationId, partnerId: partners[2]._id,
        title: "Referral Partner Agreement", type: "referral" as const,
        status: "active" as const, value: 75000, commissionRate: 15,
        territory: "APAC", autoRenew: true,
        startDate: "2025-06-01", endDate: "2026-05-31",
        signedBy: "CEO", notes: "Strong pipeline in Singapore market",
        createdAt: now, updatedAt: now,
      },
      {
        organizationId, partnerId: partners.length > 3 ? partners[3]._id : partners[0]._id,
        title: "OEM Embedding License", type: "oem" as const,
        status: "pending_renewal" as const, value: 1200000, commissionRate: 30,
        territory: "Global", autoRenew: false,
        startDate: "2024-03-01", endDate: "2026-02-28",
        signedBy: "CTO", notes: "Negotiating expanded embedding rights",
        createdAt: now, updatedAt: now,
      },
      {
        organizationId, partnerId: partners.length > 4 ? partners[4]._id : partners[1]._id,
        title: "Technology Integration Partnership", type: "technology" as const,
        status: "active" as const, value: 800000, commissionRate: 22,
        territory: "North America + EMEA", autoRenew: true,
        startDate: "2025-04-01", endDate: "2027-03-31",
        signedBy: "SVP Alliances", notes: "Joint product launch Q2 2026",
        createdAt: now, updatedAt: now,
      },
    ];

    for (const c of contracts) {
      await ctx.db.insert("contracts", c);
    }
    return { seeded: true, message: `Seeded ${contracts.length} contracts` };
  },
});
