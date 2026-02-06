# 📈 Scaling Guide - Partner Attribution Platform

**From 0 to 10,000 Customers**

**Last Updated:** 2025-02-03  
**Status:** Implementation Roadmap

---

## 🎯 Scaling Philosophy

**Core Principle:** Build for scale from day 1, but don't over-engineer.

**Approach:**
1. Start with free tier (validate product-market fit)
2. Optimize before paying for more infrastructure
3. Scale vertically first (bigger instances), then horizontally
4. Add complexity only when metrics demand it

---

## 📊 Growth Stages

### Stage 1: MVP (0-100 Customers)
**Timeline:** Month 1-3  
**Infrastructure:** 100% free tier  
**Monthly Cost:** $0

#### Metrics
- Organizations: <100
- Partners: <1,000
- Deals/month: <5,000
- API requests/month: <100K
- Database reads/month: <500K

#### Architecture
```
┌──────────────┐
│   Vercel     │
│  (Free Tier) │
│  Next.js App │
└──────┬───────┘
       │
       │ API Calls
       ▼
┌──────────────┐
│   Convex     │
│  (Free Tier) │
│   Database   │
└──────────────┘
```

#### What to Focus On
- ✅ Product-market fit
- ✅ Core features working
- ✅ Basic analytics
- ✅ Customer feedback loops

#### What NOT to Do
- ❌ Don't add caching yet (premature)
- ❌ Don't optimize (no bottlenecks yet)
- ❌ Don't worry about scale (focus on users)

#### Monitoring
- Convex dashboard (watch query times)
- Vercel analytics (page load times)
- Basic error logging

---

### Stage 2: Early Growth (100-500 Customers)
**Timeline:** Month 4-9  
**Infrastructure:** Still mostly free tier  
**Monthly Cost:** $0-25

#### Metrics
- Organizations: 100-500
- Partners: 1K-5K
- Deals/month: 5K-25K
- API requests/month: 100K-500K
- Database reads/month: 500K-2M

#### First Scaling Challenges

**🔴 Problem 1: Slow Dashboard Loads**
- **Symptom:** Dashboard taking >2s to load for orgs with 100+ partners
- **Root cause:** N+1 queries, no denormalization
- **Solution:** Implement pre-computed analytics table

```typescript
// Before: N+1 query problem
const partners = await ctx.db.query("partners").collect();
for (const partner of partners) {
  const deals = await ctx.db
    .query("deals")
    .withIndex("by_partner", (q) => q.eq("partnerId", partner._id))
    .collect();
}

// After: Denormalized stats
const partners = await ctx.db.query("partners").collect();
// partners[0].stats.totalDeals already computed
```

**Impact:** Dashboard load time: 3s → 400ms

**🔴 Problem 2: Attribution Calculation Blocking API**
- **Symptom:** Closing deals takes >5s
- **Root cause:** Synchronous attribution calculation
- **Solution:** Move to background job

```typescript
// Before
export const closeDeal = mutation({
  handler: async (ctx, { dealId }) => {
    await ctx.db.patch(dealId, { status: "won" });
    await calculateAttribution(ctx, dealId); // Blocks!
  },
});

// After
export const closeDeal = mutation({
  handler: async (ctx, { dealId }) => {
    await ctx.db.patch(dealId, { status: "won" });
    await ctx.scheduler.runAfter(0, internal.attribution.calculate, { dealId });
    // Returns immediately
  },
});
```

**Impact:** API response: 5s → 300ms

#### When to Upgrade

**Convex Free Tier Limits:**
- 1M database reads/month
- 100K database writes/month

**Usage at 500 orgs:**
- ~800K reads/month (80% utilization) ⚠️
- ~50K writes/month (50% utilization) ✅

**Decision Point:** At 400 orgs OR 800K reads/month, upgrade to **Convex Professional** ($25/mo)
- 10M reads/month
- 1M writes/month
- Faster support

#### Architecture Updates

```
┌──────────────┐
│   Vercel     │
│  (Free Tier) │
│  Next.js App │
└──────┬───────┘
       │
       │ API Calls
       ▼
┌──────────────────┐
│   Convex Pro     │
│    ($25/mo)      │
│   - 10M reads    │
│   - 1M writes    │
└──────────────────┘
```

**New Features to Add:**
- Pre-computed analytics (reduce reads)
- Background attribution jobs (reduce blocking)
- Pagination on all lists (reduce response size)

---

