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
  name: "Acme SaaS",
  email: "admin@acmesaas.io",
  apiKey: "pk_demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  plan: "growth",
  defaultAttributionModel: "role_based",
  createdAt: now - 90 * day,
};

export const demoPartners: Partner[] = [
  {
    _id: "p_001", organizationId: ORG_ID,
    name: "TechStar Solutions", email: "partnerships@techstar.io",
    type: "reseller", tier: "gold", commissionRate: 18, status: "active",
    contactName: "Sarah Anderson", contactPhone: "+1-555-0101", territory: "West Coast",
    notes: "Top performing reseller. Exceeded Gold tier by 40% in Q4.",
    createdAt: now - 85 * day,
  },
  {
    _id: "p_002", organizationId: ORG_ID,
    name: "CloudBridge Partners", email: "deals@cloudbridge.co",
    type: "referral", tier: "silver", commissionRate: 15, status: "active",
    contactName: "Marcus Johnson", contactPhone: "+1-555-0102", territory: "East Coast",
    notes: "Highest first-touch conversion rate. Strong in enterprise.",
    createdAt: now - 80 * day,
  },
  {
    _id: "p_003", organizationId: ORG_ID,
    name: "DataPipe Agency", email: "partner@datapipe.dev",
    type: "integration", tier: "gold", commissionRate: 12, status: "active",
    contactName: "Elena Rodriguez", territory: "National",
    notes: "Key integration partner. Drives technical adoption.",
    createdAt: now - 75 * day,
  },
  {
    _id: "p_004", organizationId: ORG_ID,
    name: "NexGen Resellers", email: "channel@nexgen.com",
    type: "reseller", tier: "platinum", commissionRate: 20, status: "active",
    contactName: "James Chen", contactPhone: "+1-555-0104", territory: "APAC",
    notes: "Platinum partner. Largest channel volume.",
    createdAt: now - 60 * day,
  },
  {
    _id: "p_005", organizationId: ORG_ID,
    name: "GrowthLabs Co", email: "referrals@growthlabs.co",
    type: "referral", tier: "silver", commissionRate: 14, status: "active",
    contactName: "Priya Patel", territory: "Mid-Market",
    notes: "Strong referral pipeline from SMB segment.",
    createdAt: now - 50 * day,
  },
  {
    _id: "p_006", organizationId: ORG_ID,
    name: "ChannelForce Inc", email: "ops@channelforce.io",
    type: "reseller", tier: "bronze", commissionRate: 16, status: "pending",
    contactName: "David Kim", territory: "Central",
    notes: "New partner. Onboarding in progress.",
    createdAt: now - 10 * day,
  },
  {
    _id: "p_007", organizationId: ORG_ID,
    name: "IntegrateHub", email: "team@integratehub.com",
    type: "affiliate", tier: "bronze", commissionRate: 8, status: "inactive",
    contactName: "Lisa Wang",
    notes: "Inactive since November. Re-engagement pending.",
    createdAt: now - 120 * day,
  },
];

export const demoDeals: Deal[] = [
  { _id: "d_001", organizationId: ORG_ID, name: "Enterprise CRM Suite — Globex Corp", amount: 120000, status: "won", closedAt: now - 5 * day, contactName: "John Smith", contactEmail: "jsmith@globex.com", createdAt: now - 45 * day },
  { _id: "d_002", organizationId: ORG_ID, name: "Analytics Platform — Initech", amount: 85000, status: "won", closedAt: now - 12 * day, contactName: "Bill Lumbergh", createdAt: now - 60 * day },
  { _id: "d_003", organizationId: ORG_ID, name: "API Integration — Soylent Corp", amount: 45000, status: "won", closedAt: now - 20 * day, createdAt: now - 55 * day },
  { _id: "d_004", organizationId: ORG_ID, name: "Data Pipeline — Umbrella Inc", amount: 200000, status: "open", expectedCloseDate: now + 30 * day, contactName: "Alice Wesker", registeredBy: "p_001", registrationStatus: "approved", createdAt: now - 15 * day },
  { _id: "d_005", organizationId: ORG_ID, name: "Monitoring Solution — Wayne Enterprises", amount: 150000, status: "open", expectedCloseDate: now + 45 * day, registeredBy: "p_005", registrationStatus: "approved", createdAt: now - 8 * day },
  { _id: "d_006", organizationId: ORG_ID, name: "Security Audit Tool — Stark Industries", amount: 95000, status: "open", expectedCloseDate: now + 15 * day, registeredBy: "p_004", registrationStatus: "pending", createdAt: now - 3 * day },
  { _id: "d_007", organizationId: ORG_ID, name: "Legacy Migration — Cyberdyne Systems", amount: 60000, status: "lost", closedAt: now - 25 * day, createdAt: now - 70 * day },
  { _id: "d_008", organizationId: ORG_ID, name: "Cloud Hosting — Oscorp", amount: 35000, status: "lost", closedAt: now - 30 * day, createdAt: now - 65 * day },
  { _id: "d_009", organizationId: ORG_ID, name: "DevOps Suite — Massive Dynamic", amount: 175000, status: "won", closedAt: now - 2 * day, contactName: "Walter Bishop", createdAt: now - 30 * day },
  { _id: "d_010", organizationId: ORG_ID, name: "Compliance Platform — Dunder Mifflin", amount: 55000, status: "won", closedAt: now - 35 * day, createdAt: now - 80 * day },
];

