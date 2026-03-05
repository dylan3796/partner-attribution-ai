import { query } from "./_generated/server";
import { getOrgId } from "./lib/getOrg";

/**
 * Compute individual partner health scores from real Convex data.
 * Factors: deal activity (90d), revenue trends, touchpoint recency,
 * payout health, and time since last activity.
 */
export const getPartnerHealth = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];

    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    if (partners.length === 0) return [];

    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const now = Date.now();
    const MS_90D = 90 * 24 * 60 * 60 * 1000;
    const MS_180D = 180 * 24 * 60 * 60 * 1000;
    const MS_30D = 30 * 24 * 60 * 60 * 1000;

    return partners
      .filter((p) => p.status === "active" || p.status === "pending")
      .map((partner) => {
        const pid = partner._id;

        // ── Deals for this partner ──
        const partnerDeals = deals.filter((d) => d.registeredBy === pid);
        const dealsLast90 = partnerDeals.filter((d) => d.createdAt > now - MS_90D);
        const dealsPrev90 = partnerDeals.filter(
          (d) => d.createdAt > now - MS_180D && d.createdAt <= now - MS_90D
        );
        const wonDealsLast90 = dealsLast90.filter((d) => d.status === "won");
        const wonDealsPrev90 = dealsPrev90.filter((d) => d.status === "won");
        const revenueLast90 = wonDealsLast90.reduce((s, d) => s + d.amount, 0);
        const revenuePrev90 = wonDealsPrev90.reduce((s, d) => s + d.amount, 0);
        const revenueTrend =
          revenuePrev90 > 0
            ? Math.round(((revenueLast90 - revenuePrev90) / revenuePrev90) * 100)
            : revenueLast90 > 0
              ? 100
              : 0;

        const dealsTrend = dealsLast90.length - dealsPrev90.length;

        // ── Touchpoints recency ──
        const partnerTouchpoints = touchpoints.filter((t) => t.partnerId === pid);
        const touchpointsLast90 = partnerTouchpoints.filter(
          (t) => t.createdAt > now - MS_90D
        ).length;
        const lastTouchpointTs = partnerTouchpoints.reduce(
          (max, t) => Math.max(max, t.createdAt),
          0
        );

        // ── Payouts ──
        const partnerPayouts = payouts.filter((p) => p.partnerId === pid);
        const unpaidCount = partnerPayouts.filter(
          (p) => p.status === "pending_approval" || p.status === "approved"
        ).length;
        const paidCount = partnerPayouts.filter((p) => p.status === "paid").length;

        // ── Last activity (most recent of: deal, touchpoint, partner creation) ──
        const lastDealTs = partnerDeals.reduce(
          (max, d) => Math.max(max, d.createdAt),
          0
        );
        const lastActivity = Math.max(
          lastDealTs,
          lastTouchpointTs,
          partner.createdAt
        );
        const daysSinceActive = Math.floor((now - lastActivity) / (24 * 60 * 60 * 1000));

        // ── Health score (0-100) ──
        // Components weighted:
        //   Deal activity (30%): deals in last 90d
        //   Revenue (25%): revenue in last 90d
        //   Engagement (20%): touchpoints in last 90d
        //   Recency (15%): days since last activity
        //   Payout health (10%): ratio of paid vs pending
        const dealScore = Math.min(dealsLast90.length * 15, 100); // 7+ deals = max
        const revenueScore = Math.min(revenueLast90 / 500, 100); // $50k+ = max (scaled for demo)
        const engagementScore = Math.min(touchpointsLast90 * 12, 100); // 8+ touchpoints = max
        const recencyScore =
          daysSinceActive === 0
            ? 100
            : daysSinceActive <= 3
              ? 90
              : daysSinceActive <= 7
                ? 75
                : daysSinceActive <= 14
                  ? 55
                  : daysSinceActive <= 30
                    ? 30
                    : daysSinceActive <= 60
                      ? 15
                      : 0;
        const totalPayouts = paidCount + unpaidCount;
        const payoutScore = totalPayouts > 0 ? (paidCount / totalPayouts) * 100 : 50; // neutral if none

        const healthScore = Math.round(
          dealScore * 0.3 +
            revenueScore * 0.25 +
            engagementScore * 0.2 +
            recencyScore * 0.15 +
            payoutScore * 0.1
        );

        // ── Risk classification ──
        const isNew = partner.createdAt > now - MS_30D;
        let risk: "healthy" | "at-risk" | "churning" | "new" = "healthy";
        if (isNew && dealsLast90.length === 0) {
          risk = "new";
        } else if (healthScore < 35 || daysSinceActive > 30) {
          risk = "churning";
        } else if (healthScore < 60 || daysSinceActive > 14) {
          risk = "at-risk";
        }

        // ── Signals ──
        const signals: string[] = [];
        if (dealsLast90.length >= 5)
          signals.push("High deal velocity this quarter");
        if (dealsTrend > 0)
          signals.push(`Deal count up ${dealsTrend} vs prior 90d`);
        if (dealsTrend < -2)
          signals.push("Deal velocity declining");
        if (revenueTrend > 15)
          signals.push(`Revenue up ${revenueTrend}% vs prior period`);
        if (revenueTrend < -15)
          signals.push(`Revenue down ${Math.abs(revenueTrend)}% vs prior period`);
        if (daysSinceActive > 14)
          signals.push(`${daysSinceActive} days inactive`);
        if (daysSinceActive === 0)
          signals.push("Active today");
        if (touchpointsLast90 >= 5)
          signals.push("Regular engagement activity");
        if (touchpointsLast90 === 0 && !isNew)
          signals.push("Zero touchpoints in 90 days");
        if (unpaidCount > 0)
          signals.push(`${unpaidCount} commission${unpaidCount > 1 ? "s" : ""} awaiting payment`);
        if (isNew) signals.push("Recently onboarded");

        // ── Recommended actions ──
        const actions: string[] = [];
        if (risk === "churning") {
          actions.push("ESCALATE: Partner at high churn risk");
          actions.push("Executive outreach recommended");
          actions.push("Offer incentive/SPIFF to re-engage");
        } else if (risk === "at-risk") {
          actions.push("Schedule partner health check call");
          actions.push("Review deal pipeline with partner");
          if (touchpointsLast90 === 0)
            actions.push("Offer enablement resources");
        } else if (risk === "new") {
          actions.push("Complete onboarding checklist");
          actions.push("Schedule kickoff call");
          actions.push("Share enablement resources");
        } else {
          // Healthy
          if (dealsLast90.length >= 5)
            actions.push("Consider for case study");
          if (healthScore >= 85)
            actions.push("Invite to advisory board");
          if (partner.tier !== "platinum" && healthScore >= 80)
            actions.push("Review for tier upgrade");
          if (actions.length === 0)
            actions.push("Maintain regular check-ins");
        }

        return {
          id: pid,
          name: partner.name,
          tier: partner.tier ?? "bronze",
          healthScore,
          risk,
          daysSinceActive,
          dealsLast90: dealsLast90.length,
          dealsTrend,
          revenueLast90,
          revenueTrend,
          touchpointsLast90,
          unpaidCommissions: unpaidCount,
          contactName: partner.contactName ?? "",
          contactEmail: partner.email,
          joinedDate: new Date(partner.createdAt).toISOString().slice(0, 10),
          signals,
          actions,
        };
      })
      .sort((a, b) => b.healthScore - a.healthScore);
  },
});
