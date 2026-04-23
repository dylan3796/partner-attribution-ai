# Covant — Series A Vision (Internal / Investor-Only)

*Not linked from the public site. The public site stays wedge-focused ("Channel sales, without the tape"). This doc is the altitude layer for investor conversations after the Demo Day pitch.*

---

## The Series A pitch sentence

> *"Covant is the system of record for multi-party revenue — we started with B2B SaaS partner programs because it's the bleeding neck today, but the primitive underneath is a contribution-weighted ledger, operated by four role-specific agents, that becomes infrastructure for every economy where more than two parties share a dollar."*

Three bars cleared simultaneously: (1) sharp wedge, (2) real primitive, (3) architectural (not aspirational) expansion. Demo Day pitch still opens with *"Channel sales, without the tape."* — this one opens the Series A deck.

---

## The honest abstraction

**Covant is "Stripe for multi-party revenue splits" — with four agents per vertical that already know how to run it.**

The primitive underneath the product is: *given an economic event with N contributors, determine weights, enforce rules, move money, maintain audit trail — and do it operated by role-specific agents that know the vertical.* Stripe moved money between two parties; Covant moves it across N with configurable contribution rules and a persistent operator layer.

Rejected framings: *"GitHub for economic contribution"* (too abstract, no revenue mechanism), *"Plaid for attribution"* (Plaid is connective tissue, not system of record), *"Salesforce for partnerships"* (concedes the framing to CRM-era thinking).

Stripe is the right reference because it (a) owns the ledger, (b) exposes an API primitive, (c) started narrow (online payments for developers) and expanded via the same kernel (Connect, Capital, Terminal, Atlas). The same pattern is available here, with one addition Stripe doesn't have: **the agent layer is the UX primitive that generalizes with the ledger.**

---

## The two primitives that must generalize

For this vision to be credible (not hand-waving), two things inside the product must be architecturally vertical-agnostic:

### 1. The contribution-weighted ledger

Today the schema hardcodes partner-specific concepts:
- `convex/commissionRules.ts:9-25` — `partnerType` enum (affiliate/referral/reseller/integration) and `partnerTier` enum (bronze/silver/gold/platinum) baked into the rules validator.
- `convex/schema.ts` — `partners` table typed around 4 partner types × 4 tiers; `touchpoints` has 10 hardcoded types.

**Generalization:** rename the concept internally from `partners` → `contributors` (or `parties`), with a `contributor_type` reference that's trivially extensible. Touchpoint types become rows in an `event_types` table (half-done via `convex/eventSources.ts`). The commission rules engine reasons about `contributor_id` + `context` instead of `partner_id` + hardcoded fields.

One day of work, zero customer-visible change, API surface unchanged. But after it's done, a cloud marketplace split or an insurance broker commission is the same primitive as a SaaS partner commission.

### 2. The agent quartet

The same four personas show up in every multi-party revenue vertical:

- A **sales / relationship-driving** role (partner sales manager in SaaS; cloud alliance manager in marketplaces; producer in insurance).
- A **relationship-maintaining** role (partner account manager; marketplace partner success; agent/broker relationship manager).
- A **program / structure-designing** role (partner programs lead; marketplace program manager; carrier product manager).
- An **ops / reconciliation / payout** role (partner ops; marketplace ops; commission accounting).

Covant's four agents (PSM, PAM, Program, Ops) map cleanly onto all of them. **The agent quartet is the UX primitive that generalizes alongside the contributor-ledger primitive.** Adding a fifth vertical adds a persona-mapping + tool-scope + system prompt — not a new UI framework.

This is what makes the Series A vision architecturally true: both the ledger and the operator layer generalize at the same rate.

---

## The 10-year expansion arc

| Year | Expansion | Why | Buyer | Agent overlay |
| --- | --- | --- | --- | --- |
| 0-1 (now) | B2B SaaS partner programs | Bleeding neck today; wedge. Prove attribution → rules → payout → audit loop end-to-end | Head of Partnerships | PSM / PAM / Program / Ops (as shipped) |
| 2 | Services-led co-sell (SIs, MSPs, agencies) | Same buyer persona, wider deal types. ACV expansion without product pivot | + RevOps | Same four; PSM gains services-context prompts |
| 3 | Cloud marketplace co-sell attribution (AWS ACE / Azure / GCP) + enterprise affiliate programs | AWS marketplace alone projected $85B throughput by 2028. Multi-party ledger advantage unlocks vs. single-touch tools | CRO + Cloud Alliances lead | + Cloud Alliance Agent (fifth persona); PSM + Ops gain marketplace context |
| 4 | Regulated referral economies — insurance brokers, wealth advisor networks | ~$200B in US insurance commission flow annually, horrible spreadsheet tooling. Higher ACV, compliance moat | Ops/Compliance + Head of Distribution | Persona re-map: Producer / Broker-Relations / Product-Manager / Commission-Ops agents |
| 5 | Embedded splits API — any marketplace needing N-way splits (the Stripe Connect moment) | Ledger + rules engine become infrastructure. Developer-led distribution. 10x TAM unlock | Platform engineers / CTOs | Agent layer exposed as an SDK; customers assemble their own persona agents on top |
| 6-7 | Professional services + legal referral fees | High-trust, high-dollar, manual today | Managing partner / Ops | Referral-Intake / Relationship / Rules / Reconciliation quartet |
| 8-10 | Royalty/IP management + AI-agent economic settlement | When agents transact on behalf of humans/companies, someone splits economics across model provider, orchestrator, data source, operator | Platform/rights holders | Covant's endgame — the agent layer is the buyer, not the user |

