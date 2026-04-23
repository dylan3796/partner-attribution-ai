"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Coins,
  Users,
  BarChart3,
  Shield,
  Plug,
  Globe,
  Zap,
  Target,
  Trophy,
  HeartPulse,
  FileDown,
  Key,
  Bell,
  Workflow,
  ClipboardList,
  Scale,
  GraduationCap,
  Package,
  Handshake,
  Search,
  Keyboard,
  BookOpen,
  TrendingUp,
  Calendar,
  Sparkles,
  Tag,
  StickyNote,
  GitBranch,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  link?: string;
};

type Category = {
  name: string;
  tagline: string;
  color: string;
  features: Feature[];
};

const CATEGORIES: Category[] = [
  {
    name: "Record — The Ledger",
    tagline: "Every partner touchpoint in one system of record — with the paper trail to prove it.",
    color: "#6366f1",
    features: [
      {
        title: "Three Attribution Models",
        description: "Deal Reg Protection, Source Wins, and Role Split — covering 95% of real partner programs. Pick the model that matches how your channel works.",
        icon: Workflow,
        link: "/product",
      },
      {
        title: "Explainable by Construction",
        description: "Per-partner touchpoint timeline, contribution notes, and step-by-step calculation chain. Every number traces back to deal + touchpoint + rule + payment.",
        icon: GitBranch,
      },
      {
        title: "Multi-Touch Tracking",
        description: "9 touchpoint types — referral, demo, co-sell, introduction, deal registration, and more. Manual entry or CRM sync.",
        icon: Target,
      },
      {
        title: "Activity Heatmap",
        description: "GitHub-style contribution graph for partner activity. Spot engagement patterns, quiet periods, and program momentum at a glance.",
        icon: Calendar,
        link: "/integrations/webhooks",
      },
    ],
  },
  {
    name: "Action — Four Agents",
    tagline: "The team you haven't hired yet. Agents propose; your team approves; the system executes and logs.",
    color: "#818cf8",
    features: [
      {
        title: "PSM Agent",
        description: "Partner Sales Manager. Finds co-sell overlap across open deals, drafts the warm intro, logs touchpoints after every meeting, re-ignites stale partner-registered deals.",
        icon: Handshake,
      },
      {
        title: "PAM Agent",
        description: "Partner Account Manager. Watches partner health weekly, flags churn risk, writes check-ins by risk tier, preps QBR decks, handles new-partner onboarding.",
        icon: HeartPulse,
      },
      {
        title: "Program Agent",
        description: "Program lead. Spots commission leakage before payout. Proposes tier-threshold and rule changes with a 90-day dry-run preview. Drafts MDF approval rationale.",
        icon: Scale,
      },
      {
        title: "Ops Agent",
        description: "Partner Ops. Pre-payout reconciliation 72 hours before every run. Flags attribution mismatches that would trigger disputes. Produces the Stripe-ready payout file.",
        icon: Shield,
      },
    ],
  },
  {
    name: "Unlock — Commissions & Payouts",
    tagline: "Complex rules, automated calculations, zero spreadsheets.",
    color: "#22c55e",
    features: [
      {
        title: "Complex Commission Rules",
        description: "Tiered rates by partner level, product line, deal size, and role. Create rules in plain English or configure manually.",
        icon: Coins,
      },
      {
        title: "Auto-Commission on Approval",
        description: "Approve a deal registration → commission calculates instantly based on matching rules. No manual spreadsheet step.",
        icon: Zap,
      },
      {
        title: "Bulk Payout Approval",
        description: "Select multiple payouts, approve in one click. Stats cards show pending, approved, and total amounts.",
        icon: CheckCircle2,
      },
      {
        title: "End-of-Quarter Reconciliation",
        description: "Quarter-by-quarter payout summaries with CSV export. Match what you owe to what you paid — no surprises.",
        icon: Scale,
      },
      {
        title: "Dispute Resolution",
        description: "Partners open disputes on deals. Admins review, resolve, or reject with notes. Full audit trail. No more email threads.",
        icon: Scale,
      },
    ],
  },
  {
    name: "Capture — Partner Portal & Deal Reg",
    tagline: "A branded portal partners actually log into. Deal registration, commission visibility, real data.",
    color: "#f59e0b",
    features: [
      {
        title: "White-Label Portal",
        description: "Zero Covant branding on partner-facing pages. Your program, your brand. Partners see their deals, commissions, and performance.",
        icon: Globe,
      },
      {
        title: "Deal Registration",
        description: "Partners register deals from the portal with product tagging. Admins approve or reject with one click.",
        icon: ClipboardList,
      },
      {
        title: "Commission Transparency",
        description: "Partners see exactly what they've earned, what's pending, and the calculation behind each payout.",
        icon: Coins,
      },

    ],
  },
  {
    name: "Partner Management",
    tagline: "Manage 5 partners or 500 — with the same toolset.",
    color: "#ec4899",
    features: [
      {
        title: "Partner Health Scores",
        description: "Composite 0–100 scores from deal activity, revenue, engagement, recency, and payout health. Auto-classify healthy, at-risk, and churning.",
        icon: HeartPulse,
      },
      {
        title: "Partner Tags & Bulk Actions",
        description: "Color-coded labels (Top Performer, At Risk, VIP). Select multiple partners for batch tier changes, tagging, status updates, and CSV export.",
        icon: Tag,
      },
      {
        title: "Threaded Notes",
        description: "Timestamped internal notes on each partner. Pin important notes, edit inline, full audit trail across team members.",
        icon: StickyNote,
      },
      {
        title: "Partner Comparison",
        description: "Select 2–4 partners, compare side-by-side: revenue, win rate, deal velocity, engagement, and auto-generated insights.",
        icon: BarChart3,
      },
      {
        title: "Partner Scorecard",
        description: "Print-ready one-page performance report with health score, metrics, revenue trends, top deals, and key insights. PDF export for QBRs.",
        icon: FileDown,
      },

      {
        title: "Onboarding Tracking",
        description: "Progress bar on every partner showing onboarding completion. See exactly who needs attention and what steps remain.",
        icon: Users,
      },
      {
        title: "Partner Applications",
        description: "Public /apply page for inbound partner acquisition. Admin review dashboard with approve/reject workflow and duplicate detection.",
        icon: Handshake,
      },
    ],
  },
  {
    name: "Analytics & Reporting",
    tagline: "Board-ready reports generated from live data, not manual slide decks.",
    color: "#8b5cf6",
    features: [
      {
        title: "Revenue Intelligence",
        description: "Revenue by partner type and tier, concentration risk analysis, top partner leaderboard, and commission-to-revenue ratio.",
        icon: Brain,
        link: "/use-cases/revops",
      },
      {
        title: "QBR Reports",
        description: "Executive quarterly reviews with Q-over-Q deltas, rolling revenue charts, pipeline breakdown, and print/PDF support.",
        icon: BarChart3,
      },
      {
        title: "Win/Loss Analysis",
        description: "Win rate by partner, product, and deal size. Velocity patterns, touchpoint correlation, and auto-generated insights.",
        icon: Target,
      },
      {
        title: "Weekly Digest",
        description: "Automated weekly summary: KPIs with week-over-week deltas, top partner highlight, notable deals, at-risk alerts. Copy-to-clipboard for Slack.",
        icon: Calendar,
      },

      {
        title: "Goals & Targets",
        description: "Set quarterly objectives and track live progress. Color-coded pace indicators tell you if you're on track or behind.",
        icon: Target,
      },
      {
        title: "Program Health Score",
        description: "Single 0–100 composite score across engagement, deal velocity, payout health, and growth. One number to report upward.",
        icon: HeartPulse,
      },
      {
        title: "Data Export Center",
        description: "Bulk CSV download for partners, deals, payouts, touchpoints, audit log, commission rules, and products. Enterprise data portability.",
        icon: FileDown,
      },
    ],
  },
  {
    name: "Platform & Integrations",
    tagline: "Developer-ready infrastructure that plugs into your stack.",
    color: "#06b6d4",
    features: [
      {
        title: "Salesforce Integration",
        description: "Full OAuth flow, deal sync, and field mapping. Connect your CRM and keep partner data in sync automatically.",
        icon: Plug,
        link: "/integrations/salesforce",
      },
      {
        title: "HubSpot Integration",
        description: "OAuth connect, bi-directional deal sync, and data flow between HubSpot and Covant.",
        icon: Plug,
        link: "/integrations/hubspot",
      },
      {
        title: "REST API & Webhooks",
        description: "Scoped API keys with granular permissions. HMAC-signed outbound webhooks for 15 event types with delivery logs.",
        icon: Key,
        link: "/integrations/api",
      },
      {
        title: "Stripe Billing",
        description: "Self-serve checkout, subscription management, and usage-based billing tied to active partner count.",
        icon: Coins,
        link: "/integrations/stripe",
      },
      {
        title: "Team Management",
        description: "Invite teammates, assign roles (Admin/Manager/Member), last-admin protection, and full audit logging.",
        icon: Users,
      },
      {
        title: "Notification Center",
        description: "In-app notifications with type filtering, email digest settings, quiet hours, and bulk mark-read.",
        icon: Bell,
      },
    ],
  },
  {
    name: "Productivity",
    tagline: "Power-user features that make daily work faster.",
    color: "#f97316",
    features: [
      {
        title: "Command Palette (⌘K)",
        description: "50+ navigable pages with rich keyword matching. Search partners and deals by name. Every page is one shortcut away.",
        icon: Search,
      },
      {
        title: "Keyboard Shortcuts",
        description: "Press ? for all shortcuts. G+key navigation: G then D for Dashboard, P for Partners, E for Deals — zero mouse navigation.",
        icon: Keyboard,
      },
      {
        title: "Pipeline Kanban Board",
        description: "Visual board view for deals: drag columns for Pending → Active → Won → Lost. Column totals and compact deal cards.",
        icon: ClipboardList,
      },
      {
        title: "Advanced Filters & Sorting",
        description: "6-filter system on deals (status, partner, product, amount range, registration). Sortable columns with active filter pills.",
        icon: BarChart3,
      },
      {
        title: "Getting Started Checklist",
        description: "5-step onboarding guide that auto-detects completion. Collapsible, dismissible, highlights the next action.",
        icon: CheckCircle2,
      },
      {
        title: "Help Center",
        description: "22 guides across 7 categories with search, step-by-step instructions, and related links. Self-serve documentation.",
        icon: BookOpen,
        link: "/help",
      },
    ],
  },
];

