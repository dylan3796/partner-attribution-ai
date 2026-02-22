import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    sessionId: v.string(),
    programName: v.optional(v.string()),
    programType: v.string(),
    interactionTypes: v.array(v.object({
      id: v.string(),
      label: v.string(),
      weight: v.number(),
      triggersAttribution: v.boolean(),
      triggersPayout: v.boolean(),
    })),
    attributionModel: v.string(),
    commissionRules: v.array(v.object({
      type: v.string(),
      value: v.number(),
      unit: v.string(),
      label: v.string(),
    })),
    enabledModules: v.array(v.string()),
    rawConfig: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("programConfig")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const data = { ...args, configuredAt: Date.now() };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("programConfig", data);
    }
  },
});

export const getBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("programConfig")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("programConfig").order("desc").take(1);
    return configs[0] ?? null;
  },
});

export const update = mutation({
  args: {
    id: v.id("programConfig"),
    programName: v.optional(v.string()),
    programType: v.optional(v.string()),
    interactionTypes: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      weight: v.number(),
      triggersAttribution: v.boolean(),
      triggersPayout: v.boolean(),
    }))),
    attributionModel: v.optional(v.string()),
    commissionRules: v.optional(v.array(v.object({
      type: v.string(),
      value: v.number(),
      unit: v.string(),
      label: v.string(),
    }))),
    enabledModules: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...filtered, configuredAt: Date.now() });
    return id;
  },
});
