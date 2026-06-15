# Customer Acquisition Plan — First 10 → 100 Customers

*Working doc. Last updated: June 2026. Owner: Dylan.*

This is the executable layer under `GTM_STRATEGY.md`: **who to contact**, a **bottoms-up MRR model**, and a **funding recommendation**. It assumes the reality in `DONE_AND_NEXT.md` — product is live, ~0 paying customers, two-person team (Dylan + Fingerz), and the immediate goal is **first 5–10 logos + 1 case study**, not 100 customers.

---

## Part 1 — Who To Contact

### 1a. The targeting truth

You are not running a volume game. There are only **~2,000–5,000 people on earth** with the title that buys Covant (VP/Head/Director of Partnerships or Channel at a $10M–$200M ARR B2B SaaS company). That's good news: the entire addressable buyer set fits in a spreadsheet. The job is **precision, not reach.**

**The person, every time:**
- **Primary:** VP / Head / Director of Partnerships, Channel, or Alliances
- **Secondary (smaller cos):** Partner Manager / Partner Ops, or the CRO/founder who owns partnerships before there's a dedicated leader
- **Champion ≠ buyer:** Partner Managers feel the pain (spreadsheet hell); VP/CRO signs. Sell the pain to the manager, the ROI to the VP/CRO.

> **I will not invent names or emails** — that's how you burn domain reputation and look like spam. Below are **real candidate accounts** to qualify, plus the **repeatable sourcing method** that matters more than any static list.

### 1b. The qualifying signal (apply before anything goes on the list)

A company belongs on your list only if it shows **3 of these 4**:
1. Has a public **"Partners" / "Become a Partner" / "Partner Program"** page (proves a real motion exists).
2. **$10M–$200M ARR** band (verify via Crunchbase/PitchBook/Latka estimates; "Series B–D" is a decent proxy).
3. **10–200 partners** OR actively hiring a **Partner / Channel** role (check LinkedIn Jobs — a fresh req = budget + pain *right now*).
4. Runs **reseller / referral / agency / co-sell / MSP / ISV** motions — i.e. attribution is actually hard for them.

### 1c. Candidate target accounts by ICP archetype

Mapped to the "First 10 Target Customer Profiles" in `GTM_STRATEGY.md`. **Verify the band before adding** — some grow past $200M; when they do they move to your Phase-2 enterprise/replace-PRM list, not off it.

| Archetype | Candidate accounts to qualify | Why they fit |
|---|---|---|
| **E-comm / Shopify SaaS (agency + tech partners)** | Gorgias, Rebuy, Okendo, Triple Whale, Recharge, Postscript, Malomo, Loop Returns | Heavy agency-sourced + tech-partner motion; attribution across agency referral + app marketplace is genuinely messy |
| **Data / analytics SaaS (resell + ISV)** | Hex, Census, Hightouch, Mode, Metabase, Y42, Polytomic | Growing partner programs from scratch; integration-influenced deals invisible today |
| **Martech / sales tech** | Mutiny, Lemlist, Instantly, Apollo, Clay, Smartlead, Folk | Agency + tech partners; influence attribution needed |
| **Dev-tool / API-first (resellers + ecosystem)** | Sanity, Framer, Webflow (verify band), Bubble, Xano, Retool (verify band) | Dev ecosystem + reseller blend = multi-channel attribution |
| **Cybersecurity / MSP channel** | Blumira, ThreatLocker, Cynet, Huntress (verify band), Coro | Multi-tier MSP attribution is the nightmare your `GTM_STRATEGY` calls out |
| **HR / people tech (consultant partners)** | HiBob (verify band), Lattice (verify band), Deel-tier (likely too big), Pinpoint, Sapling-tier | Consultant-influenced deals are invisible |
| **Fintech / vertical (distribution partners)** | Rho, Mercury (verify band), Settle, Ramp-tier (likely too big) | Distribution partners + compliance need for explainable credit |
| **Comms / CX (reseller + referral)** | Aircall, Dialpad (verify band), Close, Front | Reseller + referral mix, mid-market sweet spot |

