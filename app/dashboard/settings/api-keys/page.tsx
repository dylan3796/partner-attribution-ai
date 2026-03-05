"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/toast";
import {
  Key, Plus, Copy, Check, Trash2, Shield, Clock, Eye, EyeOff,
  AlertTriangle, ChevronDown, ChevronUp, ExternalLink, RefreshCw,
} from "lucide-react";

const SCOPE_GROUPS = [
  {
    label: "Partners",
    scopes: [
      { id: "partners:read", label: "Read partners", description: "List and view partner details" },
      { id: "partners:write", label: "Write partners", description: "Create, update, and delete partners" },
    ],
  },
  {
    label: "Deals",
    scopes: [
      { id: "deals:read", label: "Read deals", description: "List and view deal details" },
      { id: "deals:write", label: "Write deals", description: "Create, update deals and registrations" },
    ],
  },
  {
    label: "Revenue",
    scopes: [
      { id: "payouts:read", label: "Read payouts", description: "View payout status and history" },
      { id: "payouts:write", label: "Write payouts", description: "Approve and process payouts" },
      { id: "commissions:read", label: "Read commissions", description: "View commission calculations" },
      { id: "attributions:read", label: "Read attributions", description: "View attribution data and audit trails" },
    ],
  },
  {
    label: "Platform",
    scopes: [
      { id: "webhooks:manage", label: "Manage webhooks", description: "Create and configure webhook endpoints" },
    ],
  },
];

const ALL_SCOPE_IDS = SCOPE_GROUPS.flatMap((g) => g.scopes.map((s) => s.id));

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(ts);
}

