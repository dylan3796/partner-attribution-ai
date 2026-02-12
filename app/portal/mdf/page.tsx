"use client";

import { useState } from "react";
import { usePortal } from "@/lib/portal-context";
import { useStore } from "@/lib/store";
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
} from "lucide-react";
import type { MDFStatus } from "@/lib/types";
import { MDF_CAMPAIGN_LABELS, MDF_STATUS_LABELS } from "@/lib/types";

function StatusBadge({ status }: { status: MDFStatus }) {
  const colors: Record<MDFStatus, { bg: string; fg: string }> = {
    pending: { bg: "#fef3c7", fg: "#92400e" },
    approved: { bg: "#dbeafe", fg: "#1e40af" },
    rejected: { bg: "#fee2e2", fg: "#991b1b" },
    executed: { bg: "#e0e7ff", fg: "#3730a3" },
    paid: { bg: "#dcfce7", fg: "#166534" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span style={{ padding: ".2rem .65rem", borderRadius: 20, fontSize: ".75rem", fontWeight: 600, background: c.bg, color: c.fg }}>
      {MDF_STATUS_LABELS[status]}
    </span>
  );
}

export default function PortalMDFPage() {
  const { partner } = usePortal();
  const { mdfBudgets, mdfRequests, addMDFRequest } = useStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [campaignType, setCampaignType] = useState<string>("event");
  const [description, setDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!partner) return null;

  const linkedIds = partner.linkedPartnerIds;
  const myBudget = mdfBudgets.find((b) => linkedIds.includes(b.partnerId));
  const myRequests = mdfRequests.filter((r) => linkedIds.includes(r.partnerId)).sort((a, b) => b.submittedAt - a.submittedAt);

  const totalApproved = myRequests.filter((r) => r.status !== "pending" && r.status !== "rejected").reduce((s, r) => s + (r.approvedAmount || r.requestedAmount), 0);
  const totalPending = myRequests.filter((r) => r.status === "pending").reduce((s, r) => s + r.requestedAmount, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(requestedAmount);
    if (!title || !description || isNaN(amount) || !startDate || !endDate) {
      toast("Please fill in all fields", "error");
      return;
    }
    if (myBudget && amount > myBudget.remainingAmount) {
      toast("Request exceeds remaining MDF budget", "error");
      return;
    }
    addMDFRequest({
      partnerId: linkedIds[0],
      budgetId: myBudget?._id || "",
      title,
      campaignType: campaignType as any,
      description,
      requestedAmount: amount,
      status: "pending",
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
    });
    toast(`MDF request "${title}" submitted for approval`);
    setShowForm(false);
    setTitle(""); setDescription(""); setRequestedAmount(""); setStartDate(""); setEndDate("");
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

      {/* Budget Overview */}
      {myBudget ? (
        <div className="card" style={{ borderLeft: "4px solid #6366f1" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Your MDF Budget — {myBudget.period}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Allocated</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 800 }}>{formatCurrency(myBudget.allocatedAmount)}</p>
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Spent</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>{formatCurrency(myBudget.spentAmount)}</p>
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Pending</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d97706" }}>{formatCurrency(totalPending)}</p>
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Remaining</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#4338ca" }}>{formatCurrency(myBudget.remainingAmount)}</p>
            </div>
          </div>
          <div style={{ marginTop: ".75rem" }}>
            <div style={{ width: "100%", height: 10, background: "var(--border)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{ width: `${(myBudget.spentAmount / myBudget.allocatedAmount) * 100}%`, height: "100%", background: "#6366f1", borderRadius: 5 }} />
            </div>
            <p className="muted" style={{ fontSize: ".8rem", marginTop: ".35rem" }}>
              {Math.round((myBudget.spentAmount / myBudget.allocatedAmount) * 100)}% utilized
            </p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <DollarSign size={32} color="var(--muted)" style={{ margin: "0 auto .5rem" }} />
          <p className="muted">No MDF budget allocated yet. Contact your partner manager.</p>
        </div>
      )}

      {/* New Request Form */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 560, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Submit MDF Request</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Campaign Title *</label>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Spring Digital Campaign" required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Campaign Type *</label>
                  <select className="input" value={campaignType} onChange={(e) => setCampaignType(e.target.value)}>
                    {Object.entries(MDF_CAMPAIGN_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>
                    Requested Amount * {myBudget && <span className="muted" style={{ fontWeight: 400 }}>(max: {formatCurrency(myBudget.remainingAmount)})</span>}
                  </label>
                  <input className="input" type="number" value={requestedAmount} onChange={(e) => setRequestedAmount(e.target.value)} placeholder="10000" required />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Start Date *</label>
                  <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>End Date *</label>
                  <input className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Campaign Description *</label>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the campaign goals, target audience, and expected outcomes..." required style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn">Submit Request</button>
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
        {myRequests.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <FileText size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
            <p className="muted">No MDF requests yet. Submit your first campaign proposal above.</p>
          </div>
        ) : (
          myRequests.map((req) => (
            <div key={req._id} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".5rem" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".95rem" }}>{req.title}</p>
                  <p className="muted" style={{ fontSize: ".8rem" }}>{MDF_CAMPAIGN_LABELS[req.campaignType]} · Submitted {formatDate(req.submittedAt)}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
              <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".5rem", lineHeight: 1.5 }}>{req.description}</p>
              <div style={{ display: "flex", gap: "1.5rem", fontSize: ".85rem" }}>
                <span>Requested: <strong>{formatCurrency(req.requestedAmount)}</strong></span>
                {req.approvedAmount != null && <span>Approved: <strong style={{ color: "#059669" }}>{formatCurrency(req.approvedAmount)}</strong></span>}
                {req.leadsGenerated != null && (
                  <span style={{ color: "#7c3aed" }}>
                    <TrendingUp size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 2 }} />
                    {req.leadsGenerated} leads · {formatCurrency(req.pipelineCreated || 0)} pipeline
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
