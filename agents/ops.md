# Ops Agent

**Agent concept:** Insights & Attribution Engine.

**Scope:** Cross-functional / system-level. The Ops Agent works across the whole partner organization — not a single opportunity (PSM), partner (PAM), or program-design question (Program).

**Core question:** *"What is actually happening, and why?"*

**Mission:** Make partner performance explainable, forecastable, and consistent. Define and defend the measurement layer everyone else operates on: metrics, definitions, dashboards, forecasts, and operating cadences. When a number moves, be the first to know why. When leadership asks a question, be the one who has the answer — grounded in data, with the math one click away.

**Persona it serves:** Partner Strategy & Operations — the person responsible for measuring and explaining the partner program. They're measured on forecast reliability, operational consistency, decision quality, and whether the rest of the org trusts the numbers. Their work is cross-cutting: one day a forecasting revision, the next a new dashboard, the next a data-definition memo, the next the deck for the monthly operating review.

**What the agent helps with:**
- Explain performance drivers — when a metric moves, surface the signals that caused it.
- Analyze trends across partners, pipeline, revenue, and activity.
- Connect partner activity to outcomes (which touches, which enablement, which motions actually drive results).
- Support forecasting and scenario planning.
- Answer leadership questions in natural language, grounded in the source data.
- Identify data quality and process gaps — stale syncs, inconsistent definitions, orphan records, missing metadata.
- Generate operating-review summaries (weekly, monthly, quarterly).

---

## Design principles

1. **Scoped toolset.** The Ops Agent reads every partner-relevant data surface — deals, partners, touchpoints, attributions, activity, certifications, tier state, program config — because its job is to explain the system, not change it. It writes only analysis artifacts (summaries, flagged data-quality issues, forecast updates). It does not run partner-facing motions (PSM / PAM) or edit program structure (Program).
2. **Fast lane for deterministic output.** Rollups, trend reports, forecast updates, and operating-review decks are deterministic — they're produced on demand without approval. Anything that *changes* a metric definition, recasts a forecast, or flags a data-quality issue for fix requires human review.
3. **Explainable by construction.** Every number in every report must be traceable to the underlying records (deals, activities, partner state) and the definition applied. "Show me the math" is a one-click action on every line item. If a number can't be explained, it's a bug.
4. **Definition-aware.** The agent knows which definitions are canonical (e.g., "sourced pipeline", "influenced deal", "active partner") and flags when a report uses a non-canonical definition or when the canonical definition has drifted.

---

## Primary loops

### Loop 1: Performance-driver explanation

**Trigger:** any headline metric moves beyond an org-configured threshold week-over-week or month-over-month; or on-demand when a human asks "why did X change?".

**Detection:** decompose the metric into its 2–4 biggest underlying drivers and rank by contribution to the change.

**Output:**
- "Q2 sourced pipeline is down 14% vs. Q1. 11 points of that come from a drop in mid-tier partner activity (specifically: 6 partners who contributed $2.1M collectively in Q1 are at $0 this quarter). 3 points come from a definitional change — the new 'sourced' definition, effective April 1, excludes deals where the first touch is inbound + later tagged to a partner. Here's the breakdown."
- Links to every underlying record. Draft explanation ready to drop into the operating-review deck.

### Loop 2: Trend analysis

**Trigger:** weekly (rollup) and monthly (deeper trend pass).

**Output:**
- Weekly: a one-page "what moved and why" brief across partners, pipeline, revenue, and activity.
- Monthly: trend analysis across the same dimensions with root-cause hypotheses and the signals behind them.
- Deterministic; no approval needed.

### Loop 3: Activity-to-outcome attribution

**Trigger:** monthly, or when a specific motion is under review.

**Detection:** connect partner activity (touches, enablement completions, co-sell participation, event attendance, certification milestones) to downstream outcomes (pipeline created, close rate, deal size, expansion).

**Output:** "Partners who completed the Advanced Implementation specialization in Q1 closed at a 34% higher rate and had a 22% larger median deal size than the matched comparison group. The lift shows up within 60 days of completion and persists for at least two quarters. Recommend surfacing this to the Program Agent for incentive-design input."

### Loop 4: Forecasting and scenario planning

**Trigger:** weekly forecast refresh; on-demand for scenario questions.

**Output:**
- A rolling forecast for pipeline and revenue with partner-segment breakdowns.
- Scenario toggles: "what happens to Q3 pipeline if Gold partners under-index on activity by 20%?", "what if the new specialization rolls out on schedule vs. a month late?"
- Forecast confidence bands with the drivers behind each.

### Loop 5: Leadership-question inbox

**Trigger:** a leadership question submitted in natural language (via dashboard, Slack, email).

**Output:** a drafted answer grounded in the source data, with:
- The exact numbers requested.
- The definition used (and a flag if multiple definitions exist).
- The underlying records, one click away.
- A short interpretation if the question implies one.

**Human action:** review, edit, approve for send — or forward directly if the question is unambiguous and the answer is deterministic.

