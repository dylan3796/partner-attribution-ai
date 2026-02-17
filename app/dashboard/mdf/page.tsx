"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  DollarSign,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Megaphone,
  Eye,
  Settings2,
} from "lucide-react";
import type { MDFRequest, MDFStatus } from "@/lib/types";
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

export default function MDFPage() {
  const { mdfBudgets, mdfRequests, updateMDFRequest, partners } = useStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | MDFStatus>("all");
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = filter === "all" ? mdfRequests : mdfRequests.filter((r) => r.status === filter);
  const totalAllocated = mdfBudgets.reduce((s, b) => s + b.allocatedAmount, 0);
  const totalSpent = mdfBudgets.reduce((s, b) => s + b.spentAmount, 0);
  const totalRemaining = mdfBudgets.reduce((s, b) => s + b.remainingAmount, 0);
  const pendingRequests = mdfRequests.filter((r) => r.status === "pending");
  const totalLeads = mdfRequests.reduce((s, r) => s + (r.leadsGenerated || 0), 0);
  const totalPipeline = mdfRequests.reduce((s, r) => s + (r.pipelineCreated || 0), 0);

  const detail = detailId ? mdfRequests.find((r) => r._id === detailId) : null;

  function handleApprove(req: MDFRequest) {
    updateMDFRequest(req._id, { status: "approved", approvedAmount: req.requestedAmount, reviewedBy: "Admin User", reviewedAt: Date.now() });
    toast(`MDF request "${req.title}" approved`);
  }

  function handleReject(req: MDFRequest) {
    updateMDFRequest(req._id, { status: "rejected", reviewedBy: "Admin User", reviewedAt: Date.now() });
    toast(`MDF request "${req.title}" rejected`, "error");
  }

  function handleMarkPaid(req: MDFRequest) {
    updateMDFRequest(req._id, { status: "paid", paidAt: Date.now() });
    toast(`MDF payment processed for "${req.title}"`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Market Development Funds</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Manage MDF budgets, requests, and campaign performance</p>
        </div>
        <Link href="/dashboard/mdf/setup" className="btn-outline" style={{ fontSize: ".875rem" }}>
          <Settings2 size={15} /> Setup Program
        </Link>
      </div>

      {/* MDF Overview Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <DollarSign size={22} color="#4338ca" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Total Allocated</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800 }}>{formatCurrency(totalAllocated)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <FileCheck size={22} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Total Spent</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>{formatCurrency(totalSpent)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <DollarSign size={22} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Remaining</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d97706" }}>{formatCurrency(totalRemaining)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Megaphone size={22} color="#7c3aed" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Leads Generated</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#7c3aed" }}>{totalLeads}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <TrendingUp size={22} color="#0284c7" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Pipeline Created</p>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0284c7" }}>{formatCurrency(totalPipeline)}</p>
        </div>
      </div>

      {/* Budget by Partner */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Partner MDF Budgets</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {mdfBudgets.map((budget) => {
            const partner = partners.find((p) => p._id === budget.partnerId);
            const utilization = budget.allocatedAmount > 0 ? (budget.spentAmount / budget.allocatedAmount) * 100 : 0;
            return (
              <div key={budget._id} style={{ padding: "1rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
                  <p style={{ fontWeight: 600, fontSize: ".9rem" }}>{partner?.name || "Unknown"}</p>
                  <span className="muted" style={{ fontSize: ".75rem" }}>{budget.period}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem", marginBottom: ".4rem" }}>
                  <span>Spent: {formatCurrency(budget.spentAmount)}</span>
                  <span>of {formatCurrency(budget.allocatedAmount)}</span>
                </div>
                <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${utilization}%`, height: "100%", background: utilization > 80 ? "#dc2626" : utilization > 50 ? "#d97706" : "#059669", borderRadius: 4 }} />
                </div>
                <p style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: ".35rem" }}>
                  {formatCurrency(budget.remainingAmount)} remaining · {Math.round(utilization)}% utilized
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Alert */}
      {pendingRequests.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fbbf24", background: "#fffbeb", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Clock size={20} color="#92400e" />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: ".9rem", color: "#78350f" }}>{pendingRequests.length} MDF request{pendingRequests.length !== 1 ? "s" : ""} pending approval</p>
            <p style={{ fontSize: ".8rem", color: "#92400e" }}>Review and approve partner marketing campaigns</p>
          </div>
        </div>
      )}

      {/* Request Filters */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {(["all", "pending", "approved", "executed", "paid", "rejected"] as const).map((f) => (
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

      {/* MDF Request Detail Modal */}
      {detail && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setDetailId(null)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 640, width: "90%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: ".25rem" }}>{detail.title}</h2>
                <p className="muted" style={{ fontSize: ".85rem" }}>{partners.find((p) => p._id === detail.partnerId)?.name}</p>
              </div>
              <StatusBadge status={detail.status} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div><p className="muted" style={{ fontSize: ".75rem" }}>Campaign Type</p><p style={{ fontWeight: 600 }}>{MDF_CAMPAIGN_LABELS[detail.campaignType]}</p></div>
              <div><p className="muted" style={{ fontSize: ".75rem" }}>Requested Amount</p><p style={{ fontWeight: 600 }}>{formatCurrency(detail.requestedAmount)}</p></div>
              {detail.approvedAmount != null && <div><p className="muted" style={{ fontSize: ".75rem" }}>Approved Amount</p><p style={{ fontWeight: 600, color: "#059669" }}>{formatCurrency(detail.approvedAmount)}</p></div>}
              <div><p className="muted" style={{ fontSize: ".75rem" }}>Campaign Dates</p><p style={{ fontWeight: 600 }}>{formatDate(detail.startDate)} – {formatDate(detail.endDate)}</p></div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".25rem" }}>Description</p>
              <p style={{ fontSize: ".9rem", lineHeight: 1.6 }}>{detail.description}</p>
            </div>

            {(detail.leadsGenerated || detail.pipelineCreated || detail.revenueInfluenced) && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", borderRadius: 10, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                <p style={{ fontWeight: 700, fontSize: ".9rem", color: "#065f46", marginBottom: ".5rem" }}>Campaign Performance</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem" }}>
                  <div><p style={{ fontSize: ".75rem", color: "#065f46" }}>Leads</p><p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#059669" }}>{detail.leadsGenerated || 0}</p></div>
                  <div><p style={{ fontSize: ".75rem", color: "#065f46" }}>Pipeline</p><p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#059669" }}>{formatCurrency(detail.pipelineCreated || 0)}</p></div>
                  <div><p style={{ fontSize: ".75rem", color: "#065f46" }}>Revenue</p><p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#059669" }}>{formatCurrency(detail.revenueInfluenced || 0)}</p></div>
                </div>
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
              {(detail.status === "approved" || detail.status === "executed") && (
                <button className="btn" onClick={() => { handleMarkPaid(detail); setDetailId(null); }}>
                  <DollarSign size={16} /> Mark as Paid
                </button>
              )}
              <button className="btn-outline" onClick={() => setDetailId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MDF Requests Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: ".75rem 1.5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Request</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Partner</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Type</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Amount</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "center", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Status</th>
              <th style={{ padding: ".75rem .5rem", textAlign: "center", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Performance</th>
              <th style={{ padding: ".75rem 1.5rem", textAlign: "center", fontSize: ".8rem", fontWeight: 600, color: "var(--muted)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => {
              const partner = partners.find((p) => p._id === req.partnerId);
              return (
                <tr key={req._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: ".75rem 1.5rem" }}>
                    <p style={{ fontWeight: 600, fontSize: ".9rem" }}>{req.title}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>{formatDate(req.submittedAt)}</p>
                  </td>
                  <td style={{ padding: ".75rem .5rem", fontSize: ".9rem" }}>{partner?.name || "Unknown"}</td>
                  <td style={{ padding: ".75rem .5rem", fontSize: ".85rem" }}>{MDF_CAMPAIGN_LABELS[req.campaignType]}</td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "right", fontWeight: 600 }}>
                    {formatCurrency(req.approvedAmount || req.requestedAmount)}
                  </td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "center" }}>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ padding: ".75rem .5rem", textAlign: "center", fontSize: ".8rem" }}>
                    {req.leadsGenerated ? (
                      <span style={{ color: "#059669", fontWeight: 600 }}>{req.leadsGenerated} leads · {formatCurrency(req.pipelineCreated || 0)}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td style={{ padding: ".75rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
                      <button className="btn-outline" style={{ fontSize: ".75rem", padding: ".25rem .5rem" }} onClick={() => setDetailId(req._id)}>
                        <Eye size={13} /> View
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
