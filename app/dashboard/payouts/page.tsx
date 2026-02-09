"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Download,
  Plus,
  Search,
  Filter,
  X,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { exportPayoutsCSV } from "@/lib/csv";

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function fmtFull(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_META: Record<string, { label: string; badge: string; icon: typeof Clock }> = {
  pending_approval: { label: "Pending Approval", badge: "badge-neutral", icon: Clock },
  approved: { label: "Approved", badge: "badge-info", icon: CheckCircle },
  rejected: { label: "Rejected", badge: "badge-danger", icon: XCircle },
  processing: { label: "Processing", badge: "badge-info", icon: ArrowUpRight },
  paid: { label: "Paid", badge: "badge-success", icon: CreditCard },
  failed: { label: "Failed", badge: "badge-danger", icon: AlertTriangle },
};

const STATUS_FILTERS = [
  { value: "all", label: "All Status" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "rejected", label: "Rejected" },
  { value: "processing", label: "Processing" },
];

export default function PayoutsPage() {
  const { payouts, partners, approvePayout, rejectPayout, markPayoutPaid, createPayout } = useStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "approve" | "pay" } | null>(null);

  // Create form
  const [form, setForm] = useState({ partnerId: "", amount: "", period: "", notes: "" });

  // Enrich payouts with partner data
  const enriched = useMemo(() => {
    return payouts.map((p) => ({
      ...p,
      partner: partners.find((pr) => pr._id === p.partnerId),
    }));
  }, [payouts, partners]);

  // Filter and sort
  const filtered = useMemo(() => {
    return [...enriched]
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((p) => {
        if (filterStatus !== "all" && p.status !== filterStatus) return false;
        if (search) {
          const q = search.toLowerCase();
          const matchesSearch =
            (p.partner?.name || "").toLowerCase().includes(q) ||
            (p.period || "").toLowerCase().includes(q) ||
            (p.notes || "").toLowerCase().includes(q) ||
            p.amount.toString().includes(q);
          if (!matchesSearch) return false;
        }
        return true;
      });
  }, [enriched, filterStatus, search]);

  // Stats
  const stats = useMemo(() => {
    const pending = payouts.filter((p) => p.status === "pending_approval");
    const approved = payouts.filter((p) => p.status === "approved");
    const paid = payouts.filter((p) => p.status === "paid");
    const all = payouts;
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, p) => s + p.amount, 0),
      approvedCount: approved.length,
      approvedAmount: approved.reduce((s, p) => s + p.amount, 0),
      paidCount: paid.length,
      paidAmount: paid.reduce((s, p) => s + p.amount, 0),
      totalAmount: all.reduce((s, p) => s + p.amount, 0),
    };
  }, [payouts]);

  function handleCreate() {
    if (!form.partnerId || !form.amount || !form.period) return;
    createPayout({
      partnerId: form.partnerId,
      amount: Number(form.amount),
      period: form.period,
      notes: form.notes || undefined,
    });
    setShowCreate(false);
    setForm({ partnerId: "", amount: "", period: "", notes: "" });
  }

  function handleConfirmAction() {
    if (!confirmAction) return;
    if (confirmAction.action === "approve") {
      approvePayout(confirmAction.id);
    } else if (confirmAction.action === "pay") {
      markPayoutPaid(confirmAction.id);
    }
    setConfirmAction(null);
  }

  function handleReject() {
    if (!showRejectModal) return;
    rejectPayout(showRejectModal, rejectNotes || undefined);
    setShowRejectModal(null);
    setRejectNotes("");
  }

  function handleExport() {
    const data = filtered.map((p) => ({
      partner: p.partner?.name || "Unknown",
      amount: p.amount,
      status: p.status,
      period: p.period,
    }));
    exportPayoutsCSV(data);
  }

  const activePartners = partners.filter((p) => p.status === "active");

  // Generate current period suggestion
  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="dash-layout">
      <div className="dash-content">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Payouts</h1>
            <p className="muted">Manage partner commissions and payment workflows</p>
          </div>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <button className="btn-outline" onClick={handleExport}>
              <Download size={15} /> Export
            </button>
            <button className="btn" onClick={() => setShowCreate(true)}>
              <Plus size={15} /> Create Payout
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="stat-grid" style={{ marginBottom: "1.5rem", gridTemplateColumns: "repeat(4, 1fr)" }}>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Pending Approval</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#92400e" }}>{fmtFull(stats.pendingAmount)}</p>
              </div>
              <div style={{ background: "#fffbeb", padding: ".4rem", borderRadius: 8 }}>
                <Clock size={16} color="#92400e" />
              </div>
            </div>
            <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>{stats.pendingCount} payout{stats.pendingCount !== 1 ? "s" : ""} awaiting review</p>
          </div>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Approved</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1e40af" }}>{fmtFull(stats.approvedAmount)}</p>
              </div>
              <div style={{ background: "#eff6ff", padding: ".4rem", borderRadius: 8 }}>
                <CheckCircle size={16} color="#1e40af" />
              </div>
            </div>
            <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>{stats.approvedCount} ready to pay</p>
          </div>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Paid Out</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#065f46" }}>{fmtFull(stats.paidAmount)}</p>
              </div>
              <div style={{ background: "#ecfdf5", padding: ".4rem", borderRadius: 8 }}>
                <CreditCard size={16} color="#065f46" />
              </div>
            </div>
            <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>{stats.paidCount} completed</p>
          </div>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Total All Time</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{fmtFull(stats.totalAmount)}</p>
              </div>
              <div style={{ background: "#f3f4f6", padding: ".4rem", borderRadius: 8 }}>
                <DollarSign size={16} color="#6b7280" />
              </div>
            </div>
            <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>{payouts.length} total payouts</p>
          </div>
        </div>

        {/* Pending Approval Action Banner */}
        {stats.pendingCount > 0 && (
          <div className="card" style={{ marginBottom: "1.5rem", background: "#fffbeb", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <AlertTriangle size={20} color="#92400e" />
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem", color: "#92400e" }}>{stats.pendingCount} payout{stats.pendingCount !== 1 ? "s" : ""} pending approval</p>
                <p style={{ fontSize: ".8rem", color: "#a16207" }}>{fmtFull(stats.pendingAmount)} total awaiting review</p>
              </div>
            </div>
            <button className="btn" style={{ fontSize: ".85rem", padding: ".5rem 1rem" }} onClick={() => setFilterStatus("pending_approval")}>
              Review Now
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", padding: "1rem 1.5rem" }}>
          <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
            <input
              className="input"
              placeholder="Search by partner, period..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <select className="input" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {(search || filterStatus !== "all") && (
            <button
              className="btn-outline"
              style={{ padding: ".5rem .8rem", fontSize: ".8rem" }}
              onClick={() => { setSearch(""); setFilterStatus("all"); }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
          {filtered.length === payouts.length
            ? `Showing all ${filtered.length} payouts`
            : `${filtered.length} of ${payouts.length} payouts`}
        </p>

        {/* Payouts Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Period</th>
                <th style={{ padding: ".8rem", textAlign: "right", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Amount</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Date</th>
                <th style={{ padding: ".8rem 1.2rem", textAlign: "right", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payout) => {
                const meta = STATUS_META[payout.status] || STATUS_META.pending_approval;
                const StatusIcon = meta.icon;
                return (
                  <tr
                    key={payout._id}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background .15s" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "")}
                  >
                    {/* Partner */}
                    <td style={{ padding: ".8rem 1.2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: ".65rem" }}>
                          {(payout.partner?.name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <Link href={`/dashboard/partners/${payout.partnerId}`} style={{ fontWeight: 600, fontSize: ".9rem" }}>
                            {payout.partner?.name || "Unknown Partner"}
                          </Link>
                          <p className="muted" style={{ fontSize: ".75rem" }}>{payout.partner?.type} · {payout.partner?.commissionRate}%</p>
                        </div>
                      </div>
                    </td>

                    {/* Period */}
                    <td style={{ padding: ".8rem" }}>
                      <span style={{ fontWeight: 500 }}>{payout.period || "—"}</span>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: ".8rem", textAlign: "right" }}>
                      <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{fmtFull(payout.amount)}</span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: ".8rem" }}>
                      <span className={`badge ${meta.badge}`} style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", fontSize: ".75rem" }}>
                        <StatusIcon size={12} />
                        {meta.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: ".8rem" }}>
                      <span className="muted" style={{ fontSize: ".85rem" }}>
                        {payout.paidAt
                          ? `Paid ${formatDate(payout.paidAt)}`
                          : payout.approvedAt
                            ? `Approved ${formatDate(payout.approvedAt)}`
                            : formatDate(payout.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: ".8rem 1.2rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: ".4rem", justifyContent: "flex-end" }}>
                        {payout.status === "pending_approval" && (
                          <>
                            <button
                              className="btn"
                              style={{ fontSize: ".75rem", padding: ".35rem .7rem", background: "#059669" }}
                              onClick={() => setConfirmAction({ id: payout._id, action: "approve" })}
                            >
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button
                              className="btn-outline"
                              style={{ fontSize: ".75rem", padding: ".35rem .7rem", borderColor: "#fca5a5", color: "#991b1b" }}
                              onClick={() => setShowRejectModal(payout._id)}
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </>
                        )}
                        {payout.status === "approved" && (
                          <button
                            className="btn"
                            style={{ fontSize: ".75rem", padding: ".35rem .7rem" }}
                            onClick={() => setConfirmAction({ id: payout._id, action: "pay" })}
                          >
                            <CreditCard size={12} /> Mark Paid
                          </button>
                        )}
                        {(payout.status === "paid" || payout.status === "rejected") && (
                          <span className="muted" style={{ fontSize: ".8rem" }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <Filter size={32} color="var(--muted)" style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>No payouts found</h3>
              <p className="muted" style={{ fontSize: ".9rem" }}>Try adjusting your filters or create a new payout.</p>
            </div>
          )}
        </div>

        {/* Create Payout Modal */}
        {showCreate && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowCreate(false)}>
            <div className="card" style={{ width: 500, maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Create Payout</h2>
                <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Partner *</label>
                  <select className="input" value={form.partnerId} onChange={(e) => setForm({ ...form, partnerId: e.target.value })}>
                    <option value="">Select partner...</option>
                    {activePartners.map((p) => (
                      <option key={p._id} value={p._id}>{p.name} ({p.commissionRate}%)</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Amount ($) *</label>
                    <input
                      className="input"
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="5000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Period *</label>
                    <input
                      className="input"
                      value={form.period}
                      onChange={(e) => setForm({ ...form, period: e.target.value })}
                      placeholder={currentPeriod}
                    />
                    <p className="muted" style={{ fontSize: ".7rem", marginTop: ".2rem" }}>e.g. {currentPeriod}</p>
                  </div>
                </div>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Notes (optional)</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Commission for Q1 deals..."
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button
                  className="btn"
                  style={{ width: "100%", marginTop: ".5rem" }}
                  onClick={handleCreate}
                  disabled={!form.partnerId || !form.amount || !form.period}
                >
                  Create Payout
                </button>
                <p className="muted" style={{ fontSize: ".8rem", textAlign: "center" }}>Payouts are created in &quot;Pending Approval&quot; status.</p>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Action Modal */}
        {confirmAction && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setConfirmAction(null)}>
            <div className="card" style={{ width: 420, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
              {confirmAction.action === "approve" ? (
                <>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <CheckCircle size={24} color="#059669" />
                  </div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Approve Payout?</h2>
                  <p className="muted" style={{ marginBottom: "1.5rem" }}>
                    This will approve the payout for <strong>{fmtFull(enriched.find((p) => p._id === confirmAction.id)?.amount || 0)}</strong> to{" "}
                    <strong>{enriched.find((p) => p._id === confirmAction.id)?.partner?.name}</strong>.
                  </p>
                </>
              ) : (
                <>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <CreditCard size={24} color="#065f46" />
                  </div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Mark as Paid?</h2>
                  <p className="muted" style={{ marginBottom: "1.5rem" }}>
                    Confirm that <strong>{fmtFull(enriched.find((p) => p._id === confirmAction.id)?.amount || 0)}</strong> has been paid to{" "}
                    <strong>{enriched.find((p) => p._id === confirmAction.id)?.partner?.name}</strong>.
                  </p>
                </>
              )}
              <div style={{ display: "flex", gap: ".75rem" }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setConfirmAction(null)}>Cancel</button>
                <button
                  className="btn"
                  style={{ flex: 1, background: confirmAction.action === "approve" ? "#059669" : "var(--fg)" }}
                  onClick={handleConfirmAction}
                >
                  {confirmAction.action === "approve" ? "Approve" : "Confirm Paid"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setShowRejectModal(null); setRejectNotes(""); }}>
            <div className="card" style={{ width: 420 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <XCircle size={24} color="#dc2626" />
              </div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem", textAlign: "center" }}>Reject Payout?</h2>
              <p className="muted" style={{ marginBottom: "1rem", textAlign: "center" }}>
                This will reject the payout for <strong>{fmtFull(enriched.find((p) => p._id === showRejectModal)?.amount || 0)}</strong> to{" "}
                <strong>{enriched.find((p) => p._id === showRejectModal)?.partner?.name}</strong>.
              </p>
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Reason (optional)</label>
                <textarea
                  className="input"
                  rows={2}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Reason for rejection..."
                  style={{ resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: ".75rem" }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => { setShowRejectModal(null); setRejectNotes(""); }}>Cancel</button>
                <button className="btn" style={{ flex: 1, background: "#dc2626" }} onClick={handleReject}>Reject Payout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
