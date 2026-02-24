import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Email Template & Notification Trigger System ─────────────────────────
// Defines templates and triggers for automated partner email notifications.
// In production, a Convex action would call Resend/SendGrid; here we log to a queue.

import { getOrg } from "./lib/getOrg";
async function defaultOrg(ctx: any) {
  return await getOrg(ctx);
}

// ── Templates ────────────────────────────────────────────────────────────

export const listTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("email_templates").order("desc").collect();
  },
});

export const upsertTemplate = mutation({
  args: {
    id: v.optional(v.id("email_templates")),
    trigger: v.string(),
    subject: v.string(),
    bodyHtml: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization");

    if (args.id) {
      await ctx.db.patch(args.id, {
        trigger: args.trigger,
        subject: args.subject,
        bodyHtml: args.bodyHtml,
        enabled: args.enabled,
        updatedAt: Date.now(),
      });
      return args.id;
    }
    return await ctx.db.insert("email_templates", {
      organizationId: org._id,
      trigger: args.trigger,
      subject: args.subject,
      bodyHtml: args.bodyHtml,
      enabled: args.enabled,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const toggleTemplate = mutation({
  args: { id: v.id("email_templates"), enabled: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { enabled: args.enabled, updatedAt: Date.now() });
  },
});

// ── Email Queue (outbound log) ───────────────────────────────────────────

export const listQueue = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("email_queue")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const enqueue = mutation({
  args: {
    trigger: v.string(),
    to: v.string(),
    toName: v.optional(v.string()),
    subject: v.string(),
    bodyHtml: v.string(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization");
    return await ctx.db.insert("email_queue", {
      organizationId: org._id,
      trigger: args.trigger,
      to: args.to,
      toName: args.toName,
      subject: args.subject,
      bodyHtml: args.bodyHtml,
      status: "queued",
      metadata: args.metadata,
      createdAt: Date.now(),
      sentAt: undefined,
      error: undefined,
    });
  },
});

export const markSent = mutation({
  args: { id: v.id("email_queue") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "sent", sentAt: Date.now() });
  },
});

export const markFailed = mutation({
  args: { id: v.id("email_queue"), error: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "failed", error: args.error });
  },
});
