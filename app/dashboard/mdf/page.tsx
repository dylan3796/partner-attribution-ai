"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  DollarSign,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Settings2,
  Plus,
  Loader2,
  Inbox,
} from "lucide-react";

type MDFStatus = "pending" | "approved" | "rejected" | "completed";

const STATUS_LABELS: Record<MDFStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

const CATEGORY_LABELS: Record<string, string> = {
  event: "Event / Trade Show",
  content: "Content Creation",
  advertising: "Advertising",
  training: "Training / Enablement",
};

function StatusBadge({ status }: { status: MDFStatus }) {
  const colors: Record<MDFStatus, { bg: string; fg: string }> = {
    pending: { bg: "#fef3c7", fg: "#92400e" },
    approved: { bg: "#dbeafe", fg: "#1e40af" },
    rejected: { bg: "#fee2e2", fg: "#991b1b" },
    completed: { bg: "#dcfce7", fg: "#166534" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span style={{ padding: ".2rem .65rem", borderRadius: 20, fontSize: ".75rem", fontWeight: 600, background: c.bg, color: c.fg }}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ width: 280, height: 32, background: "var(--border)", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ width: 320, height: 16, background: "var(--border)", borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ width: 22, height: 22, background: "var(--border)", borderRadius: 4, margin: "0 auto .5rem" }} />
            <div style={{ width: 60, height: 12, background: "var(--border)", borderRadius: 4, margin: "0 auto .5rem" }} />
            <div style={{ width: 80, height: 24, background: "var(--border)", borderRadius: 4, margin: "0 auto" }} />
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ width: 200, height: 16, background: "var(--border)", borderRadius: 4 }} />
            <div style={{ width: 100, height: 16, background: "var(--border)", borderRadius: 4 }} />
            <div style={{ width: 80, height: 16, background: "var(--border)", borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <Inbox size={48} style={{ color: "var(--muted)", margin: "0 auto 1rem" }} />
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: ".5rem" }}>No MDF Requests Yet</h3>
      <p className="muted" style={{ marginBottom: "1.5rem", maxWidth: 400, margin: "0 auto 1.5rem" }}>
        Market Development Fund requests help partners get funding for marketing activities. Create your first request to get started.
      </p>
      <button className="btn" onClick={onCreateClick}>
        <Plus size={16} /> Create MDF Request
      </button>
    </div>
  );
}

