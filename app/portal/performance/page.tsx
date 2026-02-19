"use client";

import { useMemo } from "react";
import { usePortal } from "@/lib/portal-context";
import { formatCurrency } from "@/lib/utils";
import {
  Trophy, TrendingUp, Target, Zap, BarChart3, Award,
  ChevronRight, CheckCircle2, ArrowUpCircle, Star, Clock,
} from "lucide-react";

/* ── Types ── */

type ScoreDimension = {
  key: string;
  label: string;
  score: number;
  weight: number;
  description: string;
  tips: string[];
  icon: typeof Trophy;
  color: string;
};

type PeerBenchmark = {
  label: string;
  yours: number;
  tierAvg: number;
  topPerformer: number;
  unit: string;
};

/* ── Demo Data ── */

function getPartnerScorecard(tier: string) {
  // Simulate different scores based on tier
  const tierMultiplier = tier === "platinum" ? 1.1 : tier === "gold" ? 0.9 : tier === "silver" ? 0.7 : 0.5;

  const dimensions: ScoreDimension[] = [
    {
      key: "revenue", label: "Revenue Impact", score: Math.round(72 * tierMultiplier),
      weight: 35, description: "Attributed revenue from won deals you influenced",
      tips: ["Register deals early to capture full attribution", "Focus on larger enterprise accounts", "Co-sell with your account executive for higher close rates"],
      icon: TrendingUp, color: "#22c55e",
    },
    {
      key: "pipeline", label: "Pipeline Contribution", score: Math.round(65 * tierMultiplier),
      weight: 25, description: "Value of open deals you're actively working",
      tips: ["Submit deal registrations for all qualified opportunities", "Keep expected close dates updated", "Add notes on deal progress to show engagement"],
      icon: Target, color: "#3b82f6",
    },
    {
      key: "engagement", label: "Engagement", score: Math.round(80 * tierMultiplier),
      weight: 25, description: "Frequency and recency of your platform activities",
      tips: ["Log touchpoints for every partner interaction", "Complete available training courses", "Attend partner webinars and events"],
      icon: Zap, color: "#8b5cf6",
    },
    {
      key: "velocity", label: "Deal Velocity", score: Math.round(58 * tierMultiplier),
      weight: 15, description: "How quickly deals you influence progress to close",
      tips: ["Introduce champions early in the sales cycle", "Provide technical resources to reduce evaluation time", "Follow up on stalled deals proactively"],
      icon: BarChart3, color: "#f59e0b",
    },
  ];

  const overall = Math.round(
    dimensions.reduce((s, d) => s + d.score * (d.weight / 100), 0)
  );

  return { dimensions, overall };
}

function getRecommendedTier(score: number): string {
  if (score >= 85) return "platinum";
  if (score >= 65) return "gold";
  if (score >= 40) return "silver";
  return "bronze";
}

function getBenchmarks(tier: string): PeerBenchmark[] {
  return [
    { label: "Avg Deal Size", yours: tier === "gold" ? 87000 : tier === "silver" ? 52000 : 28000, tierAvg: 65000, topPerformer: 142000, unit: "$" },
    { label: "Deals Closed (6mo)", yours: tier === "gold" ? 8 : tier === "silver" ? 4 : 2, tierAvg: 6, topPerformer: 15, unit: "" },
    { label: "Days to First Deal", yours: tier === "gold" ? 35 : tier === "silver" ? 52 : 78, tierAvg: 45, topPerformer: 18, unit: "d" },
    { label: "Touchpoints / Deal", yours: tier === "gold" ? 6.2 : tier === "silver" ? 3.8 : 2.1, tierAvg: 4.5, topPerformer: 8.3, unit: "" },
    { label: "Training Completion", yours: tier === "gold" ? 85 : tier === "silver" ? 60 : 30, tierAvg: 55, topPerformer: 100, unit: "%" },
  ];
}

/* ── Components ── */

const TIER_COLORS: Record<string, { bg: string; fg: string }> = {
  bronze: { bg: "#cd7f3222", fg: "#cd7f32" },
  silver: { bg: "#94a3b822", fg: "#94a3b8" },
  gold: { bg: "#eab30822", fg: "#eab308" },
  platinum: { bg: "#a78bfa22", fg: "#a78bfa" },
};

function ScoreRing({ score, size = 120, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 800, color }}>{score}</span>
        <span className="muted" style={{ fontSize: size * 0.1 }}>/ 100</span>
      </div>
    </div>
  );
}

