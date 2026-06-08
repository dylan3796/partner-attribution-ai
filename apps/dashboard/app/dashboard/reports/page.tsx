"use client";

import Link from "next/link";
import {
  PieChart,
  TrendingUp,
  Calendar,
  Activity,
  Download,
  Scale,
  BarChart3,
  Target,
  ArrowRight,
  Flame,
} from "lucide-react";

type ReportCard = {
  title: string;
  description: string;
  href: string;
  icon: typeof PieChart;
  color: string;
  tag?: string;
};

const REPORTS: ReportCard[] = [
  {
    title: "Attribution Reports",
    description:
      "Compare attribution models side-by-side, analyze partner influence on CRM deals, and view the partner leaderboard by credited revenue.",
    href: "/dashboard/reports/attribution",
    icon: PieChart,
    color: "#6366f1",
    tag: "Core",
  },
  {
    title: "Revenue Intelligence",
    description:
      "Revenue breakdown by partner type and tier, concentration risk analysis, 12-month trends, and top-revenue partner leaderboard.",
    href: "/dashboard/reports/revenue",
    icon: TrendingUp,
    color: "#10b981",
  },
  {
    title: "Win/Loss Analysis",
    description:
      "Deep dive into deal outcomes — win rate by partner, product, and deal size. Touchpoint engagement impact and velocity patterns.",
    href: "/dashboard/reports/win-loss",
    icon: Target,
    color: "#f59e0b",
  },
  {
    title: "Weekly Digest",
    description:
      "Automated weekly summary with KPI deltas, top partner of the week, notable deals, and at-risk partner alerts. Copy for Slack or email.",
    href: "/dashboard/reports/digest",
    icon: Calendar,
    color: "#8b5cf6",
  },
  {
    title: "QBR Report",
    description:
      "Quarterly Business Review deck — executive summary, rolling revenue & pipeline charts, commission summary, top partners, and action items.",
    href: "/dashboard/reports/qbr",
    icon: BarChart3,
    color: "#3b82f6",
  },
  {
    title: "Activity Heatmap",
    description:
      "GitHub-style contribution graph showing daily partner program activity over the past 12 months. Spot engagement patterns at a glance.",
    href: "/dashboard/reports/activity",
    icon: Activity,
    color: "#ec4899",
  },
  {
    title: "Reconciliation",
    description:
      "End-of-quarter reconciliation report — match commissions earned vs paid, identify discrepancies, and export for finance review.",
    href: "/dashboard/reports/reconciliation",
    icon: Scale,
    color: "#14b8a6",
  },
  {
    title: "Data Export",
    description:
      "Bulk CSV download for all program data — partners, deals, payouts, touchpoints, audit log, commission rules, and products.",
    href: "/dashboard/reports/export",
    icon: Download,
    color: "#6b7280",
  },
];

function ReportCardComponent({ report }: { report: ReportCard }) {
  return (
    <Link
      href={report.href}
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1.5rem",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.15s, transform 0.15s",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = report.color;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {report.tag && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: ".65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "2px 8px",
            borderRadius: 10,
            background: report.color + "22",
            color: report.color,
          }}
        >
          {report.tag}
        </span>
      )}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: report.color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <report.icon size={20} style={{ color: report.color }} />
      </div>
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            marginBottom: 4,
          }}
        >
          {report.title}
        </h3>
        <p
          className="muted"
          style={{
            fontSize: ".8rem",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {report.description}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: ".75rem",
          fontWeight: 600,
          color: report.color,
          marginTop: "auto",
        }}
      >
        View report <ArrowRight size={14} />
      </div>
    </Link>
  );
}

export default function ReportsHubPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Reports
        </h1>
        <p
          className="muted"
          style={{ marginTop: "0.25rem", maxWidth: 600 }}
        >
          All your partner program analytics in one place — attribution models,
          revenue intelligence, QBR decks, and more.
        </p>
      </div>

      {/* Quick Stats Row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/dashboard/reports/attribution"
          className="card"
          style={{
            flex: 1,
            minWidth: 150,
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Flame size={18} style={{ color: "#f59e0b" }} />
          <div>
            <div style={{ fontSize: ".7rem", fontWeight: 600 }} className="muted">
              MOST USED
            </div>
            <div style={{ fontSize: ".85rem", fontWeight: 700 }}>
              Attribution
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/reports/digest"
          className="card"
          style={{
            flex: 1,
            minWidth: 150,
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Calendar size={18} style={{ color: "#8b5cf6" }} />
          <div>
            <div style={{ fontSize: ".7rem", fontWeight: 600 }} className="muted">
              WEEKLY
            </div>
            <div style={{ fontSize: ".85rem", fontWeight: 700 }}>
              Digest
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/reports/qbr"
          className="card"
          style={{
            flex: 1,
            minWidth: 150,
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <BarChart3 size={18} style={{ color: "#3b82f6" }} />
          <div>
            <div style={{ fontSize: ".7rem", fontWeight: 600 }} className="muted">
              QUARTERLY
            </div>
            <div style={{ fontSize: ".85rem", fontWeight: 700 }}>
              QBR Report
            </div>
          </div>
        </Link>
      </div>

      {/* Report Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        {REPORTS.map((r) => (
          <ReportCardComponent key={r.href} report={r} />
        ))}
      </div>

      {/* Tip */}
      <div
        className="card"
        style={{
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderLeft: "3px solid #6366f1",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>💡</span>
        <p
          className="muted"
          style={{ fontSize: ".8rem", margin: 0, lineHeight: 1.5 }}
        >
          <strong style={{ color: "var(--fg)" }}>Tip:</strong> Press{" "}
          <kbd
            style={{
              padding: "1px 5px",
              borderRadius: 4,
              fontSize: ".7rem",
              fontWeight: 600,
              background: "var(--subtle)",
              border: "1px solid var(--border)",
            }}
          >
            ⌘K
          </kbd>{" "}
          to jump to any report by name. Most reports support Print/PDF export for
          sharing with leadership.
        </p>
      </div>
    </div>
  );
}
