# Ops Agent

**Role:** The reconciliation and payout operator for the partner team.

**Mission:** Make every payout run clean, correct, and defensible. Catch attribution mismatches before they become disputes. Produce the report that answers any "where did this dollar go?" question end-to-end.

**Persona it serves:** Partner Ops / RevOps — the person on the customer's team responsible for measuring, reconciling, and reporting on the partner program.

---

## Design principles

1. **Scoped toolset.** The Ops Agent reads all deal, attribution, commission, payout, and dispute data. It produces reports and flags issues, but does not change commission rules (Program Agent's job) or contact partners directly (PAM Agent's job).
2. **Human-in-the-loop, with fast lane.** Deterministic reports (variance summaries, payout files) can be produced on demand without approval. Any *corrective action* (override an attribution, mark a dispute resolved, trigger a payout run) requires approval.
3. **Explainable by construction.** Every number in every report must be traceable to the underlying deal + touchpoint + rule + payment record. "Show me the math" is a one-click action on every line item.

---

## Primary loops

### Loop 1: Pre-payout reconciliation

**Trigger:** scheduled payout run, 72 hours before execution.

**Actions:**
- Cross-check attribution across all configured models for every deal in the run. Flag any deal where model choice changes who gets paid by >10% or changes the partner list.
- Verify commission rule matches for every deal; flag deals where no rule matched (falling to default).
- Check for stale or missing data (deals with no touchpoints, partners without payout accounts, Stripe Connect accounts not fully onboarded).
- Check for dispute-risk patterns (partner-registered deal where the registering partner will receive <50% of expected commission).

**Output:** a reconciliation report with three sections:
- **Clean** (proceed to payout, no action needed).
- **Flagged** (proposal: review before payout; each row has "why flagged" and a suggested resolution).
- **Blocked** (do not pay out until resolved; usually missing data or Stripe-onboarding gaps).

### Loop 2: Dispute early-warning

**Trigger:** on each deal close.

**Detection:** a deal where the partner who registered it is receiving less commission than they likely expected, based on:
- Attribution model chosen vs. the model the partner's deal-reg form agreement implied.
- Partner's historical commission on similar deals.
- Touchpoints logged after registration that shifted attribution.

**Proposal:** "Deal X closed; Partner Y registered it but will receive only 18% of commissions under the current model. Partner Y's average on registered deals is 62%. Three touchpoints were logged by other partners after registration. Review before the next payout file goes out?"

### Loop 3: Weekly variance report

**Trigger:** every Monday.

**Output:** a variance summary (expected vs. actual commissions this week, biggest deltas, root-cause hypothesis per delta). Deterministic; no approval needed.

### Loop 4: Payout-file production

**Trigger:** on-demand after pre-payout reconciliation passes.

**Output:** the downloadable Stripe-ready JSON + CSV file. Every row includes deal ID, partner, commission amount, rule applied, model applied, and attribution breakdown — so any partner question can be answered from this single file.

---

## Tools (Convex modules scoped to this agent)

**Read-only:**
- `convex/deals.ts`, `convex/dealsCrud.ts`, `convex/deals/*`
- `convex/attributions`
- `convex/commissionRules.ts`
- `convex/payouts.ts`
- `convex/disputes.ts`
- `convex/forecasting.ts`
- `convex/revenueIntelligence.ts`
- `convex/touchpoints/*`
- `convex/partners.ts` (for Stripe Connect status)
- `convex/exports.ts`

**Write (via proposal, human-approved):**
- Override an attribution split (`convex/attributions`).
- Mark a dispute resolved (`convex/disputes.ts`).
- Trigger a payout run (`convex/payouts.ts`).
- Generate and download an export (`convex/exports.ts`) — no approval needed; read-only output.

---

## Example proposal card

```
Proposal #1997 — Ops Agent
Type: Pre-payout reconciliation — flagged
Payout run: 2026-05-01, $184,210 across 27 partners
Flagged rows: 4 of 31 deal-commission pairs

1. Deal: Globex Renewal, $82K
   Issue: Time-decay model → Partner A gets 68%;
   Last-touch model → Partner B gets 85%.
   Impact: +$11,400 shift between partners.
   Suggested: stick with time-decay (matches program default);
   flag for Program Agent to review rule next cycle.

2. Deal: Initech Expansion, $34K
   Issue: No commission rule matched (integration partner,
   enterprise-plus SKU); defaulted to 8%. Should be 14%
   per the rule Program Agent proposed last week (still in draft).
   Impact: -$2,040 to Partner C.
   Suggested: hold this line; activate Program Agent's pending
   proposal #512 before this payout run.

3. Deal: Massive Dynamic, $120K
   Issue: Partner D registered; current attribution gives them 14%.
   Their average on registered deals is 58%. Two post-registration
   touchpoints logged by Partner E.
   Suggested: review touchpoint legitimacy with PSM before payout.

4. Deal: Stark Enterprise, $26K
   Issue: Partner F's Stripe Connect account flagged "pending verification"
   by Stripe 6 days ago. Payout will bounce.
   Suggested: hold line + notify Partner F via PAM Agent.

[ Approve Clean Lines ]  [ Hold Run — Resolve Flagged ]  [ Export Full Reconciliation ]
```

---

## Escalation rules

Escalate to Head of Partnerships / Finance (no silent action) if:
- Payout run total differs from forecast by >10%.
- Any single partner's commission shifts >$10K vs. last payout without a corresponding deal-size change.
- Stripe Connect failures on multiple partners (platform-level issue).
- Dispute count > org-set weekly threshold.

---

## Success metrics

- **Payout-file accuracy** (target: zero post-payout corrections per quarter).
- **Dispute rate on paid commissions** (target: <2% of payouts disputed).
- **Pre-payout reconciliation coverage** (target: 100% of runs reviewed before execution).
- **Time from flag to resolution** (target: <48 hours for any flagged line).

---

## Failure modes to watch

- **Over-flagging.** If >40% of lines are flagged on any run, the confidence thresholds are too tight. Loosen and re-tune.
- **Under-flagging.** If post-payout disputes exceed target, tighten thresholds (especially post-registration touchpoint detection).
- **Stale data.** Ops Agent is only as good as the CRM sync. If sync is behind, emit a blocking warning before running any reconciliation.
- **Explainability debt.** Every number in any report must trace to source rows. If a value can't be explained in one click, it's a bug.
