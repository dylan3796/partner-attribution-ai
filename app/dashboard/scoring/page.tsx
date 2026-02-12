"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  calculatePartnerScores,
  tierColor,
  tierBgColor,
  scoreColor,
  DEFAULT_SCORING_CONFIG,
  type PartnerScore,
  type ScoringConfig,
} from "@/lib/partner-scoring";
import { TIER_LABELS } from "@/lib/types";
import { ConfigTipBox } from "@/components/ui/config-tooltip";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  BarChart3,
  AlertTriangle,
  Download,
  Settings2,
  Info,
} from "lucide-react";

function ScoreBar({ score, color, height = 8 }: { score: number; color: string; height?: number }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#e5e7eb",
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

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp size={16} color="#059669" />;
  if (trend === "down") return <TrendingDown size={16} color="#dc2626" />;
  return <Minus size={16} color="#6b7280" />;
}

function TierChangeIcon({ change }: { change: "upgrade" | "downgrade" | "maintain" }) {
  if (change === "upgrade") return <ArrowUpCircle size={16} color="#059669" />;
  if (change === "downgrade") return <ArrowDownCircle size={16} color="#dc2626" />;
  return null;
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {icon}
          <span style={{ fontWeight: 600, fontSize: ".85rem" }}>{label}</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: ".95rem", color }}>{score}</span>
      </div>
      <ScoreBar score={score} color={color} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span className="muted" style={{ fontSize: ".75rem" }}>{detail}</span>
        <span className="muted" style={{ fontSize: ".7rem" }}>{Math.round(weight * 100)}% weight</span>
      </div>
    </div>
  );
}

