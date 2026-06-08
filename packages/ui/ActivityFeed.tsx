"use client";

import Link from "next/link";
import {
  Briefcase, CheckCircle, XCircle, Users, DollarSign, Shield,
  Target, Settings, UserPlus, UserMinus, RefreshCw, Plus, Trash2,
  Award, FileText, Zap, ArrowUpRight, Scale,
} from "lucide-react";
import type { AuditEntry } from "@/lib/types";

// ─── Action config ───────────────────────────────────────────────────────────

type ActionConfig = {
  icon: typeof Briefcase;
  color: string;
  bg: string;
  label: string;
  getDescription: (meta: Record<string, string>) => string;
  href?: (entry: AuditEntry) => string;
};

const ACTION_MAP: Record<string, ActionConfig> = {
  "deal.created": {
    icon: Plus, color: "#3b82f6", bg: "rgba(59,130,246,.1)",
    label: "Deal Created",
    getDescription: (m) => m.name ? `New deal "${m.name}"${m.amount ? ` · ${m.amount}` : ""}` : "New deal registered",
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "deal.updated": {
    icon: RefreshCw, color: "#8b5cf6", bg: "rgba(139,92,246,.1)",
    label: "Deal Updated",
    getDescription: (m) => m.name ? `"${m.name}" updated` : "Deal details updated",
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "deal.won": {
    icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,.1)",
    label: "Deal Won",
    getDescription: (m) => m.name ? `"${m.name}" closed-won${m.amount ? ` · ${m.amount}` : ""}` : "Deal closed-won",
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "deal.closed": {
    icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,.1)",
    label: "Deal Closed",
    getDescription: (m) => {
      const deal = m.deal || m.name || "Deal";
      const parts = [deal];
      if (m.amount) parts.push(m.amount);
      if (m.partner) parts.push(`via ${m.partner}`);
      return parts.join(" · ");
    },
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "deal.lost": {
    icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,.1)",
    label: "Deal Lost",
    getDescription: (m) => {
      const deal = m.deal || m.name || "Deal";
      return m.reason ? `${deal} — ${m.reason}` : `${deal} closed-lost`;
    },
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "deal.reopened": {
    icon: RefreshCw, color: "#f59e0b", bg: "rgba(245,158,11,.1)",
    label: "Deal Reopened",
    getDescription: (m) => m.name ? `"${m.name}" reopened` : "Deal reopened",
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "deal.deleted": {
    icon: Trash2, color: "#6b7280", bg: "rgba(107,114,128,.1)",
    label: "Deal Removed",
    getDescription: (m) => m.name ? `"${m.name}" removed` : "Deal removed",
  },
  "deal.registered": {
    icon: FileText, color: "#6366f1", bg: "rgba(99,102,241,.1)",
    label: "Deal Registered",
    getDescription: (m) => {
      const deal = m.deal || m.name || "Deal";
      return m.partner ? `${deal} registered by ${m.partner}` : `${deal} registered`;
    },
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "deal.approved": {
    icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,.1)",
    label: "Deal Approved",
    getDescription: (m) => {
      const deal = m.deal || m.name || "Registration";
      return m.partner ? `${deal} approved for ${m.partner}` : `${deal} approved`;
    },
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "approved_deal_registration": {
    icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,.1)",
    label: "Registration Approved",
    getDescription: (m) => m.deal ? `"${m.deal}" approved` : "Deal registration approved",
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "rejected_deal_registration": {
    icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,.1)",
    label: "Registration Rejected",
    getDescription: (m) => m.deal ? `"${m.deal}" rejected` : "Deal registration rejected",
    href: (e) => `/dashboard/deals/${e.entityId}`,
  },
  "commission_auto_generated": {
    icon: DollarSign, color: "#10b981", bg: "rgba(16,185,129,.1)",
    label: "Commission Generated",
    getDescription: (m) => m.amount ? `${m.amount} commission created` : "Auto-commission generated",
    href: () => "/dashboard/payouts",
  },
  "touchpoint.created": {
    icon: Target, color: "#818cf8", bg: "rgba(129,140,248,.1)",
    label: "Touchpoint Added",
    getDescription: (m) => m.type ? `${m.type} touchpoint recorded` : "New touchpoint recorded",
  },
  "touchpoint.deleted": {
    icon: Trash2, color: "#6b7280", bg: "rgba(107,114,128,.1)",
    label: "Touchpoint Removed",
    getDescription: () => "Touchpoint removed",
  },
  "team_member_invited": {
    icon: UserPlus, color: "#3b82f6", bg: "rgba(59,130,246,.1)",
    label: "Member Invited",
    getDescription: (m) => m.email ? `${m.email} invited` : "Team member invited",
  },
  "team_role_changed": {
    icon: Shield, color: "#f59e0b", bg: "rgba(245,158,11,.1)",
    label: "Role Changed",
    getDescription: (m) => m.email ? `${m.email} → ${m.role || "updated"}` : "Team role changed",
  },
  "team_member_removed": {
    icon: UserMinus, color: "#ef4444", bg: "rgba(239,68,68,.1)",
    label: "Member Removed",
    getDescription: (m) => m.email ? `${m.email} removed` : "Team member removed",
  },
  "dispute.opened": {
    icon: Scale, color: "#f59e0b", bg: "rgba(245,158,11,.1)",
    label: "Dispute Opened",
    getDescription: (m) => m.deal ? `Dispute on "${m.deal}"` : "New dispute opened",
    href: () => "/dashboard/conflicts",
  },
  "dispute.resolved": {
    icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,.1)",
    label: "Dispute Resolved",
    getDescription: (m) => m.deal ? `"${m.deal}" dispute resolved` : "Dispute resolved",
    href: () => "/dashboard/conflicts",
  },
  "dispute.rejected": {
    icon: XCircle, color: "#6b7280", bg: "rgba(107,114,128,.1)",
    label: "Dispute Rejected",
    getDescription: (m) => m.deal ? `"${m.deal}" dispute rejected` : "Dispute rejected",
    href: () => "/dashboard/conflicts",
  },
  "dispute.updated": {
    icon: RefreshCw, color: "#8b5cf6", bg: "rgba(139,92,246,.1)",
    label: "Dispute Updated",
    getDescription: (m) => m.deal ? `"${m.deal}" dispute updated` : "Dispute status updated",
    href: () => "/dashboard/conflicts",
  },
  "organization_created": {
    icon: Zap, color: "#f59e0b", bg: "rgba(245,158,11,.1)",
    label: "Org Created",
    getDescription: () => "Organization provisioned",
  },
  "attribution.calculated": {
    icon: Target, color: "#10b981", bg: "rgba(16,185,129,.1)",
    label: "Attribution Run",
    getDescription: (m) => {
      if (m.partner && m.amount) return `${m.partner} attributed ${m.amount}`;
      if (m.model) return `${m.model.replace(/_/g, " ")} model applied`;
      return "Attribution calculated";
    },
  },
  "partner.tier_changed": {
    icon: Award, color: "#f59e0b", bg: "rgba(245,158,11,.1)",
    label: "Tier Change",
    getDescription: (m) => {
      if (m.partner && m.from && m.to) return `${m.partner}: ${m.from} → ${m.to}`;
      return "Partner tier changed";
    },
    href: () => "/dashboard/scoring",
  },
  "config.updated": {
    icon: Settings, color: "#6b7280", bg: "rgba(107,114,128,.1)",
    label: "Config Updated",
    getDescription: (m) => m.field ? `${m.field.replace(/([A-Z])/g, " $1").toLowerCase()} updated` : "Program config updated",
  },
  "commission_rule.created": {
    icon: DollarSign, color: "#818cf8", bg: "rgba(129,140,248,.1)",
    label: "Rule Created",
    getDescription: (m) => m.rule ? `"${m.rule}" rule added (${m.rate || ""})` : "Commission rule created",
    href: () => "/dashboard/settings/commission-rules",
  },
};

const FALLBACK_CONFIG: ActionConfig = {
  icon: Zap, color: "#6b7280", bg: "rgba(107,114,128,.1)",
  label: "Activity",
  getDescription: () => "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseMetadata(entry: AuditEntry): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    if (entry.metadata) Object.assign(result, JSON.parse(entry.metadata));
  } catch { /* ignore */ }
  try {
    if (entry.changes) Object.assign(result, JSON.parse(entry.changes));
  } catch { /* ignore */ }
  return result;
}

function relativeTime(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ActivityFeed({ entries, limit = 8 }: { entries: AuditEntry[]; limit?: number }) {
  const visible = entries.slice(0, limit);

  if (visible.length === 0) {
    return (
      <div style={{ padding: "2rem 0", textAlign: "center" }}>
        <Zap size={24} style={{ color: "var(--muted)", marginBottom: ".5rem" }} />
        <p className="muted" style={{ fontSize: ".85rem" }}>No activity yet. Start by adding partners or registering deals.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {visible.map((entry, i) => {
        const config = ACTION_MAP[entry.action] || FALLBACK_CONFIG;
        const meta = parseMetadata(entry);
        const Icon = config.icon;
        const description = config.getDescription(meta) || entry.action.replace(/[._]/g, " ");
        const href = config.href?.(entry);
        const isLast = i === visible.length - 1;

        const content = (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0",
            borderBottom: isLast ? "none" : "1px solid var(--border)",
            position: "relative",
          }}>
            {/* Timeline dot */}
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: config.bg, display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={15} color={config.color} strokeWidth={2} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: ".84rem", fontWeight: 500, color: "var(--fg)",
                lineHeight: 1.4, margin: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {description}
              </p>
              <p style={{ fontSize: ".72rem", color: "var(--muted)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-block", padding: "1px 6px", borderRadius: 4,
                  background: config.bg, color: config.color,
                  fontSize: ".65rem", fontWeight: 600,
                }}>
                  {config.label}
                </span>
                <span>{relativeTime(entry.createdAt)}</span>
              </p>
            </div>

            {/* Arrow for linked entries */}
            {href && (
              <ArrowUpRight size={14} style={{ color: "var(--muted)", flexShrink: 0, marginTop: 4 }} />
            )}
          </div>
        );

        if (href) {
          return (
            <Link key={entry._id} href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              {content}
            </Link>
          );
        }

        return <div key={entry._id}>{content}</div>;
      })}
    </div>
  );
}
