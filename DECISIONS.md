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
