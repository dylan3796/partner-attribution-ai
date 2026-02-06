/**
 * Enhanced Convex Schema for Partner Attribution Platform
 * 
 * Optimizations included:
 * - Compound indexes for common query patterns
 * - Soft delete pattern (deletedAt)
 * - Denormalized stats for performance
 * - Pre-computed analytics table
 * - Usage tracking for rate limiting
 * 
 * To use: Rename this file to schema.ts (backup old one first)
 * Run: npx convex dev
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organizations/Companies using the platform
  organizations: defineTable({
    name: v.string(),
    email: v.string(),
    apiKey: v.string(),
    plan: v.union(
      v.literal("starter"),
      v.literal("growth"),
      v.literal("enterprise")
    ),
    stripeCustomerId: v.optional(v.string()),
    
    // Settings configuration
    settings: v.object({
      defaultAttributionModel: v.string(), // "equal_split", "first_touch", etc.
      autoCalculateAttribution: v.boolean(),
      webhookUrl: v.optional(v.string()),
      timezone: v.string(), // e.g., "America/Los_Angeles"
    }),
    
    // Usage tracking (for rate limiting and plan limits)
    usage: v.object({
      partnerCount: v.number(),
      dealCount: v.number(),
      apiCallsThisMonth: v.number(),
    }),
    
    // Activity tracking
    lastActiveAt: v.number(),
    
    // Soft delete
    deletedAt: v.optional(v.number()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_apiKey", ["apiKey"])
    .index("by_plan_and_active", ["plan", "deletedAt"]) // Analytics queries
    .index("by_lastActive", ["lastActiveAt"]), // Churn detection

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
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending")
    ),
    
    // Denormalized stats (performance optimization)
    stats: v.object({
      totalDeals: v.number(),
      totalRevenue: v.number(),
      avgDealSize: v.number(),
      lastDealAt: v.optional(v.number()),
    }),
    
    // Contact information (optional)
    contact: v.optional(v.object({
      phone: v.optional(v.string()),
      company: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_organization_and_status", ["organizationId", "status"]) // Filter active partners
    .index("by_organization_and_type", ["organizationId", "type"]), // Filter by partner type

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
    
    // Deal metadata
    metadata: v.optional(v.object({
      industry: v.optional(v.string()),
      source: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
    
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_organization_and_status", ["organizationId", "status"]) // Common filter
    .index("by_organization_and_closedAt", ["organizationId", "closedAt"]), // Date range queries

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
    weight: v.optional(v.number()), // For role-based attribution
    notes: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"])
    .index("by_deal_and_created", ["dealId", "createdAt"]), // Chronological order

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
    percentage: v.number(), // 0-100
    amount: v.number(),
    commissionAmount: v.number(),
    
    // Attribution metadata
    touchpointIds: v.array(v.id("touchpoints")), // Which touchpoints contributed
    metadata: v.optional(v.object({
      calculationTimeMs: v.number(),
      touchpointCount: v.number(),
    })),
    
    calculatedAt: v.number(),
  })
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"])
    .index("by_model", ["model"])
    .index("by_organization_and_deal", ["organizationId", "dealId"]), // Lookup specific deal

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
    
    // Stripe/payment details
    paymentMethod: v.optional(v.string()), // "stripe", "paypal", "manual"
    transactionId: v.optional(v.string()),
    
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_partner", ["partnerId"])
    .index("by_status", ["status"])
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_status", ["organizationId", "status"]), // Filter pending payouts

  // Pre-computed analytics (performance optimization)
  analytics: defineTable({
    organizationId: v.id("organizations"),
    period: v.string(), // "2025-02-03" (daily) or "2025-02" (monthly)
    type: v.union(v.literal("daily"), v.literal("monthly")),
    
    metrics: v.object({
      totalRevenue: v.number(),
      dealsWon: v.number(),
      dealsLost: v.number(),
      dealsOpen: v.number(),
      avgDealSize: v.number(),
      conversionRate: v.number(), // won / (won + lost)
      
      // Top performers
      topPartners: v.array(v.object({
        partnerId: v.id("partners"),
        name: v.string(),
        revenue: v.number(),
        dealCount: v.number(),
      })),
    }),
    
    calculatedAt: v.number(),
  })
    .index("by_organization_and_period", ["organizationId", "period"])
    .index("by_period", ["period"]) // Global analytics across all orgs
    .index("by_type", ["type"]), // Separate daily/monthly queries

  // API usage tracking (for rate limiting and analytics)
  apiUsage: defineTable({
    organizationId: v.id("organizations"),
    endpoint: v.string(), // e.g., "/api/v1/touchpoints"
    method: v.string(), // "GET", "POST", etc.
    statusCode: v.number(), // 200, 400, 500, etc.
    responseTimeMs: v.number(),
    
    // Request metadata
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
    })),
    
    timestamp: v.number(),
  })
    .index("by_organization_and_time", ["organizationId", "timestamp"])
    .index("by_endpoint", ["endpoint"]) // Analyze endpoint performance
    .index("by_timestamp", ["timestamp"]), // Cleanup old records

  // Pending attribution calculations queue
  pendingAttributions: defineTable({
    dealId: v.id("deals"),
    organizationId: v.id("organizations"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("complete"),
      v.literal("failed")
    ),
    model: v.optional(v.string()), // Override default model
    
    // Error handling
    error: v.optional(v.string()),
    retryCount: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_deal", ["dealId"])
    .index("by_created", ["createdAt"]), // FIFO processing
});
