# 🎬 Steve Jobs Demo Readiness Audit — PartnerBase

**Date:** February 12, 2026  
**Auditor:** AI Code Reviewer (Opus-level depth)  
**Verdict:** ✅ **DEMO READY** — with caveats below  

---

## Executive Summary

PartnerBase is an impressively complete demo-mode SaaS application. The breadth is remarkable — 16+ pages, 5 attribution models, full partner portal, AI chat, certifications, scoring, dark mode, keyboard shortcuts, CSV export, and platform configuration. For a demo, this is **90th percentile quality**.

But Steve wouldn't demo a product at 90%. He'd want 100%. Here's what stands between good and *insanely great*.

---

## 🔴 BROKEN FUNCTIONALITY (Demo Blockers)

### 1. Recharts SSR Warnings During Build
**Severity: Low-Medium**  
Build logs show "width(-1) and height(-1) of chart should be greater than 0" warnings for Recharts components during static generation. These charts render fine client-side but the warnings suggest potential flash-of-empty-chart on initial page load in production.

**Fix:** Wrap `<ResponsiveContainer>` charts in a client-side mounted check or add explicit `minWidth`/`minHeight` props.

### 2. Portal Dark Mode Not Fully Supported
**Severity: Medium**  
The portal sidebar has hardcoded `background: "#fff"` and `background: "white"` in inline styles (portal layout.tsx, portal gate). In dark mode, the portal sidebar stays white while the content goes dark — jarring split.

**Where:** `app/portal/layout.tsx` line ~80: `background: '#fff'` on sidebar, and PortalGate's `background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"` doesn't have a dark variant.

**Fix:** Replace hardcoded colors with `var(--bg)` and `var(--border)`.

### 3. Portal Mobile Bar Also Hardcoded White
**Severity: Low**  
The portal mobile top bar has `background: '#fff'` — won't respect dark mode.

### 4. "Benefits" Section Cards Hardcoded White Background
**Severity: Low**  
Landing page "Who it's for" section: `background: "white"` on cards. In dark mode these will be white boxes on dark background.

### 5. Deals Page Table View Toggle Uses `background: "white"`
**Severity: Low**  
The pipeline/table view toggle buttons in deals page have hardcoded `background: "white"` instead of `var(--bg)`.

---

## 🟡 MISSING FEATURES (Would Make Demo Incomplete)

### 6. No Keyboard Shortcuts Help UI ⌨️
**Severity: Medium**  
Keyboard shortcuts exist (`g d`, `g p`, etc.) but the `?` shortcut only logs to the browser console. During a Steve Jobs demo, you'd want a gorgeous overlay/modal showing all shortcuts. The audience can't see `console.log`.

**What exists:** Console-only output in `keyboard-shortcuts.tsx`  
**What's needed:** A `⌘?` modal overlay showing shortcuts with visual key badges.

### 7. No Search on Deals Page
**Severity: Medium**  
Partners page has search, payouts has search, activity has search — but the Deals page has **no search bar**. With 10 deals it's fine, but it breaks the pattern and looks inconsistent during a demo walkthrough.

### 8. No "Close Deal" Confirmation Toast
**Severity: Low-Medium**  
When you close a deal as Won or Lost from the deal detail page, there's no toast/success confirmation. Every other action (add partner, create deal, export CSV, save settings) shows a toast. This action — arguably the most important one — is silent.

### 9. No Success Confirmation After Adding a Touchpoint
**Severity: Low**  
`handleAddTouchpoint` in deal detail closes the modal but doesn't fire a toast. Compare to "Add Partner" which toasts.

### 10. Team Management Placeholder
**Severity: Low**  
Settings page shows "Team management coming soon" — acceptable for demo but Steve might say "why show what you can't do?"

### 11. No Notification System / Inbox
**Severity: Medium**  
For a partner ops platform, there's no notification bell, no inbox, no alerts. When a deal is registered, when a payout is pending, when a dispute is filed — nobody gets notified in the UI. This is a gap partner ops teams would immediately ask about.

