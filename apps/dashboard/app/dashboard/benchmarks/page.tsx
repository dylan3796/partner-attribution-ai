"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  BarChart3, Users, TrendingUp, TrendingDown, Minus, Target, DollarSign, Award, Loader2,
} from "lucide-react";

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

const TIER_COLORS: Record<string, string> = {
  platinum: "#a78bfa", gold: "#eab308", silver: "#94a3b8", bronze: "#cd7f32",
};

type SortKey = "revenue" | "winRate" | "deals" | "avgDealSize" | "pipelineValue";

export default function BenchmarksPage() {
  const data = useQuery(api.benchmarks.getBenchmarks);
  const [sortBy, setSortBy] = useState<SortKey>("revenue");
  const [filterTier, setFilterTier] = useState("all");

  const sorted = useMemo(() => {
    if (!data) return [];
    let list = data.benchmarks;
    if (filterTier !== "all") list = list.filter((b) => b.tier === filterTier);
    return [...list].sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
  }, [data, sortBy, filterTier]);

  if (!data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const { averages: avg, tierDistribution, totalPartners } = data;
  const topQuartile = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 4)));
  const bottomQuartile = sorted.slice(-Math.max(1, Math.ceil(sorted.length / 4)));
  const topAvgRevenue = topQuartile.length > 0 ? Math.round(topQuartile.reduce((s, b) => s + b.revenue, 0) / topQuartile.length) : 0;
  const bottomAvgRevenue = bottomQuartile.length > 0 ? Math.round(bottomQuartile.reduce((s, b) => s + b.revenue, 0) / bottomQuartile.length) : 0;

  function Indicator({ value, avg: benchmark }: { value: number; avg: number }) {
    if (benchmark === 0) return <Minus size={12} style={{ color: "var(--muted)" }} />;
    const pct = ((value - benchmark) / benchmark) * 100;
    if (pct > 10) return <TrendingUp size={12} style={{ color: "#22c55e" }} />;
    if (pct < -10) return <TrendingDown size={12} style={{ color: "#ef4444" }} />;
    return <Minus size={12} style={{ color: "var(--muted)" }} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
          <Target size={28} style={{ color: "#6366f1" }} />
          Partner Benchmarks
        </h1>
        <p className="muted" style={{ marginTop: ".25rem" }}>Compare partner performance against program averages</p>
      </div>

      {/* Program Averages */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Avg Revenue", value: fmt(avg.revenue), icon: <DollarSign size={18} />, color: "#22c55e" },
          { label: "Avg Win Rate", value: `${avg.winRate}%`, icon: <Target size={18} />, color: "#6366f1" },
          { label: "Avg Deal Size", value: fmt(avg.avgDealSize), icon: <BarChart3 size={18} />, color: "#3b82f6" },
          { label: "Avg Deals/Partner", value: String(avg.deals), icon: <Award size={18} />, color: "#f59e0b" },
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

      {/* Tier Distribution + Top/Bottom */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 12 }}>Tier Distribution</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["platinum", "gold", "silver", "bronze"].map((tier) => {
              const count = tierDistribution[tier] || 0;
              const pct = totalPartners > 0 ? (count / totalPartners) * 100 : 0;
              return (
                <div key={tier} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 70, fontSize: ".8rem", fontWeight: 600, textTransform: "capitalize", color: TIER_COLORS[tier] }}>{tier}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: TIER_COLORS[tier], borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: ".75rem", fontWeight: 700, minWidth: 20, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 12 }}>Top vs Bottom Quartile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, marginBottom: 4 }}>Top 25% Avg Revenue</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#22c55e" }}>{fmt(topAvgRevenue)}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, marginBottom: 4 }}>Bottom 25% Avg Revenue</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ef4444" }}>{fmt(bottomAvgRevenue)}</div>
            </div>
            {topAvgRevenue > 0 && bottomAvgRevenue > 0 && (
              <div className="muted" style={{ fontSize: ".78rem" }}>
                Top performers generate <strong style={{ color: "var(--fg)" }}>{Math.round(topAvgRevenue / bottomAvgRevenue)}×</strong> more revenue
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <select className="input" value={filterTier} onChange={(e) => setFilterTier(e.target.value)} style={{ maxWidth: 140 }}>
          <option value="all">All Tiers</option>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} style={{ maxWidth: 160 }}>
          <option value="revenue">Sort by Revenue</option>
          <option value="winRate">Sort by Win Rate</option>
          <option value="deals">Sort by Deals</option>
          <option value="avgDealSize">Sort by Avg Deal Size</option>
          <option value="pipelineValue">Sort by Pipeline</option>
        </select>
      </div>

      {/* Partner Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["#", "Partner", "Tier", "Revenue", "vs Avg", "Deals", "Win Rate", "Avg Deal", "Pipeline"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px", color: "var(--muted)", fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <Link href={`/dashboard/partners/${b.id}`} style={{ fontWeight: 600, color: "var(--fg)", textDecoration: "none" }}>{b.name}</Link>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: ".7rem", fontWeight: 700, color: TIER_COLORS[b.tier] || "#64748b", background: `${TIER_COLORS[b.tier] || "#64748b"}18`, textTransform: "capitalize" }}>
                      {b.tier}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{fmt(b.revenue)}</td>
                  <td style={{ padding: "10px 12px" }}><Indicator value={b.revenue} avg={avg.revenue} /></td>
                  <td style={{ padding: "10px 12px" }}>{b.deals} <span className="muted">({b.wonDeals} won)</span></td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ color: b.winRate >= avg.winRate ? "#22c55e" : b.winRate > 0 ? "#ef4444" : "var(--muted)" }}>{b.winRate}%</span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{b.avgDealSize > 0 ? fmt(b.avgDealSize) : "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#6366f1" }}>{b.pipelineValue > 0 ? fmt(b.pipelineValue) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <Users size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>No partner data yet</h3>
            <p className="muted" style={{ fontSize: ".85rem" }}>Add partners and register deals to see benchmarks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
