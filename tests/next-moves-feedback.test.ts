/**
 * Feedback-aware ranking — unit tests for the "learns on itself" layer.
 *
 * Run with: npx vitest run tests/next-moves-feedback.test.ts
 */

import { describe, it, expect } from "vitest";
import { applyFeedback, type MoveFeedbackRecord } from "../convex/lib/nextMoves/feedback";
import { generateNextMoves } from "../convex/lib/nextMoves";
import { SEVERITY_RANK } from "../convex/lib/nextMoves/types";
import type { NextMove, NextMoveAgent, NextMoveSeverity } from "../convex/lib/nextMoves/types";

const NOW = 1_750_000_000_000;

function move(id: string, kind: string, agent: NextMoveAgent, severity: NextMoveSeverity, score: number): NextMove {
  return {
    id,
    agent,
    kind,
    severity,
    title: `${kind} ${id}`,
    detail: "detail",
    evidence: { reason: "because" },
    suggestedAction: "do it",
    score,
  };
}

function fb(moveId: string, moveKind: string, action: MoveFeedbackRecord["action"], extra: Partial<MoveFeedbackRecord> = {}): MoveFeedbackRecord {
  return { moveId, moveKind, action, createdAt: NOW, ...extra };
}

describe("applyFeedback", () => {
  it("returns moves unchanged when there's no feedback", () => {
    const moves = [move("a", "tier_up", "pam", "med", 50)];
    const res = applyFeedback(moves, [], SEVERITY_RANK, NOW);
    expect(res.moves).toEqual(moves);
    expect(res.muted).toEqual([]);
  });

  it("suppresses a dismissed move", () => {
    const moves = [move("a", "tier_up", "pam", "med", 50), move("b", "coverage_gap", "psm", "med", 50)];
    const res = applyFeedback(moves, [fb("a", "tier_up", "dismissed")], SEVERITY_RANK, NOW);
    expect(res.moves.map((m) => m.id)).toEqual(["b"]);
  });

  it("hides a snoozed move until the snooze expires", () => {
    const moves = [move("a", "tier_up", "pam", "med", 50)];
    const feedback = [fb("a", "tier_up", "snoozed", { snoozeUntil: NOW + 10_000 })];
    expect(applyFeedback(moves, feedback, SEVERITY_RANK, NOW).moves).toHaveLength(0);
    expect(applyFeedback(moves, feedback, SEVERITY_RANK, NOW + 20_000).moves).toHaveLength(1);
  });

  it("suppresses a completed (acted-on) move", () => {
    const moves = [move("a", "tier_up", "pam", "med", 50)];
    const res = applyFeedback(moves, [fb("a", "tier_up", "completed")], SEVERITY_RANK, NOW);
    expect(res.moves).toHaveLength(0);
  });

  it("uses the latest action when a move has multiple feedback entries", () => {
    const moves = [move("a", "tier_up", "pam", "med", 50)];
    const feedback = [
      fb("a", "tier_up", "dismissed", { createdAt: NOW }),
      fb("a", "tier_up", "accepted", { createdAt: NOW + 1000 }), // newer → not suppressed
    ];
    expect(applyFeedback(moves, feedback, SEVERITY_RANK, NOW + 2000).moves).toHaveLength(1);
  });

  it("ranks an accepted kind above a neutral kind at equal severity/score", () => {
    const moves = [move("a", "tier_up", "pam", "med", 50), move("b", "coverage_gap", "psm", "med", 50)];
    // coverage_gap gets two accepts on OTHER moves of the same kind
    const feedback = [fb("x", "coverage_gap", "accepted"), fb("y", "coverage_gap", "accepted")];
    const res = applyFeedback(moves, feedback, SEVERITY_RANK, NOW);
    expect(res.moves[0].kind).toBe("coverage_gap");
  });

  it("auto-mutes a kind after repeated dismissals with no positives", () => {
    const moves = [move("a", "tier_up", "pam", "high", 90), move("b", "coverage_gap", "psm", "med", 50)];
    const feedback = [
      fb("x", "tier_up", "dismissed"),
      fb("y", "tier_up", "dismissed"),
      fb("z", "tier_up", "dismissed"),
    ];
    const res = applyFeedback(moves, feedback, SEVERITY_RANK, NOW);
    expect(res.muted).toContain("tier_up");
    expect(res.moves.map((m) => m.kind)).toEqual(["coverage_gap"]);
  });
});

describe("generateNextMoves with feedback", () => {
  function fixture() {
    return {
      partners: [
        { _id: "p1", name: "Apex", tier: "bronze", status: "active", createdAt: NOW - 200 * 86400000 },
        { _id: "p2", name: "Newbie", tier: "bronze", status: "active", createdAt: NOW - 5 * 86400000 },
      ],
      deals: [
        { _id: "d1", name: "Won", amount: 100000, status: "won", createdAt: NOW - 120 * 86400000, closedAt: NOW - 100 * 86400000 },
        { _id: "d2", name: "Open Gap", amount: 150000, status: "open", createdAt: NOW - 8 * 86400000 },
      ],
      touchpoints: [{ dealId: "d1", partnerId: "p1", type: "deal_registration", createdAt: NOW - 118 * 86400000 }],
      attributions: [{ partnerId: "p1", model: "role_weighted", amount: 100000 }],
      payouts: [],
      now: NOW,
    };
  }

  it("drops a move once it's dismissed", () => {
    const base = generateNextMoves(fixture(), { limit: 50 });
    const gap = base.moves.find((m) => m.kind === "coverage_gap");
    expect(gap).toBeTruthy();

    const withFb = generateNextMoves(
      { ...fixture(), feedback: [{ moveId: gap!.id, moveKind: "coverage_gap", action: "dismissed", createdAt: NOW }] },
      { limit: 50 }
    );
    expect(withFb.moves.some((m) => m.id === gap!.id)).toBe(false);
  });

  it("always returns a muted array", () => {
    expect(generateNextMoves(fixture(), { limit: 50 }).muted).toEqual([]);
  });
});
