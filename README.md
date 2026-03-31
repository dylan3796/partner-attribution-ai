# Covant

**The intelligence layer for your partner business.**

> Track which partners drive which deals. Automate attribution and commissions. Give every partner a self-service portal. All in one platform.

**Live:** [covant.ai](https://covant.ai)

---

## What It Is

Covant is a Partner Intelligence Platform for B2B SaaS companies running reseller, referral, or channel programs. It sits at the intersection of your CRM and your partner ops — tracking every partner relationship, calculating attribution, automating commission rules, and surfacing the data your team actually needs.

**Target customer:** Growing SaaS companies with 5–50 active partners, outgrowing spreadsheets and manual tracking.

---

## Core Product

### Attribution Engine
The foundation everything else runs on. Tracks every partner touchpoint across your pipeline — including unregistered partner influence. Multi-touch attribution models (first-touch, last-touch, time decay, equal split, custom weights). Full audit trail, explainable calculations, zero disputes.

### Commission Rules Engine
Priority-based rule matching. Configure tiered rates by partner type, deal size, territory, or any combination. Rules evaluate automatically on every closed deal. Full history of what was paid, why, and when.

### Deal Registration
Partners self-register deals via the portal. Dashboard shows pending registrations with approve/reject workflow. Approval triggers attribution calculation and audit log entry.

### Payouts Management
Approval workflow (pending → approved → paid), bulk operations, CSV export, per-partner earnings summaries.

### Reconciliation Reports
Quarter/year filter, partner filter, summary cards (owed / paid / outstanding), sortable table, CSV export.

### Partner Portal
A branded self-service workspace for every partner — commissions, deals, performance, and an AI layer that answers their questions. Bi-directional deal sync. Always free with every plan.

### Partner Onboarding Tracking
Progress tracking per partner (profile complete → first deal → first commission). Color-coded status on the partners dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router), React, custom CSS (Inter font) |
| Backend | Convex (serverless DB + real-time functions) |
| Auth | Clerk |
| Deployment | Vercel (auto-deploy on push to `main`) |
| Email | Resend *(configured, pending API key)* |

No Tailwind. No ORM. No separate API layer — Convex handles all backend logic.

---

## Project Structure

```
partner-attribution-ai/
├── app/                    # Next.js pages + layouts
│   ├── page.tsx            # Landing page
│   ├── dashboard/          # Dashboard (partners, deals, payouts, reports, settings)
│   ├── portal/             # Partner portal
│   ├── onboard/            # Onboarding wizard
│   └── [marketing pages]   # pricing, platform, resources, etc.
├── components/             # Shared UI components (Nav, Footer, etc.)
├── convex/                 # Backend schema, queries, mutations
│   ├── schema.ts           # Database schema
│   ├── partners.ts         # Partner CRUD
│   ├── deals.ts            # Deal management
│   ├── attributions.ts     # Attribution engine
│   ├── commissionRules.ts  # Commission rules engine
│   ├── payouts.ts          # Payout management
│   └── leads.ts            # Waitlist/lead capture
├── lib/                    # Client utilities, types, store
└── public/                 # Static assets (logo, etc.)
```

---

## Local Development

```bash
npm install
npx convex dev          # Start Convex backend (dev deployment)
npm run dev             # Start Next.js frontend
```

Open [http://localhost:3000](http://localhost:3000)

**Note:** Production uses a separate Convex deployment (`strong-malamute-794`). Do not run `npx convex deploy` without intent to update production.

---

## Environment Variables

```env
NEXT_PUBLIC_CONVEX_URL=        # Convex deployment URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
RESEND_API_KEY=                # Email (pending)
ADMIN_SECRET=                  # Admin dashboard basic auth
```

---

## Deployment

Push to `main` → Vercel auto-deploys. No manual steps required.

Convex production deployment is separate — run `npx convex deploy --yes` only when intentionally updating backend schema or functions.

---

## Roadmap

### Done
- [x] Attribution engine (multi-touch, full audit trail)
- [x] Commission rules engine (priority-based, CRUD UI)
- [x] Deal registration workflow (partner self-serve + approval)
- [x] Payouts management (approval workflow, bulk ops, CSV export)
- [x] Reconciliation reports
- [x] Partner portal (commissions, deals, performance, AI Q&A)
- [x] Partner onboarding tracking
- [x] Clerk auth + onboarding wizard
- [x] Landing page (covant.ai)

### In Progress
- [ ] CRM connector — Salesforce/HubSpot OAuth (code ready, needs Connected App credentials)
- [ ] Email notifications via Resend (code ready, needs API key)

### Next
- [ ] Relationship discovery (scan CRM history for untracked partner involvement)
- [ ] Recommendation engine (which partner belongs on this deal)
- [ ] QBR report automation

---

## License

Private / Proprietary — © 2026 Covant, Inc.
