/**
 * @covant/engine — Attribution Engine Public API
 *
 * Framework-agnostic, deterministic attribution. Covant ships a bounded set of
 * 5 named, self-explaining attribution models. Each implements the shared
 * AttributionModelImpl contract; a Program selects exactly one model + config.
 *
 * This package contains ZERO Convex/Next/React dependencies. Database
 * orchestration (calculator.ts) and output adapters live in the convex/ backend
 * and import from here — never the reverse.
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

// Model recommender (program archetype → suggested model)
export { recommendModel } from "./recommender";
export type {
  ProgramArchetype,
  RecommenderInput,
  ModelRecommendation,
} from "./recommender";
