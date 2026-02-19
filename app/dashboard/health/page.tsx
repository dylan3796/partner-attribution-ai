"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Heart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Users, DollarSign, Briefcase, Clock, ArrowRight, Activity,
  Zap, Shield, Target,
} from "lucide-react";
import { formatCurrency, formatCurrencyCompact as fmt } from "@/lib/utils";

/* ── Health Score Calculator ── */

type HealthMetric = {
  key: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
  status: "healthy" | "warning" | "critical";
  icon: typeof Heart;
  color: string;
  href: string;
};

function getStatus(pct: number): "healthy" | "warning" | "critical" {
  if (pct >= 80) return "healthy";
  if (pct >= 50) return "warning";
  return "critical";
}

const STATUS_COLORS = {
  healthy: "#22c55e",
  warning: "#eab308",
  critical: "#ef4444",
};

/* ── Mini sparkline ── */
function Sparkline({ data, color, width = 80, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  return <svg width={width} height={height}><polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/* ── Health Ring ── */
function HealthRing({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const label = score >= 80 ? "Healthy" : score >= 60 ? "Needs Attention" : "At Risk";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.25, fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: size * 0.08, fontWeight: 600, color }}>{label}</span>
      </div>
    </div>
  );
}

export default function HealthPage() {
  const partners = useQuery(api.partners.list);
  const deals = useQuery(api.dashboard.getRecentDeals);
  const payouts = useQuery(api.payouts.list);

  const partnerList = partners ?? [];
  const dealList = deals ?? [];
  const payoutList = payouts ?? [];

  // Calculate health metrics
  const metrics = useMemo((): HealthMetric[] => {
    const activePartners = partnerList.filter((p) => p.status === "active").length;
    const totalPartners = partnerList.length || 1;
    const activePct = Math.round((activePartners / totalPartners) * 100);

    const wonDeals = dealList.filter((d) => d.status === "won");
    const openDeals = dealList.filter((d) => d.status === "open");
    const totalRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
    const pipelineValue = openDeals.reduce((s, d) => s + d.amount, 0);

    const paidPayouts = payoutList.filter((p) => p.status === "paid");
    const pendingPayouts = payoutList.filter((p) => p.status === "pending_approval" || p.status === "approved");
    const totalPaid = paidPayouts.reduce((s, p) => s + p.amount, 0);
    const totalPending = pendingPayouts.reduce((s, p) => s + p.amount, 0);

    // Win rate
    const closedDeals = wonDeals.length + dealList.filter((d) => d.status === "lost").length;
    const winRate = closedDeals > 0 ? Math.round((wonDeals.length / closedDeals) * 100) : 0;

    return [
      {
        key: "active_partners", label: "Active Partner Rate", value: activePct, target: 85, unit: "%",
        trend: "up", trendValue: "+5%", status: getStatus(activePct), icon: Users, color: "#6366f1",
        href: "/dashboard/partners",
      },
      {
        key: "revenue", label: "Partner Revenue", value: totalRevenue, target: totalRevenue * 1.2 || 100000, unit: "$",
        trend: totalRevenue > 0 ? "up" : "flat", trendValue: "+18%", status: totalRevenue > 0 ? "healthy" : "warning",
        icon: DollarSign, color: "#22c55e", href: "/dashboard/reports",
      },
      {
        key: "pipeline", label: "Pipeline Health", value: pipelineValue, target: totalRevenue * 3 || 300000, unit: "$",
        trend: pipelineValue > 0 ? "up" : "flat", trendValue: "+12%",
        status: getStatus(pipelineValue > 0 ? Math.min(100, (pipelineValue / (totalRevenue * 3 || 300000)) * 100) : 0),
        icon: Target, color: "#3b82f6", href: "/dashboard/pipeline",
      },
      {
        key: "win_rate", label: "Partner Win Rate", value: winRate, target: 35, unit: "%",
        trend: winRate >= 30 ? "up" : "down", trendValue: winRate >= 30 ? "+3pp" : "-2pp",
        status: getStatus(winRate >= 35 ? 100 : winRate >= 25 ? 65 : 30),
        icon: Briefcase, color: "#f59e0b", href: "/dashboard/deals",
      },
      {
        key: "payout_health", label: "Payout Timeliness", value: totalPaid, target: totalPaid + totalPending || 1, unit: "$",
        trend: totalPending > 0 ? "down" : "up", trendValue: totalPending > 0 ? `${fmt(totalPending)} pending` : "All clear",
        status: totalPending > totalPaid * 0.3 ? "warning" : "healthy",
        icon: Clock, color: "#8b5cf6", href: "/dashboard/payouts",
      },
      {
        key: "engagement", label: "Engagement Score", value: 72, target: 80, unit: "/100",
        trend: "up", trendValue: "+8pts", status: getStatus(72 / 80 * 100),
        icon: Zap, color: "#ec4899", href: "/dashboard/scoring",
      },
    ];
  }, [partnerList, dealList, payoutList]);

  // Overall health score (weighted average)
  const overallHealth = useMemo(() => {
    const weights = { active_partners: 15, revenue: 25, pipeline: 20, win_rate: 15, payout_health: 10, engagement: 15 };
    let totalWeight = 0;
    let weightedScore = 0;
    metrics.forEach((m) => {
      const w = weights[m.key as keyof typeof weights] || 10;
      const pct = m.unit === "%" || m.unit === "/100"
        ? Math.min(100, (m.value / m.target) * 100)
        : m.status === "healthy" ? 90 : m.status === "warning" ? 60 : 30;
      weightedScore += pct * w;
      totalWeight += w;
    });
    return Math.round(weightedScore / totalWeight);
  }, [metrics]);

  // Alerts
  const alerts = useMemo(() => {
    const items: { severity: "warning" | "critical"; message: string; href: string }[] = [];
    const inactive = partnerList.filter((p) => p.status !== "active").length;
    if (inactive > 0) items.push({ severity: "warning", message: `${inactive} partner${inactive > 1 ? "s" : ""} inactive or pending`, href: "/dashboard/partners" });

    const staleDeals = dealList.filter((d) => d.status === "open" && (Date.now() - d.createdAt) > 90 * 86400000).length;
    if (staleDeals > 0) items.push({ severity: "warning", message: `${staleDeals} deal${staleDeals > 1 ? "s" : ""} open for 90+ days`, href: "/dashboard/deals" });

    const pendingPayouts = payoutList.filter((p) => p.status === "pending_approval").length;
    if (pendingPayouts > 0) items.push({ severity: pendingPayouts > 5 ? "critical" : "warning", message: `${pendingPayouts} payout${pendingPayouts > 1 ? "s" : ""} awaiting approval`, href: "/dashboard/payouts" });

    const noTierPartners = partnerList.filter((p) => !p.tier).length;
    if (noTierPartners > 0) items.push({ severity: "warning", message: `${noTierPartners} partner${noTierPartners > 1 ? "s" : ""} without tier assignment`, href: "/dashboard/scoring" });

    return items;
  }, [partnerList, dealList, payoutList]);

  // Sparkline data (simulated trend)
  const sparkData = [35, 42, 38, 55, 48, 62, 58, 71, 65, 74, 70, overallHealth];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.02em" }}>Program Health</h1>
        <p className="muted">Overall health of your partner program at a glance</p>
      </div>

      {/* Top row: health ring + alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Health Ring Card */}
        <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 220 }}>
          <HealthRing score={overallHealth} />
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: ".8rem", fontWeight: 600, marginBottom: 4 }}>12-Week Trend</div>
            <Sparkline data={sparkData} color={overallHealth >= 70 ? "#22c55e" : "#eab308"} width={120} height={32} />
          </div>
        </div>

        {/* Alerts */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".95rem", display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <AlertTriangle size={18} style={{ color: alerts.some(a => a.severity === "critical") ? "#ef4444" : "#eab308" }} />
            Action Required ({alerts.length})
          </h3>
          {alerts.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "1rem 0" }}>
              <CheckCircle2 size={20} style={{ color: "#22c55e" }} />
              <span style={{ fontSize: ".9rem", color: "#22c55e", fontWeight: 600 }}>All systems healthy — no action items</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alerts.map((alert, i) => (
                <Link key={i} href={alert.href} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "10px 14px", borderRadius: 8, textDecoration: "none",
                  background: alert.severity === "critical" ? "#ef444410" : "#eab30810",
                  border: `1px solid ${alert.severity === "critical" ? "#ef444430" : "#eab30830"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLORS[alert.severity], flexShrink: 0 }} />
                    <span style={{ fontSize: ".85rem" }}>{alert.message}</span>
                  </div>
                  <ArrowRight size={14} style={{ color: "var(--muted)", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const statusColor = STATUS_COLORS[metric.status];
          const pct = metric.unit === "%" ? metric.value : metric.unit === "/100" ? metric.value : Math.min(100, (metric.value / metric.target) * 100);
          const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Activity;

          return (
            <Link key={metric.key} href={metric.href} className="card" style={{ padding: "1.25rem", textDecoration: "none", border: `1px solid var(--border)`, transition: "border-color 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${metric.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: metric.color }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: ".8rem", fontWeight: 600 }}>{metric.label}</div>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                      {metric.unit === "$" ? fmt(metric.value) : `${metric.value}${metric.unit}`}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, background: `${statusColor}15`, color: statusColor }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: statusColor }} />
                  <span style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "capitalize" }}>{metric.status}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: statusColor, borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
              </div>

              {/* Trend */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".75rem" }}>
                <TrendIcon size={13} style={{ color: metric.trend === "up" ? "#22c55e" : metric.trend === "down" ? "#ef4444" : "var(--muted)" }} />
                <span style={{ color: metric.trend === "up" ? "#22c55e" : metric.trend === "down" ? "#ef4444" : "var(--muted)", fontWeight: 600 }}>
                  {metric.trendValue}
                </span>
                {metric.unit === "$" && (
                  <span className="muted" style={{ marginLeft: "auto" }}>Target: {fmt(metric.target)}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: "1rem" }}>Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {[
            { label: "Review tier changes", href: "/dashboard/scoring/tier-reviews", icon: Shield },
            { label: "Check onboarding pipeline", href: "/dashboard/onboarding", icon: Users },
            { label: "Approve payouts", href: "/dashboard/payouts", icon: DollarSign },
            { label: "View attribution report", href: "/dashboard/reports", icon: Activity },
          ].map((action) => (
            <Link key={action.label} href={action.href} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
              borderRadius: 8, border: "1px solid var(--border)", textDecoration: "none",
              fontSize: ".85rem", fontWeight: 500, transition: "background 0.15s",
            }}>
              <action.icon size={16} style={{ color: "#6366f1" }} />
              {action.label}
              <ArrowRight size={14} style={{ marginLeft: "auto", color: "var(--muted)" }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