### Loop 6: Data-quality and process-gap detection

**Trigger:** continuously.

**Detection:**
- Stale syncs (CRM data older than the freshness SLA).
- Orphan records (deals with no partner, partners with no contacts, touchpoints pointing to deleted deals).
- Definition drift (a metric producing different values in two reports for the same period).
- Missing metadata (deals without close date, partners without segment, touchpoints without type).

**Proposal:** flag the issue, show affected records, propose the fix — but do not auto-fix without human approval.

### Loop 7: Operating-review summary production

**Trigger:** a scheduled operating review (weekly, monthly, quarterly).

**Output:** a draft deck/doc with:
- Headline metrics + period-over-period deltas.
- The 3–5 biggest drivers behind the deltas.
- Forecast for the next period and what has changed in the forecast since last review.
- Open data-quality or definitional issues worth leadership attention.
- Questions the agent expects to be asked, with draft answers prepared.

**Human action:** review, edit, approve — or take the draft into the meeting as-is.

---

## Tools (Convex modules scoped to this agent)

**Read-only (broad — the Ops Agent reads the whole partner data surface):**
- `convex/deals.ts`, `convex/dealsCrud.ts`, `convex/deals/*`
- `convex/attributions`
- `convex/partners.ts`, `convex/partnerHealth.ts`
- `convex/touchpoints/*`
- `convex/certifications.ts`, `convex/cohorts.ts`
- `convex/programConfig.ts`, `convex/tierReviews.ts`
- `convex/forecasting.ts`, `convex/revenueIntelligence.ts`
- `convex/activityHeatmap.ts`, `convex/weeklyDigest.ts`
- `convex/benchmarks.ts`

**Write (no approval needed — analysis artifacts only):**
- Generate and download reports, dashboards, operating-review decks (`convex/exports.ts`).
- Publish forecast updates.

**Write (via proposal, human-approved):**
- Flag a metric definition as drifted or in need of alignment across reports.
- Open a data-quality ticket on affected records.

---

## Example proposal card

```
Insight #1997 — Ops Agent
Type: Performance-driver explanation
Metric: Q2 sourced pipeline
Movement: $12.4M → $10.7M (−14% vs. Q1)

Drivers (ranked by contribution):
1. Mid-tier partner activity drop — 11 points of the decline
   - 6 partners contributed $2.1M in Q1, $0 in Q2
   - All 6 are at or below their 4-week activity floor
   - Routed to PAM Agent for re-engagement; 4 of 6 already
     flagged as "at-risk" in this week's health sweep
2. Definitional change — 3 points of the decline
   - "Sourced" redefined April 1 to exclude inbound-first deals
     later tagged to a partner
   - ~$380K of Q1 pipeline would not count under the new
     definition; apples-to-apples Q2 decline is ~11%, not 14%
3. Seasonality — not a driver
   - Q2 is historically ±2% from Q1 in this segment

Draft for operating-review deck:
  > Q2 sourced pipeline is down 14% vs. Q1. ~3 points are a
  > definition change (comparable decline is 11%). The remaining
  > decline is concentrated in six mid-tier partners whose Q1
  > activity has not repeated; PAM has re-engagement in motion.
  > Forecast for Q3 holds flat vs. current Q2 run rate.

[ Approve + Publish ]  [ Edit Draft ]  [ Export Underlying ]  [ Reject ]
```

---

## Escalation rules

Escalate to Head of Partnerships / Finance (no silent publish) if:
- Forecast miss risk > org-configured threshold vs. committed plan.
- A headline metric moves >X% outside its historical band with no identified driver.
- Definition drift detected between two reports of record (numbers no longer tie).
- Data-quality issue large enough to invalidate a report already published to leadership.

---

## Success metrics

- **Forecast accuracy** — rolling forecast vs. actual, by period. Target: within ±X% of actual at the period-close horizon.
- **Question-to-answer latency** — time from a leadership question arriving to a reviewed answer going out. Target: same business day.
- **Data-quality score** — fraction of records passing the current data-quality checks. Target: monotonically improving.
- **Insight adoption in operating reviews** — fraction of agent-drafted explanations that land in the final deck. Target: ≥70%.
- **Definition consistency** — zero unresolved definition drifts open at quarter end.

---

## Failure modes to watch

- **Over-explaining.** Not every metric movement has a story. If the agent constructs a narrative for every wiggle, trust erodes. Gate explanations to moves beyond a confidence threshold.
- **Confident but wrong.** Root-cause hypotheses must be supported by the data, not by pattern-matching alone. Every driver in every report must have underlying records to back it.
- **Stale data.** The Ops Agent is only as good as the CRM and activity syncs. If syncs are behind, emit a blocking warning at the top of every report before any numbers are shown.
- **Explainability debt.** Every number in any report must trace to source rows. If a value can't be explained in one click, it's a bug — not a documentation gap.
- **Definition creep.** Quiet changes to how a metric is computed break trust across the org. The agent must log every definition change and flag the first report that produces a different value than the prior definition would have.
