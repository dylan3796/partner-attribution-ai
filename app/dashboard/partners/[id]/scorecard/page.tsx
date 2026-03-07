"use client";
import { use, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/utils";
import { PARTNER_TYPE_LABELS, TIER_LABELS } from "@/lib/types";
import { ArrowLeft, Printer, Download, Building2, Mail, MapPin, Award, TrendingUp, TrendingDown, Minus, Calendar, Target, DollarSign, Handshake, BarChart3, Activity, Clock, Shield } from "lucide-react";

function tierColor(tier: string) {
  const colors: Record<string, string> = {
    platinum: "#e5e7eb",
    gold: "#fbbf24",
    silver: "#9ca3af",
    bronze: "#b45309",
  };
  return colors[tier] || "#6b7280";
}

function healthColor(score: number) {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#eab308";
  return "#ef4444";
}

function healthLabel(score: number) {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "At Risk";
  return "Churning";
}

function MetricCard({ label, value, icon: Icon, sub, trend }: {
  label: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
  trend?: number;
}) {
  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 10, padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Icon size={14} color="#666" />
        <span style={{ fontSize: ".75rem", color: "#888", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{value}</span>
        {trend !== undefined && trend !== 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: ".75rem", color: trend > 0 ? "#22c55e" : "#ef4444" }}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <div style={{ fontSize: ".7rem", color: "#666", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ScorecardSkeleton() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ height: 32, width: 300, background: "#222", borderRadius: 6, marginBottom: 24 }} className="animate-pulse" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 90, background: "#111", borderRadius: 10, border: "1px solid #222" }} className="animate-pulse" />
        ))}
      </div>
      <div style={{ height: 200, background: "#111", borderRadius: 10, border: "1px solid #222" }} className="animate-pulse" />
    </div>
  );
}

