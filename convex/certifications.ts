import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOrgId } from "./lib/getOrg";

// ─── Certification Programs (admin-managed) ───

export const list = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    return await ctx.db
      .query("certifications")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert")
    ),
    category: v.union(
      v.literal("sales"),
      v.literal("technical"),
      v.literal("product"),
      v.literal("compliance")
    ),
    requiredForTier: v.optional(v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    )),
    validityMonths: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");
    const now = Date.now();
    return await ctx.db.insert("certifications", {
      organizationId: orgId,
      name: args.name,
      description: args.description,
      level: args.level,
      category: args.category,
      requiredForTier: args.requiredForTier,
      validityMonths: args.validityMonths,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("certifications"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    level: v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert")
    )),
    category: v.optional(v.union(
      v.literal("sales"),
      v.literal("technical"),
      v.literal("product"),
      v.literal("compliance")
    )),
    requiredForTier: v.optional(v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    )),
    validityMonths: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.organizationId !== orgId) throw new Error("Not found");
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(args.id, { ...filtered, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("certifications") },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.organizationId !== orgId) throw new Error("Not found");
    // Also remove all partner certification records for this cert
    const records = await ctx.db
      .query("partnerCertifications")
      .withIndex("by_org_and_cert", (q) =>
        q.eq("organizationId", orgId).eq("certificationId", args.id)
      )
      .collect();
    for (const r of records) {
      await ctx.db.delete(r._id);
    }
    await ctx.db.delete(args.id);
  },
});

// ─── Partner Certification Records ───

export const listPartnerCerts = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    return await ctx.db
      .query("partnerCertifications")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
  },
});

export const listByPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];
    return await ctx.db
      .query("partnerCertifications")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", orgId).eq("partnerId", args.partnerId)
      )
      .collect();
  },
});

export const award = mutation({
  args: {
    partnerId: v.id("partners"),
    certificationId: v.id("certifications"),
    score: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");

    // Look up the cert to determine expiry
    const cert = await ctx.db.get(args.certificationId);
    if (!cert || cert.organizationId !== orgId) throw new Error("Certification not found");

    const now = Date.now();
    let expiresAt: number | undefined;
    if (cert.validityMonths) {
      expiresAt = now + cert.validityMonths * 30 * 24 * 60 * 60 * 1000;
    }

    // Check for existing active record (prevent duplicates)
    const existing = await ctx.db
      .query("partnerCertifications")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", orgId).eq("partnerId", args.partnerId)
      )
      .collect();
    const dup = existing.find(
      (r) => r.certificationId === args.certificationId && (r.status === "completed" || r.status === "in_progress")
    );
    if (dup) throw new Error("Partner already has this certification");

    const id = await ctx.db.insert("partnerCertifications", {
      organizationId: orgId,
      partnerId: args.partnerId,
      certificationId: args.certificationId,
      status: "completed",
      completedAt: now,
      expiresAt,
      score: args.score,
      notes: args.notes,
      awardedBy: "admin",
      createdAt: now,
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      action: "certification.awarded",
      entityType: "partnerCertifications",
      entityId: id,
      metadata: JSON.stringify({
        partnerId: args.partnerId,
        certificationId: args.certificationId,
        certName: cert.name,
      }),
      createdAt: now,
    });

    return id;
  },
});

export const revoke = mutation({
  args: { id: v.id("partnerCertifications") },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");
    const record = await ctx.db.get(args.id);
    if (!record || record.organizationId !== orgId) throw new Error("Not found");
    await ctx.db.patch(args.id, { status: "revoked" });

    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      action: "certification.revoked",
      entityType: "partnerCertifications",
      entityId: args.id,
      metadata: JSON.stringify({
        partnerId: record.partnerId,
        certificationId: record.certificationId,
      }),
      createdAt: Date.now(),
    });
  },
});

// ─── Stats ───

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return { totalPrograms: 0, activePrograms: 0, totalAwarded: 0, completedCount: 0, expiringCount: 0, partnerCoverage: 0, totalPartners: 0 };

    const certs = await ctx.db
      .query("certifications")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const records = await ctx.db
      .query("partnerCertifications")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const active = certs.filter((c) => c.status === "active");
    const completed = records.filter((r) => r.status === "completed");
    const expiring = completed.filter(
      (r) => r.expiresAt && r.expiresAt - now < thirtyDays && r.expiresAt > now
    );
    const certifiedPartnerIds = new Set(completed.map((r) => r.partnerId));

    return {
      totalPrograms: certs.length,
      activePrograms: active.length,
      totalAwarded: records.length,
      completedCount: completed.length,
      expiringCount: expiring.length,
      partnerCoverage: certifiedPartnerIds.size,
      totalPartners: partners.length,
    };
  },
});
