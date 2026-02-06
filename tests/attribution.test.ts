/**
 * Attribution Models Unit Tests
 * 
 * These tests verify the mathematical correctness of all 5 attribution models.
 * Run with: npx vitest tests/attribution.test.ts
 */

import { describe, it, expect } from "vitest";
import {
  calculateEqualSplit,
  calculateFirstTouch,
  calculateLastTouch,
  calculateTimeDecay,
  calculateRoleBased,
  normalizeAttributions,
  DEFAULT_ROLE_WEIGHTS,
  type TouchpointInput,
} from "../convex/lib/attribution/models";

// ============================================================================
// Test Fixtures
// ============================================================================

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

// Single partner, single touchpoint
const singleTouchpoint: TouchpointInput[] = [
  {
    partnerId: "partner1",
    partnerName: "Partner A",
    commissionRate: 10,
    type: "referral",
    createdAt: now - 7 * dayMs,
  },
];

// Two partners, one touchpoint each
const twoPartners: TouchpointInput[] = [
  {
    partnerId: "partner1",
    partnerName: "Partner A",
    commissionRate: 10,
    type: "referral",
    createdAt: now - 14 * dayMs, // 14 days ago
  },
  {
    partnerId: "partner2",
    partnerName: "Partner B",
    commissionRate: 20,
    type: "demo",
    createdAt: now - 7 * dayMs, // 7 days ago
  },
];

// Three partners with varying touchpoint counts
const threePartners: TouchpointInput[] = [
  {
    partnerId: "partner1",
    partnerName: "Partner A",
    commissionRate: 10,
    type: "referral",
    createdAt: now - 21 * dayMs, // First touch (21 days ago)
  },
  {
    partnerId: "partner2",
    partnerName: "Partner B",
    commissionRate: 15,
    type: "demo",
    createdAt: now - 14 * dayMs,
  },
  {
    partnerId: "partner2",
    partnerName: "Partner B",
    commissionRate: 15,
    type: "proposal",
    createdAt: now - 7 * dayMs,
  },
  {
    partnerId: "partner3",
    partnerName: "Partner C",
    commissionRate: 20,
    type: "negotiation",
    createdAt: now - 1 * dayMs, // Last touch (1 day ago)
  },
];

// Same partner, multiple touchpoints
const samePartnerMultipleTouchpoints: TouchpointInput[] = [
  {
    partnerId: "partner1",
    partnerName: "Partner A",
    commissionRate: 10,
    type: "referral",
    createdAt: now - 14 * dayMs,
  },
  {
    partnerId: "partner1",
    partnerName: "Partner A",
    commissionRate: 10,
    type: "demo",
    createdAt: now - 7 * dayMs,
  },
  {
    partnerId: "partner1",
    partnerName: "Partner A",
    commissionRate: 10,
    type: "proposal",
    createdAt: now - 1 * dayMs,
  },
];

const dealAmount = 10000;

// ============================================================================
// Test Helpers
// ============================================================================

function sumPercentages(results: { percentage: number }[]): number {
  return results.reduce((sum, r) => sum + r.percentage, 0);
}

function sumAmounts(results: { amount: number }[]): number {
  return results.reduce((sum, r) => sum + r.amount, 0);
}

// ============================================================================
// Equal Split Model Tests
// ============================================================================

