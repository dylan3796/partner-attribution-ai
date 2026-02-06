# 🎯 BUILDING RECOMMENDATIONS FOR DYLAN

**How to build this bulletproof from day one.**

---

## 🏗️ DEVELOPMENT WORKFLOW

### 1. Set Up Your Environment

```bash
# Install dependencies
cd partner-attribution-app
npm install

# Set up Convex
npx convex dev

# Start Next.js dev server (in another terminal)
npm run dev
```

### 2. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment

# For production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📁 FOLDER STRUCTURE BEST PRACTICES

### Organize by Domain, Not Type

**❌ BAD (organized by type):**
```
convex/
├── queries.ts          # 1000+ lines, all queries mixed
├── mutations.ts        # 1000+ lines, all mutations mixed
└── helpers.ts
```

**✅ GOOD (organized by domain):**
```
convex/
├── schema.ts
├── _generated/
│
├── lib/
│   ├── attribution.ts       # Attribution algorithms
│   ├── validation.ts        # Shared validators
│   └── helpers.ts           # Utility functions
│
├── organizations/
│   ├── queries.ts           # list, get, getByApiKey
│   └── mutations.ts         # create, update, generateApiKey
│
├── partners/
│   ├── queries.ts           # list, get, getByEmail
│   └── mutations.ts         # create, update, delete, activate
│
├── deals/
│   ├── queries.ts           # list, get, getWithTouchpoints
│   └── mutations.ts         # create, update, close, reopen
│
├── touchpoints/
│   ├── queries.ts           # listByDeal, listByPartner
│   └── mutations.ts         # create, update, delete
│
└── attributions/
    ├── queries.ts           # getByDeal, getByPartner, analytics
    ├── mutations.ts         # recalculate
    └── calculate.ts         # Core algorithms (pure functions)
```

**Why?**
- Easy to find related code
- Natural code splitting
- Clear ownership boundaries
- Easy to test domains independently

---

## 🧪 CONVEX BEST PRACTICES

### 1. Always Use Indexes

**❌ BAD:**
```typescript
// Table scan! Slow!
const partners = await ctx.db
  .query("partners")
  .filter(q => q.eq(q.field("organizationId"), orgId))
  .collect()
```

**✅ GOOD:**
```typescript
// Index scan! Fast!
const partners = await ctx.db
  .query("partners")
  .withIndex("by_organization", q => 
    q.eq("organizationId", orgId)
  )
  .collect()
```

### 2. Validate All Inputs

**❌ BAD:**
```typescript
export const createPartner = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    // ... other fields
  },
  handler: async (ctx, args) => {
    // What if email is invalid?
    await ctx.db.insert("partners", args)
  }
})
```

**✅ GOOD:**
```typescript
// lib/validation.ts
export const emailValidator = v.string().refine(
  (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  "Invalid email format"
)

export const partnerValidator = v.object({
  name: v.string().min(1).max(100),
  email: emailValidator,
  type: v.union(
    v.literal("affiliate"),
    v.literal("referral"),
    v.literal("reseller"),
    v.literal("integration")
  ),
  commissionRate: v.number().min(0).max(100),
})

// partners/mutations.ts
export const createPartner = mutation({
  args: {
    apiKey: v.string(),
    partner: partnerValidator,
  },
  handler: async (ctx, args) => {
    // Validate API key
    const org = await getOrgFromApiKey(ctx, args.apiKey)
    
    // Check for duplicate email
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_email", q => q.eq("email", args.partner.email))
      .first()
    
    if (existing && existing.organizationId === org._id) {
      throw new Error("Partner with this email already exists")
    }
    
    // Insert with validated data
    return await ctx.db.insert("partners", {
      ...args.partner,
      organizationId: org._id,
      status: "pending",
      createdAt: Date.now(),
    })
  }
})
```

### 3. Secure Multi-Tenancy

**❌ BAD (security vulnerability!):**
```typescript
export const getPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, args) => {
    // Anyone can access any partner!
    return await ctx.db.get(args.partnerId)
  }
})
```

