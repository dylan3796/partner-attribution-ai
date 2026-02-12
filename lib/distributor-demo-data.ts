/**
 * Demo data for distributor/VAR channel features.
 * Volume rebates, MDF, product catalog, territories, channel conflicts.
 */
import type {
  VolumeProgram,
  VolumeRebateTier,
  PartnerVolumeRecord,
  MDFBudget,
  MDFRequest,
  Product,
  ProductRebate,
  PartnerProductCertification,
  Territory,
  ChannelConflict,
} from "./types";

const ORG_ID = "org_demo_001";
const now = Date.now();
const day = 86400000;

// ── Volume Rebate Programs ──

export const defaultVolumeTiers: VolumeRebateTier[] = [
  { minUnits: 0, maxUnits: 100, rebatePercent: 5, label: "Standard" },
  { minUnits: 101, maxUnits: 500, rebatePercent: 7, label: "Growth" },
  { minUnits: 501, maxUnits: null, rebatePercent: 10, label: "Elite" },
];

export const demoVolumePrograms: VolumeProgram[] = [
  {
    _id: "vp_001",
    organizationId: ORG_ID,
    name: "Q1 2026 Volume Rebate Program",
    period: "quarterly",
    startDate: now - 40 * day,
    endDate: now + 50 * day,
    status: "active",
    tiers: defaultVolumeTiers,
    createdAt: now - 45 * day,
  },
  {
    _id: "vp_002",
    organizationId: ORG_ID,
    name: "2026 Annual Volume Program",
    period: "annual",
    startDate: now - 40 * day,
    endDate: now + 325 * day,
    status: "active",
    tiers: [
      { minUnits: 0, maxUnits: 500, rebatePercent: 4, label: "Base" },
      { minUnits: 501, maxUnits: 2000, rebatePercent: 6, label: "Accelerator" },
      { minUnits: 2001, maxUnits: 5000, rebatePercent: 8, label: "Premier" },
      { minUnits: 5001, maxUnits: null, rebatePercent: 12, label: "Champions Club" },
    ],
    createdAt: now - 45 * day,
  },
];

export const demoPartnerVolumes: PartnerVolumeRecord[] = [
  // TechStar Solutions (p_001)
  {
    _id: "pv_001",
    organizationId: ORG_ID,
    partnerId: "p_001",
    programId: "vp_001",
    period: "2026-Q1",
    unitsTotal: 342,
    revenueTotal: 684000,
    currentTierIndex: 1,
    rebateAccrued: 23940,
    rebateProjected: 31500,
    lastUpdated: now - 1 * day,
  },
  // CloudBridge Partners (p_002)
  {
    _id: "pv_002",
    organizationId: ORG_ID,
    partnerId: "p_002",
    programId: "vp_001",
    period: "2026-Q1",
    unitsTotal: 89,
    revenueTotal: 178000,
    currentTierIndex: 0,
    rebateAccrued: 8900,
    rebateProjected: 12500,
    lastUpdated: now - 2 * day,
  },
  // DataPipe Agency (p_003)
  {
    _id: "pv_003",
    organizationId: ORG_ID,
    partnerId: "p_003",
    programId: "vp_001",
    period: "2026-Q1",
    unitsTotal: 156,
    revenueTotal: 312000,
    currentTierIndex: 1,
    rebateAccrued: 10920,
    rebateProjected: 18000,
    lastUpdated: now - 1 * day,
  },
  // NexGen Resellers (p_004)
  {
    _id: "pv_004",
    organizationId: ORG_ID,
    partnerId: "p_004",
    programId: "vp_001",
    period: "2026-Q1",
    unitsTotal: 723,
    revenueTotal: 1446000,
    currentTierIndex: 2,
    rebateAccrued: 72300,
    rebateProjected: 95000,
    lastUpdated: now - 1 * day,
  },
  // GrowthLabs Co (p_005)
  {
    _id: "pv_005",
    organizationId: ORG_ID,
    partnerId: "p_005",
    programId: "vp_001",
    period: "2026-Q1",
    unitsTotal: 67,
    revenueTotal: 134000,
    currentTierIndex: 0,
    rebateAccrued: 6700,
    rebateProjected: 9500,
    lastUpdated: now - 3 * day,
  },
  // ChannelForce Inc (p_006)
  {
    _id: "pv_006",
    organizationId: ORG_ID,
    partnerId: "p_006",
    programId: "vp_001",
    period: "2026-Q1",
    unitsTotal: 23,
    revenueTotal: 46000,
    currentTierIndex: 0,
    rebateAccrued: 2300,
    rebateProjected: 4000,
    lastUpdated: now - 5 * day,
  },
];

