/**
 * Meridian Analytics — the curated demo dataset behind /demo and the landing
 * page hero. A fictional ~$40M ARR B2B SaaS company with 3 partner programs,
 * 8 partners, 20 deals, and 57 touchpoints engineered so the five attribution
 * models tell visibly different stories:
 *
 *  - md_007  the attribution gap: the registrant gets 100% under first-touch
 *            but two other partners did the implementation + closing work
 *  - mp_006  Quietwater Consulting: invisible under first-touch (zero sourced
 *            deals) but the #1 partner under implementation credit
 *  - md_012  the co-sell deal: three partners, materially different ledgers
 *            under first-touch / split-equally / marketplace co-sell
 *  - md_003  the flagship: four partners, all four roles — no single model
 *            tells the whole story
 *
 * Everything is deterministic: timestamps are offsets from MERIDIAN_NOW, never
 * Date.now(), so demo numbers and tests are stable.
 */
import type {
  AttributionModel,
  Deal,
  Organization,
  Partner,
  Touchpoint,
} from "../types";

export const MERIDIAN_NOW = Date.UTC(2026, 5, 1); // fixed "today" for the demo
const DAY = 86400000;
const ORG_ID = "org_meridian";

/** Epoch ms for `n` days before the demo's fixed "today". */
export function daysAgo(n: number): number {
  return MERIDIAN_NOW - n * DAY;
}

export const meridianOrg: Organization = {
  _id: ORG_ID,
  name: "Meridian Analytics",
  email: "partnerops@meridiananalytics.com",
  apiKey: "pk_demo_meridian_xxxxxxxxxxxxxxxxxxxxxxxx",
  plan: "growth",
  defaultAttributionModel: "role_weighted",
  createdAt: daysAgo(360),
};

/** Company-level facts used in demo copy (Organization has no ARR field). */
export const MERIDIAN_ARR = 40_000_000;

export interface MeridianProgram {
  id: string;
  name: string;
  /** The program's default attribution lens. */
  model: AttributionModel;
  partnerIds: string[];
}

export const meridianPrograms: MeridianProgram[] = [
  {
    id: "prog_resell",
    name: "Resell",
    model: "first_touch_sourcer",
    partnerIds: ["mp_002", "mp_005"],
  },
  {
    id: "prog_integration",
    name: "Integration Partners",
    model: "role_weighted",
    partnerIds: ["mp_003", "mp_008"],
  },
  {
    id: "prog_services",
    name: "Services / SI",
    model: "implementation_credit",
    partnerIds: ["mp_001", "mp_004", "mp_006", "mp_007"],
  },
];

