"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Eye,
  Edit3,
  AlertCircle,
} from "lucide-react";

/* ── Types ── */

type EmailTrigger = {
  id: string;
  key: string;
  label: string;
  description: string;
  category: "deals" | "payouts" | "partners" | "programs";
  subject: string;
  bodyPreview: string;
  enabled: boolean;
  lastSent?: number;
  sentCount: number;
};

type QueueEntry = {
  id: string;
  trigger: string;
  to: string;
  toName: string;
  subject: string;
  status: "queued" | "sent" | "failed";
  createdAt: number;
  sentAt?: number;
  error?: string;
};

/* ── Demo Data ── */

const now = Date.now();
const DAY = 86400000;

const demoTriggers: EmailTrigger[] = [
  {
    id: "t1", key: "deal_won", label: "Deal Won", category: "deals",
    description: "Sent to the partner when a deal they're attributed to is marked as won",
    subject: "🎉 Deal Won: {{deal_name}} — {{deal_amount}}",
    bodyPreview: "Congratulations! The deal {{deal_name}} has been closed for {{deal_amount}}. Your commission of {{commission}} has been calculated.",
    enabled: true, lastSent: now - 3 * 3600000, sentCount: 47,
  },
  {
    id: "t2", key: "deal_registered", label: "Deal Registration Approved", category: "deals",
    description: "Confirms a partner's deal registration has been approved",
    subject: "Deal Registration Approved: {{deal_name}}",
    bodyPreview: "Your deal registration for {{deal_name}} ({{deal_amount}}) has been approved. You have exclusive registration for {{exclusivity_days}} days.",
    enabled: true, lastSent: now - 1 * DAY, sentCount: 32,
  },
  {
    id: "t3", key: "deal_registration_rejected", label: "Deal Registration Rejected", category: "deals",
    description: "Notifies partner their deal registration was rejected with reason",
    subject: "Deal Registration Update: {{deal_name}}",
    bodyPreview: "Your deal registration for {{deal_name}} was not approved. Reason: {{reason}}. Contact your channel manager for details.",
    enabled: true, lastSent: now - 5 * DAY, sentCount: 8,
  },
  {
    id: "t4", key: "payout_approved", label: "Payout Approved", category: "payouts",
    description: "Sent when a partner payout is approved and queued for processing",
    subject: "Payout Approved — {{amount}}",
    bodyPreview: "Your payout of {{amount}} for period {{period}} has been approved and is being processed. Expect funds within 5 business days.",
    enabled: true, lastSent: now - 2 * 3600000, sentCount: 89,
  },
  {
    id: "t5", key: "payout_sent", label: "Payout Sent", category: "payouts",
    description: "Confirms a payout has been sent via ACH/wire",
    subject: "Payout Sent — {{amount}} (Ref: {{reference}})",
    bodyPreview: "Your payout of {{amount}} has been sent. Reference: {{reference}}. Please allow 1-3 business days for funds to appear.",
    enabled: true, lastSent: now - 4 * DAY, sentCount: 76,
  },
  {
    id: "t6", key: "tier_upgrade", label: "Tier Upgrade", category: "partners",
    description: "Congratulates partner on tier promotion with new benefits",
    subject: "🏆 Tier Upgrade: {{old_tier}} → {{new_tier}}",
    bodyPreview: "Congratulations! Based on your performance (score: {{score}}), you've been upgraded to {{new_tier}} tier. New benefits include: {{benefits}}.",
    enabled: true, lastSent: now - 6 * DAY, sentCount: 12,
  },
  {
    id: "t7", key: "tier_downgrade_warning", label: "Tier Downgrade Warning", category: "partners",
    description: "30-day warning before a partner's tier is reduced",
    subject: "Action Required: Your {{current_tier}} tier status",
    bodyPreview: "Your partner score has dropped to {{score}}. If activity doesn't improve in 30 days, your tier will be adjusted to {{new_tier}}.",
    enabled: true, lastSent: now - 15 * DAY, sentCount: 5,
  },
  {
    id: "t8", key: "new_incentive", label: "New Incentive Program", category: "programs",
    description: "Announces a new SPIF, bonus, or accelerator program the partner is eligible for",
    subject: "New Program: {{program_name}} — You're Eligible!",
    bodyPreview: "A new {{program_type}} is available: {{program_name}}. {{description}}. Enroll now to start earning.",
    enabled: true, lastSent: now - 2 * DAY, sentCount: 28,
  },
  {
    id: "t9", key: "incentive_achieved", label: "Incentive Goal Achieved", category: "programs",
    description: "Notifies partner they've hit an incentive milestone",
    subject: "🎯 Goal Achieved: {{program_name}}",
    bodyPreview: "You've reached the {{milestone}} milestone in {{program_name}}! Your bonus of {{reward}} has been added to your next payout.",
    enabled: true, lastSent: now - 3 * DAY, sentCount: 19,
  },
  {
    id: "t10", key: "cert_expiring", label: "Certification Expiring", category: "partners",
    description: "Reminder 30 days before a partner's certification expires",
    subject: "Certification Expiring: {{cert_name}}",
    bodyPreview: "Your {{cert_name}} certification expires on {{expiry_date}}. Complete the renewal course to maintain your status and partner score.",
    enabled: false, lastSent: now - 20 * DAY, sentCount: 14,
  },
  {
    id: "t11", key: "welcome_partner", label: "Welcome / Onboarding", category: "partners",
    description: "Welcome email sent when a new partner is activated",
    subject: "Welcome to the Covant Partner Program!",
    bodyPreview: "Welcome, {{partner_name}}! Your partner portal is ready. Here's how to get started: 1) Complete your profile, 2) Start training, 3) Register your first deal.",
    enabled: true, lastSent: now - 1 * DAY, sentCount: 23,
  },
];

