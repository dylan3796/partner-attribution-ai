/**
 * Derived views over the Meridian dataset — pure, deterministic, memoized.
 * Runs the real attribution engine (runModel) exactly like lib/demo-data.ts;
 * no Convex, no Date.now(). Relative imports keep these usable from vitest
 * (no @/ alias there).
 */
import type { AttributionModel, Deal, Partner, Touchpoint } from "../types";
import { MODEL_LABELS } from "../types";
import { runModel, getAllModels } from "../../convex/lib/attribution/registry";
import { deriveRole } from "../../convex/lib/attribution/roles";
import type { LedgerEntry, TouchpointInput } from "../../convex/lib/attribution/types";
import { MERIDIAN_NOW, SCENARIO, meridian } from "./dataset";

const DAY = 86400000;

const partnerById = new Map(meridian.partners.map((p) => [p._id, p]));
const dealById = new Map(meridian.deals.map((d) => [d._id, d]));
const touchpointsByDeal = new Map<string, Touchpoint[]>();
for (const t of meridian.touchpoints) {
  const list = touchpointsByDeal.get(t.dealId) ?? [];
  list.push(t);
  touchpointsByDeal.set(t.dealId, list);
}

export function getPartner(partnerId: string): Partner | undefined {
  return partnerById.get(partnerId);
}
export function getDeal(dealId: string): Deal | undefined {
  return dealById.get(dealId);
}
export function getDealTouchpoints(dealId: string): Touchpoint[] {
  return touchpointsByDeal.get(dealId) ?? [];
}
export function getPartnerTouchpoints(partnerId: string): Touchpoint[] {
  return meridian.touchpoints.filter((t) => t.partnerId === partnerId);
}
export function getPartnerDeals(partnerId: string): Deal[] {
  const dealIds = new Set(getPartnerTouchpoints(partnerId).map((t) => t.dealId));
  return meridian.deals.filter((d) => dealIds.has(d._id));
}

function toModelTouchpoints(dealTouchpoints: Touchpoint[]): TouchpointInput[] {
  return dealTouchpoints.map((t) => {
    const partner = partnerById.get(t.partnerId);
    return {
      partnerId: t.partnerId,
      partnerName: partner?.name ?? t.partnerId,
      partnerType: partner?.type,
      commissionRate: partner?.commissionRate ?? 10,
      type: t.type,
      role: deriveRole(t.type),
      createdAt: t.createdAt,
      weight: t.weight,
    };
  });
}

// ── Ledgers (memoized; the whole dataset × 5 models is ~100 runModel calls) ──

const ledgerCache = new Map<string, LedgerEntry[]>();

export function getDealLedger(dealId: string, model: AttributionModel): LedgerEntry[] {
  const key = `${dealId}:${model}`;
  const cached = ledgerCache.get(key);
  if (cached) return cached;
  const deal = dealById.get(dealId);
  const touchpoints = toModelTouchpoints(getDealTouchpoints(dealId));
  const ledger =
    !deal || touchpoints.length === 0
      ? []
      : runModel(model, { id: deal._id, amount: deal.amount, registeredBy: deal.registeredBy, closedAt: deal.closedAt }, touchpoints);
  ledgerCache.set(key, ledger);
  return ledger;
}

export function getAllLedgers(dealId: string): Record<AttributionModel, LedgerEntry[]> {
  const out = {} as Record<AttributionModel, LedgerEntry[]>;
  for (const model of getAllModels()) out[model] = getDealLedger(dealId, model);
  return out;
}

// ── KPIs ──

export interface MeridianKpis {
  /** Won-deal ARR with at least one partner touch (model-independent). */
  influencedArr: number;
  /** Won-deal dollars credited to partners in a sourcer role under this model. */
  sourcedArr: number;
  /** Won deals where this model credits 2+ partners. */
  multiPartnerDeals: number;
  /** Active partners with a touchpoint in the last 90 days (model-independent). */
  activePartners: number;
}

const wonDeals = meridian.deals.filter((d) => d.status === "won");