describe("Equal Split Attribution", () => {
  it("returns empty array for no touchpoints", () => {
    const results = calculateEqualSplit([], dealAmount);
    expect(results).toEqual([]);
  });

  it("gives 100% to single partner", () => {
    const results = calculateEqualSplit(singleTouchpoint, dealAmount);
    
    expect(results).toHaveLength(1);
    expect(results[0].partnerId).toBe("partner1");
    expect(results[0].percentage).toBe(100);
    expect(results[0].amount).toBe(dealAmount);
    expect(results[0].commissionAmount).toBe(dealAmount * 0.1); // 10% commission
  });

  it("splits equally between two partners", () => {
    const results = calculateEqualSplit(twoPartners, dealAmount);
    
    expect(results).toHaveLength(2);
    
    // Each should get 50%
    for (const result of results) {
      expect(result.percentage).toBe(50);
      expect(result.amount).toBe(5000);
    }
    
    // Partner A gets 10% commission = $500
    const partnerA = results.find(r => r.partnerId === "partner1");
    expect(partnerA?.commissionAmount).toBe(500);
    
    // Partner B gets 20% commission = $1000
    const partnerB = results.find(r => r.partnerId === "partner2");
    expect(partnerB?.commissionAmount).toBe(1000);
  });

  it("splits equally among unique partners (ignores multiple touchpoints)", () => {
    const results = calculateEqualSplit(threePartners, dealAmount);
    
    // Should be 3 unique partners
    expect(results).toHaveLength(3);
    
    // Each gets ~33.33%
    for (const result of results) {
      expect(result.percentage).toBeCloseTo(33.33, 1);
    }
    
    // Total should sum to 100%
    expect(sumPercentages(results)).toBeCloseTo(100, 1);
  });

  it("handles single partner with multiple touchpoints", () => {
    const results = calculateEqualSplit(samePartnerMultipleTouchpoints, dealAmount);
    
    // Should only be 1 partner (deduped)
    expect(results).toHaveLength(1);
    expect(results[0].percentage).toBe(100);
    expect(results[0].amount).toBe(dealAmount);
  });
});

// ============================================================================
// First Touch Model Tests
// ============================================================================

describe("First Touch Attribution", () => {
  it("returns empty array for no touchpoints", () => {
    const results = calculateFirstTouch([], dealAmount);
    expect(results).toEqual([]);
  });

  it("gives 100% to single partner", () => {
    const results = calculateFirstTouch(singleTouchpoint, dealAmount);
    
    expect(results).toHaveLength(1);
    expect(results[0].percentage).toBe(100);
    expect(results[0].amount).toBe(dealAmount);
  });

  it("gives 100% to the partner with earliest touchpoint", () => {
    const results = calculateFirstTouch(twoPartners, dealAmount);
    
    // Partner A had the first touch (14 days ago)
    expect(results).toHaveLength(1);
    expect(results[0].partnerId).toBe("partner1");
    expect(results[0].partnerName).toBe("Partner A");
    expect(results[0].percentage).toBe(100);
    expect(results[0].commissionAmount).toBe(1000); // 10% of $10,000
  });

  it("correctly identifies first touch in multi-partner scenario", () => {
    const results = calculateFirstTouch(threePartners, dealAmount);
    
    // Partner A had the first touch (21 days ago)
    expect(results).toHaveLength(1);
    expect(results[0].partnerId).toBe("partner1");
  });

  it("handles same partner multiple touchpoints (returns earliest)", () => {
    const results = calculateFirstTouch(samePartnerMultipleTouchpoints, dealAmount);
    
    expect(results).toHaveLength(1);
    expect(results[0].partnerId).toBe("partner1");
    // Should pick the 14-day-ago touchpoint (referral)
  });
});

// ============================================================================
// Last Touch Model Tests
// ============================================================================

describe("Last Touch Attribution", () => {
  it("returns empty array for no touchpoints", () => {
    const results = calculateLastTouch([], dealAmount);
    expect(results).toEqual([]);
  });

  it("gives 100% to single partner", () => {
    const results = calculateLastTouch(singleTouchpoint, dealAmount);
    
    expect(results).toHaveLength(1);
    expect(results[0].percentage).toBe(100);
  });

  it("gives 100% to the partner with latest touchpoint", () => {
    const results = calculateLastTouch(twoPartners, dealAmount);
    
    // Partner B had the last touch (7 days ago)
    expect(results).toHaveLength(1);
    expect(results[0].partnerId).toBe("partner2");
    expect(results[0].partnerName).toBe("Partner B");
    expect(results[0].percentage).toBe(100);
    expect(results[0].commissionAmount).toBe(2000); // 20% of $10,000
  });

  it("correctly identifies last touch in multi-partner scenario", () => {
    const results = calculateLastTouch(threePartners, dealAmount);
    
    // Partner C had the last touch (1 day ago)
    expect(results).toHaveLength(1);
    expect(results[0].partnerId).toBe("partner3");
    expect(results[0].partnerName).toBe("Partner C");
  });
});

// ============================================================================
// Time Decay Model Tests
// ============================================================================

