"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/utils";
import {
  Trophy,
  TrendingUp,
  BarChart3,
  Target,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  Users,
  Medal,
} from "lucide-react";

/* ── helpers ── */

function tierColor(tier: string) {
  const m: Record<string, string> = {
    bronze: "#cd7f32",
    silver: "#94a3b8",
    gold: "#eab308",
    platinum: "#a78bfa",
  };
  return m[tier] || "#64748b";
}

function tierBgColor(tier: string) {
  const m: Record<string, string> = {
    bronze: "#cd7f3218",
    silver: "#94a3b818",
    gold: "#eab30818",
    platinum: "#a78bfa18",
  };
  return m[tier] || "#64748b18";
}

function scoreColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#6366f1";
  if (score >= 40) return "#eab308";
  return "#ef4444";
}

function getTierFromScore(score: number): string {
  if (score >= 80) return "platinum";
  if (score >= 60) return "gold";
  if (score >= 40) return "silver";
  return "bronze";
}

const TIER_LABELS: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

type PartnerWithStats = {
  _id: Id<"partners">;
  name: string;
  email: string;
  type: "affiliate" | "referral" | "reseller" | "integration";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  status: "active" | "inactive" | "pending";
  commissionRate: number;
  createdAt: number;
  dealCount: number;
  wonDealCount: number;
  revenue: number;
  pendingPayouts: number;
  totalPaid: number;
};

type PartnerScore = {
  id: Id<"partners">;
  name: string;
  type: string;
  currentTier: string;
  calculatedTier: string;
  overallScore: number;
  revenueScore: number;
  activityScore: number;
  revenue: number;
  dealCount: number;
  wonDealCount: number;
  rank: number;
};

/* ── components ── */

