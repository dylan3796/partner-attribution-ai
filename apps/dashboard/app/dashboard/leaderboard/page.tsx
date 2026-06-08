"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import {
  Trophy, Medal, Crown, TrendingUp, Target, Zap, DollarSign,
  Users, ArrowUpRight, ChevronDown,
} from "lucide-react";

type Period = "thirtyDay" | "ninetyDay" | "allTime";

const PERIOD_LABELS: Record<Period, string> = {
  thirtyDay: "Last 30 Days",
  ninetyDay: "Last 90 Days",
  allTime: "All Time",
};

type RankedPartner = {
  id: string;
  name: string;
  tier: string;
  type: string;
  email: string;
  revenue: number;
  totalDeals: number;
  wonDeals: number;
  winRate: number;
  touchpoints: number;
  commissionsEarned: number;
  commissionsPending: number;
  composite: number;
  rank: number;
};

const TIER_COLORS: Record<string, { bg: string; fg: string }> = {
  platinum: { bg: "#e0e7ff", fg: "#3730a3" },
  gold: { bg: "#fef3c7", fg: "#92400e" },
  silver: { bg: "#f3f4f6", fg: "#374151" },
  bronze: { bg: "#fed7aa", fg: "#9a3412" },
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#78350f", fontWeight: 900, fontSize: "1.1rem", boxShadow: "0 0 12px #fbbf2440" }}>
      <Crown size={20} />
    </div>
  );
  if (rank === 2) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #d1d5db, #9ca3af)", color: "#1f2937", fontWeight: 900, fontSize: "1.1rem", boxShadow: "0 0 12px #9ca3af40" }}>
      <Medal size={20} />
    </div>
  );
  if (rank === 3) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #fdba74, #f97316)", color: "#7c2d12", fontWeight: 900, fontSize: "1.1rem", boxShadow: "0 0 12px #f9731640" }}>
      <Trophy size={18} />
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "var(--subtle)", color: "var(--muted)", fontWeight: 800, fontSize: "1rem" }}>
      {rank}
    </div>
  );
}

