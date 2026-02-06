# 🏗️ PARTNER ATTRIBUTION PLATFORM - SYSTEM ARCHITECTURE

**Last Updated:** 2026-02-03  
**Target Scale:** 10,000+ customers on Convex free tier  
**Performance Goal:** Sub-second API responses

---

## 📐 SYSTEM OVERVIEW

### Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Backend:** Convex (serverless, reactive)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Deployment:** Vercel (frontend) + Convex (backend)

### Architecture Pattern
**Three-Layer Architecture:**
```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Next.js App Router)            │
│  - Server Components (default)                      │
│  - Client Components (interactive UI)               │
│  - Streaming SSR                                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER (Convex Functions)            │
│  - Queries (read operations)                        │
│  - Mutations (write operations)                     │
│  - Actions (external API calls)                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  DATA LAYER (Convex Database)                       │
│  - Document-based storage                           │
│  - Automatic indexing                               │
│  - Real-time subscriptions                          │
└─────────────────────────────────────────────────────┘
```

---

## 🗄️ DATA MODEL

### Schema Design Principles
1. **Multi-tenancy:** Every table has `organizationId` for data isolation
2. **Indexing Strategy:** Composite indexes on common query patterns
3. **Denormalization:** Strategic denormalization for read performance
4. **Soft Deletes:** Status fields instead of hard deletes

### Core Entities

#### Organizations (Tenants)
```typescript
organizations: {
  name: string
  email: string
  apiKey: string               // For API authentication
  plan: "starter" | "growth" | "enterprise"
  stripeCustomerId?: string
  createdAt: number
}
Indexes: email, apiKey
```

#### Partners
```typescript
partners: {
  organizationId: Id<"organizations">
  name: string
  email: string
  type: "affiliate" | "referral" | "reseller" | "integration"
  commissionRate: number       // 0-100 percentage
  status: "active" | "inactive" | "pending"
  createdAt: number
}
Indexes: organizationId, email
```

#### Deals (Sales Opportunities)
```typescript
deals: {
  organizationId: Id<"organizations">
  name: string
  amount: number
  status: "open" | "won" | "lost"
  closedAt?: number
  createdAt: number
}
Indexes: organizationId, status
```

#### Touchpoints (Partner Interactions)
```typescript
touchpoints: {
  organizationId: Id<"organizations">
  dealId: Id<"deals">
  partnerId: Id<"partners">
  type: "referral" | "demo" | "content_share" | "introduction" | 
        "proposal" | "negotiation"
  weight?: number              // For role-based attribution
  notes?: string
  createdAt: number
}
Indexes: dealId, partnerId, organizationId
```

#### Attributions (Calculated Results)
```typescript
attributions: {
  organizationId: Id<"organizations">
  dealId: Id<"deals">
  partnerId: Id<"partners">
  model: "equal_split" | "first_touch" | "last_touch" | 
         "time_decay" | "role_based"
  percentage: number           // 0-100
  amount: number              // Deal amount * percentage
  commissionAmount: number    // amount * partner.commissionRate
  calculatedAt: number
}
Indexes: dealId, partnerId, organizationId, model
```

#### Payouts
```typescript
payouts: {
  organizationId: Id<"organizations">
  partnerId: Id<"partners">
  amount: number
  status: "pending" | "processing" | "paid" | "failed"
  paidAt?: number
  createdAt: number
}
Indexes: partnerId, status, organizationId
```

---

## 🔧 BACKEND ARCHITECTURE (Convex)

### Function Organization
```
convex/
├── schema.ts                    # Database schema (✓ exists)
├── _generated/                  # Auto-generated types
│
├── lib/                         # Shared utilities
│   ├── attribution.ts           # Attribution algorithms
│   ├── validation.ts            # Input validators
│   └── helpers.ts               # Common helpers
│
├── organizations/               # Organization domain
│   ├── queries.ts
│   └── mutations.ts
│
├── partners/                    # Partners domain
│   ├── queries.ts
│   └── mutations.ts
│
├── deals/                       # Deals domain
│   ├── queries.ts
│   └── mutations.ts
│
├── touchpoints/                 # Touchpoints domain
│   ├── queries.ts
│   └── mutations.ts
│
├── attributions/                # Attribution domain
│   ├── queries.ts
│   ├── mutations.ts
│   └── calculate.ts             # Attribution calculation logic
│
└── payouts/                     # Payouts domain
    ├── queries.ts
    └── mutations.ts
```

