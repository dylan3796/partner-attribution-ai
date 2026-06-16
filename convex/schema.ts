import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The 5 bounded, canonical attribution models. A Program selects exactly one.
const BOUNDED_MODEL_LITERALS = [
  v.literal("first_touch_sourcer"),
  v.literal("split_equally"),
  v.literal("role_weighted"),
  v.literal("implementation_credit"),
  v.literal("marketplace_cosell_hybrid"),
] as const;

/** Programs may only select a bounded model. */
const boundedModelValidator = v.union(...BOUNDED_MODEL_LITERALS);

/**
 * Storage validator for attributions.model. Includes the bounded set plus the
 * legacy literals so pre-existing rows still validate; once
 * migrations:migrateAttributionModels has run everywhere, the legacy literals
 * can be dropped. New writes only ever use the bounded set.
 */
const attributionModelValidator = v.union(
  ...BOUNDED_MODEL_LITERALS,
  v.literal("equal_split"),
  v.literal("first_touch"),
  v.literal("last_touch"),
  v.literal("time_decay"),
  v.literal("role_based"),
  v.literal("deal_reg_protection"),
  v.literal("source_wins"),
  v.literal("role_split")
);

// ============================================================================
// Channel Graph — shared validators (the no-fabrication substrate)
//
// Nothing enters the graph bare. Every node, edge, and attribute value is
// wrapped in a fact envelope that records WHERE it came from (sourceId) and
// WHAT proves it (evidencePointer), and stays distinguishable by method
// forever. These validators are reused across the graph tables below.
// ============================================================================

/** How a fact came to be known. asserted != inferred != user_confirmed (Law 3). */
const factMethodValidator = v.union(
  v.literal("asserted"), // deterministic from a system of record (CRM/sheet field)
  v.literal("inferred"), // model/heuristic — provisional until a human confirms
  v.literal("user_confirmed") // a human approved it (confidence 1.0)
);

/** What a fact is about. A subject points at a real row so the graph WRAPS data. */
const factSubjectKindValidator = v.union(
  v.literal("node"),
  v.literal("edge"),
  v.literal("attribute")
);

/** Where the proof lives: a field path (structured) OR an exact span (unstructured). */
const evidencePointerValidator = v.union(
  v.object({
    kind: v.literal("field_path"),
    path: v.string(), // e.g. "Opportunity.Amount" or "row[4].commission"
  }),
  v.object({
    kind: v.literal("span"),
    quote: v.string(), // exact verbatim substring of the source text (grounding check)
    startOffset: v.optional(v.number()),
    endOffset: v.optional(v.number()),
  })
);

/** Cloud platform for co-sell / marketplace records. */
const cloudPlatformValidator = v.union(
  v.literal("aws"),
  v.literal("azure"),
  v.literal("gcp"),
  v.literal("other")
);

