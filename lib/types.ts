// Types matching the Convex schema

export type Organization = {
  _id: string;
  name: string;
  email: string;
  apiKey: string;
  plan: "starter" | "growth" | "enterprise";
  createdAt: number;
};

export type Partner = {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  type: "affiliate" | "referral" | "reseller" | "integration";
  commissionRate: number;
  status: "active" | "inactive" | "pending";
  createdAt: number;
};

export type Deal = {
  _id: string;
  organizationId: string;
  name: string;
  amount: number;
  status: "open" | "won" | "lost";
  closedAt?: number;
  createdAt: number;
};

export type TouchpointType =
  | "referral"
  | "demo"
  | "content_share"
  | "introduction"
  | "proposal"
  | "negotiation";

export type Touchpoint = {
  _id: string;
  organizationId: string;
  dealId: string;
  partnerId: string;
  type: TouchpointType;
  weight?: number;
  notes?: string;
  createdAt: number;
  // Enriched
  partner?: Partner;
  deal?: Deal;
};

export type AttributionModel =
  | "equal_split"
  | "first_touch"
  | "last_touch"
  | "time_decay"
  | "role_based";

export type Attribution = {
  _id: string;
  organizationId: string;
  dealId: string;
  partnerId: string;
  model: AttributionModel;
  percentage: number;
  amount: number;
  commissionAmount: number;
  calculatedAt: number;
  // Enriched
  partner?: Partner;
  deal?: Deal;
};

export const MODEL_LABELS: Record<AttributionModel, string> = {
  equal_split: "Equal Split",
  first_touch: "First Touch",
  last_touch: "Last Touch",
  time_decay: "Time Decay",
  role_based: "Role-Based",
};

export const MODEL_DESCRIPTIONS: Record<AttributionModel, string> = {
  equal_split: "Each partner gets an equal share of credit",
  first_touch: "100% credit to the first partner who touched the deal",
  last_touch: "100% credit to the last partner who touched the deal",
  time_decay: "More recent touchpoints get higher weight",
  role_based: "Different touchpoint types have different weights",
};

export const TOUCHPOINT_LABELS: Record<TouchpointType, string> = {
  referral: "Referral",
  demo: "Demo",
  content_share: "Content Share",
  introduction: "Introduction",
  proposal: "Proposal",
  negotiation: "Negotiation",
};

export const PARTNER_TYPE_LABELS: Record<Partner["type"], string> = {
  affiliate: "Affiliate",
  referral: "Referral",
  reseller: "Reseller",
  integration: "Integration",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "emerald",
  inactive: "red",
  pending: "amber",
  open: "indigo",
  won: "emerald",
  lost: "red",
};
