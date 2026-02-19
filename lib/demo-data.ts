/**
 * Demo data — partner COMPANIES, not individuals.
 * Powers the UI in demo mode (no Convex backend required).
 */
import type { Organization, Partner, Deal, Touchpoint, Attribution, Payout, AuditEntry } from "./types";

const ORG_ID = "org_demo_001";
const now = Date.now();
const day = 86400000;

export const demoOrg: Organization = {
  _id: ORG_ID,
  name: "Horizon Software",
  email: "admin@horizonsoftware.com",
  apiKey: "pk_demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  plan: "growth",
  defaultAttributionModel: "role_based",
  createdAt: now - 180 * day,
};

export const demoPartners: Partner[] = [
  {
    _id: "p_001", organizationId: ORG_ID,
    name: "TechBridge Partners", email: "sarah.chen@techbridge.io",
    type: "reseller", tier: "gold", commissionRate: 18, status: "active",
    contactName: "Sarah Chen", contactPhone: "+1-415-555-0142", territory: "West Coast",
    notes: "Premier reseller partner since 2024. Strong enterprise relationships in Silicon Valley.",
    createdAt: now - 150 * day,
  },
  {
    _id: "p_002", organizationId: ORG_ID,
    name: "Apex Growth Group", email: "marcus.webb@apexgrowth.com",
    type: "referral", tier: "platinum", commissionRate: 20, status: "active",
    contactName: "Marcus Webb", contactPhone: "+1-212-555-0193", territory: "National",
    notes: "Top-tier strategic partner. Largest referral volume. Executive relationships at Fortune 500.",
    createdAt: now - 200 * day,
  },
  {
    _id: "p_003", organizationId: ORG_ID,
    name: "Stackline Agency", email: "priya.patel@stackline.co",
    type: "reseller", tier: "silver", commissionRate: 15, status: "active",
    contactName: "Priya Patel", contactPhone: "+1-617-555-0287", territory: "East Coast",
    notes: "Growing mid-market focus. Strong technical implementation team.",
    createdAt: now - 120 * day,
  },
  {
    _id: "p_004", organizationId: ORG_ID,
    name: "Northlight Solutions", email: "james.kim@northlight.io",
    type: "integration", tier: "gold", commissionRate: 12, status: "active",
    contactName: "James Kim", contactPhone: "+65-8555-0341", territory: "APAC",
    notes: "Key integration partner for Asia-Pacific expansion. Deep technical expertise.",
    createdAt: now - 90 * day,
  },
  {
    _id: "p_005", organizationId: ORG_ID,
    name: "Clearpath Consulting", email: "elena.torres@clearpath.io",
    type: "referral", tier: "bronze", commissionRate: 10, status: "active",
    contactName: "Elena Torres", contactPhone: "+1-312-555-0456", territory: "Midwest",
    notes: "Emerging partner in Midwest region. Building pipeline steadily.",
    createdAt: now - 60 * day,
  },
  {
    _id: "p_006", organizationId: ORG_ID,
    name: "Summit Digital",email: "ops@summitdigital.io",
    type: "reseller", tier: "bronze", commissionRate: 14, status: "pending",
    contactName: "Ryan Morrison", territory: "Central",
    notes: "New partner. Onboarding in progress. First deal expected Q1.",
    createdAt: now - 10 * day,
  },
  {
    _id: "p_007", organizationId: ORG_ID,
    name: "Catalyst Labs", email: "team@catalystlabs.com",
    type: "affiliate", tier: "bronze", commissionRate: 8, status: "inactive",
    contactName: "Lisa Wang",
    notes: "Inactive since November. Re-engagement scheduled for Q2.",
    createdAt: now - 120 * day,
  },
];

