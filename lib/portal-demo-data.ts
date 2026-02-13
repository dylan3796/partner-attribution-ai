/**
 * Demo data for the Partner Portal.
 * Provides partner-scoped views — partners only see their own data.
 */

import {
  demoDeals,
  demoTouchpoints,
  demoAttributions,
  demoPartners,
} from "./demo-data";
import type { Deal, Touchpoint, Attribution } from "./types";

const now = Date.now();
const day = 86400000;

// ─── Partner Profiles ───────────────────────────────────────────
export type PortalPartnerProfile = {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  type: "reseller" | "referral" | "affiliate" | "integration";
  tier: "bronze" | "silver" | "gold" | "platinum";
  status: "active" | "inactive" | "pending";
  commissionRate: number;
  joinedAt: number;
  partnerManager: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  website: string;
  /** Maps to one or more partnerId entries in demoPartners */
  linkedPartnerIds: string[];
};

export const portalPartners: PortalPartnerProfile[] = [
  {
    id: "portal_001",
    companyName: "TechStar Solutions",
    contactName: "James Chen",
    contactEmail: "james@techstarsolutions.com",
    phone: "+1 (555) 234-5678",
    type: "reseller",
    tier: "gold",
    status: "active",
    commissionRate: 18,
    joinedAt: now - 365 * day,
    partnerManager: {
      name: "Amanda Foster",
      email: "amanda.foster@acmesaas.io",
      phone: "+1 (555) 100-2000",
    },
    address: "450 Tech Blvd, Suite 300, San Francisco, CA 94105",
    website: "https://techstarsolutions.com",
    linkedPartnerIds: ["p_004"], // James Chen — reseller
  },
  {
    id: "portal_002",
    companyName: "GrowthLabs Agency",
    contactName: "Priya Patel",
    contactEmail: "priya@growthlabs.co",
    phone: "+1 (555) 345-6789",
    type: "referral",
    tier: "silver",
    status: "active",
    commissionRate: 14,
    joinedAt: now - 200 * day,
    partnerManager: {
      name: "Amanda Foster",
      email: "amanda.foster@acmesaas.io",
      phone: "+1 (555) 100-2000",
    },
    address: "88 Startup Ave, Austin, TX 78701",
    website: "https://growthlabs.co",
    linkedPartnerIds: ["p_005"], // Priya Patel — referral
  },
  {
    id: "portal_003",
    companyName: "ContentForce Media",
    contactName: "Elena Rodriguez",
    contactEmail: "elena@contentforce.co",
    phone: "+1 (555) 456-7890",
    type: "affiliate",
    tier: "bronze",
    status: "active",
    commissionRate: 10,
    joinedAt: now - 150 * day,
    partnerManager: {
      name: "Ryan Mitchell",
      email: "ryan.mitchell@acmesaas.io",
      phone: "+1 (555) 100-3000",
    },
    address: "200 Content Way, New York, NY 10001",
    website: "https://contentforce.co",
    linkedPartnerIds: ["p_003"], // Elena Rodriguez — affiliate
  },
];

// ─── Helpers to scope data to a portal partner ─────────────────

/** Get all touchpoints belonging to this portal partner */
export function getPartnerTouchpoints(profile: PortalPartnerProfile): Touchpoint[] {
  return demoTouchpoints
    .filter((tp) => profile.linkedPartnerIds.includes(tp.partnerId))
    .sort((a, b) => b.createdAt - a.createdAt);
}

/** Get all deals this portal partner has touchpoints on */
export function getPartnerDeals(profile: PortalPartnerProfile): Deal[] {
  const touchpoints = getPartnerTouchpoints(profile);
  const dealIds = [...new Set(touchpoints.map((tp) => tp.dealId))];
  return demoDeals.filter((d) => dealIds.includes(d._id));
}

/** Get attributions (role_based model) for this partner only */
export function getPartnerAttributions(
  profile: PortalPartnerProfile
): Attribution[] {
  return demoAttributions.filter(
    (a) =>
      profile.linkedPartnerIds.includes(a.partnerId) &&
      a.model === "role_based" // Portal uses role-based as the default model
  );
}