describe("Time Decay Attribution", () => {
  it("returns empty array for no touchpoints", () => {
    const results = calculateTimeDecay([], dealAmount);
    expect(results).toEqual([]);
  });

  it("gives 100% to single partner", () => {
    const results = calculateTimeDecay(singleTouchpoint, dealAmount);
    
    expect(results).toHaveLength(1);
    expect(results[0].percentage).toBe(100);
    expect(results[0].amount).toBe(dealAmount);
  });

  it("gives more weight to recent touchpoints", () => {
    const results = calculateTimeDecay(twoPartners, dealAmount);
    
    expect(results).toHaveLength(2);
    
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    
    // Partner B (7 days ago) should have higher percentage than Partner A (14 days ago)
    expect(partnerB.percentage).toBeGreaterThan(partnerA.percentage);
    
    // With 7-day half-life, Partner A (14 days) should have ~1/4 weight of Partner B (7 days)
    // Partner B = e^(-λ*7) ≈ 0.5 (by definition of half-life)
    // Partner A = e^(-λ*14) ≈ 0.25
    // So Partner B should have ~67%, Partner A ~33%
    expect(partnerB.percentage).toBeGreaterThan(60);
    expect(partnerA.percentage).toBeLessThan(40);
  });

  it("totals to 100%", () => {
    const results = calculateTimeDecay(threePartners, dealAmount);
    expect(sumPercentages(results)).toBeCloseTo(100, 1);
  });

  it("totals to deal amount", () => {
    const results = calculateTimeDecay(threePartners, dealAmount);
    expect(sumAmounts(results)).toBeCloseTo(dealAmount, 0);
  });

  it("sums weights for same partner with multiple touchpoints", () => {
    const twoTouchpointsSamePartner: TouchpointInput[] = [
      {
        partnerId: "partner1",
        partnerName: "Partner A",
        commissionRate: 10,
        type: "referral",
        createdAt: now - 1 * dayMs, // 1 day ago
      },
      {
        partnerId: "partner1",
        partnerName: "Partner A",
        commissionRate: 10,
        type: "demo",
        createdAt: now - 1 * dayMs, // 1 day ago
      },
      {
        partnerId: "partner2",
        partnerName: "Partner B",
        commissionRate: 20,
        type: "proposal",
        createdAt: now - 1 * dayMs, // 1 day ago
      },
    ];
    
    const results = calculateTimeDecay(twoTouchpointsSamePartner, dealAmount);
    
    // Partner A has 2 touchpoints, Partner B has 1
    // With same timing, Partner A should get ~66.67%, Partner B ~33.33%
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    
    expect(partnerA.percentage).toBeCloseTo(66.67, 0);
    expect(partnerB.percentage).toBeCloseTo(33.33, 0);
  });

  it("respects custom half-life", () => {
    // With a very long half-life (365 days), old touchpoints retain more weight
    const resultsLongHalfLife = calculateTimeDecay(twoPartners, dealAmount, 365);
    
    // With a short half-life (1 day), old touchpoints lose weight quickly
    const resultsShortHalfLife = calculateTimeDecay(twoPartners, dealAmount, 1);
    
    const partnerALong = resultsLongHalfLife.find(r => r.partnerId === "partner1")!;
    const partnerAShort = resultsShortHalfLife.find(r => r.partnerId === "partner1")!;
    
    // Partner A (older) should have MORE percentage with longer half-life
    expect(partnerALong.percentage).toBeGreaterThan(partnerAShort.percentage);
  });
});

// ============================================================================
// Role-Based Model Tests
// ============================================================================

