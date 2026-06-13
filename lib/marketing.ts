// Shared content + constants for the Covant marketing site (Home / Product / Company).
//
// Positioning: Partner Experience Management is the umbrella — the category
// Covant is building. The Channel Graph is the intelligence engine that
// powers it: a living model of the customer's channel, built from a first
// pass over their data (structured or unstructured) and refined by their
// team. Journeys, the portal, and conversational/MCP access are the
// delivery surfaces. No copy may present the graph or the portal as the
// top-level product, and no copy may present attribution as the foundation.
// Surfaces that lead shipped product (journey flows, MCP servers, enlist
// actions, two-way submissions) are flagged "future scope" in the
// components that depict them.
//
// Five hard rules for all marketing copy:
// 1. Payouts are calculated, explained, flagged as earned, routed for
//    approval, and recorded in Covant. But the COMPANY approves and
//    moves the money. Never imply Covant touches funds or that payouts
//    happen without sign-off.
// 2. Deals live and move in the customer's CRM — Covant is the partner
//    experience layer overlaid on it. Partners register deals in Covant and
//    they flow INTO the CRM; Covant runs the partner side (journeys, asks,
//    submissions, credit). Never claim deals live, progress, or run in
//    Covant.
// 3. Partner signal lives beyond the CRM (spreadsheets, emails, Slack
//    threads, deal notes, marketplace portals, event streams) and Covant
//    also GENERATES new signal (registrations, logged touches, portal
//    activity) — don't reduce the story to "reads CRM."
// 4. Attribution is a customer-owned input the graph respects — their
//    model, their weights, their call. Never position Covant as the credit
//    referee, and never delete attribution from the story; demote and
//    reframe.
// 5. The audience is partnerships and sales executives. Lead with outcomes
//    and leverage; never explain channel basics; short declarative
//    sentences; no fabricated metrics or social proof.

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

// The program motions the engine and experience serve. Framed on the
// umbrella narrative (graph -> activation -> journeys), not split
// mechanics; the five MODELS below remain available per program when the
// customer wants credit formalized.
export const MOTIONS: Motion[] = [
  {
    title: "SI & implementation partners.",
    body: "The graph knows who actually delivers — eval speed, project record, verticals — and pulls them into the next deal that fits, even when they never resell.",
  },
  {
    title: "Cloud co-sell.",
    body: "Three-party motion, one picture. The graph reads who opened the door, who sourced, who closed — and names who to bring next time.",
  },
  {
    title: "ISV & integration partners.",
    body: "The integration that drives expansion shows up as signal on live deals — the graph surfaces the ISV before the renewal, not after.",
  },
  {
    title: "Resellers & referral.",
    body: "Deal registration, journeys, and incentive rules that outgrow the spreadsheet on day one.",
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
