"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

type NotificationType =
  | "deal_approved"
  | "commission_paid"
  | "partner_joined"
  | "tier_change"
  | "deal_disputed"
  | "system";

const typeConfig: Record<
  NotificationType,
  { icon: typeof Bell; color: string; bg: string }
> = {
  deal_approved: { icon: Briefcase, color: "#22c55e", bg: "#22c55e15" },
  commission_paid: { icon: DollarSign, color: "#3b82f6", bg: "#3b82f615" },
  partner_joined: { icon: UserPlus, color: "#8b5cf6", bg: "#8b5cf615" },
  tier_change: { icon: Trophy, color: "#f59e0b", bg: "#f59e0b15" },
  deal_disputed: { icon: AlertTriangle, color: "#ef4444", bg: "#ef444415" },
  system: { icon: Info, color: "#64748b", bg: "#64748b15" },
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = useQuery(api.notifications.list, { limit: 10 });
  const unreadCount = useQuery(api.notifications.unreadCount);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleNotificationClick = async (
    id: Id<"notifications">,
    link?: string,
    read?: boolean
  ) => {
    if (!read) {
      await markRead({ id });
    }
    if (link) {
      router.push(link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead({});
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell size={20} />
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <span className="notification-dropdown-title">Notifications</span>
            {unreadCount !== undefined && unreadCount > 0 && (
              <button
                className="notification-mark-all-btn"
                onClick={handleMarkAllRead}
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications === undefined ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={24} style={{ opacity: 0.3 }} />
                <span>No notifications yet</span>
              </div>
            ) : (
              notifications.map((n) => {
                const config = typeConfig[n.type as NotificationType];
                const Icon = config?.icon ?? Bell;
                return (
                  <button
                    key={n._id}
                    className={`notification-item ${n.read ? "read" : "unread"}`}
                    onClick={() => handleNotificationClick(n._id, n.link, n.read)}
                  >
                    <div
                      className="notification-icon"
                      style={{
                        backgroundColor: config?.bg ?? "#64748b15",
                        color: config?.color ?? "#64748b",
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-body">{n.body}</div>
                      <div className="notification-time">
                        {formatTimeAgo(n.createdAt)}
                      </div>
                    </div>
                    {!n.read && (
                      <div className="notification-unread-dot" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="notification-dropdown-footer">
            <button
              className="notification-view-all-btn"
              onClick={() => {
                router.push("/dashboard/activity");
                setOpen(false);
              }}
            >
              View all activity
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-bell-container {
          position: relative;
        }

        .notification-bell-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.15s;
        }

        .notification-bell-btn:hover {
          background: var(--card);
          color: var(--foreground);
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 9px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 380px;
          max-height: 480px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .notification-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }

        .notification-dropdown-title {
          font-weight: 600;
          font-size: 14px;
          color: var(--foreground);
        }

        .notification-mark-all-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--primary);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .notification-mark-all-btn:hover {
          background: var(--primary);
          color: white;
        }

        .notification-list {
          flex: 1;
          overflow-y: auto;
        }

        .notification-loading,
        .notification-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 20px;
          color: var(--muted);
          font-size: 13px;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
        }

        .notification-item:hover {
          background: var(--border);
        }

        .notification-item.unread {
          background: var(--primary-muted, rgba(99, 102, 241, 0.06));
        }

        .notification-item.unread:hover {
          background: var(--primary-muted-hover, rgba(99, 102, 241, 0.1));
        }

        .notification-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-title {
          font-weight: 600;
          font-size: 13px;
          color: var(--foreground);
          line-height: 1.3;
        }

        .notification-body {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.4;
          margin-top: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .notification-time {
          font-size: 11px;
          color: var(--muted);
          margin-top: 4px;
          opacity: 0.7;
        }

        .notification-unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary, #6366f1);
          flex-shrink: 0;
          margin-top: 6px;
        }

        .notification-dropdown-footer {
          padding: 10px 16px;
          border-top: 1px solid var(--border);
        }

        .notification-view-all-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--primary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .notification-view-all-btn:hover {
          background: var(--primary);
          color: white;
        }
      `}</style>
    </div>
  );
}
