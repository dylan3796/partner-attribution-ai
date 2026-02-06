/**
 * Demo data for the MVP frontend.
 * This powers the UI before a real Convex backend is connected.
 */

import type { Organization, Partner, Deal, Touchpoint, Attribution } from "./types";

const ORG_ID = "org_demo_001";
const now = Date.now();
const day = 86400000;

export const demoOrg: Organization = {
  _id: ORG_ID,
  name: "Acme SaaS",
  email: "admin@acmesaas.io",
  apiKey: "pk_demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  plan: "growth",
  createdAt: now - 90 * day,
};

export const demoPartners: Partner[] = [
  {
    _id: "p_001",
    organizationId: ORG_ID,
    name: "Sarah Anderson",
    email: "sarah@partnerco.com",
    type: "referral",
    commissionRate: 15,
    status: "active",
    createdAt: now - 85 * day,
  },
  {
    _id: "p_002",
    organizationId: ORG_ID,
    name: "Marcus Johnson",
    email: "marcus@techintegrate.io",
    type: "integration",
    commissionRate: 12,
    status: "active",
    createdAt: now - 80 * day,
  },
  {
    _id: "p_003",
    organizationId: ORG_ID,
    name: "Elena Rodriguez",
    email: "elena@contentforce.co",
    type: "affiliate",
    commissionRate: 10,
    status: "active",
    createdAt: now - 75 * day,
  },
  {
    _id: "p_004",
    organizationId: ORG_ID,
    name: "James Chen",
    email: "james@resellerpro.com",
    type: "reseller",
    commissionRate: 18,
    status: "active",
    createdAt: now - 60 * day,
  },
  {
    _id: "p_005",
    organizationId: ORG_ID,
    name: "Priya Patel",
    email: "priya@growthlabs.co",
    type: "referral",
    commissionRate: 14,
    status: "active",
    createdAt: now - 50 * day,
  },
  {
    _id: "p_006",
    organizationId: ORG_ID,
    name: "David Kim",
    email: "david@channelpartners.io",
    type: "reseller",
    commissionRate: 16,
    status: "pending",
    createdAt: now - 10 * day,
  },
  {
    _id: "p_007",
    organizationId: ORG_ID,
    name: "Lisa Wang",
    email: "lisa@inactivepart.com",
    type: "affiliate",
    commissionRate: 8,
    status: "inactive",
    createdAt: now - 120 * day,
  },
];

export const demoDeals: Deal[] = [
  {
    _id: "d_001",
    organizationId: ORG_ID,
    name: "Enterprise CRM Suite — Globex Corp",
    amount: 120000,
    status: "won",
    closedAt: now - 5 * day,
    createdAt: now - 45 * day,
  },
  {
    _id: "d_002",
    organizationId: ORG_ID,
    name: "Analytics Platform — Initech",
    amount: 85000,
    status: "won",
    closedAt: now - 12 * day,
    createdAt: now - 60 * day,
  },
  {
    _id: "d_003",
    organizationId: ORG_ID,
    name: "API Integration — Soylent Corp",
    amount: 45000,
    status: "won",
    closedAt: now - 20 * day,
    createdAt: now - 55 * day,
  },
  {
    _id: "d_004",
    organizationId: ORG_ID,
    name: "Data Pipeline — Umbrella Inc",
    amount: 200000,
    status: "open",
    createdAt: now - 15 * day,
  },
  {
    _id: "d_005",
    organizationId: ORG_ID,
    name: "Monitoring Solution — Wayne Enterprises",
    amount: 150000,
    status: "open",
    createdAt: now - 8 * day,
  },
  {
    _id: "d_006",
    organizationId: ORG_ID,
    name: "Security Audit Tool — Stark Industries",
    amount: 95000,
    status: "open",
    createdAt: now - 3 * day,
  },
  {
    _id: "d_007",
    organizationId: ORG_ID,
    name: "Legacy Migration — Cyberdyne Systems",
    amount: 60000,
    status: "lost",
    closedAt: now - 25 * day,
    createdAt: now - 70 * day,
  },
  {
    _id: "d_008",
    organizationId: ORG_ID,
    name: "Cloud Hosting — Oscorp",
    amount: 35000,
    status: "lost",
    closedAt: now - 30 * day,
    createdAt: now - 65 * day,
  },
  {
    _id: "d_009",
    organizationId: ORG_ID,
    name: "DevOps Suite — Massive Dynamic",
    amount: 175000,
    status: "won",
    closedAt: now - 2 * day,
    createdAt: now - 30 * day,
  },
  {
    _id: "d_010",
    organizationId: ORG_ID,
    name: "Compliance Platform — Dunder Mifflin",
    amount: 55000,
    status: "won",
    closedAt: now - 35 * day,
    createdAt: now - 80 * day,
  },
];

