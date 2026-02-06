import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organizations/Companies using the platform
  organizations: defineTable({
    name: v.string(),
    email: v.string(),
    apiKey: v.string(),
    plan: v.union(v.literal("starter"), v.literal("growth"), v.literal("enterprise")),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_apiKey", ["apiKey"]),

  // Partners (affiliates, referral partners, etc.)
  partners: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    email: v.string(),
    type: v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    ),
    commissionRate: v.number(), // percentage (0-100)
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_org_and_status", ["organizationId", "status"]), // ⚡ Optimized compound index

  // Deals (sales opportunities)
  deals: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    amount: v.number(),
    status: v.union(
      v.literal("open"),
      v.literal("won"),
      v.literal("lost")
    ),
    closedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_org_and_status", ["organizationId", "status"]) // ⚡ Optimized for filtered queries
    .index("by_org_and_date", ["organizationId", "createdAt"]), // ⚡ Optimized for timeline queries

  // Touchpoints (partner interactions with deals)
  touchpoints: defineTable({
    organizationId: v.id("organizations"),
    dealId: v.id("deals"),
    partnerId: v.id("partners"),
    type: v.union(
      v.literal("referral"),
      v.literal("demo"),
      v.literal("content_share"),
      v.literal("introduction"),
      v.literal("proposal"),
      v.literal("negotiation")
    ),
    weight: v.optional(v.number()), // for role-based attribution
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"])
    .index("by_deal_and_date", ["dealId", "createdAt"]), // ⚡ Optimized for time-decay calculations

  // Attribution results (calculated when deal closes)
  attributions: defineTable({
    organizationId: v.id("organizations"),
    dealId: v.id("deals"),
    partnerId: v.id("partners"),
    model: v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based")
    ),
    percentage: v.number(),
    amount: v.number(),
    commissionAmount: v.number(),
    calculatedAt: v.number(),
  })
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"])
    .index("by_model", ["model"])
    .index("by_partner_and_date", ["partnerId", "calculatedAt"]), // ⚡ Optimized for partner history

  // Payouts tracking
  payouts: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("paid"),
      v.literal("failed")
    ),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_partner", ["partnerId"])
    .index("by_status", ["status"])
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"]), // ⚡ Optimized for admin dashboards
});
