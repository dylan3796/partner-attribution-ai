"use client";

import { useState, useMemo } from "react";
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ArrowUpDown,
  Zap,
  Shield,
  Users,
  DollarSign,
  Activity,
  MessageSquare,
} from "lucide-react";

/* ── Types ── */
type RiskLevel = "healthy" | "at-risk" | "churning" | "new";
type SortKey = "health" | "name" | "revenue" | "lastActive" | "deals";

interface PartnerHealth {
  id: string;
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  healthScore: number; // 0-100
  risk: RiskLevel;
  lastActive: string;
  daysSinceActive: number;
  dealsLast90: number;
  dealsTrend: number; // positive = up, negative = down
  revenueLast90: number;
  revenueTrend: number;
  portalLogins30d: number;
  supportTicketsOpen: number;
  certificationsCurrent: number;
  certificationsExpiring: number;
  npsScore: number | null;
  contactName: string;
  contactEmail: string;
  joinedDate: string;
  signals: string[];
  actions: string[];
}

/* ── Demo Data ── */
const PARTNERS: PartnerHealth[] = [
  {
    id: "ph1", name: "CloudFirst Solutions", tier: "platinum", healthScore: 92, risk: "healthy",
    lastActive: "2026-02-19", daysSinceActive: 0, dealsLast90: 14, dealsTrend: 3,
    revenueLast90: 186000, revenueTrend: 22, portalLogins30d: 45, supportTicketsOpen: 0,
    certificationsCurrent: 4, certificationsExpiring: 0, npsScore: 9,
    contactName: "Sarah Chen", contactEmail: "sarah@cloudfirst.io", joinedDate: "2024-06-15",
    signals: ["Highest deal velocity this quarter", "All certs current", "Regular portal engagement"],
    actions: ["Consider for case study", "Invite to advisory board"],
  },
  {
    id: "ph2", name: "DataBridge Corp", tier: "gold", healthScore: 78, risk: "healthy",
    lastActive: "2026-02-18", daysSinceActive: 1, dealsLast90: 8, dealsTrend: 1,
    revenueLast90: 94000, revenueTrend: 12, portalLogins30d: 22, supportTicketsOpen: 1,
    certificationsCurrent: 3, certificationsExpiring: 1, npsScore: 8,
    contactName: "Marcus Johnson", contactEmail: "marcus@databridge.co", joinedDate: "2024-09-01",
    signals: ["Certification expiring in 30 days", "Steady deal flow"],
    actions: ["Send certification renewal reminder", "Review for tier upgrade"],
  },
  {
    id: "ph3", name: "TechNova Partners", tier: "gold", healthScore: 61, risk: "at-risk",
    lastActive: "2026-02-10", daysSinceActive: 9, dealsLast90: 4, dealsTrend: -3,
    revenueLast90: 52000, revenueTrend: -18, portalLogins30d: 6, supportTicketsOpen: 2,
    certificationsCurrent: 2, certificationsExpiring: 1, npsScore: 6,
    contactName: "Priya Sharma", contactEmail: "priya@technova.dev", joinedDate: "2025-01-20",
    signals: ["Deal velocity declining", "Revenue down 18% QoQ", "2 open support tickets", "Portal engagement dropping"],
    actions: ["Schedule partner health check call", "Offer enablement resources", "Resolve support tickets ASAP"],
  },
  {
    id: "ph4", name: "Apex Digital", tier: "silver", healthScore: 45, risk: "at-risk",
    lastActive: "2026-02-03", daysSinceActive: 16, dealsLast90: 2, dealsTrend: -4,
    revenueLast90: 18000, revenueTrend: -35, portalLogins30d: 2, supportTicketsOpen: 3,
    certificationsCurrent: 1, certificationsExpiring: 1, npsScore: 5,
    contactName: "Derek Kim", contactEmail: "derek@apexdigital.com", joinedDate: "2025-03-10",
    signals: ["16 days inactive", "Revenue dropped 35%", "Low portal engagement", "Multiple support issues"],
    actions: ["Urgent: schedule re-engagement call", "Assign dedicated support rep", "Review deal pipeline with partner"],
  },
  {
    id: "ph5", name: "NorthStar IT", tier: "silver", healthScore: 34, risk: "churning",
    lastActive: "2026-01-22", daysSinceActive: 28, dealsLast90: 1, dealsTrend: -5,
    revenueLast90: 8400, revenueTrend: -52, portalLogins30d: 0, supportTicketsOpen: 0,
    certificationsCurrent: 0, certificationsExpiring: 0, npsScore: 3,
    contactName: "Emily Wright", contactEmail: "emily@northstarit.com", joinedDate: "2025-05-01",
    signals: ["28 days inactive — churn risk HIGH", "Zero portal logins in 30 days", "All certifications lapsed", "NPS score critical (3)"],
    actions: ["ESCALATE: Partner at high churn risk", "Executive outreach recommended", "Offer incentive/SPIFF to re-engage", "Review if territory reassignment needed"],
  },
  {
    id: "ph6", name: "Summit Cloud Group", tier: "gold", healthScore: 85, risk: "healthy",
    lastActive: "2026-02-18", daysSinceActive: 1, dealsLast90: 11, dealsTrend: 4,
    revenueLast90: 142000, revenueTrend: 28, portalLogins30d: 38, supportTicketsOpen: 0,
    certificationsCurrent: 3, certificationsExpiring: 0, npsScore: 9,
    contactName: "Jason Lee", contactEmail: "jason@summitcloud.io", joinedDate: "2024-11-15",
    signals: ["Strong upward trajectory", "High portal engagement", "Revenue up 28%"],
    actions: ["Fast-track for Platinum review", "Co-marketing opportunity"],
  },
  {
    id: "ph7", name: "Vanguard Systems", tier: "bronze", healthScore: 68, risk: "new",
    lastActive: "2026-02-17", daysSinceActive: 2, dealsLast90: 3, dealsTrend: 3,
    revenueLast90: 22000, revenueTrend: 0, portalLogins30d: 18, supportTicketsOpen: 1,
    certificationsCurrent: 1, certificationsExpiring: 0, npsScore: null,
    contactName: "Lisa Park", contactEmail: "lisa@vanguardsys.com", joinedDate: "2025-12-01",
    signals: ["New partner — onboarding phase", "Good initial engagement", "First 3 deals closed"],
    actions: ["Schedule 30-day check-in", "Recommend next certification path", "Send NPS survey"],
  },
  {
    id: "ph8", name: "Pinnacle Tech", tier: "silver", healthScore: 55, risk: "at-risk",
    lastActive: "2026-02-12", daysSinceActive: 7, dealsLast90: 3, dealsTrend: -2,
    revenueLast90: 31000, revenueTrend: -15, portalLogins30d: 8, supportTicketsOpen: 1,
    certificationsCurrent: 2, certificationsExpiring: 2, npsScore: 6,
    contactName: "Ryan Torres", contactEmail: "ryan@pinnacletech.co", joinedDate: "2025-07-20",
    signals: ["2 certifications expiring soon", "Deal velocity slowing", "Below tier average revenue"],
    actions: ["Send certification renewal bundle", "Offer training session", "Review commission structure competitiveness"],
  },
];

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

