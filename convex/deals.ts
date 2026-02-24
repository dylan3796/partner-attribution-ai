import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Register a new deal (partner-submitted)
export const registerDeal = mutation({
  args: {
    partnerId: v.id("partners"),
    organizationId: v.id("organizations"),
    name: v.string(),
    amount: v.number(),
    expectedCloseDate: v.optional(v.number()),
    contactName: v.string(),
    contactEmail: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate deals (same contact email)
    const existingDeal = await ctx.db
      .query("deals")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("contactEmail"), args.contactEmail),
          q.neq(q.field("status"), "lost")
        )
      )
      .first();

    if (existingDeal) {
      throw new Error(
        `Deal already registered for ${args.contactEmail} by ${existingDeal.registeredBy ? "another partner" : "internal team"}`
      );
    }

    const dealId = await ctx.db.insert("deals", {
      organizationId: args.organizationId,
      name: args.name,
      amount: args.amount,
      status: "open",
      expectedCloseDate: args.expectedCloseDate,
      contactName: args.contactName,
      contactEmail: args.contactEmail,
      notes: args.notes,
      registeredBy: args.partnerId,
      registrationStatus: "pending",
      createdAt: Date.now(),
    });

    // Create initial touchpoint for deal registration
    await ctx.db.insert("touchpoints", {
      organizationId: args.organizationId,
      dealId,
      partnerId: args.partnerId,
      type: "deal_registration",
      weight: 1.0,
      notes: "Initial deal registration",
      createdAt: Date.now(),
    });

    // Create approval workflow
    await ctx.db.insert("approvals", {
      organizationId: args.organizationId,
      entityType: "deal_registration",
      entityId: dealId,
      status: "pending",
      requestedBy: args.partnerId,
      createdAt: Date.now(),
    });

    return dealId;
  },
});

