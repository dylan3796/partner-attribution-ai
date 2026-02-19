"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import {
  Gift,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Award,
  CheckCircle2,
  Clock,
  Trophy,
  Star,
  Inbox,
  ArrowRight,
} from "lucide-react";

function ProgressBar({ value, max, color = "#6366f1" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{value}</div>
        {sub && <div className="muted" style={{ fontSize: ".8rem" }}>{sub}</div>}
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier?: string }) {
  if (!tier) return null;
  const colors: Record<string, { bg: string; fg: string }> = {
    platinum: { bg: "#a78bfa22", fg: "#a78bfa" },
    gold: { bg: "#eab30822", fg: "#eab308" },
    silver: { bg: "#94a3b822", fg: "#94a3b8" },
    bronze: { bg: "#d9770622", fg: "#d97706" },
  };
  const c = colors[tier] || colors.bronze;
  return (
    <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", background: c.bg, color: c.fg }}>
      {tier}
    </span>
  );
}

function IncentiveBadge({ type, eligible }: { type: string; eligible: boolean }) {
  const config: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    spif: { label: "SPIF Eligible", color: "#8b5cf6", icon: <Zap size={12} /> },
    bonus: { label: "Bonus Eligible", color: "#3b82f6", icon: <DollarSign size={12} /> },
    accelerator: { label: "Accelerator", color: "#f59e0b", icon: <TrendingUp size={12} /> },
    dealReg: { label: "Deal Reg Bonus", color: "#ec4899", icon: <Target size={12} /> },
  };
  const c = config[type] || { label: type, color: "#6366f1", icon: <Gift size={12} /> };
  
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: ".7rem",
      fontWeight: 700,
      background: eligible ? `${c.color}22` : "var(--border)",
      color: eligible ? c.color : "var(--muted)",
      opacity: eligible ? 1 : 0.6,
    }}>
      {c.icon} {c.label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div style={{ width: 280, height: 32, background: "var(--border)", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ width: 320, height: 16, background: "var(--border)", borderRadius: 4 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem" }}>
            <div style={{ width: 44, height: 44, background: "var(--border)", borderRadius: 12 }} />
            <div>
              <div style={{ width: 80, height: 12, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: 60, height: 24, background: "var(--border)", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ width: 200, height: 20, background: "var(--border)", borderRadius: 4, marginBottom: 16 }} />
        {[1,2,3].map(i => (
          <div key={i} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderTop: "1px solid var(--border)" }}>
            <div style={{ width: 40, height: 40, background: "var(--border)", borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: 150, height: 16, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: 200, height: 12, background: "var(--border)", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <Inbox size={48} style={{ color: "var(--muted)", margin: "0 auto 1rem" }} />
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: ".5rem" }}>No Active Partners</h3>
      <p className="muted" style={{ marginBottom: "1.5rem", maxWidth: 400, margin: "0 auto 1.5rem" }}>
        Partner incentive eligibility is calculated based on deal performance. Add partners and deals to see incentive tracking.
      </p>
      <Link href="/dashboard/partners" className="btn">
        <Users size={16} /> View Partners
      </Link>
    </div>
  );
}

// Incentive program definitions (these would eventually be configurable)
const INCENTIVE_PROGRAMS = [
  {
    id: "spif",
    name: "Q1 SPIF Program",
    type: "spif",
    description: "Close 3+ deals to earn a $500 SPIF bonus",
    threshold: 3,
    metric: "dealsWon",
    reward: 500,
    rewardType: "flat" as const,
  },
  {
    id: "bonus",
    name: "Revenue Bonus",
    type: "bonus",
    description: "Earn 2% bonus on revenue exceeding $100,000",
    threshold: 100000,
    metric: "totalRevenue",
    reward: 2,
    rewardType: "percentage" as const,
  },
  {
    id: "accelerator",
    name: "Top Performer Accelerator",
    type: "accelerator",
    description: "5+ deals AND $200k+ revenue unlocks 1.5x commission multiplier",
    threshold: { deals: 5, revenue: 200000 },
    metric: "combined",
    reward: 1.5,
    rewardType: "multiplier" as const,
  },
  {
    id: "dealReg",
    name: "Deal Registration Bonus",
    type: "dealReg",
    description: "Register 2+ deals to earn $250 bonus",
    threshold: 2,
    metric: "dealsRegistered",
    reward: 250,
    rewardType: "flat" as const,
  },
];

export default function IncentivesPage() {
  const partnerPerformance = useQuery(api.dashboard.getPartnerPerformance);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  if (partnerPerformance === undefined) {
    return <LoadingSkeleton />;
  }

  if (partnerPerformance.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Incentive Programs</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Partner performance and incentive eligibility</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  // Calculate summary stats
  const eligibleForSpif = partnerPerformance.filter((p: any) => p.incentives.spifEligible).length;
  const eligibleForBonus = partnerPerformance.filter((p: any) => p.incentives.bonusEligible).length;
  const eligibleForAccelerator = partnerPerformance.filter((p: any) => p.incentives.acceleratorEligible).length;
  const totalCommissions = partnerPerformance.reduce((s: number, p: any) => s + p.metrics.totalCommission, 0);
  const totalRevenue = partnerPerformance.reduce((s: number, p: any) => s + p.metrics.totalRevenue, 0);

  // Filter partners
  const filtered = filterType === "all" 
    ? partnerPerformance 
    : partnerPerformance.filter((p: any) => {
        if (filterType === "spif") return p.incentives.spifEligible;
        if (filterType === "bonus") return p.incentives.bonusEligible;
        if (filterType === "accelerator") return p.incentives.acceleratorEligible;
        if (filterType === "dealReg") return p.incentives.dealRegBonus;
        return true;
      });

  const selectedPartner = selectedPartnerId 
    ? partnerPerformance.find((p: any) => p._id === selectedPartnerId)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Incentive Programs</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Partner performance and incentive eligibility based on real deal data</p>
        </div>
        <select
          className="input"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="all">All Partners</option>
          <option value="spif">SPIF Eligible</option>
          <option value="bonus">Bonus Eligible</option>
          <option value="accelerator">Accelerator Tier</option>
          <option value="dealReg">Deal Reg Bonus</option>
        </select>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <StatCard icon={<Zap size={22} />} label="SPIF Eligible" value={String(eligibleForSpif)} sub={`of ${partnerPerformance.length} partners`} />
        <StatCard icon={<DollarSign size={22} />} label="Total Revenue" value={formatCurrency(totalRevenue)} sub={`from ${partnerPerformance.length} partners`} />
        <StatCard icon={<Award size={22} />} label="Top Performers" value={String(eligibleForAccelerator)} sub="accelerator eligible" />
        <StatCard icon={<Gift size={22} />} label="Total Commissions" value={formatCurrency(totalCommissions)} sub="earned to date" />
      </div>

      {/* Programs Overview */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Active Incentive Programs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {INCENTIVE_PROGRAMS.map((program) => {
            const eligibleCount = partnerPerformance.filter((p: any) => {
              const inv = p.incentives;
              if (program.id === "spif") return inv.spifEligible;
              if (program.id === "bonus") return inv.bonusEligible;
              if (program.id === "accelerator") return inv.acceleratorEligible;
              if (program.id === "dealReg") return inv.dealRegBonus;
              return false;
            }).length;
            
            return (
              <div key={program.id} style={{ padding: "1rem", borderRadius: 12, border: "1px solid var(--border)", background: "var(--subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 700 }}>{program.name}</h3>
                  <IncentiveBadge type={program.id} eligible={true} />
                </div>
                <p className="muted" style={{ fontSize: ".85rem", marginBottom: 12, lineHeight: 1.4 }}>{program.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="muted" style={{ fontSize: ".8rem" }}>
                    <Users size={13} style={{ verticalAlign: -2 }} /> {eligibleCount} eligible
                  </span>
                  <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#22c55e" }}>
                    {program.rewardType === "flat" && `$${program.reward}`}
                    {program.rewardType === "percentage" && `${program.reward}% bonus`}
                    {program.rewardType === "multiplier" && `${program.reward}x multiplier`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner Leaderboard */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Partner Performance Leaderboard</h2>
          <span className="muted" style={{ fontSize: ".85rem" }}>{filtered.length} partners</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {filtered.map((partner: any, idx: number) => {
            const isSelected = selectedPartnerId === partner._id;
            const isTop3 = partner.rank <= 3;
            
            return (
              <div key={partner._id}>
                <div
                  onClick={() => setSelectedPartnerId(isSelected ? null : partner._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    cursor: "pointer",
                    borderTop: idx > 0 ? "1px solid var(--border)" : "none",
                    background: isSelected ? "rgba(99,102,241,0.05)" : "transparent",
                    borderRadius: isSelected ? 8 : 0,
                  }}
                >
                  {/* Rank */}
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 8, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    background: isTop3 ? (partner.rank === 1 ? "#eab308" : partner.rank === 2 ? "#94a3b8" : "#d97706") : "var(--border)",
                    color: isTop3 ? "white" : "var(--fg)",
                    fontSize: ".9rem",
                    fontWeight: 800,
                  }}>
                    {isTop3 ? <Trophy size={16} /> : partner.rank}
                  </div>
                  
                  {/* Partner info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: ".95rem", fontWeight: 700 }}>{partner.name}</span>
                      <TierBadge tier={partner.tier} />
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <IncentiveBadge type="spif" eligible={partner.incentives.spifEligible} />
                      <IncentiveBadge type="bonus" eligible={partner.incentives.bonusEligible} />
                      <IncentiveBadge type="accelerator" eligible={partner.incentives.acceleratorEligible} />
                      <IncentiveBadge type="dealReg" eligible={partner.incentives.dealRegBonus} />
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#22c55e" }}>
                      {formatCurrency(partner.metrics.totalRevenue)}
                    </div>
                    <div className="muted" style={{ fontSize: ".8rem" }}>
                      {partner.metrics.dealsWon} won · {partner.metrics.dealsOpen} open
                    </div>
                  </div>
                </div>
                
                {/* Expanded details */}
                {isSelected && (
                  <div style={{ padding: "0 1rem 1rem", background: "rgba(99,102,241,0.05)", borderRadius: "0 0 8px 8px", marginTop: -8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--border)" }}>
                      <div>
                        <p className="muted" style={{ fontSize: ".75rem", marginBottom: 4 }}>Total Revenue</p>
                        <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#22c55e" }}>{formatCurrency(partner.metrics.totalRevenue)}</p>
                      </div>
                      <div>
                        <p className="muted" style={{ fontSize: ".75rem", marginBottom: 4 }}>Open Pipeline</p>
                        <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#6366f1" }}>{formatCurrency(partner.metrics.openPipeline)}</p>
                      </div>
                      <div>
                        <p className="muted" style={{ fontSize: ".75rem", marginBottom: 4 }}>Commission Earned</p>
                        <p style={{ fontSize: "1.2rem", fontWeight: 800 }}>{formatCurrency(partner.metrics.totalCommission)}</p>
                      </div>
                      <div>
                        <p className="muted" style={{ fontSize: ".75rem", marginBottom: 4 }}>Avg Deal Size</p>
                        <p style={{ fontSize: "1.2rem", fontWeight: 800 }}>{formatCurrency(partner.metrics.avgDealSize)}</p>
                      </div>
                    </div>
                    
                    {/* Progress toward incentives */}
                    <div style={{ marginTop: "1.25rem" }}>
                      <p className="muted" style={{ fontSize: ".75rem", fontWeight: 600, marginBottom: 8 }}>INCENTIVE PROGRESS</p>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* SPIF Progress */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem", marginBottom: 4 }}>
                            <span>SPIF (3 deals)</span>
                            <span style={{ fontWeight: 600 }}>{partner.metrics.dealsWon}/3</span>
                          </div>
                          <ProgressBar value={partner.metrics.dealsWon} max={3} color={partner.incentives.spifEligible ? "#22c55e" : "#6366f1"} />
                        </div>
                        
                        {/* Bonus Progress */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem", marginBottom: 4 }}>
                            <span>Revenue Bonus ($100k)</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(partner.metrics.totalRevenue)}</span>
                          </div>
                          <ProgressBar value={partner.metrics.totalRevenue} max={100000} color={partner.incentives.bonusEligible ? "#22c55e" : "#6366f1"} />
                        </div>
                        
                        {/* Deal Reg Progress */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem", marginBottom: 4 }}>
                            <span>Deal Registrations (2)</span>
                            <span style={{ fontWeight: 600 }}>{partner.metrics.dealsRegistered}/2</span>
                          </div>
                          <ProgressBar value={partner.metrics.dealsRegistered} max={2} color={partner.incentives.dealRegBonus ? "#22c55e" : "#6366f1"} />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: "1rem" }}>
                      <Link 
                        href={`/dashboard/partners/${partner._id}`}
                        className="btn-outline"
                        style={{ fontSize: ".8rem", padding: ".4rem .8rem" }}
                      >
                        View Partner Profile <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