**Build the actual list to 50, then 200, like this:**
- **Sales Navigator filter:** Title contains (Partner OR Channel OR Alliances) + Seniority (Director+) + Company headcount 50–2,000. Save as a lead list.
- **Hiring signal:** LinkedIn Jobs / company career pages for open "Partner Manager / Channel" reqs — these are your *hottest* accounts (pain + budget, today).
- **Ecosystem scrape:** PartnerStack network directory, Crossbeam, Catalyst/Partnership Leaders member companies, Shopify/Salesforce/HubSpot app-partner directories.
- **Competitor footprints:** Anyone reviewing Impartner / Allbound / PartnerStack / Impact.com on G2 is in-market — pull G2 reviewer companies.

**Tooling for contact data (don't guess emails):** Apollo.io or Clay → verified work email + LinkedIn URL. Clay can auto-enrich the Sales Nav list and even draft personalized openers.

### 1d. Sequence per contact (use the templates already in `GTM_STRATEGY.md` §5)

- **Day 0:** Personalized cold email (Template 1 — "where does partner pipeline actually live?"). Personalize the first line off their partner page.
- **Day 0:** LinkedIn connection request (the one in §5).
- **Day 3:** LinkedIn follow-up question.
- **Day 4:** Email bump (Template 2 — cost angle).
- **Day 8:** Value-add (the 60–90s demo video + a data point).
- **Day 14:** Break-up email.
- **Volume:** 10 fresh, hand-researched contacts/day → ~50/week → ~200/month. That is the entire brute-force engine for this ICP.

**Weekly target:** 50 new touches → ~5–8 replies → 3–5 booked calls → 1–2 design partners/paying logos. Repeat without giving up (the one part of the YC playbook that fully transfers).

---

## Part 2 — The MRR Curve (if you execute this well)

### 2a. Assumptions (these are the levers — change them, the curve changes)

- **Current pricing** (`DONE_AND_NEXT.md`): Launch $299 / Scale $799 (most popular) / Program $1,999 / Enterprise custom (~$3k+).
- **Founding offer:** first ~10 logos at **$99/mo lifetime**. This is the deliberate tension — it crushes early ARPU to *buy logos + case studies*. Worth it, but model it honestly.
- **Blended ARPU** rises as you exit founding pricing and land Scale/Program deals: ~$150 (M1–3) → $450 (M6) → $650 (M12) → $850 (M18).
- **Monthly logo churn:** 4% early (pre-PMF), settling to ~2.5%. Net revenue retention turns positive (~105–110%) once a few accounts add partners/seats.
- The motion is **founder-led** through ~M9, then **+1 GTM hire (SDR/AE)** lifts new-logo throughput.

### 2b. Base case (well-executed founder-led B2B)

| Month | New logos/mo | Cumulative paying | Blended ARPU | **MRR** | ARR run-rate |
|---|---|---|---|---|---|
| M1 | 1 | 1 | $99 | ~$100 | $1.2K |
| M3 | 2 | 5 | $150 | **~$750** | $9K |
| M6 | 4 | 13 | $450 | **~$5.8K** | $70K |
| M9 | 6 | 27 | $560 | **~$15K** | $180K |
| M12 | 8 | 46 | $650 | **~$30K** | $360K |
| M18 | 12 | ~100 | $850 | **~$85K** | **~$1.0M** |

**Read:** ~$1M ARR run-rate in 18 months from zero, founder-led, is a genuinely strong (roughly top-decile) outcome — but plausible *because* you have a built product, a sharp wedge (explainable attribution), and a buyer set you can enumerate. The M3 number (~$750 MRR) looks tiny **by design** — that's the $99 founding cohort. The curve bends at ~M6 when the first case study unlocks standard pricing and the community/content flywheel starts feeding inbound.

### 2c. Scenario range

| Scenario | M6 MRR | M12 MRR | M18 MRR | What it takes |
|---|---|---|---|---|
| **Conservative** | ~$3K | ~$14K | ~$40K | Outbound only, no case-study unlock, founder bandwidth-capped, higher churn |
| **Base** | ~$6K | ~$30K | ~$85K | The plan above executed weekly + 1 GTM hire at ~M9 |
| **Optimistic** | ~$10K | ~$55K | ~$160K | Base + paid LinkedIn + a podcast/community breakout + 1–2 Program/Enterprise logos |

> These are **illustrative models, not predictions.** The two assumptions that move them most: **new logos/month** (a throughput problem — solved by outbound discipline then a hire) and **blended ARPU** (a positioning problem — solved by getting off founding pricing fast and pushing Scale as the default).

### 2d. The single biggest risk to the curve

Not lead-gen — **founder sales-capacity.** One or two people can run ~50 quality touches/week *and* close *and* onboard *and* build product. The curve stalls around M9–M12 unless you either (a) hire a GTM person, or (b) let inbound (content + community + backlinks) carry top-of-funnel. Plan for one of those at ~M9.

---

## Part 3 — Do You Need Funding?

### 3a. What this actually costs to run

| Cost | Monthly | Notes |
|---|---|---|
| Infra (Convex, Vercel, Clerk, Resend) | $200–$500 | Trivial at this scale |
| Outbound stack (Apollo/Clay, Sales Nav, email warmup) | $400–$800 | |
| Community (Partnership Leaders, Catalyst summit travel) | ~$700 amortized | ~$8K/yr |
| **Op-ex ex-salary** | **~$1.5–2K/mo** | Genuinely cheap |
| Founder salaries (2 × modest) | $0–$16K | The real variable |
| **SOC 2 Type II** | **$15–30K one-time** | Lumpy; a near-term unlock for mid-market deals |

**Burn without founder salaries: ~$2K/mo.** That is bootstrappable on early revenue almost immediately. The two real cash pressures are **founder runway** and the **SOC 2 lump**.

### 3b. Recommendation: **don't raise *now* — but line up a small round for ~Month 4–6**

**You do NOT need venture funding to get the first 10–20 customers.** The product is built, infra is near-free, and the motion is founder labor. Raising today means raising on a *story* at the worst possible terms.

**The sharper play:**
1. **Months 1–4 — bootstrap.** Land 3–5 design partners + 1 case study + first ~$5K MRR. Cover the ~$2K/mo op-ex from founding revenue and personal runway.
2. **Fund SOC 2 deliberately.** Either from a small angel check or once MRR covers it. It's the gate for bigger mid-market logos, so it pays for itself — but it's the one expense that justifies outside cash early.
3. **Months 4–6 — raise a small pre-seed *only if you want to compress the timeline*: ~$250K–$750K** (angels / pre-seed). Use of funds: (a) SOC 2, (b) finish Salesforce/HubSpot integration + AppExchange listing, (c) **one GTM hire at ~M9** to break the founder-capacity ceiling in Part 2d. Raise this *after* the case study + early MRR — that's when the wedge is proven and terms are best.

**Bootstrap-only is genuinely viable** given ~$2K/mo burn: ride founder revenue to ~$30–50K MRR (cash-flow stable for two people), self-fund SOC 2 from revenue, never raise. Slower, full control. The deciding question is **speed vs. ownership** — and *either* path works here because the burn is so low. What's *not* smart is raising a big round today on zero traction.

### 3c. The one-line answer

> **No, you don't need funding to start — your burn is ~$2K/mo and the product is built. Bootstrap to a case study + ~$5K MRR, then optionally raise ~$500K around month 4–6 to fund SOC 2 and your first GTM hire and compress the timeline. The only thing that genuinely wants outside cash near-term is SOC 2, and a single angel check covers it.**

---

*Next: I can turn Part 1 into a literal `targets.csv` skeleton (columns + the first ~30 qualified accounts) and draft the Clay/Apollo enrichment workflow if you want it operational this week.*
