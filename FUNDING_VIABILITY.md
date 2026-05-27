# Funding Viability — Working Memo

> An honest, internal read on where Covant sits today and what it would take to press it toward funding. Written for the founder, not for investors. Cross-references `PITCH_DECK.md`, `GTM_STRATEGY.md`, `BATTLE_CARD.md`, `README.md`.

---

## Where we are — snapshot

| Dimension | State | Notes |
|---|---|---|
| Live product | ✅ | Vercel-deployed, Convex + Clerk + Next.js 16 |
| Codebase | ✅ | ~355 TS/TSX files, ~12K LOC in `/convex`, 73 backend modules |
| Core features | ✅ | 5-model attribution engine, commission rules, deal reg, payouts, reconciliation, partner portal |
| Tests / CI | ⚠️ | One Vitest file (attribution math); no GitHub Actions gating |
| CRM connectors | ❌ | Salesforce/HubSpot OAuth coded, **not activated** — README promises them |
| Email | ❌ | Resend wired, awaiting API key |
| Enterprise (SOC 2, SSO, RBAC) | ❌ | Not built; SOC 2 targeted Q2 2026 |
| Pitch / GTM / battle card | ✅ | All exist and are detailed |
| **Customers / ARR / pilots / LOIs** | ❌ | **Zero. `COMPANY_REVIEWS.md` contains fictional reviews — credibility risk if shown to an investor.** |
| Recent dev focus | ⚠️ | Last ~30 commits are marketing/positioning/YC prep; last substantive backend feature shipped 2026-04-08 |

---

## Can it be pressed beyond customers?

**Yes, but not at every door.**

Paths that **don't** require traction:

1. **Angel round ($25K–$200K checks).** Angels bet on people + product progress. Covant has both. Realistic without a single customer if founder pedigree supports it.
2. **YC / Techstars / accelerator.** Commits show YC prep is already underway. YC funds pre-revenue regularly when the pitch, product, and founder clarity are strong. The fictional `COMPANY_REVIEWS.md` must be deleted before any application.
3. **Strategic / partner-led wedge.** Pitch a CRM (HubSpot for Startups, Pipedrive, Close) or a PRM-adjacent player on being their attribution layer. A strategic relationship → first customers → funding, in that order.
4. **Grants / non-dilutive.** Less common in this category but possible (e.g., AI-related programs given the Claude/OpenAI stack).

Paths that **won't** open without customers:

- Tier-1 VC seed ($1.5M+) — they will ask for design partners on the first call.
- Series A — completely off the table.

---

## Is the pitch there?

Read `PITCH_DECK.md` directly. Verdict: **the outline is there, the substance isn't.** ~70% of a fundable deck.

**What works:**

- 12 slides hit the right boxes (Problem → Market → Solution → Demo → How it works → Business model → Competition → Traction → Team → Ask → Vision).
- Problem framing ($1.3T flowing through partner channels, 73% on last-touch, 62% partner distrust) is sharp and cite-able.
- Market sizing uses TAM/SAM/SOM with credible sources (Grand View, Forrester).
- Pricing/unit-economics slide is grounded (blended ACV $12K, 80% GM, 120% NRR, <12mo CAC payback) — investor-literate.
- "Attribution as foundation, not feature" is a real positioning wedge — most PRMs *did* bolt it on.
- Use-of-funds and 18-month milestone framework are reasonable.

**What kills it as-is:**