### 12. No Deal Registration Approval Workflow (Admin Side)
**Severity: Medium**  
Partners can register deals from the portal (status shows "pending"), but there's no admin-side view to approve/reject deal registrations. The deal appears with `registrationStatus: "pending"` but there's no UI to action it.

### 13. No Drag-and-Drop on Pipeline View
**Severity: Low**  
The deals pipeline view (Open/Won/Lost columns) looks like a Kanban but cards aren't draggable. This is a visual promise without fulfillment.

### 14. Attribution Not Recalculated on Deal Close
**Severity: Medium**  
When you close a new deal as "Won" (one you created during the demo), attributions are NOT calculated for it. The `closeDeal` function just updates status — it doesn't trigger `generateAttributions()`. So if you demo "create deal → add touchpoints → close as won", the attribution section will be empty.

### 15. No Date Picker for Deal Expected Close Date
**Severity: Low**  
New deal form doesn't have an expected close date field, even though the data model supports `expectedCloseDate`.

### 16. No Bulk Actions
**Severity: Low**  
No ability to select multiple partners/deals/payouts for bulk actions (approve all pending payouts, export selected, etc.). Standard table UX.

### 17. Reports Page Has No Date Range Filter
**Severity: Low-Medium**  
Reports/attribution analysis has no way to filter by time period. For a QBR presentation, you'd want "show me Q1" or "last 90 days."

---

## 🟢 DELIGHT OPPORTUNITIES (Would Make Demo Memorable)

### 18. 🎯 "One More Thing" — Live Attribution Recalculation
**Impact: HIGH**  
Imagine during the demo: "Let me add a touchpoint to this deal... watch. The attribution just recalculated in real-time across all 5 models."

Currently attribution is static (pre-computed). Making it reactive would be the ultimate demo moment.

### 19. ✨ Ask PartnerBase is a Hidden Gem — Feature It More
**Impact: HIGH**  
The AI chat widget is genuinely impressive — 13+ pattern matchers covering revenue, pipeline, churn risk, partner scores, payouts, etc. But it's hidden behind a small floating button. During a demo:
- Have it auto-open on first visit
- Show a "Try asking..." banner on the dashboard  
- The example queries are great — make them more discoverable

### 20. 🎨 Animate Model Switching on Deal Detail
**Impact: Medium**  
The 5-model attribution comparison chart on deal detail is powerful. Add a smooth animation when switching models in the leaderboard. The data changes but there's no visual transition.

### 21. 📊 Add Sparklines to Dashboard Stat Cards
**Impact: Medium**  
The 4 stat cards (Total Revenue, Pipeline, Active Partners, Win Rate) are static numbers. Adding tiny sparklines showing 7-day trend would make them feel *alive*.

### 22. 🎭 Portal Partner Switcher is Genius
**Impact: Already great**  
The demo mode partner switcher on the profile page (letting you view the portal as different partners) is a brilliant demo tool. Make sure to call it out.

### 23. 🔔 Animated Notification Count on Dashboard
**Impact: Medium**  
Add a subtle pulse animation on the "Pending Approvals" count when there are items waiting. Draw attention to the action item.

### 24. 🏆 Confetti on Deal Won
**Impact: HIGH**  
When you close a deal as "Won" — fire confetti. It's a moment of celebration. Every CRM does this now and it's always a crowd-pleaser.

### 25. 📱 Progressive Disclosure on Mobile
**Impact: Medium**  
Mobile hamburger works, layouts stack properly. But the stat grids go from 4-column to 1-column with no 2-column intermediate. At tablet width (768-1024px), 2-column stat grids would look much better.

Already partially handled in CSS but `stat-grid` only goes from 4→2→1.

### 26. 🎪 Landing Page Demo Query Should Be Interactive
**Impact: HIGH**  
The hero demo card on the landing page is static text. Imagine if clicking "Show me Q1 partner performance" actually animated a typing effect and revealed the response progressively. That would be a "Holy shit" moment.

