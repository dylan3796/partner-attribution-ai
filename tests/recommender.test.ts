/**
 * Attribution model recommender — unit tests.
 */

import { describe, it, expect } from "vitest";
import { recommendModel } from "@covant/engine";

describe("recommendModel", () => {
  it("recommends marketplace_cosell_hybrid for cloud co-sell programs", () => {
    const r = recommendModel({ description: "We run an AWS co-sell program through the marketplace." });
    expect(r.model).toBe("marketplace_cosell_hybrid");
    expect(r.archetype).toBe("cloud_cosell");
    expect(r.rationale.length).toBeGreaterThan(0);
  });

  it("recommends marketplace_cosell_hybrid for Azure/Snowflake mentions", () => {
    expect(recommendModel({ description: "Azure and Snowflake hyperscaler deals" }).model).toBe(
      "marketplace_cosell_hybrid"
    );
  });

  it("recommends implementation_credit for delivery/SI programs", () => {
    const r = recommendModel({ description: "Systems integrators who handle implementation and delivery." });
    expect(r.model).toBe("implementation_credit");
    expect(r.archetype).toBe("si");
  });

  it("recommends implementation_credit when partner type is integration", () => {
    expect(recommendModel({ partnerTypes: ["integration"] }).model).toBe("implementation_credit");
  });

  it("recommends split_equally for reseller/channel programs", () => {
    const r = recommendModel({ description: "Channel resellers and distributors selling our product." });
    expect(r.model).toBe("split_equally");
    expect(r.archetype).toBe("reseller");
  });

  it("recommends split_equally when partner type is reseller", () => {
    expect(recommendModel({ partnerTypes: ["reseller"] }).model).toBe("split_equally");
  });

  it("recommends first_touch_sourcer for referral/affiliate programs", () => {
    const r = recommendModel({ description: "Simple referral program, partners introduce leads." });
    expect(r.model).toBe("first_touch_sourcer");
  });

  it("recommends first_touch_sourcer when partner types are referral/affiliate", () => {
    expect(recommendModel({ partnerTypes: ["affiliate"] }).model).toBe("first_touch_sourcer");
  });

  it("falls back to role_weighted with no clear signal", () => {
    const r = recommendModel({ description: "We have a partner program." });
    expect(r.model).toBe("role_weighted");
    expect(r.archetype).toBe("other");
  });

  it("uses role_weighted when several partner types contribute", () => {
    // 'partner' is not a strong single signal; multiple types → role weighting
    const r = recommendModel({ partnerTypes: ["partner", "advisor"] });
    expect(r.model).toBe("role_weighted");
  });

  it("respects signal priority: co-sell beats reseller wording", () => {
    const r = recommendModel({ description: "Resellers who also co-sell on AWS marketplace" });
    expect(r.model).toBe("marketplace_cosell_hybrid");
  });

  it("always returns a non-empty rationale", () => {
    for (const desc of ["", "referral", "reseller", "aws co-sell", "implementation"]) {
      expect(recommendModel({ description: desc }).rationale.length).toBeGreaterThan(0);
    }
  });
});
