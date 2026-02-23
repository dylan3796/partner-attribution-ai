"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  FileText, Search, Plus, AlertTriangle, CheckCircle, Clock,
  XCircle, RefreshCw, Download, ChevronDown, ChevronUp, Bell, Loader2,
} from "lucide-react";

type ContractStatus = "active" | "expiring_soon" | "expired" | "pending_renewal" | "draft" | "terminated";
type ContractType = "partner_agreement" | "reseller" | "referral" | "oem" | "technology" | "co_sell";

const TYPE_LABELS: Record<ContractType, string> = {
  partner_agreement: "Partner Agreement",
  reseller: "Reseller",
  referral: "Referral",
  oem: "OEM License",
  technology: "Technology",
  co_sell: "Co-Sell",
};

const STATUS_CONFIG: Record<ContractStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#22c55e", bg: "#22c55e18" },
  expiring_soon: { label: "Expiring Soon", color: "#f59e0b", bg: "#f59e0b18" },
  expired: { label: "Expired", color: "#ef4444", bg: "#ef444418" },
  pending_renewal: { label: "Pending Renewal", color: "#3b82f6", bg: "#3b82f618" },
  draft: { label: "Draft", color: "#6b7280", bg: "#6b728018" },
  terminated: { label: "Terminated", color: "#ef4444", bg: "#ef444418" },
};

function statusIcon(status: ContractStatus) {
  const size = 13;
  if (status === "active") return <CheckCircle size={size} />;
  if (status === "expiring_soon") return <AlertTriangle size={size} />;
  if (status === "expired" || status === "terminated") return <XCircle size={size} />;
  if (status === "pending_renewal") return <RefreshCw size={size} />;
  return <Clock size={size} />;
}

