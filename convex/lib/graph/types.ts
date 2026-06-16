/**
 * Channel Graph — shared types (the no-fabrication substrate).
 *
 * Mirrors the validators in convex/schema.ts for the graph tables. These types
 * are imported by the fact writer (facts.ts) and, in later sessions, by the
 * source adapters, the grounding firewall, entity resolution, and the
 * graph-backed attribution loader.
 *
 * The seven no-fabrication laws (see CHANNEL-GRAPH-BUILD.md §0) are enforced in
 * code here and in facts.ts — not merely documented.
 */

import type { Id } from "../../_generated/dataModel";

// ============================================================================
// Fact envelope
// ============================================================================

/** asserted != inferred != user_confirmed, and they stay distinct forever (Law 3). */
export type FactMethod = "asserted" | "inferred" | "user_confirmed";

/** A fact is about a node, an edge, or a single attribute value. */
export type FactSubjectKind = "node" | "edge" | "attribute";

/**
 * What a fact is about. Points at a real row in any operational OR graph table,
 * so the graph WRAPS existing data instead of duplicating it.
 */
export interface FactSubject {
  kind: FactSubjectKind;
  /** Table the subject row lives in, e.g. "partners" | "deals" | "graphEdges". */
  table: string;
  /** Row id (string form of a Convex Id). */
  id: string;
  /** Attribute name (attribute facts) or edge predicate (edge facts). */
  field?: string;
}

/** Where the proof lives: a field path (structured) or an exact span (unstructured). */
export type EvidencePointer =
  | { kind: "field_path"; path: string }
  | { kind: "span"; quote: string; startOffset?: number; endOffset?: number };

/**
 * Everything a caller must supply to write a fact. recordedAt and status are
 * filled in by the writer. There is no way to write a fact without a sourceId
 * and an evidence pointer — that is the point (Laws 1 & 2).
 */
export interface FactInput {
  organizationId: Id<"organizations">;
  subject: FactSubject;
  value: unknown;
  method: FactMethod;
  /** 0-1. Must be < 1.0 for inferred facts; 1.0 only for asserted / user_confirmed. */
  confidence: number;
  sourceId: Id<"sourceDocuments">;
  evidencePointer: EvidencePointer;
  /** When the fact was true in the world (optional — gaps are first-class, Law 6). */
  observedAt?: number;
}

// ============================================================================
// Entity resolution (Law 5)
// ============================================================================

/** Outcome of matching an incoming identity against existing nodes. */
export type ResolutionDecision = "auto_merge" | "review" | "new";

/**
 * Confidence thresholds for Tier-2 semantic matching. Tier-1 deterministic
 * matches (exact CRM id / email / domain) bypass these and auto-merge at 1.0.
 * Defaults are tunable (see plan: 0.90 / 0.65).
 */
export const RESOLUTION_THRESHOLDS = {
  /** >= this => auto_merge. */
  autoMerge: 0.9,
  /** >= this and < autoMerge => human review queue. Below => new entity. */
  review: 0.65,
} as const;

/** Map a Tier-2 similarity score to a resolution decision. */
export function decideResolution(score: number): ResolutionDecision {
  if (score >= RESOLUTION_THRESHOLDS.autoMerge) return "auto_merge";
  if (score >= RESOLUTION_THRESHOLDS.review) return "review";
  return "new";
}
