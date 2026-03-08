import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOrgId } from "./lib/getOrg";

/** List all announcements for the org (admin view — includes drafts) */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    return await ctx.db
      .query("announcements")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .order("desc")
      .collect();
  },
});

/** List published announcements only (portal view) */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    const all = await ctx.db
      .query("announcements")
      .withIndex("by_org_published", (q) =>
        q.eq("organizationId", orgId).eq("isPublished", true)
      )
      .order("desc")
      .collect();
    // Pinned first, then by date
    return all.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.publishedAt ?? b.createdAt) - (a.publishedAt ?? a.createdAt);
    });
  },
});

/** Get counts for stats */
export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return { total: 0, published: 0, drafts: 0, pinned: 0 };
    const all = await ctx.db
      .query("announcements")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    return {
      total: all.length,
      published: all.filter((a) => a.isPublished).length,
      drafts: all.filter((a) => !a.isPublished).length,
      pinned: all.filter((a) => a.isPinned).length,
    };
  },
});

/** Create a new announcement */
export const create = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    type: v.union(
      v.literal("general"),
      v.literal("product"),
      v.literal("incentive"),
      v.literal("policy"),
      v.literal("event")
    ),
    isPinned: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    authorName: v.string(),
    authorEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");
    const now = Date.now();
    return await ctx.db.insert("announcements", {
      organizationId: orgId,
      title: args.title,
      body: args.body,
      type: args.type,
      isPinned: args.isPinned ?? false,
      isPublished: args.isPublished ?? false,
      authorName: args.authorName,
      authorEmail: args.authorEmail,
      publishedAt: args.isPublished ? now : undefined,
      createdAt: now,
    });
  },
});

/** Update an announcement */
export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("general"),
        v.literal("product"),
        v.literal("incentive"),
        v.literal("policy"),
        v.literal("event")
      )
    ),
    isPinned: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.organizationId !== orgId) throw new Error("Not found");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.body !== undefined) updates.body = args.body;
    if (args.type !== undefined) updates.type = args.type;
    if (args.isPinned !== undefined) updates.isPinned = args.isPinned;
    if (args.isPublished !== undefined) {
      updates.isPublished = args.isPublished;
      // Set publishedAt when first published
      if (args.isPublished && !existing.publishedAt) {
        updates.publishedAt = Date.now();
      }
    }

    await ctx.db.patch(args.id, updates);
  },
});

/** Delete an announcement */
export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.organizationId !== orgId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