**✅ GOOD:**
```typescript
// lib/helpers.ts
export async function getOrgFromApiKey(
  ctx: QueryCtx | MutationCtx,
  apiKey: string
) {
  const org = await ctx.db
    .query("organizations")
    .withIndex("by_apiKey", q => q.eq("apiKey", apiKey))
    .unique()
  
  if (!org) {
    throw new Error("Invalid API key")
  }
  
  return org
}

// partners/queries.ts
export const getPartner = query({
  args: { 
    apiKey: v.string(),
    partnerId: v.id("partners") 
  },
  handler: async (ctx, args) => {
    const org = await getOrgFromApiKey(ctx, args.apiKey)
    
    const partner = await ctx.db.get(args.partnerId)
    
    if (!partner) {
      throw new Error("Partner not found")
    }
    
    // Check ownership
    if (partner.organizationId !== org._id) {
      throw new Error("Unauthorized")
    }
    
    return partner
  }
})
```

### 4. Handle Errors Gracefully

**❌ BAD:**
```typescript
export const closeDeal = mutation({
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId)
    
    // What if deal is null?
    await ctx.db.patch(deal._id, { status: "won" })
    
    // What if attribution calculation fails?
    await calculateAttribution(ctx, deal._id)
  }
})
```

**✅ GOOD:**
```typescript
export const closeeDeal = mutation({
  args: {
    apiKey: v.string(),
    dealId: v.id("deals"),
    status: v.union(v.literal("won"), v.literal("lost")),
  },
  handler: async (ctx, args) => {
    // Validate org
    const org = await getOrgFromApiKey(ctx, args.apiKey)
    
    // Get deal
    const deal = await ctx.db.get(args.dealId)
    if (!deal) {
      throw new Error("Deal not found")
    }
    
    // Check ownership
    if (deal.organizationId !== org._id) {
      throw new Error("Unauthorized")
    }
    
    // Check if already closed
    if (deal.status !== "open") {
      throw new Error(`Deal is already ${deal.status}`)
    }
    
    try {
      // Update deal
      await ctx.db.patch(args.dealId, {
        status: args.status,
        closedAt: Date.now(),
      })
      
      // Calculate attribution only for won deals
      if (args.status === "won") {
        await calculateAttributionForDeal(ctx, args.dealId, org._id)
      }
      
      return { success: true }
      
    } catch (error) {
      console.error("Failed to close deal", {
        dealId: args.dealId,
        error: error.message,
        stack: error.stack,
      })
      
      throw new Error(`Failed to close deal: ${error.message}`)
    }
  }
})
```

### 5. Use Transactions for Related Updates

**❌ BAD (race condition!):**
```typescript
// User 1 and User 2 both add touchpoints at same time
const deal = await ctx.db.get(dealId)
const newCount = deal.touchpointsCount + 1

await ctx.db.patch(dealId, { 
  touchpointsCount: newCount // Could be wrong!
})
```

**✅ GOOD:**
```typescript
// Convex mutations are atomic!
export const addTouchpoint = mutation({
  handler: async (ctx, args) => {
    // Insert touchpoint
    const touchpointId = await ctx.db.insert("touchpoints", {
      dealId: args.dealId,
      partnerId: args.partnerId,
      // ... other fields
    })
    
    // Update deal counts atomically
    const deal = await ctx.db.get(args.dealId)
    const partners = new Set(
      await ctx.db
        .query("touchpoints")
        .withIndex("by_deal", q => q.eq("dealId", args.dealId))
        .collect()
        .then(tps => tps.map(tp => tp.partnerId))
    )
    
    await ctx.db.patch(args.dealId, {
      touchpointsCount: deal.touchpointsCount + 1,
      partnersCount: partners.size,
      lastTouchAt: Date.now(),
    })
    
    return touchpointId
  }
})
```

---

## ⚛️ REACT/NEXT.JS BEST PRACTICES

### 1. Server Components by Default

**✅ GOOD (Server Component):**
```typescript
// app/dashboard/partners/page.tsx
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { PartnersList } from "@/components/PartnersList"

export default async function PartnersPage() {
  // Fetch on server, no loading state needed!
  const partners = await fetchQuery(api.partners.queries.list, {
    apiKey: getApiKeyFromSession()
  })
  
  return (
    <div>
      <h1>Partners</h1>
      <PartnersList initialPartners={partners} />
    </div>
  )
}
```

**When to use Client Component:**
```typescript
// components/PartnersList.tsx
'use client'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function PartnersList({ initialPartners }) {
  // Real-time updates!
  const partners = useQuery(
    api.partners.queries.list,
    { apiKey: getApiKey() },
    { initialData: initialPartners } // Use server-fetched data first
  )
  
  return (
    <div>
      {partners.map(partner => (
        <PartnerCard key={partner._id} partner={partner} />
      ))}
    </div>
  )
}
```