### Stage 3: Growth (500-2,000 Customers)
**Timeline:** Month 10-18  
**Infrastructure:** Paid Convex + Vercel  
**Monthly Cost:** $50-150

#### Metrics
- Organizations: 500-2K
- Partners: 5K-20K
- Deals/month: 25K-100K
- API requests/month: 500K-2M
- Database reads/month: 2M-8M

#### Scaling Challenges

**🔴 Problem 1: API Rate Spikes**
- **Symptom:** Random 429 errors, some orgs hitting limits
- **Root cause:** No rate limiting per org
- **Solution:** Implement per-org rate limiting

```typescript
// Use Upstash Redis for rate limiting
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1000, "1 h"), // 1000/hour per org
  analytics: true,
});

export async function POST(req: Request) {
  const apiKey = req.headers.get("X-API-Key");
  const { success, limit, remaining } = await ratelimit.limit(apiKey);
  
  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded", limit, remaining },
      { status: 429 }
    );
  }
  
  // Process request
}
```

**Cost:** Upstash Redis free tier (10K requests/day) or $10/mo

**🔴 Problem 2: Slow Queries on Large Datasets**
- **Symptom:** Orgs with >200 partners have 2s query times
- **Root cause:** Missing compound indexes, inefficient queries
- **Solution:** Add targeted indexes

```typescript
// Add compound index for common query
deals: defineTable({...})
  .index("by_organization_and_status", ["organizationId", "status"])
  .index("by_organization_and_closedAt", ["organizationId", "closedAt"]);

// Query optimization
// Before: Filter after loading all deals
const deals = await ctx.db
  .query("deals")
  .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
  .collect();
const wonDeals = deals.filter(d => d.status === "won");

// After: Filter with index
const wonDeals = await ctx.db
  .query("deals")
  .withIndex("by_organization_and_status", (q) => 
    q.eq("organizationId", orgId).eq("status", "won")
  )
  .collect();
```

**Impact:** Query time: 2s → 100ms

**🔴 Problem 3: Analytics Dashboard Slow**
- **Symptom:** Charts taking 5-10s to render
- **Root cause:** Aggregating thousands of deals client-side
- **Solution:** Pre-computed analytics + caching

```typescript
// Cron job: Calculate daily analytics
export default defineCrons({
  dailyAnalytics: {
    schedule: "0 1 * * *", // 1 AM
    handler: async (ctx) => {
      const orgs = await ctx.db.query("organizations").collect();
      
      for (const org of orgs) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const period = yesterday.toISOString().split('T')[0];
        
        // Calculate metrics for yesterday
        const deals = await ctx.db
          .query("deals")
          .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
          .collect();
        
        const wonDeals = deals.filter(d => d.status === "won");
        const totalRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);
        
        // Store in analytics table
        await ctx.db.insert("analytics", {
          organizationId: org._id,
          period,
          type: "daily",
          metrics: {
            totalRevenue,
            dealsWon: wonDeals.length,
            dealsLost: deals.filter(d => d.status === "lost").length,
            avgDealSize: totalRevenue / wonDeals.length || 0,
            topPartners: [], // Calculate top 5
          },
          calculatedAt: Date.now(),
        });
      }
    },
  },
});

// Frontend: Load pre-computed data
const analytics = await ctx.db
  .query("analytics")
  .withIndex("by_organization_and_period", (q) => 
    q.eq("organizationId", orgId).eq("period", "2025-02-03")
  )
  .first();

return analytics.metrics; // Instant!
```

**Impact:** Analytics load: 8s → 200ms

#### Infrastructure Updates

```
┌──────────────┐
│   Vercel Pro │
│   ($20/mo)   │ ← Upgrade for more bandwidth
│  Next.js App │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  Convex Pro  │  │ Upstash Redis│
│   ($25/mo)   │  │   ($10/mo)   │
│  Database    │  │ Rate Limiting│
└──────────────┘  └──────────────┘
```

**Total Cost:** ~$55/mo

**New Features:**
- Rate limiting per organization
- Pre-computed analytics (daily cron)
- Optimized indexes for all queries
- Email notifications (via Resend $10/mo)

---

### Stage 4: Scale (2K-5K Customers)
**Timeline:** Month 19-30  
**Infrastructure:** Optimized stack  
**Monthly Cost:** $150-300

#### Metrics
- Organizations: 2K-5K
- Partners: 20K-50K
- Deals/month: 100K-250K
- API requests/month: 2M-5M
- Database reads/month: 8M-20M

#### Scaling Challenges

