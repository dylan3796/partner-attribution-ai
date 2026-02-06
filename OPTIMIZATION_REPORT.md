# ⚡ OPTIMIZATION REPORT

**Project:** Partner Attribution Platform  
**Date:** 2026-02-03  
**Status:** Pre-implementation (scaffolded project)

---

## 📊 CURRENT STATE ANALYSIS

### What Exists
✅ **Database Schema** (well-designed, production-ready)
- Multi-tenant architecture
- Proper indexing strategy
- Clear entity relationships
- No major schema issues identified

✅ **Tech Stack** (modern, performant choices)
- Next.js 16 (App Router)
- React 19
- Convex (serverless backend)
- TypeScript (strict mode)
- Tailwind CSS v4

❌ **Implementation** (not yet built)
- No backend functions
- No frontend components
- No attribution logic
- No API layer

### Conclusion
**This is a greenfield project.** The schema is solid, but there's no code to optimize yet. This document serves as:
1. A checklist of optimizations to implement during development
2. A template for tracking future optimizations
3. Best practices to follow from day one

---

## 🎯 OPTIMIZATION STRATEGY

### Philosophy: Build It Right From the Start

**Instead of:**
```
Build (slow) → Measure → Optimize → Fix
```

**We'll do:**
```
Design (with performance in mind) → Build (optimally) → Measure → Fine-tune
```

---

## 🗄️ DATABASE OPTIMIZATIONS

### Schema Design (Already Optimized ✅)

**What's Good:**
1. **Strategic Indexing**
   - Every table has `organizationId` index (multi-tenancy)
   - Common query patterns covered (email lookups, status filters)
   - Composite indexes where needed

2. **Data Types**
   - Numbers for timestamps (not dates) → faster comparisons
   - Unions for enums → type-safe
   - Optional fields marked explicitly

3. **Normalization Balance**
   - Normalized for data integrity
   - Room for denormalization when needed

**What to Add During Development:**

#### 1. Denormalized Counts
```typescript
// Add to deals table
deals: defineTable({
  // ... existing fields
  touchpointsCount: v.number(),      // Count of touchpoints
  partnersCount: v.number(),          // Count of unique partners
  lastTouchAt: v.optional(v.number()) // Timestamp of latest touchpoint
})
```

**Why:** Avoid N+1 queries when listing deals

**When:** Implement when building deal list view

**Impact:** 
- Before: 1 query + N queries per deal = O(N)
- After: 1 query = O(1)
- Estimated savings: 50-100ms per page load

#### 2. Cached Analytics
```typescript
// New table for expensive aggregations
organizationStats: defineTable({
  organizationId: v.id("organizations"),
  totalRevenue: v.number(),
  totalDeals: v.number(),
  activePartners: v.number(),
  avgDealSize: v.number(),
  calculatedAt: v.number(),
})
.index("by_organization", ["organizationId"])
```

**Why:** Dashboard stats don't need real-time accuracy

**When:** Add when dashboard load time > 500ms

**Impact:**
- Before: 5+ queries per dashboard load
- After: 1 query
- Estimated savings: 300-500ms

#### 3. Archival Strategy
```typescript
// Separate table for old data
archivedDeals: defineTable({
  // Same schema as deals
  // ... all fields from deals
  archivedAt: v.number(),
  originalId: v.id("deals"),
})
.index("by_organization", ["organizationId"])
.index("by_archived_date", ["archivedAt"])
```

**Why:** Keep active table small and fast

**When:** Database size > 4 GB

**Impact:**
- Keep query times consistent as data grows
- Active table stays under 2 GB

---

## 🔧 BACKEND OPTIMIZATIONS

### Query Patterns to Implement

#### 1. Pagination (Required for ALL List Queries)

**DON'T:**
```typescript
export const listDeals = query({
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deals")
      .collect() // ❌ Returns ALL deals!
  }
})
```

