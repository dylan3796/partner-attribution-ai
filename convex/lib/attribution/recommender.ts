/**
 * Attribution model recommender.
 *
 * Pure, dependency-free, importable from both the Next.js client (setup wizard)
 * and Convex (server-side seeding). Given a free-text program description and/or
 * the partner types a customer uses, it recommends ONE of the 5 bounded models
 * plus a program archetype and a human-readable rationale.
 *
 * This is intentionally a small, explainable rule engine (not ML): the product
 * ships a bounded set of correct models, so recommending among them is a matter
 * of matching well-known program shapes.
 */

import type { AttributionModel } from "./types";

export type ProgramArchetype = "si" | "cloud_cosell" | "tech_isv" | "reseller" | "other";

export interface RecommenderInput {
  /** Free-text program description (from the setup wizard or assistant). */
  description?: string;
  /** Canonical partner types in the program (reseller/referral/affiliate/integration/...). */
  partnerTypes?: string[];
  /** Whether the program has multiple tiers (a signal for role weighting). */
  hasTiers?: boolean;
}

export interface ModelRecommendation {
  model: AttributionModel;
  archetype: ProgramArchetype;
  /** Why this model was chosen — surfaced in the setup UI and conversational layer. */
  rationale: string;
}

/** Signal definitions, evaluated in priority order (first hit wins). */
interface Signal {
  model: AttributionModel;
  archetype: ProgramArchetype;
  keywords: string[];
  partnerTypes?: string[];
  rationale: string;
}

const SIGNALS: Signal[] = [
  {
    model: "marketplace_cosell_hybrid",
    archetype: "cloud_cosell",
    keywords: [
      "co-sell", "cosell", "co sell", "marketplace", "hyperscaler", "aws",
      "amazon", "azure", "microsoft", "gcp", "google cloud", "snowflake",
      "ace", "cloud partner", "cloud program",
    ],
    rationale:
      "Cloud co-sell signals (hyperscaler/marketplace) → multi-party credit between the hyperscaler influencer, the sourcing partner, and your vendor team.",
  },
  {
    model: "implementation_credit",
    archetype: "si",
    keywords: [
      "implementation", "implement", "delivery", "deliver", "professional services",
      "systems integrator", "system integrator", " si ", "services partner",
      "deploy", "rollout", "onboarding partner", "integrator",
    ],
    partnerTypes: ["integration"],
    rationale:
      "Delivery/implementation signals → full credit to the partner who delivered the implementation.",
  },
  {
    model: "split_equally",
    archetype: "reseller",
    keywords: ["reseller", "resell", "channel", "distributor", "var", "reselling"],
    partnerTypes: ["reseller"],
    rationale:
      "Reseller/channel signals → equal credit across the partners with a qualifying touch on the deal.",
  },
  {
    model: "first_touch_sourcer",
    archetype: "other",
    keywords: [
      "referral", "refer ", "refers", "affiliate", "introduc", "sourcing",
      "word of mouth", "lead gen", "lead generation", "first touch", "deal reg",
      "deal registration",
    ],
    partnerTypes: ["referral", "affiliate"],
    rationale:
      "Referral/sourcing signals → full credit to the partner who first registered or sourced the deal.",
  },
];

const ROLE_WEIGHTED_FALLBACK: ModelRecommendation = {
  model: "role_weighted",
  archetype: "other",
  rationale:
    "Multiple partner roles / tiers without a single dominant pattern → credit weighted by role (sourcer / influencer / implementer / closer).",
};

function matches(signal: Signal, text: string, partnerTypes: string[]): boolean {
  if (signal.keywords.some((k) => text.includes(k))) return true;
  if (signal.partnerTypes && signal.partnerTypes.some((t) => partnerTypes.includes(t))) return true;
  return false;
}

/**
 * Recommend a bounded attribution model + archetype for a program.
 * Always returns a recommendation (defaults to role_weighted).
 */
export function recommendModel(input: RecommenderInput): ModelRecommendation {
  const text = ` ${(input.description ?? "").toLowerCase()} `;
  const partnerTypes = (input.partnerTypes ?? []).map((t) => t.toLowerCase());

  for (const signal of SIGNALS) {
    if (matches(signal, text, partnerTypes)) {
      return { model: signal.model, archetype: signal.archetype, rationale: signal.rationale };
    }
  }

  // No strong single signal. If several partner types or tiers are in play,
  // role weighting is the safest balanced default; otherwise still role_weighted.
  if (partnerTypes.length >= 2 || input.hasTiers) {
    return {
      ...ROLE_WEIGHTED_FALLBACK,
      rationale:
        partnerTypes.length >= 2
          ? "Several partner types contribute to deals → credit weighted by role (sourcer / influencer / implementer / closer)."
          : ROLE_WEIGHTED_FALLBACK.rationale,
    };
  }
  return ROLE_WEIGHTED_FALLBACK;
}
