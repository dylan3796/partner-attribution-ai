"use client";

import { useMemo } from "react";
import { usePortal } from "@/lib/portal-context";
import { formatCurrency } from "@/lib/utils";
import {
  Trophy, TrendingUp, Target, BarChart3, Award, Briefcase, DollarSign,
  CheckCircle2, Clock, Users, Loader2,
} from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  platinum: "#a78bfa", gold: "#eab308", silver: "#94a3b8", bronze: "#cd7f32",
};

const TIER_THRESHOLDS = [
  { tier: "platinum", minScore: 80 },
  { tier: "gold", minScore: 60 },
  { tier: "silver", minScore: 40 },
  { tier: "bronze", minScore: 0 },
];

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function PerformancePage() {
  const { partner, myDeals, myAttributions, myPayouts, stats } = usePortal();

  const metrics = useMemo(() => {
    if (!partner) return null;

    const wonDeals = myDeals.filter((d) => d.status === "won");
    const openDeals = myDeals.filter((d) => d.status === "open");
    const totalDeals = myDeals.length;
    const winRate = totalDeals > 0 ? Math.round((wonDeals.length / totalDeals) * 100) : 0;
    const revenue = wonDeals.reduce((s, d) => s + d.amount, 0);
    const pipelineValue = openDeals.reduce((s, d) => s + d.amount, 0);
    const totalCommissions = myPayouts.reduce((s, p) => s + p.amount, 0);

    // Monthly commissions (last 6 months)
    const monthlyComm: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyComm[key] = 0;
    }
    for (const p of myPayouts) {
      if (p.date) {
        const d = new Date(p.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (key in monthlyComm) monthlyComm[key] += p.amount;
      }
    }

    // Simple score: deals (30%) + wins (40%) + commissions (20%) + activity (10%)
    const dealScore = Math.min(30, totalDeals * 3);
    const winScore = Math.min(40, wonDeals.length * 8);
    const commScore = Math.min(20, totalCommissions > 0 ? Math.min(20, Math.round(totalCommissions / 5000)) : 0);
    const activityScore = Math.min(10, myAttributions.length * 2);
    const overallScore = dealScore + winScore + commScore + activityScore;

    const currentTier = partner.tier || "bronze";
    const nextTier = TIER_THRESHOLDS.find((t) => t.minScore > overallScore);
    const pointsToNext = nextTier ? nextTier.minScore - overallScore : 0;

    return {
      totalDeals, wonDeals: wonDeals.length, openDeals: openDeals.length,
      winRate, revenue, pipelineValue, totalCommissions,
      monthlyComm, overallScore, currentTier,
      nextTierName: nextTier?.tier, pointsToNext,
      dealScore, winScore, commScore, activityScore,
    };
  }, [partner, myDeals, myAttributions, myPayouts]);

  if (!partner || !metrics) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const tierColor = TIER_COLORS[metrics.currentTier] || "#64748b";
  const monthKeys = Object.keys(metrics.monthlyComm).sort();
  const maxComm = Math.max(...Object.values(metrics.monthlyComm), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={24} style={{ color: "#6366f1" }} />
          My Performance
        </h1>
        <p className="muted" style={{ marginTop: ".25rem" }}>Your personal stats and program standing</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Deals Registered", value: String(metrics.totalDeals), icon: <Briefcase size={18} />, color: "#6366f1" },
          { label: "Deals Won", value: String(metrics.wonDeals), icon: <CheckCircle2 size={18} />, color: "#22c55e" },
          { label: "Win Rate", value: `${metrics.winRate}%`, icon: <Target size={18} />, color: "#3b82f6" },
          { label: "Total Commissions", value: fmt(metrics.totalCommissions), icon: <DollarSign size={18} />, color: "#f59e0b" },
          { label: "Pipeline Value", value: fmt(metrics.pipelineValue), icon: <TrendingUp size={18} />, color: "#8b5cf6" },
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

      {/* Tier + Score */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <Award size={16} style={{ color: tierColor }} /> Tier & Score
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
              background: `${tierColor}18`, border: `2px solid ${tierColor}`,
            }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 900, color: tierColor }}>{metrics.overallScore}</span>
            </div>
            <div>
              <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: ".8rem", fontWeight: 700, color: tierColor, background: `${tierColor}18`, textTransform: "capitalize" }}>
                {metrics.currentTier}
              </span>
              {metrics.nextTierName && metrics.pointsToNext > 0 && (
                <p className="muted" style={{ fontSize: ".78rem", marginTop: 6 }}>
                  {metrics.pointsToNext} points to <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{metrics.nextTierName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Deals Registered", score: metrics.dealScore, max: 30, color: "#6366f1" },
              { label: "Deals Won", score: metrics.winScore, max: 40, color: "#22c55e" },
              { label: "Commissions", score: metrics.commScore, max: 20, color: "#f59e0b" },
              { label: "Activity", score: metrics.activityScore, max: 10, color: "#8b5cf6" },
            ].map((dim) => (
              <div key={dim.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".75rem", marginBottom: 3 }}>
                  <span className="muted" style={{ fontWeight: 600 }}>{dim.label}</span>
                  <span style={{ fontWeight: 700 }}>{dim.score}/{dim.max}</span>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(dim.score / dim.max) * 100}%`, height: "100%", background: dim.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Trend */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <BarChart3 size={16} style={{ color: "#22c55e" }} /> Commission Trend (6 Months)
          </h3>
          {Object.values(metrics.monthlyComm).some((v) => v > 0) ? (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, paddingTop: 20 }}>
              {monthKeys.map((m) => {
                const val = metrics.monthlyComm[m];
                const h = (val / maxComm) * 100;
                const [, mm] = m.split("-");
                const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return (
                  <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: ".6rem", fontWeight: 700, marginBottom: 4 }}>{val > 0 ? fmt(val) : ""}</span>
                    <div style={{ height: Math.max(h, 4), width: "100%", maxWidth: 36, background: "#22c55e", borderRadius: 6, opacity: 0.8 }} />
                    <span style={{ fontSize: ".6rem", color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>{labels[parseInt(mm, 10) - 1]}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <DollarSign size={32} style={{ color: "var(--muted)", marginBottom: 8 }} />
              <p className="muted" style={{ fontSize: ".85rem" }}>No commission payouts yet. Close deals to start earning!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Deals */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 12 }}>Your Deals ({myDeals.length})</h3>
        {myDeals.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Deal", "Value", "Status", "Date"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myDeals.slice(0, 10).map((d) => {
                  const statusColor = d.status === "won" ? "#22c55e" : d.status === "lost" ? "#ef4444" : "#f59e0b";
                  return (
                    <tr key={d._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{d.name}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700 }}>{formatCurrency(d.amount)}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: ".7rem", fontWeight: 700, color: statusColor, background: `${statusColor}18`, textTransform: "capitalize" }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: ".8rem" }}>
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Briefcase size={32} style={{ color: "var(--muted)", marginBottom: 8 }} />
            <p className="muted" style={{ fontSize: ".85rem" }}>No deals yet. Register your first deal to track performance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