**🔴 Problem 1: Convex Query Limits**
- **Symptom:** Some queries hitting 1s timeout
- **Root cause:** Large organizations with complex queries
- **Solution:** Implement query result caching

```typescript
// Use Upstash Redis to cache query results
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const getPartnerStats = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    // Check cache first
    const cacheKey = `partner-stats:${orgId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return cached as PartnerStats[];
    }
    
    // Query database
    const partners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();
    
    const stats = partners.map(p => ({
      id: p._id,
      name: p.name,
      totalRevenue: p.stats.totalRevenue,
      dealCount: p.stats.totalDeals,
    }));
    
    // Cache for 5 minutes
    await redis.set(cacheKey, stats, { ex: 300 });
    
    return stats;
  },
});
```

**Impact:** 
- Cache hit: 5ms
- Cache miss: 300ms
- Hit rate (after warmup): 90%

**🔴 Problem 2: Attribution Backlog**
- **Symptom:** Attribution calculations falling behind (1000+ pending)
- **Root cause:** Single-threaded processing, high deal volume
- **Solution:** Parallel processing with worker functions

```typescript
// Process 10 attributions in parallel
export default defineCrons({
  batchAttributions: {
    schedule: "*/5 * * * *", // Every 5 minutes
    handler: async (ctx) => {
      const pending = await ctx.db
        .query("pendingAttributions")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .take(100);
      
      // Process in batches of 10
      for (let i = 0; i < pending.length; i += 10) {
        const batch = pending.slice(i, i + 10);
        
        // Parallel execution
        await Promise.all(
          batch.map(item => 
            ctx.scheduler.runAfter(0, internal.attribution.calculate, {
              dealId: item.dealId,
            })
          )
        );
      }
    },
  },
});
```

**Impact:** Processing rate: 10/min → 100/min

**🔴 Problem 3: Large Organizations Slow Everything**
- **Symptom:** Top 10 orgs (enterprise) causing slowdowns
- **Root cause:** 1000+ partners, 10K+ deals each
- **Solution:** Dedicated processing + pagination everywhere

```typescript
// Identify large orgs, flag for special handling
organizations: defineTable({
  // ... existing fields
  tier: v.union(
    v.literal("small"),    // <50 partners
    v.literal("medium"),   // 50-200 partners
    v.literal("large"),    // 200-500 partners
    v.literal("enterprise") // 500+ partners
  ),
  requiresPagination: v.boolean(),
})
  .index("by_tier", ["tier"]);

// Frontend: Force pagination for large orgs
if (org.requiresPagination) {
  // Use cursor-based pagination
  const partners = usePaginatedQuery(api.queries.partners.list, { orgId });
} else {
  // Load all at once (small orgs)
  const partners = useQuery(api.queries.partners.list, { orgId });
}
```

#### Infrastructure Updates

```
┌──────────────────────┐
│   Vercel Pro         │
│   ($20/mo)           │
│   Next.js App        │
└──────┬───────────────┘
       │
       ├──────────────────┬────────────────┐
       │                  │                │
       ▼                  ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Convex Scale │  │ Upstash Redis│  │   Resend     │
│  ($100/mo)   │  │  ($30/mo)    │  │  ($20/mo)    │
│  Database    │  │  - Caching   │  │  Email       │
│              │  │  - Rate Limit│  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Total Cost:** ~$170/mo

**ROI Calculation:**
- 5000 orgs × $50/mo (avg) = $250,000/mo revenue
- Infrastructure: $170/mo (0.07% of revenue)
- **Margin:** 99.93% on infrastructure

---

### Stage 5: Hypergrowth (5K-10K+ Customers)
**Timeline:** Month 31+  
**Infrastructure:** Multi-region, dedicated instances  
**Monthly Cost:** $500-2,000

#### Metrics
- Organizations: 5K-10K+
- Partners: 50K-100K+
- Deals/month: 250K-1M+
- API requests/month: 5M-20M+
- Database reads/month: 20M-100M+

#### Scaling Challenges

**🔴 Problem 1: Global Latency**
- **Symptom:** European/Asian users experiencing 500ms+ latency
- **Root cause:** Single US region for Convex
- **Solution:** Edge functions + global cache

```typescript
// Vercel Edge Functions (deployed globally)
export const config = {
  runtime: 'edge',
};

// Handle read requests at edge
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  
  // Try cache first (Vercel Edge KV)
  const cached = await edgeCache.get(`partners:${orgId}`);
  if (cached) return Response.json(cached);
  
  // Fallback to Convex (US region)
  const data = await fetchQuery(api.queries.partners.list, { orgId });
  
  // Cache at edge
  await edgeCache.set(`partners:${orgId}`, data, { ttl: 300 });
  
  return Response.json(data);
}
```

