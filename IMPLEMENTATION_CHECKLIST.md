# ✅ Implementation Checklist - Partner Attribution Platform

**Start Here** → Complete tasks in order for fastest path to production

---

## 🚀 Phase 1: Foundation (Day 1-3)

### Schema & Database
- [ ] **Copy enhanced schema**
  ```bash
  cp convex/schema.enhanced.ts convex/schema.ts
  npx convex dev
  ```
- [ ] **Verify schema** in Convex Dashboard (check indexes created)
- [ ] **Seed test data** (create sample org, partners, deals)

### Dependencies
- [ ] **Install missing packages**
  ```bash
  npm install zod @convex-dev/auth
  npm install -D vitest @testing-library/react @playwright/test
  ```

### Authentication Setup
- [ ] **Set up Convex Auth** (follow: https://labs.convex.dev/auth)
- [ ] **Create auth config** → `convex/auth.config.ts`
- [ ] **Add ConvexAuthProvider** to `app/layout.tsx`
- [ ] **Test login/signup flow**

---

## 🔧 Phase 2: Core Backend (Day 4-7)

### Queries
- [ ] **Create** `convex/queries/organizations.ts`
  - `getCurrent()` - Get logged-in user's org
  - `getStats()` - Org usage stats
  
- [ ] **Create** `convex/queries/partners.ts`
  - `list()` - Paginated partner list
  - `get(id)` - Single partner details
  - `getStats(id)` - Partner performance metrics

- [ ] **Create** `convex/queries/deals.ts`
  - `list()` - Paginated deals
  - `get(id)` - Deal details
  - `getByStatus(status)` - Filter by open/won/lost

- [ ] **Create** `convex/queries/touchpoints.ts`
  - `getByDeal(dealId)` - All touchpoints for deal
  - `getByPartner(partnerId)` - Partner activity timeline

- [ ] **Create** `convex/queries/analytics.ts`
  - `getOverview()` - Dashboard summary
  - `getByPeriod(period)` - Historical data

### Mutations
- [ ] **Create** `convex/mutations/organizations.ts`
  - `create()` - Signup new org
  - `updateSettings()` - Change attribution model, etc.

- [ ] **Create** `convex/mutations/partners.ts`
  - `create()` - Add new partner
  - `update(id, data)` - Edit partner
  - `remove(id)` - Soft delete

- [ ] **Create** `convex/mutations/deals.ts`
  - `create()` - New deal
  - `update(id, data)` - Edit deal
  - `close(id, status)` - Mark won/lost (triggers attribution)

- [ ] **Create** `convex/mutations/touchpoints.ts`
  - `create()` - Log partner interaction
  - `remove(id)` - Delete touchpoint

### Attribution Engine
- [ ] **Create** `convex/lib/attribution/models.ts`
  - `calculateEqualSplit()`
  - `calculateFirstTouch()`
  - `calculateLastTouch()`
  - `calculateTimeDecay()`
  - `calculateRoleBased()`

- [ ] **Create** `convex/lib/attribution/calculator.ts`
  - `calculate(dealId, model)` - Main orchestrator

- [ ] **Write tests** for attribution models
  ```bash
  npm install -D vitest
  # Create test files: *.test.ts
  npm test
  ```

---

## 🎨 Phase 3: Frontend (Day 8-14)

### Dashboard Layout
- [ ] **Create** `app/(dashboard)/layout.tsx`
  - Sidebar navigation
  - Header with org name
  - ConvexProvider wrapper

- [ ] **Create** `app/(dashboard)/page.tsx`
  - Overview stats (total revenue, deal count)
  - Recent deals table
  - Top partners chart

### Partners Management
- [ ] **Create** `app/(dashboard)/partners/page.tsx`
  - Partner list (paginated)
  - Search/filter
  - "Add Partner" button

- [ ] **Create** `app/(dashboard)/partners/[id]/page.tsx`
  - Partner details
  - Performance stats
  - Touchpoint history

- [ ] **Create** `components/PartnerForm.tsx`
  - Client component for create/edit
  - Zod validation
  - useMutation hook

### Deals Management
- [ ] **Create** `app/(dashboard)/deals/page.tsx`
  - Deal pipeline (columns: Open, Won, Lost)
  - Drag-and-drop (optional)

- [ ] **Create** `app/(dashboard)/deals/[id]/page.tsx`
  - Deal details
  - Touchpoints timeline
  - Attribution results (if won)

- [ ] **Create** `components/DealForm.tsx`
  - Client component
  - Amount, name, status

### Attribution Reports
- [ ] **Create** `app/(dashboard)/attribution/page.tsx`
  - Filter by date range
  - Filter by model
  - Export to CSV button

- [ ] **Create** `components/AttributionChart.tsx`
  - Pie chart (partner split)
  - Bar chart (top performers)

---

## 🔌 Phase 4: External API (Day 15-17)

### API Routes
- [ ] **Create** `app/api/v1/touchpoints/route.ts`
  - POST - Create touchpoint
  - API key auth

- [ ] **Create** `app/api/v1/deals/route.ts`
  - GET - List deals
  - POST - Create deal

- [ ] **Create** `app/api/v1/deals/[id]/route.ts`
  - GET - Deal details
  - PATCH - Update deal

- [ ] **Create** `app/api/webhooks/stripe/route.ts`
  - Handle payment events

### Rate Limiting
- [ ] **Install** Upstash Redis
  ```bash
  npm install @upstash/ratelimit @upstash/redis
  ```
- [ ] **Create** rate limit middleware
- [ ] **Test** with 1000+ requests (artillery)

---

## 📊 Phase 5: Analytics & Monitoring (Day 18-21)

### Pre-computed Analytics
- [ ] **Create** `convex/crons.ts`
  - Daily analytics job (1 AM)
  - Attribution batch processor (every 5 min)

- [ ] **Implement** analytics calculation
  - Aggregate yesterday's deals
  - Store in `analytics` table

### Monitoring
- [ ] **Set up** Sentry
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```

- [ ] **Add** error boundaries
  - `app/error.tsx`
  - `app/(dashboard)/error.tsx`

- [ ] **Create** health check endpoint
  - `app/api/health/route.ts`
  - Check Convex connection

### Testing
- [ ] **Write** integration tests
  - Test API endpoints
  - Test attribution calculations

- [ ] **Write** E2E tests (Playwright)
  - User signup → create partner → close deal → see attribution

- [ ] **Load test** with Artillery
  ```bash
  npm install -g artillery
  artillery quick --count 100 --num 10 https://yourapp.com/api/v1/touchpoints
  ```

---

## 🚀 Phase 6: Production Launch (Day 22-28)

### Pre-launch
- [ ] **Security audit**
  - Review all API routes (authentication)
  - Check input validation (Zod)
  - Test rate limiting

- [ ] **Performance audit**
  - Lighthouse score >90
  - All queries <500ms
  - Bundle size <100KB

- [ ] **Documentation**
  - API docs (OpenAPI/Swagger)
  - User guide
  - README with setup

### Launch
- [ ] **Deploy to Vercel**
  ```bash
  vercel --prod
  ```

- [ ] **Run smoke tests**
  - Create account
  - Add partner
  - Create deal
  - Close deal
  - Check attribution

- [ ] **Set up monitoring**
  - Vercel Analytics
  - Sentry alerts
  - Uptime monitoring (UptimeRobot)

### Post-launch
- [ ] **Monitor** for 48 hours
  - Check error rates
  - Watch response times
  - Review user feedback

- [ ] **Optimize** bottlenecks
  - Add indexes if queries slow
  - Cache hot queries
  - Optimize bundle size

---

## 📈 Optimization Quick Wins

### Can do in <1 hour each:

**1. Add Indexes** (10 minutes)
- Already done in enhanced schema ✅

**2. Server Components** (30 minutes)
- Mark forms/modals as `'use client'`
- Everything else defaults to Server Components

**3. Lazy Attribution** (1 hour)
- Use `ctx.scheduler.runAfter()` in `closeDeal()`
- Returns immediately, calculates in background

**4. Pagination** (30 minutes)
- Use `.paginate({ numItems: 20 })` instead of `.collect()`

**5. Image Optimization** (15 minutes)
- Replace `<img>` with `<Image>` from `next/image`

---

## 🎯 Success Criteria

### Performance
- [ ] P95 response time <500ms
- [ ] Dashboard load <1s
- [ ] Attribution calculation <2s

### Scalability
- [ ] 1000 concurrent users (load test)
- [ ] 10,000 partners (test with seed data)
- [ ] 100,000 touchpoints (query performance)

### Code Quality
- [ ] 100% TypeScript (no `any`)
- [ ] >80% test coverage
- [ ] Zero console errors
- [ ] ESLint passing

### Business
- [ ] End-to-end flow working (signup → attribution)
- [ ] All 5 attribution models tested
- [ ] API documentation published
- [ ] Ready for first customer

---

## 📚 Resources

### Docs
- [Convex Docs](https://docs.convex.dev)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Convex Auth Guide](https://labs.convex.dev/auth)

### Code Examples
- See `CODE_REVIEW.md` for implementation snippets
- See `ARCHITECTURE.md` for system design
- See `SCALING_GUIDE.md` for growth plan

### Tools
- [Convex Dashboard](https://dashboard.convex.dev) - Monitor queries
- [Vercel Dashboard](https://vercel.com/dashboard) - Deployment
- [Sentry](https://sentry.io) - Error tracking

---

## 🆘 Troubleshooting

### "Query too slow" (>1s)
1. Check if index exists for that query
2. Add index to schema
3. Verify with Convex Dashboard

### "Bundle too large" (>500KB)
1. Run `npm run analyze`
2. Lazy load heavy components
3. Remove unused dependencies

### "Attribution calculation wrong"
1. Check unit tests (should be 100% coverage)
2. Verify touchpoint data (createdAt, type, weight)
3. Test with known scenarios

---

**Ready to build? Start with Phase 1!** 🚀
