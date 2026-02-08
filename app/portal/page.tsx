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
} from "lucide-react";

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

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
      label: "Deals in Pipeline",
      value: stats.dealsInPipeline.toString(),
      icon: TrendingUp,
      color: "#3730a3",
      bg: "#eef2ff",
    },
    {
      label: "Active Deals",
      value: stats.activeDeals.toString(),
      icon: Briefcase,
      color: "#1e40af",
      bg: "#eff6ff",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Welcome back, {partner?.contactName?.split(" ")[0] || "Partner"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
          Here&apos;s how {partner.companyName} is performing
        </p>
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
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Submit a new opportunity</p>
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
            <strong style={{ fontSize: "0.95rem" }}>Your Deals</strong>
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
