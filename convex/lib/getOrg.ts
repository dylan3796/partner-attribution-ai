import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Single-tenant mode: return the first organization in the DB.
 * Auth is disabled — everyone operates as the one org that exists.
 * Re-introduce proper per-user org resolution when auth is added back.
 */
export async function getOrg(ctx: QueryCtx | MutationCtx) {
  return ctx.db.query("organizations").first();
}

export async function getOrgId(ctx: QueryCtx | MutationCtx): Promise<Id<"organizations"> | null> {
  const org = await getOrg(ctx);
  return org?._id ?? null;
}