export type PortalCommission = {
  id: string;
  dealId: string;
  dealName: string;
  dealAmount: number;
  attributionPct: number;
  commissionAmount: number;
  status: "pending" | "approved" | "paid";
  date: number;
  paidAt?: number;
};

/** Build commissions list for a portal partner */
export function getPartnerCommissions(
  profile: PortalPartnerProfile
): PortalCommission[] {
  const attributions = getPartnerAttributions(profile);
  return attributions.map((a, i) => {
    const deal = demoDeals.find((d) => d._id === a.dealId);
    const status: PortalCommission["status"] =
      !deal
        ? "pending"
        : deal.closedAt && deal.closedAt < now - 30 * day
        ? "paid"
        : deal.closedAt && deal.closedAt < now - 7 * day
        ? "approved"
        : "pending";
    return {
      id: `comm_${i + 1}`,
      dealId: a.dealId,
      dealName: deal?.name ?? "Unknown Deal",
      dealAmount: deal?.amount ?? 0,
      attributionPct: a.percentage,
      commissionAmount: a.commissionAmount,
      status,
      date: a.calculatedAt,
      paidAt: status === "paid" ? a.calculatedAt + 14 * day : undefined,
    };
  });
}

/** Summary stats for a partner */
export function getPartnerStats(profile: PortalPartnerProfile) {
  const commissions = getPartnerCommissions(profile);
  const deals = getPartnerDeals(profile);
  const thirtyDaysAgo = now - 30 * day;
  const ninetyDaysAgo = now - 90 * day;

  const totalEarned = commissions
    .filter((c) => c.status === "paid")
    .reduce((s, c) => s + c.commissionAmount, 0);
  const pending = commissions
    .filter((c) => c.status === "pending" || c.status === "approved")
    .reduce((s, c) => s + c.commissionAmount, 0);
  const paidThisMonth = commissions
    .filter((c) => c.status === "paid" && c.paidAt && c.paidAt >= thirtyDaysAgo)
    .reduce((s, c) => s + c.commissionAmount, 0);
  const paidThisQuarter = commissions
    .filter((c) => c.status === "paid" && c.paidAt && c.paidAt >= ninetyDaysAgo)
    .reduce((s, c) => s + c.commissionAmount, 0);
  const dealsInPipeline = deals.filter((d) => d.status === "open").length;
  const activeDeals = deals.filter((d) => d.status === "open" || d.status === "won").length;

  return {
    totalEarned,
    pending,
    paidThisMonth,
    paidThisQuarter,
    dealsInPipeline,
    activeDeals,
    totalDeals: deals.length,
    wonDeals: deals.filter((d) => d.status === "won").length,
    totalRevenue: deals
      .filter((d) => d.status === "won")
      .reduce((s, d) => s + d.amount, 0),
  };
}

// ─── Deal Registrations ─────────────────────────────────────────
export type DealRegistration = {
  id: string;
  companyName: string;
  estimatedValue: number;
  contactName: string;
  contactEmail: string;
  notes: string;
  expectedCloseDate: string;
  status: "pending_approval" | "approved" | "rejected";
  submittedAt: number;
};

export const demoDealRegistrations: DealRegistration[] = [
  {
    id: "reg_001",
    companyName: "NovaTech Industries",
    estimatedValue: 75000,
    contactName: "Mark Thompson",
    contactEmail: "mark@novatech.com",
    notes: "Met at SaaStr conference. Very interested in our API integration tier.",
    expectedCloseDate: "2026-04-15",
    status: "pending_approval",
    submittedAt: now - 2 * day,
  },
  {
    id: "reg_002",
    companyName: "Meridian Health Systems",
    estimatedValue: 120000,
    contactName: "Dr. Sarah Kim",
    contactEmail: "s.kim@meridianhealth.org",
    notes: "Healthcare compliance use case. Needs SOC2 details.",
    expectedCloseDate: "2026-05-01",
    status: "approved",
    submittedAt: now - 15 * day,
  },
];

