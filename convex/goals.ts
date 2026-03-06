/**
 * Goals & Targets — set quarterly objectives and track live progress.
 * Progress is computed from real deal/partner/payout data in the same org.
 */
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOrg } from "./lib/getOrg";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("goals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();
  },
});

/** Compute live progress for all goals using real data */
export const getProgress = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return {};

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();

    if (goals.length === 0) return {};

    // Pre-fetch all deals and partners once
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();

    const allPartners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();

    const progress: Record<string, { current: number; percentage: number }> = {};

    for (const goal of goals) {
      const { startDate, endDate, metric, target } = goal;

      let current = 0;

      if (metric === "revenue") {
        // Sum of won deal amounts in period
        current = allDeals
          .filter(
            (d) =>
              d.status === "won" &&
              d.closedAt &&
              d.closedAt >= startDate &&
              d.closedAt <= endDate
          )
          .reduce((sum, d) => sum + d.amount, 0);
      } else if (metric === "pipeline") {
        // Sum of open deal amounts created in period
        current = allDeals
          .filter(
            (d) =>
              d.status === "open" &&
              d.createdAt >= startDate &&
              d.createdAt <= endDate
          )
          .reduce((sum, d) => sum + d.amount, 0);
      } else if (metric === "partners") {
        // Count of partners created in period
        current = allPartners.filter(
          (p) => p.createdAt >= startDate && p.createdAt <= endDate
        ).length;
      } else if (metric === "deals") {
        // Count of won deals in period
        current = allDeals.filter(
          (d) =>
            d.status === "won" &&
            d.closedAt &&
            d.closedAt >= startDate &&
            d.closedAt <= endDate
        ).length;
      } else if (metric === "win_rate") {
        // Win rate % of deals closed (won or lost) in period
        const closed = allDeals.filter(
          (d) =>
            (d.status === "won" || d.status === "lost") &&
            d.closedAt &&
            d.closedAt >= startDate &&
            d.closedAt <= endDate
        );
        const won = closed.filter((d) => d.status === "won").length;
        current = closed.length > 0 ? Math.round((won / closed.length) * 100) : 0;
      }

      const percentage =
        target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

      progress[goal._id] = { current, percentage };
    }

    return progress;
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    metric: v.union(
      v.literal("revenue"),
      v.literal("pipeline"),
      v.literal("partners"),
      v.literal("deals"),
      v.literal("win_rate")
    ),
    label: v.string(),
    target: v.number(),
    period: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found");

    return await ctx.db.insert("goals", {
      organizationId: org._id,
      metric: args.metric,
      label: args.label,
      target: args.target,
      period: args.period,
      startDate: args.startDate,
      endDate: args.endDate,
      status: "active",
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("goals"),
    label: v.optional(v.string()),
    target: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("completed"),
        v.literal("missed")
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.id);
    if (!goal) throw new Error("Goal not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.label !== undefined) patch.label = args.label;
    if (args.target !== undefined) patch.target = args.target;
    if (args.status !== undefined) patch.status = args.status;
    if (args.notes !== undefined) patch.notes = args.notes;

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
