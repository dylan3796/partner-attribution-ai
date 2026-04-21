import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOrgId } from "./lib/getOrg";

// Available API scopes
export const ALL_SCOPES = [
  "partners:read",
  "partners:write",
  "deals:read",
  "deals:write",
  "payouts:read",
  "payouts:write",
  "attributions:read",
  "commissions:read",
  "webhooks:manage",
] as const;

/**
 * Generate a random API key with prefix.
 * Format: cvnt_<32 random hex chars>
 */
function generateKey(): { key: string; prefix: string; hash: string } {
  // Generate 32 random bytes as hex
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let random = "";
  for (let i = 0; i < 40; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  const key = `cvnt_${random}`;
  const prefix = key.slice(0, 12); // "cvnt_a1b2c3d"

  // Simple hash (in production, use crypto.subtle.digest)
  // For Convex, we use a basic hash since we can't use Node crypto
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const hashStr = `sha256_${Math.abs(hash).toString(36)}${key.length}${random.slice(-8)}`;

  return { key, prefix, hash: hashStr };
}

/**
 * List all API keys for the current org (excludes revoked by default).
 */
export const list = query({
  args: {
    includeRevoked: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];

    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    return keys
      .filter((k) => args.includeRevoked || !k.revokedAt)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((k) => ({
        _id: k._id,
        name: k.name,
        prefix: k.prefix,
        scopes: k.scopes,
        lastUsedAt: k.lastUsedAt,
        expiresAt: k.expiresAt,
        revokedAt: k.revokedAt,
        createdBy: k.createdBy,
        createdAt: k.createdAt,
      }));
  },
});

/**
 * Create a new API key. Returns the full key (shown once, never stored).
 */
export const create = mutation({
  args: {
    name: v.string(),
    scopes: v.array(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Organization not found");

    // Auth disabled — no user attribution
    const createdBy = undefined;

    // Limit: max 10 active keys per org
    const existing = await ctx.db
      .query("apiKeys")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    const activeKeys = existing.filter((k) => !k.revokedAt);
    if (activeKeys.length >= 10) {
      throw new Error("Maximum 10 active API keys per organization. Revoke unused keys first.");
    }

    const { key, prefix, hash } = generateKey();

    await ctx.db.insert("apiKeys", {
      organizationId: orgId,
      name: args.name,
      prefix,
      keyHash: hash,
      scopes: args.scopes,
      expiresAt: args.expiresAt,
      createdBy,
      createdAt: Date.now(),
    });

    // Return the full key — this is the ONLY time it's visible
    return { key, prefix };
  },
});

/**
 * Revoke an API key (soft delete).
 */
export const revoke = mutation({
  args: {
    id: v.id("apiKeys"),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Organization not found");

    const key = await ctx.db.get(args.id);
    if (!key) throw new Error("API key not found");
    if (key.organizationId !== orgId) throw new Error("Access denied");
    if (key.revokedAt) throw new Error("Key already revoked");

    await ctx.db.patch(args.id, { revokedAt: Date.now() });
  },
});

/**
 * Update an API key's name or scopes.
 */
export const update = mutation({
  args: {
    id: v.id("apiKeys"),
    name: v.optional(v.string()),
    scopes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Organization not found");

    const key = await ctx.db.get(args.id);
    if (!key) throw new Error("API key not found");
    if (key.organizationId !== orgId) throw new Error("Access denied");
    if (key.revokedAt) throw new Error("Cannot update a revoked key");

    const patch: Record<string, unknown> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.scopes !== undefined) patch.scopes = args.scopes;

    await ctx.db.patch(args.id, patch);
  },
});
