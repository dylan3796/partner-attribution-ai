"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { getVolumeTier } from "@/lib/distributor-demo-data";
import { TrendingUp, Award, Target, ChevronRight, BarChart3, Trophy } from "lucide-react";

function ProgressBar({ value, max, color = "#6366f1" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

export default function VolumeRebatesPage() {
  const { volumePrograms, partnerVolumes, partners } = useStore();
  const [selectedProgram, setSelectedProgram] = useState(volumePrograms[0]?._id || "");

  const program = volumePrograms.find((p) => p._id === selectedProgram);
  const volumes = partnerVolumes
    .filter((v) => v.programId === selectedProgram)
    .sort((a, b) => b.unitsTotal - a.unitsTotal);

  const totalUnits = volumes.reduce((s, v) => s + v.unitsTotal, 0);
  const totalRevenue = volumes.reduce((s, v) => s + v.revenueTotal, 0);
  const totalRebates = volumes.reduce((s, v) => s + v.rebateAccrued, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Volume Rebates</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Track volume-based incentive programs and partner progress</p>
        </div>
        <select
          className="input"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          style={{ maxWidth: 320 }}
        >
          {volumePrograms.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Program Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={20} color="#4338ca" />
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Total Units Sold</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatNumber(totalUnits)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={20} color="#065f46" />
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Total Revenue</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={20} color="#92400e" />
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Rebates Accrued</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatCurrency(totalRebates)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fdf4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={20} color="#86198f" />
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Active Partners</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{volumes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Tier Structure */}
      {program && (
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Trophy size={18} color="#d97706" /> Program Tiers — {program.name}
          </h2>
          <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
            {program.period === "quarterly" ? "Quarterly" : "Annual"} program · {new Date(program.startDate).toLocaleDateString()} – {new Date(program.endDate).toLocaleDateString()}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${program.tiers.length}, 1fr)`, gap: "1rem" }}>
            {program.tiers.map((tier, i) => {
              const partnersInTier = volumes.filter((v) => {
                const t = getVolumeTier(v.unitsTotal, program.tiers);
                return t.index === i;
              });
              const tierColors = ["#6b7280", "#2563eb", "#d97706", "#059669"];
              const tierBgs = ["#f3f4f6", "#eff6ff", "#fffbeb", "#ecfdf5"];
              return (
                <div
                  key={i}
                  style={{
                    padding: "1.25rem",
                    borderRadius: 10,
                    border: `2px solid ${tierColors[i] || "#6b7280"}`,
                    background: tierBgs[i] || "#f3f4f6",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: tierColors[i], marginBottom: ".25rem" }}>{tier.label}</p>
                  <p style={{ fontSize: "2rem", fontWeight: 800, color: tierColors[i] }}>{tier.rebatePercent}%</p>
                  <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: ".25rem" }}>
                    {tier.minUnits}–{tier.maxUnits ? formatNumber(tier.maxUnits) : "∞"} units
                  </p>
                  <div style={{ marginTop: ".75rem", padding: ".4rem .6rem", borderRadius: 6, background: "rgba(255,255,255,0.7)", fontSize: ".8rem", fontWeight: 600 }}>
                    {partnersInTier.length} partner{partnersInTier.length !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Volume Leaderboard */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Volume Leaderboard</h2>
          <span className="badge badge-info">{program?.period || "quarterly"} standings</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: ".75rem 1.5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Rank</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Partner</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Units</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Revenue</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "center", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Current Tier</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)", minWidth: 180 }}>Progress</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Rebate Accrued</th>
              <th style={{ padding: ".75rem 1.5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Projected</th>
            </tr>
          </thead>
          <tbody>
            {volumes.map((vol, idx) => {
              const partner = partners.find((p) => p._id === vol.partnerId);
              const tierInfo = program ? getVolumeTier(vol.unitsTotal, program.tiers) : null;
              const tierColors: Record<string, string> = { Standard: "#6b7280", Base: "#6b7280", Growth: "#2563eb", Accelerator: "#2563eb", Elite: "#d97706", Premier: "#d97706", "Champions Club": "#059669" };
              const rankEmoji = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;

              return (
                <tr key={vol._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: ".75rem 1.5rem", fontWeight: 700, fontSize: "1rem" }}>{rankEmoji}</td>
                  <td style={{ padding: ".75rem .5rem" }}>
                    <p style={{ fontWeight: 600, fontSize: ".9rem" }}>{partner?.name || "Unknown"}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>{partner?.territory || "—"}</p>
                  </td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "right", fontWeight: 700, fontSize: ".95rem" }}>
                    {formatNumber(vol.unitsTotal)}
                  </td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".9rem" }}>
                    {formatCurrency(vol.revenueTotal)}
                  </td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "center" }}>
                    {tierInfo && (
                      <span
                        style={{
                          padding: ".25rem .75rem",
                          borderRadius: 20,
                          fontSize: ".8rem",
                          fontWeight: 600,
                          background: tierColors[tierInfo.tier.label] ? `${tierColors[tierInfo.tier.label]}18` : "#f3f4f6",
                          color: tierColors[tierInfo.tier.label] || "#6b7280",
                          border: `1px solid ${tierColors[tierInfo.tier.label] || "#6b7280"}40`,
                        }}
                      >
                        {tierInfo.tier.label} ({tierInfo.tier.rebatePercent}%)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: ".75rem .5rem" }}>
                    {tierInfo?.nextTier ? (
                      <div>
                        <ProgressBar
                          value={vol.unitsTotal - (tierInfo.tier.minUnits)}
                          max={(tierInfo.nextTier.minUnits) - tierInfo.tier.minUnits}
                          color={tierColors[tierInfo.tier.label] || "#6366f1"}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: ".25rem", marginTop: ".3rem" }}>
                          <span className="muted" style={{ fontSize: ".7rem" }}>
                            {formatNumber(tierInfo.unitsToNext)} units to
                          </span>
                          <ChevronRight size={12} color="var(--muted)" />
                          <span style={{ fontSize: ".7rem", fontWeight: 600, color: tierColors[tierInfo.nextTier.label] || "#6b7280" }}>
                            {tierInfo.nextTier.label} ({tierInfo.nextTier.rebatePercent}%)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                        <span style={{ fontSize: ".8rem", color: "#059669", fontWeight: 600 }}>✓ Top Tier</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "right", fontWeight: 600, color: "#059669" }}>
                    {formatCurrency(vol.rebateAccrued)}
                  </td>
                  <td style={{ padding: ".75rem 1.5rem", textAlign: "right", color: "var(--muted)", fontSize: ".9rem" }}>
                    {formatCurrency(vol.rebateProjected)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
