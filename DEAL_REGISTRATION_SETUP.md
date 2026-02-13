# Deal Registration Feature - Deployment Guide

## What's Been Built

✅ **Backend (Convex)**
- `convex/deals.ts` - Deal registration mutations and queries
- Schema already supports deal registration (deals table has `registeredBy`, `registrationStatus`)

✅ **Partner Portal**
- `/portal/deals` - Partner-facing deal list + registration form
- Real-time Convex integration (replaces mock data)
- Duplicate deal detection
- Registration status tracking

✅ **Internal Sales Review**
- `/deals` - Sales team deal registration queue
- `/deals/[id]` - Individual deal review page with approve/reject workflow
- Pending/approved/rejected stats dashboard

✅ **App Infrastructure**
- ConvexProvider added to app
- Ready for Convex deployment

## Deployment Steps

### 1. Initialize Convex (one-time)

```bash
cd /Users/dylanram/partner-attribution-ai
npx convex init
```

This will:
- Create `convex.json`
- Prompt you to create/select a Convex project
- Generate `.env.local` with `NEXT_PUBLIC_CONVEX_URL`

### 2. Deploy Convex Functions

```bash
npx convex dev
```

This will:
- Push schema and functions to Convex
- Watch for changes
- Show your Convex dashboard URL

### 3. Add Seed Data (Optional)

You'll need at least one organization and partner in Convex to test. Create seed data in Convex dashboard or via mutations.

### 4. Update Hard-Coded IDs

Replace placeholder IDs in:
- `/app/deals/page.tsx` - Line 10 (orgId)
- `/app/portal/deals/page.tsx` - Lines 11-12 (partnerId, orgId)
- `/app/deals/[id]/page.tsx` - Lines 38, 56 (reviewerId)

These should come from real auth once you add authentication.

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Add Deal Registration feature with Convex backend"
git push origin main
```

Add `NEXT_PUBLIC_CONVEX_URL` to Vercel environment variables (from `.env.local`).

### 6. Set Up Authentication (Future)

Currently using placeholder user/partner/org IDs. Add proper auth:
- Clerk, Auth0, or NextAuth
- Store user→partner→org mapping in Convex
- Pass real IDs to queries/mutations

## Features

### Partner Portal (`/portal/deals`)
- ✅ Register new deals
- ✅ View all submitted deals
- ✅ Track registration status (pending/approved/rejected)
- ✅ Duplicate detection
- ✅ Real-time updates

### Sales Review (`/deals`)
- ✅ Pending deals queue
- ✅ All deal registrations table
- ✅ Deal detail page with full context
- ✅ Approve workflow (with optional notes)
- ✅ Reject workflow (with required reason)
- ✅ Audit logging
- ✅ Stats dashboard

### Convex Backend
- ✅ Deal registration mutation
- ✅ Approve/reject mutations
- ✅ Partner deal queries
- ✅ Pending deals query
- ✅ Deal detail query
- ✅ Automatic touchpoint creation
- ✅ Approval workflow tracking
- ✅ Audit logs

## What's Next

1. **Authentication** - Replace placeholder IDs with real user auth
2. **Notifications** - Email/Slack when deals approved/rejected
3. **Conflict Detection UI** - Show duplicate deals before submission
4. **Deal History** - Timeline of status changes
5. **Attribution Calculation** - Auto-calculate commission on approval
6. **Export** - CSV export of deal registrations

## Architecture

```
User submits deal (Partner Portal)
  → registerDeal mutation
    → Creates deal with registrationStatus="pending"
    → Creates touchpoint (type="deal_registration")
    → Creates approval workflow entry
    → Returns dealId

Sales reviews deal
  → getDeal query (shows full context)
  → approveDealRegistration mutation
    → Updates registrationStatus="approved"
    → Updates approval workflow
    → Logs audit entry
  OR
  → rejectDealRegistration mutation
    → Updates registrationStatus="rejected"
    → Updates approval workflow
    → Logs audit entry with reason

Partner views status
  → getPartnerDeals query
    → Shows all their deals with registration status
```

## Questions?

Check Convex docs: https://docs.convex.dev
