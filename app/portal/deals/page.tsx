"use client";
import { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/lib/portal-context";
import { Plus, X } from "lucide-react";

import { formatCurrencyCompact as fmt, formatCurrency } from "@/lib/utils";

export default function PortalDealsPage() {
  const { myDeals, myAttributions, partner, addDealRegistration } = usePortal();
  const [showRegister, setShowRegister] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regForm, setRegForm] = useState({ companyName: "", estimatedValue: "", contactName: "", contactEmail: "", notes: "" });

  return (
    <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>My Deals</h1>
            <p className="muted">{myDeals.length} deals you're involved in</p>
          </div>
          <button className="btn" onClick={() => setShowRegister(true)}><Plus size={15} /> Register a Deal</button>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Deal</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Value</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>My Attribution</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>My Commission</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myDeals.map((d) => {
                const attrib = myAttributions.find((a) => a.dealId === d._id);
                return (
                  <tr key={d._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: ".8rem 1.2rem" }}>
                      <Link href={`/portal/deals/${d._id}`} style={{ fontWeight: 600 }}>{d.name}</Link>
                      <p className="muted" style={{ fontSize: ".75rem" }}>{new Date(d.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td style={{ padding: ".8rem", fontWeight: 700 }}>{fmt(d.amount)}</td>
                    <td style={{ padding: ".8rem" }}>{attrib ? `${attrib.percentage.toFixed(1)}%` : <span className="muted">Pending</span>}</td>
                    <td style={{ padding: ".8rem", fontWeight: 600, color: "#065f46" }}>{attrib ? fmt(attrib.commissionAmount) : "—"}</td>
                    <td style={{ padding: ".8rem" }}><span className={`badge badge-${d.status === "won" ? "success" : d.status === "lost" ? "danger" : "info"}`}>{d.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {myDeals.length === 0 && <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No deals yet. Register your first deal!</p>}
        </div>

        {/* Register Modal */}
        {showRegister && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setShowRegister(false); setSubmitted(false); }}>
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
                    <button onClick={() => setShowRegister(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Company Name *</label><input className="input" placeholder="Prospect company name" value={regForm.companyName} onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })} /></div>
                    <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Estimated Deal Value *</label><input className="input" type="number" placeholder="50000" value={regForm.estimatedValue} onChange={(e) => setRegForm({ ...regForm, estimatedValue: e.target.value })} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Contact Name</label><input className="input" placeholder="Decision maker" value={regForm.contactName} onChange={(e) => setRegForm({ ...regForm, contactName: e.target.value })} /></div>
                      <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Contact Email</label><input className="input" type="email" placeholder="email@company.com" value={regForm.contactEmail} onChange={(e) => setRegForm({ ...regForm, contactEmail: e.target.value })} /></div>
                    </div>
                    <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Notes</label><textarea className="input" rows={3} placeholder="How did you find this opportunity? Any context helps..." style={{ resize: "vertical" }} value={regForm.notes} onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}></textarea></div>
                    <button className="btn" style={{ width: "100%" }} disabled={!regForm.companyName || !regForm.estimatedValue} onClick={() => { addDealRegistration({ companyName: regForm.companyName, estimatedValue: Number(regForm.estimatedValue), contactName: regForm.contactName, contactEmail: regForm.contactEmail, notes: regForm.notes, expectedCloseDate: "" }); setSubmitted(true); setRegForm({ companyName: "", estimatedValue: "", contactName: "", contactEmail: "", notes: "" }); }}>Submit Registration</button>
                    <p className="muted" style={{ fontSize: ".8rem", textAlign: "center" }}>Registrations are reviewed within 24 hours.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
    </>
  );
}