export const demoTouchpoints: Touchpoint[] = [
  // Deal 1 — Globex Corp (Won)
  { _id: "tp_001", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "referral", notes: "TechStar introduced via conference", createdAt: now - 44 * day },
  { _id: "tp_002", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_003", type: "demo", notes: "DataPipe ran technical deep-dive", createdAt: now - 35 * day },
  { _id: "tp_003", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_002", type: "content_share", notes: "CloudBridge shared case study", createdAt: now - 28 * day },
  { _id: "tp_004", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "proposal", notes: "TechStar helped draft proposal", createdAt: now - 15 * day },
  { _id: "tp_005", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_004", type: "negotiation", notes: "NexGen supported pricing negotiation", createdAt: now - 8 * day },
  // Deal 2 — Initech (Won)
  { _id: "tp_006", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_005", type: "referral", notes: "GrowthLabs warm intro from customer", createdAt: now - 58 * day },
  { _id: "tp_007", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_003", type: "demo", notes: "DataPipe product demo", createdAt: now - 45 * day },
  { _id: "tp_008", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_005", type: "proposal", notes: "GrowthLabs joint proposal review", createdAt: now - 20 * day },
  // Deal 3 — Soylent (Won)
  { _id: "tp_009", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_003", type: "introduction", notes: "DataPipe connected via API directory", createdAt: now - 52 * day },
  { _id: "tp_010", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_003", type: "technical_enablement", notes: "DataPipe integration walkthrough", createdAt: now - 40 * day },
  { _id: "tp_011", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_002", type: "content_share", notes: "CloudBridge shared whitepaper", createdAt: now - 30 * day },
  // Deal 4 — Umbrella (Open)
  { _id: "tp_012", organizationId: ORG_ID, dealId: "d_004", partnerId: "p_001", type: "deal_registration", notes: "TechStar registered deal", createdAt: now - 14 * day },
  { _id: "tp_013", organizationId: ORG_ID, dealId: "d_004", partnerId: "p_004", type: "co_sell", notes: "NexGen co-sell architecture review", createdAt: now - 7 * day },
  // Deal 5 — Wayne (Open)
  { _id: "tp_014", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_005", type: "referral", notes: "GrowthLabs intro at partner summit", createdAt: now - 7 * day },
  { _id: "tp_015", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_002", type: "content_share", notes: "CloudBridge shared ROI calculator", createdAt: now - 4 * day },
  // Deal 6 — Stark (Open)
  { _id: "tp_016", organizationId: ORG_ID, dealId: "d_006", partnerId: "p_004", type: "deal_registration", notes: "NexGen direct referral", createdAt: now - 2 * day },
  // Deal 9 — Massive Dynamic (Won)
  { _id: "tp_017", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_001", type: "referral", notes: "TechStar CTO network referral", createdAt: now - 28 * day },
  { _id: "tp_018", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_003", type: "demo", notes: "DataPipe full platform demo", createdAt: now - 18 * day },
  { _id: "tp_019", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_004", type: "proposal", notes: "NexGen proposal co-creation", createdAt: now - 10 * day },
  { _id: "tp_020", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_005", type: "negotiation", notes: "GrowthLabs final terms", createdAt: now - 4 * day },
  // Deal 10 — Dunder Mifflin (Won)
  { _id: "tp_021", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_002", type: "content_share", notes: "CloudBridge blog drove inbound", createdAt: now - 78 * day },
  { _id: "tp_022", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_005", type: "demo", notes: "GrowthLabs discovery + demo", createdAt: now - 60 * day },
  { _id: "tp_023", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_001", type: "negotiation", notes: "TechStar helped close", createdAt: now - 38 * day },
];

export const demoPayouts: Payout[] = [
  { _id: "pay_001", organizationId: ORG_ID, partnerId: "p_001", amount: 12450, status: "paid", period: "2026-01", paidAt: now - 3 * day, createdAt: now - 10 * day },
  { _id: "pay_002", organizationId: ORG_ID, partnerId: "p_002", amount: 8920, status: "paid", period: "2026-01", paidAt: now - 3 * day, createdAt: now - 10 * day },
  { _id: "pay_003", organizationId: ORG_ID, partnerId: "p_003", amount: 5630, status: "approved", period: "2026-01", approvedAt: now - 1 * day, createdAt: now - 5 * day },
  { _id: "pay_004", organizationId: ORG_ID, partnerId: "p_004", amount: 15200, status: "pending_approval", period: "2026-02", createdAt: now - 1 * day },
  { _id: "pay_005", organizationId: ORG_ID, partnerId: "p_005", amount: 6800, status: "pending_approval", period: "2026-02", createdAt: now - 1 * day },
];

export const demoAuditLog: AuditEntry[] = [
  // Today / Recent
  { _id: "al_001", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_009", changes: '{"status":"open→won"}', createdAt: now - 2 * day },
  { _id: "al_002", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_009", metadata: '{"model":"role_based","partners":"4","deal":"DevOps Suite — Massive Dynamic"}', createdAt: now - 2 * day + 300000 },
  { _id: "al_003", organizationId: ORG_ID, action: "payout.created", entityType: "payout", entityId: "pay_004", metadata: '{"partner":"NexGen Resellers","amount":"$15,200","period":"2026-02"}', createdAt: now - 1 * day },
  { _id: "al_030", organizationId: ORG_ID, action: "payout.created", entityType: "payout", entityId: "pay_005", metadata: '{"partner":"GrowthLabs Co","amount":"$6,800","period":"2026-02"}', createdAt: now - 1 * day + 120000 },
  { _id: "al_031", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_020", metadata: '{"type":"negotiation","deal":"DevOps Suite — Massive Dynamic","partner":"GrowthLabs Co"}', createdAt: now - 4 * day },

  // This week
  { _id: "al_005", organizationId: ORG_ID, action: "deal.registered", entityType: "deal", entityId: "d_006", metadata: '{"registeredBy":"NexGen Resellers","deal":"Security Audit Tool — Stark Industries"}', createdAt: now - 3 * day },
  { _id: "al_006", organizationId: ORG_ID, action: "approval.requested", entityType: "approval", entityId: "d_006", metadata: '{"type":"deal_registration","partner":"NexGen Resellers"}', createdAt: now - 3 * day + 60000 },
  { _id: "al_032", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_016", metadata: '{"type":"deal_registration","deal":"Security Audit Tool — Stark Industries","partner":"NexGen Resellers"}', createdAt: now - 2 * day - 3600000 },
  { _id: "al_004", organizationId: ORG_ID, action: "partner.updated", entityType: "partner", entityId: "p_001", changes: '{"tier":"silver→gold"}', createdAt: now - 5 * day },
  { _id: "al_033", organizationId: ORG_ID, action: "partner.tier_change", entityType: "partner", entityId: "p_001", changes: '{"tier":"silver→gold"}', metadata: '{"partner":"TechStar Solutions","reason":"Exceeded quarterly targets by 40%"}', createdAt: now - 5 * day + 60000 },
  { _id: "al_007", organizationId: ORG_ID, action: "payout.approved", entityType: "payout", entityId: "pay_003", metadata: '{"partner":"DataPipe Agency","amount":"$5,630"}', createdAt: now - 1 * day - 7200000 },

  // Last week
  { _id: "al_008", organizationId: ORG_ID, action: "deal.created", entityType: "deal", entityId: "d_005", metadata: '{"deal":"Monitoring Solution — Wayne Enterprises","value":"$150,000"}', createdAt: now - 8 * day },
  { _id: "al_009", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_014", metadata: '{"type":"referral","deal":"Monitoring Solution — Wayne Enterprises","partner":"GrowthLabs Co"}', createdAt: now - 7 * day },
  { _id: "al_010", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_015", metadata: '{"type":"content_share","deal":"Monitoring Solution — Wayne Enterprises","partner":"CloudBridge Partners"}', createdAt: now - 4 * day - 7200000 },
  { _id: "al_034", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_006", metadata: '{"partner":"ChannelForce Inc","type":"reseller","tier":"bronze"}', createdAt: now - 10 * day },
  { _id: "al_035", organizationId: ORG_ID, action: "payout.paid", entityType: "payout", entityId: "pay_001", metadata: '{"partner":"TechStar Solutions","amount":"$12,450","period":"2026-01"}', createdAt: now - 3 * day - 86400000 },
  { _id: "al_036", organizationId: ORG_ID, action: "payout.paid", entityType: "payout", entityId: "pay_002", metadata: '{"partner":"CloudBridge Partners","amount":"$8,920","period":"2026-01"}', createdAt: now - 3 * day - 86400000 + 300000 },

  // Two weeks ago
  { _id: "al_011", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_002", changes: '{"status":"open→won"}', createdAt: now - 12 * day },
  { _id: "al_012", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_002", metadata: '{"model":"role_based","partners":"3","deal":"Analytics Platform — Initech"}', createdAt: now - 12 * day + 300000 },
  { _id: "al_013", organizationId: ORG_ID, action: "deal.created", entityType: "deal", entityId: "d_004", metadata: '{"deal":"Data Pipeline — Umbrella Inc","value":"$200,000"}', createdAt: now - 15 * day },
  { _id: "al_014", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_012", metadata: '{"type":"deal_registration","deal":"Data Pipeline — Umbrella Inc","partner":"TechStar Solutions"}', createdAt: now - 14 * day },
  { _id: "al_015", organizationId: ORG_ID, action: "approval.approved", entityType: "approval", entityId: "d_004", metadata: '{"type":"deal_registration","partner":"TechStar Solutions"}', createdAt: now - 13 * day },

  // Three weeks ago
  { _id: "al_016", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_003", changes: '{"status":"open→won"}', createdAt: now - 20 * day },
  { _id: "al_017", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_003", metadata: '{"model":"role_based","partners":"2","deal":"API Integration — Soylent Corp"}', createdAt: now - 20 * day + 300000 },
  { _id: "al_018", organizationId: ORG_ID, action: "deal.lost", entityType: "deal", entityId: "d_007", changes: '{"status":"open→lost"}', metadata: '{"deal":"Legacy Migration — Cyberdyne Systems","reason":"Budget constraints"}', createdAt: now - 25 * day },
  { _id: "al_019", organizationId: ORG_ID, action: "touchpoint.created", entityType: "touchpoint", entityId: "tp_019", metadata: '{"type":"proposal","deal":"DevOps Suite — Massive Dynamic","partner":"NexGen Resellers"}', createdAt: now - 10 * day - 7200000 },

  // Older
  { _id: "al_020", organizationId: ORG_ID, action: "deal.lost", entityType: "deal", entityId: "d_008", changes: '{"status":"open→lost"}', metadata: '{"deal":"Cloud Hosting — Oscorp","reason":"Chose competitor"}', createdAt: now - 30 * day },
  { _id: "al_021", organizationId: ORG_ID, action: "deal.closed", entityType: "deal", entityId: "d_010", changes: '{"status":"open→won"}', createdAt: now - 35 * day },
  { _id: "al_022", organizationId: ORG_ID, action: "attribution.calculated", entityType: "attribution", entityId: "d_010", metadata: '{"model":"role_based","partners":"3","deal":"Compliance Platform — Dunder Mifflin"}', createdAt: now - 35 * day + 300000 },
  { _id: "al_023", organizationId: ORG_ID, action: "deal.created", entityType: "deal", entityId: "d_001", metadata: '{"deal":"Enterprise CRM Suite — Globex Corp","value":"$120,000"}', createdAt: now - 45 * day },
  { _id: "al_024", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_005", metadata: '{"partner":"GrowthLabs Co","type":"referral","tier":"silver"}', createdAt: now - 50 * day },
  { _id: "al_025", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_004", metadata: '{"partner":"NexGen Resellers","type":"reseller","tier":"platinum"}', createdAt: now - 60 * day },
  { _id: "al_026", organizationId: ORG_ID, action: "deal.created", entityType: "deal", entityId: "d_002", metadata: '{"deal":"Analytics Platform — Initech","value":"$85,000"}', createdAt: now - 60 * day },
  { _id: "al_027", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_003", metadata: '{"partner":"DataPipe Agency","type":"integration","tier":"gold"}', createdAt: now - 75 * day },
  { _id: "al_028", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_002", metadata: '{"partner":"CloudBridge Partners","type":"referral","tier":"silver"}', createdAt: now - 80 * day },
  { _id: "al_029", organizationId: ORG_ID, action: "partner.created", entityType: "partner", entityId: "p_001", metadata: '{"partner":"TechStar Solutions","type":"reseller","tier":"gold"}', createdAt: now - 85 * day },
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
