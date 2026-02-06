/**
 * Shared helper functions for Convex backend
 */

import { QueryCtx, MutationCtx } from "../_generated/server"
import { Id } from "../_generated/dataModel"

/**
 * Get organization from API key
 * Throws if API key is invalid
 */
export async function getOrgFromApiKey(
  ctx: QueryCtx | MutationCtx,
  apiKey: string
): Promise<{ _id: Id<"organizations">; name: string; plan: string; email: string }> {
  const org = await ctx.db
    .query("organizations")
    .withIndex("by_apiKey", (q) => q.eq("apiKey", apiKey))
    .unique()

  if (!org) {
    throw new Error("Invalid API key")
  }

  return org
}

/**
 * Verify organization owns a resource
 */
export function verifyOwnership(
  resourceOrgId: Id<"organizations">,
  requestOrgId: Id<"organizations">
): void {
  if (resourceOrgId !== requestOrgId) {
    throw new Error("Unauthorized: You don't own this resource")
  }
}

/**
 * Generate a random API key
 */
export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const length = 32
  let result = "pk_"
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, whole: number): number {
  if (whole === 0) return 0
  return Math.round((part / whole) * 100 * 100) / 100 // Round to 2 decimals
}