const demoQueue: QueueEntry[] = [
  { id: "q1", trigger: "payout_approved", to: "partner@cloudfirst.io", toName: "CloudFirst Solutions", subject: "Payout Approved — $4,200", status: "sent", createdAt: now - 2 * 3600000, sentAt: now - 2 * 3600000 + 5000 },
  { id: "q2", trigger: "deal_won", to: "deals@cloudfirst.io", toName: "CloudFirst Solutions", subject: "🎉 Deal Won: Acme Corp Cloud Migration — $85,000", status: "sent", createdAt: now - 8 * 3600000, sentAt: now - 8 * 3600000 + 3000 },
  { id: "q3", trigger: "new_incentive", to: "partner@databridge.co", toName: "DataBridge Partners", subject: "New Program: Q1 Cloud Migration SPIF — You're Eligible!", status: "sent", createdAt: now - 1 * DAY, sentAt: now - 1 * DAY + 4000 },
  { id: "q4", trigger: "tier_upgrade", to: "admin@techreach.com", toName: "TechReach Inc", subject: "🏆 Tier Upgrade: Gold → Platinum", status: "sent", createdAt: now - 2 * DAY, sentAt: now - 2 * DAY + 2000 },
  { id: "q5", trigger: "deal_registered", to: "partner@nexusdigital.io", toName: "Nexus Digital", subject: "Deal Registration Approved: Globex Industries Data Platform", status: "sent", createdAt: now - 3 * DAY, sentAt: now - 3 * DAY + 6000 },
  { id: "q6", trigger: "cert_expiring", to: "team@databridge.co", toName: "DataBridge Partners", subject: "Certification Expiring: Advanced API Integration", status: "failed", createdAt: now - 5 * DAY, error: "Mailbox full (550 5.2.2)" },
  { id: "q7", trigger: "welcome_partner", to: "onboarding@horizontech.io", toName: "Horizon Tech Group", subject: "Welcome to the Covant Partner Program!", status: "queued", createdAt: now - 300000 },
];

/* ── Helpers ── */

const CATEGORY_COLORS: Record<string, string> = {
  deals: "#3b82f6", payouts: "#22c55e", partners: "#8b5cf6", programs: "#f59e0b",
};

