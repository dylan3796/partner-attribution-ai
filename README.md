# Partner Attribution AI

**The Partner Intelligence Layer for Your CRM — AI-powered attribution, incentives, and program management on top of the tools you already use.**

> Measure partner impact, automate attribution, and run world-class partner programs. Works with Salesforce, HubSpot, Pipedrive, and any CRM via REST API.

---

## 🎯 What This Is

A Partner Intelligence Layer that sits on top of your CRM to measure partner contribution, calculate attribution, manage incentives, and run partner program operations for:

- **Channel partnerships** — resellers, VARs, system integrators, distributors
- **Technology alliances** — co-selling, co-marketing, integrations
- **Referral programs** — agency partners, consultants, influencers
- **Marketplace ecosystems** — app stores, plugin marketplaces

## ✨ Core Features

### Attribution Engine (5 Models)
- **Equal Split** — fair distribution across all partners
- **First Touch** — credit lead generation
- **Last Touch** — credit deal closers
- **Time Decay** — recency-weighted attribution
- **Role-Based** — custom weights per touchpoint type (referral, demo, proposal, etc.)

### Partner Management
- Partner onboarding & profiles
- Performance analytics & leaderboards
- Commission rate management
- Partner portal (self-service)

### Deal Tracking
- Pipeline management (Open → Won → Lost)
- Touchpoint timeline per deal
- Automatic attribution on deal close
- Revenue tracking & forecasting

### Incentive Management ✅
- Commission calculations & payouts
- Payout approval workflow (pending → approved → paid)
- Bulk payout operations
- Partner earnings summaries
- Export & reporting
- *(Coming: SPIFs, tiered programs, multi-currency)*

### Program Management *(planned)*
- Partner tiers & leveling
- Training & certification tracking
- Co-marketing fund management
- QBR/reporting automation

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS
- **Backend:** Convex (serverless database + real-time functions)
- **Auth:** Convex Auth
- **Charts:** Recharts
- **Type Safety:** TypeScript (strict mode)

## 📂 Project Structure

```
partner-attribution-ai/
├── app/                    # Next.js frontend
├── convex/                 # Backend (schema, queries, mutations)
│   ├── lib/               # Attribution engine & helpers
│   ├── partners/          # Partner CRUD
│   ├── deals/             # Deal management
│   ├── touchpoints/       # Interaction tracking
│   ├── attributions/      # Attribution results
│   └── organizations/     # Org management
├── marketing/              # Landing page prototype (DAY.ai aesthetic)
│   ├── index.html         # Main landing page
│   ├── pages/             # About, pricing, use-cases
│   ├── css/               # Styles
│   └── js/                # Animations
├── public/                 # Static assets
└── docs/                   # Architecture & planning docs
```

## 🚀 Quick Start

```bash
npm install
npx convex dev          # Start backend
npm run dev             # Start frontend
```

Open http://localhost:3000

## 📊 Target Market

| Segment | Examples | Key Pain |
|---------|----------|----------|
| SaaS with channel programs | Salesforce, HubSpot, AWS | Manual attribution in spreadsheets |
| Marketplace operators | Shopify, Atlassian | Can't measure partner ROI |
| Professional services | Consulting firms, agencies | No visibility into referral value |
| Hardware/distribution | Dell, Cisco | Complex multi-tier attribution |

## 📋 Roadmap

- [x] Database schema & indexes
- [x] Attribution engine (5 models)
- [x] Partner CRUD
- [x] Deal management
- [x] Touchpoint tracking
- [x] Landing page prototype
- [x] Frontend dashboard (partners, deals, reports, activity)
- [x] Partner portal (overview, commissions, deals)
- [x] **Payout management** (approve, reject, mark paid, bulk ops)
- [x] Audit trail (complete activity log)
- [ ] Dispute resolution (schema exists, UI pending)
- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] Revenue intelligence & forecasting
- [ ] API & webhooks
- [ ] Multi-currency support

## 📄 License

Private/Proprietary
