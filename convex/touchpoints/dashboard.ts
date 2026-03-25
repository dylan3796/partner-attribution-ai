/**
 * Dashboard-level touchpoint mutations (Clerk auth, no API key)
 */
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getOrgId } from "../lib/getOrg";

const TOUCHPOINT_TYPES = v.union(
  v.literal("referral"),
  v.literal("demo"),
  v.literal("content_share"),
  v.literal("introduction"),
  v.literal("proposal"),
  v.literal("negotiation"),
  v.literal("deal_registration"),
  v.literal("co_sell"),
  v.literal("technical_enablement"),
  v.literal("crm_sync")
);

/**
 * Add a touchpoint to a deal from the dashboard
 */
export const add = mutation({
  args: {
    dealId: v.id("deals"),
    partnerId: v.id("partners"),
    type: TOUCHPOINT_TYPES,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");

    // Verify deal exists and belongs to org
    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new Error("Deal not found");
    if (deal.organizationId !== orgId) throw new Error("Access denied");

    // Verify partner exists and belongs to org
    const partner = await ctx.db.get(args.partnerId);
    if (!partner) throw new Error("Partner not found");
    if (partner.organizationId !== orgId) throw new Error("Access denied");

    // Create touchpoint
    const touchpointId = await ctx.db.insert("touchpoints", {
      organizationId: orgId,
      dealId: args.dealId,
      partnerId: args.partnerId,
      type: args.type,
      notes: args.notes,
      createdAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      action: "touchpoint.created",
      entityType: "touchpoint",
      entityId: touchpointId,
      changes: JSON.stringify({
        dealId: args.dealId,
        partnerId: args.partnerId,
        partnerName: partner.name,
        dealName: deal.name,
        type: args.type,
        notes: args.notes,
      }),
      createdAt: Date.now(),
    });

    return touchpointId;
  },
});

/**
 * Remove a touchpoint from the dashboard
 */
export const remove = mutation({
  args: {
    touchpointId: v.id("touchpoints"),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");

    const touchpoint = await ctx.db.get(args.touchpointId);
    if (!touchpoint) throw new Error("Touchpoint not found");
    if (touchpoint.organizationId !== orgId) throw new Error("Access denied");

    // Get deal and partner for audit log
    const deal = await ctx.db.get(touchpoint.dealId);
    const partner = await ctx.db.get(touchpoint.partnerId);

    await ctx.db.delete(args.touchpointId);

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      action: "touchpoint.deleted",
      entityType: "touchpoint",
      entityId: args.touchpointId,
      changes: JSON.stringify({
        dealId: touchpoint.dealId,
        partnerId: touchpoint.partnerId,
        partnerName: partner?.name,
        dealName: deal?.name,
        type: touchpoint.type,
      }),
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
