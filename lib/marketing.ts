// Shared content + constants for the Covant marketing site (Home / Product / Company).
// Model names mirror the shipped attribution engine (convex/lib/attribution/models.ts)
// so the site never claims a model the product doesn't compute.

export const DEMO_SOURCE = "demo_request";

export type MarketingModel = {
  id: string;
  label: string;
  line: string;
};

export const MODELS: MarketingModel[] = [
  {
    id: "first_touch",
    label: "First touch",
    line: "Credit the partner whose touch created the opportunity.",
  },
  {
    id: "last_touch",
    label: "Last touch",
    line: "Credit the partner on the deal when it converts.",
  },
  {
    id: "time_decay",
    label: "Time decay",
    line: "Weight recent touches more heavily than older ones.",
  },
  {
    id: "equal_split",
    label: "Equal split",
    line: "Divide credit evenly across every contributing partner.",
  },
  {
    id: "role_based",
    label: "Role-based",
    line: "Credit follows the role each partner played — sourcer, influencer, closer.",
  },
];
