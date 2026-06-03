/**
 * Next-moves demo runner (pure, no DB).
 *
 * Prints the "Today's moves" feed for the bundled demo dataset so the engine's
 * output can be sanity-checked the way `run-attribution-demo.ts` shows the
 * attribution math.
 *
 * Run with: npx tsx scripts/run-next-moves-demo.ts
 */

import {
  demoPartners,
  demoDeals,
  demoTouchpoints,
  demoAttributions,
  demoPayouts,
} from "../lib/demo-data";
import { generateNextMoves } from "../convex/lib/nextMoves";
import type {
  NMAttribution,
  NMDeal,
  NMPartner,
  NMPayout,
  NMTouchpoint,
} from "../convex/lib/nextMoves/types";

const AGENT_LABEL: Record<string, string> = {
  psm: "PSM",
  pam: "PAM",
  program: "Program",
  ops: "Ops",
};
const SEV_LABEL: Record<string, string> = { high: "HIGH", med: "MED ", low: "LOW " };

const { moves, counts } = generateNextMoves(
  {
    partners: demoPartners as unknown as NMPartner[],
    deals: demoDeals as unknown as NMDeal[],
    touchpoints: demoTouchpoints as unknown as NMTouchpoint[],
    attributions: demoAttributions as unknown as NMAttribution[],
    payouts: demoPayouts as unknown as NMPayout[],
  },
  { limit: 12 }
);

console.log("\n══════════════════════════════════════════════════════════════");
console.log("  Today's moves — Covant next-moves engine (demo dataset)");
console.log("══════════════════════════════════════════════════════════════");
console.log(
  `  ${moves.length} moves  ·  PSM ${counts.psm}  PAM ${counts.pam}  Program ${counts.program}  Ops ${counts.ops}\n`
);

for (const m of moves) {
  console.log(`  [${SEV_LABEL[m.severity]}] ${AGENT_LABEL[m.agent].padEnd(7)} ${m.title}`);
  console.log(`           ${m.detail}`);
  console.log(`           ↳ why: ${m.evidence.reason}`);
  console.log(`           → do: ${m.suggestedAction}\n`);
}

console.log("══════════════════════════════════════════════════════════════\n");
