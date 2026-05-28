/**
 * Bounded attribution models — demo runner.
 *
 * One customer running 4 partner programs in parallel, each with its own model.
 * Prints the per-program ledger (with the reason for every credit) and a
 * per-program roll-up — deliberately NOT one summed total across programs.
 *
 * Run: npx tsx scripts/run-attribution-demo.ts
 */

import { runModel } from "../convex/lib/attribution/registry";
import { deriveRole } from "../convex/lib/attribution/roles";
import type {
  AttributionModel,
  AttributionTarget,
  ModelConfig,
  TouchpointInput,
} from "../convex/lib/attribution/types";

// ---------------------------------------------------------------------------
// Fixture data — one org ("Northwind"), four programs, realistic touchpoints.
// ---------------------------------------------------------------------------

const DAY = 86_400_000;
const now = Date.now();
const t = (daysAgo: number) => now - daysAgo * DAY;

interface DealFixture {
  name: string;
  amount: number;
  registeredBy?: string;
  touchpoints: Array<{
    partnerId: string;
    partnerName: string;
    type: string;
    daysAgo: number;
    commissionRate?: number;
  }>;
}

interface ProgramFixture {
  name: string;
  archetype: string;
  model: AttributionModel;
  config?: ModelConfig;
  deals: DealFixture[];
}

const PROGRAMS: ProgramFixture[] = [
  {
    name: "Global SI Program",
    archetype: "si",
    model: "role_weighted",
    deals: [
      {
        name: "Globex — Data Platform",
        amount: 120_000,
        registeredBy: "acme_si",
        touchpoints: [
          { partnerId: "acme_si", partnerName: "Acme SI", type: "deal_registration", daysAgo: 60, commissionRate: 18 },
          { partnerId: "acme_si", partnerName: "Acme SI", type: "technical_enablement", daysAgo: 10, commissionRate: 18 },
          { partnerId: "beacon", partnerName: "Beacon Advisory", type: "demo", daysAgo: 40, commissionRate: 12 },
        ],
      },
    ],
  },
  {
    name: "Cloud Co-sell Program",
    archetype: "cloud_cosell",
    model: "marketplace_cosell_hybrid",
    config: { vendorPartnerIds: ["covant"] },
    deals: [
      {
        name: "Initech — Marketplace Deal",
        amount: 250_000,
        registeredBy: "northstar",
        touchpoints: [
          { partnerId: "aws", partnerName: "AWS", type: "co_sell", daysAgo: 30, commissionRate: 0 },
          { partnerId: "northstar", partnerName: "Northstar SI", type: "deal_registration", daysAgo: 45, commissionRate: 15 },
          { partnerId: "covant", partnerName: "Covant", type: "proposal", daysAgo: 12, commissionRate: 0 },
          { partnerId: "covant", partnerName: "Covant", type: "negotiation", daysAgo: 5, commissionRate: 0 },
        ],
      },
    ],
  },
  {
    name: "Tech / ISV Program",
    archetype: "tech_isv",
    model: "first_touch_sourcer",
    deals: [
      {
        name: "Hooli — ISV Bundle",
        amount: 60_000,
        touchpoints: [
          { partnerId: "datasync", partnerName: "DataSync ISV", type: "referral", daysAgo: 50, commissionRate: 20 },
          { partnerId: "acme_si", partnerName: "Acme SI", type: "demo", daysAgo: 20, commissionRate: 18 },
        ],
      },
    ],
  },
  {
    name: "Reseller Program",
    archetype: "reseller",
    model: "implementation_credit",
    deals: [
      {
        name: "Stark Industries — Reseller",
        amount: 90_000,
        registeredBy: "reseller_one",
        touchpoints: [
          { partnerId: "reseller_one", partnerName: "ResellerOne", type: "deal_registration", daysAgo: 35, commissionRate: 15 },
          { partnerId: "reseller_one", partnerName: "ResellerOne", type: "technical_enablement", daysAgo: 8, commissionRate: 15 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildTouchpoints(deal: DealFixture, config: ModelConfig): TouchpointInput[] {
  const roleMap = config.roleMap;
  return deal.touchpoints.map((tp) => ({
    partnerId: tp.partnerId,
    partnerName: tp.partnerName,
    commissionRate: tp.commissionRate ?? 10,
    type: tp.type,
    role: deriveRole(tp.type, roleMap),
    createdAt: t(tp.daysAgo),
  }));
}

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log("\n========================================================");
console.log("  Northwind — Partner Attribution (4 programs in parallel)");
console.log("========================================================");

interface Rollup {
  program: string;
  model: AttributionModel;
  dealCount: number;
  revenue: number;
  commission: number;
}
const rollups: Rollup[] = [];

for (const program of PROGRAMS) {
  console.log(`\n\n### Program: ${program.name}  [${program.archetype}]`);
  console.log(`    Model: ${program.model}`);

  let revenue = 0;
  let commission = 0;

  for (const deal of program.deals) {
    const target: AttributionTarget = {
      id: deal.name,
      amount: deal.amount,
      registeredBy: deal.registeredBy,
    };
    const touchpoints = buildTouchpoints(deal, program.config ?? {});
    const ledger = runModel(program.model, target, touchpoints, program.config ?? {});

    console.log(`\n  • ${deal.name}  (${usd(deal.amount)})`);
    for (const e of ledger) {
      console.log(
        `      ${e.partnerName.padEnd(18)} ${(e.role ?? "-").padEnd(12)} ` +
          `${e.percentage.toFixed(2).padStart(6)}%  ${usd(e.amount).padStart(10)}  ` +
          `comm ${usd(e.commissionAmount).padStart(8)}`
      );
      console.log(`         ↳ ${e.reason}`);
      revenue += e.amount;
      commission += e.commissionAmount;
    }
  }

  rollups.push({
    program: program.name,
    model: program.model,
    dealCount: program.deals.length,
    revenue,
    commission,
  });
}

// Per-program roll-up — separate numbers per program, never one merged total.
console.log("\n\n========================================================");
console.log("  PER-PROGRAM ROLL-UP (separate numbers per program)");
console.log("========================================================");
for (const r of rollups) {
  console.log(
    `  ${r.program.padEnd(24)} ${r.model.padEnd(26)} ` +
      `deals ${String(r.dealCount).padStart(2)}  rev ${usd(r.revenue).padStart(10)}  comm ${usd(r.commission).padStart(9)}`
  );
}

const orgRevenue = rollups.reduce((s, r) => s + r.revenue, 0);
const orgCommission = rollups.reduce((s, r) => s + r.commission, 0);
console.log("  --------------------------------------------------------");
console.log(
  `  ${"ORG TOTAL (sum of programs)".padEnd(24)} ${"".padEnd(26)} ` +
    `       rev ${usd(orgRevenue).padStart(10)}  comm ${usd(orgCommission).padStart(9)}`
);
console.log("");
