// Shared content + constants for the Covant marketing site (Home / Product / Company).
// Model names + descriptions mirror the shipped attribution engine
// (convex/lib/attribution/models.ts + types.ts) so the site never claims a
// model the product doesn't actually compute. PILLARS + CATEGORY back the
// Partner Experience Management positioning and each map to real product surface
// (partner portal in app/portal/**, scoring in lib/partner-scoring.ts, the five
// MODELS below) so the copy stays grounded in what Covant actually does.

export const DEMO_SOURCE = "demo_request";

export type Pillar = {
  title: string;
  body: string;
};

// The three things Covant does, in order. Each is real product, not a promise.
export const PILLARS: Pillar[] = [
  {
    title: "Guide every partner.",
    body: "A partner portal shows each partner where they stand, what good looks like, and their next move — tier, influence, score, the action that moves them up.",
  },
  {
    title: "Back the right partners.",
    body: "Covant scores and ranks your partners and surfaces the week's moves: the partner going quiet, the deal stalling, the renewal nobody owns.",
  },
  {
    title: "Settle attribution underneath.",
    body: "Five bounded models, recommended per motion and reconciled to your CRM — the trustworthy number, without the quarter-end fight.",
  },
];

export type CategoryStage = {
  term: string;
  gloss: string;
  line: string;
  accent?: boolean;
};

// PRM → PEM → PXM lineage. Named for contrast; Covant is the last one.
export const CATEGORY: CategoryStage[] = [
  {
    term: "PRM",
    gloss: "The relationship",
    line: "A system of record. One program, slow to stand up, stores the deal and stops there.",
  },
  {
    term: "PEM",
    gloss: "The ecosystem",
    line: "Mapped who knows whom across the market — but never the path a single partner takes.",
  },
  {
    term: "PXM",
    gloss: "The experience",
    line: "Covant. Guides each partner to their next win and grows your partner revenue with them.",
    accent: true,
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
