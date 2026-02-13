"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, X } from "lucide-react";
import { formatCurrencyCompact as fmt } from "@/lib/utils";

export default function PortalDealsPage() {
  // Demo mode: empty state
  const myDeals: any[] = [];
  const registerDeal = async () => {
    setError("Demo mode: Deal registration is disabled. Request a demo to see this feature in action!");
  };

  const [showRegister, setShowRegister] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [regForm, setRegForm] = useState({
    companyName: "",
    estimatedValue: "",
    contactName: "",
    contactEmail: "",
    notes: "",
    expectedCloseDate: "",
  });

  const handleSubmit = async () => {
    setError("");
    try {
      await registerDeal({
        partnerId,
        organizationId: orgId,
        name: regForm.companyName,
        amount: Number(regForm.estimatedValue),
        contactName: regForm.contactName,
        contactEmail: regForm.contactEmail,
        notes: regForm.notes,
        expectedCloseDate: regForm.expectedCloseDate ? new Date(regForm.expectedCloseDate).getTime() : undefined,
      });
      setSubmitted(true);
      setRegForm({ companyName: "", estimatedValue: "", contactName: "", contactEmail: "", notes: "", expectedCloseDate: "" });
    } catch (err: any) {
      setError(err.message || "Failed to register deal");
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>My Deal Registrations</h1>
          <p className="muted">{myDeals?.length || 0} deals you&apos;ve registered</p>
        </div>
        <button className="btn" onClick={() => setShowRegister(true)}>
          <Plus size={15} /> Register a Deal
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
              <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Deal</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Value</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Registration</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {myDeals?.map((d) => (
              <tr key={d._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: ".8rem 1.2rem" }}>
                  <Link href={`/portal/deals/${d._id}`} style={{ fontWeight: 600 }}>{d.name}</Link>
                  {d.contactName && <p className="muted" style={{ fontSize: ".75rem" }}>{d.contactName}</p>}
                </td>
                <td style={{ padding: ".8rem", fontWeight: 700 }}>{fmt(d.amount)}</td>
                <td style={{ padding: ".8rem" }}>
                  <span className={`badge badge-${d.status === "won" ? "success" : d.status === "lost" ? "danger" : "info"}`}>
                    {d.status}
                  </span>
                </td>
                <td style={{ padding: ".8rem" }}>
                  <span className={`badge badge-${
                    d.registrationStatus === "approved" ? "success" :
                    d.registrationStatus === "rejected" ? "danger" :
                    "info"
                  }`}>
                    {d.registrationStatus || "pending"}
                  </span>
                </td>
                <td style={{ padding: ".8rem" }}>
                  <p className="muted" style={{ fontSize: ".8rem" }}>{new Date(d.createdAt).toLocaleDateString()}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myDeals?.length === 0 && (
          <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>
            No deals yet. Submit your first deal registration for approval!
          </p>
        )}
        {myDeals === undefined && (
          <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>Loading...</p>
        )}
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => { setShowRegister(false); setSubmitted(false); setError(""); }}
        >
          <div className="card" style={{ width: 480 }} onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>✅</p>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Deal Registered!</h2>
                <p className="muted">Your deal registration is pending approval. You'll be notified when it's reviewed.</p>
                <button className="btn" style={{ marginTop: "1.5rem" }} onClick={() => { setShowRegister(false); setSubmitted(false); }}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Register a Deal</h2>
                  <button onClick={() => { setShowRegister(false); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <X size={20} />
                  </button>
                </div>
                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", color: "#991b1b" }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Company Name *</label>
                    <input className="input" placeholder="Prospect company name" value={regForm.companyName} onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })} />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Estimated Deal Value *</label>
                    <input className="input" type="number" placeholder="50000" value={regForm.estimatedValue} onChange={(e) => setRegForm({ ...regForm, estimatedValue: e.target.value })} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Contact Name *</label>
                      <input className="input" placeholder="Decision maker" value={regForm.contactName} onChange={(e) => setRegForm({ ...regForm, contactName: e.target.value })} />
                    </div>
                    <div>
                      <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Contact Email *</label>
                      <input className="input" type="email" placeholder="email@company.com" value={regForm.contactEmail} onChange={(e) => setRegForm({ ...regForm, contactEmail: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Expected Close Date</label>
                    <input className="input" type="date" value={regForm.expectedCloseDate} onChange={(e) => setRegForm({ ...regForm, expectedCloseDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Notes</label>
                    <textarea className="input" rows={3} placeholder="How did you find this opportunity? Any context helps..." style={{ resize: "vertical" }} value={regForm.notes} onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}></textarea>
                  </div>
                  <button
                    className="btn"
                    style={{ width: "100%" }}
                    disabled={!regForm.companyName || !regForm.estimatedValue || !regForm.contactName || !regForm.contactEmail}
                    onClick={handleSubmit}
                  >
                    Submit Registration
                  </button>
                  <p className="muted" style={{ fontSize: ".8rem", textAlign: "center" }}>
                    Registrations are reviewed within 24 hours. Once approved, deals are tracked in the CRM and your attribution is recorded.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
