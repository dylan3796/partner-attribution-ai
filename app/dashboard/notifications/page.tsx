"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Bell,
  Check,
  CheckCheck,
  Trophy,
  DollarSign,
  UserPlus,
  Briefcase,
  AlertTriangle,
  Info,
  Filter,
  Loader2,
  Inbox,
  Settings,
  Trash2,
} from "lucide-react";

/* ── Types ── */

type NotificationType =
  | "deal_approved"
  | "commission_paid"
  | "partner_joined"
  | "tier_change"
  | "deal_disputed"
  | "system";

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: typeof Bell; color: string; bg: string; label: string; category: string }
> = {
  deal_approved: { icon: Briefcase, color: "#22c55e", bg: "#22c55e15", label: "Deal Approved", category: "Deals" },
  commission_paid: { icon: DollarSign, color: "#3b82f6", bg: "#3b82f615", label: "Commission Paid", category: "Revenue" },
  partner_joined: { icon: UserPlus, color: "#8b5cf6", bg: "#8b5cf615", label: "Partner Joined", category: "Partners" },
  tier_change: { icon: Trophy, color: "#f59e0b", bg: "#f59e0b15", label: "Tier Change", category: "Partners" },
  deal_disputed: { icon: AlertTriangle, color: "#ef4444", bg: "#ef444415", label: "Dispute Filed", category: "Deals" },
  system: { icon: Info, color: "#64748b", bg: "#64748b15", label: "System", category: "System" },
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "deal_approved", label: "Deal Approved" },
  { value: "commission_paid", label: "Commission Paid" },
  { value: "partner_joined", label: "Partner Joined" },
  { value: "tier_change", label: "Tier Change" },
  { value: "deal_disputed", label: "Disputes" },
  { value: "system", label: "System" },
];

/* ── Helpers ── */

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This Week";
  if (diffDays < 30) return "This Month";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/* ── Page ── */

interface Notification {
  _id: Id<"notifications">;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: number;
}

