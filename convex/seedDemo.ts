import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This seed script creates realistic demo data for Horizon Software
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create demo organization - Horizon Software
    const orgId = await ctx.db.insert("organizations", {
      name: "Horizon Software",
      email: "admin@horizonsoftware.com",
      apiKey: "demo-api-key-" + Date.now(),
      plan: "growth",
      defaultAttributionModel: "time_decay",
      createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000, // 6 months ago
    });

    // Create 5 realistic partner companies
    const partners = [
      {
        name: "TechBridge Partners",
        email: "sarah.chen@techbridge.io",
        type: "reseller" as const,
        tier: "gold" as const,
        commissionRate: 18,
        contactName: "Sarah Chen",
        contactPhone: "+1-415-555-0142",
        territory: "West Coast",
        status: "active" as const,
        notes: "Premier reseller partner since 2024. Strong enterprise relationships in Silicon Valley.",
        createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Apex Growth Group",
        email: "marcus.webb@apexgrowth.com",
        type: "referral" as const,
        tier: "platinum" as const,
        commissionRate: 20,
        contactName: "Marcus Webb",
        contactPhone: "+1-212-555-0193",
        territory: "National",
        status: "active" as const,
        notes: "Top-tier strategic partner. Largest referral volume. Executive relationships at Fortune 500.",
        createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Stackline Agency",
        email: "priya.patel@stackline.co",
        type: "reseller" as const,
        tier: "silver" as const,
        commissionRate: 15,
        contactName: "Priya Patel",
        contactPhone: "+1-617-555-0287",
        territory: "East Coast",
        status: "active" as const,
        notes: "Growing mid-market focus. Strong technical implementation team.",
        createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Northlight Solutions",
        email: "james.kim@northlight.io",
        type: "integration" as const,
        tier: "gold" as const,
        commissionRate: 12,
        contactName: "James Kim",
        contactPhone: "+65-8555-0341",
        territory: "APAC",
        status: "active" as const,
        notes: "Key integration partner for Asia-Pacific expansion. Deep technical expertise.",
        createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Clearpath Consulting",
        email: "elena.torres@clearpath.io",
        type: "referral" as const,
        tier: "bronze" as const,
        commissionRate: 10,
        contactName: "Elena Torres",
        contactPhone: "+1-312-555-0456",
        territory: "Midwest",
        status: "active" as const,
        notes: "Emerging partner in Midwest region. Building pipeline steadily.",
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      },
    ];

    const partnerIds: Record<string, any> = {};
    for (const partner of partners) {
      const id = await ctx.db.insert("partners", {
        organizationId: orgId,
        ...partner,
      });
      partnerIds[partner.name] = id;
    }

    // Create 7 realistic deals
    const deals = [
      // Won deals
      {
        name: "CloudSync Enterprise License",
        amount: 85000,
        status: "won" as const,
        closedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        contactName: "David Mitchell",
        contactEmail: "dmitchell@accenture.com",
        registeredBy: partnerIds["TechBridge Partners"],
        registrationStatus: "approved" as const,
        partner: "TechBridge Partners",
        touchpoints: [
          { type: "deal_registration" as const, daysAgo: 45 },
          { type: "demo" as const, daysAgo: 30 },
          { type: "proposal" as const, daysAgo: 15 },
          { type: "negotiation" as const, daysAgo: 7 },
        ],
      },
      {
        name: "DevOps Transformation Suite",
        amount: 42000,
        status: "won" as const,
        closedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
        contactName: "Rachel Green",
        contactEmail: "rgreen@zendesk.com",
        partner: "Apex Growth Group",
        touchpoints: [
          { type: "referral" as const, daysAgo: 60 },
          { type: "introduction" as const, daysAgo: 50 },
          { type: "demo" as const, daysAgo: 35 },
          { type: "proposal" as const, daysAgo: 20 },
        ],
      },

      // Open deals
      {
        name: "Data Analytics Platform",
        amount: 67000,
        status: "open" as const,
        expectedCloseDate: Date.now() + 21 * 24 * 60 * 60 * 1000,
        contactName: "Jennifer Wu",
        contactEmail: "jwu@salesforce.com",
        registeredBy: partnerIds["Stackline Agency"],
        registrationStatus: "approved" as const,
        partner: "Stackline Agency",
        touchpoints: [
          { type: "deal_registration" as const, daysAgo: 28 },
          { type: "demo" as const, daysAgo: 14 },
          { type: "technical_enablement" as const, daysAgo: 7 },
        ],
      },
      {
        name: "Enterprise SSO Integration",
        amount: 28000,
        status: "open" as const,
        expectedCloseDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
        contactName: "Michael Chang",
        contactEmail: "mchang@stripe.com",
        partner: "Northlight Solutions",
        touchpoints: [
          { type: "referral" as const, daysAgo: 21 },
          { type: "demo" as const, daysAgo: 10 },
        ],
      },
      {
        name: "Revenue Intelligence Platform",
        amount: 95000,
        status: "open" as const,
        expectedCloseDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        contactName: "Amanda Foster",
        contactEmail: "afoster@hubspot.com",
        registeredBy: partnerIds["Apex Growth Group"],
        registrationStatus: "approved" as const,
        partner: "Apex Growth Group",
        touchpoints: [
          { type: "deal_registration" as const, daysAgo: 35 },
          { type: "co_sell" as const, daysAgo: 20 },
          { type: "proposal" as const, daysAgo: 8 },
        ],
      },
      {
        name: "Infrastructure Modernization",
        amount: 120000,
        status: "open" as const,
        expectedCloseDate: Date.now() + 45 * 24 * 60 * 60 * 1000,
        contactName: "Robert Kim",
        contactEmail: "rkim@snowflake.com",
        registeredBy: partnerIds["TechBridge Partners"],
        registrationStatus: "pending" as const,
        partner: "TechBridge Partners",
        touchpoints: [
          { type: "deal_registration" as const, daysAgo: 14 },
          { type: "demo" as const, daysAgo: 7 },
        ],
      },

      // Lost deal
      {
        name: "Partner Portal Deployment",
        amount: 38000,
        status: "lost" as const,
        closedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
        contactName: "Kevin Park",
        contactEmail: "kpark@docusign.com",
        partner: "Clearpath Consulting",
        touchpoints: [
          { type: "referral" as const, daysAgo: 55 },
          { type: "demo" as const, daysAgo: 40 },
          { type: "proposal" as const, daysAgo: 30 },
        ],
      },
    ];

    for (const deal of deals) {
      const dealId = await ctx.db.insert("deals", {
        organizationId: orgId,
        name: deal.name,
        amount: deal.amount,
        status: deal.status,
        closedAt: deal.closedAt,
        expectedCloseDate: deal.expectedCloseDate,
        contactName: deal.contactName,
        contactEmail: deal.contactEmail,
        registeredBy: deal.registeredBy,
        registrationStatus: deal.registrationStatus,
        createdAt: Date.now() - (deal.touchpoints[0]?.daysAgo || 30) * 24 * 60 * 60 * 1000,
      });

      // Create touchpoints
      const partnerId = partnerIds[deal.partner];
      for (const tp of deal.touchpoints) {
        await ctx.db.insert("touchpoints", {
          organizationId: orgId,
          dealId,
          partnerId,
          type: tp.type,
          createdAt: Date.now() - tp.daysAgo * 24 * 60 * 60 * 1000,
        });
      }

      // Create attribution for won deals
      if (deal.status === "won") {
        const commissionRate = partners.find(p => p.name === deal.partner)?.commissionRate || 15;
        const attributedAmount = deal.amount;
        const commissionAmount = (attributedAmount * commissionRate) / 100;

        await ctx.db.insert("attributions", {
          organizationId: orgId,
          dealId,
          partnerId,
          model: "time_decay",
          percentage: 100,
          amount: attributedAmount,
          commissionAmount,
          calculatedAt: deal.closedAt!,
        });

        // Create payout
        await ctx.db.insert("payouts", {
          organizationId: orgId,
          partnerId,
          amount: commissionAmount,
          status: deal.closedAt! > Date.now() - 30 * 24 * 60 * 60 * 1000 
            ? "pending_approval" 
            : "paid",
          period: new Date(deal.closedAt!).toISOString().slice(0, 7),
          paidAt: deal.closedAt! < Date.now() - 30 * 24 * 60 * 60 * 1000 
            ? deal.closedAt! + 7 * 24 * 60 * 60 * 1000 
            : undefined,
          createdAt: deal.closedAt!,
        });
      }
    }

    // Create realistic activity log entries
    const activities = [
      { action: "deal.closed", entity: "deals", timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, metadata: '{"deal":"CloudSync Enterprise License","amount":"$85,000"}' },
      { action: "attribution.calculated", entity: "attributions", timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, metadata: '{"model":"time_decay","partner":"TechBridge Partners"}' },
      { action: "deal.closed", entity: "deals", timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000, metadata: '{"deal":"DevOps Transformation Suite","amount":"$42,000"}' },
      { action: "payout.created", entity: "payouts", timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, metadata: '{"partner":"TechBridge Partners","amount":"$15,300"}' },
      { action: "payout.created", entity: "payouts", timestamp: Date.now() - 11 * 24 * 60 * 60 * 1000, metadata: '{"partner":"Apex Growth Group","amount":"$8,400"}' },
      { action: "deal.registered", entity: "deals", timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, metadata: '{"deal":"Infrastructure Modernization","partner":"TechBridge Partners"}' },
      { action: "touchpoint.created", entity: "touchpoints", timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, metadata: '{"type":"demo","deal":"Infrastructure Modernization"}' },
      { action: "partner.created", entity: "partners", timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000, metadata: '{"partner":"Clearpath Consulting","tier":"bronze"}' },
    ];

    for (const activity of activities) {
      await ctx.db.insert("audit_log", {
        organizationId: orgId,
        action: activity.action,
        entityType: activity.entity,
        entityId: "demo-" + Math.random().toString(36).slice(2),
        metadata: activity.metadata,
        createdAt: activity.timestamp,
      });
    }

    // ── Commission Rules ──────────────────────────────────────────────────
    const commissionRuleData = [
      { name: "Gold Reseller", partnerType: "reseller" as const, partnerTier: "gold" as const, rate: 0.2, priority: 1 },
      { name: "Reseller Standard", partnerType: "reseller" as const, rate: 0.15, priority: 2 },
      { name: "Referral Partner", partnerType: "referral" as const, rate: 0.1, priority: 3 },
      { name: "Enterprise Deals (>$100k)", rate: 0.12, minDealSize: 100000, priority: 4 },
    ];
    for (const rule of commissionRuleData) {
      await ctx.db.insert("commissionRules", {
        organizationId: orgId,
        name: rule.name,
        partnerType: rule.partnerType,
        partnerTier: rule.partnerTier,
        rate: rule.rate,
        minDealSize: rule.minDealSize,
        priority: rule.priority,
        createdAt: Date.now(),
      });
    }

    return {
      success: true,
      message: "Demo data created successfully for Horizon Software",
      partnersCreated: Object.keys(partnerIds).length,
      dealsCreated: deals.length,
    };
  },
});

// Clear all demo data
export const clearDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "organizations",
      "users",
      "partners",
      "deals",
      "touchpoints",
      "attributions",
      "payouts",
      "audit_log",
      "approvals",
      "disputes",
      "commissionRules",
    ];

    let totalDeleted = 0;
    for (const table of tables) {
      const records = await ctx.db.query(table as any).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
        totalDeleted++;
      }
    }

    return {
      success: true,
      message: `Cleared ${totalDeleted} records from ${tables.length} tables`,
    };
  },
});
