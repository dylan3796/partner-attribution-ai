"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, X, ChevronRight, Zap, Wrench, Star,
  GitCommit, ExternalLink,
} from "lucide-react";

type ChangeType = "feat" | "fix" | "polish" | "other";

type ChangeEntry = {
  id: string;
  date: string;
  type: ChangeType;
  title: string;
  description: string;
  link?: string;
};

const TYPE_CONFIG: Record<ChangeType, { label: string; color: string; bg: string; icon: typeof Sparkles }> = {
  feat: { label: "New", color: "#22c55e", bg: "rgba(34,197,94,.12)", icon: Sparkles },
  fix: { label: "Fix", color: "#f59e0b", bg: "rgba(245,158,11,.12)", icon: Wrench },
  polish: { label: "Polish", color: "#8b5cf6", bg: "rgba(139,92,246,.12)", icon: Zap },
  other: { label: "Update", color: "#6b7280", bg: "rgba(107,114,128,.12)", icon: GitCommit },
};

// Recent notable features — curated highlights, not exhaustive git log
const RECENT_CHANGES: ChangeEntry[] = [
  {
    id: "2026-03-06-partner-compare",
    date: "Mar 6",
    type: "feat",
    title: "Partner Comparison",
    description: "Select 2–4 partners and compare side-by-side: revenue, win rate, deals, engagement, monthly trends, and auto-generated insights.",
    link: "/dashboard/partners",
  },
  {
    id: "2026-03-06-partner-tags",
    date: "Mar 6",
    type: "feat",
    title: "Partner Tags",
    description: "Color-coded labels to organize partners (Top Performer, Strategic, At Risk, VIP, etc). Add/remove inline, filter by tag on the list page.",
    link: "/dashboard/partners",
  },
  {
    id: "2026-03-06-partner-notes",
    date: "Mar 6",
    type: "feat",
    title: "Partner Notes",
    description: "Threaded internal notes on partner detail pages. Pin important notes, inline edit, full audit trail. Track conversations and context across your team.",
    link: "/dashboard/partners",
  },
  {
    id: "2026-03-06-portal-volume",
    date: "Mar 6",
    type: "feat",
    title: "Portal Volume — Real Data",
    description: "Volume programs, tier progress, and leaderboard now persist in Convex. All portal pages use real data — zero useStore remaining.",
    link: "/portal/volume",
  },
  {
    id: "2026-03-06-tier-reviews",
    date: "Mar 6",
    type: "feat",
    title: "Tier Reviews with Convex",
    description: "Approve, reject, or defer partner tier changes — decisions now persist across sessions with full audit trail.",
    link: "/dashboard/scoring/tier-reviews",
  },
  {
    id: "2026-03-06-whats-new",
    date: "Mar 6",
    type: "polish",
    title: "What's New Widget",
    description: "Sparkle button in the top bar shows curated feature highlights with unseen badge and click-to-navigate.",
  },
  {
    id: "2026-03-05-goals",
    date: "Mar 5",
    type: "feat",
    title: "Goals & Targets",
    description: "Set quarterly objectives and track live progress with color-coded pace indicators.",
    link: "/dashboard/goals",
  },
  {
    id: "2026-03-05-export",
    date: "Mar 5",
    type: "feat",
    title: "Data Export Center",
    description: "Bulk CSV download for all program data — partners, deals, payouts, touchpoints, and more.",
    link: "/dashboard/reports/export",
  },
  {
    id: "2026-03-05-leaderboard",
    date: "Mar 5",
    type: "feat",
    title: "Partner Leaderboard",
    description: "Gamified performance rankings with composite scoring, top-3 podium, and time period filters.",
    link: "/dashboard/leaderboard",
  },
  {
    id: "2026-03-05-health",
    date: "Mar 5",
    type: "feat",
    title: "Partner Health Scores",
    description: "Individual 0-100 health scores computed from live deal activity, revenue, and engagement.",
    link: "/dashboard/partner-health",
  },
  {
    id: "2026-03-05-qbr",
    date: "Mar 5",
    type: "feat",
    title: "QBR Reports",
    description: "Executive quarterly reviews with revenue charts, partner rankings, and print/PDF support.",
    link: "/dashboard/reports/qbr",
  },
  {
    id: "2026-03-05-disputes",
    date: "Mar 5",
    type: "feat",
    title: "Dispute Resolution",
    description: "Full dispute lifecycle — open, review, resolve, reject — with Convex persistence and audit trail.",
    link: "/dashboard/conflicts",
  },
  {
    id: "2026-03-04-products",
    date: "Mar 4",
    type: "feat",
    title: "Product Catalog",
    description: "Manage products with SKUs, categories, and margins. Commission rules now tie to specific products.",
    link: "/dashboard/products",
  },
  {
    id: "2026-03-04-webhooks",
    date: "Mar 4",
    type: "feat",
    title: "Webhooks & API Keys",
    description: "Create webhook endpoints with HMAC signing, manage API keys with granular scopes and expiration.",
    link: "/dashboard/settings/webhooks",
  },
  {
    id: "2026-03-04-team",
    date: "Mar 4",
    type: "feat",
    title: "Team Management",
    description: "Invite members, assign roles (Admin/Manager/Member), and manage permissions.",
    link: "/dashboard/settings/team",
  },
  {
    id: "2026-03-04-notifications",
    date: "Mar 4",
    type: "feat",
    title: "Notification Center",
    description: "Full notifications inbox with type filtering, bulk actions, and configurable preferences.",
    link: "/dashboard/notifications",
  },
  {
    id: "2026-03-04-kanban",
    date: "Mar 4",
    type: "feat",
    title: "Pipeline Board View",
    description: "Kanban-style deal pipeline with drag columns — Pending, Active, Won, Lost.",
    link: "/dashboard/pipeline",
  },
  {
    id: "2026-03-03-blog",
    date: "Mar 3",
    type: "feat",
    title: "Blog & Resources",
    description: "7 SEO-optimized articles, resource hub, and partner program assessment tool.",
    link: "/blog",
  },
];