// ─── Resources ──────────────────────────────────────────────────
export type PortalResource = {
  id: string;
  title: string;
  description: string;
  category:
    | "sales_collateral"
    | "case_studies"
    | "product_docs"
    | "co_marketing"
    | "training";
  type: "PDF" | "Video" | "Template" | "Guide" | "Webinar";
  updatedAt: number;
};

export const portalResources: PortalResource[] = [
  // Sales Collateral
  {
    id: "res_001",
    title: "Partner Battle Card — Enterprise",
    description:
      "Competitive positioning and talking points for enterprise sales conversations.",
    category: "sales_collateral",
    type: "PDF",
    updatedAt: now - 5 * day,
  },
  {
    id: "res_002",
    title: "Product One-Pager",
    description:
      "High-level overview of the platform with key features and pricing tiers.",
    category: "sales_collateral",
    type: "PDF",
    updatedAt: now - 10 * day,
  },
  {
    id: "res_003",
    title: "ROI Calculator Spreadsheet",
    description:
      "Customizable ROI model to share with prospects during the evaluation phase.",
    category: "sales_collateral",
    type: "Template",
    updatedAt: now - 20 * day,
  },

  // Case Studies
  {
    id: "res_004",
    title: "Case Study: Globex Corp — 3x Pipeline Growth",
    description:
      "How Globex Corp used PartnerBase AI to triple their partner-sourced pipeline in 6 months.",
    category: "case_studies",
    type: "PDF",
    updatedAt: now - 8 * day,
  },
  {
    id: "res_005",
    title: "Case Study: Initech — Fair Attribution at Scale",
    description:
      "Initech's journey from manual tracking to automated multi-touch attribution.",
    category: "case_studies",
    type: "PDF",
    updatedAt: now - 30 * day,
  },

  // Product Documentation
  {
    id: "res_006",
    title: "API Integration Guide",
    description:
      "Complete technical documentation for integrating with the PartnerBase AI API.",
    category: "product_docs",
    type: "Guide",
    updatedAt: now - 3 * day,
  },
  {
    id: "res_007",
    title: "Platform Walkthrough Video",
    description:
      "15-minute guided tour of the platform's core features for new partners.",
    category: "product_docs",
    type: "Video",
    updatedAt: now - 15 * day,
  },

  // Co-Marketing Templates
  {
    id: "res_008",
    title: "Co-Branded Email Template Kit",
    description:
      "Pre-built email sequences for joint outreach campaigns with your branding.",
    category: "co_marketing",
    type: "Template",
    updatedAt: now - 12 * day,
  },
  {
    id: "res_009",
    title: "Social Media Asset Pack",
    description:
      "Branded social graphics and copy for LinkedIn, Twitter, and more.",
    category: "co_marketing",
    type: "Template",
    updatedAt: now - 7 * day,
  },

  // Training & Certification
  {
    id: "res_010",
    title: "Partner Certification Course",
    description:
      "Self-paced certification program covering product knowledge and sales methodology.",
    category: "training",
    type: "Webinar",
    updatedAt: now - 1 * day,
  },
  {
    id: "res_011",
    title: "Advanced Attribution Models — Deep Dive",
    description:
      "Training session on how attribution models work and how to explain them to customers.",
    category: "training",
    type: "Video",
    updatedAt: now - 25 * day,
  },
];

export const RESOURCE_CATEGORY_LABELS: Record<PortalResource["category"], string> = {
  sales_collateral: "Sales Collateral",
  case_studies: "Case Studies",
  product_docs: "Product Documentation",
  co_marketing: "Co-Marketing Templates",
  training: "Training & Certification",
};

export const RESOURCE_TYPE_COLORS: Record<PortalResource["type"], string> = {
  PDF: "badge-danger",
  Video: "badge-info",
  Template: "badge-success",
  Guide: "badge-neutral",
  Webinar: "badge-info",
};

// ─── Disputes ───────────────────────────────────────────────────
export type Dispute = {
  id: string;
  dealId: string;
  dealName: string;
  currentAttribution: number;
  requestedAttribution: number;
  reason: string;
  status: "open" | "under_review" | "resolved";
  submittedAt: number;
};

export const demoDisputes: Dispute[] = [];
