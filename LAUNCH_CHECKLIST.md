# Launch Checklist — PartnerBase

> Everything needed to go from prototype to first 5 paying customers.
> Status: 🔴 Not started · 🟡 In progress · 🟢 Done

---

## 1. Legal & Business

### Entity Formation
- [ ] **Incorporate as Delaware C-Corp** — Standard for VC-fundable SaaS startups. Use Stripe Atlas ($500) or Clerky (~$800) for a clean, investor-ready setup. Delaware C-Corp is non-negotiable if you plan to raise.
- [ ] **Register as foreign entity in CA** — Required since you operate from California. File with CA Secretary of State (~$800 + annual $800 franchise tax).
- [ ] **Apply for EIN** — Free via IRS.gov, instant online. Needed for bank accounts, hiring, Stripe.
- [ ] **Open business bank account** — Mercury or Brex (startup-friendly, no fees, integrates with accounting tools).
- [ ] **Set up accounting** — QuickBooks Online or Pilot.co (automated bookkeeping for startups). Track expenses from day one.

### Legal Documents
- [ ] **Terms of Service** — Use Termly.io to generate a baseline, then have a startup attorney review ($500-1,000). Key clauses:
  - Service availability / uptime SLA
  - Data ownership (customer owns their data)
  - Liability limitations
  - Acceptable use policy
  - Termination and data portability
- [ ] **Privacy Policy** — Required for compliance. Cover:
  - What data you collect (partner data, deal data, touchpoints)
  - How you use it (attribution calculations, analytics)
  - Third-party processors (Convex, Vercel, Stripe, any AI providers)
  - Data retention and deletion policies
  - GDPR & CCPA rights (even if not required yet — future-proof)
- [ ] **Data Processing Agreement (DPA)** — Enterprise customers will require this. Template from Convex's DPA + customize. Cover:
  - Data processing scope
  - Sub-processor list
  - Data breach notification (72-hour window)
  - Data deletion on contract termination
  - Cross-border transfer mechanisms (SCCs for EU)
- [ ] **Mutual NDA template** — For sales conversations with enterprise prospects. Keep it simple, mutual, 2-year term.

