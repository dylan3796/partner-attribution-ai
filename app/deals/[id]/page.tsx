"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as any;

  const deal = useQuery(api.deals.getDeal, { dealId });
  const approveDeal = useMutation(api.deals.approveDealRegistration);
  const rejectDeal = useMutation(api.deals.rejectDealRegistration);

  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (deal === undefined) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (deal === null) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p className="muted">Deal not found</p>
        <Link href="/deals" className="btn" style={{ marginTop: "1rem" }}>Back to Deals</Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await approveDeal({
        dealId,
        reviewerId: "sales_user_123", // TODO: Replace with actual user ID from auth
        notes,
      });
      router.push("/deals");
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("Failed to approve deal");
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setProcessing(true);
    try {
      await rejectDeal({
        dealId,
        reviewerId: "sales_user_123", // TODO: Replace with actual user ID from auth
        reason,
      });
      router.push("/deals");
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("Failed to reject deal");
      setProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/deals" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", color: "var(--muted)", fontSize: ".9rem", marginBottom: "1rem" }}>
          <ArrowLeft size={16} /> Back to Deals
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.02em" }}>{deal.name}</h1>
            <p className="muted">Deal Registration Review</p>
          </div>
          <span className={`badge badge-${
            deal.registrationStatus === "approved" ? "success" :
            deal.registrationStatus === "rejected" ? "danger" :
            "info"
          }`} style={{ fontSize: ".9rem", padding: ".5rem 1rem" }}>
            {deal.registrationStatus}
          </span>
        </div>
      </div>

      {/* Deal Info */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Deal Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Deal Value</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatCurrency(deal.amount)}</p>
          </div>
          <div>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Deal Status</p>
            <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>
              <span className={`badge badge-${deal.status === "won" ? "success" : deal.status === "lost" ? "danger" : "info"}`}>
                {deal.status}
              </span>
            </p>
          </div>
          <div>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Expected Close Date</p>
            <p style={{ fontWeight: 600 }}>{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "Not specified"}</p>
          </div>
          <div>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Submitted</p>
            <p style={{ fontWeight: 600 }}>{new Date(deal.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {deal.notes && (
          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>Notes from Partner</p>
            <p>{deal.notes}</p>
          </div>
        )}
      </div>

      {/* Partner Info */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Partner Information</h2>
        {deal.partner ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Partner Name</p>
              <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{deal.partner.name}</p>
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Partner Type</p>
              <p style={{ fontWeight: 600 }}>{deal.partner.type}</p>
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Partner Email</p>
              <p>{deal.partner.email}</p>
            </div>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Commission Rate</p>
              <p style={{ fontWeight: 600 }}>{deal.partner.commissionRate}%</p>
            </div>
          </div>
        ) : (
          <p className="muted">Partner information unavailable</p>
        )}
      </div>

      {/* Contact Info */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Contact Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Contact Name</p>
            <p style={{ fontWeight: 600 }}>{deal.contactName || "Not specified"}</p>
          </div>
          <div>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Contact Email</p>
            <p>{deal.contactEmail || "Not specified"}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {deal.registrationStatus === "pending" && (
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn" style={{ flex: 1, background: "#065f46", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }} onClick={() => setShowApprove(true)}>
            <Check size={18} /> Approve Deal
          </button>
          <button className="btn" style={{ flex: 1, background: "#991b1b", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }} onClick={() => setShowReject(true)}>
            <X size={18} /> Reject Deal
          </button>
        </div>
      )}

      {/* Approve Modal */}
      {showApprove && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowApprove(false)}>
          <div className="card" style={{ width: 480 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Approve Deal Registration</h2>
            <p className="muted" style={{ marginBottom: "1.5rem" }}>This will approve {deal.partner?.name}'s registration for "{deal.name}" and track their attribution.</p>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Notes (optional)</label>
              <textarea className="input" rows={3} placeholder="Add any notes for the partner..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => setShowApprove(false)} disabled={processing}>Cancel</button>
              <button className="btn" style={{ flex: 1, background: "#065f46", color: "white" }} onClick={handleApprove} disabled={processing}>
                {processing ? "Processing..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showReject && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowReject(false)}>
          <div className="card" style={{ width: 480 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Reject Deal Registration</h2>
            <p className="muted" style={{ marginBottom: "1.5rem" }}>Please provide a reason for rejecting this deal registration.</p>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Rejection Reason *</label>
              <textarea className="input" rows={3} placeholder="E.g., Deal already exists, incorrect information, duplicate registration..." value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => setShowReject(false)} disabled={processing}>Cancel</button>
              <button className="btn" style={{ flex: 1, background: "#991b1b", color: "white" }} onClick={handleReject} disabled={processing}>
                {processing ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
