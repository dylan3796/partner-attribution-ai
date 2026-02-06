# 🔍 Code Review - Partner Attribution Platform

**Reviewed:** 2025-02-03  
**Reviewer:** Claude (Senior Architect Mode)  
**Current Status:** Early stage (schema only)  
**Verdict:** ⭐⭐⭐⭐ Great foundation, needs implementation

---

## 📋 Review Summary

### ✅ What's Good
- **Schema design:** Well-thought-out, proper relationships, good indexing strategy
- **Tech stack:** Modern choices (Next.js 16, React 19, Convex, TypeScript strict)
- **Type safety:** `strict: true` in tsconfig (excellent!)
- **Dependencies:** Minimal, lightweight (no bloat)

### ⚠️ What Needs Work
- **No implementation:** Still default Next.js landing page
- **Missing Convex functions:** No queries, mutations, or actions
- **No authentication:** Security not implemented
- **No validation:** Input validation missing
- **No tests:** Testing framework not set up

### 🎯 Recommendations
1. Start with enhanced schema (add indexes, soft delete)
2. Implement core CRUD operations
3. Build attribution engine (pure functions, tested)
4. Create dashboard with Server Components
5. Add authentication (Convex Auth)

---

## 📂 File-by-File Review

### ✅ `/package.json` - GOOD

**Score:** 9/10

```json
{
  "dependencies": {
    "convex": "^1.31.7",        // ✅ Latest version
    "date-fns": "^4.1.0",       // ✅ Lightweight date lib
    "lucide-react": "^0.563.0", // ✅ Tree-shakeable icons
    "next": "16.1.6",           // ✅ Latest Next.js
    "react": "19.2.3",          // ✅ React 19
    "recharts": "^3.7.0"        // ✅ Declarative charts
  }
}
```

**Strengths:**
- Minimal dependencies (fast installs, small bundle)
- All latest versions (security + features)
- Good choices (date-fns over moment, lucide over font-awesome)

**Recommendations:**
- ✅ **Add:** `zod` for validation
- ✅ **Add:** `@clerk/nextjs` OR use Convex Auth (for authentication)
- ✅ **Add:** `vitest` for testing
- ⚠️ **Consider:** Removing `recharts` if not used yet (50KB+ bundle)

**Updated dependencies:**
```json
{
  "dependencies": {
    // ... existing
    "zod": "^3.22.4",
    "@convex-dev/auth": "^0.0.75" // Convex Auth (simpler than Clerk)
  },
  "devDependencies": {
    // ... existing
    "vitest": "^1.1.0",
    "@testing-library/react": "^14.1.2",
    "@playwright/test": "^1.40.1"
  }
}
```

---

### ✅ `/tsconfig.json` - EXCELLENT

**Score:** 10/10

```json
{
  "compilerOptions": {
    "strict": true,  // ✅ Catches type errors
    "noEmit": true   // ✅ Next.js handles compilation
  }
}
```

**Strengths:**
- `strict: true` is critical (prevents type bugs)
- All recommended Next.js settings

**No changes needed!**

---

### ⚠️ `/convex/schema.ts` - GOOD, NEEDS ENHANCEMENT

**Score:** 7/10

**Current Schema Review:**

```typescript
organizations: defineTable({
  name: v.string(),
  email: v.string(),
  apiKey: v.string(),
  plan: v.union(v.literal("starter"), v.literal("growth"), v.literal("enterprise")),
  stripeCustomerId: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_apiKey", ["apiKey"]),
```

**Strengths:**
- ✅ Proper indexing on lookup fields
- ✅ Type-safe plan enum
- ✅ Timestamps included

**Issues:**
- ❌ No soft delete support
- ❌ No compound indexes for analytics
- ❌ No usage tracking (for rate limits)
- ❌ No settings object (rigid schema)

**Enhanced Schema:**

```typescript
organizations: defineTable({
  name: v.string(),
  email: v.string(),
  apiKey: v.string(),
  plan: v.union(
    v.literal("starter"),
    v.literal("growth"),
    v.literal("enterprise")
  ),
  stripeCustomerId: v.optional(v.string()),
  
  // NEW: Settings
  settings: v.object({
    defaultAttributionModel: v.string(),
    autoCalculateAttribution: v.boolean(),
    webhookUrl: v.optional(v.string()),
    timezone: v.string(),
  }),
  
  // NEW: Usage tracking
  usage: v.object({
    partnerCount: v.number(),
    dealCount: v.number(),
    apiCallsThisMonth: v.number(),
  }),
  
  // NEW: Activity tracking
  lastActiveAt: v.number(),
  
  // NEW: Soft delete
  deletedAt: v.optional(v.number()),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_apiKey", ["apiKey"])
  .index("by_plan_and_active", ["plan", "deletedAt"]) // Analytics
  .index("by_lastActive", ["lastActiveAt"]); // Churn detection
```

