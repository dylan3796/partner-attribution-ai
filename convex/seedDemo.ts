import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This seed script creates realistic demo data for 4 partner companies
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create demo organization
    const orgId = await ctx.db.insert("organizations", {
      name: "Acme Inc",
      email: "admin@acme.com",
      apiKey: "demo-api-key-" + Date.now(),
      plan: "growth",
      defaultAttributionModel: "time_decay",
      createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000, // 6 months ago
    });

    // Create 4 realistic partner companies
    const partners = [
      {
        name: "TechStar Solutions",
        email: "james@techstar.com",
        type: "reseller" as const,
        tier: "gold" as const,
        commissionRate: 18,
        contactName: "James Chen",
        contactPhone: "+1-415-555-0142",
        territory: "West Coast USA",
        status: "active" as const,
        notes: "Premier reseller partner since 2023. Excellent technical team.",
        createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000, // 4 months ago
      },
      {
        name: "CloudBridge Partners",
        email: "sarah@cloudbridge.io",
        type: "referral" as const,
        tier: "silver" as const,
        commissionRate: 15,
        contactName: "Sarah Martinez",
        contactPhone: "+1-650-555-0193",
        territory: "California",
        status: "active" as const,
        notes: "Specializes in enterprise cloud migrations. High-quality leads.",
        createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000, // 3 months ago
      },
      {
        name: "DataPipe Agency",
        email: "alex@datapipe.com",
        type: "integration" as const,
        tier: "gold" as const,
        commissionRate: 12,
        contactName: "Alex Johnson",
        contactPhone: "+1-510-555-0287",
        territory: "North America",
        status: "active" as const,
        notes: "Integration partner with strong data pipeline expertise.",
        createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000, // 5 months ago
      },
      {
        name: "NexGen Resellers",
        email: "michael@nexgen.co",
        type: "reseller" as const,
        tier: "platinum" as const,
        commissionRate: 20,
        contactName: "Michael Foster",
        contactPhone: "+1-408-555-0341",
        territory: "Global",
        status: "active" as const,
        notes: "Top-tier partner with $2M+ annual revenue. Strategic relationship.",
        createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000, // 6.5 months ago
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

    // Create realistic deals
    const deals = [
      // TechStar Solutions deals
      {
        name: "Security Audit Tool — Stark Industries",
        amount: 95000,
        status: "won" as const,
        closedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        contactName: "Tony Stark",
        contactEmail: "tstark@stark.com",
        registeredBy: partnerIds["TechStar Solutions"],
        registrationStatus: "approved" as const,
        partner: "TechStar Solutions",
        touchpoints: [
          { type: "deal_registration" as const, daysAgo: 45 },
          { type: "demo" as const, daysAgo: 30 },
          { type: "proposal" as const, daysAgo: 15 },
          { type: "negotiation" as const, daysAgo: 7 },
        ],
      },
      {
        name: "Monitoring Solution — Wayne Enterprises",
        amount: 150000,
        status: "open" as const,
        expectedCloseDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
        contactName: "Bruce Wayne",
        contactEmail: "bwayne@wayne.com",
        registeredBy: partnerIds["TechStar Solutions"],
        registrationStatus: "approved" as const,
        partner: "TechStar Solutions",
        touchpoints: [
          { type: "referral" as const, daysAgo: 20 },
          { type: "demo" as const, daysAgo: 12 },
        ],
      },

      // CloudBridge Partners deals
      {
        name: "Enterprise CRM Suite — Globex Corp",
        amount: 120000,
        status: "won" as const,
        closedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
        contactName: "Hank Scorpio",
        contactEmail: "hscorpio@globex.com",
        partner: "CloudBridge Partners",
        touchpoints: [
          { type: "referral" as const, daysAgo: 60 },
          { type: "introduction" as const, daysAgo: 50 },
          { type: "technical_enablement" as const, daysAgo: 40 },
        ],
      },
      {
        name: "Data Pipeline — Umbrella Inc",
        amount: 200000,
        status: "open" as const,
        expectedCloseDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        contactName: "Alex Wesker",
        contactEmail: "awesker@umbrella.com",
        partner: "CloudBridge Partners",
        touchpoints: [
          { type: "referral" as const, daysAgo: 10 },
          { type: "demo" as const, daysAgo: 3 },
        ],
      },

      // DataPipe Agency deals
      {
        name: "DevOps Suite — Massive Dynamic",
        amount: 175000,
        status: "won" as const,
        closedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        contactName: "Nina Sharp",
        contactEmail: "nsharp@massivedynamic.com",
        partner: "DataPipe Agency",
        touchpoints: [
          { type: "co_sell" as const, daysAgo: 35 },
          { type: "demo" as const, daysAgo: 25 },
          { type: "proposal" as const, daysAgo: 14 },
        ],
      },

      // NexGen Resellers deals
      {
        name: "Security Audit Tool — Stark Industries",
        amount: 95000,
        status: "won" as const,
        closedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        contactName: "Pepper Potts",
        contactEmail: "ppotts@stark.com",
        partner: "NexGen Resellers",
        registeredBy: partnerIds["NexGen Resellers"],
        registrationStatus: "approved" as const,
        touchpoints: [
          { type: "deal_registration" as const, daysAgo: 50 },
          { type: "co_sell" as const, daysAgo: 40 },
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

    // Create activity log entries
    const activities = [
      { action: "deal.closed", entity: "deals", timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { action: "attribution.calculated", entity: "attributions", timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { action: "payout.created", entity: "payouts", timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 },
      { action: "touchpoint.created", entity: "touchpoints", timestamp: Date.now() - 2 * 60 * 60 * 1000 },
    ];

    for (const activity of activities) {
      await ctx.db.insert("audit_log", {
        organizationId: orgId,
        action: activity.action,
        entityType: activity.entity,
        entityId: "demo-" + Math.random().toString(36).slice(2),
        createdAt: activity.timestamp,
      });
    }

    return {
      success: true,
      message: "Demo data created successfully",
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