export default defineSchema({
  // Organizations/Companies using the platform
  organizations: defineTable({
    name: v.string(),
    email: v.string(),
    apiKey: v.string(),
    plan: v.union(v.literal("starter"), v.literal("growth"), v.literal("enterprise")),
    defaultAttributionModel: v.optional(attributionModelValidator),
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
    tags: v.optional(v.array(v.string())),
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
    productName: v.optional(v.string()), // links to product catalog for commission rule matching
    programId: v.optional(v.id("programs")), // which attribution program this deal belongs to
    registeredBy: v.optional(v.id("partners")),
    registrationStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    )),
    // CRM integration fields
    salesforceId: v.optional(v.string()),
    hubspotId: v.optional(v.string()),
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
    .index("by_salesforce_id", ["salesforceId"])
    .index("by_hubspot_id", ["hubspotId"]),

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
      v.literal("technical_enablement"),
      v.literal("crm_sync")
    ),
    weight: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"])
    .index("by_deal_and_date", ["dealId", "createdAt"]),

  // Attribution results (the per-program ledger)
  attributions: defineTable({
    organizationId: v.id("organizations"),
    dealId: v.id("deals"),
    partnerId: v.id("partners"),
    programId: v.optional(v.id("programs")), // program whose model produced this row
    model: attributionModelValidator,
    percentage: v.number(), // 0-100
    amount: v.number(),
    commissionAmount: v.number(),
    reason: v.optional(v.string()), // human-readable explanation from the model
    calculatedAt: v.number(),
  })
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"])
    .index("by_model", ["model"])
    .index("by_program", ["programId"])
    .index("by_deal_and_program", ["dealId", "programId"])
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
      v.literal("dispute"),
      // Channel Graph learn loop — inferred facts, merges, and conflicts ride the
      // same proposed -> approved/rejected lifecycle. entityId points at the
      // facts / entityResolutionQueue / conflicts row under review.
      v.literal("fact_inference"),
      v.literal("entity_merge"),
      v.literal("conflict_resolution")
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
  hubspotConnections: defineTable({
    organizationId: v.id("organizations"),
    accessToken: v.string(),
    refreshToken: v.string(),
    hubspotPortalId: v.string(),
    hubspotPortalName: v.optional(v.string()),
    lastSyncedAt: v.optional(v.number()),
    connectedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_portal", ["hubspotPortalId"]),

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
    programId: v.optional(v.id("programs")), // program-specific rule; undefined = org-wide
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
    .index("by_org_priority", ["organizationId", "priority"])
    .index("by_program", ["programId"]),

  // Programs: a customer runs several partner programs in parallel (SI, cloud
  // co-sell, tech/ISV, reseller). Each program selects ONE bounded attribution
  // model + config. Deals, commission rules, and ledger rows are scoped to a
  // program so we can report per-program AND roll up.
  programs: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    archetype: v.union(
      v.literal("si"),
      v.literal("cloud_cosell"),
      v.literal("tech_isv"),
      v.literal("reseller"),
      v.literal("other")
    ),
    selectedModel: boundedModelValidator,
    modelConfig: v.optional(v.string()), // JSON-serialized ModelConfig
    isDefault: v.optional(v.boolean()), // org fallback program for unassigned deals
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_archetype", ["organizationId", "archetype"]),

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

  // Covant subscriptions (Stripe billing)
  subscriptions: defineTable({
    userId: v.string(),               // Clerk userId
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    plan: v.union(v.literal("starter"), v.literal("growth")),
    interval: v.union(v.literal("month"), v.literal("year")),
    status: v.union(
      v.literal("active"),
      v.literal("trialing"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("incomplete")
    ),
    currentPeriodEnd: v.number(),     // unix timestamp
    cancelAtPeriodEnd: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),

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
      v.literal("co_sell"),
      v.literal("msa") // master service agreement (ingested from a document SourceDocument)
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

  // Outbound Webhook Endpoints — notify external systems when events happen in Covant
  webhookEndpoints: defineTable({
    organizationId: v.id("organizations"),
    url: v.string(),
    description: v.optional(v.string()),
    secret: v.string(), // HMAC signing secret
    events: v.array(v.string()), // e.g. ["deal.created", "partner.joined"]
    status: v.union(v.literal("active"), v.literal("paused")),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastTriggeredAt: v.optional(v.number()),
    failureCount: v.number(), // consecutive failures
    lastError: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"]),

  // Partner Applications (inbound partner acquisition)
  partnerApplications: defineTable({
    organizationId: v.optional(v.id("organizations")),
    companyName: v.string(),
    contactName: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    partnerType: v.union(
      v.literal("reseller"),
      v.literal("referral"),
      v.literal("integration"),
      v.literal("affiliate")
    ),
    partnerCount: v.optional(v.string()), // "1-10", "11-50", etc.
    message: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    reviewNote: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_email", ["email"])
    .index("by_created", ["createdAt"]),

  // Notification Preferences — per-user notification settings
  notificationPreferences: defineTable({
    userId: v.string(), // Clerk userId
    organizationId: v.optional(v.id("organizations")),
    // In-app notification toggles
    inApp: v.object({
      deal_approved: v.boolean(),
      deal_registered: v.boolean(),
      deal_disputed: v.boolean(),
      commission_paid: v.boolean(),
      partner_joined: v.boolean(),
      partner_application: v.boolean(),
      tier_change: v.boolean(),
      payout_ready: v.boolean(),
      system: v.boolean(),
    }),
    // Email digest settings
    emailDigest: v.union(
      v.literal("off"),
      v.literal("instant"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    emailEvents: v.object({
      deal_approved: v.boolean(),
      deal_registered: v.boolean(),
      deal_disputed: v.boolean(),
      commission_paid: v.boolean(),
      partner_joined: v.boolean(),
      partner_application: v.boolean(),
      tier_change: v.boolean(),
      payout_ready: v.boolean(),
    }),
    // Quiet hours (UTC)
    quietHoursEnabled: v.boolean(),
    quietHoursStart: v.optional(v.string()), // "22:00"
    quietHoursEnd: v.optional(v.string()),   // "08:00"
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  // API Keys — programmatic access management
  apiKeys: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),                  // user-friendly label e.g. "Production CRM Sync"
    prefix: v.string(),                // first 8 chars for identification e.g. "cvnt_a1b2"
    keyHash: v.string(),               // SHA-256 hash of full key (never store plaintext)
    scopes: v.array(v.string()),       // e.g. ["partners:read", "deals:read", "deals:write"]
    lastUsedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()), // optional expiration
    revokedAt: v.optional(v.number()),
    createdBy: v.optional(v.string()), // Clerk userId
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_prefix", ["prefix"])
    .index("by_keyHash", ["keyHash"]),

  // Product Catalog — enables product-level commission rules and deal registration
  products: defineTable({
    organizationId: v.id("organizations"),
    sku: v.string(),
    name: v.string(),
    category: v.string(),
    msrp: v.number(),
    distributorPrice: v.number(),
    margin: v.number(), // stored as integer percentage
    status: v.union(v.literal("active"), v.literal("inactive")),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_sku", ["sku"]),

  // Goals & Targets — quarterly program objectives
  goals: defineTable({
    organizationId: v.id("organizations"),
    metric: v.union(
      v.literal("revenue"),
      v.literal("pipeline"),
      v.literal("partners"),
      v.literal("deals"),
      v.literal("win_rate")
    ),
    label: v.string(), // user-friendly name e.g. "Q1 Revenue Target"
    target: v.number(), // target value (dollars, count, or percentage for win_rate)
    period: v.string(), // e.g. "Q1 2026", "Q2 2026"
    startDate: v.number(), // period start (unix ms)
    endDate: v.number(), // period end (unix ms)
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("missed")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_org_and_period", ["organizationId", "period"]),

  // Tier Review Decisions — persists approve/reject/defer actions on partner tier changes
  tierReviews: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    action: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("deferred")
    ),
    previousTier: v.string(),
    recommendedTier: v.string(),
    overallScore: v.number(),
    notes: v.optional(v.string()),
    reviewedBy: v.optional(v.string()), // Clerk userId
    reviewedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_org_and_partner", ["organizationId", "partnerId"]),

  // Outbound Webhook Delivery Log
  webhookDeliveries: defineTable({
    organizationId: v.id("organizations"),
    endpointId: v.id("webhookEndpoints"),
    event: v.string(),
    payload: v.string(), // JSON stringified
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("pending")),
    httpStatus: v.optional(v.number()),
    responseBody: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    attemptCount: v.number(),
    deliveredAt: v.number(),
  })
    .index("by_endpoint", ["endpointId"])
    .index("by_organization", ["organizationId"])
    .index("by_org_and_event", ["organizationId", "event"]),

  // Partner territories — assigned account lists and regions
  territories: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    region: v.string(),
    partnerId: v.id("partners"),
    accounts: v.array(v.string()), // company names
    isExclusive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_org_and_partner", ["organizationId", "partnerId"]),

  // Channel conflicts — overlapping territory/account disputes
  channelConflicts: defineTable({
    organizationId: v.id("organizations"),
    dealId: v.optional(v.id("deals")),
    accountName: v.string(),
    partnerIds: v.array(v.id("partners")),
    primaryPartnerId: v.optional(v.id("partners")),
    status: v.union(
      v.literal("open"),
      v.literal("under_review"),
      v.literal("resolved"),
      v.literal("escalated")
    ),
    resolution: v.optional(v.union(
      v.literal("assign_primary"),
      v.literal("split_credit"),
      v.literal("escalated"),
      v.literal("dismissed")
    )),
    resolutionNotes: v.optional(v.string()),
    resolvedBy: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    reportedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"]),

  // Volume rebate programs
  volumePrograms: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    period: v.union(v.literal("quarterly"), v.literal("annual")),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(v.literal("active"), v.literal("draft"), v.literal("completed")),
    tiers: v.array(v.object({
      minUnits: v.number(),
      maxUnits: v.union(v.number(), v.null()),
      rebatePercent: v.number(),
      label: v.string(),
    })),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"]),

  // Partner volume records — tracking units/revenue per partner per program
  partnerVolumes: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    programId: v.id("volumePrograms"),
    period: v.string(), // e.g. "2026-Q1"
    unitsTotal: v.number(),
    revenueTotal: v.number(),
    currentTierIndex: v.number(),
    rebateAccrued: v.number(),
    rebateProjected: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_program", ["programId"])
    .index("by_org_and_partner", ["organizationId", "partnerId"]),

  // Certification programs — defined by org admins
  certifications: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert")
    ),
    category: v.union(
      v.literal("sales"),
      v.literal("technical"),
      v.literal("product"),
      v.literal("compliance")
    ),
    requiredForTier: v.optional(v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    )),
    validityMonths: v.optional(v.number()), // how long cert is valid, null = never expires
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"]),

  // Partner certification records — tracks which partners hold which certs
  partnerCertifications: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    certificationId: v.id("certifications"),
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("expired"),
      v.literal("revoked")
    ),
    completedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    score: v.optional(v.number()), // optional score 0-100
    notes: v.optional(v.string()),
    awardedBy: v.optional(v.string()), // who granted it
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_certification", ["certificationId"])
    .index("by_org_and_partner", ["organizationId", "partnerId"])
    .index("by_org_and_cert", ["organizationId", "certificationId"]),

  // Partner notes — threaded internal notes per partner
  partnerNotes: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    authorName: v.string(),
    authorEmail: v.string(),
    content: v.string(),
    isPinned: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_partner", ["partnerId"])
    .index("by_org_and_partner", ["organizationId", "partnerId"]),

  // Announcements — admin broadcasts to partners
  announcements: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    body: v.string(),
    type: v.union(
      v.literal("general"),
      v.literal("product"),
      v.literal("incentive"),
      v.literal("policy"),
      v.literal("event")
    ),
    isPinned: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    authorName: v.string(),
    authorEmail: v.string(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_published", ["organizationId", "isPublished"]),

  // ==========================================================================
  // CHANNEL GRAPH — provenance substrate (wraps the operational tables above)
  //
  // Design: existing tables (partners/deals/touchpoints/...) stay the
  // system-of-record. The graph adds (1) a universal `facts` envelope so no
  // value is bare, (2) `sourceDocuments` as the root of every evidence chain,
  // (3) `graphEdges` for relationships with no existing FK home, (4) node
  // tables for entities the channel taxonomy needs but the app never modeled,
  // and (5) resolution/conflict/extraction-staging tables for the firewall.
  // ==========================================================================

  // The root of every evidence chain (Law 1). Generalizes inboundEvents: a CRM
  // record, Slack message, email, PDF/MSA/RFP, sheet row, or webhook payload.
  sourceDocuments: defineTable({
    organizationId: v.id("organizations"),
    kind: v.union(
      v.literal("crm_record"),
      v.literal("slack"),
      v.literal("email"),
      v.literal("calendar"),
      v.literal("document"),
      v.literal("sheet_row"),
      v.literal("webhook"),
      v.literal("manual")
    ),
    // Set when kind === "document". MSA also asserts onto the contracts table.
    docType: v.optional(
      v.union(
        v.literal("msa"),
        v.literal("rfp"),
        v.literal("sow"),
        v.literal("deal_reg_pdf"),
        v.literal("commission_sheet"),
        v.literal("other")
      )
    ),
    adapter: v.string(), // which source adapter emitted this (e.g. "salesforce")
    externalRef: v.optional(v.string()), // id / url in the source system
    rawText: v.optional(v.string()), // raw text for grounding checks on unstructured sources
    rawPayloadRef: v.optional(v.string()), // pointer to a large raw payload in storage
    capturedAt: v.optional(v.number()), // when the source produced it (observed)
    ingestedAt: v.number(), // when Covant pulled it (recorded)
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_kind", ["organizationId", "kind"])
    .index("by_external_ref", ["externalRef"]),

  // THE fact envelope. Every node, edge, and attribute value lives here with its
  // provenance. Subject is stored flat (Convex can't index nested objects) and
  // points at any operational OR graph row. Conflicting facts about the same
  // subject coexist (Law 4); inferred facts stay provisional until confirmed.
  facts: defineTable({
    organizationId: v.id("organizations"),
    subjectKind: factSubjectKindValidator,
    subjectTable: v.string(), // e.g. "partners", "deals", "graphEdges", "accounts"
    subjectId: v.string(), // the row id (string form of a Convex Id)
    subjectField: v.optional(v.string()), // attribute name, or edge predicate
    value: v.any(), // the asserted/extracted value
    method: factMethodValidator,
    confidence: v.number(), // 1.0 only for asserted-from-system or user_confirmed
    sourceId: v.id("sourceDocuments"), // Law 1: never bare
    evidencePointer: evidencePointerValidator,
    observedAt: v.optional(v.number()), // when the fact was true in the world
    recordedAt: v.number(), // when Covant learned it
    status: v.union(v.literal("active"), v.literal("superseded")),
    supersededBy: v.optional(v.id("facts")),
    conflictId: v.optional(v.id("conflicts")),
  })
    .index("by_organization", ["organizationId"])
    .index("by_subject", ["subjectTable", "subjectId"])
    .index("by_subject_field", ["subjectTable", "subjectId", "subjectField"])
    .index("by_source", ["sourceId"])
    .index("by_org_and_method", ["organizationId", "method"])
    .index("by_conflict", ["conflictId"]),

  // Typed, directional relationships with no existing FK home. Existing FK
  // relationships (touchpoint->deal, etc.) are exposed as edges by an adapter in
  // convex/lib/graph and are NOT duplicated here. Each edge is provenanced by a
  // fact whose subject is (subjectTable="graphEdges", subjectId=<edge id>).
  graphEdges: defineTable({
    organizationId: v.id("organizations"),
    type: v.string(), // predicate: employs | parent_of | involved_in | account_mapping | cosell_link
    fromTable: v.string(),
    fromId: v.string(),
    toTable: v.string(),
    toId: v.string(),
    role: v.optional(v.string()), // e.g. involved_in role: sourcer|influencer|fulfiller|services
  })
    .index("by_organization", ["organizationId"])
    .index("by_from", ["fromTable", "fromId"])
    .index("by_to", ["toTable", "toId"])
    .index("by_org_and_type", ["organizationId", "type"]),

  // --- New node tables for entities the channel taxonomy needs (Cat A & C & E) ---

  // PartnerPerson: the humans at the partner (Cat A). partnerId optional so an
  // unresolved person is a first-class gap (Law 6) until resolution links them.
  partnerPersons: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.optional(v.id("partners")),
    name: v.string(),
    email: v.optional(v.string()),
    title: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_email", ["email"]),

  // VendorRep: the company's own people (channel managers, AEs) who touch a deal.
  vendorReps: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    email: v.optional(v.string()),
    role: v.optional(v.string()), // channel_manager | ae | se ...
    crmUserId: v.optional(v.string()), // e.g. Salesforce OwnerId
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_crm_user", ["crmUserId"]),

  // Account: the end customer. Today deals only carry free-text contactName.
  accounts: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    domain: v.optional(v.string()),
    salesforceId: v.optional(v.string()),
    hubspotId: v.optional(v.string()),
    industry: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_domain", ["domain"])
    .index("by_salesforce_id", ["salesforceId"])
    .index("by_hubspot_id", ["hubspotId"]),

  // Deal registration as a first-class lifecycle (Cat C): submitted -> approved
  // -> rejected -> expired, with a protection window. Replaces the two bare
  // fields on deals (which remain for backward compatibility).
  dealRegistrations: defineTable({
    organizationId: v.id("organizations"),
    dealId: v.optional(v.id("deals")), // may be unresolved at submit time
    partnerId: v.id("partners"),
    state: v.union(
      v.literal("submitted"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("expired")
    ),
    submittedAt: v.number(),
    decidedAt: v.optional(v.number()),
    protectionWindowEnds: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_deal", ["dealId"])
    .index("by_partner", ["partnerId"])
    .index("by_org_and_state", ["organizationId", "state"]),

  // Cloud co-sell record (Cat E). Stores the HYPERSCALER's own sourced/influenced
  // classification, kept DISTINCT from our attribution view per spec §1.E.
  cosellRecords: defineTable({
    organizationId: v.id("organizations"),
    dealId: v.optional(v.id("deals")),
    partnerId: v.optional(v.id("partners")),
    platform: cloudPlatformValidator,
    externalId: v.optional(v.string()), // ACE opportunity id, etc.
    hyperscalerClassification: v.optional(
      v.union(v.literal("sourced"), v.literal("influenced"), v.literal("unknown"))
    ),
    stage: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_deal", ["dealId"])
    .index("by_external_id", ["externalId"]),

  // Marketplace economics (Cat D/E): private offers, EDP drawdown, fees.
  marketplaceTransactions: defineTable({
    organizationId: v.id("organizations"),
    accountId: v.optional(v.id("accounts")),
    dealId: v.optional(v.id("deals")),
    platform: cloudPlatformValidator,
    type: v.union(
      v.literal("private_offer"),
      v.literal("edp_drawdown"),
      v.literal("standard")
    ),
    amount: v.optional(v.number()),
    marketplaceFee: v.optional(v.number()),
    externalId: v.optional(v.string()),
    occurredAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_deal", ["dealId"])
    .index("by_external_id", ["externalId"]),

  // Account mapping / overlap from Crossbeam / Reveal (Cat E).
  accountMappings: defineTable({
    organizationId: v.id("organizations"),
    partnerId: v.id("partners"),
    accountId: v.optional(v.id("accounts")),
    accountName: v.string(),
    source: v.union(
      v.literal("crossbeam"),
      v.literal("reveal"),
      v.literal("manual")
    ),
    overlapType: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_account", ["accountId"]),

  // --- Firewall / resolution / conflict tables ---

  // Staging for unstructured LLM output BEFORE the grounding check (Law 2). A
  // candidate is promoted to `facts` only if groundingStatus === "passed";
  // failed candidates are never written to the graph (kept here for training).
  extractionCandidates: defineTable({
    organizationId: v.id("organizations"),
    sourceId: v.id("sourceDocuments"),
    factType: factSubjectKindValidator,
    subjectHint: v.any(), // extracted identity (name/email/id) — resolved later
    predicate: v.string(), // typed whitelist predicate
    value: v.any(),
    evidenceQuote: v.string(), // exact span the model cited
    suggestedMethod: factMethodValidator,
    modelConfidence: v.number(),
    groundingStatus: v.union(
      v.literal("pending"),
      v.literal("passed"),
      v.literal("failed")
    ),
    groundingReason: v.optional(v.string()),
    promotedFactId: v.optional(v.id("facts")),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_source", ["sourceId"])
    .index("by_grounding_status", ["organizationId", "groundingStatus"]),

  // Entity resolution queue (Law 5). Tier 1 deterministic / Tier 2 semantic. The
  // middle confidence band (decision="review") waits for a human; never silently
  // merged. high -> auto_merge, low -> new entity.
  entityResolutionQueue: defineTable({
    organizationId: v.id("organizations"),
    candidateType: v.string(), // node type being resolved: "partners" | "accounts" | ...
    sourceId: v.id("sourceDocuments"),
    extractedIdentity: v.any(), // raw identity payload
    proposedMatchTable: v.optional(v.string()),
    proposedMatchId: v.optional(v.string()),
    tier1Signals: v.optional(v.array(v.string())), // deterministic signals that fired
    tier2Score: v.optional(v.number()), // semantic similarity 0-1
    decision: v.union(
      v.literal("auto_merge"),
      v.literal("review"),
      v.literal("new")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("merged"),
      v.literal("rejected"),
      v.literal("new_created")
    ),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_org_and_decision", ["organizationId", "decision"]),

  // Conflict marker (Law 4). When sources disagree about the same subject, both
  // fact envelopes are retained and a conflict is raised. Resolution is a rule +
  // a human, never a silent overwrite.
  conflicts: defineTable({
    organizationId: v.id("organizations"),
    subjectKind: factSubjectKindValidator,
    subjectTable: v.string(),
    subjectId: v.string(),
    subjectField: v.optional(v.string()),
    factIds: v.array(v.id("facts")), // the disagreeing envelopes
    status: v.union(v.literal("open"), v.literal("resolved")),
    resolutionRule: v.optional(v.string()),
    resolvedFactId: v.optional(v.id("facts")),
    resolvedBy: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_and_status", ["organizationId", "status"])
    .index("by_subject", ["subjectTable", "subjectId"]),
});
