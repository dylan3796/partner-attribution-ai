# Product Vision: Partner Platform

## The Big Idea

**Attribution is the brain. Everything else runs on it.**

Most partner platforms treat attribution as a reporting feature. We make it the foundation. Every module — incentives, program management, revenue ops, partner portal — is powered by real-time attribution intelligence.

> "We don't just track who gets credit. We use that intelligence to run your entire partner operation."

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PARTNER PORTAL                        │
│        (Self-service for partners to see impact)         │
├─────────┬──────────┬───────────┬──────────┬─────────────┤
│ PROGRAM │ REVENUE  │INCENTIVES │ CONTENT  │  ANALYTICS  │
│  MGMT   │   OPS    │ & PAYOUTS │ & ENABLEMENT │ & INSIGHTS│
├─────────┴──────────┴───────────┴──────────┴─────────────┤
│              🧠 ATTRIBUTION ENGINE (AI)                  │
│     First Touch · Last Touch · Multi-Touch · Time Decay  │
│     Role-Based · AI-Weighted · Custom Models             │
├─────────────────────────────────────────────────────────┤
│              DATA LAYER (Integrations)                    │
│   CRM · Marketing · Product · Billing · Communication    │
└─────────────────────────────────────────────────────────┘
```

---

## Platform Modules

### 🧠 1. Attribution Engine (Core — The Brain)
The AI-powered attribution engine that everything else depends on.

**What it does:**
- Tracks every partner touchpoint across the customer journey
- Calculates credit using multiple models (configurable per org)
- AI model learns which attribution approach best matches actual outcomes
- Provides explainable, auditable attribution decisions

**How it powers everything else:**
- Feeds **Incentives** → accurate commission calculations
- Feeds **Program Mgmt** → data-driven tier decisions
- Feeds **Revenue Ops** → forecasting & pipeline intelligence
- Feeds **Partner Portal** → real-time partner performance visibility
- Feeds **Analytics** → strategic insights for leadership

**Attribution Models:**
| Model | Best For | How It Works |
|-------|----------|--------------|
| Equal Split | Simple programs | Every partner gets equal share |
| First Touch | Lead gen programs | 100% to who sourced the lead |
| Last Touch | Closer-focused | 100% to who closed the deal |
| Time Decay | Balanced programs | Recent touches weighted higher |
| Role-Based | Complex B2B | Weights by activity type |
| AI-Weighted | Advanced | ML learns optimal weights from outcomes |
| Custom | Enterprise | Define your own rules |

---

### 💰 2. Incentive Management
Commission calculations, payouts, SPIFs, bonuses — all driven by attribution data.

**Features:**
- **Auto-calculated commissions** — based on real attribution, not guesswork
- **Tiered commission structures** — escalating rates by performance
- **SPIFs & bonuses** — time-limited incentives for strategic pushes
- **Multi-currency** — global partner networks
- **Payout workflows** — pending → approved → processing → paid
- **Tax compliance** — 1099/W-9 collection, international tax handling
- **Dispute resolution** — partners can flag and appeal with audit trail

**How attribution powers this:**
- Commission = Deal Amount × Attribution % × Commission Rate
- No more "who gets credit?" arguments — the data decides
- Partners trust the system because they can see the math

**By org type:**
| Org Type | Incentive Needs |
|----------|----------------|
| SaaS Channel | Recurring commissions on renewals, expansion revenue |
| Marketplace | Revenue share, listing fees, transaction-based |
| Hardware/Distro | Tiered volume discounts, rebates, MDF |
| Services/Agency | Referral fees, project-based, retainer splits |

---

### 📋 3. Program Management
Structure, manage, and optimize your partner program.

**Features:**
- **Partner tiers** — Bronze/Silver/Gold/Platinum (or custom) with auto-promotion
- **Tier criteria** — revenue thresholds, certifications, activity levels
- **Onboarding workflows** — automated partner activation sequences
- **Certification tracking** — training completion, exam scores
- **Territory management** — geographic or vertical assignments
- **QBR automation** — auto-generated quarterly business reviews
- **Program health scoring** — which partners are at risk of churning

**How attribution powers this:**
- Tier promotions based on *attributed revenue*, not just deals registered
- Identify underperforming partners early (high activity, low attribution)
- Optimize program rules based on what actually drives revenue

**By org type:**
| Org Type | Program Needs |
|----------|---------------|
| SaaS Channel | Reseller certification, co-sell readiness, MDF allocation |
| Marketplace | App listing quality, integration depth, user adoption |
| Hardware/Distro | Volume commitments, training requirements, demo capabilities |
| Services/Agency | Expertise validation, case study generation, joint proposals |

---

### 📊 4. Revenue Operations
Pipeline visibility, forecasting, and revenue intelligence for partner-sourced deals.

**Features:**
- **Partner pipeline** — deals by stage, source, partner
- **Revenue forecasting** — predict partner-sourced revenue by model
- **Co-sell tracking** — joint opportunities with partner + direct sales
- **Deal registration** — partners register deals, prevent channel conflict
- **Overlap analysis** — find where your customers overlap with partner customers
- **Revenue waterfall** — visualize how partner revenue flows through stages

**How attribution powers this:**
- Forecast accuracy improves because you know *which partners actually close*
- Co-sell attribution shows true value of alliance partnerships
- Deal registration validated against actual touchpoint data

**By org type:**
| Org Type | Rev Ops Needs |
|----------|---------------|
| SaaS Channel | ARR tracking, expansion revenue, churn from partner deals |
| Marketplace | GMV tracking, take rates, partner-driven conversion |
| Hardware/Distro | PO tracking, inventory planning, channel inventory |
| Services/Agency | Project pipeline, SOW tracking, utilization rates |

---

### 🌐 5. Partner Portal
Self-service portal for partners to manage their business with you.

**Features:**
- **Dashboard** — real-time performance metrics (powered by attribution)
- **Deal registration** — submit and track deal opportunities
- **Content library** — sales decks, case studies, battle cards
- **Co-branded materials** — generate co-branded content on demand
- **Training center** — courses, certifications, learning paths
- **Commission tracker** — see earned, pending, and projected commissions
- **Support tickets** — get help from partner team
- **Leaderboard** — gamified rankings (opt-in)

**How attribution powers this:**
- Partners see *exactly* how they contributed to each deal
- Transparent attribution builds trust ("I can see my impact")
- Partners can model "what if I do more demos?" scenarios
- Leaderboard based on attributed revenue, not just activity

**By org type:**
| Org Type | Portal Needs |
|----------|--------------|
| SaaS Channel | Co-sell workspace, joint account planning, MDF requests |
| Marketplace | App management, listing optimization, API docs |
| Hardware/Distro | Ordering portal, inventory visibility, pricing tools |
| Services/Agency | Lead distribution, project briefs, referral tracking |

---

### 🔗 6. Content & Enablement
Arm your partners with what they need to sell.

**Features:**
- **Content library** — organized by stage, vertical, partner tier
- **Co-branding engine** — auto-generate partner-branded materials
- **Playbooks** — step-by-step guides for common partner motions
- **Competitive intel** — battle cards, objection handling
- **Email templates** — pre-built sequences for partner outreach
- **ROI calculators** — partners can show customer value

**How attribution powers this:**
- Surface content that *top-performing partners* actually use
- "Partners who share this case study close 3x more deals"
- Auto-recommend content based on deal stage and partner type

---

### 📈 7. Analytics & Insights
Strategic intelligence for partner leadership.

**Features:**
- **Executive dashboard** — KPIs at a glance
- **Model comparison** — same data, all attribution models side-by-side
- **Partner ROI** — cost of partner (incentives, support) vs revenue generated
- **Cohort analysis** — partners by join date, type, tier
- **Channel mix** — direct vs partner revenue breakdown
- **Predictive analytics** — which partners will hit/miss targets
- **Custom reports** — build and schedule any report
- **Benchmarks** — how does your program compare to industry

**How attribution powers this:**
- Every insight is grounded in real attribution data
- "Your top quartile partners drive 80% of attributed revenue"
- Model comparison reveals if you're over/under-crediting certain partners

---

## Target Market Segments

### 1. SaaS with Channel Programs
**Examples:** Salesforce, HubSpot, AWS, Datadog, Snowflake
**Key pain:** Manual attribution in spreadsheets, can't measure true partner impact on ARR
**Our angle:** Real-time multi-touch attribution across the entire SaaS customer lifecycle (trial → close → expand → renew)
**Unique needs:**
- Recurring revenue attribution (who gets credit on renewal?)
- Expansion revenue tracking
- Integration-influenced deals (partner's integration drove adoption)
- Co-sell attribution (AE + partner on same deal)

### 2. Marketplace Operators
**Examples:** Shopify App Store, Atlassian Marketplace, Salesforce AppExchange
**Key pain:** Can't measure which apps/partners actually drive platform adoption
**Our angle:** Track how partner integrations influence platform revenue
**Unique needs:**
- Install → activation → revenue attribution
- Partner app quality scoring
- Ecosystem health metrics
- Developer partner management

### 3. Hardware & Distribution
**Examples:** Dell, Cisco, HP, Lenovo
**Key pain:** Multi-tier distribution makes attribution nearly impossible
**Our angle:** Track attribution across distributor → reseller → end customer chains
**Unique needs:**
- Multi-tier attribution (distributor gets X%, reseller gets Y%)
- Volume-based incentives and rebates
- Deal registration with conflict resolution
- Inventory and fulfillment tracking

### 4. Professional Services & Agencies
**Examples:** Deloitte, Accenture, boutique consultancies
**Key pain:** Referral revenue is invisible, no way to measure which partners send quality leads
**Our angle:** Attribution that tracks referral quality, not just quantity
**Unique needs:**
- Lead quality scoring (referred deals close rate, deal size, LTV)
- Project-based attribution (not just SaaS recurring)
- White-label partner portal
- Referral fee management

### 5. Fintech & Financial Services
**Examples:** Stripe, Plaid, banks with partner programs
**Key pain:** Regulatory requirements make attribution tracking critical
**Our angle:** Compliant, auditable attribution for regulated industries
**Unique needs:**
- Compliance-ready audit trails
- Regulated payout workflows
- KYC/AML for partner onboarding
- Detailed reporting for regulators

---

## Competitive Landscape

| Competitor | Strength | Weakness | Our Advantage |
|-----------|----------|----------|---------------|
| Impact.com | Established, full suite | Legacy tech, complex, expensive | AI-native, modern UX, transparent attribution |
| PartnerStack | Good for SaaS | Limited to affiliates/referrals | Full PRM + channel + alliance support |
| Crossbeam | Account mapping | Not a PRM, no attribution | We do attribution + everything else |
| Impartner | Enterprise PRM | Old-school, no AI | Modern, AI-first, self-serve |
| Reveal | Data sharing | No attribution or management | Full platform, not just data |
| Allbound | Partner portal | Basic attribution | Deep attribution powers everything |

**Our moat:** Attribution-first architecture. Everyone else bolted attribution on. We built the platform around it.

---

## Pricing Direction

| Tier | Target | Price | Includes |
|------|--------|-------|----------|
| **Starter** | Early-stage, <20 partners | Free / $49/mo | Attribution engine, basic dashboard, 5 partners |
| **Growth** | Scaling, 20-200 partners | $299/mo | Full platform, partner portal, integrations |
| **Enterprise** | Large programs, 200+ | Custom | Multi-tier, custom models, SSO, dedicated support |

---

## V1 Scope (What to Build First)

**Phase 1: Attribution + Dashboard** (4-6 weeks)
- Working attribution engine (done ✅)
- Dashboard showing deals, partners, attribution results
- Basic partner management

**Phase 2: Partner Portal + Incentives** (4-6 weeks)
- Partner-facing portal
- Commission calculations
- Payout tracking

**Phase 3: Program Management + Integrations** (4-6 weeks)
- Partner tiers
- CRM integrations (Salesforce, HubSpot)
- Deal registration

**Phase 4: Content + Advanced Analytics** (4-6 weeks)
- Content library
- AI-powered insights
- Predictive analytics

---

## The One-Liner

> **The AI-native partner platform where attribution powers everything.**

---

*This is a living document. Update as the product evolves.*
