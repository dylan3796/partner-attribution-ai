/**
 * Programs — a customer runs several partner programs in parallel, each selecting
 * ONE bounded attribution model + config. CRUD + default-program resolution.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOrg } from "./lib/getOrg";

const archetypeValidator = v.union(
  v.literal("si"),
  v.literal("cloud_cosell"),
  v.literal("tech_isv"),
  v.literal("reseller"),
  v.literal("other")
);

const modelValidator = v.union(
  v.literal("first_touch_sourcer"),
  v.literal("split_equally"),
  v.literal("role_weighted"),
  v.literal("implementation_credit"),
  v.literal("marketplace_cosell_hybrid")
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("programs")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();
  },
});

export const getDefault = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return null;
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();
    return programs.find((p) => p.isDefault) ?? programs[0] ?? null;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    archetype: archetypeValidator,
    selectedModel: modelValidator,
    modelConfig: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found.");

    // Only one default program per org.
    if (args.isDefault) await clearDefault(ctx, org._id);

    return await ctx.db.insert("programs", {
      organizationId: org._id,
      name: args.name,
      archetype: args.archetype,
      selectedModel: args.selectedModel,
      modelConfig: args.modelConfig,
      isDefault: args.isDefault,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("programs"),
    name: v.optional(v.string()),
    archetype: v.optional(archetypeValidator),
    selectedModel: v.optional(modelValidator),
    modelConfig: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found.");
    const { id, ...patch } = args;

    // Authorize: the program must belong to the caller's org (prevents
    // cross-tenant modification via a leaked/guessed program id).
    const existing = await ctx.db.get(id);
    if (!existing || existing.organizationId !== org._id) {
      throw new Error("Program not found.");
    }

    if (patch.isDefault) await clearDefault(ctx, org._id);

    const cleaned = Object.fromEntries(
      Object.entries(patch).filter(([, value]) => value !== undefined)
    );
    await ctx.db.patch(id, cleaned);
    return { success: true };
  },
});

export const remove = mutation({
  args: { id: v.id("programs") },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found.");

    // Authorize: only delete a program owned by the caller's org.
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.organizationId !== org._id) {
      throw new Error("Program not found.");
    }
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Helper: unset isDefault on every program for an org.
async function clearDefault(ctx: any, orgId: any) {
  const existing = await ctx.db
    .query("programs")
    .withIndex("by_organization", (q: any) => q.eq("organizationId", orgId))
    .collect();
  for (const p of existing) {
    if (p.isDefault) await ctx.db.patch(p._id, { isDefault: false });
  }
}
