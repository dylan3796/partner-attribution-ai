"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

/* ── Types ── */
type ForecastPeriod = "monthly" | "quarterly" | "annual";
type Scenario = "conservative" | "base" | "optimistic";

interface PipelineDeal {
  id: string;
  partnerName: string;
  dealName: string;
  value: number;
  commissionRate: number;
  probability: number;
  expectedClose: string;
  stage: string;
}

interface MonthForecast {
  month: string;
  label: string;
  recurring: number;
  newDeals: number;
  pipeline: number;
  total: number;
}

/* ── Demo Data ── */
const PIPELINE_DEALS: PipelineDeal[] = [
  { id: "d1", partnerName: "TechBridge", dealName: "Enterprise SSO Migration", value: 185000, commissionRate: 0.15, probability: 0.85, expectedClose: "2026-03", stage: "Negotiation" },
  { id: "d2", partnerName: "Stackline", dealName: "Analytics Platform Rollout", value: 92000, commissionRate: 0.12, probability: 0.70, expectedClose: "2026-03", stage: "Proposal" },
  { id: "d3", partnerName: "Northlight", dealName: "Multi-tenant SaaS Deal", value: 340000, commissionRate: 0.18, probability: 0.45, expectedClose: "2026-04", stage: "Discovery" },
  { id: "d4", partnerName: "TechBridge", dealName: "API Gateway Upsell", value: 67000, commissionRate: 0.15, probability: 0.90, expectedClose: "2026-03", stage: "Closing" },
  { id: "d5", partnerName: "Apex Growth", dealName: "Compliance Suite License", value: 128000, commissionRate: 0.10, probability: 0.60, expectedClose: "2026-04", stage: "Proposal" },
  { id: "d6", partnerName: "Clearpath", dealName: "Cloud Migration Phase 2", value: 215000, commissionRate: 0.14, probability: 0.55, expectedClose: "2026-05", stage: "Discovery" },
  { id: "d7", partnerName: "Stackline", dealName: "Data Warehouse Expansion", value: 156000, commissionRate: 0.12, probability: 0.75, expectedClose: "2026-04", stage: "Negotiation" },
  { id: "d8", partnerName: "Apex Growth", dealName: "Security Audit Tooling", value: 74000, commissionRate: 0.10, probability: 0.80, expectedClose: "2026-05", stage: "Proposal" },
  { id: "d9", partnerName: "TechBridge", dealName: "DevOps Platform License", value: 290000, commissionRate: 0.15, probability: 0.35, expectedClose: "2026-06", stage: "Qualification" },
  { id: "d10", partnerName: "Northlight", dealName: "IoT Data Pipeline", value: 108000, commissionRate: 0.18, probability: 0.50, expectedClose: "2026-06", stage: "Discovery" },
];

const HISTORICAL_MONTHLY = [
  { month: "2025-09", revenue: 42300 },
  { month: "2025-10", revenue: 47800 },
  { month: "2025-11", revenue: 51200 },
  { month: "2025-12", revenue: 55600 },
  { month: "2026-01", revenue: 58900 },
  { month: "2026-02", revenue: 62400 },
];

const RECURRING_BASE = 38000; // Monthly recurring commission from active partners

const SCENARIO_MULTIPLIERS: Record<Scenario, number> = {
  conservative: 0.7,
  base: 1.0,
  optimistic: 1.3,
};

const MONTH_LABELS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const MONTH_KEYS = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];

/* ── Helpers ── */
function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function pct(n: number): string {
  return `${(n * 100).toFixed(0)}%`;
}

function stageColor(stage: string): string {
  const map: Record<string, string> = {
    Closing: "#22c55e",
    Negotiation: "#3b82f6",
    Proposal: "#f59e0b",
    Discovery: "#a855f7",
    Qualification: "#6b7280",
  };
  return map[stage] || "#6b7280";
}

