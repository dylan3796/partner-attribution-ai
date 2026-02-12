/**
 * Partner Scoring & Tiering Engine
 * 
 * Calculates composite partner scores based on four dimensions:
 * 1. Revenue Impact — attributed revenue from won deals
 * 2. Pipeline Contribution — value of open deals partner is involved in
 * 3. Engagement — frequency and recency of touchpoints
 * 4. Deal Velocity — how quickly partner-influenced deals close
 * 
 * Each dimension scores 0–100, weighted to produce a final score 0–100.
 * Tier recommendations are auto-calculated from the final score.
 */

import type { Partner, Deal, Touchpoint, Attribution } from "./types";
import { calculateCertificationScore } from "./certifications-data";

export type ScoreDimension = {
  score: number;      // 0–100
  weight: number;     // 0–1 (sums to 1.0)
  label: string;
  detail: string;     // human-readable explanation
};

export type PartnerScore = {
  partnerId: string;
  partnerName: string;
  currentTier: string;
  overallScore: number;  // 0–100 weighted composite
  dimensions: {
    revenue: ScoreDimension;
    pipeline: ScoreDimension;
    engagement: ScoreDimension;
    velocity: ScoreDimension;
  };
  recommendedTier: "bronze" | "silver" | "gold" | "platinum";
  tierChange: "upgrade" | "downgrade" | "maintain";
  rank: number;
  trend: "up" | "down" | "stable"; // based on recent activity
  highlights: string[];             // actionable insights
};

export type ScoringConfig = {
  weights: {
    revenue: number;
    pipeline: number;
    engagement: number;
    velocity: number;
  };
  tierThresholds: {
    platinum: number;
    gold: number;
    silver: number;
    // below silver = bronze
  };
};

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  weights: {
    revenue: 0.35,
    pipeline: 0.25,
    engagement: 0.25,
    velocity: 0.15,
  },
  tierThresholds: {
    platinum: 85,
    gold: 65,
    silver: 40,
  },
};

const DAY_MS = 86400000;

/**
 * Score a single partner's revenue impact.
 * Looks at role_based attributed revenue from won deals.
 */
function scoreRevenue(
  partnerId: string,
  attributions: Attribution[],
  allAttributions: Attribution[]
): { score: number; detail: string; totalRevenue: number } {
  // Only role_based model, only for won deals (attributions already filtered to won)
  const partnerAttrs = attributions.filter(
    (a) => a.partnerId === partnerId && a.model === "role_based"
  );
  const totalAttributed = partnerAttrs.reduce((s, a) => s + a.amount, 0);

  // Compare against the max partner's revenue to normalize
  const allPartnerRevenues = new Map<string, number>();
  for (const a of allAttributions.filter((a) => a.model === "role_based")) {
    allPartnerRevenues.set(
      a.partnerId,
      (allPartnerRevenues.get(a.partnerId) || 0) + a.amount
    );
  }
  const maxRevenue = Math.max(...allPartnerRevenues.values(), 1);
  const score = Math.min(100, Math.round((totalAttributed / maxRevenue) * 100));

  return {
    score,
    detail: `$${totalAttributed.toLocaleString()} attributed revenue (${partnerAttrs.length} deals)`,
    totalRevenue: totalAttributed,
  };
}

/**
 * Score pipeline contribution — value of open deals the partner has touchpoints on.
 */
function scorePipeline(
  partnerId: string,
  deals: Deal[],
  touchpoints: Touchpoint[],
  allTouchpoints: Touchpoint[]
): { score: number; detail: string; pipelineValue: number } {
  const openDeals = deals.filter((d) => d.status === "open");
  const partnerTpDealIds = new Set(
    touchpoints.filter((tp) => tp.partnerId === partnerId).map((tp) => tp.dealId)
  );
  const partnerOpenDeals = openDeals.filter((d) => partnerTpDealIds.has(d._id));
  const pipelineValue = partnerOpenDeals.reduce((s, d) => s + d.amount, 0);

  // Normalize against max pipeline contribution across all partners
  const allPartnerPipelines = new Map<string, number>();
  for (const tp of allTouchpoints) {
    const deal = openDeals.find((d) => d._id === tp.dealId);
    if (deal) {
      allPartnerPipelines.set(
        tp.partnerId,
        (allPartnerPipelines.get(tp.partnerId) || 0) + deal.amount
      );
    }
  }
  // Deduplicate — a partner with multiple touchpoints on same deal shouldn't double-count
  // (already handled by set above for the scored partner, but normalize also needs care)
  const maxPipeline = Math.max(...allPartnerPipelines.values(), 1);
  const score = Math.min(100, Math.round((pipelineValue / maxPipeline) * 100));

  return {
    score,
    detail: `$${pipelineValue.toLocaleString()} in ${partnerOpenDeals.length} open deals`,
    pipelineValue,
  };
}

/**
 * Score engagement — frequency and recency of touchpoints.
 * Recent activity is weighted more heavily (last 30 days vs 30–90 days).
 */
