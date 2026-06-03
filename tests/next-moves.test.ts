/**
 * Next-moves engine — unit tests.
 *
 * A deterministic synthetic fixture forces each generator to fire, then we
 * assert the cross-cutting invariants (every move is evidence-backed, severity
 * ordering, limit). A final smoke test runs the engine over the real demo
 * dataset to confirm it composes end-to-end.
 *
 * Run with: npx vitest run tests/next-moves.test.ts
 */

import { describe, it, expect } from "vitest";
import { generateNextMoves } from "../convex/lib/nextMoves";
import { SEVERITY_RANK } from "../convex/lib/nextMoves/types";
import type {
  NMAttribution,
  NMDeal,
  NMPartner,
  NMPayout,
  NMTouchpoint,
  NextMovesInput,
} from "../convex/lib/nextMoves/types";

const DAY = 86400000;
// Anchor to real "now" so the scoring core's internal Date.now() lines up with
// the fixture's relative timestamps (drift is milliseconds vs day-wide windows).
const T = Date.now();

function buildFixture(): NextMovesInput {
  const partners: NMPartner[] = [
    { _id: "p1", name: "Apex", tier: "bronze", status: "active", createdAt: T - 200 * DAY },
    { _id: "p2", name: "Nova", tier: "gold", status: "active", createdAt: T - 200 * DAY },
    { _id: "p3", name: "Newbie", tier: "bronze", status: "active", createdAt: T - 5 * DAY },
    { _id: "p5", name: "Drift", tier: "bronze", status: "active", createdAt: T - 200 * DAY },
    { _id: "p4", name: "Coast", tier: "bronze", status: "inactive", createdAt: T - 200 * DAY },
  ];

  const deals: NMDeal[] = [
    { _id: "dWon1", name: "Won — Apex", amount: 100000, status: "won", createdAt: T - 120 * DAY, closedAt: T - 100 * DAY },
    { _id: "dWon2", name: "Won — Drift", amount: 50000, status: "won", createdAt: T - 90 * DAY, closedAt: T - 80 * DAY },
    { _id: "dCovered", name: "Covered Open", amount: 80000, status: "open", createdAt: T - 10 * DAY },
    { _id: "dGap", name: "Big Uncovered", amount: 150000, status: "open", createdAt: T - 8 * DAY },
    { _id: "dCoSell", name: "Co-sell Deal", amount: 120000, status: "open", createdAt: T - 6 * DAY },
    { _id: "dPending", name: "Pending Reg", amount: 30000, status: "open", createdAt: T - 3 * DAY, registrationStatus: "pending" },
  ];

  const touchpoints: NMTouchpoint[] = [
    { dealId: "dWon1", partnerId: "p1", type: "deal_registration", createdAt: T - 118 * DAY },
    { dealId: "dCovered", partnerId: "p1", type: "demo", createdAt: T - 9 * DAY },
    { dealId: "dCoSell", partnerId: "p1", type: "co_sell", createdAt: T - 6 * DAY },
    { dealId: "dCoSell", partnerId: "p2", type: "co_sell", createdAt: T - 5 * DAY },
    // p5: only older touchpoints (30–60d) → trend "down", low engagement
    { dealId: "dWon2", partnerId: "p5", type: "demo", createdAt: T - 45 * DAY },
    { dealId: "dWon2", partnerId: "p5", type: "proposal", createdAt: T - 50 * DAY },
  ];

  const attributions: NMAttribution[] = [
    { partnerId: "p1", model: "role_weighted", amount: 100000 },
  ];

  const payouts: NMPayout[] = [
    { partnerId: "p1", amount: 12000, status: "pending_approval", createdAt: T - 20 * DAY },
  ];

  return { partners, deals, touchpoints, attributions, payouts, now: T };
}