### Key Functions

#### Attribution Calculation (Core Algorithm)
**Location:** `convex/attributions/calculate.ts`

**Algorithms:**

1. **Equal Split**
   - Each partner gets equal share: `100% / number_of_partners`
   - Simple, fair when all contributions are equal
   - O(1) complexity

2. **First Touch**
   - 100% to the partner with earliest touchpoint
   - Good for awareness campaigns
   - O(n) to find earliest

3. **Last Touch**
   - 100% to the partner with latest touchpoint
   - Good for closer/conversion tracking
   - O(n) to find latest

4. **Time Decay**
   - Exponential decay: more recent = higher weight
   - Formula: `weight = e^(-λ * days_ago)`
   - λ (lambda) = decay rate (default: 0.1)
   - O(n) with sorting

5. **Role-Based**
   - Custom weights per touchpoint type
   - Defaults: referral(30%), demo(25%), proposal(25%), negotiation(20%)
   - O(n) with weight lookup

**Performance Optimization:**
- Pre-calculate on deal close (mutation)
- Cache results in `attributions` table
- No real-time recalculation

### Query Optimization Patterns

**Pattern 1: Paginated Queries**
```typescript
// GOOD: Limit results, use cursor pagination
query({
  args: { orgId, cursor, limit: 50 },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deals")
      .withIndex("by_organization", q => q.eq("organizationId", args.orgId))
      .order("desc")
      .paginate(args);
  }
});
```

**Pattern 2: Aggregation Caching**
```typescript
// For dashboard stats, cache in separate table if needed
// OR use Convex scheduled functions to pre-compute
```

**Pattern 3: Denormalization**
```typescript
// Store partner count on deals to avoid joins
deal: {
  partnersCount: number,  // Updated via mutation
  lastTouchAt: number
}
```

---

## 🎨 FRONTEND ARCHITECTURE

### Component Structure
```
app/
├── layout.tsx                   # Root layout
├── page.tsx                     # Landing/auth page
├── globals.css                  # Global styles
│
├── dashboard/                   # Main app (protected)
│   ├── layout.tsx               # Dashboard layout (sidebar, nav)
│   ├── page.tsx                 # Overview/home
│   │
│   ├── partners/                # Partner management
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx
│   │
│   ├── deals/                   # Deal tracking
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx
│   │
│   ├── attribution/             # Attribution views
│   │   ├── page.tsx
│   │   └── [dealId]/page.tsx
│   │
│   └── payouts/                 # Payout management
│       └── page.tsx
│
├── api/                         # API routes (for webhooks)
│   └── webhook/
│       └── stripe/route.ts
│
└── components/                  # Shared components
    ├── ui/                      # Base UI components
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Table.tsx
    │   └── ...
    │
    ├── charts/                  # Chart components
    │   ├── AttributionChart.tsx
    │   └── RevenueChart.tsx
    │
    └── forms/                   # Form components
        ├── PartnerForm.tsx
        └── DealForm.tsx
```

### Component Patterns

**1. Server Components (Default)**
- Use for initial data fetching
- Streaming with `loading.tsx`
- No JavaScript to client unless needed

**2. Client Components (Interactive)**
```typescript
'use client'
import { useQuery } from 'convex/react'

export function PartnerList() {
  const partners = useQuery(api.partners.queries.list, { orgId })
  // Auto-subscribes to real-time updates!
}
```

**3. Optimistic Updates**
```typescript
const mutation = useMutation(api.partners.mutations.update)

const handleUpdate = async (data) => {
  // UI updates immediately, then syncs
  await mutation({ id, ...data })
}
```

---

## 🚀 SCALABILITY STRATEGY

### Current Limits (Convex Free Tier)
- **Database:** 8 GB storage
- **Bandwidth:** 1 GB/month
- **Function Calls:** 1M/month
- **Concurrent Connections:** 100

### Capacity Planning

