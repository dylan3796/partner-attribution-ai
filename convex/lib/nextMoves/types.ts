/**
 * The "Next Moves" engine — shared types.
 *
 * A pure, Convex-safe layer (mirroring `convex/lib/attribution/`) that composes
 * signals the product already computes — partner scores, attributions, open
 * pipeline, payouts, disputes — into a ranked, evidence-backed feed of the moves
 * worth making this week, grouped by the four agent lenses the product sells:
 * PSM (partner sales), PAM (partner accounts), Program, and Ops.
 *
 * Every move carries an `evidence.reason` so the UI can show *why* it surfaced
 * and link back to the deal/partner it came from. No DB access lives here — the
 * Convex query (`convex/feed.ts`) loads the rows and hands them in.
 */

export type NextMoveAgent = "psm" | "pam" | "program" | "ops";

export type NextMoveSeverity = "high" | "med" | "low";

export interface NextMoveEvidence {
  /** Deal this move points at, when applicable. */
  dealId?: string;
  /** Partner this move points at, when applicable. */
  partnerId?: string;
  /** Required, human-readable explanation of why this move surfaced. */
  reason: string;
}

export interface NextMove {
  id: string;
  agent: NextMoveAgent;
  /** Stable machine kind, e.g. "tier_up", "coverage_gap". */
  kind: string;
  severity: NextMoveSeverity;
  title: string;
  detail: string;
  evidence: NextMoveEvidence;
  /** The concrete action a human (or downstream agent) should take. */
  suggestedAction: string;
  /** Ranking weight within a severity band (higher = surfaced first). */
  score: number;
}

// ── Input row shapes (structural; compatible with Convex Docs + lib/demo-data) ──

export interface NMPartner {
  _id: string;
  name: string;
  tier?: string | null;
  status?: string | null;
  type?: string | null;
  createdAt: number;
}

export interface NMDeal {
  _id: string;
  name: string;
  amount: number;
  status: string;
  createdAt: number;
  closedAt?: number | null;
  registeredBy?: string | null;
  registrationStatus?: string | null;
}

export interface NMTouchpoint {
  _id?: string;
  dealId: string;
  partnerId: string;
  type?: string | null;
  createdAt: number;
}

export interface NMAttribution {
  partnerId: string;
  model: string;
  amount: number;
}

export interface NMPayout {
  partnerId: string;
  amount: number;
  status: string;
  createdAt: number;
}

export interface NextMovesInput {
  partners: NMPartner[];
  deals: NMDeal[];
  touchpoints: NMTouchpoint[];
  attributions: NMAttribution[];
  payouts: NMPayout[];
  /** Optional precomputed scores; if absent the engine computes them. */
  scores?: import("../scoring").PartnerScore[];
  /** Optional feedback history — drives suppression + learned re-ranking. */
  feedback?: import("./feedback").MoveFeedbackRecord[];
  /** Override "now" for deterministic tests. */
  now?: number;
}

export interface NextMovesConfig {
  /** Max moves returned. Default 8. */
  limit?: number;
  /** Pending payout older than this many days is "aging". Default 14. */
  payoutAgingDays?: number;
  /** A partner created within this many days is "new". Default 30. */
  newPartnerDays?: number;
  /** Model whose rows drive the revenue signal. Default "role_weighted". */
  primaryModel?: string;
}

export interface NextMovesResult {
  moves: NextMove[];
  counts: Record<NextMoveAgent, number>;
  /** Move kinds auto-muted because they were repeatedly dismissed. */
  muted: string[];
  generatedAt: number;
}

export const SEVERITY_RANK: Record<NextMoveSeverity, number> = {
  high: 3,
  med: 2,
  low: 1,
};