### 27. 💰 Show ROI Calculator
**Impact: Medium**  
Add a simple "How much is partner attribution worth to you?" calculator on the landing page. Input your partner count and average deal size → see estimated impact. Interactive engagement before the demo even starts.

---

## ✅ WHAT'S WORKING BEAUTIFULLY

### Landing Page
- ✅ Hero copy is strong and specific
- ✅ Waitlist form validates, shows success state, resets
- ✅ Email validation (empty + format)  
- ✅ Pricing cards are clear (Starter/Growth/Enterprise)
- ✅ All platform module links point to real pages
- ✅ Footer links work (internal) or gracefully prevent default (external)
- ✅ Demo card content is compelling and realistic

### Dashboard
- ✅ All 4 stat cards show correct computed data
- ✅ Recent deals list with links
- ✅ Pending approvals with amounts
- ✅ Top partners with avatars
- ✅ Recent activity feed
- ✅ Customization callout banner

### Partners
- ✅ Add partner with validation (name required, email format)
- ✅ Edit partner with modal
- ✅ View detail page with full timeline
- ✅ Filters (type, status) work
- ✅ Search works
- ✅ Export CSV downloads properly
- ✅ Import CSV parses and adds partners
- ✅ Certification/badge indicators on partner rows
- ✅ Empty state when filtered to zero results

### Deals
- ✅ Pipeline view (Kanban-style) and table view toggle
- ✅ Add deal with partner registration
- ✅ Close deal modal (Won/Lost)
- ✅ Deal detail page with full attribution comparison
- ✅ Touchpoint timeline (horizontal, visual)
- ✅ Add touchpoint modal
- ✅ 5-model attribution comparison chart (Recharts)
- ✅ Full attribution + commission table
- ✅ Partners involved section
- ✅ Export CSV

### Attribution / Reports
- ✅ Model comparison bar chart
- ✅ Radar chart (partner revenue across models)
- ✅ Pie chart (revenue split by partner)
- ✅ Partner leaderboard with model + sort switching
- ✅ 5 clickable model cards
- ✅ Export CSV per model

### Payouts
- ✅ Full CRUD: create, approve, reject, mark paid
- ✅ Confirmation dialogs for approve/pay
- ✅ Reject with optional reason
- ✅ Summary stat cards (pending, approved, paid, total)
- ✅ Action banner for pending items
- ✅ Search and status filter
- ✅ Export CSV
- ✅ Audit trail entries created for every action

### Scoring
- ✅ 4-dimension scoring (revenue, pipeline, engagement, velocity)
- ✅ Expandable scorecards with dimension breakdowns
- ✅ Tier recommendations (upgrade/downgrade/maintain)
- ✅ Weight adjustment sliders with auto-rebalancing
- ✅ Trend indicators
- ✅ Export CSV
- ✅ Explanatory legend

### Certifications
- ✅ 4 tabs (certs, badges, training, endorsements)
- ✅ Summary stat cards
- ✅ Search across all tabs
- ✅ Badge grid display with emoji icons
- ✅ Training scores with color-coded thresholds
- ✅ Level badges (beginner → expert)

### Activity
- ✅ Grouped by date
- ✅ Rich metadata display (changes, pills)
- ✅ Entity links (click deal/partner name → detail page)
- ✅ 3 independent filters (search, entity type, action type)
- ✅ Export CSV
- ✅ Stat cards (total, today, deal events, partner events)

### Settings
- ✅ Org settings save
- ✅ Attribution model selection with descriptions
- ✅ API key show/hide/copy
- ✅ Platform configuration with feature flags
- ✅ Complexity level toggle (Simple/Standard/Advanced)
- ✅ UI density selector
- ✅ MCP integration instructions
- ✅ Danger zone with appropriate warnings
- ✅ Reset to defaults

