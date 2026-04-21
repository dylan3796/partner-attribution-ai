# Covant — Investor Pitch Narrative

*Target: YC / accelerator application + 5-minute verbal pitch. Rehearse this top-to-bottom.*

---

## One-sentence thesis

**Channel sales, without the tape.** Covant is the AI-native platform your partner team runs on — built to unlock channel revenue. Configure attribution your way, register deals from the portal, automate commissions and payouts. Works from day one with just your CRM.

---

## Buyer & users

- **Buyer:** Head of Partner Programs (single budget owner).
- **Users:** the whole partner team — partner sales managers, partner managers, partner ops, programs leads.

Single budget, four champions in every account. Each role uses a different surface of Covant: sales managers register and split deals; partner managers run enablement, MDF, and tier progression; ops runs commission rules, payouts, and disputes; programs leads report out to the CRO.

We don't sell an opinion on attribution — every team has one already. We sell the platform that makes whatever attribution they've agreed on actually run, end-to-end.

---

## The 7-beat arc (~5 minutes)

### 1. Why now

Nearbound / ecosystem-led growth is the fastest-rising GTM motion since product-led growth. Three signals converged in the last 24 months:

- Paid-acquisition ROI collapsed (CAC up 60%+ across B2B since 2021).
- Companies-working-with-companies went from sideshow to main revenue channel — partner-sourced pipeline is now 30-40% of revenue for mid-market SaaS.
- Crossbeam, Reveal, and PartnerStack reached $500M+ valuations on a thesis that was fringe five years ago.

The category is real. It's also fragmented and slow — the incumbents were built in 2015.

### 2. The wedge

Setting up a partner program today takes a quarter: pick a PRM, build a commission model in spreadsheets, integrate the CRM, train partners, onboard payouts. Most teams never finish.

**Covant is the platform the partner team runs on — built to unlock channel revenue.** Sales managers close partner deals through it. Partner managers run enablement and tier progression through it. Partner ops runs commissions and payouts through it. The Head of Partner Programs reports out of it.

Connect your CRM, drop in a list of partners, and you have:

- A branded partner portal — free, unlimited seats.
- Deal registration, multi-touch attribution, commission rules, Stripe-ready payouts — **configured your way, not ours.**
- An AI copilot that answers questions about your partner program in plain English.

Time to value: a weekend, not a quarter. One budget owner, four user champions in every account.

### 3. Market

- PartnerStack: ~$500M valuation, ~$50M ARR.
- Impartner + Allbound + Crossbeam + Reveal: ~$2B collectively.
- Ecosystem software TAM: $5B+ and fragmented across four sub-categories — PRM, attribution, account mapping, incentives.

**Covant collapses all four into one platform.** No one else has.

### 4. The moat

Three layers, compounding:

- **Network data.** Cross-org benchmarks improve with every customer. Once we've seen 500 programs, we can tell any prospect *"partners in your vertical drive 22% of deals on average; yours drive 9% — here's why."* Impossible to replicate without scale.
- **Two-sided graph.** Partners log in for free. That creates data — deal registrations, win/loss commentary, partner-submitted leads — that single-sided tools (PartnerStack is vendor-only; Crossbeam is account-mapping-only) never see.
- **AI-native platform.** We don't sell an attribution opinion (every team has their own). We sell the platform that runs whatever attribution the team agreed on — and AI is what makes that economically viable across thousands of partners and deals. The copilot answers questions over real program data. LLMs ingest unstructured signals (emails, calendar, Slack) to suggest touchpoints the team accepts or rejects — augmenting the team's attribution rules, not replacing them. PartnerStack (2015-era) and Impartner are rule-based PRMs; retrofitting AI-native execution is a rewrite.

### 5. Distribution advantage

**The partner portal is a viral loop.** Every partner onboarded to a customer's Covant instance sees Covant branding and infrastructure, then pitches their other 10+ vendors to adopt it. This is the Slack/Notion wedge applied to B2B partnerships — the product's distribution mechanism is baked into the product.

Free for partners. Paid for vendors. Compounding exposure.

### 6. Why AI-native matters here (the hardest-to-copy layer)

Partner attribution has always been rule-based because structured data is sparse — nobody logs every warm intro. That's why attribution today is wrong and contested ("the quarterly argument about who drove what").

LLMs change the math. With Gmail / Calendar / Slack / Gong OAuth, we can infer partner influence from unstructured signals that rule-based systems can't see:

- A partner CC'd on three deal emails → credit.
- A partner on a calendar invite the week before the deal closed → credit.
- A partner name mentioned in a Gong call transcript → credit.

PartnerStack was founded in 2015 on rule-based attribution. Retrofitting this is a rewrite. We're AI-native from day one.

### 7. The ask

[Funding amount, what it unlocks, what the next 12 months ship.]

---

## The Value-per-Input Ladder

