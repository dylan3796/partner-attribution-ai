"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatPercent,
  CHART_COLORS,
} from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Briefcase,
  ArrowRight,
  Download,
  Calendar,
  Award,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Minus,
} from "lucide-react";

// Dynamic imports for recharts (heavy library)
const ChartLoadingPlaceholder = () => <div className="h-48 bg-gray-800 animate-pulse rounded" />;

const BarChart = dynamic(() => import("recharts").then(m => ({ default: m.BarChart })), { ssr: false, loading: ChartLoadingPlaceholder });
const Bar = dynamic(() => import("recharts").then(m => ({ default: m.Bar })), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(m => ({ default: m.ResponsiveContainer })), { ssr: false, loading: ChartLoadingPlaceholder });
const AreaChart = dynamic(() => import("recharts").then(m => ({ default: m.AreaChart })), { ssr: false, loading: ChartLoadingPlaceholder });
const Area = dynamic(() => import("recharts").then(m => ({ default: m.Area })), { ssr: false });
const PieChart = dynamic(() => import("recharts").then(m => ({ default: m.PieChart })), { ssr: false, loading: ChartLoadingPlaceholder });
const Pie = dynamic(() => import("recharts").then(m => ({ default: m.Pie })), { ssr: false });
const Cell = dynamic(() => import("recharts").then(m => ({ default: m.Cell })), { ssr: false });

/* ── Quarter helpers ── */

function getCurrentQuarter(): { label: string; start: Date; end: Date; quarterNum: number; year: number } {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3);
  const year = now.getFullYear();
  const start = new Date(year, q * 3, 1);
  const end = new Date(year, q * 3 + 3, 0, 23, 59, 59, 999);
  return { label: `Q${q + 1} ${year}`, start, end, quarterNum: q + 1, year };
}

function getPreviousQuarter(): { label: string; start: Date; end: Date } {
  const now = new Date();
  let q = Math.floor(now.getMonth() / 3) - 1;
  let year = now.getFullYear();
  if (q < 0) { q = 3; year--; }
  const start = new Date(year, q * 3, 1);
  const end = new Date(year, q * 3 + 3, 0, 23, 59, 59, 999);
  return { label: `Q${q + 1} ${year}`, start, end };
}

function inRange(ts: number, start: Date, end: Date) {
  return ts >= start.getTime() && ts <= end.getTime();
}

/* ── Delta badge ── */

function DeltaBadge({ current, previous, format = "percent" }: { current: number; previous: number; format?: "percent" | "currency" | "number" }) {
  if (previous === 0 && current === 0) return <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>—</span>;
  const pct = previous === 0 ? 100 : Math.round(((current - previous) / previous) * 100);
  const isUp = pct > 0;
  const isFlat = pct === 0;
  const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const color = isFlat ? "var(--muted)" : isUp ? "#059669" : "#dc2626";
  const bg = isFlat ? "rgba(128,128,128,.08)" : isUp ? "rgba(5,150,105,.08)" : "rgba(220,38,38,.08)";
  return (
    <span style={{ fontSize: ".75rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3, color, background: bg, padding: "2px 8px", borderRadius: 4 }}>
      <Icon size={12} />
      {isUp ? "+" : ""}{pct}% vs prev quarter
    </span>
  );
}

/* ── Section header ── */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-.01em" }}>{title}</h2>
      {subtitle && <p className="muted" style={{ fontSize: ".8rem", marginTop: 2 }}>{subtitle}</p>}
    </div>
  );
}

/* ── Main page ── */

export default function QBRPage() {
  const stats = useQuery(api.dashboard.getStats);
  const trends = useQuery(api.dashboard.getTrends);
  const topPartners = useQuery(api.dashboard.getTopPartners);
  const pipelineData = useQuery(api.dashboard.getPipelineDeals);
  const actionItems = useQuery(api.dashboard.getActionItems);
  const partnerPerformance = useQuery(api.dashboard.getPartnerPerformance);

  const currentQ = getCurrentQuarter();
  const prevQ = getPreviousQuarter();

  // Loading
  if (stats === undefined || trends === undefined || topPartners === undefined || pipelineData === undefined) {
    return <QBRSkeleton />;
  }

  // Flatten pipeline deals from the grouped object into an array
  const allPipelineDeals = [...(pipelineData.open ?? []), ...(pipelineData.won ?? []), ...(pipelineData.lost ?? [])];

  return <QBRContent
    stats={stats}
    trends={trends}
    topPartners={topPartners}
    pipelineDeals={allPipelineDeals}
    actionItems={actionItems}
    partnerPerformance={partnerPerformance}
    currentQ={currentQ}
    prevQ={prevQ}
  />;
}

function QBRSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div className="skeleton" style={{ height: 40, width: 320 }} />
      <div className="skeleton" style={{ height: 18, width: 460 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[1,2,3,4].map(i => <div key={i} className="card"><div className="skeleton" style={{ height: 100 }} /></div>)}
      </div>
      <div className="card"><div className="skeleton" style={{ height: 300 }} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="card"><div className="skeleton" style={{ height: 280 }} /></div>
        <div className="card"><div className="skeleton" style={{ height: 280 }} /></div>
      </div>
    </div>
  );
}

type QBRContentProps = {
  stats: any;
  trends: any;
  topPartners: any[];
  pipelineDeals: any[];
  actionItems: any;
  partnerPerformance: any[] | undefined;
  currentQ: ReturnType<typeof getCurrentQuarter>;
  prevQ: ReturnType<typeof getPreviousQuarter>;
};

function QBRContent({ stats, trends, topPartners, pipelineDeals, actionItems, partnerPerformance, currentQ, prevQ }: QBRContentProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  // ── Compute quarter-over-quarter deltas from trends ──
  // trends has 12 monthly buckets. Current month = index 11.
  // Current quarter ≈ last 3 months (9,10,11), Previous ≈ (6,7,8)
  const rev = trends?.revenue ?? [];
  const pip = trends?.pipeline ?? [];
  const prt = trends?.partners ?? [];
  const wr = trends?.winRate ?? [];

  const currentQRevenue = rev.slice(-3).reduce((a: number, b: number) => a + b, 0) || stats.totalRevenue;
  const prevQRevenue = rev.slice(-6, -3).reduce((a: number, b: number) => a + b, 0) || 0;
  const currentQPipeline = pip.length > 0 ? pip[pip.length - 1] : stats.pipelineValue;
  const prevQPipeline = pip.length >= 4 ? pip[pip.length - 4] : 0;
  const currentQPartners = prt.length > 0 ? prt[prt.length - 1] : stats.totalPartners;
  const prevQPartners = prt.length >= 4 ? prt[prt.length - 4] : 0;
  const currentQWinRate = wr.length > 0 ? wr[wr.length - 1] : stats.winRate;
  const prevQWinRate = wr.length >= 4 ? wr[wr.length - 4] : 0;

  // ── Revenue trend chart data ──
  const monthLabels = ["12mo ago", "11mo", "10mo", "9mo", "8mo", "7mo", "6mo", "5mo", "4mo", "3mo", "2mo", "Last mo"];
  const revenueChartData = rev.map((v: number, i: number) => ({
    month: monthLabels[i] ?? `M${i}`,
    revenue: v,
    pipeline: pip[i] ?? 0,
  }));

  // ── Pipeline breakdown ──
  const pipelineByStatus = useMemo(() => {
    const buckets: Record<string, { count: number; value: number }> = {};
    (pipelineDeals ?? []).forEach((d: any) => {
      const s = d.status || "open";
      if (!buckets[s]) buckets[s] = { count: 0, value: 0 };
      buckets[s].count++;
      buckets[s].value += d.amount || 0;
    });
    return Object.entries(buckets).map(([status, data]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
      value: data.value,
      count: data.count,
    }));
  }, [pipelineDeals]);

  // ── Partner leaderboard for QBR ──
  const partnerLeaderboard = useMemo(() => {
    if (!partnerPerformance) return topPartners.slice(0, 5);
    return [...partnerPerformance]
      .sort((a: any, b: any) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 5);
  }, [partnerPerformance, topPartners]);

  // ── Commission spend ──
  const totalCommissions = stats.totalCommissions || 0;
  const pendingPayouts = stats.pendingPayouts || 0;

  // ── Print/export handler ──
  function handlePrint() {
    window.print();
  }

  // ── Progress through quarter ──
  const now = new Date();
  const quarterProgress = Math.min(100, Math.round(((now.getTime() - currentQ.start.getTime()) / (currentQ.end.getTime() - currentQ.start.getTime())) * 100));

  return (
    <div ref={reportRef} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".25rem" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
              Quarterly Business Review
            </h1>
            <span style={{
              fontSize: ".75rem", fontWeight: 700, padding: "4px 10px", borderRadius: 6,
              background: "rgba(99,102,241,.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,.2)",
            }}>
              {currentQ.label}
            </span>
          </div>
          <p className="muted" style={{ fontSize: ".85rem" }}>
            Executive summary of partner program performance · Generated {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button className="btn-outline" onClick={handlePrint} style={{ fontSize: ".8rem", padding: ".5rem 1rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
            <Download size={14} />
            Print / PDF
          </button>
          <Link href="/dashboard/reports" className="btn-outline" style={{ fontSize: ".8rem", padding: ".5rem 1rem" }}>
            ← All Reports
          </Link>
        </div>
      </div>

      {/* ── Quarter Progress ── */}
      <div className="card" style={{ padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Calendar size={14} color="var(--muted)" />
            <span style={{ fontSize: ".8rem", fontWeight: 600 }}>{currentQ.label} Progress</span>
          </div>
          <span className="muted" style={{ fontSize: ".75rem" }}>{quarterProgress}% complete</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${quarterProgress}%`, borderRadius: 3, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".35rem" }}>
          <span className="muted" style={{ fontSize: ".7rem" }}>{currentQ.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          <span className="muted" style={{ fontSize: ".7rem" }}>{currentQ.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
      </div>

      {/* ── Executive Summary Stats ── */}
      <div>
        <SectionHeader title="Executive Summary" subtitle="Key metrics vs. previous quarter" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <StatCard
            label="Partner Revenue"
            value={formatCurrencyCompact(currentQRevenue)}
            icon={<DollarSign size={18} />}
            iconBg="#ecfdf5"
            iconColor="#065f46"
            delta={<DeltaBadge current={currentQRevenue} previous={prevQRevenue} />}
            subtext={`${stats.wonDeals} closed-won deals`}
          />
          <StatCard
            label="Active Pipeline"
            value={formatCurrencyCompact(currentQPipeline)}
            icon={<Briefcase size={18} />}
            iconBg="#eef2ff"
            iconColor="#3730a3"
            delta={<DeltaBadge current={currentQPipeline} previous={prevQPipeline} />}
            subtext={`${stats.openDeals} open deals`}
          />
          <StatCard
            label="Partner Count"
            value={String(currentQPartners)}
            icon={<Users size={18} />}
            iconBg="#f0fdf4"
            iconColor="#166534"
            delta={<DeltaBadge current={currentQPartners} previous={prevQPartners} />}
            subtext={`${stats.activePartners} active`}
          />
          <StatCard
            label="Win Rate"
            value={`${currentQWinRate}%`}
            icon={<Target size={18} />}
            iconBg="#fffbeb"
            iconColor="#92400e"
            delta={<DeltaBadge current={currentQWinRate} previous={prevQWinRate} />}
            subtext={`Avg deal: ${formatCurrencyCompact(stats.avgDealSize)}`}
          />
        </div>
      </div>

      {/* ── Revenue & Pipeline Trend ── */}
      <div>
        <SectionHeader title="Revenue & Pipeline Trend" subtitle="12-month rolling view" />
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pipGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted)" }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: any, name: any) => [formatCurrency(value), name === "revenue" ? "Revenue" : "Pipeline"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", fontSize: ".85rem" }}
                />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="pipeline" name="pipeline" stroke="#6366f1" fill="url(#pipGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: ".75rem" }}>
            <LegendDot color="#10b981" label="Revenue (Closed-Won)" />
            <LegendDot color="#6366f1" label="Pipeline (Open)" />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* ── Pipeline Breakdown ── */}
        <div>
          <SectionHeader title="Pipeline Breakdown" subtitle="Deals by stage" />
          <div className="card" style={{ padding: "1.25rem" }}>
            {pipelineByStatus.length === 0 ? (
              <p className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>No pipeline data</p>
            ) : (
              <>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pipelineByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                        {pipelineByStatus.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                        contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", fontSize: ".85rem" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: ".5rem" }}>
                  {pipelineByStatus.map((item, i) => (
                    <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: ".8rem" }}>{item.name}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: ".8rem", fontWeight: 600 }}>{formatCurrencyCompact(item.value)}</span>
                        <span className="muted" style={{ fontSize: ".7rem", marginLeft: ".5rem" }}>{item.count} deals</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Commission & Payout Summary ── */}
        <div>
          <SectionHeader title="Commission Summary" subtitle="Spend and outstanding payouts" />
          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".25rem" }}>Total Commission Earned</p>
                <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{formatCurrencyCompact(totalCommissions)}</p>
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".25rem" }}>Pending Payouts</p>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f59e0b" }}>{formatCurrencyCompact(pendingPayouts)}</p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".25rem" }}>Paid Out</p>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#059669" }}>{formatCurrencyCompact(totalCommissions - pendingPayouts)}</p>
                </div>
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".5rem" }}>Commission-to-Revenue Ratio</p>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      width: `${currentQRevenue > 0 ? Math.min(100, (totalCommissions / currentQRevenue) * 100) : 0}%`,
                      background: "linear-gradient(90deg, #10b981, #059669)",
                    }} />
                  </div>
                  <span style={{ fontSize: ".85rem", fontWeight: 700, minWidth: 45 }}>
                    {currentQRevenue > 0 ? `${((totalCommissions / currentQRevenue) * 100).toFixed(1)}%` : "—"}
                  </span>
                </div>
              </div>
              <Link href="/dashboard/payouts" style={{ fontSize: ".8rem", color: "#6366f1", fontWeight: 500, display: "flex", alignItems: "center", gap: ".3rem" }}>
                View all payouts <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Performing Partners ── */}
      <div>
        <SectionHeader title="Top Performing Partners" subtitle="Ranked by revenue contribution" />
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                <th style={thStyle}>#</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Partner</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Type</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Tier</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Revenue</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Deals</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Commission Rate</th>
              </tr>
            </thead>
            <tbody>
              {partnerLeaderboard.map((p: any, i: number) => (
                <tr key={p._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ ...tdStyle, color: "var(--muted)", fontWeight: 500 }}>
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: ".65rem" }}>
                        {(p.name || "?").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <Link href={`/dashboard/partners/${p._id}`} style={{ fontWeight: 500, fontSize: ".85rem" }}>
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--muted)", textTransform: "capitalize" }}>{p.type}</td>
                  <td style={tdStyle}>
                    <span style={{
                      fontSize: ".7rem", fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                      background: p.tier === "gold" ? "rgba(234,179,8,.1)" : p.tier === "silver" ? "rgba(148,163,184,.1)" : "rgba(180,83,9,.1)",
                      color: p.tier === "gold" ? "#ca8a04" : p.tier === "silver" ? "#64748b" : "#b45309",
                    }}>
                      {(p.tier || "standard").charAt(0).toUpperCase() + (p.tier || "standard").slice(1)}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>
                    {formatCurrencyCompact(p.revenue || p.totalRevenue || 0)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{p.dealCount ?? p.deals ?? "—"}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <span style={{ color: "#059669", fontWeight: 600 }}>{p.commissionRate ?? "—"}%</span>
                  </td>
                </tr>
              ))}
              {partnerLeaderboard.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center" }}>
                    <p className="muted">No partner data yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action Items & Risks ── */}
      <div>
        <SectionHeader title="Open Action Items" subtitle="Items requiring attention this quarter" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: ".75rem" }}>
          {actionItems ? (
            <>
              <ActionCard icon="📋" label="Pending Deal Registrations" value={actionItems.pendingDealRegs} status={actionItems.pendingDealRegs > 3 ? "warning" : "healthy"} href="/dashboard/deals" />
              <ActionCard icon="💰" label="Unpaid Commissions" value={formatCurrencyCompact(actionItems.unpaidCommissions)} status={actionItems.unpaidCommissions > 10000 ? "warning" : "healthy"} href="/dashboard/payouts" />
              <ActionCard icon="🏆" label="Tier Reviews Due" value={actionItems.tierReviewsPending} status={actionItems.tierReviewsPending > 0 ? "warning" : "healthy"} href="/dashboard/scoring" />
              <ActionCard icon="🚀" label="Partners Onboarding" value={actionItems.partnersOnboarding} status="info" href="/dashboard/partners" />
              <ActionCard icon="✉️" label="Pending Invites" value={actionItems.pendingInvites} status={actionItems.pendingInvites > 5 ? "warning" : "healthy"} href="/dashboard/partners" />
              <ActionCard icon="📧" label="Email Triggers" value={`${actionItems.emailTriggersActive}/${actionItems.emailTriggersTotal}`} status="info" href="/dashboard/emails" />
            </>
          ) : (
            <p className="muted" style={{ padding: "1rem" }}>Loading action items...</p>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <p className="muted" style={{ fontSize: ".75rem" }}>
          Generated by Covant · {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </p>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <Link href="/dashboard/reports" className="btn-outline" style={{ fontSize: ".8rem", padding: ".4rem 1rem" }}>
            Attribution Reports
          </Link>
          <Link href="/dashboard/reports/reconciliation" className="btn-outline" style={{ fontSize: ".8rem", padding: ".4rem 1rem" }}>
            Reconciliation
          </Link>
        </div>
      </div>

      {/* ── Print styles ── */}
      <style jsx>{`
        @media print {
          :global(.dash-layout-v2 > aside),
          :global(.dash-topbar),
          :global(.dash-layout-v2 .mobile-menu-btn) {
            display: none !important;
          }
          :global(.dash-main) {
            margin: 0 !important;
            padding: 0 !important;
          }
          :global(.dash-main-inner) {
            padding: 1rem !important;
          }
          :global(.btn-outline),
          :global(.btn) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Reusable stat card ── */

function StatCard({ label, value, icon, iconBg, iconColor, delta, subtext }: {
  label: string; value: string; icon: React.ReactNode; iconBg: string; iconColor: string;
  delta: React.ReactNode; subtext: string;
}) {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>{label}</p>
          <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{value}</p>
        </div>
        <div style={{ background: iconBg, padding: ".5rem", borderRadius: 8, color: iconColor }}>{icon}</div>
      </div>
      <div style={{ marginTop: ".5rem", display: "flex", flexDirection: "column", gap: ".25rem" }}>
        {delta}
        <p className="muted" style={{ fontSize: ".75rem" }}>{subtext}</p>
      </div>
    </div>
  );
}

/* ── Action card ── */

function ActionCard({ icon, label, value, status, href }: {
  icon: string; label: string; value: string | number; status: "healthy" | "warning" | "info"; href: string;
}) {
  const statusColor = status === "warning" ? "#f59e0b" : status === "healthy" ? "#22c55e" : "#6366f1";
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: ".75rem", transition: "border-color 0.15s" }}>
        <span style={{ fontSize: "1.2rem" }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: ".9rem", fontWeight: 700, color: statusColor }}>{value}</div>
          <div className="muted" style={{ fontSize: ".72rem" }}>{label}</div>
        </div>
        {status === "warning" && <AlertTriangle size={14} color="#f59e0b" />}
        {status === "healthy" && <CheckCircle2 size={14} color="#22c55e" />}
        <ArrowUpRight size={14} style={{ color: "var(--muted)" }} />
      </div>
    </Link>
  );
}

/* ── Legend dot ── */

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
      <span className="muted" style={{ fontSize: ".75rem" }}>{label}</span>
    </div>
  );
}

/* ── Styles ── */

const thStyle: React.CSSProperties = {
  padding: ".75rem 1rem",
  fontSize: ".75rem",
  fontWeight: 600,
  color: "var(--muted)",
  textTransform: "uppercase" as const,
  letterSpacing: ".03em",
};

const tdStyle: React.CSSProperties = {
  padding: ".75rem 1rem",
  fontSize: ".85rem",
};
