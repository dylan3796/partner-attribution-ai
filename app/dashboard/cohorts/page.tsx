"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, BarChart3, DollarSign, TrendingUp, Loader2 } from "lucide-react";

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function fmtMonth(key: string) {
  const [y, m] = key.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function CohortsPage() {
  const cohorts = useQuery(api.cohorts.getCohorts);

  if (!cohorts) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const totalPartners = cohorts.reduce((s, c) => s + c.partnerCount, 0);
  const totalRevenue = cohorts.reduce((s, c) => s + c.totalRevenue, 0);
  const avgRetention = cohorts.length > 0 ? Math.round(cohorts.reduce((s, c) => s + c.retentionRate, 0) / cohorts.length) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={28} style={{ color: "#6366f1" }} />
          Partner Cohorts
        </h1>
        <p className="muted" style={{ marginTop: ".25rem" }}>Partners grouped by join month — track cohort performance and retention</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Partners", value: String(totalPartners), icon: <Users size={18} />, color: "#6366f1" },
          { label: "Total Cohorts", value: String(cohorts.length), icon: <BarChart3 size={18} />, color: "#3b82f6" },
          { label: "Total Revenue", value: fmt(totalRevenue), icon: <DollarSign size={18} />, color: "#22c55e" },
          { label: "Avg Retention", value: `${avgRetention}%`, icon: <TrendingUp size={18} />, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Cohort Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Cohort", "Partners", "Revenue", "Avg Commission", "Deals Won", "Active (90d)", "Retention"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c) => {
                const retColor = c.retentionRate >= 75 ? "#22c55e" : c.retentionRate >= 50 ? "#f59e0b" : c.retentionRate > 0 ? "#ef4444" : "var(--muted)";
                return (
                  <tr key={c.month} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{fmtMonth(c.month)}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontWeight: 700 }}>{c.partnerCount}</span>
                      <span className="muted" style={{ fontSize: ".75rem", marginLeft: 6 }}>
                        {c.partnerNames.slice(0, 3).join(", ")}{c.partnerNames.length > 3 ? ` +${c.partnerNames.length - 3}` : ""}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{c.totalRevenue > 0 ? fmt(c.totalRevenue) : "—"}</td>
                    <td style={{ padding: "12px 14px" }}>{c.avgCommissionRate}%</td>
                    <td style={{ padding: "12px 14px" }}>{c.dealsWon}</td>
                    <td style={{ padding: "12px 14px" }}>{c.activeCount} / {c.partnerCount}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 50, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${c.retentionRate}%`, height: "100%", background: retColor, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: ".8rem", fontWeight: 700, color: retColor }}>{c.retentionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {cohorts.length === 0 && (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <Users size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>No cohort data yet</h3>
            <p className="muted" style={{ fontSize: ".85rem" }}>Add partners to see them grouped by join month.</p>
          </div>
        )}
      </div>
    </div>
  );
}
