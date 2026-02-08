"use client";

import { useState } from "react";
import { X, AlertTriangle, Upload } from "lucide-react";
import { usePortal } from "@/lib/portal-context";

type Props = {
  dealId: string;
  dealName: string;
  currentAttribution: number;
  onClose: () => void;
};

export default function DisputeModal({ dealId, dealName, currentAttribution, onClose }: Props) {
  const { addDispute } = usePortal();
  const [requestedPct, setRequestedPct] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDispute({
      dealId,
      dealName,
      currentAttribution,
      requestedAttribution: parseFloat(requestedPct) || currentAttribution,
      reason,
    });
    setSubmitted(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={18} color="#991b1b" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Dispute Attribution</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Request a review of your attribution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: 6,
            }}
          >
            <X size={20} color="var(--muted)" />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Dispute Submitted</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Your partner manager will review this within 2-3 business days. You'll receive an email update.
            </p>
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Deal info */}
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "var(--subtle)",
                borderRadius: 8,
                marginBottom: "1.25rem",
              }}
            >
              <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Deal</p>
              <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{dealName}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                Current attribution: <strong style={{ color: "var(--fg)" }}>{currentAttribution.toFixed(1)}%</strong>
              </p>
            </div>

            {/* Requested % */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                What should your attribution be?
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g. 40"
                  value={requestedPct}
                  onChange={(e) => setRequestedPct(e.target.value)}
                  required
                  style={{ maxWidth: 120 }}
                />
                <span style={{ color: "var(--muted)", fontWeight: 500 }}>%</span>
              </div>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                Why do you believe your attribution should be different?
              </label>
              <textarea
                className="input"
                rows={4}
                placeholder="Describe your contributions to this deal, any touchpoints that may have been missed, and any supporting evidence..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            {/* File upload placeholder */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                Supporting documentation (optional)
              </label>
              <div
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: 8,
                  padding: "1.5rem",
                  textAlign: "center",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                <Upload size={20} style={{ margin: "0 auto 0.5rem" }} />
                <p style={{ fontSize: "0.85rem" }}>Click to upload or drag and drop</p>
                <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>PDF, DOC, or images up to 10MB</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button type="button" className="btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn" style={{ background: "#991b1b" }}>
                Submit Dispute
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
