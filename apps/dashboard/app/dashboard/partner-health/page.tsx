"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  Users,
  Activity,
  MessageSquare,
  Loader2,
} from "lucide-react";

/* ── Types ── */
type RiskLevel = "healthy" | "at-risk" | "churning" | "new";
type SortKey = "health" | "name" | "revenue" | "lastActive" | "deals";

interface PartnerHealthData {
  id: string;
  name: string;
  tier: string;
  healthScore: number;
  risk: RiskLevel;
  daysSinceActive: number;
  dealsLast90: number;
  dealsTrend: number;
  revenueLast90: number;
  revenueTrend: number;
  touchpointsLast90: number;
  unpaidCommissions: number;
  contactName: string;
  contactEmail: string;
  joinedDate: string;
  signals: string[];
  actions: string[];
}

/* ── Helpers ── */
function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function healthColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function riskBadge(risk: RiskLevel): { bg: string; color: string; label: string } {
  switch (risk) {
    case "healthy": return { bg: "#22c55e18", color: "#22c55e", label: "Healthy" };
    case "at-risk": return { bg: "#f59e0b18", color: "#f59e0b", label: "At Risk" };
    case "churning": return { bg: "#ef444418", color: "#ef4444", label: "Churn Risk" };
    case "new": return { bg: "#3b82f618", color: "#3b82f6", label: "New" };
  }
}

