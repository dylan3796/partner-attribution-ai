/**
 * Attribution model registry + runner.
 *
 * The registry is the single lookup for the 5 bounded models, and runModel() is
 * the single execution path used by both the database calculator and the unit
 * tests: it merges per-model defaults with caller config, runs the pure model,
 * then finalizes the ledger (exact 100% total + coherent dollars).
 */

import type {
  AttributionModel,
  AttributionModelImpl,
  AttributionTarget,
  LedgerEntry,
  ModelConfig,
  TouchpointInput,
} from "./types";
import {
  finalizeLedger,
  firstTouchSourcer,
  implementationCredit,
  marketplaceCosellHybrid,
  roleWeighted,
  splitEqually,
} from "./models";

// ============================================================================
// Registry
// ============================================================================

export const ATTRIBUTION_MODELS: Record<AttributionModel, AttributionModelImpl> = {
  first_touch_sourcer: firstTouchSourcer,
  split_equally: splitEqually,
  role_weighted: roleWeighted,
  implementation_credit: implementationCredit,
  marketplace_cosell_hybrid: marketplaceCosellHybrid,
};

export function getModel(name: AttributionModel): AttributionModelImpl {
  const model = ATTRIBUTION_MODELS[name];
  if (!model) throw new Error(`Unknown attribution model: ${name}`);
  return model;
}

export function getAllModels(): AttributionModel[] {
  return Object.keys(ATTRIBUTION_MODELS) as AttributionModel[];
}

export function isAttributionModel(value: string): value is AttributionModel {
  return value in ATTRIBUTION_MODELS;
}

// ============================================================================
// Config merge
// ============================================================================

/**
 * Merge a model's defaultConfig with caller-supplied config. Map-shaped fields
 * (roleWeights, roleMap, cosellWeights) are merged key-by-key so a caller can
 * override a single weight; everything else is a plain override.
 */
/**
 * Parse a program's modelConfig (stored as a JSON string). Returns {} for
 * missing/invalid JSON so a program always runs with its model defaults.
 */
export function parseModelConfig(json?: string | null): ModelConfig {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? (parsed as ModelConfig) : {};
  } catch {
    return {};
  }
}

export function mergeConfig(base: ModelConfig, override: ModelConfig): ModelConfig {
  return {
    ...base,
    ...override,
    roleWeights:
      base.roleWeights || override.roleWeights
        ? { ...base.roleWeights, ...override.roleWeights }
        : undefined,
    roleMap:
      base.roleMap || override.roleMap
        ? { ...base.roleMap, ...override.roleMap }
        : undefined,
    cosellWeights: override.cosellWeights ?? base.cosellWeights,
  };
}

// ============================================================================
// Runner
// ============================================================================

/**
 * Apply a model to a deal's touchpoints and return the finalized ledger.
 * Touchpoints must already carry a derived `role` (the calculator sets this;
 * tests build it inline).
 */
export function runModel(
  name: AttributionModel,
  target: AttributionTarget,
  touchpoints: TouchpointInput[],
  config: ModelConfig = {}
): LedgerEntry[] {
  const model = getModel(name);
  const merged = mergeConfig(model.defaultConfig, config);
  const entries = model.apply(target, touchpoints, merged);

  // Representative commission rate per partner, for coherent commission dollars.
  const rateByPartner = new Map<string, number>();
  for (const tp of touchpoints) {
    if (!rateByPartner.has(tp.partnerId)) rateByPartner.set(tp.partnerId, tp.commissionRate);
  }

  return finalizeLedger(entries, target.amount, rateByPartner);
}