// ── MDF Budgets & Requests ──

export const demoMDFBudgets: MDFBudget[] = [
  { _id: "mdf_b_001", organizationId: ORG_ID, partnerId: "p_001", period: "2026", allocatedAmount: 50000, spentAmount: 18500, remainingAmount: 31500, createdAt: now - 40 * day },
  { _id: "mdf_b_002", organizationId: ORG_ID, partnerId: "p_002", period: "2026", allocatedAmount: 30000, spentAmount: 12000, remainingAmount: 18000, createdAt: now - 40 * day },
  { _id: "mdf_b_003", organizationId: ORG_ID, partnerId: "p_003", period: "2026", allocatedAmount: 25000, spentAmount: 5000, remainingAmount: 20000, createdAt: now - 40 * day },
  { _id: "mdf_b_004", organizationId: ORG_ID, partnerId: "p_004", period: "2026", allocatedAmount: 75000, spentAmount: 32000, remainingAmount: 43000, createdAt: now - 40 * day },
  { _id: "mdf_b_005", organizationId: ORG_ID, partnerId: "p_005", period: "2026", allocatedAmount: 20000, spentAmount: 3500, remainingAmount: 16500, createdAt: now - 40 * day },
];

export const demoMDFRequests: MDFRequest[] = [
  {
    _id: "mdf_r_001", organizationId: ORG_ID, partnerId: "p_004", budgetId: "mdf_b_004",
    title: "APAC Partner Summit Booth", campaignType: "event",
    description: "Exhibitor booth at the APAC Channel Summit 2026. 10x10 booth with full branding, demo stations, and lead scanners.",
    requestedAmount: 15000, approvedAmount: 15000, status: "paid",
    startDate: now - 30 * day, endDate: now - 28 * day,
    leadsGenerated: 87, pipelineCreated: 435000, revenueInfluenced: 180000,
    submittedAt: now - 45 * day, reviewedBy: "Admin User", reviewedAt: now - 42 * day,
    executedAt: now - 28 * day, paidAt: now - 14 * day,
  },
  {
    _id: "mdf_r_002", organizationId: ORG_ID, partnerId: "p_001", budgetId: "mdf_b_001",
    title: "West Coast Digital Campaign", campaignType: "digital_marketing",
    description: "Google Ads + LinkedIn campaign targeting enterprise accounts in CA, OR, WA. Co-branded landing pages with TechStar branding.",
    requestedAmount: 12000, approvedAmount: 10000, status: "executed",
    startDate: now - 20 * day, endDate: now - 5 * day,
    leadsGenerated: 142, pipelineCreated: 284000,
    submittedAt: now - 30 * day, reviewedBy: "Admin User", reviewedAt: now - 28 * day,
    executedAt: now - 5 * day,
  },
  {
    _id: "mdf_r_003", organizationId: ORG_ID, partnerId: "p_001", budgetId: "mdf_b_001",
    title: "Enterprise Webinar Series", campaignType: "content",
    description: "3-part webinar series on cloud migration for enterprise. Joint TechStar + Acme SaaS branding.",
    requestedAmount: 8500, approvedAmount: 8500, status: "approved",
    startDate: now + 10 * day, endDate: now + 30 * day,
    submittedAt: now - 10 * day, reviewedBy: "Admin User", reviewedAt: now - 7 * day,
  },
  {
    _id: "mdf_r_004", organizationId: ORG_ID, partnerId: "p_002", budgetId: "mdf_b_002",
    title: "East Coast Partner Training Event", campaignType: "training",
    description: "2-day hands-on training event for CloudBridge sales team. Covers product deep dive and certification prep.",
    requestedAmount: 12000, status: "pending",
    startDate: now + 20 * day, endDate: now + 22 * day,
    submittedAt: now - 2 * day,
  },
  {
    _id: "mdf_r_005", organizationId: ORG_ID, partnerId: "p_004", budgetId: "mdf_b_004",
    title: "Co-Branded Case Study + Video", campaignType: "co_branded",
    description: "Professional video case study featuring NexGen's largest customer deployment. Production, editing, and distribution.",
    requestedAmount: 17000, approvedAmount: 17000, status: "executed",
    startDate: now - 15 * day, endDate: now - 3 * day,
    leadsGenerated: 56, pipelineCreated: 168000,
    submittedAt: now - 25 * day, reviewedBy: "Admin User", reviewedAt: now - 22 * day,
    executedAt: now - 3 * day,
  },
  {
    _id: "mdf_r_006", organizationId: ORG_ID, partnerId: "p_003", budgetId: "mdf_b_003",
    title: "API Integration Hackathon", campaignType: "event",
    description: "Half-day hackathon for DataPipe developer community. Prizes, swag, and hands-on integration challenges.",
    requestedAmount: 5000, approvedAmount: 5000, status: "paid",
    startDate: now - 18 * day, endDate: now - 18 * day,
    leadsGenerated: 34, pipelineCreated: 85000, revenueInfluenced: 45000,
    submittedAt: now - 28 * day, reviewedBy: "Admin User", reviewedAt: now - 26 * day,
    executedAt: now - 18 * day, paidAt: now - 8 * day,
  },
  {
    _id: "mdf_r_007", organizationId: ORG_ID, partnerId: "p_005", budgetId: "mdf_b_005",
    title: "Mid-Market Email Nurture Sequence", campaignType: "digital_marketing",
    description: "Automated email sequence targeting mid-market prospects in GrowthLabs' referral pipeline. 6-email drip with co-branded content.",
    requestedAmount: 3500, approvedAmount: 3500, status: "paid",
    startDate: now - 25 * day, endDate: now - 10 * day,
    leadsGenerated: 28, pipelineCreated: 56000, revenueInfluenced: 22000,
    submittedAt: now - 35 * day, reviewedBy: "Admin User", reviewedAt: now - 33 * day,
    executedAt: now - 10 * day, paidAt: now - 5 * day,
  },
];