/* ── Component ── */
export default function ForecastingPage() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const [period, setPeriod] = useState<ForecastPeriod>("monthly");
  const [expandedDeals, setExpandedDeals] = useState(false);

  const multiplier = SCENARIO_MULTIPLIERS[scenario];

  // Build 6-month forecast
  const forecasts: MonthForecast[] = useMemo(() => {
    // Growth rate from historical data
    const recentGrowth = 0.06; // ~6% month-over-month from historical

    return MONTH_KEYS.map((monthKey, i) => {
      // Pipeline deals closing this month
      const monthDeals = PIPELINE_DEALS.filter((d) => d.expectedClose === monthKey);
      const pipelineRevenue = monthDeals.reduce(
        (sum, d) => sum + d.value * d.commissionRate * d.probability * multiplier,
        0
      );

      // Projected new deals (not in pipeline yet) based on historical trend
      const projectedNew = i > 2 ? (RECURRING_BASE * 0.15 * (1 + recentGrowth * i)) * multiplier : 0;

      // Recurring grows slightly each month
      const recurring = RECURRING_BASE * (1 + recentGrowth * i * 0.3) * multiplier;

      return {
        month: monthKey,
        label: MONTH_LABELS[i],
        recurring: Math.round(recurring),
        newDeals: Math.round(projectedNew),
        pipeline: Math.round(pipelineRevenue),
        total: Math.round(recurring + pipelineRevenue + projectedNew),
      };
    });
  }, [multiplier]);

  const totalForecast = forecasts.reduce((s, f) => s + f.total, 0);
  const q1Forecast = forecasts.slice(0, 3).reduce((s, f) => s + f.total, 0);
  const maxMonth = Math.max(...forecasts.map((f) => f.total));

  // Historical trend
  const lastMonth = HISTORICAL_MONTHLY[HISTORICAL_MONTHLY.length - 1].revenue;
  const prevMonth = HISTORICAL_MONTHLY[HISTORICAL_MONTHLY.length - 2].revenue;
  const growthRate = (lastMonth - prevMonth) / prevMonth;

  // Weighted pipeline value
  const weightedPipeline = PIPELINE_DEALS.reduce(
    (sum, d) => sum + d.value * d.commissionRate * d.probability,
    0
  );

  // Confidence score based on pipeline stage distribution
  const avgProbability = PIPELINE_DEALS.reduce((s, d) => s + d.probability, 0) / PIPELINE_DEALS.length;
  const confidenceScore = Math.round(avgProbability * 100);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            <TrendingUp size={22} style={{ marginRight: 8, verticalAlign: "middle", color: "#6366f1" }} />
            Revenue Forecast
          </h1>
          <p style={{ color: "var(--muted)", fontSize: ".85rem", margin: "4px 0 0" }}>
            6-month commission revenue projection based on pipeline & historical trends
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["conservative", "base", "optimistic"] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: scenario === s ? "2px solid #6366f1" : "1px solid var(--border)",
                background: scenario === s ? "#6366f120" : "var(--subtle)",
                color: scenario === s ? "#6366f1" : "var(--fg)",
                fontWeight: scenario === s ? 700 : 500,
                fontSize: ".8rem",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          {
            label: "6-Month Forecast",
            value: fmt(totalForecast),
            sub: `${scenario} scenario`,
            icon: <DollarSign size={18} />,
            color: "#6366f1",
          },
          {
            label: "Next Quarter (Q1)",
            value: fmt(q1Forecast),
            sub: "Mar–May 2026",
            icon: <Calendar size={18} />,
            color: "#3b82f6",
          },
          {
            label: "Weighted Pipeline",
            value: fmt(weightedPipeline),
            sub: `${PIPELINE_DEALS.length} active deals`,
            icon: <Target size={18} />,
            color: "#22c55e",
          },
          {
            label: "Forecast Confidence",
            value: `${confidenceScore}%`,
            sub: confidenceScore > 65 ? "High confidence" : confidenceScore > 45 ? "Moderate" : "Low — early-stage heavy",
            icon: confidenceScore > 65 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />,
            color: confidenceScore > 65 ? "#22c55e" : confidenceScore > 45 ? "#f59e0b" : "#ef4444",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              padding: 20,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--subtle)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: ".75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em" }}>
                {card.label}
              </span>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Forecast Chart (bar chart) ── */}
      <div style={{ padding: 24, borderRadius: 12, border: "1px solid var(--border)", background: "var(--subtle)", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>
            <BarChart3 size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Monthly Forecast Breakdown
          </h2>
          <div style={{ display: "flex", gap: 16, fontSize: ".7rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#6366f1", display: "inline-block" }} /> Recurring
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#3b82f6", display: "inline-block" }} /> Pipeline
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#22c55e", display: "inline-block" }} /> Projected New
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200 }}>
          {forecasts.map((f) => {
            const recurringH = (f.recurring / maxMonth) * 180;
            const pipelineH = (f.pipeline / maxMonth) * 180;
            const newH = (f.newDeals / maxMonth) * 180;
            return (
              <div key={f.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: ".7rem", fontWeight: 700, marginBottom: 4, color: "var(--fg)" }}>{fmt(f.total)}</span>
                <div style={{ display: "flex", flexDirection: "column-reverse", width: "100%", maxWidth: 48 }}>
                  <div style={{ height: recurringH, background: "#6366f1", borderRadius: "0 0 6px 6px", minHeight: 2 }} />
                  <div style={{ height: pipelineH, background: "#3b82f6", minHeight: f.pipeline > 0 ? 2 : 0 }} />
                  <div style={{ height: newH, background: "#22c55e", borderRadius: "6px 6px 0 0", minHeight: f.newDeals > 0 ? 2 : 0 }} />
                </div>
                <span style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>{f.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Historical Trend ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--subtle)" }}>
          <h3 style={{ fontSize: ".85rem", fontWeight: 700, margin: "0 0 12px" }}>
            <Clock size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Historical Trend (6mo)
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
            {HISTORICAL_MONTHLY.map((h) => {
              const maxHist = Math.max(...HISTORICAL_MONTHLY.map((x) => x.revenue));
              const barH = (h.revenue / maxHist) * 80;
              return (
                <div key={h.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: ".6rem", fontWeight: 600, marginBottom: 2 }}>{fmt(h.revenue)}</span>
                  <div style={{ height: barH, width: "100%", maxWidth: 32, background: "var(--muted)", borderRadius: 4, opacity: 0.4 }} />
                  <span style={{ fontSize: ".6rem", color: "var(--muted)", marginTop: 4 }}>
                    {h.month.split("-")[1]}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: ".78rem" }}>
            {growthRate > 0 ? <TrendingUp size={14} color="#22c55e" /> : <TrendingDown size={14} color="#ef4444" />}
            <span style={{ color: growthRate > 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
              {pct(growthRate)}
            </span>
            <span style={{ color: "var(--muted)" }}>month-over-month growth</span>
          </div>
        </div>

        {/* ── Scenario Comparison ── */}
        <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--subtle)" }}>
          <h3 style={{ fontSize: ".85rem", fontWeight: 700, margin: "0 0 12px" }}>Scenario Comparison (6mo total)</h3>
          {(["conservative", "base", "optimistic"] as Scenario[]).map((s) => {
            const mult = SCENARIO_MULTIPLIERS[s];
            const total = MONTH_KEYS.reduce((sum, monthKey, i) => {
              const monthDeals = PIPELINE_DEALS.filter((d) => d.expectedClose === monthKey);
              const pipe = monthDeals.reduce((su, d) => su + d.value * d.commissionRate * d.probability * mult, 0);
              const projNew = i > 2 ? RECURRING_BASE * 0.15 * (1 + 0.06 * i) * mult : 0;
              const rec = RECURRING_BASE * (1 + 0.06 * i * 0.3) * mult;
              return sum + rec + pipe + projNew;
            }, 0);
            const barW = (total / 500000) * 100;
            const colors: Record<Scenario, string> = { conservative: "#f59e0b", base: "#6366f1", optimistic: "#22c55e" };
            return (
              <div key={s} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".75rem", marginBottom: 4 }}>
                  <span style={{ textTransform: "capitalize", fontWeight: scenario === s ? 700 : 500, color: scenario === s ? colors[s] : "var(--muted)" }}>
                    {s} {scenario === s && "●"}
                  </span>
                  <span style={{ fontWeight: 700, color: colors[s] }}>{fmt(total)}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--border)" }}>
                  <div style={{ height: 8, borderRadius: 4, background: colors[s], width: `${Math.min(barW, 100)}%`, opacity: scenario === s ? 1 : 0.4, transition: "all .3s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Pipeline Deals Table ── */}
      <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--subtle)" }}>
        <button
          onClick={() => setExpandedDeals(!expandedDeals)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: "var(--fg)",
          }}
        >
          <h3 style={{ fontSize: ".85rem", fontWeight: 700, margin: 0 }}>
            Pipeline Deals Feeding Forecast ({PIPELINE_DEALS.length} deals)
          </h3>
          {expandedDeals ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedDeals && (
          <div style={{ marginTop: 16, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".78rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  {["Partner", "Deal", "Value", "Rate", "Prob", "Weighted Commission", "Close", "Stage"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 700, color: "var(--muted)", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".03em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PIPELINE_DEALS.sort((a, b) => b.value * b.commissionRate * b.probability - a.value * a.commissionRate * a.probability).map((d) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 10px", fontWeight: 600 }}>{d.partnerName}</td>
                    <td style={{ padding: "10px 10px" }}>{d.dealName}</td>
                    <td style={{ padding: "10px 10px", fontWeight: 600 }}>{fmt(d.value)}</td>
                    <td style={{ padding: "10px 10px" }}>{pct(d.commissionRate)}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: ".7rem",
                        fontWeight: 700,
                        background: d.probability >= 0.7 ? "#22c55e20" : d.probability >= 0.5 ? "#f59e0b20" : "#ef444420",
                        color: d.probability >= 0.7 ? "#22c55e" : d.probability >= 0.5 ? "#f59e0b" : "#ef4444",
                      }}>
                        {pct(d.probability)}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", fontWeight: 700, color: "#6366f1" }}>
                      {fmt(d.value * d.commissionRate * d.probability)}
                    </td>
                    <td style={{ padding: "10px 10px" }}>{d.expectedClose}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: ".7rem",
                        fontWeight: 600,
                        background: `${stageColor(d.stage)}20`,
                        color: stageColor(d.stage),
                      }}>
                        {d.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