// Approve deal registration
export const approveDealRegistration = mutation({
  args: {
    dealId: v.id("deals"),
    reviewerId: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new Error("Deal not found");

    await ctx.db.patch(args.dealId, {
      registrationStatus: "approved",
    });

    // Update approval workflow
    const approval = await ctx.db
      .query("approvals")
      .filter((q) =>
        q.and(
          q.eq(q.field("entityType"), "deal_registration"),
          q.eq(q.field("entityId"), args.dealId)
        )
      )
      .first();

    if (approval) {
      await ctx.db.patch(approval._id, {
        status: "approved",
        reviewedBy: args.reviewerId,
        reviewedAt: Date.now(),
        notes: args.notes,
      });
    }

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: deal.organizationId,
      userId: args.reviewerId,
      action: "approved_deal_registration",
      entityType: "deal",
      entityId: args.dealId,
      metadata: args.notes,
      createdAt: Date.now(),
    });

    // Create notification
    const partner = deal.registeredBy ? await ctx.db.get(deal.registeredBy) : null;
    const partnerName = partner?.name ?? "Partner";
    await ctx.db.insert("notifications", {
      type: "deal_approved",
      title: "Deal Registration Approved",
      body: `Deal approved: ${deal.name} (${partnerName}) — $${deal.amount.toLocaleString()}`,
      read: false,
      link: `/dashboard/deals`,
      createdAt: Date.now(),
    });

    // Calculate commission amount before sending email so we can include real figure
    let commissionAmount = 0;
    let appliedRuleName = "default partner rate";
    if (deal.registeredBy && partner) {
      const rules = await ctx.db
        .query("commissionRules")
        .withIndex("by_org_priority", (q) => q.eq("organizationId", deal.organizationId))
        .collect();

      let matchedRule: (typeof rules)[number] | null = null;
      for (const rule of rules) {
        if (rule.partnerType && rule.partnerType !== partner.type) continue;
        if (rule.partnerTier && rule.partnerTier !== partner.tier) continue;
        if (rule.minDealSize && deal.amount < rule.minDealSize) continue;
        matchedRule = rule;
        break; // rules are ordered by priority (lowest first)
      }

      const rate = matchedRule ? matchedRule.rate : partner.commissionRate;
      commissionAmount = Math.round(deal.amount * rate * 100) / 100;
      appliedRuleName = matchedRule ? matchedRule.name : "default partner rate";
    }

    // Send email notification with real commission amount
    if (partner?.email) {
      await ctx.scheduler.runAfter(0, api.emailNotifications.sendDealApprovedEmail, {
        dealId: args.dealId,
        partnerEmail: partner.email,
        partnerName: partner.name,
        dealName: deal.name,
        amount: deal.amount,
        commissionAmount,
      });
    }

    // Auto-create commission/payout on deal approval
    if (deal.registeredBy && partner && commissionAmount > 0) {
      await ctx.db.insert("payouts", {
        organizationId: deal.organizationId,
        partnerId: deal.registeredBy,
        amount: commissionAmount,
        status: "pending_approval",
        notes: `Auto-generated on deal approval: ${deal.name} — $${commissionAmount} at (rule: ${appliedRuleName})`,
        createdAt: Date.now(),
      });

      await ctx.db.insert("audit_log", {
        organizationId: deal.organizationId,
        userId: args.reviewerId,
        action: "commission_auto_generated",
        entityType: "payout",
        entityId: args.dealId,
        metadata: `Commission $${commissionAmount} auto-generated on approval (rule: ${appliedRuleName})`,
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Reject deal registration
export const rejectDealRegistration = mutation({
  args: {
    dealId: v.id("deals"),
    reviewerId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new Error("Deal not found");

    await ctx.db.patch(args.dealId, {
      registrationStatus: "rejected",
    });

    // Update approval workflow
    const approval = await ctx.db
      .query("approvals")
      .filter((q) =>
        q.and(
          q.eq(q.field("entityType"), "deal_registration"),
          q.eq(q.field("entityId"), args.dealId)
        )
      )
      .first();

    if (approval) {
      await ctx.db.patch(approval._id, {
        status: "rejected",
        reviewedBy: args.reviewerId,
        reviewedAt: Date.now(),
        notes: args.reason,
      });
    }

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: deal.organizationId,
      userId: args.reviewerId,
      action: "rejected_deal_registration",
      entityType: "deal",
      entityId: args.dealId,
      metadata: args.reason,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Get partner's deals
export const getPartnerDeals = query({
  args: {
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_registered_partner", (q) =>
        q.eq("registeredBy", args.partnerId)
      )
      .collect();

    return deals.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get pending deal registrations (for sales review)
export const getPendingDealRegistrations = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .filter((q) => q.eq(q.field("registrationStatus"), "pending"))
      .collect();

    // Enrich with partner info
    const enrichedDeals = await Promise.all(
      deals.map(async (deal) => {
        const partner = deal.registeredBy
          ? await ctx.db.get(deal.registeredBy)
          : null;
        return {
          ...deal,
          partner,
        };
      })
    );

    return enrichedDeals.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get all deal registrations (for sales review, all statuses)
export const getAllDealRegistrations = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .filter((q) => q.neq(q.field("registeredBy"), undefined))
      .collect();

    // Enrich with partner info
    const enrichedDeals = await Promise.all(
      deals.map(async (deal) => {
        const partner = deal.registeredBy
          ? await ctx.db.get(deal.registeredBy)
          : null;
        return {
          ...deal,
          partner,
        };
      })
    );

    return enrichedDeals.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get deal by ID
export const getDeal = query({
  args: {
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId);
    if (!deal) return null;

    const partner = deal.registeredBy
      ? await ctx.db.get(deal.registeredBy)
      : null;

    return {
      ...deal,
      partner,
    };
  },
});

// Get deal by ID with full related data (touchpoints, partners, attributions)
export const getById = query({
  args: { id: v.id("deals") },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.id);
    if (!deal) return null;

    // Fetch touchpoints for this deal
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_deal", (q) => q.eq("dealId", args.id))
      .collect();

    // Fetch attributions for this deal
    const attributions = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", args.id))
      .collect();

    // Gather unique partner IDs from touchpoints
    const partnerIds = [...new Set(touchpoints.map((tp) => tp.partnerId))];
    
    // Fetch all related partners
    const partners = await Promise.all(
      partnerIds.map((id) => ctx.db.get(id))
    );
    const partnersMap = Object.fromEntries(
      partners.filter(Boolean).map((p) => [p!._id, p])
    );

    // Enrich touchpoints with partner info
    const enrichedTouchpoints = touchpoints.map((tp) => ({
      ...tp,
      partner: partnersMap[tp.partnerId] || null,
    }));

    // Enrich attributions with partner info
    const enrichedAttributions = attributions.map((attr) => ({
      ...attr,
      partner: partnersMap[attr.partnerId] || null,
    }));

    // Get registered-by partner info
    const registeredByPartner = deal.registeredBy
      ? await ctx.db.get(deal.registeredBy)
      : null;

    return {
      ...deal,
      touchpoints: enrichedTouchpoints,
      attributions: enrichedAttributions,
      partners: partners.filter(Boolean),
      registeredByPartner,
    };
  },
});
