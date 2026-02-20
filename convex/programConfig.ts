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