export function getKpis(model: AttributionModel): MeridianKpis {
  let influencedArr = 0;
  let sourcedArr = 0;
  let multiPartnerDeals = 0;
  for (const deal of wonDeals) {
    const ledger = getDealLedger(deal._id, model);
    if (ledger.length === 0) continue;
    influencedArr += deal.amount;
    if (ledger.length >= 2) multiPartnerDeals += 1;
    for (const entry of ledger) {
      if (entry.role === "sourcer") sourcedArr += entry.amount;
    }
  }
  const cutoff = MERIDIAN_NOW - 90 * DAY;
  const recentlyActive = new Set(
    meridian.touchpoints.filter((t) => t.createdAt >= cutoff).map((t) => t.partnerId)
  );
  const activePartners = meridian.partners.filter(
    (p) => p.status === "active" && recentlyActive.has(p._id)
  ).length;
  return { influencedArr, sourcedArr, multiPartnerDeals, activePartners };
}

// ── Leaderboard ──

export interface LeaderboardRow {
  partner: Partner;
  /** Won-deal dollars credited under the selected model. */
  credit: number;
  /** Share of total credited dollars, 0-100. */
  share: number;
  rank: number;
  /** Rank movement vs the first-touch (CRM) view. +2 = two places higher. */
  deltaVsFirstTouch: number;
}

function creditByPartner(model: AttributionModel): Map<string, number> {
  const credit = new Map<string, number>();
  for (const partner of meridian.partners) credit.set(partner._id, 0);
  for (const deal of wonDeals) {
    for (const entry of getDealLedger(deal._id, model)) {
      credit.set(entry.partnerId, (credit.get(entry.partnerId) ?? 0) + entry.amount);
    }
  }
  return credit;
}

function rankOrder(model: AttributionModel): string[] {
  return Array.from(creditByPartner(model).entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([partnerId]) => partnerId);
}

export function getLeaderboard(model: AttributionModel): LeaderboardRow[] {
  const credit = creditByPartner(model);
  const total = Array.from(credit.values()).reduce((s, v) => s + v, 0);
  const baseline = rankOrder("first_touch_sourcer");
  return rankOrder(model).map((partnerId, i) => {
    const amount = credit.get(partnerId) ?? 0;
    return {
      partner: partnerById.get(partnerId)!,
      credit: amount,
      share: total > 0 ? (amount / total) * 100 : 0,
      rank: i + 1,
      deltaVsFirstTouch: baseline.indexOf(partnerId) - i,
    };
  });
}

// ── Model divergence (the "models disagree" flag) ──

export function dealDivergence(dealId: string): number {
  const ledgers = getAllLedgers(dealId);
  const partnerIds = new Set<string>();
  for (const ledger of Object.values(ledgers)) {
    for (const entry of ledger) partnerIds.add(entry.partnerId);
  }
  let divergence = 0;
  for (const partnerId of partnerIds) {
    let min = Infinity;
    let max = -Infinity;
    for (const ledger of Object.values(ledgers)) {
      const pct = ledger.find((e) => e.partnerId === partnerId)?.percentage ?? 0;
      min = Math.min(min, pct);
      max = Math.max(max, pct);
    }
    divergence = Math.max(divergence, max - min);
  }
  return divergence;
}

/**
 * The amber "models disagree" flag. Winner-take-all models guarantee big
 * divergence on any two-partner deal, so the flag requires a genuinely
 * contested deal: three or more partners AND a sharp spread.
 */
export function isInterestingDeal(dealId: string): boolean {
  const partners = new Set(getDealTouchpoints(dealId).map((t) => t.partnerId));
  return partners.size >= 3 && dealDivergence(dealId) >= 50;
}

// ── The attribution gap (landing-page headline number) ──

export interface AttributionGap {
  /** Won-deal dollars the CRM's first-touch view assigns to the registrant
   *  that the role-weighted view assigns to other partners. */
  hiddenRevenue: number;
  /** Won deals where the two views disagree. */
  dealsAffected: number;
}

export function getAttributionGap(): AttributionGap {
  let hiddenRevenue = 0;
  let dealsAffected = 0;
  for (const deal of wonDeals) {
    const firstTouch = getDealLedger(deal._id, "first_touch_sourcer");
    if (firstTouch.length === 0) continue;
    const winner = firstTouch[0];
    const roleWeighted = getDealLedger(deal._id, "role_weighted");
    const winnerUnderRoles = roleWeighted.find((e) => e.partnerId === winner.partnerId)?.amount ?? 0;
    const gap = winner.amount - winnerUnderRoles;
    if (gap > 0.01) {
      hiddenRevenue += gap;
      dealsAffected += 1;
    }
  }
  return { hiddenRevenue, dealsAffected };
}