### Portal
- ✅ Gate screen with partner selection
- ✅ Portal dashboard with stats + activity
- ✅ Deals page with deal registration
- ✅ Deal detail with attribution explanation + dispute
- ✅ Commissions page with export
- ✅ Profile with tier status + partner manager
- ✅ Resources library (4 categories)
- ✅ Enablement page (certs, badges, training, endorsements)
- ✅ Deal registration with success confirmation
- ✅ Dispute attribution workflow
- ✅ Partner switcher for demo mode

### Ask PartnerBase
- ✅ 13+ query patterns (top partners, pipeline, churn, scores, payouts...)
- ✅ Markdown-formatted responses
- ✅ Example queries that auto-send
- ✅ Typing animation
- ✅ Chat history with clear button
- ✅ Timestamps on messages
- ✅ Mobile-responsive (full-screen on small viewports)
- ✅ Dark mode support for FAB and modal

### Dark Mode
- ✅ Toggle works (Moon/Sun icons)
- ✅ Persists to localStorage
- ✅ Respects system preference on first load
- ✅ Flash-prevention script in `<head>`
- ✅ CSS variables properly swap
- ⚠️ Some hardcoded colors in portal (see blockers above)

### Mobile / Responsive
- ✅ Hamburger menu works
- ✅ Mobile menu overlay with backdrop
- ✅ Routes close mobile menu
- ✅ Body scroll locked when menu open
- ✅ Stat grids collapse (4→2→1)
- ✅ Tables are scrollable (`table-responsive`)
- ✅ Portal has separate mobile nav

### Keyboard Shortcuts
- ✅ `g d/p/l/r/a/s/o/c` all navigate correctly
- ✅ Ignored when typing in inputs
- ✅ 1-second timeout on prefix
- ⚠️ No visual help overlay (console only)

### Code Quality
- ✅ TypeScript throughout with proper types
- ✅ 41 attribution tests passing
- ✅ Clean build with no errors
- ✅ Convex schema ready (backend can be connected)
- ✅ Store pattern with proper memoization
- ✅ Platform config persists across sessions
- ✅ Feature flags dynamically show/hide nav items
- ✅ Toast notifications with auto-dismiss
- ✅ Modal with Escape key support + backdrop click
- ✅ Proper empty states throughout

---

## 📋 PRIORITIZED FIX LIST

### Must Fix Before Demo (30 min)
1. **Portal dark mode** — Replace `"#fff"` with `var(--bg)` in portal layout/gate (~5 lines)
2. **Landing page dark mode** — Replace `background: "white"` with `var(--bg)` on benefit cards
3. **Deals page toggle dark mode** — Replace `"white"` with `var(--bg)`
4. **Add toast on deal close** — 1 line in `handleClose()` function
5. **Add toast on touchpoint add** — 1 line

### Should Fix Before Demo (1-2 hours)
6. **Add search to Deals page** — Copy pattern from Partners page
7. **Keyboard shortcuts help modal** — Light overlay component
8. **Attribution recalculation on deal close** — Run the generator when status changes to "won"

### Would Elevate the Demo (4-8 hours)
9. **Confetti on deal won** 
10. **Interactive landing page demo** (typing animation)
11. **Ask PartnerBase auto-open hint on dashboard**
12. **Deal registration approval workflow**

---

## 🏁 FINAL VERDICT

**Is this Steve Jobs demo ready?**

The application is **remarkably complete** for a demo-mode product. The data is realistic, the UX is consistent, the feature depth is impressive, and the customization story (toggle complexity, feature flags) is genuinely differentiated.

**The 5 dark-mode hardcoded colors and the missing deal-close toast are the only true blockers** — everything else is polish. Fix those 5 lines and 2 toast calls, and you could walk on stage right now.

The biggest untapped opportunity: **Make the attribution recalculate live when closing a demo deal.** That's your "one more thing" moment. Show the audience a deal going from open → won and watch 5 attribution models compute credit splits in real-time. That's when jaws drop.

**Score: 92/100** → Fix blockers → **96/100** → Add live attribution → **💯**