describe("next-moves engine", () => {
  it("surfaces a move from every agent lens", () => {
    const { moves } = generateNextMoves(buildFixture(), { limit: 50 });
    const kinds = new Set(moves.map((m) => m.kind));

    expect(kinds.has("tier_up")).toBe(true); // PAM — Apex bronze → platinum
    expect(kinds.has("tier_risk")).toBe(true); // PAM — Nova gold → bronze
    expect(kinds.has("health_drop")).toBe(true); // PAM — Drift cooling off
    expect(kinds.has("coverage_gap")).toBe(true); // PSM — Big Uncovered
    expect(kinds.has("co_sell")).toBe(true); // PSM — Co-sell Deal
    expect(kinds.has("pending_registrations")).toBe(true); // Ops
    expect(kinds.has("aging_payouts")).toBe(true); // Ops
    expect(kinds.has("ramp_stalled")).toBe(true); // Program — Newbie

    const agents = new Set(moves.map((m) => m.agent));
    expect(agents).toEqual(new Set(["psm", "pam", "program", "ops"]));
  });

  it("tier-up points at the right partner with high severity", () => {
    const { moves } = generateNextMoves(buildFixture(), { limit: 50 });
    const tierUp = moves.find((m) => m.kind === "tier_up");
    expect(tierUp?.evidence.partnerId).toBe("p1");
    expect(tierUp?.severity).toBe("high");
    expect(tierUp?.title).toContain("Apex");
  });

  it("coverage gap targets the above-average uncovered open deal", () => {
    const { moves } = generateNextMoves(buildFixture(), { limit: 50 });
    const gaps = moves.filter((m) => m.kind === "coverage_gap");
    expect(gaps.map((g) => g.evidence.dealId)).toEqual(["dGap"]);
    // recommends the top-ranked active partner
    expect(gaps[0].evidence.partnerId).toBeTruthy();
  });

  it("co-sell names the deal with two partners", () => {
    const { moves } = generateNextMoves(buildFixture(), { limit: 50 });
    const cosell = moves.find((m) => m.kind === "co_sell");
    expect(cosell?.evidence.dealId).toBe("dCoSell");
    expect(cosell?.detail).toContain("Apex");
    expect(cosell?.detail).toContain("Nova");
  });

  it("excludes inactive partners", () => {
    const { moves } = generateNextMoves(buildFixture(), { limit: 50 });
    expect(moves.some((m) => m.evidence.partnerId === "p4")).toBe(false);
  });

  it("every move is evidence-backed", () => {
    const { moves } = generateNextMoves(buildFixture(), { limit: 50 });
    expect(moves.length).toBeGreaterThan(0);
    for (const m of moves) {
      expect(m.evidence.reason.trim().length).toBeGreaterThan(0);
      expect(m.title.trim().length).toBeGreaterThan(0);
      expect(m.suggestedAction.trim().length).toBeGreaterThan(0);
    }
  });

  it("ranks by severity then trims to the limit", () => {
    const { moves, counts } = generateNextMoves(buildFixture(), { limit: 4 });
    expect(moves.length).toBe(4);
    for (let i = 1; i < moves.length; i++) {
      expect(SEVERITY_RANK[moves[i - 1].severity]).toBeGreaterThanOrEqual(
        SEVERITY_RANK[moves[i].severity]
      );
    }
    const total = counts.psm + counts.pam + counts.program + counts.ops;
    expect(total).toBe(4);
  });

  it("returns an empty feed for an empty org without throwing", () => {
    const res = generateNextMoves(
      { partners: [], deals: [], touchpoints: [], attributions: [], payouts: [], now: T },
      {}
    );
    expect(res.moves).toEqual([]);
    expect(res.counts).toEqual({ psm: 0, pam: 0, program: 0, ops: 0 });
  });

  it("computes scores internally when none are provided", () => {
    const fx = buildFixture();
    delete fx.scores;
    const res = generateNextMoves(fx, { limit: 50 });
    expect(res.moves.some((m) => m.kind === "tier_up")).toBe(true);
  });
});

describe("next-moves over the demo dataset (smoke)", () => {
  it("composes end-to-end on real demo fixtures", async () => {
    const { demoPartners, demoDeals, demoTouchpoints, demoAttributions, demoPayouts } = await import(
      "../lib/demo-data"
    );
    const res = generateNextMoves({
      partners: demoPartners as unknown as NMPartner[],
      deals: demoDeals as unknown as NMDeal[],
      touchpoints: demoTouchpoints as unknown as NMTouchpoint[],
      attributions: demoAttributions as unknown as NMAttribution[],
      payouts: demoPayouts as unknown as NMPayout[],
    });
    expect(Array.isArray(res.moves)).toBe(true);
    for (const m of res.moves) {
      expect(m.evidence.reason.trim().length).toBeGreaterThan(0);
      expect(["psm", "pam", "program", "ops"]).toContain(m.agent);
    }
    const total = res.counts.psm + res.counts.pam + res.counts.program + res.counts.ops;
    expect(total).toBe(res.moves.length);
  });
});
