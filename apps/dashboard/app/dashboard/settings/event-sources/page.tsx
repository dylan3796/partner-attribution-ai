"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  Copy,
  Zap,
  Pause,
  Play,
  Trash2,
  Settings,
  ExternalLink,
  Activity,
  ChevronRight,
} from "lucide-react";
import {
  EVENT_SOURCE_TYPE_LABELS,
  DEFAULT_EVENT_MAPPINGS,
  type EventSourceType,
  type EventMappingConfig,
  type EventSource,
} from "@/lib/types";

export default function EventSourcesPage() {
  const eventSources = useQuery(api.eventSources.list);
  const createSource = useMutation(api.eventSources.create);
  const updateSource = useMutation(api.eventSources.update);
  const deleteSource = useMutation(api.eventSources.remove);

  const sources = (eventSources ?? []) as unknown as EventSource[];
  const isLoading = eventSources === undefined;

  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "webhook" as EventSourceType,
    webhookSecret: "",
    eventMapping: {} as EventMappingConfig,
  });

  const baseUrl = typeof window !== "undefined" 
    ? `${window.location.protocol}//${window.location.host}` 
    : "https://covant.ai";

  function resetForm() {
    setForm({
      name: "",
      type: "webhook",
      webhookSecret: "",
      eventMapping: {},
    });
  }

  function handleTypeChange(type: EventSourceType) {
    setForm({
      ...form,
      type,
      eventMapping: DEFAULT_EVENT_MAPPINGS[type] || {},
    });
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      toast("Name is required", "error");
      return;
    }
    setSaving(true);
    try {
      await createSource({
        name: form.name,
        type: form.type,
        eventMapping: JSON.stringify(form.eventMapping),
        webhookSecret: form.webhookSecret || undefined,
      });
      setShowAdd(false);
      resetForm();
      toast("Event source created");
    } catch (err) {
      toast("Failed to create event source", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(source: EventSource) {
    const newStatus = source.status === "active" ? "paused" : "active";
    try {
      await updateSource({
        id: source._id as Id<"eventSources">,
        status: newStatus,
      });
      toast(`Source ${newStatus === "active" ? "activated" : "paused"}`);
    } catch (err) {
      toast("Failed to update status", "error");
    }
  }

  async function handleDelete(source: EventSource) {
    if (!confirm(`Delete "${source.name}"? This will also delete all associated events.`)) {
      return;
    }
    try {
      await deleteSource({ id: source._id as Id<"eventSources"> });
      toast("Event source deleted");
    } catch (err) {
      toast("Failed to delete", "error");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  }

  function formatDate(ts?: number) {
    if (!ts) return "Never";
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ── Edit Modal ──
  const editingSource = editId ? sources.find((s) => s._id === editId) : null;

  return (
    <div className="dash-main">
      <header className="dash-header">
        <div>
          <h1>Event Sources</h1>
          <p className="dash-subtitle">
            Configure webhook endpoints for Shopify, Stripe, and custom integrations
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link href="/dashboard/settings/event-sources/events" className="btn btn-secondary">
            <Activity size={16} />
            View Events
          </Link>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} />
            Add Source
          </button>
        </div>
      </header>

      {/* Info Banner */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        <Zap size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong style={{ display: "block", marginBottom: 4 }}>Generic Event Ingestion</strong>
          <p style={{ color: "var(--muted)", fontSize: ".875rem", margin: 0 }}>
            Event sources receive webhooks from external systems (Shopify orders, Stripe payments, etc.)
            and automatically match them to partners, creating deals and triggering payouts.
            Each source gets a unique webhook URL you can configure in your external system.
          </p>
        </div>
      </div>

      {/* Sources Grid */}
      {isLoading ? (
        <div className="dash-card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--muted)" }}>Loading event sources...</p>
        </div>
      ) : sources.length === 0 ? (
        <div className="dash-card" style={{ textAlign: "center", padding: "3rem" }}>
          <Zap size={48} style={{ color: "var(--muted)", marginBottom: "1rem" }} />
          <h3 style={{ marginBottom: ".5rem" }}>No Event Sources</h3>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            Add your first webhook source to start ingesting events from external platforms.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} />
            Add Event Source
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {sources.map((source) => {
            const webhookUrl = `${baseUrl}${source.webhookUrl}`;
            return (
              <div
                key={source._id}
                className="dash-card"
                style={{ padding: "1.25rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: source.status === "active" ? "var(--accent-soft)" : "var(--surface-raised)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Zap
                        size={20}
                        style={{
                          color: source.status === "active" ? "var(--accent)" : "var(--muted)",
                        }}
                      />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1rem" }}>{source.name}</h3>
                      <span
                        style={{
                          fontSize: ".75rem",
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "var(--surface-raised)",
                          color: "var(--muted)",
                        }}
                      >
                        {EVENT_SOURCE_TYPE_LABELS[source.type]}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: ".5rem" }}>
                    <span
                      className={`badge badge-${source.status === "active" ? "success" : "muted"}`}
                    >
                      {source.status}
                    </span>
                  </div>
                </div>

                {/* Webhook URL */}
                <div
                  style={{
                    background: "var(--surface-raised)",
                    borderRadius: 8,
                    padding: ".75rem 1rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: ".75rem",
                  }}
                >
                  <code
                    style={{
                      fontSize: ".8rem",
                      color: "var(--fg)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {webhookUrl}
                  </code>
                  <button
                    className="btn btn-icon"
                    onClick={() => copyToClipboard(webhookUrl)}
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    marginBottom: "1rem",
                    fontSize: ".875rem",
                  }}
                >
                  <div>
                    <div style={{ color: "var(--muted)", marginBottom: 2 }}>Events</div>
                    <div style={{ fontWeight: 600 }}>{source.eventCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--muted)", marginBottom: 2 }}>Last Event</div>
                    <div style={{ fontWeight: 500 }}>{formatDate(source.lastEventAt)}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--muted)", marginBottom: 2 }}>Created</div>
                    <div style={{ fontWeight: 500 }}>{formatDate(source.createdAt)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1rem",
                  }}
                >
                  <div style={{ display: "flex", gap: ".5rem" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleStatus(source)}
                    >
                      {source.status === "active" ? (
                        <>
                          <Pause size={14} /> Pause
                        </>
                      ) : (
                        <>
                          <Play size={14} /> Activate
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditId(source._id)}
                    >
                      <Settings size={14} /> Configure
                    </button>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--danger)" }}
                    onClick={() => handleDelete(source)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Event Source</h2>

            <div className="form-group">
              <label>Source Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Production Shopify, Stripe Payments"
              />
            </div>

            <div className="form-group">
              <label>Source Type</label>
              <select
                value={form.type}
                onChange={(e) => handleTypeChange(e.target.value as EventSourceType)}
              >
                <option value="shopify">Shopify</option>
                <option value="stripe">Stripe</option>
                <option value="webhook">Custom Webhook</option>
                <option value="manual">Manual</option>
              </select>
              <p className="form-hint">
                {form.type === "shopify" && "Auto-configured for Shopify order webhooks"}
                {form.type === "stripe" && "Auto-configured for Stripe payment webhooks"}
                {form.type === "webhook" && "Generic webhook — configure field mappings manually"}
                {form.type === "manual" && "For manual event entry via API"}
              </p>
            </div>

            <div className="form-group">
              <label>Webhook Secret (optional)</label>
              <input
                type="text"
                value={form.webhookSecret}
                onChange={(e) => setForm({ ...form, webhookSecret: e.target.value })}
                placeholder="For HMAC signature verification"
              />
              <p className="form-hint">
                If set, webhooks will be verified using HMAC SHA-256 signature
              </p>
            </div>

            {/* Field Mapping */}
            <div className="form-group">
              <label>Field Mapping</label>
              <div
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: 8,
                  padding: "1rem",
                }}
              >
                {Object.entries({
                  email: "Partner Email Path",
                  referralCode: "Referral Code Path",
                  amount: "Amount Path",
                  dealName: "Deal Name Path",
                  customerId: "Customer ID Path",
                }).map(([key, label]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      gap: ".75rem",
                      marginBottom: ".75rem",
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        width: 140,
                        fontSize: ".85rem",
                        color: "var(--muted)",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      value={(form.eventMapping as Record<string, string>)[key] || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          eventMapping: {
                            ...form.eventMapping,
                            [key]: e.target.value,
                          },
                        })
                      }
                      placeholder={`e.g., data.${key}`}
                      style={{ flex: 1, fontSize: ".875rem" }}
                    />
                  </div>
                ))}
              </div>
              <p className="form-hint">
                Use dot notation to reference nested fields (e.g., customer.email)
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create Source"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSource && (
        <div className="modal-overlay" onClick={() => setEditId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Configure: {editingSource.name}</h2>

            <EditSourceForm
              source={editingSource}
              onSave={async (updates) => {
                try {
                  await updateSource({
                    id: editingSource._id as Id<"eventSources">,
                    ...updates,
                  });
                  toast("Source updated");
                  setEditId(null);
                } catch (err) {
                  toast("Failed to update", "error");
                }
              }}
              onCancel={() => setEditId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EditSourceForm({
  source,
  onSave,
  onCancel,
}: {
  source: EventSource;
  onSave: (updates: { name?: string; webhookSecret?: string; eventMapping?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(source.name);
  const [webhookSecret, setWebhookSecret] = useState(source.webhookSecret || "");
  const [eventMapping, setEventMapping] = useState<EventMappingConfig>(() => {
    try {
      return JSON.parse(source.eventMapping || "{}");
    } catch {
      return {};
    }
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        name,
        webhookSecret: webhookSecret || undefined,
        eventMapping: JSON.stringify(eventMapping),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="form-group">
        <label>Source Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Webhook Secret</label>
        <input
          type="text"
          value={webhookSecret}
          onChange={(e) => setWebhookSecret(e.target.value)}
          placeholder="For HMAC signature verification"
        />
      </div>

      <div className="form-group">
        <label>Field Mapping</label>
        <div
          style={{
            background: "var(--surface-raised)",
            borderRadius: 8,
            padding: "1rem",
          }}
        >
          {Object.entries({
            email: "Partner Email Path",
            referralCode: "Referral Code Path",
            amount: "Amount Path",
            dealName: "Deal Name Path",
            customerId: "Customer ID Path",
          }).map(([key, label]) => (
            <div
              key={key}
              style={{
                display: "flex",
                gap: ".75rem",
                marginBottom: ".75rem",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  width: 140,
                  fontSize: ".85rem",
                  color: "var(--muted)",
                }}
              >
                {label}
              </label>
              <input
                type="text"
                value={(eventMapping as Record<string, string>)[key] || ""}
                onChange={(e) =>
                  setEventMapping({
                    ...eventMapping,
                    [key]: e.target.value,
                  })
                }
                placeholder={`e.g., data.${key}`}
                style={{ flex: 1, fontSize: ".875rem" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}
