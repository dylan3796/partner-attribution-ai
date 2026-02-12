"use client";
import { use, useState } from "react";
import Link from "next/link";
import { usePortal } from "@/lib/portal-context";
import { ArrowLeft, AlertTriangle, X } from "lucide-react";
import { TOUCHPOINT_LABELS } from "@/lib/types";

import { formatCurrencyCompact as fmt, formatCurrency } from "@/lib/utils";

export default function PortalDealDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { myDeals, myTouchpoints, myAttributions, addDispute } = usePortal();
  const [showDispute, setShowDispute] = useState(false);
  const [disputed, setDisputed] = useState(false);
  const [disputePercent, setDisputePercent] = useState("");
  const [disputeReason, setDisputeReason] = useState("");

  const deal = myDeals.find((d) => d._id === id);
  if (!deal) return <div style={{ textAlign: "center", padding: "3rem" }}><p className="muted">Deal not found.</p></div>;

  const touchpoints = myTouchpoints.filter((tp) => tp.dealId === id).sort((a, b) => a.createdAt - b.createdAt);
  const attribution = myAttributions.find((a) => a.dealId === id);

  return (
    <>
      <Link href="/portal/deals" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", marginBottom: "1.5rem", fontSize: ".9rem" }} className="muted"><ArrowLeft size={16} /> Back to deals</Link>

        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-.02em" }}>{deal.name}</h1>
              <div style={{ display: "flex", gap: ".5rem", marginTop: ".3rem", alignItems: "center" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 800 }}>{fmt(deal.amount)}</span>
                <span className={`badge badge-${deal.status === "won" ? "success" : deal.status === "lost" ? "danger" : "info"}`}>{deal.status}</span>
              </div>
            </div>
            {attribution && (
              <button className="btn-outline" style={{ color: "#92400e", borderColor: "#92400e", fontSize: ".85rem" }} onClick={() => setShowDispute(true)}>
                <AlertTriangle size={14} /> Dispute Attribution
              </button>
            )}
          </div>
          <p className="muted" style={{ marginTop: ".8rem" }}>Created {new Date(deal.createdAt).toLocaleDateString()} {deal.closedAt && `· Closed ${new Date(deal.closedAt).toLocaleDateString()}`}</p>
        </div>

        <div className="grid-2" style={{ gap: "1.5rem" }}>
          {/* Your Activity */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: "1.2rem" }}>Your Activity on This Deal</h3>
            <div className="timeline">
              {touchpoints.map((tp) => (
                <div key={tp._id} className="tl-item">
                  <div className="tl-dot active"></div>
                  <div>
                    <strong>{TOUCHPOINT_LABELS[tp.type]}</strong>
                    <br /><small className="muted">{new Date(tp.createdAt).toLocaleDateString()} {tp.notes && `· ${tp.notes}`}</small>
                  </div>
                </div>
              ))}
              {touchpoints.length === 0 && <p className="muted">No recorded touchpoints.</p>}
            </div>
          </div>

          {/* Attribution */}
          <div>
            {attribution ? (
              <div className="card" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Your Attribution</h3>
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <p style={{ fontSize: "2.5rem", fontWeight: 800 }}>{attribution.percentage.toFixed(1)}%</p>
                  <p className="muted">of deal credit</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", borderTop: "1px solid var(--border)" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{fmt(attribution.amount)}</p>
                    <p className="muted" style={{ fontSize: ".8rem" }}>Attributed Revenue</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#065f46" }}>{fmt(attribution.commissionAmount)}</p>
                    <p className="muted" style={{ fontSize: ".8rem" }}>Commission</p>
                  </div>
                </div>
                <details style={{ marginTop: "1rem" }}>
                  <summary className="muted" style={{ cursor: "pointer", fontSize: ".85rem" }}>How was this calculated?</summary>
                  <div style={{ padding: ".8rem", background: "var(--subtle)", borderRadius: 8, marginTop: ".5rem", fontSize: ".85rem" }}>
                    <p>Attribution was calculated using the <strong>Role-Based</strong> model, which assigns weight based on the type of activity:</p>
                    <ul style={{ marginTop: ".5rem", paddingLeft: "1.2rem" }}>
                      <li>Referral / Deal Registration: 30%</li>
                      <li>Demo / Proposal: 25%</li>
                      <li>Negotiation / Co-Sell: 20%</li>
                      <li>Introduction / Technical: 15%</li>
                      <li>Content Share: 10%</li>
                    </ul>
                    <p style={{ marginTop: ".5rem" }}>Your {touchpoints.length} touchpoints were weighted and divided by total activity on this deal.</p>
                  </div>
                </details>
              </div>
            ) : (
              <div className="card" style={{ background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                <p style={{ fontWeight: 600, marginBottom: ".3rem" }}>Attribution pending</p>
                <p className="muted" style={{ fontSize: ".85rem" }}>Attribution will be calculated when this deal closes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dispute Modal */}
        {showDispute && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setShowDispute(false); setDisputed(false); }}>
            <div className="card" style={{ width: 480 }} onClick={(e) => e.stopPropagation()}>
              {disputed ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>📋</p>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Dispute Submitted</h2>
                  <p className="muted">Your partner manager will review this within 48 hours.</p>
                  <button className="btn" style={{ marginTop: "1.5rem" }} onClick={() => { setShowDispute(false); setDisputed(false); }}>Done</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Dispute Attribution</h2>
                    <button onClick={() => setShowDispute(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                  </div>
                  <p className="muted" style={{ marginBottom: "1rem", fontSize: ".9rem" }}>Current attribution: <strong>{attribution?.percentage.toFixed(1)}%</strong> ({fmt(attribution?.commissionAmount || 0)} commission)</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>What % do you believe is correct?</label><input className="input" type="number" placeholder="45" value={disputePercent} onChange={(e) => setDisputePercent(e.target.value)} /></div>
                    <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Reason *</label><textarea className="input" rows={4} placeholder="Explain why you believe your attribution should be different. Include any supporting details..." style={{ resize: "vertical" }} value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}></textarea></div>
                    <button className="btn" style={{ width: "100%" }} disabled={!disputeReason} onClick={() => { addDispute({ dealId: id, dealName: deal.name, currentAttribution: attribution?.percentage || 0, requestedAttribution: parseFloat(disputePercent) || 0, reason: disputeReason }); setDisputed(true); }}>Submit Dispute</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
    </>
  );
}
