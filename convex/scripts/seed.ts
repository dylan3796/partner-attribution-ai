/**
 * Seed Script for Partner Attribution Platform
 *
 * Creates comprehensive test data:
 * - 1 demo organization
 * - 2 users (admin + manager)
 * - 7 partners as companies
 * - 10 deals with realistic names
 * - 20+ touchpoints across deals
 * - Attribution calculations on won deals
 * - Sample payouts with different statuses
 * - Audit log entries
 *
 * Run with: npx convex run scripts/seed
 */

import { internalMutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { calculateAttribution } from "../lib/attribution";

// ============================================================================
// Seed Data Definitions
// ============================================================================

const PARTNERS = [
  {
    name: "TechStar Solutions",
    email: "partnerships@techstar.io",
    type: "reseller" as const,
    commissionRate: 20,
  },
  {
    name: "CloudBridge Partners",
    email: "deals@cloudbridge.co",
    type: "referral" as const,
    commissionRate: 15,
  },
  {
    name: "DataPipe Agency",
    email: "affiliate@datapipe.agency",
    type: "affiliate" as const,
    commissionRate: 12,
  },
  {
    name: "NexGen Resellers",
    email: "channel@nexgenresellers.com",
    type: "reseller" as const,
    commissionRate: 22,
  },
  {
    name: "GrowthLabs Co",
    email: "partners@growthlabs.co",
    type: "referral" as const,
    commissionRate: 18,
  },
  {
    name: "ChannelForce Inc",
    email: "bizdev@channelforce.com",
    type: "integration" as const,
    commissionRate: 10,
  },
  {
    name: "IntegrateHub",
    email: "connect@integratehub.io",
    type: "integration" as const,
    commissionRate: 14,
  },
];

const DEALS = [
  // Won deals (will have attributions)
  { name: "Meridian Healthcare Platform", amount: 85000, status: "won" as const },
  { name: "Apex Financial Suite Rollout", amount: 120000, status: "won" as const },
  { name: "Quantum Retail Analytics", amount: 42000, status: "won" as const },
  { name: "Atlas Manufacturing ERP", amount: 67500, status: "won" as const },

  // Lost deals
  { name: "Pinnacle EdTech Pilot", amount: 35000, status: "lost" as const },
  { name: "Orion Media Subscription", amount: 28000, status: "lost" as const },

  // Open deals (in progress)
  { name: "Vanguard Logistics Upgrade", amount: 95000, status: "open" as const },
  { name: "Nova Biotech Integration", amount: 58000, status: "open" as const },
  { name: "Stellar Insurance Portal", amount: 74000, status: "open" as const },
  { name: "Horizon Travel Platform", amount: 31000, status: "open" as const },
];

const TOUCHPOINT_TYPES = [
  "referral",
  "demo",
  "content_share",
  "introduction",
  "proposal",
  "negotiation",
] as const;

// Deterministic "random" based on index for reproducibility
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

// ============================================================================
// Main Seed Mutation
// ============================================================================

export default internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 PartnerAI Seed — Starting...\n");

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // -----------------------------------------------------------------------
    // 1. Organization
    // -----------------------------------------------------------------------
    console.log("🏢 Creating organization...");
    const orgId = await ctx.db.insert("organizations", {
      name: "Acme Partners Inc.",
      email: "admin@acme-partners.com",
      apiKey: "pk_seed_demo_key_2026_acme_partners",
      plan: "growth",
      createdAt: now - 90 * dayMs,
    });
    console.log(`   ✓ Organization: Acme Partners Inc. (${orgId})`);

    // -----------------------------------------------------------------------
    // 2. Users
    // -----------------------------------------------------------------------
    console.log("\n👤 Creating users...");
    const adminId = await ctx.db.insert("users", {
      email: "sarah.chen@acme-partners.com",
      name: "Sarah Chen",
      organizationId: orgId,
      role: "admin",
      lastLoginAt: now - 2 * 60 * 60 * 1000, // 2 hours ago
      createdAt: now - 90 * dayMs,
    });
    console.log(`   ✓ Admin: Sarah Chen (${adminId})`);

    const managerId = await ctx.db.insert("users", {
      email: "marcus.jones@acme-partners.com",
      name: "Marcus Jones",
      organizationId: orgId,
      role: "manager",
      lastLoginAt: now - 8 * 60 * 60 * 1000, // 8 hours ago
      createdAt: now - 60 * dayMs,
    });
    console.log(`   ✓ Manager: Marcus Jones (${managerId})`);

    // -----------------------------------------------------------------------
    // 3. Partners
    // -----------------------------------------------------------------------
    console.log("\n🤝 Creating partners...");
    const partnerIds: Id<"partners">[] = [];

    for (let i = 0; i < PARTNERS.length; i++) {
      const p = PARTNERS[i];
      const status = i < 5 ? "active" : i === 5 ? "pending" : "active";
      const partnerId = await ctx.db.insert("partners", {
        organizationId: orgId,
        name: p.name,
        email: p.email,
        type: p.type,
        commissionRate: p.commissionRate,
        status,
        createdAt: now - (80 - i * 10) * dayMs,
      });
      partnerIds.push(partnerId);
      console.log(`   ✓ ${p.name} (${p.type}, ${p.commissionRate}%, ${status})`);

      // Audit log for partner creation
      await ctx.db.insert("audit_log", {
        organizationId: orgId,
        userId: adminId,
        action: "partner.created",
        entityType: "partner",
        entityId: partnerId,
        changes: JSON.stringify({ name: p.name, email: p.email, type: p.type }),
        createdAt: now - (80 - i * 10) * dayMs,
      });
    }

    // -----------------------------------------------------------------------
    // 4. Deals + Touchpoints
    // -----------------------------------------------------------------------
    console.log("\n💼 Creating deals and touchpoints...");
    const dealIds: Id<"deals">[] = [];
    let totalTouchpoints = 0;

    // Touchpoint assignment plan — each deal gets 2-4 touchpoints from different partners
    const touchpointPlan: Array<{
      dealIdx: number;
      assignments: Array<{ partnerIdx: number; type: typeof TOUCHPOINT_TYPES[number]; daysAgo: number }>;
    }> = [
      // Won deals get richer touchpoint history
      {
        dealIdx: 0,
        assignments: [
          { partnerIdx: 0, type: "referral", daysAgo: 45 },
          { partnerIdx: 1, type: "introduction", daysAgo: 38 },
          { partnerIdx: 0, type: "demo", daysAgo: 30 },
          { partnerIdx: 2, type: "content_share", daysAgo: 25 },
          { partnerIdx: 1, type: "proposal", daysAgo: 18 },
        ],
      },
      {
        dealIdx: 1,
        assignments: [
          { partnerIdx: 3, type: "referral", daysAgo: 60 },
          { partnerIdx: 4, type: "demo", daysAgo: 50 },
          { partnerIdx: 3, type: "proposal", daysAgo: 40 },
          { partnerIdx: 4, type: "negotiation", daysAgo: 30 },
        ],
      },
      {
        dealIdx: 2,
        assignments: [
          { partnerIdx: 2, type: "content_share", daysAgo: 35 },
          { partnerIdx: 5, type: "introduction", daysAgo: 28 },
          { partnerIdx: 2, type: "demo", daysAgo: 20 },
        ],
      },
      {
        dealIdx: 3,
        assignments: [
          { partnerIdx: 6, type: "referral", daysAgo: 50 },
          { partnerIdx: 1, type: "demo", daysAgo: 42 },
          { partnerIdx: 6, type: "proposal", daysAgo: 35 },
          { partnerIdx: 1, type: "negotiation", daysAgo: 28 },
        ],
      },
      // Lost deals
      {
        dealIdx: 4,
        assignments: [
          { partnerIdx: 4, type: "referral", daysAgo: 40 },
          { partnerIdx: 0, type: "demo", daysAgo: 32 },
        ],
      },
      {
        dealIdx: 5,
        assignments: [
          { partnerIdx: 3, type: "introduction", daysAgo: 30 },
          { partnerIdx: 5, type: "content_share", daysAgo: 22 },
        ],
      },
      // Open deals
      {
        dealIdx: 6,
        assignments: [
          { partnerIdx: 0, type: "referral", daysAgo: 14 },
          { partnerIdx: 2, type: "introduction", daysAgo: 10 },
          { partnerIdx: 0, type: "demo", daysAgo: 5 },
        ],
      },
      {
        dealIdx: 7,
        assignments: [
          { partnerIdx: 6, type: "referral", daysAgo: 12 },
          { partnerIdx: 4, type: "content_share", daysAgo: 8 },
        ],
      },
      {
        dealIdx: 8,
        assignments: [
          { partnerIdx: 1, type: "referral", daysAgo: 7 },
          { partnerIdx: 3, type: "demo", daysAgo: 4 },
          { partnerIdx: 1, type: "proposal", daysAgo: 2 },
        ],
      },
      {
        dealIdx: 9,
        assignments: [
          { partnerIdx: 5, type: "introduction", daysAgo: 10 },
          { partnerIdx: 2, type: "demo", daysAgo: 6 },
        ],
      },
    ];

    for (let i = 0; i < DEALS.length; i++) {
      const d = DEALS[i];
      const createdDaysAgo = d.status === "open" ? 15 + i : 55 + i * 3;

      const dealId = await ctx.db.insert("deals", {
        organizationId: orgId,
        name: d.name,
        amount: d.amount,
        status: d.status === "open" ? "open" : d.status, // won/lost deals start as their final status for seed
        closedAt: d.status !== "open" ? now - (createdDaysAgo - 10) * dayMs : undefined,
        createdAt: now - createdDaysAgo * dayMs,
      });
      dealIds.push(dealId);

      // Audit log for deal creation
      await ctx.db.insert("audit_log", {
        organizationId: orgId,
        userId: pick([adminId, managerId], i),
        action: "deal.created",
        entityType: "deal",
        entityId: dealId,
        changes: JSON.stringify({ name: d.name, amount: d.amount }),
        createdAt: now - createdDaysAgo * dayMs,
      });

      // Create touchpoints for this deal
      const plan = touchpointPlan[i];
      if (plan) {
        for (const tp of plan.assignments) {
          await ctx.db.insert("touchpoints", {
            organizationId: orgId,
            dealId,
            partnerId: partnerIds[tp.partnerIdx],
            type: tp.type,
            notes: `${tp.type} interaction with ${PARTNERS[tp.partnerIdx].name}`,
            createdAt: now - tp.daysAgo * dayMs,
          });
          totalTouchpoints++;
        }
      }

      const tpCount = plan?.assignments.length ?? 0;
      console.log(`   ✓ ${d.name} — $${d.amount.toLocaleString()} (${d.status}) — ${tpCount} touchpoints`);

      // Audit log for closed deals
      if (d.status !== "open") {
        await ctx.db.insert("audit_log", {
          organizationId: orgId,
          userId: pick([adminId, managerId], i + 3),
          action: d.status === "won" ? "deal.won" : "deal.lost",
          entityType: "deal",
          entityId: dealId,
          changes: JSON.stringify({ status: { from: "open", to: d.status } }),
          metadata: JSON.stringify({ dealName: d.name, amount: d.amount }),
          createdAt: now - (createdDaysAgo - 10) * dayMs,
        });
      }
    }

    console.log(`   Total touchpoints: ${totalTouchpoints}`);

    // -----------------------------------------------------------------------
    // 5. Attribution Calculations (won deals only)
    // -----------------------------------------------------------------------
    console.log("\n📊 Calculating attributions...");
    const wonDealIndices = [0, 1, 2, 3];
    let totalAttributions = 0;
    const allAttributionIds: Id<"attributions">[] = [];

    for (const idx of wonDealIndices) {
      const dealId = dealIds[idx];
      const deal = DEALS[idx];

      // Get touchpoints for this deal
      const touchpoints = await ctx.db
        .query("touchpoints")
        .withIndex("by_deal", (q) => q.eq("dealId", dealId))
        .collect();

      if (touchpoints.length === 0) continue;

      // Get partner commission rates
      const partnerMap = new Map<string, number>();
      for (const tp of touchpoints) {
        if (!partnerMap.has(tp.partnerId)) {
          const partner = await ctx.db.get(tp.partnerId);
          if (partner) {
            partnerMap.set(tp.partnerId, partner.commissionRate);
          }
        }
      }

      // Calculate using the primary model (time_decay) for seed data
      const models = ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"] as const;

      for (const model of models) {
        const results = calculateAttribution(touchpoints, model);

        for (const attr of results) {
          const commissionRate = partnerMap.get(attr.partnerId) ?? 10;
          const amount = (deal.amount * attr.percentage) / 100;
          const commissionAmount = (amount * commissionRate) / 100;

          const attrId = await ctx.db.insert("attributions", {
            organizationId: orgId,
            dealId,
            partnerId: attr.partnerId as Id<"partners">,
            model,
            percentage: attr.percentage,
            amount: Math.round(amount * 100) / 100,
            commissionAmount: Math.round(commissionAmount * 100) / 100,
            calculatedAt: now - (40 - idx * 5) * dayMs,
          });
          allAttributionIds.push(attrId);
          totalAttributions++;
        }
      }

      // Audit log for attribution calculation
      await ctx.db.insert("audit_log", {
        organizationId: orgId,
        userId: adminId,
        action: "attribution.calculated",
        entityType: "deal",
        entityId: dealId,
        metadata: JSON.stringify({
          dealName: deal.name,
          models: models,
          touchpointCount: touchpoints.length,
        }),
        createdAt: now - (40 - idx * 5) * dayMs,
      });

      console.log(`   ✓ ${deal.name} — ${models.length} models calculated`);
    }
    console.log(`   Total attribution records: ${totalAttributions}`);

    // -----------------------------------------------------------------------
    // 6. Payouts
    // -----------------------------------------------------------------------
    console.log("\n💰 Creating payouts...");

    // Gather time_decay attributions for the payout grouping
    const timeDecayAttrs = await ctx.db
      .query("attributions")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const tdAttrs = timeDecayAttrs.filter((a) => a.model === "time_decay");

    // Group by partner
    const partnerPayoutMap = new Map<string, { amount: number; attrIds: Id<"attributions">[] }>();
    for (const attr of tdAttrs) {
      const existing = partnerPayoutMap.get(attr.partnerId) ?? { amount: 0, attrIds: [] };
      existing.amount += attr.commissionAmount;
      existing.attrIds.push(attr._id);
      partnerPayoutMap.set(attr.partnerId, existing);
    }

    const payoutStatuses: Array<{
      status: "pending" | "processing" | "paid" | "failed";
      approvalStatus: "pending_approval" | "approved" | "rejected" | "pending_payment" | "paid" | "failed";
    }> = [
      { status: "paid", approvalStatus: "paid" },
      { status: "processing", approvalStatus: "approved" },
      { status: "pending", approvalStatus: "pending_approval" },
      { status: "pending", approvalStatus: "approved" },
      { status: "failed", approvalStatus: "failed" },
      { status: "pending", approvalStatus: "rejected" },
      { status: "paid", approvalStatus: "paid" },
    ];

    let payoutCount = 0;
    const partnerEntries = Array.from(partnerPayoutMap.entries());

    for (let i = 0; i < partnerEntries.length && i < payoutStatuses.length; i++) {
      const [partnerId, data] = partnerEntries[i];
      const ps = payoutStatuses[i];
      const amount = Math.round(data.amount * 100) / 100;

      const payoutId = await ctx.db.insert("payouts", {
        organizationId: orgId,
        partnerId: partnerId as Id<"partners">,
        amount,
        status: ps.status,
        approvalStatus: ps.approvalStatus,
        approvedBy: ps.approvalStatus === "approved" || ps.approvalStatus === "paid"
          ? managerId
          : undefined,
        approvedAt: ps.approvalStatus === "approved" || ps.approvalStatus === "paid"
          ? now - 5 * dayMs
          : undefined,
        attributionIds: data.attrIds,
        period: "2026-01",
        paidAt: ps.status === "paid" ? now - 3 * dayMs : undefined,
        createdAt: now - 10 * dayMs,
      });

      // Audit log
      await ctx.db.insert("audit_log", {
        organizationId: orgId,
        userId: managerId,
        action: "payout.created",
        entityType: "payout",
        entityId: payoutId,
        changes: JSON.stringify({
          partnerId,
          amount,
          status: ps.status,
          approvalStatus: ps.approvalStatus,
          period: "2026-01",
        }),
        createdAt: now - 10 * dayMs,
      });

      // Create approval workflow for payouts
      if (ps.approvalStatus !== "pending_approval") {
        const approvalStatus = ps.approvalStatus === "rejected" ? "rejected" : "approved";
        await ctx.db.insert("approval_workflows", {
          organizationId: orgId,
          entityType: "payout",
          entityId: payoutId,
          status: approvalStatus as "pending" | "approved" | "rejected",
          requestedBy: adminId,
          reviewedBy: managerId,
          reviewedAt: now - 5 * dayMs,
          notes: approvalStatus === "rejected"
            ? "Commission rate needs review before payout"
            : "Approved — verified against attribution report",
          createdAt: now - 8 * dayMs,
        });
      } else {
        // Pending approval
        await ctx.db.insert("approval_workflows", {
          organizationId: orgId,
          entityType: "payout",
          entityId: payoutId,
          status: "pending",
          requestedBy: adminId,
          notes: "Monthly payout for January 2026",
          createdAt: now - 3 * dayMs,
        });
      }

      const partnerName = PARTNERS[partnerIds.indexOf(partnerId as Id<"partners">)]?.name ?? "Unknown";
      console.log(`   ✓ ${partnerName} — $${amount.toLocaleString()} (${ps.status}/${ps.approvalStatus})`);
      payoutCount++;
    }

    // -----------------------------------------------------------------------
    // 7. Extra audit log entries for realism
    // -----------------------------------------------------------------------
    console.log("\n📝 Adding extra audit entries...");

    // User login events
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      userId: adminId,
      action: "user.login",
      entityType: "user",
      entityId: adminId,
      metadata: JSON.stringify({ ip: "192.168.1.42", userAgent: "Mozilla/5.0" }),
      createdAt: now - 2 * 60 * 60 * 1000,
    });

    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      userId: managerId,
      action: "user.login",
      entityType: "user",
      entityId: managerId,
      metadata: JSON.stringify({ ip: "10.0.0.15", userAgent: "Mozilla/5.0" }),
      createdAt: now - 8 * 60 * 60 * 1000,
    });

    // Partner activation events
    for (let i = 0; i < 5; i++) {
      await ctx.db.insert("audit_log", {
        organizationId: orgId,
        userId: adminId,
        action: "partner.activated",
        entityType: "partner",
        entityId: partnerIds[i],
        changes: JSON.stringify({ status: { from: "pending", to: "active" } }),
        createdAt: now - (70 - i * 10) * dayMs,
      });
    }

    console.log("   ✓ Added login events and partner activation logs");

    // -----------------------------------------------------------------------
    // Summary
    // -----------------------------------------------------------------------
    const auditCount = await ctx.db
      .query("audit_log")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const approvalCount = await ctx.db
      .query("approval_workflows")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    console.log(`
╔══════════════════════════════════════════╗
║          🌱 SEED COMPLETE                ║
╠══════════════════════════════════════════╣
║  Organization:  1                        ║
║  Users:         2 (admin + manager)      ║
║  Partners:      ${PARTNERS.length}                        ║
║  Deals:         ${DEALS.length}                       ║
║  Touchpoints:   ${totalTouchpoints}                      ║
║  Attributions:  ${totalAttributions}                      ║
║  Payouts:       ${payoutCount}                        ║
║  Audit Entries: ${auditCount.length}                      ║
║  Approvals:     ${approvalCount.length}                        ║
╠══════════════════════════════════════════╣
║  API Key: pk_seed_demo_key_2026_acme_partners
╚══════════════════════════════════════════╝
`);

    return {
      orgId,
      adminId,
      managerId,
      partnerIds,
      dealIds,
      totalTouchpoints,
      totalAttributions,
      payoutCount,
      auditEntries: auditCount.length,
      approvals: approvalCount.length,
      apiKey: "pk_seed_demo_key_2026_acme_partners",
    };
  },
});
