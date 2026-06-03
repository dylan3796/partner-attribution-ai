/**
 * Partner Scoring & Tiering Engine (pure core)
 *
 * Decoupled from app-side demo data and `lib/types` so it can be imported from
 * BOTH the Convex runtime (queries) and the app/scripts — mirroring the
 * `convex/lib/attribution/` pattern. Certification and volume signals, which
 * live in demo fixtures app-side, are injected via `options` (default: none),
 * so this file has no demo-data imports.
 *
 * The app-side shim `lib/partner-scoring.ts` wires in the demo cert/volume data
 * and re-exports everything, preserving existing behavior exactly.
 *
 * Computes a composite 0–100 score across four (optionally five) dimensions:
 *   1. Revenue Impact — attributed revenue from won deals (primary model)
 *   2. Pipeline Contribution — value of open deals the partner is involved in
 *   3. Engagement — frequency + recency of touchpoints (blended with certs)
 *   4. Deal Velocity — how quickly partner-influenced deals close
 *   5. Volume — units sold in volume-rebate programs (bonus, when present)
 */

// ── Structural input shapes (compatible with Convex Docs and lib/types) ──

export interface ScoringPartner {
  _id: string;
  name: string;
  tier?: string | null;
  status?: string | null;
}

export interface ScoringDeal {
  _id: string;
  amount: number;
  status: string;
  createdAt: number;
  closedAt?: number | null;
}

export interface ScoringTouchpoint {
  partnerId: string;
  dealId: string;
  createdAt: number;
}

export interface ScoringAttribution {
  partnerId: string;
  model: string;
  amount: number;
}

export interface ScoringVolumeRecord {
  partnerId: string;
  unitsTotal: number;
  revenueTotal: number;
}

export interface ScoringOptions {
  /** Model whose rows count for the revenue dimension. Default "role_weighted". */
  primaryModel?: string;
  /** Injected certification score (0–100) per partner. Default: none → no cert blend. */
  certificationScore?: (partnerId: string) => number;
  /** Injected volume-rebate records. Default: none → no volume dimension. */
  volumeRecords?: ScoringVolumeRecord[];
}

export type ScoreDimension = {
  score: number; // 0–100
  weight: number; // 0–1
  label: string;
  detail: string;
};

export type PartnerScore = {
  partnerId: string;
  partnerName: string;
  currentTier: string;
  overallScore: number;
  dimensions: {
    revenue: ScoreDimension;
    pipeline: ScoreDimension;
    engagement: ScoreDimension;
    velocity: ScoreDimension;
    volume?: ScoreDimension;
  };
  recommendedTier: "bronze" | "silver" | "gold" | "platinum";
  tierChange: "upgrade" | "downgrade" | "maintain";
  rank: number;
  trend: "up" | "down" | "stable";
  highlights: string[];
};

export type ScoringConfig = {
  weights: { revenue: number; pipeline: number; engagement: number; velocity: number };
  tierThresholds: { platinum: number; gold: number; silver: number };
};

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  weights: { revenue: 0.35, pipeline: 0.25, engagement: 0.25, velocity: 0.15 },
  tierThresholds: { platinum: 85, gold: 65, silver: 40 },
};

const DEFAULT_PRIMARY_MODEL = "role_weighted";
const DAY_MS = 86400000;
const TIER_ORDER = ["bronze", "silver", "gold", "platinum"];

function scoreRevenue(
  partnerId: string,
  attributions: ScoringAttribution[],
  primaryModel: string
): { score: number; detail: string; totalRevenue: number } {
  const primary = attributions.filter((a) => a.model === primaryModel);
  const partnerAttrs = primary.filter((a) => a.partnerId === partnerId);
  const totalAttributed = partnerAttrs.reduce((s, a) => s + a.amount, 0);

  const allPartnerRevenues = new Map<string, number>();
  for (const a of primary) {
    allPartnerRevenues.set(a.partnerId, (allPartnerRevenues.get(a.partnerId) || 0) + a.amount);
  }
  const maxRevenue = Math.max(...allPartnerRevenues.values(), 1);
  const score = Math.min(100, Math.round((totalAttributed / maxRevenue) * 100));

  return {
    score,
    detail: `$${totalAttributed.toLocaleString()} attributed revenue (${partnerAttrs.length} deals)`,
    totalRevenue: totalAttributed,
  };
}

