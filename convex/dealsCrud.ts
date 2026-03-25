/**
 * Simple deal CRUD for the frontend (no API-key auth, single-org).
 * Named dealsCrud to avoid conflict with the existing deals.ts (deal registration).
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { getOrg } from "./lib/getOrg";
import { calculateDealAttribution, calculateMissingAttributions } from "./lib/attribution/calculator";

async function defaultOrg(ctx: any) {
  return await getOrg(ctx);
}

// ── Queries ────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();
  },
});

// ── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    name: v.string(),
    amount: v.number(),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    registeredBy: v.optional(v.id("partners")),
    status: v.optional(v.union(v.literal("open"), v.literal("won"), v.literal("lost"))),
    registrationStatus: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    closedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    source: v.optional(v.union(v.literal("manual"), v.literal("salesforce"), v.literal("hubspot"))),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found. Run seed data first.");
    return await ctx.db.insert("deals", {
      organizationId: org._id,
      name: args.name,
      amount: args.amount,
      status: args.status ?? "open",
      contactName: args.contactName,
      contactEmail: args.contactEmail,
      registeredBy: args.registeredBy,
      registrationStatus: args.registrationStatus ?? (args.registeredBy ? "pending" : undefined),
      closedAt: args.closedAt,
      notes: args.notes,
      source: args.source,
      createdAt: Date.now(),
    });
  },
});

export const closeDeal = mutation({
  args: {
    id: v.id("deals"),
    status: v.union(v.literal("won"), v.literal("lost")),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);

    await ctx.db.patch(args.id, {
      status: args.status,
      closedAt: Date.now(),
    });

    // Auto-calculate attribution when a deal is won
    if (args.status === "won" && org) {
      try {
        const result = await calculateDealAttribution(ctx, args.id, org._id, {
          replaceExisting: true,
        });
        // Audit log
        await ctx.db.insert("audit_log", {
          organizationId: org._id,
          action: "attribution.calculated",
          entityType: "deal",
          entityId: args.id,
          changes: JSON.stringify({
            models: result.modelsCalculated,
            attributionsCreated: result.totalAttributionsCreated,
            calculationTimeMs: result.calculationTimeMs,
          }),
          createdAt: Date.now(),
        });
        return {
          success: true,
          attribution: {
            modelsCalculated: result.modelsCalculated.length,
            attributionsCreated: result.totalAttributionsCreated,
          },
        };
      } catch (e: any) {
        // Deal is still closed even if attribution fails (e.g. no touchpoints)
        console.warn("Attribution calculation skipped:", e.message);
        return { success: true, attribution: null, reason: e.message };
      }
    }

    return { success: true };
  },
});

/**
 * Recalculate attribution for a specific deal.
 * Useful when touchpoints are added/changed after initial calculation.
 */
export const recalculateAttribution = mutation({
  args: {
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found.");

    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new Error("Deal not found.");
    if (deal.status !== "won") throw new Error("Can only calculate attribution for won deals.");

    const result = await calculateDealAttribution(ctx, args.dealId, org._id, {
      replaceExisting: true,
    });

    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      action: "attribution.recalculated",
      entityType: "deal",
      entityId: args.dealId,
      changes: JSON.stringify({
        models: result.modelsCalculated,
        attributionsCreated: result.totalAttributionsCreated,
      }),
      createdAt: Date.now(),
    });

    return {
      success: true,
      modelsCalculated: result.modelsCalculated.length,
      attributionsCreated: result.totalAttributionsCreated,
      calculationTimeMs: result.calculationTimeMs,
    };
  },
});

/**
 * Calculate attribution for all won deals missing attribution data.
 * Backfill tool for orgs with existing data.
 */
export const calculateAllMissing = mutation({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found.");

    const result = await calculateMissingAttributions(ctx, org._id);

    if (result.dealsProcessed > 0) {
      await ctx.db.insert("audit_log", {
        organizationId: org._id,
        action: "attribution.backfill",
        entityType: "organization",
        entityId: org._id,
        changes: JSON.stringify(result),
        createdAt: Date.now(),
      });
    }

    return result;
  },
});

export const update = mutation({
  args: {
    id: v.id("deals"),
    name: v.optional(v.string()),
    amount: v.optional(v.number()),
    status: v.optional(
      v.union(v.literal("open"), v.literal("won"), v.literal("lost"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return { success: true };
  },
});
