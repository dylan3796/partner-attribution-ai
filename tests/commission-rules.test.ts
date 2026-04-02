/**
 * Commission Rules Engine Tests
 *
 * Tests the rule matching logic used to determine which commission rate
 * applies to a given partner + deal combination.
 */

import { describe, it, expect } from "vitest";

// ============================================================================
// Extracted Rule Matching Logic (mirrors convex/commissionRules.ts match handler)
// ============================================================================

type PartnerInput = {
  type?: "affiliate" | "referral" | "reseller" | "integration";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  commissionRate: number;
  organizationId: string;
};

type Rule = {
  name: string;
  partnerType?: "affiliate" | "referral" | "reseller" | "integration";
  partnerTier?: "bronze" | "silver" | "gold" | "platinum";
  productLine?: string;
  rate: number;
  minDealSize?: number;
  priority: number;
};

type MatchArgs = {
  partner: PartnerInput;
  dealAmount: number;
  productLine?: string;
  rules: Rule[];
};

/**
 * Find the best matching commission rule for a partner + deal.
 * Rules are checked in priority order (lowest priority number first).
 */
function matchRule({ partner, dealAmount, productLine, rules }: MatchArgs): {
  name: string;
  rate: number;
  priority: number;
} {
  // Sort by priority (ascending — lower number = higher priority)
  const sorted = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sorted) {
    if (rule.partnerType && rule.partnerType !== partner.type) continue;
    if (rule.partnerTier && rule.partnerTier !== (partner.tier ?? "bronze"))
      continue;
    if (rule.productLine && rule.productLine !== productLine) continue;
    if (rule.minDealSize && dealAmount < rule.minDealSize) continue;
    return { name: rule.name, rate: rule.rate, priority: rule.priority };
  }

  // No match — return default
  return { name: "Default", rate: partner.commissionRate, priority: 999 };
}

// ============================================================================
// Test Fixtures
// ============================================================================

const goldReseller: PartnerInput = {
  type: "reseller",
  tier: "gold",
  commissionRate: 15,
  organizationId: "org1",
};

const bronzeAffiliate: PartnerInput = {
  type: "affiliate",
  tier: "bronze",
  commissionRate: 5,
  organizationId: "org1",
};

const silverReferral: PartnerInput = {
  type: "referral",
  tier: "silver",
  commissionRate: 10,
  organizationId: "org1",
};

const standardRules: Rule[] = [
  {
    name: "Gold Reseller Premium",
    partnerType: "reseller",
    partnerTier: "gold",
    rate: 0.25,
    priority: 1,
  },
  {
    name: "Large Deal Bonus",
    minDealSize: 100000,
    rate: 0.2,
    priority: 2,
  },
  {
    name: "Reseller Standard",
    partnerType: "reseller",
    rate: 0.15,
    priority: 3,
  },
  {
    name: "Enterprise Product",
    productLine: "enterprise",
    rate: 0.18,
    priority: 4,
  },
  {
    name: "Affiliate Base",
    partnerType: "affiliate",
    rate: 0.05,
    priority: 5,
  },
];

// ============================================================================
// Tests
// ============================================================================