function scorePipeline(
  partnerId: string,
  deals: ScoringDeal[],
  touchpoints: ScoringTouchpoint[]
): { score: number; detail: string; pipelineValue: number } {
  const openDeals = deals.filter((d) => d.status === "open");
  const openById = new Map(openDeals.map((d) => [d._id, d]));
  const partnerTpDealIds = new Set(
    touchpoints.filter((tp) => tp.partnerId === partnerId).map((tp) => tp.dealId)
  );
  const partnerOpenDeals = openDeals.filter((d) => partnerTpDealIds.has(d._id));
  const pipelineValue = partnerOpenDeals.reduce((s, d) => s + d.amount, 0);

  // Normalize against the max single-partner open-pipeline (dedup per partner+deal).
  const seen = new Set<string>();
  const allPartnerPipelines = new Map<string, number>();
  for (const tp of touchpoints) {
    const deal = openById.get(tp.dealId);
    if (!deal) continue;
    const key = `${tp.partnerId}:${tp.dealId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    allPartnerPipelines.set(tp.partnerId, (allPartnerPipelines.get(tp.partnerId) || 0) + deal.amount);
  }
  const maxPipeline = Math.max(...allPartnerPipelines.values(), 1);
  const score = Math.min(100, Math.round((pipelineValue / maxPipeline) * 100));

  return {
    score,
    detail: `$${pipelineValue.toLocaleString()} in ${partnerOpenDeals.length} open deals`,
    pipelineValue,
  };
}

function scoreEngagement(
  partnerId: string,
  touchpoints: ScoringTouchpoint[],
  now: number,
  certificationScore?: (partnerId: string) => number
): { score: number; detail: string; recentCount: number; totalCount: number } {
  const partnerTps = touchpoints.filter((tp) => tp.partnerId === partnerId);
  const recent = partnerTps.filter((tp) => now - tp.createdAt < 30 * DAY_MS);
  const older = partnerTps.filter(
    (tp) => now - tp.createdAt >= 30 * DAY_MS && now - tp.createdAt < 90 * DAY_MS
  );
  const weightedCount = recent.length * 2 + older.length;

  const allPartnerEngagement = new Map<string, number>();
  for (const tp of touchpoints) {
    const age = now - tp.createdAt;
    const isRecent = age < 30 * DAY_MS;
    const isOlder = age >= 30 * DAY_MS && age < 90 * DAY_MS;
    if (isRecent || isOlder) {
      allPartnerEngagement.set(tp.partnerId, (allPartnerEngagement.get(tp.partnerId) || 0) + (isRecent ? 2 : 1));
    }
  }
  const maxEngagement = Math.max(...allPartnerEngagement.values(), 1);
  const touchpointScore = Math.min(100, Math.round((weightedCount / maxEngagement) * 100));

  // Blend with certifications only when a provider is injected (app path);
  // otherwise use the raw touchpoint score (Convex path with no cert fixture).
  let score = touchpointScore;
  let certDetail = "";
  if (certificationScore) {
    const certScore = certificationScore(partnerId);
    score = Math.round(touchpointScore * 0.7 + certScore * 0.3);
    if (certScore > 0) certDetail = ` · Cert score: ${certScore}`;
  }

  return {
    score,
    detail: `${recent.length} touchpoints (last 30d), ${partnerTps.length} total${certDetail}`,
    recentCount: recent.length,
    totalCount: partnerTps.length,
  };
}

function scoreVelocity(
  partnerId: string,
  deals: ScoringDeal[],
  touchpoints: ScoringTouchpoint[],
  now: number
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
    partnerWonDeals.reduce((s, d) => s + ((d.closedAt || now) - d.createdAt) / DAY_MS, 0) /
    partnerWonDeals.length;

  const allPartnerDealIds = new Map<string, Set<string>>();
  for (const tp of touchpoints) {
    if (!allPartnerDealIds.has(tp.partnerId)) allPartnerDealIds.set(tp.partnerId, new Set());
    allPartnerDealIds.get(tp.partnerId)!.add(tp.dealId);
  }
  const allAvgDays: number[] = [];
  for (const [, dealIds] of allPartnerDealIds) {
    const pWon = wonDeals.filter((d) => dealIds.has(d._id));
    if (pWon.length > 0) {
      allAvgDays.push(
        pWon.reduce((s, d) => s + ((d.closedAt || now) - d.createdAt) / DAY_MS, 0) / pWon.length
      );
    }
  }
  if (allAvgDays.length === 0) {
    return { score: 50, detail: `${Math.round(avgDays)} avg days to close`, avgDays };
  }
  const maxDays = Math.max(...allAvgDays);
  const score = maxDays > 0 ? Math.round(((maxDays - avgDays) / maxDays) * 100) : 50;

  return {
    score: Math.max(0, Math.min(100, score)),
    detail: `${Math.round(avgDays)} avg days to close (${partnerWonDeals.length} deals)`,
    avgDays,
  };
}

function scoreVolume(
  partnerId: string,
  volumeRecords: ScoringVolumeRecord[]
): { score: number; detail: string } {
  const partnerVols = volumeRecords.filter((v) => v.partnerId === partnerId);
  if (partnerVols.length === 0) return { score: 0, detail: "No volume data" };

  const totalUnits = partnerVols.reduce((s, v) => s + v.unitsTotal, 0);
  const totalRevenue = partnerVols.reduce((s, v) => s + v.revenueTotal, 0);
  const allPartnerUnits = new Map<string, number>();
  for (const v of volumeRecords) {
    allPartnerUnits.set(v.partnerId, (allPartnerUnits.get(v.partnerId) || 0) + v.unitsTotal);
  }
  const maxUnits = Math.max(...allPartnerUnits.values(), 1);
  return {
    score: Math.min(100, Math.round((totalUnits / maxUnits) * 100)),
    detail: `${totalUnits.toLocaleString()} units · $${(totalRevenue / 1000).toFixed(0)}k revenue`,
  };
}

function determineTrend(partnerId: string, touchpoints: ScoringTouchpoint[], now: number): "up" | "down" | "stable" {
  const partnerTps = touchpoints.filter((tp) => tp.partnerId === partnerId);
  const last30 = partnerTps.filter((tp) => now - tp.createdAt < 30 * DAY_MS).length;
  const prev30 = partnerTps.filter(
    (tp) => now - tp.createdAt >= 30 * DAY_MS && now - tp.createdAt < 60 * DAY_MS
  ).length;
  if (last30 > prev30 + 1) return "up";
  if (last30 < prev30 - 1) return "down";
  return "stable";
}

function generateHighlights(
  partner: ScoringPartner,
  score: number,
  recommendedTier: string,
  engagement: { recentCount: number; totalCount: number },
  pipelineValue: number,
  totalRevenue: number
): string[] {
  const highlights: string[] = [];
  const current = partner.tier || "bronze";

  if (recommendedTier !== current) {
    const isUp = TIER_ORDER.indexOf(recommendedTier) > TIER_ORDER.indexOf(current);
    highlights.push(
      isUp
        ? `🔺 Ready for tier upgrade: ${current} → ${recommendedTier}`
        : `🔻 Tier at risk: ${current} → ${recommendedTier}`
    );
  }
  if (engagement.recentCount === 0 && engagement.totalCount > 0) {
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
 * Calculate composite scores for all (non-inactive) partners.
 */
export function calculatePartnerScores(
  partners: ScoringPartner[],
  deals: ScoringDeal[],
  touchpoints: ScoringTouchpoint[],
  attributions: ScoringAttribution[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
  options: ScoringOptions = {}
): PartnerScore[] {
  const primaryModel = options.primaryModel ?? DEFAULT_PRIMARY_MODEL;
  const volumeRecords = options.volumeRecords ?? [];
  const now = Date.now();

  const activePartners = partners.filter((p) => p.status !== "inactive");
  const scores: PartnerScore[] = [];

  for (const partner of activePartners) {
    const rev = scoreRevenue(partner._id, attributions, primaryModel);
    const pipe = scorePipeline(partner._id, deals, touchpoints);
    const eng = scoreEngagement(partner._id, touchpoints, now, options.certificationScore);
    const vel = scoreVelocity(partner._id, deals, touchpoints, now);
    const vol = scoreVolume(partner._id, volumeRecords);

    const hasVolume = vol.score > 0;
    const volumeWeight = hasVolume ? 0.1 : 0;
    const scaleFactor = hasVolume ? 0.9 : 1.0;

    const overallScore = Math.round(
      rev.score * config.weights.revenue * scaleFactor +
        pipe.score * config.weights.pipeline * scaleFactor +
        eng.score * config.weights.engagement * scaleFactor +
        vel.score * config.weights.velocity * scaleFactor +
        vol.score * volumeWeight
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
    const tierChange =
      TIER_ORDER.indexOf(recommendedTier) > TIER_ORDER.indexOf(currentTier)
        ? "upgrade"
        : TIER_ORDER.indexOf(recommendedTier) < TIER_ORDER.indexOf(currentTier)
          ? "downgrade"
          : "maintain";

    scores.push({
      partnerId: partner._id,
      partnerName: partner.name,
      currentTier,
      overallScore,
      dimensions: {
        revenue: { score: rev.score, weight: config.weights.revenue * scaleFactor, label: "Revenue Impact", detail: rev.detail },
        pipeline: { score: pipe.score, weight: config.weights.pipeline * scaleFactor, label: "Pipeline Contribution", detail: pipe.detail },
        engagement: { score: eng.score, weight: config.weights.engagement * scaleFactor, label: "Engagement", detail: eng.detail },
        velocity: { score: vel.score, weight: config.weights.velocity * scaleFactor, label: "Deal Velocity", detail: vel.detail },
        ...(hasVolume
          ? { volume: { score: vol.score, weight: volumeWeight, label: "Volume Contribution", detail: vol.detail } }
          : {}),
      },
      recommendedTier,
      tierChange,
      rank: 0,
      trend: determineTrend(partner._id, touchpoints, now),
      highlights: generateHighlights(
        partner,
        overallScore,
        recommendedTier,
        { recentCount: eng.recentCount, totalCount: eng.totalCount },
        pipe.pipelineValue,
        rev.totalRevenue
      ),
    });
  }

  scores.sort((a, b) => b.overallScore - a.overallScore);
  scores.forEach((s, i) => (s.rank = i + 1));
  return scores;
}