export const meridianPartners: Partner[] = [
  {
    _id: "mp_001", organizationId: ORG_ID,
    name: "Northwind Consulting", email: "alliances@northwindconsulting.com",
    type: "integration", tier: "platinum", commissionRate: 15, status: "active",
    contactName: "Dana Whitfield", territory: "National",
    notes: "Top SI partner — sources and closes across the enterprise segment.",
    createdAt: daysAgo(340),
  },
  {
    _id: "mp_002", organizationId: ORG_ID,
    name: "Bluepeak Systems", email: "partners@bluepeaksystems.com",
    type: "reseller", tier: "gold", commissionRate: 18, status: "active",
    contactName: "Marcus Ellery", territory: "West",
    notes: "High-volume reseller. Registers most of what they touch.",
    createdAt: daysAgo(320),
  },
  {
    _id: "mp_003", organizationId: ORG_ID,
    name: "Cobalt Integrations", email: "hello@cobaltintegrations.io",
    type: "integration", tier: "silver", commissionRate: 12, status: "active",
    contactName: "Ines Farrow", territory: "East",
    notes: "Mid-tier integration shop with a strong delivery bench.",
    createdAt: daysAgo(280),
  },
  {
    _id: "mp_004", organizationId: ORG_ID,
    name: "Harbor & Lane", email: "team@harborandlane.com",
    type: "referral", tier: "silver", commissionRate: 10, status: "active",
    contactName: "Priya Raman", territory: "Midwest",
    notes: "Boutique advisory firm. Warm introductions into regulated industries.",
    createdAt: daysAgo(260),
  },
  {
    _id: "mp_005", organizationId: ORG_ID,
    name: "Vector Channel Group", email: "ops@vectorchannel.com",
    type: "reseller", tier: "silver", commissionRate: 15, status: "active",
    contactName: "Tom Okafor", territory: "South",
    notes: "Mid-market reseller, growing registration volume.",
    createdAt: daysAgo(240),
  },
  {
    // The dormant-looking implementer: zero sourced deals in 12 months, but
    // technical enablement on five won deals — invisible under first-touch,
    // #1 under implementation credit.
    _id: "mp_006", organizationId: ORG_ID,
    name: "Quietwater Consulting", email: "delivery@quietwater.co",
    type: "integration", tier: "bronze", commissionRate: 12, status: "active",
    contactName: "Sofia Brandt", territory: "National",
    notes: "Delivery-focused consultancy. No new sourced deals in 120+ days.",
    createdAt: daysAgo(300),
  },
  {
    _id: "mp_007", organizationId: ORG_ID,
    name: "Summitline Partners", email: "info@summitlinepartners.com",
    type: "referral", tier: "bronze", commissionRate: 10, status: "inactive",
    contactName: "Gene Halvorsen", territory: "Mountain",
    notes: "No activity since two lost deals last winter. Re-engagement candidate.",
    createdAt: daysAgo(290),
  },
  {
    // Name intentionally matches the engine's hyperscaler classifier ("aws").
    _id: "mp_008", organizationId: ORG_ID,
    name: "AWS Marketplace", email: "cosell@meridiananalytics.com",
    type: "distributor", tier: "gold", commissionRate: 5, status: "active",
    contactName: "Marketplace Ops", territory: "Global",
    notes: "Marketplace listing + co-sell motion. Touches arrive as co_sell only.",
    createdAt: daysAgo(220),
  },
];

