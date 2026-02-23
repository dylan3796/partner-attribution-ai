"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
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
  Loader2,
  Zap,
  LinkIcon,
  ExternalLink,
} from "lucide-react";
import { exportPayoutsCSV } from "@/lib/csv";
import { formatCurrency, formatCurrencyCompact, formatDate } from "@/lib/utils";
import { ConfigTipBox } from "@/components/ui/config-tooltip";
import type { Payout, Partner } from "@/lib/types";

const fmt = formatCurrencyCompact;
const fmtFull = formatCurrency;

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
  // ── Convex ──────────────────────────────────────────────────────────────
  const convexPayouts = useQuery(api.payouts.list);
  const convexPartners = useQuery(api.partners.list);
  const approveMutation = useMutation(api.payouts.approve);
  const rejectMutation = useMutation(api.payouts.reject);
  const markPaidMutation = useMutation(api.payouts.markPaid);
  const createMutation = useMutation(api.payouts.create);

  type EnrichedPayout = Payout & { partner?: Partner };
  const payouts = (convexPayouts ?? []) as unknown as EnrichedPayout[];
  const partners = (convexPartners ?? []) as unknown as Partner[];
  const isLoading = convexPayouts === undefined;

  // ── UI state ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "approve" | "pay" | "stripe_pay" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkApproving, setBulkApproving] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(null);
  const [stripeProcessing, setStripeProcessing] = useState<string | null>(null);

  const [form, setForm] = useState({ partnerId: "", amount: "", period: "", notes: "" });

  // Check Stripe configuration on mount
  useEffect(() => {
    fetch("/api/stripe/status")
      .then((res) => res.json())
      .then((data) => setStripeConfigured(data.configured))
      .catch(() => setStripeConfigured(false));
  }, []);

  // Filter and sort
  const filtered = useMemo(() => {
    return [...payouts]
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
  }, [payouts, filterStatus, search]);

  // Stats
  const stats = useMemo(() => {
    const pending = payouts.filter((p) => p.status === "pending_approval");
    const approved = payouts.filter((p) => p.status === "approved");
    const paid = payouts.filter((p) => p.status === "paid");
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, p) => s + p.amount, 0),
      approvedCount: approved.length,
      approvedAmount: approved.reduce((s, p) => s + p.amount, 0),
      paidCount: paid.length,
      paidAmount: paid.reduce((s, p) => s + p.amount, 0),
      totalAmount: payouts.reduce((s, p) => s + p.amount, 0),
    };
  }, [payouts]);

  async function handleCreate() {
    if (!form.partnerId || !form.amount || !form.period) return;
    setSaving(true);
    try {
      await createMutation({
        partnerId: form.partnerId as Id<"partners">,
        amount: Number(form.amount),
        period: form.period,
        notes: form.notes || undefined,
      });
      setShowCreate(false);
      setForm({ partnerId: "", amount: "", period: "", notes: "" });
    } catch {
      // toast would go here
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    setSaving(true);
    try {
      if (confirmAction.action === "approve") {
        await approveMutation({ id: confirmAction.id as Id<"payouts"> });
      } else if (confirmAction.action === "stripe_pay") {
        // Initiate Stripe payout
        setStripeProcessing(confirmAction.id);
        const res = await fetch("/api/stripe/payout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payoutId: confirmAction.id }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Stripe payout failed");
        }
        // Success - data will be updated via Convex
      } else {
        await markPaidMutation({ id: confirmAction.id as Id<"payouts"> });
      }
    } catch (err) {
      console.error("Action failed:", err);
      // Could add toast notification here
    } finally {
      setSaving(false);
      setStripeProcessing(null);
      setConfirmAction(null);
    }
  }

  async function handleReject() {
    if (!showRejectModal) return;
    setSaving(true);
    try {
      await rejectMutation({ id: showRejectModal as Id<"payouts">, notes: rejectNotes || undefined });
    } finally {
      setSaving(false);
      setShowRejectModal(null);
      setRejectNotes("");
    }
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
  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <Loader2 size={28} color="var(--muted)" style={{ marginBottom: ".5rem" }} />
        <p className="muted">Loading payouts from database…</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Payouts</h1>
          <p className="muted">Manage partner commissions and payment workflows</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button className="btn-outline" onClick={handleExport}>
            <Download size={15} /> Export
          </button>
          <button className="btn" onClick={() => setShowCreate(true)}>
            <Plus size={15} /> Create Payout
          </button>
        </div>
      </div>

      <ConfigTipBox
        title="Configure Payout Workflows"
        tips={[
          "Set default commission rates globally or override per-partner",
          "Toggle the Payouts module on/off in Platform Configuration",
          "Approval workflows ensure every payout is reviewed before processing",
        ]}
      />

      {/* Summary Cards */}
      <div className="stat-grid" style={{ marginBottom: "1.5rem", gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="card" style={{ padding: "1rem 1.2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Pending Approval</p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#92400e" }}>{fmtFull(stats.pendingAmount)}</p>
            </div>
            <div style={{ background: "#fffbeb", padding: ".4rem", borderRadius: 8 }}><Clock size={16} color="#92400e" /></div>
          </div>
          <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>{stats.pendingCount} payout{stats.pendingCount !== 1 ? "s" : ""} awaiting review</p>
        </div>
        <div className="card" style={{ padding: "1rem 1.2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Approved</p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1e40af" }}>{fmtFull(stats.approvedAmount)}</p>
            </div>
            <div style={{ background: "#eff6ff", padding: ".4rem", borderRadius: 8 }}><CheckCircle size={16} color="#1e40af" /></div>
          </div>
          <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>{stats.approvedCount} ready to pay</p>
        </div>
        <div className="card" style={{ padding: "1rem 1.2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Paid Out</p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#065f46" }}>{fmtFull(stats.paidAmount)}</p>
            </div>
            <div style={{ background: "#ecfdf5", padding: ".4rem", borderRadius: 8 }}><CreditCard size={16} color="#065f46" /></div>
          </div>
          <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>{stats.paidCount} completed</p>
        </div>
        <div className="card" style={{ padding: "1rem 1.2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>Total All Time</p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{fmtFull(stats.totalAmount)}</p>
            </div>
            <div style={{ background: "#f3f4f6", padding: ".4rem", borderRadius: 8 }}><DollarSign size={16} color="#6b7280" /></div>
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
          <button className="btn" style={{ fontSize: ".85rem", padding: ".5rem 1rem" }} onClick={() => setFilterStatus("pending_approval")}>Review Now</button>
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
          <button className="btn-outline" style={{ padding: ".5rem .8rem", fontSize: ".8rem" }} onClick={() => { setSearch(""); setFilterStatus("all"); }}>Clear</button>
        )}
      </div>

      <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
        {filtered.length === payouts.length
          ? `Showing all ${filtered.length} payouts`
          : `${filtered.length} of ${payouts.length} payouts`}
      </p>

      {/* Bulk Approve Bar */}
      {selected.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", marginBottom: "1rem", borderRadius: 8, background: "#1e40af10", border: "1px solid #1e40af30" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{selected.size} payout{selected.size > 1 ? "s" : ""} selected</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn-outline" style={{ fontSize: "0.85rem", padding: "0.4rem 0.75rem" }} onClick={() => setSelected(new Set())}>
              Clear
            </button>
            <button
              className="btn"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.75rem" }}
              disabled={bulkApproving}
              onClick={async () => {
                setBulkApproving(true);
                let approved = 0;
                for (const id of selected) {
                  try {
                    await approveMutation({ id: id as Id<"payouts"> });
                    approved++;
                  } catch { /* skip failures */ }
                }
                setSelected(new Set());
                setBulkApproving(false);
                alert(`${approved} payout${approved > 1 ? "s" : ""} approved`);
              }}
            >
              <CheckCircle size={14} /> {bulkApproving ? "Approving..." : `Approve Selected (${selected.size})`}
            </button>
          </div>
        </div>
      )}

      {/* Payouts Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
              <th style={{ padding: ".8rem .5rem .8rem 1.2rem", width: 32 }}>
                <input
                  type="checkbox"
                  checked={filtered.filter((p) => p.status === "pending_approval").length > 0 && filtered.filter((p) => p.status === "pending_approval").every((p) => selected.has(p._id))}
                  onChange={(e) => {
                    const pending = filtered.filter((p) => p.status === "pending_approval");
                    if (e.target.checked) {
                      setSelected(new Set([...selected, ...pending.map((p) => p._id)]));
                    } else {
                      const next = new Set(selected);
                      pending.forEach((p) => next.delete(p._id));
                      setSelected(next);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                  title="Select all pending"
                />
              </th>
              <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Period</th>
              <th style={{ padding: ".8rem", textAlign: "right", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Amount</th>
              <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Method</th>
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
                  <td style={{ padding: ".8rem .5rem .8rem 1.2rem", width: 32 }}>
                    {payout.status === "pending_approval" ? (
                      <input
                        type="checkbox"
                        checked={selected.has(payout._id)}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(payout._id);
                          else next.delete(payout._id);
                          setSelected(next);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    ) : <span style={{ width: 16, display: "inline-block" }} />}
                  </td>
                  <td style={{ padding: ".8rem 1.2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: ".65rem" }}>
                        {(payout.partner?.name || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <Link href={`/dashboard/partners/${payout.partnerId}`} style={{ fontWeight: 600, fontSize: ".9rem" }}>
                          {payout.partner?.name || "Unknown Partner"}
                        </Link>
                        <p className="muted" style={{ fontSize: ".75rem" }}>{payout.partner?.type} · {payout.partner?.commissionRate}%</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: ".8rem" }}><span style={{ fontWeight: 500 }}>{payout.period || "—"}</span></td>
                  <td style={{ padding: ".8rem", textAlign: "right" }}>
                    <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{fmtFull(payout.amount)}</span>
                  </td>
                  <td style={{ padding: ".8rem", textAlign: "center" }}>
                    {payout.paidVia === "stripe" ? (
                      <span className="badge badge-success" style={{ fontSize: ".7rem", display: "inline-flex", alignItems: "center", gap: ".25rem" }}>
                        <Zap size={10} /> Stripe
                      </span>
                    ) : payout.paidVia === "manual" ? (
                      <span className="badge badge-neutral" style={{ fontSize: ".7rem" }}>Manual</span>
                    ) : payout.partner?.stripeOnboarded ? (
                      <span className="badge badge-info" style={{ fontSize: ".7rem", display: "inline-flex", alignItems: "center", gap: ".25rem" }}>
                        <LinkIcon size={10} /> Connected
                      </span>
                    ) : payout.partner?.stripeAccountId ? (
                      <span className="badge badge-neutral" style={{ fontSize: ".7rem" }}>Pending</span>
                    ) : (
                      <span className="muted" style={{ fontSize: ".75rem" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: ".8rem" }}>
                    <span className={`badge ${meta.badge}`} style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", fontSize: ".75rem" }}>
                      <StatusIcon size={12} />
                      {meta.label}
                    </span>
                  </td>
                  <td style={{ padding: ".8rem" }}>
                    <span className="muted" style={{ fontSize: ".85rem" }}>
                      {payout.paidAt
                        ? `Paid ${formatDate(payout.paidAt)}`
                        : payout.approvedAt
                        ? `Approved ${formatDate(payout.approvedAt)}`
                        : formatDate(payout.createdAt)}
                    </span>
                  </td>
                  <td style={{ padding: ".8rem 1.2rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
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
                        <>
                          {stripeConfigured && payout.partner?.stripeOnboarded && (
                            <button
                              className="btn"
                              style={{ fontSize: ".75rem", padding: ".35rem .7rem", background: "#6366f1" }}
                              onClick={() => setConfirmAction({ id: payout._id, action: "stripe_pay" })}
                              disabled={stripeProcessing === payout._id}
                            >
                              {stripeProcessing === payout._id ? (
                                <><Loader2 size={12} className="animate-spin" /> Processing...</>
                              ) : (
                                <><Zap size={12} /> Pay via Stripe</>
                              )}
                            </button>
                          )}
                          <button
                            className="btn-outline"
                            style={{ fontSize: ".75rem", padding: ".35rem .7rem" }}
                            onClick={() => setConfirmAction({ id: payout._id, action: "pay" })}
                          >
                            <CreditCard size={12} /> Mark Paid
                          </button>
                        </>
                      )}
                      {payout.status === "processing" && (
                        <span className="muted" style={{ fontSize: ".8rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                          <Loader2 size={12} className="animate-spin" /> Processing...
                        </span>
                      )}
                      {payout.status === "paid" && payout.stripeTransferId && (
                        <a
                          href={`https://dashboard.stripe.com/transfers/${payout.stripeTransferId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline"
                          style={{ fontSize: ".75rem", padding: ".35rem .7rem", display: "inline-flex", alignItems: "center", gap: ".3rem" }}
                        >
                          <ExternalLink size={12} /> View in Stripe
                        </a>
                      )}
                      {payout.status === "failed" && (
                        <span className="badge badge-danger" style={{ fontSize: ".7rem" }} title={payout.stripeError}>
                          Failed
                        </span>
                      )}
                      {(payout.status === "paid" && !payout.stripeTransferId) || payout.status === "rejected" ? (
                        <span className="muted" style={{ fontSize: ".8rem" }}>—</span>
                      ) : null}
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
            <p className="muted" style={{ fontSize: ".9rem" }}>
              {payouts.length === 0 ? (
                <>No payouts yet. Payouts are created automatically when deals close and commissions are calculated.</>
              ) : (
                "Try adjusting your filters or create a new payout."
              )}
            </p>
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
                  <input className="input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000" min="0" step="0.01" />
                </div>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Period *</label>
                  <input className="input" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder={currentPeriod} />
                </div>
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Notes (optional)</label>
                <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Commission for Q1 deals..." style={{ resize: "vertical" }} />
              </div>
              <button className="btn" style={{ width: "100%", marginTop: ".5rem" }} onClick={handleCreate} disabled={!form.partnerId || !form.amount || !form.period || saving}>
                {saving ? "Saving…" : "Create Payout"}
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
                  This will approve the payout for <strong>{fmtFull(payouts.find((p) => p._id === confirmAction.id)?.amount || 0)}</strong> to{" "}
                  <strong>{payouts.find((p) => p._id === confirmAction.id)?.partner?.name}</strong>.
                </p>
              </>
            ) : confirmAction.action === "stripe_pay" ? (
              <>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <Zap size={24} color="#6366f1" />
                </div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Pay via Stripe?</h2>
                <p className="muted" style={{ marginBottom: "1.5rem" }}>
                  This will immediately transfer <strong>{fmtFull(payouts.find((p) => p._id === confirmAction.id)?.amount || 0)}</strong> to{" "}
                  <strong>{payouts.find((p) => p._id === confirmAction.id)?.partner?.name}</strong>&apos;s connected Stripe account.
                </p>
              </>
            ) : (
              <>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <CreditCard size={24} color="#065f46" />
                </div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Mark as Paid?</h2>
                <p className="muted" style={{ marginBottom: "1.5rem" }}>
                  Confirm that <strong>{fmtFull(payouts.find((p) => p._id === confirmAction.id)?.amount || 0)}</strong> has been paid to{" "}
                  <strong>{payouts.find((p) => p._id === confirmAction.id)?.partner?.name}</strong> manually.
                </p>
              </>
            )}
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setConfirmAction(null)}>Cancel</button>
              <button
                className="btn"
                style={{ 
                  flex: 1, 
                  background: confirmAction.action === "approve" 
                    ? "#059669" 
                    : confirmAction.action === "stripe_pay" 
                    ? "#6366f1" 
                    : "var(--fg)" 
                }}
                onClick={handleConfirmAction}
                disabled={saving}
              >
                {saving 
                  ? "Processing…" 
                  : confirmAction.action === "approve" 
                  ? "Approve" 
                  : confirmAction.action === "stripe_pay"
                  ? "Pay via Stripe"
                  : "Confirm Paid"}
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
              This will reject the payout for <strong>{fmtFull(payouts.find((p) => p._id === showRejectModal)?.amount || 0)}</strong> to{" "}
              <strong>{payouts.find((p) => p._id === showRejectModal)?.partner?.name}</strong>.
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Reason (optional)</label>
              <textarea className="input" rows={2} value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} placeholder="Reason for rejection..." style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => { setShowRejectModal(null); setRejectNotes(""); }}>Cancel</button>
              <button className="btn" style={{ flex: 1, background: "#dc2626" }} onClick={handleReject} disabled={saving}>{saving ? "Saving…" : "Reject Payout"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
