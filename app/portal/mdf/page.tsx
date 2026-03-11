"use client";

import { useState } from "react";
import { usePortal } from "@/lib/portal-context";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  DollarSign,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  TrendingUp,
  X,
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
  webinar: "Webinar",
  social: "Social Media Campaign",
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
      <div>
        <div style={{ width: 280, height: 32, background: "var(--subtle)", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ width: 320, height: 16, background: "var(--border)", borderRadius: 4 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ width: 22, height: 22, background: "var(--border)", borderRadius: 4, margin: "0 auto .5rem" }} />
            <div style={{ width: 60, height: 12, background: "var(--border)", borderRadius: 4, margin: "0 auto .5rem" }} />
            <div style={{ width: 80, height: 24, background: "var(--border)", borderRadius: 4, margin: "0 auto" }} />
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 200, height: 16, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
            <div style={{ width: 300, height: 12, background: "var(--border)", borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortalMDFPage() {
  const { partner } = usePortal();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [campaignType, setCampaignType] = useState("event");
  const [description, setDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const partnerId = partner?.linkedPartnerIds?.[0] as Id<"partners"> | undefined;

  const requests = useQuery(
    api.mdf.getByPartner,
    partnerId ? { partnerId } : "skip"
  );
  const stats = useQuery(
    api.mdf.getPartnerStats,
    partnerId ? { partnerId } : "skip"
  );
  const submitRequest = useMutation(api.mdf.submitRequest);

  if (!partner) return null;
  if (requests === undefined || stats === undefined) return <LoadingSkeleton />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(requestedAmount);
    if (!title || !description || isNaN(amount) || amount <= 0 || !startDate || !endDate) {
      toast("Please fill in all fields", "error");
      return;
    }
    if (!partnerId) {
      toast("Partner not found", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitRequest({
        partnerId,
        title,
        description: `${description}\n\nCampaign period: ${startDate} to ${endDate}`,
        amount,
        category: campaignType,
      });
      toast(`MDF request "${title}" submitted for approval`);
      setShowForm(false);
      setTitle("");
      setDescription("");
      setRequestedAmount("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      toast("Failed to submit request", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Market Development Funds</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Submit MDF requests and track campaign budgets</p>
        </div>
        <button className="btn" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New MDF Request
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <DollarSign size={22} color="#4338ca" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Total Requested</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800 }}>{formatCurrency(stats.totalRequested)}</p>
          <p className="muted" style={{ fontSize: ".7rem" }}>{stats.totalCount} request{stats.totalCount !== 1 ? "s" : ""}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Clock size={22} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Pending Review</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d97706" }}>{formatCurrency(stats.pendingAmount)}</p>
          <p className="muted" style={{ fontSize: ".7rem" }}>{stats.pendingCount} pending</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <CheckCircle2 size={22} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Approved</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>{formatCurrency(stats.approvedAmount)}</p>
          <p className="muted" style={{ fontSize: ".7rem" }}>{stats.approvedCount} approved</p>
        </div>
      </div>

      {/* Pending Alert */}
      {stats.pendingCount > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fbbf24", background: "#fffbeb08", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Clock size={20} color="#fbbf24" />
          <div>
            <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
              {stats.pendingCount} request{stats.pendingCount !== 1 ? "s" : ""} awaiting review
            </p>
            <p className="muted" style={{ fontSize: ".8rem" }}>Your partner manager will review and respond shortly</p>
          </div>
        </div>
      )}

      {/* New Request Form Modal */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 560, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Submit MDF Request</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg)" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Campaign Title *</label>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Spring Digital Campaign" required style={{ width: "100%" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Campaign Type *</label>
                  <select className="input" value={campaignType} onChange={(e) => setCampaignType(e.target.value)} style={{ width: "100%" }}>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Requested Amount *</label>
                  <input className="input" type="number" value={requestedAmount} onChange={(e) => setRequestedAmount(e.target.value)} placeholder="10000" required min="0" step="100" style={{ width: "100%" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Start Date *</label>
                  <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: "100%" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>End Date *</label>
                  <input className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Campaign Description *</label>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the campaign goals, target audience, and expected outcomes..." required style={{ resize: "vertical", width: "100%" }} />
              </div>
              <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request History */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>MDF Request History</h2>
        </div>
        {requests.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <Inbox size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
            <p style={{ fontWeight: 600, marginBottom: ".25rem" }}>No MDF Requests Yet</p>
            <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
              Submit your first campaign proposal to request marketing funds from your partner program.
            </p>
            <button className="btn" onClick={() => setShowForm(true)}>
              <Plus size={16} /> New MDF Request
            </button>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req._id} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".5rem" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".95rem" }}>{req.title}</p>
                  <p className="muted" style={{ fontSize: ".8rem" }}>
                    {CATEGORY_LABELS[req.category || "event"] || req.category} · Submitted {formatDate(req.submittedAt)}
                  </p>
                </div>
                <StatusBadge status={req.status as MDFStatus} />
              </div>
              <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".5rem", lineHeight: 1.5 }}>{req.description}</p>
              <div style={{ display: "flex", gap: "1.5rem", fontSize: ".85rem" }}>
                <span>Requested: <strong>{formatCurrency(req.amount)}</strong></span>
                {req.reviewedAt && (
                  <span className="muted">Reviewed: {formatDate(req.reviewedAt)}</span>
                )}
              </div>
              {req.notes && (
                <div style={{ marginTop: ".5rem", padding: ".5rem .75rem", borderRadius: 8, background: "var(--border)", fontSize: ".8rem" }}>
                  <span style={{ fontWeight: 600 }}>Review notes:</span> {req.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
