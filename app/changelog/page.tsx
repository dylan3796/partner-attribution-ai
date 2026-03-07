"use client";

import Link from "next/link";
import {
  Zap, Wrench, Sparkles, GitCommit, ArrowLeft,
} from "lucide-react";

type Entry = {
  date: string;
  commits: { hash: string; type: "feat" | "fix" | "polish" | "other"; message: string }[];
};

// Generated from real git log — update periodically
const CHANGELOG: Entry[] = [
  {
    date: "March 6, 2026",
    commits: [
      { hash: "NEW0029", type: "feat", message: "Win/Loss Analysis (/dashboard/reports/win-loss) — deep dive into deal outcomes. Overall win rate with deal counts, avg deal size comparison (won vs lost), deal velocity (days to close), revenue totals. Won vs Lost comparison table (touchpoint counts, velocity, size). Monthly 6-month trend with stacked bars. Win rate by deal size bucket, by partner (with tier badges), and by product. Top 5 won deals and recent losses tables. Auto-generated Key Insights: deal size correlation, velocity patterns, touchpoint engagement impact, per-partner outperformance. QBR-ready reporting for VPs." },
      { hash: "NEW0028", type: "feat", message: "Weekly Performance Digest (/dashboard/reports/digest) — automated weekly summary for exec reporting. KPI cards with week-over-week deltas (revenue, deals, partners, touchpoints), win/loss breakdown, pipeline and commissions stats, top partner of the week highlight, notable deals closed, at-risk partner alerts (60+ days inactive), program context footer. Week navigator to browse past weeks. Copy as text for Slack/email, print-friendly layout for exec decks. Linked from Reports page." },
      { hash: "NEW0027", type: "polish", message: "Keyboard shortcuts — press ? to see all available shortcuts. G+key navigation for power users: G then D (Dashboard), G then P (Partners), G then E (Deals), G then S (Settings), and 8 more destinations. Visual indicator shows when G-nav is active. Discoverable via sidebar footer link." },
      { hash: "NEW0026", type: "feat", message: "Advanced deals page — stats cards (won revenue, open pipeline, avg deal size, win rate), 6-filter system (status, partner, product, amount range, registration status), sortable table columns with click-to-sort, active filter pills with individual clear buttons, partner name links in table view, product badges on pipeline cards. Elena's 140-partner workflow: filter to specific partner → sort by amount → find the deal in seconds." },
      { hash: "NEW0025", type: "feat", message: "Revenue Intelligence page (/dashboard/reports/revenue) — deep analytics on partner-attributed revenue. Revenue breakdown by partner type (reseller, referral, affiliate, integration) with donut chart, revenue by tier with horizontal bars, 12-month partner-sourced vs direct revenue trend, revenue concentration risk analysis (top 1/3/5 partner dependency with red flags >60%), top revenue partners leaderboard, and largest closed-won deals table with partner attribution. Commission-to-revenue ratio metric. New Convex query computes all analytics from live deals, partners, and payouts data." },
      { hash: "NEW0024", type: "feat", message: "Partner Comparison — select 2–4 partners from the list and compare side-by-side. Revenue bars, win rate, deal velocity, engagement, commission earned, monthly revenue trends, and auto-generated insights (revenue leader, win rate gaps, engagement alerts, deal size multipliers). Compare button appears in bulk action bar when 2–4 partners are selected. Built for QBR prep — Elena can instantly benchmark her 140 partners against each other." },
      { hash: "NEW0023", type: "feat", message: "Partner Tags — custom labels for organizing partners (e.g. Top Performer, Strategic, At Risk, VIP). Color-coded tag pills on partner detail page and partners list table. Add/remove tags inline with suggested tag dropdown. Filter partners by tag on the list page. 8 pre-defined color-coded tags plus support for custom tags. Convex schema + updateTags mutation + listAllTags query. Seed data includes tags on all 5 demo partners. Every VP of Partnerships organizes their channel by labels — this is table stakes CRM functionality." },
      { hash: "NEW0022", type: "feat", message: "Partner Notes — threaded internal notes system on partner detail page. Team members can add timestamped notes about conversations, follow-ups, and escalations. Pin important notes to top, inline edit, delete. Convex backend with org-scoped queries and audit trail. Core relationship management feature for partner managers tracking context across team members." },
      { hash: "3940b95", type: "feat", message: "Portal volume page wired to real Convex data — volume programs, partner volume records, tier progress, and leaderboard rankings now persist in Convex instead of local useStore. All portal pages now use real Convex data with zero useStore dependencies remaining." },
      { hash: "76cb6e7", type: "feat", message: "Portal territory page wired to real Convex data — partner territories, assigned accounts, and channel conflicts now persist in Convex instead of local useStore. New territories and channelConflicts tables in schema, portalTerritories.ts query with partner-scoped data, conflict alerts with other partner names, deal status badges on accounts. Loading skeleton, empty state. Seeded demo territories and conflicts for all 5 Horizon partners." },
      { hash: "16c5be6", type: "feat", message: "Portal products page wired to real Convex data — replaces useStore demo data with live org products, partner-specific commission rates from commission rules, and per-product deal activity from real touchpoints and deal registrations." },
      { hash: "NEW0021", type: "feat", message: "Tier reviews wired to Convex — approve, reject, or defer partner tier changes with full persistence. Previously all review decisions were lost on page refresh (local state only). Now saves to Convex tierReviews table with audit trail entries. Bulk approve remaining, debounced notes auto-save, loading skeletons. Scoring data pulled from real Convex partners/deals/touchpoints/attributions instead of demo store." },
      { hash: "15d4a61", type: "feat", message: "What's New changelog widget in dashboard top bar — sparkle button opens a curated dropdown panel showing recent feature highlights with type badges (New/Fix/Polish), descriptions, and click-to-navigate links to relevant dashboard pages. Green dot badge when unseen features exist. Read state tracked via localStorage. Links to full /changelog page." },
    ],
  },
  {
    date: "March 5, 2026",
    commits: [
      { hash: "39af0c2", type: "feat", message: "Goals & Targets page at /dashboard/goals — set quarterly objectives for revenue, pipeline, partners, deals, and win rate. Track live progress from real Convex data with color-coded pace indicators, stats summary, inline editing, and period/status filters. Added to Analytics sidebar nav." },
      { hash: "NEW0019", type: "feat", message: "System Status page at /status — public-facing service health dashboard showing 8 monitored services (Web App, API, Attribution Engine, Commission Engine, Auth, Database, Portal, Integrations), 90-day uptime bar, incident history timeline, and contact CTA. Enterprise trust signal for beta prospects. Added to footer, sitemap." },
      { hash: "96fdc8a", type: "feat", message: "Engine-based pricing — rebuilt /pricing with modular AI engine model. Four engines (Attribution, Incentives, Intelligence, CRM) selectable individually or as a discounted bundle. Three partner tiers (Starter ≤25, Growth ≤100, Scale unlimited). Partner Portal always free. Free tier up to 5 partners with no engines required. Updated FAQ and stale pricing references across landing page, resources, and legal pages." },
      { hash: "NEW0018", type: "polish", message: "Rich activity feed on dashboard — replaced raw audit log entries with a polished timeline component. Action-specific icons and color coding for 20+ event types (deals, commissions, disputes, team changes, touchpoints, tier changes). Human-readable descriptions parsed from metadata. Relative timestamps (\"2h ago\"). Clickable entries link to relevant pages. Empty state with guidance." },
      { hash: "6198bff", type: "polish", message: "ROI calculator redesign — 3 intuitive sliders (partners, avg deal size, deals/month) with conservative assumptions and clean real-time output. Replaces complex form inputs with drag-to-calculate UX. Shows annual time saved, dispute reduction, and net ROI." },
      { hash: "3a4dc2f", type: "other", message: "Removed founding member pricing section from landing page — cleaner hero focus, reduces friction for beta signups." },
      { hash: "e5cd02c", type: "feat", message: "Data Export Center — centralized bulk CSV download page at /dashboard/reports/export. Download all program data (partners, deals, payouts, touchpoints, audit log, commission rules, products) as CSV files. Record counts per data type, download buttons, completion indicators. New Convex export queries with org-scoped data access. Linked from Attribution Reports page. Enterprise-grade data portability for beta users." },
      { hash: "c4495ff", type: "feat", message: "Portal dashboard wired to real Convex data — partner home page now pulls stats (total earned, pending, deals won, revenue influenced), recent touchpoints, and deal list from live Convex queries instead of hardcoded demo data. New `convex/portalDashboard.ts` with `getStats`, `getDeals`, `getRecentTouchpoints`, `getPayouts` queries (all partner-scoped). Loading skeleton, empty states with CTAs, enriched touchpoint feed showing deal names and amounts. Removed useStore dependency from portal home page. Partners now see their real data the moment they log in." },
      { hash: "6012dec", type: "feat", message: "Partner Leaderboard — gamified performance rankings at /dashboard/leaderboard. Top-3 podium with medals, time period filters (30d/90d/all-time), multi-sort (composite score, revenue, deals, win rate, engagement), tier badges, composite score bars, commission summary. Convex-powered rankings with weighted scoring (revenue 35%, deals 25%, win rate 20%, engagement 20%). Added to Analytics sidebar nav. Drives partner competition and gives VPs instant visibility into who's performing." },
      { hash: "3ce37d9", type: "feat", message: "Portal MDF page wired to real Convex data — partner-submitted MDF requests now persist across sessions. New partner-scoped queries (getByPartner, submitRequest, getPartnerStats), loading skeleton, empty state, review notes. Completes the MDF workflow end-to-end: partners submit → admins review → status flows back to portal." },
      { hash: "9e3218f", type: "polish", message: "Performance consolidation — merged duplicate dashboard queries, dynamic imports for Recharts and command palette, RSC layout split for faster initial loads." },
      { hash: "9e18445", type: "feat", message: "Partner Health page wired to real Convex data — individual health scores (0-100) computed from live deal activity, revenue, touchpoint engagement, recency, and payout health. Auto-classifies partners as healthy/at-risk/churning/new with contextual signals and recommended actions." },
      { hash: "aa36433", type: "feat", message: "Program Health Score on main dashboard — composite 0-100 score across four categories: Partner Engagement (touchpoint activity in 90 days), Deal Velocity (win rate + recent deals), Payout Health (paid vs pending ratio), and Program Growth (new partners + deals in 30 days). Color-coded progress bar with category breakdown cards. One number for VPs to report on program health." },
      { hash: "bffd14f", type: "feat", message: "Performance analytics on partner detail page — revenue by month bar chart (last 6 months), deal stage breakdown with color-coded counts, touchpoint type distribution donut chart. Responsive grid layout, only renders when data exists. Answers \"is this partner trending up or down?\" at a glance." },
      { hash: "a8a9ddd", type: "feat", message: "Add Touchpoint wired to Convex — deal detail \"+ Touchpoint\" button now creates real touchpoints with Clerk auth. All 9 touchpoint types available (referral, demo, content share, introduction, proposal, negotiation, deal registration, co-sell, technical enablement). Remove button on each touchpoint for open deals. Audit log entries for create/delete. Completes the attribution data entry workflow." },
      { hash: "eab51c4", type: "feat", message: "Quarterly Business Review (QBR) report page — executive summary with Q-over-Q delta badges for revenue, pipeline, partners, and win rate. 12-month rolling revenue & pipeline area chart, pipeline breakdown pie chart, commission summary with C-to-R ratio, top 5 partner leaderboard with medals, action items grid, quarter progress bar. Print/PDF support. Linked from Attribution Reports." },
      { hash: "NEW0016", type: "polish", message: "Period-over-period trend badges on all 4 dashboard stat cards — each card now shows \"↑ X% vs last month\" or \"↓ X% vs last month\" computed from real Convex trend data. Green for growth, red for decline, neutral for flat. Answers the #1 VP question: \"are we trending up or down?\"" },
      { hash: "2ec1248", type: "polish", message: "Loading skeletons for all 27 dashboard pages — reusable DashboardSkeleton component with 5 layout variants (TablePage, CardPage, ChartPage, SettingsPage, SimplePage). Shimmer animations matched to each page layout. Replaces blank/flash states while Convex queries resolve." },
      { hash: "NEW0014", type: "feat", message: "Dispute resolution with Convex backend — full dispute lifecycle: open disputes against deals with current/requested commission %, review workflow, resolve or reject with notes, CSV export, audit trail. Convex backend: disputes table with list, getCounts, create, updateStatus, remove mutations, org-scoped queries. Duplicate dispute prevention. Added to sidebar nav under Revenue. Replaces local-state-only conflicts page." },
    ],
  },
  {
    date: "March 4, 2026",
    commits: [
      { hash: "e36f14e", type: "polish", message: "Breadcrumb navigation — auto-generated breadcrumbs for all 45+ dashboard pages. Human-readable labels for every segment, Home icon anchor, dynamic Convex ID detection, styled in dark aesthetic. Appears on every dashboard sub-page for better wayfinding." },
      { hash: "NEW0012", type: "feat", message: "Pipeline kanban board — new Board view toggle on /dashboard/pipeline showing deals in 4 columns (Pending Registration → Active Pipeline → Closed Won → Closed Lost). Each column shows deal count and total value. Compact deal cards with product badges, registration status, and partner info. Grid view preserved as alternative." },
      { hash: "feecedd", type: "feat", message: "Product-aware commission rules — commission rules settings now pulls from product catalog with grouped dropdown by category. Portal deal registration includes product selector. Dashboard deals table shows product badge column. Attribution calculator matches productLine rules against deal.productName (was a TODO). Seed data updated with 6 product-tagged demo deals." },
      { hash: "991d277", type: "feat", message: "Product catalog with Convex backend — full CRUD at /dashboard/products with SKU and name search, category filter, active/inactive toggle, inline edit modal with live margin preview, delete confirmation. Stats row (total products, active/inactive, avg margin, catalog value). Schema: products table with org-scoped indexes. 8 demo products seeded. Added to sidebar nav under Revenue." },
      { hash: "NEW0010", type: "feat", message: "API Keys management — create named API keys with granular scopes (partners, deals, payouts, commissions, attributions, webhooks), expiration options (30d/90d/1y/never), key shown once on creation with copy button, revoke with confirmation, active/revoked views, 10-key limit per org. Full Convex backend with org-scoped CRUD. Linked from settings quick links." },
      { hash: "e58d8f9", type: "feat", message: "Notifications center — full inbox at /dashboard/notifications with type-based filtering (deals, partners, revenue, disputes, system), unread filter with badge count, bulk select + mark-read, date-grouped timeline, per-notification actions, stats row. Bell dropdown now links here instead of activity log. Added to sidebar nav." },
      { hash: "672468a", type: "feat", message: "Notification preferences — per-event in-app and email notification toggles at /dashboard/settings/notifications. Configure which events trigger notifications (deals, revenue, partners, system), set email digest frequency (off/instant/daily/weekly), and quiet hours for non-critical alerts. Linked from settings quick links." },
      { hash: "e4c9a40", type: "feat", message: "Partner applications — public /apply form (company info, partnership type selector, team size, message) + admin review dashboard at /dashboard/partner-applications with approve/reject workflow, review notes, status filters, counts. Duplicate email detection. Added to sidebar, footer, and sitemap." },
      { hash: "b48bec7", type: "feat", message: "Outbound webhooks — create endpoints with URL and event subscriptions, HMAC signing secrets (auto-generated, reveal/copy/rotate), pause/activate toggle, send test events, delivery log with status codes, edit/delete endpoints. 15 event types across Deals, Partners, Payouts, Commissions, and Attribution. Full Convex backend with CRUD, secret rotation, and test delivery logging. Sample payload docs. Linked from settings." },
      { hash: "NEW0007", type: "feat", message: "Team management — invite teammates, assign roles (Admin/Manager/Member), change roles inline, remove members with confirmation. Full Convex backend with org scoping, admin-only guards, last-admin protection, and audit logging. Linked from settings quick links and settings page." },
      { hash: "620fa50", type: "feat", message: "Interactive demo walkthrough — 5-step guided product tour (Dashboard, Attribution, Commissions, Portal, Launch) with mock UI panels. Pre-seeds data in background. Skip option, progress bar, responsive." },
      { hash: "NEW0006", type: "feat", message: "Customer stories page — 3 illustrative case studies (Meridian Cloud, StackPath Analytics, Nova Security) showing before/after results for partner program transformations. Covers Deal Reg Protection, Source Wins, and Role Split attribution models. Added to nav, footer, sitemap, and resources hub." },
      { hash: "NEW0005", type: "feat", message: "Use case detail pages — dedicated landing pages for VP Partnerships, RevOps, and Partner Manager personas at /use-cases/[slug]. Each page: hero stats, problem narrative, solution walkthrough, before/after comparison, VP quote, outcomes, and cross-links. Optimized for outreach URLs in cold emails and LinkedIn DMs." },
      { hash: "NEW0004", type: "feat", message: "Blog — 2 new SEO articles: \"How to Build a Partner Portal That Partners Actually Use\" (login friction, 2-minute visit design, deal reg UX, commission transparency, engagement metrics) and \"Partner Program ROI: How to Prove Your Channel Is Worth the Investment\" (CAC comparison, cycle acceleration, deal size lift, RPP, CFO-ready ROI model). 7 total blog posts now." },
      { hash: "NEW0003", type: "feat", message: "Blog — 2 new SEO articles: \"How to Build a Partner Commission Structure That Scales\" (tiered commission design, role-based rates, performance layers) and \"Partner Deal Registration: The Complete Guide for 2026\" (5-step workflow, SLA best practices, metrics)." },
    ],
  },
  {
    date: "March 3, 2026",
    commits: [
      { hash: "NEW0002", type: "feat", message: "Blog — 3 SEO-optimized articles for beta outreach: partner attribution breakdown, spreadsheet cost analysis, and attribution models guide. Index page, individual article pages, footer + sitemap integration" },
      { hash: "433d511", type: "polish", message: "SEO metadata + JSON-LD structured data across all marketing pages — page-specific titles/descriptions, Organization/WebSite/SoftwareApplication schemas, FAQPage schema for rich results" },
      { hash: "NEW0001", type: "feat", message: "FAQ page — 24 questions across 6 categories (getting started, attribution, integrations, portal, security, pricing) for beta outreach and SEO" },
      { hash: "70f14a4", type: "feat", message: "Founding member offer — live beta counter, social proof with role/company attribution, urgency-driven early access CTA" },
      { hash: "252b386", type: "feat", message: "Public product roadmap — shipped/in-progress/planned features with stats, quarter targets, and beta CTA. Added to footer, sitemap, and resources" },
      { hash: "85ba61e", type: "feat", message: "Product tour page — visual walkthrough of every platform module with interactive mockups, jump navigation, and CTAs. Added to main nav, footer, and sitemap" },
      { hash: "a74c4be", type: "polish", message: "Shared Footer component — extracted into reusable component, now renders across all marketing pages with responsive 4→2→1 column grid" },
      { hash: "539fd31", type: "feat", message: "Resources hub — centralized library with guides, templates, tools, and partner success content for beta outreach" },
      { hash: "5651132", type: "feat", message: "Contact page — lead capture form with partner count selector, quick contact sidebar, \"What to expect\" guide. Enterprise + ROI CTAs now route to /contact" },
      { hash: "f6dd2c3", type: "feat", message: "Partner program assessment — interactive 8-question maturity quiz with scoring, personalized recommendations, and lead capture for outreach" },
      { hash: "42e0b13", type: "fix", message: "ROI calculator pricing fix — was showing old ARR-based tiers, now uses real partner-count pricing (Free/Pro/Scale/Enterprise). New standalone /roi page for outreach linking" },
      { hash: "8d6ec87", type: "feat", message: "Email notifications wired to real Convex data — templates CRUD, toggle enable/disable, inline editing, auto-seed defaults, live queue stats, org-scoped queries" },
      { hash: "c36e44e", type: "feat", message: "Command palette live search — ⌘K now searches real partners and deals from Convex, not just static page navigation" },
      { hash: "6fb18df", type: "feat", message: "Compare page — competitive positioning table (Covant vs. Spreadsheets vs. Legacy PRM vs. Ecosystem Tools) for beta outreach" },
      { hash: "f860ede", type: "feat", message: "Real sparkline trends — dashboard stat cards pull 12-month rolling data from Convex instead of hardcoded arrays, new getTrends query" },
      { hash: "4475e85", type: "feat", message: "Dashboard action items wired to real Convex data — tier reviews, onboarding partners, unpaid commissions, pending deal regs, email triggers, pending invites" },
      { hash: "7f9c2e1", type: "feat", message: "Integrations page — CRM, webhooks, API, Stripe showcase with feature details for beta outreach" },
      { hash: "d903acb", type: "feat", message: "Getting started checklist — guided onboarding steps on dashboard for new users, auto-detects completion" },
      { hash: "ce91cb5", type: "polish", message: "Onboard loading state — spinner while Clerk + Convex provision the org" },
      { hash: "20c3093", type: "feat", message: "About page — company story, values, and problem statement for beta outreach" },
      { hash: "ac2ee91", type: "feat", message: "Error boundaries + loading states — global error page, setup/onboard error recovery" },
    ],
  },
  {
    date: "March 2, 2026",
    commits: [
      { hash: "1674657", type: "polish", message: "Vercel Analytics added to layout, beta page responsive grid for mobile" },
      { hash: "5cb6f32", type: "feat", message: "SEO + GTM — sitemap.xml, robots.txt, og:image, /beta waitlist page with lead capture, 'Join Beta' CTA on hero" },
      { hash: "04c2a3a", type: "feat", message: "Real signup flow + org isolation — /onboard provisions Convex org on first Clerk login, dashboard protected by middleware, pricing CTAs → /sign-up" },
    ],
  },
  {
    date: "March 1, 2026",
    commits: [
      { hash: "6373b9e", type: "feat", message: "Pricing page rebuild — Free/Pro/Scale/Enterprise tiers, partner-count metric, no time-limited trial" },
      { hash: "a20080d", type: "feat", message: "Compliance docs — /privacy, /terms, /security, /dpa all live with full legal content" },
      { hash: "2f79d3a", type: "feat", message: "Real data onboarding as primary entry point — hero CTA → /setup, demo banner in dashboard" },
    ],
  },
  {
    date: "February 28, 2026",
    commits: [
      { hash: "8a82b10", type: "fix", message: "UX polish — filter zero-win recommended partners, fix deals double-listing, billing spinner, portal branding, sidebar clip" },
      { hash: "07c64b2", type: "fix", message: "Pricing CTA text consistency, remove duplicate View Demo nav link" },
      { hash: "37ae7e5", type: "fix", message: "Lazy Stripe init — avoid build-time crash when STRIPE_SECRET_KEY not set" },
      { hash: "0e3a45c", type: "feat", message: "Stripe billing — checkout sessions, webhooks, customer portal, pricing CTAs, billing settings page" },
    ],
  },
  {
    date: "February 26, 2026",
    commits: [
      { hash: "113e784", type: "feat", message: "Clerk auth — sign-in/sign-up pages with Covant dark branding, demo banner, portal UserButton" },
    ],
  },
  {
    date: "February 23, 2026",
    commits: [
      { hash: "ed8f449", type: "feat", message: "Enriched seed data — 22 deals (was 7), 26 audit log entries, varied partner profiles across all 5 partners" },
      { hash: "b2a6cf0", type: "feat", message: "Portal referrals + dashboard cohorts wired to real Convex data" },
      { hash: "49e5c67", type: "fix", message: "Auto-create commission on deal registration approval" },
      { hash: "0debef1", type: "feat", message: "Portal performance page — personal stats, tier/score breakdown, commission trend, deals table" },
      { hash: "d891fa7", type: "feat", message: "Benchmarks page — partner performance vs program averages, tier distribution, top/bottom quartile" },
      { hash: "f773a0c", type: "feat", message: "Forecasting page — pipeline & commission projections from real deal data, scenario toggle" },
      { hash: "57a9502", type: "feat", message: "Contracts page — real Convex data, status changes, expandable details, CSV export" },
      { hash: "e5e353f", type: "polish", message: "Empty state improvements for deals, partners, and portal commissions pages" },
      { hash: "77e4456", type: "fix", message: "Orphaned pages audit — added navigation links to 6 previously unreachable pages" },
    ],
  },
  {
    date: "February 22, 2026",
    commits: [
      { hash: "1d116e7", type: "feat", message: "Portal notifications wired to real Convex data with unread badges" },
      { hash: "5689498", type: "feat", message: "Partner detail page — onboarding progress bar + audit trail" },
      { hash: "e091edf", type: "feat", message: "Bulk payout approval — checkbox select + batch approve on payouts page" },
      { hash: "6460b46", type: "feat", message: "Partner onboarding completion tracking with progress bar on partners table" },
      { hash: "b8b2ed3", type: "feat", message: "End-of-quarter reconciliation report with quarter filter and CSV export" },
      { hash: "d2fff0c", type: "feat", message: "Deal registration workflow — partners register deals, admins approve/reject" },
      { hash: "41187a6", type: "feat", message: "Complex commission rules — Phase 3: settings UI at /dashboard/settings/commission-rules" },
      { hash: "1c0a86c", type: "feat", message: "Complex commission rules — Phase 2: wired into attribution calculator" },
      { hash: "1a9f52f", type: "feat", message: "Complex commission rules — Phase 1: schema, CRUD, rule matching, seed data" },
      { hash: "0246086", type: "fix", message: "Link audit — ensure all expected navigation clicks work across the app" },
      { hash: "e1687b3", type: "fix", message: "Invite page render-loop bug — moved pre-fill logic into useEffect" },
      { hash: "2e503f5", type: "feat", message: "Partner invite flow — invite link → profile form → portal access in under 10 minutes" },
      { hash: "8df55e5", type: "fix", message: "Added confirmation dialog when changing attribution model in config" },
    ],
  },
  {
    date: "February 21, 2026",
    commits: [
      { hash: "2c9dcdf", type: "feat", message: "Config editability — edit program config post-setup from settings page" },
      { hash: "401cc43", type: "feat", message: "Portal white-label — removed all Covant branding from partner-facing pages" },
    ],
  },
  {
    date: "February 20, 2026",
    commits: [
      { hash: "9f2c7f3", type: "fix", message: "Audit trail math formula — show actual calculation chain instead of misleading touchpoint × rate" },
      { hash: "06afd43", type: "feat", message: "Deal Reg Protection, Source Wins, Role Split — three real-world attribution models" },
      { hash: "e11434c", type: "feat", message: "Attribution audit trail on deal detail — per-partner paper trail for every payout" },
      { hash: "80c1d03", type: "feat", message: "Setup → real config — Convex persistence, live preview panel, dashboard welcome banner" },
      { hash: "86a4f96", type: "fix", message: "Setup AI — correct model, strip leading assistant message, plain text streaming" },
      { hash: "4beee49", type: "fix", message: "Setup page broken model name, wired /setup into nav + pricing CTAs" },
    ],
  },
];

