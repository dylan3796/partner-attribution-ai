# Pitch-Ready Roadmap

*What to ship before applying to YC, ranked by investor leverage. 4-5 weeks of focused work. The theme: three of the four persona agents shipped end-to-end, two vertical-slice demos, one cross-org network-effect receipt.*

---

## The theme

Every item below exists to support one demo arc: **"You hired a Head of Partnerships. Covant gives them the team."** The demo shows the four persona agents (PSM, PAM, Program, Ops) acting on real data with human-in-the-loop approval. Three ship as functional MVPs; Program Agent ships as a roadmap vignette.

---

## Ranked build list

### 1. PSM Agent — account mapping + warm-intro drafting (the flagship)

**Why it matters for the pitch:** This is the most investor-legible single feature in 2026. Crossbeam reached ~$500M valuation on account mapping alone. We do it automatically (they require both sides to upload lists), then take the next step: the agent drafts the intro the partner receives, waits for human approval, and logs the touchpoint when sent.

**Scope:**
- New `convex/accountMapping.ts` — query that joins `deals` × `partners` × CRM contacts to produce overlap rows.
- New `convex/personaAgents.ts` — extends `AgentRole` in `convex/agents.ts:5-11` with `psm | pam | program | ops`.
- New `convex/agentProposals.ts` — human-in-the-loop approval table (pending / approved / rejected / executed).
- New `app/api/agents/psm/route.ts` — persona-scoped system prompt + scoped data context; reuses Groq → Claude fallback from `app/api/ask/route.ts`.
- New `app/dashboard/agents/page.tsx` with a PSM tab — renders overlap candidates, one-click "draft intro" → proposal card → approve/edit/reject → on approve, sends email and logs touchpoint.
- Landing page: replace the planned single "Account Mapping" engine card with a **four-agent section** (see §3 of `docs/strategy.md`) after the engine cards in `app/page.tsx`.

**Estimate:** 6-8 days. This also builds the shared agent runtime the other three agents reuse.

### 2. Tier-0 "10-minute onboarding" demo path

**Why it matters for the pitch:** Demo-day money shot — visual proof that Covant works from day one with just opportunities. Answers the data-sparsity objection in one live screen.

**Scope:**
- Extend `convex/bulkImport.ts` to accept a CSV of opportunities with partner names and auto-create partners + deals + touchpoints.
- Extend `app/onboard/` with a three-step flow: upload CSV → map columns → preview attribution + payouts.
- Produce a downloadable payout file (CSV + Stripe-ready JSON) at step 3.
- Instrument timing so the demo can claim "under 10 minutes from signup to first payout preview."
- **Agent hook:** as soon as the payout preview lands, the Ops Agent posts its first proposal ("3 deals have attribution mismatch across models — review before export?"). This makes the onboarding *and* the agent value land together.

**Estimate:** 4-6 days.

### 3. Ops Agent — payout reconciliation + dispute flagging

**Why it matters for the pitch:** Lowest-risk agent to ship because the data is already clean and deterministic. Two agents visible in the demo is the difference between "cute AI feature" and "this is how the product works."

**Scope:**
- New `app/api/agents/ops/route.ts` — same runtime as PSM.
- New agent tab at `/dashboard/agents?tab=ops`.
- Tools the Ops Agent has access to: `payouts.ts`, `attributions`, `disputes.ts`, `exports.ts`, `forecasting.ts`.
- Two canned loops:
  - **Pre-payout reconciliation:** before any payout run, the agent cross-checks attribution across all five models and flags any deals where the model choice materially changes who gets paid. Proposes which to use + why.
  - **Dispute early-warning:** when a partner-registered deal closes with attribution that excludes the registering partner, the agent flags it for Ops review before the partner sees the commission statement and complains.