**Impact:** 
- US users: 100ms (unchanged)
- EU users: 500ms → 150ms
- APAC users: 800ms → 200ms

**🔴 Problem 2: Database Write Bottleneck**
- **Symptom:** Write operations queuing up during peak hours
- **Root cause:** Single Convex instance, high concurrent writes
- **Solution:** Write buffering + batch commits

```typescript
// Buffer writes, commit every 1 second
const writeBuffer: Touchpoint[] = [];

export const createTouchpoint = mutation({
  args: { ...touchpointArgs },
  handler: async (ctx, args) => {
    // Add to buffer
    writeBuffer.push(args);
    
    // Return immediately
    return { status: "queued" };
  },
});

// Background job: Flush buffer
export default defineCrons({
  flushWrites: {
    schedule: "* * * * *", // Every minute
    handler: async (ctx) => {
      if (writeBuffer.length === 0) return;
      
      const batch = writeBuffer.splice(0, 100);
      
      // Batch insert
      await Promise.all(
        batch.map(data => ctx.db.insert("touchpoints", data))
      );
    },
  },
});
```

**Trade-off:** Writes take up to 1 minute to persist (acceptable for analytics)

**🔴 Problem 3: Enterprise Customers Need Isolation**
- **Symptom:** Large enterprise worried about noisy neighbor problem
- **Root cause:** Shared Convex instance for all customers
- **Solution:** Dedicated instances for enterprise tier

```typescript
// Route enterprise customers to dedicated Convex deployment
const convexUrl = org.plan === "enterprise" 
  ? process.env.CONVEX_ENTERPRISE_URL 
  : process.env.CONVEX_URL;

const client = new ConvexHttpClient(convexUrl);
```

**Cost:** Dedicated Convex deployment ~$500/mo per enterprise customer  
**Pricing:** Charge enterprise customers $1000+/mo (2x margin)

#### Infrastructure Updates

```
┌────────────────────────────────────┐
│   Vercel Enterprise ($500/mo)     │
│   - Multi-region Edge              │
│   - 1TB bandwidth                  │
└────────┬───────────────────────────┘
         │
         ├─────────────┬─────────────┬──────────────┐
         │             │             │              │
         ▼             ▼             ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────┐
│ Convex Main │ │ Convex Ent. │ │ Upstash  │ │ Resend   │
│ ($200/mo)   │ │ ($500/mo)   │ │ ($100/mo)│ │ ($50/mo) │
│ Standard    │ │ Dedicated   │ │ Pro      │ │ Pro      │
│ Customers   │ │ Enterprise  │ │ Global   │ │ Transact.│
└─────────────┘ └─────────────┘ └──────────┘ └──────────┘
```

**Total Cost:** ~$1,350/mo  
**Revenue (10K orgs × $50 avg):** $500,000/mo  
**Margin:** 99.73%

---

## 🎯 Decision Framework

### When to Add Complexity?

Use this decision tree:

```
Is there a performance problem?
  ├─ No → Don't optimize yet
  └─ Yes
      ├─ Can you fix with better indexes?
      │   ├─ Yes → Add index (free, instant win)
      │   └─ No → Continue
      │
      ├─ Can you fix with caching?
      │   ├─ Yes → Add Redis cache ($10-30/mo)
      │   └─ No → Continue
      │
      ├─ Can you fix with denormalization?
      │   ├─ Yes → Pre-compute aggregates (cron job)
      │   └─ No → Continue
      │
      ├─ Can you fix with pagination?
      │   ├─ Yes → Implement cursor pagination
      │   └─ No → Continue
      │
      └─ Consider upgrading infrastructure
```

### Cost vs. Complexity

| Solution | Cost | Complexity | When to Use |
|----------|------|------------|-------------|
| **Better indexes** | $0 | Low | Always try first |
| **Pagination** | $0 | Low | Lists >50 items |
| **Denormalization** | $0 | Medium | Frequent aggregations |
| **Background jobs** | $0 | Medium | Long-running tasks |
| **Redis caching** | $10-100/mo | Medium | Repeated queries |
| **CDN/Edge** | $0-50/mo | Low | Global users |
| **Dedicated instance** | $500+/mo | High | Enterprise isolation |
| **Sharding** | $1000+/mo | Very High | >100K orgs |