**Partners Table Enhancement:**

```typescript
partners: defineTable({
  organizationId: v.id("organizations"),
  name: v.string(),
  email: v.string(),
  type: v.union(
    v.literal("affiliate"),
    v.literal("referral"),
    v.literal("reseller"),
    v.literal("integration")
  ),
  commissionRate: v.number(),
  status: v.union(
    v.literal("active"),
    v.literal("inactive"),
    v.literal("pending")
  ),
  
  // NEW: Denormalized stats (performance)
  stats: v.object({
    totalDeals: v.number(),
    totalRevenue: v.number(),
    avgDealSize: v.number(),
    lastDealAt: v.optional(v.number()),
  }),
  
  // NEW: Contact info
  contact: v.optional(v.object({
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    website: v.optional(v.string()),
  })),
  
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_organization", ["organizationId"])
  .index("by_email", ["email"])
  .index("by_organization_and_status", ["organizationId", "status"])
  .index("by_organization_and_type", ["organizationId", "type"]);
```

**NEW: Analytics Table (Pre-computed aggregates):**

```typescript
analytics: defineTable({
  organizationId: v.id("organizations"),
  period: v.string(), // "2025-02-03" (daily) or "2025-02" (monthly)
  type: v.union(v.literal("daily"), v.literal("monthly")),
  
  metrics: v.object({
    totalRevenue: v.number(),
    dealsWon: v.number(),
    dealsLost: v.number(),
    dealsOpen: v.number(),
    avgDealSize: v.number(),
    conversionRate: v.number(), // won / (won + lost)
    
    topPartners: v.array(v.object({
      partnerId: v.id("partners"),
      name: v.string(),
      revenue: v.number(),
      dealCount: v.number(),
    })),
  }),
  
  calculatedAt: v.number(),
})
  .index("by_organization_and_period", ["organizationId", "period"])
  .index("by_period", ["period"]); // Global analytics
```

---

### ❌ `/app/page.tsx` - NEEDS IMPLEMENTATION

**Score:** 1/10 (default template)

**Current:** Default Next.js landing page (not production code)

**Recommended Implementation:**

```typescript
// app/page.tsx - Public landing page
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">
            Partner Attribution
          </h1>
          <div className="space-x-4">
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Fair attribution for your partner network
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track every touchpoint, calculate fair commissions, and reward the 
          partners who drive your revenue.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <Feature 
            title="Multi-Touch Attribution"
            description="5 attribution models: equal split, first/last touch, time decay, role-based"
          />
          <Feature 
            title="Real-Time Tracking"
            description="Log partner touchpoints via API or dashboard, see impact instantly"
          />
          <Feature 
            title="Automated Payouts"
            description="Calculate commissions automatically when deals close"
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

---

### ❌ Missing Files - CRITICAL

#### 1. `/convex/queries/` - NOT IMPLEMENTED

**Create:** `convex/queries/organizations.ts`

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

// Get current user's organization
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();
    
    if (!org) throw new Error("Organization not found");
    return org;
  },
});

// Get organization stats (with denormalized data)
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const org = await getCurrent(ctx, {});
    
    return {
      partnerCount: org.usage.partnerCount,
      dealCount: org.usage.dealCount,
      apiCallsThisMonth: org.usage.apiCallsThisMonth,
      plan: org.plan,
    };
  },
});
```

**Create:** `convex/queries/partners.ts`

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

