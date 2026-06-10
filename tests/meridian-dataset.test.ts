/**
 * Meridian dataset invariants + the engineered demo scenarios.
 * These tests encode the stories the demo and landing page depend on; if the
 * dataset drifts, the demo numbers stop telling the right story.
 */
import { describe, it, expect } from "vitest";
import {
  MERIDIAN_NOW,
  SCENARIO,
  meridian,
} from "../lib/meridian/dataset";
import {
  dealDivergence,
  getAllLedgers,
  getAttributionGap,
  getDealLedger,
  getKpis,
  getLeaderboard,
  getPartnerPulse,
  getPartnerSurfacedAction,
  isInterestingDeal,
} from "../lib/meridian/selectors";
import { DEFAULT_ROLE_MAP } from "../convex/lib/attribution/roles";
import { getAllModels } from "../convex/lib/attribution/registry";

const DAY = 86400000;
const wonDeals = meridian.deals.filter((d) => d.status === "won");

describe("meridian dataset shape", () => {
  it("has the brief's headline counts", () => {
    expect(meridian.partners.length).toBe(8);
    expect(meridian.deals.length).toBe(20);
    expect(meridian.touchpoints.length).toBeGreaterThanOrEqual(50);
    expect(meridian.programs.length).toBe(3);
  });

  it("has a won/open/lost mix", () => {
    const byStatus = (s: string) => meridian.deals.filter((d) => d.status === s).length;
    expect(byStatus("won")).toBe(9);
    expect(byStatus("open")).toBe(8);
    expect(byStatus("lost")).toBe(3);
  });

  it("is referentially intact", () => {
    const partnerIds = new Set(meridian.partners.map((p) => p._id));
    const dealIds = new Set(meridian.deals.map((d) => d._id));
    for (const t of meridian.touchpoints) {
      expect(partnerIds.has(t.partnerId), `touchpoint ${t._id} partner`).toBe(true);
      expect(dealIds.has(t.dealId), `touchpoint ${t._id} deal`).toBe(true);
    }
    for (const d of meridian.deals) {
      if (d.registeredBy) expect(partnerIds.has(d.registeredBy), `deal ${d._id} registeredBy`).toBe(true);
    }
    for (const program of meridian.programs) {
      for (const pid of program.partnerIds) {
        expect(partnerIds.has(pid), `program ${program.id} partner ${pid}`).toBe(true);
      }
    }
  });

  it("uses only schema touchpoint types (deriveRole never falls back)", () => {
    for (const t of meridian.touchpoints) {
      expect(DEFAULT_ROLE_MAP[t.type], `touchpoint ${t._id} type ${t.type}`).toBeDefined();
    }
  });

  it("is deterministic: all activity within 366 days of the fixed now", () => {
    for (const t of meridian.touchpoints) {
      expect(t.createdAt).toBeLessThanOrEqual(MERIDIAN_NOW);
      expect(t.createdAt).toBeGreaterThanOrEqual(MERIDIAN_NOW - 366 * DAY);
    }
    for (const d of meridian.deals) {
      expect(d.createdAt).toBeLessThanOrEqual(MERIDIAN_NOW);
      if (d.closedAt) expect(d.closedAt).toBeLessThanOrEqual(MERIDIAN_NOW);
    }
  });

  it("every won deal's ledger sums to 100% under every model", () => {
    for (const deal of wonDeals) {
      for (const model of getAllModels()) {
        const ledger = getDealLedger(deal._id, model);
        expect(ledger.length, `${deal._id} ${model}`).toBeGreaterThan(0);
        const total = ledger.reduce((s, e) => s + e.percentage, 0);
        expect(Math.abs(total - 100), `${deal._id} ${model} sums to ${total}`).toBeLessThan(0.01);
        for (const entry of ledger) expect(entry.reason.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("scenario 1 — the attribution gap (md_007)", () => {
  it("first-touch gives the registrant 100%", () => {
    const ledger = getDealLedger(SCENARIO.attributionGapDealId, "first_touch_sourcer");
    expect(ledger.length).toBe(1);
    expect(ledger[0].partnerId).toBe("mp_002");
    expect(ledger[0].percentage).toBe(100);
  });

  it("role-weighted drops the registrant below 60% and credits two others", () => {
    const ledger = getDealLedger(SCENARIO.attributionGapDealId, "role_weighted");
    const bluepeak = ledger.find((e) => e.partnerId === "mp_002");
    expect(bluepeak).toBeDefined();
    expect(bluepeak!.percentage).toBeLessThan(60);
    expect(ledger.length).toBeGreaterThanOrEqual(3);
  });

  it("the dataset-wide gap number is meaningful (six figures)", () => {
    const gap = getAttributionGap();
    expect(gap.hiddenRevenue).toBeGreaterThan(100000);
    expect(gap.dealsAffected).toBeGreaterThanOrEqual(5);
  });
});

describe("scenario 2 — the invisible implementer (Quietwater, mp_006)", () => {
  const id = SCENARIO.dormantImplementerPartnerId;

  it("is invisible under first-touch", () => {
    const row = getLeaderboard("first_touch_sourcer").find((r) => r.partner._id === id);
    expect(row).toBeDefined();
    expect(row!.credit).toBe(0);
  });

  it("is the #1 partner under implementation credit", () => {
    const board = getLeaderboard("implementation_credit");
    expect(board[0].partner._id).toBe(id);
    expect(board[0].credit).toBeGreaterThan(board[1].credit);
  });

  it("gets the 'invite into sourcing' action", () => {
    const action = getPartnerSurfacedAction(id);
    expect(action).not.toBeNull();
    expect(action!.title).toContain("referral program");
  });
});

describe("scenario 3 — the co-sell deal (md_012)", () => {
  it("three models produce three materially different splits", () => {
    const ledgers = getAllLedgers(SCENARIO.cosellDealId);
    const splitOf = (model: keyof typeof ledgers) =>
      ledgers[model]
        .map((e) => `${e.partnerId}:${Math.round(e.percentage)}`)
        .sort()
        .join("|");
    const splits = [
      splitOf("first_touch_sourcer"),
      splitOf("split_equally"),
      splitOf("marketplace_cosell_hybrid"),
    ];
    expect(new Set(splits).size).toBe(3);
  });

  it("the marketplace listing classifies as the hyperscaler party", () => {
    const ledger = getDealLedger(SCENARIO.cosellDealId, "marketplace_cosell_hybrid");
    const aws = ledger.find((e) => e.partnerId === "mp_008");
    expect(aws).toBeDefined();
    expect(aws!.reason).toContain("hyperscaler");
  });
});

describe("scenario 4 — the flagship deal (md_003)", () => {
  it("has four partners covering all four roles under role-weighted", () => {
    const ledger = getDealLedger(SCENARIO.flagshipDealId, "role_weighted");
    expect(ledger.length).toBe(4);
    expect(new Set(ledger.map((e) => e.role)).size).toBe(4);
  });

  it("diverges enough to earn the 'models disagree' flag", () => {
    expect(dealDivergence(SCENARIO.flagshipDealId)).toBeGreaterThanOrEqual(25);
  });
});

describe("the 'models disagree' flag", () => {
  it("flags the scenario deals", () => {
    expect(isInterestingDeal(SCENARIO.flagshipDealId)).toBe(true);
    expect(isInterestingDeal(SCENARIO.attributionGapDealId)).toBe(true);
    expect(isInterestingDeal(SCENARIO.cosellDealId)).toBe(true);
  });

  it("stays a spotlight, not background noise", () => {
    const flagged = meridian.deals.filter((d) => isInterestingDeal(d._id));
    expect(flagged.length).toBeGreaterThanOrEqual(3);
    expect(flagged.length).toBeLessThanOrEqual(8);
  });
});

describe("partner pulse", () => {
  const BANNED = ["streamline", "leverage", "holistic", "best-in-class", "AI-powered"];
  const allStrings = (partnerId: string): string[] => {
    const pulse = getPartnerPulse(partnerId)!;
    return [pulse.summary, ...pulse.items.flatMap((i) => [i.title, i.detail])];
  };

  it("exists, is deterministic, and is well-formed for every partner", () => {
    for (const partner of meridian.partners) {
      const pulse = getPartnerPulse(partner._id);
      expect(pulse, partner._id).not.toBeNull();
      expect(getPartnerPulse(partner._id)).toEqual(pulse); // same input, same pulse
      expect(pulse!.asOf).toBe(MERIDIAN_NOW);
      expect(pulse!.items.length, partner._id).toBeGreaterThanOrEqual(2);
      expect(pulse!.items.length, partner._id).toBeLessThanOrEqual(3);
      expect(pulse!.tier.progress).toBeGreaterThanOrEqual(0);
      expect(pulse!.tier.progress).toBeLessThanOrEqual(100);
      expect(pulse!.pendingPayout.amount).toBeGreaterThanOrEqual(0);
      expect(pulse!.summary.length).toBeGreaterThan(0);
      for (const item of pulse!.items) {
        expect(item.title.length, partner._id).toBeGreaterThan(0);
        expect(item.detail.length, partner._id).toBeGreaterThan(0);
      }
    }
  });

  it("unknown partners get null, not a fabricated morning", () => {
    expect(getPartnerPulse("mp_999")).toBeNull();
  });

  it("hero partner (Bluepeak, mp_002) wakes up to the full story", () => {
    const pulse = getPartnerPulse(SCENARIO.pulseHeroPartnerId)!;
    const closePush = pulse.items.find((i) => i.kind === "close_push");
    expect(closePush).toBeDefined();
    expect(closePush!.dealId).toBe("md_011"); // Meridian West Clinics, 14 days out
    expect(pulse.pendingPayout.amount).toBeGreaterThan(0);
    expect(pulse.pendingPayout.deals.map((d) => d.dealId)).toContain("md_007");
    expect(pulse.tier.next).toBe("platinum");
    expect(pulse.tier.progress).toBeGreaterThanOrEqual(40);
    expect(pulse.tier.progress).toBeLessThanOrEqual(70);
  });

  it("a platinum partner (mp_001) has no tier chase", () => {
    const pulse = getPartnerPulse("mp_001")!;
    expect(pulse.tier.next).toBeNull();
    expect(pulse.items.some((i) => i.kind === "tier")).toBe(false);
  });

  it("surfaces Vector's stuck registration (mp_005 → md_014)", () => {
    const pulse = getPartnerPulse("mp_005")!;
    const reg = pulse.items.find((i) => i.kind === "registration_pending");
    expect(reg).toBeDefined();
    expect(reg!.dealId).toBe("md_014");
  });

  it("never references the same deal twice in one morning", () => {
    for (const partner of meridian.partners) {
      const dealIds = getPartnerPulse(partner._id)!
        .items.map((i) => i.dealId)
        .filter(Boolean);
      expect(new Set(dealIds).size, partner._id).toBe(dealIds.length);
    }
  });

  it("obeys the marketing copy rules", () => {
    for (const partner of meridian.partners) {
      for (const text of allStrings(partner._id)) {
        for (const word of BANNED) {
          expect(text.toLowerCase(), `${partner._id}: "${text}"`).not.toContain(word.toLowerCase());
        }
      }
    }
  });
});

describe("kpis & leaderboard", () => {
  it("KPIs move when the model changes", () => {
    const firstTouch = getKpis("first_touch_sourcer");
    const roleWeighted = getKpis("role_weighted");
    expect(firstTouch.influencedArr).toBe(roleWeighted.influencedArr); // model-independent
    expect(firstTouch.sourcedArr).not.toBe(roleWeighted.sourcedArr);
    expect(firstTouch.multiPartnerDeals).toBeLessThan(roleWeighted.multiPartnerDeals);
  });

  it("leaderboard ranks every partner and shares sum to 100", () => {
    for (const model of getAllModels()) {
      const board = getLeaderboard(model);
      expect(board.length).toBe(meridian.partners.length);
      const totalShare = board.reduce((s, r) => s + r.share, 0);
      expect(Math.abs(totalShare - 100)).toBeLessThan(0.01);
      board.forEach((row, i) => expect(row.rank).toBe(i + 1));
    }
  });

  it("rank deltas vs first-touch are stable and self-consistent", () => {
    const board = getLeaderboard("implementation_credit");
    const quietwater = board.find((r) => r.partner._id === "mp_006")!;
    expect(quietwater.deltaVsFirstTouch).toBeGreaterThan(0); // climbed vs the CRM view
  });
});
