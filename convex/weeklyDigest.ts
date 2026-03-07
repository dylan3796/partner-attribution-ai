/**
 * Weekly Performance Digest — computes week-over-week metrics for exec reporting.
 */
import { query } from "./_generated/server";
import { v } from "convex/values";
import { getOrg } from "./lib/getOrg";

export const getDigest = query({
  args: {
    weekStart: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) {
      return null;
    }
    const orgId = org._id;

    const now = Date.now();
    const DAY = 86400000;
    const WEEK = 7 * DAY;

    // Default: current week starting Monday
    let weekStart: number;
    if (args.weekStart) {
      weekStart = args.weekStart;
    } else {
      const today = new Date(now);
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(today);
      monday.setHours(0, 0, 0, 0);
      monday.setDate(monday.getDate() - mondayOffset);
      weekStart = monday.getTime();
    }
    const weekEnd = weekStart + WEEK;
    const prevWeekStart = weekStart - WEEK;
    const prevWeekEnd = weekStart;

    // Fetch all relevant data
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const allPartners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const allPayouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const allTouchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const allAudit = await ctx.db
      .query("audit_log")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    // ── This Week metrics ──
    const thisWeekDeals = allDeals.filter(
      (d) => d.createdAt >= weekStart && d.createdAt < weekEnd
    );
    const thisWeekWon = allDeals.filter(
      (d) =>
        d.status === "won" &&
        d.closedAt &&
        d.closedAt >= weekStart &&
        d.closedAt < weekEnd
    );
    const thisWeekLost = allDeals.filter(
      (d) =>
        d.status === "lost" &&
        d.closedAt &&
        d.closedAt >= weekStart &&
        d.closedAt < weekEnd
    );
    const thisWeekRevenue = thisWeekWon.reduce((s, d) => s + (d.amount || 0), 0);
    const thisWeekPipeline = thisWeekDeals
      .filter((d) => d.status !== "won" && d.status !== "lost")
      .reduce((s, d) => s + (d.amount || 0), 0);

    const thisWeekNewPartners = allPartners.filter(
      (p) => p._creationTime >= weekStart && p._creationTime < weekEnd
    );
    const thisWeekPayouts = allPayouts.filter(
      (p) => p._creationTime >= weekStart && p._creationTime < weekEnd
    );
    const thisWeekCommissions = thisWeekPayouts.reduce(
      (s, p) => s + (p.amount || 0),
      0
    );
    const thisWeekTouchpoints = allTouchpoints.filter(
      (t) => t.createdAt >= weekStart && t.createdAt < weekEnd
    );

    // ── Previous Week metrics ──
    const prevWeekWon = allDeals.filter(
      (d) =>
        d.status === "won" &&
        d.closedAt &&
        d.closedAt >= prevWeekStart &&
        d.closedAt < prevWeekEnd
    );
    const prevWeekRevenue = prevWeekWon.reduce(
      (s, d) => s + (d.amount || 0),
      0
    );
    const prevWeekDeals = allDeals.filter(
      (d) => d.createdAt >= prevWeekStart && d.createdAt < prevWeekEnd
    );
    const prevWeekNewPartners = allPartners.filter(
      (p) => p._creationTime >= prevWeekStart && p._creationTime < prevWeekEnd
    );
    const prevWeekTouchpoints = allTouchpoints.filter(
      (t) => t.createdAt >= prevWeekStart && t.createdAt < prevWeekEnd
    );

    // ── Win rate ──
    const thisWeekClosed = thisWeekWon.length + thisWeekLost.length;
    const thisWeekWinRate =
      thisWeekClosed > 0
        ? Math.round((thisWeekWon.length / thisWeekClosed) * 100)
        : null;
    const prevWeekLost = allDeals.filter(
      (d) =>
        d.status === "lost" &&
        d.closedAt &&
        d.closedAt >= prevWeekStart &&
        d.closedAt < prevWeekEnd
    );
    const prevWeekClosed = prevWeekWon.length + prevWeekLost.length;
    const prevWeekWinRate =
      prevWeekClosed > 0
        ? Math.round((prevWeekWon.length / prevWeekClosed) * 100)
        : null;

    // ── Top partner of the week (by revenue closed) ──
    const partnerRevenue: Record<string, number> = {};
    for (const d of thisWeekWon) {
      const dealTouchpoints = allTouchpoints.filter(
        (t) => t.dealId === d._id
      );
      for (const t of dealTouchpoints) {
        const pid = String(t.partnerId);
        partnerRevenue[pid] = (partnerRevenue[pid] || 0) + (d.amount || 0);
      }
      if (d.registeredBy) {
        const rid = String(d.registeredBy);
        partnerRevenue[rid] = (partnerRevenue[rid] || 0) + (d.amount || 0);
      }
    }
    let topPartnerId: string | null = null;
    let topPartnerRevenue = 0;
    for (const [pid, rev] of Object.entries(partnerRevenue)) {
      if (rev > topPartnerRevenue) {
        topPartnerId = pid;
        topPartnerRevenue = rev;
      }
    }
    let topPartner: { name: string; revenue: number; type: string; tier: string } | null = null;
    if (topPartnerId) {
      const p = allPartners.find((p) => String(p._id) === topPartnerId);
      if (p) {
        topPartner = {
          name: p.name,
          revenue: topPartnerRevenue,
          type: p.type || "partner",
          tier: p.tier || "—",
        };
      }
    }

    // ── Highlights: notable deals closed this week ──
    const highlights = thisWeekWon
      .sort((a, b) => (b.amount || 0) - (a.amount || 0))
      .slice(0, 5)
      .map((d) => ({
        id: String(d._id),
        name: d.name,
        amount: d.amount || 0,
        product: d.productName || null,
      }));

    // ── At-risk signals ──
    const atRiskPartners = allPartners.filter((p) => {
      if (p.status !== "active") return false;
      const partnerTouchpoints = allTouchpoints.filter(
        (t) => t.partnerId === p._id
      );
      if (partnerTouchpoints.length === 0) return true;
      const lastTouch = Math.max(...partnerTouchpoints.map((t) => t.createdAt));
      return now - lastTouch > 60 * DAY;
    });

    // ── Recent audit highlights (this week) ──
    const weekAuditEntries = allAudit
      .filter((a) => a._creationTime >= weekStart && a._creationTime < weekEnd)
      .length;

    function delta(current: number, previous: number) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    }

    return {
      weekStart,
      weekEnd: Math.min(weekEnd, now),
      isCurrentWeek: weekEnd > now,

      metrics: {
        revenue: {
          value: thisWeekRevenue,
          previous: prevWeekRevenue,
          delta: delta(thisWeekRevenue, prevWeekRevenue),
        },
        dealsCreated: {
          value: thisWeekDeals.length,
          previous: prevWeekDeals.length,
          delta: delta(thisWeekDeals.length, prevWeekDeals.length),
        },
        dealsClosed: {
          won: thisWeekWon.length,
          lost: thisWeekLost.length,
          winRate: thisWeekWinRate,
          prevWinRate: prevWeekWinRate,
        },
        pipeline: thisWeekPipeline,
        newPartners: {
          value: thisWeekNewPartners.length,
          previous: prevWeekNewPartners.length,
        },
        commissions: thisWeekCommissions,
        touchpoints: {
          value: thisWeekTouchpoints.length,
          previous: prevWeekTouchpoints.length,
          delta: delta(thisWeekTouchpoints.length, prevWeekTouchpoints.length),
        },
        auditEntries: weekAuditEntries,
      },

      topPartner,
      highlights,
      atRiskPartners: atRiskPartners.slice(0, 5).map((p) => ({
        id: String(p._id),
        name: p.name,
        type: p.type || "partner",
        tier: p.tier || "—",
      })),

      totals: {
        partners: allPartners.filter((p) => p.status === "active").length,
        totalRevenue: allDeals
          .filter((d) => d.status === "won")
          .reduce((s, d) => s + (d.amount || 0), 0),
        openPipeline: allDeals
          .filter((d) => d.status !== "won" && d.status !== "lost")
          .reduce((s, d) => s + (d.amount || 0), 0),
      },
    };
  },
});
