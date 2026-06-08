/**
 * Role derivation: touchpoint `type` -> AttributionRole.
 *
 * Roles (sourcer / influencer / implementer / closer) are never stored on a
 * touchpoint. They are derived from the touchpoint type via DEFAULT_ROLE_MAP,
 * which a program can override per-model via ModelConfig.roleMap.
 */

import type { AttributionRole } from "./types";

/**
 * Default mapping covering all 10 touchpoint types in the schema.
 *
 * - deal_registration / referral / introduction -> sourcer (brought the deal in)
 * - content_share / demo / co_sell             -> influencer (moved it along)
 * - technical_enablement                        -> implementer (delivered it)
 * - proposal / negotiation                      -> closer (drove it to signature)
 * - crm_sync                                    -> influencer, but excluded from the
 *   qualifying set by default (excludeCrmSyncFromQualifying), so effectively inert.
 */
export const DEFAULT_ROLE_MAP: Record<string, AttributionRole> = {
  deal_registration: "sourcer",
  referral: "sourcer",
  introduction: "sourcer",
  content_share: "influencer",
  demo: "influencer",
  co_sell: "influencer",
  technical_enablement: "implementer",
  proposal: "closer",
  negotiation: "closer",
  crm_sync: "influencer",
};

/** Fallback role for unknown / unmapped touchpoint types. */
export const FALLBACK_ROLE: AttributionRole = "influencer";

/**
 * Derive a role from a touchpoint type. `roleMap` (already merged with defaults
 * by the caller, or passed alone) takes precedence; unknown types fall back to
 * `influencer`.
 */
export function deriveRole(
  type: string,
  roleMap: Record<string, AttributionRole> = DEFAULT_ROLE_MAP
): AttributionRole {
  return roleMap[type] ?? FALLBACK_ROLE;
}
