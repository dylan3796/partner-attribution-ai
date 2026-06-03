/**
 * Next-moves generators.
 *
 * Each function is pure: it takes the loaded rows (+ precomputed scores) and
 * returns zero or more `NextMove`s for one agent lens. They reuse the signals
 * the product already computes rather than inventing new logic:
 *   - PAM  ← partner scores (tier change, trend) from convex/lib/scoring
 *   - PSM  ← open pipeline coverage + multi-partner co-sell overlap
 *   - Ops  ← pending deal registrations + aging payouts
 *   - Program ← brand-new partners with no activity yet
 */

import type { PartnerScore } from "../scoring";
import type {
  NextMove,
  NextMoveSeverity,
  NMDeal,
  NMPartner,
  NMPayout,
  NMTouchpoint,
} from "./types";

const DAY_MS = 86400000;

function money(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

function daysSince(ts: number, now: number): number {
  return Math.max(0, Math.floor((now - ts) / DAY_MS));
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── PAM · tier-up ───────────────────────────────────────────────────────────

export function pamTierUp(scores: PartnerScore[]): NextMove[] {
  return scores
    .filter((s) => s.tierChange === "upgrade")
    .map((s) => {
      const big = s.recommendedTier === "gold" || s.recommendedTier === "platinum";
      const severity: NextMoveSeverity = big ? "high" : "med";
      const topDim = Object.values(s.dimensions).sort((a, b) => b.score - a.score)[0];
      return {
        id: `pam-tierup-${s.partnerId}`,
        agent: "pam" as const,
        kind: "tier_up",
        severity,
        title: `${s.partnerName} is ready for ${titleCase(s.recommendedTier)}`,
        detail: `Scored ${s.overallScore}/100 (currently ${titleCase(s.currentTier)}). Strongest signal: ${topDim.label} — ${topDim.detail}.`,
        evidence: {
          partnerId: s.partnerId,
          reason:
            s.highlights[0] ??
            `Composite score ${s.overallScore}/100 crosses the ${s.recommendedTier} threshold.`,
        },
        suggestedAction: `Promote ${s.partnerName} from ${s.currentTier} to ${s.recommendedTier} and unlock the tier benefits.`,
        score: s.overallScore,
      };
    });
}

// ── PAM · retention (tier-at-risk + health drop) ─────────────────────────────

export function pamRetention(scores: PartnerScore[]): NextMove[] {
  const moves: NextMove[] = [];
  for (const s of scores) {
    if (s.tierChange === "downgrade") {
      moves.push({
        id: `pam-tierrisk-${s.partnerId}`,
        agent: "pam",
        kind: "tier_risk",
        severity: "high",
        title: `${s.partnerName}'s ${titleCase(s.currentTier)} status is at risk`,
        detail: `Score has fallen to ${s.overallScore}/100, which maps to ${titleCase(s.recommendedTier)}. ${s.dimensions.engagement.detail}.`,
        evidence: {
          partnerId: s.partnerId,
          reason: s.highlights.find((h) => h.includes("risk")) ?? `Score ${s.overallScore} below ${s.currentTier} threshold.`,
        },
        suggestedAction: `Schedule a save play with ${s.partnerName} before the next tier review.`,
        score: 100 - s.overallScore,
      });
    } else if (s.trend === "down") {
      moves.push({
        id: `pam-health-${s.partnerId}`,
        agent: "pam",
        kind: "health_drop",
        severity: "med",
        title: `${s.partnerName} is cooling off`,
        detail: `Touchpoint activity is trending down. ${s.dimensions.engagement.detail}.`,
        evidence: {
          partnerId: s.partnerId,
          reason: "Fewer touchpoints in the last 30 days than the prior 30.",
        },
        suggestedAction: `Send ${s.partnerName} a check-in and surface a fresh co-sell opportunity.`,
        score: 60 - s.overallScore / 2,
      });
    }
  }
  return moves;
}

// ── PSM · coverage gaps ──────────────────────────────────────────────────────

export function psmCoverageGap(
  deals: NMDeal[],
  touchpoints: NMTouchpoint[],
  partners: NMPartner[],
  scores: PartnerScore[]
): NextMove[] {
  const openDeals = deals.filter((d) => d.status === "open");
  if (openDeals.length === 0) return [];

  const avgOpen = openDeals.reduce((s, d) => s + d.amount, 0) / openDeals.length;
  const activeIds = new Set(partners.filter((p) => p.status !== "inactive").map((p) => p._id));
  const coveredDealIds = new Set(
    touchpoints.filter((tp) => activeIds.has(tp.partnerId)).map((tp) => tp.dealId)
  );

  // Best-fit partner = highest-ranked active partner (by composite score).
  const bestFit = scores.find((s) => activeIds.has(s.partnerId));

  return openDeals
    .filter((d) => !coveredDealIds.has(d._id) && d.amount >= avgOpen)
    .sort((a, b) => b.amount - a.amount)
    .map((d) => {
      const severity: NextMoveSeverity = d.amount >= avgOpen * 1.5 ? "high" : "med";
      const rec = bestFit
        ? ` ${bestFit.partnerName} (your top-ranked partner) is a strong fit.`
        : "";
      return {
        id: `psm-coverage-${d._id}`,
        agent: "psm" as const,
        kind: "coverage_gap",
        severity,
        title: `${d.name} has no partner attached`,
        detail: `${money(d.amount)} open opportunity with no active partner touchpoint — above your ${money(avgOpen)} average open deal.${rec}`,
        evidence: {
          dealId: d._id,
          partnerId: bestFit?.partnerId,
          reason: `No active partner has a touchpoint on this ${money(d.amount)} open deal.`,
        },
        suggestedAction: bestFit
          ? `Introduce ${bestFit.partnerName} into ${d.name} to drive a co-sell.`
          : `Attach a qualified partner to ${d.name}.`,
        score: d.amount,
      };
    });
}

// ── PSM · co-sell coordination ───────────────────────────────────────────────

export function psmCoSell(
  deals: NMDeal[],
  touchpoints: NMTouchpoint[],
  partners: NMPartner[]
): NextMove[] {
  const nameById = new Map(partners.map((p) => [p._id, p.name]));
  const openDeals = deals.filter((d) => d.status === "open");

  return openDeals
    .map((d) => {
      const dealPartnerIds = [
        ...new Set(touchpoints.filter((tp) => tp.dealId === d._id).map((tp) => tp.partnerId)),
      ];
      return { d, dealPartnerIds };
    })
    .filter((x) => x.dealPartnerIds.length >= 2)
    .map(({ d, dealPartnerIds }) => {
      const names = dealPartnerIds.map((id) => nameById.get(id) ?? "a partner");
      const severity: NextMoveSeverity = d.amount >= 100000 ? "high" : "med";
      return {
        id: `psm-cosell-${d._id}`,
        agent: "psm" as const,
        kind: "co_sell",
        severity,
        title: `Co-sell in motion on ${d.name}`,
        detail: `${names.join(", ")} are all active on this ${money(d.amount)} deal. Coordinate so they pull together, not past each other.`,
        evidence: {
          dealId: d._id,
          reason: `${dealPartnerIds.length} partners have touchpoints on the same open deal.`,
        },
        suggestedAction: `Run a joint plan with ${names.join(" + ")} and confirm attribution up front.`,
        score: d.amount,
      };
    });
}

// ── Ops · hygiene (aggregated) ───────────────────────────────────────────────

export function opsHygiene(
  deals: NMDeal[],
  payouts: NMPayout[],
  now: number,
  payoutAgingDays: number
): NextMove[] {
  const moves: NextMove[] = [];

  const pendingRegs = deals.filter((d) => d.registrationStatus === "pending");
  if (pendingRegs.length > 0) {
    const first = pendingRegs.sort((a, b) => a.createdAt - b.createdAt)[0];
    moves.push({
      id: "ops-pending-regs",
      agent: "ops",
      kind: "pending_registrations",
      severity: pendingRegs.length >= 3 ? "high" : "med",
      title: `${pendingRegs.length} deal registration${pendingRegs.length === 1 ? "" : "s"} awaiting review`,
      detail: `Oldest is "${first.name}", submitted ${daysSince(first.createdAt, now)}d ago. Partners are waiting on a decision.`,
      evidence: {
        dealId: first._id,
        reason: `${pendingRegs.length} deal${pendingRegs.length === 1 ? "" : "s"} have registrationStatus = "pending".`,
      },
      suggestedAction: "Clear the deal-registration queue so partners aren't blocked.",
      score: pendingRegs.length,
    });
  }

  const aging = payouts.filter(
    (p) => p.status === "pending_approval" && daysSince(p.createdAt, now) >= payoutAgingDays
  );
  if (aging.length > 0) {
    const total = aging.reduce((s, p) => s + p.amount, 0);
    moves.push({
      id: "ops-aging-payouts",
      agent: "ops",
      kind: "aging_payouts",
      severity: total >= 10000 ? "high" : "med",
      title: `${money(total)} in payouts pending approval`,
      detail: `${aging.length} payout${aging.length === 1 ? "" : "s"} have sat unapproved for ${payoutAgingDays}+ days. Late payouts erode partner trust.`,
      evidence: {
        partnerId: aging[0].partnerId,
        reason: `${aging.length} payouts in "pending_approval" older than ${payoutAgingDays} days.`,
      },
      suggestedAction: "Review and approve the aging payout batch.",
      score: total,
    });
  }

  return moves;
}

// ── Program · new-partner ramp ───────────────────────────────────────────────

export function programRamp(
  partners: NMPartner[],
  touchpoints: NMTouchpoint[],
  now: number,
  newPartnerDays: number
): NextMove[] {
  const engaged = new Set(touchpoints.map((tp) => tp.partnerId));
  return partners
    .filter(
      (p) =>
        p.status !== "inactive" &&
        daysSince(p.createdAt, now) <= newPartnerDays &&
        !engaged.has(p._id)
    )
    .map((p) => {
      const age = daysSince(p.createdAt, now);
      return {
        id: `program-ramp-${p._id}`,
        agent: "program" as const,
        kind: "ramp_stalled",
        severity: age >= newPartnerDays * 0.6 ? "high" : "med",
        title: `${p.name} hasn't ramped`,
        detail: `Joined ${age}d ago with zero touchpoints. New partners that don't activate in their first month rarely do later.`,
        evidence: {
          partnerId: p._id,
          reason: `Partner created ${age}d ago has no touchpoints recorded.`,
        },
        suggestedAction: `Trigger onboarding for ${p.name} — first deal reg or enablement session.`,
        score: age,
      };
    });
}
