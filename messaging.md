# messaging.md — Covant landing page copy spec

> **Step 1 deliverable. GATE: approve the hero line + the 6 section headlines before design.**
> This is a **MERGE** against the live `app/page.tsx`, not a blank-slate rewrite.
> Default is **keep**. Every rewrite of a working line is shown before/after.
> No page code here.

---

## 0. Reconciliation notes (read before approving)

- **Category = Partner Intelligence, anchored on the Channel Graph.** Per the
  messaging prompt, Covant is **NOT "PRM with AI."** The in-repo
  `PRODUCT_VISION.md` / `GTM_STRATEGY.md` / `PITCH_DECK.md` still frame Covant as
  "the partner hub" (a PRM/commissions/payouts replacement). That older framing
  was used for **substance only** (mechanism, ICP, the TAM idea) — **not** for
  the category. Flagging so the contradiction is a conscious choice, not drift.
- **Banned in the hero:** inward/mission phrasing and the literal phrase
  "intelligence layer." **Banned everywhere:** seamless, powerful, revolutionary,
  supercharge, "unlock" (verb), emoji, adjective stacking.
- **Zero fabricated proof.** No customer names, logos, testimonials, or invented
  metrics. See the proof flag in §4.
- **Two-sided beat is protected (R4).** Journeys/Portal fold away as headline
  sections; the partner-controlled, scoped-slice story is carried in Section 6
  and must survive the build.

---

## 1. Hero line — 5 options, ranked

Customer-outcome led. None use banned phrasing.

| # | Option | Why it works |
|---|--------|--------------|
| **1 (rec.)** | **Run your partner org on one graph.** | **KEEP** (live line). Declarative, system-does-the-work, "one graph" is the wedge. Lowest risk, already earned. The outcome is *you run the whole org on it.* |
| 2 | **Know who drives your channel — and what to do next.** | Pure outcome: knowing + the next move. Captures attribution **and** recommend in one breath. Sharpest "their win" line. |
| 3 | **Your whole channel, finally legible.** | Editorial, confident, monaco-cadence. Outcome = legibility. Slight risk: "legible" is a notch abstract. |
| 4 | **See the channel. Put the right partner on every deal.** | Concrete dual outcome. Risk: two clauses, longer in display type. |
| 5 | **The graph runs your channel. You run the graph.** | Echoes the monaco "does the X, you do the Y" cadence. Memorable; risk: a touch clever/inward. |

**Recommendation:** keep **#1** as the hero; it's strong and already live. If you
want to lead harder on the customer's *win* rather than the mechanism, **#2** is
the upgrade. Pick one to lock the gate.

> **MERGE note (hero):** live line kept verbatim as option 1 — not silently
> replaced. Any change is your call at the gate.

---

## 2. Subhead — names the mechanism (data in → graph → many jobs)

**Recommended (rewrite of live lead):**
> Covant reads your partner data — CRM, email, Slack, notes — and builds the
> Channel Graph: one model your team reports on, plans with, and asks.

**Before/after (MERGE — this is a rewrite, flagged):**
- **Before (live):** "Covant turns your partner data into the Channel Graph — a
  semantic layer your whole org runs on."
- **After (above):** names the inputs, the graph, and the *jobs* (report / plan /
  ask) in plain terms instead of leaning on "semantic layer."
- *Keep-option:* if you prefer the live line, it's compliant — your call.

---

## 3. The 6-section spine

Order is fixed: **Connect → Graph forms → Channel TAM → Attribution → Plan &
recommend → Ask.** Each section: declarative headline (the graph or the outcome
is the grammatical subject), one body sentence, three ≤8-word capability bullets.

### Section 1 — Connect everything
**Headline:** Every source you already have feeds one graph.
**Body:** Covant reads your CRM, email, Slack, notes, and spreadsheets —
structured or not — and connects what it finds instead of filing it.
**Bullets:**
- CRM, email, Slack, notes, spreadsheets
- Structured or not — every field is signal
- Connected into a graph, not a dashboard

### Section 2 — The Channel Graph forms (the asset)
**Headline:** Covant infers the context. The graph is yours to keep.
**Body:** Covant writes down what your data means — who partners with whom, who
drives what — and you refine it; the graph sharpens and compounds.
**Bullets:**
- Covant infers the context; you refine
- A durable asset, not a report
- Every correction makes it sharper

### Section 3 — Channel TAM  *(NEW — no equivalent on the live page)*
**Headline:** The partners you're missing surface themselves.
**Body:** The graph maps who fits your ecosystem, flags who you're missing, and
reads M&A, consolidation, and new-practice signals so you recruit at the moment
it matters.
**Bullets:**
- Who fits, and who you're missing
- M&A, consolidation, new-practice signals
- Recruit by vertical and geography

