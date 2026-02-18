// Types matching the Convex schema

export type Organization = {
  _id: string;
  name: string;
  email: string;
  apiKey: string;
  plan: "starter" | "growth" | "enterprise";
  defaultAttributionModel?: AttributionModel;
  createdAt: number;
};

export type User = {
  _id: string;
  email: string;
  name: string;
  organizationId: string;
  role: "admin" | "manager" | "member" | "partner";
  partnerId?: string;
  avatarUrl?: string;
  lastLoginAt?: number;
  createdAt: number;
};

export type Partner = {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  type: "affiliate" | "referral" | "reseller" | "integration" | "distributor";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  commissionRate: number;
  status: "active" | "inactive" | "pending";
  contactName?: string;
  contactPhone?: string;
  territory?: string;
  notes?: string;
  createdAt: number;
};

export type Deal = {
  _id: string;
  organizationId: string;
  name: string;
  amount: number;
  status: "open" | "won" | "lost";
  closedAt?: number;
  expectedCloseDate?: number;
  contactName?: string;
  contactEmail?: string;
  notes?: string;
  registeredBy?: string;
  registrationStatus?: "pending" | "approved" | "rejected";
  createdAt: number;
};

export type TouchpointType =
  | "referral"
  | "demo"
  | "content_share"
  | "introduction"
  | "proposal"
  | "negotiation"
  | "deal_registration"
  | "co_sell"
  | "technical_enablement";

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

export type Payout = {
  _id: string;
  organizationId: string;
  partnerId: string;
  amount: number;
  status: "pending_approval" | "approved" | "rejected" | "processing" | "paid" | "failed";
  approvedBy?: string;
  approvedAt?: number;
  period?: string;
  notes?: string;
  paidAt?: number;
  createdAt: number;
  partner?: Partner;
};

export type AuditEntry = {
  _id: string;
  organizationId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: string;
  metadata?: string;
  createdAt: number;
};

export type Approval = {
  _id: string;
  organizationId: string;
  entityType: "payout" | "deal_registration" | "tier_change" | "dispute";
  entityId: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  reviewedBy?: string;
  reviewedAt?: number;
  notes?: string;
  createdAt: number;
};

export type Dispute = {
  _id: string;
  organizationId: string;
  partnerId: string;
  dealId: string;
  currentPercentage: number;
  requestedPercentage: number;
  reason: string;
  status: "open" | "under_review" | "resolved" | "rejected";
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: number;
  createdAt: number;
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
  deal_registration: "Deal Registration",
  co_sell: "Co-Sell",
  technical_enablement: "Technical Enablement",
};

export const PARTNER_TYPE_LABELS: Record<Partner["type"], string> = {
  affiliate: "Affiliate",
  referral: "Referral",
  reseller: "Reseller",
  integration: "Integration",
  distributor: "Distributor",
};

export const TIER_LABELS: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

// ── Certifications & Badges ──

export type CertificationLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type Certification = {
  _id: string;
  partnerId: string;
  name: string;
  issuer: string;
  dateEarned: number;
  expiryDate?: number;
  level: CertificationLevel;
  status: "active" | "expired" | "revoked";
};

export type Badge = {
  _id: string;
  partnerId: string;
  name: string;
  description: string;
  icon: string; // emoji or icon key
  category: "achievement" | "training" | "milestone" | "community";
  earnedAt: number;
};

export type TrainingCompletion = {
  _id: string;
  partnerId: string;
  courseName: string;
  completedAt: number;
  score?: number; // percentage 0-100
  certificateUrl?: string;
};

export type SkillEndorsement = {
  _id: string;
  partnerId: string;
  skill: string;
  endorsedBy: string; // org user name
  endorsedAt: number;
  level: "familiar" | "proficient" | "expert";
};

export const CERTIFICATION_LEVEL_LABELS: Record<CertificationLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const BADGE_CATEGORY_LABELS: Record<Badge["category"], string> = {
  achievement: "Achievement",
  training: "Training",
  milestone: "Milestone",
  community: "Community",
};

// ── Platform Configuration / Feature Flags ──

export type ComplexityLevel = "simple" | "standard" | "advanced";
export type UIDensity = "compact" | "comfortable" | "spacious";