export const demoTouchpoints: Touchpoint[] = [
  // Deal 1 — Globex Corp (Won)
  { _id: "tp_001", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "referral", notes: "Initial introduction via conference", createdAt: now - 44 * day },
  { _id: "tp_002", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_002", type: "demo", notes: "Technical deep-dive on integration", createdAt: now - 35 * day },
  { _id: "tp_003", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_003", type: "content_share", notes: "Case study sent to buyer", createdAt: now - 28 * day },
  { _id: "tp_004", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_001", type: "proposal", notes: "Helped draft proposal", createdAt: now - 15 * day },
  { _id: "tp_005", organizationId: ORG_ID, dealId: "d_001", partnerId: "p_004", type: "negotiation", notes: "Pricing negotiation support", createdAt: now - 8 * day },

  // Deal 2 — Initech (Won)
  { _id: "tp_006", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_005", type: "referral", notes: "Warm intro from existing customer", createdAt: now - 58 * day },
  { _id: "tp_007", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_002", type: "demo", notes: "Product demo session", createdAt: now - 45 * day },
  { _id: "tp_008", organizationId: ORG_ID, dealId: "d_002", partnerId: "p_005", type: "proposal", notes: "Joint proposal review", createdAt: now - 20 * day },

  // Deal 3 — Soylent Corp (Won)
  { _id: "tp_009", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_002", type: "introduction", notes: "Connected via API partner directory", createdAt: now - 52 * day },
  { _id: "tp_010", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_002", type: "demo", notes: "Integration walkthrough", createdAt: now - 40 * day },
  { _id: "tp_011", organizationId: ORG_ID, dealId: "d_003", partnerId: "p_003", type: "content_share", notes: "Shared whitepaper", createdAt: now - 30 * day },

  // Deal 4 — Umbrella Inc (Open)
  { _id: "tp_012", organizationId: ORG_ID, dealId: "d_004", partnerId: "p_001", type: "referral", notes: "Executive referral", createdAt: now - 14 * day },
  { _id: "tp_013", organizationId: ORG_ID, dealId: "d_004", partnerId: "p_004", type: "demo", notes: "Technical architecture review", createdAt: now - 7 * day },

  // Deal 5 — Wayne Enterprises (Open)
  { _id: "tp_014", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_005", type: "introduction", notes: "Introduced at partner summit", createdAt: now - 7 * day },
  { _id: "tp_015", organizationId: ORG_ID, dealId: "d_005", partnerId: "p_003", type: "content_share", notes: "Shared ROI calculator", createdAt: now - 4 * day },

  // Deal 6 — Stark Industries (Open)
  { _id: "tp_016", organizationId: ORG_ID, dealId: "d_006", partnerId: "p_004", type: "referral", notes: "Direct referral from existing deal", createdAt: now - 2 * day },

  // Deal 9 — Massive Dynamic (Won)
  { _id: "tp_017", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_001", type: "referral", notes: "Strong referral from CTO network", createdAt: now - 28 * day },
  { _id: "tp_018", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_002", type: "demo", notes: "Full platform demo", createdAt: now - 18 * day },
  { _id: "tp_019", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_004", type: "proposal", notes: "Proposal co-creation", createdAt: now - 10 * day },
  { _id: "tp_020", organizationId: ORG_ID, dealId: "d_009", partnerId: "p_005", type: "negotiation", notes: "Final terms negotiation", createdAt: now - 4 * day },

  // Deal 10 — Dunder Mifflin (Won)
  { _id: "tp_021", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_003", type: "content_share", notes: "Blog post drove inbound lead", createdAt: now - 78 * day },
  { _id: "tp_022", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_005", type: "demo", notes: "Discovery call and demo", createdAt: now - 60 * day },
  { _id: "tp_023", organizationId: ORG_ID, dealId: "d_010", partnerId: "p_001", type: "negotiation", notes: "Helped close", createdAt: now - 38 * day },
];

// Generate attribution results for won deals
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
          Object.entries(weights).forEach(([pid, w]) => {
            percentages[pid] = Math.round((w / total) * 100 * 100) / 100;
          });
          break;
        }
        case "role_based": {
          const roleWeights: Record<string, number> = {
            referral: 30, demo: 25, proposal: 25, negotiation: 20, introduction: 10, content_share: 5,
          };
          const scores: Record<string, number> = {};
          dealTouchpoints.forEach((tp) => {
            scores[tp.partnerId] = (scores[tp.partnerId] || 0) + (roleWeights[tp.type] || 10);
          });
          const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
          Object.entries(scores).forEach(([pid, s]) => {
            percentages[pid] = Math.round((s / totalScore) * 100 * 100) / 100;
          });
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
          _id: `attr_${String(id++).padStart(3, "0")}`,
          organizationId: ORG_ID,
          dealId: deal._id,
          partnerId,
          model,
          percentage: pct,
          amount,
          commissionAmount,
          calculatedAt: deal.closedAt || now,
        });
      }
    }
  }

  return results;
}

export const demoAttributions: Attribution[] = generateAttributions();

// Enrich touchpoints with partner data
export function enrichTouchpoints(touchpoints: Touchpoint[]): Touchpoint[] {
  return touchpoints.map((tp) => ({
    ...tp,
    partner: demoPartners.find((p) => p._id === tp.partnerId),
    deal: demoDeals.find((d) => d._id === tp.dealId),
  }));
}

// Enrich attributions with partner and deal data
export function enrichAttributions(attributions: Attribution[]): Attribution[] {
  return attributions.map((a) => ({
    ...a,
    partner: demoPartners.find((p) => p._id === a.partnerId),
    deal: demoDeals.find((d) => d._id === a.dealId),
  }));
}
