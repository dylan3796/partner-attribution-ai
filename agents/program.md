# Program Agent

**Agent concept:** Program Design & Optimization Agent.

**Scope:** Ecosystem-level. The Program Agent works across the entire partner population, not one partner or one deal.

**Core question:** *"Is our system producing the partners we want?"*

**Mental model:** Partner Programs is the progression system the whole ecosystem operates inside — a school for partners. Partners are participants, tiers are levels of achievement, requirements are criteria for advancement, incentives are the motivators, and enablement is the curriculum that helps partners improve.

**Mission:** Keep the progression system working. Watch how partners move through tiers, where they stall, which incentives are actually driving the intended behaviors, and where requirements need to tighten or loosen. Develop the long tail. Keep expectations simple, transparent, and achievable. Flag when the system is pushing the ecosystem in a direction that's off from strategic goals.

**Persona it serves:** Partner Programs Lead — the person who designs and governs the program the rest of the org operates inside. They run on a slower clock than PSM or PAM: tier reviews on a quarterly rhythm, requirement changes on a multi-month cycle, annual program refresh. They're measured on ecosystem health and partner progression, not individual-deal or individual-partner outcomes.

**What the agent helps with:**
- Analyze tier progression — how partners move through levels, expected vs actual velocity.
- Identify partners stuck at specific levels and diagnose why.
- Recommend requirement or threshold changes with dry-run impact.
- Evaluate whether each incentive is driving the behavior it was designed for.
- Recommend next steps for individual partners to reach the next level (fed downstream to the PAM Agent).
- Identify ecosystem imbalances (tier concentration, segment under-representation, capability gaps).
- Support long-tail partner development.
- Produce program health summaries for leadership.

---

## Design principles

