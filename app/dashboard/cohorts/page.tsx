"use client";

import { useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  DollarSign,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  BarChart3,
} from "lucide-react";

/* ── Types ── */
type MetricView = "retention" | "revenue" | "deals";

interface Cohort {
  id: string;
  label: string;
  month: string;
  partnersJoined: number;
  activeNow: number;
  retentionRate: number;
  avgTimeToFirstDeal: number; // days
  totalDeals: number;
  totalRevenue: number;
  avgRevenuePerPartner: number;
  monthlyRetention: number[]; // retention % for months 1-6
  monthlyRevenue: number[]; // cumulative revenue at months 1-6
}

/* ── Demo Data ── */
const COHORTS: Cohort[] = [
  {
    id: "c1", label: "Aug 2025", month: "2025-08", partnersJoined: 12, activeNow: 9,
    retentionRate: 75, avgTimeToFirstDeal: 18, totalDeals: 34, totalRevenue: 182000,
    avgRevenuePerPartner: 15167,
    monthlyRetention: [100, 92, 83, 83, 75, 75],
    monthlyRevenue: [8400, 28000, 56000, 98000, 142000, 182000],
  },
  {
    id: "c2", label: "Sep 2025", month: "2025-09", partnersJoined: 18, activeNow: 14,
    retentionRate: 78, avgTimeToFirstDeal: 15, totalDeals: 47, totalRevenue: 234000,
    avgRevenuePerPartner: 13000,
    monthlyRetention: [100, 94, 89, 83, 78, 78],
    monthlyRevenue: [12600, 42000, 89000, 148000, 198000, 234000],
  },
  {
    id: "c3", label: "Oct 2025", month: "2025-10", partnersJoined: 15, activeNow: 12,
    retentionRate: 80, avgTimeToFirstDeal: 12, totalDeals: 41, totalRevenue: 196000,
    avgRevenuePerPartner: 13067,
    monthlyRetention: [100, 93, 87, 87, 80, -1],
    monthlyRevenue: [14200, 48000, 95000, 152000, 196000, -1],
  },
  {
    id: "c4", label: "Nov 2025", month: "2025-11", partnersJoined: 22, activeNow: 19,
    retentionRate: 86, avgTimeToFirstDeal: 10, totalDeals: 52, totalRevenue: 178000,
    avgRevenuePerPartner: 8091,
    monthlyRetention: [100, 95, 91, 86, -1, -1],
    monthlyRevenue: [18500, 58000, 112000, 178000, -1, -1],
  },
  {
    id: "c5", label: "Dec 2025", month: "2025-12", partnersJoined: 8, activeNow: 7,
    retentionRate: 88, avgTimeToFirstDeal: 14, totalDeals: 18, totalRevenue: 72000,
    avgRevenuePerPartner: 9000,
    monthlyRetention: [100, 88, 88, -1, -1, -1],
    monthlyRevenue: [6800, 32000, 72000, -1, -1, -1],
  },
  {
    id: "c6", label: "Jan 2026", month: "2026-01", partnersJoined: 25, activeNow: 24,
    retentionRate: 96, avgTimeToFirstDeal: 8, totalDeals: 38, totalRevenue: 94000,
    avgRevenuePerPartner: 3760,
    monthlyRetention: [100, 96, -1, -1, -1, -1],
    monthlyRevenue: [22000, 94000, -1, -1, -1, -1],
  },
  {
    id: "c7", label: "Feb 2026", month: "2026-02", partnersJoined: 20, activeNow: 20,
    retentionRate: 100, avgTimeToFirstDeal: 6, totalDeals: 15, totalRevenue: 28000,
    avgRevenuePerPartner: 1400,
    monthlyRetention: [100, -1, -1, -1, -1, -1],
    monthlyRevenue: [28000, -1, -1, -1, -1, -1],
  },
];

