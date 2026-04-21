import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOrgId } from "./lib/getOrg";

const ROLES = ["admin", "manager", "member"] as const;

/**
 * List all team members for the current org (excludes partner-role users).
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];

    const users = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    // Exclude partner-role users — they're in the portal, not the team
    return users
      .filter((u) => u.role !== "partner")
      .map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role as "admin" | "manager" | "member",
        clerkId: u.clerkId,
        avatarUrl: u.avatarUrl,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
      }))
      .sort((a, b) => {
        // Admins first, then by name
        const roleOrder = { admin: 0, manager: 1, member: 2 };
        const ra = roleOrder[a.role] ?? 3;
        const rb = roleOrder[b.role] ?? 3;
        if (ra !== rb) return ra - rb;
        return a.name.localeCompare(b.name);
      });
  },
});

/**
 * Invite a new team member by email. Creates a pending user record.
 * If the user later signs up with Clerk using this email, they'll
 * auto-join the org via domain matching in users.provision.
 */
export const invite = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    // Auth disabled — admin check skipped

    // Check if email already exists in org
    const existing = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    if (existing.some((u) => u.email.toLowerCase() === args.email.toLowerCase())) {
      throw new Error("A team member with this email already exists");
    }

    // Create pending user record (no clerkId yet — they'll link on first login)
    const userId = await ctx.db.insert("users", {
      email: args.email.toLowerCase(),
      name: args.name,
      organizationId: orgId,
      role: args.role,
      createdAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      userId: undefined,
      action: "team_member_invited",
      entityType: "user",
      entityId: userId,
      changes: JSON.stringify({ email: args.email, role: args.role }),
      createdAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Update a team member's role.
 */
export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    // Auth disabled — admin check skipped

    const user = await ctx.db.get(args.userId);
    if (!user || user.organizationId !== orgId) {
      throw new Error("User not found in your organization");
    }

    // Prevent demoting the last admin
    if (user.role === "admin" && args.role !== "admin") {
      const admins = await ctx.db
        .query("users")
        .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
        .collect();
      const adminCount = admins.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        throw new Error("Cannot remove the last admin. Promote another member first.");
      }
    }

    const oldRole = user.role;
    await ctx.db.patch(args.userId, { role: args.role });

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      userId: undefined,
      action: "team_role_changed",
      entityType: "user",
      entityId: args.userId,
      changes: JSON.stringify({ from: oldRole, to: args.role }),
      createdAt: Date.now(),
    });
  },
});

/**
 * Remove a team member from the org.
 */
export const remove = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("No organization found");

    // Auth disabled — admin check skipped

    const user = await ctx.db.get(args.userId);
    if (!user || user.organizationId !== orgId) {
      throw new Error("User not found in your organization");
    }

    // Prevent removing the last admin
    if (user.role === "admin") {
      const admins = await ctx.db
        .query("users")
        .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
        .collect();
      const adminCount = admins.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        throw new Error("Cannot remove the last admin");
      }
    }

    await ctx.db.delete(args.userId);

    // Audit log
    await ctx.db.insert("audit_log", {
      organizationId: orgId,
      userId: undefined,
      action: "team_member_removed",
      entityType: "user",
      entityId: args.userId,
      changes: JSON.stringify({ email: user.email, name: user.name }),
      createdAt: Date.now(),
    });
  },
});