// ── Partner scorecard ──

const TIER_ORDER = ["bronze", "silver", "gold", "platinum"] as const;
/** Won-deal credit (role-weighted) needed to reach each tier. */
const TIER_THRESHOLDS: Record<(typeof TIER_ORDER)[number], number> = {
  bronze: 0,
  silver: 100000,
  gold: 300000,
  platinum: 750000,
};

export interface PartnerScorecard {
  partner: Partner;
  /** Won-deal credit per model. */
  creditByModel: Record<AttributionModel, number>;
  modelLabels: Record<AttributionModel, string>;
  dealsTouched: number;
  openPipeline: number;
  lastActivityAt: number | null;
  daysSinceActivity: number | null;
  nextTier: string | null;
  /** 0-100 progress toward the next tier (role-weighted credit). */
  tierProgress: number;
}

export function getPartnerScorecard(partnerId: string): PartnerScorecard | null {
  const partner = partnerById.get(partnerId);
  if (!partner) return null;

  const creditByModel = {} as Record<AttributionModel, number>;
  for (const model of getAllModels()) {
    creditByModel[model] = creditByPartner(model).get(partnerId) ?? 0;
  }

  const touches = getPartnerTouchpoints(partnerId);
  const deals = getPartnerDeals(partnerId);
  const openPipeline = deals
    .filter((d) => d.status === "open")
    .reduce((s, d) => s + d.amount, 0);
  const lastActivityAt = touches.length
    ? Math.max(...touches.map((t) => t.createdAt))
    : null;

  const tierIndex = TIER_ORDER.indexOf((partner.tier ?? "bronze") as (typeof TIER_ORDER)[number]);
  const nextTier = tierIndex >= 0 && tierIndex < TIER_ORDER.length - 1 ? TIER_ORDER[tierIndex + 1] : null;
  const tierProgress = nextTier
    ? Math.min(100, (creditByModel.role_weighted / TIER_THRESHOLDS[nextTier]) * 100)
    : 100;

  return {
    partner,
    creditByModel,
    modelLabels: MODEL_LABELS,
    dealsTouched: deals.length,
    openPipeline,
    lastActivityAt,
    daysSinceActivity: lastActivityAt ? Math.round((MERIDIAN_NOW - lastActivityAt) / DAY) : null,
    nextTier,
    tierProgress,
  };
}

// ── The one surfaced action on the partner view ──
// A small deterministic heuristic; the full multi-rule engine is a follow-up.

export interface SurfacedAction {
  title: string;
  why: string;
}

export function getPartnerSurfacedAction(partnerId: string): SurfacedAction | null {
  const card = getPartnerScorecard(partnerId);
  if (!card) return null;
  const { partner } = card;
  const firstName = partner.contactName?.split(" ")[0];

  // Delivers but never sources — invite them into the sourcing motion.
  if (card.creditByModel.first_touch_sourcer === 0 && card.creditByModel.implementation_credit > 0) {
    return {
      title: `Invite ${partner.name} into the referral program`,
      why: `Zero sourced deals in 12 months, but $${Math.round(card.creditByModel.implementation_credit / 1000)}k of won revenue under implementation credit. They already deliver your product — help them source it.`,
    };
  }

  // Gone quiet or marked inactive — re-engage before the relationship lapses.
  if (partner.status === "inactive" || (card.daysSinceActivity ?? 0) > 90) {
    return {
      title: `Schedule a re-engagement call with ${partner.name}`,
      why: `No activity in ${card.daysSinceActivity ?? "90+"} days${partner.status === "inactive" ? " and the partnership is marked inactive" : ""}. A QBR now decides whether to reinvest or sunset.`,
    };
  }

  // A close-dated open deal they're on — put energy where the quarter is.
  const closingSoon = getPartnerDeals(partnerId)
    .filter((d) => d.status === "open" && d.expectedCloseDate && d.expectedCloseDate - MERIDIAN_NOW <= 21 * DAY)
    .sort((a, b) => (a.expectedCloseDate ?? 0) - (b.expectedCloseDate ?? 0))[0];
  if (closingSoon) {
    const days = Math.round(((closingSoon.expectedCloseDate ?? MERIDIAN_NOW) - MERIDIAN_NOW) / DAY);
    return {
      title: `Work ${closingSoon.name.split(" — ")[0]} to close${firstName ? ` with ${firstName}` : ""}`,
      why: `${closingSoon.name} ($${Math.round(closingSoon.amount / 1000)}k) is expected to close in ${days} days and ${partner.name} is on it. A joint push now is the highest-leverage move this month.`,
    };
  }

  // Close to the next tier — review proactively instead of at renewal.
  if (card.nextTier && card.tierProgress >= 80) {
    return {
      title: `Run a tier review for ${partner.name}`,
      why: `${Math.round(card.tierProgress)}% of the way to ${card.nextTier}. Confirming the upgrade before they ask builds the relationship; surprising them at renewal doesn't.`,
    };
  }

  return {
    title: `Share this quarter's enablement kit with ${partner.name}`,
    why: `Steady activity (last touch ${card.daysSinceActivity ?? 0} days ago) with room to grow share of pipeline. Fresh enablement is the cheapest nudge.`,
  };
}