// ── Product Catalog ──

export const demoProducts: Product[] = [
  { _id: "prod_001", organizationId: ORG_ID, sku: "CRM-ENT-100", name: "Enterprise CRM Suite", category: "CRM", msrp: 2500, distributorPrice: 1750, margin: 30, status: "active", description: "Full-featured CRM with AI-powered insights, pipeline management, and custom workflows.", createdAt: now - 90 * day },
  { _id: "prod_002", organizationId: ORG_ID, sku: "CRM-PRO-100", name: "Professional CRM", category: "CRM", msrp: 1200, distributorPrice: 840, margin: 30, status: "active", description: "Mid-tier CRM for growing teams. Includes reporting, integrations, and mobile app.", createdAt: now - 90 * day },
  { _id: "prod_003", organizationId: ORG_ID, sku: "ANA-ENT-200", name: "Analytics Platform Enterprise", category: "Analytics", msrp: 3000, distributorPrice: 2100, margin: 30, status: "active", description: "Enterprise analytics with custom dashboards, real-time data, and ML predictions.", createdAt: now - 80 * day },
  { _id: "prod_004", organizationId: ORG_ID, sku: "ANA-STD-200", name: "Analytics Standard", category: "Analytics", msrp: 800, distributorPrice: 560, margin: 30, status: "active", description: "Standard analytics for SMBs. Pre-built dashboards and scheduled reports.", createdAt: now - 80 * day },
  { _id: "prod_005", organizationId: ORG_ID, sku: "API-PRO-300", name: "API Integration Hub", category: "Integration", msrp: 1500, distributorPrice: 1050, margin: 30, status: "active", description: "Middleware platform for connecting 200+ enterprise applications.", createdAt: now - 70 * day },
  { _id: "prod_006", organizationId: ORG_ID, sku: "SEC-ENT-400", name: "Security Audit Suite", category: "Security", msrp: 2800, distributorPrice: 1960, margin: 30, status: "active", description: "Automated security scanning, compliance reporting, and vulnerability management.", createdAt: now - 60 * day },
  { _id: "prod_007", organizationId: ORG_ID, sku: "DEV-ENT-500", name: "DevOps Enterprise", category: "DevOps", msrp: 3500, distributorPrice: 2450, margin: 30, status: "active", description: "CI/CD pipelines, infrastructure as code, and deployment automation.", createdAt: now - 50 * day },
  { _id: "prod_008", organizationId: ORG_ID, sku: "MON-PRO-600", name: "Monitoring Pro", category: "Monitoring", msrp: 900, distributorPrice: 630, margin: 30, status: "active", description: "Application and infrastructure monitoring with alerting and on-call management.", createdAt: now - 40 * day },
  { _id: "prod_009", organizationId: ORG_ID, sku: "COM-ENT-700", name: "Compliance Platform", category: "Compliance", msrp: 2200, distributorPrice: 1540, margin: 30, status: "active", description: "SOC2, HIPAA, and GDPR compliance automation with continuous monitoring.", createdAt: now - 30 * day },
  { _id: "prod_010", organizationId: ORG_ID, sku: "CLD-PRO-800", name: "Cloud Hosting Pro", category: "Infrastructure", msrp: 1800, distributorPrice: 1260, margin: 30, status: "coming_soon", description: "Managed cloud hosting with auto-scaling, CDN, and 99.99% uptime SLA.", createdAt: now - 10 * day },
];

