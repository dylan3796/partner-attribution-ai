/**
 * seedPrograms.ts — canonical multi-program demo.
 *
 * One customer ("Northwind") running 4 partner programs in parallel, each with
 * its own bounded attribution model, including a cloud co-sell deal touched by a
 * hyperscaler + SI + vendor. Deals are tagged with their program and attribution
 * is computed through the REAL pipeline (calculateDealAttribution), so the ledger
 * rows carry programId + reason.
 *
 * Run:   npx convex run seedPrograms:seed
 * Reset: npx convex run seedPrograms:clear
 */

import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { calculateDealAttribution } from "./lib/attribution/calculator";

const DAY = 86_400_000;
const now = Date.now();
const ORG_EMAIL = "ops@northwind-demo.com";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("email"), ORG_EMAIL))
      .first();
    if (existing) {
      return { status: "already_seeded", orgId: existing._id, message: "Run seedPrograms:clear to reseed." };
    }

    // 1. Organization
    const orgId = await ctx.db.insert("organizations", {
      name: "Northwind",
      email: ORG_EMAIL,
      apiKey: `ck_demo_${Math.random().toString(36).slice(2, 18)}`,
      plan: "growth",
      defaultAttributionModel: "role_weighted",
      createdAt: now - 120 * DAY,
    });

    // 2. Partners (rates stored 0.0-1.0). AWS = hyperscaler; Covant = vendor.
    const partnerDefs = [
      { key: "acme", name: "Acme SI", type: "reseller" as const, rate: 0.15 },
      { key: "beacon", name: "Beacon Advisory", type: "referral" as const, rate: 0.12 },
      { key: "aws", name: "AWS", type: "integration" as const, rate: 0.0 },
      { key: "northstar", name: "Northstar SI", type: "reseller" as const, rate: 0.15 },
      { key: "covant", name: "Covant", type: "integration" as const, rate: 0.0 },
      { key: "datasync", name: "DataSync ISV", type: "integration" as const, rate: 0.2 },
      { key: "reseller_one", name: "ResellerOne", type: "reseller" as const, rate: 0.15 },
    ];
    const pid: Record<string, Id<"partners">> = {};
    for (const p of partnerDefs) {
      pid[p.key] = await ctx.db.insert("partners", {
        organizationId: orgId,
        name: p.name,
        email: `${p.key}@example.com`,
        type: p.type,
        commissionRate: p.rate,
        status: "active",
        createdAt: now - 110 * DAY,
      });
    }

    // 3. Programs (each selects one bounded model). Co-sell config references
    //    the vendor partner id, resolved now that partners exist.
    const siProgram = await ctx.db.insert("programs", {
      organizationId: orgId, name: "Global SI Program", archetype: "si",
      selectedModel: "role_weighted", isDefault: true, createdAt: now - 100 * DAY,
    });
    const cosellProgram = await ctx.db.insert("programs", {
      organizationId: orgId, name: "Cloud Co-sell Program", archetype: "cloud_cosell",
      selectedModel: "marketplace_cosell_hybrid",
      modelConfig: JSON.stringify({ vendorPartnerIds: [pid.covant] }),
      createdAt: now - 100 * DAY,
    });
    const isvProgram = await ctx.db.insert("programs", {
      organizationId: orgId, name: "Tech / ISV Program", archetype: "tech_isv",
      selectedModel: "first_touch_sourcer", createdAt: now - 100 * DAY,
    });
    const resellerProgram = await ctx.db.insert("programs", {
      organizationId: orgId, name: "Reseller Program", archetype: "reseller",
      selectedModel: "implementation_credit", createdAt: now - 100 * DAY,
    });

    // 4. Deals + touchpoints (one representative won deal per program).
    type TP = { partner: string; type: string; daysAgo: number };
    const dealDefs: Array<{
      name: string; amount: number; programId: Id<"programs">;
      registeredBy?: string; touchpoints: TP[];
    }> = [
      {
        name: "Globex — Data Platform", amount: 120_000, programId: siProgram, registeredBy: "acme",
        touchpoints: [
          { partner: "acme", type: "deal_registration", daysAgo: 60 },
          { partner: "acme", type: "technical_enablement", daysAgo: 10 },
          { partner: "beacon", type: "demo", daysAgo: 40 },
        ],
      },
      {
        name: "Initech — Marketplace Deal", amount: 250_000, programId: cosellProgram, registeredBy: "northstar",
        touchpoints: [
          { partner: "aws", type: "co_sell", daysAgo: 30 },
          { partner: "northstar", type: "deal_registration", daysAgo: 45 },
          { partner: "covant", type: "proposal", daysAgo: 12 },
          { partner: "covant", type: "negotiation", daysAgo: 5 },
        ],
      },
      {
        name: "Hooli — ISV Bundle", amount: 60_000, programId: isvProgram,
        touchpoints: [
          { partner: "datasync", type: "referral", daysAgo: 50 },
          { partner: "acme", type: "demo", daysAgo: 20 },
        ],
      },
      {
        name: "Stark Industries — Reseller", amount: 90_000, programId: resellerProgram, registeredBy: "reseller_one",
        touchpoints: [
          { partner: "reseller_one", type: "deal_registration", daysAgo: 35 },
          { partner: "reseller_one", type: "technical_enablement", daysAgo: 8 },
        ],
      },
    ];

    const dealIds: Id<"deals">[] = [];
    for (const d of dealDefs) {
      const closedAt = now - 2 * DAY;
      const dealId = await ctx.db.insert("deals", {
        organizationId: orgId,
        name: d.name,
        amount: d.amount,
        status: "won",
        closedAt,
        programId: d.programId,
        registeredBy: d.registeredBy ? pid[d.registeredBy] : undefined,
        registrationStatus: d.registeredBy ? "approved" : undefined,
        createdAt: now - 70 * DAY,
      });
      dealIds.push(dealId);
      for (const tp of d.touchpoints) {
        await ctx.db.insert("touchpoints", {
          organizationId: orgId,
          dealId,
          partnerId: pid[tp.partner],
          type: tp.type as any,
          createdAt: now - tp.daysAgo * DAY,
        });
      }
    }

    // 5. Compute attribution through the real pipeline (writes programId + reason).
    let attributionsCreated = 0;
    for (const dealId of dealIds) {
      const result = await calculateDealAttribution(ctx, dealId, orgId, { replaceExisting: true });
      attributionsCreated += result.totalAttributionsCreated;
    }

    return {
      status: "seeded",
      orgId,
      programs: 4,
      deals: dealIds.length,
      attributionsCreated,
      message: "✅ Seeded Northwind with 4 programs. See dashboard:getProgramRollups.",
    };
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const org = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("email"), ORG_EMAIL))
      .first();
    if (!org) return { status: "not_found" };

    let deleted = 0;
    for (const table of ["attributions", "touchpoints", "deals", "programs", "commissionRules", "partners"] as const) {
      const rows = await ctx.db
        .query(table)
        .filter((q) => q.eq(q.field("organizationId"), org._id))
        .collect();
      for (const r of rows) {
        await ctx.db.delete(r._id);
        deleted++;
      }
    }
    await ctx.db.delete(org._id);
    return { status: "cleared", deleted };
  },
});
