# Partner AI — Launch Plan (Minimal Capital)

## What We Have Now
- ✅ Landing page (Day.ai aesthetic, production-ready)
- ✅ Working Attribution API (Express + SQLite, 12 endpoints, 5 attribution models)
- ✅ Full-stack app architecture (Next.js + Convex, designed but not fully built)

## What's Missing to Launch
1. Email capture / waitlist on the landing page
2. A working demo people can try
3. First 10 customers

---

## Phase 1: Validate Demand (Week 1, $0)

### 1. Add Waitlist to Landing Page
- Add email capture form (use Tally.so — free, no code)
- Or embed a Typeform / Google Form
- Track signups with a simple counter on the page

### 2. Deploy Landing Page
- **Vercel** (free) — drag & drop deploy
- Custom domain via Namecheap (~$10/year)
- Add Google Analytics (free)

### 3. Create Distribution Content
- Write a tweet thread: "We spent months building partner attribution in spreadsheets. Here's what we learned and why we built Partner AI."
- Post in relevant communities:
  - r/SaaS, r/startups, r/partnerships
  - IndieHackers
  - Hacker News (Show HN)
  - Partnership Leaders Slack
  - PartnerHacker community
  - LinkedIn (target partnership managers)

### 4. Direct Outreach (50 people)
- Find partnership managers on LinkedIn
- Message: "We're building an AI tool that auto-calculates partner attribution. Would love your feedback on the concept. 5-min call?"
- Goal: 10 conversations, 3 design partners

---

## Phase 2: Build MVP (Weeks 2-3, $0-50/mo)

### Option A: Lightweight MVP (Recommended)
Instead of building the full Next.js app, ship a **Streamlit dashboard** connected to the existing API:

```
Landing Page → Waitlist → Onboarding call → 
API key → They send events via API → 
Dashboard shows attribution
```

- Use Streamlit Cloud (free for public apps)
- Connect to the existing Express API
- Add basic auth (API keys already exist)
- Deploy API on Railway.app ($5/mo hobby plan)

### Option B: No-Code MVP
- Use **Retool** or **Bubble** for the dashboard
- Connect to a **Supabase** database (free tier)
- Build attribution logic as Supabase Edge Functions
- Ship in days, not weeks

### What the MVP Must Do
1. ✅ Accept partner events (API or manual entry)
2. ✅ Track deals through pipeline
3. ✅ Calculate attribution (5 models already built)
4. ✅ Show a dashboard with partner performance
5. ✅ Generate payout reports

---

## Phase 3: Get First 10 Customers (Weeks 3-6, <$100)

### Pricing Strategy (v2 — tracked ARR model)
- **Launch**: $299/mo — up to $1M tracked partner ARR, 10 partners, core attribution
- **Scale**: $799/mo — up to $10M tracked partner ARR, 50 partners, automation + MDF
- **Program**: $1,999/mo — up to $50M tracked partner ARR, unlimited partners, white-label
- **Enterprise**: Custom — $50M+ tracked ARR, SSO/SAML, SLA, on-prem option

### Where to Find Customers
1. **SaaS companies with partner programs** — they all have this problem
2. **Affiliate networks** — manual attribution is their #1 pain
3. **Agencies** — need to attribute revenue to team members/subcontractors
4. **Marketplace platforms** — multi-vendor attribution nightmare

### Sales Motion
1. Offer **free pilot** (30 days, full access)
2. Help them set up in a 30-min onboarding call
3. Show them their first attribution report
4. Convert to paid after they see the value

---

## Phase 4: Scale (Month 2+)

### Build the Moat
- **Integrations**: Stripe, HubSpot, Salesforce, Slack webhooks
- **AI differentiator**: Use LLMs to analyze deal context, not just timestamps
- **Self-serve**: Build the full Next.js dashboard for product-led growth

### Revenue Targets
- Month 1: 3 paying customers = $297/mo
- Month 3: 15 customers = $1,485/mo  
- Month 6: 50 customers = $4,950/mo
- Month 12: 150 customers = $14,850/mo

### Cost Structure (Lean)
- Vercel (free → $20/mo)
- Railway API hosting ($5-20/mo)
- Domain ($10/year)
- LLM API costs (~$50/mo at scale)
- **Total: <$100/mo until revenue covers it**

---

## Immediate Action Items

### Today
- [ ] Add email capture to landing page
- [ ] Deploy to Vercel
- [ ] Write first distribution post

### This Week
- [ ] Reach out to 20 partnership managers on LinkedIn
- [ ] Post in 3 communities
- [ ] Get 5 waitlist signups

### Next Week
- [ ] Ship Streamlit dashboard MVP
- [ ] Deploy API to Railway
- [ ] Onboard first design partner

---

## Competitive Landscape

| Tool | What They Do | Pricing | Gap |
|------|-------------|---------|-----|
| PartnerStack | Full partner management | $500+/mo | Expensive, no AI |
| Impact.com | Affiliate/partner tracking | Enterprise pricing | Overkill for SMBs |
| Crossbeam | Account mapping | Free-$500/mo | No attribution |
| Reveal | Account mapping | Free-$500/mo | No attribution |
| Kiflo | PRM for SMBs | $149/mo | Basic attribution |
| **Partner AI** | AI-powered attribution | Free-$99/mo | **AI-native, affordable** |

### Our Wedge
- **PartnerStack/Impact** are too expensive and complex for small-mid SaaS
- **Crossbeam/Reveal** do account mapping but NOT attribution
- **Nobody** is doing AI-powered multi-touch attribution for partner programs
- We're the **Plausible to their Google Analytics** — simpler, cheaper, focused

---

## The Pitch (One-liner)
> "Partner AI calculates who deserves credit for every deal — automatically. Like having a full-time attribution analyst for $99/month."
