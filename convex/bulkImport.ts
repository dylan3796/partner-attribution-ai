/**
 * Bulk import mutations for CSV import.
 * Writes directly to Convex — no local store, no API key needed.
 * Scoped to the authenticated user's organization.
 */
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOrg } from "./lib/getOrg";

async function requireOrg(ctx: any) {
  const org = await getOrg(ctx);
  if (!org) throw new Error("No organization found. Complete onboarding first.");
  return org;
}

// ── Bulk import partners ──

export const importPartners = mutation({
  args: {
    partners: v.array(
      v.object({
        name: v.string(),
        email: v.string(),
        type: v.union(
          v.literal("affiliate"),
          v.literal("referral"),
          v.literal("reseller"),
          v.literal("integration")
        ),
        tier: v.optional(
          v.union(
            v.literal("bronze"),
            v.literal("silver"),
            v.literal("gold"),
            v.literal("platinum")
          )
        ),
        commissionRate: v.number(),
        status: v.union(
          v.literal("active"),
          v.literal("inactive"),
          v.literal("pending")
        ),
        contactName: v.optional(v.string()),
        territory: v.optional(v.string()),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const org = await requireOrg(ctx);
    const ids = [];
    for (const p of args.partners) {
      const id = await ctx.db.insert("partners", {
        ...p,
        organizationId: org._id,
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return { imported: ids.length, ids };
  },
});

// ── Bulk import deals ──

export const importDeals = mutation({
  args: {
    deals: v.array(
      v.object({
        name: v.string(),
        amount: v.number(),
        status: v.union(
          v.literal("open"),
          v.literal("won"),
          v.literal("lost")
        ),
        contactName: v.optional(v.string()),
        contactEmail: v.optional(v.string()),
        expectedCloseDate: v.optional(v.number()),
        notes: v.optional(v.string()),
        source: v.optional(
          v.union(
            v.literal("manual"),
            v.literal("salesforce"),
            v.literal("hubspot")
          )
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const org = await requireOrg(ctx);
    const ids = [];
    for (const d of args.deals) {
      const id = await ctx.db.insert("deals", {
        ...d,
        organizationId: org._id,
        closedAt: d.status !== "open" ? Date.now() : undefined,
        source: d.source ?? "manual",
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return { imported: ids.length, ids };
  },
});

// ── Bulk import touchpoints ──

export const importTouchpoints = mutation({
  args: {
    touchpoints: v.array(
      v.object({
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
      })
    ),
  },
  handler: async (ctx, args) => {
    const org = await requireOrg(ctx);
    const ids = [];
    for (const tp of args.touchpoints) {
      // Verify deal and partner belong to this org
      const deal = await ctx.db.get(tp.dealId);
      if (!deal || deal.organizationId !== org._id) {
        throw new Error(`Deal ${tp.dealId} not found in your organization`);
      }
      const partner = await ctx.db.get(tp.partnerId);
      if (!partner || partner.organizationId !== org._id) {
        throw new Error(`Partner ${tp.partnerId} not found in your organization`);
      }

      const id = await ctx.db.insert("touchpoints", {
        ...tp,
        organizationId: org._id,
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return { imported: ids.length, ids };
  },
});