/* ── Component ── */
export default function PartnerHealthPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("health");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = PARTNERS.filter((p) => {
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
  }, [search, riskFilter, sortKey, sortAsc]);

  const healthyCount = PARTNERS.filter((p) => p.risk === "healthy").length;
  const atRiskCount = PARTNERS.filter((p) => p.risk === "at-risk").length;
  const churningCount = PARTNERS.filter((p) => p.risk === "churning").length;
  const avgHealth = Math.round(PARTNERS.reduce((s, p) => s + p.healthScore, 0) / PARTNERS.length);

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
          <div key={i} style={{ padding: 18, borderRadius: 12, border: "1px solid var(--border)", background: "var(--subtle)" }}>
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
          const count = f === "all" ? PARTNERS.length : PARTNERS.filter((p) => p.risk === f).length;
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
                    <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{p.name}</span>
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, padding: "16px 0" }}>
                    {[
                      { label: "Deals (90d)", value: p.dealsLast90.toString(), trend: p.dealsTrend },
                      { label: "Revenue (90d)", value: fmt(p.revenueLast90), trend: p.revenueTrend },
                      { label: "Portal Logins", value: p.portalLogins30d.toString(), trend: null },
                      { label: "Open Tickets", value: p.supportTicketsOpen.toString(), trend: null },
                      { label: "Certifications", value: `${p.certificationsCurrent}${p.certificationsExpiring > 0 ? ` (${p.certificationsExpiring} expiring)` : ""}`, trend: null },
                      { label: "NPS", value: p.npsScore !== null ? p.npsScore.toString() : "—", trend: null },
                    ].map((m, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: ".62rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", marginBottom: 2 }}>{m.label}</div>
                        <div style={{ fontSize: "1rem", fontWeight: 800 }}>{m.value}</div>
                        {m.trend !== null && m.trend !== 0 && (
                          <div style={{ fontSize: ".65rem", fontWeight: 600, color: m.trend > 0 ? "#22c55e" : "#ef4444" }}>
                            {m.trend > 0 ? "+" : ""}{m.trend} QoQ
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
                      {p.signals.map((s, i) => (
                        <div key={i} style={{ fontSize: ".78rem", padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ color: p.risk === "churning" ? "#ef4444" : p.risk === "at-risk" ? "#f59e0b" : "#22c55e", marginTop: 2 }}>•</span>
                          {s}
                        </div>
                      ))}
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
                    <span><Users size={12} style={{ marginRight: 4, verticalAlign: "middle" }} /> {p.contactName}</span>
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