function tierColor(tier: string): string {
  const m: Record<string, string> = { platinum: "#6366f1", gold: "#f59e0b", silver: "#94a3b8", bronze: "#cd7f32" };
  return m[tier] || "#6b7280";
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 28, width: 260, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: 420 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: "1.25rem" }}>
            <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 28, width: "40%" }} />
          </div>
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="card" style={{ padding: "16px 20px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 18, width: 160, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 14, width: 280 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Empty State ── */
function EmptyState() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          <HeartPulse size={22} style={{ marginRight: 8, verticalAlign: "middle", color: "#6366f1" }} />
          Partner Health Scores
        </h1>
        <p style={{ color: "var(--muted)", fontSize: ".85rem", margin: "4px 0 0" }}>
          Individual partner health monitoring — engagement, revenue, risk signals & recommended actions
        </p>
      </div>
      <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
        <HeartPulse size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px" }}>No active partners yet</h2>
        <p style={{ color: "var(--muted)", fontSize: ".85rem", maxWidth: 400, margin: "0 auto 16px" }}>
          Add partners and register deals to start seeing health scores, risk signals, and recommended actions.
        </p>
        <Link href="/dashboard/partners" className="btn" style={{ fontSize: ".85rem", padding: ".5rem 1.25rem" }}>
          Go to Partners →
        </Link>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function PartnerHealthPage() {
  const healthData = useQuery(api.partnerHealth.getPartnerHealth);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("health");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const partners: PartnerHealthData[] = (healthData ?? []) as unknown as PartnerHealthData[];

  const filtered = useMemo(() => {
    let list = partners.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (riskFilter !== "all" && p.risk !== riskFilter) return false;
      return true;
    });

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "health": cmp = a.healthScore - b.healthScore; break;
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "revenue": cmp = a.revenueLast90 - b.revenueLast90; break;
        case "lastActive": cmp = a.daysSinceActive - b.daysSinceActive; break;
        case "deals": cmp = a.dealsLast90 - b.dealsLast90; break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [partners, search, riskFilter, sortKey, sortAsc]);

  if (healthData === undefined) return <LoadingSkeleton />;
  if (partners.length === 0) return <EmptyState />;

  const healthyCount = partners.filter((p) => p.risk === "healthy").length;
  const atRiskCount = partners.filter((p) => p.risk === "at-risk").length;
  const churningCount = partners.filter((p) => p.risk === "churning").length;
  const newCount = partners.filter((p) => p.risk === "new").length;
  const avgHealth = Math.round(partners.reduce((s, p) => s + p.healthScore, 0) / partners.length);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          <HeartPulse size={22} style={{ marginRight: 8, verticalAlign: "middle", color: "#6366f1" }} />
          Partner Health Scores
        </h1>
        <p style={{ color: "var(--muted)", fontSize: ".85rem", margin: "4px 0 0" }}>
          Individual partner health monitoring — engagement, revenue, risk signals & recommended actions
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Avg Health Score", value: `${avgHealth}`, icon: <Activity size={18} />, color: healthColor(avgHealth) },
          { label: "Healthy", value: `${healthyCount}`, icon: <CheckCircle2 size={18} />, color: "#22c55e", sub: "partners" },
          { label: "At Risk", value: `${atRiskCount}`, icon: <AlertTriangle size={18} />, color: "#f59e0b", sub: "need attention" },
          { label: "Churn Risk", value: `${churningCount}`, icon: <AlertTriangle size={18} />, color: "#ef4444", sub: "urgent" },
        ].map((card, i) => (
          <div key={i} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".03em" }}>{card.label}</span>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: card.color }}>{card.value}</div>
            {card.sub && <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 2 }}>{card.sub}</div>}
          </div>
        ))}
      </div>

      {/* ── Urgent Alert ── */}
      {churningCount > 0 && (
        <div style={{ padding: 14, borderRadius: 10, background: "#ef444410", border: "1px solid #ef444430", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={18} color="#ef4444" />
          <span style={{ fontSize: ".82rem" }}>
            <strong style={{ color: "#ef4444" }}>{churningCount} partner{churningCount > 1 ? "s" : ""} at churn risk</strong> — immediate action recommended. Sort by health score to prioritize.
          </span>
        </div>
      )}

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 300 }}>
          <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners..."
            style={{
              width: "100%", padding: "8px 12px 8px 32px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--bg)",
              fontSize: ".82rem", fontFamily: "inherit", color: "var(--fg)",
            }}
          />
        </div>
        {(["all", "healthy", "at-risk", "churning", "new"] as (RiskLevel | "all")[]).map((f) => {
          const count = f === "all" ? partners.length : partners.filter((p) => p.risk === f).length;
          return (
            <button
              key={f}
              onClick={() => setRiskFilter(f)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
                border: riskFilter === f ? "2px solid #6366f1" : "1px solid var(--border)",
                background: riskFilter === f ? "#6366f120" : "var(--bg)",
                color: riskFilter === f ? "#6366f1" : "var(--muted)",
                cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
              }}
            >
              {f === "at-risk" ? "At Risk" : f} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Sort Controls ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, fontSize: ".72rem", color: "var(--muted)" }}>
        <span style={{ fontWeight: 600 }}>Sort:</span>
        {([
          { key: "health" as SortKey, label: "Health Score" },
          { key: "revenue" as SortKey, label: "Revenue" },
          { key: "deals" as SortKey, label: "Deals" },
          { key: "lastActive" as SortKey, label: "Last Active" },
          { key: "name" as SortKey, label: "Name" },
        ]).map((s) => (
          <button
            key={s.key}
            onClick={() => toggleSort(s.key)}
            style={{
              padding: "3px 8px", borderRadius: 6, fontSize: ".72rem",
              border: sortKey === s.key ? "1px solid #6366f1" : "1px solid var(--border)",
              background: sortKey === s.key ? "#6366f110" : "transparent",
              color: sortKey === s.key ? "#6366f1" : "var(--muted)",
              cursor: "pointer", fontFamily: "inherit", fontWeight: sortKey === s.key ? 700 : 500,
            }}
          >
            {s.label} {sortKey === s.key && (sortAsc ? "↑" : "↓")}
          </button>
        ))}
      </div>

      {/* ── Partner Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((p) => {
          const rb = riskBadge(p.risk);
          const isExpanded = expandedId === p.id;
          return (
            <div key={p.id} style={{ borderRadius: 12, border: p.risk === "churning" ? "1px solid #ef444440" : "1px solid var(--border)", background: "var(--bg)", overflow: "hidden" }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                  padding: "16px 20px", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", color: "var(--fg)", textAlign: "left", gap: 16,
                }}
              >
                {/* Health ring */}
                <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                  <svg width={48} height={48} viewBox="0 0 48 48">
                    <circle cx={24} cy={24} r={20} fill="none" stroke="var(--border)" strokeWidth={4} />
                    <circle
                      cx={24} cy={24} r={20} fill="none"
                      stroke={healthColor(p.healthScore)} strokeWidth={4}
                      strokeDasharray={`${(p.healthScore / 100) * 125.6} 125.6`}
                      strokeLinecap="round"
                      transform="rotate(-90 24 24)"
                    />
                  </svg>
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", fontWeight: 800, color: healthColor(p.healthScore) }}>
                    {p.healthScore}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <Link
                      href={`/dashboard/partners/${p.id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--fg)", textDecoration: "none" }}
                    >
                      {p.name}
                    </Link>
                    <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: ".65rem", fontWeight: 700, background: rb.bg, color: rb.color }}>{rb.label}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: ".65rem", fontWeight: 600, color: tierColor(p.tier), background: `${tierColor(p.tier)}15`, textTransform: "capitalize" }}>{p.tier}</span>
                  </div>
                  <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: 3 }}>
                    {p.dealsLast90} deals · {fmt(p.revenueLast90)} revenue (90d) · Active {p.daysSinceActive === 0 ? "today" : `${p.daysSinceActive}d ago`}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  {p.revenueTrend !== 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: ".78rem", fontWeight: 700, color: p.revenueTrend > 0 ? "#22c55e" : "#ef4444" }}>
                      {p.revenueTrend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {p.revenueTrend > 0 ? "+" : ""}{p.revenueTrend}%
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border)" }}>
                  {/* Metrics grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, padding: "16px 0" }}>
                    {[
                      { label: "Deals (90d)", value: p.dealsLast90.toString(), trend: p.dealsTrend },
                      { label: "Revenue (90d)", value: fmt(p.revenueLast90), trend: p.revenueTrend },
                      { label: "Touchpoints (90d)", value: p.touchpointsLast90.toString(), trend: null },
                      { label: "Unpaid Commissions", value: p.unpaidCommissions.toString(), trend: null },
                      { label: "Days Since Active", value: p.daysSinceActive.toString(), trend: null },
                    ].map((m, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: ".62rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", marginBottom: 2 }}>{m.label}</div>
                        <div style={{ fontSize: "1rem", fontWeight: 800 }}>{m.value}</div>
                        {m.trend !== null && m.trend !== 0 && (
                          <div style={{ fontSize: ".65rem", fontWeight: 600, color: m.trend > 0 ? "#22c55e" : "#ef4444" }}>
                            {m.trend > 0 ? "+" : ""}{m.trend} vs prior 90d
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Signals + Actions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                    <div style={{ padding: 14, borderRadius: 10, background: "var(--subtle)" }}>
                      <h4 style={{ fontSize: ".75rem", fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", color: "var(--muted)" }}>
                        <Zap size={12} style={{ marginRight: 4, verticalAlign: "middle" }} /> Signals
                      </h4>
                      {p.signals.length > 0 ? p.signals.map((s, i) => (
                        <div key={i} style={{ fontSize: ".78rem", padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ color: p.risk === "churning" ? "#ef4444" : p.risk === "at-risk" ? "#f59e0b" : "#22c55e", marginTop: 2 }}>•</span>
                          {s}
                        </div>
                      )) : (
                        <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>No notable signals</div>
                      )}
                    </div>
                    <div style={{ padding: 14, borderRadius: 10, background: p.risk === "churning" ? "#ef444408" : "var(--subtle)" }}>
                      <h4 style={{ fontSize: ".75rem", fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", color: "var(--muted)" }}>
                        <MessageSquare size={12} style={{ marginRight: 4, verticalAlign: "middle" }} /> Recommended Actions
                      </h4>
                      {p.actions.map((a, i) => (
                        <div key={i} style={{ fontSize: ".78rem", padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ color: "#6366f1", marginTop: 2 }}>→</span>
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: ".78rem", color: "var(--muted)" }}>
                    {p.contactName && (
                      <span><Users size={12} style={{ marginRight: 4, verticalAlign: "middle" }} /> {p.contactName}</span>
                    )}
                    <a href={`mailto:${p.contactEmail}`} style={{ color: "#6366f1" }}>
                      <Mail size={12} style={{ marginRight: 4, verticalAlign: "middle" }} /> {p.contactEmail}
                    </a>
                    <span>Joined {p.joinedDate}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          No partners match your filters.
        </div>
      )}
    </div>
  );
}
