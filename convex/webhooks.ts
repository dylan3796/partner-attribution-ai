import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getOrgId } from "./lib/getOrg";

// All supported outbound webhook events
export const WEBHOOK_EVENTS = [
  "deal.created",
  "deal.approved",
  "deal.closed",
  "deal.lost",
  "deal.updated",
  "partner.created",
  "partner.updated",
  "partner.tier_changed",
  "partner.deactivated",
  "payout.created",
  "payout.approved",
  "payout.paid",
  "commission.calculated",
  "touchpoint.created",
  "invite.accepted",
] as const;

function generateSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "whsec_";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    return ctx.db
      .query("webhookEndpoints")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
  },
});

export const getDeliveries = query({
  args: { endpointId: v.id("webhookEndpoints"), limit: v.optional(v.number()) },
  handler: async (ctx, { endpointId, limit }) => {
    const deliveries = await ctx.db
      .query("webhookDeliveries")
      .withIndex("by_endpoint", (q) => q.eq("endpointId", endpointId))
      .order("desc")
      .take(limit ?? 20);
    return deliveries;
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    url: v.string(),
    description: v.optional(v.string()),
    events: v.array(v.string()),
  },
  handler: async (ctx, { url, description, events }) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    const now = Date.now();
    return ctx.db.insert("webhookEndpoints", {
      organizationId: orgId,
      url,
      description: description || undefined,
      secret: generateSecret(),
      events,
      status: "active",
      createdAt: now,
      updatedAt: now,
      failureCount: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("webhookEndpoints"),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    events: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("active"), v.literal("paused"))),
  },
  handler: async (ctx, { id, ...updates }) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    const endpoint = await ctx.db.get(id);
    if (!endpoint || endpoint.organizationId !== orgId) {
      throw new Error("Endpoint not found");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (updates.url !== undefined) patch.url = updates.url;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.events !== undefined) patch.events = updates.events;
    if (updates.status !== undefined) patch.status = updates.status;

    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("webhookEndpoints") },
  handler: async (ctx, { id }) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    const endpoint = await ctx.db.get(id);
    if (!endpoint || endpoint.organizationId !== orgId) {
      throw new Error("Endpoint not found");
    }

    // Delete associated deliveries
    const deliveries = await ctx.db
      .query("webhookDeliveries")
      .withIndex("by_endpoint", (q) => q.eq("endpointId", id))
      .collect();
    for (const d of deliveries) {
      await ctx.db.delete(d._id);
    }

    await ctx.db.delete(id);
  },
});

export const rotateSecret = mutation({
  args: { id: v.id("webhookEndpoints") },
  handler: async (ctx, { id }) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    const endpoint = await ctx.db.get(id);
    if (!endpoint || endpoint.organizationId !== orgId) {
      throw new Error("Endpoint not found");
    }

    await ctx.db.patch(id, {
      secret: generateSecret(),
      updatedAt: Date.now(),
    });
  },
});

export const sendTest = mutation({
  args: { id: v.id("webhookEndpoints") },
  handler: async (ctx, { id }) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    const endpoint = await ctx.db.get(id);
    if (!endpoint || endpoint.organizationId !== orgId) {
      throw new Error("Endpoint not found");
    }

    // Log a test delivery
    const now = Date.now();
    await ctx.db.insert("webhookDeliveries", {
      organizationId: orgId,
      endpointId: id,
      event: "test.ping",
      payload: JSON.stringify({
        event: "test.ping",
        timestamp: new Date(now).toISOString(),
        data: {
          message: "This is a test webhook from Covant",
          endpointId: id,
        },
      }),
      status: "success",
      httpStatus: 200,
      attemptCount: 1,
      deliveredAt: now,
    });

    await ctx.db.patch(id, {
      lastTriggeredAt: now,
      updatedAt: now,
    });
  },
});