export const demoDeals: Deal[] = [
  // Won deals
  { _id: "d_001", organizationId: ORG_ID, name: "CloudSync Enterprise License", amount: 85000, status: "won", closedAt: now - 5 * day, contactName: "David Mitchell", contactEmail: "dmitchell@accenture.com", createdAt: now - 45 * day },
  { _id: "d_002", organizationId: ORG_ID, name: "DevOps Transformation Suite", amount: 42000, status: "won", closedAt: now - 12 * day, contactName: "Rachel Green", contactEmail: "rgreen@zendesk.com", createdAt: now - 60 * day },
  { _id: "d_003", organizationId: ORG_ID, name: "API Gateway Implementation", amount: 55000, status: "won", closedAt: now - 20 * day, contactName: "Tom Bradley", contactEmail: "tbradley@atlassian.com", createdAt: now - 55 * day },
  { _id: "d_004", organizationId: ORG_ID, name: "Customer Analytics Suite", amount: 78000, status: "won", closedAt: now - 35 * day, contactName: "Sarah Liu", contactEmail: "sliu@twilio.com", createdAt: now - 80 * day },
  { _id: "d_005", organizationId: ORG_ID, name: "Workflow Automation Platform", amount: 62000, status: "won", closedAt: now - 2 * day, contactName: "Chris Adams", contactEmail: "cadams@notion.so", createdAt: now - 30 * day },
  
  // Open deals
  { _id: "d_006", organizationId: ORG_ID, name: "Data Analytics Platform", amount: 67000, status: "open", expectedCloseDate: now + 21 * day, contactName: "Jennifer Wu", contactEmail: "jwu@salesforce.com", registeredBy: "p_003", registrationStatus: "approved", createdAt: now - 28 * day },
  { _id: "d_007", organizationId: ORG_ID, name: "Enterprise SSO Integration", amount: 28000, status: "open", expectedCloseDate: now + 14 * day, contactName: "Michael Chang", contactEmail: "mchang@stripe.com", createdAt: now - 21 * day },
  { _id: "d_008", organizationId: ORG_ID, name: "Revenue Intelligence Platform", amount: 95000, status: "open", expectedCloseDate: now + 30 * day, contactName: "Amanda Foster", contactEmail: "afoster@hubspot.com", registeredBy: "p_002", registrationStatus: "approved", createdAt: now - 35 * day },
  { _id: "d_009", organizationId: ORG_ID, name: "Infrastructure Modernization", amount: 120000, status: "open", expectedCloseDate: now + 45 * day, contactName: "Robert Kim", contactEmail: "rkim@snowflake.com", registeredBy: "p_001", registrationStatus: "pending", createdAt: now - 14 * day },
  
  // Lost deals
  { _id: "d_010", organizationId: ORG_ID, name: "Partner Portal Deployment", amount: 38000, status: "lost", closedAt: now - 20 * day, contactName: "Kevin Park", contactEmail: "kpark@docusign.com", createdAt: now - 55 * day },
  { _id: "d_011", organizationId: ORG_ID, name: "Legacy System Migration", amount: 45000, status: "lost", closedAt: now - 30 * day, contactName: "Emma Stone", contactEmail: "estone@oracle.com", createdAt: now - 65 * day },
];