**Golden Rule:** Exhaust free optimizations before paying for infrastructure.

---

## 📊 Monitoring & Alerts

### Key Metrics to Track

```typescript
// Track these in your monitoring dashboard

export interface HealthMetrics {
  // Performance
  avgResponseTime: number; // Target: <200ms
  p95ResponseTime: number; // Target: <500ms
  p99ResponseTime: number; // Target: <1000ms
  
  // Capacity
  databaseReadsThisMonth: number; // % of limit
  databaseWritesThisMonth: number; // % of limit
  apiRequestsToday: number; // % of rate limit
  
  // Business
  activeOrganizations: number;
  avgPartnersPerOrg: number;
  dealsClosedToday: number;
  attributionBacklog: number; // Pending calculations
  
  // Errors
  errorRate: number; // % of requests
  failedAttributions: number; // Last 24h
  rateLimitHits: number; // Per org, last 1h
}
```

### Alert Thresholds

```typescript
// Set up alerts for these conditions

const alerts = {
  // Performance degradation
  p95_response_time_high: {
    condition: "p95ResponseTime > 1000ms",
    action: "Check slow query logs, add indexes",
  },
  
  // Approaching limits
  database_reads_warning: {
    condition: "databaseReadsThisMonth > 80% of limit",
    action: "Optimize queries or upgrade tier",
  },
  
  // Backlog building up
  attribution_backlog_high: {
    condition: "attributionBacklog > 1000",
    action: "Increase cron frequency or add workers",
  },
  
  // Errors spiking
  error_rate_high: {
    condition: "errorRate > 1%",
    action: "Check Sentry, investigate root cause",
  },
  
  // Business impact
  rate_limit_abuse: {
    condition: "rateLimitHits > 100 per org per hour",
    action: "Contact customer, investigate usage pattern",
  },
};
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  Partner Attribution Platform - System Health       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Performance          Capacity          Business   │
│  ┌───────────┐       ┌───────────┐    ┌─────────┐ │
│  │ P95: 250ms│       │ Reads: 67%│    │ 4,523   │ │
│  │ P99: 480ms│       │Writes: 43%│    │  Orgs   │ │
│  └───────────┘       └───────────┘    └─────────┘ │
│                                                     │
│  Attribution Backlog  Error Rate      API Requests │
│  ┌───────────┐       ┌───────────┐    ┌─────────┐ │
│  │    234    │       │   0.08%   │    │  1.2M   │ │
│  │ pending   │       │  (normal) │    │  today  │ │
│  └───────────┘       └───────────┘    └─────────┘ │
│                                                     │
│  Recent Alerts                                      │
│  ⚠️  DB reads at 78% (approaching limit)           │
│  ✅  All systems operational                       │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Pre-Flight Checklist

### Before Launching to 100 Customers
- [ ] All indexes created
- [ ] Authentication working
- [ ] Basic error tracking (Sentry)
- [ ] API documentation
- [ ] Manual testing of all flows

### Before Scaling to 1,000 Customers
- [ ] Pre-computed analytics table
- [ ] Background attribution jobs
- [ ] Pagination on all lists
- [ ] Rate limiting implemented
- [ ] Load testing completed (simulate 1K orgs)
- [ ] Monitoring dashboard live

### Before Scaling to 10,000 Customers
- [ ] Redis caching layer
- [ ] Dedicated enterprise instances
- [ ] Multi-region edge deployment
- [ ] Advanced analytics (PostHog/Amplitude)
- [ ] 24/7 uptime monitoring
- [ ] Disaster recovery plan
- [ ] Database backups automated

---

## 🚀 Quick Reference

### Current Infrastructure Costs

| Stage | Orgs | Monthly Cost | Cost per Org |
|-------|------|--------------|--------------|
| **MVP** | 0-100 | $0 | $0.00 |
| **Early Growth** | 100-500 | $25 | $0.05 |
| **Growth** | 500-2K | $55 | $0.03 |
| **Scale** | 2K-5K | $170 | $0.03 |
| **Hypergrowth** | 5K-10K | $1,350 | $0.14 |

**Key Insight:** Cost per org DECREASES as you scale (economies of scale)

### Upgrade Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| DB reads | >80% of limit | Upgrade Convex tier |
| Response time | P95 >1s | Add caching layer |
| Attribution backlog | >500 pending | Increase cron frequency |
| Error rate | >1% | Investigate + hotfix |
| Orgs | >800 | Upgrade to paid tier |

---

**Next:** See `CODE_REVIEW.md` for implementation details and file structure.
