import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Get the organization for the current authenticated user.
 * Returns null if not authenticated — callers must handle this.
 *
 * In demo mode (COVANT_DEMO_MODE=true), falls back to the first org
 * so unauthenticated visitors can explore the product.
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

  // Demo mode fallback: return first org for unauthenticated access.
  // In production, this should be disabled by removing the env var.
  if (process.env.COVANT_DEMO_MODE === "true") {
    return await ctx.db.query("organizations").first();
  }

  // No authenticated user and not in demo mode — return null
  return null;
}

/**
 * Get the organization or throw if not authenticated.
 * Use this in mutations where an org is always required.
 */
export async function requireOrg(ctx: QueryCtx | MutationCtx) {
  const org = await getOrg(ctx);
  if (!org) {
    throw new Error("Authentication required. Please sign in.");
  }
  return org;
}

/**
 * Get just the org ID. Convenience wrapper.
 */
export async function getOrgId(ctx: QueryCtx | MutationCtx): Promise<Id<"organizations"> | null> {
  const org = await getOrg(ctx);
  return org?._id ?? null;
}
