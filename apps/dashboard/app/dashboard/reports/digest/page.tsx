"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trophy,
  AlertTriangle,
  Briefcase,
  Users,
  DollarSign,
  Activity,
  Printer,
  Copy,
  CheckCircle,
  Loader2,
  Zap,
  Target,
} from "lucide-react";

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function fmtDateFull(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DeltaBadge({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value === 0)
    return (
      <span
        style={{
          fontSize: ".7rem",
          fontWeight: 600,
          color: "var(--muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Minus size={10} /> No change
      </span>
    );
  const isUp = value > 0;
  return (
    <span
      style={{
        fontSize: ".7rem",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        color: isUp ? "#059669" : "#dc2626",
        background: isUp ? "rgba(5,150,105,.08)" : "rgba(220,38,38,.08)",
        padding: "2px 8px",
        borderRadius: 4,
      }}
    >
      {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {isUp ? "+" : ""}
      {value}%{suffix} vs last week
    </span>
  );
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function WeeklyDigestPage() {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const monday = getMonday(new Date());
    monday.setDate(monday.getDate() + weekOffset * 7);
    return monday.getTime();
  }, [weekOffset]);

  const digest = useQuery(api.weeklyDigest.getDigest, { weekStart });
  const [copied, setCopied] = useState(false);

  function handleCopyText() {
    if (!digest) return;
    const m = digest.metrics;
    const lines = [
      `📊 Weekly Partner Program Digest`,
      `${fmtDate(digest.weekStart)} – ${fmtDate(digest.weekEnd)}`,
      ``,
      `Revenue Closed: ${fmt(m.revenue.value)} (${m.revenue.delta >= 0 ? "+" : ""}${m.revenue.delta}% WoW)`,
      `Deals Created: ${m.dealsCreated.value} | Won: ${m.dealsClosed.won} | Lost: ${m.dealsClosed.lost}`,
      m.dealsClosed.winRate !== null ? `Win Rate: ${m.dealsClosed.winRate}%` : "",
      `New Pipeline Added: ${fmt(m.pipeline)}`,
      `New Partners: ${m.newPartners.value}`,
      `Partner Touchpoints: ${m.touchpoints.value}`,
      `Commissions Generated: ${fmt(m.commissions)}`,
      ``,
    ];
    if (digest.topPartner) {
      lines.push(
        `🏆 Top Partner: ${digest.topPartner.name} — ${fmt(digest.topPartner.revenue)} closed`
      );
    }
    if (digest.highlights.length > 0) {
      lines.push(``, `Notable Deals:`);
      digest.highlights.forEach((h: { name: string; amount: number; product: string | null }) => {
        lines.push(`  • ${h.name} — ${fmt(h.amount)}${h.product ? ` (${h.product})` : ""}`);
      });
    }
    if (digest.atRiskPartners.length > 0) {
      lines.push(``, `⚠️ At-Risk Partners (60+ days inactive):`);
      digest.atRiskPartners.forEach((p: { name: string; tier: string; type: string }) => {
        lines.push(`  • ${p.name} (${p.tier} ${p.type})`);
      });
    }
    navigator.clipboard.writeText(lines.filter((l) => l !== undefined).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!digest) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
        }}
      >
        <Loader2
          size={24}
          style={{ animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  const m = digest.metrics;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <Link
            href="/dashboard/reports/attribution"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--muted)",
              fontSize: ".8rem",
              textDecoration: "none",
              marginBottom: 8,
            }}
          >
            <ArrowLeft size={14} /> Reports
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-.02em",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <Calendar size={22} />
            Weekly Digest
          </h1>
          <p className="muted" style={{ fontSize: ".85rem", marginTop: 4 }}>
            Performance summary for exec reporting
          </p>
        </div>

        <div style={{ display: "flex", gap: ".5rem" }}>
          <button
            onClick={handleCopyText}
            className="btn-outline"
            style={{
              fontSize: ".8rem",
              padding: ".45rem .85rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy as Text"}
          </button>
          <button
            onClick={() => window.print()}
            className="btn-outline"
            style={{
              fontSize: ".8rem",
              padding: ".45rem .85rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Week Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
          padding: ".75rem",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--subtle)",
        }}
      >
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "4px 8px",
            cursor: "pointer",
            color: "var(--fg)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{ textAlign: "center", minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: ".95rem" }}>
            {fmtDate(digest.weekStart)} – {fmtDate(digest.weekEnd)}
          </div>
          <div className="muted" style={{ fontSize: ".75rem" }}>
            {digest.isCurrentWeek
              ? "Current week (in progress)"
              : `Week of ${fmtDateFull(digest.weekStart)}`}
          </div>
        </div>
        <button
          onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
          disabled={weekOffset >= 0}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "4px 8px",
            cursor: weekOffset >= 0 ? "not-allowed" : "pointer",
            color: weekOffset >= 0 ? "var(--border)" : "var(--fg)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: ".75rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Revenue Closed",
            value: fmt(m.revenue.value),
            delta: m.revenue.delta,
            icon: DollarSign,
            color: "#059669",
            iconBg: "#ecfdf5",
          },
          {
            label: "Deals Created",
            value: String(m.dealsCreated.value),
            delta: m.dealsCreated.delta,
            icon: Briefcase,
            color: "#6366f1",
            iconBg: "#eef2ff",
          },
          {
            label: "New Partners",
            value: String(m.newPartners.value),
            delta:
              m.newPartners.previous === 0
                ? m.newPartners.value > 0
                  ? 100
                  : 0
                : Math.round(
                    ((m.newPartners.value - m.newPartners.previous) /
                      m.newPartners.previous) *
                      100
                  ),
            icon: Users,
            color: "#0891b2",
            iconBg: "#ecfeff",
          },
          {
            label: "Touchpoints",
            value: String(m.touchpoints.value),
            delta: m.touchpoints.delta,
            icon: Activity,
            color: "#d97706",
            iconBg: "#fffbeb",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="card"
              style={{ padding: "1rem 1.1rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: ".5rem",
                }}
              >
                <p
                  className="muted"
                  style={{ fontSize: ".75rem", fontWeight: 500 }}
                >
                  {card.label}
                </p>
                <div
                  style={{
                    background: card.iconBg,
                    padding: 5,
                    borderRadius: 6,
                  }}
                >
                  <Icon size={14} color={card.color} />
                </div>
              </div>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-.02em",
                  marginBottom: ".35rem",
                }}
              >
                {card.value}
              </p>
              <DeltaBadge value={card.delta} />
            </div>
          );
        })}
      </div>

      {/* Win/Loss + Commissions Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: ".75rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          className="card"
          style={{ padding: "1rem 1.1rem", textAlign: "center" }}
        >
          <p className="muted" style={{ fontSize: ".72rem", marginBottom: 4 }}>
            Deals Won
          </p>
          <p
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#22c55e",
            }}
          >
            {m.dealsClosed.won}
          </p>
        </div>
        <div
          className="card"
          style={{ padding: "1rem 1.1rem", textAlign: "center" }}
        >
          <p className="muted" style={{ fontSize: ".72rem", marginBottom: 4 }}>
            Deals Lost
          </p>
          <p
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#ef4444",
            }}
          >
            {m.dealsClosed.lost}
          </p>
        </div>
        <div
          className="card"
          style={{ padding: "1rem 1.1rem", textAlign: "center" }}
        >
          <p className="muted" style={{ fontSize: ".72rem", marginBottom: 4 }}>
            Win Rate
          </p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            {m.dealsClosed.winRate !== null ? `${m.dealsClosed.winRate}%` : "—"}
          </p>
          {m.dealsClosed.prevWinRate !== null &&
            m.dealsClosed.winRate !== null && (
              <span
                className="muted"
                style={{ fontSize: ".68rem" }}
              >
                prev: {m.dealsClosed.prevWinRate}%
              </span>
            )}
        </div>
      </div>

      {/* Pipeline + Commissions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: ".75rem",
          marginBottom: "1.5rem",
        }}
      >
        <div className="card" style={{ padding: "1rem 1.1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <Target size={15} color="#6366f1" />
            <p
              className="muted"
              style={{ fontSize: ".75rem", fontWeight: 500 }}
            >
              New Pipeline Added
            </p>
          </div>
          <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            {fmt(m.pipeline)}
          </p>
          <p className="muted" style={{ fontSize: ".72rem", marginTop: 4 }}>
            {fmt(digest.totals.openPipeline)} total open
          </p>
        </div>
        <div className="card" style={{ padding: "1rem 1.1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <Zap size={15} color="#d97706" />
            <p
              className="muted"
              style={{ fontSize: ".75rem", fontWeight: 500 }}
            >
              Commissions Generated
            </p>
          </div>
          <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            {fmt(m.commissions)}
          </p>
          <p className="muted" style={{ fontSize: ".72rem", marginTop: 4 }}>
            {m.auditEntries} audit entries this week
          </p>
        </div>
      </div>

      {/* Top Partner of the Week */}
      {digest.topPartner && (
        <div
          className="card"
          style={{
            padding: "1.25rem",
            marginBottom: "1.5rem",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Trophy size={22} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p className="muted" style={{ fontSize: ".72rem", fontWeight: 600 }}>
                TOP PARTNER OF THE WEEK
              </p>
              <p style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                {digest.topPartner.name}
              </p>
              <p className="muted" style={{ fontSize: ".8rem" }}>
                {fmt(digest.topPartner.revenue)} revenue closed ·{" "}
                {digest.topPartner.tier} {digest.topPartner.type}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notable Deals */}
      {digest.highlights.length > 0 && (
        <div
          className="card"
          style={{ padding: "1.25rem", marginBottom: "1.5rem" }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: ".95rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <Briefcase size={16} color="#6366f1" />
            Notable Deals Closed
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}
          >
            {digest.highlights.map((deal: { id: string; name: string; amount: number; product: string | null }, i: number) => (
              <Link
                key={deal.id}
                href={`/dashboard/deals/${deal.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #f59e0b, #d97706)"
                          : "var(--subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: ".7rem",
                      fontWeight: 700,
                      color: i === 0 ? "#fff" : "var(--muted)",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: ".85rem" }}>
                      {deal.name}
                    </p>
                    {deal.product && (
                      <span
                        className="muted"
                        style={{ fontSize: ".72rem" }}
                      >
                        {deal.product}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                  {fmt(deal.amount)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* At-Risk Partners */}
      {digest.atRiskPartners.length > 0 && (
        <div
          className="card"
          style={{
            padding: "1.25rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: ".95rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              color: "#ef4444",
            }}
          >
            <AlertTriangle size={16} />
            At-Risk Partners
            <span
              className="muted"
              style={{ fontWeight: 400, fontSize: ".75rem" }}
            >
              60+ days without activity
            </span>
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}
          >
            {digest.atRiskPartners.map((p: { id: string; name: string; type: string; tier: string }) => (
              <Link
                key={p.id}
                href={`/dashboard/partners/${p.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    className="avatar"
                    style={{
                      width: 28,
                      height: 28,
                      fontSize: ".6rem",
                    }}
                  >
                    {p.name
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: ".85rem" }}>
                    {p.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: ".7rem",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: "rgba(239,68,68,0.08)",
                    color: "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {p.tier} {p.type}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Program Context Footer */}
      <div
        className="card"
        style={{
          padding: "1rem 1.25rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center",
        }}
      >
        <div>
          <p className="muted" style={{ fontSize: ".7rem" }}>
            Active Partners
          </p>
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {digest.totals.partners}
          </p>
        </div>
        <div
          style={{
            width: 1,
            background: "var(--border)",
            alignSelf: "stretch",
          }}
        />
        <div>
          <p className="muted" style={{ fontSize: ".7rem" }}>
            All-Time Revenue
          </p>
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {fmt(digest.totals.totalRevenue)}
          </p>
        </div>
        <div
          style={{
            width: 1,
            background: "var(--border)",
            alignSelf: "stretch",
          }}
        />
        <div>
          <p className="muted" style={{ fontSize: ".7rem" }}>
            Open Pipeline
          </p>
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {fmt(digest.totals.openPipeline)}
          </p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .dash-sidebar,
          .dash-sidebar-overlay,
          .dash-topbar,
          .breadcrumb-nav {
            display: none !important;
          }
          .dash-main {
            margin-left: 0 !important;
            padding: 1rem !important;
          }
          .btn-outline {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