### 2. Optimize Loading States

**❌ BAD (flickering):**
```typescript
'use client'
export function Dashboard() {
  const deals = useQuery(api.deals.queries.list)
  
  if (!deals) return <div>Loading...</div>
  
  return <DealsList deals={deals} />
}
```

**✅ GOOD (streaming):**
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { DashboardStats } from '@/components/DashboardStats'
import { RecentDeals } from '@/components/RecentDeals'
import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Load stats first */}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <DashboardStats />
      </Suspense>
      
      {/* Load deals while user reads stats */}
      <Suspense fallback={<Skeleton className="h-64" />}>
        <RecentDeals />
      </Suspense>
    </div>
  )
}
```

### 3. Optimistic Updates

**❌ BAD (slow feedback):**
```typescript
const updatePartner = useMutation(api.partners.mutations.update)

async function handleUpdate(data) {
  await updatePartner({ partnerId, ...data })
  // User waits for server response...
}
```

**✅ GOOD (instant feedback):**
```typescript
const updatePartner = useMutation(api.partners.mutations.update)
const [optimisticPartner, setOptimisticPartner] = useState(partner)

async function handleUpdate(data) {
  // Update UI immediately
  setOptimisticPartner({ ...partner, ...data })
  
  try {
    await updatePartner({ partnerId, ...data })
    // Success! UI already shows correct state
  } catch (error) {
    // Revert on error
    setOptimisticPartner(partner)
    toast.error("Failed to update partner")
  }
}
```

### 4. Memoize Expensive Computations

**❌ BAD (recalculates on every render):**
```typescript
function DealsList({ deals }) {
  const totalRevenue = deals
    .filter(d => d.status === 'won')
    .reduce((sum, d) => sum + d.amount, 0)
  
  return <div>Total: ${totalRevenue}</div>
}
```

**✅ GOOD (memoized):**
```typescript
function DealsList({ deals }) {
  const totalRevenue = useMemo(() => 
    deals
      .filter(d => d.status === 'won')
      .reduce((sum, d) => sum + d.amount, 0),
    [deals]
  )
  
  return <div>Total: ${totalRevenue}</div>
}
```

---

## 🎨 UI/UX BEST PRACTICES

### 1. Always Show Empty States

**❌ BAD:**
```typescript
{partners.length === 0 && <p>No partners</p>}
{partners.length > 0 && <PartnersList partners={partners} />}
```

**✅ GOOD:**
```typescript
{partners.length === 0 ? (
  <EmptyState
    icon={<UsersIcon />}
    title="No partners yet"
    description="Get started by adding your first partner"
    action={
      <Button onClick={() => router.push('/partners/new')}>
        Add Partner
      </Button>
    }
  />
) : (
  <PartnersList partners={partners} />
)}
```

### 2. Loading Skeletons Match Content

**❌ BAD (generic spinner):**
```typescript
{!data && <Spinner />}
```

**✅ GOOD (skeleton matches layout):**
```typescript
{!data ? (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
    ))}
  </div>
) : (
  <PartnersList partners={data} />
)}
```

### 3. Error States Are Actionable

**❌ BAD:**
```typescript
{error && <div>Error loading partners</div>}
```

**✅ GOOD:**
```typescript
{error && (
  <ErrorState
    title="Failed to load partners"
    description={error.message}
    actions={[
      <Button key="retry" onClick={retry}>
        Try Again
      </Button>,
      <Button key="support" variant="outline" onClick={contactSupport}>
        Contact Support
      </Button>
    ]}
  />
)}
```

---

## 🧮 ATTRIBUTION ALGORITHM IMPLEMENTATION

### Core Algorithm Structure

**File:** `convex/lib/attribution.ts`

```typescript
// Pure functions = easy to test!

type Touchpoint = {
  partnerId: Id<"partners">
  createdAt: number
  type: string
  weight?: number
}

type Attribution = {
  partnerId: Id<"partners">
  percentage: number
}

export function calculateEqualSplit(
  touchpoints: Touchpoint[]
): Attribution[] {
  const uniquePartners = [...new Set(touchpoints.map(tp => tp.partnerId))]
  const percentage = 100 / uniquePartners.length
  
  return uniquePartners.map(partnerId => ({
    partnerId,
    percentage
  }))
}