### Section 4 — Attribution
**Headline:** Your attribution arrives proposed, with the records attached.
**Body:** Covant proposes who sourced and who influenced each deal — evidence
attached — and you approve or adjust; your corrections train the graph.
**Bullets:**
- Sourced and influenced, proposed for you
- Every claim cites its records
- You approve; corrections train the graph

> **Required framing (met):** Covant *infers and proposes* sourced + influenced
> with the evidence; the vendor *approves or adjusts*; corrections train the
> graph. It does **not** decide unilaterally, and it does **not** just accept
> whatever the customer asserts.
> *Optional kicker (KEEP from live):* "Attribution, not a dashboard." works as a
> section eyebrow above this headline.

### Section 5 — Plan & recommend
**Headline:** From the next deal to next year's plan.  *(KEEP — live headline)*
**Body:** The graph names the best-fit partner for a live deal and grounds your
tiers, territories, quotas, and investment — and Partner Finder surfaces who to
recruit next.
**Bullets:**
- The right partner on a live deal
- Tiers, territories, quota, investment
- Partner Finder surfaces who's next

### Section 6 — Ask Covant  *(carries the two-sided beat — R4)*
**Headline:** Ask in plain language. Both sides get the answer.
**Body:** Ask and the answer comes back with the records attached; Covant ships
as MCP servers for Claude and OpenAI, and each partner sees only their scoped
slice — they control what you can ask.
**Bullets:**
- Plain-language answers, records attached
- Ships as MCP for Claude and OpenAI
- Partners control their scoped slice

> *Optional kicker (KEEP from live):* "Ask. Don't dig." works as the eyebrow.
> **R4 guardrail for Step 4:** if folding the Portal away makes the page read
> vendor-only, restore a short partner-view beat (source copy preserved in §5
> diff below).

---

## 4. Proof flag — resolve before Step 4 (R1)

The live page runs a **stakes** section with three stats —
**42% / 35% / 69%**, cited to *"PartnerStack & Wynter, The State of Partnerships
in GTM 2026."* The new 6-spine has **no stakes section**, and these specific
figures **do not appear in any in-repo doc**. The repo docs cite *different*
numbers (e.g. pitch deck: 73% misattribution, 62% partner distrust, 69%
increasing PRM investment per Forrester Q4 2025; $1.3T through partner channels).

**Recommendation:**
- **CUT the standalone stakes-stats section** from the homepage (it's outside the
  spine and its provenance can't be confirmed in-repo).
- If you want a problem beat, fold a **non-numeric** problem line into the hero
  area or Section 1 (e.g. "Your channel is real revenue you can't yet see.").
- Only restore a numeric stat if you can point me to the real, nameable source;
  then it stays **with citation**. Otherwise it stays cut (zero fabricated proof).

**Integration names (Salesforce/HubSpot):** keep only as a factual capability
line inside Section 1 body ("CRM" wording), **not** as a logo/"trusted by" strip.
The live "Builds from the stack you already have" strip is **CUT** as a strip.

---

## 5. MERGE diff — kept / new / cut (vs live `app/page.tsx`)

**KEEP (verbatim or near):**
- Hero line "Run your partner org on one graph." (hero option 1)
- "From the next deal to next year's plan." → Section 5 headline
- "Attribution, not a dashboard." → Section 4 eyebrow (optional)
- "Ask. Don't dig." → Section 6 eyebrow (optional)
- Recommendation/Portal/Start card copy → mined for §3 bullets

**REWRITE (before/after shown):**
- Hero subhead/lead → §2 (before/after above)

**NEW:**
- Section 3 — Channel TAM (whole section; no live equivalent)
- Section 6 two-sided line — explicit partner-controlled scoped-slice framing

**CUT (with reason):**
- Stakes-stats section (42/35/69%) — outside spine + unverified provenance (§4)
- "Builds from the stack you already have" integration strip — reads as a trust
  strip; folded to a capability line in §1
- **Section 04 Journeys** ("You set the milestones. Covant runs them.") — folded
  away per the 6-spine *(source copy preserved here in case R4 needs it)*
- **Section 05 Portal** ("A portal partners actually open.") — folded into the
  Section 6 two-sided beat *(preserved here for the R4 fallback)*
- "07 — How it starts" — not in the 6-spine; recommend folding into the closing
  CTA rather than a numbered section *(your call at Step 4)*

---

## 6. Voice check

Declarative, short sentences, the-system-does-the-work. Modeled on monaco's
cadence ("Monaco does the updating, you do the selling"), not its words.
Confirmed absent: seamless, powerful, revolutionary, supercharge, "unlock"
(verb), emoji, adjective stacking, fabricated proof.

---

**GATE:** approve (a) the **hero line** and (b) the **6 section headlines** —
or redline them — before we move to Step 2 (design system).
