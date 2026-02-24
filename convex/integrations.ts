import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================================================
// Salesforce Connection Management
// ============================================================================

/**
 * Store or update a Salesforce connection for an organization
 */
export const storeSalesforceConnection = mutation({
  args: {
    organizationId: v.id("organizations"),
    accessToken: v.string(),
    refreshToken: v.string(),
    instanceUrl: v.string(),
    salesforceOrgId: v.string(),
    salesforceOrgName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if connection already exists for this org
    const existing = await ctx.db
      .query("salesforceConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
    
    if (existing) {
      // Update existing connection
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        instanceUrl: args.instanceUrl,
        salesforceOrgId: args.salesforceOrgId,
        salesforceOrgName: args.salesforceOrgName,
        connectedAt: Date.now(),
      });
      return existing._id;
    }
    
    // Create new connection
    return await ctx.db.insert("salesforceConnections", {
      organizationId: args.organizationId,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      instanceUrl: args.instanceUrl,
      salesforceOrgId: args.salesforceOrgId,
      salesforceOrgName: args.salesforceOrgName,
      connectedAt: Date.now(),
    });
  },
});

/**
 * Get Salesforce connection for an organization
 */
export const getSalesforceConnection = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("salesforceConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
  },
});

/**
 * Update tokens for a Salesforce connection (after refresh)
 */
export const updateSalesforceTokens = mutation({
  args: {
    connectionId: v.id("salesforceConnections"),
    accessToken: v.string(),
    instanceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, string> = {
      accessToken: args.accessToken,
    };
    if (args.instanceUrl) {
      updates.instanceUrl = args.instanceUrl;
    }
    await ctx.db.patch(args.connectionId, updates);
  },
});

/**
 * Update last synced timestamp
 */
export const updateLastSynced = mutation({
  args: {
    connectionId: v.id("salesforceConnections"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.connectionId, {
      lastSyncedAt: args.timestamp,
    });
  },
});

/**
 * Disconnect Salesforce (delete connection)
 */
export const disconnectSalesforce = mutation({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query("salesforceConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
    
    if (connection) {
      await ctx.db.delete(connection._id);
    }
  },
});

// ============================================================================
// Deal Sync from Salesforce
// ============================================================================

/**
 * Create or update a deal from Salesforce opportunity
 */
export const upsertDealFromSalesforce = mutation({
  args: {
    organizationId: v.id("organizations"),
    salesforceId: v.string(),
    name: v.string(),
    amount: v.number(),
    closedAt: v.number(),
    contactName: v.optional(v.string()),
    ownerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if deal already exists with this Salesforce ID
    const existing = await ctx.db
      .query("deals")
      .withIndex("by_salesforce_id", (q) => q.eq("salesforceId", args.salesforceId))
      .first();
    
    if (existing) {
      // Update existing deal
      await ctx.db.patch(existing._id, {
        name: args.name,
        amount: args.amount,
        closedAt: args.closedAt,
        contactName: args.contactName,
        notes: args.ownerName ? `SF Owner: ${args.ownerName}` : existing.notes,
      });
      return { dealId: existing._id, created: false };
    }
    
    // Create new deal
    const dealId = await ctx.db.insert("deals", {
      organizationId: args.organizationId,
      salesforceId: args.salesforceId,
      name: args.name,
      amount: args.amount,
      status: "won", // All synced deals are Closed Won
      closedAt: args.closedAt,
      contactName: args.contactName,
      notes: args.ownerName ? `SF Owner: ${args.ownerName}` : undefined,
      source: "salesforce",
      createdAt: Date.now(),
    });
    
    return { dealId, created: true };
  },
});

/**
 * Get deal by Salesforce ID
 */
export const getDealBySalesforceId = query({
  args: {
    salesforceId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deals")
      .withIndex("by_salesforce_id", (q) => q.eq("salesforceId", args.salesforceId))
      .first();
  },
});

/**
 * Get all Salesforce-synced deals for an organization
 */
export const getSalesforceDeals = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();
    
    return allDeals.filter((deal) => deal.source === "salesforce");
  },
});

// ============================================================================
// Sync Status Helpers
// ============================================================================

/**
 * Get sync status for dashboard display
 */
export const getSalesforceStatus = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query("salesforceConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
    
    if (!connection) {
      return { connected: false as const };
    }
    
    // Count synced deals
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();
    
    const syncedDeals = allDeals.filter((deal) => deal.source === "salesforce").length;
    
    return {
      connected: true as const,
      salesforceOrgId: connection.salesforceOrgId,
      salesforceOrgName: connection.salesforceOrgName,
      lastSyncedAt: connection.lastSyncedAt,
      connectedAt: connection.connectedAt,
      syncedDeals,
    };
  },
});