**DO:**
```typescript
export const listDeals = query({
  args: {
    organizationId: v.id("organizations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deals")
      .withIndex("by_organization", q => 
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .paginate(args.paginationOpts) // ✅ Returns 50 at a time
  }
})
```

**Impact:** 
- Prevents loading 1000+ records at once
- Keeps response times < 100ms
- Reduces bandwidth usage by 95%

#### 2. Selective Field Loading

**Strategy:** Don't load fields you don't need

```typescript
// For list views, omit large fields
export const listDealsMinimal = query({
  handler: async (ctx, args) => {
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", q => 
        q.eq("organizationId", args.organizationId)
      )
      .take(50)
    
    // Return only fields needed for list view
    return deals.map(deal => ({
      _id: deal._id,
      name: deal.name,
      amount: deal.amount,
      status: deal.status,
      createdAt: deal.createdAt,
      // Omit: notes, metadata, etc.
    }))
  }
})
```

**Impact:** 
- Reduces payload size by 40-60%
- Faster serialization
- Lower bandwidth costs

#### 3. Batch Queries (Avoid N+1)

**DON'T:**
```typescript
// Load deals
const deals = await ctx.db.query("deals").take(50)

// Load touchpoints for each deal (N+1 problem!)
for (const deal of deals) {
  deal.touchpoints = await ctx.db
    .query("touchpoints")
    .withIndex("by_deal", q => q.eq("dealId", deal._id))
    .collect()
}
```

**DO:**
```typescript
// Load deals
const deals = await ctx.db.query("deals").take(50)
const dealIds = deals.map(d => d._id)

// Load ALL touchpoints in one query
const touchpoints = await ctx.db
  .query("touchpoints")
  .withIndex("by_deal")
  .collect()
  .then(tps => tps.filter(tp => dealIds.includes(tp.dealId)))

// Group by dealId
const touchpointsByDeal = touchpoints.reduce((acc, tp) => {
  if (!acc[tp.dealId]) acc[tp.dealId] = []
  acc[tp.dealId].push(tp)
  return acc
}, {})

// Attach to deals
return deals.map(deal => ({
  ...deal,
  touchpoints: touchpointsByDeal[deal._id] || []
}))
```

**Impact:**
- Before: 1 + N queries
- After: 2 queries
- For 50 deals: 51 queries → 2 queries (96% reduction!)

#### 4. Memoization for Pure Functions

**Strategy:** Cache expensive calculations

```typescript
// lib/attribution.ts
const attributionCache = new Map<string, Attribution[]>()

export function calculateAttributionCached(
  touchpoints: Touchpoint[],
  model: string
): Attribution[] {
  // Create cache key
  const key = `${model}:${JSON.stringify(touchpoints.map(t => t._id))}`
  
  // Check cache
  if (attributionCache.has(key)) {
    return attributionCache.get(key)!
  }
  
  // Calculate
  const result = calculateAttribution(touchpoints, model)
  
  // Store in cache
  attributionCache.set(key, result)
  
  return result
}
```

**Impact:**
- Repeated calculations: 0ms (cache hit)
- First calculation: ~50ms (one-time cost)
- Use for: Preview modes, comparison views

---

## ⚛️ FRONTEND OPTIMIZATIONS

### 1. Code Splitting by Route (Already Configured ✅)

Next.js App Router automatically splits code by route:

```typescript
// Each page is a separate chunk
app/dashboard/page.tsx         // chunk: dashboard
app/dashboard/partners/page.tsx // chunk: partners
app/dashboard/deals/page.tsx    // chunk: deals
```

**Impact:**
- Initial bundle: ~150 KB (framework + shared)
- Per-route: ~20-50 KB
- Total for user: ~200 KB (only loads what they visit)

### 2. Image Optimization (Use next/image)

**DON'T:**
```typescript
<img src="/logo.png" alt="Logo" />
```

**DO:**
```typescript
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo"
  width={200}
  height={50}
  priority={true} // For above-fold images
/>
```

**Impact:**
- Automatic WebP conversion
- Lazy loading (below fold)
- Responsive images
- 40-60% smaller file sizes

