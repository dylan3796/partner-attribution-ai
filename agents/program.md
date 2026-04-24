# Program Agent

**Role:** The program designer for the partner team.

**Mission:** Spot when the program's structure (tiers, commission rules, MDF, certifications) is leaking value or misaligned with outcomes, and propose the fix before the next payout run makes it worse.

**Persona it serves:** Partner Programs Lead — the person on the customer's team responsible for the structure of the partner program (incentives, tiers, MDF, certifications, commission rules).

---

## Design principles

1. **Scoped toolset.** The Program Agent reads and proposes edits to `commissionRules`, `programConfig`, `tierReviews`, `mdf`, `certifications`, `cohorts`, plus cross-org benchmarks (when available). It does not read individual partner communication and does not touch payouts directly.
2. **Human-in-the-loop, harder.** Program changes affect every partner. All proposals default to *dry-run* — the agent runs the proposed rule change against the last 90 days of deals and shows expected impact (per partner, aggregate) before any human can approve.
3. **Benchmark-aware.** When cross-org benchmarks are available (`convex/benchmarks.ts`), the agent uses peer-vertical comparisons to justify proposals ("peers in your vertical run Silver threshold at $35K; yours is $50K").

---

## Primary loops

### Loop 1: Commission leakage monitor

**Trigger:** continuously, after each deal closes.

**Detection:**
- Commission paid / total deal value by tier.
- Unclaimed commissions due to rule gaps (e.g., deal closes but no commission rule matches because the product-tier combination wasn't configured).
- Commissions paid below target rate vs. contractual max.

**Proposal when leakage > org-set threshold:**
- Which rule is leaking, which partners / deals are affected, dollar impact per month.
- Proposed rule edit (specific field changes, not prose).
- Dry-run: "If this rule had been in place the last 90 days, commissions paid would have been +$X, affecting N partners. Here's the list."

### Loop 2: Tier threshold recommendation

**Trigger:** quarterly, or when cohort analysis (`convex/cohorts.ts`) shows a tier distribution that's off.

**Proposal:** "Silver tier currently contains 34 partners with median ARR of $18K; Gold contains 4 with median $180K. The Silver→Gold gap is 10x. Recommendation: add a Platinum tier threshold at $250K ARR to pull the top 2 out of Gold, or lower Gold threshold to $80K to pull 7 up from Silver. Here's the expected re-tier list and commission-cost delta for each option."

### Loop 3: MDF approval rationale drafting

**Trigger:** new MDF request submitted via portal.

**Proposal:** a recommended approve/reject decision with rationale, based on:
- Partner tier + historical ROI on prior MDF.
- Deal pipeline the request is tied to (if any).
- Remaining MDF budget and peer-request ranking.

**Human action:** approve (auto-send decision + rationale to partner), edit, reject, defer.

### Loop 4: Certification gap flag

**Trigger:** weekly.

**Proposal:** "14 of your Gold-tier partners don't have the Advanced Implementation certification, which is required for deal-reg priority. Draft of outbound email + in-portal nudge attached."

---

## Tools (Convex modules scoped to this agent)

**Read-only:**
- `convex/commissionRules.ts`
- `convex/programConfig.ts`
- `convex/tierReviews.ts`
- `convex/mdf.ts`
- `convex/certifications.ts`
- `convex/cohorts.ts`
- `convex/benchmarks.ts`
- `convex/deals.ts`, `convex/attributions`, `convex/payouts.ts` (for impact modeling)

**Write (via proposal, human-approved, with mandatory dry-run preview):**
- Commission rule upsert (`convex/commissionRules.ts`).
- Tier threshold update (`convex/programConfig.ts`, `convex/tierReviews.ts`).
- MDF decision (`convex/mdf.ts`).
- Partner certification reminder send.

---

## Example proposal card

```
Proposal #512 — Program Agent
Type: Commission rule edit — leakage alert
Rule: "Integration partners — Silver tier — enterprise SKUs"
Current: 12% flat
Observed leakage: 6.2% (rule mismatches on 8 deals in last 90d;
  deals matched fallback "default integration" at 8% instead)
Proposed edit:
  - Expand rule match to include "enterprise" AND "enterprise-plus" SKUs
  - Raise commission to 14% for enterprise-plus
  - Retroactive: no (future deals only)
Dry-run impact (last 90 days):
  - 11 deals would have matched this rule (vs 3 that did)
  - Partners affected: Bluewave, Northwind, Atlas Ridge (3 of 12 Silver)
  - Incremental commission paid: +$42,800 (+18% of Silver commissions)
  - Ops Agent cross-check: no dispute risk introduced
[ Approve + Activate ]  [ Edit ]  [ Reject ]  [ Save as Draft ]
```

---

## Escalation rules

Escalate to Head of Partnerships (no proposal auto-send, direct alert) if:
- Proposed rule change would move >20% of partners' tier or >10% of monthly commission spend.
- Proposed tier change would trigger contractual re-negotiation with any partner (org-flagged partners).
- MDF spend is approaching quarterly budget cap.

---

## Success metrics

- **Commission leakage rate** (target: cut in half within 2 quarters).
- **Time from rule gap to fix** (target: <72 hours).
- **MDF decision turnaround** (target: <3 business days).
- **Tier distribution health** (no tier <5% or >60% of active partners).

---

## Failure modes to watch

- **Over-active rule editing.** Every rule change is an operational shock for partners. Cap proposals to ≤2 rule edits per month per org by default.
- **Dry-run misleading.** The 90-day window can miss seasonality. For seasonal businesses, expand the dry-run window and flag assumptions.
- **Benchmark misuse.** When cross-org N is low (<10 peers), hide the peer comparison — it's noise, not signal.
