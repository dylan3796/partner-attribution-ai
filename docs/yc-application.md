# Covant — YC Application Draft

*Draft answers to the standard YC long-form questions. Edit for voice, specificity, and recent metrics before submitting. These pull from `docs/pitch.md`.*

---

## Company

### Describe what your company does in 50 characters or less.
Agents that run your partner program.

### What is your company going to make?
Covant is the AI-native platform the partner team runs on. It ships with four persona agents — Partner Sales, Partner Account, Program, and Ops — that do the work of a partner team our customers haven't fully hired yet. Every agent is human-in-the-loop: it proposes an action, a human approves, the system executes and logs. Single budget owner (Head of Partnerships), four user champions in every account, one agent per seat.

The wedge: setting up a partner program today takes a quarter — pick a PRM, build commission rules in spreadsheets, integrate the CRM, train partners, onboard payouts. Most teams never finish, and the ones that do operate with 1-3 people trying to do the work of 15. Covant collapses setup into a weekend and closes the headcount gap with agents:

- **PSM Agent** finds co-sell overlap across open deals and drafts the warm intro.
- **PAM Agent** watches partner health, flags churn risk, and writes the weekly check-in.
- **Program Agent** spots commission leakage before payout day and proposes tier-rule changes.
- **Ops Agent** reconciles attribution, flags disputes, and produces the payout file.

We don't sell an opinion on attribution — every partner team has one already, and they're all different. We sell the platform that makes whatever attribution the team agreed on actually run end-to-end, operated by agents that never miss a deal. The portal is also our distribution mechanism — every partner onboarded sees Covant and surfaces it to their other 10+ vendors.

### Where do you live now, and where would the company be based after YC?
[Location now] → [SF or wherever post-YC].

---

## Progress

### How far along are you?
Shipped MVP with paying-customer-ready scope:
- Five attribution models (equal, first-touch, last-touch, time-decay, role-based).
- Commission rule engine with tiered rates, priority ordering, Stripe Connect payouts.
- Salesforce + HubSpot OAuth with automatic deal sync and partner matching.
- Partner portal: deal registration, commission visibility, MDF requests, certifications, leaderboards, notifications.
- Partner health scoring with automatic tier progression (Bronze → Platinum).
- AI copilot (Groq Llama + Claude Haiku fallback) answering natural-language questions over org data.
- Modular engine-based pricing; free tier up to 5 partners.

### How long have each of you been working on this?
[Founder months since start].

### Do you have revenue? How much?
[Current MRR / ARR / design partner count]. [Names if permitted].

### If you're launched, what is your monthly growth rate?
[%].

---

## Idea

### Why did you pick this idea to work on?
I started in partnerships years ago, bullish that companies-working-with-companies would become the next main revenue channel. That has now materialized — nearbound / ecosystem-led growth is the fastest-rising GTM motion since PLG, paid-ad ROI collapsed, and partner-sourced pipeline is now 30-40% of revenue for mid-market SaaS. But the software hasn't caught up. The category is fragmented (PRM, attribution, account mapping, incentives are four separate products), the incumbents were built in 2015 on rule-based architectures that are structurally wrong about multi-touch, and setting up a partner program still takes a quarter. I've lived the quarterly-argument-about-who-drove-what problem from the inside; I know exactly where the spreadsheets break.

### What's new about what you're making?
Four things:
1. **Agent-native product surface.** Four persona agents (Partner Sales, Partner Account, Program, Ops) built into the platform, each with a scoped toolset and a human-in-the-loop approval layer. The UI primitive isn't a dashboard — it's an agent inbox. PartnerStack ships a rules engine; we ship four coworkers.
2. **AI-native attribution.** Legacy PRMs are rule-based because structured partner data is sparse. LLMs can read emails, calendar invites, Slack threads, and call transcripts to infer partner influence from unstructured signals — capability the 2015-era incumbents architecturally cannot retrofit on top of their rules engines.
3. **Collapsed category.** PRM + attribution + account mapping + incentives in one platform. No one else has.
4. **Two-sided by default.** Free partner portal creates a data source (and viral distribution) the single-sided tools never see.

### Who are your competitors, and who might become competitors?
Direct: PartnerStack, Impartner, Allbound (PRM); Kademi (attribution); Crossbeam, Reveal (account mapping). Each is a silo. None are AI-native.

Becoming competitors: Salesforce (tried with Partner Communities, failed — partners won't log into a vendor-branded portal owned by their CRM). HubSpot could try. A Crossbeam expansion into commissions would be the most credible threat, but they're architecturally account-mapping-first and would need to build attribution + payouts from scratch.

### What do you understand about your business that other companies in it just don't get?
Two things.

First, the partner side of the graph is a free data source nobody's productized. PartnerStack treats partners as rep-like users to be commissioned. Crossbeam treats partners as lists to be overlapped. Neither treats partners as a signal source. If you give partners a free portal, they register deals, submit feedback, tell you about accounts you didn't know they worked — and that data fills in the cold-start problem every attribution tool has.

Second, partner teams are chronically under-hired. Every buyer we talk to has a Head of Partnerships and either zero or one direct report, trying to do the work of four to six people. The existing PRM category ships software for one persona and assumes the other three are hired. They aren't. That gap is why programs stall — not because attribution is hard, but because there's no one on the other side of the attribution report to act on it. Agents close the gap. That's the product.

---

## Users

### Who are your competitors, and what do you understand that they don't?
[Answered above — consolidate for the single question if needed.]

### What's the biggest thing you're worried about?
Data sparsity at the low end of the market. If a customer only has a list of opportunities and no partner touchpoints, the value of attribution degrades. Our answer is a product ladder plus the agent layer: Tier-0 customers (opportunities only) still get a branded portal, deterministic attribution, tier-based commission rules, a Stripe-ready payout file, and two working agents (Ops + Program) — that alone replaces a spreadsheet and a quarterly argument. Tiers 1-4 deepen as they add partner contributions (PSM + PAM Agents unlock), CRM touchpoints (PSM Agent gains overlap intelligence), email/calendar OAuth (all four agents sharpen), and cross-org benchmarks (Program Agent gains peer-comparative recommendations). The floor is useful; the ceiling is the moat.

---

## Equity, legal, finance

### Have any of the founders ever been part of a company that has raised money, or sold?
[Yes/no + details.]

### How much money have you raised?
[Pre-seed / angel / bootstrapped + $amount.]

### Will the founders commit to working exclusively on this project?
Yes.

---

## Others

### Please tell us something surprising or amusing that one of you has discovered.
[Founder anecdote — keep this authentic; the template answers above are the weak link without it.]

### If you had any other ideas you considered applying with, please list them.
[Other ideas if any, or "This is the one we've been heads-down on for N months."]

---

## Notes for the founder before submitting

- Every bracketed field needs real numbers. YC reads thousands of apps — specificity is the fastest signal of operator credibility.
- The "something surprising or amusing" question is weighted more than people think. Spend time on it.
- Rehearse the 60-second video around the one-sentence thesis + the agent quartet + the value-per-input ladder. Don't try to hit all 7 narrative beats in a minute. The line that closes the video: *"You hired a Head of Partnerships. Covant gives them the team."*
- Keep the YC app and the pitch deck in sync. If the narrative in `docs/pitch.md` evolves, update this file.
