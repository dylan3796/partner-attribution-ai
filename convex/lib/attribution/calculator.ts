/**
 * Attribution Calculator — program-aware orchestrator.
 *
 * For a won deal it: resolves the deal's PROGRAM (and thus the one model + config
 * to run), fetches + enriches touchpoints (deriving each partner role), runs the
 * model via runModel, and writes the resulting ledger rows — each tagged with the
 * programId and a human-readable `reason`.
 *
 * A deal runs exactly ONE model (the program's selected model), not all of them.
 */

import { MutationCtx } from "../../_generated/server";
import { Id, Doc } from "../../_generated/dataModel";
import {
  runModel,
  parseModelConfig,
  mergeConfig,
  DEFAULT_ROLE_MAP,
  deriveRole,
} from "@covant/engine";
import type {
  AttributionModel,
  AttributionRole,
  AttributionTarget,
  LedgerEntry,
  ModelConfig,
  TouchpointInput,
} from "@covant/engine";

// ============================================================================
// Types
// ============================================================================

export interface CalculationOptions {
  /** Delete the deal's existing attributions before writing (default true). */
  replaceExisting?: boolean;
  /** Ad-hoc config override merged over the program's config (e.g. previews). */
  configOverride?: ModelConfig;
}

export interface CalculationResult {
  dealId: Id<"deals">;
  programId: Id<"programs"> | null;
  model: AttributionModel;
  dealAmount: number;
  ledger: LedgerEntry[];
  totalAttributionsCreated: number;
  calculationTimeMs: number;
}

// ============================================================================
// Program resolution
// ============================================================================

/**
 * Resolve which program a deal belongs to: its explicit programId, else the
 * org's default program (isDefault), else the org's first program. Returns null
 * if the org has no programs configured.
 */
async function resolveProgram(
  ctx: MutationCtx,
  deal: Doc<"deals">,
  organizationId: Id<"organizations">
): Promise<Doc<"programs"> | null> {
  if (deal.programId) {
    const explicit = await ctx.db.get(deal.programId);
    if (explicit) return explicit;
  }
  const programs = await ctx.db
    .query("programs")
    .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
    .collect();
  if (programs.length === 0) return null;
  return programs.find((p) => p.isDefault) ?? programs[0];
}

// ============================================================================
// Main calculator
// ============================================================================

