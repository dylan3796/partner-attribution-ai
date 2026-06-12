# DECISIONS.md — Covant Key Decisions & Positioning

*Running log of decisions, positioning choices, and strategic calls. Future agents: read this before acting.*

---

## 2026-03-09 — Crossbeam Competitive Positioning

**Question:** How do we position against Crossbeam?

**Decision:** Crossbeam = pre-deal intelligence (account mapping, co-sell discovery). Covant = post-deal operations (attribution, commissions, payouts, partner portal). They're complementary, not directly competitive.

**Overlap acknowledged:** Deal registration, partner analytics, Salesforce integration, co-sell tracking all bleed between the two. The middle (deal registration + "which partner influenced this?") is where the real competitive tension lives.

**Talking point for prospects who already have Crossbeam:**
> "Great — Crossbeam tells you about the opportunity. We track whether your partner actually drove it and make sure they get paid correctly. Most teams using Crossbeam still have commission disputes and spreadsheet payouts."

**Why this matters:** Don't pitch against Crossbeam — pitch as the next layer. Crossbeam users are already invested in partner data, which makes them warm prospects, not blockers.

---

## 2026-02-18 — Product Rebrand: PartnerBase → Covant

**Decision:** Rename to Covant. Domain: covant.ai + covant.app.

**Positioning:** Partner Intelligence Platform — "the rules engine that sits between 'someone did something' and 'someone gets paid.'" Think Stripe for partner economics.

**Why:** "PartnerBase" sounds like a feature. "Covant" sounds like a company. Category we're defining: nobody owns it yet.

---

## 2026-02-17 — Backend Persistence First

**Decision:** No more demo-mode features. Every feature must persist to Convex backend.

**Why:** All beta reviewers (Sarah, Marcus, Elena) flagged "no real data" as #1 blocker. Eight hours polishing a demo with no working backend was wasted.

**Rule:** If it doesn't write to Convex, don't ship it.

---

## 2026-02-09 — Model Routing

**Decision:** Opus for code/building. Sonnet for conversation/quick checks. Auto-route, never announce.

**Why:** Sonnet is fast and cheap for chat. Opus for production code is non-negotiable quality bar.

---

---

## 2026-03-09 — Modern vs Legacy PRM Positioning

**Decision:** Covant competes with legacy PRM tools but NEVER names them directly.

**Framing:** "Built for modern partner programs" — legacy tools were built for a different era. The real competition is spreadsheets + outdated tooling, not named vendors.

**Crossbeam:** Complementary (pre-deal intelligence), not a competitor. Never position against them.

**Phrases to use:** "modern partner programs", "built for how programs work today", "the old way", "partner programs have outgrown the old tools"
**Phrases to avoid:** Any competitor names, "better than X", "replaces X"

**Why:** Naming competitors slots you into their category and picks a fight with companies 100x our size. Let the positioning do the work — VPs already know exactly who we're talking about.

---

## 2026-06-11 — Repositioning: Partner Pipeline & Progression

> **Partially superseded by the 2026-06-12 entry below:** the "deals get registered, progress, and get credited in Covant" lifecycle line and the "revenue engine for your channel" tagline are retired. The wedge model, retired framings, and both guardrails still stand.

**Decision:** Covant sells **partner pipeline and progression** — "the revenue engine for your channel." Headline pitch: *"The revenue engine for your channel — partner deals get registered, progress, and get credited in one system, every commission calculated and explained."*

**Retired framings (do not use as the lead):** "Partner Intelligence Platform," "prove partner ROI," "measure partner impact," "payouts that run themselves," any "analytics/intelligence layer on top of your CRM" language. These survive only as supporting benefits.

**The model:** Attribution visibility is the wedge, not the product. It's parlayed into the partner motion running out of Covant: deals get registered in Covant, progress in Covant, and get credited in Covant — every commission calculated, approved, and explained. Covant replaces "PRM + CRM reports" as the place the partner business lives. Salesforce/HubSpot connectors are plumbing (closed-deal data flows in), never the positioning.

**Guardrail — money:** Covant never moves money and never facilitates payments. Payouts are calculated, explained, flagged as earned, and routed for the company's approval; the company pays through its own rails. Never write "pay out of Covant" or imply funds flow through us.

**Guardrail — hiring:** Don't pitch Covant as a substitute for hiring ("without hiring a channel sales team," "the team you don't have to hire," "without headcount"). We sell the system the partner pipeline runs in — the customer's team and partners stay the sellers.

**Why:** Channel-driven buyers buy the outcome (pipeline that builds and progresses), not measurement. Mirrors the Monaco playbook — sell the outcome, be the system the motion runs in (see MONACO_ANALYSIS.md).

---

## 2026-06-12 — Correction: Covant is the partner hub; deals live in the CRM

**Decision:** Covant is **the partner hub** — an overlay alongside the customer's CRM, not a system of record for deals. Headline pitch: *"The partner hub — bring every partner along for the whole journey."*

**The model:** The partner team is an overlay team, and Covant is its hub. Partners register deals in Covant and they **flow into the customer's CRM** (alongside any other data the customer lets partners add); the deals live and move in the CRM. The hub is where both sides check partner revenue, the partner program, partner incentives, and partner next best actions — one shared place that brings the partner along for the whole journey.

**Guardrail — deals:** Never claim deals live, progress, run, or close in Covant. Covant's verbs: register (flows to the CRM), log, track, credit, calculate, explain, recommend. Note Monaco's system-of-record ambition is explicitly NOT part of our playbook (see MONACO_ANALYSIS.md).

**Why:** It's the truth of the product (the dashboard settings page has said "your CRM stays your system of record" all along), and it sells better: buyers don't want a second deal database — they want their partners inside the journey they already run.