### IP & Brand
- [ ] **Trademark search for "PartnerBase"** — Check USPTO TESS database. Risk: "Partner" is generic in this space, "AI" is descriptive. Consider:
  - Search [USPTO TESS](https://tess2.uspto.gov/)
  - Also check [Namechk](https://namechk.com/) for social handles
  - If clear, file intent-to-use trademark application (~$350/class via USPTO, or $1,500-2,500 via attorney)
  - **Backup names** if "PartnerBase" is contested: PartnerGraph, Attribly, PartnerIntel
- [ ] **Domain acquisition** — Secure:
  - `partnerai.com` (primary — check availability / broker if taken)
  - `getpartnerai.com` (fallback)
  - `partnerai.io` (tech credibility)
  - `partnerai.dev` (for API docs)
- [ ] **Social handles** — Register on LinkedIn, X/Twitter, Discord, YouTube before launch

### Insurance
- [ ] **General liability insurance** — $500-1,000/year via Vouch or Embroker (startup-focused)
- [ ] **Errors & Omissions (E&O)** — Critical for a platform that handles financial attribution and payouts. $1,500-3,000/year.
- [ ] **Cyber liability insurance** — Covers data breaches. $1,000-2,000/year. Required by some enterprise customers.

---

## 2. Infrastructure & DevOps

### Production Deployment
- [ ] **Vercel production project** — Separate from development project:
  - Production branch: `main`
  - Preview branches: all PRs
  - Region: `iad1` (US East) for low latency to most US customers
  - Enable Vercel Analytics + Web Vitals
- [ ] **Convex production deployment** — Separate from dev deployment:
  - Create production deployment via `npx convex deploy`
  - Configure environment variables (API keys, secrets)
  - Set up Convex dashboard access for team
- [ ] **Environment separation:**
  - `development` — local, each developer
  - `staging` — mirrors production, for QA and demos
  - `production` — customer-facing, zero-downtime deploys
  - Use Convex's built-in environment support

### Domain & SSL
- [ ] **Custom domain on Vercel** — `app.partnerai.com` for the product, `partnerai.com` for marketing
- [ ] **SSL/HTTPS** — Automatic via Vercel (Let's Encrypt). Verify:
  - HSTS enabled
  - No mixed content
  - Certificate auto-renewal working
- [ ] **Email domain** — Set up Google Workspace or similar on `partnerai.com`:
  - `hello@partnerai.com` (support)
  - `founders@partnerai.com` (sales)
  - Configure SPF, DKIM, DMARC records

### Monitoring & Observability
- [ ] **Error monitoring — Sentry** ($26/mo Developer plan):
  - Install `@sentry/nextjs` in the app
  - Configure source maps upload in Vercel build
  - Set up Slack alerts for new errors
  - Create alert rules: P0 (page load failures, API crashes), P1 (attribution calculation errors), P2 (UI glitches)
- [ ] **Uptime monitoring — Better Uptime or Checkly** (free tier):
  - Monitor: `app.partnerai.com`, `partnerai.com`, Convex API endpoints
  - Status page: `status.partnerai.com` (builds trust with customers)
  - Alert channels: Slack + SMS for P0
- [ ] **Analytics — PostHog** (recommended over Mixpanel for startups, generous free tier):
  - Product analytics (feature usage, funnel analysis)
  - Session recordings (watch users struggle → fix UX)
  - Feature flags (gradual rollouts)
  - Key events to track:
    - User signup / onboarding completion
    - Attribution model configured
    - First attribution calculation run
    - Partner invited / portal viewed
    - Payout initiated
    - Integration connected
- [ ] **Logging — Convex dashboard + Vercel logs**:
  - Convex provides built-in function logging
  - For additional observability, pipe logs to Axiom (Vercel integration, free tier)
  - Log structured data: `{ action, userId, orgId, duration, success }`

### Backup & Recovery
- [ ] **Convex backup strategy:**
  - Convex handles database replication automatically
  - Set up scheduled data exports (weekly) to a separate storage (S3 or similar)
  - Document recovery procedures
  - Test restore from backup quarterly
- [ ] **Code backup:**
  - GitHub repo with branch protection on `main`
  - Require PR reviews before merge
  - Enable GitHub Advanced Security (free for public repos)

### Security Checklist (OWASP Top 10)
- [ ] **Authentication** — Convex Auth or Clerk. Enforce:
  - Email verification
  - Password complexity requirements
  - Rate limiting on login attempts
  - Session timeout (24h inactive)
- [ ] **Authorization** — Row-level security in Convex:
  - Users can only access their organization's data
  - Partner portal users see only their own data
  - Admin vs member vs partner role hierarchy
- [ ] **Input validation** — Convex validators on all mutations:
  - Validate all API inputs server-side
  - Sanitize any user-generated content displayed in UI
- [ ] **HTTPS everywhere** — No HTTP endpoints, even for redirects
- [ ] **Dependency scanning** — `npm audit` in CI, Dependabot alerts on GitHub
- [ ] **Secrets management** — All API keys in Vercel/Convex env vars, never in code
- [ ] **CORS configuration** — Restrict to your domains only
- [ ] **Rate limiting** — On API endpoints, especially public-facing ones
- [ ] **CSP headers** — Content Security Policy via Vercel config

### SOC 2 Considerations
- [ ] **Not needed at launch** — but start tracking when you hit ~$500K ARR or get enterprise deals requiring it.
- [ ] **Pre-SOC 2 actions (do now):**
  - Use SSO for internal tools (Google Workspace)
  - Enable 2FA for all team accounts (GitHub, Vercel, Convex, Stripe)
  - Document access control policies
  - Keep a log of who has access to what
  - Use Vanta or Drata ($5K-15K/year) when ready to pursue certification

---

## 3. Product Readiness

### Minimum Feature Set (First 5 Customers)
These are the must-haves. Everything else is "nice to have."

| Feature | Status | Notes |
|---------|--------|-------|
| Attribution engine (multi-model) | ✅ Done | Core differentiator |
| Dashboard (deals, partners, attribution results) | 🟡 | Basic version needed |
| Partner management (CRUD) | 🟡 | Add, edit, deactivate partners |
| Deal import (CSV + manual entry) | 🔴 | Critical — first customers won't have API integration |
| Touchpoint tracking (manual + basic auto) | 🔴 | Start manual, automate later |
| Commission calculation | 🔴 | Based on attribution %, configurable rates |
| Basic reporting (export to CSV/PDF) | 🔴 | Executives need something to share |
| User auth + org management | 🔴 | Multi-user, single org for V1 |
| Partner portal (read-only view) | 🔴 | Partners see their performance — key differentiator |

**Explicitly NOT in V1:**
- CRM integrations (Phase 3)
- Automated payout processing (manual approval + export for now)
- Content library
- Predictive analytics
- Multi-tier distribution
- White-label portal

### Onboarding Flow
- [ ] **Design and implement guided onboarding:**
  1. Sign up → verify email → create organization
  2. "Choose your use case" (SaaS channel, marketplace, services/agency, other)
  3. Import partners (CSV upload or manual add — minimum 3)
  4. Import deals (CSV upload or manual — minimum 5)
  5. Choose attribution model (recommend one based on use case)
  6. See first attribution results → "Aha!" moment
  7. Invite team members (optional but prompted)
- [ ] **Onboarding checklist widget** — Persistent sidebar showing progress (like Linear's onboarding)
- [ ] **Time to value target:** < 15 minutes from signup to first attribution result

### Demo Environment
- [ ] **Public sandbox** at `demo.partnerai.com`:
  - Pre-loaded with realistic sample data (50 partners, 200 deals, 5,000 touchpoints)
  - Read-only, resets daily
  - No signup required — shareable link
  - Used for: sales demos, investor pitches, content marketing
- [ ] **"Try with your data" mode** — Upload a CSV, see attribution results without creating an account

### Documentation
- [ ] **User guide** — In-app help center or Notion/GitBook docs site:
  - Getting started guide (mirrors onboarding)
  - Attribution models explained (with examples)
  - CSV import format specification
  - Partner portal guide (share with partners)
  - FAQ
- [ ] **API documentation** — When API is ready (Phase 2+):
  - OpenAPI/Swagger spec
  - Authentication guide
  - Rate limits
  - Code examples (cURL, JavaScript, Python)
- [ ] **Changelog** — Public changelog at `partnerai.com/changelog`. Update with every release.

### Feedback & Support
- [ ] **In-app feedback widget** — Canny or simple form. Capture:
  - Feature requests
  - Bug reports
  - General feedback
- [ ] **Support channel:**
  - Intercom or Crisp for in-app chat ($0-74/mo for early stage)
  - Shared Slack channel with each early customer (high-touch for first 5)
  - `support@partnerai.com` as fallback
- [ ] **Bug reporting** — Sentry for automatic error capture + in-app "Report a bug" button
- [ ] **Customer success check-ins** — Weekly 15-min call with each of first 5 customers for first month

---

## 4. Financial

### Billing Setup
- [ ] **Stripe account** — Use Stripe Billing for subscriptions:
  - Create products: Starter ($49/mo), Growth ($299/mo), Enterprise (custom)
  - Configure subscription plans (monthly + annual with 20% discount)
  - Set up Stripe Customer Portal (self-service plan management)
  - Test webhooks: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
  - Connect to your Mercury bank account for payouts
- [ ] **Pricing page** — Implement on marketing site:
  - 3-tier pricing table (Starter / Growth / Enterprise)
  - Feature comparison matrix
  - Annual toggle showing savings
  - "Talk to sales" for Enterprise
  - FAQ section addressing common pricing questions
- [ ] **Invoice generation** — Stripe handles this automatically:
  - Customize invoice template with PartnerBase branding
  - Auto-email invoices to billing contacts
  - Support for net-30 terms (enterprise)

### Revenue Tracking
- [ ] **Metrics dashboard** — Use Stripe dashboard + ChartMogul (free under $10K MRR):
  - MRR / ARR
  - Customer count by tier
  - Churn rate (monthly, quarterly)
  - Average Revenue Per Account (ARPA)
  - Net Revenue Retention (NRR)
  - Expansion revenue (upgrades)

### Cost Projections (First 6 Months)

| Category | Monthly Cost | Notes |
|----------|-------------|-------|
| **Infrastructure** | | |
| Vercel Pro | $20 | Covers production + previews |
| Convex (Professional) | $25-50 | Based on usage, generous free tier |
| Domain + DNS | ~$15/mo avg | One-time costs amortized |
| **Services** | | |
| Sentry (Developer) | $26 | Error monitoring |
| PostHog (Free) | $0 | Free up to 1M events/mo |
| Intercom (Starter) | $74 | Customer support chat |
| Google Workspace | $7/user | Email, docs |
| GitHub Team | $4/user | Code hosting |
| **AI/LLM Costs** | | |
| OpenAI / Anthropic API | $50-200 | Depends on attribution volume |
| **Legal & Compliance** | | |
| Attorney (amortized) | ~$200 | Initial setup spread over 6 months |
| Insurance | ~$200 | E&O + cyber liability |
| **Total (solo founder)** | **~$620-800/mo** | |
| **Total (2-person team)** | **~$700-900/mo** | |

**Runway planning:**
- At $800/mo burn, $10K covers ~12 months of infrastructure
- First paying customer at Growth tier ($299/mo) covers ~40% of operating costs
- 3 Growth customers = cash-flow positive on infrastructure

### When to Raise (& What Metrics You Need)

| Stage | Trigger | Metrics Needed |
|-------|---------|---------------|
| **Pre-seed ($250K-$1M)** | Product-market fit signals | 5-10 paying customers, clear ICP, strong retention (>90% monthly) |
| **Seed ($1M-$4M)** | Ready to scale | $10K+ MRR, NRR >100%, CAC payback <12 months, repeatable sales motion |
| **Series A ($5M-$15M)** | Proven growth engine | $100K+ MRR, growing 15-20% MoM, <5% monthly churn, multiple expansion paths |

**Investor readiness checklist:**
- [ ] Deck (12-15 slides): Problem, solution, demo, market size, traction, team, ask
- [ ] Financial model (3-year projections)
- [ ] Cap table (use Carta or Pulley from day one)
- [ ] Data room (key docs organized in Google Drive/Notion)

---

## 5. Team

### Roles to Hire (In Order)

**Hire #1: Founding Engineer (Full-Stack)** — Month 2-3
- Why: You need a second builder to ship faster. Attribution engine is done; now you need integrations, portal, and polish.
- Profile: Strong in React/TypeScript + backend. Bonus if they know Convex.
- Comp: $120-160K + 1-3% equity (early stage)
- Full-time preferred — this is your co-builder.

**Hire #2: Growth / Marketing (Part-Time or Contractor)** — Month 3-4
- Why: You need pipeline. Content marketing + SEO + outbound to fill demos.
- Profile: B2B SaaS marketing experience, can write well, run experiments.
- Comp: $3-5K/mo contractor, or $80-100K if full-time
- Contractor OK — test fit before committing.

**Hire #3: Customer Success / Solutions Engineer** — Month 4-6
- Why: When you have 5-10 customers, you need someone ensuring they succeed.
- Profile: Technical enough to do onboarding, empathetic enough to handle support.
- Comp: $80-120K + equity
- Could be a senior contractor initially.

### Contractor vs Full-Time Decision Matrix

| Role | Contractor | Full-Time | Recommendation |
|------|-----------|-----------|---------------|
| Core engineering | ❌ | ✅ | IP ownership, alignment, speed |
| Design (UI/UX) | ✅ | ❌ | Project-based, use Toptal or Dribbble |
| Marketing content | ✅ | ❌ | Until you have repeatable playbook |
| Legal | ✅ | ❌ | Always contractor at this stage |
| Accounting/Bookkeeping | ✅ | ❌ | Use Pilot or bench.co |
| DevOps | ❌ | ❌ | Not needed — Vercel + Convex handle it |
| Customer success | ✅ → FT | — | Start contractor, convert when working |

### Advisory Board (Who to Recruit)

Build a 3-5 person advisory board. Offer 0.25-0.5% equity each, 2-year vesting, for ~2 hours/month.

| Advisor Profile | Why | Where to Find |
|----------------|-----|---------------|
| **VP of Partnerships at a SaaS company** | Knows the buyer, validates product, opens doors | LinkedIn outreach, partnership conferences |
| **Former founder of a PRM/partner tool** | Been there, strategic guidance, investor intros | Check Crunchbase for acquired/exited companies |
| **Enterprise sales leader** | Help navigate first enterprise deals, pricing | Your existing network, warm intros |
| **Data/ML engineer** | Guide attribution model development, technical credibility | AI/ML meetups, former colleagues |
| **Channel ecosystem expert (analyst/consultant)** | Market credibility, speaking opportunities, content | Forrester/Gartner alumni, Jay McBain types |

---

## 6. Go-To-Market (First 5 Customers)

### Ideal Customer Profile (ICP) for Launch
- **Company size:** 50-500 employees (big enough to have partners, small enough to decide fast)
- **Partner program maturity:** 10-50 active partners (enough to need tooling, not so large they're locked into incumbents)
- **Current tooling:** Spreadsheets, basic CRM tracking, or outgrowing PartnerStack/Crossbeam
- **Trigger events:** New VP of Partnerships hired, partner program relaunched, switching CRMs
- **Industry:** B2B SaaS (most accessible, fastest sales cycle for this tool)

### Launch Sequence

**Week 1-2: Pre-Launch**
- [ ] Waitlist is live and collecting emails ✅
- [ ] LinkedIn content (3 posts/week about attribution challenges)
- [ ] Identify 20 target prospects via LinkedIn Sales Navigator
- [ ] Personal outreach to 10 people (warm intros > cold)

**Week 3-4: Beta Launch (5 Users)**
- [ ] Invite 5 beta users from waitlist
- [ ] Offer: Free for 3 months, then 50% off first year
- [ ] Weekly check-in calls with each user
- [ ] Collect testimonials / video testimonials
- [ ] Fix critical bugs, prioritize feedback

**Week 5-8: Paid Launch**
- [ ] Convert beta users to paid
- [ ] Publish 2 case studies from beta users
- [ ] Launch on Product Hunt
- [ ] Post in partner/channel communities (Partnership Leaders, PartnerHacker)
- [ ] First paid ads experiment (LinkedIn, $500 budget)

---

## Priority Order (What to Do THIS WEEK)

1. **Incorporate** — Delaware C-Corp via Stripe Atlas
2. **Set up Stripe** — Get billing infrastructure ready
3. **Finish core dashboard** — The product needs to be demoable
4. **Create demo environment** — Pre-loaded with sample data
5. **Set up Sentry + PostHog** — You need to see errors and usage
6. **Start LinkedIn content** — Build audience while building product
7. **Reach out to 5 warm contacts** — Validate ICP, get early commitments

---

*Last updated: 2026-02-06*
*Owner: Dylan*
