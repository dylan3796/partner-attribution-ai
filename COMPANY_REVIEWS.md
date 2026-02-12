# PartnerAI — Five-Company Review

*Evaluation Date: February 12, 2026*
*Evaluated by: Five fictional companies with real-world partner program needs*
*Platform Version: Demo/Early Access (Convex backend not yet initialized; CRM integrations not live)*

---

## 1. TechCorp — Enterprise SaaS ($200M ARR, 150+ Partners)

**Reviewer:** VP of Channel & Alliances | Multi-tier partner program (resellers, SIs, MSPs, tech partners)

### First Impressions
The landing page hits the right notes — "The Partner Intelligence Layer for Your CRM" is exactly how we'd want to think about this. The AI demo showing tier promotions and partner scoring feels like it was written for us. The problem statements (spreadsheet hell, "who gets credit?", payout chaos) — we live all three. However, the positioning leans heavily toward mid-market. Where are the enterprise logos? No mention of SOC 2 Type II, SSO/SAML, RBAC, or compliance certifications beyond a single bullet. At our scale, those aren't nice-to-haves — they're table stakes.

### Setup & Onboarding
**This is where it falls apart for us.** The Salesforce "Connect" button shows a toast: "Coming soon." We have 150+ partners, 2,000+ deals per quarter, and 10,000+ touchpoints flowing through Salesforce. Manual CSV import is not a viable path. The CSV importer exists and handles validation/duplicate detection well, but importing at our scale — then keeping it in sync — is operationally unrealistic. There's no Salesforce package, no bi-directional sync, no field mapping. We'd need a dedicated integration engineer just to get data in.

### Core Features Review
- **Partner Management:** The partner directory is clean but simplistic. Four types (affiliate, referral, reseller, integration) — we need at least SI, MSP, ISV, and distributor. Four tiers is fine, but no automated tier progression rules. No partner grouping, territory overlap management, or account assignment. At 150+ partners, we need hierarchy (distributor → sub-resellers).
- **Deal Tracking/Attribution:** The 5 attribution models are genuinely interesting. The role-based model with customizable weights maps well to our co-sell motion. Model comparison (bar, radar, pie charts) is excellent — our leadership team would love the side-by-side view. However, there's no deal registration approval workflow with SLA tracking, no conflict detection when two partners register the same account, and no integration with our Salesforce opportunity stages.
- **Payouts/Incentives:** Solid state machine (pending → approved → paid). Bulk approve is useful. But no tiered commission structures (we pay different rates at different revenue tiers), no SPIFs, no MDF management, no multi-currency support. We pay partners in USD, EUR, GBP, and JPY. This is single-currency only.
- **Partner Portal:** Exists and looks good. Partners can see deals, commissions, activity. But no co-sell workspace, no joint account planning, no MDF request workflow, no content co-branding. It's a view-only dashboard, not a collaboration space.
- **Reporting/Analytics:** The model comparison charts are genuinely the best thing here. Radar chart across models per partner is unique. But no custom report builder, no scheduled exports, no revenue forecasting, no cohort analysis.

### What Works Well
- **Attribution engine is legitimate.** Five models with transparent math. The role-based model with configurable weights per touchpoint type is exactly what we've been calculating manually in spreadsheets. Seeing attribution shift across models is genuinely insightful.
- **Audit trail is thorough.** Every action logged with metadata. This matters for partner disputes and compliance.
- **UI is clean and modern.** Way better than Impartner's dated interface.
- **Platform configuration system** with feature flags and complexity toggles is smart — shows product thinking about different customer needs.

### What Doesn't Work
- **No CRM integration.** Full stop. The platform claims "Works with your CRM, not against it" but the CRM connections literally don't exist yet. This is the single biggest gap.
- **No multi-tier partner hierarchy.** We have distributors who manage sub-resellers. The flat partner list doesn't support this.
- **No co-sell workflows.** Our biggest revenue driver is AE + partner co-sell motions. There are "co_sell" touchpoint types but no actual co-sell workspace or motion tracking.
- **Demo mode only.** The entire app runs on in-memory demo data (`lib/store.tsx`). The Convex backend exists in schema but hasn't been initialized. This isn't a production system — it's a functional prototype.
- **No SSO/SAML, no RBAC beyond admin/manager/member roles.** We need custom roles, approval hierarchies, and enterprise auth.

