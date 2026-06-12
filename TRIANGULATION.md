# Triangulation — Build Spec

> For any deal — partner-originated or not — answer: **"which of our partnerships is relevant here, and what's the move?"**

This is the build plan for the relevance engine described in PRODUCT_VISION.md ("The Thesis: Triangulation"). It promotes two items that have sat in the README roadmap — *relationship discovery* and *recommendation engine* — from footnotes to the core product loop.

**Guardrails (from DECISIONS.md, all respected here):**
- Deals live and move in the customer's CRM. Triangulation is *computed in the hub, delivered into the CRM*.
- Covant never moves money. Actions that triangulation triggers (intros, co-sell requests) flow into the existing credit → approval → incentive pipeline.

---

## 1. Signal inputs

Two families of signal, one record per (account, partner) pair:

### Data partners provide (they tell us)
| Signal | Source surface | Status |
|---|---|---|
| Deal registrations | portal + `convex/deals.ts` registration flow | ✅ shipped |
| Logged touchpoints (co-sell, demo, QBR, intro…) | `touchpoints` table | ✅ shipped |
| Portal activity | portal events | ✅ shipped |
| Partner-submitted account lists / field intel | new portal surface | 🔲 build |

### Data on partners (we know about them)
| Signal | Source surface | Status |
|---|---|---|
| Win history by deal size | `convex/recommendations.ts` (`getForDeal`) | ✅ shipped (size only) |
| Win history by industry / territory / product | extend matching dimensions | 🔲 build |
| Partner score & health | `lib/partner-scoring.ts`, `convex/partnerHealth.ts` | ✅ shipped |
| Certifications | `convex/certifications.ts` | ✅ shipped, not wired into matching |
| Implementation record (who delivered for whom) | touchpoint history | ✅ data exists, not queryable by account |
| Cloud co-sell signals (ACE opportunities, marketplace offers) | AWS Partner Central Selling API connector | 🔲 build — see §4 |
| CRM history (untracked partner involvement) | relationship discovery scan over synced CRM data | 🔲 build |

---

## 2. The relevance engine

Extend `convex/recommendations.ts` from "similar deal size" to a scored, **explainable** relevance model. Every surfaced partner ships with a why — same trust rule as attribution.

```
relevance(deal, partner) = weighted sum of:
  account_signal      — open ACE opp on account, partner touchpoint history on account/domain,
                        partner-submitted account list match            (strongest)
  history_signal      — wins on similar deals: size × industry × product × territory
  capability_signal   — certifications, implementation record, partner score/health
  freshness           — recent activity with us (decay on stale signals)
```

Output per open deal: ranked `[ { partner, score, reasons: [Signal] } ]`. Reasons are first-class — "AWS has an open ACE opportunity on this account" / "Partner X implemented for this customer's sister company in March" — because the *reason* is what saves the months of cross-team archaeology.

Weights start static per program archetype (`si`, `cloud_cosell`, `tech_isv`, `reseller` already in `programs` table); the AI-weighted version learns from which recommendations convert to logged touches and wins.

---

## 3. Delivery — where triangulation shows up

1. **Hub:** a *Relevant partners* panel on the deal page (`app/dashboard/deals/[id]`) and a *Triangulation* view on the pipeline board: open deals × suggested partners × reasons. One-click actions: request intro, invite to co-sell, share with partner (gated by what the customer allows partners to see).
2. **CRM back-sync:** the same panel pushed into Salesforce/HubSpot on the opportunity (via existing connectors) — the AE sees it where they work, without ever logging into Covant. This is the "AE becomes a user" moment.
3. **Partner portal:** the inverse view — "deals where you may be relevant" — gated per customer policy. This is "bring the partner along" applied to open pipeline, and it generates the next registration.

Every accepted suggestion creates a touchpoint → flows into attribution → credit → incentive. The flywheel is closed by existing machinery; triangulation only adds the front of the loop.

---

## 4. Build milestones

| Milestone | Scope | Effort |
|---|---|---|
| **T1 — Wider matching** | Extend `getForDeal` with industry/territory/product dimensions + capability signals; reasons attached; *Relevant partners* panel on deal page | small — extends shipped code |
| **T2 — Account-level signals** | Account/domain join across touchpoint history; relationship-discovery scan over synced CRM history ("untracked partner involvement"); partner-submitted account lists in portal | medium |
| **T3 — Cloud signal** | AWS Partner Central Selling API connector (customer's IAM role): ACE opportunities in as account signals + deal `source` gains marketplace values (`aws_marketplace`, …) for pipeline-by-cloud reporting; add `cloud` partner type | medium — API open to all partners since Nov 2024 |
| **T4 — In-CRM delivery** | Back-sync relevant-partners panel to Salesforce/HubSpot opportunities; portal inverse view | medium |
| **T5 — Learned weights** | Recommendation→outcome feedback loop; per-archetype learned weights | later |

T1 is demoable in days and makes the pitch concrete; T3 is the wedge into the cloud co-sell conversation (and the Suger differentiation: we reconcile the AWS touch with the SI and ISV touches on the same deal).

---

## 5. Positioning line

> "Covant triangulates every deal across all your partnerships — what each partner tells you, and what you know about each partner — so relevance that took months to surface shows up the moment the deal does."