/* ── Helpers ── */
function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function heatColor(pct: number): string {
  if (pct >= 90) return "#22c55e";
  if (pct >= 75) return "#84cc16";
  if (pct >= 60) return "#eab308";
  if (pct >= 40) return "#f97316";
  return "#ef4444";
}

function heatBg(pct: number): string {
  if (pct >= 90) return "#22c55e18";
  if (pct >= 75) return "#84cc1618";
  if (pct >= 60) return "#eab30818";
  if (pct >= 40) return "#f9731618";
  return "#ef444418";
}

/* ── Component ── */
export default function CohortsPage() {
  const [metricView, setMetricView] = useState<MetricView>("retention");
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);

  const totalPartners = COHORTS.reduce((s, c) => s + c.partnersJoined, 0);
  const totalActive = COHORTS.reduce((s, c) => s + c.activeNow, 0);
  const overallRetention = Math.round((totalActive / totalPartners) * 100);
  const avgFirstDeal = Math.round(COHORTS.reduce((s, c) => s + c.avgTimeToFirstDeal, 0) / COHORTS.length);
  const totalRevenue = COHORTS.reduce((s, c) => s + c.totalRevenue, 0);

  // Trend: first-deal time is decreasing
  const recentAvg = Math.round((COHORTS[5].avgTimeToFirstDeal + COHORTS[6].avgTimeToFirstDeal) / 2);
  const olderAvg = Math.round((COHORTS[0].avgTimeToFirstDeal + COHORTS[1].avgTimeToFirstDeal) / 2);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          <Users size={22} style={{ marginRight: 8, verticalAlign: "middle", color: "#6366f1" }} />
          Partner Cohort Analytics
        </h1>
        <p style={{ color: "var(--muted)", fontSize: ".85rem", margin: "4px 0 0" }}>
          Track partner retention, revenue, and activation by signup cohort
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Partners", value: totalPartners.toString(), icon: <Users size={18} />, color: "#6366f1", sub: `${COHORTS.length} cohorts` },
          { label: "Overall Retention", value: `${overallRetention}%`, icon: <Target size={18} />, color: "#22c55e", sub: `${totalActive} currently active` },
          { label: "Avg Time to First Deal", value: `${avgFirstDeal}d`, icon: <Clock size={18} />, color: "#3b82f6", sub: `${recentAvg}d recent vs ${olderAvg}d older` },
          { label: "Total Cohort Revenue", value: fmt(totalRevenue), icon: <DollarSign size={18} />, color: "#f59e0b", sub: `${fmt(Math.round(totalRevenue / totalPartners))}/partner avg` },
        ].map((card, i) => (
          <div key={i} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".03em" }}>{card.label}</span>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 2 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Insight Banner ── */}
      <div style={{ padding: 14, borderRadius: 10, background: "#6366f110", border: "1px solid #6366f130", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <Zap size={18} color="#6366f1" />
        <span style={{ fontSize: ".82rem" }}>
          <strong style={{ color: "#6366f1" }}>Improving:</strong> Time-to-first-deal dropped from {olderAvg} days (Aug–Sep) to {recentAvg} days (Jan–Feb) — your onboarding improvements are working.
        </span>
      </div>

      {/* ── Metric Toggle ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {([
          { key: "retention", label: "Retention Heatmap" },
          { key: "revenue", label: "Revenue Curves" },
          { key: "deals", label: "Deal Velocity" },
        ] as { key: MetricView; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMetricView(tab.key)}
            style={{
              padding: "6px 16px", borderRadius: 8, fontSize: ".8rem", fontWeight: 600,
              border: metricView === tab.key ? "2px solid #6366f1" : "1px solid var(--border)",
              background: metricView === tab.key ? "#6366f120" : "var(--subtle)",
              color: metricView === tab.key ? "#6366f1" : "var(--muted)",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Retention Heatmap ── */}
      {metricView === "retention" && (
        <div className="card" style={{ overflowX: "auto", marginBottom: 24 }}>
          <h3 style={{ fontSize: ".9rem", fontWeight: 700, margin: "0 0 16px" }}>
            Monthly Retention by Cohort
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".78rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem", textTransform: "uppercase" }}>Cohort</th>
                <th style={{ textAlign: "center", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem" }}>Joined</th>
                {[0, 1, 2, 3, 4, 5].map((m) => (
                  <th key={m} style={{ textAlign: "center", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem" }}>
                    M{m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COHORTS.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 10px", fontWeight: 700 }}>{c.label}</td>
                  <td style={{ textAlign: "center", padding: "10px 10px", fontWeight: 600 }}>{c.partnersJoined}</td>
                  {c.monthlyRetention.map((pct, i) => (
                    <td key={i} style={{ textAlign: "center", padding: "6px 4px" }}>
                      {pct >= 0 ? (
                        <span style={{
                          display: "inline-block", padding: "4px 10px", borderRadius: 6,
                          fontWeight: 700, fontSize: ".75rem",
                          background: heatBg(pct), color: heatColor(pct),
                          minWidth: 44,
                        }}>
                          {pct}%
                        </span>
                      ) : (
                        <span style={{ color: "var(--muted)", opacity: 0.3 }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Revenue Curves ── */}
      {metricView === "revenue" && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: ".9rem", fontWeight: 700, margin: "0 0 16px" }}>
            Cumulative Revenue by Cohort (per month)
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".78rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem", textTransform: "uppercase" }}>Cohort</th>
                  {[1, 2, 3, 4, 5, 6].map((m) => (
                    <th key={m} style={{ textAlign: "center", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem" }}>
                      Month {m}
                    </th>
                  ))}
                  <th style={{ textAlign: "center", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem" }}>$/Partner</th>
                </tr>
              </thead>
              <tbody>
                {COHORTS.map((c) => (
                  <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 10px", fontWeight: 700 }}>{c.label}</td>
                    {c.monthlyRevenue.map((rev, i) => (
                      <td key={i} style={{ textAlign: "center", padding: "10px 6px" }}>
                        {rev >= 0 ? (
                          <span style={{ fontWeight: 600 }}>{fmt(rev)}</span>
                        ) : (
                          <span style={{ color: "var(--muted)", opacity: 0.3 }}>—</span>
                        )}
                      </td>
                    ))}
                    <td style={{ textAlign: "center", padding: "10px 6px", fontWeight: 700, color: "#6366f1" }}>
                      {fmt(c.avgRevenuePerPartner)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mini bar chart of revenue per partner */}
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: ".78rem", fontWeight: 700, marginBottom: 10, color: "var(--muted)" }}>Revenue per Partner by Cohort</h4>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
              {COHORTS.map((c) => {
                const maxRpp = Math.max(...COHORTS.map((x) => x.avgRevenuePerPartner));
                const h = (c.avgRevenuePerPartner / maxRpp) * 100;
                return (
                  <div key={c.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: ".65rem", fontWeight: 700, marginBottom: 3 }}>{fmt(c.avgRevenuePerPartner)}</span>
                    <div style={{ height: h, width: "100%", maxWidth: 44, background: "#6366f1", borderRadius: 6, opacity: 0.8 }} />
                    <span style={{ fontSize: ".6rem", color: "var(--muted)", marginTop: 4, fontWeight: 600 }}>{c.label.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Deal Velocity ── */}
      {metricView === "deals" && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: ".9rem", fontWeight: 700, margin: "0 0 16px" }}>
            Deal Velocity & Activation
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {COHORTS.map((c) => {
              const maxDeals = Math.max(...COHORTS.map((x) => x.totalDeals));
              const dealW = (c.totalDeals / maxDeals) * 100;
              const maxDays = Math.max(...COHORTS.map((x) => x.avgTimeToFirstDeal));
              const dayW = (c.avgTimeToFirstDeal / maxDays) * 100;
              return (
                <div
                  key={c.id}
                  style={{
                    padding: 14, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedCohort(selectedCohort === c.id ? null : c.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: ".85rem" }}>{c.label}</span>
                      <span style={{ fontSize: ".7rem", color: "var(--muted)" }}>{c.partnersJoined} partners</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: ".75rem" }}>
                        <Clock size={12} style={{ marginRight: 3, verticalAlign: "middle" }} />
                        <strong>{c.avgTimeToFirstDeal}d</strong> to first deal
                      </span>
                      <span style={{ fontSize: ".75rem" }}>
                        <BarChart3 size={12} style={{ marginRight: 3, verticalAlign: "middle" }} />
                        <strong>{c.totalDeals}</strong> deals
                      </span>
                      {selectedCohort === c.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>

                  {/* Deal bar */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: ".65rem", color: "var(--muted)", width: 56 }}>Deals</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--border)" }}>
                      <div style={{ height: 8, borderRadius: 4, background: "#6366f1", width: `${dealW}%`, transition: "width .3s" }} />
                    </div>
                  </div>

                  {/* Time-to-first-deal bar (inverted — shorter is better) */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                    <span style={{ fontSize: ".65rem", color: "var(--muted)", width: 56 }}>Speed</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--border)" }}>
                      <div style={{
                        height: 8, borderRadius: 4, width: `${100 - dayW + 10}%`, transition: "width .3s",
                        background: c.avgTimeToFirstDeal <= 10 ? "#22c55e" : c.avgTimeToFirstDeal <= 15 ? "#eab308" : "#f97316",
                      }} />
                    </div>
                  </div>

                  {selectedCohort === c.id && (
                    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "var(--subtle)", fontSize: ".78rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      <div>
                        <div style={{ color: "var(--muted)", fontSize: ".65rem", fontWeight: 600, textTransform: "uppercase" }}>Partners</div>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{c.partnersJoined}</div>
                        <div style={{ color: "var(--muted)", fontSize: ".65rem" }}>{c.activeNow} active</div>
                      </div>
                      <div>
                        <div style={{ color: "var(--muted)", fontSize: ".65rem", fontWeight: 600, textTransform: "uppercase" }}>Retention</div>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem", color: heatColor(c.retentionRate) }}>{c.retentionRate}%</div>
                      </div>
                      <div>
                        <div style={{ color: "var(--muted)", fontSize: ".65rem", fontWeight: 600, textTransform: "uppercase" }}>Total Revenue</div>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#6366f1" }}>{fmt(c.totalRevenue)}</div>
                      </div>
                      <div>
                        <div style={{ color: "var(--muted)", fontSize: ".65rem", fontWeight: 600, textTransform: "uppercase" }}>Deals/Partner</div>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{(c.totalDeals / c.partnersJoined).toFixed(1)}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Cohort Summary Table ── */}
      <div className="card">
        <h3 style={{ fontSize: ".9rem", fontWeight: 700, margin: "0 0 14px" }}>Cohort Summary</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".78rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                {["Cohort", "Joined", "Active", "Retention", "First Deal", "Total Deals", "Revenue", "$/Partner"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".03em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COHORTS.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px", fontWeight: 700 }}>{c.label}</td>
                  <td style={{ padding: "10px" }}>{c.partnersJoined}</td>
                  <td style={{ padding: "10px" }}>{c.activeNow}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 12, fontWeight: 700, fontSize: ".72rem", background: heatBg(c.retentionRate), color: heatColor(c.retentionRate) }}>
                      {c.retentionRate}%
                    </span>
                  </td>
                  <td style={{ padding: "10px", fontWeight: 600 }}>{c.avgTimeToFirstDeal}d</td>
                  <td style={{ padding: "10px", fontWeight: 600 }}>{c.totalDeals}</td>
                  <td style={{ padding: "10px", fontWeight: 700, color: "#6366f1" }}>{fmt(c.totalRevenue)}</td>
                  <td style={{ padding: "10px", fontWeight: 600 }}>{fmt(c.avgRevenuePerPartner)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
