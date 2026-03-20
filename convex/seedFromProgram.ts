/**
 * seedFromProgram.ts — Seed personalized demo data based on the user's
 * natural-language program description.
 *
 * Instead of hardcoded generic partners/deals, this creates data that
 * mirrors their actual partner types, tiers, and commission rates.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const DAY = 86_400_000;
const now = Date.now();

// Realistic partner company names per type
const PARTNER_NAMES: Record<string, { name: string; contact: string; email: string }[]> = {
  reseller: [
    { name: "CloudBridge Partners", contact: "Sarah Chen", email: "sarah@cloudbridge.io" },
    { name: "Nexus Channel Group", contact: "David Park", email: "david@nexuschannel.com" },
    { name: "Pinnacle Resellers", contact: "Maria Santos", email: "maria@pinnacleresellers.co" },
    { name: "Velocity Distribution", contact: "Ryan Hughes", email: "ryan@velocitydist.com" },
  ],
  referral: [
    { name: "Apex Advisory", contact: "Marcus Webb", email: "marcus@apexadvisory.com" },
    { name: "Lighthouse Consulting", contact: "Emily Foster", email: "emily@lighthouseconsulting.io" },
    { name: "Clearpath Solutions", contact: "Elena Torres", email: "elena@clearpathsolutions.co" },
    { name: "Horizon Strategy", contact: "James Kim", email: "james@horizonstrategy.com" },
  ],
  affiliate: [
    { name: "TechStack Review", contact: "Priya Patel", email: "priya@techstackreview.com" },
    { name: "SaaS Insider", contact: "Jordan Lee", email: "jordan@saasinsider.io" },
    { name: "Growth Hackers Network", contact: "Alex Chen", email: "alex@growthhackersnet.com" },
    { name: "DigitalFirst Media", contact: "Nina Rossi", email: "nina@digitalfirstmedia.co" },
  ],
  integration: [
    { name: "DataSync Labs", contact: "Tom Brennan", email: "tom@datasynclabs.io" },
    { name: "APIConnect", contact: "Lisa Wang", email: "lisa@apiconnect.dev" },
    { name: "FlowBridge Tech", contact: "Carlos Mendez", email: "carlos@flowbridge.io" },
    { name: "IntegrateHQ", contact: "Aisha Johnson", email: "aisha@integratehq.com" },
  ],
  partner: [
    { name: "Strategic Growth Co", contact: "Michael Ross", email: "michael@strategicgrowth.co" },
    { name: "Alliance Partners", contact: "Sarah Kim", email: "sarah@alliancepartners.io" },
    { name: "TrueNorth Partners", contact: "David Chen", email: "david@truenorthpartners.com" },
    { name: "Keystone Group", contact: "Rachel Green", email: "rachel@keystonegroup.co" },
  ],
};

// Deal names by industry — makes the demo feel real
const DEAL_TEMPLATES = [
  { name: "Acme Corp — Enterprise License", amount: 84000 },
  { name: "BlueSky Retail — Annual Plan", amount: 36000 },
  { name: "Meridian Health — Platform Access", amount: 120000 },
  { name: "Finvest Capital — Team Plan", amount: 48000 },
  { name: "Orbis Logistics — Integration Tier", amount: 29000 },
  { name: "Cascade Foods — Growth Plan", amount: 18000 },
  { name: "Voltex Energy — Enterprise", amount: 95000 },
  { name: "Novo Ventures — Starter", amount: 12000 },
  { name: "Paloma Studios — Annual", amount: 24000 },
  { name: "HarbourTech — Scale Plan", amount: 67000 },
  { name: "Summit Analytics — Enterprise", amount: 110000 },
  { name: "GreenLeaf Markets — Annual", amount: 42000 },
  { name: "Ironclad Security — Platform", amount: 78000 },
  { name: "Vertex Systems — Growth", amount: 33000 },
  { name: "Pulse Media — Starter", amount: 9600 },
  { name: "Nova Brands — Annual", amount: 15000 },
  { name: "Driftwood Logistics — Enterprise", amount: 88000 },
];

const TIERS_ORDER = ["bronze", "silver", "gold", "platinum"] as const;

export const seedFromProgram = mutation({
  args: {
    partnerTypes: v.array(v.object({
      type: v.string(),
      rate: v.number(),
    })),
    tiers: v.array(v.object({
      name: v.string(),
      rate: v.number(),
      mdf: v.optional(v.number()),
    })),
    bonuses: v.array(v.string()),
    summary: v.string(),
    description: v.string(), // the raw NL text
  },
  handler: async (ctx, args) => {
    const { getOrg } = await import("./lib/getOrg");
    const org = await getOrg(ctx);
    if (!org) return { status: "no_org" };

    const orgId = org._id;

    // Idempotency: skip if already has partners
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .first();
    if (existing) return { status: "already_has_data" };

    // ── 1. Commission Rules (from parsed program) ─────────────────
    let rulePriority = 1;

    // Type-based rules
    for (const pt of args.partnerTypes) {
      const partnerType = normalizePartnerType(pt.type);
      await ctx.db.insert("commissionRules", {
        organizationId: orgId,
        name: `${capitalize(pt.type)} Commission`,
        partnerType,
        rate: pt.rate / 100, // convert from percentage to decimal
        priority: rulePriority++,
        createdAt: now - 85 * DAY,
      });
    }

    // Tier-based rules (override type-based rules with higher priority)
    for (const tier of args.tiers) {
      const tierName = normalizeTier(tier.name);
      if (!tierName) continue;

      // Find which types this tier might apply to — create rules for each
      const types = args.partnerTypes.length > 0
        ? args.partnerTypes.map(pt => normalizePartnerType(pt.type))
        : ["reseller" as const]; // default if no types specified

      for (const partnerType of types) {
        // Only create tier rule if rate differs from type base rate
        const existingTypeRule = args.partnerTypes.find(
          pt => normalizePartnerType(pt.type) === partnerType
        );
        if (existingTypeRule && existingTypeRule.rate === tier.rate) continue;

        await ctx.db.insert("commissionRules", {
          organizationId: orgId,
          name: `${capitalize(tier.name)} ${capitalize(partnerType)}`,
          partnerType,
          partnerTier: tierName,
          rate: tier.rate / 100,
          priority: rulePriority++,
          createdAt: now - 85 * DAY,
        });
      }
    }

    // Fallback: if no rules were created, add a default 15%
    if (args.partnerTypes.length === 0 && args.tiers.length === 0) {
      await ctx.db.insert("commissionRules", {
        organizationId: orgId,
        name: "Default Commission",
        rate: 0.15,
        priority: 1,
        createdAt: now - 85 * DAY,
      });
    }

    // ── 2. Partners (matched to described types/tiers) ────────────
    const pIds: Id<"partners">[] = [];
    const partnerMeta: { type: string; rate: number; tier?: string }[] = [];

    // Determine which types and tiers to create partners for
    const typesToCreate = args.partnerTypes.length > 0
      ? args.partnerTypes
      : [{ type: "partner", rate: 15 }];

    const tiersList = args.tiers.length > 0
      ? args.tiers.map(t => normalizeTier(t.name)).filter(Boolean) as typeof TIERS_ORDER[number][]
      : ["silver", "gold"] as typeof TIERS_ORDER[number][];

    let partnerCount = 0;
    for (const pt of typesToCreate) {
      const partnerType = normalizePartnerType(pt.type);
      const namesPool = PARTNER_NAMES[partnerType] || PARTNER_NAMES.partner;

      // Create 2-3 partners per type, distributed across tiers
      const countForType = Math.min(3, namesPool.length);
      for (let i = 0; i < countForType; i++) {
        const info = namesPool[i];
        const tier = tiersList[i % tiersList.length];

        // Use tier-specific rate if available, otherwise type rate
        const tierInfo = args.tiers.find(t => normalizeTier(t.name) === tier);
        const effectiveRate = tierInfo ? tierInfo.rate / 100 : pt.rate / 100;

        const id = await ctx.db.insert("partners", {
          organizationId: orgId,
          name: info.name,
          email: info.email,
          contactName: info.contact,
          type: partnerType,
          tier: tier,
          commissionRate: effectiveRate,
          status: "active" as const,
          tags: tier === "gold" || tier === "platinum" ? ["Top Performer", "Strategic"] : tier === "silver" ? ["Strategic"] : ["New"],
          notes: "",
          createdAt: now - (80 - partnerCount * 3) * DAY,
        });
        pIds.push(id);
        partnerMeta.push({ type: partnerType, rate: effectiveRate, tier });
        partnerCount++;
      }
    }

    // ── 3. Deals + Touchpoints + Attributions + Payouts ──────────
    const dealCount = Math.min(DEAL_TEMPLATES.length, Math.max(10, pIds.length * 3));

    for (let i = 0; i < dealCount; i++) {
      const d = DEAL_TEMPLATES[i];
      const daysAgo = 2 + i * 4; // spread over time
      const primaryIdx = i % pIds.length;
      const primaryId = pIds[primaryIdx];

      // Mix of won/open/lost
      const status: "won" | "open" | "lost" =
        i < dealCount * 0.6 ? "won" :
        i < dealCount * 0.85 ? "open" : "lost";

      const closedAt = status === "won" ? now - daysAgo * DAY : undefined;

      const dealId = await ctx.db.insert("deals", {
        organizationId: orgId,
        name: d.name,
        amount: d.amount,
        status,
        closedAt,
        createdAt: now - (daysAgo + 14) * DAY,
        registeredBy: primaryId,
        registrationStatus: "approved",
        productName: "Platform License",
        contactName: d.name.split("—")[0].trim(),
      });

      // Primary touchpoint
      await ctx.db.insert("touchpoints", {
        organizationId: orgId,
        dealId,
        partnerId: primaryId,
        type: "deal_registration",
        notes: "Deal registered by partner",
        createdAt: now - (daysAgo + 14) * DAY,
      });

      // ~33% get a second partner touchpoint
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
          createdAt: now - (daysAgo + 21) * DAY,
        });
      }

      // Attributions + payouts for won deals
      if (status === "won" && closedAt) {
        const primaryPct = secondId ? 0.7 : 1.0;
        const primaryRate = partnerMeta[primaryIdx].rate;

        await ctx.db.insert("attributions", {
          organizationId: orgId,
          dealId,
          partnerId: primaryId,
          model: "role_based",
          percentage: primaryPct,
          amount: Math.round(d.amount * primaryPct),
          commissionAmount: Math.round(d.amount * primaryPct * primaryRate),
          calculatedAt: closedAt,
        });

        const payoutStatus = daysAgo > 30 ? "paid" as const : daysAgo > 15 ? "approved" as const : "pending_approval" as const;
        await ctx.db.insert("payouts", {
          organizationId: orgId,
          partnerId: primaryId,
          amount: Math.round(d.amount * primaryPct * primaryRate),
          status: payoutStatus,
          paidAt: payoutStatus === "paid" ? closedAt + 14 * DAY : undefined,
          createdAt: closedAt,
        });

        if (secondId) {
          const secondRate = partnerMeta[secondIdx].rate;
          await ctx.db.insert("attributions", {
            organizationId: orgId,
            dealId,
            partnerId: secondId,
            model: "role_based",
            percentage: 0.3,
            amount: Math.round(d.amount * 0.3),
            commissionAmount: Math.round(d.amount * 0.3 * secondRate),
            calculatedAt: closedAt,
          });
          await ctx.db.insert("payouts", {
            organizationId: orgId,
            partnerId: secondId,
            amount: Math.round(d.amount * 0.3 * secondRate),
            status: payoutStatus,
            paidAt: payoutStatus === "paid" ? closedAt + 14 * DAY : undefined,
            createdAt: closedAt,
          });
        }
      }
    }

    // ── 4. Store the program config ──────────────────────────────
    // Save the NL description as a programConfig for reference
    await ctx.db.insert("programConfig", {
      sessionId: `onboard_${Date.now()}`,
      programName: "My Partner Program",
      programType: typesToCreate.map(t => t.type).join(", "),
      interactionTypes: [
        { id: "deal_registration", label: "Deal Registration", weight: 1, triggersAttribution: true, triggersPayout: true },
        { id: "referral", label: "Referral", weight: 0.8, triggersAttribution: true, triggersPayout: true },
        { id: "co_sell", label: "Co-Sell", weight: 0.6, triggersAttribution: true, triggersPayout: false },
      ],
      attributionModel: "role_based",
      commissionRules: typesToCreate.map(pt => ({
        type: pt.type,
        value: pt.rate,
        unit: "percent",
        label: `${capitalize(pt.type)} — ${pt.rate}%`,
      })),
      enabledModules: ["attribution", "payouts", "partners", "deals"],
      rawConfig: JSON.stringify({
        partnerTypes: args.partnerTypes,
        tiers: args.tiers,
        bonuses: args.bonuses,
        description: args.description,
      }),
      configuredAt: now,
    });

    return {
      status: "seeded",
      partners: pIds.length,
      deals: dealCount,
      rules: rulePriority - 1,
      summary: args.summary,
    };
  },
});

// ── Helpers ──────────────────────────────────────────────────────

function normalizePartnerType(raw: string): "reseller" | "referral" | "affiliate" | "integration" {
  const lower = raw.toLowerCase();
  if (lower.includes("resell") || lower.includes("channel")) return "reseller";
  if (lower.includes("referr")) return "referral";
  if (lower.includes("affil")) return "affiliate";
  if (lower.includes("integr") || lower.includes("tech")) return "integration";
  return "referral"; // safe default
}

function normalizeTier(raw: string): "bronze" | "silver" | "gold" | "platinum" | null {
  const lower = raw.toLowerCase();
  if (lower.includes("plat")) return "platinum";
  if (lower.includes("gold")) return "gold";
  if (lower.includes("silver")) return "silver";
  if (lower.includes("bronze")) return "bronze";
  return null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