### Deal Breakers
1. **No Salesforce integration** — Cannot even evaluate without it
2. **No multi-currency** — We're a global operation
3. **No SSO/SAML** — InfoSec won't approve it
4. **Demo mode / no production backend** — This isn't production-ready

### Nice-to-Haves
- Slack/Teams notifications for deal registration and payout approvals
- QBR auto-generation from attribution data
- Partner capacity/readiness scoring (the scoring page exists but is basic)
- Salesforce-native app or at minimum a managed package

### Overall Verdict: **PASS**
Not because the product vision is wrong — it's actually the right idea executed with good product thinking. But it's 12-18 months away from enterprise readiness. No CRM integration, no production backend, no enterprise security features. We'd revisit once Salesforce sync, multi-currency, SSO, and a production backend are shipped. The attribution engine and reporting UX are compelling enough that we'd want to be on the beta list.

### Price Sensitivity
At Enterprise tier (Custom pricing), we'd expect to pay $1,500-3,000/mo for a full PRM replacement, or $500-1,000/mo as an attribution layer on top of Impartner. Currently, not enough functionality to justify any price.

---

## 2. GrowthStartup — Series A SaaS ($3M ARR, 8 Partners)

**Reviewer:** Head of Partnerships (also does BD, marketing, and half of customer success)

