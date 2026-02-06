# Convex Backend Documentation

**Partner Attribution Platform Backend**

This directory contains all Convex backend functions organized by domain.

---

## 📁 Structure

```
convex/
├── schema.ts                    # Database schema
├── _generated/                  # Auto-generated Convex types
│
├── lib/                         # Shared utilities
│   ├── attribution.ts           # Attribution algorithms (pure functions)
│   ├── validation.ts            # Input validators
│   └── helpers.ts               # Common helper functions
│
├── organizations/               # Organization domain
│   ├── queries.ts               # getByApiKey, getStats
│   └── mutations.ts             # create, update, regenerateApiKey
│
├── partners/                    # Partners domain
│   ├── queries.ts               # list, get, getStats, search
│   └── mutations.ts             # create, update, activate, deactivate, remove
│
├── deals/                       # Deals domain
│   ├── queries.ts               # list, get, getWithDetails, getStatsByStatus
│   └── mutations.ts             # create, update, close, reopen, remove
│
├── touchpoints/                 # Touchpoints domain
│   ├── queries.ts               # listByDeal, listByPartner, get
│   └── mutations.ts             # create, update, remove
│
└── attributions/                # Attribution domain
    ├── queries.ts               # getByDeal, getByPartner, getAnalytics, compareModels
    └── mutations.ts             # calculate, recalculate, deleteByDeal
```

---

## 🔐 Authentication

All queries and mutations require an `apiKey` parameter for authentication.

```typescript
// Get API key during organization creation
const { apiKey } = await ctx.runMutation(api.organizations.mutations.create, {
  name: "Acme Inc",
  email: "team@acme.com",
  plan: "growth"
})

// Use API key in subsequent calls
const partners = await ctx.runQuery(api.partners.queries.list, {
  apiKey: apiKey,
  paginationOpts: { numItems: 50, cursor: null }
})
```

---

## 🚀 Typical Workflow

### 1. Create Organization
```typescript
const { _id, apiKey } = await createOrganization({
  name: "Acme Inc",
  email: "team@acme.com",
  plan: "starter"
})
```

### 2. Add Partners
```typescript
const partnerId = await createPartner({
  apiKey,
  name: "John Doe",
  email: "john@partner.com",
  type: "affiliate",
  commissionRate: 15 // 15%
})
```

### 3. Create Deal
```typescript
const dealId = await createDeal({
  apiKey,
  name: "Enterprise Deal - Acme",
  amount: 50000 // $50,000
})
```

### 4. Add Touchpoints
```typescript
await createTouchpoint({
  apiKey,
  dealId,
  partnerId,
  type: "referral",
  notes: "Initial introduction via LinkedIn"
})

await createTouchpoint({
  apiKey,
  dealId,
  partnerId,
  type: "demo",
  notes: "Product demo on 2024-01-15"
})
```

### 5. Close Deal
```typescript
await closeDeal({
  apiKey,
  dealId,
  status: "won"
})
```

### 6. Calculate Attribution
```typescript
const results = await calculateAttribution({
  apiKey,
  dealId
})

// Results contain attribution for all 5 models:
// - equal_split
// - first_touch
// - last_touch
// - time_decay
// - role_based
```

### 7. View Results
```typescript
const attributions = await getAttributionsByDeal({
  apiKey,
  dealId,
  model: "time_decay" // Optional: filter by model
})

// Each attribution contains:
// - partnerId
// - percentage (0-100)
// - amount (deal amount × percentage)
// - commissionAmount (amount × partner commission rate)
```

---

## 📊 Attribution Models

### 1. Equal Split
Each partner gets equal credit.

**Use Case:** All partners contributed equally.

**Example:**
- 3 partners → 33.33% each
- 2 partners → 50% each

### 2. First Touch
100% credit to the first partner who touched the deal.

**Use Case:** Awareness campaigns, lead generation.

**Example:**
- Partner A: 100% (earliest touchpoint)
- Partner B: 0%

### 3. Last Touch
100% credit to the last partner who touched the deal.

**Use Case:** Conversion tracking, closers.

**Example:**
- Partner A: 0%
- Partner B: 100% (latest touchpoint)

### 4. Time Decay
More recent touchpoints get higher weight using exponential decay.

**Formula:** `weight = e^(-λ * days_ago)`

**Use Case:** Balanced view with recency bias.

**Example (λ=0.1):**
- Touchpoint 30 days ago: weight = 0.05
- Touchpoint 10 days ago: weight = 0.37
- Touchpoint 1 day ago: weight = 0.90

### 5. Role-Based
Different touchpoint types have different weights.

**Default Weights:**
- Referral: 30%
- Demo: 25%
- Proposal: 25%
- Negotiation: 20%
- Introduction: 10%
- Content Share: 5%

**Use Case:** Complex B2B sales with multiple touchpoint types.

**Example:**
- Partner A: 1 referral (30 points)
- Partner B: 1 demo + 1 proposal (50 points)
- Partner A gets 37.5%, Partner B gets 62.5%

---

## 🔍 Querying Data

### Pagination
All list queries support Convex pagination:

```typescript
const result = await listPartners({
  apiKey,
  paginationOpts: {
    numItems: 50,
    cursor: null // First page
  }
})

// result.page - Current page items
// result.continueCursor - Next page cursor
// result.isDone - true if last page

// Get next page
const nextPage = await listPartners({
  apiKey,
  paginationOpts: {
    numItems: 50,
    cursor: result.continueCursor
  }
})
```

### Filtering
Many queries support status filtering:

