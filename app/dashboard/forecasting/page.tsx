"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  TrendingUp, DollarSign, Calendar, Target, BarChart3, Loader2, Users, Briefcase,
} from "lucide-react";

type Scenario = "conservative" | "base" | "optimistic";
const SCENARIO_MULT: Record<Scenario, number> = { conservative: 0.7, base: 1.0, optimistic: 1.3 };
const SCENARIO_LABELS: Record<Scenario, string> = { conservative: "Conservative", base: "Base Case", optimistic: "Optimistic" };

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtMonth(key: string) {
  const [y, m] = key.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function ForecastingPage() {
  const data = useQuery(api.forecasting.getForecastData);
  const [scenario, setScenario] = useState<Scenario>("base");

  const forecast = useMemo(() => {
    if (!data) return null;
    const mult = SCENARIO_MULT[scenario];

    // Group pipeline by month
    const pipelineByMonth: Record<string, number> = {};
    const commissionByMonth: Record<string, number> = {};
    for (const d of data.pipeline) {
      const date = new Date(d.expectedClose);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      pipelineByMonth[key] = (pipelineByMonth[key] || 0) + d.value * mult;
      commissionByMonth[key] = (commissionByMonth[key] || 0) + d.value * d.commissionRate * mult;
    }

    // Get next 6 months
    const now = new Date();
    const futureMonths: string[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      futureMonths.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    // Historical months (sorted)
    const histMonths = Object.keys(data.monthlyRevenue).sort();

    // Total forecast
    const totalPipelineForecast = Object.values(pipelineByMonth).reduce((s, v) => s + v, 0);
    const totalCommissionForecast = Object.values(commissionByMonth).reduce((s, v) => s + v, 0);

    return {
      pipelineByMonth,
      commissionByMonth,
      futureMonths,
      histMonths,
      totalPipelineForecast,
      totalCommissionForecast,
    };
  }, [data, scenario]);

  if (!data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const f = forecast!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={28} style={{ color: "#6366f1" }} />
            Revenue Forecasting
          </h1>
          <p className="muted" style={{ marginTop: ".25rem" }}>Pipeline and commission projections derived from real deal data</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["conservative", "base", "optimistic"] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: ".8rem", fontWeight: 600,
                border: scenario === s ? "2px solid #6366f1" : "1px solid var(--border)",
                background: scenario === s ? "#6366f118" : "var(--bg)",
                color: scenario === s ? "#6366f1" : "var(--muted)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {SCENARIO_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Open Pipeline", value: fmt(data.totalOpenPipeline), icon: <Briefcase size={20} />, color: "#6366f1" },
          { label: "Forecast Revenue", value: fmt(f.totalPipelineForecast), icon: <DollarSign size={20} />, color: "#22c55e" },
          { label: "Forecast Commissions", value: fmt(f.totalCommissionForecast), icon: <Target size={20} />, color: "#3b82f6" },
          { label: "Active Partners", value: String(data.totalPartners), icon: <Users size={20} />, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Forecast Chart */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <BarChart3 size={16} style={{ color: "#6366f1" }} /> Pipeline Forecast by Month
        </h3>
        {f.futureMonths.length > 0 ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, paddingTop: 20 }}>
            {f.futureMonths.map((m) => {
              const val = f.pipelineByMonth[m] || 0;
              const maxVal = Math.max(...f.futureMonths.map((mm) => f.pipelineByMonth[mm] || 0), 1);
              const h = (val / maxVal) * 120;
              return (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: ".65rem", fontWeight: 700, marginBottom: 4 }}>{val > 0 ? fmt(val) : "—"}</span>
                  <div style={{ height: Math.max(h, 4), width: "100%", maxWidth: 50, background: "#6366f1", borderRadius: 6, opacity: 0.8 }} />
                  <span style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>{fmtMonth(m)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="muted" style={{ textAlign: "center", padding: "2rem" }}>No pipeline data for forecast</p>
        )}
      </div>

      {/* Commission Forecast */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <DollarSign size={16} style={{ color: "#22c55e" }} /> Commission Forecast by Month
        </h3>
        {f.futureMonths.length > 0 ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, paddingTop: 20 }}>
            {f.futureMonths.map((m) => {
              const val = f.commissionByMonth[m] || 0;
              const maxVal = Math.max(...f.futureMonths.map((mm) => f.commissionByMonth[mm] || 0), 1);
              const h = (val / maxVal) * 120;
              return (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: ".65rem", fontWeight: 700, marginBottom: 4 }}>{val > 0 ? fmt(val) : "—"}</span>
                  <div style={{ height: Math.max(h, 4), width: "100%", maxWidth: 50, background: "#22c55e", borderRadius: 6, opacity: 0.8 }} />
                  <span style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>{fmtMonth(m)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="muted" style={{ textAlign: "center", padding: "2rem" }}>No commission data for forecast</p>
        )}
      </div>

      {/* Historical Revenue */}
      {f.histMonths.length > 0 && (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={16} style={{ color: "#f59e0b" }} /> Historical Monthly Revenue
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140, paddingTop: 20 }}>
            {f.histMonths.slice(-6).map((m) => {
              const val = data.monthlyRevenue[m] || 0;
              const maxVal = Math.max(...f.histMonths.slice(-6).map((mm) => data.monthlyRevenue[mm] || 0), 1);
              const h = (val / maxVal) * 100;
              return (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: ".65rem", fontWeight: 700, marginBottom: 4 }}>{fmt(val)}</span>
                  <div style={{ height: Math.max(h, 4), width: "100%", maxWidth: 50, background: "#f59e0b", borderRadius: 6, opacity: 0.7 }} />
                  <span style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>{fmtMonth(m)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pipeline Deals Table */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: 16 }}>Pipeline Deals ({data.pipeline.length})</h3>
        {data.pipeline.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Deal", "Partner", "Value", "Commission", "Expected Close"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.pipeline.map((d) => {
                  const closeDate = new Date(d.expectedClose);
                  const closeFmt = `${closeDate.getFullYear()}-${String(closeDate.getMonth() + 1).padStart(2, "0")}`;
                  return (
                    <tr key={d.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{d.dealName}</td>
                      <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{d.partnerName}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700 }}>{fmt(d.value)}</td>
                      <td style={{ padding: "10px 12px", color: "#22c55e" }}>{fmt(d.value * d.commissionRate)}</td>
                      <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{fmtMonth(closeFmt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <Briefcase size={36} style={{ color: "var(--muted)", marginBottom: 8 }} />
            <h4 style={{ fontWeight: 700, marginBottom: 4 }}>No open deals in pipeline</h4>
            <p className="muted" style={{ fontSize: ".85rem" }}>Open deals will appear here with projected revenue and commissions.</p>
          </div>
        )}
      </div>

      {/* Partner Growth */}
      {Object.keys(data.partnerGrowth).length > 0 && (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <Users size={16} style={{ color: "#8b5cf6" }} /> Partner Growth by Month
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 100, paddingTop: 20 }}>
            {Object.keys(data.partnerGrowth).sort().slice(-6).map((m) => {
              const val = data.partnerGrowth[m];
              const maxVal = Math.max(...Object.values(data.partnerGrowth), 1);
              const h = (val / maxVal) * 60;
              return (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: ".7rem", fontWeight: 700, marginBottom: 4 }}>{val}</span>
                  <div style={{ height: Math.max(h, 4), width: "100%", maxWidth: 40, background: "#8b5cf6", borderRadius: 6, opacity: 0.8 }} />
                  <span style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>{fmtMonth(m)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
