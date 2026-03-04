import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const partnerType = v.union(
  v.literal("reseller"),
  v.literal("referral"),
  v.literal("integration"),
  v.literal("affiliate")
);

// ── Public: Submit application ────────────────────────────────────────────

export const submit = mutation({
  args: {
    companyName: v.string(),
    contactName: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    partnerType,
    partnerCount: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate email
    const existing = await ctx.db
      .query("partnerApplications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing && existing.status === "pending") {
      throw new Error("An application with this email is already pending review.");
    }

    return await ctx.db.insert("partnerApplications", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// ── Admin: List applications ──────────────────────────────────────────────

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("partnerApplications")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("partnerApplications")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

// ── Admin: Get counts by status ───────────────────────────────────────────

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("partnerApplications").collect();
    return {
      total: all.length,
      pending: all.filter((a) => a.status === "pending").length,
      approved: all.filter((a) => a.status === "approved").length,
      rejected: all.filter((a) => a.status === "rejected").length,
    };
  },
});

// ── Admin: Approve application ────────────────────────────────────────────

export const approve = mutation({
  args: {
    id: v.id("partnerApplications"),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);
    if (!app) throw new Error("Application not found");
    if (app.status !== "pending") throw new Error("Application already reviewed");

    await ctx.db.patch(args.id, {
      status: "approved",
      reviewNote: args.reviewNote,
      reviewedAt: Date.now(),
    });

    return { success: true };
  },
});

// ── Admin: Reject application ─────────────────────────────────────────────

export const reject = mutation({
  args: {
    id: v.id("partnerApplications"),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);
    if (!app) throw new Error("Application not found");
    if (app.status !== "pending") throw new Error("Application already reviewed");

    await ctx.db.patch(args.id, {
      status: "rejected",
      reviewNote: args.reviewNote,
      reviewedAt: Date.now(),
    });

    return { success: true };
  },
});