describe("Role-Based Attribution", () => {
  it("returns empty array for no touchpoints", () => {
    const results = calculateRoleBased([], dealAmount);
    expect(results).toEqual([]);
  });

  it("gives 100% to single partner", () => {
    const results = calculateRoleBased(singleTouchpoint, dealAmount);
    
    expect(results).toHaveLength(1);
    expect(results[0].percentage).toBe(100);
  });

  it("weights by touchpoint type using defaults", () => {
    const results = calculateRoleBased(twoPartners, dealAmount);
    
    // Partner A: referral (40 weight)
    // Partner B: demo (25 weight)
    // Total: 65 weight
    // Partner A: 40/65 = 61.54%
    // Partner B: 25/65 = 38.46%
    
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    
    expect(partnerA.percentage).toBeCloseTo(61.54, 0);
    expect(partnerB.percentage).toBeCloseTo(38.46, 0);
  });

  it("sums weights for same partner with multiple touchpoints", () => {
    // Partner B has demo (25) + proposal (20) = 45
    // Partner A has referral (40)
    // Partner C has negotiation (10)
    // Total: 95
    
    const results = calculateRoleBased(threePartners, dealAmount);
    
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    const partnerC = results.find(r => r.partnerId === "partner3")!;
    
    expect(partnerA.percentage).toBeCloseTo(40 / 95 * 100, 0); // ~42.1%
    expect(partnerB.percentage).toBeCloseTo(45 / 95 * 100, 0); // ~47.4%
    expect(partnerC.percentage).toBeCloseTo(10 / 95 * 100, 0); // ~10.5%
  });

  it("totals to 100%", () => {
    const results = calculateRoleBased(threePartners, dealAmount);
    expect(sumPercentages(results)).toBeCloseTo(100, 1);
  });

  it("respects custom role weights", () => {
    const customWeights = {
      referral: 10,  // Much lower than default (40)
      demo: 50,      // Much higher than default (25)
    };
    
    const results = calculateRoleBased(twoPartners, dealAmount, customWeights);
    
    // Partner A: referral (10 weight)
    // Partner B: demo (50 weight)
    // Partner B should dominate
    
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    
    expect(partnerB.percentage).toBeGreaterThan(partnerA.percentage);
    expect(partnerB.percentage).toBeCloseTo(83.33, 0);
    expect(partnerA.percentage).toBeCloseTo(16.67, 0);
  });

  it("respects custom weight on individual touchpoint", () => {
    const customTouchpoints: TouchpointInput[] = [
      {
        partnerId: "partner1",
        partnerName: "Partner A",
        commissionRate: 10,
        type: "referral",
        createdAt: now - 7 * dayMs,
        weight: 100, // Custom weight overrides type weight
      },
      {
        partnerId: "partner2",
        partnerName: "Partner B",
        commissionRate: 20,
        type: "demo",
        createdAt: now - 3 * dayMs,
        // No custom weight, uses default (25)
      },
    ];
    
    const results = calculateRoleBased(customTouchpoints, dealAmount);
    
    // Partner A: 100 weight (custom)
    // Partner B: 25 weight (default for demo)
    // Partner A should get 80%, Partner B 20%
    
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    
    expect(partnerA.percentage).toBe(80);
    expect(partnerB.percentage).toBe(20);
  });

  it("uses default weight (10) for unknown touchpoint types", () => {
    const unknownTypeTouchpoints: TouchpointInput[] = [
      {
        partnerId: "partner1",
        partnerName: "Partner A",
        commissionRate: 10,
        type: "unknown_type", // Not in default weights
        createdAt: now - 7 * dayMs,
      },
      {
        partnerId: "partner2",
        partnerName: "Partner B",
        commissionRate: 20,
        type: "referral", // 40 weight
        createdAt: now - 3 * dayMs,
      },
    ];
    
    const results = calculateRoleBased(unknownTypeTouchpoints, dealAmount);
    
    // Partner A: 10 weight (default for unknown)
    // Partner B: 40 weight (referral)
    
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    
    expect(partnerA.percentage).toBe(20);
    expect(partnerB.percentage).toBe(80);
  });
});

// ============================================================================
// Normalization Tests
// ============================================================================

describe("normalizeAttributions", () => {
  it("returns empty array for empty input", () => {
    const results = normalizeAttributions([]);
    expect(results).toEqual([]);
  });

  it("does not change already normalized results", () => {
    const results = [
      { partnerId: "p1", partnerName: "A", percentage: 50, amount: 5000, commissionAmount: 500 },
      { partnerId: "p2", partnerName: "B", percentage: 50, amount: 5000, commissionAmount: 500 },
    ];
    
    const normalized = normalizeAttributions(results);
    expect(sumPercentages(normalized)).toBe(100);
  });

  it("adjusts largest attribution to ensure 100% total", () => {
    const results = [
      { partnerId: "p1", partnerName: "A", percentage: 33.33, amount: 3333, commissionAmount: 333 },
      { partnerId: "p2", partnerName: "B", percentage: 33.33, amount: 3333, commissionAmount: 333 },
      { partnerId: "p3", partnerName: "C", percentage: 33.33, amount: 3333, commissionAmount: 333 },
    ];
    // Total: 99.99, needs 0.01 adjustment
    
    const normalized = normalizeAttributions(results);
    expect(sumPercentages(normalized)).toBeCloseTo(100, 1);
  });
});

