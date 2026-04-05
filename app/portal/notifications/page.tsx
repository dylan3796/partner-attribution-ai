"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { usePortal } from "@/lib/portal-context";
import { formatCurrency } from "@/lib/utils";
import {
  Bell,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Briefcase,
  Award,
  Gift,
  AlertCircle,
  Star,
  ChevronRight,
  Filter,
  CheckCheck,
} from "lucide-react";

type NotificationType = "deal_update" | "payout" | "tier_change" | "incentive" | "enablement" | "system";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  meta?: Record<string, string>;
};

const DAY = 86400000;
const now = Date.now();

/* Demo notification generator removed — notifications now come from real Convex data only */

const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; color: string; label: string }> = {
  deal_update: { icon: Briefcase, color: "#3b82f6", label: "Deal" },
  payout: { icon: DollarSign, color: "#22c55e", label: "Payout" },
  tier_change: { icon: TrendingUp, color: "#8b5cf6", label: "Tier" },
  incentive: { icon: Gift, color: "#f59e0b", label: "Incentive" },
  enablement: { icon: Award, color: "#14b8a6", label: "Training" },
  system: { icon: AlertCircle, color: "#64748b", label: "System" },
};

function timeAgo(ts: number): string {
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(diff / DAY);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { partner } = usePortal();
  const convexNotifs = useQuery(api.notifications.list, {});
  const markReadMutation = useMutation(api.notifications.markRead);
  const markAllReadMutation = useMutation(api.notifications.markAllRead);
  const [filterType, setFilterType] = useState<string>("all");

  if (!partner) return null;

  // Map Convex notifications to component format, fall back to demo data
  const TYPE_MAP: Record<string, NotificationType> = {
    deal_approved: "deal_update",
    commission_paid: "payout",
    partner_joined: "system",
    tier_change: "tier_change",
    deal_disputed: "deal_update",
    system: "system",
  };

  const notifications: Notification[] = useMemo(() => {
    if (!convexNotifs) return [];
    return convexNotifs.map((n: any) => ({
      id: n._id,
      type: TYPE_MAP[n.type] || "system",
      title: n.title,
      body: n.body,
      timestamp: n.createdAt,
      read: n.read,
      actionUrl: n.link,
      actionLabel: n.link ? "View" : undefined,
    }));
  }, [convexNotifs]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (filterType === "all") return notifications;
    if (filterType === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filterType);
  }, [notifications, filterType]);

  function markRead(id: string) {
    markReadMutation({ id: id as Id<"notifications"> }).catch(() => {});
  }

  function markAllRead() {
    markAllReadMutation({}).catch(() => {});
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Notifications</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"} · {notifications.length} total
          </p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
          <select className="input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ maxWidth: 170 }}>
            <option value="all">All</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="deal_update">Deals</option>
            <option value="payout">Payouts</option>
            <option value="tier_change">Tier Changes</option>
            <option value="incentive">Incentives</option>
            <option value="enablement">Training</option>
            <option value="system">System</option>
          </select>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-outline" style={{ fontSize: ".8rem", display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Type summary pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const count = notifications.filter((n) => n.type === type).length;
          const unread = notifications.filter((n) => n.type === type && !n.read).length;
          if (count === 0) return null;
          const Icon = cfg.icon;
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "all" : type)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999,
                fontSize: ".8rem", fontWeight: 600, cursor: "pointer",
                border: filterType === type ? `2px solid ${cfg.color}` : "1px solid var(--border)",
                background: filterType === type ? `${cfg.color}12` : "transparent",
                color: filterType === type ? cfg.color : "var(--muted)",
              }}
            >
              <Icon size={14} /> {cfg.label}
              {unread > 0 && (
                <span style={{
                  width: 18, height: 18, borderRadius: 9, background: cfg.color, color: "#fff",
                  fontSize: ".65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((notif) => {
          const cfg = TYPE_CONFIG[notif.type];
          const Icon = cfg.icon;
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className="card"
              style={{
                padding: "1rem 1.25rem", cursor: "pointer",
                borderLeft: `3px solid ${!notif.read ? cfg.color : "transparent"}`,
                opacity: notif.read ? 0.75 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${cfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color,
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{notif.title}</span>
                      {!notif.read && (
                        <span style={{ width: 8, height: 8, borderRadius: 4, background: cfg.color, flexShrink: 0 }} />
                      )}
                    </div>
                    <span className="muted" style={{ fontSize: ".75rem", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(notif.timestamp)}</span>
                  </div>
                  <p className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5, marginTop: 4 }}>{notif.body}</p>

                  {/* Meta tags */}
                  {notif.meta && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      {Object.entries(notif.meta).map(([k, v]) => (
                        <span key={k} style={{
                          padding: "2px 8px", borderRadius: 6, fontSize: ".7rem", fontWeight: 600,
                          background: "var(--subtle)", color: "var(--muted)", textTransform: "capitalize",
                        }}>
                          {k.replace(/_/g, " ")}: {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action link */}
                  {notif.actionLabel && (
                    <a
                      href={notif.actionUrl || "#"}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8,
                        fontSize: ".8rem", fontWeight: 600, color: cfg.color, textDecoration: "none",
                      }}
                    >
                      {notif.actionLabel} <ChevronRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <Bell size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600 }}>No notifications yet</p>
            <p className="muted" style={{ fontSize: ".875rem" }}>
              {filterType !== "all" ? "No notifications match this filter." : "Notifications will appear here when deals are approved, commissions are calculated, or your tier changes."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
