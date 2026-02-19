import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const notificationType = v.union(
  v.literal("deal_approved"),
  v.literal("commission_paid"),
  v.literal("partner_joined"),
  v.literal("tier_change"),
  v.literal("deal_disputed"),
  v.literal("system")
);

// ── Queries ────────────────────────────────────────────────────────────────

/**
 * List notifications, unread first, then by date
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    // Get all notifications sorted by createdAt desc
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_created")
      .order("desc")
      .take(100); // Get more than we need so we can sort properly
    
    // Sort: unread first, then by date
    const sorted = notifications.sort((a, b) => {
      if (a.read !== b.read) {
        return a.read ? 1 : -1; // unread first
      }
      return b.createdAt - a.createdAt; // then by date desc
    });
    
    return sorted.slice(0, limit);
  },
});

/**
 * Get count of unread notifications
 */
export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    
    return unread.length;
  },
});

// ── Mutations ───────────────────────────────────────────────────────────────

/**
 * Create a new notification
 */
export const create = mutation({
  args: {
    type: notificationType,
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      type: args.type,
      title: args.title,
      body: args.body,
      read: false,
      link: args.link,
      createdAt: Date.now(),
    });
  },
});

/**
 * Mark a single notification as read
 */
export const markRead = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
    return { success: true };
  },
});

/**
 * Mark all notifications as read
 */
export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    
    await Promise.all(
      unread.map((n) => ctx.db.patch(n._id, { read: true }))
    );
    
    return { success: true, count: unread.length };
  },
});

// ── Seed Demo Notifications ─────────────────────────────────────────────────

export const seedDemoNotifications = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if we already have notifications
    const existing = await ctx.db.query("notifications").first();
    if (existing) {
      return { success: true, message: "Notifications already exist" };
    }

    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    const demoNotifications = [
      {
        type: "tier_change" as const,
        title: "Partner Tier Upgrade",
        body: "TechStar Solutions moved to Gold tier based on Q4 performance",
        read: false,
        link: "/dashboard/partners",
        createdAt: now - 2 * hour,
      },
      {
        type: "commission_paid" as const,
        title: "Commission Payment Processed",
        body: "Commission payment of $12,450 has been processed for Apex Partners",
        read: false,
        link: "/dashboard/payouts",
        createdAt: now - 5 * hour,
      },
      {
        type: "partner_joined" as const,
        title: "New Partner Application",
        body: "Horizon Dynamics has submitted a partnership application",
        read: false,
        link: "/dashboard/partners",
        createdAt: now - 1 * day,
      },
      {
        type: "deal_approved" as const,
        title: "Deal Approved",
        body: "Deal approved: CloudBridge × Acme Corp ($85,000)",
        read: true,
        link: "/dashboard/deals",
        createdAt: now - 2 * day,
      },
      {
        type: "deal_disputed" as const,
        title: "Attribution Dispute Filed",
        body: "Attribution dispute filed on Enterprise Security deal by DataFlow Inc",
        read: true,
        link: "/dashboard/conflicts",
        createdAt: now - 3 * day,
      },
      {
        type: "system" as const,
        title: "Welcome to Covant",
        body: "Your partner attribution platform is ready. Start by adding partners and tracking deals.",
        read: true,
        createdAt: now - 7 * day,
      },
    ];

    await Promise.all(
      demoNotifications.map((n) => ctx.db.insert("notifications", n))
    );

    return { success: true, message: "Seeded 6 demo notifications" };
  },
});
