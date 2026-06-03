/**
 * Partner Scoring & Tiering — app-side shim.
 *
 * The pure scoring core now lives in `convex/lib/scoring` so it can be shared by
 * the Convex runtime (queries / the next-moves engine) and the app. This shim
 * wires in the app-only demo signals (certification score + volume rebates) and
 * re-exports everything, so existing callers behave exactly as before.
 */

import type { Partner, Deal, Touchpoint, Attribution } from "./types";
import { PRIMARY_MODEL } from "./types";
import { calculateCertificationScore } from "./certifications-data";
import { demoPartnerVolumes } from "./distributor-demo-data";
import {
  calculatePartnerScores as calculatePartnerScoresCore,
  DEFAULT_SCORING_CONFIG,
  type ScoringConfig,
  type PartnerScore,
  type ScoreDimension,
} from "../convex/lib/scoring";

export {
  DEFAULT_SCORING_CONFIG,
  type ScoringConfig,
  type PartnerScore,
  type ScoreDimension,
};

/**
 * Calculate scores for all partners, injecting the demo certification + volume
 * signals (the behavior the dashboard scoring pages expect).
 */
export function calculatePartnerScores(
  partners: Partner[],
  deals: Deal[],
  touchpoints: Touchpoint[],
  attributions: Attribution[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): PartnerScore[] {
  return calculatePartnerScoresCore(partners, deals, touchpoints, attributions, config, {
    primaryModel: PRIMARY_MODEL,
    certificationScore: calculateCertificationScore,
    volumeRecords: demoPartnerVolumes,
  });
}

/** Tier text color for UI styling. */
export function tierColor(tier: string): string {
  switch (tier) {
    case "platinum": return "#6366f1";
    case "gold": return "#d97706";
    case "silver": return "#6b7280";
    case "bronze": return "#b45309";
    default: return "#6b7280";
  }
}

/** Tier background color. */
export function tierBgColor(tier: string): string {
  switch (tier) {
    case "platinum": return "#eef2ff";
    case "gold": return "#fffbeb";
    case "silver": return "#f3f4f6";
    case "bronze": return "#fef3c7";
    default: return "#f3f4f6";
  }
}

/** Score color based on value. */
export function scoreColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#0284c7";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}