const TYPE_CONFIG = {
  feat: { label: "Feature", color: "#22c55e", bg: "#22c55e18", icon: Sparkles },
  fix: { label: "Fix", color: "#f59e0b", bg: "#f59e0b18", icon: Wrench },
  polish: { label: "Polish", color: "#8b5cf6", bg: "#8b5cf618", icon: Zap },
  other: { label: "Update", color: "#6b7280", bg: "#6b728018", icon: GitCommit },
};

export default function ChangelogPage() {
  const totalFeatures = CHANGELOG.flatMap((e) => e.commits).filter((c) => c.type === "feat").length;
  const totalFixes = CHANGELOG.flatMap((e) => e.commits).filter((c) => c.type === "fix" || c.type === "polish").length;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: ".85rem", textDecoration: "none", marginBottom: 12 }}>
          <ArrowLeft size={14} /> Back to Covant
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Changelog</h1>
        <p className="muted" style={{ marginTop: ".25rem", lineHeight: 1.6 }}>
          What&apos;s new in Covant — {totalFeatures} features and {totalFixes} improvements shipped so far.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {CHANGELOG.map((entry) => (
          <div key={entry.date}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
              <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>{entry.date}</h2>
              <span className="muted" style={{ fontSize: ".75rem" }}>({entry.commits.length} changes)</span>
            </div>
            <div style={{ marginLeft: 5, borderLeft: "2px solid var(--border)", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {entry.commits.map((c) => {
                const cfg = TYPE_CONFIG[c.type];
                const Icon = cfg.icon;
                return (
                  <div key={c.hash} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px",
                      borderRadius: 6, fontSize: ".65rem", fontWeight: 700, color: cfg.color, background: cfg.bg,
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <Icon size={10} /> {cfg.label}
                    </span>
                    <span style={{ fontSize: ".85rem", lineHeight: 1.5 }}>
                      {c.message}
                      <code style={{ fontSize: ".7rem", color: "var(--muted)", marginLeft: 6 }}>{c.hash}</code>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