function daysUntilExpiry(endDate?: string): number | null {
  if (!endDate) return null;
  const end = new Date(endDate).getTime();
  return Math.ceil((end - Date.now()) / 86400000);
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const TIER_COLORS: Record<string, string> = {
  platinum: "#a78bfa", gold: "#eab308", silver: "#94a3b8", bronze: "#cd7f32",
};

export default function ContractsPage() {
  const contracts = useQuery(api.contracts.list) ?? [];
  const updateStatus = useMutation(api.contracts.updateStatus);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContractType | "all">("all");
  const [sortBy, setSortBy] = useState<"expiry" | "value" | "partner">("expiry");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return contracts
      .filter((c) => {
        if (statusFilter !== "all" && c.status !== statusFilter) return false;
        if (typeFilter !== "all" && c.type !== typeFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (c.partnerName as string).toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortBy === "expiry") {
          const da = daysUntilExpiry(a.endDate) ?? 9999;
          const db = daysUntilExpiry(b.endDate) ?? 9999;
          return (da - db) * dir;
        }
        if (sortBy === "value") return (a.value - b.value) * dir;
        return ((a.partnerName as string) || "").localeCompare((b.partnerName as string) || "") * dir;
      });
  }, [contracts, statusFilter, typeFilter, search, sortBy, sortDir]);

  const stats = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    expiringSoon: contracts.filter((c) => c.status === "expiring_soon" || c.status === "pending_renewal").length,
    totalValue: contracts.filter((c) => c.status !== "expired" && c.status !== "terminated").reduce((s, c) => s + c.value, 0),
  }), [contracts]);

  async function handleStatusChange(contractId: Id<"contracts">, status: ContractStatus) {
    setUpdating(contractId);
    try {
      await updateStatus({ contractId, status });
    } finally {
      setUpdating(null);
    }
  }

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  }

  function exportCSV() {
    const headers = ["Partner", "Title", "Type", "Status", "Value", "Commission %", "Territory", "Start", "End", "Auto-Renew"];
    const rows = filtered.map((c) => [
      c.partnerName, c.title, TYPE_LABELS[c.type as ContractType], STATUS_CONFIG[c.status as ContractStatus]?.label,
      c.value, c.commissionRate, c.territory || "", c.startDate || "", c.endDate || "", c.autoRenew ? "Yes" : "No",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "contracts.csv";
    a.click();
  }

  if (contracts === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={28} style={{ color: "#6366f1" }} />
            Contracts & Agreements
          </h1>
          <p className="muted" style={{ marginTop: ".25rem" }}>Manage partner contracts, renewals, and compliance</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button onClick={exportCSV} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", fontSize: ".85rem" }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Contracts", value: stats.total, color: "#6366f1" },
          { label: "Active", value: stats.active, color: "#22c55e" },
          { label: "Needs Attention", value: stats.expiringSoon, color: "#f59e0b" },
          { label: "Portfolio Value", value: fmtCurrency(stats.totalValue), color: "#3b82f6" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem" }}>
            <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Renewal Alert */}
      {stats.expiringSoon > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, background: "#f59e0b08", border: "1px solid #f59e0b30", display: "flex", alignItems: "center", gap: 12 }}>
          <Bell size={20} style={{ color: "#f59e0b", flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: ".9rem", color: "#f59e0b" }}>
              {stats.expiringSoon} contract{stats.expiringSoon > 1 ? "s" : ""} need{stats.expiringSoon === 1 ? "s" : ""} attention
            </p>
            <p className="muted" style={{ fontSize: ".8rem", marginTop: 2 }}>
              {contracts
                .filter((c) => c.status === "expiring_soon" || c.status === "pending_renewal")
                .map((c) => c.partnerName)
                .join(", ")} — review renewal terms before expiry
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 320 }}>
          <Search size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contracts..."
            className="input"
            style={{ paddingLeft: 32, width: "100%" }}
          />
        </div>
        <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContractStatus | "all")} style={{ maxWidth: 160 }}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as ContractType | "all")} style={{ maxWidth: 160 }}>
          <option value="all">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "10px 14px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>Contract</th>
                <th style={{ padding: "10px 14px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", cursor: "pointer" }} onClick={() => toggleSort("partner")}>
                  Partner {sortBy === "partner" && (sortDir === "asc" ? <ChevronUp size={10} style={{ verticalAlign: "middle" }} /> : <ChevronDown size={10} style={{ verticalAlign: "middle" }} />)}
                </th>
                <th style={{ padding: "10px 14px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>Type</th>
                <th style={{ padding: "10px 14px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>Status</th>
                <th style={{ padding: "10px 14px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", cursor: "pointer" }} onClick={() => toggleSort("expiry")}>
                  Expiry {sortBy === "expiry" && (sortDir === "asc" ? <ChevronUp size={10} style={{ verticalAlign: "middle" }} /> : <ChevronDown size={10} style={{ verticalAlign: "middle" }} />)}
                </th>
                <th style={{ padding: "10px 14px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", cursor: "pointer" }} onClick={() => toggleSort("value")}>
                  Value {sortBy === "value" && (sortDir === "asc" ? <ChevronUp size={10} style={{ verticalAlign: "middle" }} /> : <ChevronDown size={10} style={{ verticalAlign: "middle" }} />)}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const days = daysUntilExpiry(c.endDate);
                const cfg = STATUS_CONFIG[c.status as ContractStatus];
                const tierColor = TIER_COLORS[(c.partnerTier as string)?.toLowerCase()] || "#64748b";
                return (
                  <tr
                    key={c._id}
                    style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                    onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{c.title}</div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontWeight: 600 }}>{c.partnerName as string}</span>
                      <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 6, fontSize: ".65rem", fontWeight: 700, color: tierColor, background: `${tierColor}18`, textTransform: "capitalize" }}>
                        {(c.partnerTier as string) || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--muted)", fontSize: ".8rem" }}>{TYPE_LABELS[c.type as ContractType]}</td>
                    <td style={{ padding: "12px 14px" }}>
                      {updating === c._id ? (
                        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                      ) : (
                        <select
                          value={c.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(c._id, e.target.value as ContractStatus)}
                          style={{
                            padding: "2px 8px", borderRadius: 8, fontSize: ".75rem", fontWeight: 700,
                            color: cfg?.color, background: cfg?.bg, border: "none", cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {c.endDate ? (
                        <div>
                          <div style={{ fontSize: ".8rem" }}>{c.endDate}</div>
                          {days !== null && days > 0 && days <= 30 && (
                            <div style={{ fontSize: ".7rem", color: "#f59e0b" }}>{days}d remaining</div>
                          )}
                          {days !== null && days < 0 && (
                            <div style={{ fontSize: ".7rem", color: "#ef4444" }}>{Math.abs(days)}d overdue</div>
                          )}
                        </div>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{fmtCurrency(c.value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <FileText size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>
              {contracts.length === 0 ? "No contracts yet" : "No contracts match your filters"}
            </h3>
            <p className="muted" style={{ fontSize: ".85rem" }}>
              {contracts.length === 0
                ? "Contracts track your partner agreements, renewals, and compliance. Seed demo data to get started."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        )}

        {/* Expanded detail */}
        {filtered.map((c) =>
          expanded === c._id ? (
            <div key={`${c._id}-detail`} style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", background: "var(--subtle)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, fontSize: ".8rem" }}>
                <div>
                  <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600 }}>Start Date</div>
                  <div>{c.startDate || "—"}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600 }}>Commission Rate</div>
                  <div>{c.commissionRate}%</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600 }}>Territory</div>
                  <div>{c.territory || "—"}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600 }}>Auto-Renew</div>
                  <div style={{ color: c.autoRenew ? "#22c55e" : "var(--muted)" }}>{c.autoRenew ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600 }}>Signed By</div>
                  <div>{c.signedBy || "—"}</div>
                </div>
                {c.notes && (
                  <div style={{ gridColumn: "span 2" }}>
                    <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600 }}>Notes</div>
                    <div>{c.notes}</div>
                  </div>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