export default function ScorecardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const partnerId = id as Id<"partners">;

  const partner = useQuery(api.partners.getById, { id: partnerId });
  const deals = useQuery(api.partners.getDealsForPartner, { partnerId });
  const payouts = useQuery(api.partners.getPayoutsForPartner, { partnerId });

  const metrics = useMemo(() => {
    if (!partner || !deals || !payouts) return null;

    const now = Date.now();
    const MS_30D = 30 * 24 * 60 * 60 * 1000;
    const MS_90D = 90 * 24 * 60 * 60 * 1000;

    const wonDeals = deals.filter((d: any) => d.status === "closed_won");
    const lostDeals = deals.filter((d: any) => d.status === "closed_lost");
    const openDeals = deals.filter((d: any) => !["closed_won", "closed_lost"].includes(d.status));

    const totalRevenue = wonDeals.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const openPipeline = openDeals.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const totalDeals = deals.length;
    const winRate = totalDeals > 0 ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length || 1)) * 100) : 0;

    const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;

    // Deal velocity — avg days to close for won deals
    const velocities = wonDeals
      .filter((d: any) => d.closedAt && d.createdAt)
      .map((d: any) => (d.closedAt - d.createdAt) / (24 * 60 * 60 * 1000));
    const avgVelocity = velocities.length > 0 ? Math.round(velocities.reduce((a: number, b: number) => a + b, 0) / velocities.length) : 0;

    // Commissions
    const totalCommissions = payouts.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const paidCommissions = payouts.filter((p: any) => p.status === "paid").reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const pendingCommissions = payouts.filter((p: any) => p.status !== "paid").reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    // Recent activity (last 90 days)
    const recentDeals = deals.filter((d: any) => d.createdAt > now - MS_90D);
    const prevDeals = deals.filter((d: any) => d.createdAt > now - MS_90D * 2 && d.createdAt <= now - MS_90D);
    const recentRevenue = wonDeals.filter((d: any) => (d.closedAt || d.createdAt) > now - MS_90D).reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const prevRevenue = wonDeals.filter((d: any) => (d.closedAt || d.createdAt) > now - MS_90D * 2 && (d.closedAt || d.createdAt) <= now - MS_90D).reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

    const revenueTrend = prevRevenue > 0 ? Math.round(((recentRevenue - prevRevenue) / prevRevenue) * 100) : 0;
    const dealsTrend = prevDeals.length > 0 ? Math.round(((recentDeals.length - prevDeals.length) / prevDeals.length) * 100) : 0;

    // Monthly revenue for last 6 months
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now - i * 30 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
      const rev = wonDeals
        .filter((deal: any) => {
          const t = deal.closedAt || deal.createdAt;
          return t >= monthStart && t < monthEnd;
        })
        .reduce((sum: number, deal: any) => sum + (deal.amount || 0), 0);
      monthlyRevenue.push({
        month: d.toLocaleDateString("en-US", { month: "short" }),
        revenue: rev,
      });
    }

    // Top deals
    const topDeals = [...wonDeals]
      .sort((a: any, b: any) => (b.amount || 0) - (a.amount || 0))
      .slice(0, 5);

    // Last activity
    const allTimestamps = [
      ...deals.map((d: any) => d.closedAt || d.createdAt || 0),
      ...payouts.map((p: any) => p.createdAt || 0),
    ].filter(Boolean);
    const lastActivity = allTimestamps.length > 0 ? Math.max(...allTimestamps) : 0;
    const daysSinceActivity = lastActivity > 0 ? Math.round((now - lastActivity) / (24 * 60 * 60 * 1000)) : 999;

    // Health score (simplified version of partnerHealth.ts logic)
    let healthScore = 50;
    if (wonDeals.length > 0) healthScore += 15;
    if (recentDeals.length > 0) healthScore += 10;
    if (totalRevenue > 50000) healthScore += 10;
    if (daysSinceActivity < 30) healthScore += 15;
    else if (daysSinceActivity > 90) healthScore -= 20;
    if (winRate > 50) healthScore += 10;
    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
      totalRevenue, openPipeline, totalDeals, wonDeals: wonDeals.length,
      lostDeals: lostDeals.length, openDeals: openDeals.length, winRate,
      avgDealSize, avgVelocity, totalCommissions, paidCommissions,
      pendingCommissions, recentDeals: recentDeals.length, revenueTrend,
      dealsTrend, monthlyRevenue, topDeals, lastActivity, daysSinceActivity,
      healthScore,
    };
  }, [partner, deals, payouts]);

  if (partner === undefined || deals === undefined || payouts === undefined) {
    return <ScorecardSkeleton />;
  }

  if (!partner) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ color: "#888" }}>Partner not found.</p>
        <Link href="/dashboard/partners" style={{ color: "#6366f1", fontSize: ".875rem" }}>← Back to Partners</Link>
      </div>
    );
  }

  if (!metrics) return <ScorecardSkeleton />;

  const maxMonthlyRev = Math.max(...metrics.monthlyRevenue.map(m => m.revenue), 1);
  const generatedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          nav, aside, header, .no-print, [data-sidebar], [data-topbar] { display: none !important; }
          body { background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .scorecard-page { padding: 20px !important; }
        }
      `}</style>

      <div className="scorecard-page" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Top actions bar — hidden in print */}
        <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Link href={`/dashboard/partners/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#888", fontSize: ".875rem", textDecoration: "none" }}>
            <ArrowLeft size={16} /> Back to Partner
          </Link>
          <button
            onClick={() => window.print()}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#222", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: ".8rem", cursor: "pointer" }}
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, borderBottom: "1px solid #222", paddingBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", margin: 0 }}>{partner.name}</h1>
              <span style={{
                display: "inline-flex", padding: "3px 10px", borderRadius: 12,
                fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em",
                border: `1px solid ${tierColor(partner.tier || "bronze")}`,
                color: tierColor(partner.tier || "bronze"),
              }}>
                {TIER_LABELS[partner.tier || "bronze"] || partner.tier}
              </span>
            </div>
            <div style={{ display: "flex", gap: 20, color: "#888", fontSize: ".8rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Building2 size={13} /> {PARTNER_TYPE_LABELS[partner.type as keyof typeof PARTNER_TYPE_LABELS] || partner.type}
              </span>
              {partner.email && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Mail size={13} /> {partner.email}
                </span>
              )}
              {partner.territory && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={13} /> {partner.territory}
                </span>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: ".7rem", color: "#555", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Partner Scorecard</div>
            <div style={{ fontSize: ".75rem", color: "#666" }}>{generatedDate}</div>
          </div>
        </div>

        {/* ── Health Score Banner ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, background: "#111", border: "1px solid #222", borderRadius: 12, padding: "16px 24px", marginBottom: 24 }}>
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#222" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="28" fill="none"
                stroke={healthColor(metrics.healthScore)}
                strokeWidth="5"
                strokeDasharray={`${(metrics.healthScore / 100) * 175.9} 175.9`}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, color: healthColor(metrics.healthScore) }}>
              {metrics.healthScore}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#fff" }}>
              Health Score: <span style={{ color: healthColor(metrics.healthScore) }}>{healthLabel(metrics.healthScore)}</span>
            </div>
            <div style={{ fontSize: ".8rem", color: "#888", marginTop: 2 }}>
              {metrics.daysSinceActivity < 999
                ? `Last activity ${metrics.daysSinceActivity === 0 ? "today" : `${metrics.daysSinceActivity}d ago`}`
                : "No recorded activity"
              }
              {" · "}{metrics.wonDeals} deals won · {metrics.openDeals} in pipeline
            </div>
          </div>
        </div>

        {/* ── Key Metrics Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <MetricCard label="Total Revenue" value={formatCurrency(metrics.totalRevenue)} icon={DollarSign} trend={metrics.revenueTrend} sub={`${metrics.wonDeals} closed-won deals`} />
          <MetricCard label="Open Pipeline" value={formatCurrency(metrics.openPipeline)} icon={Target} sub={`${metrics.openDeals} active deals`} />
          <MetricCard label="Win Rate" value={`${metrics.winRate}%`} icon={Award} sub={`${metrics.wonDeals}W / ${metrics.lostDeals}L`} />
          <MetricCard label="Avg Deal Size" value={formatCurrency(metrics.avgDealSize)} icon={BarChart3} sub={metrics.avgVelocity > 0 ? `${metrics.avgVelocity}d avg velocity` : undefined} />
        </div>

        {/* ── Commission Summary ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
          <MetricCard label="Total Commissions" value={formatCurrency(metrics.totalCommissions)} icon={Handshake} />
          <MetricCard label="Paid" value={formatCurrency(metrics.paidCommissions)} icon={Shield} />
          <MetricCard label="Pending" value={formatCurrency(metrics.pendingCommissions)} icon={Clock} />
        </div>

        {/* ── Revenue Trend (6 months) ── */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
          <h3 style={{ fontSize: ".85rem", fontWeight: 600, color: "#fff", margin: "0 0 16px" }}>
            <Activity size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
            Revenue Trend (6 Months)
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {metrics.monthlyRevenue.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: ".65rem", color: "#888" }}>
                  {m.revenue > 0 ? formatCurrency(m.revenue) : "—"}
                </span>
                <div style={{
                  width: "100%",
                  height: Math.max(4, (m.revenue / maxMonthlyRev) * 100),
                  background: m.revenue > 0 ? "linear-gradient(to top, #4f46e5, #818cf8)" : "#222",
                  borderRadius: "4px 4px 0 0",
                  transition: "height .3s",
                }} />
                <span style={{ fontSize: ".65rem", color: "#666" }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top Deals ── */}
        {metrics.topDeals.length > 0 && (
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: ".85rem", fontWeight: 600, color: "#fff", margin: "0 0 12px" }}>
              <TrendingUp size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Top Closed Deals
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {metrics.topDeals.map((deal: any, i: number) => (
                <div key={deal._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#0a0a0a", borderRadius: 8, border: "1px solid #1a1a1a" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: ".7rem", fontWeight: 700, color: "#555", width: 18 }}>#{i + 1}</span>
                    <div>
                      <div style={{ fontSize: ".8rem", fontWeight: 500, color: "#fff" }}>{deal.name || deal.dealName || "Untitled Deal"}</div>
                      {deal.productName && <div style={{ fontSize: ".65rem", color: "#666" }}>{deal.productName}</div>}
                    </div>
                  </div>
                  <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#22c55e" }}>{formatCurrency(deal.amount || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Insights ── */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "20px 24px" }}>
          <h3 style={{ fontSize: ".85rem", fontWeight: 600, color: "#fff", margin: "0 0 12px" }}>
            💡 Key Insights
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: ".8rem", color: "#ccc" }}>
            {metrics.totalRevenue > 0 && metrics.totalCommissions > 0 && (
              <p style={{ margin: 0 }}>
                Commission-to-revenue ratio: <strong style={{ color: "#fff" }}>
                  {(metrics.totalCommissions / metrics.totalRevenue * 100).toFixed(1)}%
                </strong>
              </p>
            )}
            {metrics.revenueTrend > 0 && (
              <p style={{ margin: 0, color: "#22c55e" }}>
                📈 Revenue is trending <strong>up {metrics.revenueTrend}%</strong> vs prior 90 days
              </p>
            )}
            {metrics.revenueTrend < 0 && (
              <p style={{ margin: 0, color: "#ef4444" }}>
                📉 Revenue is trending <strong>down {Math.abs(metrics.revenueTrend)}%</strong> vs prior 90 days — may need attention
              </p>
            )}
            {metrics.winRate >= 60 && (
              <p style={{ margin: 0 }}>
                🎯 Win rate of <strong style={{ color: "#22c55e" }}>{metrics.winRate}%</strong> is above average — strong deal execution
              </p>
            )}
            {metrics.winRate > 0 && metrics.winRate < 30 && (
              <p style={{ margin: 0 }}>
                ⚠️ Win rate of <strong style={{ color: "#eab308" }}>{metrics.winRate}%</strong> — consider enablement or deal qualification review
              </p>
            )}
            {metrics.avgVelocity > 0 && (
              <p style={{ margin: 0 }}>
                ⏱️ Average deal closes in <strong style={{ color: "#fff" }}>{metrics.avgVelocity} days</strong>
              </p>
            )}
            {metrics.pendingCommissions > 0 && (
              <p style={{ margin: 0 }}>
                💰 <strong style={{ color: "#eab308" }}>{formatCurrency(metrics.pendingCommissions)}</strong> in commissions awaiting approval
              </p>
            )}
            {metrics.openPipeline > 0 && (
              <p style={{ margin: 0 }}>
                🔮 <strong style={{ color: "#fff" }}>{formatCurrency(metrics.openPipeline)}</strong> in open pipeline across {metrics.openDeals} deals
              </p>
            )}
            {metrics.daysSinceActivity > 60 && metrics.daysSinceActivity < 999 && (
              <p style={{ margin: 0, color: "#ef4444" }}>
                🚨 No activity in <strong>{metrics.daysSinceActivity} days</strong> — partner may be at risk of churning
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: ".7rem", color: "#555" }}>Generated by Covant · {generatedDate}</span>
          <span style={{ fontSize: ".7rem", color: "#555" }}>covant.ai</span>
        </div>
      </div>
    </>
  );
}