**Per Customer Estimate:**
- Partners: 10-50 (avg: 25)
- Deals/month: 5-20 (avg: 10)
- Touchpoints/deal: 2-10 (avg: 5)
- Attributions/deal: 5 (one per model)

**Storage per Customer:**
```
Organizations:  1 KB
Partners:       25 × 0.5 KB = 12.5 KB
Deals:          120/year × 1 KB = 120 KB
Touchpoints:    600/year × 0.5 KB = 300 KB
Attributions:   600/year × 1 KB = 600 KB
Payouts:        50/year × 0.5 KB = 25 KB
─────────────────────────────────────────
Total:          ~1 MB/customer/year
```

**10,000 Customers = ~10 GB → Fits in free tier (8 GB tight)**

### Optimization Strategies

#### 1. Data Lifecycle Management
```typescript
// Archive old deals after 2 years
scheduled("daily", async (ctx) => {
  const twoYearsAgo = Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)
  
  // Move to archival table or mark as archived
  const oldDeals = await ctx.db
    .query("deals")
    .filter(q => q.lt(q.field("createdAt"), twoYearsAgo))
    .collect()
  
  // Archive logic here
})
```

#### 2. Query Efficiency
- **Always use indexes** — avoid table scans
- **Limit result sets** — paginate everything
- **Denormalize reads** — pre-compute aggregates

#### 3. Caching Layer (When Needed)
```typescript
// For dashboard stats (low mutation frequency)
dashboardStats: defineTable({
  organizationId: Id<"organizations">,
  totalRevenue: number,
  partnersCount: number,
  dealsCount: number,
  lastCalculated: number
})
.index("by_organization", ["organizationId"])

// Update via scheduled function every hour
```

#### 4. Horizontal Scaling Triggers

**When to upgrade from free tier:**
- Database > 6 GB (75% capacity)
- Function calls > 750K/month (75% capacity)
- Response times > 500ms p95

**Migration Path:**
```
Free Tier ($0)
    ↓ (8GB or 100+ concurrent users)
Starter ($25/mo) - 100 GB, 10M calls
    ↓ (1000+ customers)
Professional ($75/mo) - 500 GB, 50M calls
    ↓ (10K+ customers)
Custom Enterprise
```

---

## ⚡ PERFORMANCE BENCHMARKS

### Target Metrics

**API Response Times (p95):**
- List queries (50 items): < 100ms
- Detail queries (single item): < 50ms
- Mutations (writes): < 200ms
- Attribution calculation: < 500ms

**Page Load Times (p95):**
- Dashboard: < 1s (SSR + streaming)
- Partner list: < 800ms
- Deal detail: < 600ms

**Concurrent Users:**
- Free tier: 100 simultaneous connections
- Expected usage: 50-80 at peak (10K customers, 0.5-0.8% concurrency)

### Performance Testing

**Load Testing Script:**
```typescript
// Use k6 or artillery for load testing
import http from 'k6/http'
import { check } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Sustain
    { duration: '2m', target: 0 },    // Ramp down
  ],
}

export default function () {
  const res = http.get('https://your-app.vercel.app/api/partners')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  })
}
```

---

## 🔒 SECURITY ARCHITECTURE

### Multi-Tenancy Isolation

**1. Organization-Level Security**
```typescript
// Every query checks organizationId
const partners = await ctx.db
  .query("partners")
  .withIndex("by_organization", q => 
    q.eq("organizationId", args.organizationId)
  )
  .collect()
```

**2. API Key Authentication**
```typescript
// Validate API key in every mutation/query
const org = await ctx.db
  .query("organizations")
  .withIndex("by_apiKey", q => q.eq("apiKey", args.apiKey))
  .unique()

if (!org) throw new Error("Invalid API key")
```

**3. Row-Level Security Pattern**
```typescript
// Helper function to get org from API key
async function getOrgFromApiKey(ctx, apiKey: string) {
  const org = await ctx.db
    .query("organizations")
    .withIndex("by_apiKey", q => q.eq("apiKey", apiKey))
    .unique()
  
  if (!org) throw new Error("Unauthorized")
  return org
}
```

### Data Validation
- **Input validation:** Zod schemas for all mutations
- **Output sanitization:** Strip internal fields before returning
- **Rate limiting:** Convex built-in (1000 req/min per function)

