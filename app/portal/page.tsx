"use client";

import Link from "next/link";
import { usePortal } from "@/lib/portal-context";
import {
  getPartnerStats,
  getPartnerTouchpoints,
  getPartnerDeals,
} from "@/lib/portal-demo-data";
import { TOUCHPOINT_LABELS } from "@/lib/types";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Briefcase,
  Plus,
  ArrowRight,
  Mail,
  BarChart3,
  Megaphone,
  Package,
  MapPin,
  Trophy,
} from "lucide-react";

import { formatCurrency, formatNumber } from "@/lib/utils";

// Tier thresholds based on won deals
const TIER_THRESHOLDS = {
  bronze: { minDeals: 0, maxDeals: 2, next: "silver" as const, label: "Bronze" },
  silver: { minDeals: 3, maxDeals: 5, next: "gold" as const, label: "Silver" },
  gold: { minDeals: 6, maxDeals: 9, next: "platinum" as const, label: "Gold" },
  platinum: { minDeals: 10, maxDeals: Infinity, next: null, label: "Platinum" },
};

const TIER_COLORS = {
  bronze: { bg: "#92400e", text: "#fef3c7" },
  silver: { bg: "#6b7280", text: "#f3f4f6" },
  gold: { bg: "#d97706", text: "#fef3c7" },
  platinum: { bg: "#6366f1", text: "#e0e7ff" },
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function PortalDashboard() {
  const { partner } = usePortal();
  if (!partner) return null;

  const stats = getPartnerStats(partner);
  const touchpoints = getPartnerTouchpoints(partner).slice(0, 10);
  const deals = getPartnerDeals(partner);

  // Use lazy import pattern to avoid SSR issues
  const storeModule = require("@/lib/store");
  const { volumePrograms, partnerVolumes, mdfBudgets, territories, channelConflicts } = storeModule.useStore();
  const linkedIds = partner.linkedPartnerIds;
  const activeProgram = volumePrograms?.find((p: any) => p.status === "active" && p.period === "quarterly");
  const myVol = partnerVolumes?.find((v: any) => linkedIds.includes(v.partnerId) && v.programId === activeProgram?._id);
  const myBudget = mdfBudgets?.find((b: any) => linkedIds.includes(b.partnerId));
  const myTerritories = territories?.filter((t: any) => linkedIds.includes(t.partnerId)) || [];
  const myConflicts = channelConflicts?.filter((c: any) => c.partnerIds.some((pid: string) => linkedIds.includes(pid)) && (c.status === "open" || c.status === "under_review")) || [];

  const statCards = [
    {
      label: "Total Earned",
      value: formatCurrency(stats.totalEarned),
      icon: DollarSign,
      color: "#065f46",
      bg: "#ecfdf5",
    },
    {
      label: "Pending Payout",
      value: formatCurrency(stats.pending),
      icon: Clock,
      color: "#92400e",
      bg: "#fffbeb",
    },
    {
      label: "Deals You Influenced",
      value: stats.dealsInPipeline.toString(),
      icon: TrendingUp,
      color: "#3730a3",
      bg: "#eef2ff",
    },
    {
      label: "Active Registrations",
      value: stats.activeDeals.toString(),
      icon: Briefcase,
      color: "#1e40af",
      bg: "#eff6ff",
    },
  ];

  // Tier progress calculations
  const currentTierKey = partner.tier;
  const currentTier = TIER_THRESHOLDS[currentTierKey];
  const nextTierKey = currentTier.next;
  const nextTier = nextTierKey ? TIER_THRESHOLDS[nextTierKey] : null;
  
  // Calculate progress toward next tier
  const dealsNeededForNext = nextTier ? nextTier.minDeals : currentTier.minDeals;
  const dealsInCurrentRange = stats.wonDeals - currentTier.minDeals;
  const dealsRangeSize = nextTier 
    ? nextTier.minDeals - currentTier.minDeals 
    : 1;
  const tierProgress = nextTier 
    ? Math.min(100, Math.round((dealsInCurrentRange / dealsRangeSize) * 100))
    : 100;
  const dealsToNextTier = nextTier 
    ? Math.max(0, nextTier.minDeals - stats.wonDeals)
    : 0;

  // Get current quarter for display
  const now = new Date();
  const quarterLabel = `Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Welcome back, {partner?.contactName?.split(" ")[0] || "Partner"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
          Track your influence, commissions, and deal registrations
        </p>
      </div>

      {/* Tier Progress Card */}
      <div 
        className="card" 
        style={{ 
          padding: "1.5rem 2rem",
          background: `linear-gradient(135deg, ${TIER_COLORS[currentTierKey].bg}22 0%, var(--card-bg) 100%)`,
          border: `1px solid ${TIER_COLORS[currentTierKey].bg}44`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          {/* Left: Tier info */}
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
              <div 
                style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 12, 
                  background: TIER_COLORS[currentTierKey].bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trophy size={22} color={TIER_COLORS[currentTierKey].text} />
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.15rem" }}>Your Tier</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.01em" }}>{currentTier.label}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            {nextTier ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".4rem" }}>
                  <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Progress to {nextTier.label}</span>
                  <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{tierProgress}%</span>
                </div>
                <div 
                  style={{ 
                    width: "100%", 
                    height: 8, 
                    background: "rgba(255,255,255,.1)", 
                    borderRadius: 4, 
                    overflow: "hidden" 
                  }}
                >
                  <div 
                    style={{ 
                      width: `${tierProgress}%`, 
                      height: "100%", 
                      background: TIER_COLORS[currentTierKey].bg,
                      borderRadius: 4,
                      transition: "width 0.5s ease",
                    }} 
                  />
                </div>
                <p style={{ fontSize: ".85rem", color: "var(--muted)", marginTop: ".5rem" }}>
                  <strong style={{ color: "var(--fg)" }}>{dealsToNextTier} more closed deal{dealsToNextTier !== 1 ? "s" : ""}</strong> to reach {nextTier.label}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: ".9rem", color: "#10b981", fontWeight: 600 }}>
                🎉 You&apos;ve reached the highest tier!
              </p>
            )}
          </div>

          {/* Right: Key metrics */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{stats.wonDeals}</p>
              <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Deals Won</p>
              <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>{quarterLabel}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{formatCurrency(stats.totalRevenue)}</p>
              <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Revenue Influenced</p>
              <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>{quarterLabel}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{formatCurrency(stats.totalEarned)}</p>
              <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Commission Earned</p>
              <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>YTD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {statCards.map((s) => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.25rem" }}>{s.label}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <Link
          href="/portal/deals"
          className="card card-hover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1.25rem 1.5rem",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "var(--fg)",
              color: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={18} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Register a Deal</p>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Submit for approval</p>
          </div>
        </Link>

        <Link
          href="/portal/commissions"
          className="card card-hover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1.25rem 1.5rem",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#065f46",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DollarSign size={18} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>View Commissions</p>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Track your earnings</p>
          </div>
        </Link>

        <a
          href={`mailto:${partner.partnerManager.email}`}
          className="card card-hover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1.25rem 1.5rem",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#3730a3",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mail size={18} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Contact Partner Manager</p>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{partner.partnerManager.name}</p>
          </div>
        </a>
      </div>

      {/* Distributor-Specific Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {myVol && (
          <Link href="/portal/volume" className="card card-hover" style={{ padding: "1.25rem", cursor: "pointer" }}>
            <BarChart3 size={20} color="#6366f1" />
            <p style={{ fontWeight: 700, fontSize: "1.3rem", marginTop: ".5rem" }}>{formatNumber(myVol.unitsTotal)} units</p>
            <p className="muted" style={{ fontSize: ".8rem" }}>Volume this quarter</p>
            <p style={{ fontSize: ".8rem", color: "#059669", fontWeight: 600, marginTop: ".25rem" }}>{formatCurrency(myVol.rebateAccrued)} accrued</p>
          </Link>
        )}
        {myBudget && (
          <Link href="/portal/mdf" className="card card-hover" style={{ padding: "1.25rem", cursor: "pointer" }}>
            <Megaphone size={20} color="#d97706" />
            <p style={{ fontWeight: 700, fontSize: "1.3rem", marginTop: ".5rem" }}>{formatCurrency(myBudget.remainingAmount)}</p>
            <p className="muted" style={{ fontSize: ".8rem" }}>MDF balance remaining</p>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: ".25rem" }}>of {formatCurrency(myBudget.allocatedAmount)}</p>
          </Link>
        )}
        <Link href="/portal/products" className="card card-hover" style={{ padding: "1.25rem", cursor: "pointer" }}>
          <Package size={20} color="#7c3aed" />
          <p style={{ fontWeight: 700, fontSize: "1.3rem", marginTop: ".5rem" }}>Products</p>
          <p className="muted" style={{ fontSize: ".8rem" }}>View catalog & pricing</p>
        </Link>
        <Link href="/portal/territory" className="card card-hover" style={{ padding: "1.25rem", cursor: "pointer", position: "relative" }}>
          <MapPin size={20} color="#0284c7" />
          <p style={{ fontWeight: 700, fontSize: "1.3rem", marginTop: ".5rem" }}>{myTerritories.length} territor{myTerritories.length !== 1 ? "ies" : "y"}</p>
          <p className="muted" style={{ fontSize: ".8rem" }}>Your assigned regions</p>
          {myConflicts.length > 0 && (
            <span style={{ position: "absolute", top: 12, right: 12, padding: ".15rem .5rem", borderRadius: 12, fontSize: ".7rem", fontWeight: 600, background: "#fee2e2", color: "#991b1b" }}>
              {myConflicts.length} conflict{myConflicts.length !== 1 ? "s" : ""}
            </span>
          )}
        </Link>
      </div>

      {/* Recent Activity + Deals summary */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem" }}>
        {/* Activity feed */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <strong style={{ fontSize: "0.95rem" }}>Recent Activity</strong>
            <Link href="/portal/deals" style={{ fontSize: "0.8rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {touchpoints.length === 0 ? (
            <div style={{ padding: "2rem 1.5rem", textAlign: "center", color: "var(--muted)" }}>
              <p>No recent activity</p>
            </div>
          ) : (
            touchpoints.map((tp) => {
              const deal = deals.find((d) => d._id === tp.dealId);
              return (
                <div
                  key={tp._id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.9rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--fg)",
                      flexShrink: 0,
                      marginTop: "0.45rem",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.88rem" }}>
                      <strong>{TOUCHPOINT_LABELS[tp.type] || tp.type}</strong>
                      {deal ? (
                        <>
                          {" "}on{" "}
                          <Link
                            href={`/portal/deals/${deal._id}`}
                            style={{ fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px" }}
                          >
                            {deal.name}
                          </Link>
                        </>
                      ) : null}
                    </p>
                    {tp.notes && (
                      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.15rem" }}>{tp.notes}</p>
                    )}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {timeAgo(tp.createdAt)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Quick deal summary */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <strong style={{ fontSize: "0.95rem" }}>Deals You&apos;ve Influenced</strong>
            <span className="badge badge-neutral">{deals.length} total</span>
          </div>
          {deals.slice(0, 6).map((deal) => {
            const statusBadge: Record<string, string> = {
              won: "badge-success",
              open: "badge-info",
              lost: "badge-danger",
            };
            return (
              <Link
                key={deal._id}
                href={`/portal/deals/${deal._id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.8rem 1.5rem",
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontWeight: 500, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {deal.name}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    {formatCurrency(deal.amount)}
                  </p>
                </div>
                <span className={`badge ${statusBadge[deal.status]}`} style={{ textTransform: "capitalize", marginLeft: "0.75rem" }}>
                  {deal.status}
                </span>
              </Link>
            );
          })}
          {deals.length > 6 && (
            <Link
              href="/portal/deals"
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--muted)",
              }}
            >
              View all deals →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
