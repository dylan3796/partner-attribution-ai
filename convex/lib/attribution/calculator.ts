/**
 * Attribution Calculator - Main Orchestrator
 * 
 * This module orchestrates the attribution calculation process:
 * 1. Fetches deal and touchpoints from database
 * 2. Enriches touchpoints with partner data
 * 3. Runs the selected attribution model(s)
 * 4. Stores results in the attributions table
 */

import { MutationCtx } from "../../_generated/server";
import { Id, Doc } from "../../_generated/dataModel";
import {
  calculateEqualSplit,
  calculateFirstTouch,
  calculateLastTouch,
  calculateTimeDecay,
  calculateRoleBased,
  normalizeAttributions,
  getAllModels,
  type AttributionModel,
  type TouchpointInput,
  type AttributionResult,
} from "./models";

// ============================================================================
// Types
// ============================================================================

export interface CalculationOptions {
  /** Which models to calculate (defaults to all) */
  models?: AttributionModel[];
  /** Half-life in days for time decay (defaults to 7) */
  timeDecayHalfLife?: number;
  /** Custom weights for role-based attribution */
  roleWeights?: Record<string, number>;
  /** Whether to delete existing attributions first */
  replaceExisting?: boolean;
}

export interface CalculationResult {
  dealId: Id<"deals">;
  dealAmount: number;
  modelsCalculated: AttributionModel[];
  attributionsByModel: Record<string, AttributionResult[]>;
  totalAttributionsCreated: number;
  calculationTimeMs: number;
}

// ============================================================================
// Main Calculator Function
// ============================================================================

/**
 * Calculate attribution for a won deal
 * 
 * @param ctx - Convex mutation context
 * @param dealId - The deal to calculate attribution for
 * @param organizationId - Organization that owns the deal
 * @param options - Calculation options
 * @returns Calculation result with all attributions
 */
export async function calculateDealAttribution(
  ctx: MutationCtx,
  dealId: Id<"deals">,
  organizationId: Id<"organizations">,
  options: CalculationOptions = {}
): Promise<CalculationResult> {
  const startTime = Date.now();
  
  // Default options
  const models = options.models ?? getAllModels();
  const replaceExisting = options.replaceExisting ?? true;
  
  // 1. Fetch deal
  const deal = await ctx.db.get(dealId);
  if (!deal) {
    throw new Error("Deal not found");
  }
  
  if (deal.organizationId !== organizationId) {
    throw new Error("Unauthorized: Deal belongs to different organization");
  }
  
  if (deal.status !== "won") {
    throw new Error("Can only calculate attribution for won deals");
  }

  // 2. Fetch touchpoints for this deal
  const touchpoints = await ctx.db
    .query("touchpoints")
    .withIndex("by_deal", (q) => q.eq("dealId", dealId))
    .collect();

  if (touchpoints.length === 0) {
    throw new Error("Cannot calculate attribution: Deal has no touchpoints");
  }

  // 3. Fetch partner data for all involved partners
  const partnerIds = [...new Set(touchpoints.map((tp) => tp.partnerId))];
  const partners = await Promise.all(partnerIds.map((id) => ctx.db.get(id)));
  const partnerMap = new Map<string, Doc<"partners">>();
  
  for (const partner of partners) {
    if (partner) {
      partnerMap.set(partner._id, partner);
    }
  }

  // 4. Enrich touchpoints with partner data
  const enrichedTouchpoints: TouchpointInput[] = touchpoints.map((tp) => {
    const partner = partnerMap.get(tp.partnerId);
    if (!partner) {
      throw new Error(`Partner ${tp.partnerId} not found`);
    }
    
    return {
      partnerId: tp.partnerId,
      partnerName: partner.name,
      commissionRate: partner.commissionRate,
      type: tp.type,
      createdAt: tp.createdAt,
      weight: tp.weight,
    };
  });

  // 5. Delete existing attributions if requested
  if (replaceExisting) {
    const existingAttributions = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .collect();

    for (const attr of existingAttributions) {
      if (models.includes(attr.model as AttributionModel)) {
        await ctx.db.delete(attr._id);
      }
    }
  }

  // 6. Calculate attribution for each model
  const attributionsByModel: Record<string, AttributionResult[]> = {};
  let totalAttributionsCreated = 0;

  for (const model of models) {
    let results: AttributionResult[];

    switch (model) {
      case "equal_split":
        results = calculateEqualSplit(enrichedTouchpoints, deal.amount);
        break;
      case "first_touch":
        results = calculateFirstTouch(enrichedTouchpoints, deal.amount);
        break;
      case "last_touch":
        results = calculateLastTouch(enrichedTouchpoints, deal.amount);
        break;
      case "time_decay":
        results = calculateTimeDecay(
          enrichedTouchpoints,
          deal.amount,
          options.timeDecayHalfLife
        );
        break;
      case "role_based":
        results = calculateRoleBased(
          enrichedTouchpoints,
          deal.amount,
          options.roleWeights
        );
        break;
      default:
        throw new Error(`Unknown attribution model: ${model}`);
    }

    // Normalize to ensure percentages sum to 100%
    results = normalizeAttributions(results);
    attributionsByModel[model] = results;

    // 7. Store attribution results
    for (const result of results) {
      await ctx.db.insert("attributions", {
        organizationId,
        dealId,
        partnerId: result.partnerId as Id<"partners">,
        model,
        percentage: result.percentage,
        amount: result.amount,
        commissionAmount: result.commissionAmount,
        calculatedAt: Date.now(),
      });
      
      totalAttributionsCreated++;
    }
  }

  const calculationTimeMs = Date.now() - startTime;

  return {
    dealId,
    dealAmount: deal.amount,
    modelsCalculated: models,
    attributionsByModel,
    totalAttributionsCreated,
    calculationTimeMs,
  };
}

/**
 * Calculate attribution for all won deals that don't have attributions yet
 * (Batch processing for backfill or scheduled jobs)
 */
export async function calculateMissingAttributions(
  ctx: MutationCtx,
  organizationId: Id<"organizations">,
  options: CalculationOptions = {}
): Promise<{ dealsProcessed: number; attributionsCreated: number }> {
  // Get all won deals
  const wonDeals = await ctx.db
    .query("deals")
    .withIndex("by_org_and_status", (q) => 
      q.eq("organizationId", organizationId).eq("status", "won")
    )
    .collect();

  let dealsProcessed = 0;
  let attributionsCreated = 0;

  for (const deal of wonDeals) {
    // Check if attributions already exist
    const existingAttr = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", deal._id))
      .first();

    if (!existingAttr) {
      try {
        const result = await calculateDealAttribution(
          ctx,
          deal._id,
          organizationId,
          { ...options, replaceExisting: false }
        );
        
        dealsProcessed++;
        attributionsCreated += result.totalAttributionsCreated;
      } catch (error) {
        // Log error but continue with other deals
        console.error(`Failed to calculate attribution for deal ${deal._id}:`, error);
      }
    }
  }

  return { dealsProcessed, attributionsCreated };
}
