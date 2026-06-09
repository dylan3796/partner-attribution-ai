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

// How Covant works, as a pipeline: signal in -> your judgment encoded -> the next
// move out. This is the demo arc, and each step is real product.
export const PILLARS: Pillar[] = [
  {
    title: "Connect the signal.",
    body: "Covant reads every deal, touch, and program event you already have, across every motion — the record that's too large for any team to hold in its head.",
  },
  {
    title: "Encode your judgment.",
    body: "Teach Covant how each program actually works — reseller, ISV, referral, co-sell — and what “good” means for each. It runs on your logic, not a vendor's template.",
  },
  {
    title: "Get the next move.",
    body: "Out comes the decision: which partners to invest in, which rep belongs in which conversation, and each partner's path to their next win — attribution reconciled underneath.",
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
    body: "Partner-sourced revenue, reconciled across every program — defensible and current, not assembled in a spreadsheet the night before the board call.",
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
