/**
 * Attribution calculation algorithms
 * 
 * All functions are pure (no side effects) for easy testing
 */

import { Id } from "../_generated/dataModel"

export type Touchpoint = {
  _id: Id<"touchpoints">
  partnerId: Id<"partners">
  createdAt: number
  type: string
  weight?: number
}

export type Attribution = {
  partnerId: Id<"partners">
  percentage: number
}

/**
 * Equal Split Attribution
 * Each partner gets an equal share
 * 
 * Example: 3 partners → 33.33% each
 */
export function calculateEqualSplit(touchpoints: Touchpoint[]): Attribution[] {
  if (touchpoints.length === 0) return []

  // Get unique partners
  const uniquePartners = [...new Set(touchpoints.map((tp) => tp.partnerId))]
  const percentage = 100 / uniquePartners.length

  return uniquePartners.map((partnerId) => ({
    partnerId,
    percentage: Math.round(percentage * 100) / 100, // Round to 2 decimals
  }))
}

/**
 * First Touch Attribution
 * 100% credit to the partner with the earliest touchpoint
 * 
 * Good for: Awareness campaigns
 */
export function calculateFirstTouch(touchpoints: Touchpoint[]): Attribution[] {
  if (touchpoints.length === 0) return []

  // Find earliest touchpoint
  const firstTouch = touchpoints.reduce((earliest, tp) =>
    tp.createdAt < earliest.createdAt ? tp : earliest
  )

  return [
    {
      partnerId: firstTouch.partnerId,
      percentage: 100,
    },
  ]
}

/**
 * Last Touch Attribution
 * 100% credit to the partner with the latest touchpoint
 * 
 * Good for: Conversion tracking
 */
export function calculateLastTouch(touchpoints: Touchpoint[]): Attribution[] {
  if (touchpoints.length === 0) return []

  // Find latest touchpoint
  const lastTouch = touchpoints.reduce((latest, tp) =>
    tp.createdAt > latest.createdAt ? tp : latest
  )

  return [
    {
      partnerId: lastTouch.partnerId,
      percentage: 100,
    },
  ]
}

/**
 * Time Decay Attribution
 * More recent touchpoints get higher weight using exponential decay
 * 
 * Formula: weight = e^(-lambda * days_ago)
 * 
 * @param lambda - Decay rate (default: 0.1, higher = faster decay)
 * 
 * Good for: Balanced view with recency bias
 */
export function calculateTimeDecay(
  touchpoints: Touchpoint[],
  lambda: number = 0.1
): Attribution[] {
  if (touchpoints.length === 0) return []

  const now = Date.now()

  // Calculate weights with exponential decay
  const weights = touchpoints.map((tp) => {
    const daysAgo = (now - tp.createdAt) / (1000 * 60 * 60 * 24)
    return {
      partnerId: tp.partnerId,
      weight: Math.exp(-lambda * daysAgo),
    }
  })

  // Group by partner and sum weights
  const partnerWeights: Record<string, number> = {}
  for (const { partnerId, weight } of weights) {
    partnerWeights[partnerId] = (partnerWeights[partnerId] || 0) + weight
  }

  // Calculate total weight
  const totalWeight = Object.values(partnerWeights).reduce((a, b) => a + b, 0)

  // Convert to percentages
  return Object.entries(partnerWeights).map(([partnerId, weight]) => ({
    partnerId: partnerId as Id<"partners">,
    percentage: Math.round(((weight / totalWeight) * 100 * 100)) / 100,
  }))
}

/**
 * Role-Based Attribution
 * Different touchpoint types have different weights
 * 
 * Default weights:
 * - Referral: 30%
 * - Demo: 25%
 * - Proposal: 25%
 * - Negotiation: 20%
 * - Introduction: 10%
 * - Content Share: 5%
 * 
 * Good for: Complex B2B sales with multiple touchpoints
 */
export function calculateRoleBased(
  touchpoints: Touchpoint[],
  customWeights?: Record<string, number>
): Attribution[] {
  if (touchpoints.length === 0) return []

  // Default weights by touchpoint type
  const defaultWeights: Record<string, number> = {
    referral: 30,
    demo: 25,
    proposal: 25,
    negotiation: 20,
    introduction: 10,
    content_share: 5,
  }

  const weights = customWeights || defaultWeights

  // Calculate weighted scores
  const partnerScores: Record<string, number> = {}
  
  for (const tp of touchpoints) {
    const weight = tp.weight ?? weights[tp.type] ?? 10 // Fallback to 10
    partnerScores[tp.partnerId] = (partnerScores[tp.partnerId] || 0) + weight
  }

  // Calculate total score
  const totalScore = Object.values(partnerScores).reduce((a, b) => a + b, 0)

  // Convert to percentages
  return Object.entries(partnerScores).map(([partnerId, score]) => ({
    partnerId: partnerId as Id<"partners">,
    percentage: Math.round(((score / totalScore) * 100 * 100)) / 100,
  }))
}

/**
 * Main attribution calculation function
 * Routes to the appropriate algorithm
 */
export function calculateAttribution(
  touchpoints: Touchpoint[],
  model: "equal_split" | "first_touch" | "last_touch" | "time_decay" | "role_based",
  options?: {
    timeDecayLambda?: number
    roleBasedWeights?: Record<string, number>
  }
): Attribution[] {
  switch (model) {
    case "equal_split":
      return calculateEqualSplit(touchpoints)
    
    case "first_touch":
      return calculateFirstTouch(touchpoints)
    
    case "last_touch":
      return calculateLastTouch(touchpoints)
    
    case "time_decay":
      return calculateTimeDecay(touchpoints, options?.timeDecayLambda)
    
    case "role_based":
      return calculateRoleBased(touchpoints, options?.roleBasedWeights)
    
    default:
      throw new Error(`Unknown attribution model: ${model}`)
  }
}

/**
 * Get human-readable description of attribution model
 */
export function getModelDescription(model: string): string {
  const descriptions: Record<string, string> = {
    equal_split: "Each partner gets an equal share of credit",
    first_touch: "100% credit to the first partner who touched the deal",
    last_touch: "100% credit to the last partner who touched the deal",
    time_decay: "More recent touchpoints get higher weight (exponential decay)",
    role_based: "Different touchpoint types have different weights",
  }

  return descriptions[model] || "Unknown model"
}
