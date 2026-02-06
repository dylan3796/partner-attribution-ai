/**
 * Attribution Models - Pure Functions for Partner Credit Calculation
 * 
 * All functions are pure (no side effects) for easy testing and verification.
 * Performance target: < 10ms for 100 touchpoints
 */

// ============================================================================
// Types
// ============================================================================

export type AttributionModel =
  | "equal_split"
  | "first_touch"
  | "last_touch"
  | "time_decay"
  | "role_based";

export interface TouchpointInput {
  partnerId: string;
  partnerName: string;
  commissionRate: number; // 0-100 percentage
  type: string;
  createdAt: number;
  weight?: number; // Optional custom weight for role-based
}

export interface AttributionResult {
  partnerId: string;
  partnerName: string;
  percentage: number; // 0-100
  amount: number; // Attributed deal value
  commissionAmount: number; // Commission to pay partner
}

// ============================================================================
// Model 1: Equal Split
// Each unique partner gets an equal share of credit
// 
// Example: Deal $10,000 with 3 partners → $3,333.33 each
// ============================================================================

export function calculateEqualSplit(
  touchpoints: TouchpointInput[],
  dealAmount: number
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  // Group touchpoints by partner (one partner can have multiple touchpoints)
  const partnerMap = new Map<string, TouchpointInput>();
  for (const tp of touchpoints) {
    if (!partnerMap.has(tp.partnerId)) {
      partnerMap.set(tp.partnerId, tp);
    }
  }

  const partnerCount = partnerMap.size;
  const percentagePerPartner = 100 / partnerCount;
  const amountPerPartner = dealAmount / partnerCount;

  return Array.from(partnerMap.values()).map((tp) => ({
    partnerId: tp.partnerId,
    partnerName: tp.partnerName,
    percentage: roundToTwoDecimals(percentagePerPartner),
    amount: roundToTwoDecimals(amountPerPartner),
    commissionAmount: roundToTwoDecimals(amountPerPartner * (tp.commissionRate / 100)),
  }));
}

// ============================================================================
// Model 2: First Touch
// 100% credit to the partner with the earliest touchpoint
// 
// Best for: Awareness campaigns, lead generation attribution
// ============================================================================

export function calculateFirstTouch(
  touchpoints: TouchpointInput[],
  dealAmount: number
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  // Sort by createdAt ascending (earliest first)
  const sorted = [...touchpoints].sort((a, b) => a.createdAt - b.createdAt);
  const firstTouch = sorted[0];

  return [{
    partnerId: firstTouch.partnerId,
    partnerName: firstTouch.partnerName,
    percentage: 100,
    amount: roundToTwoDecimals(dealAmount),
    commissionAmount: roundToTwoDecimals(dealAmount * (firstTouch.commissionRate / 100)),
  }];
}

// ============================================================================
// Model 3: Last Touch
// 100% credit to the partner with the most recent touchpoint
// 
// Best for: Conversion tracking, closer attribution
// ============================================================================

export function calculateLastTouch(
  touchpoints: TouchpointInput[],
  dealAmount: number
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  // Sort by createdAt descending (latest first)
  const sorted = [...touchpoints].sort((a, b) => b.createdAt - a.createdAt);
  const lastTouch = sorted[0];

  return [{
    partnerId: lastTouch.partnerId,
    partnerName: lastTouch.partnerName,
    percentage: 100,
    amount: roundToTwoDecimals(dealAmount),
    commissionAmount: roundToTwoDecimals(dealAmount * (lastTouch.commissionRate / 100)),
  }];
}

// ============================================================================
// Model 4: Time Decay
// More recent touchpoints get exponentially higher weight
// 
// Formula: weight = e^(-λ * days_ago)
// Default half-life: 7 days (touchpoint from 7 days ago has half the weight)
// 
// Best for: Balanced view with recency bias
// ============================================================================

