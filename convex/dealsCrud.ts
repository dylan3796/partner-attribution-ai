/**
 * Simple deal CRUD for the frontend (no API-key auth, single-org).
 * Named dealsCrud to avoid conflict with the existing deals.ts (deal registration).
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function defaultOrg(ctx: any) {
  return await ctx.db.query("organizations").first();
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
    await ctx.db.patch(args.id, {
      status: args.status,
      closedAt: Date.now(),
    });
    return { success: true };
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