export async function calculateDealAttribution(
  ctx: MutationCtx,
  dealId: Id<"deals">,
  organizationId: Id<"organizations">,
  options: CalculationOptions = {}
): Promise<CalculationResult> {
  const startTime = Date.now();
  const replaceExisting = options.replaceExisting ?? true;

  // 1. Deal
  const deal = await ctx.db.get(dealId);
  if (!deal) throw new Error("Deal not found");
  if (deal.organizationId !== organizationId) {
    throw new Error("Unauthorized: Deal belongs to different organization");
  }
  if (deal.status !== "won") {
    throw new Error("Can only calculate attribution for won deals");
  }

  // 2. Program (selects the model + config)
  const program = await resolveProgram(ctx, deal, organizationId);
  if (!program) {
    throw new Error(
      "No attribution program configured for this organization. Create a program first."
    );
  }
  const model = program.selectedModel as AttributionModel;
  const config = mergeConfig(
    parseModelConfig(program.modelConfig),
    options.configOverride ?? {}
  );
  const effectiveRoleMap: Record<string, AttributionRole> = {
    ...DEFAULT_ROLE_MAP,
    ...(config.roleMap ?? {}),
  };

  // 3. Touchpoints
  const touchpoints = await ctx.db
    .query("touchpoints")
    .withIndex("by_deal", (q) => q.eq("dealId", dealId))
    .collect();
  if (touchpoints.length === 0) {
    throw new Error("Cannot calculate attribution: Deal has no touchpoints");
  }

  // 4. Partners
  const partnerIds = [...new Set(touchpoints.map((tp) => tp.partnerId))];
  const partnerMap = new Map<string, Doc<"partners">>();
  for (const id of partnerIds) {
    const partner = await ctx.db.get(id);
    if (partner) partnerMap.set(partner._id, partner);
  }

  // 5. Commission rules — program-specific first, then org-wide (programId unset).
  const allRules = await ctx.db
    .query("commissionRules")
    .withIndex("by_org_priority", (q) => q.eq("organizationId", organizationId))
    .collect();
  const scopedRules = allRules
    .filter((r) => !r.programId || r.programId === program._id)
    .sort((a, b) => {
      // program-specific rules win ties against org-wide rules
      const pa = r2num(a.programId, program._id);
      const pb = r2num(b.programId, program._id);
      return a.priority - b.priority || pa - pb;
    });

  // 6. Enrich touchpoints (resolve commission rate + derive role)
  const enriched: TouchpointInput[] = touchpoints.map((tp) => {
    const partner = partnerMap.get(tp.partnerId);
    if (!partner) throw new Error(`Partner ${tp.partnerId} not found`);

    let commissionRate = partner.commissionRate <= 1
      ? partner.commissionRate * 100
      : partner.commissionRate; // partners store 0.0-1.0; models want 0-100
    for (const rule of scopedRules) {
      if (rule.partnerType && rule.partnerType !== partner.type) continue;
      if (rule.partnerTier && rule.partnerTier !== (partner.tier ?? "bronze")) continue;
      if (rule.productLine && rule.productLine !== deal.productName) continue;
      if (rule.minDealSize && deal.amount < rule.minDealSize) continue;
      commissionRate = rule.rate * 100; // rules store 0.0-1.0
      break;
    }

    return {
      partnerId: tp.partnerId,
      partnerName: partner.name,
      partnerType: partner.type,
      commissionRate,
      type: tp.type,
      role: deriveRole(tp.type, effectiveRoleMap),
      createdAt: tp.createdAt,
      weight: tp.weight,
    };
  });

  // 7. Run the program's model
  const target: AttributionTarget = {
    id: deal._id,
    amount: deal.amount,
    productName: deal.productName,
    registeredBy: deal.registeredBy,
    closedAt: deal.closedAt,
  };
  const ledger = runModel(model, target, enriched, config);

  // 8. Replace existing attributions for this deal (the deal has one program)
  if (replaceExisting) {
    const existing = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .collect();
    for (const attr of existing) await ctx.db.delete(attr._id);
  }

  // 9. Write ledger rows
  let created = 0;
  for (const entry of ledger) {
    await ctx.db.insert("attributions", {
      organizationId,
      dealId,
      partnerId: entry.partnerId as Id<"partners">,
      programId: program._id,
      model,
      percentage: entry.percentage,
      amount: entry.amount,
      commissionAmount: entry.commissionAmount,
      reason: entry.reason,
      calculatedAt: Date.now(),
    });
    created++;
  }

  return {
    dealId,
    programId: program._id,
    model,
    dealAmount: deal.amount,
    ledger,
    totalAttributionsCreated: created,
    calculationTimeMs: Date.now() - startTime,
  };
}

/** Tiebreak helper: program-specific rule (0) sorts before org-wide rule (1). */
function r2num(ruleProgramId: unknown, programId: Id<"programs">): number {
  return ruleProgramId === programId ? 0 : 1;
}

/**
 * Calculate attribution for all won deals that don't have attributions yet.
 */
export async function calculateMissingAttributions(
  ctx: MutationCtx,
  organizationId: Id<"organizations">,
  options: CalculationOptions = {}
): Promise<{ dealsProcessed: number; attributionsCreated: number }> {
  const wonDeals = await ctx.db
    .query("deals")
    .withIndex("by_org_and_status", (q) =>
      q.eq("organizationId", organizationId).eq("status", "won")
    )
    .collect();

  let dealsProcessed = 0;
  let attributionsCreated = 0;

  for (const deal of wonDeals) {
    const existing = await ctx.db
      .query("attributions")
      .withIndex("by_deal", (q) => q.eq("dealId", deal._id))
      .first();
    if (existing) continue;
    try {
      const result = await calculateDealAttribution(ctx, deal._id, organizationId, {
        ...options,
        replaceExisting: false,
      });
      dealsProcessed++;
      attributionsCreated += result.totalAttributionsCreated;
    } catch (error) {
      console.error(`Failed to calculate attribution for deal ${deal._id}:`, error);
    }
  }

  return { dealsProcessed, attributionsCreated };
}
