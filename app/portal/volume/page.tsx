"use client";

import { usePortal } from "@/lib/portal-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { BarChart3, TrendingUp, Target, Trophy, Award } from "lucide-react";

type VolumeTier = {
  minUnits: number;
  maxUnits: number | null;
  rebatePercent: number;
  label: string;
};

function getVolumeTier(units: number, tiers: VolumeTier[]) {
  let currentIndex = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (units >= tiers[i].minUnits) {
      currentIndex = i;
      break;
    }
  }
  const nextTier = currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  const unitsToNext = nextTier ? nextTier.minUnits - units : 0;
  return {
    tier: tiers[currentIndex],
    index: currentIndex,
    nextTier,
    unitsToNext: Math.max(0, unitsToNext),
  };
}

function ProgressBar({ value, max, color = "#6366f1", height = 12 }: { value: number; max: number; color?: string; height?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: "100%", height, background: "var(--border)", borderRadius: height / 2, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: height / 2, transition: "width 0.5s ease" }} />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ width: 20, height: 20, borderRadius: 4, background: "var(--border)", marginBottom: ".5rem" }} />
      <div style={{ width: "60%", height: 12, borderRadius: 4, background: "var(--border)", marginBottom: ".5rem" }} />
      <div style={{ width: "40%", height: 24, borderRadius: 4, background: "var(--border)" }} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div style={{ width: "40%", height: 28, borderRadius: 6, background: "var(--border)", marginBottom: ".5rem" }} />
        <div style={{ width: "60%", height: 14, borderRadius: 4, background: "var(--border)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="card" style={{ height: 160 }}>
        <div style={{ width: "30%", height: 14, borderRadius: 4, background: "var(--border)", marginBottom: "1rem" }} />
        <div style={{ width: "100%", height: 16, borderRadius: 8, background: "var(--border)", marginBottom: ".5rem" }} />
        <div style={{ width: "50%", height: 12, borderRadius: 4, background: "var(--border)" }} />
      </div>
    </div>
  );
}

