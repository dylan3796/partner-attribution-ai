/**
 * Attribution (convex side) — backward-compatible barrel.
 *
 * The pure, framework-agnostic models, registry, roles, types and recommender
 * now live in the top-level `@covant/engine` package. This barrel re-exports
 * them alongside the Convex-coupled calculator (DB orchestration) so existing
 * `convex/lib/attribution` consumers keep working.
 *
 * New code should import models/types/registry/roles/recommender directly from
 * `@covant/engine`, and the calculator from `./calculator`.
 */

// Pure engine (models, registry, roles, types)
export * from "@covant/engine";

// Calculator (database orchestration — stays in convex/)
export {
  calculateDealAttribution,
  calculateMissingAttributions,
  type CalculationOptions,
  type CalculationResult,
} from "./calculator";