export function calculateTimeDecay(
  touchpoints: TouchpointInput[],
  dealAmount: number,
  halfLifeDays: number = 7
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  
  // Calculate decay constant (λ = ln(2) / half-life)
  const lambda = Math.log(2) / (halfLifeDays * msPerDay);

  // Calculate weight for each touchpoint
  const touchpointWeights = touchpoints.map((tp) => {
    const ageMs = now - tp.createdAt;
    const weight = Math.exp(-lambda * ageMs);
    return { ...tp, weight };
  });

  // Group by partner and sum weights
  const partnerData = new Map<string, { tp: TouchpointInput; totalWeight: number }>();
  
  for (const tw of touchpointWeights) {
    const existing = partnerData.get(tw.partnerId);
    if (existing) {
      existing.totalWeight += tw.weight;
    } else {
      partnerData.set(tw.partnerId, { tp: tw, totalWeight: tw.weight });
    }
  }

  // Calculate total weight across all partners
  const totalWeight = Array.from(partnerData.values())
    .reduce((sum, pd) => sum + pd.totalWeight, 0);

  if (totalWeight === 0) return [];

  // Calculate attribution per partner
  return Array.from(partnerData.values()).map(({ tp, totalWeight: partnerWeight }) => {
    const percentage = (partnerWeight / totalWeight) * 100;
    const amount = (percentage / 100) * dealAmount;
    
    return {
      partnerId: tp.partnerId,
      partnerName: tp.partnerName,
      percentage: roundToTwoDecimals(percentage),
      amount: roundToTwoDecimals(amount),
      commissionAmount: roundToTwoDecimals(amount * (tp.commissionRate / 100)),
    };
  });
}

// ============================================================================
// Model 5: Role-Based
// Different touchpoint types have different weights
// 
// Default weights (customizable):
// - referral: 40 (high value - brought the lead)
// - introduction: 35 (warm intro)
// - demo: 25 (showed product)
// - proposal: 20 (helped close)
// - content_share: 15 (awareness)
// - negotiation: 10 (late-stage assist)
// 
// Best for: Complex B2B sales with specialized partner roles
// ============================================================================

export const DEFAULT_ROLE_WEIGHTS: Record<string, number> = {
  referral: 40,
  introduction: 35,
  demo: 25,
  proposal: 20,
  content_share: 15,
  negotiation: 10,
};

export function calculateRoleBased(
  touchpoints: TouchpointInput[],
  dealAmount: number,
  roleWeights: Record<string, number> = DEFAULT_ROLE_WEIGHTS
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  // Calculate weight for each touchpoint (custom weight overrides role weight)
  const touchpointWeights = touchpoints.map((tp) => {
    const weight = tp.weight ?? roleWeights[tp.type] ?? 10; // Default weight if type unknown
    return { ...tp, weight };
  });

  // Group by partner and sum weights
  const partnerData = new Map<string, { tp: TouchpointInput; totalWeight: number }>();
  
  for (const tw of touchpointWeights) {
    const existing = partnerData.get(tw.partnerId);
    if (existing) {
      existing.totalWeight += tw.weight;
    } else {
      partnerData.set(tw.partnerId, { tp: tw, totalWeight: tw.weight });
    }
  }

  // Calculate total weight across all partners
  const totalWeight = Array.from(partnerData.values())
    .reduce((sum, pd) => sum + pd.totalWeight, 0);

  if (totalWeight === 0) return [];

  // Calculate attribution per partner
  return Array.from(partnerData.values()).map(({ tp, totalWeight: partnerWeight }) => {
    const percentage = (partnerWeight / totalWeight) * 100;
    const amount = (percentage / 100) * dealAmount;
    
    return {
      partnerId: tp.partnerId,
      partnerName: tp.partnerName,
      percentage: roundToTwoDecimals(percentage),
      amount: roundToTwoDecimals(amount),
      commissionAmount: roundToTwoDecimals(amount * (tp.commissionRate / 100)),
    };
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Round a number to 2 decimal places
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Normalize attribution results to ensure percentages sum to exactly 100%
 * (handles floating point rounding errors)
 */
export function normalizeAttributions(results: AttributionResult[]): AttributionResult[] {
  if (results.length === 0) return results;

  const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
  
  // If already 100%, no adjustment needed
  if (Math.abs(totalPercentage - 100) < 0.01) return results;

  const adjustment = 100 - totalPercentage;

  // Add adjustment to the largest attribution to maintain fairness
  const sorted = [...results].sort((a, b) => b.percentage - a.percentage);
  sorted[0].percentage = roundToTwoDecimals(sorted[0].percentage + adjustment);

  return sorted;
}

/**
 * Get human-readable description of an attribution model
 */
export function getModelDescription(model: AttributionModel): string {
  const descriptions: Record<AttributionModel, string> = {
    equal_split: "Each partner gets an equal share of credit",
    first_touch: "100% credit to the first partner who touched the deal",
    last_touch: "100% credit to the last partner who touched the deal",
    time_decay: "More recent touchpoints get exponentially higher weight",
    role_based: "Different touchpoint types have different weights based on their role",
  };

  return descriptions[model];
}

/**
 * Get all available attribution models
 */
export function getAllModels(): AttributionModel[] {
  return ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"];
}
