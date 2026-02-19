"use client";

import Link from "next/link";
import { Zap, Gift, Rocket, GitBranch, Shield, Mail, Plug, Book, Search, Bell, FileText, Users, Briefcase, BarChart3, Globe } from "lucide-react";

type ChangelogEntry = {
  date: string;
  version: string;
  title: string;
  description: string;
  icon: typeof Zap;
  color: string;
  items: string[];
  tag: "feature" | "improvement" | "fix";
};

const entries: ChangelogEntry[] = [
  {
    date: "Feb 18, 2026", version: "1.12", title: "Partner Resource Hub",
    description: "Full-featured resource center with search, bookmarks, and 18 resources across 6 categories.",
    icon: FileText, color: "#14b8a6", tag: "feature",
    items: ["Search across titles, descriptions, and tags", "Bookmark system with saved view", "Featured resources section", "8 resource types with contextual actions"],
  },
  {
    date: "Feb 18, 2026", version: "1.11", title: "Integrations Hub",
    description: "Marketplace-style integrations page with 12 connectors across CRM, payments, comms, and analytics.",
    icon: Plug, color: "#ec4899", tag: "feature",
    items: ["Salesforce, HubSpot, Stripe, Slack, Zapier + 7 more", "Category filtering and status indicators", "Sync status and record counts", "One-click connect/disconnect"],
  },
  {
    date: "Feb 18, 2026", version: "1.10", title: "API Documentation",
    description: "Complete REST API reference with 10 documented endpoints, auth guide, and code samples.",
    icon: Book, color: "#f59e0b", tag: "feature",
    items: ["Partners, Deals, Attribution, Payouts, Webhooks endpoints", "Interactive expandable endpoint cards", "Request/response JSON examples", "Copy-to-clipboard code blocks"],
  },
  {
    date: "Feb 18, 2026", version: "1.9", title: "Command Palette",
    description: "⌘K search across all 25+ dashboard pages for instant navigation.",
    icon: Search, color: "#6366f1", tag: "feature",
    items: ["Fuzzy keyword search", "Full keyboard navigation", "Category grouping", "Current page indicator"],
  },
  {
    date: "Feb 18, 2026", version: "1.8", title: "Email Notification Triggers",
    description: "Configurable automated partner email system with 11 trigger types and send queue.",
    icon: Mail, color: "#3b82f6", tag: "feature",
    items: ["Deal won, payout approved, tier change triggers", "Template preview with variable placeholders", "Enable/disable toggles", "Outbound email queue with status tracking"],
  },
  {
    date: "Feb 18, 2026", version: "1.7", title: "Tier Review Queue",
    description: "Operational workflow for reviewing and approving partner tier changes.",
    icon: Shield, color: "#8b5cf6", tag: "feature",
    items: ["Approve/reject/defer actions per partner", "Full scoring breakdown with 4 dimensions", "Review notes and bulk approval", "Progress tracking"],
  },
  {
    date: "Feb 18, 2026", version: "1.6", title: "Pipeline & Co-Sell Dashboard",
    description: "Partner-to-account revenue mapping with influence tracking.",
    icon: GitBranch, color: "#22c55e", tag: "feature",
    items: ["Revenue influence chart per partner", "Expandable account drill-down", "Touchpoint type badges", "Sort by revenue, pipeline, or influence"],
  },
  {
    date: "Feb 18, 2026", version: "1.5", title: "Partner Onboarding Tracker",
    description: "6-stage pipeline tracking partner journey from signup to revenue production.",
    icon: Rocket, color: "#f97316", tag: "feature",
    items: ["Visual pipeline progress bars", "Onboarding funnel visualization", "Blocker tracking and overdue alerts", "Channel manager assignment"],
  },
  {
    date: "Feb 18, 2026", version: "1.4", title: "Incentive Programs",
    description: "Manage SPIFs, bonuses, accelerators with budget tracking and partner enrollments.",
    icon: Gift, color: "#eab308", tag: "feature",
    items: ["5 program types with rule definitions", "Budget utilization tracking", "Per-partner enrollment and progress", "Achievement status tracking"],
  },
  {
    date: "Feb 18, 2026", version: "1.3", title: "Partner Portal Notifications",
    description: "Activity feed with 6 notification types for partner engagement.",
    icon: Bell, color: "#ef4444", tag: "feature",
    items: ["Deal updates, payouts, tier changes, incentives", "Unread indicators and mark-all-read", "Filter by type with count badges", "Action links per notification"],
  },
  {
    date: "Feb 17, 2026", version: "1.2", title: "Mobile Responsive",
    description: "Full mobile responsiveness across landing page, dashboard, and partner portal.",
    icon: Globe, color: "#64748b", tag: "improvement",
    items: ["Collapsible sidebar navigation", "Touch-optimized card layouts", "Mobile top bar with hamburger menu", "Responsive grid breakpoints"],
  },
  {
    date: "Feb 17, 2026", version: "1.1", title: "Event Ingestion System",
    description: "Generic webhook system for receiving events from CRMs and external sources.",
    icon: Zap, color: "#6366f1", tag: "feature",
    items: ["Source registration with signing secrets", "Inbound event log with status", "Flexible payload parsing", "Event-to-action mapping"],
  },
];

const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  feature: { bg: "#6366f120", fg: "#6366f1" },
  improvement: { bg: "#22c55e20", fg: "#22c55e" },
  fix: { bg: "#eab30820", fg: "#eab308" },
};

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5" }}>
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff", textDecoration: "none", letterSpacing: "-.02em" }}>covant</Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ fontSize: ".9rem", color: "#888" }}>Changelog</span>
        </div>
        <Link href="/dashboard" style={{ fontSize: ".8rem", color: "#666", textDecoration: "none" }}>Dashboard →</Link>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", marginBottom: ".5rem" }}>What&apos;s New</h1>
        <p style={{ color: "#666", fontSize: "1rem", marginBottom: "3rem" }}>Latest updates and improvements to the Covant platform.</p>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "#1a1a1a" }} />

          {entries.map((entry, i) => {
            const Icon = entry.icon;
            const tagColor = TAG_COLORS[entry.tag];
            return (
              <div key={i} style={{ position: "relative", paddingLeft: 52, paddingBottom: "2.5rem" }}>
                {/* Timeline dot */}
                <div style={{
                  position: "absolute", left: 8, top: 2,
                  width: 24, height: 24, borderRadius: 12,
                  background: `${entry.color}20`, border: `2px solid ${entry.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={12} style={{ color: entry.color }} />
                </div>

                {/* Date + version */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: ".8rem", color: "#555" }}>{entry.date}</span>
                  <span style={{ padding: "1px 8px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700, background: "#1a1a1a", color: "#888" }}>v{entry.version}</span>
                  <span style={{ padding: "1px 8px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700, background: tagColor.bg, color: tagColor.fg, textTransform: "capitalize" }}>{entry.tag}</span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: 6 }}>{entry.title}</h3>
                <p style={{ color: "#888", fontSize: ".9rem", lineHeight: 1.6, marginBottom: 10 }}>{entry.description}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {entry.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: ".85rem", color: "#666" }}>
                      <span style={{ width: 4, height: 4, borderRadius: 2, background: entry.color, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