### First Impressions
This feels like it was built for me. "Stop guessing which partners drive revenue" — yes. The landing page is gorgeous. The demo showing the AI analyzing partners and recommending tier promotions is aspirational (we're not there yet) but it shows where this could go. The pricing is right: Free tier for up to 10 partners means we can start without budget approval. "15 minutes to value" — that's what I need. I don't have time for a 6-week implementation.

### Setup & Onboarding
I clicked "Get started" and landed in a fully working dashboard with demo data. That's smart — I can immediately see what the product does before investing time. Adding a partner is straightforward: name, email, type, tier, commission rate, territory. I could import my 8 partners via CSV in about 5 minutes. The CSV template with validation and duplicate detection is well thought out. **But wait** — there's no HubSpot integration either. The "Connect" button says "coming soon." We're a HubSpot shop. I'd need to manually create deals here and in HubSpot separately. That's double-entry.

### Core Features Review
- **Partner Management:** Perfect for our scale. 8 partners, flat commissions, simple tiers. The partner detail page with activity timeline, certifications, and badges is more than we need right now but grows with us. Adding a new partner takes 30 seconds.
- **Deal Tracking/Attribution:** Honestly, at our stage with 8 reseller partners, attribution is simple — usually one partner per deal. But the "first touch" model covers our basic use case (who referred the deal?), and having equal split available for the rare multi-partner deal is nice. The deal timeline showing touchpoints is way better than our current Slack + Google Sheets workflow.
- **Payouts/Incentives:** This is the killer feature for us. We currently calculate commissions in Google Sheets, email partners their amounts, and manually track payments. The payout workflow (pending → approved → paid) with audit trail would save me 4-6 hours per month. CSV export for our accountant is perfect.
- **Partner Portal:** This alone justifies the product. Our partners currently email me asking "what's the status of my referral?" and "when do I get paid?" A self-service portal where they can see their deals, commissions, and activity history would eliminate 60% of my partner-related inbox.
- **Reporting:** More than we need right now. The 5-model comparison is interesting intellectually but overkill for our simple program. The partner leaderboard is nice for motivation though.

### What Works Well
- **The partner portal is exactly what we're missing.** Partners can see their deals, track commissions, register new deals. This is our #1 pain point solved.
- **Payout management workflow** replaces our entire Google Sheets + email process.
- **Clean, intuitive UI** — I could onboard myself in 30 minutes without reading docs.
- **Feature flags** — I can turn off the complex stuff (scoring, certifications, MDF, co-sell) and keep it simple. "Simple mode" with just partner directory, basic attribution, and commission payouts is exactly right.
- **Free tier** covers our current scale.

### What Doesn't Work
- **No HubSpot integration.** We'd need to enter deals twice (once in HubSpot, once here). For 8 partners doing maybe 3-5 deals/month each, this is annoying but manageable. But it adds friction.
- **The product is in demo mode.** All data is in-memory — nothing persists across page refreshes (or rather, it resets to demo data). I can't actually use this in production right now. This is a huge caveat.
- **No email notifications.** When a partner submits a deal registration, I want an email. When a payout is approved, the partner should get notified. Currently, you'd have to log in and check.
- **No Stripe/PayPal integration for actual payments.** The payout system tracks status but doesn't actually send money. I'd still need to pay partners manually.

### Deal Breakers
1. **Demo mode / no persistent data** — Can't use it if data doesn't persist
2. Nothing else is a true deal breaker if persistence was solved — everything else we could work around

### Nice-to-Haves
- HubSpot deal sync (would upgrade from "good" to "essential")
- Email notifications for partner-facing events
- Simple Stripe Connect integration for automated payouts
- A mobile-responsive partner portal (didn't check but assume it's decent given Tailwind)
- Zapier integration as a stopgap before native HubSpot

### Overall Verdict: **MAYBE → BUY (once production-ready)**
This is exactly the right product for a company at our stage. The free tier covers our partner count, the feature flags let us keep it simple, and the partner portal + payout workflow solve our two biggest pain points. The UX is better than anything else in this price range. **But we literally cannot use it today** because it's running on demo data with no persistent backend. The moment they ship a working Convex backend (or any persistent storage) and ideally a basic HubSpot integration, this is an instant buy for us. We'd sign up day one.

### Price Sensitivity
Free tier is perfect right now (10 partners, 1 user). When we grow to 20+ partners and need team access, $299/mo for Growth is reasonable and cheaper than PartnerStack or Impact. We'd pay $99/mo for a stripped-down version (just partner portal + payouts) right now.

---

## 3. CloudMarket — API/Integration Platform ($50M ARR, 300+ Partners)

**Reviewer:** Director of Ecosystem & Partnerships | Integration/technology partner program

### First Impressions
The landing page mentions "Marketplaces" as a target segment and lists Shopify, Atlassian, Stripe as examples. That's our world. But when I dig into the actual product, I see it's really built for channel sales (resellers, referrals, deal-based tracking). Our model is fundamentally different: partners build integrations with our API, and we need to measure whether those integrations drive platform usage and revenue. There are no concepts of API usage, integration depth, or product-led attribution in the platform.

### Setup & Onboarding
The partner type "integration" exists, which is a start. But the deal model (name, amount, status: open/won/lost) assumes discrete sales transactions. Our "deals" are really adoption metrics — API calls, active integrations, partner-driven signups. The touchpoint types (referral, demo, proposal, negotiation) are sales-motion touchpoints. Where's "integration launched," "user activated via partner," "API call volume milestone"? We'd need to force our data into a model that doesn't fit.

### Core Features Review
- **Partner Management:** 300+ partners managed with search, filter by type/status, CSV import/export — this would work at a basic level for maintaining our partner directory. Tiers (bronze/silver/gold/platinum) map loosely to our integration partner tiers. But no way to track integration health (API uptime, version compliance, docs quality).
- **Deal Tracking/Attribution:** Fundamentally misaligned. We don't have "deals" in the traditional sense. When a user signs up and later activates a partner integration that drives them to upgrade, that's partner-influenced revenue. The touchpoint model (referral → demo → proposal → close) doesn't capture the product-led journey. There's no event-based or usage-based attribution.
- **Payouts/Incentives:** If we could get attribution right, the payout system would work for revenue sharing. But the commission calculation is `Deal Amount × Attribution % × Commission Rate` — we'd need it to be `Monthly recurring usage × Revenue share %` or transaction-based fees.
- **Partner Portal:** The self-service portal with deal tracking and commission visibility would be useful if adapted. But we'd want API documentation, integration status, sandbox management, and developer resources — none of which exist.
- **Reporting:** The attribution model comparison is irrelevant for us. We don't need first-touch vs. last-touch on sales deals. We need integration adoption curves, partner-driven DAU, and ecosystem health metrics.

### What Works Well
- **The concept of an attribution layer on top of existing tools** is sound. If this supported event-based/usage-based data (via Segment integration), it could be powerful.
- **Partner directory and management** at the basic level works for maintaining our 300+ partner list.
- **The platform configuration / feature flags** would let us hide all the sales-focused features.
- **Audit trail** — useful for tracking partnership program changes.

### What Doesn't Work
- **The entire data model assumes traditional sales.** Deals, touchpoints, and attributions are built around a CRM sales pipeline (open → won → lost). We need product-led, event-based attribution.
- **No Segment, Amplitude, or Mixpanel integration.** Our partner attribution data lives in product analytics, not CRM.
- **No API/webhook system.** The platform mentions REST API support but it doesn't exist. We'd need to push usage events programmatically.
- **Touchpoint types are sales-focused.** No "integration_activated," "api_call_milestone," "user_upgrade_via_partner," "marketplace_listing_click."
- **No marketplace management features** — app listings, review management, integration quality scoring.

### Deal Breakers
1. **No event/usage-based attribution** — Our entire model is product-led, not sales-led
2. **No API for programmatic data ingestion** — We generate partner data from product events, not CRM
3. **No Segment/analytics tool integration** — Our source of truth is product data

### Nice-to-Haves
- Segment integration to ingest product events as touchpoints
- Custom touchpoint types (not just the 9 hardcoded sales types)
- Usage-based attribution model (credit based on integration activation/usage)
- Marketplace listing management
- Developer-facing partner portal with API docs and sandbox

### Overall Verdict: **PASS**
The platform is built for a channel sales model. We need an ecosystem/product-led partnership platform. This isn't a feature gap — it's a fundamental model mismatch. We'd need to look at solutions like Crossbeam (for account mapping), a custom-built attribution system on top of Segment, or potentially work with the PartnerAI team on a product-led partnership module. The vision doc mentions "Marketplace Operators" as a target segment, but the actual product has zero marketplace features built.

### Price Sensitivity
N/A — wouldn't purchase in current form. If they built product-led attribution with Segment integration, we'd pay $500-1,500/mo for the Growth/Enterprise tier depending on partner count limits.

---

## 4. DistributionPro — Traditional B2B ($80M Revenue, 40 VARs/Distributors)

**Reviewer:** Channel Director | Classic distribution model with VARs, volume incentives, and MDF

### First Impressions
The landing page mentions "Distribution" and "Dell, Cisco, HP" — that's us. The problem statements about spreadsheet hell and payout chaos resonate deeply. We currently run our entire partner program through an ERP export → Excel → email chain that takes our ops team 2 weeks per quarter to reconcile. But when I look at the product more carefully, I notice: there's no purchase order tracking, no inventory visibility, no distributor pricing tools, no multi-tier distribution chain modeling. The listed use case is aspirational, not implemented.

### Setup & Onboarding
Getting our 40 VARs into the system via CSV would take about 20 minutes. That's easy. The deal import is straightforward too. The issue is mapping our model: a distributor buys from us at distributor price, then sells to VARs at VAR price, who sell to end customers at retail. That's a 3-level chain. The platform has a flat partner → deal model. There's no distributor hierarchy, no buy-resell tracking, no margin management.

### Core Features Review
- **Partner Management:** 40 partners with type/tier/territory — this works as a basic directory. But partner types are limited to "affiliate, referral, reseller, integration." We need "distributor" and "VAR" as distinct types with different economics and visibility rules. The tier system (bronze/silver/gold/platinum) maps to our tiering, and the commission rate per partner works for base incentives.
- **Deal Tracking/Attribution:** The deal model (opportunity-based) partially works if we treat each end-customer sale as a "deal." But we don't have co-sell motions or multi-partner touchpoints in the same way SaaS companies do. Our attribution is straightforward: distributor X sold through VAR Y to customer Z. First-touch or deal-registration model would work. **However, there's no concept of resale price, distributor cost, or margin tracking.**
- **Payouts/Incentives:** The payout workflow is solid. But we need **volume incentives** (hit $1M quarterly, get 2% rebate on everything), **market development funds (MDF)** (apply for marketing co-op dollars, submit proof-of-performance), and **rebate calculations** (quarterly true-ups). None of these exist. The feature flag for MDF is visible in settings but explicitly says it's not built.
- **Partner Portal:** A portal where VARs can see their sales performance and pending payouts would be genuinely valuable. Currently our VARs call their rep to ask about their rebate status. The portal dashboard showing "Total Earned," "Pending Payout," and "Deals Influenced" is a meaningful step up from our current zero-visibility situation.
- **Reporting:** Basic but useful. Seeing which VARs are selling and how much, with export to CSV for our ERP reconciliation, is a step up from manual spreadsheets.

### What Works Well
- **Partner portal** — Our VARs have zero visibility today. Even a basic portal showing sales and payouts would be transformational.
- **Payout approval workflow** — Currently our channel ops team tracks payouts in Excel and emails finance. This is much cleaner.
- **Audit trail** — For channel conflict disputes ("two VARs claimed the same customer"), having a logged history of deal registrations and touchpoints is valuable.
- **CSV import/export** — Our data lives in ERP. We could export to CSV and import quarterly. Not elegant, but workable.
- **Partner leaderboard** — Simple gamification. Our VARs are competitive.

### What Doesn't Work
- **No volume incentives or rebate programs.** We don't pay per-deal commissions — we pay quarterly rebates based on volume thresholds. The entire incentive model is wrong for us.
- **No MDF management.** Market development funds are a core part of our program. The feature flag exists but it's not built.
- **No distributor hierarchy.** We sell through distributors who sell through VARs. The platform assumes a flat partner model.
- **No training/certification requirements enforcement.** Our VARs must complete annual product training to maintain their tier. The certifications page exists but doesn't gate anything — it's just a display.
- **No deal registration conflict detection.** When two VARs register the same end customer, we need automatic flagging and a resolution workflow. The dispute schema exists in the database but there's no UI.
- **Channel conflict is our #1 problem and the platform doesn't address it.**

### Deal Breakers
1. **No volume incentive / rebate calculation** — Our entire economics model is volume-based, not per-deal commission
2. **No MDF management** — Core program feature, not built
3. **Demo mode / no production backend** — Same as everyone else

### Nice-to-Haves
- ERP integration (even basic CSV auto-sync would help)
- Channel conflict detection and resolution workflow
- Training completion gating tier status
- Quarterly rebate calculation engine
- PO / invoice tracking

### Overall Verdict: **MAYBE**
The partner portal and payout workflow would genuinely improve our operations, even in their current form. But the incentive model (per-deal commission) doesn't match our economics (volume rebates), and the missing MDF and channel conflict features leave big operational gaps. If they added volume incentives and MDF management, this could work for us. The price point ($299/mo) is attractive compared to building custom tooling. We'd pilot it just for partner visibility + basic payout tracking while lobbying for the features we need.

### Price Sensitivity
$299/mo is reasonable if it actually works. We currently spend ~$50K/year in ops time on manual partner management. Even a partial solution at $3,600/year would have positive ROI. We'd want Growth tier, but only if it could handle our incentive model.

---

## 5. ConsultCo — Professional Services ($20M Revenue, 25 Referral Partners)

**Reviewer:** Partnerships Manager | Referral-based program with consultants, agencies, and alliance partners

### First Impressions
"Agencies & Services" is called out as a segment on the landing page. The description ("Track lead quality and relationship value") is exactly our need. The three pain points — spreadsheet hell, attribution disputes, payout chaos — are our daily reality. Partners email referrals to us. We track them in a Google Sheet. When a deal closes, there's a 50/50 chance we forget to pay the referring partner, leading to awkward conversations and eroded trust. This platform promises to fix that.

### Setup & Onboarding
Getting started is easy. I could add our 25 referral partners in 15 minutes via CSV. The "referral" partner type is a direct match. Setting commission rates per partner (our top referrers get 15%, standard partners get 10%) works perfectly. The deal creation flow (name, amount, contact, expected close date) maps to how we track referrals.

### Core Features Review
- **Partner Management:** 25 partners, all "referral" type, varying commission rates — this is a perfect fit. The partner detail page showing all their referrals, touchpoints, and commission history is exactly what we'd use for quarterly partner reviews. Territory assignment lets us note which partners focus on which verticals.
- **Deal Tracking/Attribution:** For pure referral tracking, this works well. A partner refers a client → we create a deal → add a "referral" touchpoint → deal closes → attribution is calculated → commission is generated. The "first touch" attribution model is exactly right for referrals (whoever referred it gets credit). Deal registration from the portal means partners can submit referrals themselves instead of emailing us.
- **Payouts/Incentives:** **This is the killer feature.** Partner refers client → deal closes → commission automatically calculated based on their rate → payout enters approval queue → we approve → we mark as paid. Currently, we do this in a spreadsheet, forget to update it, and partners chase us for months. The audit trail means no more "I referred them 6 months ago and never got paid" disputes.
- **Partner Portal:** **Game changer for us.** Partners can: (1) Submit referrals directly (deal registration), (2) See the status of all their referrals (open/won/lost), (3) Track their pending and paid commissions, (4) View their activity history. This replaces our current process of partners emailing us and us manually updating them.
- **Reporting:** The partner leaderboard showing who's referring the most (and the highest-quality) deals is useful for identifying top performers and underperformers. CSV export for accounting is necessary and present.

### What Works Well
- **The referral workflow is almost perfectly designed for us.** Partner submits referral via portal → deal tracked with touchpoint → closes → attribution calculated → payout queued → approved → paid. End to end.
- **Partner portal eliminates our #1 pain point:** partners having zero visibility. They can log in and see everything themselves.
- **Commission tracking with audit trail** eliminates attribution disputes. "I can see the math" builds trust.
- **Simple mode** configuration strips away enterprise complexity (co-sell, certifications, MDF, scoring) and leaves just what we need: partners, deals, payouts.
- **The pricing works.** Free tier for 10 partners gets us started; Growth at $299/mo for all 25 partners is within budget.
- **CSV import** for initial partner data, CSV export for accounting reconciliation.

### What Doesn't Work
- **No email intake for referrals.** Currently, partners email us referrals. There's no email-to-deal flow. Partners would need to learn to use the portal, which is better long-term but requires behavior change.
- **No success-based payout triggers.** We sometimes pay at different milestones (e.g., 50% at contract signing, 50% after 3-month retention). The payout system is a single lump sum per period — no milestone-based splits.
- **No partner agreement / contract management.** We need to track referral agreements, NDA status, and commission terms per partner. There's a "notes" field but nothing structured.
- **Demo mode / no persistent backend.** Broken record at this point, but it applies to everyone.
- **No email notifications.** When a partner's referral closes and their commission is queued, they should get an email. Currently, they'd need to log into the portal and check.

### Deal Breakers
1. **Demo mode / no production backend** — Can't use it without persistent data. This is the only true deal breaker.

### Nice-to-Haves
- Email notifications for partners (deal status changes, payout updates)
- Email-to-deal intake (forward a referral email, auto-create deal)
- Milestone-based payout splits
- Partner agreement tracking
- Simple partner onboarding flow with agreement signature
- Referral link tracking (unique URLs per partner for inbound referrals)

### Overall Verdict: **BUY (once production-ready)**
This is the best fit of all five companies. The referral workflow, partner portal, and payout management solve our three biggest problems. Simple mode strips away enterprise complexity. Free tier covers us initially, Growth tier is within budget. The UX is clean, the data model maps directly to our workflow, and the attribution engine (first touch) is the right model for referrals. **The only blocker is that the product isn't actually production-ready.** It's running on in-memory demo data with no persistent backend. The second they ship a working backend with data persistence and basic email notifications, we're signing up. We've been looking for exactly this product for two years, and everything else on the market (PartnerStack, Impact.com) is over-engineered and overpriced for our needs.

### Price Sensitivity
- **Free tier** for initial trial with 10 partners — perfect
- **$299/mo Growth** for all 25 partners — acceptable, good ROI vs. our current ops cost (~$1,500/mo in manual time)
- Would enthusiastically pay **$149/mo** for a mid-tier (15-50 partners, 2-3 users, core features only)
- The pricing gap between Free (10 partners) and Growth ($299/mo, unlimited) is too steep. A $99-149/mo tier for 25-50 partners would capture companies exactly our size.

---

## Summary Matrix

| Dimension | TechCorp (Enterprise) | GrowthStartup (Series A) | CloudMarket (API/Platform) | DistributionPro (B2B) | ConsultCo (Services) |
|---|---|---|---|---|---|
| **First Impression** | Good vision, lacks enterprise proof | "Built for me" | Segment mentioned, not served | Promising, gaps in model | Direct match |
| **Model Fit** | Partial (sales motion fits) | Strong | Poor (product-led ≠ sales-led) | Partial (economics mismatch) | Excellent |
| **Setup Feasibility** | Blocked by no Salesforce | Easy but needs HubSpot | Fundamentally misaligned | Workable via CSV | Easy |
| **Portal Value** | Medium (needs co-sell) | High | Low (needs dev tools) | High | Very High |
| **Payout Value** | Low (needs multi-currency, tiers) | Very High | N/A | Medium (needs volume rebates) | Very High |
| **Attribution Value** | High (if data was there) | Medium | Low (wrong model) | Low-Medium | High (first-touch) |
| **Biggest Gap** | No CRM integration | Demo mode only | Wrong data model entirely | No volume incentives/MDF | Demo mode only |
| **Verdict** | PASS | MAYBE → BUY | PASS | MAYBE | BUY |
| **Price Fit** | Too expensive for what's offered | Free tier perfect | N/A | Growth tier reasonable | Growth tier acceptable |

---

## Key Takeaways for PartnerAI Product Team

### Critical (Blocks All 5 Companies)
1. **Ship a production backend.** Every company hit the same wall: demo data, no persistence. The Convex schema is ready; initialize it and connect the frontend.
2. **Ship at least one CRM integration.** HubSpot or Salesforce — pick the one that's fastest. This unblocks 3 of 5 companies.

### High Priority (Expands TAM)
3. **Add email notifications** for key events (deal closed, payout approved, new referral).
4. **Bridge the pricing gap** between Free (10 partners) and Growth ($299). A $99-149 tier for 25-75 partners captures the SMB sweet spot.
5. **Custom touchpoint types** — the hardcoded 9 types don't cover all partner models.

### Medium Priority (Serves Specific Segments)
6. **Volume incentives and rebate calculations** for distribution/channel companies.
7. **MDF management** (the feature flag exists, build the feature).
8. **Multi-currency support** for enterprise.
9. **Partner hierarchy** (distributor → VAR) for traditional channel.

### Lower Priority (But Strategic)
10. **Event/usage-based attribution** — opens the entire product-led/marketplace segment.
11. **Segment integration** — lets platform companies use PartnerAI.
12. **SSO/SAML** — enterprise requirement but not needed for initial traction.

### What's Already Good
- The attribution engine is genuinely differentiated. Five models with transparent math and visual comparison is better than what most competitors offer.
- The partner portal is the #1 value driver for 3 of 5 companies.
- The UI/UX is modern and clean — better than legacy PRM tools.
- Platform configuration with feature flags is smart product design.
- The data model is well-thought-out (deals, touchpoints, attributions, payouts, audit log) — it just needs to be connected to a real backend and real CRM data.

---

*Reviews based on source code examination of the PartnerAI codebase at `/Users/dylanram/partner-attribution-ai` including schema definitions, frontend pages, demo data, attribution algorithms, and product documentation.*
