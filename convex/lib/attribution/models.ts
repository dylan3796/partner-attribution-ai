/**
 * Attribution Models — the 5 bounded, self-explaining implementations.
 *
 * Each model implements the shared AttributionModelImpl contract (types.ts):
 *   apply(target, touchpoints, config) -> LedgerEntry[]
 *
 * apply() is PURE. It returns entries whose percentages already sum to ~100 and
 * whose amounts/commissions are computed from the deal amount; the registry's
 * runModel() then guarantees an exact 100 total and recomputes dollars after any
 * rounding adjustment (see finalizeLedger). Every entry carries a human-readable
 * `reason` so the conversational layer can explain the split.
 *
 * Performance target: < 100ms for 100 touchpoints.
 */

import type {
  AttributionModelImpl,
  AttributionRole,
  AttributionTarget,
  LedgerEntry,
  ModelConfig,
  TouchpointInput,
} from "./types";
import { DEFAULT_ROLE_MAP } from "./roles";

// ============================================================================
// Shared helpers
// ============================================================================

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Format an epoch-ms timestamp as YYYY-MM-DD for reason strings. */
function fmtDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * The qualifying touchpoint set for a deal: drops crm_sync (unless explicitly
 * kept) and anything created strictly after a configured stage cutoff.
 */
function qualifying(
  touchpoints: TouchpointInput[],
  config: ModelConfig
): TouchpointInput[] {
  const excludeCrm = config.excludeCrmSyncFromQualifying !== false; // default true
  return touchpoints.filter((tp) => {
    if (excludeCrm && tp.type === "crm_sync") return false;
    if (config.stageCutoff !== undefined && tp.createdAt > config.stageCutoff) {
      return false; // touchpoint after the stage cutoff is ignored
    }
    return true;
  });
}

/** Build a single ledger entry with dollars derived from the deal amount. */
function buildEntry(params: {
  tp: TouchpointInput;
  percentage: number;
  dealAmount: number;
  reason: string;
  role?: AttributionRole;
}): LedgerEntry {
  const { tp, percentage, dealAmount, reason, role } = params;
  const amount = round2((percentage / 100) * dealAmount);
  return {
    partnerId: tp.partnerId,
    partnerName: tp.partnerName,
    percentage: round2(percentage),
    amount,
    commissionAmount: round2(amount * (tp.commissionRate / 100)),
    reason,
    role,
  };
}

/**
 * Relative role share per partner, used by role_weighted and within each
 * co-sell class. A partner is assigned their HIGHEST-weight role (so a partner
 * playing several roles is credited at their best role and single-role partners
 * are not diluted). Each role is a "pool" whose weight is split evenly among the
 * partners assigned to it — so two partners sharing the sourcer role split the
 * sourcer pool. Returns un-normalized shares (caller normalizes its own scope).
 */
interface RoleShare {
  tp: TouchpointInput;
  role: AttributionRole;
  share: number; // relative weight contribution
}

function roleShares(
  touchpoints: TouchpointInput[],
  roleWeights: Partial<Record<AttributionRole, number>>
): RoleShare[] {
  // 1. assign each partner their highest-weight role + a representative touchpoint
  const best = new Map<string, { tp: TouchpointInput; role: AttributionRole; weight: number }>();
  for (const tp of touchpoints) {
    const weight = roleWeights[tp.role] ?? 0;
    const current = best.get(tp.partnerId);
    if (!current || weight > current.weight) {
      best.set(tp.partnerId, { tp, role: tp.role, weight });
    }
  }
  // 2. count partners per assigned role (the pool is split evenly among them)
  const countByRole = new Map<AttributionRole, number>();
  for (const { role } of best.values()) {
    countByRole.set(role, (countByRole.get(role) ?? 0) + 1);
  }
  // 3. each partner's share = its role pool / number of partners in that role
  return Array.from(best.values()).map(({ tp, role, weight }) => ({
    tp,
    role,
    share: weight / (countByRole.get(role) ?? 1),
  }));
}

// ============================================================================
// Model 1: first_touch_sourcer
// ============================================================================

const firstTouchSourcer: AttributionModelImpl = {
  name: "first_touch_sourcer",
  label: "First Touch / Sourcer",
  description:
    "Full credit to the partner who first registered or sourced the deal.",
  defaultConfig: { excludeCrmSyncFromQualifying: true },

  apply(target, touchpoints, config): LedgerEntry[] {
    const q = qualifying(touchpoints, config);
    if (q.length === 0) return [];

    // Deal-reg conflict resolution: an explicit registeredBy with a qualifying
    // touch wins outright; otherwise the earliest qualifying touch sources it.
    const regTouches = target.registeredBy
      ? q
          .filter((tp) => tp.partnerId === target.registeredBy)
          .sort((a, b) => a.createdAt - b.createdAt)
      : [];

    let winner: TouchpointInput;
    let reason: string;

    if (regTouches.length > 0) {
      winner = regTouches[0];
      reason = `${winner.partnerName} registered this deal (${winner.type} on ${fmtDate(
        winner.createdAt
      )}); receives 100% as sourcer.`;
    } else {
      const sorted = [...q].sort((a, b) => a.createdAt - b.createdAt);
      winner = sorted[0];
      // Detect an exact earliest-touch tie across different partners.
      const tie =
        sorted.length > 1 &&
        sorted[1].createdAt === winner.createdAt &&
        sorted[1].partnerId !== winner.partnerId;
      reason = `${winner.partnerName} sourced this deal — earliest qualifying touch (${
        winner.type
      }) on ${fmtDate(winner.createdAt)}; receives 100% as sourcer.${
        tie ? " (earliest-touch tie broken by record order)" : ""
      }`;
    }

    return [
      buildEntry({
        tp: winner,
        percentage: 100,
        dealAmount: target.amount,
        reason,
        role: "sourcer",
      }),
    ];
  },
};

