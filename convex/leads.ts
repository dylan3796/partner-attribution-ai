import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Capture lead from landing page
export const captureLead = mutation({
  args: {
    email: v.string(),
    company: v.optional(v.string()),
    source: v.optional(v.string()), // "landing", "demo_request", etc.
  },
  handler: async (ctx, args) => {
    // Check if lead already exists
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update last seen
      await ctx.db.patch(existing._id, {
        lastSeenAt: Date.now(),
        source: args.source || existing.source,
      });
      return { leadId: existing._id, new: false };
    }

    // Create new lead
    const leadId = await ctx.db.insert("leads", {
      email: args.email,
      company: args.company,
      source: args.source || "landing",
      status: "new",
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
    });

    return { leadId, new: true };
  },
});

// Get all leads
export const getLeads = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").order("desc").collect();
    return leads;
  },
});

// Submit a lead from partner portal
export const submitLead = mutation({
  args: {
    contactName: v.string(),
    company: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    notes: v.optional(v.string()),
    partnerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    // Look up partner by email
    const partner = await ctx.db
      .query("partners")
      .withIndex("by_email", (q) => q.eq("email", args.partnerEmail))
      .first();

    if (!partner) {
      throw new Error("Partner not found");
    }

    const leadId = await ctx.db.insert("leads", {
      email: args.email,
      company: args.company,
      contactName: args.contactName,
      phone: args.phone,
      notes: args.notes,
      estimatedValue: args.estimatedValue,
      source: "partner_submitted",
      submittedBy: partner._id,
      partnerName: partner.name,
      status: "new",
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
    });

    return { leadId };
  },
});

// Get leads submitted by a specific partner
export const getByPartner = query({
  args: {
    partnerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const partner = await ctx.db
      .query("partners")
      .withIndex("by_email", (q) => q.eq("email", args.partnerEmail))
      .first();

    if (!partner) return [];

    const leads = await ctx.db
      .query("leads")
      .withIndex("by_submittedBy", (q) => q.eq("submittedBy", partner._id))
      .order("desc")
      .collect();

    return leads;
  },
});

// Update lead status
export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("leads"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("demo_scheduled"),
      v.literal("demo_completed"),
      v.literal("qualified"),
      v.literal("customer"),
      v.literal("lost")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      status: args.status,
    });
    return { success: true };
  },
});
