/**
 * Attribution Module - Public API
 *
 * Covant ships a bounded set of 5 named, self-explaining attribution models.
 * Each implements the shared AttributionModelImpl contract; a Program selects
 * exactly one model + config.
 */

// Shared types
export type {
  AttributionModel,
  AttributionModelImpl,
  AttributionRole,
  AttributionTarget,
  CosellWeights,
  LedgerEntry,
  ModelConfig,
  TouchpointInput,
} from "./types";

// Role derivation
export { DEFAULT_ROLE_MAP, FALLBACK_ROLE, deriveRole } from "./roles";

// Models (pure implementations) + finalizer
export {
  finalizeLedger,
  firstTouchSourcer,
  implementationCredit,
  marketplaceCosellHybrid,
  roleWeighted,
  splitEqually,
} from "./models";

// Registry + runner
export {
  ATTRIBUTION_MODELS,
  getAllModels,
  getModel,
  isAttributionModel,
  mergeConfig,
  parseModelConfig,
  runModel,
} from "./registry";

// Calculator (database orchestration)
export {
  calculateDealAttribution,
  calculateMissingAttributions,
  type CalculationOptions,
  type CalculationResult,
} from "./calculator";
