/**
 * Attribution Calculation Engine
 * 
 * Pure functions for calculating partner attribution across different models.
 * All functions are deterministic and have no side effects (easy to test).
 * 
 * Performance target: < 10ms for 100 touchpoints
 */

import { Id } from "../_generated/dataModel";

// ============================================================================
// Types
// ============================================================================

export type AttributionModel =
  | "equal_split"
  | "first_touch"
  | "last_touch"
  | "time_decay"
  | "role_based";

export interface TouchpointWithPartner {
  partnerId: Id<"partners">;
  type: string;
  weight?: number;
  createdAt: number;
}

export interface AttributionResult {
  partnerId: Id<"partners">;
  percentage: number;
  amount: number;
  commissionAmount: number;
}

// ============================================================================
// Main Calculation Entry Point
// ============================================================================

/**
 * Calculate attribution for a deal based on the selected model
 * 
 * @param model - Attribution model to use
 * @param touchpoints - All touchpoints for the deal
 * @param dealAmount - Total deal value
 * @param partnerCommissionRates - Map of partner ID to commission rate (%)
 * @returns Array of attribution results per partner
 */
export function calculateAttribution(
  model: AttributionModel,
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  partnerCommissionRates: Map<Id<"partners">, number>
): AttributionResult[] {
  if (touchpoints.length === 0) {
    return [];
  }

  switch (model) {
    case "equal_split":
      return calculateEqualSplit(touchpoints, dealAmount, partnerCommissionRates);
    case "first_touch":
      return calculateFirstTouch(touchpoints, dealAmount, partnerCommissionRates);
    case "last_touch":
      return calculateLastTouch(touchpoints, dealAmount, partnerCommissionRates);
    case "time_decay":
      return calculateTimeDecay(touchpoints, dealAmount, partnerCommissionRates);
    case "role_based":
      return calculateRoleBased(touchpoints, dealAmount, partnerCommissionRates);
  }
}

// ============================================================================
// Model 1: Equal Split
// Each partner gets equal credit regardless of touchpoint type or timing
// ============================================================================

export function calculateEqualSplit(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  commissionRates: Map<Id<"partners">, number>
): AttributionResult[] {
  // Group by partner (a partner can have multiple touchpoints)
  const uniquePartners = new Set(touchpoints.map((tp) => tp.partnerId));
  const partnerCount = uniquePartners.size;

  if (partnerCount === 0) return [];

  const percentagePerPartner = 100 / partnerCount;

  return Array.from(uniquePartners).map((partnerId) => {
    const attributedAmount = (percentagePerPartner / 100) * dealAmount;
    const commissionRate = commissionRates.get(partnerId) || 0;
    const commissionAmount = (commissionRate / 100) * attributedAmount;

    return {
      partnerId,
      percentage: percentagePerPartner,
      amount: attributedAmount,
      commissionAmount,
    };
  });
}

// ============================================================================
// Model 2: First Touch
// 100% credit to the first touchpoint
// ============================================================================

export function calculateFirstTouch(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  commissionRates: Map<Id<"partners">, number>
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  // Sort by createdAt ascending (earliest first)
  const sorted = [...touchpoints].sort((a, b) => a.createdAt - b.createdAt);
  const firstTouchpoint = sorted[0];

  const commissionRate = commissionRates.get(firstTouchpoint.partnerId) || 0;
  const commissionAmount = (commissionRate / 100) * dealAmount;

  return [
    {
      partnerId: firstTouchpoint.partnerId,
      percentage: 100,
      amount: dealAmount,
      commissionAmount,
    },
  ];
}

// ============================================================================
// Model 3: Last Touch
// 100% credit to the last touchpoint
// ============================================================================

export function calculateLastTouch(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  commissionRates: Map<Id<"partners">, number>
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  // Sort by createdAt descending (latest first)
  const sorted = [...touchpoints].sort((a, b) => b.createdAt - a.createdAt);
  const lastTouchpoint = sorted[0];

  const commissionRate = commissionRates.get(lastTouchpoint.partnerId) || 0;
  const commissionAmount = (commissionRate / 100) * dealAmount;

  return [
    {
      partnerId: lastTouchpoint.partnerId,
      percentage: 100,
      amount: dealAmount,
      commissionAmount,
    },
  ];
}

