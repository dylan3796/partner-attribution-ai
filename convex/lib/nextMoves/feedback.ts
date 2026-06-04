/**
 * Feedback-aware ranking for the next-moves engine.
 *
 * The "learns on itself" layer. Two signal kinds feed it:
 *   - explicit: a human accepts / dismisses / snoozes a move,
 *   - implicit: Covant observes the suggested action actually happened
 *               (recorded as a "completed" outcome).
 *
 * Both roll up per move-KIND, per org, into a transparent weight that re-ranks
 * the feed: kinds people keep acting on rise; kinds they keep dismissing sink
 * and eventually auto-mute. Pure — the Convex layer loads the records and the
 * engine applies them. Nothing here is a black box; every adjustment is a
 * countable tally you can explain back to the user.
 */

import type { NextMove } from "./types";

export type MoveFeedbackAction = "accepted" | "dismissed" | "snoozed" | "completed";

export interface MoveFeedbackRecord {
  /** Stable id of the specific move (e.g. "pam-tierup-<partnerId>"). */
  moveId: string;
  /** Move kind (e.g. "tier_up", "coverage_gap") — the unit we learn on. */
  moveKind: string;
  action: MoveFeedbackAction;
  /** For snoozes: hide the specific move until this time. */
  snoozeUntil?: number;
  createdAt: number;
}

export interface FeedbackConfig {
  /** Score multiplier moves ± per net positive/negative signal on the kind. */
  weightStep: number;
  /** Clamp range for a kind's learned weight. */
  minWeight: number;
  maxWeight: number;
  /** Auto-mute a kind after this many dismissals with zero positive signals. */
  autoMuteAfterDismissals: number;
}

export const DEFAULT_FEEDBACK_CONFIG: FeedbackConfig = {
  weightStep: 0.2,
  minWeight: 0.4,
  maxWeight: 1.6,
  autoMuteAfterDismissals: 3,
};

export interface KindSentiment {
  positive: number; // accepted + completed
  negative: number; // dismissed
  weight: number; // learned score multiplier
  muted: boolean; // suppress the whole kind
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** The latest action recorded for each individual move. */
export function latestActionByMove(feedback: MoveFeedbackRecord[]): Map<string, MoveFeedbackRecord> {
  const latest = new Map<string, MoveFeedbackRecord>();
  for (const f of feedback) {
    const prev = latest.get(f.moveId);
    if (!prev || f.createdAt > prev.createdAt) latest.set(f.moveId, f);
  }
  return latest;
}

/** Roll feedback up per kind into a learned weight + mute decision. */
export function summarizeKindSentiment(
  feedback: MoveFeedbackRecord[],
  config: FeedbackConfig = DEFAULT_FEEDBACK_CONFIG
): Map<string, KindSentiment> {
  const tallies = new Map<string, { positive: number; negative: number }>();
  for (const f of feedback) {
    const t = tallies.get(f.moveKind) ?? { positive: 0, negative: 0 };
    if (f.action === "accepted" || f.action === "completed") t.positive += 1;
    else if (f.action === "dismissed") t.negative += 1;
    // snoozed is move-specific, not a kind-level sentiment
    tallies.set(f.moveKind, t);
  }

  const out = new Map<string, KindSentiment>();
  for (const [kind, t] of tallies) {
    const net = t.positive - t.negative;
    const weight = clamp(1 + config.weightStep * net, config.minWeight, config.maxWeight);
    const muted = t.positive === 0 && t.negative >= config.autoMuteAfterDismissals;
    out.set(kind, { positive: t.positive, negative: t.negative, weight, muted });
  }
  return out;
}

export interface AppliedFeedback {
  moves: NextMove[];
  /** Move kinds auto-muted because they were repeatedly dismissed. */
  muted: string[];
}

/**
 * Apply feedback to a freshly generated (un-trimmed) move list:
 *   1. drop moves the user dismissed / completed,
 *   2. hide snoozed moves until their snooze expires,
 *   3. drop kinds that have been auto-muted,
 *   4. re-rank by severity, then learned-weight-adjusted score.
 *
 * Returns the reordered, filtered moves plus the list of muted kinds (so the UI
 * can say "you've muted X — undo?").
 */
export function applyFeedback(
  moves: NextMove[],
  feedback: MoveFeedbackRecord[],
  severityRank: Record<string, number>,
  now: number,
  config: FeedbackConfig = DEFAULT_FEEDBACK_CONFIG
): AppliedFeedback {
  if (feedback.length === 0) return { moves, muted: [] };

  const latest = latestActionByMove(feedback);
  const sentiment = summarizeKindSentiment(feedback, config);
  const mutedKinds = new Set([...sentiment.entries()].filter(([, s]) => s.muted).map(([k]) => k));

  const visible = moves.filter((m) => {
    if (mutedKinds.has(m.kind)) return false;
    const action = latest.get(m.id);
    if (!action) return true;
    if (action.action === "dismissed" || action.action === "completed") return false;
    if (action.action === "snoozed" && (action.snoozeUntil ?? 0) > now) return false;
    return true;
  });

  visible.sort((a, b) => {
    const sev = (severityRank[b.severity] ?? 0) - (severityRank[a.severity] ?? 0);
    if (sev !== 0) return sev;
    const wa = sentiment.get(a.kind)?.weight ?? 1;
    const wb = sentiment.get(b.kind)?.weight ?? 1;
    const adj = b.score * wb - a.score * wa;
    if (adj !== 0) return adj;
    return a.id.localeCompare(b.id);
  });

  return { moves: visible, muted: [...mutedKinds] };
}
