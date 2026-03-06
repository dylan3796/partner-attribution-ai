"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePortal } from "@/lib/portal-context";
import { TOUCHPOINT_LABELS } from "@/lib/types";
import type { Id } from "@/convex/_generated/dataModel";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Briefcase,
  Plus,
  ArrowRight,
  Mail,
  Package,
  Trophy,
  Loader2,
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";

// Tier thresholds based on won deals
const TIER_THRESHOLDS = {
  bronze: { minDeals: 0, maxDeals: 2, next: "silver" as const, label: "Bronze" },
  silver: { minDeals: 3, maxDeals: 5, next: "gold" as const, label: "Silver" },
  gold: { minDeals: 6, maxDeals: 9, next: "platinum" as const, label: "Gold" },
  platinum: { minDeals: 10, maxDeals: Infinity, next: null, label: "Platinum" },
};

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
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

/** Shimmer skeleton block */
function Skeleton({ width, height, style }: { width?: string | number; height?: string | number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: width ?? "100%",
        height: height ?? 20,
        borderRadius: 6,
        background: "linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <Skeleton width={280} height={32} />
        <Skeleton width={350} height={16} style={{ marginTop: 8 }} />
      </div>
      <Skeleton height={160} style={{ borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: "1.25rem" }}>
            <Skeleton width={40} height={40} style={{ borderRadius: 10 }} />
            <Skeleton width="60%" height={14} style={{ marginTop: 12 }} />
            <Skeleton width="40%" height={24} style={{ marginTop: 6 }} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem" }}>
        <Skeleton height={300} style={{ borderRadius: 12 }} />
        <Skeleton height={300} style={{ borderRadius: 12 }} />
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const { partner } = usePortal();

  // Convex queries — skip if no partner session
  const partnerId = partner?.id as Id<"partners"> | undefined;
  const stats = useQuery(api.portalDashboard.getStats, partnerId ? { partnerId } : "skip");
  const deals = useQuery(api.portalDashboard.getDeals, partnerId ? { partnerId } : "skip");
  const touchpoints = useQuery(api.portalDashboard.getRecentTouchpoints, partnerId ? { partnerId, limit: 10 } : "skip");

  if (!partner) return null;

  // Show loading skeleton while Convex queries resolve
  const isLoading = stats === undefined || deals === undefined || touchpoints === undefined;
  if (isLoading) return <DashboardSkeleton />;

  // Fallback stats if query returns null (partner not found)
  const s = stats ?? {
    totalEarned: 0, pending: 0, paidThisMonth: 0, paidThisQuarter: 0,
    dealsInPipeline: 0, activeDeals: 0, totalDeals: 0, wonDeals: 0, totalRevenue: 0,
  };

  const statCards = [
    {
      label: "Total Earned",
      value: formatCurrency(s.totalEarned),
      icon: DollarSign,
      color: "#065f46",
      bg: "#ecfdf5",
    },
    {
      label: "Pending Payout",
      value: formatCurrency(s.pending),
      icon: Clock,
      color: "#92400e",
      bg: "#fffbeb",
    },
    {
      label: "Deals You Influenced",
      value: s.dealsInPipeline.toString(),
      icon: TrendingUp,
      color: "#3730a3",
      bg: "#eef2ff",
    },
    {
      label: "Active Registrations",
      value: s.activeDeals.toString(),
      icon: Briefcase,
      color: "#1e40af",
      bg: "#eff6ff",
    },
  ];

  // Tier progress calculations
  const currentTierKey = partner.tier as keyof typeof TIER_THRESHOLDS;
  const currentTier = TIER_THRESHOLDS[currentTierKey] ?? TIER_THRESHOLDS.bronze;
  const nextTierKey = currentTier.next;
  const nextTier = nextTierKey ? TIER_THRESHOLDS[nextTierKey] : null;
  
  const dealsInCurrentRange = s.wonDeals - currentTier.minDeals;
  const dealsRangeSize = nextTier 
    ? nextTier.minDeals - currentTier.minDeals 
    : 1;
  const tierProgress = nextTier 
    ? Math.min(100, Math.round((dealsInCurrentRange / dealsRangeSize) * 100))
    : 100;
  const dealsToNextTier = nextTier 
    ? Math.max(0, nextTier.minDeals - s.wonDeals)
    : 0;

  const now = new Date();
  const quarterLabel = `Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}`;

  const [showOnboardingBanner, setShowOnboardingBanner] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("covant_onboarding_done") !== "true";
  });

  const tierColors = TIER_COLORS[currentTierKey] ?? TIER_COLORS.bronze;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Onboarding Banner */}
      {showOnboardingBanner && (
        <Link
          href="/portal/onboarding"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", textDecoration: "none",
            boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.5rem" }}>🚀</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: ".95rem" }}>Complete your onboarding</div>
              <div style={{ fontSize: ".8rem", opacity: 0.85 }}>Set up your profile, learn about your benefits, and register your first deal</div>
            </div>
          </div>
          <ArrowRight size={20} style={{ flexShrink: 0 }} />
        </Link>
      )}

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
          background: `linear-gradient(135deg, ${tierColors.bg}22 0%, var(--card-bg) 100%)`,
          border: `1px solid ${tierColors.bg}44`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
              <div 
                style={{ 
                  width: 44, height: 44, borderRadius: 12, 
                  background: tierColors.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Trophy size={22} color={tierColors.text} />
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.15rem" }}>Your Tier</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.01em" }}>{currentTier.label}</p>
              </div>
            </div>
            
            {nextTier ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".4rem" }}>
                  <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Progress to {nextTier.label}</span>
                  <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{tierProgress}%</span>
                </div>
                <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,.1)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${tierProgress}%`, height: "100%", background: tierColors.bg, borderRadius: 4, transition: "width 0.5s ease" }} />
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

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{s.wonDeals}</p>
              <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Deals Won</p>
              <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>{quarterLabel}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{formatCurrency(s.totalRevenue)}</p>
              <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Revenue Influenced</p>
              <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>{quarterLabel}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{formatCurrency(s.totalEarned)}</p>
              <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Commission Earned</p>
              <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>YTD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {statCards.map((sc) => (
          <div key={sc.label} className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 10, background: sc.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <sc.icon size={20} color={sc.color} />
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.25rem" }}>{sc.label}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{sc.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <Link
          href="/portal/deals"
          className="card card-hover"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem 1.5rem", cursor: "pointer" }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--fg)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem 1.5rem", cursor: "pointer" }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#065f46", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={18} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>View Commissions</p>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Track your earnings</p>
          </div>
        </Link>

        <Link
          href="/portal/resources"
          className="card card-hover"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem 1.5rem", cursor: "pointer" }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Package size={18} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Resources & Products</p>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Sales materials & catalog</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity + Deals summary */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem" }}>
        {/* Activity feed — real touchpoint data */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong style={{ fontSize: "0.95rem" }}>Recent Activity</strong>
            <Link href="/portal/deals" style={{ fontSize: "0.8rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {touchpoints.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", marginBottom: ".5rem" }}>No activity yet</p>
              <p style={{ fontSize: ".85rem", color: "var(--muted)" }}>Touchpoints will appear here as you engage with deals</p>
            </div>
          ) : (
            touchpoints.map((tp) => (
              <div
                key={tp._id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "0.75rem",
                  padding: "0.9rem 1.5rem", borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--fg)", flexShrink: 0, marginTop: "0.45rem" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.88rem" }}>
                    <strong>{TOUCHPOINT_LABELS[tp.type] || tp.type}</strong>
                    {tp.dealName && tp.dealName !== "Unknown Deal" && (
                      <> on <span style={{ fontWeight: 600 }}>{tp.dealName}</span></>
                    )}
                    {tp.dealAmount > 0 && (
                      <span style={{ color: "var(--muted)", fontSize: ".8rem" }}> ({formatCurrency(tp.dealAmount)})</span>
                    )}
                  </p>
                  {tp.notes && (
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.15rem" }}>{tp.notes}</p>
                  )}
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {timeAgo(tp.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick deal summary — real deal data */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong style={{ fontSize: "0.95rem" }}>Deals You&apos;ve Influenced</strong>
            <span className="badge badge-neutral">{deals.length} total</span>
          </div>
          {deals.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", marginBottom: ".5rem" }}>No deals yet</p>
              <Link href="/portal/deals" style={{ fontSize: ".85rem", color: "#6366f1", fontWeight: 600 }}>
                Register your first deal →
              </Link>
            </div>
          ) : (
            <>
              {deals.slice(0, 6).map((deal) => {
                const statusBadge: Record<string, string> = {
                  won: "badge-success",
                  open: "badge-info",
                  lost: "badge-danger",
                };
                return (
                  <div
                    key={deal._id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.8rem 1.5rem", borderBottom: "1px solid var(--border)",
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
                    <span className={`badge ${statusBadge[deal.status] ?? "badge-neutral"}`} style={{ textTransform: "capitalize", marginLeft: "0.75rem" }}>
                      {deal.status}
                    </span>
                  </div>
                );
              })}
              {deals.length > 6 && (
                <Link
                  href="/portal/deals"
                  style={{ display: "block", textAlign: "center", padding: "0.75rem", fontSize: "0.85rem", fontWeight: 500, color: "var(--muted)" }}
                >
                  View all deals →
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