function scoreEngagement(
  partnerId: string,
  touchpoints: Touchpoint[],
  allTouchpoints: Touchpoint[]
): { score: number; detail: string; recentCount: number; totalCount: number } {
  const now = Date.now();
  const partnerTps = touchpoints.filter((tp) => tp.partnerId === partnerId);
  const recent = partnerTps.filter((tp) => now - tp.createdAt < 30 * DAY_MS);
  const older = partnerTps.filter(
    (tp) => now - tp.createdAt >= 30 * DAY_MS && now - tp.createdAt < 90 * DAY_MS
  );

  // Weighted score: recent activity counts 2x
  const weightedCount = recent.length * 2 + older.length;

  // Normalize
  const allPartnerEngagement = new Map<string, number>();
  for (const tp of allTouchpoints) {
    const isRecent = now - tp.createdAt < 30 * DAY_MS;
    const isOlder = now - tp.createdAt >= 30 * DAY_MS && now - tp.createdAt < 90 * DAY_MS;
    if (isRecent || isOlder) {
      const w = isRecent ? 2 : 1;
      allPartnerEngagement.set(
        tp.partnerId,
        (allPartnerEngagement.get(tp.partnerId) || 0) + w
      );
    }
  }
  const maxEngagement = Math.max(...allPartnerEngagement.values(), 1);
  
  // Blend touchpoint engagement (70%) with certification score (30%)
  const touchpointScore = Math.min(100, Math.round((weightedCount / maxEngagement) * 100));
  const certScore = calculateCertificationScore(partnerId);
  const score = Math.round(touchpointScore * 0.7 + certScore * 0.3);

  const certDetail = certScore > 0 ? ` · Cert score: ${certScore}` : "";

  return {
    score,
    detail: `${recent.length} touchpoints (last 30d), ${partnerTps.length} total${certDetail}`,
    recentCount: recent.length,
    totalCount: partnerTps.length,
  };
}

/**
 * Score deal velocity — average days to close for partner-influenced won deals.
 * Faster = better score.
 */
function scoreVelocity(
  partnerId: string,
  deals: Deal[],
  touchpoints: Touchpoint[],
  allTouchpoints: Touchpoint[]
): { score: number; detail: string; avgDays: number } {
  const wonDeals = deals.filter((d) => d.status === "won");
  const partnerDealIds = new Set(
    touchpoints.filter((tp) => tp.partnerId === partnerId).map((tp) => tp.dealId)
  );
  const partnerWonDeals = wonDeals.filter((d) => partnerDealIds.has(d._id));

  if (partnerWonDeals.length === 0) {
    return { score: 0, detail: "No won deals yet", avgDays: 0 };
  }

  const avgDays =
    partnerWonDeals.reduce((s, d) => {
      const closedAt = d.closedAt || Date.now();
      return s + (closedAt - d.createdAt) / DAY_MS;
    }, 0) / partnerWonDeals.length;

  // Get all partner velocities for normalization
  const allPartnerDealIds = new Map<string, Set<string>>();
  for (const tp of allTouchpoints) {
    if (!allPartnerDealIds.has(tp.partnerId)) allPartnerDealIds.set(tp.partnerId, new Set());
    allPartnerDealIds.get(tp.partnerId)!.add(tp.dealId);
  }

  const allAvgDays: number[] = [];
  for (const [, dealIds] of allPartnerDealIds) {
    const pWon = wonDeals.filter((d) => dealIds.has(d._id));
    if (pWon.length > 0) {
      const avg =
        pWon.reduce((s, d) => s + ((d.closedAt || Date.now()) - d.createdAt) / DAY_MS, 0) /
        pWon.length;
      allAvgDays.push(avg);
    }
  }

  if (allAvgDays.length === 0) {
    return { score: 50, detail: `${Math.round(avgDays)} avg days to close`, avgDays };
  }

  // Inverse scoring — faster is better
  const maxDays = Math.max(...allAvgDays);
  const score = maxDays > 0 ? Math.round(((maxDays - avgDays) / maxDays) * 100) : 50;

  return {
    score: Math.max(0, Math.min(100, score)),
    detail: `${Math.round(avgDays)} avg days to close (${partnerWonDeals.length} deals)`,
    avgDays,
  };
}

/**
 * Determine trend based on recent vs older activity.
 */
function determineTrend(
  partnerId: string,
  touchpoints: Touchpoint[]
): "up" | "down" | "stable" {
  const now = Date.now();
  const partnerTps = touchpoints.filter((tp) => tp.partnerId === partnerId);
  const last30 = partnerTps.filter((tp) => now - tp.createdAt < 30 * DAY_MS).length;
  const prev30 = partnerTps.filter(
    (tp) => now - tp.createdAt >= 30 * DAY_MS && now - tp.createdAt < 60 * DAY_MS
  ).length;

  if (last30 > prev30 + 1) return "up";
  if (last30 < prev30 - 1) return "down";
  return "stable";
}

/**
 * Generate actionable highlights for a partner.
 */
