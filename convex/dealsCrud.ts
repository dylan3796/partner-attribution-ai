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
    registeredBy: v.optional(v.id("partners")),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found. Run seed data first.");
    return await ctx.db.insert("deals", {
      organizationId: org._id,
      name: args.name,
      amount: args.amount,
      status: "open",
      contactName: args.contactName,
      registeredBy: args.registeredBy,
      registrationStatus: args.registeredBy ? "pending" : undefined,
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
