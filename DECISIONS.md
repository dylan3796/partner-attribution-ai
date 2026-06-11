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

**Decision:** Covant sells **partner pipeline and progression** — "the revenue engine for your channel." Headline pitch: *"If you can't hire a channel sales team to integrate partner-driven revenue, use Covant to do just that."*

**Retired framings (do not use as the lead):** "Partner Intelligence Platform," "prove partner ROI," "measure partner impact," "payouts that run themselves," any "analytics/intelligence layer on top of your CRM" language. These survive only as supporting benefits.

**The model:** Attribution visibility is the wedge, not the product. It's parlayed into the partner motion running out of Covant: deals get registered in Covant, progress in Covant, get credited in Covant, and pay out of Covant. Covant replaces "PRM + CRM reports" as the place the partner business lives. Salesforce/HubSpot connectors are plumbing (closed-deal data flows in), never the positioning.

**Guardrail kept:** Covant never moves money. Payouts are calculated, explained, flagged as earned, and routed for the company's approval — never imply otherwise.

**Why:** Channel-driven buyers buy the outcome (pipeline that builds and progresses), not measurement. Mirrors the Monaco playbook — sell the outcome, be the system the motion runs in (see MONACO_ANALYSIS.md).