*This is the answer to "what if the customer only has opportunities?" Every customer starts at Tier 0 and Covant does useful work at every rung. Each rung doubles as an expansion trigger — this is also the NRR story.*

| Tier | Customer provides | Covant delivers |
| --- | --- | --- |
| 0 | Opportunities only (CSV or CRM) | Deterministic attribution, tier-based commission rules, branded partner portal, Stripe-ready payout file, audit log |
| 1 | + Partner contributions via portal | Deal registration, partner-submitted leads, win/loss commentary, portal-logged touchpoints (solves cold-start from the partner side) |
| 2 | + CRM touchpoint sync (Salesforce / HubSpot) | Multi-touch attribution across 10 touchpoint types; customer-partner relationship graph |
| 3 | + Gmail / Calendar / Slack / Gong | LLM-inferred partner influence from unstructured signals — the AI-native moat |
| 4 | + N other customers on the platform | Cross-org anonymized benchmarks: win rate, time-to-first-deal, commission leakage vs. peers |

**The one-liner for VCs:** *"The floor is already useful. The ceiling is the moat."*

---

## The Unpeeled Layer — what partner software still hasn't done

The category has been defined narrowly: PRM (PartnerStack), attribution (Kademi), account mapping (Crossbeam), incentives (Impartner). Each is a silo. Three primitives that compound are latent in our data model and unbuilt as products:

1. **Account mapping, automatic.** Crossbeam requires both sides to upload lists. We already have your CRM contacts and your partners' CRMs (via deal reg). Compute the overlap automatically. Ship the nearbound pipeline.
2. **Partner-to-partner attribution (co-sell).** When two partners influence the same deal, credit them both — proportionally, auditably. Legacy PRMs are rep-commission-centric and can't model this.
3. **Customer-as-partner / champion tracking.** The customer champion who referred three deals is a partner. Connect them to commission. Gainsight and ChurnZero don't.

---

## FAQ — Brutal Questions, Drafted Answers

### What's the biggest risk?
Data sparsity at the low end of the market. Our answer is the ladder above: Tier-0 customers still get a portal, deterministic attribution, and payouts on opportunities alone. Tiers 1-4 deepen as they integrate CRM, email, and peer benchmarks. The floor is useful; the ceiling is the moat.

### Why you?
Lived the quarterly-argument-about-who-drove-what problem for years before starting the company. Shipped five attribution models, Stripe Connect payouts, Salesforce + HubSpot OAuth, partner health scoring, auto-tier progression, and an AI copilot in [N] months with [team size]. Speed of execution is itself the thesis — this category has been slow-moving for a decade.

### What if Salesforce builds this?
Salesforce tried (Partner Communities). Failed because (a) partners won't log into a vendor-branded portal owned by their customer's CRM; (b) PRM is a wedge, not a CRM feature. Same reason Gong exists next to Salesforce.

### What stops Crossbeam or PartnerStack from building this?
Crossbeam has the graph but no commissions, no payouts, no attribution. PartnerStack is affiliate-commission-centric and architecturally rule-based — AI-native attribution means a rewrite. Both are 7+ years old with legacy customer commitments that make repositioning hard.

### Revenue model?
Per-seat SaaS on the vendor side, tiered by partner count. Free for partners (viral loop). Stripe Connect take rate as secondary revenue. Benchmarking + AI copilot as enterprise upsells.

### Unit economics?
Target LTV:CAC 4:1 at Series A scale. Projected NRR 130%+ driven by Tier 0 → Tier 3 ladder expansion. Partner portal creates inbound leads at near-zero CAC because partners onboarded at one customer see Covant and surface it to their other vendors.

### What happens if a customer only has opportunities?
Tier 0 of the ladder. They get deterministic attribution (deal registration protection, source-wins models), tiered commission rules, a branded portal partners can log into, and a Stripe-ready payout file — all from a CSV of opportunities. That alone replaces a spreadsheet and a quarterly argument. Everything above Tier 0 is an expansion lane.

---

## What we've built (proof of execution)

- Five attribution models (equal split, first touch, last touch, time decay, role-based) — all shipped.
- Commission rule engine with tiered rates, priority ordering, Stripe Connect payouts.
- Salesforce + HubSpot OAuth with automatic deal sync and partner matching.
- Partner portal with deal registration, commission visibility, MDF requests, certifications, leaderboards.
- Partner health scoring with automatic tier progression (Bronze → Platinum).
- AI copilot on Groq Llama + Claude Haiku fallback, querying real org data.
- Modular engine-based pricing, free tier up to 5 partners.

## What we're building next (roadmap signals for investors)

- Account mapping / nearbound overlap detection.
- Cross-org benchmarking.
- Unstructured signal ingestion (Gmail / Calendar / Slack).
- Partner-sourced feedback loops (deal-level win/loss commentary).
