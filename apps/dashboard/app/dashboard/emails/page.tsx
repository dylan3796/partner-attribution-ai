"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
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
  Save,
  X,
  Loader2,
  Inbox,
} from "lucide-react";

/* ── Trigger metadata (labels, categories, descriptions) ── */

const TRIGGER_META: Record<string, { label: string; category: "deals" | "payouts" | "partners" | "programs"; description: string }> = {
  deal_won: { label: "Deal Won", category: "deals", description: "Sent to the partner when a deal they're attributed to is marked as won" },
  deal_registered: { label: "Deal Registration Approved", category: "deals", description: "Confirms a partner's deal registration has been approved" },
  deal_registration_rejected: { label: "Deal Registration Rejected", category: "deals", description: "Notifies partner their deal registration was rejected with reason" },
  payout_approved: { label: "Payout Approved", category: "payouts", description: "Sent when a partner payout is approved and queued for processing" },
  payout_sent: { label: "Payout Sent", category: "payouts", description: "Confirms a payout has been sent via ACH/wire" },
  tier_upgrade: { label: "Tier Upgrade", category: "partners", description: "Congratulates partner on tier promotion with new benefits" },
  tier_downgrade_warning: { label: "Tier Downgrade Warning", category: "partners", description: "30-day warning before a partner's tier is reduced" },
  new_incentive: { label: "New Incentive Program", category: "programs", description: "Announces a new SPIF, bonus, or accelerator program" },
  incentive_achieved: { label: "Incentive Goal Achieved", category: "programs", description: "Notifies partner they've hit an incentive milestone" },
  cert_expiring: { label: "Certification Expiring", category: "partners", description: "Reminder 30 days before a partner's certification expires" },
  welcome_partner: { label: "Welcome / Onboarding", category: "partners", description: "Welcome email sent when a new partner is activated" },
};

const CATEGORY_COLORS: Record<string, string> = {
  deals: "#3b82f6", payouts: "#22c55e", partners: "#8b5cf6", programs: "#f59e0b",
};

/* ── Helpers ── */