### 3. Component Memoization

**When to Use:**
- Expensive render logic
- Large lists
- Charts/visualizations

**Example:**
```typescript
// components/AttributionChart.tsx
export const AttributionChart = React.memo(
  ({ data }: { data: Attribution[] }) => {
    return <Recharts data={data} />
  },
  // Custom comparison
  (prev, next) => {
    return JSON.stringify(prev.data) === JSON.stringify(next.data)
  }
)
```

**Impact:**
- Prevents re-renders when parent updates but props unchanged
- Saves 10-50ms per avoided render

### 4. Virtual Scrolling (For Large Lists)

**When:** Lists with 100+ items

**Library:** `react-window` or `@tanstack/react-virtual`

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function LargePartnerList({ partners }) {
  const parentRef = useRef(null)
  
  const virtualizer = useVirtualizer({
    count: partners.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Row height
  })
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <PartnerRow 
            key={partners[virtualRow.index]._id}
            partner={partners[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

**Impact:**
- Before: Render 1000 rows = 3000ms
- After: Render 10 visible rows = 30ms
- 99% improvement!

### 5. Lazy Loading Heavy Components

**Strategy:** Don't load charts until needed

```typescript
import dynamic from 'next/dynamic'

const AttributionChart = dynamic(
  () => import('@/components/AttributionChart'),
  { 
    loading: () => <Skeleton className="h-64" />,
    ssr: false // Don't render on server (if chart uses window)
  }
)

export function DealDetail({ deal }) {
  const [showChart, setShowChart] = useState(false)
  
  return (
    <div>
      <h1>{deal.name}</h1>
      
      <button onClick={() => setShowChart(true)}>
        Show Attribution Chart
      </button>
      
      {showChart && <AttributionChart data={deal.attributions} />}
    </div>
  )
}
```

**Impact:**
- Recharts bundle: ~100 KB
- Only load when user clicks "Show Chart"
- Saves 100 KB on initial load

### 6. Streaming SSR

**Already Configured ✅** with Next.js App Router

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <>
      {/* Instant shell */}
      <nav>...</nav>
      
      {/* Stream in data */}
      <Suspense fallback={<Skeleton />}>
        <DashboardStats />
      </Suspense>
      
      <Suspense fallback={<Skeleton />}>
        <RecentDeals />
      </Suspense>
    </>
  )
}
```

**Impact:**
- Time to First Byte: < 100ms
- Time to Interactive: User sees shell immediately
- Data streams in progressively

---

## 📊 PERFORMANCE BENCHMARKS

### Target Metrics

| Metric | Target | Good | Poor |
|--------|--------|------|------|
| **Backend** |
| Query (list) | < 100ms | < 150ms | > 200ms |
| Query (single) | < 50ms | < 100ms | > 150ms |
| Mutation | < 200ms | < 300ms | > 500ms |
| Attribution calc | < 500ms | < 800ms | > 1000ms |
| **Frontend** |
| LCP (Largest Contentful Paint) | < 1.2s | < 2.5s | > 4s |
| FID (First Input Delay) | < 100ms | < 300ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.25 | > 0.4 |
| Total Bundle Size | < 200 KB | < 400 KB | > 600 KB |
| **API** |
| Response time (p50) | < 100ms | < 200ms | > 500ms |
| Response time (p95) | < 300ms | < 500ms | > 1000ms |
| Response time (p99) | < 500ms | < 1000ms | > 2000ms |

### How to Measure

#### Backend (Convex Dashboard)
```typescript
// Add timing to queries/mutations
export const myQuery = query({
  handler: async (ctx, args) => {
    const start = Date.now()
    
    const result = await doWork(ctx, args)
    
    console.log("Query executed", {
      function: "myQuery",
      duration: Date.now() - start,
      resultCount: result.length
    })
    
    return result
  }
})
```

#### Frontend (Vercel Analytics + Custom)
```typescript
// Use Performance API
const start = performance.now()
await fetchData()
const end = performance.now()

console.log("Data fetch took", end - start, "ms")

// Or use React DevTools Profiler
```

#### Load Testing (k6)
```javascript
// test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp up to 50 users
    { duration: '5m', target: 50 },  // Stay at 50
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests < 500ms
  },
}