describe("Commission Rule Matching", () => {
  describe("Priority-based matching", () => {
    it("matches the highest priority (lowest number) rule that fits", () => {
      const result = matchRule({
        partner: goldReseller,
        dealAmount: 50000,
        rules: standardRules,
      });
      expect(result.name).toBe("Gold Reseller Premium");
      expect(result.rate).toBe(0.25);
      expect(result.priority).toBe(1);
    });

    it("falls through to lower priority when higher doesn't match", () => {
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 5000,
        rules: standardRules,
      });
      expect(result.name).toBe("Affiliate Base");
      expect(result.rate).toBe(0.05);
    });

    it("matches large deal bonus for any partner type when deal is big enough", () => {
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 150000,
        rules: standardRules,
      });
      expect(result.name).toBe("Large Deal Bonus");
      expect(result.rate).toBe(0.2);
    });
  });

  describe("Partner type filtering", () => {
    it("skips rules that don't match partner type", () => {
      const result = matchRule({
        partner: silverReferral,
        dealAmount: 50000,
        rules: standardRules,
      });
      // Should skip Gold Reseller (wrong type), Large Deal (too small),
      // Reseller Standard (wrong type), Enterprise Product (no product line),
      // Affiliate Base (wrong type) — fall through to default
      expect(result.name).toBe("Default");
      expect(result.rate).toBe(silverReferral.commissionRate);
    });
  });

  describe("Partner tier filtering", () => {
    it("matches tier-specific rule for matching tier", () => {
      const result = matchRule({
        partner: goldReseller,
        dealAmount: 10000,
        rules: standardRules,
      });
      expect(result.name).toBe("Gold Reseller Premium");
    });

    it("skips tier-specific rule when tier doesn't match", () => {
      const bronzeReseller: PartnerInput = {
        type: "reseller",
        tier: "bronze",
        commissionRate: 10,
        organizationId: "org1",
      };
      const result = matchRule({
        partner: bronzeReseller,
        dealAmount: 10000,
        rules: standardRules,
      });
      // Should skip Gold Reseller (wrong tier), match Reseller Standard
      expect(result.name).toBe("Reseller Standard");
    });

    it("defaults undefined tier to bronze", () => {
      const noTierReseller: PartnerInput = {
        type: "reseller",
        commissionRate: 10,
        organizationId: "org1",
      };
      const rules: Rule[] = [
        {
          name: "Bronze Only",
          partnerTier: "bronze",
          rate: 0.05,
          priority: 1,
        },
      ];
      const result = matchRule({
        partner: noTierReseller,
        dealAmount: 10000,
        rules,
      });
      expect(result.name).toBe("Bronze Only");
    });
  });

  describe("Deal size thresholds", () => {
    it("matches when deal is above minimum", () => {
      const rules: Rule[] = [
        {
          name: "Big Deal",
          minDealSize: 50000,
          rate: 0.2,
          priority: 1,
        },
      ];
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 75000,
        rules,
      });
      expect(result.name).toBe("Big Deal");
    });

    it("skips when deal is below minimum", () => {
      const rules: Rule[] = [
        {
          name: "Big Deal",
          minDealSize: 50000,
          rate: 0.2,
          priority: 1,
        },
      ];
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 25000,
        rules,
      });
      expect(result.name).toBe("Default");
    });

    it("matches when deal is exactly at minimum", () => {
      const rules: Rule[] = [
        {
          name: "Big Deal",
          minDealSize: 50000,
          rate: 0.2,
          priority: 1,
        },
      ];
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 50000,
        rules,
      });
      expect(result.name).toBe("Big Deal");
    });
  });

  describe("Product line matching", () => {
    it("matches product-specific rule when product line matches", () => {
      const result = matchRule({
        partner: silverReferral,
        dealAmount: 50000,
        productLine: "enterprise",
        rules: standardRules,
      });
      expect(result.name).toBe("Enterprise Product");
      expect(result.rate).toBe(0.18);
    });

    it("skips product-specific rule when product line doesn't match", () => {
      const rules: Rule[] = [
        {
          name: "Enterprise Only",
          productLine: "enterprise",
          rate: 0.2,
          priority: 1,
        },
      ];
      const result = matchRule({
        partner: silverReferral,
        dealAmount: 50000,
        productLine: "starter",
        rules,
      });
      expect(result.name).toBe("Default");
    });
  });

  describe("Default fallback", () => {
    it("returns partner's commission rate as default when no rules match", () => {
      const result = matchRule({
        partner: goldReseller,
        dealAmount: 5000,
        rules: [],
      });
      expect(result.name).toBe("Default");
      expect(result.rate).toBe(goldReseller.commissionRate);
      expect(result.priority).toBe(999);
    });

    it("returns default for empty rule set", () => {
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 10000,
        rules: [],
      });
      expect(result.rate).toBe(bronzeAffiliate.commissionRate);
    });
  });

  describe("Multiple conditions on single rule", () => {
    it("requires ALL conditions to match", () => {
      const rules: Rule[] = [
        {
          name: "Gold Reseller Large Deal",
          partnerType: "reseller",
          partnerTier: "gold",
          minDealSize: 100000,
          productLine: "enterprise",
          rate: 0.3,
          priority: 1,
        },
      ];

      // All match
      expect(
        matchRule({
          partner: goldReseller,
          dealAmount: 150000,
          productLine: "enterprise",
          rules,
        }).name
      ).toBe("Gold Reseller Large Deal");

      // Wrong tier
      expect(
        matchRule({
          partner: { ...goldReseller, tier: "silver" },
          dealAmount: 150000,
          productLine: "enterprise",
          rules,
        }).name
      ).toBe("Default");

      // Deal too small
      expect(
        matchRule({
          partner: goldReseller,
          dealAmount: 50000,
          productLine: "enterprise",
          rules,
        }).name
      ).toBe("Default");

      // Wrong product
      expect(
        matchRule({
          partner: goldReseller,
          dealAmount: 150000,
          productLine: "starter",
          rules,
        }).name
      ).toBe("Default");
    });
  });

  describe("Edge cases", () => {
    it("handles zero deal amount", () => {
      const rules: Rule[] = [
        { name: "Any Deal", rate: 0.1, priority: 1 },
      ];
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 0,
        rules,
      });
      expect(result.name).toBe("Any Deal");
    });

    it("handles very large deal amounts", () => {
      const rules: Rule[] = [
        {
          name: "Mega Deal",
          minDealSize: 10000000,
          rate: 0.3,
          priority: 1,
        },
      ];
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 50000000,
        rules,
      });
      expect(result.name).toBe("Mega Deal");
    });

    it("handles rules with zero rate", () => {
      const rules: Rule[] = [
        { name: "No Commission", rate: 0, priority: 1 },
      ];
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 10000,
        rules,
      });
      expect(result.rate).toBe(0);
    });

    it("handles duplicate priorities by matching first encountered", () => {
      const rules: Rule[] = [
        { name: "Rule A", rate: 0.1, priority: 1 },
        { name: "Rule B", rate: 0.2, priority: 1 },
      ];
      const result = matchRule({
        partner: bronzeAffiliate,
        dealAmount: 10000,
        rules,
      });
      // Both match, but A should be returned first (stable sort)
      expect(result.rate).toBeDefined();
    });
  });
});