**Estimate:** 3-4 days (most of the runtime work is done in item #1).

### 4. PAM Agent — health watch + weekly digest draft

**Why it matters for the pitch:** Proves the agent pattern isn't just attribution/payments — it extends to relationship ops. Reuses existing `partnerHealth.ts` and `weeklyDigest.ts`.

**Scope:**
- New `app/api/agents/pam/route.ts`.
- Tools: `partnerHealth.ts`, `partnerNotes.ts`, `activityHeatmap.ts`, `weeklyDigest.ts`, `partnerApplications.ts`.
- Two canned loops:
  - **Churn risk flag:** any partner whose health score drops >15 points in a week → proposal with a draft check-in email and a suggested "what changed" summary.
  - **Weekly digest draft:** every Monday, the agent pre-fills `weeklyDigest.ts` with a personalized note per partner; PAM reviews and hits send.

**Estimate:** 2-3 days.

### 5. Program Agent — leakage alert + tier recommendation (vignette, not MVP)

**Why it matters for the pitch:** This one can ship as a single canned vignette — one proposal card that demonstrates the pattern — and still carry the "four agents" story. Full MVP is Year 1 roadmap.

**Scope:**
- New `app/api/agents/program/route.ts` — same shape, minimal toolset.
- One canned demo proposal: *"Commission leakage on Silver-tier partners is 34% vs. 18% for Gold. Proposal: adjust Silver threshold from $50K annual partner revenue to $35K. Expected impact: 8 partners re-tier, leakage drops to ~22%."*
- Writes to `commissionRules.ts` and `tierReviews.ts` are gated behind approval.

**Estimate:** 2 days for the vignette. Budget another 1-2 weeks post-YC to deepen it.

### 6. Cross-org benchmarks v1

**Why it matters for the pitch:** The network-effect receipt. Directly feeds the Program Agent's recommendations ("peers in your vertical see X; you see Y — proposed change: Z"). Today `convex/benchmarks.ts` is per-partner-within-org (see `convex/benchmarks.ts:6-24`).

**Scope:**
- Extend `convex/benchmarks.ts` with `getCrossOrgBenchmarks` that aggregates anonymized medians across organizations.
- Gate behind a minimum-N threshold (N≥10 orgs) for anonymity.
- Surface a teaser strip on the landing page: *"Companies in your vertical see 22% commission leakage on average. Are you one of them?"*
- Surface inside the app as input the Program Agent uses.

**Estimate:** 3-4 days.

### 7. Partner feedback UI

**Why it matters for the pitch:** Proves two-sided data collection. Feeds the PAM Agent's churn-risk model (feedback sentiment = leading indicator).

**Scope:**
- Add a `feedback` field to `deals` (or new `dealFeedback` table for history).
- Add textarea + "Add feedback" button on partner portal deal detail view.
- Surface aggregated feedback on the vendor-side deal view.
- PAM Agent reads feedback in its weekly digest loop.

**Estimate:** 1-2 days.

### 8. Agent demo scripts (replaces generic copilot "wow" queries)

**Why it matters for the pitch:** Scripts the demo. One flagship interaction per agent that a VC sees land in under 15 seconds.

**Scope:**
- PSM: *"Which of our partners already sells to three or more of our open opportunities?"*
- Ops: *"Which deals closing this week have attribution that flips depending on model choice?"*
- PAM: *"Who's the highest-risk partner this week and what should we send them?"*
- Program: *"Where are we leaking the most commission right now and what rule change would stop it?"*
- Each must produce a response or proposal in under 10 seconds on the demo seed.

**Estimate:** 1-2 days.

---

## Explicitly deferred (do not build before applying)

- **MCP integration.** Scaffolded-but-disabled is fine.
- **Gmail / Calendar / Slack / Gong ingestion.** Pitch as Tier 3 of the ladder + "all four agents get sharper" roadmap story.
- **Standalone ecosystem benchmarking product.** Year 2.
- **AI-suggested warm intros across customers' partner graphs.** Year 2.
- **Program Agent full MVP** (beyond the vignette). Post-YC.
- **Cross-agent orchestration / agent-to-agent messaging.** The shared runtime is there; the interactions stay manual-triggered for now.

Rationale: investor conviction comes from *three agents visible in the demo* + *one vignette* + *a ladder that says the rest comes as more data arrives*. Shipping all four fully is not the winning configuration — shipping three convincingly is.

---

## Execution order

| Week | Build |
| --- | --- |
| 1 | #7 (partner feedback UI) + #8 (agent demo scripts scaffolded) — warmup + unblock demo prep in parallel. |
| 2 | #1 (PSM Agent + shared agent runtime) — riskiest and highest-leverage. Do it with headroom. |
| 3 | #2 (Tier-0 onboarding) + #3 (Ops Agent — reuses #1's runtime) in parallel. |
| 4 | #4 (PAM Agent) + #5 (Program Agent vignette) + #6 (cross-org benchmarks). |
| 5 | Polish, record the demo video, sync docs with what actually shipped. |

Ship the demo video + this doc + `docs/pitch.md` + `docs/yc-application.md` + `docs/vision.md` as the application packet.