```typescript
// Get only active partners
const activePartners = await listPartners({
  apiKey,
  status: "active",
  paginationOpts: { numItems: 50, cursor: null }
})

// Get only won deals
const wonDeals = await listDeals({
  apiKey,
  status: "won",
  paginationOpts: { numItems: 50, cursor: null }
})
```

### Enriched Data
Some queries return enriched data with related entities:

```typescript
// Get deal with touchpoints and partners
const dealDetails = await getWithDetails({
  apiKey,
  dealId
})

// Returns:
// - deal
// - touchpoints (with partner data)
// - attributions (if deal is won)
// - partnersInvolved
```

---

## 📈 Analytics Queries

### Organization Stats
```typescript
const stats = await getOrgStats({ apiKey })

// Returns:
// - partnersCount
// - activePartnersCount
// - dealsCount
// - openDealsCount
// - wonDealsCount
// - totalRevenue
// - avgDealSize
// - touchpointsCount
// - attributionsCount
```

### Partner Performance
```typescript
const stats = await getPartnerStats({ apiKey, partnerId })

// Returns:
// - touchpointsCount
// - dealsInvolvedCount
// - attributionsCount
// - totalAttributedRevenue
// - totalCommission
// - avgAttributionPercentage
```

### Attribution Analytics
```typescript
const analytics = await getAttributionAnalytics({
  apiKey,
  model: "time_decay"
})

// Returns:
// - partners: Array of partner stats
//   - partnerId
//   - partnerName
//   - dealsCount
//   - totalRevenue
//   - totalCommission
//   - avgPercentage
// - summary:
//   - totalDeals
//   - totalRevenue
//   - totalCommissions
```

### Model Comparison
```typescript
const comparison = await compareModels({ apiKey, dealId })

// Returns attribution results for all 5 models
// Shows how each model would attribute credit
```

---

## ⚠️ Error Handling

All functions throw descriptive errors:

```typescript
try {
  await createPartner({ apiKey, ...data })
} catch (error) {
  console.error(error.message)
  // "Invalid email format: not-an-email"
  // "Partner with this email already exists in your organization"
  // "Invalid API key"
  // "Unauthorized"
}
```

### Common Errors
- `"Invalid API key"` - API key not found or incorrect
- `"Unauthorized"` - Attempting to access resource from different organization
- `"[Resource] not found"` - ID doesn't exist
- `"Cannot [action] [resource]"` - Business logic constraint (e.g., can't add touchpoints to closed deal)

---

## 🧪 Testing Attribution Algorithms

Attribution algorithms are pure functions and can be tested independently:

```typescript
import { calculateAttribution } from "./lib/attribution"

const touchpoints = [
  { partnerId: "p1", createdAt: Date.now() - 86400000, type: "referral" },
  { partnerId: "p2", createdAt: Date.now(), type: "demo" }
]

const result = calculateAttribution(touchpoints, "equal_split")
// [{ partnerId: "p1", percentage: 50 }, { partnerId: "p2", percentage: 50 }]
```

See `lib/attribution.ts` for all available functions.

---

## 🔒 Security Best Practices

### Multi-Tenancy Isolation
Every query/mutation:
1. Validates API key
2. Checks resource ownership via `organizationId`
3. Throws "Unauthorized" if ownership check fails

### Input Validation
All inputs are validated:
- Email format
- Percentage ranges (0-100)
- Non-empty strings
- Positive amounts

### API Key Security
- API keys are generated securely (32 characters, random)
- Stored as plain text (indexed for fast lookup)
- Can be regenerated (invalidates old key)
- Never returned except on creation

---

## 📝 Logging

Important operations are logged:

```typescript
console.log("Attribution calculated", {
  dealId,
  model,
  duration: calculationTime
})
```

View logs in Convex Dashboard → Functions → Logs

---

## 🚀 Performance

### Indexing Strategy
All queries use indexes - no table scans.

Key indexes:
- `organizations.by_apiKey` - Authentication
- `partners.by_organization` - List partners
- `deals.by_organization` - List deals
- `touchpoints.by_deal` - Get deal touchpoints
- `attributions.by_partner` - Partner performance

### Query Optimization
- Pagination on all lists (default 50 items)
- Composite indexes for complex queries
- Enriched queries batch-fetch related data

### Attribution Calculation
- Pure functions (no side effects)
- O(n) complexity for all models
- Sub-500ms for typical deal (5-10 touchpoints)

---

## 🛠️ Extending

### Adding a New Attribution Model

1. Add algorithm to `lib/attribution.ts`:
```typescript
export function calculateMyModel(touchpoints: Touchpoint[]): Attribution[] {
  // Your logic here
  return attributions
}
```

2. Update schema enum:
```typescript
model: v.union(
  // ... existing models
  v.literal("my_model")
)
```

3. Add to `calculateAttribution()` switch statement

4. Test thoroughly!

### Adding a New Domain

1. Create folder: `convex/mydomain/`
2. Add `queries.ts` and `mutations.ts`
3. Follow existing patterns (authentication, validation, ownership checks)
4. Import and use in frontend

---

## 📚 Additional Resources

- [Convex Docs](https://docs.convex.dev)
- [Schema Design Best Practices](https://docs.convex.dev/database/schemas)
- [Indexing Guide](https://docs.convex.dev/database/indexes)
- [Testing Convex Functions](https://docs.convex.dev/production/testing)

---

**Questions?** Check the main project `ARCHITECTURE.md` and `RECOMMENDATIONS.md` for more details.