export function calculateFirstTouch(
  touchpoints: Touchpoint[]
): Attribution[] {
  if (touchpoints.length === 0) return []
  
  const firstTouch = touchpoints.reduce((earliest, tp) => 
    tp.createdAt < earliest.createdAt ? tp : earliest
  )
  
  return [{
    partnerId: firstTouch.partnerId,
    percentage: 100
  }]
}

export function calculateLastTouch(
  touchpoints: Touchpoint[]
): Attribution[] {
  if (touchpoints.length === 0) return []
  
  const lastTouch = touchpoints.reduce((latest, tp) => 
    tp.createdAt > latest.createdAt ? tp : latest
  )
  
  return [{
    partnerId: lastTouch.partnerId,
    percentage: 100
  }]
}

export function calculateTimeDecay(
  touchpoints: Touchpoint[],
  lambda: number = 0.1
): Attribution[] {
  if (touchpoints.length === 0) return []
  
  const now = Date.now()
  
  // Calculate weights with exponential decay
  const weights = touchpoints.map(tp => {
    const daysAgo = (now - tp.createdAt) / (1000 * 60 * 60 * 24)
    return {
      partnerId: tp.partnerId,
      weight: Math.exp(-lambda * daysAgo)
    }
  })
  
  // Group by partner and sum weights
  const partnerWeights = weights.reduce((acc, { partnerId, weight }) => {
    acc[partnerId] = (acc[partnerId] || 0) + weight
    return acc
  }, {} as Record<string, number>)
  
  // Calculate total weight
  const totalWeight = Object.values(partnerWeights).reduce((a, b) => a + b, 0)
  
  // Convert to percentages
  return Object.entries(partnerWeights).map(([partnerId, weight]) => ({
    partnerId: partnerId as Id<"partners">,
    percentage: (weight / totalWeight) * 100
  }))
}

export function calculateRoleBased(
  touchpoints: Touchpoint[],
  weights: Record<string, number> = {
    referral: 30,
    demo: 25,
    proposal: 25,
    negotiation: 20,
    introduction: 10,
    content_share: 5,
  }
): Attribution[] {
  if (touchpoints.length === 0) return []
  
  // Calculate weighted scores
  const partnerScores = touchpoints.reduce((acc, tp) => {
    const weight = tp.weight ?? weights[tp.type] ?? 10
    acc[tp.partnerId] = (acc[tp.partnerId] || 0) + weight
    return acc
  }, {} as Record<string, number>)
  
  // Calculate total score
  const totalScore = Object.values(partnerScores).reduce((a, b) => a + b, 0)
  
  // Convert to percentages
  return Object.entries(partnerScores).map(([partnerId, score]) => ({
    partnerId: partnerId as Id<"partners">,
    percentage: (score / totalScore) * 100
  }))
}

// Main calculation function
export function calculateAttribution(
  touchpoints: Touchpoint[],
  model: string
): Attribution[] {
  switch (model) {
    case "equal_split":
      return calculateEqualSplit(touchpoints)
    case "first_touch":
      return calculateFirstTouch(touchpoints)
    case "last_touch":
      return calculateLastTouch(touchpoints)
    case "time_decay":
      return calculateTimeDecay(touchpoints)
    case "role_based":
      return calculateRoleBased(touchpoints)
    default:
      throw new Error(`Unknown attribution model: ${model}`)
  }
}
```

### Testing Attribution Algorithms

**File:** `convex/lib/attribution.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { 
  calculateEqualSplit,
  calculateFirstTouch,
  calculateLastTouch,
  calculateTimeDecay,
  calculateRoleBased
} from './attribution'

