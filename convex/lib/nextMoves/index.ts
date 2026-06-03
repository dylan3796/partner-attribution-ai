/**
 * The "Next Moves" engine — public entry point.
 *
 * `generateNextMoves(input, config)` runs every generator, ranks the results
 * (severity first, then per-move score), trims to a tight feed, and reports a
 * per-agent count. Pure and Convex-safe — the Convex query in `convex/feed.ts`
 * loads the rows and the app/scripts/tests call this directly.
 */

import { calculatePartnerScores } from "../scoring";
import {
  opsHygiene,
  pamRetention,
  pamTierUp,
  programRamp,
  psmCoSell,
  psmCoverageGap,
} from "./generators";
import {
  SEVERITY_RANK,
  type NextMove,
  type NextMoveAgent,
  type NextMovesConfig,
  type NextMovesInput,
  type NextMovesResult,
} from "./types";

export * from "./types";
export * as generators from "./generators";

const DEFAULTS: Required<Omit<NextMovesConfig, "primaryModel">> & { primaryModel: string } = {
  limit: 8,
  payoutAgingDays: 14,
  newPartnerDays: 30,
  primaryModel: "role_weighted",
};

export function generateNextMoves(
  input: NextMovesInput,
  config: NextMovesConfig = {}
): NextMovesResult {
  const cfg = { ...DEFAULTS, ...config };
  const now = input.now ?? Date.now();

  // Reuse precomputed scores when provided; otherwise derive them from the same
  // rows (no cert/volume fixtures available in the Convex path).
  const scores =
    input.scores ??
    calculatePartnerScores(input.partners, input.deals, input.touchpoints, input.attributions, undefined, {
      primaryModel: cfg.primaryModel,
    });

  const moves: NextMove[] = [
    ...pamTierUp(scores),
    ...pamRetention(scores),
    ...psmCoverageGap(input.deals, input.touchpoints, input.partners, scores),
    ...psmCoSell(input.deals, input.touchpoints, input.partners),
    ...opsHygiene(input.deals, input.payouts, now, cfg.payoutAgingDays),
    ...programRamp(input.partners, input.touchpoints, now, cfg.newPartnerDays),
  ];

  // Rank: severity band first, then per-move score (desc), stable by id.
  moves.sort((a, b) => {
    const sev = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (sev !== 0) return sev;
    if (b.score !== a.score) return b.score - a.score;
    return a.id.localeCompare(b.id);
  });

  const trimmed = moves.slice(0, cfg.limit);

  const counts: Record<NextMoveAgent, number> = { psm: 0, pam: 0, program: 0, ops: 0 };
  for (const m of trimmed) counts[m.agent] += 1;

  return { moves: trimmed, counts, generatedAt: now };
}