// ============================================================================
// HubSpot Connection Management
// ============================================================================

export const storeHubSpotConnection = mutation({
  args: {
    organizationId: v.id("organizations"),
    accessToken: v.string(),
    refreshToken: v.string(),
    hubspotPortalId: v.string(),
    hubspotPortalName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("hubspotConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        hubspotPortalId: args.hubspotPortalId,
        hubspotPortalName: args.hubspotPortalName,
        connectedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("hubspotConnections", {
      organizationId: args.organizationId,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      hubspotPortalId: args.hubspotPortalId,
      hubspotPortalName: args.hubspotPortalName,
      connectedAt: Date.now(),
    });
  },
});

export const getHubSpotConnection = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("hubspotConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
  },
});

export const updateHubSpotTokens = mutation({
  args: {
    connectionId: v.id("hubspotConnections"),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.connectionId, { accessToken: args.accessToken });
  },
});

export const updateHubSpotLastSynced = mutation({
  args: {
    connectionId: v.id("hubspotConnections"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.connectionId, { lastSyncedAt: args.timestamp });
  },
});

export const disconnectHubSpot = mutation({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query("hubspotConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
    if (connection) await ctx.db.delete(connection._id);
  },
});

export const getHubSpotStatus = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query("hubspotConnections")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();

    if (!connection) return { connected: false as const };

    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    const syncedDeals = allDeals.filter((d) => d.source === "hubspot").length;

    return {
      connected: true as const,
      hubspotPortalId: connection.hubspotPortalId,
      hubspotPortalName: connection.hubspotPortalName,
      lastSyncedAt: connection.lastSyncedAt,
      connectedAt: connection.connectedAt,
      syncedDeals,
    };
  },
});

// ============================================================================
// Deal Sync from HubSpot
// ============================================================================

export const upsertDealFromHubSpot = mutation({
  args: {
    organizationId: v.id("organizations"),
    hubspotId: v.string(),
    name: v.string(),
    amount: v.number(),
    closedAt: v.number(),
    contactName: v.optional(v.string()),
    ownerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("deals")
      .withIndex("by_hubspot_id", (q) => q.eq("hubspotId", args.hubspotId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        amount: args.amount,
        closedAt: args.closedAt,
        contactName: args.contactName,
        notes: args.ownerName ? `HS Owner: ${args.ownerName}` : existing.notes,
      });
      return { dealId: existing._id, created: false };
    }

    const dealId = await ctx.db.insert("deals", {
      organizationId: args.organizationId,
      hubspotId: args.hubspotId,
      name: args.name,
      amount: args.amount,
      status: "won",
      closedAt: args.closedAt,
      contactName: args.contactName,
      notes: args.ownerName ? `HS Owner: ${args.ownerName}` : undefined,
      source: "hubspot",
      createdAt: Date.now(),
    });

    return { dealId, created: true };
  },
});

// ============================================================================
// Combined CRM Status (for integrations page)
// ============================================================================

export const getCrmStatuses = query({
  args: {},
  handler: async (ctx) => {
    const { getOrg } = await import('./lib/getOrg');
    const org = await getOrg(ctx);
    if (!org) return { orgId: null, salesforce: { connected: false as const }, hubspot: { connected: false as const } };

    const sfConn = await ctx.db
      .query('salesforceConnections')
      .withIndex('by_organization', (q) => q.eq('organizationId', org._id))
      .first();

    const hsConn = await ctx.db
      .query('hubspotConnections')
      .withIndex('by_organization', (q) => q.eq('organizationId', org._id))
      .first();

    const allDeals = await ctx.db
      .query('deals')
      .withIndex('by_organization', (q) => q.eq('organizationId', org._id))
      .collect();

    return {
      orgId: org._id,
      salesforce: sfConn
        ? { connected: true as const, orgName: sfConn.salesforceOrgName, lastSyncedAt: sfConn.lastSyncedAt, syncedDeals: allDeals.filter(d => d.source === 'salesforce').length }
        : { connected: false as const },
      hubspot: hsConn
        ? { connected: true as const, portalName: hsConn.hubspotPortalName, lastSyncedAt: hsConn.lastSyncedAt, syncedDeals: allDeals.filter(d => d.source === 'hubspot').length }
        : { connected: false as const },
    };
  },
});