export const meridianDeals: Deal[] = [
  // ── Won (9) ──
  { _id: "md_001", organizationId: ORG_ID, name: "Atlas Freight — analytics platform", amount: 120000, status: "won", closedAt: daysAgo(30), registeredBy: "mp_002", registrationStatus: "approved", programId: "prog_resell", contactName: "R. Calloway", createdAt: daysAgo(150) },
  { _id: "md_002", organizationId: ORG_ID, name: "Beacon Health — data platform", amount: 95000, status: "won", closedAt: daysAgo(75), programId: "prog_services", contactName: "J. Osei", createdAt: daysAgo(200) },
  { _id: "md_003", organizationId: ORG_ID, name: "Crestline Bank — enterprise rollout", amount: 480000, status: "won", closedAt: daysAgo(12), registeredBy: "mp_001", registrationStatus: "approved", programId: "prog_services", contactName: "V. Marsh", createdAt: daysAgo(190) },
  { _id: "md_004", organizationId: ORG_ID, name: "Daybreak Retail — POS analytics", amount: 60000, status: "won", closedAt: daysAgo(90), programId: "prog_resell", contactName: "L. Tran", createdAt: daysAgo(160) },
  { _id: "md_005", organizationId: ORG_ID, name: "Eastgate Logistics — ops dashboards", amount: 75000, status: "won", closedAt: daysAgo(45), registeredBy: "mp_002", registrationStatus: "approved", programId: "prog_resell", contactName: "S. Demir", createdAt: daysAgo(140) },
  { _id: "md_006", organizationId: ORG_ID, name: "Fernwood Insurance — claims analytics", amount: 150000, status: "won", closedAt: daysAgo(20), programId: "prog_services", contactName: "A. Kowalski", createdAt: daysAgo(170) },
  { _id: "md_007", organizationId: ORG_ID, name: "Granite Peak Manufacturing — plant analytics", amount: 220000, status: "won", closedAt: daysAgo(8), registeredBy: "mp_002", registrationStatus: "approved", programId: "prog_resell", contactName: "H. Lindqvist", createdAt: daysAgo(130) },
  { _id: "md_009", organizationId: ORG_ID, name: "Juniper Foods — demand forecasting", amount: 48000, status: "won", closedAt: daysAgo(100), programId: "prog_services", contactName: "M. Beaulieu", createdAt: daysAgo(180) },
  { _id: "md_012", organizationId: ORG_ID, name: "Ironbridge Media — cloud migration", amount: 180000, status: "won", closedAt: daysAgo(15), programId: "prog_integration", contactName: "C. Ngata", createdAt: daysAgo(110) },

  // ── Open (8) ──
  { _id: "md_008", organizationId: ORG_ID, name: "Kestrel Capital — reporting suite", amount: 130000, status: "open", expectedCloseDate: MERIDIAN_NOW + 20 * DAY, registeredBy: "mp_001", registrationStatus: "approved", programId: "prog_services", contactName: "F. Adeyemi", createdAt: daysAgo(90) },
  { _id: "md_010", organizationId: ORG_ID, name: "Lakeshore Apparel — merch analytics", amount: 42000, status: "open", expectedCloseDate: MERIDIAN_NOW + 35 * DAY, programId: "prog_resell", contactName: "B. Sato", createdAt: daysAgo(60) },
  { _id: "md_011", organizationId: ORG_ID, name: "Meridian West Clinics — patient flow", amount: 88000, status: "open", expectedCloseDate: MERIDIAN_NOW + 14 * DAY, registeredBy: "mp_002", registrationStatus: "approved", programId: "prog_resell", contactName: "E. Vargas", createdAt: daysAgo(100) },
  { _id: "md_013", organizationId: ORG_ID, name: "Northgate Energy — grid telemetry", amount: 210000, status: "open", expectedCloseDate: MERIDIAN_NOW + 45 * DAY, programId: "prog_integration", contactName: "K. Strand", createdAt: daysAgo(75) },
  { _id: "md_014", organizationId: ORG_ID, name: "Oakhurst Schools — attendance insights", amount: 36000, status: "open", expectedCloseDate: MERIDIAN_NOW + 28 * DAY, registeredBy: "mp_005", registrationStatus: "pending", programId: "prog_resell", contactName: "T. Maier", createdAt: daysAgo(45) },
  { _id: "md_015", organizationId: ORG_ID, name: "Pinnacle Robotics — telemetry warehouse", amount: 160000, status: "open", expectedCloseDate: MERIDIAN_NOW + 60 * DAY, programId: "prog_services", contactName: "Y. Castellanos", createdAt: daysAgo(55) },
  { _id: "md_016", organizationId: ORG_ID, name: "Quarry Lane Biotech — trial analytics", amount: 70000, status: "open", expectedCloseDate: MERIDIAN_NOW + 25 * DAY, programId: "prog_services", contactName: "W. Iverson", createdAt: daysAgo(80) },
  { _id: "md_017", organizationId: ORG_ID, name: "Riverbend Hotels — revenue management", amount: 54000, status: "open", expectedCloseDate: MERIDIAN_NOW + 40 * DAY, programId: "prog_resell", contactName: "P. Acheampong", createdAt: daysAgo(35) },

  // ── Lost (3) ──
  { _id: "md_018", organizationId: ORG_ID, name: "Stonebrook Partners — analytics portal", amount: 45000, status: "lost", closedAt: daysAgo(65), programId: "prog_resell", contactName: "N. Duval", createdAt: daysAgo(150) },
  { _id: "md_019", organizationId: ORG_ID, name: "Tidewater Marine — fleet analytics", amount: 92000, status: "lost", closedAt: daysAgo(110), programId: "prog_services", contactName: "G. Petrov", createdAt: daysAgo(220) },
  { _id: "md_020", organizationId: ORG_ID, name: "Umberline Fitness — member analytics", amount: 38000, status: "lost", closedAt: daysAgo(140), programId: "prog_services", contactName: "D. Albrecht", createdAt: daysAgo(230) },
];

