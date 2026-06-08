"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  AlertTriangle,
  Shield,
  CheckCircle2,
  Users,
  Clock,
  Scale,
  TrendingUp,
  XCircle,
  Plus,
  Search,
  Download,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

type DisputeStatus = "open" | "under_review" | "resolved" | "rejected";

/* ── Status badge ── */
function StatusBadge({ status }: { status: DisputeStatus }) {
  const styles: Record<DisputeStatus, { bg: string; fg: string; label: string }> = {
    open:         { bg: "#fee2e2", fg: "#991b1b", label: "Open" },
    under_review: { bg: "#fef3c7", fg: "#92400e", label: "Under Review" },
    resolved:     { bg: "#dcfce7", fg: "#166534", label: "Resolved" },
    rejected:     { bg: "#e5e7eb", fg: "#374151", label: "Rejected" },
  };
  const s = styles[status] || styles.open;
  return (
    <span style={{ padding: ".2rem .65rem", borderRadius: 20, fontSize: ".75rem", fontWeight: 600, background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ── Loading ── */
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div><div className="skeleton" style={{ height: 32, width: 320, marginBottom: 8 }} /><div className="skeleton" style={{ height: 16, width: 400 }} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[1,2,3,4].map(i => <div key={i} className="card"><div className="skeleton" style={{ height: 80 }} /></div>)}
      </div>
      <div className="card"><div className="skeleton" style={{ height: 300 }} /></div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ dealCount, partnerCount }: { dealCount: number; partnerCount: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Dispute Resolution</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>Manage partner commission disputes and channel conflicts</p>
      </div>
      <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #86efac", background: "#dcfce7", display: "flex", alignItems: "center", gap: "1rem" }}>
        <CheckCircle2 size={22} color="#166534" />
        <div>
          <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#166534" }}>No active disputes</p>
          <p style={{ fontSize: ".85rem", color: "#15803d" }}>Monitoring {dealCount} deals across {partnerCount} partners. All commission assignments are undisputed.</p>
        </div>
      </div>
      <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <Shield size={48} color="var(--muted)" />
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Dispute Resolution Center</h2>
        <p className="muted" style={{ maxWidth: 440 }}>
          When partners contest commission splits or attribution credit, disputes appear here for admin review.
          Resolve conflicts with full audit trail — assign primary partner, split credit, or dismiss.
        </p>
        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <Link href="/dashboard/deals" className="btn-primary">View Deals</Link>
          <Link href="/dashboard/reports/attribution" className="btn-outline">Attribution Reports</Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function DisputesPage() {
  const disputes = useQuery(api.disputes.list);
  const counts = useQuery(api.disputes.getCounts);
  const partners = useQuery(api.partners.list) ?? [];
  const deals = useQuery(api.dealsCrud.list) ?? [];
  const updateStatus = useMutation(api.disputes.updateStatus);
  const createDispute = useMutation(api.disputes.create);

  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | DisputeStatus>("all");
  const [search, setSearch] = useState("");
  const [resolvingId, setResolvingId] = useState<Id<"disputes"> | null>(null);
  const [resolution, setResolution] = useState("assign_primary");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [newDealId, setNewDealId] = useState("");
  const [newPartnerId, setNewPartnerId] = useState("");
  const [newCurrentPct, setNewCurrentPct] = useState("0");
  const [newRequestedPct, setNewRequestedPct] = useState("0");
  const [newReason, setNewReason] = useState("");

  if (disputes === undefined || counts === undefined) return <LoadingSkeleton />;
  if (disputes.length === 0 && counts.total === 0) return <EmptyState dealCount={deals.length} partnerCount={partners.length} />;

  // Lookups
  const partnerMap = new Map(partners.map(p => [p._id, p]));
  const dealMap = new Map(deals.map(d => [d._id, d]));

  // Enrich disputes
  const enriched = disputes.map(d => ({
    ...d,
    partnerName: partnerMap.get(d.partnerId)?.name || "Unknown Partner",
    dealName: dealMap.get(d.dealId)?.name || "Unknown Deal",
    dealAmount: dealMap.get(d.dealId)?.amount || 0,
  }));

  // Filter + search
  const filtered = enriched
    .filter(d => filter === "all" || d.status === filter)
    .filter(d => {
      if (!search) return true;
      const q = search.toLowerCase();
      return d.partnerName.toLowerCase().includes(q) || d.dealName.toLowerCase().includes(q) || d.reason.toLowerCase().includes(q);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const activeCount = (counts.open || 0) + (counts.underReview || 0);

  async function handleUpdateStatus(disputeId: Id<"disputes">, status: DisputeStatus, res?: string) {
    try {
      await updateStatus({ disputeId, status, resolution: res });
      toast(`Dispute ${status === "resolved" ? "resolved" : status === "rejected" ? "rejected" : "updated"}`);
      setResolvingId(null);
      setResolutionNotes("");
    } catch (e: any) {
      toast(e.message || "Failed to update dispute");
    }
  }

  async function handleCreate() {
    if (!newDealId || !newPartnerId || !newReason.trim()) {
      toast("Please fill all required fields");
      return;
    }
    try {
      await createDispute({
        dealId: newDealId as Id<"deals">,
        partnerId: newPartnerId as Id<"partners">,
        currentPercentage: parseFloat(newCurrentPct) || 0,
        requestedPercentage: parseFloat(newRequestedPct) || 0,
        reason: newReason.trim(),
      });
      toast("Dispute created");
      setShowCreateModal(false);
      setNewDealId("");
      setNewPartnerId("");
      setNewCurrentPct("0");
      setNewRequestedPct("0");
      setNewReason("");
    } catch (e: any) {
      toast(e.message || "Failed to create dispute");
    }
  }

  function exportCSV() {
    const rows = [["Deal", "Partner", "Status", "Current %", "Requested %", "Reason", "Resolution", "Created", "Resolved"]];
    filtered.forEach(d => {
      rows.push([
        d.dealName, d.partnerName, d.status,
        String(d.currentPercentage), String(d.requestedPercentage),
        d.reason, d.resolution || "", formatDate(d.createdAt),
        d.resolvedAt ? formatDate(d.resolvedAt) : "",
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `disputes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Dispute Resolution</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Manage partner commission disputes and channel conflicts</p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn-outline" onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
            <Download size={15} /> Export CSV
          </button>
          <button className="btn" onClick={() => setShowCreateModal(true)} style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
            <Plus size={15} /> Open Dispute
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {activeCount > 0 ? (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fca5a5", background: "#fef2f2", display: "flex", alignItems: "center", gap: "1rem" }}>
          <AlertTriangle size={22} color="#991b1b" />
          <div>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#991b1b" }}>{activeCount} active dispute{activeCount !== 1 ? "s" : ""} need attention</p>
            <p style={{ fontSize: ".85rem", color: "#b91c1c" }}>Review and resolve to prevent commission payment delays.</p>
          </div>
        </div>
      ) : (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #86efac", background: "#dcfce7", display: "flex", alignItems: "center", gap: "1rem" }}>
          <CheckCircle2 size={22} color="#166534" />
          <div>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#166534" }}>All disputes resolved</p>
            <p style={{ fontSize: ".85rem", color: "#15803d" }}>{counts.total} total dispute{counts.total !== 1 ? "s" : ""} processed. No pending action items.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <AlertTriangle size={22} color="#dc2626" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Open</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#dc2626" }}>{counts.open}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Clock size={22} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Under Review</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#d97706" }}>{counts.underReview}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <CheckCircle2 size={22} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Resolved</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{counts.resolved}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <XCircle size={22} color="#6b7280" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Rejected</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#6b7280" }}>{counts.rejected}</p>
        </div>
      </div>

      {/* Filters + Search */}
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={15} color="var(--muted)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search disputes..." style={{ paddingLeft: 32 }} />
        </div>
        <div style={{ display: "flex", gap: ".35rem" }}>
          {(["all", "open", "under_review", "resolved", "rejected"] as const).map(f => {
            const labels: Record<string, string> = { all: "All", open: "Open", under_review: "Under Review", resolved: "Resolved", rejected: "Rejected" };
            const ct = f === "all" ? enriched.length : enriched.filter(d => d.status === f).length;
            return (
              <button
                key={f} onClick={() => setFilter(f)}
                style={{
                  padding: ".4rem .7rem", borderRadius: 6, fontSize: ".8rem", fontWeight: 600, cursor: "pointer",
                  border: filter === f ? "2px solid var(--fg)" : "1px solid var(--border)",
                  background: filter === f ? "var(--subtle)" : "var(--bg)",
                  color: "var(--fg)",
                }}
              >
                {labels[f]} ({ct})
              </button>
            );
          })}
        </div>
      </div>

      {/* Disputes List */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Disputes &amp; Resolution History</h2>
          <span className="muted" style={{ fontSize: ".8rem" }}>{filtered.length} of {enriched.length}</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <Shield size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
            <p className="muted">No disputes match your filters</p>
          </div>
        ) : (
          filtered.map(dispute => (
            <div key={dispute._id} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".25rem" }}>
                    <Link href={`/dashboard/deals/${dispute.dealId}`} style={{ fontWeight: 700, fontSize: "1rem" }}>
                      {dispute.dealName}
                    </Link>
                    <StatusBadge status={dispute.status} />
                  </div>
                  <p className="muted" style={{ fontSize: ".8rem" }}>
                    {formatCurrency(dispute.dealAmount)} · Opened {timeAgo(dispute.createdAt)}
                    {dispute.resolvedAt && ` · Resolved ${formatDate(dispute.resolvedAt)}`}
                  </p>
                </div>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  {dispute.status === "open" && (
                    <>
                      <button className="btn" style={{ fontSize: ".8rem", padding: ".35rem .75rem" }}
                        onClick={() => { setResolvingId(dispute._id); setResolutionNotes(""); setResolution("assign_primary"); }}>
                        Resolve
                      </button>
                      <button className="btn-outline" style={{ fontSize: ".8rem", padding: ".35rem .75rem" }}
                        onClick={() => handleUpdateStatus(dispute._id, "under_review")}>
                        Review
                      </button>
                    </>
                  )}
                  {dispute.status === "under_review" && (
                    <button className="btn" style={{ fontSize: ".8rem", padding: ".35rem .75rem" }}
                      onClick={() => { setResolvingId(dispute._id); setResolutionNotes(""); setResolution("assign_primary"); }}>
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Partner + claim details */}
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: ".5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                  <Users size={14} color="var(--muted)" />
                  <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{dispute.partnerName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                  <Scale size={14} color="var(--muted)" />
                  <span className="muted" style={{ fontSize: ".85rem" }}>
                    Current: {dispute.currentPercentage}% → Requested: {dispute.requestedPercentage}%
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div style={{ padding: ".6rem .9rem", borderRadius: 8, background: "var(--subtle)", fontSize: ".85rem", color: "var(--muted)" }}>
                <strong style={{ color: "var(--fg)" }}>Reason:</strong> {dispute.reason}
              </div>

              {/* Resolution */}
              {(dispute.status === "resolved" || dispute.status === "rejected") && dispute.resolution && (
                <div style={{ marginTop: ".5rem", padding: ".6rem .9rem", borderRadius: 8, background: dispute.status === "resolved" ? "#ecfdf5" : "#f3f4f6", border: dispute.status === "resolved" ? "1px solid #a7f3d0" : "1px solid #d1d5db" }}>
                  <p style={{ fontWeight: 600, fontSize: ".85rem", color: dispute.status === "resolved" ? "#065f46" : "#374151" }}>
                    Resolution: {dispute.resolution}
                  </p>
                  {dispute.resolvedAt && (
                    <p className="muted" style={{ fontSize: ".75rem", marginTop: ".2rem" }}>
                      {dispute.status === "resolved" ? "Resolved" : "Rejected"} on {formatDate(dispute.resolvedAt)} by {dispute.resolvedBy || "admin"}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Resolve Modal */}
      {resolvingId && (() => {
        const dispute = enriched.find(d => d._id === resolvingId);
        if (!dispute) return null;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setResolvingId(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 520, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".25rem" }}>
                <Scale size={20} style={{ display: "inline", verticalAlign: "-3px", marginRight: ".4rem" }} />
                Resolve Dispute
              </h2>
              <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
                {dispute.dealName} — {dispute.partnerName} (requesting {dispute.requestedPercentage}%)
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Resolution Type</label>
                  <select className="input" value={resolution} onChange={e => setResolution(e.target.value)}>
                    <option value="assign_primary">Assign to Claiming Partner</option>
                    <option value="split_credit">Split Credit Between Partners</option>
                    <option value="keep_current">Keep Current Assignment</option>
                    <option value="dismissed">Dismiss — No Valid Claim</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Notes</label>
                  <textarea className="input" value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)} rows={3} placeholder="Document the resolution decision..." style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
                  <button className="btn-outline" onClick={() => setResolvingId(null)}>Cancel</button>
                  <button className="btn-outline" style={{ color: "#991b1b", borderColor: "#fca5a5" }}
                    onClick={() => handleUpdateStatus(dispute._id, "rejected", `${resolution}: ${resolutionNotes || "No notes"}`)}>
                    Reject
                  </button>
                  <button className="btn"
                    onClick={() => handleUpdateStatus(dispute._id, "resolved", `${resolution}: ${resolutionNotes || "No notes"}`)}>
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Create Dispute Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowCreateModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 520, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              <Plus size={20} style={{ display: "inline", verticalAlign: "-3px", marginRight: ".4rem" }} />
              Open New Dispute
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Deal *</label>
                <select className="input" value={newDealId} onChange={e => setNewDealId(e.target.value)}>
                  <option value="">Select deal...</option>
                  {deals.map(d => <option key={d._id} value={d._id}>{d.name} ({formatCurrency(d.amount)})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Disputing Partner *</label>
                <select className="input" value={newPartnerId} onChange={e => setNewPartnerId(e.target.value)}>
                  <option value="">Select partner...</option>
                  {partners.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Current %</label>
                  <input className="input" type="number" min="0" max="100" value={newCurrentPct} onChange={e => setNewCurrentPct(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Requested %</label>
                  <input className="input" type="number" min="0" max="100" value={newRequestedPct} onChange={e => setNewRequestedPct(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Reason *</label>
                <textarea className="input" value={newReason} onChange={e => setNewReason(e.target.value)} rows={3} placeholder="Why is this commission being disputed?" style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
                <button className="btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="btn" onClick={handleCreate}>Open Dispute</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
