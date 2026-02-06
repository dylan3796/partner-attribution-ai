/**
 * Attribution Module - Public API
 * 
 * Re-exports all public functions and types from the attribution engine.
 */

// Models (pure functions for calculation)
export {
  calculateEqualSplit,
  calculateFirstTouch,
  calculateLastTouch,
  calculateTimeDecay,
  calculateRoleBased,
  normalizeAttributions,
  getModelDescription,
  getAllModels,
  DEFAULT_ROLE_WEIGHTS,
  type AttributionModel,
  type TouchpointInput,
  type AttributionResult,
} from "./models";

// Calculator (orchestration with database)
export {
  calculateDealAttribution,
  calculateMissingAttributions,
  type CalculationOptions,
  type CalculationResult,
} from "./calculator";