// ============================================================================
// Model 4: Time Decay
// More recent touchpoints get exponentially higher weight
// Uses exponential decay: weight = e^(-λ * time_since_touchpoint)
// ============================================================================

export function calculateTimeDecay(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  commissionRates: Map<Id<"partners">, number>
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  const now = Date.now();

  // Decay constant: half-life of 7 days
  // This means a touchpoint from 7 days ago has half the weight of today
  const DECAY_HALF_LIFE_DAYS = 7;
  const DECAY_CONSTANT = Math.log(2) / (DECAY_HALF_LIFE_DAYS * 24 * 60 * 60 * 1000);

  // Calculate weight for each touchpoint (more recent = higher weight)
  const weights = touchpoints.map((tp) => ({
    partnerId: tp.partnerId,
    weight: Math.exp(-DECAY_CONSTANT * (now - tp.createdAt)),
  }));

  // Group by partner and sum weights
  const partnerWeights = new Map<Id<"partners">, number>();
  weights.forEach(({ partnerId, weight }) => {
    partnerWeights.set(partnerId, (partnerWeights.get(partnerId) || 0) + weight);
  });

  const totalWeight = Array.from(partnerWeights.values()).reduce((a, b) => a + b, 0);

  if (totalWeight === 0) return [];

  // Calculate attribution per partner
  return Array.from(partnerWeights.entries()).map(([partnerId, weight]) => {
    const percentage = (weight / totalWeight) * 100;
    const attributedAmount = (percentage / 100) * dealAmount;
    const commissionRate = commissionRates.get(partnerId) || 0;
    const commissionAmount = (commissionRate / 100) * attributedAmount;

    return {
      partnerId,
      percentage,
      amount: attributedAmount,
      commissionAmount,
    };
  });
}

// ============================================================================
// Model 5: Role-Based
// Different touchpoint types have different weights
// Custom weights can be assigned per touchpoint, or defaults are used
// ============================================================================

// Default weights for touchpoint types (customizable)
export const DEFAULT_ROLE_WEIGHTS: Record<string, number> = {
  referral: 40,
  introduction: 35,
  demo: 25,
  proposal: 20,
  content_share: 15,
  negotiation: 10,
};

export function calculateRoleBased(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  commissionRates: Map<Id<"partners">, number>
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  // Use custom weight if provided, otherwise use type weight
  const weights = touchpoints.map((tp) => ({
    partnerId: tp.partnerId,
    weight: tp.weight ?? DEFAULT_ROLE_WEIGHTS[tp.type] ?? 10,
  }));

  // Group by partner and sum weights
  const partnerWeights = new Map<Id<"partners">, number>();
  weights.forEach(({ partnerId, weight }) => {
    partnerWeights.set(partnerId, (partnerWeights.get(partnerId) || 0) + weight);
  });

  const totalWeight = Array.from(partnerWeights.values()).reduce((a, b) => a + b, 0);

  if (totalWeight === 0) return [];

  // Calculate attribution per partner
  return Array.from(partnerWeights.entries()).map(([partnerId, weight]) => {
    const percentage = (weight / totalWeight) * 100;
    const attributedAmount = (percentage / 100) * dealAmount;
    const commissionRate = commissionRates.get(partnerId) || 0;
    const commissionAmount = (commissionRate / 100) * attributedAmount;

    return {
      partnerId,
      percentage,
      amount: attributedAmount,
      commissionAmount,
    };
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Round percentage to 2 decimal places
 */
export function roundPercentage(percentage: number): number {
  return Math.round(percentage * 100) / 100;
}

/**
 * Round amount to 2 decimal places (cents)
 */
export function roundAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Normalize attribution results to ensure percentages sum to exactly 100%
 * (handles floating point rounding errors)
 */
export function normalizeAttributions(results: AttributionResult[]): AttributionResult[] {
  if (results.length === 0) return results;

  const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
  const adjustment = 100 - totalPercentage;

  // Add adjustment to the largest attribution to maintain fairness
  const sorted = [...results].sort((a, b) => b.percentage - a.percentage);
  sorted[0].percentage += adjustment;

  return sorted;
}
