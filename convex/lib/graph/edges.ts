/**
 * Channel Graph — provenanced edge writer.
 *
 * Edges that have no existing FK home (employs, parent_of, involved_in,
 * for_account, met_with, account_mapping, cosell_link...) live in `graphEdges`.
 * Like facts, an edge never enters the graph bare: addEdge inserts the edge AND
 * writes a fact whose subject IS the edge, so the relationship carries its own
 * source + evidence (Law 1). No code should insert into `graphEdges` directly.
 */

import { MutationCtx } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";
import { writeFact } from "./facts";
import type { EvidencePointer, FactMethod } from "./types";

export interface AddEdgeArgs {
  organizationId: Id<"organizations">;
  /** Typed predicate, e.g. "involved_in" | "for_account" | "met_with". */
  type: string;
  from: { table: string; id: string };
  to: { table: string; id: string };
  /** Optional role qualifier (e.g. involved_in: sourcer|influencer|fulfiller|services). */
  role?: string;
  /** Provenance for the edge itself. */
  provenance: {
    sourceId: Id<"sourceDocuments">;
    method: FactMethod;
    confidence: number;
    evidencePointer: EvidencePointer;
    observedAt?: number;
  };
}

/** Insert a typed edge and its provenance fact. Returns the new edge id. */
export async function addEdge(
  ctx: MutationCtx,
  args: AddEdgeArgs
): Promise<Id<"graphEdges">> {
  const edgeId = await ctx.db.insert("graphEdges", {
    organizationId: args.organizationId,
    type: args.type,
    fromTable: args.from.table,
    fromId: args.from.id,
    toTable: args.to.table,
    toId: args.to.id,
    role: args.role,
  });

  await writeFact(ctx, {
    organizationId: args.organizationId,
    subject: { kind: "edge", table: "graphEdges", id: edgeId, field: args.type },
    value: { type: args.type, role: args.role, from: args.from, to: args.to },
    method: args.provenance.method,
    confidence: args.provenance.confidence,
    sourceId: args.provenance.sourceId,
    evidencePointer: args.provenance.evidencePointer,
    observedAt: args.provenance.observedAt,
  });

  return edgeId;
}