export type FeatureFlags = {
  certifications: boolean;
  dealRegistration: boolean;
  mdf: boolean;
  coSell: boolean;
  scoring: boolean;
  payouts: boolean;
  reports: boolean;
  disputes: boolean;
  partnerPortal: boolean;
  apiAccess: boolean;
  auditLog: boolean;
  mcpIntegration: boolean;
  volumeRebates: boolean;
  productCatalog: boolean;
  channelConflict: boolean;
  territories: boolean;
  incentivePrograms: boolean;
};

export type PlatformConfig = {
  featureFlags: FeatureFlags;
  complexityLevel: ComplexityLevel;
  uiDensity: UIDensity;
  enabledModules: string[];
  customBranding: {
    primaryColor?: string;
    logoUrl?: string;
    companyName?: string;
  };
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  certifications: true,
  dealRegistration: true,
  mdf: true,
  coSell: true,
  scoring: true,
  payouts: true,
  reports: true,
  disputes: true,
  partnerPortal: true,
  apiAccess: true,
  auditLog: true,
  mcpIntegration: false,
  volumeRebates: true,
  productCatalog: true,
  channelConflict: true,
  territories: true,
  incentivePrograms: true,
};

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  featureFlags: { ...DEFAULT_FEATURE_FLAGS },
  complexityLevel: "standard",
  uiDensity: "comfortable",
  enabledModules: [
    "partners",
    "deals",
    "scoring",
    "reports",
    "payouts",
    "activity",
    "settings",
  ],
  customBranding: {},
};

export const FEATURE_FLAG_LABELS: Record<keyof FeatureFlags, { label: string; description: string }> = {
  certifications: { label: "Certifications & Badges", description: "Partner certifications, badges, training tracking" },
  dealRegistration: { label: "Deal Registration", description: "Partners register deals for approval" },
  mdf: { label: "Market Development Funds", description: "MDF request and approval workflows" },
  coSell: { label: "Co-Sell", description: "Collaborative selling between partners and direct sales" },
  scoring: { label: "Partner Scoring", description: "Automated partner scoring and tier recommendations" },
  payouts: { label: "Payouts", description: "Commission payout management" },
  reports: { label: "Reports & Analytics", description: "Revenue reports and analytics dashboards" },
  disputes: { label: "Disputes", description: "Attribution dispute resolution" },
  partnerPortal: { label: "Partner Portal", description: "Self-service portal for partners" },
  apiAccess: { label: "API Access", description: "REST API and webhook integrations" },
  auditLog: { label: "Audit Log", description: "Activity tracking and compliance logs" },
  mcpIntegration: { label: "MCP Integration", description: "Model Context Protocol for natural language queries" },
  volumeRebates: { label: "Volume Rebates", description: "Tiered volume-based incentive programs for distributors" },
  productCatalog: { label: "Product Catalog", description: "Product/SKU management with distributor pricing" },
  channelConflict: { label: "Channel Conflict Detection", description: "Territory management and conflict resolution" },
  territories: { label: "Territory Management", description: "Assign and manage partner territories" },
  incentivePrograms: { label: "Incentive Programs", description: "SPIFs, bonuses, accelerators, and partner incentive management" },
};

// ── Volume-Based Incentive Programs ──

export type VolumeRebateTier = {
  minUnits: number;
  maxUnits: number | null; // null = unlimited
  rebatePercent: number;
  label: string;
};

export type VolumeProgram = {
  _id: string;
  organizationId: string;
  name: string;
  period: "quarterly" | "annual";
  startDate: number;
  endDate: number;
  status: "active" | "upcoming" | "completed";
  tiers: VolumeRebateTier[];
  productIds?: string[]; // if specific to certain products
  createdAt: number;
};

export type PartnerVolumeRecord = {
  _id: string;
  organizationId: string;
  partnerId: string;
  programId: string;
  period: string; // e.g., "2026-Q1"
  unitsTotal: number;
  revenueTotal: number;
  currentTierIndex: number;
  rebateAccrued: number;
  rebateProjected: number;
  lastUpdated: number;
};

// ── MDF (Market Development Funds) ──

export type MDFStatus = "pending" | "approved" | "rejected" | "executed" | "paid";

export type MDFBudget = {
  _id: string;
  organizationId: string;
  partnerId: string;
  period: string; // e.g., "2026" or "2026-Q1"
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  createdAt: number;
};

