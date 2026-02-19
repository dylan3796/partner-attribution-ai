"use client";

import { useState, useMemo } from "react";
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

function generateDemoNotifications(): Notification[] {
  return [
    {
      id: "n1", type: "payout", title: "Payout Approved — $4,200",
      body: "Your Q4 commission payout of $4,200 has been approved and is being processed. Expect funds within 5 business days.",
      timestamp: now - 2 * 3600000, read: false,
      actionUrl: "/portal/commissions", actionLabel: "View Commissions",
    },
    {
      id: "n2", type: "deal_update", title: "Deal Won: Acme Corp Cloud Migration",
      body: "The Acme Corp Cloud Migration deal ($85,000) has been marked as won. Your attributed commission of $8,500 (10%) has been calculated.",
      timestamp: now - 8 * 3600000, read: false,
      actionUrl: "/portal/deals", actionLabel: "View Deals",
      meta: { amount: "$85,000", commission: "$8,500" },
    },
    {
      id: "n3", type: "incentive", title: "New SPIF: Q1 Cloud Migration Bonus",
      body: "You're eligible for the Q1 Cloud Migration SPIF — earn an extra $500 per closed cloud deal through March 2026. Enroll now to start earning.",
      timestamp: now - 1 * DAY, read: false,
      actionLabel: "View Program",
    },
    {
      id: "n4", type: "tier_change", title: "Tier Upgrade: Silver → Gold 🎉",
      body: "Congratulations! Based on your recent performance (score: 78/100), you've been upgraded to Gold tier. This unlocks higher commission rates and priority deal registration.",
      timestamp: now - 2 * DAY, read: true,
      actionUrl: "/portal/profile", actionLabel: "View Profile",
    },
    {
      id: "n5", type: "deal_update", title: "Deal Registration Approved",
      body: "Your deal registration for 'Globex Industries Data Platform' ($120,000) has been approved. You have exclusive registration for 90 days.",
      timestamp: now - 3 * DAY, read: true,
      actionUrl: "/portal/deals", actionLabel: "View Deal",
      meta: { amount: "$120,000", exclusivity: "90 days" },
    },
    {
      id: "n6", type: "enablement", title: "New Certification Available: Advanced API Integration",
      body: "A new certification course is available. Completing it will boost your partner score by up to 15 points and unlock the Certification Accelerator rebate multiplier.",
      timestamp: now - 4 * DAY, read: true,
      actionUrl: "/portal/enablement", actionLabel: "Start Course",
    },
    {
      id: "n7", type: "payout", title: "Payout Sent — $6,750",
      body: "Your November commission payout of $6,750 has been sent via ACH transfer. Reference: PAY-2026-1847.",
      timestamp: now - 7 * DAY, read: true,
      meta: { reference: "PAY-2026-1847" },
    },
    {
      id: "n8", type: "deal_update", title: "Deal Lost: Initech Server Upgrade",
      body: "The Initech Server Upgrade deal ($45,000) was marked as lost. Reason: Budget frozen. No commission will be attributed for this deal.",
      timestamp: now - 8 * DAY, read: true,
      meta: { reason: "Budget frozen" },
    },
    {
      id: "n9", type: "system", title: "Partner Portal Maintenance — Feb 22",
      body: "Scheduled maintenance on February 22, 2026 from 2:00 AM - 4:00 AM PST. The portal may be briefly unavailable.",
      timestamp: now - 10 * DAY, read: true,
    },
    {
      id: "n10", type: "incentive", title: "SPIF Achievement: 5-Deal Bonus Unlocked!",
      body: "You've closed 5 cloud migration deals and unlocked the $1,000 accelerator bonus on top of per-deal SPIFs. Total SPIF earnings: $3,500.",
      timestamp: now - 12 * DAY, read: true,
      meta: { totalEarned: "$3,500" },
    },
    {
      id: "n11", type: "enablement", title: "Training Reminder: Sales Methodology Refresh",
      body: "Your Sales Methodology certification expires in 30 days. Complete the refresh course to maintain your certification status and partner score.",
      timestamp: now - 14 * DAY, read: true,
      actionUrl: "/portal/enablement", actionLabel: "Renew Cert",
    },
  ];
}

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
  const [notifications, setNotifications] = useState<Notification[]>(generateDemoNotifications);
  const [filterType, setFilterType] = useState<string>("all");

  if (!partner) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (filterType === "all") return notifications;
    if (filterType === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filterType);
  }, [notifications, filterType]);

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
            <p style={{ fontWeight: 600 }}>No notifications</p>
            <p className="muted" style={{ fontSize: ".875rem" }}>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
