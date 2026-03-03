import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Email Template & Notification Trigger System ─────────────────────────
// Defines templates and triggers for automated partner email notifications.
// In production, a Convex action would call Resend/SendGrid; here we log to a queue.

import { getOrg } from "./lib/getOrg";
async function defaultOrg(ctx: any) {
  return await getOrg(ctx);
}

// ── Default templates seeded on first visit ──────────────────────────────

const DEFAULT_TEMPLATES: {
  trigger: string;
  subject: string;
  bodyHtml: string;
  enabled: boolean;
}[] = [
  {
    trigger: "deal_won",
    subject: "🎉 Deal Won: {{deal_name}} — {{deal_amount}}",
    bodyHtml: "Congratulations! The deal {{deal_name}} has been closed for {{deal_amount}}. Your commission of {{commission}} has been calculated and will appear in your next payout.",
    enabled: true,
  },
  {
    trigger: "deal_registered",
    subject: "Deal Registration Approved: {{deal_name}}",
    bodyHtml: "Your deal registration for {{deal_name}} ({{deal_amount}}) has been approved. You have exclusive registration for {{exclusivity_days}} days.",
    enabled: true,
  },
  {
    trigger: "deal_registration_rejected",
    subject: "Deal Registration Update: {{deal_name}}",
    bodyHtml: "Your deal registration for {{deal_name}} was not approved. Reason: {{reason}}. Contact your channel manager for details.",
    enabled: true,
  },
  {
    trigger: "payout_approved",
    subject: "Payout Approved — {{amount}}",
    bodyHtml: "Your payout of {{amount}} for period {{period}} has been approved and is being processed. Expect funds within 5 business days.",
    enabled: true,
  },
  {
    trigger: "payout_sent",
    subject: "Payout Sent — {{amount}} (Ref: {{reference}})",
    bodyHtml: "Your payout of {{amount}} has been sent. Reference: {{reference}}. Please allow 1-3 business days for funds to appear.",
    enabled: true,
  },
  {
    trigger: "tier_upgrade",
    subject: "🏆 Tier Upgrade: {{old_tier}} → {{new_tier}}",
    bodyHtml: "Congratulations! Based on your performance (score: {{score}}), you've been upgraded to {{new_tier}} tier. New benefits include: {{benefits}}.",
    enabled: true,
  },
  {
    trigger: "tier_downgrade_warning",
    subject: "Action Required: Your {{current_tier}} tier status",
    bodyHtml: "Your partner score has dropped to {{score}}. If activity doesn't improve in 30 days, your tier will be adjusted to {{new_tier}}.",
    enabled: true,
  },
  {
    trigger: "new_incentive",
    subject: "New Program: {{program_name}} — You're Eligible!",
    bodyHtml: "A new {{program_type}} is available: {{program_name}}. {{description}}. Enroll now to start earning.",
    enabled: true,
  },
  {
    trigger: "incentive_achieved",
    subject: "🎯 Goal Achieved: {{program_name}}",
    bodyHtml: "You've reached the {{milestone}} milestone in {{program_name}}! Your bonus of {{reward}} has been added to your next payout.",
    enabled: true,
  },
  {
    trigger: "cert_expiring",
    subject: "Certification Expiring: {{cert_name}}",
    bodyHtml: "Your {{cert_name}} certification expires on {{expiry_date}}. Complete the renewal course to maintain your status and partner score.",
    enabled: false,
  },
  {
    trigger: "welcome_partner",
    subject: "Welcome to {{program_name}}!",
    bodyHtml: "Welcome, {{partner_name}}! Your partner portal is ready. Here's how to get started: 1) Complete your profile, 2) Start training, 3) Register your first deal.",
    enabled: true,
  },
];

// ── Templates ────────────────────────────────────────────────────────────

export const listTemplates = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("email_templates")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();
  },
});

export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization");

    // Check if templates already exist for this org
    const existing = await ctx.db
      .query("email_templates")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .first();
    if (existing) return { seeded: false, count: 0 };

    const now = Date.now();
    for (const t of DEFAULT_TEMPLATES) {
      await ctx.db.insert("email_templates", {
        organizationId: org._id,
        trigger: t.trigger,
        subject: t.subject,
        bodyHtml: t.bodyHtml,
        enabled: t.enabled,
        createdAt: now,
        updatedAt: now,
      });
    }
    return { seeded: true, count: DEFAULT_TEMPLATES.length };
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
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("email_queue")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const queueStats = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return { queued: 0, sent: 0, failed: 0, total: 0 };
    const all = await ctx.db
      .query("email_queue")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();
    return {
      queued: all.filter((e) => e.status === "queued").length,
      sent: all.filter((e) => e.status === "sent").length,
      failed: all.filter((e) => e.status === "failed").length,
      total: all.length,
    };
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