function generateHighlights(
  partner: Partner,
  score: number,
  recommendedTier: string,
  engagementDetail: { recentCount: number; totalCount: number },
  pipelineValue: number,
  totalRevenue: number
): string[] {
  const highlights: string[] = [];

  if (recommendedTier !== (partner.tier || "bronze")) {
    const current = partner.tier || "bronze";
    const tierOrder = ["bronze", "silver", "gold", "platinum"];
    const isUp = tierOrder.indexOf(recommendedTier) > tierOrder.indexOf(current);
    highlights.push(
      isUp
        ? `🔺 Ready for tier upgrade: ${current} → ${recommendedTier}`
        : `🔻 Tier at risk: ${current} → ${recommendedTier}`
    );
  }

  if (engagementDetail.recentCount === 0 && engagementDetail.totalCount > 0) {
    highlights.push("⚠️ No activity in last 30 days — needs re-engagement");
  }

  if (pipelineValue > 100000) {
    highlights.push(`💰 High pipeline value ($${(pipelineValue / 1000).toFixed(0)}k) — prioritize support`);
  }

  if (score >= 80) {
    highlights.push("⭐ Top performer — consider for co-marketing or advisory board");
  }

  if (totalRevenue === 0 && partner.status === "active") {
    highlights.push("📋 Active but no attributed revenue yet — review enablement needs");
  }

  if (partner.status === "pending") {
    highlights.push("🔄 Onboarding in progress — ensure enablement materials sent");
  }

  return highlights;
}

/**
 * Calculate scores for all partners.
 */
export function calculatePartnerScores(
  partners: Partner[],
  deals: Deal[],
  touchpoints: Touchpoint[],
  attributions: Attribution[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): PartnerScore[] {
  const activePartners = partners.filter((p) => p.status !== "inactive");
  const scores: PartnerScore[] = [];

  for (const partner of activePartners) {
    const rev = scoreRevenue(partner._id, attributions, attributions);
    const pipe = scorePipeline(partner._id, deals, touchpoints, touchpoints);
    const eng = scoreEngagement(partner._id, touchpoints, touchpoints);
    const vel = scoreVelocity(partner._id, deals, touchpoints, touchpoints);

    const overallScore = Math.round(
      rev.score * config.weights.revenue +
        pipe.score * config.weights.pipeline +
        eng.score * config.weights.engagement +
        vel.score * config.weights.velocity
    );

    const recommendedTier =
      overallScore >= config.tierThresholds.platinum
        ? "platinum"
        : overallScore >= config.tierThresholds.gold
          ? "gold"
          : overallScore >= config.tierThresholds.silver
            ? "silver"
            : "bronze";

    const currentTier = partner.tier || "bronze";
    const tierOrder = ["bronze", "silver", "gold", "platinum"];
    const tierChange =
      tierOrder.indexOf(recommendedTier) > tierOrder.indexOf(currentTier)
        ? "upgrade"
        : tierOrder.indexOf(recommendedTier) < tierOrder.indexOf(currentTier)
          ? "downgrade"
          : "maintain";

    const trend = determineTrend(partner._id, touchpoints);
    const highlights = generateHighlights(
      partner,
      overallScore,
      recommendedTier,
      { recentCount: eng.recentCount, totalCount: eng.totalCount },
      pipe.pipelineValue,
      rev.totalRevenue
    );

    scores.push({
      partnerId: partner._id,
      partnerName: partner.name,
      currentTier,
      overallScore,
      dimensions: {
        revenue: {
          score: rev.score,
          weight: config.weights.revenue,
          label: "Revenue Impact",
          detail: rev.detail,
        },
        pipeline: {
          score: pipe.score,
          weight: config.weights.pipeline,
          label: "Pipeline Contribution",
          detail: pipe.detail,
        },
        engagement: {
          score: eng.score,
          weight: config.weights.engagement,
          label: "Engagement",
          detail: eng.detail,
        },
        velocity: {
          score: vel.score,
          weight: config.weights.velocity,
          label: "Deal Velocity",
          detail: vel.detail,
        },
      },
      recommendedTier,
      tierChange: tierChange as "upgrade" | "downgrade" | "maintain",
      rank: 0, // set after sorting
      trend,
      highlights,
    });
  }

  // Sort by overall score descending and assign ranks
  scores.sort((a, b) => b.overallScore - a.overallScore);
  scores.forEach((s, i) => (s.rank = i + 1));

  return scores;
}

/**
 * Get tier color for UI styling.
 */
export function tierColor(tier: string): string {
  switch (tier) {
    case "platinum": return "#6366f1";
    case "gold": return "#d97706";
    case "silver": return "#6b7280";
    case "bronze": return "#b45309";
    default: return "#6b7280";
  }
}

/**
 * Get tier background color.
 */
export function tierBgColor(tier: string): string {
  switch (tier) {
    case "platinum": return "#eef2ff";
    case "gold": return "#fffbeb";
    case "silver": return "#f3f4f6";
    case "bronze": return "#fef3c7";
    default: return "#f3f4f6";
  }
}

/**
 * Get score color based on value.
 */
export function scoreColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#0284c7";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}
