"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Download, Search, Filter, Clock, Briefcase, Users, DollarSign, TrendingUp, Shield, AlertTriangle, Plus, Edit, CheckCircle, XCircle, RefreshCw } from "lucide-react";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(ts).toLocaleDateString();
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

const ACTION_META: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  "deal.created": { icon: Plus, color: "#3730a3", bg: "#eef2ff", label: "Deal Created" },
  "deal.closed": { icon: CheckCircle, color: "#065f46", bg: "#ecfdf5", label: "Deal Closed" },
  "deal.updated": { icon: Edit, color: "#1e40af", bg: "#eff6ff", label: "Deal Updated" },
  "deal.registered": { icon: Shield, color: "#6d28d9", bg: "#f5f3ff", label: "Deal Registered" },
  "deal.lost": { icon: XCircle, color: "#991b1b", bg: "#fef2f2", label: "Deal Lost" },
  "partner.created": { icon: Plus, color: "#065f46", bg: "#ecfdf5", label: "Partner Added" },
  "partner.updated": { icon: Edit, color: "#1e40af", bg: "#eff6ff", label: "Partner Updated" },
  "partner.deactivated": { icon: XCircle, color: "#991b1b", bg: "#fef2f2", label: "Partner Deactivated" },
  "partner.tier_change": { icon: TrendingUp, color: "#92400e", bg: "#fffbeb", label: "Tier Changed" },
  "attribution.calculated": { icon: RefreshCw, color: "#6d28d9", bg: "#f5f3ff", label: "Attribution Calculated" },
  "payout.created": { icon: DollarSign, color: "#065f46", bg: "#ecfdf5", label: "Payout Created" },
  "payout.approved": { icon: CheckCircle, color: "#065f46", bg: "#ecfdf5", label: "Payout Approved" },
  "payout.rejected": { icon: XCircle, color: "#991b1b", bg: "#fef2f2", label: "Payout Rejected" },
  "payout.paid": { icon: DollarSign, color: "#065f46", bg: "#ecfdf5", label: "Payout Paid" },
  "touchpoint.created": { icon: Plus, color: "#0e7490", bg: "#ecfeff", label: "Touchpoint Added" },
  "approval.requested": { icon: Clock, color: "#92400e", bg: "#fffbeb", label: "Approval Requested" },
  "approval.approved": { icon: CheckCircle, color: "#065f46", bg: "#ecfdf5", label: "Approval Approved" },
  "approval.rejected": { icon: XCircle, color: "#991b1b", bg: "#fef2f2", label: "Approval Rejected" },
  "dispute.opened": { icon: AlertTriangle, color: "#92400e", bg: "#fffbeb", label: "Dispute Opened" },
  "dispute.resolved": { icon: CheckCircle, color: "#065f46", bg: "#ecfdf5", label: "Dispute Resolved" },
};

const DEFAULT_META = { icon: Clock, color: "#6b7280", bg: "#f3f4f6", label: "Activity" };

const ENTITY_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "deal", label: "Deals" },
  { value: "partner", label: "Partners" },
  { value: "payout", label: "Payouts" },
  { value: "attribution", label: "Attribution" },
  { value: "touchpoint", label: "Touchpoints" },
  { value: "approval", label: "Approvals" },
  { value: "dispute", label: "Disputes" },
];

function getEntityLink(entityType: string, entityId: string): string | null {
  if (entityType === "deal") return `/dashboard/deals/${entityId}`;
  if (entityType === "partner") return `/dashboard/partners/${entityId}`;
  return null;
}

function parseChanges(changes?: string): { field: string; from: string; to: string }[] | null {
  if (!changes) return null;
  try {
    const parsed = JSON.parse(changes);
    // Check if it's already key-value pairs
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.entries(parsed).map(([key, val]) => {
        const str = String(val);
        if (str.includes("→")) {
          const [from, to] = str.split("→").map((s) => s.trim());
          return { field: key, from, to };
        }
        return { field: key, from: "", to: str };
      });
    }
  } catch {
    // It's a plain string with arrow notation like "status: open→won"
    if (changes.includes("→")) {
      return changes.split(",").map((part) => {
        const trimmed = part.trim();
        const colonIdx = trimmed.indexOf(":");
        if (colonIdx > -1) {
          const field = trimmed.slice(0, colonIdx).trim();
          const rest = trimmed.slice(colonIdx + 1).trim();
          const [from, to] = rest.split("→").map((s) => s.trim());
          return { field, from: from || "", to: to || "" };
        }
        const [from, to] = trimmed.split("→").map((s) => s.trim());
        return { field: "", from: from || "", to: to || "" };
      });
    }
  }
  return null;
}