export default function NotificationsPage() {
  const router = useRouter();
  const notifications = useQuery(api.notifications.list, { limit: 100 });
  const unreadCount = useQuery(api.notifications.unreadCount);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const isLoading = notifications === undefined;

  // Filter notifications
  const filtered = useMemo(() => {
    if (!notifications) return [];
    return (notifications as Notification[]).filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter !== "all") return n.type === filter;
      return true;
    });
  }, [notifications, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: { label: string; items: Notification[] }[] = [];
    let currentLabel = "";
    for (const n of filtered) {
      const label = formatDate(n.createdAt);
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ label, items: [] });
      }
      groups[groups.length - 1].items.push(n);
    }
    return groups;
  }, [filtered]);

  // Stats
  const stats = useMemo(() => {
    if (!notifications) return { total: 0, unread: 0, deals: 0, partners: 0, revenue: 0 };
    const items = notifications as Notification[];
    return {
      total: items.length,
      unread: items.filter((n) => !n.read).length,
      deals: items.filter((n) => n.type === "deal_approved" || n.type === "deal_disputed").length,
      partners: items.filter((n) => n.type === "partner_joined" || n.type === "tier_change").length,
      revenue: items.filter((n) => n.type === "commission_paid").length,
    };
  }, [notifications]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((n) => n._id)));
    }
  };

  const markSelectedRead = async () => {
    const promises = Array.from(selected).map((id) =>
      markRead({ id: id as Id<"notifications"> })
    );
    await Promise.all(promises);
    setSelected(new Set());
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) {
      await markRead({ id: n._id });
    }
    if (n.link) {
      router.push(n.link);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <Loader2 size={28} color="var(--muted)" className="animate-spin" style={{ marginBottom: ".5rem" }} />
        <p className="muted">Loading notifications…</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Notifications</h1>
          <p className="muted">
            {stats.unread > 0
              ? `${stats.unread} unread notification${stats.unread !== 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {stats.unread > 0 && (
            <button className="btn-outline" onClick={() => markAllRead({})}>
              <CheckCheck size={15} /> Mark all read
            </button>
          )}
          <button className="btn-outline" onClick={() => router.push("/dashboard/settings/notifications")}>
            <Settings size={15} /> Preferences
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: ".75rem" }}>
        {[
          { label: "Total", value: stats.total, icon: Bell, color: "#6366f1" },
          { label: "Unread", value: stats.unread, icon: Inbox, color: "#ef4444" },
          { label: "Deals", value: stats.deals, icon: Briefcase, color: "#22c55e" },
          { label: "Partners", value: stats.partners, icon: UserPlus, color: "#8b5cf6" },
          { label: "Revenue", value: stats.revenue, icon: DollarSign, color: "#3b82f6" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: ".75rem 1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
              <div>
                <p className="muted" style={{ fontSize: ".65rem", margin: 0, lineHeight: 1.2 }}>{s.label}</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding: ".75rem 1rem", display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
        <Filter size={15} style={{ color: "var(--muted)" }} />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setFilter(opt.value); setSelected(new Set()); }}
            style={{
              padding: ".35rem .75rem",
              borderRadius: 6,
              border: "1px solid",
              borderColor: filter === opt.value ? "#6366f1" : "var(--border)",
              background: filter === opt.value ? "#6366f115" : "transparent",
              color: filter === opt.value ? "#6366f1" : "var(--foreground)",
              fontSize: ".8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {opt.label}
            {opt.value === "unread" && stats.unread > 0 && (
              <span style={{
                marginLeft: 6,
                padding: "0 5px",
                borderRadius: 999,
                background: "#ef4444",
                color: "white",
                fontSize: ".65rem",
                fontWeight: 700,
              }}>
                {stats.unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="card" style={{
          padding: ".75rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          background: "#6366f108",
          border: "1px solid #6366f130",
        }}>
          <span style={{ fontSize: ".85rem", fontWeight: 600 }}>
            {selected.size} selected
          </span>
          <button className="btn-outline" style={{ padding: ".35rem .75rem", fontSize: ".8rem" }} onClick={markSelectedRead}>
            <Check size={14} /> Mark read
          </button>
          <button
            className="btn-outline"
            style={{ padding: ".35rem .75rem", fontSize: ".8rem", marginLeft: "auto" }}
            onClick={() => setSelected(new Set())}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          {filter === "all" ? (
            <>
              <Bell size={48} style={{ color: "var(--muted)", opacity: 0.4, marginBottom: "1rem" }} />
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>No notifications yet</h3>
              <p className="muted" style={{ fontSize: ".9rem", maxWidth: 400, margin: "0 auto" }}>
                Notifications will appear here as deals are approved, partners join, commissions are paid, and more.
              </p>
            </>
          ) : (
            <>
              <Filter size={36} style={{ color: "var(--muted)", opacity: 0.4, marginBottom: "1rem" }} />
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>No matching notifications</h3>
              <p className="muted" style={{ fontSize: ".9rem" }}>
                Try a different filter or{" "}
                <button onClick={() => setFilter("all")} style={{ color: "#6366f1", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  view all
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Select all */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 .25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: ".8rem", color: "var(--muted)" }}>
              <input
                type="checkbox"
                checked={selected.size === filtered.length && filtered.length > 0}
                onChange={selectAll}
                style={{ accentColor: "#6366f1" }}
              />
              Select all ({filtered.length})
            </label>
            <span className="muted" style={{ fontSize: ".8rem", marginLeft: "auto" }}>
              {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {grouped.map((group) => (
            <div key={group.label}>
              {/* Date header */}
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }}>
                <span style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--muted)", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: ".05em" }}>
                  {group.label}
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                {group.items.map((n, idx) => {
                  const config = TYPE_CONFIG[n.type as NotificationType];
                  const Icon = config?.icon ?? Bell;
                  const isSelected = selected.has(n._id);

                  return (
                    <div
                      key={n._id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                        padding: "1rem 1.25rem",
                        borderBottom: idx < group.items.length - 1 ? "1px solid var(--border)" : "none",
                        background: !n.read ? "rgba(99, 102, 241, 0.04)" : "transparent",
                        transition: "background .15s",
                        cursor: n.link ? "pointer" : "default",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = !n.read ? "rgba(99, 102, 241, 0.08)" : "var(--subtle)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = !n.read ? "rgba(99, 102, 241, 0.04)" : "transparent"; }}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(n._id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ accentColor: "#6366f1", marginTop: 4, flexShrink: 0 }}
                      />

                      {/* Icon */}
                      <div
                        onClick={() => handleClick(n)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: config?.bg ?? "#64748b15",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: config?.color ?? "#64748b",
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }} onClick={() => handleClick(n)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: n.read ? 500 : 700, fontSize: ".9rem" }}>{n.title}</span>
                          <span style={{
                            fontSize: ".65rem",
                            fontWeight: 600,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: config?.bg ?? "#64748b15",
                            color: config?.color ?? "#64748b",
                          }}>
                            {config?.label ?? n.type}
                          </span>
                          {!n.read && (
                            <span style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              background: "#6366f1",
                              flexShrink: 0,
                            }} />
                          )}
                        </div>
                        <p style={{
                          fontSize: ".85rem",
                          color: "var(--muted)",
                          marginTop: 2,
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const,
                          overflow: "hidden",
                        }}>
                          {n.body}
                        </p>
                      </div>

                      {/* Time + actions */}
                      <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <span className="muted" style={{ fontSize: ".75rem", whiteSpace: "nowrap" }}>
                          {formatTimeAgo(n.createdAt)}
                        </span>
                        {!n.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markRead({ id: n._id }); }}
                            title="Mark as read"
                            style={{
                              background: "none",
                              border: "1px solid var(--border)",
                              borderRadius: 6,
                              padding: "3px 8px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: ".7rem",
                              color: "var(--muted)",
                              transition: "all .15s",
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                          >
                            <Check size={11} /> Read
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