function timeAgo(ts: number): string {
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(diff / DAY);
  return `${days}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
    sent: { bg: "#22c55e20", fg: "#22c55e", icon: <CheckCircle2 size={12} /> },
    failed: { bg: "#ef444420", fg: "#ef4444", icon: <XCircle size={12} /> },
    queued: { bg: "#eab30820", fg: "#eab308", icon: <Clock size={12} /> },
  };
  const c = cfg[status] || cfg.queued;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg }}>
      {c.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ── Page ── */

export default function EmailsPage() {
  const [triggers, setTriggers] = useState(demoTriggers);
  const [tab, setTab] = useState<"triggers" | "queue">("triggers");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredTriggers = filterCategory === "all" ? triggers : triggers.filter((t) => t.category === filterCategory);
  const enabledCount = triggers.filter((t) => t.enabled).length;
  const totalSent = triggers.reduce((s, t) => s + t.sentCount, 0);

  function toggleTrigger(id: string) {
    setTriggers((prev) => prev.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Email Notifications</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Configure automated partner email triggers</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { icon: <Zap size={22} />, label: "Active Triggers", value: `${enabledCount}/${triggers.length}`, color: "#6366f1" },
          { icon: <Send size={22} />, label: "Emails Sent", value: String(totalSent), color: "#22c55e" },
          { icon: <Clock size={22} />, label: "In Queue", value: String(demoQueue.filter((q) => q.status === "queued").length), color: "#eab308" },
          { icon: <XCircle size={22} />, label: "Failed", value: String(demoQueue.filter((q) => q.status === "failed").length), color: "#ef4444" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
            <div>
              <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        {(["triggers", "queue"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px", fontSize: ".875rem", fontWeight: 600, cursor: "pointer",
              border: "none", borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent",
              background: "none", color: tab === t ? "#6366f1" : "var(--muted)",
            }}
          >
            {t === "triggers" ? "Triggers" : "Send Queue"} {t === "queue" && `(${demoQueue.length})`}
          </button>
        ))}
      </div>

      {/* Triggers Tab */}
      {tab === "triggers" && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", "deals", "payouts", "partners", "programs"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: "4px 14px", borderRadius: 999, fontSize: ".8rem", fontWeight: 600, cursor: "pointer",
                  border: filterCategory === cat ? "2px solid #6366f1" : "1px solid var(--border)",
                  background: filterCategory === cat ? "#6366f115" : "transparent",
                  color: filterCategory === cat ? "#6366f1" : "var(--muted)",
                  textTransform: "capitalize",
                }}
              >
                {cat === "all" ? `All (${triggers.length})` : `${cat} (${triggers.filter(t => t.category === cat).length})`}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredTriggers.map((trigger) => {
              const isExpanded = expandedId === trigger.id;
              const catColor = CATEGORY_COLORS[trigger.category] || "#64748b";
              return (
                <div key={trigger.id}>
                  <div
                    className="card"
                    style={{
                      padding: "1rem 1.25rem", cursor: "pointer",
                      opacity: trigger.enabled ? 1 : 0.55,
                      border: isExpanded ? "1px solid #6366f1" : "1px solid var(--border)",
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : trigger.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${catColor}15`, display: "flex", alignItems: "center", justifyContent: "center", color: catColor, flexShrink: 0 }}>
                        <Mail size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{trigger.label}</span>
                          <span style={{ padding: "1px 7px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700, background: `${catColor}15`, color: catColor, textTransform: "capitalize" }}>
                            {trigger.category}
                          </span>
                        </div>
                        <p className="muted" style={{ fontSize: ".8rem", marginTop: 2 }}>{trigger.description}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                        <span className="muted" style={{ fontSize: ".75rem" }}>{trigger.sentCount} sent</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleTrigger(trigger.id); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: trigger.enabled ? "#22c55e" : "var(--muted)", padding: 0 }}
                          title={trigger.enabled ? "Disable" : "Enable"}
                        >
                          {trigger.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="card" style={{ marginTop: 4, padding: "1.25rem", borderLeft: `3px solid ${catColor}` }}>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 6 }}>Subject Template</div>
                        <code style={{ display: "block", padding: "8px 12px", background: "var(--subtle)", borderRadius: 8, fontSize: ".85rem", fontFamily: "monospace" }}>
                          {trigger.subject}
                        </code>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 6 }}>Body Preview</div>
                        <div style={{ padding: "12px 16px", background: "var(--subtle)", borderRadius: 8, fontSize: ".85rem", lineHeight: 1.6, border: "1px dashed var(--border)" }}>
                          {trigger.bodyPreview}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "1.5rem", fontSize: ".8rem" }}>
                        <span className="muted">Trigger key: <code style={{ fontFamily: "monospace" }}>{trigger.key}</code></span>
                        {trigger.lastSent && <span className="muted">Last sent: {timeAgo(trigger.lastSent)}</span>}
                        <span className="muted">Total sent: {trigger.sentCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Queue Tab */}
      {tab === "queue" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Status", "Trigger", "Recipient", "Subject", "Sent"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: ".75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demoQueue.map((entry) => (
                <tr key={entry.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={entry.status} /></td>
                  <td style={{ padding: "10px 12px" }}>
                    <code style={{ fontSize: ".75rem", fontFamily: "monospace", background: "var(--subtle)", padding: "2px 6px", borderRadius: 4 }}>{entry.trigger}</code>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 600 }}>{entry.toName}</div>
                    <div className="muted" style={{ fontSize: ".75rem" }}>{entry.to}</div>
                  </td>
                  <td style={{ padding: "10px 12px", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.subject}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span className="muted" style={{ fontSize: ".8rem" }}>{timeAgo(entry.sentAt || entry.createdAt)}</span>
                    {entry.error && <div style={{ fontSize: ".7rem", color: "#ef4444", marginTop: 2 }}>{entry.error}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
