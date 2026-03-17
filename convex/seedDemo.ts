/**
 * seedDemo.ts — Seed a realistic sample dataset into Covant.
 *
 * Run: npx convex run seedDemo:seedAll
 *
 * Creates 1 org, 5 partners, 17 deals, touchpoints, attributions,
 * commission rules, and payouts — all scoped to the demo org.
 *
 * Portal login: use any partner email below with /portal
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const DAY = 86_400_000;
const now = Date.now();

const DEMO_ORG_EMAIL = "ops@horizonsoftware.com";

const PARTNERS = [
  { name: "TechBridge Solutions",  email: "sarah.chen@techbridge.io",  contactName: "Sarah Chen",   type: "reseller" as const, tier: "gold" as const,   commissionRate: 0.18, status: "active" as const, tags: ["Top Performer", "Strategic"] },
  { name: "Apex Growth Group",     email: "marcus.webb@apexgrowth.com", contactName: "Marcus Webb",  type: "referral" as const, tier: "silver" as const, commissionRate: 0.12, status: "active" as const, tags: ["Strategic"] },
  { name: "Stackline Agency",      email: "priya.patel@stackline.co",   contactName: "Priya Patel",  type: "reseller" as const, tier: "silver" as const, commissionRate: 0.15, status: "active" as const, tags: ["Strategic"] },
  { name: "Northlight Solutions",  email: "james.kim@northlight.io",    contactName: "James Kim",    type: "affiliate" as const,tier: "bronze" as const, commissionRate: 0.08, status: "active" as const, tags: ["New"] },
  { name: "Clearpath Consulting",  email: "elena.torres@clearpath.io",  contactName: "Elena Torres", type: "referral" as const, tier: "gold" as const,   commissionRate: 0.12, status: "active" as const, tags: ["Top Performer", "Strategic"] },
];

const DEALS = [
  { name: "Acme Corp — Enterprise License",       amount: 84000,  status: "won" as const,  daysAgo: 45 },
  { name: "BlueSky Retail — Annual Plan",          amount: 36000,  status: "won" as const,  daysAgo: 38 },
  { name: "Meridian Health — Platform Access",     amount: 120000, status: "won" as const,  daysAgo: 30 },
  { name: "Finvest Capital — Team Plan",           amount: 48000,  status: "won" as const,  daysAgo: 22 },
  { name: "Orbis Logistics — Integration Tier",   amount: 29000,  status: "won" as const,  daysAgo: 18 },
  { name: "Cascade Foods — Growth Plan",           amount: 18000,  status: "won" as const,  daysAgo: 15 },
  { name: "Voltex Energy — Enterprise",            amount: 95000,  status: "won" as const,  daysAgo: 60 },
  { name: "Novo Ventures — Starter",               amount: 12000,  status: "won" as const,  daysAgo: 55 },
  { name: "Paloma Studios — Annual",               amount: 24000,  status: "won" as const,  daysAgo: 50 },
  { name: "HarbourTech — Scale Plan",              amount: 67000,  status: "won" as const,  daysAgo: 70 },
  { name: "Summit Analytics — Enterprise",         amount: 110000, status: "open" as const, daysAgo: 5  },
  { name: "GreenLeaf Markets — Annual",            amount: 42000,  status: "open" as const, daysAgo: 8  },
  { name: "Ironclad Security — Platform",          amount: 78000,  status: "open" as const, daysAgo: 3  },
  { name: "Vertex Systems — Growth",               amount: 33000,  status: "open" as const, daysAgo: 12 },
  { name: "Pulse Media — Starter",                 amount: 9600,   status: "open" as const, daysAgo: 2  },
  { name: "Nova Brands — Annual",                  amount: 15000,  status: "lost" as const, daysAgo: 25 },
  { name: "Driftwood Logistics — Enterprise",      amount: 88000,  status: "lost" as const, daysAgo: 40 },
];

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // ── Idempotency ───────────────────────────────────────────────
    const existing = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("email"), DEMO_ORG_EMAIL))
      .first();
    if (existing) {
      return { status: "already_seeded", orgId: existing._id, message: "Already seeded. Run clearDemo first to reseed." };
    }

    // ── 1. Organization ───────────────────────────────────────────
    const orgId = await ctx.db.insert("organizations", {
      name: "Horizon Software",
      email: DEMO_ORG_EMAIL,
      apiKey: `ck_demo_${Math.random().toString(36).slice(2, 18)}`,
      plan: "growth",
      defaultAttributionModel: "role_based",
      createdAt: now - 90 * DAY,
    });

    // ── 2. Commission Rules ───────────────────────────────────────
    await ctx.db.insert("commissionRules", {
      organizationId: orgId,
      name: "Gold Reseller",
      partnerType: "reseller",
      partnerTier: "gold",
      rate: 0.18,
      priority: 1,
      createdAt: now - 85 * DAY,
    });
    await ctx.db.insert("commissionRules", {
      organizationId: orgId,
      name: "Standard Reseller",
      partnerType: "reseller",
      rate: 0.15,
      priority: 2,
      createdAt: now - 85 * DAY,
    });
    await ctx.db.insert("commissionRules", {
      organizationId: orgId,
      name: "Referral",
      partnerType: "referral",
      rate: 0.12,
      priority: 3,
      createdAt: now - 85 * DAY,
    });
    await ctx.db.insert("commissionRules", {
      organizationId: orgId,
      name: "Affiliate",
      partnerType: "affiliate",
      rate: 0.08,
      priority: 4,
      createdAt: now - 85 * DAY,
    });

    // ── 3. Partners ───────────────────────────────────────────────
    const pIds: Id<"partners">[] = [];
    for (const p of PARTNERS) {
      const id = await ctx.db.insert("partners", {
        organizationId: orgId,
        name: p.name,
        email: p.email,
        contactName: p.contactName,
        type: p.type,
        tier: p.tier,
        commissionRate: p.commissionRate,
        status: p.status,
        tags: p.tags,
        notes: "",
        createdAt: now - 80 * DAY,
      });
      pIds.push(id);
    }

    // ── 4. Deals + Touchpoints + Attributions + Payouts ──────────
    for (let i = 0; i < DEALS.length; i++) {
      const d = DEALS[i];
      const primaryIdx = i % pIds.length;
      const primaryId = pIds[primaryIdx];
      const closedAt = d.status === "won" ? now - d.daysAgo * DAY : undefined;

      const dealId = await ctx.db.insert("deals", {
        organizationId: orgId,
        name: d.name,
        amount: d.amount,
        status: d.status,
        closedAt,
        createdAt: now - (d.daysAgo + 14) * DAY,
        registeredBy: primaryId,
        registrationStatus: "approved",
        productName: "Platform License",
        contactName: d.name.split("—")[0].trim(),
      });

      // Primary touchpoint — deal registration
      await ctx.db.insert("touchpoints", {
        organizationId: orgId,
        dealId,
        partnerId: primaryId,
        type: "deal_registration",
        notes: "Deal registered by partner",
        
        createdAt: now - (d.daysAgo + 14) * DAY,
      });

      // ~40% of deals get a second partner (referral touchpoint)
      const hasSecond = i % 3 === 0;
      const secondIdx = (primaryIdx + 2) % pIds.length;
      const secondId = hasSecond && secondIdx !== primaryIdx ? pIds[secondIdx] : undefined;

      if (secondId) {
        await ctx.db.insert("touchpoints", {
          organizationId: orgId,
          dealId,
          partnerId: secondId,
          type: "referral",
          notes: "Initial introduction",
          
          createdAt: now - (d.daysAgo + 21) * DAY,
        });
      }

      // Attributions + payouts only for won deals
      if (d.status === "won") {
        const primaryPct = secondId ? 0.7 : 1.0;
        const secondPct  = secondId ? 0.3 : 0.0;

        await ctx.db.insert("attributions", {
          organizationId: orgId,
          dealId,
          partnerId: primaryId,
          model: "role_based",
          percentage: primaryPct,
          amount: Math.round(d.amount * primaryPct),
          commissionAmount: Math.round(d.amount * primaryPct * PARTNERS[primaryIdx].commissionRate),
          calculatedAt: closedAt!,
        });

        const primaryRate = PARTNERS[primaryIdx].commissionRate;
        const primaryCommission = Math.round(d.amount * primaryPct * primaryRate);
        const payoutStatus = d.daysAgo > 30 ? "paid" as const : d.daysAgo > 15 ? "approved" as const : "pending_approval" as const;

        await ctx.db.insert("payouts", {
          organizationId: orgId,
          partnerId: primaryId,
          amount: primaryCommission,
          status: payoutStatus,
          paidAt: payoutStatus === "paid" ? closedAt! + 14 * DAY : undefined,
          createdAt: closedAt!,
        });

        if (secondId) {
          const secondRate = PARTNERS[secondIdx].commissionRate;
          await ctx.db.insert("attributions", {
            organizationId: orgId,
            dealId,
            partnerId: secondId,
            model: "role_based",
            percentage: secondPct,
            amount: Math.round(d.amount * secondPct),
            commissionAmount: Math.round(d.amount * secondPct * secondRate),
            calculatedAt: closedAt!,
          });
          await ctx.db.insert("payouts", {
            organizationId: orgId,
            partnerId: secondId,
            amount: Math.round(d.amount * secondPct * secondRate),
            status: payoutStatus,
            paidAt: payoutStatus === "paid" ? closedAt! + 14 * DAY : undefined,
            createdAt: closedAt!,
          });
        }
      }
    }

    return {
      status: "seeded",
      orgId,
      partnersCreated: PARTNERS.length,
      dealsCreated: DEALS.length,
      portalEmails: PARTNERS.map(p => p.email),
      message: `✅ Done. Portal login: use any partner email at /portal`,
    };
  },
});

export const clearDemo = mutation({
  args: {},
  handler: async (ctx) => {
    const org = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("email"), DEMO_ORG_EMAIL))
      .first();
    if (!org) return { status: "not_found" };

    let deleted = 0;
    for (const table of ["commissionRules", "touchpoints", "attributions", "payouts", "partners", "deals"] as const) {
      const rows = await ctx.db.query(table).filter((q) => q.eq(q.field("organizationId"), org._id)).collect();
      for (const r of rows) { await ctx.db.delete(r._id); deleted++; }
    }
    await ctx.db.delete(org._id);
    return { status: "cleared", deleted };
  },
});