// List partners with pagination
export const list = query({
  args: {
    paginationOpts: v.optional(v.object({
      numItems: v.number(),
      cursor: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();
    
    if (!org) throw new Error("Organization not found");
    
    return await ctx.db
      .query("partners")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .filter((q) => q.eq(q.field("deletedAt"), undefined)) // Exclude deleted
      .paginate(args.paginationOpts ?? { numItems: 20 });
  },
});

// Get single partner by ID
export const get = query({
  args: { id: v.id("partners") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const partner = await ctx.db.get(id);
    if (!partner) throw new Error("Partner not found");
    
    // Verify user has access to this partner's organization
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();
    
    if (partner.organizationId !== org?._id) {
      throw new Error("Unauthorized");
    }
    
    return partner;
  },
});
```

#### 2. `/convex/mutations/` - NOT IMPLEMENTED

**Create:** `convex/mutations/partners.ts`

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create new partner
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    type: v.union(
      v.literal("affiliate"),
      v.literal("referral"),
      v.literal("reseller"),
      v.literal("integration")
    ),
    commissionRate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();
    
    if (!org) throw new Error("Organization not found");
    
    // Validate commission rate
    if (args.commissionRate < 0 || args.commissionRate > 100) {
      throw new Error("Commission rate must be between 0 and 100");
    }
    
    // Create partner
    const partnerId = await ctx.db.insert("partners", {
      organizationId: org._id,
      name: args.name,
      email: args.email,
      type: args.type,
      commissionRate: args.commissionRate,
      status: "active",
      stats: {
        totalDeals: 0,
        totalRevenue: 0,
        avgDealSize: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Update organization usage
    await ctx.db.patch(org._id, {
      usage: {
        ...org.usage,
        partnerCount: org.usage.partnerCount + 1,
      },
      updatedAt: Date.now(),
    });
    
    return partnerId;
  },
});

// Soft delete partner
export const remove = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const partner = await ctx.db.get(id);
    if (!partner) throw new Error("Partner not found");
    
    // Verify access
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();
    
    if (partner.organizationId !== org?._id) {
      throw new Error("Unauthorized");
    }
    
    // Soft delete
    await ctx.db.patch(id, {
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Update organization usage
    await ctx.db.patch(org._id, {
      usage: {
        ...org.usage,
        partnerCount: Math.max(0, org.usage.partnerCount - 1),
      },
    });
  },
});
```

#### 3. `/convex/lib/attribution/` - NOT IMPLEMENTED

**Create:** `convex/lib/attribution/models.ts`

```typescript
/**
 * Attribution Models
 * Pure functions for calculating partner credit
 */

import { Doc } from "../_generated/dataModel";

export type AttributionModel = 
  | "equal_split"
  | "first_touch"
  | "last_touch"
  | "time_decay"
  | "role_based";

export interface TouchpointWithPartner {
  partnerId: string;
  partnerName: string;
  commissionRate: number;
  type: string;
  createdAt: number;
  weight?: number; // For role-based
}

export interface AttributionResult {
  partnerId: string;
  partnerName: string;
  percentage: number; // 0-100
  amount: number;
  commissionAmount: number;
}

/**
 * Equal Split: Each touchpoint gets equal credit
 */
export function calculateEqualSplit(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number
): AttributionResult[] {
  const touchpointCount = touchpoints.length;
  if (touchpointCount === 0) return [];
  
  const percentagePerTouch = 100 / touchpointCount;
  const amountPerTouch = dealAmount / touchpointCount;
  
  // Group by partner (partner can have multiple touchpoints)
  const partnerMap = new Map<string, AttributionResult>();
  
  for (const touch of touchpoints) {
    const existing = partnerMap.get(touch.partnerId);
    
    if (existing) {
      existing.percentage += percentagePerTouch;
      existing.amount += amountPerTouch;
      existing.commissionAmount = 
        (existing.amount * existing.commissionRate) / 100;
    } else {
      partnerMap.set(touch.partnerId, {
        partnerId: touch.partnerId,
        partnerName: touch.partnerName,
        percentage: percentagePerTouch,
        amount: amountPerTouch,
        commissionAmount: (amountPerTouch * touch.commissionRate) / 100,
      });
    }
  }
  
  return Array.from(partnerMap.values());
}

/**
 * First Touch: 100% credit to first partner interaction
 */
export function calculateFirstTouch(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number
): AttributionResult[] {
  if (touchpoints.length === 0) return [];
  
  // Sort by createdAt ascending
  const sorted = [...touchpoints].sort((a, b) => a.createdAt - b.createdAt);
  const firstTouch = sorted[0];
  
  return [{
    partnerId: firstTouch.partnerId,
    partnerName: firstTouch.partnerName,
    percentage: 100,
    amount: dealAmount,
    commissionAmount: (dealAmount * firstTouch.commissionRate) / 100,
  }];
}

/**
 * Last Touch: 100% credit to last partner interaction before close
 */
export function calculateLastTouch(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number
): AttributionResult[] {
  if (touchpoints.length === 0) return [];
  
  // Sort by createdAt descending
  const sorted = [...touchpoints].sort((a, b) => b.createdAt - a.createdAt);
  const lastTouch = sorted[0];
  
  return [{
    partnerId: lastTouch.partnerId,
    partnerName: lastTouch.partnerName,
    percentage: 100,
    amount: dealAmount,
    commissionAmount: (dealAmount * lastTouch.commissionRate) / 100,
  }];
}

/**
 * Time Decay: More recent touchpoints get more credit (exponential decay)
 */
export function calculateTimeDecay(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  halfLifeDays: number = 7 // Credit halves every 7 days
): AttributionResult[] {
  if (touchpoints.length === 0) return [];
  
  const now = Date.now();
  const lambda = Math.log(2) / (halfLifeDays * 24 * 60 * 60 * 1000); // Convert to ms
  
  // Calculate weight for each touchpoint
  const weightsMap = new Map<string, {
    weight: number;
    partner: TouchpointWithPartner;
  }>();
  
  let totalWeight = 0;
  
  for (const touch of touchpoints) {
    const ageMs = now - touch.createdAt;
    const weight = Math.exp(-lambda * ageMs);
    
    totalWeight += weight;
    
    const existing = weightsMap.get(touch.partnerId);
    if (existing) {
      existing.weight += weight;
    } else {
      weightsMap.set(touch.partnerId, { weight, partner: touch });
    }
  }
  
  // Calculate attribution
  const results: AttributionResult[] = [];
  
  for (const [partnerId, data] of weightsMap) {
    const percentage = (data.weight / totalWeight) * 100;
    const amount = dealAmount * (data.weight / totalWeight);
    
    results.push({
      partnerId,
      partnerName: data.partner.partnerName,
      percentage,
      amount,
      commissionAmount: (amount * data.partner.commissionRate) / 100,
    });
  }
  
  return results;
}

/**
 * Role-Based: Custom weights per touchpoint type
 */
const DEFAULT_ROLE_WEIGHTS = {
  referral: 0.30,
  demo: 0.25,
  content_share: 0.10,
  introduction: 0.15,
  proposal: 0.15,
  negotiation: 0.05,
};

export function calculateRoleBased(
  touchpoints: TouchpointWithPartner[],
  dealAmount: number,
  roleWeights: Record<string, number> = DEFAULT_ROLE_WEIGHTS
): AttributionResult[] {
  if (touchpoints.length === 0) return [];
  
  // Sum weights by partner
  const partnerWeights = new Map<string, {
    weight: number;
    partner: TouchpointWithPartner;
  }>();
  
  let totalWeight = 0;
  
  for (const touch of touchpoints) {
    const weight = roleWeights[touch.type] ?? 0.1; // Default 10% if type unknown
    totalWeight += weight;
    
    const existing = partnerWeights.get(touch.partnerId);
    if (existing) {
      existing.weight += weight;
    } else {
      partnerWeights.set(touch.partnerId, { weight, partner: touch });
    }
  }
  
  // Calculate attribution
  const results: AttributionResult[] = [];
  
  for (const [partnerId, data] of partnerWeights) {
    const percentage = (data.weight / totalWeight) * 100;
    const amount = dealAmount * (data.weight / totalWeight);
    
    results.push({
      partnerId,
      partnerName: data.partner.partnerName,
      percentage,
      amount,
      commissionAmount: (amount * data.partner.commissionRate) / 100,
    });
  }
  
  return results;
}
```

**Create:** `convex/lib/attribution/calculator.ts`

```typescript
/**
 * Attribution Calculator
 * Orchestrates attribution calculation for a deal
 */

import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import {
  calculateEqualSplit,
  calculateFirstTouch,
  calculateLastTouch,
  calculateTimeDecay,
  calculateRoleBased,
  type AttributionModel,
} from "./models";

export const calculate = internalMutation({
  args: {
    dealId: v.id("deals"),
    model: v.optional(v.string()),
  },
  handler: async (ctx, { dealId, model }) => {
    // Get deal
    const deal = await ctx.db.get(dealId);
    if (!deal) throw new Error("Deal not found");
    
    if (deal.status !== "won") {
      throw new Error("Can only calculate attribution for won deals");
    }
    
    // Get organization settings
    const org = await ctx.db.get(deal.organizationId);
    if (!org) throw new Error("Organization not found");
    
    const attributionModel = (model ?? org.settings.defaultAttributionModel) as AttributionModel;
    
    // Get all touchpoints for this deal
    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_deal", (q) => q.eq("dealId", dealId))
      .collect();
    
    if (touchpoints.length === 0) {
      console.warn(`No touchpoints for deal ${dealId}, skipping attribution`);
      return;
    }
    
    // Enrich touchpoints with partner data
    const enrichedTouchpoints = await Promise.all(
      touchpoints.map(async (tp) => {
        const partner = await ctx.db.get(tp.partnerId);
        if (!partner) throw new Error(`Partner ${tp.partnerId} not found`);
        
        return {
          partnerId: tp.partnerId,
          partnerName: partner.name,
          commissionRate: partner.commissionRate,
          type: tp.type,
          createdAt: tp.createdAt,
          weight: tp.weight,
        };
      })
    );
    
    // Calculate attribution based on model
    let results;
    
    switch (attributionModel) {
      case "equal_split":
        results = calculateEqualSplit(enrichedTouchpoints, deal.amount);
        break;
      case "first_touch":
        results = calculateFirstTouch(enrichedTouchpoints, deal.amount);
        break;
      case "last_touch":
        results = calculateLastTouch(enrichedTouchpoints, deal.amount);
        break;
      case "time_decay":
        results = calculateTimeDecay(enrichedTouchpoints, deal.amount);
        break;
      case "role_based":
        results = calculateRoleBased(enrichedTouchpoints, deal.amount);
        break;
      default:
        throw new Error(`Unknown attribution model: ${attributionModel}`);
    }
    
    // Store attribution results
    for (const result of results) {
      await ctx.db.insert("attributions", {
        organizationId: deal.organizationId,
        dealId,
        partnerId: result.partnerId,
        model: attributionModel,
        percentage: result.percentage,
        amount: result.amount,
        commissionAmount: result.commissionAmount,
        calculatedAt: Date.now(),
      });
      
      // Update partner stats (denormalized)
      const partner = await ctx.db
        .query("partners")
        .filter((q) => q.eq(q.field("_id"), result.partnerId))
        .first();
      
      if (partner) {
        const newTotalDeals = partner.stats.totalDeals + 1;
        const newTotalRevenue = partner.stats.totalRevenue + result.amount;
        
        await ctx.db.patch(partner._id, {
          stats: {
            totalDeals: newTotalDeals,
            totalRevenue: newTotalRevenue,
            avgDealSize: newTotalRevenue / newTotalDeals,
            lastDealAt: Date.now(),
          },
        });
      }
    }
    
    console.log(`Calculated attribution for deal ${dealId} using ${attributionModel}`);
  },
});
```

---

## 🎯 Implementation Roadmap

### Week 1: Foundation
- [ ] Implement enhanced schema
- [ ] Set up Convex Auth
- [ ] Create basic queries (organizations, partners)
- [ ] Create basic mutations (CRUD partners)
- [ ] Add input validation (Zod schemas)

### Week 2: Attribution Engine
- [ ] Implement all 5 attribution models
- [ ] Write unit tests (100% coverage)
- [ ] Create attribution calculator
- [ ] Add background job for attribution
- [ ] Test with sample data

### Week 3: Dashboard
- [ ] Create dashboard layout (Server Components)
- [ ] Partner list with pagination
- [ ] Deal tracking interface
- [ ] Attribution results view
- [ ] Charts (recharts for analytics)

### Week 4: API & Testing
- [ ] REST API endpoints (/api/v1/*)
- [ ] API authentication (API keys)
- [ ] Rate limiting
- [ ] Integration tests
- [ ] Load testing (artillery)

---

## ✅ Code Quality Checklist

### Type Safety
- [ ] No `any` types (use `unknown` if needed)
- [ ] All functions have return type annotations
- [ ] Zod schemas for all inputs
- [ ] Convex validators for all args

### Performance
- [ ] All queries use indexes
- [ ] Pagination for lists >20 items
- [ ] Server Components by default
- [ ] Lazy load heavy components

### Security
- [ ] Authentication on all protected routes
- [ ] Row-level security in queries
- [ ] Input validation (prevent injection)
- [ ] API rate limiting

### Testing
- [ ] Unit tests for attribution models
- [ ] Integration tests for API
- [ ] E2E tests for critical flows
- [ ] >80% code coverage

### Documentation
- [ ] README with setup instructions
- [ ] API documentation (OpenAPI spec)
- [ ] Inline comments for complex logic
- [ ] Architecture docs (this file!)

---

## 🚀 Next Steps

1. **Copy enhanced schema** → Replace `convex/schema.ts`
2. **Install missing deps** → `npm install zod @convex-dev/auth vitest`
3. **Create folder structure** → `mkdir -p convex/{queries,mutations,lib/attribution}`
4. **Implement core functions** → Start with queries, then mutations
5. **Write tests** → TDD for attribution models
6. **Build dashboard** → Server Components, one page at a time

---

**This codebase has excellent foundations. With these implementations, it'll be production-ready and scalable to 10K customers.**
