"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal } from "lucide-react";
import { PARTNER_TYPE_LABELS, TIER_LABELS } from "@/lib/types";

const TIER_ORDER = { platinum: 4, gold: 3, silver: 2, bronze: 1 };
const TIER_COLORS: Record<string, string> = {
  platinum: "#a78bfa",
  gold: "#f59e0b",
  silver: "#94a3b8",
  bronze: "#d97706",
};

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Top Performer": { bg: "rgba(34,197,94,.15)", text: "#22c55e", border: "rgba(34,197,94,.3)" },
  "Strategic": { bg: "rgba(99,102,241,.15)", text: "#818cf8", border: "rgba(99,102,241,.3)" },
  "At Risk": { bg: "rgba(239,68,68,.15)", text: "#ef4444", border: "rgba(239,68,68,.3)" },
  "Needs Attention": { bg: "rgba(245,158,11,.15)", text: "#f59e0b", border: "rgba(245,158,11,.3)" },
  "New": { bg: "rgba(6,182,212,.15)", text: "#06b6d4", border: "rgba(6,182,212,.3)" },
  "Expansion": { bg: "rgba(139,92,246,.15)", text: "#8b5cf6", border: "rgba(139,92,246,.3)" },
  "Enterprise": { bg: "rgba(236,72,153,.15)", text: "#ec4899", border: "rgba(236,72,153,.3)" },
  "VIP": { bg: "rgba(249,115,22,.15)", text: "#f97316", border: "rgba(249,115,22,.3)" },
};
const DEFAULT_TAG = { bg: "rgba(148,163,184,.15)", text: "#94a3b8", border: "rgba(148,163,184,.3)" };

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function relTime(ts: number): string {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

type PartnerData = {
  _id: string;
  name: string;
  email: string;
  type: string;
  tier: string;
  status: string;
  commissionRate: number;
  territory: string;
  tags: string[];
  contactName: string;
  totalRevenue: number;
  totalPipeline: number;
  totalDeals: number;
  wonDeals: number;
  winRate: number;
  avgDealSize: number;
  dealsLast30: number;
  dealsLast90: number;
  totalTouchpoints: number;
  touchpointsLast90: number;
  touchpointTypes: Record<string, number>;
  totalEarned: number;
  pendingPayout: number;
  lastActivity: number;
  monthlyRevenue: { month: string; revenue: number; deals: number }[];
};

// Which partner has the best value for a metric (higher = better)
function bestIdx(partners: PartnerData[], getter: (p: PartnerData) => number): number {
  let best = 0;
  for (let i = 1; i < partners.length; i++) {
    if (getter(partners[i]) > getter(partners[best])) best = i;
  }
  return best;
}

const PARTNER_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"];

export default function ComparePartnersPage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";
  const partnerIds = idsParam.split(",").filter(Boolean) as Id<"partners">[];

  const data = useQuery(
    api.partnerCompare.getComparison,
    partnerIds.length >= 2 ? { partnerIds } : "skip"
  );

  if (partnerIds.length < 2) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <Link href="/dashboard/partners" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: ".85rem", textDecoration: "none", marginBottom: "2rem" }}>
          <ArrowLeft size={14} /> Back to Partners
        </Link>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Select Partners to Compare</h2>
        <p className="muted">Select 2–4 partners from the partners list using checkboxes, then click &quot;Compare&quot; in the bulk action bar.</p>
      </div>
    );
  }

  if (data === undefined) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ height: 20, width: 120, background: "var(--border)", borderRadius: 4, marginBottom: "1.5rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${partnerIds.length}, 1fr)`, gap: "1rem" }}>
          {partnerIds.map((_, i) => (
            <div key={i} className="card" style={{ height: 300 }}>
              <div style={{ height: 24, width: "60%", background: "var(--border)", borderRadius: 4, marginBottom: 16 }} />
              <div style={{ height: 16, width: "80%", background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
              <div style={{ height: 16, width: "70%", background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
              <div style={{ height: 16, width: "50%", background: "var(--border)", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const partners = data as PartnerData[];
  if (partners.length < 2) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <Link href="/dashboard/partners" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: ".85rem", textDecoration: "none", marginBottom: "2rem" }}>
          <ArrowLeft size={14} /> Back to Partners
        </Link>
        <h2 style={{ fontWeight: 700 }}>Partners not found</h2>
        <p className="muted">One or more selected partners could not be loaded.</p>
      </div>
    );
  }

  const cols = partners.length;
  const maxRevenue = Math.max(...partners.map((p) => p.totalRevenue), 1);

  // Metric rows with comparison logic
  type MetricRow = {
    label: string;
    values: (string | number)[];
    bestIdx: number;
    format?: "currency" | "pct" | "number";
    raw: number[];
  };

  const metrics: MetricRow[] = [
    {
      label: "Total Revenue",
      raw: partners.map((p) => p.totalRevenue),
      values: partners.map((p) => fmt(p.totalRevenue)),
      bestIdx: bestIdx(partners, (p) => p.totalRevenue),
    },
    {
      label: "Active Pipeline",
      raw: partners.map((p) => p.totalPipeline),
      values: partners.map((p) => fmt(p.totalPipeline)),
      bestIdx: bestIdx(partners, (p) => p.totalPipeline),
    },
    {
      label: "Win Rate",
      raw: partners.map((p) => p.winRate),
      values: partners.map((p) => `${p.winRate}%`),
      bestIdx: bestIdx(partners, (p) => p.winRate),
    },
    {
      label: "Total Deals",
      raw: partners.map((p) => p.totalDeals),
      values: partners.map((p) => p.totalDeals),
      bestIdx: bestIdx(partners, (p) => p.totalDeals),
    },
    {
      label: "Deals Won",
      raw: partners.map((p) => p.wonDeals),
      values: partners.map((p) => p.wonDeals),
      bestIdx: bestIdx(partners, (p) => p.wonDeals),
    },
    {
      label: "Avg Deal Size",
      raw: partners.map((p) => p.avgDealSize),
      values: partners.map((p) => fmt(p.avgDealSize)),
      bestIdx: bestIdx(partners, (p) => p.avgDealSize),
    },
    {
      label: "Deals (Last 30d)",
      raw: partners.map((p) => p.dealsLast30),
      values: partners.map((p) => p.dealsLast30),
      bestIdx: bestIdx(partners, (p) => p.dealsLast30),
    },
    {
      label: "Deals (Last 90d)",
      raw: partners.map((p) => p.dealsLast90),
      values: partners.map((p) => p.dealsLast90),
      bestIdx: bestIdx(partners, (p) => p.dealsLast90),
    },
    {
      label: "Total Touchpoints",
      raw: partners.map((p) => p.totalTouchpoints),
      values: partners.map((p) => p.totalTouchpoints),
      bestIdx: bestIdx(partners, (p) => p.totalTouchpoints),
    },
    {
      label: "Engagement (90d)",
      raw: partners.map((p) => p.touchpointsLast90),
      values: partners.map((p) => p.touchpointsLast90),
      bestIdx: bestIdx(partners, (p) => p.touchpointsLast90),
    },
    {
      label: "Commission Earned",
      raw: partners.map((p) => p.totalEarned),
      values: partners.map((p) => fmt(p.totalEarned)),
      bestIdx: bestIdx(partners, (p) => p.totalEarned),
    },
    {
      label: "Pending Payout",
      raw: partners.map((p) => p.pendingPayout),
      values: partners.map((p) => fmt(p.pendingPayout)),
      bestIdx: bestIdx(partners, (p) => p.pendingPayout),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/dashboard/partners" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: ".85rem", textDecoration: "none", marginBottom: 12 }}>
          <ArrowLeft size={14} /> Back to Partners
        </Link>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
          Partner Comparison
        </h1>
        <p className="muted">
          Side-by-side performance analysis of {partners.length} partners
        </p>
      </div>

      {/* Partner Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {partners.map((p, i) => (
          <Link
            key={p._id}
            href={`/dashboard/partners/${p._id}`}
            className="card"
            style={{
              textDecoration: "none",
              color: "inherit",
              borderTop: `3px solid ${PARTNER_COLORS[i]}`,
              transition: "transform .15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" }}>
              <div
                className="avatar"
                style={{ background: PARTNER_COLORS[i], color: "#fff", fontWeight: 700 }}
              >
                {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>{p.name}</div>
                <div className="muted" style={{ fontSize: ".8rem" }}>{p.contactName || p.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: ".5rem" }}>
              <span className="chip">{PARTNER_TYPE_LABELS[p.type as keyof typeof PARTNER_TYPE_LABELS] ?? p.type}</span>
              <span
                className="badge"
                style={{
                  background: `${TIER_COLORS[p.tier] ?? "#6b7280"}20`,
                  color: TIER_COLORS[p.tier] ?? "#6b7280",
                  border: `1px solid ${TIER_COLORS[p.tier] ?? "#6b7280"}40`,
                }}
              >
                {TIER_LABELS[p.tier as keyof typeof TIER_LABELS] ?? p.tier}
              </span>
              <span className={`badge badge-${p.status === "active" ? "success" : p.status === "pending" ? "info" : "danger"}`}>
                {p.status}
              </span>
            </div>
            {p.tags.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {p.tags.slice(0, 3).map((tag) => {
                  const c = TAG_COLORS[tag] || DEFAULT_TAG;
                  return (
                    <span
                      key={tag}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: ".65rem",
                        fontWeight: 600,
                        background: c.bg,
                        color: c.text,
                        border: `1px solid ${c.border}`,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
            <div className="muted" style={{ fontSize: ".75rem", marginTop: ".5rem" }}>
              {p.territory ? `📍 ${p.territory}` : ""} · {p.commissionRate}% rate · Last active: {relTime(p.lastActivity)}
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue Bars — visual comparison */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={18} color="#f59e0b" /> Revenue Comparison
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {partners.map((p, i) => {
            const pct = maxRevenue > 0 ? (p.totalRevenue / maxRevenue) * 100 : 0;
            const isBest = i === bestIdx(partners, (x) => x.totalRevenue);
            return (
              <div key={p._id} style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <div style={{ width: 120, fontSize: ".85rem", fontWeight: 600, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  {isBest && <Crown size={14} color="#f59e0b" />}
                  {p.name.split(" ")[0]}
                </div>
                <div style={{ flex: 1, height: 28, background: "var(--border)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${PARTNER_COLORS[i]}, ${PARTNER_COLORS[i]}cc)`,
                      borderRadius: 6,
                      transition: "width .6s ease-out",
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: ".8rem",
                    fontWeight: 700,
                  }}>
                    {fmt(p.totalRevenue)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1.5rem" }}>
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>
                  Metric
                </th>
                {partners.map((p, i) => (
                  <th
                    key={p._id}
                    style={{
                      padding: ".8rem",
                      textAlign: "right",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: PARTNER_COLORS[i],
                      borderBottom: `2px solid ${PARTNER_COLORS[i]}`,
                    }}
                  >
                    {p.name.length > 15 ? p.name.slice(0, 14) + "…" : p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((row) => (
                <tr key={row.label} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: ".7rem 1.2rem", fontWeight: 500, fontSize: ".85rem" }}>
                    {row.label}
                  </td>
                  {row.values.map((val, i) => {
                    const isBest = i === row.bestIdx && row.raw[i] > 0;
                    // Check if all values are equal
                    const allEqual = row.raw.every((v) => v === row.raw[0]);
                    return (
                      <td
                        key={i}
                        style={{
                          padding: ".7rem .8rem",
                          textAlign: "right",
                          fontWeight: isBest && !allEqual ? 700 : 400,
                          color: isBest && !allEqual ? "#22c55e" : "inherit",
                          fontSize: ".9rem",
                        }}
                      >
                        {val}
                        {isBest && !allEqual && (
                          <Crown size={12} color="#22c55e" style={{ marginLeft: 6, verticalAlign: "middle" }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={18} color="#6366f1" /> Monthly Revenue Trend (6 months)
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: ".5rem" }}>
          {/* Month headers */}
          {(partners[0]?.monthlyRevenue ?? []).map((m) => (
            <div key={m.month} style={{ textAlign: "center", fontSize: ".75rem", color: "var(--muted)", fontWeight: 600, paddingBottom: ".5rem" }}>
              {m.month}
            </div>
          ))}
          {/* Bars per month per partner */}
          {(partners[0]?.monthlyRevenue ?? []).map((_, mi) => {
            const monthMax = Math.max(...partners.map((p) => p.monthlyRevenue[mi]?.revenue ?? 0), 1);
            return (
              <div key={mi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {partners.map((p, pi) => {
                  const rev = p.monthlyRevenue[mi]?.revenue ?? 0;
                  const pct = (rev / monthMax) * 100;
                  return (
                    <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 16,
                          background: "var(--border)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(pct, rev > 0 ? 4 : 0)}%`,
                            height: "100%",
                            background: PARTNER_COLORS[pi],
                            borderRadius: 4,
                            transition: "width .4s",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: ".65rem", color: "var(--muted)", minWidth: 30, textAlign: "right" }}>
                        {rev > 0 ? fmt(rev) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: "1.5rem", marginTop: ".75rem", justifyContent: "center" }}>
          {partners.map((p, i) => (
            <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".8rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: PARTNER_COLORS[i] }} />
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Insights */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Key Insights</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", fontSize: ".9rem" }}>
          {(() => {
            const insights: string[] = [];

            // Revenue leader
            const revLeader = partners[bestIdx(partners, (p) => p.totalRevenue)];
            const revSecond = partners.filter((p) => p._id !== revLeader._id).sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
            if (revLeader.totalRevenue > 0 && revSecond) {
              const gap = revLeader.totalRevenue - revSecond.totalRevenue;
              insights.push(`${revLeader.name} leads in revenue by ${fmt(gap)} over ${revSecond.name}.`);
            }

            // Win rate comparison
            const wrLeader = partners[bestIdx(partners, (p) => p.winRate)];
            const wrLowest = partners.reduce((min, p) => p.winRate < min.winRate ? p : min, partners[0]);
            if (wrLeader.winRate > wrLowest.winRate && wrLeader._id !== wrLowest._id) {
              insights.push(`${wrLeader.name} has the highest win rate (${wrLeader.winRate}%) — ${wrLeader.winRate - wrLowest.winRate}pp above ${wrLowest.name} (${wrLowest.winRate}%).`);
            }

            // Engagement
            const engLeader = partners[bestIdx(partners, (p) => p.touchpointsLast90)];
            if (engLeader.touchpointsLast90 > 0) {
              insights.push(`${engLeader.name} is most engaged with ${engLeader.touchpointsLast90} touchpoints in the last 90 days.`);
            }

            // Deal size
            const dsLeader = partners[bestIdx(partners, (p) => p.avgDealSize)];
            const dsSmallest = partners.reduce((min, p) => p.avgDealSize > 0 && (min.avgDealSize === 0 || p.avgDealSize < min.avgDealSize) ? p : min, partners[0]);
            if (dsLeader.avgDealSize > dsSmallest.avgDealSize && dsLeader._id !== dsSmallest._id && dsSmallest.avgDealSize > 0) {
              const mult = (dsLeader.avgDealSize / dsSmallest.avgDealSize).toFixed(1);
              insights.push(`${dsLeader.name}'s avg deal (${fmt(dsLeader.avgDealSize)}) is ${mult}× larger than ${dsSmallest.name}'s (${fmt(dsSmallest.avgDealSize)}).`);
            }

            // Inactive warning
            const inactive = partners.filter((p) => p.dealsLast30 === 0 && p.touchpointsLast90 === 0);
            if (inactive.length > 0) {
              insights.push(`⚠️ ${inactive.map((p) => p.name).join(" and ")} ${inactive.length === 1 ? "has" : "have"} no recent activity — may need re-engagement.`);
            }

            if (insights.length === 0) {
              insights.push("Not enough data to generate insights. As partners register deals and log touchpoints, comparison insights will appear here.");
            }

            return insights.map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--muted)", flexShrink: 0 }}>•</span>
                <span style={{ lineHeight: 1.5 }}>{text}</span>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
