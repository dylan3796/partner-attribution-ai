// Shared content + constants for the Covant marketing site (Home / Product / Company).
// Model names + descriptions mirror the shipped attribution engine
// (convex/lib/attribution/models.ts + types.ts) so the site never claims a
// model the product doesn't actually compute. PILLARS (signal -> encoded
// program logic -> paper-trail attribution -> action), MOTIONS (the program
// types the engine serves), and OUTCOMES each map to real product surface
// (partner portal in app/portal/**, scoring in lib/partner-scoring.ts,
// commission rules in convex/commissionRules.ts, the five MODELS below) so
// the copy stays grounded in what Covant actually does.
//
// Three hard rules for all marketing copy:
// 1. Payouts are calculated, explained, flagged as earned, routed for
//    approval, and recorded in Covant. But the COMPANY approves and
//    moves the money. Never imply Covant touches funds or that payouts
//    happen without sign-off.
// 2. Deals live and move in the customer's CRM — Covant is the partner hub
//    overlaid on it. Partners register deals in Covant and they flow INTO
//    the CRM; Covant tracks the partner side (credit, incentives, tier
//    progress, next best actions). Never claim deals live, progress, or
//    run in Covant.
// 3. Partner signal lives beyond the CRM (spreadsheets, marketplace portals,
//    event streams) and Covant also GENERATES new signal (registrations,
//    logged touches, portal activity) — don't reduce the story to "reads CRM."

export const DEMO_SOURCE = "demo_request";

export type Pillar = {
  title: string;
  body: string;
};

// What lives in the hub — the partner-hub triad. Solution-framed
// (showcase what works, not what's broken): credit every dollar with the reason
// attached, make tiers/incentives pull partners forward, capture the signal
// partners send through every channel and turn it into their next move. Each
// maps to shipped product.
export const PILLARS: Pillar[] = [
  {
    title: "Credit nobody disputes.",
    body: "Sourced or influenced, every dollar is attributed with the reason attached — one number you and your partners read the same way.",
  },
  {
    title: "Make the tier ladder pull its weight.",
    body: "Partners see the bar, their progress, and the payoff. Incentives flag the moment they're earned, evidence included — approval stays with you.",
  },
  {
    title: "Catch the signal from every channel.",
    body: "Registrations, meetings, logged touches, portal activity — even the work you'd never have heard about — gathered into one record and turned into each partner's next move.",
  },
];

export type Workflow = {
  label: string;
  title: string;
  steps: string[];
};

// Walkthroughs of real product loops — each step is shipped surface
// (deal registration + approval in convex/deals.ts, attribution explanations,
// payout approvals, tier progress in app/portal/**, scoring/recommendations
// + forecasting in app/dashboard/**).
export const WORKFLOWS: Workflow[] = [
  {
    label: "The revenue loop",
    title: "A partner brings you a deal.",
    steps: [
      "They register it in your portal — two minutes, your fields.",
      "You approve and it flows into your CRM; every partner touch is logged in Covant.",
      "It closes in your CRM. Attribution splits with the reasons attached.",
      "The incentive flags as earned, evidence included, awaiting your sign-off.",
    ],
  },
  {
    label: "The growth loop",
    title: "A partner wants to make Gold.",
    steps: [
      "You set the bar — wins, revenue, registrations — per program.",
      "Their portal shows the gap and the next move that closes it.",
      "Every win updates their progress in real time.",
      "The tier review lands on your desk with the record already made.",
    ],
  },
  {
    label: "The planning loop",
    title: "You're shaping next quarter.",
    steps: [
      "Scores and health, current for every partner — no chasing.",
      "Covant ranks who to back, and which partner belongs on which open deal.",
      "Partner-sourced revenue forecast across every program.",
      "You walk into the QBR with the answers already pulled.",
    ],
  },
];

export type Motion = {
  title: string;
  body: string;
};

// The program motions the attribution engine serves today. Each maps to a
// shipped model: SI -> role_weighted/implementation_credit, cloud ->
// marketplace_cosell_hybrid, ISV -> touchpoint-level influence, reseller ->
// first_touch_sourcer + deal registration workflow.
export const MOTIONS: Motion[] = [
  {
    title: "SI & implementation partners.",
    body: "Credit the partner who ran the eval and delivered the work — even when they never resell. Role-weighted and implementation-credit models make influence payable.",
  },
  {
    title: "Cloud co-sell.",
    body: "Hyperscaler opens the door, a partner sources, your team closes. Covant reconciles the three-way split instead of letting the loudest claim win.",
  },
  {
    title: "ISV & integration partners.",
    body: "The integration that drove the expansion finally shows up in a number — touchpoint-level influence, not anecdote.",
  },
  {
    title: "Resellers & referral.",
    body: "Deal registration, tiers, and incentive rules that outgrow the spreadsheet on day one.",
  },
];

export type MarketingModel = {
  id: string;
  label: string;
  line: string;
};

export const MODELS: MarketingModel[] = [
  {
    id: "first_touch_sourcer",
    label: "First touch / sourcer",
    line: "Full credit to the partner who first registered or sourced the deal.",
  },
  {
    id: "split_equally",
    label: "Split equally",
    line: "Equal credit across every partner with a qualifying touchpoint.",
  },
  {
    id: "role_weighted",
    label: "Role weighted",
    line: "Credit weighted by the role each partner played — sourcer, influencer, implementer, closer.",
  },
  {
    id: "implementation_credit",
    label: "Implementation credit",
    line: "Full credit to the partner who delivered and implemented the deal.",
  },
  {
    id: "marketplace_cosell_hybrid",
    label: "Marketplace co-sell (hybrid)",
    line: "Multi-party split for cloud co-sell: hyperscaler influencer, partner sourcer, and your closing team.",
  },
];
