import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Default preferences ──────────────────────────────────────────────────

const DEFAULT_IN_APP = {
  deal_approved: true,
  deal_registered: true,
  deal_disputed: true,
  commission_paid: true,
  partner_joined: true,
  partner_application: true,
  tier_change: true,
  payout_ready: true,
  system: true,
};

const DEFAULT_EMAIL_EVENTS = {
  deal_approved: true,
  deal_registered: false,
  deal_disputed: true,
  commission_paid: true,
  partner_joined: true,
  partner_application: true,
  tier_change: false,
  payout_ready: true,
};

// ── Queries ──────────────────────────────────────────────────────────────

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    const prefs = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!prefs) {
      // Return defaults (not yet persisted)
      return {
        _id: null,
        userId,
        inApp: DEFAULT_IN_APP,
        emailDigest: "daily" as const,
        emailEvents: DEFAULT_EMAIL_EVENTS,
        quietHoursEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "08:00",
        updatedAt: Date.now(),
      };
    }

    return prefs;
  },
});

// ── Mutations ────────────────────────────────────────────────────────────

const inAppValidator = v.object({
  deal_approved: v.boolean(),
  deal_registered: v.boolean(),
  deal_disputed: v.boolean(),
  commission_paid: v.boolean(),
  partner_joined: v.boolean(),
  partner_application: v.boolean(),
  tier_change: v.boolean(),
  payout_ready: v.boolean(),
  system: v.boolean(),
});

const emailEventsValidator = v.object({
  deal_approved: v.boolean(),
  deal_registered: v.boolean(),
  deal_disputed: v.boolean(),
  commission_paid: v.boolean(),
  partner_joined: v.boolean(),
  partner_application: v.boolean(),
  tier_change: v.boolean(),
  payout_ready: v.boolean(),
});

export const save = mutation({
  args: {
    inApp: inAppValidator,
    emailDigest: v.union(
      v.literal("off"),
      v.literal("instant"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    emailEvents: emailEventsValidator,
    quietHoursEnabled: v.boolean(),
    quietHoursStart: v.optional(v.string()),
    quietHoursEnd: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const data = {
      userId,
      inApp: args.inApp,
      emailDigest: args.emailDigest,
      emailEvents: args.emailEvents,
      quietHoursEnabled: args.quietHoursEnabled,
      quietHoursStart: args.quietHoursStart,
      quietHoursEnd: args.quietHoursEnd,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("notificationPreferences", data);
    }
  },
});