export default function () {
  const res = http.get('https://your-app.vercel.app/api/deals')
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
  
  sleep(1)
}
```

Run: `k6 run test.js`

---

## 🚀 OPTIMIZATION CHECKLIST

### Phase 1: MVP (Week 1-4)
- [ ] Implement pagination on all list queries
- [ ] Use indexes for all queries
- [ ] Add loading skeletons
- [ ] Optimize images with next/image
- [ ] Code split by route (automatic)
- [ ] Add error boundaries
- [ ] Measure baseline performance

### Phase 2: Polish (Week 5-8)
- [ ] Add denormalized counts to deals
- [ ] Implement optimistic updates
- [ ] Add React.memo to expensive components
- [ ] Lazy load charts
- [ ] Add service worker caching
- [ ] Optimize bundle size (< 200 KB)

### Phase 3: Scale (Month 3-6)
- [ ] Implement dashboard stats caching
- [ ] Add virtual scrolling for large lists
- [ ] Scheduled pre-computation for analytics
- [ ] Database archival strategy
- [ ] CDN for static assets
- [ ] Advanced prefetching

---

## 📈 OPTIMIZATION TRACKING TEMPLATE

Use this template to track actual optimizations:

```markdown
## Optimization: [Name]

**Date:** YYYY-MM-DD
**Category:** Backend | Frontend | Database
**Priority:** High | Medium | Low

### Problem
What was slow/inefficient?

### Solution
What did you change?

### Results
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Response time | 500ms | 100ms | 80% |
| Bundle size | 400 KB | 200 KB | 50% |
| Database queries | 51 | 2 | 96% |

### Code Changes
```diff
- const all = await db.query().collect()
+ const paginated = await db.query().paginate()
```

### Lessons Learned
What would you do differently next time?
```

---

## 🎯 CONTINUOUS OPTIMIZATION

### Daily
- [ ] Check error logs (Sentry)
- [ ] Monitor response times (Convex dashboard)

### Weekly
- [ ] Review performance metrics
- [ ] Check database size
- [ ] Analyze slowest queries
- [ ] Review bundle size

### Monthly
- [ ] Run load tests
- [ ] Review user feedback
- [ ] Identify new bottlenecks
- [ ] Plan next optimizations

### Quarterly
- [ ] Full performance audit
- [ ] Compare to benchmarks
- [ ] Upgrade dependencies
- [ ] Architecture review

---

## 🏆 OPTIMIZATION WINS TO CELEBRATE

### Small Wins (100-500ms saved)
- Adding an index
- Implementing pagination
- Memoizing a component

### Medium Wins (500ms-2s saved)
- Fixing N+1 queries
- Adding caching layer
- Lazy loading heavy components

### Big Wins (2s+ saved)
- Database archival
- Scheduled pre-computation
- Complete architecture refactor

---

## 📚 RESOURCES

### Tools
- **Chrome DevTools:** Lighthouse, Performance profiler
- **React DevTools:** Component profiler
- **Convex Dashboard:** Function performance, database size
- **Vercel Analytics:** Real user metrics
- **k6:** Load testing
- **Bundle Analyzer:** `@next/bundle-analyzer`

### Articles
- [Patterns for optimizing Convex queries](https://stack.convex.dev)
- [Next.js Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)

---

## 🎬 CONCLUSION

This project starts with a **clean slate and solid foundation**. By following the optimizations outlined here **from day one**, you'll:

✅ Never ship slow code  
✅ Scale smoothly to 10K customers  
✅ Maintain sub-second response times  
✅ Keep infrastructure costs low  

**Remember:** Build it right the first time. Optimization is easier when it's built into your workflow from the start.

---

**Status:** Ready to implement. Use this document as your optimization roadmap.