const STORAGE_KEY = "covant-whats-new-seen";
const LATEST_VERSION = "2026-03-06";

function getSeenVersion(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

function markSeen() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, LATEST_VERSION);
}

export function WhatsNewButton() {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const seen = getSeenVersion();
    setHasNew(seen !== LATEST_VERSION);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleOpen() {
    setOpen(!open);
    if (!open) {
      markSeen();
      setHasNew(false);
    }
  }

  function handleItemClick(link?: string) {
    if (link) {
      router.push(link);
      setOpen(false);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        aria-label="What's New"
        title="What's New"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "5px 10px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: open ? "var(--subtle)" : "transparent",
          cursor: "pointer",
          color: "var(--muted)",
          fontSize: ".78rem",
          fontWeight: 500,
          fontFamily: "inherit",
          transition: "all .15s",
          position: "relative",
        }}
      >
        <Sparkles size={14} />
        <span style={{ display: "inline-block" }}>New</span>
        {hasNew && (
          <span style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid var(--bg)",
          }} />
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 380,
            maxHeight: "70vh",
            background: "#161616",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12,
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
            overflow: "hidden",
            zIndex: 200,
            animation: "whatsNewSlide .15s ease-out",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="#22c55e" />
              <span style={{ fontWeight: 700, fontSize: ".9rem" }}>What&apos;s New</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a
                href="/changelog"
                style={{
                  fontSize: ".75rem",
                  color: "var(--muted)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                Full changelog <ExternalLink size={10} />
              </a>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                  color: "var(--muted)",
                  lineHeight: 0,
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Entries */}
          <div style={{
            overflowY: "auto",
            maxHeight: "calc(70vh - 52px)",
            padding: "8px 0",
          }}>
            {RECENT_CHANGES.map((entry) => {
              const cfg = TYPE_CONFIG[entry.type];
              const Icon = cfg.icon;
              return (
                <button
                  key={entry.id}
                  onClick={() => handleItemClick(entry.link)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 16px",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: entry.link ? "pointer" : "default",
                    textAlign: "left",
                    color: "var(--fg)",
                    fontFamily: "inherit",
                    transition: "background .1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    padding: "2px 7px",
                    borderRadius: 5,
                    fontSize: ".6rem",
                    fontWeight: 700,
                    color: cfg.color,
                    background: cfg.bg,
                    flexShrink: 0,
                    marginTop: 2,
                    textTransform: "uppercase",
                    letterSpacing: ".03em",
                  }}>
                    <Icon size={9} /> {cfg.label}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: ".83rem", fontWeight: 600, lineHeight: 1.3 }}>
                        {entry.title}
                      </span>
                      <span style={{ fontSize: ".65rem", color: "var(--muted)", flexShrink: 0 }}>
                        {entry.date}
                      </span>
                    </div>
                    <p style={{
                      fontSize: ".75rem",
                      color: "var(--muted)",
                      lineHeight: 1.4,
                      marginTop: 2,
                    }}>
                      {entry.description}
                    </p>
                  </div>
                  {entry.link && (
                    <ChevronRight size={13} style={{ flexShrink: 0, marginTop: 3, color: "rgba(255,255,255,.2)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes whatsNewSlide {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