export default function MDFPage() {
  const mdfRequests = useQuery(api.mdf.list);
  const mdfStats = useQuery(api.mdf.getStats);
  const partners = useQuery(api.partners.list);
  const createMDF = useMutation(api.mdf.create);
  const updateMDFStatus = useMutation(api.mdf.updateStatus);
  
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | MDFStatus>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  
  // Form state
  const [formPartnerId, setFormPartnerId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState("event");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (mdfRequests === undefined || mdfStats === undefined || partners === undefined) {
    return <LoadingSkeleton />;
  }

  const filtered = filter === "all" ? mdfRequests : mdfRequests.filter((r) => r.status === filter);
  const detail = detailId ? mdfRequests.find((r) => r._id === detailId) : null;

  async function handleApprove(req: any) {
    try {
      await updateMDFStatus({ id: req._id as Id<"mdfRequests">, status: "approved" });
      toast(`MDF request "${req.title}" approved`);
    } catch (e) {
      toast("Failed to approve request", "error");
    }
  }

  async function handleReject(req: any) {
    try {
      await updateMDFStatus({ id: req._id as Id<"mdfRequests">, status: "rejected" });
      toast(`MDF request "${req.title}" rejected`, "error");
    } catch (e) {
      toast("Failed to reject request", "error");
    }
  }

  async function handleMarkComplete(req: any) {
    try {
      await updateMDFStatus({ id: req._id as Id<"mdfRequests">, status: "completed" });
      toast(`MDF request "${req.title}" marked as completed`);
    } catch (e) {
      toast("Failed to update request", "error");
    }
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formPartnerId || !formTitle || !formAmount) {
      toast("Please fill in all required fields", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await createMDF({
        partnerId: formPartnerId as Id<"partners">,
        title: formTitle,
        description: formDescription,
        amount: parseFloat(formAmount),
        category: formCategory,
      });
      toast("MDF request created successfully");
      setShowCreateModal(false);
      setFormPartnerId("");
      setFormTitle("");
      setFormDescription("");
      setFormAmount("");
      setFormCategory("event");
    } catch (e) {
      toast("Failed to create MDF request", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Market Development Funds</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Manage MDF budgets, requests, and campaign performance</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button className="btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> New Request
          </button>
          <Link href="/dashboard/mdf/setup" className="btn-outline" style={{ fontSize: ".875rem" }}>
            <Settings2 size={15} /> Setup Program
          </Link>
        </div>
      </div>

      {/* MDF Overview Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <DollarSign size={22} color="#4338ca" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Total Requested</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800 }}>{formatCurrency(mdfStats.totalRequested)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Clock size={22} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Pending Review</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d97706" }}>{mdfStats.pendingCount}</p>
          <p className="muted" style={{ fontSize: ".7rem" }}>{formatCurrency(mdfStats.pendingAmount)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <FileCheck size={22} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Approved</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>{mdfStats.approvedCount + mdfStats.completedCount}</p>
          <p className="muted" style={{ fontSize: ".7rem" }}>{formatCurrency(mdfStats.approvedAmount)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <TrendingUp size={22} color="#6366f1" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Total Requests</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#6366f1" }}>{mdfStats.totalCount}</p>
        </div>
      </div>

      {/* Pending Alert */}
      {mdfStats.pendingCount > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fbbf24", background: "#fffbeb", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Clock size={20} color="#92400e" />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: ".9rem", color: "#78350f" }}>{mdfStats.pendingCount} MDF request{mdfStats.pendingCount !== 1 ? "s" : ""} pending approval</p>
            <p style={{ fontSize: ".8rem", color: "#92400e" }}>Review and approve partner marketing campaigns</p>
          </div>
        </div>
      )}

      {/* Request Filters */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {(["all", "pending", "approved", "completed", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: ".4rem .8rem",
              borderRadius: 6,
              border: filter === f ? "2px solid #6366f1" : "1px solid var(--border)",
              background: filter === f ? "#eef2ff" : "var(--bg)",
              color: filter === f ? "#4338ca" : "var(--fg)",
              fontSize: ".8rem",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? `All (${mdfRequests.length})` : `${f} (${mdfRequests.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Empty State or Table */}
      {mdfRequests.length === 0 ? (
        <EmptyState onCreateClick={() => setShowCreateModal(true)} />
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: ".75rem 1.5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Request</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Partner</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Category</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Amount</th>
                <th style={{ padding: ".75rem .5rem", textAlign: "center", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Status</th>
                <th style={{ padding: ".75rem 1.5rem", textAlign: "center", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: ".75rem 1.5rem" }}>
                    <p style={{ fontWeight: 600, fontSize: ".9rem" }}>{req.title}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>{formatDate(req.submittedAt)}</p>
                  </td>
                  <td style={{ padding: ".75rem .5rem", fontSize: ".9rem" }}>{req.partnerName}</td>
                  <td style={{ padding: ".75rem .5rem", fontSize: ".85rem" }}>{CATEGORY_LABELS[req.category || "event"] || req.category}</td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "right", fontWeight: 600 }}>
                    {formatCurrency(req.amount)}
                  </td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "center" }}>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ padding: ".75rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
                      <button className="btn-outline" style={{ fontSize: ".75rem", padding: ".25rem .5rem" }} onClick={() => setDetailId(req._id)}>
                        View
                      </button>
                      {req.status === "pending" && (
                        <>
                          <button className="btn" style={{ fontSize: ".75rem", padding: ".25rem .5rem", background: "#059669" }} onClick={() => handleApprove(req)}>
                            <CheckCircle2 size={13} />
                          </button>
                          <button className="btn" style={{ fontSize: ".75rem", padding: ".25rem .5rem", background: "#dc2626" }} onClick={() => handleReject(req)}>
                            <XCircle size={13} />
                          </button>
                        </>
                      )}
                      {req.status === "approved" && (
                        <button className="btn" style={{ fontSize: ".75rem", padding: ".25rem .5rem" }} onClick={() => handleMarkComplete(req)}>
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setDetailId(null)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 540, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: ".25rem" }}>{detail.title}</h2>
                <p className="muted" style={{ fontSize: ".85rem" }}>{detail.partnerName}</p>
              </div>
              <StatusBadge status={detail.status} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div><p className="muted" style={{ fontSize: ".75rem" }}>Category</p><p style={{ fontWeight: 600 }}>{CATEGORY_LABELS[detail.category || "event"] || detail.category}</p></div>
              <div><p className="muted" style={{ fontSize: ".75rem" }}>Requested Amount</p><p style={{ fontWeight: 600 }}>{formatCurrency(detail.amount)}</p></div>
              <div><p className="muted" style={{ fontSize: ".75rem" }}>Submitted</p><p style={{ fontWeight: 600 }}>{formatDate(detail.submittedAt)}</p></div>
              {detail.reviewedAt && <div><p className="muted" style={{ fontSize: ".75rem" }}>Reviewed</p><p style={{ fontWeight: 600 }}>{formatDate(detail.reviewedAt)}</p></div>}
            </div>

            {detail.description && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".25rem" }}>Description</p>
                <p style={{ fontSize: ".9rem", lineHeight: 1.6 }}>{detail.description}</p>
              </div>
            )}

            {detail.notes && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", borderRadius: 10, background: "#f1f5f9" }}>
                <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".25rem" }}>Notes</p>
                <p style={{ fontSize: ".9rem" }}>{detail.notes}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
              {detail.status === "pending" && (
                <>
                  <button className="btn" onClick={() => { handleApprove(detail); setDetailId(null); }} style={{ background: "#059669" }}>
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button className="btn" onClick={() => { handleReject(detail); setDetailId(null); }} style={{ background: "#dc2626" }}>
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}
              {detail.status === "approved" && (
                <button className="btn" onClick={() => { handleMarkComplete(detail); setDetailId(null); }}>
                  <CheckCircle2 size={16} /> Mark Complete
                </button>
              )}
              <button className="btn-outline" onClick={() => setDetailId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowCreateModal(false)}
        >
          <form 
            onClick={(e) => e.stopPropagation()} 
            onSubmit={handleCreateSubmit}
            style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 480, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.5rem" }}>Create MDF Request</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: ".85rem", fontWeight: 600, display: "block", marginBottom: ".35rem" }}>Partner *</label>
                <select
                  className="input"
                  value={formPartnerId}
                  onChange={(e) => setFormPartnerId(e.target.value)}
                  required
                  style={{ width: "100%" }}
                >
                  <option value="">Select a partner...</option>
                  {partners.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: ".85rem", fontWeight: 600, display: "block", marginBottom: ".35rem" }}>Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Q1 Digital Marketing Campaign"
                  required
                  style={{ width: "100%" }}
                />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: ".85rem", fontWeight: 600, display: "block", marginBottom: ".35rem" }}>Amount *</label>
                  <input
                    type="number"
                    className="input"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="5000"
                    required
                    min="0"
                    step="100"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: ".85rem", fontWeight: 600, display: "block", marginBottom: ".35rem" }}>Category</label>
                  <select
                    className="input"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option value="event">Event / Trade Show</option>
                    <option value="content">Content Creation</option>
                    <option value="advertising">Advertising</option>
                    <option value="training">Training / Enablement</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: ".85rem", fontWeight: 600, display: "block", marginBottom: ".35rem" }}>Description</label>
                <textarea
                  className="input"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the marketing activity and expected outcomes..."
                  rows={3}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button type="button" className="btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Create Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
