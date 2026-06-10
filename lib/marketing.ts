// Shared content + constants for the Covant marketing site (Home / Product / Company).
// Model names + descriptions mirror the shipped attribution engine
// (convex/lib/attribution/models.ts + types.ts) so the site never claims a
// model the product doesn't actually compute, and the hero visual is computed
// from the Meridian demo dataset by the real engine — no invented numbers.
//
// Copy rules (enforced here, the single source of truth):
//  - no "AI-powered" in the hero
//  - never: streamline, leverage, holistic, best-in-class
//  - no fake logos, testimonials, or stats presented as real
//  - attribution is a capability we mention, not a pillar we sell; credit is
//    the customer's team's decision — Covant brings the evidence
//  - AI is named only where it's real (Ask Covant Q&A, per-deal partner
//    recommendations); the pulse is "the morning view in their portal",
//    never a "daily email digest"

export const DEMO_SOURCE = "demo_request";
export const EARLY_ACCESS_SOURCE = "early_access";
export const AUDIT_SOURCE = "program_audit";

/** Options for the "what runs your partner program today" field on the early-access form. */
export const ATTRIBUTION_TOOLS = [
  "PartnerStack",
  "Crossbeam",
  "Impartner",
  "Spreadsheets",
  "None",
  "Other",
] as const;

export type ProblemPanel = {
  tool: string;
  title: string;
  body: string;
};

// The problem: the partner experience, as most programs actually deliver it.
export const PROBLEM_PANELS: ProblemPanel[] = [
  {
    tool: "Your PRM",
    title: "A records system partners log into once.",
    body: "The PRM stores agreements, registrations, and a resources page nobody can find. Partners visit to register a deal, then never come back — because nothing in there tells them what to do next or what they've earned.",
  },
  {
    tool: "Your inbox",
    title: "The real partner experience lives in email.",
    body: "One-off intros, stale decks, 'just checking in.' Whatever your best partner manager does by hand for the top accounts is the actual program — and it doesn't survive vacations, turnover, or partner number forty.",
  },
  {
    tool: "Your program",
    title: "One structure stretched over every partner.",
    body: "Resellers, SIs, marketplaces, and referral firms all get the same tier sheet and the same quarterly email. White-glove treatment for the three partners you know well; silence for everyone else.",
  },
];

export type LifecycleStep = {
  title: string;
  body: string;
};

// The ecosystem arc the product runs: recruit -> activate -> grow -> reward.
export const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    title: "Recruit",
    body: "Applications, invites, and a real first impression. Every prospective partner lands in one queue with the context to say yes quickly — not a web form that goes nowhere.",
  },
  {
    title: "Activate",
    body: "Guided onboarding, certifications, and an enablement library partners actually use. New partners reach their first registered deal with a checklist, not a cold start.",
  },
  {
    title: "Grow",
    body: "Health signals show who's accelerating and who's going quiet. Recommendations — refined per deal — tell your team which partner to bring in next, before the quarter decides for you.",
  },
  {
    title: "Reward",
    body: "Transparent payouts and credit your partners can read for themselves. Covant brings the evidence for every split; your team makes the call.",
  },
];

export type ExperiencePillar = {
  eyebrow: string;
  title: string;
  body: string;
};

// White-glove, grounded: each pillar maps to a shipped surface.
export const EXPERIENCE_PILLARS: ExperiencePillar[] = [
  {
    eyebrow: "Every morning",
    title: "A daily pulse for every partner.",
    body: "Each partner opens their portal to the same view your best partner manager would prepare by hand: the deal to push, the payout in flight, the tier within reach. Computed from the ledger, for partner number forty as much as partner number one.",
  },
  {
    eyebrow: "Ask anything",
    title: "Plain-language answers about your ecosystem.",
    body: "\"Which partners touched our biggest open deals?\" \"Who's gone quiet this quarter?\" Ask Covant answers from your partner data directly — no report to build, no analyst to wait on.",
  },
  {
    eyebrow: "Per deal",
    title: "Recommendations refined by Claude.",
    body: "Give Covant a deal's context and it weighs your historical win patterns to suggest the three partners most likely to move it — with the reasoning written out, not a score you have to trust blind.",
  },
];

// Attribution, demoted to what it is: evidence for the team's decision.
export const ATTRIBUTION_FLEX = {
  eyebrow: "Attribution, handled with care",
  heading: "Credit is a team decision. Covant brings the evidence.",
  body: "Who sourced, who built, who closed — Covant maps every touch and computes credit under five models, weights tuned to your program, every split with a written reason. So when your team decides who gets what, it's a conversation about facts.",
  linkLabel: "Watch the models disagree on the same deal →",
  href: "/demo",
};

export type MarketingModel = {
  id: string;
  label: string;
  line: string;
  whenToUse: string;
};

export const MODELS: MarketingModel[] = [
  {
    id: "first_touch_sourcer",
    label: "First touch / sourcer",
    line: "Full credit to the partner who first registered or sourced the deal.",
    whenToUse:
      "When sourcing is what you pay for: classic referral and reseller programs where deal registration is the contract.",
  },
  {
    id: "split_equally",
    label: "Split equally",
    line: "Equal credit across every partner with a qualifying touchpoint.",
    whenToUse:
      "When you want a neutral baseline — or when partners collaborate so closely that arguing over shares costs more than it's worth.",
  },
  {
    id: "role_weighted",
    label: "Role weighted",
    line: "Credit weighted by the role each partner played — sourcer, influencer, implementer, closer.",
    whenToUse:
      "When several partners genuinely move one deal. It pays the sourcer most without zeroing out the people who implemented and closed.",
  },
  {
    id: "implementation_credit",
    label: "Implementation credit",
    line: "Full credit to the partner who delivered and implemented the deal.",
    whenToUse:
      "For services and SI programs where delivery is the value. The partner who made the product real gets the credit — even if they never sourced a thing.",
  },
  {
    id: "marketplace_cosell_hybrid",
    label: "Marketplace co-sell (hybrid)",
    line: "Multi-party split for cloud co-sell: hyperscaler influencer, partner sourcer, and your closing team.",
    whenToUse:
      "For cloud marketplace motions, where the hyperscaler, the partner, and your own team each take a defined slice of the same deal.",
  },
];

// "PXM, not PRM" — the category claim, kept falsifiable.
export const NEW_ERA = {
  eyebrow: "A new category",
  heading: "Partner Experience Management.",
  body: [
    "PRMs were built to store partner records. But software that just stores and fulfills is exactly what the AI era is leaving behind — what's left is the experience a product delivers. For a partner program, that experience is the program: every partner treated like your top partner, whatever shape your program takes.",
    "PXM is the difference. Every partner knows where they stand and what to do next. Every partner manager knows who to back and why. And finance trusts the number underneath, because every split carries its reason.",
  ],
  tagline: "PXM, not PRM.",
};