function parseMetadata(metadata?: string): Record<string, string> | null {
  if (!metadata) return null;
  try {
    const parsed = JSON.parse(metadata);
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch { /* ignore */ }
  return null;
}

function exportAuditCSV(entries: { _id: string; action: string; entityType: string; entityId: string; changes?: string; metadata?: string; createdAt: number }[]) {
  const header = "Date,Time,Action,Entity Type,Entity ID,Changes,Metadata";
  const rows = entries.map((e) => {
    const date = new Date(e.createdAt);
    return [
      date.toISOString().slice(0, 10),
      date.toISOString().slice(11, 19),
      e.action,
      e.entityType,
      e.entityId,
      `"${(e.changes || "").replace(/"/g, '""')}"`,
      `"${(e.metadata || "").replace(/"/g, '""')}"`,
    ].join(",");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ActivityPage() {
  const { auditLog, partners, deals } = useStore();
  const [search, setSearch] = useState("");
  const [filterEntity, setFilterEntity] = useState("all");
  const [filterAction, setFilterAction] = useState("all");

  // Get unique actions for the filter dropdown
  const uniqueActions = useMemo(() => {
    const actions = new Set(auditLog.map((e) => e.action));
    return Array.from(actions).sort();
  }, [auditLog]);

  // Sorted and filtered entries
  const filtered = useMemo(() => {
    return [...auditLog]
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((entry) => {
        if (filterEntity !== "all" && entry.entityType !== filterEntity) return false;
        if (filterAction !== "all" && entry.action !== filterAction) return false;
        if (search) {
          const q = search.toLowerCase();
          const actionMeta = ACTION_META[entry.action];
          const label = actionMeta?.label || entry.action;
          const matchesSearch =
            label.toLowerCase().includes(q) ||
            entry.action.toLowerCase().includes(q) ||
            entry.entityType.toLowerCase().includes(q) ||
            (entry.changes || "").toLowerCase().includes(q) ||
            (entry.metadata || "").toLowerCase().includes(q);
          if (!matchesSearch) return false;
        }
        return true;
      });
  }, [auditLog, filterEntity, filterAction, search]);

  // Group entries by date
  const grouped = useMemo(() => {
    const groups: { date: string; entries: typeof filtered }[] = [];
    let currentDate = "";
    for (const entry of filtered) {
      const date = formatDate(entry.createdAt);
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date, entries: [] });
      }
      groups[groups.length - 1].entries.push(entry);
    }
    return groups;
  }, [filtered]);

  // Stats
  const stats = useMemo(() => {
    const now = Date.now();
    const day = 86400000;
    const todayEntries = auditLog.filter((e) => now - e.createdAt < day);
    const weekEntries = auditLog.filter((e) => now - e.createdAt < 7 * day);
    const dealActions = auditLog.filter((e) => e.entityType === "deal").length;
    const partnerActions = auditLog.filter((e) => e.entityType === "partner").length;
    return {
      total: auditLog.length,
      today: todayEntries.length,
      thisWeek: weekEntries.length,
      dealActions,
      partnerActions,
    };
  }, [auditLog]);

  function getEntityName(entityType: string, entityId: string): string | null {
    if (entityType === "deal") {
      const deal = deals.find((d) => d._id === entityId);
      return deal?.name || null;
    }
    if (entityType === "partner") {
      const partner = partners.find((p) => p._id === entityId);
      return partner?.name || null;
    }
    return null;
  }

  return (
    <div className="dash-layout">
      <div className="dash-content">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Activity</h1>
            <p className="muted">Complete audit trail of all platform activity</p>
          </div>
          <button className="btn-outline" onClick={() => exportAuditCSV(filtered)}>
            <Download size={15} /> Export
          </button>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: "1.5rem", gridTemplateColumns: "repeat(4, 1fr)" }}>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Total Events</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{stats.total}</p>
              </div>
              <div style={{ background: "#f3f4f6", padding: ".4rem", borderRadius: 8 }}>
                <Clock size={16} color="#6b7280" />
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Today</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{stats.today}</p>
              </div>
              <div style={{ background: "#ecfdf5", padding: ".4rem", borderRadius: 8 }}>
                <TrendingUp size={16} color="#065f46" />
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Deal Events</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{stats.dealActions}</p>
              </div>
              <div style={{ background: "#eef2ff", padding: ".4rem", borderRadius: 8 }}>
                <Briefcase size={16} color="#3730a3" />
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Partner Events</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{stats.partnerActions}</p>
              </div>
              <div style={{ background: "#f0fdf4", padding: ".4rem", borderRadius: 8 }}>
                <Users size={16} color="#166534" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", padding: "1rem 1.5rem" }}>
          <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
            <input
              className="input"
              placeholder="Search activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <select className="input" style={{ width: "auto" }} value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)}>
            {ENTITY_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select className="input" style={{ width: "auto" }} value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            <option value="all">All Actions</option>
            {uniqueActions.map((action) => {
              const meta = ACTION_META[action];
              return <option key={action} value={action}>{meta?.label || action}</option>;
            })}
          </select>
          {(search || filterEntity !== "all" || filterAction !== "all") && (
            <button
              className="btn-outline"
              style={{ padding: ".5rem .8rem", fontSize: ".8rem" }}
              onClick={() => { setSearch(""); setFilterEntity("all"); setFilterAction("all"); }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
          {filtered.length === auditLog.length
            ? `Showing all ${filtered.length} events`
            : `${filtered.length} of ${auditLog.length} events`}
        </p>

        {/* Timeline */}
        {grouped.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {grouped.map((group) => (
              <div key={group.date}>
                {/* Date header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".75rem",
                  marginBottom: ".75rem",
                }}>
                  <span style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {group.date}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span className="badge badge-neutral" style={{ fontSize: ".7rem" }}>
                    {group.entries.length} event{group.entries.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Events */}
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {group.entries.map((entry, idx) => {
                    const meta = ACTION_META[entry.action] || DEFAULT_META;
                    const Icon = meta.icon;
                    const entityLink = getEntityLink(entry.entityType, entry.entityId);
                    const entityName = getEntityName(entry.entityType, entry.entityId);
                    const changes = parseChanges(entry.changes);
                    const metadata = parseMetadata(entry.metadata);

                    return (
                      <div
                        key={entry._id}
                        style={{
                          display: "flex",
                          gap: "1rem",
                          padding: "1rem 1.5rem",
                          borderBottom: idx < group.entries.length - 1 ? "1px solid var(--border)" : "none",
                          alignItems: "flex-start",
                          transition: "background .15s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "")}
                      >
                        {/* Icon */}
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: meta.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}>
                          <Icon size={16} color={meta.color} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, fontSize: ".9rem" }}>{meta.label}</span>
                            <span className="chip" style={{ fontSize: ".7rem", textTransform: "capitalize" }}>{entry.entityType}</span>
                          </div>

                          {/* Entity name with link */}
                          {entityName && (
                            <p style={{ fontSize: ".85rem", marginTop: ".2rem" }}>
                              {entityLink ? (
                                <Link href={entityLink} style={{ fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                                  {entityName}
                                </Link>
                              ) : (
                                <span style={{ fontWeight: 500 }}>{entityName}</span>
                              )}
                            </p>
                          )}

                          {/* Changes */}
                          {changes && (
                            <div style={{ marginTop: ".4rem", display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                              {changes.map((c, i) => (
                                <span key={i} style={{
                                  fontSize: ".8rem",
                                  padding: ".15rem .5rem",
                                  background: "var(--subtle)",
                                  borderRadius: 4,
                                  border: "1px solid var(--border)",
                                  fontFamily: "var(--font-inter), sans-serif",
                                }}>
                                  {c.field && <span className="muted">{c.field}: </span>}
                                  {c.from && <span style={{ textDecoration: "line-through", color: "#991b1b" }}>{c.from}</span>}
                                  {c.from && c.to && <span className="muted"> → </span>}
                                  {c.to && <span style={{ color: "#065f46", fontWeight: 500 }}>{c.to}</span>}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Metadata pills */}
                          {metadata && !changes && (
                            <div style={{ marginTop: ".4rem", display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                              {Object.entries(metadata).map(([key, val]) => (
                                <span key={key} style={{
                                  fontSize: ".8rem",
                                  padding: ".15rem .5rem",
                                  background: "var(--subtle)",
                                  borderRadius: 4,
                                  border: "1px solid var(--border)",
                                }}>
                                  <span className="muted">{key}: </span>
                                  <span style={{ fontWeight: 500 }}>{String(val)}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Raw changes string fallback */}
                          {!changes && !metadata && entry.changes && (
                            <p className="muted" style={{ fontSize: ".8rem", marginTop: ".2rem" }}>{entry.changes}</p>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p className="muted" style={{ fontSize: ".8rem", whiteSpace: "nowrap" }}>
                            {timeAgo(entry.createdAt)}
                          </p>
                          <p className="muted" style={{ fontSize: ".7rem" }}>
                            {formatTime(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <Filter size={32} color="var(--muted)" style={{ marginBottom: "1rem" }} />
            <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>No activity found</h3>
            <p className="muted" style={{ fontSize: ".9rem" }}>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