export default function ApiKeysPage() {
  const { toast } = useToast();
  const keys = useQuery(api.apiKeys.list, { includeRevoked: true });
  const createKey = useMutation(api.apiKeys.create);
  const revokeKey = useMutation(api.apiKeys.revoke);

  // Create dialog state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newScopes, setNewScopes] = useState<string[]>([...ALL_SCOPE_IDS]);
  const [newExpiry, setNewExpiry] = useState<"never" | "30d" | "90d" | "1y">("never");
  const [creating, setCreating] = useState(false);

  // Newly created key (shown once)
  const [revealedKey, setRevealedKey] = useState<{ key: string; prefix: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Revoke confirmation
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);

  // Show revoked keys
  const [showRevoked, setShowRevoked] = useState(false);

  const activeKeys = useMemo(() => (keys ?? []).filter((k) => !k.revokedAt), [keys]);
  const revokedKeys = useMemo(() => (keys ?? []).filter((k) => k.revokedAt), [keys]);

  function toggleScope(scopeId: string) {
    setNewScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    );
  }

  function selectAllScopes() {
    setNewScopes([...ALL_SCOPE_IDS]);
  }

  function clearAllScopes() {
    setNewScopes([]);
  }

  async function handleCreate() {
    if (!newName.trim()) {
      toast("Name is required", "error");
      return;
    }
    if (newScopes.length === 0) {
      toast("Select at least one scope", "error");
      return;
    }

    setCreating(true);
    try {
      let expiresAt: number | undefined;
      if (newExpiry === "30d") expiresAt = Date.now() + 30 * 86400000;
      else if (newExpiry === "90d") expiresAt = Date.now() + 90 * 86400000;
      else if (newExpiry === "1y") expiresAt = Date.now() + 365 * 86400000;

      const result = await createKey({
        name: newName.trim(),
        scopes: newScopes,
        expiresAt,
      });

      setRevealedKey(result);
      setCopiedKey(false);
      setShowCreate(false);
      setNewName("");
      setNewScopes([...ALL_SCOPE_IDS]);
      setNewExpiry("never");
      toast("API key created successfully");
    } catch (e: unknown) {
      toast((e as Error).message || "Failed to create key", "error");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    setRevoking(true);
    try {
      await revokeKey({ id: id as any });
      setRevokeTarget(null);
      toast("API key revoked");
    } catch (e: unknown) {
      toast((e as Error).message || "Failed to revoke key", "error");
    } finally {
      setRevoking(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    toast("Copied to clipboard", "info");
    setTimeout(() => setCopiedKey(false), 3000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.02em" }}>API Keys</h1>
          <p className="muted" style={{ marginTop: 4 }}>
            Create and manage API keys for programmatic access to the Covant API
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setShowCreate(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <Plus size={16} /> Create Key
        </button>
      </div>

      {/* Newly created key banner */}
      {revealedKey && (
        <div style={{
          padding: "1.25rem 1.5rem", borderRadius: 12,
          background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
          border: "2px solid #86efac",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Check size={18} style={{ color: "#16a34a" }} />
            <span style={{ fontWeight: 700, fontSize: ".95rem", color: "#15803d" }}>
              API key created — copy it now, it won&apos;t be shown again
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", borderRadius: 8,
            background: "white", border: "1px solid #bbf7d0",
            fontFamily: "monospace", fontSize: ".85rem",
          }}>
            <span style={{ flex: 1, wordBreak: "break-all" }}>{revealedKey.key}</span>
            <button
              onClick={() => copyToClipboard(revealedKey.key)}
              style={{
                background: copiedKey ? "#16a34a" : "#111", color: "white",
                border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4, fontSize: ".8rem", fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {copiedKey ? <Check size={14} /> : <Copy size={14} />}
              {copiedKey ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setRevealedKey(null)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: ".8rem", color: "#16a34a", fontWeight: 600, marginTop: 10, padding: 0,
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Info banner */}
      <div style={{
        padding: "1rem 1.25rem", borderRadius: 10,
        background: "var(--subtle)", border: "1px solid var(--border)",
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <Shield size={18} style={{ color: "#6366f1", flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: ".85rem", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            API keys authenticate requests to the <a href="/docs" style={{ color: "#6366f1", fontWeight: 600 }}>Covant REST API</a>.
            Each key can be scoped to specific permissions. Include the key in the <code style={{ background: "var(--border)", padding: "1px 5px", borderRadius: 4, fontSize: ".8rem" }}>Authorization</code> header:
          </p>
          <pre style={{
            margin: "8px 0 0", padding: "8px 12px", borderRadius: 6,
            background: "var(--bg)", border: "1px solid var(--border)",
            fontSize: ".8rem", fontFamily: "monospace", overflow: "auto",
          }}>
{`Authorization: Bearer cvnt_your_api_key_here`}
          </pre>
        </div>
      </div>

      {/* Active keys */}
      <div>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Key size={16} /> Active Keys ({activeKeys.length})
        </h2>

        {keys === undefined ? (
          <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
            <RefreshCw size={20} style={{ animation: "spin 1s linear infinite", color: "var(--muted)" }} />
            <p className="muted" style={{ marginTop: 8, fontSize: ".85rem" }}>Loading...</p>
          </div>
        ) : activeKeys.length === 0 ? (
          <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
            <Key size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No API keys yet</p>
            <p className="muted" style={{ fontSize: ".85rem", marginBottom: 16 }}>
              Create your first API key to start integrating with the Covant API
            </p>
            <button className="btn" onClick={() => setShowCreate(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Plus size={16} /> Create Your First Key
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeKeys.map((key) => {
              const isExpired = key.expiresAt && key.expiresAt < Date.now();
              return (
                <div
                  key={key._id}
                  className="card"
                  style={{
                    padding: "1rem 1.25rem",
                    border: isExpired ? "1px solid #fbbf24" : "1px solid var(--border)",
                    opacity: isExpired ? 0.7 : 1,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{key.name}</span>
                        {isExpired && (
                          <span style={{
                            fontSize: ".65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                            background: "#fef3c7", color: "#92400e",
                          }}>
                            EXPIRED
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <code style={{
                          fontSize: ".8rem", padding: "3px 8px", borderRadius: 5,
                          background: "var(--subtle)", border: "1px solid var(--border)",
                          fontFamily: "monospace",
                        }}>
                          {key.prefix}••••••••
                        </code>
                        <span className="muted" style={{ fontSize: ".75rem", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={12} />
                          Created {formatDate(key.createdAt)}
                        </span>
                        {key.lastUsedAt && (
                          <span className="muted" style={{ fontSize: ".75rem" }}>
                            Last used {formatRelative(key.lastUsedAt)}
                          </span>
                        )}
                        {key.expiresAt && !isExpired && (
                          <span style={{ fontSize: ".75rem", color: "#eab308" }}>
                            Expires {formatDate(key.expiresAt)}
                          </span>
                        )}
                      </div>
                      {/* Scopes */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                        {key.scopes.length === ALL_SCOPE_IDS.length ? (
                          <span style={{
                            fontSize: ".7rem", fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                            background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe",
                          }}>
                            Full Access
                          </span>
                        ) : (
                          key.scopes.slice(0, 4).map((s) => (
                            <span key={s} style={{
                              fontSize: ".7rem", fontWeight: 500, padding: "2px 7px", borderRadius: 4,
                              background: "var(--subtle)", border: "1px solid var(--border)",
                            }}>
                              {s}
                            </span>
                          ))
                        )}
                        {key.scopes.length > 4 && key.scopes.length !== ALL_SCOPE_IDS.length && (
                          <span className="muted" style={{ fontSize: ".7rem", padding: "2px 4px" }}>
                            +{key.scopes.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Revoke button */}
                    {revokeTarget === key._id ? (
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => handleRevoke(key._id)}
                          disabled={revoking}
                          style={{
                            background: "#dc2626", color: "white", border: "none", borderRadius: 6,
                            padding: "6px 12px", cursor: "pointer", fontSize: ".8rem", fontWeight: 600,
                          }}
                        >
                          {revoking ? "Revoking…" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setRevokeTarget(null)}
                          className="btn-outline"
                          style={{ fontSize: ".8rem", padding: "6px 12px" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevokeTarget(key._id)}
                        className="btn-outline"
                        style={{
                          fontSize: ".8rem", padding: "6px 12px", flexShrink: 0,
                          borderColor: "#fca5a5", color: "#dc2626",
                          display: "flex", alignItems: "center", gap: 4,
                        }}
                      >
                        <Trash2 size={13} /> Revoke
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Revoked keys */}
      {revokedKeys.length > 0 && (
        <div>
          <button
            onClick={() => setShowRevoked(!showRevoked)}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", gap: 6,
              fontSize: ".85rem", fontWeight: 600, color: "var(--muted)",
            }}
          >
            {showRevoked ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Revoked Keys ({revokedKeys.length})
          </button>
          {showRevoked && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {revokedKeys.map((key) => (
                <div
                  key={key._id}
                  className="card"
                  style={{ padding: "10px 14px", opacity: 0.5, border: "1px solid var(--border)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: ".85rem", textDecoration: "line-through" }}>{key.name}</span>
                      <code style={{ fontSize: ".75rem", fontFamily: "monospace", color: "var(--muted)" }}>
                        {key.prefix}••••
                      </code>
                    </div>
                    <span style={{
                      fontSize: ".65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                      background: "#fef2f2", color: "#991b1b",
                    }}>
                      Revoked {key.revokedAt ? formatDate(key.revokedAt) : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create key modal/dialog */}
      {showCreate && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, padding: 20,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div
            style={{
              background: "var(--bg)", borderRadius: 16, padding: "2rem",
              width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto",
              border: "1px solid var(--border)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 4 }}>Create API Key</h2>
            <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1.5rem" }}>
              The key will only be shown once after creation. Store it securely.
            </p>

            {/* Name */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: 6 }}>
                Key Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                className="input"
                placeholder="e.g. Production CRM Sync, CI/CD Pipeline"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Expiration */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: 6 }}>
                Expiration
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {([
                  { value: "never", label: "Never" },
                  { value: "30d", label: "30 days" },
                  { value: "90d", label: "90 days" },
                  { value: "1y", label: "1 year" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewExpiry(opt.value)}
                    style={{
                      flex: 1, padding: "8px", borderRadius: 8, fontSize: ".8rem", fontWeight: 600,
                      border: newExpiry === opt.value ? "2px solid #6366f1" : "1px solid var(--border)",
                      background: newExpiry === opt.value ? "#eef2ff" : "var(--bg)",
                      color: newExpiry === opt.value ? "#4338ca" : "var(--fg)",
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scopes */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: ".85rem", fontWeight: 600 }}>
                  Permissions ({newScopes.length}/{ALL_SCOPE_IDS.length})
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={selectAllScopes}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: ".75rem", color: "#6366f1", fontWeight: 600, padding: 0,
                    }}
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllScopes}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: ".75rem", color: "var(--muted)", fontWeight: 600, padding: 0,
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SCOPE_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p style={{
                      fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: ".06em", color: "var(--muted)", marginBottom: 6,
                    }}>
                      {group.label}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {group.scopes.map((scope) => (
                        <label
                          key={scope.id}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "8px 10px", borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: newScopes.includes(scope.id) ? "var(--bg)" : "var(--subtle)",
                            cursor: "pointer", opacity: newScopes.includes(scope.id) ? 1 : 0.6,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={newScopes.includes(scope.id)}
                            onChange={() => toggleScope(scope.id)}
                            style={{ accentColor: "#6366f1" }}
                          />
                          <div>
                            <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{scope.label}</span>
                            <span className="muted" style={{ fontSize: ".75rem", marginLeft: 6 }}>{scope.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
              <button
                className="btn"
                onClick={handleCreate}
                disabled={creating || !newName.trim() || newScopes.length === 0}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {creating ? (
                  <>
                    <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                    Creating…
                  </>
                ) : (
                  <>
                    <Key size={14} /> Create Key
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
