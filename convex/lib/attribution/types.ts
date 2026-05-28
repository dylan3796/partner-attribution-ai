/**
 * Attribution Engine - Shared Types
 *
 * Covant ships a BOUNDED set of 5 correct, explainable attribution models
 * (not a generic rule engine). A customer runs multiple PROGRAMS in parallel,
 * each program selecting exactly ONE model + config.
 *
 * These types are extracted into their own module so both the pure model
 * implementations (models.ts) and the database orchestrator (calculator.ts)
 * can import them without a cycle.
 */

// ============================================================================
// Core enums
// ============================================================================

/** The 5 bounded canonical models. This is the entire allowed set. */
export type AttributionModel =
  | "first_touch_sourcer"
  | "split_equally"
  | "role_weighted"
  | "implementation_credit"
  | "marketplace_cosell_hybrid";

/**
 * Partner role taxonomy. Roles are DERIVED from a touchpoint's `type` at
 * runtime (see roles.ts) — they are never stored on the touchpoint itself.
 */
export type AttributionRole = "sourcer" | "influencer" | "implementer" | "closer";

// ============================================================================
// Inputs
// ============================================================================

/** Deal-level facts a model may need. Maps to a subset of Doc<"deals">. */
export interface AttributionTarget {
  /** dealId */
  id: string;
  /** Deal value in dollars. */
  amount: number;
  /** Product name (used for commission-rule matching upstream). */
  productName?: string;
  /** Partner who registered/deal-reg'd the opportunity. Drives sourcer logic. */
  registeredBy?: string;
  /** When the deal closed (epoch ms) — available for stage-cutoff comparisons. */
  closedAt?: number;
}

/**
 * A single partner interaction with a deal, enriched for attribution.
 *
 * The calculator builds these from raw touchpoints: it looks up the partner
 * (name/type), resolves the commission rate (0-100), and DERIVES `role` from
 * `type` via the (optionally overridden) role map. Models therefore never read
 * raw `type` directly — except marketplace_cosell_hybrid, which inspects
 * partnerName/partnerId for co-sell party classification.
 */
export interface TouchpointInput {
  partnerId: string;
  partnerName: string;
  /** partner.type, e.g. "reseller" | "integration" | "referral" | "affiliate". */
  partnerType?: string;
  /** Commission rate as a 0-100 percentage (calculator = matched rule.rate * 100). */
  commissionRate: number;
  /** Raw touchpoint type literal (e.g. "deal_registration", "co_sell"). */
  type: string;
  /** Role derived from `type` (set by the calculator / runModel before apply()). */
  role: AttributionRole;
  /** Touchpoint timestamp (epoch ms). */
  createdAt: number;
  /** Optional manual weight override (kept for backward compatibility). */
  weight?: number;
}

// ============================================================================
// Output
// ============================================================================

/**
 * One row of the attribution ledger. Every entry EXPLAINS itself via `reason`
 * so the future conversational layer can surface why a partner got credit.
 */
export interface LedgerEntry {
  partnerId: string;
  partnerName: string;
  /** 0-100, normalized so a deal's entries sum to 100. */
  percentage: number;
  /** Attributed deal value in dollars. */
  amount: number;
  /** Commission owed to the partner (amount * commissionRate / 100). */
  commissionAmount: number;
  /** REQUIRED human-readable explanation, e.g. "40% to PartnerA as sourcer". */
  reason: string;
  /** The role that earned the credit, when meaningful. */
  role?: AttributionRole;
}

// ============================================================================
// Config
// ============================================================================

/** Co-sell party classes for marketplace_cosell_hybrid. */
export interface CosellWeights {
  hyperscaler: number;
  partner: number;
  vendor: number;
}

/**
 * Per-model configuration. Every field is optional; each model supplies its
 * own sane defaults via `defaultConfig`, so a model works with zero config.
 * Persisted per-program as a JSON string in programs.modelConfig.
 */
export interface ModelConfig {
  /** Role -> weight. Used by role_weighted & cosell. Default 40/20/20/20. */
  roleWeights?: Partial<Record<AttributionRole, number>>;
  /** Touchpoint type -> role overrides, merged over DEFAULT_ROLE_MAP. */
  roleMap?: Record<string, AttributionRole>;
  /** Touchpoints created strictly after this epoch ms are ignored. */
  stageCutoff?: number;
  /** Co-sell party-class weights. Default { hyperscaler: 30, partner: 20, vendor: 50 }. */
  cosellWeights?: CosellWeights;
  /** Explicit partnerIds treated as the hyperscaler (AWS/Azure/GCP/Snowflake). */
  hyperscalerPartnerIds?: string[];
  /** Case-insensitive partnerName substrings identifying a hyperscaler. */
  hyperscalerNameMatch?: string[];
  /** PartnerIds representing the selling vendor's own internal partner record(s). */
  vendorPartnerIds?: string[];
  /** Exclude crm_sync touchpoints from the qualifying set. Default true. */
  excludeCrmSyncFromQualifying?: boolean;
}

// ============================================================================
// Model implementation contract
// ============================================================================

/**
 * Common interface every bounded model implements. apply() is PURE and returns
 * UN-normalized entries; runModel() (registry.ts) merges defaults, calls apply,
 * normalizes percentages to sum 100, and recomputes amount/commission so dollars
 * stay coherent with the normalized percentages. Returns [] when there is no
 * qualifying touchpoint.
 */
export interface AttributionModelImpl {
  name: AttributionModel;
  label: string;
  description: string;
  defaultConfig: ModelConfig;
  apply(
    target: AttributionTarget,
    touchpoints: TouchpointInput[],
    config: ModelConfig
  ): LedgerEntry[];
}