function DimensionBar({ dimension }: { dimension: ScoreDimension }) {
  const Icon = dimension.icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${dimension.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: dimension.color, flexShrink: 0 }}>
        <Icon size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{dimension.label}</span>
          <span style={{ fontSize: ".85rem", fontWeight: 700, color: dimension.color }}>{dimension.score}/100</span>
        </div>
        <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${dimension.score}%`, height: "100%", background: dimension.color, borderRadius: 3, transition: "width 0.8s ease" }} />
        </div>
        <span className="muted" style={{ fontSize: ".7rem" }}>{dimension.weight}% weight · {dimension.description}</span>
      </div>
    </div>
  );
}

function BenchmarkRow({ benchmark }: { benchmark: PeerBenchmark }) {
  const fmt = (v: number) => benchmark.unit === "$" ? formatCurrency(v) : `${v}${benchmark.unit}`;
  const pct = Math.min(100, (benchmark.yours / benchmark.topPerformer) * 100);
  const isAboveAvg = benchmark.label === "Days to First Deal" ? benchmark.yours < benchmark.tierAvg : benchmark.yours > benchmark.tierAvg;

  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{benchmark.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: ".9rem", fontWeight: 700, color: isAboveAvg ? "#22c55e" : "#eab308" }}>{fmt(benchmark.yours)}</span>
          {isAboveAvg ? <ArrowUpCircle size={14} style={{ color: "#22c55e" }} /> : <Clock size={14} style={{ color: "#eab308" }} />}
        </div>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", fontSize: ".75rem" }}>
        <span className="muted">Tier avg: <strong>{fmt(benchmark.tierAvg)}</strong></span>
        <span className="muted">Top performer: <strong style={{ color: "#6366f1" }}>{fmt(benchmark.topPerformer)}</strong></span>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function PortalPerformancePage() {
  const { partner } = usePortal();
  if (!partner) return null;

  const tier = partner.tier || "silver";
  const scorecard = useMemo(() => getPartnerScorecard(tier), [tier]);
  const benchmarks = useMemo(() => getBenchmarks(tier), [tier]);
  const recommendedTier = getRecommendedTier(scorecard.overall);
  const isUpgrade = ["bronze", "silver", "gold", "platinum"].indexOf(recommendedTier) > ["bronze", "silver", "gold", "platinum"].indexOf(tier);
  const tierColor = TIER_COLORS[tier] || TIER_COLORS.bronze;

  // Find weakest dimension for improvement focus
  const weakest = [...scorecard.dimensions].sort((a, b) => a.score - b.score)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>My Performance</h1>
        <p className="muted">Your partner scorecard, benchmarks, and improvement tips</p>
      </div>

      {/* Score + Tier Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <ScoreRing score={scorecard.overall} size={140} />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1rem" }}>Overall Partner Score</h2>
          <p className="muted" style={{ fontSize: ".85rem" }}>Based on revenue, pipeline, engagement, and velocity</p>
          {isUpgrade && (
            <div style={{ marginTop: 12, padding: "8px 16px", borderRadius: 10, background: "#22c55e15", border: "1px solid #22c55e33", display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowUpCircle size={16} style={{ color: "#22c55e" }} />
              <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#22c55e" }}>
                On track for {recommendedTier.charAt(0).toUpperCase() + recommendedTier.slice(1)} tier
              </span>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: tierColor.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trophy size={24} style={{ color: tierColor.fg }} />
            </div>
            <div>
              <div style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>Current Tier</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, textTransform: "capitalize" }}>{tier}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Commission Rate", value: tier === "platinum" ? "15%" : tier === "gold" ? "12%" : tier === "silver" ? "10%" : "8%" },
              { label: "Deal Registration", value: tier === "bronze" ? "Standard" : "Priority" },
              { label: "MDF Eligibility", value: tier === "platinum" || tier === "gold" ? "Yes" : "No" },
              { label: "Co-Sell Support", value: tier === "platinum" ? "Dedicated" : tier === "gold" ? "Shared" : "Self-serve" },
            ].map((perk) => (
              <div key={perk.label} style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", padding: "4px 0" }}>
                <span className="muted">{perk.label}</span>
                <span style={{ fontWeight: 600 }}>{perk.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Dimensions */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={18} style={{ color: "#6366f1" }} />
          Score Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {scorecard.dimensions.map((dim) => (
            <DimensionBar key={dim.key} dimension={dim} />
          ))}
        </div>
      </div>

      {/* Improvement Tips for weakest area */}
      <div className="card" style={{ padding: "1.5rem", borderLeft: `3px solid ${weakest.color}` }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <Star size={18} style={{ color: weakest.color }} />
          Improve Your {weakest.label} Score
        </h3>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
          Your {weakest.label.toLowerCase()} score ({weakest.score}/100) is your biggest opportunity for improvement.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {weakest.tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: `${weakest.color}08` }}>
              <CheckCircle2 size={16} style={{ color: weakest.color, flexShrink: 0 }} />
              <span style={{ fontSize: ".85rem" }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peer Benchmarks */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Award size={18} style={{ color: "#6366f1" }} />
          How You Compare
        </h3>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
          Your metrics vs. other {tier} tier partners and top performers.
        </p>
        {benchmarks.map((b) => (
          <BenchmarkRow key={b.label} benchmark={b} />
        ))}
      </div>
    </div>
  );
}
