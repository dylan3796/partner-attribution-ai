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

export const DEMO_SOURCE = "demo_request";
export const EARLY_ACCESS_SOURCE = "early_access";
export const AUDIT_SOURCE = "program_audit";

/** Options for the "current attribution tool" field on the early-access form. */
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

// The problem, told through the tools partner teams actually run.
export const PROBLEM_PANELS: ProblemPanel[] = [
  {
    tool: "Your PRM",
    title: "PartnerStack shows activity, not influence.",
    body: "A PRM can tell you a partner registered a deal. It can't tell you about the other three partners who moved it — the introduction, the integration work, the final push. Activity gets logged; influence goes missing.",
  },
  {
    tool: "Your CRM",
    title: "Salesforce gives the credit to one name.",
    body: "One partner-source field per opportunity. Whoever registered first owns 100% of the credit forever, no matter who did the work after. Every other partner on the deal is invisible at payout time.",
  },
  {
    tool: "Your QBRs",
    title: "Quarterly reviews run on anecdotes.",
    body: "Without the influence chain, partner reviews come down to whoever tells the best story. Budget follows the loudest partner — and the ones quietly delivering your hardest deals never come up.",
  },
];

export type HowItWorksStep = {
  title: string;
  body: string;
};

// The product arc: signal in -> roles mapped -> five lenses -> the next move.
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: "Connect your stack",
    body: "CRM, PRM, marketplace, and billing events land in one timeline. Covant sits beside the tools you run today — no rip-and-replace.",
  },
  {
    title: "Map every touchpoint",
    body: "Registrations, intros, demos, integration work, co-sell motions — each touch is typed and assigned a role in the deal: sourcer, influencer, implementer, closer.",
  },
  {
    title: "Run five attribution lenses",
    body: "The same deal, computed under five bounded models. Every split comes with a written reason you can read aloud in a partner dispute.",
  },
  {
    title: "Act on what's next",
    body: "The ledger becomes moves: which partner to back, which deal to review before payout, which relationship is going quiet.",
  },
];

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
    "Partners now touch most B2B software deals — sourcing them, integrating them, closing them — yet most companies can still only see the first touch. The tooling generation built to manage partner records was never built to manage partner outcomes.",
    "PXM is the difference. Every partner knows where they stand and what to do next. Every partner manager knows who to back and why. And finance trusts the number underneath, because every split carries its reason.",
  ],
  tagline: "PXM, not PRM.",
};
