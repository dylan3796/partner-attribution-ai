// Shared content + constants for the Covant marketing site (Home / Product / Company).
// Model names + descriptions mirror the shipped attribution engine
// (convex/lib/attribution/models.ts + types.ts) so the site never claims a
// model the product doesn't actually compute. PILLARS (the data -> program ->
// insight pipeline) and OUTCOMES back the AI-native Partner Experience Management
// story and each map to real product surface (partner portal in app/portal/**,
// scoring in lib/partner-scoring.ts, the five MODELS below) so the copy stays
// grounded in what Covant actually does.

export const DEMO_SOURCE = "demo_request";

export type Pillar = {
  title: string;
  body: string;
};

// How Covant works, as a pipeline: data in -> your programs learned -> the next
// move out. This is the demo arc, and each step is real product.
export const PILLARS: Pillar[] = [
  {
    title: "Connect your data.",
    body: "Covant reads the deals, touchpoints, and partner activity you already have across every motion — the billions of signals no team has the hours to comb through.",
  },
  {
    title: "Teach it your programs.",
    body: "Tell Covant how each program works — reseller, ISV, referral, co-sell — and where partners should focus: enablement, revenue, lead gen, co-marketing. It runs on your rules, not a generic template.",
  },
  {
    title: "Get the next move.",
    body: "Covant returns the answer: which partners to focus where, which rep should call which partner about what, and each partner's path to their next win — with attribution settled underneath.",
  },
];

export type Outcome = {
  title: string;
  body: string;
};

// The "better together" payoff, in concrete terms — what changes for each person.
export const OUTCOMES: Outcome[] = [
  {
    title: "Partners know where they stand.",
    body: "Each partner sees their score, their focus, and the next action — no more guessing what good looks like or waiting on a QBR to find out.",
  },
  {
    title: "Reps know who to call.",
    body: "Your sellers get the highest-leverage partner moves, ranked — the right rep, the right partner, the right reason. The intros that used to never happen.",
  },
  {
    title: "The CRO sees the number.",
    body: "Partner-sourced revenue, reconciled to the CRM and trustworthy — across every program, without a single spreadsheet.",
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
