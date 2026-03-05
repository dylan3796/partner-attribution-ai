import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOrgId } from "./lib/getOrg";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    return ctx.db
      .query("products")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    const products = await ctx.db
      .query("products")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    return [...new Set(products.map((p) => p.category))].sort();
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    sku: v.string(),
    name: v.string(),
    category: v.string(),
    msrp: v.number(),
    distributorPrice: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    const margin = args.msrp > 0
      ? Math.round(((args.msrp - args.distributorPrice) / args.msrp) * 100)
      : 0;

    const now = Date.now();
    const id = await ctx.db.insert("products", {
      organizationId: orgId,
      sku: args.sku,
      name: args.name,
      category: args.category,
      msrp: args.msrp,
      distributorPrice: args.distributorPrice,
      margin,
      status: "active",
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    sku: v.optional(v.string()),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    msrp: v.optional(v.number()),
    distributorPrice: v.optional(v.number()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");

    const msrp = updates.msrp ?? existing.msrp;
    const distPrice = updates.distributorPrice ?? existing.distributorPrice;
    const margin = msrp > 0
      ? Math.round(((msrp - distPrice) / msrp) * 100)
      : 0;

    const patch: Record<string, unknown> = { ...updates, margin, updatedAt: Date.now() };
    // Remove undefined keys
    for (const key of Object.keys(patch)) {
      if (patch[key] === undefined) delete patch[key];
    }

    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const toggleStatus = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const product = await ctx.db.get(id);
    if (!product) throw new Error("Product not found");
    await ctx.db.patch(id, {
      status: product.status === "active" ? "inactive" : "active",
      updatedAt: Date.now(),
    });
  },
});