**Explicitly skipped or licensed to partners:** healthcare physician referrals (Stark Law + anti-kickback statutes), real estate broker splits (entrenched Brokermint/dotloop + fragmented buyers), franchise operations, automotive dealer networks, donor/grant allocation.

---

## The three most credible expansion bets (in order)

1. **Cloud marketplace co-sell attribution (Year 3).** Same customers, same data shape, new source (AWS ACE / Azure / GCP). Tackle-adjacent but with multi-party attribution they don't have. Projected AWS marketplace throughput is $85B+ by 2028.
2. **Embedded splits API / Stripe Connect analog (Year 5).** The ledger and rules engine become infrastructure for any marketplace that needs N-way revenue splits. Developer-led distribution, massive TAM unlock, fits the "Stripe for multi-party splits" positioning directly. The agent layer becomes an SDK primitive.
3. **Regulated referral economies — insurance + wealth (Year 4).** First jump outside tech. Insurance commission flow is ~$200B/year with spreadsheet-era tooling. FINRA/state-compliance layer is a moat once built.

---

## Competitive landscape (threats by layer)

### Layer 1 — Wedge (now)

**Real threat to monitor:** Crossbeam + Reveal (merged, ~$500M+ combined val) adding commission + payout workflows on top of their account-mapping graph. If they ship that, they become us. Monitor hiring signals + product announcements monthly (especially roles titled "attribution," "commissions," "revenue ops"). Our hedge: the agent layer. Crossbeam is graph-native; they'd need to build agents *and* commissions *and* attribution to catch up.

### Layer 2 — Co-sell + cloud marketplaces (Year 2-3)

**Real threat:** Tackle.io (~$1.4B val on ~$30M ARR as of 2022) adding multi-party attribution to their cloud-marketplace platform. They have the marketplace data already. Our hedge: secure cloud-marketplace design partners in Year 2 before Tackle notices; partner with them on integration first (they send the marketplace data, we run the multi-party attribution + splits).

### Layer 3 — Embedded splits API (Year 5)

**Real threat:** Stripe itself, if they prioritize a rules-driven Connect upgrade. Not on their public roadmap today. Our moat has to be built (rules-engine depth + multi-party graph data + vertical trust + agent layer) before Stripe notices. Covant's advantage: 5 years of partner + co-sell + marketplace data already modeled in a shipped product, plus four agents that know each vertical's operational quirks.

### Layer 4 — Regulated referral economies (Year 4+)

**Real threat:** an FS-native startup building "Covant for insurance" from scratch. Watch for it but don't preempt. Compliance is the moat-maker (FINRA, state insurance regs). Once built, category is extremely sticky.

---

## Category drift traps (reject even when appealing)

- Sales commissions (AE comp, Spiff/CaptivateIQ territory) — buyer is Finance/HR, bloodbath against well-funded incumbents.
- Creator economy / influencer payouts at scale — margins garbage, buyer wants Linktree not a ledger.
- Healthcare physician referrals — Stark Law + anti-kickback statutes = attorney ships with the product.
- Real estate broker splits — entrenched incumbents, fragmented buyers.
- Customer champion / advocacy programs — dead category.
- Open source contributor bounties — no one pays for this.
- "AI-agent payments" as a current capability — real in 5-7 years. Writing it into Year 2 = unserious.

---

## Expanded TAM math (honest version)

| Layer | TAM (by 2030-2034) | Confidence |
| --- | --- | --- |
| Wedge — B2B SaaS partner program software | $2-3B | High |
| + Co-sell + cloud marketplace attribution | +$3-5B | High |
| + Embedded splits API (marketplace infrastructure) | +$10-20B | Medium — the 10x bet |
| + Regulated referral economies (insurance/wealth/legal) | +$5-8B | Medium — compliance-gated |
| **Aggregate defensible TAM** | **~$25-40B** | The number that survives a partner meeting |

Rejected: *"every dollar of commerce needs attribution"* = $100B+ BS number, discounted 10x by any serious partner.

---

## How the vision coexists with the wedge

Three hard rules:

1. **Do not rename the company.** "Covant" works for partner programs and for a future multi-party ledger.
2. **Do not change the landing page or ICP.** B2B SaaS partner program positioning stays as is. Vision lives here, not on the site.
3. **Do not sell outside B2B SaaS partner programs for Year 1.** Zero exceptions. One stray financial-services design partner in Year 1 will pull focus and kill the wedge.

The vision's job is to make the pitch compelling and the architecture extensible — not to change what you build or who you sell to this year.

---

## Verification

1. **Architectural truth test.** After the one-day ledger-generalization refactor, can you add a non-partner contributor type (e.g., `broker` or `marketplace_split`) without touching commission rules logic? If yes, the ledger primitive is real.
2. **Agent truth test.** Can you add a fifth persona agent (e.g., "Cloud Alliance Agent" for Year 3) by writing a new `agents/*.md` spec + a new route handler that reuses the runtime — with no changes to `agent_tasks`, `agent_proposals`, or the approval UI? If yes, the agent primitive is real.
3. **Pitch layering test.** Rehearse two pitches back-to-back: 60-second Demo Day wedge pitch ("Channel sales, without the tape") and 90-second Series A vision pitch ("Stripe for multi-party revenue splits, operated by agents"). If they feel like the same company told at different altitudes, the story works.
4. **Drift-trap test.** Monthly, decline all inbound interest from outside B2B SaaS partner programs in Year 1. If you find yourself wanting to say yes, re-read the traps.
5. **TAM defense test.** Practice defending $25-40B under investor pressure with a credible number per layer.
6. **Coexistence test.** At any moment, can you explain in one sentence why the wedge work you did today also serves the Year 5 vision? If yes, the strategy is coherent.
