"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, Award, Target, ChevronRight, BarChart3, Trophy, Info } from "lucide-react";

// Volume rebate tiers (program configuration - would typically come from a config table)
const VOLUME_TIERS = [
  { label: "Base", minRevenue: 0, maxRevenue: 50000, rebatePercent: 2 },
  { label: "Growth", minRevenue: 50001, maxRevenue: 150000, rebatePercent: 4 },
  { label: "Accelerator", minRevenue: 150001, maxRevenue: 350000, rebatePercent: 6 },
  { label: "Elite", minRevenue: 350001, maxRevenue: null, rebatePercent: 8 },
];

function getVolumeTier(revenue: number) {
  for (let i = VOLUME_TIERS.length - 1; i >= 0; i--) {
    const tier = VOLUME_TIERS[i];
    if (revenue >= tier.minRevenue) {
      const nextTier = VOLUME_TIERS[i + 1];
      return {
        tier,
        index: i,
        nextTier: nextTier || null,
        revenueToNext: nextTier ? nextTier.minRevenue - revenue : 0,
      };
    }
  }
  return { tier: VOLUME_TIERS[0], index: 0, nextTier: VOLUME_TIERS[1], revenueToNext: VOLUME_TIERS[1].minRevenue };
}

function ProgressBar({ value, max, color = "#6366f1" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

export default function VolumeRebatesPage() {
  const partners = useQuery(api.partners.listWithStats) ?? [];
  const deals = useQuery(api.dealsCrud.list) ?? [];

  // Calculate partner volumes from real deal data
  const partnerVolumes = useMemo(() => {
    // Group deals by registeredBy partner and calculate totals
    const volumeMap = new Map<string, { 
      partnerId: string; 
      partnerName: string;
      territory: string;
      dealCount: number;
      wonDealCount: number;
      revenueTotal: number;
      pipelineValue: number;
    }>();

    // Initialize with all partners
    partners.forEach(partner => {
      volumeMap.set(partner._id, {
        partnerId: partner._id,
        partnerName: partner.name,
        territory: partner.territory || "—",
        dealCount: 0,
        wonDealCount: 0,
        revenueTotal: 0,
        pipelineValue: 0,
      });
    });

    // Aggregate deal data
    deals.forEach(deal => {
      if (deal.registeredBy) {
        const existing = volumeMap.get(deal.registeredBy);
        if (existing) {
          existing.dealCount++;
          if (deal.status === "won") {
            existing.wonDealCount++;
            existing.revenueTotal += deal.amount;
          } else if (deal.status === "open") {
            existing.pipelineValue += deal.amount;
          }
        }
      }
    });

    return Array.from(volumeMap.values())
      .filter(v => v.dealCount > 0) // Only show partners with deals
      .sort((a, b) => b.revenueTotal - a.revenueTotal);
  }, [partners, deals]);

  const totalRevenue = partnerVolumes.reduce((s, v) => s + v.revenueTotal, 0);
  const totalPipeline = partnerVolumes.reduce((s, v) => s + v.pipelineValue, 0);
  const totalRebates = partnerVolumes.reduce((s, v) => {
    const tierInfo = getVolumeTier(v.revenueTotal);
    return s + (v.revenueTotal * tierInfo.tier.rebatePercent / 100);
  }, 0);

  const tierColors: Record<string, string> = { 
    Base: "#6b7280", 
    Growth: "#2563eb", 
    Accelerator: "#d97706", 
    Elite: "#059669" 
  };
  const tierBgs: Record<string, string> = { 
    Base: "#f3f4f6", 
    Growth: "#eff6ff", 
    Accelerator: "#fffbeb", 
    Elite: "#ecfdf5" 
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Volume Rebates</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Track volume-based incentive progress and partner performance</p>
        </div>
        <Link
          href="/dashboard/volume-rebates/create"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
            borderRadius: 8, background: "#6366f1", color: "#fff", fontWeight: 600,
            fontSize: ".85rem", textDecoration: "none", whiteSpace: "nowrap",
          }}
        >
          + Create Rebate
        </Link>
      </div>

      {/* Info Banner */}
      <div style={{ 
        padding: "1rem 1.25rem", 
        borderRadius: 10, 
        border: "1px solid #a5b4fc", 
        background: "#eef2ff", 
        display: "flex", 
        alignItems: "center", 
        gap: "1rem" 
      }}>
        <Info size={22} color="#4338ca" />
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#4338ca" }}>
            Volume Tracking — Live Data
          </p>
          <p style={{ fontSize: ".85rem", color: "#6366f1" }}>
            Partner volumes are calculated from won deals in your database. Rebate percentages are based on the tier structure shown below.
          </p>
        </div>
      </div>

      {/* Program Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={20} color="#4338ca" />
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Active Partners</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{partnerVolumes.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={20} color="#065f46" />
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Total Won Revenue</p>
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
              <p className="muted" style={{ fontSize: ".8rem" }}>Rebates Earned</p>
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
              <p className="muted" style={{ fontSize: ".8rem" }}>Pipeline Value</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatCurrency(totalPipeline)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Structure */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <Trophy size={18} color="#d97706" /> Rebate Tier Structure
        </h2>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
          Partners earn rebates based on their cumulative won deal revenue
        </p>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${VOLUME_TIERS.length}, 1fr)`, gap: "1rem" }}>
          {VOLUME_TIERS.map((tier, i) => {
            const partnersInTier = partnerVolumes.filter(v => {
              const t = getVolumeTier(v.revenueTotal);
              return t.index === i;
            });
            return (
              <div
                key={i}
                style={{
                  padding: "1.25rem",
                  borderRadius: 10,
                  border: `2px solid ${tierColors[tier.label] || "#6b7280"}`,
                  background: tierBgs[tier.label] || "#f3f4f6",
                  textAlign: "center",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "1rem", color: tierColors[tier.label], marginBottom: ".25rem" }}>{tier.label}</p>
                <p style={{ fontSize: "2rem", fontWeight: 800, color: tierColors[tier.label] }}>{tier.rebatePercent}%</p>
                <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: ".25rem" }}>
                  {formatCurrency(tier.minRevenue)}–{tier.maxRevenue ? formatCurrency(tier.maxRevenue) : "∞"}
                </p>
                <div style={{ marginTop: ".75rem", padding: ".4rem .6rem", borderRadius: 6, background: "rgba(255,255,255,0.7)", fontSize: ".8rem", fontWeight: 600 }}>
                  {partnersInTier.length} partner{partnersInTier.length !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volume Leaderboard */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Volume Leaderboard</h2>
          <span className="badge badge-info">Live standings</span>
        </div>
        {partnerVolumes.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <BarChart3 size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
            <p className="muted">No partner volumes to display</p>
            <p className="muted" style={{ fontSize: ".85rem", marginTop: ".5rem" }}>
              Volume data will appear once partners have registered and won deals.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: ".75rem 1.5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Rank</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Partner</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Won Deals</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Revenue</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "center", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Current Tier</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)", minWidth: 180 }}>Progress</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Rebate Earned</th>
                <th style={{ padding: ".75rem 1.5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {partnerVolumes.map((vol, idx) => {
                const tierInfo = getVolumeTier(vol.revenueTotal);
                const rebateEarned = vol.revenueTotal * tierInfo.tier.rebatePercent / 100;
                const rankEmoji = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;

                return (
                  <tr key={vol.partnerId} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: ".75rem 1.5rem", fontWeight: 700, fontSize: "1rem" }}>{rankEmoji}</td>
                    <td style={{ padding: ".75rem .5rem" }}>
                      <Link href={`/dashboard/partners/${vol.partnerId}`} style={{ fontWeight: 600, fontSize: ".9rem" }}>
                        {vol.partnerName}
                      </Link>
                      <p className="muted" style={{ fontSize: ".75rem" }}>{vol.territory}</p>
                    </td>
                    <td style={{ padding: ".75rem .5rem", textAlign: "right", fontWeight: 700, fontSize: ".95rem" }}>
                      {vol.wonDealCount}
                    </td>
                    <td style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".9rem" }}>
                      {formatCurrency(vol.revenueTotal)}
                    </td>
                    <td style={{ padding: ".75rem .5rem", textAlign: "center" }}>
                      <span
                        style={{
                          padding: ".25rem .75rem",
                          borderRadius: 20,
                          fontSize: ".8rem",
                          fontWeight: 600,
                          background: `${tierColors[tierInfo.tier.label]}18`,
                          color: tierColors[tierInfo.tier.label],
                          border: `1px solid ${tierColors[tierInfo.tier.label]}40`,
                        }}
                      >
                        {tierInfo.tier.label} ({tierInfo.tier.rebatePercent}%)
                      </span>
                    </td>
                    <td style={{ padding: ".75rem .5rem" }}>
                      {tierInfo.nextTier ? (
                        <div>
                          <ProgressBar
                            value={vol.revenueTotal - tierInfo.tier.minRevenue}
                            max={tierInfo.nextTier.minRevenue - tierInfo.tier.minRevenue}
                            color={tierColors[tierInfo.tier.label]}
                          />
                          <div style={{ display: "flex", alignItems: "center", gap: ".25rem", marginTop: ".3rem" }}>
                            <span className="muted" style={{ fontSize: ".7rem" }}>
                              {formatCurrency(tierInfo.revenueToNext)} to
                            </span>
                            <ChevronRight size={12} color="var(--muted)" />
                            <span style={{ fontSize: ".7rem", fontWeight: 600, color: tierColors[tierInfo.nextTier.label] }}>
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
                      {formatCurrency(rebateEarned)}
                    </td>
                    <td style={{ padding: ".75rem 1.5rem", textAlign: "right", color: "var(--muted)", fontSize: ".9rem" }}>
                      {formatCurrency(vol.pipelineValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