export type MDFRequest = {
  _id: string;
  organizationId: string;
  partnerId: string;
  budgetId: string;
  title: string;
  campaignType: "event" | "digital_marketing" | "content" | "training" | "co_branded" | "other";
  description: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: MDFStatus;
  startDate: number;
  endDate: number;
  // Performance metrics
  leadsGenerated?: number;
  pipelineCreated?: number;
  revenueInfluenced?: number;
  // Approval workflow
  submittedAt: number;
  reviewedBy?: string;
  reviewedAt?: number;
  executedAt?: number;
  paidAt?: number;
  notes?: string;
};

export const MDF_CAMPAIGN_LABELS: Record<MDFRequest["campaignType"], string> = {
  event: "Event / Trade Show",
  digital_marketing: "Digital Marketing",
  content: "Content Creation",
  training: "Training / Enablement",
  co_branded: "Co-Branded Campaign",
  other: "Other",
};

export const MDF_STATUS_LABELS: Record<MDFStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  executed: "Executed",
  paid: "Paid",
};

// ── Product Catalog ──

export type Product = {
  _id: string;
  organizationId: string;
  sku: string;
  name: string;
  category: string;
  msrp: number;
  distributorPrice: number;
  margin: number; // calculated
  status: "active" | "discontinued" | "coming_soon";
  description?: string;
  imageUrl?: string;
  createdAt: number;
};

export type ProductRebate = {
  _id: string;
  organizationId: string;
  productId: string;
  programId?: string;
  rebatePercent: number;
  minUnits: number;
  validFrom: number;
  validTo: number;
};

export type PartnerProductCertification = {
  _id: string;
  organizationId: string;
  partnerId: string;
  productId: string;
  certifiedAt: number;
  expiresAt?: number;
  level: "authorized" | "preferred" | "elite";
  status: "active" | "expired" | "revoked";
};

// ── Territory & Channel Conflict ──

export type Territory = {
  _id: string;
  organizationId: string;
  name: string;
  region: string;
  partnerId: string;
  accounts: string[]; // company names or account IDs
  isExclusive: boolean;
  createdAt: number;
};

export type ChannelConflict = {
  _id: string;
  organizationId: string;
  dealId?: string;
  accountName: string;
  partnerIds: string[]; // partners involved
  primaryPartnerId?: string;
  status: "open" | "under_review" | "resolved" | "escalated";
  resolution?: "assign_primary" | "split_credit" | "escalated" | "dismissed";
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: number;
  reportedAt: number;
  createdAt: number;
};

export const CONFLICT_STATUS_LABELS: Record<ChannelConflict["status"], string> = {
  open: "Open",
  under_review: "Under Review",
  resolved: "Resolved",
  escalated: "Escalated",
};

export const CONFLICT_RESOLUTION_LABELS: Record<string, string> = {
  assign_primary: "Assigned Primary Partner",
  split_credit: "Split Credit",
  escalated: "Escalated to Management",
  dismissed: "Dismissed",
};

// ── Incentive Programs ──────────────────────────────────────────────────────

export type IncentiveProgramType = "spif" | "bonus" | "accelerator" | "mdf_match" | "deal_reg_bonus";

export type IncentiveProgram = {
  _id: string;
  name: string;
  type: IncentiveProgramType;
  description: string;
  status: "draft" | "active" | "paused" | "ended";
  startDate: number;
  endDate: number;
  budget: number;
  spent: number;
  rules: IncentiveRule[];
  eligiblePartnerTiers: string[]; // e.g. ["gold", "platinum"]
  eligiblePartnerTypes: string[]; // e.g. ["reseller", "referral"]
  createdAt: number;
};

export type IncentiveRule = {
  metric: "deals_closed" | "revenue" | "new_logos" | "certifications" | "deal_registrations";
  threshold: number;
  reward: number; // flat $ or percentage
  rewardType: "flat" | "percentage";
  description: string;
};

export type IncentiveEnrollment = {
  _id: string;
  programId: string;
  partnerId: string;
  partnerName: string;
  enrolledAt: number;
  progress: { metric: string; current: number; target: number }[];
  earned: number;
  paid: number;
  status: "enrolled" | "achieved" | "partially_achieved" | "expired";
};

export const INCENTIVE_TYPE_LABELS: Record<IncentiveProgramType, string> = {
  spif: "SPIF",
  bonus: "Performance Bonus",
  accelerator: "Accelerator",
  mdf_match: "MDF Match",
  deal_reg_bonus: "Deal Reg Bonus",
};

export const INCENTIVE_STATUS_LABELS: Record<IncentiveProgram["status"], string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  ended: "Ended",
};
