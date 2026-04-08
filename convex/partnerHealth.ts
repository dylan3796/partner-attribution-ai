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
    const MS_DAY = 24 * 60 * 60 * 1000;
    const MS_7D = 7 * MS_DAY;
    const MS_30D = 30 * MS_DAY;
    const MS_90D = 90 * MS_DAY;
    const MS_180D = 180 * MS_DAY;

    // Pre-build partner-indexed Maps to avoid O(n²) filtering
    const dealsByPartner = new Map<string, typeof deals>();
    for (const d of deals) {
      if (d.registeredBy) {
        const arr = dealsByPartner.get(d.registeredBy) ?? [];
        arr.push(d);
        dealsByPartner.set(d.registeredBy, arr);
      }
    }
    const tpByPartner = new Map<string, typeof touchpoints>();
    for (const t of touchpoints) {
      const arr = tpByPartner.get(t.partnerId) ?? [];
      arr.push(t);
      tpByPartner.set(t.partnerId, arr);
    }
    const payoutsByPartner = new Map<string, typeof payouts>();
    for (const p of payouts) {
      const arr = payoutsByPartner.get(p.partnerId) ?? [];
      arr.push(p);
      payoutsByPartner.set(p.partnerId, arr);
    }

    return partners
      .filter((p) => p.status === "active" || p.status === "pending")
      .map((partner) => {
        const pid = partner._id;

        // ── Deals for this partner ──
        const partnerDeals = dealsByPartner.get(pid) ?? [];
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
        const partnerTouchpoints = tpByPartner.get(pid) ?? [];
        const touchpointsLast90 = partnerTouchpoints.filter(
          (t) => t.createdAt > now - MS_90D
        ).length;
        const lastTouchpointTs = partnerTouchpoints.reduce(
          (max, t) => Math.max(max, t.createdAt),
          0
        );

        // ── Weekly engagement trend (last 6 weeks) — early warning system ──
        const weeklyActivity: number[] = [];
        for (let w = 5; w >= 0; w--) {
          const weekStart = now - (w + 1) * MS_7D;
          const weekEnd = now - w * MS_7D;
          const tpCount = partnerTouchpoints.filter(
            (t) => t.createdAt > weekStart && t.createdAt <= weekEnd
          ).length;
          const dealCount = partnerDeals.filter(
            (d) => d.createdAt > weekStart && d.createdAt <= weekEnd
          ).length;
          weeklyActivity.push(tpCount + dealCount);
        }

        // Engagement volatility: detect sharp drops
        // Compare recent 2 weeks vs prior 4 weeks average
        const recentWeeks = weeklyActivity.slice(-2);
        const priorWeeks = weeklyActivity.slice(0, 4);
        const recentAvg = recentWeeks.reduce((s, v) => s + v, 0) / 2;
        const priorAvg = priorWeeks.reduce((s, v) => s + v, 0) / Math.max(priorWeeks.length, 1);
        const engagementDropPct = priorAvg > 0
          ? Math.round(((recentAvg - priorAvg) / priorAvg) * 100)
          : 0;

        // Consecutive declining weeks (trend-of-trend)
        let decliningWeeks = 0;
        for (let i = weeklyActivity.length - 1; i > 0; i--) {
          if (weeklyActivity[i] < weeklyActivity[i - 1]) {
            decliningWeeks++;
          } else {
            break;
          }
        }

        // ── Payouts ──
        const partnerPayouts = payoutsByPartner.get(pid) ?? [];
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
        const daysSinceActive = Math.floor((now - lastActivity) / MS_DAY);

        // ── Health score (0-100) ──
        // Components weighted:
        //   Deal activity (25%): deals in last 90d
        //   Revenue (20%): revenue in last 90d
        //   Engagement (20%): touchpoints in last 90d
        //   Recency (15%): days since last activity
        //   Momentum (10%): weekly engagement trend (new: catches early declines)
        //   Payout health (10%): ratio of paid vs pending
        const dealScore = Math.min(dealsLast90.length * 15, 100);
        const revenueScore = Math.min(revenueLast90 / 500, 100);
        const engagementScore = Math.min(touchpointsLast90 * 12, 100);
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

        // Momentum score: penalizes declining engagement trend
        let momentumScore = 50; // neutral baseline
        if (engagementDropPct <= -50) {
          momentumScore = 0; // severe drop
        } else if (engagementDropPct <= -25) {
          momentumScore = 20; // significant drop
        } else if (engagementDropPct < 0) {
          momentumScore = 35; // mild decline
        } else if (engagementDropPct > 25) {
          momentumScore = 90; // growing
        } else if (engagementDropPct > 0) {
          momentumScore = 70; // slight growth
        }
        // Further penalize consecutive declining weeks
        if (decliningWeeks >= 3) momentumScore = Math.min(momentumScore, 10);
        else if (decliningWeeks >= 2) momentumScore = Math.min(momentumScore, 25);

        const totalPayouts = paidCount + unpaidCount;
        const payoutScore = totalPayouts > 0 ? (paidCount / totalPayouts) * 100 : 50;

        const healthScore = Math.round(
          dealScore * 0.25 +
            revenueScore * 0.2 +
            engagementScore * 0.2 +
            recencyScore * 0.15 +
            momentumScore * 0.1 +
            payoutScore * 0.1
        );

        // ── Risk classification — now with early warning via momentum ──
        const isNew = partner.createdAt > now - MS_30D;
        let risk: "healthy" | "watch" | "at-risk" | "churning" | "new" = "healthy";
        if (isNew && dealsLast90.length === 0) {
          risk = "new";
        } else if (healthScore < 35 || daysSinceActive > 30) {
          risk = "churning";
        } else if (healthScore < 60 || daysSinceActive > 14) {
          risk = "at-risk";
        } else if (engagementDropPct <= -40 || decliningWeeks >= 3) {
          // NEW: Early warning — still looks healthy on paper but engagement is dropping fast
          risk = "watch";
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
        // New early-warning signals
        if (engagementDropPct <= -50)
          signals.push(`ALERT: Engagement dropped ${Math.abs(engagementDropPct)}% in last 2 weeks`);
        else if (engagementDropPct <= -25)
          signals.push(`Engagement declining (${Math.abs(engagementDropPct)}% drop vs prior weeks)`);
        if (decliningWeeks >= 3)
          signals.push(`${decliningWeeks} consecutive weeks of declining activity`);
        else if (decliningWeeks >= 2)
          signals.push("Activity declining for 2 consecutive weeks");
        if (engagementDropPct >= 50)
          signals.push(`Engagement surging (+${engagementDropPct}% vs prior weeks)`);

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
        } else if (risk === "watch") {
          actions.push("EARLY WARNING: Engagement trend is declining");
          actions.push("Proactive check-in recommended this week");
          if (unpaidCount > 0)
            actions.push("Expedite pending commission payments");
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
          // New: weekly engagement data for trend visualization
          weeklyEngagement: weeklyActivity,
          engagementDropPct,
          decliningWeeks,
          momentumScore,
        };
      })
      .sort((a, b) => b.healthScore - a.healthScore);
  },
});
