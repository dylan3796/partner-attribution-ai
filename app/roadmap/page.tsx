"use client";

import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Circle, Clock, Sparkles,
  Users, Zap, Shield, BarChart3, Globe, Bot, Workflow,
  ArrowRight, Rocket, Bell, Key, FileDown, Target,
  HeartPulse, Trophy, Package, AlertTriangle,
  BookOpen, Award, FileText, TrendingUp, GitCompare,
  Tags, CalendarDays, Columns3, LayoutGrid,
} from "lucide-react";

type RoadmapItem = {
  title: string;
  description: string;
  icon: typeof Sparkles;
  status: "shipped" | "in-progress" | "planned";
  quarter?: string;
  tag?: string;
};

const STATUS_CONFIG = {
  shipped: {
    label: "Shipped",
    color: "#22c55e",
    bg: "#22c55e14",
    border: "#22c55e30",
    Icon: CheckCircle2,
  },
  "in-progress": {
    label: "In Progress",
    color: "#f59e0b",
    bg: "#f59e0b14",
    border: "#f59e0b30",
    Icon: Clock,
  },
  planned: {
    label: "Planned",
    color: "#8b5cf6",
    bg: "#8b5cf614",
    border: "#8b5cf630",
    Icon: Circle,
  },
};

const ROADMAP: RoadmapItem[] = [
  // Shipped
  {
    title: "AI-Powered Setup",
    description: "Import a CSV or use sample data — AI auto-maps fields and generates commission rules from plain English. Go from zero to configured in under 5 minutes.",
    icon: Bot,
    status: "shipped",
    tag: "Onboarding",
  },
  {
    title: "Three Attribution Models",
    description: "Deal Reg Protection, Source Wins, and Role Split — the three models that cover 95% of real partner programs. Full audit trail for every calculation.",
    icon: Workflow,
    status: "shipped",
    tag: "Attribution",
  },
  {
    title: "Partner Portal",
    description: "White-labeled portal where partners track their deals, commissions, performance, MDF requests, and certifications. Real Convex data — no demo stubs.",
    icon: Users,
    status: "shipped",
    tag: "Portal",
  },
  {
    title: "Complex Commission Rules",
    description: "Tiered rates by partner level, product line, and deal size. Rules engine with UI for creating, editing, and testing commission logic.",
    icon: Zap,
    status: "shipped",
    tag: "Commissions",
  },
  {
    title: "Deal Registration Workflow",
    description: "Partners register deals from the portal. Admins approve or reject with one click. Commissions auto-calculate on approval.",
    icon: Sparkles,
    status: "shipped",
    tag: "Deals",
  },
  {
    title: "Stripe Billing",
    description: "Self-serve checkout, subscription management, and usage-based billing tied to active partner count.",
    icon: Shield,
    status: "shipped",
    tag: "Billing",
  },
  {
    title: "HubSpot Integration",
    description: "OAuth connect, deal sync, and bi-directional data flow between HubSpot CRM and Covant.",
    icon: Globe,
    status: "shipped",
    tag: "Integrations",
  },
  {
    title: "Forecasting & Benchmarks",
    description: "Pipeline projections, commission forecasting, and per-partner performance benchmarks against program averages.",
    icon: BarChart3,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Product Catalog & Commission Matching",
    description: "Full product catalog with SKU search, category filters, and margin tracking. Commission rules auto-match by product line for product-level payouts.",
    icon: Package,
    status: "shipped",
    tag: "Revenue",
  },
  {
    title: "API Keys & Webhooks",
    description: "Developer platform with scoped API keys, HMAC-signed outbound webhooks for 15 event types, delivery logs, and test events. Full integration toolkit.",
    icon: Key,
    status: "shipped",
    tag: "Platform",
  },
  {
    title: "Team Management",
    description: "Invite teammates by email, assign roles (Admin/Manager/Member), inline role changes, last-admin protection, and audit logging for all team actions.",
    icon: Users,
    status: "shipped",
    tag: "Platform",
  },
  {
    title: "Notification Center",
    description: "In-app notifications with type filtering, bulk mark-read, date-grouped timeline, and configurable preferences with quiet hours and email digest frequency.",
    icon: Bell,
    status: "shipped",
    tag: "Platform",
  },
  {
    title: "Partner Applications",
    description: "Public /apply form for inbound partner acquisition. Admin review dashboard with approve/reject workflow, review notes, and duplicate detection.",
    icon: Users,
    status: "shipped",
    tag: "Growth",
  },
  {
    title: "Data Export Center",
    description: "Bulk CSV download for all program data — partners, deals, payouts, touchpoints, audit log, commission rules, and products. Enterprise-grade data portability.",
    icon: FileDown,
    status: "shipped",
    tag: "Enterprise",
  },
  {
    title: "Goals & Targets",
    description: "Set quarterly objectives for revenue, pipeline, partners, deals, and win rate. Track live progress with color-coded pace indicators comparing actual vs. time elapsed.",
    icon: Target,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "QBR Reports",
    description: "Executive quarterly business reviews with Q-over-Q deltas, rolling revenue charts, pipeline breakdown, top partner leaderboard, and print/PDF support.",
    icon: BarChart3,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Partner Health Scores",
    description: "Composite 0-100 health scores per partner computed from deal activity, revenue, engagement, recency, and payout health. Auto-classifies healthy, at-risk, and churning partners.",
    icon: HeartPulse,
    status: "shipped",
    tag: "Intelligence",
  },
  {
    title: "Partner Leaderboard",
    description: "Gamified performance rankings with podium, medal tiers, composite scoring (revenue, deals, win rate, engagement), and time period filters.",
    icon: Trophy,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Dispute Resolution",
    description: "Full dispute lifecycle — open disputes against deals, admin review workflow, resolve or reject with notes, CSV export, and audit trail. Replaces spreadsheet disputes.",
    icon: AlertTriangle,
    status: "shipped",
    tag: "Revenue",
  },
  {
    title: "Revenue Intelligence",
    description: "Deep analytics on partner-attributed revenue — breakdown by type and tier, 12-month trends, concentration risk analysis, top partner leaderboard, and largest deal attribution.",
    icon: TrendingUp,
    status: "shipped",
    tag: "Intelligence",
  },
  {
    title: "Win/Loss Analysis",
    description: "Deal outcome deep dive — win rates by partner, product, and deal size. Velocity comparison, touchpoint correlation, monthly trends, and auto-generated insights.",
    icon: BarChart3,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Partner Certifications",
    description: "Create certification programs with levels, categories, and tier requirements. Award certs to partners, track completion and expiry. Tier-gated advancement.",
    icon: Award,
    status: "shipped",
    tag: "Enablement",
  },
  {
    title: "Partner Scorecard",
    description: "Print-ready one-page performance report per partner — health score, key metrics, revenue trend, top deals, and auto-generated insights for QBR prep.",
    icon: FileText,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Activity Heatmap",
    description: "GitHub-style contribution graph showing daily partner program activity over 12 months. Streak tracking, busiest day, and engagement pattern visualization.",
    icon: CalendarDays,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Weekly Performance Digest",
    description: "Automated weekly summary for exec reporting — KPIs with week-over-week deltas, top partner, notable deals, at-risk alerts. Copy-as-text for Slack or email.",
    icon: FileText,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Partner Comparison",
    description: "Select 2–4 partners and benchmark side-by-side: revenue, win rate, engagement, monthly trends, and auto-generated insights for QBR prep.",
    icon: GitCompare,
    status: "shipped",
    tag: "Intelligence",
  },
  {
    title: "Bulk Actions & Tags",
    description: "Select multiple partners for batch operations — bulk tagging, tier changes, status updates, and selective CSV export. Color-coded labels for organizing partners.",
    icon: Tags,
    status: "shipped",
    tag: "Operations",
  },
  {
    title: "Reports Hub",
    description: "Centralized overview of all 8 analytics reports with quick-access cards. One page to discover Attribution, Win/Loss, Revenue, Digest, QBR, and more.",
    icon: LayoutGrid,
    status: "shipped",
    tag: "Analytics",
  },
  {
    title: "Help Center",
    description: "22 guides across 7 categories — searchable knowledge base with step-by-step instructions for every product feature. Enterprise documentation standard.",
    icon: BookOpen,
    status: "shipped",
    tag: "Documentation",
  },
  {
    title: "Competitor Comparisons",
    description: "SEO-optimized comparison pages vs PartnerStack, impact.com, and Crossbeam. Feature tables, strengths analysis, and honest positioning for VP evaluation.",
    icon: Columns3,
    status: "shipped",
    tag: "Marketing",
  },
  {
    title: "Features Page",
    description: "Comprehensive reference of all 45+ product capabilities organized by category — the page VPs forward to procurement teams during vendor evaluation.",
    icon: Sparkles,
    status: "shipped",
    tag: "Marketing",
  },

  // In Progress
  {
    title: "Salesforce Integration",
    description: "Full OAuth flow, deal sync, and field mapping. Code complete — connecting to live Salesforce orgs now.",
    icon: Globe,
    status: "in-progress",
    tag: "Integrations",
    quarter: "Q1 2026",
  },
  {
    title: "Email Notifications",
    description: "Automated emails for deal approvals, commission payouts, partner invites, and custom triggers. Templates built and customizable.",
    icon: Zap,
    status: "in-progress",
    tag: "Notifications",
    quarter: "Q1 2026",
  },

  // Planned
  {
    title: "Slack & Teams Alerts",
    description: "Real-time notifications in Slack or Microsoft Teams when deals are registered, approved, or when commissions hit thresholds.",
    icon: Zap,
    status: "planned",
    tag: "Integrations",
    quarter: "Q2 2026",
  },
  {
    title: "Multi-Program Support",
    description: "Run multiple partner programs (reseller, referral, technology) from one account with separate rules, tiers, and portals.",
    icon: Workflow,
    status: "planned",
    tag: "Platform",
    quarter: "Q2 2026",
  },
  {
    title: "Partner Marketplace",
    description: "Public-facing directory where potential partners can discover your program and apply directly.",
    icon: Users,
    status: "planned",
    tag: "Growth",
    quarter: "Q3 2026",
  },
  {
    title: "SSO & Advanced Security",
    description: "SAML/OIDC single sign-on, role-based access control, and SOC 2 compliance for enterprise deployments.",
    icon: Shield,
    status: "planned",
    tag: "Enterprise",
    quarter: "Q3 2026",
  },
  {
    title: "AI Partner Recommendations",
    description: "Machine learning that identifies which partners are underperforming, which deals are at risk, and where to invest next.",
    icon: Bot,
    status: "planned",
    tag: "Intelligence",
    quarter: "Q3 2026",
  },
];