// Touchpoint helper — keeps the table below readable.
let tpSeq = 0;
function tp(dealId: string, partnerId: string, type: Touchpoint["type"], ago: number, notes?: string): Touchpoint {
  tpSeq += 1;
  return {
    _id: `mt_${String(tpSeq).padStart(3, "0")}`,
    organizationId: ORG_ID,
    dealId,
    partnerId,
    type,
    notes,
    createdAt: daysAgo(ago),
  };
}

export const meridianTouchpoints: Touchpoint[] = [
  // md_001 — Atlas Freight (won). Bluepeak registered; Quietwater implemented.
  tp("md_001", "mp_002", "deal_registration", 150, "Bluepeak registered the opportunity"),
  tp("md_001", "mp_002", "demo", 120, "Bluepeak ran the platform demo"),
  tp("md_001", "mp_006", "technical_enablement", 60, "Quietwater built the data pipeline integration"),
  tp("md_001", "mp_001", "negotiation", 40, "Northwind supported commercial negotiation"),

  // md_002 — Beacon Health (won). Northwind sourced + closed; Quietwater implemented.
  tp("md_002", "mp_001", "referral", 200, "Northwind referred Beacon's VP Data"),
  tp("md_002", "mp_004", "demo", 170, "Harbor & Lane co-hosted the clinical demo"),
  tp("md_002", "mp_006", "technical_enablement", 100, "Quietwater led the EHR integration"),
  tp("md_002", "mp_001", "proposal", 90, "Northwind drafted the joint proposal"),

  // md_003 — Crestline Bank (won, FLAGSHIP). Four partners, all four roles.
  tp("md_003", "mp_001", "deal_registration", 190, "Northwind registered the enterprise rollout"),
  tp("md_003", "mp_004", "demo", 150, "Harbor & Lane ran the risk-team demo"),
  tp("md_003", "mp_001", "co_sell", 100, "Northwind joint exec session"),
  tp("md_003", "mp_006", "technical_enablement", 80, "Quietwater delivered the core-banking integration"),
  tp("md_003", "mp_002", "negotiation", 30, "Bluepeak negotiated the reseller paper"),

  // md_004 — Daybreak Retail (won). Vector sourced; Quietwater implemented.
  tp("md_004", "mp_005", "referral", 160, "Vector referred Daybreak ops"),
  tp("md_004", "mp_005", "proposal", 110, "Vector proposal support"),
  tp("md_004", "mp_006", "technical_enablement", 95, "Quietwater wired the POS feed"),

  // md_005 — Eastgate Logistics (won). Bluepeak registered + closed; Cobalt implemented.
  tp("md_005", "mp_002", "deal_registration", 140, "Bluepeak registered Eastgate"),
  tp("md_005", "mp_003", "technical_enablement", 70, "Cobalt built the TMS connector"),
  tp("md_005", "mp_002", "negotiation", 50, "Bluepeak ran final terms"),

  // md_006 — Fernwood Insurance (won). Harbor & Lane sourced; Quietwater implemented.
  tp("md_006", "mp_004", "introduction", 170, "Harbor & Lane introduced the claims VP"),
  tp("md_006", "mp_001", "demo", 130, "Northwind ran the actuarial demo"),
  tp("md_006", "mp_006", "technical_enablement", 35, "Quietwater integrated the claims warehouse"),
  tp("md_006", "mp_001", "proposal", 28, "Northwind co-authored the proposal"),

  // md_007 — Granite Peak (won, THE ATTRIBUTION GAP). Bluepeak registered and
  // gets 100% under first-touch; Cobalt implemented and Northwind closed.
  tp("md_007", "mp_002", "deal_registration", 130, "Bluepeak registered Granite Peak"),
  tp("md_007", "mp_003", "technical_enablement", 55, "Cobalt delivered the historian integration"),
  tp("md_007", "mp_001", "proposal", 25, "Northwind built the rollout proposal"),
  tp("md_007", "mp_001", "negotiation", 12, "Northwind closed the commercial terms"),

  // md_009 — Juniper Foods (won). Northwind end-to-end, single partner.
  tp("md_009", "mp_001", "introduction", 180, "Northwind introduction"),
  tp("md_009", "mp_001", "demo", 150, "Northwind forecasting demo"),
  tp("md_009", "mp_001", "proposal", 120, "Northwind proposal"),

  // md_012 — Ironbridge Media (won, THE CO-SELL DEAL). Marketplace + two partners.
  tp("md_012", "mp_002", "referral", 110, "Bluepeak referred Ironbridge platform team"),
  tp("md_012", "mp_008", "co_sell", 80, "AWS Marketplace co-sell motion + private offer"),
  tp("md_012", "mp_001", "proposal", 30, "Northwind migration proposal"),

  // md_008 — Kestrel Capital (open).
  tp("md_008", "mp_001", "deal_registration", 90, "Northwind registered Kestrel"),
  tp("md_008", "mp_003", "technical_enablement", 30, "Cobalt scoping the reporting stack"),
  tp("md_008", "mp_001", "proposal", 10, "Northwind proposal in review"),

  // md_010 — Lakeshore Apparel (open).
  tp("md_010", "mp_005", "referral", 60, "Vector referral"),
  tp("md_010", "mp_005", "demo", 40, "Vector merch demo"),

  // md_011 — Meridian West Clinics (open).
  tp("md_011", "mp_002", "deal_registration", 100, "Bluepeak registered the clinic group"),
  tp("md_011", "mp_004", "content_share", 70, "Harbor & Lane shared the patient-flow case study"),
  tp("md_011", "mp_002", "proposal", 18, "Bluepeak proposal out"),

  // md_013 — Northgate Energy (open, marketplace-led).
  tp("md_013", "mp_008", "co_sell", 75, "AWS Marketplace private offer in flight"),
  tp("md_013", "mp_001", "demo", 50, "Northwind grid telemetry demo"),

  // md_014 — Oakhurst Schools (open, registration pending 45 days).
  tp("md_014", "mp_005", "deal_registration", 45, "Vector registration awaiting approval"),

  // md_015 — Pinnacle Robotics (open).
  tp("md_015", "mp_001", "introduction", 55, "Northwind exec introduction"),
  tp("md_015", "mp_004", "demo", 35, "Harbor & Lane discovery demo"),
  tp("md_015", "mp_003", "technical_enablement", 20, "Cobalt architecture review"),

  // md_016 — Quarry Lane Biotech (open, stalled — no touch in 60 days).
  tp("md_016", "mp_004", "referral", 80, "Harbor & Lane referral"),
  tp("md_016", "mp_004", "demo", 60, "Harbor & Lane trial-analytics demo"),

  // md_017 — Riverbend Hotels (open).
  tp("md_017", "mp_002", "referral", 35, "Bluepeak referral"),
  tp("md_017", "mp_002", "demo", 15, "Bluepeak revenue-management demo"),

  // md_018 — Stonebrook Partners (lost).
  tp("md_018", "mp_005", "referral", 150, "Vector referral"),
  tp("md_018", "mp_005", "demo", 120, "Vector demo — lost to incumbent"),

  // md_019 — Tidewater Marine (lost). Summitline's last real activity.
  tp("md_019", "mp_007", "referral", 220, "Summitline referral"),
  tp("md_019", "mp_001", "demo", 190, "Northwind demo — budget pulled"),

  // md_020 — Umberline Fitness (lost). Summitline again, long silent since.
  tp("md_020", "mp_007", "introduction", 230, "Summitline introduction"),
  tp("md_020", "mp_004", "demo", 200, "Harbor & Lane demo — went dark"),
];

export interface MeridianDataset {
  org: Organization;
  programs: MeridianProgram[];
  partners: Partner[];
  deals: Deal[];
  touchpoints: Touchpoint[];
}

export const meridian: MeridianDataset = {
  org: meridianOrg,
  programs: meridianPrograms,
  partners: meridianPartners,
  deals: meridianDeals,
  touchpoints: meridianTouchpoints,
};

/** Flagship entity ids the demo UI and tests point at. */
export const SCENARIO = {
  attributionGapDealId: "md_007",
  dormantImplementerPartnerId: "mp_006",
  cosellDealId: "md_012",
  flagshipDealId: "md_003",
} as const;
