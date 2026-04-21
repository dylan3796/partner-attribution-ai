# Pitch-Ready Roadmap

*What to ship before applying to YC, ranked by investor leverage. 2-4 weeks of focused work.*

---

## Ranked build list

### 1. Account mapping / overlap detection (the nearbound wedge)

**Why it matters for the pitch:** This is the single most investor-legible feature in 2026. Crossbeam reached a $500M valuation on this thesis. We already have the data — our `deals` table stores CRM contacts, our `partners` table stores partner orgs, our CRM connections sync both. We just haven't shipped the view.

**Scope:**
- New `convex/accountMapping.ts` — query that joins `deals` × `partners` × CRM contacts to produce overlap rows ("Partner X sells to 12 of your open opportunities").
- New `app/dashboard/overlap/page.tsx` — a dashboard view listing overlaps with partner name, account name, deal stage, and a "request warm intro" CTA that logs a touchpoint.
- Add an **Account Mapping** engine card on the landing page (`app/page.tsx`, after the Attribution Engine card at ~line 123) once it's live.

**Estimate:** 3-5 days.

### 2. Tier-0 "10-minute onboarding" demo path

**Why it matters for the pitch:** This is the demo-day money shot — the visual proof that Covant works from day one with just opportunities. Also proves the time-to-value wedge.

**Scope:**
- Extend `convex/bulkImport.ts` (already exists) to accept a CSV of opportunities with partner names and auto-create partners + deals + touchpoints.
- Extend `app/onboard/` with a three-step flow: upload CSV → map columns → preview attribution + payouts.
- Produce a downloadable payout file (CSV + Stripe-ready JSON) at step 3.
- Instrument timing so the demo can claim "under 10 minutes from signup to first payout preview."

**Estimate:** 4-6 days.

### 3. Cross-org benchmarks v1

**Why it matters for the pitch:** The network-effect receipt. Something a VC can see working and say "this gets better the more customers you have." Today `convex/benchmarks.ts` is per-partner-within-org (see `convex/benchmarks.ts:6-24`) — the data model supports cross-org rollups, we just haven't built them.

**Scope:**
- Extend `convex/benchmarks.ts` with a new `getCrossOrgBenchmarks` query that aggregates anonymized medians across organizations (win rate, avg commission rate, time-to-first-deal, commission leakage rate).
- Gate behind a minimum-N threshold (e.g., N≥10 orgs) to protect anonymity.
- Surface a teaser strip on the landing page: *"Companies in your vertical see 22% commission leakage on average. Are you one of them?"*
- Surface inside the app as a "Benchmarks" sidebar on the dashboard.

**Estimate:** 3-4 days.

### 4. Partner feedback UI

**Why it matters for the pitch:** Proves two-sided data collection — a concrete example of the "partner side of the graph is a free data source" argument in the pitch. Low effort, high signal.

**Scope:**
- Add a `feedback` field to `deals` (or a new `dealFeedback` table if we want history) in `convex/schema.ts`.
- Add a textarea + "Add feedback" button on the partner portal deal detail view in `app/portal/*`.
- Surface aggregated feedback on the vendor-side deal view in `app/dashboard/deals/*`.

**Estimate:** 1-2 days.

### 5. AI copilot "wow" queries

**Why it matters for the pitch:** Scripts the demo. The copilot is already shipped — we just need to make sure the specific queries a VC will see land hard.

**Scope:**
- Seed 2-3 pre-loaded queries in the copilot UI as chips: *"Which deals this quarter are we under-crediting partners on?"*, *"Which partners are underperforming their tier benchmark?"*, *"What's our commission leakage rate vs. industry median?"*.
- Validate each query produces a response that references real data from the demo seed in under 10 seconds.
- Fix any prompts in `app/api/ask/route.ts` where the model hedges or wanders.

**Estimate:** 1-2 days.

---

## Explicitly deferred (do not build before applying)

- **MCP integration.** Scaffolded-but-disabled is fine — doesn't move investor-legible metrics.
- **Gmail / Calendar / Slack / Gong ingestion.** This is the AI-native moat vision. Pitch it as "Year 1 roadmap" with a clear architectural path. Building it pre-funding burns time better spent on demo polish.
- **Standalone ecosystem benchmarking product.** Vision-level, Year 2.
- **AI-suggested warm intros from partner graph.** Same — vision-level.

Rationale: investor conviction comes from the ladder (floor + moat) being believable, not from every rung being shipped. Tiers 0-2 working today + Tier 3-4 on a roadmap is the winning configuration.

---

## Execution order

Week 1: #4 (feedback UI) + #5 (copilot queries) — low-risk warmup, builds confidence.
Week 2: #2 (Tier-0 onboarding) — riskiest UX work; do it with headroom.
Week 3: #1 (account mapping) — highest-leverage demo feature; ship with polish.
Week 4: #3 (cross-org benchmarks) + cut a demo video walking through all five.

Ship the demo video + this doc + `docs/pitch.md` + `docs/yc-application.md` as the application packet.