1. **Slide 1 still says `[Product Name]`. Slide 10 (Team) is entirely placeholders** — `[Founder/CEO Name]`, `[Brief bio]`, `[Personal story]`. **The Team slide is the single most weighted slide at seed.** A deck with template variables cannot be sent.
2. **Slide 9 (Traction) is empty** — `[X] companies on waitlist`, `[Quote from design partner]`. Second-most-weighted slide. Same problem.
3. **Overclaims vs. code reality** — Slide 9 says "Built: 7 attribution models including ML-weighted." Code has 5 deterministic models, no ML-weighted one. Any technical DD call uncovers this in 10 minutes.
4. **"AI-native" is doing a lot of work.** Under the hood: 5 weighted attribution models + Claude/OpenAI SDKs wired in. Strong product, but the "AI moat" framing is thin until there's a model actually trained on customer attribution outcomes.
5. **Slide 9 lists Salesforce/HubSpot as "Building Now (Next 90 Days)"** — but they've been in that bucket since Q1 per the commit log. A repeat read across two months will notice.
6. **Founder credibility is the unknown.** The deck's most powerful possible line sits in speaker notes as a TODO: *"I lived this problem as a partnership leader at [Company]."* If that's true, the pitch tightens dramatically. If not, the deck needs a different angle (technical founder + advisor with industry weight).

**Priority deck fixes:**

- Fill the Team slide (name, bio, why-this-problem).
- Replace Traction placeholders with real numbers (even "12 demo requests from outbound" beats `[X]`).
- Align "Built today" with what's actually in `/convex`.
- Drop the ML-weighted-model claim until it exists, or build it.
- Tighten "AI" language — say what's deterministic and what's learned.

---

## Honest competitive read

The PRM market is crowded (Impartner, Allbound, PartnerStack, Crossbeam, Salesforce PRM) with 10+ year incumbents. The "AI-native attribution engine" framing is a real wedge, but the moat is thin until either (a) the integration depth is real or (b) a customer base proves the AI angle is differentiated in practice. Neither exists yet.

---

## The stronger angle: headless attribution + LLM monitoring + standardized partner exports

The current pitch positions Covant as **"another PRM, but AI-native."** That's a head-on collision with Impartner ($85M+ raised), PartnerStack ($38M), Impact.com ($376M) — incumbents with 10-year head starts and entrenched buyers. It's a hard story to fund without traction because every investor's first question is "why won't Impartner just add this?"

A sharper reframing — and one the existing codebase is already 70% set up to deliver:

> **Covant is the headless attribution data layer for the partnership economy. We compute multi-touch partner attribution on your CRM data and emit a standardized dataset that you share with your partners. An LLM agent watches the dataset 24/7 and flags drift, missing partners, commission anomalies, and at-risk relationships — no dashboard required.**

### Why this is more fundable than "we're a better PRM"

| Dimension | PRM framing | Headless / LLM framing |
|---|---|---|
| Competitive density | Crowded (Impartner, PartnerStack, Allbound, Impact, Crossbeam) | Empty — no one is doing this |
| Moat story | "Better UX" (weak) | Standardized data schema = network-effect candidate (like Crossbeam for overlap, but for attribution) |
| AI claim credibility | "AI-native" while shipping deterministic models = thin | LLM agent doing real monitoring work = demonstrable |
| Integration story | "We replace your PRM" (hard sell — switching cost) | "We sit beneath your PRM and feed it cleaner data" (easy sell — no rip-and-replace) |
| Who funds it | Vertical SaaS VCs (want traction first) | AI-native VCs, data-infra VCs, dev-tool angels (will fund on vision + product) |
| Buyer | VP Partnerships (committee sale, long cycle) | Data / RevOps team (faster, technical buyer) |
| Pricing | Per-seat SaaS ($299–$799/mo) | Usage-based on events/partners + premium for the agent (e.g., $0.10/event, $50/partner/mo) |
| What's needed to demo | Working portal, polished UX | A clean data spec + a working agent loop + one CRM connector |

### What this means for the product

**Keep:** the attribution engine (`/convex`), the 5 attribution models, the deal-registration logic, the commission rules engine. These become the *compute layer* of the headless service.

**De-emphasize (not delete):** the partner portal UI and marketing site polish. They move from "the product" to "a reference UI" — useful for demos, not the sale.

**Add three things to make the reframe real:**

