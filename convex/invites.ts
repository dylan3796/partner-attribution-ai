import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

async function defaultOrg(ctx: any) {
  return await ctx.db.query("organizations").first();
}

/** Generate a random token */
function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// ── Create an invite (admin action) ──────────────────────────────────────

export const create = mutation({
  args: {
    email: v.optional(v.string()),
    partnerType: v.optional(
      v.union(
        v.literal("affiliate"),
        v.literal("referral"),
        v.literal("reseller"),
        v.literal("integration")
      )
    ),
  },
  handler: async (ctx, args) => {
    const org = await defaultOrg(ctx);
    if (!org) throw new Error("No organization found. Seed demo data first.");

    const token = generateToken();
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    const id = await ctx.db.insert("partnerInvites", {
      organizationId: org._id,
      token,
      email: args.email,
      partnerType: args.partnerType,
      status: "pending",
      createdAt: now,
      expiresAt,
    });

    // Send invite email (non-blocking, skips if no RESEND_API_KEY)
    if (args.email) {
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://covant.ai"}/invite/${token}`;
      await ctx.scheduler.runAfter(0, api.emailNotifications.sendPartnerInviteEmail, {
        partnerEmail: args.email,
        partnerName: args.email.split("@")[0],
        orgName: org.name,
        inviteUrl,
      });
    }

    return { id, token };
  },
});

// ── Get invite by token (public) ─────────────────────────────────────────

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("partnerInvites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invite) return null;

    // Check expiry
    if (invite.status !== "pending" || Date.now() > invite.expiresAt) {
      return { ...invite, expired: true };
    }

    // Get org name
    const org = await ctx.db.get(invite.organizationId);

    return {
      ...invite,
      expired: false,
      organizationName: org?.name ?? "Unknown",
    };
  },
});

// ── Accept invite (partner creates profile) ──────────────────────────────

export const accept = mutation({
  args: {
    token: v.string(),
    name: v.string(), // company name
    contactName: v.string(),
    email: v.string(),
    type: v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    ),
  },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("partnerInvites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invite) throw new Error("Invalid invite link.");
    if (invite.status !== "pending") throw new Error("This invite has already been used.");
    if (Date.now() > invite.expiresAt) throw new Error("This invite has expired.");

    // Check if partner email already exists
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("A partner with this email already exists.");

    // Create partner
    const partnerId = await ctx.db.insert("partners", {
      organizationId: invite.organizationId,
      name: args.name,
      email: args.email,
      type: args.type,
      commissionRate: 0.1, // default 10%
      status: "active",
      contactName: args.contactName,
      createdAt: Date.now(),
    });

    // Mark invite as accepted
    await ctx.db.patch(invite._id, {
      status: "accepted",
      acceptedBy: partnerId,
    });

    return { partnerId, name: args.name, email: args.email };
  },
});

// ── List invites (admin) ─────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await defaultOrg(ctx);
    if (!org) return [];
    return await ctx.db
      .query("partnerInvites")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();
  },
});
