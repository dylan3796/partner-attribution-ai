import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organizations/Companies using the platform
  organizations: defineTable({
    name: v.string(),
    email: v.string(),
    apiKey: v.string(),
    plan: v.union(v.literal("starter"), v.literal("growth"), v.literal("enterprise")),
    defaultAttributionModel: v.optional(v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based"),
      v.literal("deal_reg_protection"),
      v.literal("source_wins"),
      v.literal("role_split")
    )),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_apiKey", ["apiKey"]),

  // Users (internal team + partner portal users)
  users: defineTable({
    email: v.string(),
    name: v.string(),
    organizationId: v.id("organizations"),
    role: v.union(
      v.literal("admin"),
      v.literal("manager"),
      v.literal("member"),
      v.literal("partner")
    ),
    clerkId: v.optional(v.string()),
    partnerId: v.optional(v.id("partners")),
    avatarUrl: v.optional(v.string()),
    lastLoginAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_clerkId", ["clerkId"]),

  // Partners (companies, not individuals)
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
    tier: v.optional(v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    )),
    commissionRate: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
    contactName: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    territory: v.optional(v.string()),
    notes: v.optional(v.string()),
    // Stripe Connect fields
    stripeAccountId: v.optional(v.string()),
    stripeOnboarded: v.optional(v.boolean()),
    stripeOnboardingUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_stripe_account", ["stripeAccountId"]),

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
    expectedCloseDate: v.optional(v.number()),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    notes: v.optional(v.string()),
    registeredBy: v.optional(v.id("partners")),
    registrationStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    )),
    // CRM integration fields
    salesforceId: v.optional(v.string()),
    source: v.optional(v.union(
      v.literal("manual"),
      v.literal("salesforce"),
      v.literal("hubspot")
    )),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_org_and_date", ["organizationId", "createdAt"])
    .index("by_registered_partner", ["registeredBy"])
    .index("by_salesforce_id", ["salesforceId"]),

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
      v.literal("negotiation"),
      v.literal("deal_registration"),
      v.literal("co_sell"),
      v.literal("technical_enablement")
    ),
    weight: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"])
    .index("by_deal_and_date", ["dealId", "createdAt"]),

  // Attribution results
  attributions: defineTable({
    organizationId: v.id("organizations"),
    dealId: v.id("deals"),
    partnerId: v.id("partners"),
    // Supports: equal_split, first_touch, last_touch, time_decay, role_based, deal_reg_protection, source_wins, role_split
    model: v.union(
      v.literal("equal_split"),
      v.literal("first_touch"),
      v.literal("last_touch"),
      v.literal("time_decay"),
      v.literal("role_based"),
      v.literal("deal_reg_protection"),
      v.literal("source_wins"),
      v.literal("role_split")
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
    .index("by_partner_and_date", ["partnerId", "calculatedAt"]),

  // Payouts
  payouts: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    amount: v.number(),
    status: v.union(
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("processing"),
      v.literal("paid"),
      v.literal("failed")
    ),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    period: v.optional(v.string()),
    notes: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    // Stripe payout fields
    stripeTransferId: v.optional(v.string()),
    paidVia: v.optional(v.union(v.literal("stripe"), v.literal("manual"))),
    stripeError: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_partner", ["partnerId"])
    .index("by_status", ["status"])
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_stripe_transfer", ["stripeTransferId"]),

  // Audit log
  audit_log: defineTable({
    organizationId: v.id("organizations"),
    userId: v.optional(v.string()),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    changes: v.optional(v.string()),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_org_and_date", ["organizationId", "createdAt"]),

  // Approval workflows
  approvals: defineTable({
    organizationId: v.id("organizations"),
    entityType: v.union(
      v.literal("payout"),
      v.literal("deal_registration"),
      v.literal("tier_change"),
      v.literal("dispute")
    ),
    entityId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    requestedBy: v.string(),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_entity", ["entityType", "entityId"]),

  // Disputes (partner-initiated)
  disputes: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    dealId: v.id("deals"),
    currentPercentage: v.number(),
    requestedPercentage: v.number(),
    reason: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("under_review"),
      v.literal("resolved"),
      v.literal("rejected")
    ),
    resolution: v.optional(v.string()),
    resolvedBy: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_deal", ["dealId"])
    .index("by_status", ["status"]),

  // Salesforce CRM connections
  salesforceConnections: defineTable({
    organizationId: v.id("organizations"),
    accessToken: v.string(),
    refreshToken: v.string(),
    instanceUrl: v.string(),
    salesforceOrgId: v.string(),
    salesforceOrgName: v.optional(v.string()),
    lastSyncedAt: v.optional(v.number()),
    connectedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_salesforce_org", ["salesforceOrgId"]),

  // In-app notifications
  notifications: defineTable({
    type: v.union(
      v.literal("deal_approved"),
      v.literal("commission_paid"),
      v.literal("partner_joined"),
      v.literal("tier_change"),
      v.literal("deal_disputed"),
      v.literal("system")
    ),
    title: v.string(),
    body: v.string(),
    read: v.boolean(),
    link: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_read", ["read"])
    .index("by_created", ["createdAt"]),

  // Leads (from landing page + partner submissions)
  leads: defineTable({
    email: v.string(),
    company: v.optional(v.string()),
    source: v.optional(v.string()), // "landing", "organic", "partner_submitted", etc.
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("demo_scheduled"),
      v.literal("demo_completed"),
      v.literal("qualified"),
      v.literal("customer"),
      v.literal("lost")
    ),
    submittedBy: v.optional(v.string()), // partnerId
    partnerName: v.optional(v.string()),
    contactName: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    createdAt: v.number(),
    lastSeenAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_submittedBy", ["submittedBy"]),

  // Agent task queue
  agent_tasks: defineTable({
    type: v.union(
      v.literal("lead_followup"),
      v.literal("demo_request"),
      v.literal("feature_request"),
      v.literal("bug_fix"),
      v.literal("content_write"),
      v.literal("outreach")
    ),
    assignedTo: v.union(
      v.literal("lead_manager"),
      v.literal("sales"),
      v.literal("content"),
      v.literal("builder"),
      v.literal("outreach")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("blocked")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    title: v.string(),
    description: v.string(),
    data: v.optional(v.string()), // JSON string
    result: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_agent", ["assignedTo"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"]),

  // Agent message board
  agent_messages: defineTable({
    from: v.union(
      v.literal("lead_manager"),
      v.literal("sales"),
      v.literal("content"),
      v.literal("builder"),
      v.literal("outreach")
    ),
    to: v.union(
      v.literal("lead_manager"),
      v.literal("sales"),
      v.literal("content"),
      v.literal("builder"),
      v.literal("outreach"),
      v.literal("all")
    ),
    content: v.string(),
    relatedTaskId: v.optional(v.id("agent_tasks")),
    read: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_recipient", ["to"])
    .index("by_timestamp", ["timestamp"]),

  // Agent activity log
  agent_activity: defineTable({
    agentRole: v.union(
      v.literal("lead_manager"),
      v.literal("sales"),
      v.literal("content"),
      v.literal("builder"),
      v.literal("outreach")
    ),
    action: v.string(),
    details: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_agent", ["agentRole"])
    .index("by_timestamp", ["timestamp"]),

  // Event Sources (webhook/integration endpoints)
  eventSources: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(), // "Shopify", "Stripe", "Custom Webhook", etc.
    type: v.union(
      v.literal("shopify"),
      v.literal("stripe"),
      v.literal("webhook"),
      v.literal("manual")
    ),
    webhookUrl: v.string(), // unique inbound URL for this source
    webhookSecret: v.optional(v.string()), // for signature verification
    eventMapping: v.string(), // JSON config mapping source fields to Covant event fields
    status: v.union(v.literal("active"), v.literal("paused")),
    createdAt: v.number(),
    lastEventAt: v.optional(v.number()),
    eventCount: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_org_and_status", ["organizationId", "status"]),

  // Inbound Events (received webhook payloads)
  inboundEvents: defineTable({
    organizationId: v.id("organizations"),
    sourceId: v.id("eventSources"),
    rawPayload: v.string(), // JSON stringified raw webhook payload
    eventType: v.string(), // e.g. "order.completed", "charge.succeeded"
    mappedFields: v.string(), // JSON of extracted: partnerId, amount, dealName, customerId
    status: v.union(
      v.literal("pending"),
      v.literal("matched"),
      v.literal("ignored"),
      v.literal("error")
    ),
    partnerMatch: v.optional(v.id("partners")), // if we could match to a partner
    dealCreated: v.optional(v.id("deals")), // if we created a deal from this event
    errorMessage: v.optional(v.string()), // error details if status is "error"
    receivedAt: v.number(),
    processedAt: v.optional(v.number()),
  })
    .index("by_source", ["sourceId"])
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_received", ["receivedAt"]),

  // Partner Applications (public form submissions)
  // Email notification templates
  email_templates: defineTable({
    organizationId: v.id("organizations"),
    trigger: v.string(), // e.g. "deal_won", "payout_approved", "tier_change"
    subject: v.string(),
    bodyHtml: v.string(),
    enabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_trigger", ["trigger"]),

  // MDF (Market Development Funds) requests
  mdfRequests: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    title: v.string(),
    description: v.string(),
    amount: v.number(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("completed")),
    category: v.optional(v.string()), // "event", "content", "advertising", "training"
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_status", ["status"]),

  // Partner invitations
  partnerInvites: defineTable({
    organizationId: v.id("organizations"),
    token: v.string(),
    email: v.optional(v.string()), // pre-fill if known
    partnerType: v.optional(v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    )),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    acceptedBy: v.optional(v.id("partners")),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"]),

  // Commission rules (complex/tiered)
  commissionRules: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    partnerType: v.optional(v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    )),
    partnerTier: v.optional(v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    )),
    productLine: v.optional(v.string()),
    rate: v.number(), // 0.0–1.0
    minDealSize: v.optional(v.number()),
    priority: v.number(), // lower = checked first
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_priority", ["organizationId", "priority"]),

  // Program configuration from setup wizard
  programConfig: defineTable({
    sessionId: v.string(),
    programName: v.optional(v.string()),
    programType: v.string(),
    interactionTypes: v.array(v.object({
      id: v.string(),
      label: v.string(),
      weight: v.number(),
      triggersAttribution: v.boolean(),
      triggersPayout: v.boolean(),
    })),
    attributionModel: v.string(), // equal_split | first_touch | last_touch | time_decay | role_based | deal_reg_protection | source_wins | role_split
    commissionRules: v.array(v.object({
      type: v.string(),
      value: v.number(),
      unit: v.string(),
      label: v.string(),
    })),
    enabledModules: v.array(v.string()),
    rawConfig: v.string(),
    configuredAt: v.number(),
  })
    .index("by_session", ["sessionId"]),

  // Outbound email queue / log
  email_queue: defineTable({
    organizationId: v.id("organizations"),
    trigger: v.string(),
    to: v.string(),
    toName: v.optional(v.string()),
    subject: v.string(),
    bodyHtml: v.string(),
    status: v.union(v.literal("queued"), v.literal("sent"), v.literal("failed")),
    metadata: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    error: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_trigger", ["trigger"])
    .index("by_created", ["createdAt"]),

  contracts: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_status", ["status"]),
});
