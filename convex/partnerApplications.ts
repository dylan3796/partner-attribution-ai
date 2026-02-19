import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit a new partner application (public, no auth required)
export const submitApplication = mutation({
  args: {
    name: v.string(),
    title: v.optional(v.string()),
    company: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    partnerType: v.union(
      v.literal("reseller"),
      v.literal("referral"),
      v.literal("integration"),
      v.literal("agency")
    ),
    estimatedDeals: v.union(
      v.literal("1-5"),
      v.literal("6-20"),
      v.literal("21-50"),
      v.literal("50+")
    ),
    description: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const applicationId = await ctx.db.insert("partnerApplications", {
      name: args.name,
      title: args.title,
      company: args.company,
      email: args.email,
      website: args.website,
      partnerType: args.partnerType,
      estimatedDeals: args.estimatedDeals,
      description: args.description,
      source: args.source,
      status: "pending",
      submittedAt: Date.now(),
    });

    return { applicationId, success: true };
  },
});

// Get all partner applications (admin view)
export const getApplications = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    )),
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
      .order("desc")
      .collect();
  },
});

// Update application status (approve/reject)
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("partnerApplications"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    reviewedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      reviewedBy: args.reviewedBy,
      reviewedAt: Date.now(),
    });
    return { success: true };
  },
});

// Get application by ID
export const getApplication = query({
  args: {
    applicationId: v.id("partnerApplications"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.applicationId);
  },
});
