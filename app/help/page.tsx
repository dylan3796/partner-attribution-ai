"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Search, BookOpen, Zap, Users, DollarSign, BarChart3,
  Settings, Shield, ChevronDown, ChevronRight, ExternalLink,
  Briefcase, Globe, Webhook, Layers, Target, HelpCircle,
} from "lucide-react";

type Article = {
  title: string;
  slug: string;
  summary: string;
  steps: { heading: string; content: string }[];
  relatedLinks?: { label: string; href: string }[];
};

type Category = {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  color: string;
  articles: Article[];
};

const CATEGORIES: Category[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your partner program in under 10 minutes",
    icon: Zap,
    color: "#22c55e",
    articles: [
      {
        title: "Setting Up Your First Program",
        slug: "first-program",
        summary: "Walk through the AI-powered setup wizard to configure your partner program — attribution model, commission rules, and partner types.",
        steps: [
          {
            heading: "Start the setup wizard",
            content: "Navigate to covant.ai/setup after signing up. The AI wizard asks about your partner program in natural language — no forms, no dropdowns. Just describe how your program works: \"We have 20 resellers who get 10% commission on deals they register, and 5 referral partners who get a flat $500 per closed deal.\""
          },
          {
            heading: "Review your configuration",
            content: "The live preview panel on the right updates as you talk. You'll see your attribution model (Deal Reg Protection, Source Wins, or Role Split), commission rules, and enabled modules. If something looks wrong, just tell the AI — it adjusts in real time."
          },
          {
            heading: "Launch your program",
            content: "Click \"Launch\" to save your configuration. You'll land on your dashboard with a getting started checklist: connect your CRM, invite your first partner, register a deal, and review attribution results."
          },
          {
            heading: "Edit anytime",
            content: "Nothing is locked after setup. Go to Settings → Program Config to adjust your attribution model, commission rules, interaction types, and enabled modules whenever your program evolves."
          },
        ],
        relatedLinks: [
          { label: "Attribution Models Explained", href: "#attribution-models" },
          { label: "Commission Rules Guide", href: "#commission-rules" },
        ],
      },
      {
        title: "Inviting Your First Partner",
        slug: "invite-partner",
        summary: "Generate an invite link, send it to a partner, and watch them onboard in under 2 minutes.",
        steps: [
          {
            heading: "Generate an invite link",
            content: "Go to Dashboard → Partners and click \"Invite Partner.\" This generates a unique invite URL. You can also set the partner type (reseller, referral, affiliate, integration) and commission rate before sending."
          },
          {
            heading: "Share the link",
            content: "Send the invite link via email, Slack, or however you communicate with partners. The link takes them to a branded signup form — no Covant branding visible (white-labeled by default)."
          },
          {
            heading: "Partner completes profile",
            content: "Your partner fills out their company name, contact info, and territory. They're immediately active in your program and can log into their Partner Portal to register deals, track commissions, and view their performance."
          },
          {
            heading: "Track onboarding progress",
            content: "Each partner card on your Partners page shows an onboarding progress bar — profile completed, first deal registered, first touchpoint logged, etc. Use this to follow up with partners who stall."
          },
        ],
        relatedLinks: [
          { label: "Partner Portal Overview", href: "#partner-portal" },
          { label: "Partner Applications", href: "#partner-applications" },
        ],
      },
      {
        title: "Understanding the Dashboard",
        slug: "dashboard-overview",
        summary: "Navigate the main dashboard — stat cards, action items, activity feed, and program health score.",
        steps: [
          {
            heading: "Stat cards",
            content: "The top row shows four key metrics: Revenue (closed-won deal value), Pipeline (open deal value), Active Partners, and Win Rate. Each card includes a sparkline trend (12-month rolling) and a period-over-period badge showing growth or decline vs. last month."
          },
          {
            heading: "Program Health Score",
            content: "A composite 0-100 score synthesizing partner engagement, deal velocity, payout health, and program growth. Green (70+) means your program is healthy. Yellow (40-70) means attention needed. Red (<40) means intervention required. Click any category to see the contributing factors."
          },
          {
            heading: "Action items",
            content: "Real-time to-do list pulled from your data: pending tier reviews, partners needing onboarding, unpaid commissions, pending deal registrations, and email triggers. Each item links directly to the page where you take action."
          },
          {
            heading: "Activity feed",
            content: "A timeline of everything happening in your program — deals closed, commissions created, partners joining, disputes opened. Action-specific icons and color coding make scanning fast. Click any entry to navigate to the relevant detail page."
          },
        ],
      },
      {
        title: "Connecting Your CRM",
        slug: "connect-crm",
        summary: "Sync deals, contacts, and pipeline data from Salesforce or HubSpot.",
        steps: [
          {
            heading: "Navigate to integrations",
            content: "Go to Dashboard → Settings → Integrations. You'll see cards for Salesforce, HubSpot, Slack, Stripe, Webhooks, and API. Click \"Connect\" on your CRM."
          },
          {
            heading: "Authorize access",
            content: "For Salesforce: you'll be redirected to Salesforce's OAuth login. Approve Covant's access to your org. For HubSpot: same OAuth flow. We request read access to deals, contacts, and companies — we never modify your CRM data."
          },
          {
            heading: "Configure sync",
            content: "After connecting, choose which deal stages map to your pipeline stages (Pending, Active, Won, Lost). Set sync frequency (real-time via webhooks or hourly batch). Map custom CRM fields to Covant's data model if needed."
          },
          {
            heading: "Verify data",
            content: "Check your Deals page — you should see your CRM deals appearing within minutes. The integration status page shows sync history, last sync time, and any errors. Use the Data Export Center to verify record counts match your CRM."
          },
        ],
        relatedLinks: [
          { label: "Salesforce Integration Details", href: "/integrations/salesforce" },
          { label: "HubSpot Integration Details", href: "/integrations/hubspot" },
        ],
      },
    ],
  },
  {
    id: "attribution",
    title: "Attribution & Tracking",
    description: "Understand how partner credit and revenue attribution work",
    icon: Target,
    color: "#6366f1",
    articles: [
      {
        title: "Attribution Models Explained",
        slug: "attribution-models",
        summary: "Covant supports three real-world attribution models — each designed for a specific type of partner program.",
        steps: [
          {
            heading: "Deal Reg Protection",
            content: "The partner who registers the deal first gets full credit. This is the industry standard for reseller programs (~80% of the market). The registering partner has an exclusivity window (typically 90 days) where no other partner can claim the deal. Best for: traditional reseller and VAR programs."
          },
          {
            heading: "Source Wins",
            content: "The partner who sourced or introduced the opportunity gets credit — regardless of who registers it. Covant determines the source by looking at the earliest touchpoint on the deal. Best for: referral networks, technology partnerships, and affiliate programs where sourcing is the value."
          },
          {
            heading: "Role Split",
            content: "Revenue credit is split by predefined percentages based on partner type. For example: reseller gets 60%, technology partner gets 25%, referral partner gets 15%. You configure the split percentages per partner type. Best for: co-sell programs with multiple partners contributing to a single deal."
          },
          {
            heading: "Changing your model",
            content: "Go to Settings → Attribution Model to switch models. A confirmation dialog warns you about the impact on existing attribution calculations. Historical data is recalculated under the new model. You can preview the impact before committing."
          },
        ],
        relatedLinks: [
          { label: "Blog: 3 Attribution Models", href: "/blog/3-attribution-models-every-vp-should-know" },
          { label: "Attribution Audit Trail", href: "#audit-trail" },
        ],
      },
      {
        title: "The Attribution Audit Trail",
        slug: "audit-trail",
        summary: "Every payout has a step-by-step paper trail showing exactly how credit was calculated — no black boxes.",
        steps: [
          {
            heading: "Accessing the audit trail",
            content: "Click any deal on the Deals page, then scroll to the \"Attribution\" section. You'll see each partner's touchpoints listed chronologically with contribution notes."
          },
          {
            heading: "Understanding the calculation chain",
            content: "The audit trail shows: Deal Value → Credit Percentage → Partner Amount → Commission Rate → Commission Amount. Each step references the specific rule that applied (e.g., \"Deal Reg Protection: TechBridge registered first on Jan 15\")."
          },
          {
            heading: "Why this matters",
            content: "Sarah Chen (VP Partnerships, 35 resellers) told us: \"If I can't show the AE the exact logic, they reject the output.\" The audit trail is how commission disputes die — when both sides can see the math, there's nothing to argue about."
          },
          {
            heading: "Tamper-evident design",
            content: "Every attribution calculation includes a hash of the input data. If the underlying touchpoints or deal data changes, the audit trail notes the recalculation with timestamps. You can always trace back to the original calculation."
          },
        ],
      },
      {
        title: "Recording Touchpoints",
        slug: "recording-touchpoints",
        summary: "Log partner interactions on deals — the building blocks of attribution.",
        steps: [
          {
            heading: "What is a touchpoint?",
            content: "A touchpoint is any partner interaction that contributes to a deal: referral, demo, content share, introduction, proposal, negotiation, deal registration, co-sell activity, or technical enablement. These are the data points Covant uses to calculate attribution."
          },
          {
            heading: "Adding touchpoints manually",
            content: "On any deal detail page, click \"+ Touchpoint.\" Select the partner, touchpoint type, and add optional notes. Touchpoints are timestamped automatically. For open deals, you can also remove touchpoints."
          },
          {
            heading: "Automatic touchpoints via CRM",
            content: "When connected to Salesforce or HubSpot, Covant automatically creates touchpoints from CRM events: partner-tagged meetings, emails, deal stage changes, and activities. This eliminates manual logging for most interactions."
          },
          {
            heading: "Touchpoint types and weights",
            content: "Different touchpoint types carry different weights in multi-touch attribution. Deal registration typically carries the highest weight, followed by co-sell and demo. You can customize weights in Settings → Attribution Model."
          },
        ],
      },
    ],
  },
  {
    id: "commissions",
    title: "Commissions & Payouts",
    description: "Configure commission rules, approve payouts, and resolve disputes",
    icon: DollarSign,
    color: "#eab308",
    articles: [
      {
        title: "Commission Rules Engine",
        slug: "commission-rules",
        summary: "Create rules that automatically calculate commissions based on partner type, tier, product, and deal size.",
        steps: [
          {
            heading: "Rule basics",
            content: "Go to Settings → Commission Rules. Each rule has conditions (partner type, tier, product line, deal size range) and an action (commission percentage or flat amount). Rules are evaluated in priority order — the first matching rule wins."
          },
          {
            heading: "Rule types",
            content: "Percentage rules: \"Gold-tier resellers get 12% on Enterprise product deals.\" Flat rules: \"Referral partners get $500 per closed deal.\" Tiered rules: \"10% on first $100K, 15% above $100K.\" Product-specific: \"15% on software, 5% on services.\""
          },
          {
            heading: "Automatic commission creation",
            content: "When a deal registration is approved, Covant automatically looks up the matching commission rule and creates a payout record with the calculated amount. The partner sees their pending commission in their Portal immediately."
          },
          {
            heading: "Editing rules",
            content: "Changes to commission rules affect future deals only — existing payouts are not recalculated. To adjust an existing payout, go to the Payouts page and edit the amount directly. All changes are logged in the audit trail."
          },
        ],
        relatedLinks: [
          { label: "Blog: Commission Structures That Scale", href: "/blog/how-to-build-partner-commission-structure" },
          { label: "End-of-Quarter Reconciliation", href: "#reconciliation" },
        ],
      },
      {
        title: "Approving Payouts",
        slug: "approving-payouts",
        summary: "Review, approve, and track commission payments — individually or in bulk.",
        steps: [
          {
            heading: "Payout lifecycle",
            content: "Payouts follow a lifecycle: Pending Approval → Approved → Processing → Paid. Each stage is visible on the Payouts page with color-coded status badges."
          },
          {
            heading: "Individual approval",
            content: "Click any payout to see the full details: partner name, deal reference, commission rule that applied, calculation breakdown. Approve or reject with a single click."
          },
          {
            heading: "Bulk approval",
            content: "Use the checkboxes on the Payouts page to select multiple payouts, then click \"Approve Selected.\" This is designed for end-of-quarter processing when you might have dozens of payouts to clear."
          },
          {
            heading: "Payout notifications",
            content: "When a payout is approved, the partner receives a notification in their Portal. If email notifications are configured (via Resend), they also get an email with the payout details and expected payment date."
          },
        ],
      },
      {
        title: "Dispute Resolution",
        slug: "dispute-resolution",
        summary: "Handle commission disputes with a structured workflow — no more email threads.",
        steps: [
          {
            heading: "Opening a dispute",
            content: "On the Disputes page (Dashboard → Revenue → Disputes), click \"Open Dispute.\" Select the deal, specify the current commission percentage and your requested percentage, and add notes explaining the dispute."
          },
          {
            heading: "Review workflow",
            content: "Disputes move through stages: Open → Under Review → Resolved or Rejected. Admins can add resolution notes at each stage. The full history is preserved for compliance."
          },
          {
            heading: "Resolution and audit trail",
            content: "When a dispute is resolved, the commission amount is adjusted and a new audit trail entry is created showing the change reason. Both the original and adjusted amounts are visible for transparency."
          },
          {
            heading: "Exporting disputes",
            content: "Use the CSV export button on the Disputes page to download all disputes with their status, amounts, and resolution notes. Useful for end-of-quarter finance reviews."
          },
        ],
        relatedLinks: [
          { label: "End-of-Quarter Reconciliation", href: "#reconciliation" },
        ],
      },
      {
        title: "End-of-Quarter Reconciliation",
        slug: "reconciliation",
        summary: "Run a quarterly reconciliation report to verify payouts match closed deals.",
        steps: [
          {
            heading: "Accessing reconciliation",
            content: "Go to Dashboard → Reports → Reconciliation. Select the quarter you want to reconcile (e.g., 2026-Q1). The report compares total deal revenue, attributed commissions, approved payouts, and paid amounts."
          },
          {
            heading: "Identifying discrepancies",
            content: "The report flags mismatches: deals without commission records, commissions without matching deals, and payouts that don't match commission calculations. Each discrepancy links to the relevant deal or payout for investigation."
          },
          {
            heading: "Exporting for finance",
            content: "Click \"Export CSV\" to download the reconciliation report. This is typically what finance teams need for their quarterly close process — a clean list of all partner-related payouts with deal references."
          },
        ],
      },
    ],
  },
  {
    id: "partner-portal",
    title: "Partner Portal",
    description: "What your partners see — deal registration, commissions, and performance",
    icon: Globe,
    color: "#8b5cf6",
    articles: [
      {
        title: "Partner Portal Overview",
        slug: "partner-portal",
        summary: "The Portal is a white-labeled experience where partners register deals, track commissions, and view their performance.",
        steps: [
          {
            heading: "What partners see",
            content: "Partners log in to see their dashboard: total earned, pending commissions, deals won, and revenue influenced. Below that: recent touchpoints, active deals, and payout history. Everything is scoped to their data only — they can't see other partners."
          },
          {
            heading: "White-label by default",
            content: "The Portal shows zero Covant branding. Partners see your program name and your brand. This is critical — partners shouldn't need to know what software you use to run your program."
          },
          {
            heading: "Available pages",
            content: "Partners have access to: Dashboard (overview), Deals (register and track), Commissions (earnings and payouts), Products (your catalog with their commission rates), Territory (assigned accounts), MDF Requests (marketing development funds), Performance (stats, tier, trends), Resources, and Notifications."
          },
          {
            heading: "Portal authentication",
            content: "Partners authenticate via Clerk — email-based login with optional SSO. Each partner's view is scoped to their partner record using org-level isolation."
          },
        ],
        relatedLinks: [
          { label: "Deal Registration Guide", href: "#deal-registration" },
          { label: "Blog: Building a Portal Partners Use", href: "/blog/partner-portal-partners-actually-use" },
        ],
      },
      {
        title: "Deal Registration (Partner Side)",
        slug: "deal-registration",
        summary: "Partners register deals through the Portal — admins approve or reject from the dashboard.",
        steps: [
          {
            heading: "Registering a deal",
            content: "In the Portal, partners click \"Register a Deal\" and fill out: company name, contact info, expected deal amount, product, expected close date, and notes. The deal is tagged with a 90-day exclusivity window by default."
          },
          {
            heading: "Registration status tracking",
            content: "Partners see their registration status in real time: Pending → Approved or Rejected. When approved, they see the commission amount calculated automatically based on their applicable commission rules."
          },
          {
            heading: "Admin approval workflow",
            content: "Admins see pending deal registrations on their Deals page. Click to review deal details, check for conflicts with existing deals, and approve or reject. Approval automatically creates the commission payout record."
          },
          {
            heading: "Conflict detection",
            content: "If two partners try to register the same deal (matching company name or contact email), Covant flags the conflict. The admin sees both registrations side-by-side and decides which partner gets credit based on the attribution model."
          },
        ],
        relatedLinks: [
          { label: "Blog: Deal Registration Best Practices", href: "/blog/partner-deal-registration-best-practices" },
        ],
      },
      {
        title: "Partner Applications",
        slug: "partner-applications",
        summary: "Accept inbound partner applications through a public form — review and approve from the dashboard.",
        steps: [
          {
            heading: "Public application form",
            content: "Share covant.ai/apply (or your custom domain) with prospective partners. The form collects company name, contact info, partnership type preference, team size, and a message about why they want to join your program."
          },
          {
            heading: "Reviewing applications",
            content: "New applications appear on Dashboard → Partner Applications. Filter by status (pending, approved, rejected) and review each application with notes. Approved partners are automatically created and can be invited to the Portal."
          },
          {
            heading: "Duplicate detection",
            content: "Covant checks for duplicate email addresses across existing partners and pending applications. If a match is found, it's flagged so you don't accidentally create duplicate partner records."
          },
        ],
      },
    ],
  },
  {
    id: "reporting",
    title: "Reports & Analytics",
    description: "QBR reports, health scores, leaderboards, and revenue intelligence",
    icon: BarChart3,
    color: "#3b82f6",
    articles: [
      {
        title: "Reports Hub",
        slug: "reports-hub",
        summary: "All 8 analytics reports accessible from one page — find the right report for any question.",
        steps: [
          {
            heading: "Accessing reports",
            content: "Click \"Reports\" in the sidebar to open the Reports Hub. You'll see cards for all 8 report types, organized by most-used (Attribution, Weekly Digest, QBR) at the top. Each card describes what the report answers."
          },
          {
            heading: "Available reports",
            content: "Attribution Reports (deal-level credit breakdown), Revenue Intelligence (where revenue comes from and concentration risk), QBR Report (quarterly executive summary), Weekly Digest (automated weekly update), Win/Loss Analysis (deal outcome patterns), Activity Heatmap (engagement over time), Reconciliation (quarterly payout verification), and Data Export (bulk CSV downloads)."
          },
          {
            heading: "Print and share",
            content: "QBR, Scorecard, and Weekly Digest pages have built-in Print/PDF buttons that hide navigation for clean output. The Weekly Digest also has a \"Copy as Text\" button for pasting into Slack or email."
          },
        ],
      },
      {
        title: "Partner Health Scores",
        slug: "health-scores",
        summary: "Automatically classify partners as healthy, at-risk, or churning based on real activity data.",
        steps: [
          {
            heading: "How scores are calculated",
            content: "Each partner gets a 0-100 health score computed from five weighted dimensions: Deal Activity (30%) — recent deal registrations and closures. Revenue (25%) — total attributed revenue. Engagement (20%) — touchpoint frequency. Recency (15%) — days since last activity. Payout Health (10%) — paid vs. pending ratio."
          },
          {
            heading: "Status classification",
            content: "Healthy (70-100): Active, generating revenue, engaged. At Risk (40-69): Declining activity or slowing pipeline. Churning (<40): Minimal recent activity, likely disengaging. New: Less than 30 days in program, insufficient data for scoring."
          },
          {
            heading: "Recommended actions",
            content: "Each at-risk or churning partner shows contextual recommendations: schedule a check-in call, review commission rates, offer co-marketing support, or assign a partner manager. These are auto-generated based on the specific signals driving the low score."
          },
          {
            heading: "Monitoring over time",
            content: "Use the Activity Heatmap (Reports → Activity) to spot engagement trends across your entire partner base. The heatmap shows daily activity over 12 months — quiet periods are immediately visible."
          },
        ],
        relatedLinks: [
          { label: "Program Health Score", href: "#program-health" },
          { label: "Partner Leaderboard", href: "#leaderboard" },
        ],
      },
      {
        title: "QBR Report",
        slug: "qbr-report",
        summary: "Generate a quarterly business review in seconds — no more manual slide decks.",
        steps: [
          {
            heading: "What's included",
            content: "Executive summary with quarter-over-quarter deltas for revenue, pipeline, active partners, and win rate. 12-month rolling revenue and pipeline chart. Pipeline breakdown by deal stage. Commission summary with commission-to-revenue ratio. Top 5 partner leaderboard with medals and tier badges. Action items grid."
          },
          {
            heading: "Print to PDF",
            content: "Click the Print button to generate a clean PDF. The sidebar, navigation, and interactive elements are hidden automatically. The output is ready to paste into a slide deck or email to your exec team."
          },
          {
            heading: "Quarter navigation",
            content: "Use the quarter selector to browse past QBRs. All data is computed from your live Convex data — you can generate a QBR for any past quarter at any time."
          },
        ],
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations & API",
    description: "Connect Salesforce, HubSpot, Slack, Stripe, and build custom integrations",
    icon: Webhook,
    color: "#f59e0b",
    articles: [
      {
        title: "API Keys & Authentication",
        slug: "api-keys",
        summary: "Create API keys with granular permissions to integrate Covant into your workflow.",
        steps: [
          {
            heading: "Creating an API key",
            content: "Go to Settings → API Keys and click \"Create Key.\" Name the key (e.g., \"Salesforce Sync\"), select permission scopes (partners:read, deals:write, etc.), and set an expiration (30 days, 90 days, 1 year, or never). The key is shown once — copy it immediately."
          },
          {
            heading: "Permission scopes",
            content: "Available scopes: partners:read, partners:write, deals:read, deals:write, payouts:read, payouts:write, commissions:read, attributions:read, webhooks:manage. Follow the principle of least privilege — only grant the scopes your integration needs."
          },
          {
            heading: "Using the API",
            content: "Pass your API key in the Authorization header: `Authorization: Bearer cv_live_xxx`. Use `cv_test_` prefix keys for sandbox testing. Rate limit: 100 requests per minute. See the full API reference at /docs."
          },
          {
            heading: "Revoking keys",
            content: "Click the revoke button on any active key. Revoked keys stop working immediately. You can view revoked keys in the history section for audit purposes."
          },
        ],
        relatedLinks: [
          { label: "API Documentation", href: "/docs" },
          { label: "Webhook Setup", href: "#webhooks" },
        ],
      },
      {
        title: "Outbound Webhooks",
        slug: "webhooks",
        summary: "Push events to your systems when things happen in Covant — deals closed, partners joined, payouts approved.",
        steps: [
          {
            heading: "Creating a webhook endpoint",
            content: "Go to Settings → Webhooks and click \"Create Endpoint.\" Enter the URL where you want events sent and select which event types to subscribe to (e.g., deal.won, partner.created, payout.approved). An HMAC signing secret is generated automatically."
          },
          {
            heading: "Event types",
            content: "15 event types across 5 categories: Deals (created, approved, won, lost), Partners (created, updated, tier_changed), Payouts (created, approved, paid), Commissions (calculated, adjusted), Attribution (computed, recalculated)."
          },
          {
            heading: "Verifying webhook signatures",
            content: "Every webhook request includes an X-Webhook-Signature header containing an HMAC-SHA256 hash of the payload. Verify this against your signing secret to ensure the request came from Covant. Sample verification code is shown on the webhook settings page."
          },
          {
            heading: "Testing and monitoring",
            content: "Click \"Send Test\" on any endpoint to send a sample event. The delivery log shows every webhook delivery with HTTP status codes, response times, and retry history. Failed deliveries are retried up to 3 times with exponential backoff."
          },
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings & Admin",
    description: "Team management, tiers, certifications, and program configuration",
    icon: Settings,
    color: "#a855f7",
    articles: [
      {
        title: "Team Management",
        slug: "team-management",
        summary: "Invite team members, assign roles, and control who can do what.",
        steps: [
          {
            heading: "Inviting team members",
            content: "Go to Settings → Team and click \"Invite Member.\" Enter their email and assign a role: Admin (full access), Manager (can manage partners and deals, can't change settings), or Member (read-only with deal registration)."
          },
          {
            heading: "Changing roles",
            content: "Click the role dropdown next to any team member to change their permissions. The last Admin cannot be demoted or removed — there must always be at least one Admin."
          },
          {
            heading: "Removing members",
            content: "Click \"Remove\" next to a team member and confirm. Their access is revoked immediately. Their historical actions (deal approvals, notes, etc.) are preserved in the audit trail."
          },
        ],
      },
      {
        title: "Partner Tiers & Scoring",
        slug: "tiers-scoring",
        summary: "Configure tier levels, review tier change recommendations, and manage partner scoring.",
        steps: [
          {
            heading: "Default tier structure",
            content: "Covant ships with four tiers: Bronze (entry-level), Silver, Gold, and Platinum. Each tier can have different commission rates, portal features, and program benefits. Customize tier names and requirements in Settings → Tiers."
          },
          {
            heading: "Automated tier recommendations",
            content: "Covant's scoring engine periodically evaluates each partner across revenue, pipeline, engagement, and velocity dimensions. When a partner qualifies for a tier change (up or down), a review appears on the Scoring → Tier Reviews page."
          },
          {
            heading: "Reviewing tier changes",
            content: "Each review shows the partner's current tier, recommended tier, and the scoring data behind the recommendation. Approve, reject, or defer each review. Add notes for context. Use \"Approve All Remaining\" for bulk processing."
          },
          {
            heading: "Tier-gated features",
            content: "Certifications can require a minimum tier (e.g., only Gold+ partners can take the Enterprise Strategy certification). Commission rules can reference tiers (e.g., Platinum partners get 15%, Gold gets 12%). Tier context appears throughout the product."
          },
        ],
      },
      {
        title: "Partner Certifications",
        slug: "certifications",
        summary: "Create certification programs to train and qualify partners — track completion and expiration.",
        steps: [
          {
            heading: "Creating a certification program",
            content: "Go to Dashboard → Certifications and click \"Create Program.\" Set the name, level (beginner to expert), category (sales, technical, product, compliance), validity period (e.g., 12 months), and optional tier requirement (e.g., Gold+ only)."
          },
          {
            heading: "Awarding certifications",
            content: "Click \"Award\" on any program to grant it to a partner. Add an optional score and notes. The partner sees their certifications on their Portal profile. Duplicate awards to the same partner are prevented."
          },
          {
            heading: "Tracking and expiration",
            content: "The certifications dashboard shows: active programs, total certs awarded, partner coverage percentage, and expiring-soon alerts. Expired certifications are flagged automatically. Revoke certifications when partners no longer qualify."
          },
        ],
      },
    ],
  },
];

function ArticleContent({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      id={article.slug}
      style={{
        border: "1px solid #1a1a1a",
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          width: "100%",
          padding: "16px 20px",
          background: expanded ? "#0a0a0a" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <div style={{ marginTop: 2, flexShrink: 0, color:'#6b7280' }}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: ".95rem", fontWeight: 700, color:'#0a0a0a', margin: 0, lineHeight: 1.4 }}>
            {article.title}
          </h3>
          <p style={{ fontSize: ".8rem", color:'#6b7280', margin: "4px 0 0", lineHeight: 1.5 }}>
            {article.summary}
          </p>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 20px 20px 48px", background: "#060606", borderTop: "1px solid #111" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
            {article.steps.map((step, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: "50%", background:'#f9fafb',
                    fontSize: ".7rem", fontWeight: 800, color: "#888", flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <h4 style={{ fontSize: ".85rem", fontWeight: 700, color: "#e5e5e5", margin: 0 }}>
                    {step.heading}
                  </h4>
                </div>
                <p style={{ fontSize: ".8rem", color: "#999", lineHeight: 1.7, margin: "0 0 0 32px" }}>
                  {step.content}
                </p>
              </div>
            ))}
          </div>

          {article.relatedLinks && article.relatedLinks.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #111" }}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color:'#6b7280', marginBottom: 8 }}>
                Related
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {article.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: ".75rem", color: "#6366f1", textDecoration: "none",
                      padding: "4px 10px", borderRadius: 6, background: "#6366f110",
                    }}
                  >
                    {link.label} <ExternalLink size={10} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const lowerSearch = search.toLowerCase();
  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (a) =>
        !search ||
        a.title.toLowerCase().includes(lowerSearch) ||
        a.summary.toLowerCase().includes(lowerSearch) ||
        a.steps.some((s) => s.heading.toLowerCase().includes(lowerSearch) || s.content.toLowerCase().includes(lowerSearch))
    ),
  })).filter((cat) => cat.articles.length > 0);

  const totalArticles = CATEGORIES.reduce((sum, c) => sum + c.articles.length, 0);

  return (
    <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #111", padding: "3rem 1.5rem 2.5rem", textAlign: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color:'#6b7280', fontSize: ".8rem", textDecoration: "none", marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> Back to Covant
        </Link>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-.03em", color:'#0a0a0a', margin: "0 0 8px" }}>
          Help Center
        </h1>
        <p style={{ color:'#6b7280', fontSize: ".95rem", maxWidth: 500, margin: "0 auto 24px" }}>
          {totalArticles} guides across {CATEGORIES.length} categories. Everything you need to run your partner program.
        </p>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color:'#6b7280' }} />
          <input
            type="text"
            placeholder="Search guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 40px", borderRadius: 10,
              border: "1px solid #222", background:'#f9fafb', color: "#e5e5e5",
              fontSize: ".9rem", outline: "none", fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Category cards (when not searching) */}
        {!search && !activeCategory && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
            marginBottom: "2.5rem",
          }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
                    padding: "20px", borderRadius: 12, border: "1px solid #1a1a1a",
                    background: "#060606", cursor: "pointer", textAlign: "left",
                    fontFamily: "inherit", transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = cat.color + "40")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: cat.color + "15", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={18} style={{ color: cat.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: ".9rem", fontWeight: 700, color:'#0a0a0a', margin: "0 0 2px" }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: ".75rem", color:'#6b7280', margin: 0, lineHeight: 1.4 }}>
                      {cat.description}
                    </p>
                  </div>
                  <span style={{ fontSize: ".7rem", color:'#6b7280' }}>
                    {cat.articles.length} {cat.articles.length === 1 ? "article" : "articles"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Back to categories button */}
        {activeCategory && !search && (
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "none", border: "none", color:'#6b7280',
              fontSize: ".8rem", cursor: "pointer", marginBottom: 20,
              fontFamily: "inherit", padding: 0,
            }}
          >
            <ArrowLeft size={14} /> All categories
          </button>
        )}

        {/* Articles */}
        {(search ? filteredCategories : activeCategory ? CATEGORIES.filter((c) => c.id === activeCategory) : CATEGORIES).map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Icon size={18} style={{ color: cat.color }} />
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color:'#0a0a0a', margin: 0 }}>
                  {cat.title}
                </h2>
                <span style={{ fontSize: ".7rem", color:'#6b7280' }}>
                  {cat.articles.length} {cat.articles.length === 1 ? "article" : "articles"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.articles.map((article) => (
                  <ArticleContent key={article.slug} article={article} />
                ))}
              </div>
            </div>
          );
        })}

        {/* No results */}
        {search && filteredCategories.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <HelpCircle size={40} style={{ color: "#333", marginBottom: 12 }} />
            <p style={{ color:'#6b7280', fontSize: ".9rem" }}>
              No guides found for &quot;{search}&quot;
            </p>
            <p style={{ color:'#6b7280', fontSize: ".8rem" }}>
              Try a different search term or <Link href="/contact" style={{ color: "#6366f1" }}>contact us</Link> for help.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          marginTop: "3rem", padding: "2rem", borderRadius: 12,
          border: "1px solid #1a1a1a", background: "#060606", textAlign: "center",
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color:'#0a0a0a', margin: "0 0 8px" }}>
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p style={{ color:'#6b7280', fontSize: ".85rem", margin: "0 0 16px" }}>
            Our team responds within 4 hours on business days.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                padding: "10px 24px", borderRadius: 8, background: "#fff", color: "#000",
                fontSize: ".85rem", fontWeight: 700, textDecoration: "none",
              }}
            >
              Contact Support
            </Link>
            <Link
              href="/docs"
              style={{
                padding: "10px 24px", borderRadius: 8, border: "1px solid #333",
                color:'#374151', fontSize: ".85rem", fontWeight: 600, textDecoration: "none",
              }}
            >
              API Reference
            </Link>
            <Link
              href="/faq"
              style={{
                padding: "10px 24px", borderRadius: 8, border: "1px solid #333",
                color:'#374151', fontSize: ".85rem", fontWeight: 600, textDecoration: "none",
              }}
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
