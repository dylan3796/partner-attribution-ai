/**
 * marketplace_cosell_hybrid — multi-party co-sell tests.
 *
 * The headline case: a cloud co-sell deal touched by a hyperscaler (AWS), a
 * sourcing partner (SI), and the vendor — split 30/20/50 by party class.
 */

import { describe, it, expect } from "vitest";
import { runModel } from "../convex/lib/attribution/registry";
import { deriveRole } from "../convex/lib/attribution/roles";
import type {
  AttributionTarget,
  ModelConfig,
  TouchpointInput,
} from "../convex/lib/attribution/types";

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;
const DEAL = 100000;

function tp(o: {
  partnerId: string;
  partnerName: string;
  type: string;
  createdAt: number;
  commissionRate?: number;
}): TouchpointInput {
  return {
    partnerId: o.partnerId,
    partnerName: o.partnerName,
    commissionRate: o.commissionRate ?? 10,
    type: o.type,
    role: deriveRole(o.type),
    createdAt: o.createdAt,
  };
}

const target: AttributionTarget = { id: "deal-cosell", amount: DEAL };
const byId = (r: { partnerId: string }[], id: string) => r.find((x) => x.partnerId === id)!;
const sumPct = (r: { percentage: number }[]) => r.reduce((s, x) => s + x.percentage, 0);

describe("marketplace_cosell_hybrid", () => {
  it("splits a 3-party AWS + SI + vendor deal 30/20/50", () => {
    const tps = [
      tp({ partnerId: "aws", partnerName: "AWS", type: "co_sell", createdAt: now - 5 * dayMs }),
      tp({ partnerId: "si", partnerName: "Northstar SI", type: "deal_registration", createdAt: now - 7 * dayMs }),
      tp({ partnerId: "vendor", partnerName: "Covant", type: "proposal", createdAt: now - 2 * dayMs }),
    ];
    const config: ModelConfig = { vendorPartnerIds: ["vendor"] };
    const r = runModel("marketplace_cosell_hybrid", target, tps, config);

    expect(byId(r, "aws").percentage).toBeCloseTo(30, 1);
    expect(byId(r, "si").percentage).toBeCloseTo(20, 1);
    expect(byId(r, "vendor").percentage).toBeCloseTo(50, 1);
    expect(sumPct(r)).toBeCloseTo(100, 5);
    expect(byId(r, "aws").reason).toMatch(/hyperscaler/i);
  });

  it("identifies a hyperscaler by explicit partnerId", () => {
    const tps = [
      tp({ partnerId: "p_cloud", partnerName: "Cloud Co", type: "co_sell", createdAt: now - 5 * dayMs }),
      tp({ partnerId: "si", partnerName: "Northstar SI", type: "deal_registration", createdAt: now - 7 * dayMs }),
    ];
    const r = runModel("marketplace_cosell_hybrid", target, tps, {
      hyperscalerPartnerIds: ["p_cloud"],
    });
    // hyperscaler pool 30, partner pool 20 -> renormalized 60/40
    expect(byId(r, "p_cloud").percentage).toBeCloseTo(60, 1);
    expect(byId(r, "si").percentage).toBeCloseTo(40, 1);
  });

  it("renormalizes when a party class is absent", () => {
    // No hyperscaler: only partner (20) + vendor (50) -> 28.57 / 71.43
    const tps = [
      tp({ partnerId: "si", partnerName: "Northstar SI", type: "deal_registration", createdAt: now - 7 * dayMs }),
      tp({ partnerId: "vendor", partnerName: "Covant", type: "proposal", createdAt: now - 2 * dayMs }),
    ];
    const r = runModel("marketplace_cosell_hybrid", target, tps, { vendorPartnerIds: ["vendor"] });
    expect(byId(r, "si").percentage).toBeCloseTo(28.57, 1);
    expect(byId(r, "vendor").percentage).toBeCloseTo(71.43, 1);
    expect(sumPct(r)).toBeCloseTo(100, 5);
  });

  it("splits the partner pool between two partner-class partners", () => {
    const tps = [
      tp({ partnerId: "si1", partnerName: "Northstar SI", type: "deal_registration", createdAt: now - 7 * dayMs }),
      tp({ partnerId: "si2", partnerName: "Summit SI", type: "referral", createdAt: now - 6 * dayMs }),
      tp({ partnerId: "vendor", partnerName: "Covant", type: "proposal", createdAt: now - 2 * dayMs }),
    ];
    // partner pool 20 split -> 10 each; vendor 50; total 70 -> 14.29/14.29/71.43
    const r = runModel("marketplace_cosell_hybrid", target, tps, { vendorPartnerIds: ["vendor"] });
    expect(byId(r, "si1").percentage).toBeCloseTo(14.29, 1);
    expect(byId(r, "si2").percentage).toBeCloseTo(14.29, 1);
    expect(byId(r, "vendor").percentage).toBeCloseTo(71.43, 1);
  });

  it("gives full credit to the only class present and notes it", () => {
    const tps = [
      tp({ partnerId: "si", partnerName: "Northstar SI", type: "deal_registration", createdAt: now - 7 * dayMs }),
    ];
    const r = runModel("marketplace_cosell_hybrid", target, tps);
    expect(r).toHaveLength(1);
    expect(r[0].percentage).toBe(100);
    expect(r[0].reason).toMatch(/only partner party present/i);
  });

  it("returns [] for an empty / crm-only deal", () => {
    expect(runModel("marketplace_cosell_hybrid", target, [])).toEqual([]);
  });
});