// ============================================================================
// Commission Calculation Tests
// ============================================================================

describe("Commission Calculations", () => {
  it("calculates correct commission for equal split", () => {
    const results = calculateEqualSplit(twoPartners, dealAmount);
    
    // Partner A: $5000 * 10% = $500
    // Partner B: $5000 * 20% = $1000
    
    const partnerA = results.find(r => r.partnerId === "partner1")!;
    const partnerB = results.find(r => r.partnerId === "partner2")!;
    
    expect(partnerA.commissionAmount).toBe(500);
    expect(partnerB.commissionAmount).toBe(1000);
  });

  it("calculates correct commission for first touch", () => {
    const results = calculateFirstTouch(twoPartners, dealAmount);
    
    // Partner A gets 100% ($10,000) with 10% commission = $1000
    expect(results[0].commissionAmount).toBe(1000);
  });

  it("calculates correct commission for last touch", () => {
    const results = calculateLastTouch(twoPartners, dealAmount);
    
    // Partner B gets 100% ($10,000) with 20% commission = $2000
    expect(results[0].commissionAmount).toBe(2000);
  });

  it("calculates proportional commission for time decay", () => {
    const results = calculateTimeDecay(twoPartners, dealAmount);
    
    for (const result of results) {
      const expectedCommission = result.amount * 
        (result.partnerId === "partner1" ? 0.1 : 0.2);
      expect(result.commissionAmount).toBeCloseTo(expectedCommission, 0);
    }
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("Edge Cases", () => {
  it("handles very large deal amounts", () => {
    const largeDeal = 1_000_000_000; // $1 billion
    const results = calculateEqualSplit(twoPartners, largeDeal);
    
    expect(results).toHaveLength(2);
    expect(results[0].amount).toBe(500_000_000);
    expect(results[1].amount).toBe(500_000_000);
  });

  it("handles zero commission rate", () => {
    const zeroCommissionTouchpoints: TouchpointInput[] = [
      {
        partnerId: "partner1",
        partnerName: "Partner A",
        commissionRate: 0,
        type: "referral",
        createdAt: now - 7 * dayMs,
      },
    ];
    
    const results = calculateEqualSplit(zeroCommissionTouchpoints, dealAmount);
    
    expect(results[0].commissionAmount).toBe(0);
  });

  it("handles 100% commission rate", () => {
    const fullCommissionTouchpoints: TouchpointInput[] = [
      {
        partnerId: "partner1",
        partnerName: "Partner A",
        commissionRate: 100,
        type: "referral",
        createdAt: now - 7 * dayMs,
      },
    ];
    
    const results = calculateEqualSplit(fullCommissionTouchpoints, dealAmount);
    
    expect(results[0].commissionAmount).toBe(dealAmount);
  });

  it("handles touchpoints at exact same timestamp", () => {
    const sameTouchpoints: TouchpointInput[] = [
      {
        partnerId: "partner1",
        partnerName: "Partner A",
        commissionRate: 10,
        type: "referral",
        createdAt: now,
      },
      {
        partnerId: "partner2",
        partnerName: "Partner B",
        commissionRate: 20,
        type: "demo",
        createdAt: now, // Same timestamp
      },
    ];
    
    // Should not crash, first one in array wins for first/last touch
    const firstResults = calculateFirstTouch(sameTouchpoints, dealAmount);
    const lastResults = calculateLastTouch(sameTouchpoints, dealAmount);
    
    expect(firstResults).toHaveLength(1);
    expect(lastResults).toHaveLength(1);
  });

  it("handles many partners efficiently", () => {
    const manyPartners: TouchpointInput[] = Array.from({ length: 100 }, (_, i) => ({
      partnerId: `partner${i}`,
      partnerName: `Partner ${i}`,
      commissionRate: 10,
      type: "referral",
      createdAt: now - i * dayMs,
    }));
    
    const startTime = Date.now();
    const results = calculateTimeDecay(manyPartners, dealAmount);
    const duration = Date.now() - startTime;
    
    expect(results).toHaveLength(100);
    expect(duration).toBeLessThan(100); // Should complete in under 100ms
  });
});