// ============================================================================
// Model 2: split_equally
// ============================================================================

const splitEqually: AttributionModelImpl = {
  name: "split_equally",
  label: "Split Equally",
  description: "Equal credit across all partners with a qualifying touchpoint.",
  defaultConfig: { excludeCrmSyncFromQualifying: true },

  apply(target, touchpoints, config): LedgerEntry[] {
    const q = qualifying(touchpoints, config);
    if (q.length === 0) return [];

    // One entry per unique partner (a partner with many touches counts once).
    const unique = new Map<string, TouchpointInput>();
    for (const tp of q) {
      if (!unique.has(tp.partnerId)) unique.set(tp.partnerId, tp);
    }

    const n = unique.size;
    const pct = 100 / n;
    const reason = `${n} partner${n === 1 ? "" : "s"} had qualifying touchpoints; credit split equally at ${round2(
      pct
    )}% each.`;

    return Array.from(unique.values()).map((tp) =>
      buildEntry({ tp, percentage: pct, dealAmount: target.amount, reason })
    );
  },
};

// ============================================================================
// Model 3: role_weighted
// ============================================================================

const ROLE_WEIGHTED_DEFAULTS: Partial<Record<AttributionRole, number>> = {
  sourcer: 40,
  influencer: 20,
  implementer: 20,
  closer: 20,
};

const roleWeighted: AttributionModelImpl = {
  name: "role_weighted",
  label: "Role Weighted",
  description:
    "Credit weighted by partner role (sourcer / influencer / implementer / closer).",
  defaultConfig: {
    roleWeights: ROLE_WEIGHTED_DEFAULTS,
    roleMap: DEFAULT_ROLE_MAP,
    excludeCrmSyncFromQualifying: true,
  },

  apply(target, touchpoints, config): LedgerEntry[] {
    const q = qualifying(touchpoints, config);
    if (q.length === 0) return [];

    const weights = config.roleWeights ?? ROLE_WEIGHTED_DEFAULTS;
    const shares = roleShares(q, weights);
    const total = shares.reduce((s, r) => s + r.share, 0);
    if (total <= 0) return []; // all roles weighted 0 -> nothing to attribute

    return shares.map(({ tp, role, share }) => {
      const pct = (share / total) * 100;
      const reason = `${tp.partnerName} credited as ${role} (role-weighted) → ${round2(
        pct
      )}% of deal.`;
      return buildEntry({ tp, percentage: pct, dealAmount: target.amount, reason, role });
    });
  },
};

// ============================================================================
// Model 4: implementation_credit
// ============================================================================

const implementationCredit: AttributionModelImpl = {
  name: "implementation_credit",
  label: "Implementation Credit",
  description: "Full credit to the partner who delivered / implemented the deal.",
  defaultConfig: { roleMap: DEFAULT_ROLE_MAP, excludeCrmSyncFromQualifying: true },

  apply(target, touchpoints, config): LedgerEntry[] {
    const q = qualifying(touchpoints, config);
    if (q.length === 0) return [];

    // Prefer the latest implementer touch; the implementer keeps credit even if
    // the partner later churns (the work — and the commission owed — is done).
    const implementers = q.filter((tp) => tp.role === "implementer");
    let winner: TouchpointInput;
    let reason: string;

    if (implementers.length > 0) {
      winner = implementers.reduce((latest, tp) =>
        tp.createdAt > latest.createdAt ? tp : latest
      );
      reason = `${winner.partnerName} delivered the implementation (${winner.type} on ${fmtDate(
        winner.createdAt
      )}); receives 100% as implementer.`;
    } else {
      // Fallback: no implementer touch — credit the most recent qualifying partner.
      winner = q.reduce((latest, tp) => (tp.createdAt > latest.createdAt ? tp : latest));
      reason = `No implementation touch found; ${winner.partnerName} credited 100% as the most recent qualifying partner (${
        winner.type
      } on ${fmtDate(winner.createdAt)}).`;
    }

    return [
      buildEntry({
        tp: winner,
        percentage: 100,
        dealAmount: target.amount,
        reason,
        role: winner.role,
      }),
    ];
  },
};

// ============================================================================
// Model 5: marketplace_cosell_hybrid
// ============================================================================