describe('Attribution Algorithms', () => {
  const mockTouchpoints = [
    { partnerId: 'p1', createdAt: 1000, type: 'referral' },
    { partnerId: 'p2', createdAt: 2000, type: 'demo' },
    { partnerId: 'p1', createdAt: 3000, type: 'proposal' },
  ]
  
  it('equal split divides evenly', () => {
    const result = calculateEqualSplit(mockTouchpoints)
    expect(result).toEqual([
      { partnerId: 'p1', percentage: 50 },
      { partnerId: 'p2', percentage: 50 },
    ])
  })
  
  it('first touch gives 100% to earliest', () => {
    const result = calculateFirstTouch(mockTouchpoints)
    expect(result).toEqual([
      { partnerId: 'p1', percentage: 100 },
    ])
  })
  
  it('last touch gives 100% to latest', () => {
    const result = calculateLastTouch(mockTouchpoints)
    expect(result).toEqual([
      { partnerId: 'p1', percentage: 100 },
    ])
  })
  
  // ... more tests
})
```

---

## 🚢 DEPLOYMENT CHECKLIST

### Before First Deploy

- [ ] Environment variables set in Vercel
- [ ] Convex production deployment created
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (Vercel Analytics) enabled
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Before Going Live

- [ ] All E2E tests passing
- [ ] Performance tested (Lighthouse > 90)
- [ ] Security reviewed (no exposed API keys)
- [ ] Database indexes verified
- [ ] Error handling tested
- [ ] Loading states tested
- [ ] Mobile responsive verified
- [ ] Documentation complete

### Post-Launch Monitoring

- [ ] Set up alerts for errors
- [ ] Monitor database size daily
- [ ] Check performance metrics weekly
- [ ] Review user feedback
- [ ] Track key business metrics

---

## 🔨 COMMON PITFALLS TO AVOID

### 1. Premature Optimization
❌ Don't optimize before you have data  
✅ Build it clean, then measure and optimize bottlenecks

### 2. Not Using TypeScript Properly
❌ Using `any` everywhere  
✅ Strict types, leverage Convex's generated types

### 3. Forgetting Mobile
❌ Desktop-first, mobile broken  
✅ Mobile-first design, use Tailwind's responsive utilities

### 4. No Error Handling
❌ Assuming everything works  
✅ Try/catch everywhere, show user-friendly errors

### 5. Ignoring Performance
❌ Loading 1000 items at once  
✅ Pagination, virtual scrolling, lazy loading

### 6. Hard-Coding Values
❌ Magic numbers everywhere  
✅ Constants file, environment variables

### 7. Not Testing Edge Cases
❌ Only testing happy path  
✅ Test: empty states, errors, loading, edge cases

---

## 💡 PRO TIPS

### 1. Use Convex Scheduled Functions for Batch Work
```typescript
// Run expensive calculations off the critical path
export default cron("every hour", async (ctx) => {
  const orgs = await ctx.db.query("organizations").collect()
  
  for (const org of orgs) {
    await recalculateAnalytics(ctx, org._id)
  }
})
```

### 2. Denormalize for Read Performance
```typescript
// Store computed values on deals
deals: defineTable({
  // ... other fields
  totalAttributionCalculated: v.boolean(),
  partnersInvolved: v.array(v.id("partners")),
  touchpointsCount: v.number(),
})
```

### 3. Use React.memo for Expensive Components
```typescript
export const AttributionChart = React.memo(({ data }) => {
  // Only re-renders when data changes
  return <Recharts data={data} />
})
```

### 4. Batch API Calls
```typescript
// BAD: Multiple round trips
const partner1 = await fetchPartner(id1)
const partner2 = await fetchPartner(id2)
const partner3 = await fetchPartner(id3)

// GOOD: Single query
const partners = await fetchPartners([id1, id2, id3])
```

### 5. Use Indexes Creatively
```typescript
// Compound index for complex queries
attributions: defineTable({
  // ...
})
.index("by_org_and_model", ["organizationId", "model"])
.index("by_partner_and_date", ["partnerId", "calculatedAt"])
```

---

## 🎓 LEARNING RESOURCES

### Convex
- [Convex Docs](https://docs.convex.dev)
- [Database Best Practices](https://docs.convex.dev/database/indexes)
- [Patterns & Anti-patterns](https://stack.convex.dev)

### Next.js
- [App Router Docs](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

---

## 🚦 START HERE

### Week 1 Priorities

1. **Day 1-2: Backend Foundation**
   - Implement organizations queries/mutations
   - Implement partners queries/mutations
   - Add validation helpers
   - Write unit tests

2. **Day 3-4: Core Features**
   - Implement deals queries/mutations
   - Implement touchpoints queries/mutations
   - Build attribution algorithms
   - Test attribution logic

3. **Day 5-7: Frontend**
   - Build dashboard layout
   - Create partner management UI
   - Create deal management UI
   - Add basic charts

### Week 2 Priorities

1. **Day 8-9: Attribution UI**
   - Attribution results page
   - Multiple model comparison
   - Visual charts

2. **Day 10-11: Polish**
   - Loading states
   - Error states
   - Empty states
   - Mobile responsive

3. **Day 12-14: Testing & Deploy**
   - E2E tests
   - Performance testing
   - Deploy to production
   - Monitor first users

---

**Remember:** Ship fast, iterate faster. Get to MVP in 2 weeks, then improve based on real user feedback.

Good luck! 🚀
