import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Get the organization for the current authenticated user.
 * Falls back to the first org in DB for demo/unauthenticated access.
 */
export async function getOrg(ctx: QueryCtx | MutationCtx) {
  // Try Clerk identity first
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

  // Fallback: return first org (demo mode / unauthenticated)
  return await ctx.db.query("organizations").first();
}

/**
 * Get just the org ID. Convenience wrapper.
 */
export async function getOrgId(ctx: QueryCtx | MutationCtx): Promise<Id<"organizations"> | null> {
  const org = await getOrg(ctx);
  return org?._id ?? null;
}