function CompositeBar({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.4s ease-out" }} />
      </div>
      <span style={{ fontSize: ".8rem", fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>{score}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("ninetyDay");
  const [sortBy, setSortBy] = useState<"composite" | "revenue" | "totalDeals" | "winRate" | "touchpoints">("composite");

  const data = useQuery(api.leaderboard.getRankings);

  if (data === undefined) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ height: 32, width: 200, background: "var(--subtle)", borderRadius: 8, marginBottom: "1.5rem" }} className="skeleton-shimmer" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: 72, background: "var(--subtle)", borderRadius: 10, marginBottom: 8 }} className="skeleton-shimmer" />
        ))}
      </div>
    );
  }

  const rankings = data.periods[period] as RankedPartner[];

  // Re-sort if not composite
  const sorted = [...rankings].sort((a, b) => {
    if (sortBy === "composite") return a.rank - b.rank;
    return (b[sortBy] as number) - (a[sortBy] as number);
  });

  // Stats
  const totalRevenue = rankings.reduce((s, p) => s + p.revenue, 0);
  const totalDeals = rankings.reduce((s, p) => s + p.totalDeals, 0);
  const avgWinRate = rankings.length > 0 ? Math.round(rankings.reduce((s, p) => s + p.winRate, 0) / rankings.length) : 0;
  const topPerformer = rankings[0];

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Trophy size={24} color="#fbbf24" /> Partner Leaderboard
          </h1>
          <p className="muted" style={{ marginTop: ".25rem" }}>Performance rankings across your partner program</p>
        </div>
        {/* Period toggle */}
        <div style={{ display: "flex", gap: 4, background: "var(--subtle)", borderRadius: 8, padding: 3 }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "6px 14px", borderRadius: 6, fontSize: ".8rem", fontWeight: 600,
                border: "none", cursor: "pointer", transition: "all 0.15s",
                background: period === p ? "white" : "transparent",
                color: period === p ? "#111" : "var(--muted)",
                boxShadow: period === p ? "0 1px 3px rgba(0,0,0,.15)" : "none",
              }}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: ".75rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Revenue", value: formatCurrencyCompact(totalRevenue), icon: DollarSign, color: "#22c55e" },
          { label: "Total Deals", value: String(totalDeals), icon: Target, color: "#3b82f6" },
          { label: "Avg Win Rate", value: `${avgWinRate}%`, icon: TrendingUp, color: "#8b5cf6" },
          { label: "Ranked Partners", value: String(rankings.length), icon: Users, color: "#f97316" },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".72rem", fontWeight: 500 }}>{stat.label}</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 800 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top 3 podium (only show if 3+ partners) */}
      {rankings.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem", marginBottom: "1.5rem" }}>
          {rankings.slice(0, 3).map((p, i) => {
            const medals = ["🥇", "🥈", "🥉"];
            const gradients = [
              "linear-gradient(135deg, #fef3c710, #fbbf2410)",
              "linear-gradient(135deg, #f3f4f610, #9ca3af10)",
              "linear-gradient(135deg, #fed7aa10, #f9731610)",
            ];
            const borders = ["#fbbf2440", "#9ca3af40", "#f9731640"];
            return (
              <Link
                key={p.id}
                href={`/dashboard/partners/${p.id}`}
                className="card"
                style={{
                  padding: "1.25rem", textAlign: "center", textDecoration: "none",
                  background: gradients[i], borderColor: borders[i],
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: ".25rem" }}>{medals[i]}</div>
                <p style={{ fontWeight: 800, fontSize: "1rem", marginBottom: ".15rem" }}>{p.name}</p>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".75rem" }}>
                  {p.type} · {p.tier}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#22c55e" }}>{formatCurrencyCompact(p.revenue)}</p>
                    <p className="muted" style={{ fontSize: ".65rem" }}>Revenue</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "1.1rem" }}>{p.wonDeals}/{p.totalDeals}</p>
                    <p className="muted" style={{ fontSize: ".65rem" }}>Won/Total</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#8b5cf6" }}>{p.winRate}%</p>
                    <p className="muted" style={{ fontSize: ".65rem" }}>Win Rate</p>
                  </div>
                </div>
                <div style={{ marginTop: ".75rem" }}>
                  <CompositeBar score={p.composite} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Sort controls */}
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
        <span className="muted" style={{ fontSize: ".8rem", fontWeight: 500 }}>Sort by:</span>
        {([
          { key: "composite", label: "Overall Score" },
          { key: "revenue", label: "Revenue" },
          { key: "totalDeals", label: "Deals" },
          { key: "winRate", label: "Win Rate" },
          { key: "touchpoints", label: "Engagement" },
        ] as { key: typeof sortBy; label: string }[]).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            style={{
              padding: "4px 10px", borderRadius: 6, fontSize: ".75rem", fontWeight: 600,
              border: sortBy === opt.key ? "1px solid #6366f1" : "1px solid var(--border)",
              background: sortBy === opt.key ? "#6366f120" : "transparent",
              color: sortBy === opt.key ? "#6366f1" : "var(--muted)",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Rankings table */}
      {sorted.length === 0 ? (
        <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <Trophy size={48} color="var(--muted)" style={{ marginBottom: ".75rem" }} />
          <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: ".25rem" }}>No partners ranked yet</p>
          <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
            Add partners and register deals to see the leaderboard come alive.
          </p>
          <Link href="/dashboard/partners" className="btn" style={{ fontSize: ".85rem", padding: ".5rem 1.25rem" }}>
            Add Partners →
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "50px 1fr 120px 80px 80px 80px 140px",
            gap: "1rem", padding: ".75rem 1.25rem",
            borderBottom: "1px solid var(--border)",
            fontSize: ".72rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em",
          }}>
            <span>Rank</span>
            <span>Partner</span>
            <span style={{ textAlign: "right" }}>Revenue</span>
            <span style={{ textAlign: "center" }}>Deals</span>
            <span style={{ textAlign: "center" }}>Win %</span>
            <span style={{ textAlign: "center" }}>Activity</span>
            <span>Score</span>
          </div>

          {sorted.map((p, i) => {
            const tierStyle = TIER_COLORS[p.tier] ?? TIER_COLORS.bronze;
            return (
              <Link
                key={p.id}
                href={`/dashboard/partners/${p.id}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "50px 1fr 120px 80px 80px 80px 140px",
                  gap: "1rem", padding: ".75rem 1.25rem",
                  alignItems: "center", textDecoration: "none",
                  borderBottom: i < sorted.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.1s",
                }}
                className="list-item-hover"
              >
                <RankBadge rank={sortBy === "composite" ? p.rank : i + 1} />
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", minWidth: 0 }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: ".65rem", flexShrink: 0 }}>
                    {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: ".85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
                      <span style={{
                        fontSize: ".6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                        background: tierStyle.bg, color: tierStyle.fg, textTransform: "uppercase",
                      }}>
                        {p.tier}
                      </span>
                      <span className="muted" style={{ fontSize: ".7rem" }}>{p.type}</span>
                    </div>
                  </div>
                </div>
                <p style={{ textAlign: "right", fontWeight: 700, fontSize: ".9rem", color: p.revenue > 0 ? "#22c55e" : "var(--muted)" }}>
                  {formatCurrencyCompact(p.revenue)}
                </p>
                <p style={{ textAlign: "center", fontWeight: 700, fontSize: ".9rem" }}>
                  <span style={{ color: "#22c55e" }}>{p.wonDeals}</span>
                  <span className="muted">/{p.totalDeals}</span>
                </p>
                <p style={{ textAlign: "center", fontWeight: 700, fontSize: ".9rem", color: p.winRate >= 50 ? "#22c55e" : p.winRate >= 25 ? "#eab308" : "var(--muted)" }}>
                  {p.winRate}%
                </p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
                  <Zap size={12} color={p.touchpoints > 0 ? "#8b5cf6" : "var(--muted)"} />
                  <span style={{ fontWeight: 600, fontSize: ".85rem", color: p.touchpoints > 0 ? "#8b5cf6" : "var(--muted)" }}>{p.touchpoints}</span>
                </div>
                <CompositeBar score={p.composite} />
              </Link>
            );
          })}
        </div>
      )}

      {/* Commission summary */}
      {sorted.length > 0 && sorted.some((p) => p.commissionsEarned > 0 || p.commissionsPending > 0) && (
        <div className="card" style={{ padding: "1.25rem", marginTop: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <DollarSign size={16} color="#22c55e" /> Commission Summary
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".5rem" }}>
            {sorted.filter((p) => p.commissionsEarned > 0 || p.commissionsPending > 0).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem .75rem", borderRadius: 6, border: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 600, fontSize: ".8rem" }}>{p.name}</span>
                <div style={{ display: "flex", gap: ".75rem", fontSize: ".8rem" }}>
                  {p.commissionsEarned > 0 && (
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>{formatCurrencyCompact(p.commissionsEarned)} paid</span>
                  )}
                  {p.commissionsPending > 0 && (
                    <span style={{ color: "#eab308", fontWeight: 600 }}>{formatCurrencyCompact(p.commissionsPending)} pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
