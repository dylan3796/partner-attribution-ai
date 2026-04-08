import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Get the organization for the current authenticated user.
 * Returns null if the user is not authenticated or has no org.
 */
export async function getOrg(ctx: QueryCtx | MutationCtx) {
  // Require Clerk identity
  const identity = await ctx.auth.getUserIdentity();

  if (identity) {
    // Look up user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (user?.organizationId) {
      const org = await ctx.db.get(user.organizationId);
      if (org) return org;
    }
  }

  // No authenticated user or no org found — return null
  // Callers handle this by returning empty data ([], null, EMPTY_STATS, etc.)
  return null;
}

/**
 * Get just the org ID. Convenience wrapper.
 */
export async function getOrgId(ctx: QueryCtx | MutationCtx): Promise<Id<"organizations"> | null> {
  const org = await getOrg(ctx);
  return org?._id ?? null;
}
