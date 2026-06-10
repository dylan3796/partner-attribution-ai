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
// Two hard rules for all marketing copy:
// 1. Covant flags incentives as earned (with evidence); the COMPANY pays.
//    Never imply Covant moves money or that payouts are automatic.
// 2. Partner signal lives beyond the CRM (spreadsheets, marketplace portals,
//    event streams) and Covant also GENERATES new signal (registrations,
//    logged touches, portal activity) — don't reduce the story to "reads CRM."

export const DEMO_SOURCE = "demo_request";

export type Pillar = {
  title: string;
  body: string;
};

// How Covant works, as a pipeline. This is the demo arc, and each step is real product.
export const PILLARS: Pillar[] = [
  {
    title: "Bring the signal together.",
    body: "Covant assembles partner activity from wherever it lives — CRM, spreadsheets, marketplace portals, event streams — and starts generating the signal you've never had: registrations, logged touches, portal activity, every interaction stamped and kept.",
  },
  {
    title: "Encode how your channel actually works.",
    body: "Programs are first-class in Covant. An SI influence motion, a cloud co-sell split, an ISV integration track, a reseller tier ladder — each runs its own attribution model and incentive rules, side by side. Your logic, not a vendor's template.",
  },
  {
    title: "Attribution with a paper trail.",
    body: "Every split comes with its reasons attached — who did what, when, and why it earned the percentage it did. Compare five models on the same pipeline. When someone challenges the number, you show your work.",
  },
  {
    title: "Act before the moment passes.",
    body: "Covant flags incentives the moment they're earned — evidence attached, payment in your hands. It tells your team which partner belongs on which deal, and shows every partner their next move.",
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

export type Outcome = {
  title: string;
  body: string;
};

// What changes for each person once the channel runs on signal instead of instinct.
export const OUTCOMES: Outcome[] = [
  {
    title: "Partners stop guessing.",
    body: "Each one sees where they stand, what “good” looks like, and their next action — without waiting on a QBR to find out they were off track.",
  },
  {
    title: "Reps move on the right partner.",
    body: "Sellers get the highest-leverage play, ranked — the right rep, the right partner, the right reason — while it still changes the quarter.",
  },
  {
    title: "The CRO trusts the number.",
    body: "Partner-sourced and partner-influenced revenue, reconciled across every program — defensible line by line, not assembled in a spreadsheet the night before the board call.",
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