function timeAgo(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

/* ── Edit Modal ── */

function EditTemplateModal({ template, onClose, onSave }: {
  template: { _id: Id<"email_templates">; trigger: string; subject: string; bodyHtml: string; enabled: boolean };
  onClose: () => void;
  onSave: (data: { id: Id<"email_templates">; trigger: string; subject: string; bodyHtml: string; enabled: boolean }) => void;
}) {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.bodyHtml);
  const [saving, setSaving] = useState(false);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div className="card" style={{ width: "100%", maxWidth: 600, padding: "2rem", margin: "1rem" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            Edit: {TRIGGER_META[template.trigger]?.label || template.trigger}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 6 }}>
            Subject Template
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--subtle)", fontSize: ".9rem", fontFamily: "monospace", color: "inherit",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 6 }}>
            Body Template
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--subtle)", fontSize: ".85rem", lineHeight: 1.6, fontFamily: "inherit",
              color: "inherit", outline: "none", resize: "vertical",
            }}
          />
          <p className="muted" style={{ fontSize: ".7rem", marginTop: 4 }}>
            Use {"{{variable}}"} for dynamic values: deal_name, deal_amount, commission, partner_name, amount, period, etc.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border)",
              background: "transparent", color: "var(--muted)", fontWeight: 600, fontSize: ".85rem", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await onSave({ id: template._id, trigger: template.trigger, subject, bodyHtml: body, enabled: template.enabled });
              setSaving(false);
              onClose();
            }}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: "#6366f1", color: "#fff", fontWeight: 600, fontSize: ".85rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function EmailsPage() {
  const templates = useQuery(api.emailTemplates.listTemplates);
  const queue = useQuery(api.emailTemplates.listQueue, { limit: 50 });
  const stats = useQuery(api.emailTemplates.queueStats);
  const seedDefaults = useMutation(api.emailTemplates.seedDefaults);
  const toggleTemplate = useMutation(api.emailTemplates.toggleTemplate);
  const upsertTemplate = useMutation(api.emailTemplates.upsertTemplate);

  const [tab, setTab] = useState<"triggers" | "queue">("triggers");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editingTemplate, setEditingTemplate] = useState<{
    _id: Id<"email_templates">; trigger: string; subject: string; bodyHtml: string; enabled: boolean;
  } | null>(null);
  const [seeded, setSeeded] = useState(false);

  // Auto-seed default templates on first load if none exist
  useEffect(() => {
    if (templates !== undefined && templates.length === 0 && !seeded) {
      setSeeded(true);
      seedDefaults().catch(() => {});
    }
  }, [templates, seeded, seedDefaults]);

  const loading = templates === undefined || queue === undefined;

  const filteredTemplates = templates
    ? filterCategory === "all"
      ? templates
      : templates.filter((t) => (TRIGGER_META[t.trigger]?.category || "other") === filterCategory)
    : [];
  const enabledCount = templates ? templates.filter((t) => t.enabled).length : 0;
  const totalTemplates = templates?.length || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Email Notifications</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Configure automated partner email triggers</p>
        </div>
        {!loading && stats && stats.total === 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10,
            background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)",
            fontSize: ".8rem", color: "#818cf8",
          }}>
            <AlertCircle size={14} />
            Connect Resend to start sending emails
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { icon: <Zap size={22} />, label: "Active Triggers", value: loading ? "…" : `${enabledCount}/${totalTemplates}`, color: "#6366f1" },
          { icon: <Send size={22} />, label: "Emails Sent", value: loading ? "…" : String(stats?.sent || 0), color: "#22c55e" },
          { icon: <Clock size={22} />, label: "In Queue", value: loading ? "…" : String(stats?.queued || 0), color: "#eab308" },
          { icon: <XCircle size={22} />, label: "Failed", value: loading ? "…" : String(stats?.failed || 0), color: "#ef4444" },
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
            {t === "triggers" ? "Triggers" : "Send Queue"} {t === "queue" && `(${queue?.length || 0})`}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--muted)" }} />
        </div>
      )}

      {/* Triggers Tab */}
      {!loading && tab === "triggers" && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", "deals", "payouts", "partners", "programs"].map((cat) => {
              const count = cat === "all"
                ? totalTemplates
                : (templates || []).filter((t) => (TRIGGER_META[t.trigger]?.category || "other") === cat).length;
              return (
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
                  {cat === "all" ? `All (${count})` : `${cat} (${count})`}
                </button>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <Mail size={36} style={{ color: "var(--muted)", marginBottom: 12 }} />
              <p className="muted" style={{ fontSize: ".9rem" }}>No email templates yet</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredTemplates.map((template) => {
              const isExpanded = expandedId === template._id;
              const meta = TRIGGER_META[template.trigger] || { label: template.trigger, category: "other", description: "Custom trigger" };
              const catColor = CATEGORY_COLORS[meta.category] || "#64748b";
              return (
                <div key={template._id}>
                  <div
                    className="card"
                    style={{
                      padding: "1rem 1.25rem", cursor: "pointer",
                      opacity: template.enabled ? 1 : 0.55,
                      border: isExpanded ? "1px solid #6366f1" : "1px solid var(--border)",
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : template._id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${catColor}15`, display: "flex", alignItems: "center", justifyContent: "center", color: catColor, flexShrink: 0 }}>
                        <Mail size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{meta.label}</span>
                          <span style={{ padding: "1px 7px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700, background: `${catColor}15`, color: catColor, textTransform: "capitalize" }}>
                            {meta.category}
                          </span>
                        </div>
                        <p className="muted" style={{ fontSize: ".8rem", marginTop: 2 }}>{meta.description}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTemplate({ id: template._id, enabled: !template.enabled });
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: template.enabled ? "#22c55e" : "var(--muted)", padding: 0 }}
                          title={template.enabled ? "Disable" : "Enable"}
                        >
                          {template.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="card" style={{ marginTop: 4, padding: "1.25rem", borderLeft: `3px solid ${catColor}` }}>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 6 }}>Subject Template</div>
                        <code style={{ display: "block", padding: "8px 12px", background: "var(--subtle)", borderRadius: 8, fontSize: ".85rem", fontFamily: "monospace" }}>
                          {template.subject}
                        </code>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 6 }}>Body Preview</div>
                        <div style={{ padding: "12px 16px", background: "var(--subtle)", borderRadius: 8, fontSize: ".85rem", lineHeight: 1.6, border: "1px dashed var(--border)" }}>
                          {template.bodyHtml}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "1.5rem", fontSize: ".8rem" }}>
                          <span className="muted">Trigger: <code style={{ fontFamily: "monospace" }}>{template.trigger}</code></span>
                          {template.updatedAt && <span className="muted">Updated: {timeAgo(template.updatedAt)}</span>}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTemplate({ _id: template._id, trigger: template.trigger, subject: template.subject, bodyHtml: template.bodyHtml, enabled: template.enabled });
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8,
                            border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)",
                            fontSize: ".8rem", fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
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
      {!loading && tab === "queue" && (
        <>
          {(!queue || queue.length === 0) ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <Inbox size={36} style={{ color: "var(--muted)", marginBottom: 12 }} />
              <p className="muted" style={{ fontSize: ".9rem", marginBottom: 4 }}>No emails sent yet</p>
              <p className="muted" style={{ fontSize: ".8rem" }}>
                Emails will appear here when Resend is connected and triggers fire.
              </p>
            </div>
          ) : (
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
                  {queue.map((entry) => (
                    <tr key={entry._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 12px" }}><StatusBadge status={entry.status} /></td>
                      <td style={{ padding: "10px 12px" }}>
                        <code style={{ fontSize: ".75rem", fontFamily: "monospace", background: "var(--subtle)", padding: "2px 6px", borderRadius: 4 }}>
                          {entry.trigger}
                        </code>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ fontWeight: 600 }}>{entry.toName || "—"}</div>
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
        </>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSave={async (data) => {
            await upsertTemplate(data);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
}
