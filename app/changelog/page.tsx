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
          What&apos;s new in Covant — {totalFeatures} features and {totalFixes} improvements shipped this week.
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