export default function FeaturesPage() {
  const totalFeatures = CATEGORIES.reduce((sum, cat) => sum + cat.features.length, 0);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color:'#6b7280',
            fontSize: ".85rem",
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> Back to Covant
        </Link>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
          Every Feature, One Page
        </h1>
        <p style={{ marginTop: ".5rem", lineHeight: 1.6, color: "#888", fontSize: ".95rem", maxWidth: 640 }}>
          {totalFeatures} features across {CATEGORIES.length} categories — the platform your
          partner team runs on. Record every touchpoint, capture every deal, action every partner,
          and unlock channel revenue end-to-end.
        </p>

        {/* Category jump links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "1.25rem" }}>
          {CATEGORIES.map((cat) => (
            <a
              key={cat.name}
              href={`#${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              style={{
                fontSize: ".75rem",
                fontWeight: 600,
                color: cat.color,
                background: `${cat.color}12`,
                border: `1px solid ${cat.color}25`,
                padding: "4px 12px",
                borderRadius: 6,
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
            >
              {cat.name} ({cat.features.length})
            </a>
          ))}
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((category) => {
        const anchor = category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return (
          <section key={category.name} id={anchor} style={{ marginBottom: "3rem", scrollMarginTop: "2rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background: category.color,
                  flexShrink: 0,
                }} />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                  {category.name}
                </h2>
                <span style={{
                  fontSize: ".7rem",
                  fontWeight: 600,
                  color: category.color,
                  background: `${category.color}12`,
                  border: `1px solid ${category.color}25`,
                  padding: "2px 8px",
                  borderRadius: 6,
                }}>
                  {category.features.length}
                </span>
              </div>
              <p style={{ fontSize: ".85rem", color: "#777", margin: "0 0 0 14px", lineHeight: 1.5 }}>
                {category.tagline}
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "0.75rem",
            }}>
              {category.features.map((feature) => {
                const Icon = feature.icon;
                const content = (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: "1.25rem",
                      transition: "border-color 0.2s",
                      cursor: feature.link ? "pointer" : "default",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${category.color}40`)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${category.color}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Icon size={16} style={{ color: category.color }} />
                      </div>
                      <h3 style={{ fontSize: ".9rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                        {feature.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: ".8rem", color: "#6b7280", lineHeight: 1.55, margin: 0 }}>
                      {feature.description}
                    </p>
                    {feature.link && (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: ".75rem",
                        color: category.color,
                        marginTop: 10,
                        fontWeight: 600,
                      }}>
                        Learn more <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                );

                return feature.link ? (
                  <Link key={feature.title} href={feature.link} style={{ textDecoration: "none", color: "inherit" }}>
                    {content}
                  </Link>
                ) : (
                  <div key={feature.title}>{content}</div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <div style={{
        marginTop: "2rem",
        padding: "2.5rem",
        background: "linear-gradient(135deg, #0a0a0a 0%, #111 100%)",
        border: "1px solid #1a1a1a",
        borderRadius: 12,
        textAlign: "center",
      }}>
        <Sparkles size={24} style={{ color: "#6366f1", marginBottom: 12 }} />
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 8px" }}>
          See it in action
        </h3>
        <p style={{ fontSize: ".85rem", color: "#888", margin: "0 0 20px", maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          Try the interactive demo with sample data, or apply to pilot Covant as a design partner.
          Free during pilot, locked-in pricing at GA.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/demo"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 24px",
              background: "#fff",
              color: "#000",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: ".85rem",
              textDecoration: "none",
            }}
          >
            Try Interactive Demo <ArrowRight size={14} />
          </Link>
          <Link
            href="/beta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 24px",
              background: "transparent",
              color:'#374151',
              border: "1px solid #333",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: ".85rem",
              textDecoration: "none",
            }}
          >
            Become a design partner
          </Link>
        </div>
      </div>
    </div>
  );
}