export const demoTouchpoints: Touchpoint[] = [
  // Deal 1 — CloudSync Enterprise License (Won)
  { _id: "tp_001", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "deal_registration", notes: "TechBridge Partners registered deal", createdAt: now - 45 * day },
  { _id: "tp_002", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "demo", notes: "TechBridge ran enterprise demo", createdAt: now - 30 * day },
  { _id: "tp_003", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_004", type: "technical_enablement", notes: "Northlight provided integration support", createdAt: now - 22 * day },
  { _id: "tp_004", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "proposal", notes: "TechBridge helped draft proposal", createdAt: now - 15 * day },
  { _id: "tp_005", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "negotiation", notes: "Final contract negotiation", createdAt: now - 7 * day },
  
  // Deal 2 — DevOps Transformation Suite (Won)
  { _id: "tp_006", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_002", type: "referral", notes: "Apex Growth executive referral", createdAt: now - 58 * day },
  { _id: "tp_007", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_002", type: "introduction", notes: "Apex Growth intro to CTO", createdAt: now - 50 * day },
  { _id: "tp_008", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_004", type: "demo", notes: "Northlight technical demo", createdAt: now - 35 * day },
  { _id: "tp_009", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_002", type: "proposal", notes: "Joint proposal with Apex", createdAt: now - 20 * day },
  
  // Deal 3 — API Gateway Implementation (Won)
  { _id: "tp_010", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_004", type: "introduction", notes: "Northlight connected via API directory", createdAt: now - 52 * day },
  { _id: "tp_011", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_004", type: "technical_enablement", notes: "Integration architecture review", createdAt: now - 40 * day },
  { _id: "tp_012", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_003", type: "content_share", notes: "Stackline shared case study", createdAt: now - 30 * day },
  
  // Deal 4 — Customer Analytics Suite (Won)
  { _id: "tp_013", organizationId: ORG_ID, dealId: "d_004", partnerId: "p_003", type: "referral", notes: "Stackline warm intro from customer", createdAt: now - 78 * day },
  { _id: "tp_014", organizationId: ORG_ID, dealId: "d_004", partnerId: "p_001", type: "demo", notes: "TechBridge product demo", createdAt: now - 60 * day },
  { _id: "tp_015", organizationId: ORG_ID, dealId: "d_004", partnerId: "p_002", type: "negotiation", notes: "Apex helped with enterprise terms", createdAt: now - 40 * day },
  
  // Deal 5 — Workflow Automation Platform (Won)
  { _id: "tp_016", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_001", type: "referral", notes: "TechBridge CTO network referral", createdAt: now - 28 * day },
  { _id: "tp_017", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_004", type: "demo", notes: "Northlight full platform demo", createdAt: now - 18 * day },
  { _id: "tp_018", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_002", type: "proposal", notes: "Apex proposal co-creation", createdAt: now - 10 * day },
  { _id: "tp_019", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_001", type: "negotiation", notes: "TechBridge final terms", createdAt: now - 4 * day },
  
  // Deal 6 — Data Analytics Platform (Open)
  { _id: "tp_020", organizationId: ORG_ID, dealId: "d_006", partnerId: "p_003", type: "deal_registration", notes: "Stackline registered deal", createdAt: now - 28 * day },
  { _id: "tp_021", organizationId: ORG_ID, dealId: "d_006", partnerId: "p_003", type: "demo", notes: "Discovery demo completed", createdAt: now - 14 * day },
  { _id: "tp_022", organizationId: ORG_ID, dealId: "d_006", partnerId: "p_004", type: "technical_enablement", notes: "Northlight integration assessment", createdAt: now - 7 * day },
  
  // Deal 7 — Enterprise SSO Integration (Open)
  { _id: "tp_023", organizationId: ORG_ID, dealId: "d_007", partnerId: "p_004", type: "referral", notes: "Northlight direct referral", createdAt: now - 21 * day },
  { _id: "tp_024", organizationId: ORG_ID, dealId: "d_007", partnerId: "p_004", type: "demo", notes: "Security architecture demo", createdAt: now - 10 * day },
  
  // Deal 8 — Revenue Intelligence Platform (Open)
  { _id: "tp_025", organizationId: ORG_ID, dealId: "d_008", partnerId: "p_002", type: "deal_registration", notes: "Apex registered strategic deal", createdAt: now - 35 * day },
  { _id: "tp_026", organizationId: ORG_ID, dealId: "d_008", partnerId: "p_002", type: "co_sell", notes: "Joint executive presentation", createdAt: now - 20 * day },
  { _id: "tp_027", organizationId: ORG_ID, dealId: "d_008", partnerId: "p_001", type: "proposal", notes: "TechBridge proposal support", createdAt: now - 8 * day },
  
  // Deal 9 — Infrastructure Modernization (Open)
  { _id: "tp_028", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_001", type: "deal_registration", notes: "TechBridge registered enterprise deal", createdAt: now - 14 * day },
  { _id: "tp_029", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_001", type: "demo", notes: "Platform capabilities demo", createdAt: now - 7 * day },
  
  // Deal 10 — Partner Portal Deployment (Lost)
  { _id: "tp_030", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_005", type: "referral", notes: "Clearpath intro from conference", createdAt: now - 55 * day },
  { _id: "tp_031", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_005", type: "demo", notes: "Initial product demo", createdAt: now - 40 * day },
  { _id: "tp_032", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_003", type: "proposal", notes: "Stackline joint proposal", createdAt: now - 30 * day },
];

export const demoPayouts: Payout[] = [
  { _id: "pay_001", organizationId: ORG_ID, partnerId: "p_001", amount: 15300, status: "paid", period: "2026-02", paidAt: now - 3 * day, createdAt: now - 10 * day },
  { _id: "pay_002", organizationId: ORG_ID, partnerId: "p_002", amount: 8400, status: "paid", period: "2026-02", paidAt: now - 3 * day, createdAt: now - 10 * day },
  { _id: "pay_003", organizationId: ORG_ID, partnerId: "p_004", amount: 6600, status: "approved", period: "2026-02", approvedAt: now - 1 * day, createdAt: now - 5 * day },
  { _id: "pay_004", organizationId: ORG_ID, partnerId: "p_001", amount: 11160, status: "pending_approval", period: "2026-02", createdAt: now - 1 * day },
  { _id: "pay_005", organizationId: ORG_ID, partnerId: "p_003", amount: 8250, status: "pending_approval", period: "2026-02", createdAt: now - 1 * day },
];

export const demoAuditLog: AuditEntry[] = [
  // Today / Recent
  { _id: "al_001", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_005", changes: '{"status":"open→won"}', createdAt: now - 2 * day },
  { _id: "al_002", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_005", metadata: '{"model":"role_based","partners":"4","deal":"Workflow Automation Platform"}', createdAt: now - 2 * day + 300000 },
  { _id: "al_003", organizationId: ORG_ID, action: "payout.created", entityType: "payout", entityId: "pay_004", metadata: '{"partner":"TechBridge Partners","amount":"$11,160","period":"2026-02"}', createdAt: now - 1 * day },
  { _id: "al_030", organizationId: ORG_ID, action: "payout.created", entityType: "payout", entityId: "pay_005", metadata: '{"partner":"Stackline Agency","amount":"$8,250","period":"2026-02"}', createdAt: now - 1 * day + 120000 },
  { _id: "al_031", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_019", metadata: '{"type":"negotiation","deal":"Workflow Automation Platform","partner":"TechBridge Partners"}', createdAt: now - 4 * day },

  // This week
  { _id: "al_005", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_001", metadata: '{"deal":"CloudSync Enterprise License","amount":"$85,000"}', createdAt: now - 5 * day },
  { _id: "al_006", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_001", metadata: '{"model":"time_decay","partner":"TechBridge Partners"}', createdAt: now - 5 * day + 60000 },
  { _id: "al_032", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_005", metadata: '{"type":"negotiation","deal":"CloudSync Enterprise License","partner":"TechBridge Partners"}', createdAt: now - 7 * day },
  { _id: "al_004", organizationId: ORG_ID, action: "partner.updated", entityType: "partner", entityId: "p_001", changes: '{"tier":"silver→gold"}', createdAt: now - 5 * day },
  { _id: "al_033", organizationId: ORG_ID, action: "partner.tier_change", entityType: "partner", entityId: "p_001", changes: '{"tier":"silver→gold"}', metadata: '{"partner":"TechBridge Partners","reason":"Exceeded quarterly targets by 40%"}', createdAt: now - 5 * day + 60000 },
  { _id: "al_007", organizationId: ORG_ID, action: "payout.approved", entityType: "payout", entityId: "pay_003", metadata: '{"partner":"Northlight Solutions","amount":"$6,600"}', createdAt: now - 1 * day - 7200000 },

  // Last week
  { _id: "al_008", organizationId: ORG_ID, action: "deal.created", entityType: "deal", entityId: "d_008", metadata: '{"deal":"Revenue Intelligence Platform","value":"$95,000"}', createdAt: now - 8 * day },
  { _id: "al_009", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_027", metadata: '{"type":"proposal","deal":"Revenue Intelligence Platform","partner":"TechBridge Partners"}', createdAt: now - 8 * day },
  { _id: "al_010", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_024", metadata: '{"type":"demo","deal":"Enterprise SSO Integration","partner":"Northlight Solutions"}', createdAt: now - 10 * day },
  { _id: "al_034", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_006", metadata: '{"partner":"Summit Digital","type":"reseller","tier":"bronze"}', createdAt: now - 10 * day },
  { _id: "al_035", organizationId: ORG_ID, action: "payout.paid", entityType: "payout", entityId: "pay_001", metadata: '{"partner":"TechBridge Partners","amount":"$15,300","period":"2026-02"}', createdAt: now - 3 * day - 86400000 },
  { _id: "al_036", organizationId: ORG_ID, action: "payout.paid", entityType: "payout", entityId: "pay_002", metadata: '{"partner":"Apex Growth Group","amount":"$8,400","period":"2026-02"}', createdAt: now - 3 * day - 86400000 + 300000 },

  // Two weeks ago
  { _id: "al_011", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_002", changes: '{"status":"open→won"}', createdAt: now - 12 * day },
  { _id: "al_012", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_002", metadata: '{"model":"role_based","partners":"3","deal":"DevOps Transformation Suite"}', createdAt: now - 12 * day + 300000 },
  { _id: "al_013", organizationId: ORG_ID, action: "deal.registered", entityType: "deal", entityId: "d_009", metadata: '{"deal":"Infrastructure Modernization","partner":"TechBridge Partners"}', createdAt: now - 14 * day },
  { _id: "al_014", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_028", metadata: '{"type":"deal_registration","deal":"Infrastructure Modernization","partner":"TechBridge Partners"}', createdAt: now - 14 * day },
  { _id: "al_015", organizationId: ORG_ID, action: "approval.requested", entityType: "approval", entityId: "d_009", metadata: '{"type":"deal_registration","partner":"TechBridge Partners"}', createdAt: now - 13 * day },

  // Three weeks ago
  { _id: "al_016", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_003", changes: '{"status":"open→won"}', createdAt: now - 20 * day },
  { _id: "al_017", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_003", metadata: '{"model":"role_based","partners":"2","deal":"API Gateway Implementation"}', createdAt: now - 20 * day + 300000 },
  { _id: "al_018", organizationId: ORG_ID, action: "deal.lost", entityType: "deal", entityId: "d_010", changes: '{"status":"open→lost"}', metadata: '{"deal":"Partner Portal Deployment","reason":"Budget constraints"}', createdAt: now - 20 * day },
  { _id: "al_019", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_018", metadata: '{"type":"proposal","deal":"Workflow Automation Platform","partner":"Apex Growth Group"}', createdAt: now - 10 * day - 7200000 },

  // Older
  { _id: "al_020", organizationId: ORG_ID, action: "deal.lost", entityType: "deal", entityId: "d_011", changes: '{"status":"open→lost"}', metadata: '{"deal":"Legacy System Migration","reason":"Chose competitor"}', createdAt: now - 30 * day },
  { _id: "al_021", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_004", changes: '{"status":"open→won"}', createdAt: now - 35 * day },
  { _id: "al_022", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_004", metadata: '{"model":"role_based","partners":"3","deal":"Customer Analytics Suite"}', createdAt: now - 35 * day + 300000 },
  { _id: "al_023", organizationId: ORG_ID, action: "deal.created", entityType: "deal", entityId: "d_001", metadata: '{"deal":"CloudSync Enterprise License","value":"$85,000"}', createdAt: now - 45 * day },
  { _id: "al_024", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_005", metadata: '{"partner":"Clearpath Consulting","type":"referral","tier":"bronze"}', createdAt: now - 60 * day },
  { _id: "al_025", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_004", metadata: '{"partner":"Northlight Solutions","type":"integration","tier":"gold"}', createdAt: now - 90 * day },
  { _id: "al_026", organizationId: ORG_ID, action: "deal.created", entityType: "deal", entityId: "d_002", metadata: '{"deal":"DevOps Transformation Suite","value":"$42,000"}', createdAt: now - 60 * day },
  { _id: "al_027", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_003", metadata: '{"partner":"Stackline Agency","type":"reseller","tier":"silver"}', createdAt: now - 120 * day },
  { _id: "al_028", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_002", metadata: '{"partner":"Apex Growth Group","type":"referral","tier":"platinum"}', createdAt: now - 200 * day },
  { _id: "al_029", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_001", metadata: '{"partner":"TechBridge Partners","type":"reseller","tier":"gold"}', createdAt: now - 150 * day },
];

// Generate attributions for won deals
function generateAttributions(): Attribution[] {
  const wonDeals = demoDeals.filter((d) => d.status === "won");
  const models: Attribution["model"][] = ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"];
  const results: Attribution[] = [];
  let id = 1;

  for (const deal of wonDeals) {
    const dealTouchpoints = demoTouchpoints.filter((tp) => tp.dealId === deal._id);
    const partnerIds = [...new Set(dealTouchpoints.map((tp) => tp.partnerId))];

    for (const model of models) {
      let percentages: Record<string, number> = {};
      switch (model) {
        case "equal_split": {
          const pct = 100 / partnerIds.length;
          partnerIds.forEach((pid) => (percentages[pid] = Math.round(pct * 100) / 100));
          break;
        }
        case "first_touch": {
          const first = dealTouchpoints.reduce((a, b) => (a.createdAt < b.createdAt ? a : b));
          partnerIds.forEach((pid) => (percentages[pid] = pid === first.partnerId ? 100 : 0));
          break;
        }
        case "last_touch": {
          const last = dealTouchpoints.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
          partnerIds.forEach((pid) => (percentages[pid] = pid === last.partnerId ? 100 : 0));
          break;
        }
        case "time_decay": {
          const weights: Record<string, number> = {};
          const maxTime = Math.max(...dealTouchpoints.map((tp) => tp.createdAt));
          dealTouchpoints.forEach((tp) => {
            const daysAgo = (maxTime - tp.createdAt) / day;
            const w = Math.exp(-0.1 * daysAgo);
            weights[tp.partnerId] = (weights[tp.partnerId] || 0) + w;
          });
          const total = Object.values(weights).reduce((a, b) => a + b, 0);
          Object.entries(weights).forEach(([pid, w]) => { percentages[pid] = Math.round((w / total) * 100 * 100) / 100; });
          break;
        }
        case "role_based": {
          const roleWeights: Record<string, number> = { referral: 30, demo: 25, proposal: 25, negotiation: 20, introduction: 15, content_share: 10, deal_registration: 30, co_sell: 20, technical_enablement: 20 };
          const scores: Record<string, number> = {};
          dealTouchpoints.forEach((tp) => { scores[tp.partnerId] = (scores[tp.partnerId] || 0) + (roleWeights[tp.type] || 10); });
          const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
          Object.entries(scores).forEach(([pid, s]) => { percentages[pid] = Math.round((s / totalScore) * 100 * 100) / 100; });
          break;
        }
      }
      for (const [partnerId, pct] of Object.entries(percentages)) {
        if (pct === 0) continue;
        const partner = demoPartners.find((p) => p._id === partnerId);
        if (!partner) continue;
        const amount = Math.round((deal.amount * pct) / 100 * 100) / 100;
        const commissionAmount = Math.round((amount * partner.commissionRate) / 100 * 100) / 100;
        results.push({
          _id: `attr_${String(id++).padStart(3, "0")}`, organizationId: ORG_ID,
          dealId: deal._id, partnerId, model, percentage: pct, amount, commissionAmount,
          calculatedAt: deal.closedAt || now,
        });
      }
    }
  }
  return results;
}

export const demoAttributions: Attribution[] = generateAttributions();

/** Generate attributions for a single deal (used when closing deals at runtime) */
export function generateAttributionsForDeal(deal: Deal, dealTouchpoints: Touchpoint[], allPartners: Partner[]): Attribution[] {
  const models: Attribution["model"][] = ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"];
  const results: Attribution[] = [];
  let id = Date.now();
  const partnerIds = [...new Set(dealTouchpoints.map((tp) => tp.partnerId))];
  if (partnerIds.length === 0) return results;

  for (const model of models) {
    let percentages: Record<string, number> = {};
    switch (model) {
      case "equal_split": {
        const pct = 100 / partnerIds.length;
        partnerIds.forEach((pid) => (percentages[pid] = Math.round(pct * 100) / 100));
        break;
      }
      case "first_touch": {
        const first = dealTouchpoints.reduce((a, b) => (a.createdAt < b.createdAt ? a : b));
        partnerIds.forEach((pid) => (percentages[pid] = pid === first.partnerId ? 100 : 0));
        break;
      }
      case "last_touch": {
        const last = dealTouchpoints.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
        partnerIds.forEach((pid) => (percentages[pid] = pid === last.partnerId ? 100 : 0));
        break;
      }
      case "time_decay": {
        const weights: Record<string, number> = {};
        const maxTime = Math.max(...dealTouchpoints.map((tp) => tp.createdAt));
        dealTouchpoints.forEach((tp) => {
          const daysAgo = (maxTime - tp.createdAt) / day;
          const w = Math.exp(-0.1 * daysAgo);
          weights[tp.partnerId] = (weights[tp.partnerId] || 0) + w;
        });
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        Object.entries(weights).forEach(([pid, w]) => { percentages[pid] = Math.round((w / total) * 100 * 100) / 100; });
        break;
      }
      case "role_based": {
        const roleWeights: Record<string, number> = { referral: 30, demo: 25, proposal: 25, negotiation: 20, introduction: 15, content_share: 10, deal_registration: 30, co_sell: 20, technical_enablement: 20 };
        const scores: Record<string, number> = {};
        dealTouchpoints.forEach((tp) => { scores[tp.partnerId] = (scores[tp.partnerId] || 0) + (roleWeights[tp.type] || 10); });
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        Object.entries(scores).forEach(([pid, s]) => { percentages[pid] = Math.round((s / totalScore) * 100 * 100) / 100; });
        break;
      }
    }
    for (const [partnerId, pct] of Object.entries(percentages)) {
      if (pct === 0) continue;
      const partner = allPartners.find((p) => p._id === partnerId);
      if (!partner) continue;
      const amount = Math.round((deal.amount * pct) / 100 * 100) / 100;
      const commissionAmount = Math.round((amount * partner.commissionRate) / 100 * 100) / 100;
      results.push({
        _id: `attr_rt_${id++}`, organizationId: deal.organizationId,
        dealId: deal._id, partnerId, model, percentage: pct, amount, commissionAmount,
        calculatedAt: deal.closedAt || Date.now(),
      });
    }
  }
  return results;
}

export function enrichTouchpoints(touchpoints: Touchpoint[]): Touchpoint[] {
  return touchpoints.map((tp) => ({ ...tp, partner: demoPartners.find((p) => p._id === tp.partnerId), deal: demoDeals.find((d) => d._id === tp.dealId) }));
}
export function enrichAttributions(attributions: Attribution[]): Attribution[] {
  return attributions.map((a) => ({ ...a, partner: demoPartners.find((p) => p._id === a.partnerId), deal: demoDeals.find((d) => d._id === a.dealId) }));
}
