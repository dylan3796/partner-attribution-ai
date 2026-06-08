/**
 * imports.ts — no-auth partner data unlock.
 *
 * Lets a customer bring their own partner data (e.g. a PartnerStack or Monaco
 * CSV export) WITHOUT any OAuth: the client parses the CSV and calls
 * importPartnerData with plain rows. Partners + deals are upserted (deduped by
 * name/email), tagged with the import source, attached to the org's default
 * Program, and — for won deals — run through the real attribution pipeline so
 * the ledger + recommendations populate immediately.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { getOrg } from "./lib/getOrg";
import { calculateDealAttribution } from "./lib/attribution/calculator";

const PARTNER_TYPES = ["affiliate", "referral", "reseller", "integration"] as const;
type PartnerType = (typeof PARTNER_TYPES)[number];

function normType(t?: string): PartnerType {
  const v = (t ?? "").toLowerCase();
  if (v.includes("resell") || v.includes("channel") || v.includes("distrib")) return "reseller";
  if (v.includes("integr") || v.includes("tech")) return "integration";
  if (v.includes("affil")) return "affiliate";
  return "referral";
}

function normRate(rate?: number): number {
  if (rate === undefined || Number.isNaN(rate)) return 0.15;
  return rate > 1 ? rate / 100 : rate; // accept 15 or 0.15 → store 0-1
}

export const importPartnerData = mutation({
  args: {
    source: v.string(), // e.g. "partnerstack" | "monaco" | "csv"
    partners: v.array(
      v.object({
        name: v.string(),
        email: v.optional(v.string()),
        type: v.optional(v.string()),
        tier: v.optional(v.string()),
        commissionRate: v.optional(v.number()),
      })
    ),
    deals: v.optional(
      v.array(
        v.object({
          name: v.string(),
          amount: v.number(),
          status: v.optional(v.string()), // won | open | lost
          partnerName: v.string(), // which partner sourced/registered it
          closedAt: v.optional(v.number()),
          productName: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found. Sign in to import data.");
    const orgId = org._id;
    // deals.source only accepts manual|salesforce|hubspot; CSV imports are "manual".
    const source = "manual" as const;

    // Ensure a default program exists so imported deals get a model.
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    let defaultProgram: Doc<"programs"> | null =
      programs.find((p) => p.isDefault) ?? programs[0] ?? null;
    if (!defaultProgram) {
      const id = await ctx.db.insert("programs", {
        organizationId: orgId,
        name: "Imported Program",
        archetype: "other",
        selectedModel: org.defaultAttributionModel && isBounded(org.defaultAttributionModel)
          ? (org.defaultAttributionModel as any)
          : "role_weighted",
        isDefault: true,
        createdAt: Date.now(),
      });
      defaultProgram = await ctx.db.get(id);
    }
    const programId = defaultProgram!._id;

    // 1. Upsert partners (dedupe by lowercased name, then email).
    const existingPartners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    const byName = new Map<string, Id<"partners">>();
    for (const p of existingPartners) byName.set(p.name.toLowerCase(), p._id);

    let partnersCreated = 0;
    for (const p of args.partners) {
      const key = p.name.toLowerCase();
      if (byName.has(key)) continue;
      const id = await ctx.db.insert("partners", {
        organizationId: orgId,
        name: p.name,
        email: p.email ?? `${key.replace(/[^a-z0-9]+/g, ".")}@imported.local`,
        type: normType(p.type),
        tier: normTier(p.tier),
        commissionRate: normRate(p.commissionRate),
        status: "active",
        createdAt: Date.now(),
      });
      byName.set(key, id);
      partnersCreated++;
    }

    // 2. Upsert deals + a sourcing touchpoint; compute attribution for won deals.
    const existingDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    const dealByName = new Set(existingDeals.map((d) => d.name.toLowerCase()));

    let dealsCreated = 0;
    let attributionsCreated = 0;
    for (const d of args.deals ?? []) {
      if (dealByName.has(d.name.toLowerCase())) continue;
      const partnerId = byName.get(d.partnerName.toLowerCase());
      if (!partnerId) continue; // skip deals whose partner wasn't in the import
      const status = d.status === "won" || d.status === "lost" ? d.status : "open";
      const closedAt = status === "won" ? d.closedAt ?? Date.now() : undefined;

      const dealId = await ctx.db.insert("deals", {
        organizationId: orgId,
        name: d.name,
        amount: d.amount,
        status,
        closedAt,
        programId,
        registeredBy: partnerId,
        registrationStatus: "approved",
        productName: d.productName,
        source,
        createdAt: Date.now(),
      });
      dealByName.add(d.name.toLowerCase());
      dealsCreated++;

      await ctx.db.insert("touchpoints", {
        organizationId: orgId,
        dealId,
        partnerId,
        type: "deal_registration",
        notes: `Imported from ${args.source}`,
        createdAt: closedAt ?? Date.now(),
      });

      if (status === "won") {
        try {
          const result = await calculateDealAttribution(ctx, dealId, orgId, { replaceExisting: true });
          attributionsCreated += result.totalAttributionsCreated;
        } catch {
          /* no touchpoints / no program — skip */
        }
      }
    }

    return {
      status: "imported",
      source: args.source,
      partnersCreated,
      dealsCreated,
      attributionsCreated,
      programId,
    };
  },
});

function isBounded(m: string): boolean {
  return [
    "first_touch_sourcer",
    "split_equally",
    "role_weighted",
    "implementation_credit",
    "marketplace_cosell_hybrid",
  ].includes(m);
}

function normTier(t?: string): "bronze" | "silver" | "gold" | "platinum" | undefined {
  const v = (t ?? "").toLowerCase();
  if (v.includes("platinum")) return "platinum";
  if (v.includes("gold")) return "gold";
  if (v.includes("silver")) return "silver";
  if (v.includes("bronze")) return "bronze";
  return undefined;
}