export default function PortalVolumePage() {
  const { partner } = usePortal();

  const data = useQuery(
    api.portalVolume.getByPartner,
    partner?.id ? { partnerId: partner.id as Id<"partners"> } : "skip"
  );

  if (!partner) return null;
  if (data === undefined) return <LoadingSkeleton />;

  const { programs, volumes, leaderboard } = data;

  // Find the active quarterly program and this partner's volume record
  const activeProgram = programs.find((p) => p.period === "quarterly");
  const myVol = activeProgram
    ? volumes.find((v) => v.programId === activeProgram._id)
    : null;

  const myRank = leaderboard.findIndex((l) => l.isMe) + 1;

  const tierInfo = activeProgram && myVol ? getVolumeTier(myVol.unitsTotal, activeProgram.tiers) : null;
  const tierColors = ["#6b7280", "#2563eb", "#d97706", "#059669"];
  const tierBgs = ["var(--subtle)", "rgba(37,99,235,0.08)", "rgba(217,119,6,0.08)", "rgba(5,150,105,0.08)"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Volume Progress</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>Track your volume toward rebate tiers</p>
      </div>

      {!myVol || !activeProgram ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <BarChart3 size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
          <p className="muted">No active volume program found for your account</p>
        </div>
      ) : (
        <>
          {/* Current Status */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <div className="card">
              <BarChart3 size={20} color="#4338ca" />
              <p className="muted" style={{ fontSize: ".8rem", marginTop: ".5rem" }}>Units Sold</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatNumber(myVol.unitsTotal)}</p>
            </div>
            <div className="card">
              <TrendingUp size={20} color="#059669" />
              <p className="muted" style={{ fontSize: ".8rem", marginTop: ".5rem" }}>Revenue</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatCurrency(myVol.revenueTotal)}</p>
            </div>
            <div className="card">
              <Award size={20} color="#d97706" />
              <p className="muted" style={{ fontSize: ".8rem", marginTop: ".5rem" }}>Rebate Accrued</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{formatCurrency(myVol.rebateAccrued)}</p>
            </div>
            <div className="card">
              <Trophy size={20} color="#6366f1" />
              <p className="muted" style={{ fontSize: ".8rem", marginTop: ".5rem" }}>Leaderboard Rank</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>#{myRank} of {leaderboard.length}</p>
            </div>
          </div>

          {/* Current Tier Progress */}
          {tierInfo && (
            <div className="card" style={{ borderLeft: `4px solid ${tierColors[tierInfo.index] || "#6b7280"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Current Tier</p>
                  <p style={{ fontSize: "1.3rem", fontWeight: 800, color: tierColors[tierInfo.index] }}>
                    {tierInfo.tier.label} — {tierInfo.tier.rebatePercent}% Rebate
                  </p>
                </div>
                {tierInfo.nextTier && (
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Next Tier</p>
                    <p style={{ fontSize: "1rem", fontWeight: 700, color: tierColors[tierInfo.index + 1] }}>
                      {tierInfo.nextTier.label} — {tierInfo.nextTier.rebatePercent}%
                    </p>
                  </div>
                )}
              </div>

              {tierInfo.nextTier ? (
                <>
                  <ProgressBar
                    value={myVol.unitsTotal - tierInfo.tier.minUnits}
                    max={tierInfo.nextTier.minUnits - tierInfo.tier.minUnits}
                    color={tierColors[tierInfo.index] || "#6366f1"}
                    height={16}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".5rem" }}>
                    <span className="muted" style={{ fontSize: ".85rem" }}>
                      {formatNumber(myVol.unitsTotal)} units
                    </span>
                    <span style={{ fontSize: ".85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: ".25rem" }}>
                      <Target size={14} />
                      {formatNumber(tierInfo.unitsToNext)} more units to reach {tierInfo.nextTier.label}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ padding: "1rem", borderRadius: 8, background: "rgba(5,150,105,0.08)", textAlign: "center" }}>
                  <p style={{ fontWeight: 700, color: "#059669", fontSize: "1rem" }}>🎉 You&apos;re at the top tier!</p>
                  <p className="muted" style={{ fontSize: ".85rem" }}>Keep selling to maximize your rebate earnings</p>
                </div>
              )}
            </div>
          )}

          {/* Tier Overview */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>Program Tiers — {activeProgram.name}</h2>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${activeProgram.tiers.length}, 1fr)`, gap: ".75rem" }}>
              {activeProgram.tiers.map((tier, i) => {
                const isCurrentTier = tierInfo?.index === i;
                return (
                  <div
                    key={i}
                    style={{
                      padding: "1.25rem",
                      borderRadius: 10,
                      border: isCurrentTier ? `3px solid ${tierColors[i]}` : "1px solid var(--border)",
                      background: isCurrentTier ? tierBgs[i] : "var(--subtle)",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    {isCurrentTier && (
                      <div style={{ position: "absolute", top: -10, right: -10, width: 24, height: 24, borderRadius: "50%", background: tierColors[i], color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", fontWeight: 700 }}>
                        ✓
                      </div>
                    )}
                    <p style={{ fontWeight: 700, color: tierColors[i], marginBottom: ".15rem" }}>{tier.label}</p>
                    <p style={{ fontSize: "1.8rem", fontWeight: 800, color: tierColors[i] }}>{tier.rebatePercent}%</p>
                    <p className="muted" style={{ fontSize: ".8rem" }}>{tier.minUnits}–{tier.maxUnits ? formatNumber(tier.maxUnits) : "∞"} units</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Leaderboard */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>Leaderboard</h2>
            {leaderboard.slice(0, 5).map((entry, idx) => {
              const emoji = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: ".65rem .75rem",
                    borderRadius: 8,
                    marginBottom: ".35rem",
                    background: entry.isMe ? "rgba(67,56,202,0.08)" : "transparent",
                    border: entry.isMe ? "1px solid rgba(67,56,202,0.25)" : "1px solid transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <span style={{ fontSize: "1rem", width: 30, textAlign: "center" }}>{emoji}</span>
                    <span style={{ fontWeight: entry.isMe ? 700 : 500, fontSize: ".9rem" }}>
                      {entry.isMe ? `${entry.partnerName} (You)` : entry.partnerName}
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: ".9rem" }}>{formatNumber(entry.unitsTotal)} units</span>
                </div>
              );
            })}
          </div>

          {/* Projected Payout */}
          <div className="card" style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.1))", border: "1px solid rgba(5,150,105,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "1rem", color: "#22c55e" }}>Projected Rebate Payout</p>
                <p style={{ fontSize: ".85rem", color: "#059669" }}>Based on current volume trajectory through end of period</p>
              </div>
              <p style={{ fontSize: "2rem", fontWeight: 800, color: "#22c55e" }}>{formatCurrency(myVol.rebateProjected)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