export const demoProductRebates: ProductRebate[] = [
  { _id: "pr_001", organizationId: ORG_ID, productId: "prod_001", rebatePercent: 8, minUnits: 10, validFrom: now - 40 * day, validTo: now + 50 * day },
  { _id: "pr_002", organizationId: ORG_ID, productId: "prod_003", rebatePercent: 10, minUnits: 5, validFrom: now - 40 * day, validTo: now + 50 * day },
  { _id: "pr_003", organizationId: ORG_ID, productId: "prod_007", rebatePercent: 12, minUnits: 3, validFrom: now - 40 * day, validTo: now + 50 * day },
];

export const demoPartnerProductCerts: PartnerProductCertification[] = [
  // TechStar — certified for most products
  { _id: "ppc_001", organizationId: ORG_ID, partnerId: "p_001", productId: "prod_001", certifiedAt: now - 60 * day, level: "preferred", status: "active" },
  { _id: "ppc_002", organizationId: ORG_ID, partnerId: "p_001", productId: "prod_002", certifiedAt: now - 60 * day, level: "preferred", status: "active" },
  { _id: "ppc_003", organizationId: ORG_ID, partnerId: "p_001", productId: "prod_003", certifiedAt: now - 50 * day, level: "authorized", status: "active" },
  { _id: "ppc_004", organizationId: ORG_ID, partnerId: "p_001", productId: "prod_005", certifiedAt: now - 40 * day, level: "authorized", status: "active" },
  // NexGen — elite distributor
  { _id: "ppc_005", organizationId: ORG_ID, partnerId: "p_004", productId: "prod_001", certifiedAt: now - 80 * day, level: "elite", status: "active" },
  { _id: "ppc_006", organizationId: ORG_ID, partnerId: "p_004", productId: "prod_002", certifiedAt: now - 80 * day, level: "elite", status: "active" },
  { _id: "ppc_007", organizationId: ORG_ID, partnerId: "p_004", productId: "prod_003", certifiedAt: now - 70 * day, level: "elite", status: "active" },
  { _id: "ppc_008", organizationId: ORG_ID, partnerId: "p_004", productId: "prod_006", certifiedAt: now - 60 * day, level: "preferred", status: "active" },
  { _id: "ppc_009", organizationId: ORG_ID, partnerId: "p_004", productId: "prod_007", certifiedAt: now - 55 * day, level: "elite", status: "active" },
  // CloudBridge
  { _id: "ppc_010", organizationId: ORG_ID, partnerId: "p_002", productId: "prod_001", certifiedAt: now - 50 * day, level: "authorized", status: "active" },
  { _id: "ppc_011", organizationId: ORG_ID, partnerId: "p_002", productId: "prod_004", certifiedAt: now - 50 * day, level: "preferred", status: "active" },
  // DataPipe
  { _id: "ppc_012", organizationId: ORG_ID, partnerId: "p_003", productId: "prod_005", certifiedAt: now - 45 * day, level: "elite", status: "active" },
  { _id: "ppc_013", organizationId: ORG_ID, partnerId: "p_003", productId: "prod_003", certifiedAt: now - 40 * day, level: "preferred", status: "active" },
  // GrowthLabs
  { _id: "ppc_014", organizationId: ORG_ID, partnerId: "p_005", productId: "prod_002", certifiedAt: now - 30 * day, level: "authorized", status: "active" },
  { _id: "ppc_015", organizationId: ORG_ID, partnerId: "p_005", productId: "prod_004", certifiedAt: now - 30 * day, level: "authorized", status: "active" },
];

// ── Territories ──