export default function RoadmapPage() {
  const shipped = ROADMAP.filter((i) => i.status === "shipped");
  const inProgress = ROADMAP.filter((i) => i.status === "in-progress");
  const planned = ROADMAP.filter((i) => i.status === "planned");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#666",
            fontSize: ".85rem",
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> Back to Covant
        </Link>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Product Roadmap
        </h1>
        <p
          style={{
            marginTop: ".5rem",
            lineHeight: 1.6,
            color: "#888",
            fontSize: ".95rem",
            maxWidth: 600,
          }}
        >
          What we&apos;ve built, what we&apos;re building, and where we&apos;re headed.
          Covant ships fast — {shipped.length} major features live and counting.
        </p>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Shipped", count: shipped.length, color: "#22c55e" },
            { label: "In Progress", count: inProgress.length, color: "#f59e0b" },
            { label: "Planned", count: planned.length, color: "#8b5cf6" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 8,
                background: `${s.color}10`,
                border: `1px solid ${s.color}25`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: s.color,
                }}
              />
              <span style={{ fontSize: ".8rem", color: s.color, fontWeight: 600 }}>
                {s.count} {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      {[
        { title: "Live Now", items: shipped, status: "shipped" as const },
        { title: "In Progress", items: inProgress, status: "in-progress" as const },
        { title: "Coming Soon", items: planned, status: "planned" as const },
      ].map((section) => {
        const cfg = STATUS_CONFIG[section.status];
        return (
          <div key={section.title} style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "1rem",
              }}
            >
              <cfg.Icon size={18} style={{ color: cfg.color }} />
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                {section.title}
              </h2>
              <span
                style={{
                  fontSize: ".7rem",
                  fontWeight: 600,
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                {section.items.length}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    style={{
                      background: "#0a0a0a",
                      border: "1px solid #1a1a1a",
                      borderRadius: 10,
                      padding: "1.25rem",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#333")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#1a1a1a")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Icon size={16} style={{ color: cfg.color }} />
                        <span
                          style={{
                            fontSize: ".65rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            color: "#666",
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      {item.quarter && (
                        <span
                          style={{
                            fontSize: ".65rem",
                            color: "#555",
                            fontWeight: 500,
                          }}
                        >
                          {item.quarter}
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: ".9rem",
                        fontWeight: 700,
                        margin: "0 0 6px",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: ".78rem",
                        color: "#777",
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div
        style={{
          marginTop: "2rem",
          padding: "2rem",
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <Rocket size={24} style={{ color: "#8b5cf6", marginBottom: 12 }} />
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px" }}>
          Want to shape what we build next?
        </h3>
        <p
          style={{
            fontSize: ".85rem",
            color: "#888",
            margin: "0 0 16px",
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Join our early access program and get direct input on the roadmap.
          Beta users ship features faster.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/beta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "#fff",
              color: "#000",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: ".85rem",
              textDecoration: "none",
            }}
          >
            Join Early Access <ArrowRight size={14} />
          </Link>
          <Link
            href="/changelog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "transparent",
              color: "#888",
              border: "1px solid #333",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: ".85rem",
              textDecoration: "none",
            }}
          >
            View Changelog
          </Link>
        </div>
      </div>
    </div>
  );
}
