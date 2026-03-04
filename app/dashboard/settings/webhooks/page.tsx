"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import {
  Webhook,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

const ALL_EVENTS = [
  { value: "deal.created", label: "Deal Created", group: "Deals" },
  { value: "deal.approved", label: "Deal Approved", group: "Deals" },
  { value: "deal.closed", label: "Deal Closed", group: "Deals" },
  { value: "deal.lost", label: "Deal Lost", group: "Deals" },
  { value: "deal.updated", label: "Deal Updated", group: "Deals" },
  { value: "partner.created", label: "Partner Created", group: "Partners" },
  { value: "partner.updated", label: "Partner Updated", group: "Partners" },
  { value: "partner.tier_changed", label: "Tier Changed", group: "Partners" },
  { value: "partner.deactivated", label: "Partner Deactivated", group: "Partners" },
  { value: "payout.created", label: "Payout Created", group: "Payouts" },
  { value: "payout.approved", label: "Payout Approved", group: "Payouts" },
  { value: "payout.paid", label: "Payout Paid", group: "Payouts" },
  { value: "commission.calculated", label: "Commission Calculated", group: "Commissions" },
  { value: "touchpoint.created", label: "Touchpoint Created", group: "Attribution" },
  { value: "invite.accepted", label: "Invite Accepted", group: "Partners" },
];

const EVENT_GROUPS = [...new Set(ALL_EVENTS.map((e) => e.group))];

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

// ─── Create/Edit Modal ──────────────────────────────────────────────────────

function EndpointModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  initial?: { url: string; description: string; events: string[] };
  onClose: () => void;
  onSave: (data: { url: string; description: string; events: string[] }) => void;
}) {
  const [url, setUrl] = useState(initial?.url || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [events, setEvents] = useState<Set<string>>(new Set(initial?.events || []));
  const [saving, setSaving] = useState(false);

  function toggleEvent(e: string) {
    const next = new Set(events);
    if (next.has(e)) next.delete(e);
    else next.add(e);
    setEvents(next);
  }

  function toggleGroup(group: string) {
    const groupEvents = ALL_EVENTS.filter((e) => e.group === group).map((e) => e.value);
    const allSelected = groupEvents.every((e) => events.has(e));
    const next = new Set(events);
    groupEvents.forEach((e) => (allSelected ? next.delete(e) : next.add(e)));
    setEvents(next);
  }

  function selectAll() {
    setEvents(new Set(ALL_EVENTS.map((e) => e.value)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url || events.size === 0) return;
    setSaving(true);
    await onSave({ url, description, events: Array.from(events) });
    setSaving(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "85vh",
          overflow: "auto",
          background: "var(--card, #111)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          {mode === "create" ? "Add Webhook Endpoint" : "Edit Webhook Endpoint"}
        </h2>

        {/* URL */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".4rem" }}>
            Endpoint URL <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            className="input"
            type="url"
            placeholder="https://your-app.com/webhooks/covant"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".4rem" }}>
            Description
          </label>
          <input
            className="input"
            placeholder="e.g. Slack notifications, CRM sync"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {/* Events */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
            <label style={{ fontSize: ".85rem", fontWeight: 600 }}>
              Events <span style={{ color: "#ef4444" }}>*</span>
              <span style={{ fontWeight: 400, color: "var(--muted)", marginLeft: 6, fontSize: ".8rem" }}>
                ({events.size} selected)
              </span>
            </label>
            <button
              type="button"
              onClick={selectAll}
              style={{
                background: "none",
                border: "none",
                color: "#6366f1",
                fontSize: ".8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Select all
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {EVENT_GROUPS.map((group) => {
              const groupEvents = ALL_EVENTS.filter((e) => e.group === group);
              const allChecked = groupEvents.every((e) => events.has(e.value));
              const someChecked = groupEvents.some((e) => events.has(e.value));
              return (
                <div key={group} style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                      width: "100%",
                      padding: ".6rem .75rem",
                      background: someChecked ? "rgba(99,102,241,.06)" : "var(--subtle)",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={allChecked}
                      readOnly
                      ref={(el) => {
                        if (el) el.indeterminate = someChecked && !allChecked;
                      }}
                      style={{ accentColor: "#6366f1" }}
                    />
                    <span style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--fg)" }}>{group}</span>
                    <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>
                      ({groupEvents.filter((e) => events.has(e.value)).length}/{groupEvents.length})
                    </span>
                  </button>
                  <div style={{ padding: ".25rem .75rem .5rem" }}>
                    {groupEvents.map((evt) => (
                      <label
                        key={evt.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".5rem",
                          padding: ".3rem 0",
                          fontSize: ".8rem",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={events.has(evt.value)}
                          onChange={() => toggleEvent(evt.value)}
                          style={{ accentColor: "#6366f1" }}
                        />
                        <code style={{ fontSize: ".75rem", color: "var(--muted)" }}>{evt.value}</code>
                        <span style={{ color: "var(--fg)" }}>— {evt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".75rem" }}>
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn"
            disabled={!url || events.size === 0 || saving}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {mode === "create" ? "Create Endpoint" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Delivery Log ─────────────────────────────────────────────────────────────

function DeliveryLog({ endpointId }: { endpointId: Id<"webhookEndpoints"> }) {
  const deliveries = useQuery(api.webhooks.getDeliveries, { endpointId, limit: 10 });

  if (deliveries === undefined) {
    return <div style={{ padding: "1rem", color: "var(--muted)", fontSize: ".85rem" }}>Loading deliveries...</div>;
  }

  if (deliveries.length === 0) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--muted)", fontSize: ".85rem" }}>
        No deliveries yet. Send a test event to verify your endpoint.
      </div>
    );
  }

  return (
    <div style={{ maxHeight: 300, overflow: "auto" }}>
      {deliveries.map((d) => (
        <div
          key={d._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            padding: ".6rem 1rem",
            borderBottom: "1px solid var(--border)",
            fontSize: ".8rem",
          }}
        >
          {d.status === "success" ? (
            <CheckCircle size={14} color="#22c55e" />
          ) : d.status === "failed" ? (
            <XCircle size={14} color="#ef4444" />
          ) : (
            <Clock size={14} color="#f59e0b" />
          )}
          <code style={{ color: "var(--muted)", minWidth: 120 }}>{d.event}</code>
          <span
            style={{
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: ".7rem",
              fontWeight: 600,
              background: d.status === "success" ? "#22c55e18" : "#ef444418",
              color: d.status === "success" ? "#22c55e" : "#ef4444",
            }}
          >
            {d.httpStatus ?? "—"}
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ color: "var(--muted)", fontSize: ".75rem" }}>{formatTimeAgo(d.deliveredAt)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WebhooksPage() {
  const endpoints = useQuery(api.webhooks.list);
  const createEndpoint = useMutation(api.webhooks.create);
  const updateEndpoint = useMutation(api.webhooks.update);
  const removeEndpoint = useMutation(api.webhooks.remove);
  const rotateSecret = useMutation(api.webhooks.rotateSecret);
  const sendTest = useMutation(api.webhooks.sendTest);
  const { toast } = useToast();

  const [showModal, setShowModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Id<"webhookEndpoints"> | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const editEndpoint = useMemo(() => {
    if (!editTarget || !endpoints) return undefined;
    return endpoints.find((e) => e._id === editTarget);
  }, [editTarget, endpoints]);

  async function handleCreate(data: { url: string; description: string; events: string[] }) {
    await createEndpoint(data);
    setShowModal(null);
    toast("Webhook endpoint created");
  }

  async function handleEdit(data: { url: string; description: string; events: string[] }) {
    if (!editTarget) return;
    await updateEndpoint({ id: editTarget, ...data });
    setShowModal(null);
    setEditTarget(null);
    toast("Webhook endpoint updated");
  }

  async function handleDelete(id: Id<"webhookEndpoints">) {
    if (!confirm("Delete this webhook endpoint? This cannot be undone.")) return;
    await removeEndpoint({ id });
    toast("Endpoint deleted");
  }

  async function handleToggle(id: Id<"webhookEndpoints">, currentStatus: string) {
    await updateEndpoint({ id, status: currentStatus === "active" ? "paused" : "active" });
    toast(currentStatus === "active" ? "Endpoint paused" : "Endpoint activated");
  }

  async function handleRotateSecret(id: Id<"webhookEndpoints">) {
    if (!confirm("Rotate the signing secret? Your endpoint must be updated to use the new secret.")) return;
    await rotateSecret({ id });
    toast("Signing secret rotated");
  }

  async function handleSendTest(id: Id<"webhookEndpoints">) {
    await sendTest({ id });
    toast("Test event sent");
    setExpandedId(id);
  }

  function copySecret(secret: string, id: string) {
    navigator.clipboard.writeText(secret);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 800 }}>
      {/* Header */}
      <div>
        <Link
          href="/dashboard/settings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--muted)",
            fontSize: ".85rem",
            textDecoration: "none",
            marginBottom: 8,
          }}
        >
          <ArrowLeft size={14} /> Settings
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Webhooks</h1>
            <p className="muted" style={{ marginTop: ".25rem", fontSize: ".9rem" }}>
              Send real-time event notifications to your external services
            </p>
          </div>
          <button
            className="btn"
            onClick={() => setShowModal("create")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={16} /> Add Endpoint
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: 10,
          border: "1px solid #c7d2fe",
          background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
          fontSize: ".85rem",
          color: "#3730a3",
          lineHeight: 1.5,
        }}
      >
        <strong>How it works:</strong> Covant sends a POST request with a JSON payload to your URL whenever
        a subscribed event occurs. Each request includes an <code style={{ background: "#c7d2fe44", padding: "1px 4px", borderRadius: 3 }}>X-Covant-Signature</code> header
        for HMAC-SHA256 verification using your endpoint&apos;s signing secret.
      </div>

      {/* Endpoints List */}
      {endpoints === undefined ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Loader2 size={24} style={{ margin: "0 auto", opacity: 0.3, animation: "spin 1s linear infinite" }} />
        </div>
      ) : endpoints.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Webhook size={28} style={{ opacity: 0.4 }} />
          </div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>No webhook endpoints</h2>
          <p className="muted" style={{ maxWidth: 400 }}>
            Create an endpoint to start receiving real-time event notifications from your partner program.
          </p>
          <button
            className="btn"
            onClick={() => setShowModal("create")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={16} /> Add Endpoint
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {endpoints.map((ep) => {
            const isExpanded = expandedId === ep._id;
            const secretVisible = visibleSecrets.has(ep._id);
            return (
              <div key={ep._id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                {/* Endpoint Header */}
                <div style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".35rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: ".65rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: ".04em",
                            background: ep.status === "active" ? "#22c55e18" : "#f59e0b18",
                            color: ep.status === "active" ? "#22c55e" : "#f59e0b",
                          }}
                        >
                          {ep.status}
                        </span>
                        {ep.failureCount > 0 && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              padding: "2px 8px",
                              borderRadius: 6,
                              fontSize: ".65rem",
                              fontWeight: 700,
                              background: "#ef444418",
                              color: "#ef4444",
                            }}
                          >
                            <AlertTriangle size={10} /> {ep.failureCount} failures
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: ".9rem",
                          fontWeight: 600,
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                        }}
                      >
                        {ep.url}
                      </p>
                      {ep.description && (
                        <p className="muted" style={{ fontSize: ".8rem", marginTop: ".2rem" }}>
                          {ep.description}
                        </p>
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginTop: ".5rem" }}>
                        {ep.events.slice(0, 5).map((evt) => (
                          <code
                            key={evt}
                            style={{
                              fontSize: ".65rem",
                              padding: "1px 6px",
                              borderRadius: 4,
                              background: "var(--subtle)",
                              border: "1px solid var(--border)",
                              color: "var(--muted)",
                            }}
                          >
                            {evt}
                          </code>
                        ))}
                        {ep.events.length > 5 && (
                          <span style={{ fontSize: ".65rem", color: "var(--muted)", padding: "1px 4px" }}>
                            +{ep.events.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: ".35rem", flexShrink: 0 }}>
                      <button
                        onClick={() => handleSendTest(ep._id)}
                        title="Send test event"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: "var(--muted)",
                          cursor: "pointer",
                        }}
                      >
                        <Send size={14} />
                      </button>
                      <button
                        onClick={() => handleToggle(ep._id, ep.status)}
                        title={ep.status === "active" ? "Pause" : "Activate"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: ep.status === "active" ? "#f59e0b" : "#22c55e",
                          cursor: "pointer",
                        }}
                      >
                        {ep.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditTarget(ep._id);
                          setShowModal("edit");
                        }}
                        title="Edit"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: "var(--muted)",
                          cursor: "pointer",
                          fontSize: ".8rem",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ep._id)}
                        title="Delete"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid #fca5a5",
                          background: "transparent",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Signing Secret */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                      marginTop: ".75rem",
                      padding: ".5rem .75rem",
                      borderRadius: 8,
                      background: "var(--subtle)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ fontSize: ".75rem", color: "var(--muted)", fontWeight: 600, flexShrink: 0 }}>
                      Signing Secret:
                    </span>
                    <code style={{ fontSize: ".75rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {secretVisible ? ep.secret : "whsec_" + "•".repeat(28)}
                    </code>
                    <button
                      onClick={() => {
                        const next = new Set(visibleSecrets);
                        if (next.has(ep._id)) next.delete(ep._id);
                        else next.add(ep._id);
                        setVisibleSecrets(next);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--muted)" }}
                      title={secretVisible ? "Hide" : "Reveal"}
                    >
                      {secretVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={() => copySecret(ep.secret, ep._id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--muted)" }}
                      title="Copy"
                    >
                      {copiedId === ep._id ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                    </button>
                    <button
                      onClick={() => handleRotateSecret(ep._id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--muted)" }}
                      title="Rotate secret"
                    >
                      <RotateCcw size={13} />
                    </button>
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: "1.5rem", marginTop: ".5rem", fontSize: ".75rem", color: "var(--muted)" }}>
                    <span>Created {formatTimeAgo(ep.createdAt)}</span>
                    {ep.lastTriggeredAt && <span>Last triggered {formatTimeAgo(ep.lastTriggeredAt)}</span>}
                  </div>
                </div>

                {/* Expandable Delivery Log */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ep._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                    width: "100%",
                    padding: ".6rem 1.5rem",
                    borderTop: "1px solid var(--border)",
                    background: isExpanded ? "var(--subtle)" : "transparent",
                    border: "none",
                    borderTopStyle: "solid",
                    borderTopWidth: 1,
                    borderTopColor: "var(--border)",
                    cursor: "pointer",
                    fontSize: ".8rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textAlign: "left",
                  }}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  Recent Deliveries
                </button>
                {isExpanded && <DeliveryLog endpointId={ep._id} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Sample Payload */}
      <div className="card">
        <h3 style={{ fontSize: ".95rem", fontWeight: 700, marginBottom: ".75rem" }}>Sample Payload</h3>
        <pre
          style={{
            background: "var(--subtle)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "1rem",
            fontSize: ".8rem",
            overflow: "auto",
            lineHeight: 1.6,
          }}
        >
{`POST /your-endpoint HTTP/1.1
Content-Type: application/json
X-Covant-Signature: sha256=...
X-Covant-Event: deal.closed
X-Covant-Delivery: d_abc123

{
  "event": "deal.closed",
  "timestamp": "2026-03-04T22:00:00.000Z",
  "data": {
    "deal": {
      "id": "deal_xyz789",
      "name": "Acme Corp Enterprise",
      "amount": 125000,
      "status": "won",
      "partner": {
        "id": "ptr_abc123",
        "name": "TechBridge",
        "tier": "gold"
      },
      "attribution": {
        "model": "deal_reg_protection",
        "partnerShare": 1.0,
        "commission": 12500
      }
    }
  }
}`}
        </pre>
      </div>

      {/* Modal */}
      {showModal === "create" && (
        <EndpointModal mode="create" onClose={() => setShowModal(null)} onSave={handleCreate} />
      )}
      {showModal === "edit" && editEndpoint && (
        <EndpointModal
          mode="edit"
          initial={{
            url: editEndpoint.url,
            description: editEndpoint.description || "",
            events: editEndpoint.events,
          }}
          onClose={() => {
            setShowModal(null);
            setEditTarget(null);
          }}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}
