import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getOrgId } from "./lib/getOrg";

/* ── Queries ── */

export const list = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    return await ctx.db
      .query("disputes")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
  },
});

export const getByDeal = query({
  args: { dealId: v.id("deals") },
  handler: async (ctx, { dealId }) => {
    return await ctx.db
      .query("disputes")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .collect();
  },
});

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return { open: 0, underReview: 0, resolved: 0, rejected: 0, total: 0 };
    const all = await ctx.db
      .query("disputes")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    return {
      open: all.filter((d) => d.status === "open").length,
      underReview: all.filter((d) => d.status === "under_review").length,
      resolved: all.filter((d) => d.status === "resolved").length,
      rejected: all.filter((d) => d.status === "rejected").length,
      total: all.length,
    };
  },
});

/* ── Mutations ── */

export const create = mutation({
  args: {
    partnerId: v.id("partners"),
    dealId: v.id("deals"),
    currentPercentage: v.number(),
    requestedPercentage: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");

    // Prevent duplicate open disputes for same deal+partner
    const existing = await ctx.db
      .query("disputes")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect();
    const duplicate = existing.find(
      (d) =>
        d.partnerId === args.partnerId &&
        (d.status === "open" || d.status === "under_review")
    );
    if (duplicate) throw new Error("An open dispute already exists for this deal and partner");

    const id = await ctx.db.insert("disputes", {
      organizationId: orgId,
      partnerId: args.partnerId,
      dealId: args.dealId,
      currentPercentage: args.currentPercentage,
      requestedPercentage: args.requestedPercentage,
      reason: args.reason,
      status: "open",
      createdAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      action: "dispute.opened",
      entityType: "deal",
      entityId: args.dealId,
      changes: `Dispute opened by partner for deal — requesting ${args.requestedPercentage}% (current ${args.currentPercentage}%)`,
      createdAt: Date.now(),
    });

    return id;
  },
});

export const updateStatus = mutation({
  args: {
    disputeId: v.id("disputes"),
    status: v.union(
      v.literal("open"),
      v.literal("under_review"),
      v.literal("resolved"),
      v.literal("rejected")
    ),
    resolution: v.optional(v.string()),
  },
  handler: async (ctx, { disputeId, status, resolution }) => {
    const dispute = await ctx.db.get(disputeId);
    if (!dispute) throw new Error("Dispute not found");

    const updates: Record<string, unknown> = { status };
    if (status === "resolved" || status === "rejected") {
      updates.resolvedAt = Date.now();
      updates.resolvedBy = "admin";
      if (resolution) updates.resolution = resolution;
    }
    if (resolution) updates.resolution = resolution;

    await ctx.db.patch(disputeId, updates);

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: dispute.organizationId,
      action: status === "resolved" ? "dispute.resolved" : status === "rejected" ? "dispute.rejected" : "dispute.updated",
      entityType: "deal",
      entityId: dispute.dealId,
      changes: `Dispute ${status}${resolution ? `: ${resolution}` : ""}`,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { disputeId: v.id("disputes") },
  handler: async (ctx, { disputeId }) => {
    const dispute = await ctx.db.get(disputeId);
    if (!dispute) throw new Error("Dispute not found");
    await ctx.db.delete(disputeId);
  },
});
