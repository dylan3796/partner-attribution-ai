"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatPercent, MODEL_COLORS, CHART_COLORS } from "@/lib/utils";
import { MODEL_LABELS, type AttributionModel } from "@/lib/types";
import { exportAttributionsCSV } from "@/lib/csv";
import { ConfigTipBox } from "@/components/ui/config-tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MODELS: AttributionModel[] = [
  "equal_split",
  "first_touch",
  "last_touch",
  "time_decay",
  "role_based",
];

type LeaderboardEntry = {
  partnerId: string;
  name: string;
  type: string;
  revenue: number;
  commission: number;
  deals: number;
  avgPct: number;
};

export default function ReportsPage() {
  const { attributions, partners } = useStore();
  const [selectedModel, setSelectedModel] =
    useState<AttributionModel>("equal_split");
  const [sortBy, setSortBy] = useState<"revenue" | "commission" | "deals">(
    "revenue"
  );

  // Aggregate by partner per model
  const partnerModelData = useMemo(() => {
    const data: Record<
      string,
      Record<
        string,
        {
          revenue: number;
          commission: number;
          deals: Set<string>;
          pct: number;
          count: number;
        }
      >
    > = {};
    attributions.forEach((a) => {
      const partner = partners.find((p) => p._id === a.partnerId);
      if (!partner) return;
      if (!data[a.partnerId]) data[a.partnerId] = {};
      if (!data[a.partnerId][a.model])
        data[a.partnerId][a.model] = {
          revenue: 0,
          commission: 0,
          deals: new Set(),
          pct: 0,
          count: 0,
        };
      const entry = data[a.partnerId][a.model];
      entry.revenue += a.amount;
      entry.commission += a.commissionAmount;
      entry.deals.add(a.dealId);
      entry.pct += a.percentage;
      entry.count += 1;
    });
    return data;
  }, [attributions, partners]);

  // Selected model leaderboard
  const leaderboard = useMemo(() => {
    return Object.entries(partnerModelData)
      .map(([partnerId, models]) => {
        const partner = partners.find((p) => p._id === partnerId);
        const data = models[selectedModel];
        if (!data || !partner) return null;
        return {
          partnerId,
          name: partner.name,
          type: partner.type,
          revenue: Math.round(data.revenue),
          commission: Math.round(data.commission),
          deals: data.deals.size,
          avgPct: data.count > 0 ? data.pct / data.count : 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (!a || !b) return 0;
        if (sortBy === "commission") return b.commission - a.commission;
        if (sortBy === "deals") return b.deals - a.deals;
        return b.revenue - a.revenue;
      }) as unknown as LeaderboardEntry[];
  }, [partnerModelData, selectedModel, partners, sortBy]);

  // Model comparison
  const modelComparison = useMemo(() => {
    const totals: Record<
      string,
      { revenue: number; commission: number; deals: Set<string> }
    > = {};
    MODELS.forEach(
      (m) => (totals[m] = { revenue: 0, commission: 0, deals: new Set() })
    );
    attributions.forEach((a) => {
      totals[a.model].revenue += a.amount;
      totals[a.model].commission += a.commissionAmount;
      totals[a.model].deals.add(a.dealId);
    });
    return MODELS.map((m) => ({
      model: m,
      label: MODEL_LABELS[m],
      revenue: Math.round(totals[m].revenue),
      commission: Math.round(totals[m].commission),
      deals: totals[m].deals.size,
    }));
  }, [attributions]);

  // Radar data
  const radarData = useMemo(() => {
    return MODELS.map((model) => {
      const entry: Record<string, string | number> = {
        model: MODEL_LABELS[model],
      };
      Object.entries(partnerModelData).forEach(([partnerId, models]) => {
        const partner = partners.find((p) => p._id === partnerId);
        if (!partner || !models[model]) return;
        entry[partner.name] = Math.round(models[model].revenue);
      });
      return entry;
    });
  }, [partnerModelData, partners]);

  const partnerNames = useMemo(() => {
    return partners
      .filter((p) => partnerModelData[p._id])
      .map((p) => p.name)
      .slice(0, 5);
  }, [partners, partnerModelData]);

  // Pie data
  const pieData = leaderboard
    .slice(0, 6)
    .map((p) => ({ name: p.name, value: p.revenue }));

  function handleExport() {
    const selectedAttributions = attributions.filter(
      (a) => a.model === selectedModel
    );
    // Enrich
    const enriched = selectedAttributions.map((a) => ({
      ...a,
      partner: partners.find((p) => p._id === a.partnerId),
    }));
    exportAttributionsCSV(enriched);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Attribution Reports
          </h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            Compare attribution models and analyze partner performance
          </p>
        </div>
        <button className="btn-outline" onClick={handleExport}>
          ↓ Export CSV
        </button>
      </div>

      <ConfigTipBox
        title="Customize Your Reports"
        tips={[
          "Choose from 5 attribution models — or set a default in Settings",
          "Toggle Reports & Analytics on/off via feature flags",
          "Adjust scoring weights to reflect your org's priorities",
          "Export any report to CSV for your QBR presentations",
        ]}
      />

      {/* Model Overview Chart */}
      <div className="card">
        <h3
          style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "1rem" }}
        >
          Model Comparison — Total Revenue
        </h3>
        <div style={{ height: 288 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--muted)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  formatCurrency(value),
                  name === "revenue" ? "Revenue" : "Commission",
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                }}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Revenue"
                radius={[4, 4, 0, 0]}
              >
                {modelComparison.map((entry) => (
                  <Cell
                    key={entry.model}
                    fill={MODEL_COLORS[entry.model]}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="commission"
                name="Commission"
                fill="var(--muted)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
      >
        {/* Radar */}
        <div className="card">
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Partner Revenue Across Models
          </h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={radarData}
                cx="50%"
                cy="50%"
                outerRadius="70%"
              >
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="model"
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                />
                <PolarRadiusAxis
                  tick={{ fontSize: 10, fill: "var(--muted)" }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                {partnerNames.map((name, i) => (
                  <Radar
                    key={name}
                    name={name}
                    dataKey={name}
                    stroke={CHART_COLORS[i]}
                    fill={CHART_COLORS[i]}
                    fillOpacity={0.1}
                  />
                ))}
                <Legend />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie */}
        <div className="card">
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Revenue Split — {MODEL_LABELS[selectedModel]}
          </h3>
          <div style={{ height: 320, display: "flex", alignItems: "center" }}>
            <div style={{ width: "60%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {pieData.map((item, i) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: CHART_COLORS[i % CHART_COLORS.length],
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="muted"
                    style={{
                      fontSize: "0.8rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Model selector + Leaderboard */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.2rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            gap: "0.75rem",
          }}
        >
          <strong>Partner Leaderboard</strong>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <select
              value={selectedModel}
              onChange={(e) =>
                setSelectedModel(e.target.value as AttributionModel)
              }
              className="input"
              style={{
                width: "auto",
                padding: "0.5rem 0.8rem",
                fontSize: "0.85rem",
              }}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {MODEL_LABELS[m]}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="input"
              style={{
                width: "auto",
                padding: "0.5rem 0.8rem",
                fontSize: "0.85rem",
              }}
            >
              <option value="revenue">Sort by Revenue</option>
              <option value="commission">Sort by Commission</option>
              <option value="deals">Sort by Deals</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: "var(--subtle)",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    width: 40,
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Partner
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.75rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Revenue
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.75rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Commission
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.75rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Deals
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Avg %
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((p, i) => (
                <tr
                  key={p.partnerId}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "var(--muted)",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        className="avatar"
                        style={{
                          width: 28,
                          height: 28,
                          fontSize: "0.65rem",
                        }}
                      >
                        {p.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        }}
                      >
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      fontSize: "0.9rem",
                      textTransform: "capitalize",
                      color: "var(--muted)",
                    }}
                  >
                    {p.type}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "right",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {formatCurrency(p.revenue)}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "right",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "#059669",
                    }}
                  >
                    {formatCurrency(p.commission)}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "right",
                      fontSize: "0.9rem",
                    }}
                  >
                    {p.deals}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1.5rem",
                      textAlign: "right",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formatPercent(p.avgPct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaderboard.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p className="muted">No attribution data for this model</p>
          </div>
        )}
      </div>

      {/* Model Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1rem",
        }}
      >
        {MODELS.map((model) => {
          const data = modelComparison.find((m) => m.model === model);
          const isSelected = selectedModel === model;
          return (
            <div
              key={model}
              className="card"
              style={{
                padding: "1.2rem",
                cursor: "pointer",
                border: isSelected
                  ? "2px solid var(--fg)"
                  : "1px solid var(--border)",
                background: isSelected ? "var(--subtle)" : "var(--bg)",
                transition: "all 0.15s",
              }}
              onClick={() => setSelectedModel(model)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: MODEL_COLORS[model],
                  }}
                />
                <h4 style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  {MODEL_LABELS[model]}
                </h4>
              </div>
              <p style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                {formatCurrency(data?.revenue || 0)}
              </p>
              <p
                className="muted"
                style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
              >
                {data?.deals || 0} deals ·{" "}
                {formatCurrency(data?.commission || 0)} commission
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