1. **A published, versioned data schema** for partner attribution events (the "Covant Attribution Schema" or similar). Markdown spec + JSON Schema + example payloads in `/schema`. This is the standardization play and the moat.
2. **Export targets** — write the standardized dataset to Snowflake, BigQuery, S3/Iceberg, Postgres, or a signed webhook. Partners pull it; you don't host their dashboards.
3. **The monitoring agent loop** — a Convex cron that runs Claude over the latest attribution events, with tool access to query the data and post structured alerts (Slack/email/webhook): *"Acme Partners' Q2 attributed revenue dropped 38% vs. Q1 with no deal-stage changes — likely a tracking gap."* This is the *actual* AI work; everything else has been calling deterministic math "AI."

The Claude SDK is already in `package.json`. The agent loop is a 1–2 week build on top of what exists, not a rewrite.

### What this does to the pitch

The deck restructures around three slides instead of twelve:

1. **The problem:** partner attribution data is everyone's blind spot, and no one ships a clean dataset between vendor and partner.
2. **The product:** one attribution engine, one schema, one agent. Headless. Pluggable. Show the JSON, show the Slack alert, show the partner pulling it into their warehouse.
3. **The wedge:** sell to RevOps/Data teams (faster cycle, technical buyer) at $X/event + $Y/partner/mo. Land via a single CRM connector. Expand into PRM territory only after the data layer is sticky.

This pitch is sendable to AI-infra and dev-tool investors *today* — without customers — because the bet is "the schema becomes the standard," not "we'll out-execute Impartner." Investors fund schema-becomes-standard plays at seed regularly (Segment for events, dbt for transforms, Crossbeam for overlap).

### Honest risks of the reframe

- **You're betting on a category that doesn't exist yet.** Real fundraising risk in a mixed 2026 market. You'd need to evangelize the category in parallel with selling the product.
- **Standardization plays only matter if the standard is adopted.** Need 2–3 design-partner CRM vendors or partner programs to publicly endorse the schema in year one, or it stays a private API.
- **The agent has to be good.** A monitoring agent that cries wolf or misses real drift kills the pitch. Worth ~2 months of supervised tuning against real data before publicizing it.
- **`PITCH_DECK.md`, `GTM_STRATEGY.md`, `BATTLE_CARD.md` all assume the PRM framing.** They need rewriting, not editing. The codebase architecture is fine — only positioning and a few new modules (schema, exports, agent loop) need work.

---

## What presses the case forward fastest (next 90 days)

Ranked by leverage, assuming the headless / LLM reframe:

1. **Publish v0 of the Covant Attribution Schema** as a markdown spec + JSON Schema in `/schema` with example payloads. The single most defensible artifact you can ship in a week.
2. **Build the agent monitoring loop** — Convex cron + Claude with tool access over attribution events, posting to a Slack webhook. End-to-end demo in 2 weeks.
3. **Ship one export target** — pick Postgres or signed webhook (easier than warehouse connectors) so a partner can actually consume the dataset.
4. **Ship Salesforce OAuth end-to-end** — still the #1 integration gap. Without one real CRM source, the schema has nothing to populate.
5. **Delete `COMPANY_REVIEWS.md`** (fictional reviews) and scrub the ML-weighted-model claim from `PITCH_DECK.md` and `README.md`. Both are credibility landmines in DD.
6. **Find 1–2 design-partner RevOps teams** (easier sell than VP Partnerships) — give them the schema + agent for free in exchange for a public quote.
7. **Rewrite the pitch deck** around the three-slide reframe; fill the Team slide with a real bio + founder story.
8. **Apply to YC (next batch)** with the reframed pitch — the AI-agent + standardization angle fits YC's current taste better than another PRM.
9. **Defer**: SOC 2, SSO, SAML, the polished partner portal UI, Resend onboarding emails. None of these unlock funding under the new framing.

---

## TL;DR

- Product is real and substantial; the gap to a fundable round is **positioning + credibility hygiene + one or two design partners**, not more code.
- The current "AI-native PRM" framing is fundable only with traction. **Reframing as the headless attribution data layer with an LLM monitoring agent + standardized partner exports** opens AI-infra and dev-tool investors who fund seed on vision.
- Highest-leverage next steps are non-code: publish a schema spec, ship the agent loop, delete the fictional reviews, and rewrite the deck around the three-slide reframe.