function ScoreBar({
  score,
  color,
  height = 8,
}: {
  score: number;
  color: string;
  height?: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "var(--border)",
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${score}%`,
          height: "100%",
          background: color,
          borderRadius: height / 2,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: `${color}15`,
        color,
        fontWeight: 800,
        fontSize: "1rem",
        border: `2px solid ${color}`,
      }}
    >
      {score}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: ".75rem",
        fontWeight: 700,
        color: tierColor(tier),
        background: tierBgColor(tier),
        textTransform: "uppercase",
        letterSpacing: ".04em",
      }}
    >
      {TIER_LABELS[tier] || tier}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const color =
    rank === 1 ? "#eab308" : rank === 2 ? "#94a3b8" : rank === 3 ? "#cd7f32" : "#6b7280";
  const icon = rank <= 3 ? <Medal size={14} /> : null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: `${color}18`,
        color,
        fontWeight: 800,
        fontSize: ".85rem",
      }}
    >
      {icon || rank}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "#6366f1" }} />
        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          Calculating partner scores...
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "1rem",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="card"
            style={{ padding: "1.25rem", height: 90, background: "var(--subtle)" }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="card"
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "#6366f118",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Trophy size={32} style={{ color: "#6366f1" }} />
      </div>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 4 }}>
          No Partners to Score
        </h3>
        <p className="muted" style={{ maxWidth: 400 }}>
          Partner scores will appear here once you have active partners with deal
          activity.
        </p>
      </div>
    </div>
  );
}

function DimensionCard({
  label,
  score,
  detail,
  weight,
  icon,
}: {
  label: string;
  score: number;
  detail: string;
  weight: number;
  icon: React.ReactNode;
}) {
  const color = scoreColor(score);
  return (
    <div
      style={{
        padding: "1rem 1.2rem",
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {icon}
          <span style={{ fontWeight: 600, fontSize: ".85rem" }}>{label}</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: ".95rem", color }}>{score}</span>
      </div>
      <ScoreBar score={score} color={color} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span className="muted" style={{ fontSize: ".75rem" }}>
          {detail}
        </span>
        <span className="muted" style={{ fontSize: ".7rem" }}>
          {Math.round(weight * 100)}% weight
        </span>
      </div>
    </div>
  );
}

function ExpandedScorecard({ ps }: { ps: PartnerScore }) {
  const tierMismatch = ps.currentTier !== ps.calculatedTier;
  return (
    <div
      style={{
        padding: "1.5rem",
        borderTop: "1px solid var(--border)",
        background: "var(--subtle)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.2rem",
        }}
      >
        <DimensionCard
          label="Revenue Score"
          score={ps.revenueScore}
          detail={formatCurrency(ps.revenue)}
          weight={0.6}
          icon={<BarChart3 size={15} color="#059669" />}
        />
        <DimensionCard
          label="Activity Score"
          score={ps.activityScore}
          detail={`${ps.dealCount} deals registered`}
          weight={0.4}
          icon={<Target size={15} color="#0284c7" />}
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link
          href={`/dashboard/partners/${ps.id}`}
          className="btn-outline"
          style={{ fontSize: ".8rem", padding: "6px 14px" }}
        >
          View Partner →
        </Link>
        {tierMismatch && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: ".8rem",
              fontWeight: 600,
              background:
                getTierFromScore(ps.overallScore) > ps.currentTier
                  ? "#ecfdf5"
                  : "#fef2f2",
              color:
                getTierFromScore(ps.overallScore) > ps.currentTier
                  ? "#059669"
                  : "#dc2626",
            }}
          >
            <TrendingUp size={14} />
            Recommend: {TIER_LABELS[ps.currentTier]} → {TIER_LABELS[ps.calculatedTier]}
          </span>
        )}
      </div>
    </div>
  );
}

function exportScorecardCSV(scores: PartnerScore[]) {
  const headers = [
    "Rank",
    "Partner",
    "Current Tier",
    "Calculated Tier",
    "Overall Score",
    "Revenue Score",
    "Activity Score",
    "Revenue",
    "Deals",
    "Won Deals",
  ];
  const rows = scores.map((s) => [
    s.rank,
    s.name,
    s.currentTier,
    s.calculatedTier,
    s.overallScore,
    s.revenueScore,
    s.activityScore,
    s.revenue,
    s.dealCount,
    s.wonDealCount,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `partner-scorecard-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ScoringPage() {
  const partnersRaw = useQuery(api.partners.listWithStats);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>("all");

  const partners = partnersRaw as PartnerWithStats[] | undefined;

  const { scores, stats } = useMemo(() => {
    if (!partners)
      return { scores: [], stats: { avgScore: 0, topPerformers: 0, total: 0 } };

    // Only score active partners
    const activePartners = partners.filter((p) => p.status === "active");

    if (activePartners.length === 0)
      return { scores: [], stats: { avgScore: 0, topPerformers: 0, total: 0 } };

    // Find max values for normalization
    const maxRevenue = Math.max(...activePartners.map((p) => p.revenue), 1);
    const maxDeals = Math.max(...activePartners.map((p) => p.dealCount), 1);

    // Calculate scores
    const scored: PartnerScore[] = activePartners.map((p) => {
      const revenueScore = Math.round((p.revenue / maxRevenue) * 100);
      const activityScore = Math.round((p.dealCount / maxDeals) * 100);
      const overallScore = Math.round(revenueScore * 0.6 + activityScore * 0.4);
      const calculatedTier = getTierFromScore(overallScore);

      return {
        id: p._id,
        name: p.name,
        type: p.type,
        currentTier: p.tier || "bronze",
        calculatedTier,
        overallScore,
        revenueScore,
        activityScore,
        revenue: p.revenue,
        dealCount: p.dealCount,
        wonDealCount: p.wonDealCount,
        rank: 0, // Will be set after sorting
      };
    });

    // Sort by overall score and assign ranks
    scored.sort((a, b) => b.overallScore - a.overallScore);
    scored.forEach((s, i) => (s.rank = i + 1));

    const avgScore =
      scored.length > 0
        ? Math.round(scored.reduce((s, p) => s + p.overallScore, 0) / scored.length)
        : 0;
    const topPerformers = scored.filter((s) => s.overallScore >= 80).length;

    return {
      scores: scored,
      stats: {
        avgScore,
        topPerformers,
        total: scored.length,
      },
    };
  }, [partners]);

  const filteredScores = useMemo(() => {
    if (filterTier === "all") return scores;
    return scores.filter((s) => s.currentTier === filterTier);
  }, [scores, filterTier]);

  if (partners === undefined) {
    return <LoadingSkeleton />;
  }

  if (partners.length === 0 || scores.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Partner Scorecard
          </h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            Automated partner scoring based on revenue and activity metrics
          </p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Partner Scorecard
          </h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            Automated partner scoring based on revenue and activity metrics
          </p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <select
            className="input"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            style={{ maxWidth: 140 }}
          >
            <option value="all">All Tiers</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
          <button
            onClick={() => exportScorecardCSV(scores)}
            className="btn-outline"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              fontSize: ".85rem",
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          className="card"
          style={{
            padding: "1.25rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#6366f118",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6366f1",
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div
              className="muted"
              style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase" }}
            >
              Partners Scored
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.total}</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "1.25rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${scoreColor(stats.avgScore)}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: scoreColor(stats.avgScore),
            }}
          >
            <BarChart3 size={22} />
          </div>
          <div>
            <div
              className="muted"
              style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase" }}
            >
              Average Score
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.avgScore}</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "1.25rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#22c55e18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22c55e",
            }}
          >
            <Trophy size={22} />
          </div>
          <div>
            <div
              className="muted"
              style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase" }}
            >
              Top Performers
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.topPerformers}</div>
            <div className="muted" style={{ fontSize: ".75rem" }}>
              Score 80+
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Trophy size={18} style={{ color: "#eab308" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Partner Leaderboard</h2>
          </div>
          <span className="muted" style={{ fontSize: ".85rem" }}>
            Ranked by overall score (60% revenue, 40% activity)
          </span>
        </div>

        {filteredScores.map((ps) => {
          const isExpanded = expandedId === ps.id;
          return (
            <div key={ps.id}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : ps.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem 1.25rem",
                  gap: "1rem",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--subtle)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <RankBadge rank={ps.rank} />
                <ScoreBadge score={ps.overallScore} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: ".95rem" }}>
                      {ps.name}
                    </span>
                    <TierBadge tier={ps.currentTier} />
                    <span className="muted" style={{ fontSize: ".8rem" }}>
                      {ps.type}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      marginTop: 4,
                      fontSize: ".8rem",
                    }}
                  >
                    <span className="muted">
                      <BarChart3 size={12} style={{ verticalAlign: -2 }} />{" "}
                      {formatCurrency(ps.revenue)} revenue
                    </span>
                    <span className="muted">
                      <Target size={12} style={{ verticalAlign: -2 }} /> {ps.dealCount}{" "}
                      deals
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    alignItems: "center",
                    fontSize: ".85rem",
                  }}
                >
                  <div style={{ textAlign: "center", minWidth: 60 }}>
                    <div
                      className="muted"
                      style={{ fontSize: ".7rem", fontWeight: 600, marginBottom: 2 }}
                    >
                      REVENUE
                    </div>
                    <span style={{ fontWeight: 700, color: scoreColor(ps.revenueScore) }}>
                      {ps.revenueScore}
                    </span>
                  </div>
                  <div style={{ textAlign: "center", minWidth: 60 }}>
                    <div
                      className="muted"
                      style={{ fontSize: ".7rem", fontWeight: 600, marginBottom: 2 }}
                    >
                      ACTIVITY
                    </div>
                    <span style={{ fontWeight: 700, color: scoreColor(ps.activityScore) }}>
                      {ps.activityScore}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="muted" />
                  ) : (
                    <ChevronDown size={18} className="muted" />
                  )}
                </div>
              </div>

              {isExpanded && <ExpandedScorecard ps={ps} />}
            </div>
          );
        })}

        {filteredScores.length === 0 && (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <p className="muted">No partners match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