export const demoTerritories: Territory[] = [
  { _id: "terr_001", organizationId: ORG_ID, name: "West Coast", region: "US West", partnerId: "p_001", accounts: ["Globex Corp", "Soylent Corp", "Massive Dynamic"], isExclusive: true, createdAt: now - 60 * day },
  { _id: "terr_002", organizationId: ORG_ID, name: "East Coast", region: "US East", partnerId: "p_002", accounts: ["Initech", "Dunder Mifflin", "Wayne Enterprises"], isExclusive: true, createdAt: now - 55 * day },
  { _id: "terr_003", organizationId: ORG_ID, name: "National - Integration", region: "National", partnerId: "p_003", accounts: ["Soylent Corp", "Umbrella Inc", "Massive Dynamic"], isExclusive: false, createdAt: now - 50 * day },
  { _id: "terr_004", organizationId: ORG_ID, name: "APAC", region: "Asia Pacific", partnerId: "p_004", accounts: ["Stark Industries", "Cyberdyne Systems", "Oscorp"], isExclusive: true, createdAt: now - 45 * day },
  { _id: "terr_005", organizationId: ORG_ID, name: "Mid-Market National", region: "National", partnerId: "p_005", accounts: ["Wayne Enterprises", "Dunder Mifflin"], isExclusive: false, createdAt: now - 40 * day },
  { _id: "terr_006", organizationId: ORG_ID, name: "Central US", region: "US Central", partnerId: "p_006", accounts: [], isExclusive: true, createdAt: now - 10 * day },
];

// ── Channel Conflicts ──

export const demoChannelConflicts: ChannelConflict[] = [
  {
    _id: "conf_001", organizationId: ORG_ID, dealId: "d_005",
    accountName: "Wayne Enterprises",
    partnerIds: ["p_002", "p_005"],
    status: "open",
    reportedAt: now - 3 * day,
    createdAt: now - 3 * day,
  },
  {
    _id: "conf_002", organizationId: ORG_ID,
    accountName: "Massive Dynamic",
    partnerIds: ["p_001", "p_003"],
    primaryPartnerId: "p_001",
    status: "resolved",
    resolution: "assign_primary",
    resolutionNotes: "TechStar had the initial referral; DataPipe provided technical support. TechStar gets primary credit, DataPipe gets 15% co-sell attribution.",
    resolvedBy: "Admin User",
    resolvedAt: now - 10 * day,
    reportedAt: now - 15 * day,
    createdAt: now - 15 * day,
  },
  {
    _id: "conf_003", organizationId: ORG_ID,
    accountName: "Dunder Mifflin",
    partnerIds: ["p_002", "p_005"],
    status: "under_review",
    reportedAt: now - 5 * day,
    createdAt: now - 5 * day,
  },
  {
    _id: "conf_004", organizationId: ORG_ID,
    accountName: "Soylent Corp",
    partnerIds: ["p_001", "p_003"],
    primaryPartnerId: "p_003",
    status: "resolved",
    resolution: "split_credit",
    resolutionNotes: "Both partners contributed significantly. DataPipe handled technical integration (60%), TechStar handled commercial relationship (40%).",
    resolvedBy: "Admin User",
    resolvedAt: now - 20 * day,
    reportedAt: now - 25 * day,
    createdAt: now - 25 * day,
  },
];

// ── Helper functions ──

export function getPartnerVolume(partnerId: string, programId: string): PartnerVolumeRecord | undefined {
  return demoPartnerVolumes.find((v) => v.partnerId === partnerId && v.programId === programId);
}

export function getPartnerMDFBudget(partnerId: string): MDFBudget | undefined {
  return demoMDFBudgets.find((b) => b.partnerId === partnerId);
}

export function getPartnerMDFRequests(partnerId: string): MDFRequest[] {
  return demoMDFRequests.filter((r) => r.partnerId === partnerId);
}

export function getPartnerTerritories(partnerId: string): Territory[] {
  return demoTerritories.filter((t) => t.partnerId === partnerId);
}

export function getPartnerProductCerts(partnerId: string): PartnerProductCertification[] {
  return demoPartnerProductCerts.filter((c) => c.partnerId === partnerId);
}

export function getProductById(productId: string): Product | undefined {
  return demoProducts.find((p) => p._id === productId);
}

export function getUnresolvedConflicts(): ChannelConflict[] {
  return demoChannelConflicts.filter((c) => c.status === "open" || c.status === "under_review");
}

/** Calculate volume tier for units */
export function getVolumeTier(units: number, tiers: VolumeRebateTier[]): { tier: VolumeRebateTier; index: number; nextTier: VolumeRebateTier | null; unitsToNext: number } {
  let currentIndex = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (units >= tiers[i].minUnits) {
      currentIndex = i;
      break;
    }
  }
  const nextTier = currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  const unitsToNext = nextTier ? nextTier.minUnits - units : 0;

  return {
    tier: tiers[currentIndex],
    index: currentIndex,
    nextTier,
    unitsToNext: Math.max(0, unitsToNext),
  };
}