// ── The partner's daily pulse (landing hero + demo partner view) ──
// Partner-voice, unlike getPartnerSurfacedAction above (vendor-voice).

export type PulseItemKind =
  | "close_push"
  | "payout"
  | "registration_pending"
  | "stalled"
  | "tier"
  | "enablement";

export interface PulseItem {
  kind: PulseItemKind;
  /** Partner-voice headline, e.g. "Push Meridian West Clinics across the line". */
  title: string;
  detail: string;
  dealId?: string;
}

export interface PartnerPulse {
  partner: Partner;
  asOf: number;
  /** One-line morning summary, e.g. "1 deal closing soon, 4 wins paying out, 54% to platinum." */
  summary: string;
  /** 2–3 items, priority-ordered; the first is the lead action. */
  items: PulseItem[];
  tier: { current: string; next: string | null; progress: number };
  pendingPayout: {
    /** Commission dollars from won deals closed in the last 30 days. */
    amount: number;
    /** Per-deal role-weighted credit (pre-commission) behind that amount. */
    deals: { dealId: string; dealName: string; credit: number }[];
  };
}

const fmtK = (amount: number) => `$${Math.round(amount / 1000)}k`;
const shortName = (deal: Deal) => deal.name.split(" — ")[0];

export function getPartnerPulse(partnerId: string): PartnerPulse | null {
  const card = getPartnerScorecard(partnerId);
  if (!card) return null;
  const { partner } = card;
  const rate = partner.commissionRate ?? 10;
  const deals = getPartnerDeals(partnerId);
  const touches = getPartnerTouchpoints(partnerId);
  const lastTouchOn = (dealId: string): number | null => {
    const own = touches.filter((t) => t.dealId === dealId);
    return own.length ? Math.max(...own.map((t) => t.createdAt)) : null;
  };

  const payoutDeals = deals
    .filter((d) => d.status === "won" && d.closedAt && MERIDIAN_NOW - d.closedAt <= 30 * DAY)
    .map((d) => ({
      deal: d,
      credit: getDealLedger(d._id, "role_weighted").find((e) => e.partnerId === partnerId)?.amount ?? 0,
    }))
    .filter((x) => x.credit > 0)
    .sort((a, b) => b.credit - a.credit);
  const pendingPayout = {
    amount: payoutDeals.reduce((s, x) => s + (x.credit * rate) / 100, 0),
    deals: payoutDeals.map((x) => ({ dealId: x.deal._id, dealName: x.deal.name, credit: x.credit })),
  };

  const closingSoon = deals
    .filter((d) => d.status === "open" && d.expectedCloseDate && d.expectedCloseDate - MERIDIAN_NOW <= 21 * DAY)
    .sort((a, b) => (a.expectedCloseDate ?? 0) - (b.expectedCloseDate ?? 0));

  const items: PulseItem[] = [];
  const referenced = new Set<string>();
  const push = (item: PulseItem) => {
    if (items.length >= 3) return;
    if (item.dealId) {
      if (referenced.has(item.dealId)) return;
      referenced.add(item.dealId);
    }
    items.push(item);
  };

  // 1. A close-dated open deal — the highest-energy move of the morning.
  if (closingSoon[0]) {
    const deal = closingSoon[0];
    const days = Math.round(((deal.expectedCloseDate ?? MERIDIAN_NOW) - MERIDIAN_NOW) / DAY);
    const last = lastTouchOn(deal._id);
    const sinceTouch = last !== null ? Math.round((MERIDIAN_NOW - last) / DAY) : null;
    push({
      kind: "close_push",
      title: `Push ${shortName(deal)} across the line`,
      detail: `Expected to close in ${days} days (${fmtK(deal.amount)}).${
        sinceTouch !== null
          ? ` Your last activity was ${sinceTouch} days ago — a nudge now keeps it on track.`
          : ""
      }`,
      dealId: deal._id,
    });
  }

  // 2. Money in motion.
  if (pendingPayout.amount > 0) {
    const n = pendingPayout.deals.length;
    push({
      kind: "payout",
      title:
        n === 1
          ? `Your payout from ${pendingPayout.deals[0].dealName.split(" — ")[0]} is in flight`
          : `Your payout from ${n} recent wins is in flight`,
      detail: `${fmtK(pendingPayout.amount)} in commission from deals closed in the last 30 days, at your ${rate}% rate on credited revenue.`,
    });
  }

  // 3. A registration stuck in the queue.
  const pendingReg = deals.find(
    (d) => d.registeredBy === partnerId && d.registrationStatus === "pending"
  );
  if (pendingReg) {
    const reg = getDealTouchpoints(pendingReg._id).find(
      (t) => t.partnerId === partnerId && t.type === "deal_registration"
    );
    const daysPending = reg ? Math.round((MERIDIAN_NOW - reg.createdAt) / DAY) : null;
    push({
      kind: "registration_pending",
      title: `Your ${shortName(pendingReg)} registration is still pending`,
      detail: `Submitted ${daysPending ?? "several"} days ago and awaiting approval — worth a note to your partner manager.`,
      dealId: pendingReg._id,
    });
  }

  // 4. An open deal that's gone quiet.
  const stalled = deals
    .filter((d) => d.status === "open")
    .map((d) => ({ deal: d, last: lastTouchOn(d._id) }))
    .filter((x): x is { deal: Deal; last: number } => x.last !== null && MERIDIAN_NOW - x.last > 45 * DAY)
    .sort((a, b) => a.last - b.last)[0];
  if (stalled) {
    const days = Math.round((MERIDIAN_NOW - stalled.last) / DAY);
    push({
      kind: "stalled",
      title: `${shortName(stalled.deal)} has gone quiet`,
      detail: `No activity from you in ${days} days on this ${fmtK(stalled.deal.amount)} opportunity. One check-in could restart it.`,
      dealId: stalled.deal._id,
    });
  }

  // 5. A tier within reach.
  if (card.nextTier && card.tierProgress >= 40 && card.tierProgress < 100) {
    const remaining =
      TIER_THRESHOLDS[card.nextTier as (typeof TIER_ORDER)[number]] -
      card.creditByModel.role_weighted;
    push({
      kind: "tier",
      title: `You're ${Math.round(card.tierProgress)}% of the way to ${card.nextTier}`,
      detail: `${fmtK(Math.max(remaining, 0))} more in credited revenue unlocks ${card.nextTier} benefits.`,
    });
  }

  // Fallbacks guarantee every partner wakes up to at least two items.
  if (items.length < 2) {
    push({
      kind: "enablement",
      title: "New enablement is ready for you",
      detail: "This quarter's certification track and co-sell kit are waiting in your resources library.",
    });
  }
  if (items.length < 2) {
    push({
      kind: "enablement",
      title: "Your performance summary is ready",
      detail: "Deals touched, credited revenue, and tier progress — refreshed this morning in your portal.",
    });
  }

  const parts: string[] = [];
  if (closingSoon.length > 0)
    parts.push(`${closingSoon.length} deal${closingSoon.length === 1 ? "" : "s"} closing soon`);
  if (pendingPayout.deals.length > 0)
    parts.push(`${pendingPayout.deals.length} win${pendingPayout.deals.length === 1 ? "" : "s"} paying out`);
  if (card.nextTier) parts.push(`${Math.round(card.tierProgress)}% to ${card.nextTier}`);
  const summary = parts.length ? `${parts.join(", ")}.` : "Nothing urgent on your plate today.";

  return {
    partner,
    asOf: MERIDIAN_NOW,
    summary,
    items,
    tier: {
      current: partner.tier ?? "bronze",
      next: card.nextTier,
      progress: Math.round(card.tierProgress),
    },
    pendingPayout,
  };
}

export { SCENARIO, MERIDIAN_NOW, meridian };