1. **Scoped toolset.** The Program Agent reads and proposes edits to `programConfig`, `tierReviews`, `certifications`, `cohorts`, the enablement curriculum, and cross-org benchmarks (when available). It does not operate on individual opportunities (that's the PSM Agent), own the partner relationship (the PAM Agent), or produce cross-org measurement (the Ops Agent) — it consumes Ops's outputs as inputs.
2. **Human-in-the-loop, harder.** Program changes affect every partner. All proposals default to *dry-run* — the agent runs the proposed change against the last 1-4 quarters of data and shows expected impact (per partner, per tier, aggregate) before any human can approve.
3. **Benchmark-aware.** When cross-org benchmarks are available, the agent uses peer-vertical comparisons to justify proposals ("peers in your vertical run Silver threshold at $35K sourced pipeline; yours is $50K"). When peer N is low (<10), hide the comparison — it's noise.
4. **Transparent by design.** Every recommendation must be explainable in plain language a partner would understand — because the output often becomes partner-facing communication (tier change notice, requirement update, new perk).

---

## Primary loops

### Loop 1: Tier-progression analysis

**Trigger:** monthly, plus on-demand before any tier review.

**Detection:**
- Count of partners in each tier; trend over the last 4 quarters.
- Advancement rate (tier-up moves per quarter) and drop rate (tier-down moves or churn).
- Expected vs actual velocity through each level, based on when partners hit each criterion.

**Proposal / Output:**
- "Silver → Gold advancement has slowed from 14 partners/quarter to 4 over the last three quarters. Two criteria drove it: the new industry-specialization requirement, and a step-up in activity threshold."
- Suggestions: tune the bottleneck criterion, or invest enablement in the specific capability gap.

### Loop 2: Stuck-at-level detection

**Trigger:** weekly.

**Detection:** partners who have met N-1 of the N criteria for their next tier, AND have shown forward motion in the last 90 days but have plateaued.

**Proposal (per partner, fed to the PAM Agent for action):**
- "Ridgeway is one requirement away from Gold — they've met the activity, certification, and joint-pipeline thresholds, but are missing the Advanced Implementation specialization. Suggest flagging to the PAM with a specific ladder: one SA certifies this quarter, partner unlocks Gold at the next tier review."

**Batch summary for the Programs Lead:**
- "27 partners are stuck one requirement away from their next tier. 14 are missing the same specialization. Consider a group enablement campaign."

### Loop 3: Incentive-effectiveness review

**Trigger:** quarterly, per incentive.

**Detection:** for each active incentive (tier-gated perk, co-marketing benefit, priority-access program, event invitation, badge/status, etc.), compare the behavior the incentive was designed to drive vs. the behavior actually observed.

**Proposal:**
- "The 'Gold-and-up priority deal routing' perk was designed to drive specialization completion. Completion rates haven't moved; partners are treating the perk as a default rather than a target. Recommend either tightening the qualifying threshold or replacing with an incentive tied more directly to capability."

### Loop 4: Threshold / requirement tuning

**Trigger:** quarterly, or when tier distribution crosses health bounds.

**Proposal:** "Silver holds 34 partners with median sourced pipeline of $18K; Gold holds 4 with median $180K. The Silver→Gold gap is 10x and the distribution is bimodal. Recommendation: add a Platinum tier at $250K to pull the top 2 out of Gold, OR lower Gold threshold to $80K to pull 7 up from Silver. Dry-run table for each option attached."

**Dry-run includes:**
- Who advances, who drops, who is unaffected.
- Change in tier-distribution shape.
- Expected second-order effects (incentive eligibility shifts, capability-requirement shifts).

### Loop 5: Long-tail development

**Trigger:** monthly.

**Detection:** partners in the bottom cohort who show a latent signal — a first deal reg after a quiet period, a team member starting a certification, an inbound lead, sustained portal activity.

**Proposal:** "Eight bottom-cohort partners showed a first forward-motion signal this month. Draft enablement invitation + joint business-plan starter for each, routed to the PAM Agent."

### Loop 6: Program health summary

**Trigger:** monthly and quarterly.

**Output (deterministic, no approval needed):**
- Tier distribution health (no tier <5% or >60% of active partners; no dead tiers).
- Progression velocity by tier.
- Incentive effectiveness scorecard (one line per incentive).
- Long-tail activation rate.
- Open risks to ecosystem health (concentration, stagnation, capability gaps vs. company priorities).

---

## Tools (Convex modules scoped to this agent)

**Read-only:**
- `convex/programConfig.ts`
- `convex/tierReviews.ts`
- `convex/certifications.ts`
- `convex/cohorts.ts`
- `convex/benchmarks.ts`
- `convex/partners.ts` (for tier-impact modeling)
- `convex/deals.ts`, `convex/attributions` (for progression-criteria data, via Ops Agent outputs)

**Write (via proposal, human-approved, with mandatory dry-run preview):**
- Tier definition / threshold update (`convex/programConfig.ts`, `convex/tierReviews.ts`).
- Requirement / criterion update.
- Incentive attachment change.
- Partner certification reminder send.

---

## Example proposal card

```
Proposal #512 — Program Agent
Type: Tier-threshold recommendation
Scope: Silver → Gold progression
Current state:
  - Silver: 34 partners, median sourced pipeline $18K
  - Gold: 4 partners, median $180K
  - Distribution is bimodal; 10x jump between tiers
Proposed edit:
  - Lower Gold threshold from $120K → $80K sourced pipeline
  - Add "at least one specialization" as a co-requirement
  - Effective date: next tier review cycle (no retroactive drops)
Dry-run impact (last 4 quarters):
  - 7 Silver partners would have advanced to Gold
  - 0 current Gold partners would have dropped
  - Tier distribution becomes 27 Silver / 11 Gold / 4 candidates for a new top tier
  - 4 of the 7 advancing partners already hold a specialization;
    3 would need to complete one within 6 months to stay in Gold
Peer benchmark (N=12 peers):
  - Median Gold threshold in your vertical: $75K sourced pipeline
  - 11 of 12 peers use a capability co-requirement
[ Approve + Activate at Next Review ]  [ Edit ]  [ Reject ]  [ Save as Draft ]
```

---

## Escalation rules

Escalate to Head of Partnerships (no auto-activate, direct alert) if:
- Proposed change would re-tier >20% of the active partner population.
- Proposed change would trigger contractual re-negotiation with any partner (org-flagged).
- Tier distribution would move outside health bounds (any tier <5% or >60% of active partners).
- A proposed change conflicts with a stated strategic goal (e.g., "grow the long tail" while the change accelerates concentration at the top).

---

## Success metrics

- **Progression velocity** (partners advancing per quarter) — target: stable or increasing against plan.
- **Tier distribution health** (no tier <5% or >60%; no bimodal gaps >5x).
- **Stuck-partner count** — partners one requirement from their next tier for >2 quarters. Target: shrinking.
- **Long-tail activation rate** — bottom-cohort partners showing forward motion per quarter. Target: increasing.
- **Incentive effectiveness** — fraction of active incentives demonstrably driving their intended behavior. Target: ≥80%.
- **Time from signal to recommendation** (e.g., incentive underperformance → proposed fix). Target: <30 days.

---

## Failure modes to watch

- **Over-active rule editing.** Every program change is an operational shock for partners. Cap proposals to ≤2 material program edits per quarter per org by default.
- **Dry-run misleading.** A 4-quarter window can miss long-cycle behavior. For long-cycle programs, expand the dry-run window and flag assumptions.
- **Benchmark misuse.** When cross-org N is low (<10 peers), hide the peer comparison — it's noise, not signal.
- **Optimizing the wrong metric.** Progression velocity can be gamed by lowering thresholds. Always pair it with ecosystem-health metrics and strategic-alignment checks.
- **Forgetting the long tail.** Most program tuning targets the top of the distribution. The agent must surface long-tail signal every cycle, not only when asked.
