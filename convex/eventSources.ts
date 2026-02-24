import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Retrieve the first (only) organization, or null if not yet seeded */
import { getOrg } from "./lib/getOrg";
async function defaultOrg(ctx: any) {
  return await getOrg(ctx);
}

// ── Queries ────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("eventSources")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("eventSources") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listInboundEvents = query({
  args: {
    sourceId: v.optional(v.id("eventSources")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];

    const limit = args.limit ?? 100;

    let events;
    if (args.sourceId) {
      events = await ctx.db
        .query("inboundEvents")
        .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId!))
        .order("desc")
        .take(limit);
    } else {
      events = await ctx.db
        .query("inboundEvents")
        .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
        .order("desc")
        .take(limit);
    }

    // Enrich with source info
    const enriched = await Promise.all(
      events.map(async (event) => {
        const source = await ctx.db.get(event.sourceId);
        const partner = event.partnerMatch
          ? await ctx.db.get(event.partnerMatch)
          : null;
        const deal = event.dealCreated
          ? await ctx.db.get(event.dealCreated)
          : null;
        return {
          ...event,
          source,
          partner,
          deal,
        };
      })
    );

    return enriched;
  },
});

export const getInboundEvent = query({
  args: { id: v.id("inboundEvents") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) return null;

    const source = await ctx.db.get(event.sourceId);
    const partner = event.partnerMatch
      ? await ctx.db.get(event.partnerMatch)
      : null;
    const deal = event.dealCreated
      ? await ctx.db.get(event.dealCreated)
      : null;

    return { ...event, source, partner, deal };
  },
});

// ── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("shopify"),
      v.literal("stripe"),
      v.literal("webhook"),
      v.literal("manual")
    ),
    eventMapping: v.string(),
    webhookSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found. Run seed data first.");

    // Generate a unique webhook URL identifier
    const id = await ctx.db.insert("eventSources", {
      organizationId: org._id,
      name: args.name,
      type: args.type,
      webhookUrl: "", // Will update after we have the ID
      webhookSecret: args.webhookSecret,
      eventMapping: args.eventMapping,
      status: "active",
      createdAt: Date.now(),
      eventCount: 0,
    });

    // Update with the actual webhook URL
    const webhookUrl = `/api/webhooks/${id}`;
    await ctx.db.patch(id, { webhookUrl });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("eventSources"),
    name: v.optional(v.string()),
    eventMapping: v.optional(v.string()),
    webhookSecret: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("paused"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Filter out undefined values
    const filteredUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }
    await ctx.db.patch(id, filteredUpdates);
    return { success: true };
  },
});

export const remove = mutation({
  args: { id: v.id("eventSources") },
  handler: async (ctx, args) => {
    // Also delete associated inbound events
    const events = await ctx.db
      .query("inboundEvents")
      .withIndex("by_source", (q) => q.eq("sourceId", args.id))
      .collect();

    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const recordInboundEvent = mutation({
  args: {
    sourceId: v.id("eventSources"),
    rawPayload: v.string(),
    eventType: v.string(),
    mappedFields: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("matched"),
      v.literal("ignored"),
      v.literal("error")
    ),
    partnerMatch: v.optional(v.id("partners")),
    dealCreated: v.optional(v.id("deals")),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const source = await ctx.db.get(args.sourceId);
    if (!source) throw new Error("Event source not found");

    const now = Date.now();

    // Record the event
    const eventId = await ctx.db.insert("inboundEvents", {
      organizationId: source.organizationId,
      sourceId: args.sourceId,
      rawPayload: args.rawPayload,
      eventType: args.eventType,
      mappedFields: args.mappedFields,
      status: args.status,
      partnerMatch: args.partnerMatch,
      dealCreated: args.dealCreated,
      errorMessage: args.errorMessage,
      receivedAt: now,
      processedAt: args.status !== "pending" ? now : undefined,
    });

    // Update source stats
    await ctx.db.patch(args.sourceId, {
      lastEventAt: now,
      eventCount: source.eventCount + 1,
    });

    return eventId;
  },
});

export const matchEventToPartner = mutation({
  args: {
    eventId: v.id("inboundEvents"),
    partnerId: v.id("partners"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      partnerMatch: args.partnerId,
      status: "matched",
      processedAt: Date.now(),
    });
    return { success: true };
  },
});

export const updateEventStatus = mutation({
  args: {
    eventId: v.id("inboundEvents"),
    status: v.union(
      v.literal("pending"),
      v.literal("matched"),
      v.literal("ignored"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      status: args.status,
      errorMessage: args.errorMessage,
      processedAt: Date.now(),
    });
    return { success: true };
  },
});

// ── Internal helper for API route ───────────────────────────────────────────

export const getSourceByIdInternal = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // Attempt to parse as Convex ID
      const source = await ctx.db.get(args.id as any);
      return source;
    } catch {
      return null;
    }
  },
});
