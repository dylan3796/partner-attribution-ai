/**
 * Channel Graph — the fact writer (the no-fabrication firewall, in code).
 *
 * This is the ONLY sanctioned way to write a row into the `facts` table. It
 * enforces the architectural invariants that the schema validators cannot
 * express on their own:
 *
 *   - Law 1: no fact without a source. sourceId is required by the type AND
 *     re-checked to exist here.
 *   - Law 2/3: confidence is bounded to [0,1]; 1.0 is reserved for facts that
 *     are asserted-from-system or user_confirmed. An `inferred` fact may never
 *     claim certainty.
 *   - Law 6: gaps stay first-class — observedAt is optional; we never invent it.
 *
 * Ingestion adapters, the grounding firewall, and entity resolution (later
 * sessions) all route their writes through writeFact / assertField. No code
 * should ever call ctx.db.insert("facts", ...) directly.
 */

import { MutationCtx } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";
import type { FactInput, FactSubject, EvidencePointer } from "./types";

/** Thrown when a candidate fact violates a no-fabrication invariant. */
export class FactInvariantError extends Error {
  constructor(message: string) {
    super(`[ChannelGraph] ${message}`);
    this.name = "FactInvariantError";
  }
}

/**
 * Write one fact envelope. Returns the new fact id.
 *
 * Throws FactInvariantError (rather than silently coercing) when an invariant is
 * broken, so a buggy adapter fails loudly instead of poisoning the graph.
 */
export async function writeFact(
  ctx: MutationCtx,
  input: FactInput
): Promise<Id<"facts">> {
  const { confidence, method, sourceId, subject, evidencePointer } = input;

  // Law 1: the source must actually exist.
  const source = await ctx.db.get(sourceId);
  if (!source) {
    throw new FactInvariantError(
      `sourceId ${sourceId} does not resolve to a sourceDocument — no fact may be bare.`
    );
  }
  if (source.organizationId !== input.organizationId) {
    throw new FactInvariantError(
      `source ${sourceId} belongs to a different organization than the fact.`
    );
  }

  // Confidence must be a real probability.
  if (
    typeof confidence !== "number" ||
    Number.isNaN(confidence) ||
    confidence < 0 ||
    confidence > 1
  ) {
    throw new FactInvariantError(
      `confidence must be a number in [0,1]; got ${confidence}.`
    );
  }

  // Law 2/3: only asserted-from-system or user_confirmed facts may be certain.
  if (method === "inferred" && confidence >= 1) {
    throw new FactInvariantError(
      "an inferred fact may not have confidence 1.0 — inference is never certain."
    );
  }

  validateEvidencePointer(evidencePointer);

  return ctx.db.insert("facts", {
    organizationId: input.organizationId,
    subjectKind: subject.kind,
    subjectTable: subject.table,
    subjectId: subject.id,
    subjectField: subject.field,
    value: input.value,
    method,
    confidence,
    sourceId,
    evidencePointer,
    observedAt: input.observedAt,
    recordedAt: Date.now(),
    status: "active",
  });
}

/**
 * Convenience for the structured path: assert an attribute value that came
 * verbatim from a system-of-record field. Always method="asserted",
 * confidence=1.0, with a field-path evidence pointer.
 */
export async function assertField(
  ctx: MutationCtx,
  args: {
    organizationId: Id<"organizations">;
    table: string;
    id: string;
    field: string;
    value: unknown;
    sourceId: Id<"sourceDocuments">;
    /** The path within the source record, e.g. "Opportunity.Amount". */
    path: string;
    observedAt?: number;
  }
): Promise<Id<"facts">> {
  return writeFact(ctx, {
    organizationId: args.organizationId,
    subject: { kind: "attribute", table: args.table, id: args.id, field: args.field },
    value: args.value,
    method: "asserted",
    confidence: 1.0,
    sourceId: args.sourceId,
    evidencePointer: { kind: "field_path", path: args.path },
    observedAt: args.observedAt,
  });
}

/**
 * Fetch the active facts about a subject (optionally a specific field). Later
 * sessions use this for the graph-backed attribution loader and conflict
 * detection. Returns most-recently-recorded first.
 */
export async function getActiveFacts(
  ctx: MutationCtx,
  subject: Pick<FactSubject, "table" | "id"> & { field?: string }
) {
  const rows = subject.field
    ? await ctx.db
        .query("facts")
        .withIndex("by_subject_field", (q) =>
          q
            .eq("subjectTable", subject.table)
            .eq("subjectId", subject.id)
            .eq("subjectField", subject.field)
        )
        .collect()
    : await ctx.db
        .query("facts")
        .withIndex("by_subject", (q) =>
          q.eq("subjectTable", subject.table).eq("subjectId", subject.id)
        )
        .collect();

  return rows
    .filter((f) => f.status === "active")
    .sort((a, b) => b.recordedAt - a.recordedAt);
}

function validateEvidencePointer(ev: EvidencePointer): void {
  if (ev.kind === "span") {
    if (!ev.quote || ev.quote.trim().length === 0) {
      // Law 2: an unstructured fact with no cited span is discarded, not stored.
      throw new FactInvariantError(
        "a span evidence pointer must carry a non-empty quote."
      );
    }
  } else if (ev.kind === "field_path") {
    if (!ev.path || ev.path.trim().length === 0) {
      throw new FactInvariantError(
        "a field_path evidence pointer must carry a non-empty path."
      );
    }
  }
}