---

## 🧪 TESTING STRATEGY

### Test Pyramid
```
           E2E (5%)
         ╱         ╲
    Integration (15%)
   ╱                   ╲
  Unit Tests (80%)
```

**Unit Tests:**
- Attribution algorithm functions
- Validation helpers
- Utility functions

**Integration Tests:**
- Convex function tests (using test environment)
- Component rendering tests

**E2E Tests:**
- Critical user flows (Playwright)
- Create partner → create deal → add touchpoints → calculate attribution

---

## 📊 MONITORING & OBSERVABILITY

### Metrics to Track

**Application Metrics:**
- API response times (p50, p95, p99)
- Function invocation counts
- Error rates
- Database query performance

**Business Metrics:**
- Active customers
- Attribution calculations/day
- Average deal size
- Partner activity rate

### Monitoring Tools

**Built-in Convex Dashboard:**
- Function performance
- Database size
- Real-time errors

**Vercel Analytics:**
- Frontend performance
- Core Web Vitals
- User sessions

**Custom Logging:**
```typescript
// Log important events
mutation({
  handler: async (ctx, args) => {
    console.log("Attribution calculated", {
      dealId: args.dealId,
      model: args.model,
      duration: Date.now() - startTime
    })
  }
})
```

---

## 🚢 DEPLOYMENT STRATEGY

### CI/CD Pipeline
```
GitHub Push
    ↓
Vercel Auto-Deploy (frontend)
    ↓
Convex Deploy (backend)
    ↓
Run E2E Tests
    ↓
Deploy to Production (if tests pass)
```

### Environment Strategy
- **Development:** Local dev server + Convex dev deployment
- **Staging:** Vercel preview + Convex staging
- **Production:** Vercel production + Convex production

### Rollback Plan
- Convex: Automatic rollback on error
- Vercel: Instant rollback to previous deployment
- Database: No automatic rollback (use migrations carefully)

---

## 🎯 PRODUCTION READINESS CHECKLIST

### Must-Have Before Launch
- [x] Schema design validated
- [ ] All CRUD operations implemented
- [ ] Attribution algorithms tested
- [ ] Authentication/authorization working
- [ ] Multi-tenancy isolation verified
- [ ] Error handling comprehensive
- [ ] Loading/empty states designed
- [ ] Mobile responsive
- [ ] API documentation
- [ ] E2E tests passing

### Nice-to-Have (Post-MVP)
- [ ] Real-time collaboration
- [ ] Export to CSV/PDF
- [ ] Email notifications
- [ ] Stripe integration
- [ ] Advanced analytics
- [ ] Bulk operations
- [ ] API rate limiting
- [ ] Audit logs

---

## 🔄 FUTURE ENHANCEMENTS

### Phase 2 (After 100 customers)
- Custom attribution models (user-defined weights)
- Advanced reporting (revenue forecasting)
- Slack/Discord integrations
- Zapier integration

### Phase 3 (After 1000 customers)
- Multi-currency support
- Advanced permissions (team roles)
- White-label options
- API webhooks

### Phase 4 (Scale)
- Machine learning for attribution optimization
- Predictive analytics
- Custom dashboards
- Enterprise SSO

---

## 📚 TECHNICAL DECISIONS LOG

### Why Convex?
**Pros:**
- Real-time reactivity out of the box
- TypeScript-first
- Automatic indexing
- Serverless (no ops)
- Generous free tier

**Cons:**
- Vendor lock-in
- Limited control over query optimization
- Storage limits on free tier

**Decision:** ✅ Good fit for MVP, can migrate to Postgres + tRPC if needed

### Why Next.js App Router?
**Pros:**
- Server Components = better performance
- Streaming SSR
- File-based routing
- Built-in API routes

**Cons:**
- Learning curve for new patterns
- Some libraries not compatible yet

**Decision:** ✅ Future-proof, worth the investment

### Why Recharts?
**Pros:**
- React-native
- Composable
- Good defaults
- Small bundle size

**Cons:**
- Limited customization vs D3
- Some accessibility gaps

**Decision:** ✅ Good balance for MVP

---

**Next Steps:** See `RECOMMENDATIONS.md` for building guidance.
