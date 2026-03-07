"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import {
  DollarSign, TrendingUp, Users, BarChart3, PieChart as PieIcon, Target,
  ArrowRight, Award, Loader2, AlertTriangle, Layers,
} from "lucide-react";
import Link from "next/link";

// --- Dynamic chart imports ---
const ChartPlaceholder = () => <div style={{ height: 260, background: "var(--border)", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />;

const BarChart = dynamic(() => import("recharts").then(m => ({ default: m.BarChart })), { ssr: false, loading: ChartPlaceholder });
const Bar = dynamic(() => import("recharts").then(m => ({ default: m.Bar })), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(m => ({ default: m.ResponsiveContainer })), { ssr: false, loading: ChartPlaceholder });
const Legend = dynamic(() => import("recharts").then(m => ({ default: m.Legend })), { ssr: false });
const PieChart = dynamic(() => import("recharts").then(m => ({ default: m.PieChart })), { ssr: false, loading: ChartPlaceholder });
const Pie = dynamic(() => import("recharts").then(m => ({ default: m.Pie })), { ssr: false });
const Cell = dynamic(() => import("recharts").then(m => ({ default: m.Cell })), { ssr: false });

const TYPE_COLORS: Record<string, string> = {
  reseller: "#6366f1",
  referral: "#22c55e",
  affiliate: "#f59e0b",
  integration: "#ec4899",
  unknown: "#64748b",
};
const TYPE_LABELS: Record<string, string> = {
  reseller: "Reseller",
  referral: "Referral",
  affiliate: "Affiliate",
  integration: "Integration",
  unknown: "Unknown",
};

const TIER_COLORS: Record<string, string> = {
  platinum: "#e5e7eb",
  gold: "#fbbf24",
  silver: "#94a3b8",
  bronze: "#d97706",
  untiered: "#4b5563",
};
const TIER_LABELS: Record<string, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  untiered: "Untiered",
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 12px", fontSize: ".8rem" }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill, margin: 0 }}>
          {p.name}: {formatCurrencyCompact(p.value)}
        </p>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof DollarSign; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span className="muted" style={{ fontSize: ".8rem" }}>{label}</span>
      </div>
      <span style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</span>
      {sub && <span className="muted" style={{ fontSize: ".75rem" }}>{sub}</span>}
    </div>
  );
}

function ConcentrationBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const isRisky = pct > 60;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <span style={{ fontSize: ".8rem", width: 90, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 4,
          background: isRisky ? "#ef4444" : color,
          transition: "width .5s ease",
        }} />
      </div>
      <span style={{
        fontSize: ".8rem", fontWeight: 600, width: 44, textAlign: "right",
        color: isRisky ? "#ef4444" : "var(--fg)",
      }}>
        {pct}%
      </span>
      {isRisky && <AlertTriangle size={14} style={{ color: "#ef4444", flexShrink: 0 }} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div className="skeleton" style={{ height: 32, width: 300, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: 500 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[1, 2, 3, 4].map(i => <div key={i} className="card skeleton" style={{ height: 100 }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="card skeleton" style={{ height: 320 }} />
        <div className="card skeleton" style={{ height: 320 }} />
      </div>
    </div>
  );
}

export default function RevenueIntelligencePage() {
  const data = useQuery(api.revenueIntelligence.getRevenueIntelligence);

  if (data === undefined) return <LoadingSkeleton />;

  if (!data || data.summary.totalRevenue === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(99,102,241,.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <BarChart3 size={28} style={{ color: "#6366f1" }} />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: ".5rem" }}>No Revenue Data Yet</h2>
        <p className="muted" style={{ maxWidth: 400, marginBottom: "1.5rem" }}>
          Revenue intelligence requires closed-won deals. Register deals through the partner portal or import from your CRM.
        </p>
        <Link href="/dashboard/deals" style={{
          padding: "10px 20px", borderRadius: 8, background: "#6366f1", color: "#fff",
          fontWeight: 600, fontSize: ".85rem", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          View Deals <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const { summary, byType, byTier, monthlyRevenue, topDeals, concentration, topPartners } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BarChart3 size={28} style={{ color: "#6366f1" }} />
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
            Revenue Intelligence
          </h1>
        </div>
        <p className="muted" style={{ marginTop: ".25rem" }}>
          Deep analytics on partner-attributed revenue — who&apos;s driving it, where it&apos;s concentrated, and how it&apos;s trending.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrencyCompact(summary.totalRevenue)}
          sub={`${summary.totalDeals} closed-won deals`}
          color="#22c55e"
        />
        <StatCard
          icon={TrendingUp}
          label="Partner-Sourced"
          value={formatCurrencyCompact(summary.partnerSourcedRevenue)}
          sub={`${summary.partnerSourcedPct}% of total revenue`}
          color="#6366f1"
        />
        <StatCard
          icon={Target}
          label="Avg Deal Size"
          value={formatCurrencyCompact(summary.avgDealSize)}
          sub={`${summary.activePartners} active partners`}
          color="#f59e0b"
        />
        <StatCard
          icon={Layers}
          label="Commission Ratio"
          value={`${summary.commissionToRevenueRatio}%`}
          sub={`${formatCurrencyCompact(summary.totalCommissions)} total commissions`}
          color="#ec4899"
        />
      </div>

      {/* Row: Revenue by Type + Revenue by Tier */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Revenue by Partner Type */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <PieIcon size={18} style={{ color: "#6366f1" }} />
            Revenue by Partner Type
          </h3>
          {byType.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byType}
                      dataKey="revenue"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      strokeWidth={0}
                    >
                      {byType.map((entry, i) => (
                        <Cell key={i} fill={TYPE_COLORS[entry.type] || "#64748b"} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {byType.map((entry) => {
                  const pct = summary.totalRevenue > 0 ? Math.round((entry.revenue / summary.totalRevenue) * 100) : 0;
                  return (
                    <div key={entry.type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: TYPE_COLORS[entry.type] || "#64748b", flexShrink: 0 }} />
                      <span style={{ fontSize: ".8rem", flex: 1 }}>{TYPE_LABELS[entry.type] || entry.type}</span>
                      <span style={{ fontSize: ".8rem", fontWeight: 600 }}>{formatCurrencyCompact(entry.revenue)}</span>
                      <span className="muted" style={{ fontSize: ".75rem", width: 36, textAlign: "right" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>No partner-attributed revenue yet</p>
          )}
        </div>

        {/* Revenue by Tier */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={18} style={{ color: "#fbbf24" }} />
            Revenue by Partner Tier
          </h3>
          {byTier.length > 0 ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byTier} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => formatCurrencyCompact(v)} />
                  <YAxis
                    dataKey="tier"
                    type="category"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(v) => TIER_LABELS[v] || v}
                    width={80}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                    {byTier.map((entry, i) => (
                      <Cell key={i} fill={TIER_COLORS[entry.tier] || "#64748b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>No tiered revenue data</p>
          )}
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={18} style={{ color: "#22c55e" }} />
          Monthly Revenue — Partner-Sourced vs Direct
        </h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => formatCurrencyCompact(v)} />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: ".8rem", paddingTop: 8 }}
                iconType="square"
              />
              <Bar dataKey="partnerSourced" name="Partner-Sourced" stackId="rev" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="direct" name="Direct" stackId="rev" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row: Concentration Risk + Top Partners */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Revenue Concentration */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} style={{ color: concentration.top1Pct > 60 ? "#ef4444" : "#f59e0b" }} />
            Revenue Concentration
          </h3>
          <p className="muted" style={{ fontSize: ".78rem", marginBottom: "1rem" }}>
            High concentration means revenue depends on few partners. Diversify below 50% for resilience.
          </p>
          <ConcentrationBar label="Top 1 Partner" pct={concentration.top1Pct} color="#6366f1" />
          <ConcentrationBar label="Top 3 Partners" pct={concentration.top3Pct} color="#8b5cf6" />
          <ConcentrationBar label="Top 5 Partners" pct={concentration.top5Pct} color="#a78bfa" />
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "var(--subtle)", fontSize: ".78rem" }}>
            <span className="muted">Revenue distributed across </span>
            <strong>{concentration.totalPartners}</strong>
            <span className="muted"> contributing partners</span>
          </div>
        </div>

        {/* Top Revenue Partners */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={18} style={{ color: "#6366f1" }} />
            Top Revenue Partners
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {topPartners.slice(0, 8).map((p, i) => {
              const pct = summary.partnerSourcedRevenue > 0 ? Math.round((p.revenue / summary.partnerSourcedRevenue) * 100) : 0;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
                  borderRadius: 6, background: i < 3 ? "rgba(99,102,241,.06)" : "transparent",
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: ".7rem", fontWeight: 700, flexShrink: 0,
                    background: i === 0 ? "#fbbf2420" : i === 1 ? "#94a3b820" : i === 2 ? "#d9770620" : "var(--border)",
                    color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "var(--muted)",
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".82rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    <div className="muted" style={{ fontSize: ".7rem" }}>
                      {TYPE_LABELS[p.type] || p.type} · {TIER_LABELS[p.tier] || p.tier}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: ".82rem", fontWeight: 600 }}>{formatCurrencyCompact(p.revenue)}</div>
                    <div className="muted" style={{ fontSize: ".7rem" }}>{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Deals Table */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <DollarSign size={18} style={{ color: "#22c55e" }} />
          Largest Closed-Won Deals
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Deal", "Amount", "Product", "Partner", "Type", "Tier", "Closed"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "8px 10px", fontSize: ".75rem", fontWeight: 600,
                    color: "var(--muted)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topDeals.map((deal) => (
                <tr key={deal.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px", fontSize: ".82rem", fontWeight: 600 }}>
                    <Link href={`/dashboard/deals/${deal.id}`} style={{ color: "var(--fg)" }}>
                      {deal.name}
                    </Link>
                  </td>
                  <td style={{ padding: "10px", fontSize: ".82rem", fontWeight: 600, color: "#22c55e" }}>
                    {formatCurrency(deal.amount)}
                  </td>
                  <td style={{ padding: "10px", fontSize: ".78rem" }}>
                    {deal.product || <span className="muted">—</span>}
                  </td>
                  <td style={{ padding: "10px", fontSize: ".82rem" }}>
                    {deal.partnerName || <span className="muted">Direct</span>}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {deal.partnerType ? (
                      <span style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: ".7rem", fontWeight: 600,
                        background: `${TYPE_COLORS[deal.partnerType] || "#64748b"}20`,
                        color: TYPE_COLORS[deal.partnerType] || "#64748b",
                      }}>
                        {TYPE_LABELS[deal.partnerType] || deal.partnerType}
                      </span>
                    ) : <span className="muted" style={{ fontSize: ".78rem" }}>—</span>}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {deal.partnerTier ? (
                      <span style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: ".7rem", fontWeight: 600,
                        background: `${TIER_COLORS[deal.partnerTier] || "#4b5563"}20`,
                        color: TIER_COLORS[deal.partnerTier] || "#94a3b8",
                      }}>
                        {TIER_LABELS[deal.partnerTier] || deal.partnerTier}
                      </span>
                    ) : <span className="muted" style={{ fontSize: ".78rem" }}>—</span>}
                  </td>
                  <td style={{ padding: "10px", fontSize: ".78rem" }} className="muted">
                    {new Date(deal.closedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "1rem", fontSize: ".82rem" }}>
        <Link href="/dashboard/reports" style={{ color: "#6366f1", display: "flex", alignItems: "center", gap: 4 }}>
          ← Attribution Reports
        </Link>
        <Link href="/dashboard/reports/qbr" style={{ color: "#6366f1", display: "flex", alignItems: "center", gap: 4 }}>
          QBR Report <ArrowRight size={14} />
        </Link>
        <Link href="/dashboard/reports/export" style={{ color: "#6366f1", display: "flex", alignItems: "center", gap: 4 }}>
          Export Data <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