function ExpandedScorecard({ ps }: { ps: PartnerScore }) {
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
          label={ps.dimensions.revenue.label}
          score={ps.dimensions.revenue.score}
          detail={ps.dimensions.revenue.detail}
          weight={ps.dimensions.revenue.weight}
          icon={<BarChart3 size={15} color="#059669" />}
        />
        <DimensionCard
          label={ps.dimensions.pipeline.label}
          score={ps.dimensions.pipeline.score}
          detail={ps.dimensions.pipeline.detail}
          weight={ps.dimensions.pipeline.weight}
          icon={<Target size={15} color="#0284c7" />}
        />
        <DimensionCard
          label={ps.dimensions.engagement.label}
          score={ps.dimensions.engagement.score}
          detail={ps.dimensions.engagement.detail}
          weight={ps.dimensions.engagement.weight}
          icon={<Zap size={15} color="#d97706" />}
        />
        <DimensionCard
          label={ps.dimensions.velocity.label}
          score={ps.dimensions.velocity.score}
          detail={ps.dimensions.velocity.detail}
          weight={ps.dimensions.velocity.weight}
          icon={<TrendingUp size={15} color="#6366f1" />}
        />
      </div>

      {ps.highlights.length > 0 && (
        <div
          style={{
            padding: "1rem 1.2rem",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg)",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: ".85rem", marginBottom: 8 }}>
            <AlertTriangle size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
            Insights & Actions
          </p>
          {ps.highlights.map((h, i) => (
            <p key={i} style={{ fontSize: ".85rem", padding: "3px 0", lineHeight: 1.5 }}>
              {h}
            </p>
          ))}
        </div>
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
        <Link
          href={`/dashboard/partners/${ps.partnerId}`}
          className="btn-outline"
          style={{ fontSize: ".8rem", padding: "6px 14px" }}
        >
          View Partner →
        </Link>
        {ps.tierChange !== "maintain" && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: ".8rem",
              fontWeight: 600,
              background: ps.tierChange === "upgrade" ? "#ecfdf5" : "#fef2f2",
              color: ps.tierChange === "upgrade" ? "#059669" : "#dc2626",
            }}
          >
            <TierChangeIcon change={ps.tierChange} />
            Recommend: {ps.currentTier} → {ps.recommendedTier}
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
    "Recommended Tier",
    "Overall Score",
    "Revenue Score",
    "Pipeline Score",
    "Engagement Score",
    "Velocity Score",
    "Trend",
    "Tier Change",
  ];
  const rows = scores.map((s) => [
    s.rank,
    s.partnerName,
    s.currentTier,
    s.recommendedTier,
    s.overallScore,
    s.dimensions.revenue.score,
    s.dimensions.pipeline.score,
    s.dimensions.engagement.score,
    s.dimensions.velocity.score,
    s.trend,
    s.tierChange,
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
  const { partners, deals, touchpoints, attributions } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterChange, setFilterChange] = useState<string>("all");
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ScoringConfig>(DEFAULT_SCORING_CONFIG);

  const scores = useMemo(
    () => calculatePartnerScores(partners, deals, touchpoints, attributions, config),
    [partners, deals, touchpoints, attributions, config]
  );

  const filtered = scores.filter((s) => {
    if (filterTier !== "all" && s.currentTier !== filterTier) return false;
    if (filterChange !== "all" && s.tierChange !== filterChange) return false;
    return true;
  });

  const summary = useMemo(() => {
    const upgrades = scores.filter((s) => s.tierChange === "upgrade").length;
    const downgrades = scores.filter((s) => s.tierChange === "downgrade").length;
    const avgScore = scores.length
      ? Math.round(scores.reduce((s, p) => s + p.overallScore, 0) / scores.length)
      : 0;
    const topPerformer = scores[0];
    return { upgrades, downgrades, avgScore, topPerformer, total: scores.length };
  }, [scores]);

  return (
    <>
      {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
              <Trophy size={24} style={{ display: "inline", verticalAlign: "-3px", marginRight: 8, color: "#d97706" }} />
              Partner Scorecard
            </h1>
            <p className="muted">
              Composite scoring across revenue, pipeline, engagement & velocity
            </p>
          </div>
          <div style={{ display: "flex", gap: ".75rem" }}>
            <button className="btn-outline" onClick={() => setShowConfig(!showConfig)}>
              <Settings2 size={15} /> Weights
            </button>
            <button className="btn-outline" onClick={() => exportScorecardCSV(scores)}>
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        <ConfigTipBox
          title="Scoring is Fully Customizable"
          tips={[
            "Adjust weight sliders to match what matters to your org (revenue vs engagement vs velocity)",
            "Tier thresholds are configurable — adapt them to your partner program's criteria",
            "Toggle Partner Scoring on/off entirely in Platform Configuration",
          ]}
        />

        {/* Weight Config Panel */}
        {showConfig && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>
                <Settings2 size={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
                Scoring Weights
              </h3>
              <button
                className="btn-outline"
                style={{ fontSize: ".75rem", padding: "4px 10px" }}
                onClick={() => setConfig(DEFAULT_SCORING_CONFIG)}
              >
                Reset to defaults
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {(["revenue", "pipeline", "engagement", "velocity"] as const).map((key) => {
                const labels = {
                  revenue: "Revenue Impact",
                  pipeline: "Pipeline Contribution",
                  engagement: "Engagement",
                  velocity: "Deal Velocity",
                };
                return (
                  <div key={key}>
                    <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: 4 }}>
                      {labels[key]} — {Math.round(config.weights[key] * 100)}%
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      value={Math.round(config.weights[key] * 100)}
                      onChange={(e) => {
                        const newVal = Number(e.target.value) / 100;
                        const others = (["revenue", "pipeline", "engagement", "velocity"] as const).filter((k) => k !== key);
                        const remaining = 1 - newVal;
                        const currentOtherSum = others.reduce((s, k) => s + config.weights[k], 0);
                        const newWeights = { ...config.weights, [key]: newVal };
                        if (currentOtherSum > 0) {
                          for (const k of others) {
                            newWeights[k] = (config.weights[k] / currentOtherSum) * remaining;
                          }
                        }
                        setConfig({ ...config, weights: newWeights });
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="muted" style={{ fontSize: ".75rem", marginTop: 8 }}>
              <Info size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> Adjusting one weight auto-rebalances the others to sum to 100%.
            </p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Partners Scored</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{summary.total}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Avg Score</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: scoreColor(summary.avgScore) }}>
              {summary.avgScore}
            </p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Tier Upgrades</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#059669" }}>
              {summary.upgrades}
            </p>
            <p className="muted" style={{ fontSize: ".75rem" }}>recommended</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>At Risk</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#dc2626" }}>
              {summary.downgrades}
            </p>
            <p className="muted" style={{ fontSize: ".75rem" }}>tier downgrades</p>
          </div>
        </div>

        {/* Filters */}
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "1rem 1.5rem",
          }}
        >
          <select
            className="input"
            style={{ width: "auto" }}
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="all">All Tiers</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
          <select
            className="input"
            style={{ width: "auto" }}
            value={filterChange}
            onChange={(e) => setFilterChange(e.target.value)}
          >
            <option value="all">All Recommendations</option>
            <option value="upgrade">Upgrades Only</option>
            <option value="downgrade">Downgrades Only</option>
            <option value="maintain">No Change</option>
          </select>
          <span className="muted" style={{ fontSize: ".85rem" }}>
            {filtered.length} of {scores.length} partners
          </span>
        </div>

        {/* Scorecard Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: "var(--subtle)",
                }}
              >
                <th
                  style={{
                    padding: ".8rem 1.2rem",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    width: 50,
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: ".8rem",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: "var(--muted)",
                  }}
                >
                  Partner
                </th>
                <th
                  style={{
                    padding: ".8rem",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    width: 80,
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    padding: ".8rem",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    width: 180,
                  }}
                >
                  Breakdown
                </th>
                <th
                  style={{
                    padding: ".8rem",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: "var(--muted)",
                  }}
                >
                  Current Tier
                </th>
                <th
                  style={{
                    padding: ".8rem",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: "var(--muted)",
                  }}
                >
                  Recommended
                </th>
                <th
                  style={{
                    padding: ".8rem",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    width: 60,
                  }}
                >
                  Trend
                </th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ps) => {
                const isExpanded = expandedId === ps.partnerId;
                return (
                  <tbody key={ps.partnerId}>
                    <tr
                      style={{
                        borderBottom: isExpanded ? "none" : "1px solid var(--border)",
                        cursor: "pointer",
                        transition: "background .15s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = isExpanded ? "var(--subtle)" : "")
                      }
                      onClick={() => setExpandedId(isExpanded ? null : ps.partnerId)}
                    >
                      <td
                        style={{
                          padding: ".8rem 1.2rem",
                          fontWeight: 700,
                          color: "var(--muted)",
                          fontSize: ".85rem",
                        }}
                      >
                        {ps.rank}
                      </td>
                      <td style={{ padding: ".8rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
                          <div className="avatar">
                            {ps.partnerName
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600 }}>{ps.partnerName}</p>
                            {ps.highlights.length > 0 && (
                              <p
                                className="muted"
                                style={{ fontSize: ".75rem", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                              >
                                {ps.highlights[0]}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        <ScoreBadge score={ps.overallScore} />
                      </td>
                      <td style={{ padding: ".8rem 1rem" }}>
                        <div style={{ display: "flex", gap: 3, height: 24, alignItems: "flex-end" }}>
                          {[
                            { s: ps.dimensions.revenue.score, c: "#059669", l: "R" },
                            { s: ps.dimensions.pipeline.score, c: "#0284c7", l: "P" },
                            { s: ps.dimensions.engagement.score, c: "#d97706", l: "E" },
                            { s: ps.dimensions.velocity.score, c: "#6366f1", l: "V" },
                          ].map(({ s, c, l }) => (
                            <div
                              key={l}
                              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: Math.max(3, (s / 100) * 24),
                                  background: c,
                                  borderRadius: 2,
                                  opacity: s > 0 ? 1 : 0.2,
                                }}
                                title={`${l}: ${s}`}
                              />
                              <span style={{ fontSize: ".55rem", color: "var(--muted)" }}>{l}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        <TierBadge tier={ps.currentTier} />
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          <TierChangeIcon change={ps.tierChange} />
                          <TierBadge tier={ps.recommendedTier} />
                        </div>
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        <TrendIcon trend={ps.trend} />
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        {isExpanded ? (
                          <ChevronUp size={16} color="var(--muted)" />
                        ) : (
                          <ChevronDown size={16} color="var(--muted)" />
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} style={{ padding: 0 }}>
                          <ExpandedScorecard ps={ps} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>
              No partners match the current filters.
            </p>
          )}
        </div>

        {/* Legend */}
        <div
          className="card"
          style={{ marginTop: "1.5rem", padding: "1rem 1.5rem" }}
        >
          <p style={{ fontWeight: 700, fontSize: ".85rem", marginBottom: 8 }}>
            <Info size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
            How Scoring Works
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              fontSize: ".8rem",
            }}
          >
            <div>
              <span style={{ color: "#059669", fontWeight: 600 }}>● Revenue Impact</span>
              <span className="muted"> — Attributed revenue from won deals</span>
            </div>
            <div>
              <span style={{ color: "#0284c7", fontWeight: 600 }}>● Pipeline Contribution</span>
              <span className="muted"> — Value of active open deals</span>
            </div>
            <div>
              <span style={{ color: "#d97706", fontWeight: 600 }}>● Engagement</span>
              <span className="muted"> — Frequency & recency of touchpoints</span>
            </div>
            <div>
              <span style={{ color: "#6366f1", fontWeight: 600 }}>● Deal Velocity</span>
              <span className="muted"> — Speed of deal closure</span>
            </div>
          </div>
          <p className="muted" style={{ fontSize: ".75rem", marginTop: 8 }}>
            Tier thresholds: Platinum ≥ 85 · Gold ≥ 65 · Silver ≥ 40 · Bronze &lt; 40. Scores are normalized relative to peer partners.
          </p>
        </div>
    </>
  );
}