type CosellClass = "hyperscaler" | "partner" | "vendor";

const COSELL_WEIGHT_DEFAULTS = { hyperscaler: 30, partner: 20, vendor: 50 };
const HYPERSCALER_NAME_DEFAULTS = [
  "aws",
  "amazon",
  "azure",
  "microsoft",
  "gcp",
  "google cloud",
  "snowflake",
];

function classifyParty(tp: TouchpointInput, config: ModelConfig): CosellClass {
  if (config.hyperscalerPartnerIds?.includes(tp.partnerId)) return "hyperscaler";
  const name = tp.partnerName.toLowerCase();
  const matchers = config.hyperscalerNameMatch ?? HYPERSCALER_NAME_DEFAULTS;
  if (matchers.some((m) => name.includes(m.toLowerCase()))) return "hyperscaler";
  if (config.vendorPartnerIds?.includes(tp.partnerId)) return "vendor";
  return "partner";
}

const marketplaceCosellHybrid: AttributionModelImpl = {
  name: "marketplace_cosell_hybrid",
  label: "Marketplace Co-sell (Hybrid)",
  description:
    "Multi-party split for cloud co-sell: hyperscaler influencer + partner sourcer + vendor closer.",
  defaultConfig: {
    cosellWeights: COSELL_WEIGHT_DEFAULTS,
    hyperscalerNameMatch: HYPERSCALER_NAME_DEFAULTS,
    roleWeights: ROLE_WEIGHTED_DEFAULTS,
    roleMap: DEFAULT_ROLE_MAP,
    excludeCrmSyncFromQualifying: true,
  },

  apply(target, touchpoints, config): LedgerEntry[] {
    const q = qualifying(touchpoints, config);
    if (q.length === 0) return [];

    const cosellWeights = config.cosellWeights ?? COSELL_WEIGHT_DEFAULTS;
    const roleWeights = config.roleWeights ?? ROLE_WEIGHTED_DEFAULTS;

    // Group qualifying touches by co-sell party class.
    const byClass = new Map<CosellClass, TouchpointInput[]>();
    for (const tp of q) {
      const cls = classifyParty(tp, config);
      const list = byClass.get(cls) ?? [];
      list.push(tp);
      byClass.set(cls, list);
    }

    const presentClasses = Array.from(byClass.keys());
    const singleClass = presentClasses.length === 1;

    // Each partner's weight = its class pool * (its role share within the class).
    const weighted: Array<{ tp: TouchpointInput; role: AttributionRole; cls: CosellClass; weight: number }> = [];
    for (const [cls, touches] of byClass) {
      const poolWeight = cosellWeights[cls];
      const shares = roleShares(touches, roleWeights);
      const shareTotal = shares.reduce((s, r) => s + r.share, 0);
      for (const { tp, role, share } of shares) {
        const within = shareTotal > 0 ? share / shareTotal : 1 / shares.length;
        weighted.push({ tp, role, cls, weight: poolWeight * within });
      }
    }

    const total = weighted.reduce((s, w) => s + w.weight, 0);
    if (total <= 0) return [];

    return weighted.map(({ tp, role, cls, weight }) => {
      const pct = (weight / total) * 100;
      const note = singleClass
        ? ` (only ${cls} party present on this deal — full credit to that class)`
        : "";
      const reason = `${tp.partnerName} credited as ${cls} ${role} (co-sell ${cls} pool) → ${round2(
        pct
      )}% of deal.${note}`;
      return buildEntry({ tp, percentage: pct, dealAmount: target.amount, reason, role });
    });
  },
};

// ============================================================================
// Finalize: guarantee percentages sum to exactly 100, recompute dollars
// ============================================================================

/**
 * Normalize a ledger so percentages sum to exactly 100 (correcting float/round
 * drift by adjusting the largest entry), then recompute amount + commission for
 * every entry from the normalized percentage so dollars stay coherent.
 */
export function finalizeLedger(
  entries: LedgerEntry[],
  dealAmount: number,
  rateByPartner: Map<string, number>
): LedgerEntry[] {
  if (entries.length === 0) return entries;

  const out = entries.map((e) => ({ ...e }));
  const totalPct = out.reduce((s, e) => s + e.percentage, 0);
  const drift = 100 - totalPct;

  if (Math.abs(drift) >= 0.01) {
    // Add the drift to the largest entry to keep the adjustment fair/invisible.
    let largest = out[0];
    for (const e of out) if (e.percentage > largest.percentage) largest = e;
    largest.percentage = round2(largest.percentage + drift);
  }

  for (const e of out) {
    const rate = rateByPartner.get(e.partnerId) ?? 0;
    e.amount = round2((e.percentage / 100) * dealAmount);
    e.commissionAmount = round2(e.amount * (rate / 100));
  }
  return out;
}

// ============================================================================
// The 5 models
// ============================================================================

export {
  firstTouchSourcer,
  splitEqually,
  roleWeighted,
  implementationCredit,
  marketplaceCosellHybrid,
};
