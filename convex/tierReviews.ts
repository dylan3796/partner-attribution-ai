import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOrg } from "./lib/getOrg";

/**
 * Tier Reviews — persist approve/reject/defer decisions on partner tier changes.
 * Replaces the previous local-state-only approach where all review decisions
 * were lost on page refresh.
 */

// List all tier reviews for the org
export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("tierReviews")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .collect();
  },
});

// Get review for a specific partner (latest)
export const getByPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    const org = await getOrg(ctx);
    if (!org) return null;
    const reviews = await ctx.db
      .query("tierReviews")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", org._id).eq("partnerId", partnerId)
      )
      .collect();
    // Return most recent review
    return reviews.sort((a, b) => b.reviewedAt - a.reviewedAt)[0] ?? null;
  },
});

// Save a tier review decision
export const save = mutation({
  args: {
    partnerId: v.id("partners"),
    action: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("deferred")
    ),
    previousTier: v.string(),
    recommendedTier: v.string(),
    overallScore: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found");

    // Check for existing review for this partner
    const existing = await ctx.db
      .query("tierReviews")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", org._id).eq("partnerId", args.partnerId)
      )
      .collect();

    // Auth disabled — no reviewer attribution
    const reviewedBy = undefined;

    // Delete previous reviews for this partner (keep only latest)
    for (const old of existing) {
      await ctx.db.delete(old._id);
    }

    // Insert new review
    const reviewId = await ctx.db.insert("tierReviews", {
      organizationId: org._id,
      partnerId: args.partnerId,
      action: args.action,
      previousTier: args.previousTier,
      recommendedTier: args.recommendedTier,
      overallScore: args.overallScore,
      notes: args.notes,
      reviewedBy,
      reviewedAt: Date.now(),
    });

    // Log to audit trail
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: reviewedBy,
      action: `tier_review.${args.action}`,
      entityType: "partner",
      entityId: args.partnerId as string,
      changes: `${args.previousTier} → ${args.recommendedTier}`,
      metadata: JSON.stringify({
        previousTier: args.previousTier,
        recommendedTier: args.recommendedTier,
        overallScore: args.overallScore,
      }),
      createdAt: Date.now(),
    });

    return reviewId;
  },
});

// Bulk approve all pending tier changes
export const bulkApprove = mutation({
  args: {
    reviews: v.array(
      v.object({
        partnerId: v.id("partners"),
        previousTier: v.string(),
        recommendedTier: v.string(),
        overallScore: v.number(),
      })
    ),
  },
  handler: async (ctx, { reviews }) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found");

    // Auth disabled — no reviewer attribution
    const reviewedBy = undefined;

    for (const review of reviews) {
      // Delete existing reviews
      const existing = await ctx.db
        .query("tierReviews")
        .withIndex("by_org_and_partner", (q) =>
          q.eq("organizationId", org._id).eq("partnerId", review.partnerId)
        )
        .collect();
      for (const old of existing) {
        await ctx.db.delete(old._id);
      }

      // Insert approved review
      await ctx.db.insert("tierReviews", {
        organizationId: org._id,
        partnerId: review.partnerId,
        action: "approved",
        previousTier: review.previousTier,
        recommendedTier: review.recommendedTier,
        overallScore: review.overallScore,
        reviewedBy,
        reviewedAt: Date.now(),
      });
    }

    // Single audit log entry for bulk action
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: reviewedBy,
      action: "tier_review.bulk_approved",
      entityType: "tier_reviews",
      entityId: "bulk",
      changes: `Approved ${reviews.length} tier changes`,
      metadata: JSON.stringify({ count: reviews.length }),
      createdAt: Date.now(),
    });

    return { approved: reviews.length };
  },
});

// Update notes on an existing review
export const updateNotes = mutation({
  args: {
    partnerId: v.id("partners"),
    notes: v.string(),
  },
  handler: async (ctx, { partnerId, notes }) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found");

    const existing = await ctx.db
      .query("tierReviews")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", org._id).eq("partnerId", partnerId)
      )
      .collect();

    const latest = existing.sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
    if (latest) {
      await ctx.db.patch(latest._id, { notes });
    }
  },
});

// Get scoring data — all partners, deals, touchpoints, attributions for the org
export const getScoringData = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return { partners: [], deals: [], touchpoints: [], attributions: [] };

    const [partners, deals, touchpoints, attributions] = await Promise.all([
      ctx.db
        .query("partners")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("touchpoints")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("attributions")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .collect(),
    ]);

    return {
      partners: partners.map((p) => ({
        ...p,
        _id: p._id as string,
        organizationId: p.organizationId as string,
      })),
      deals: deals.map((d) => ({
        ...d,
        _id: d._id as string,
        organizationId: d.organizationId as string,
        partnerId: (d.registeredBy as string) || "",
      })),
      touchpoints: touchpoints.map((t) => ({
        ...t,
        _id: t._id as string,
        organizationId: t.organizationId as string,
        dealId: t.dealId as string,
        partnerId: t.partnerId as string,
      })),
      attributions: attributions.map((a) => ({
        ...a,
        _id: a._id as string,
        organizationId: a.organizationId as string,
        dealId: a.dealId as string,
        partnerId: a.partnerId as string,
      })),
    };
  },
});
