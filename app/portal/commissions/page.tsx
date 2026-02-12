"use client";
import { usePortal } from "@/lib/portal-context";
import { Download } from "lucide-react";

import { formatCurrencyCompact as fmt, formatCurrency } from "@/lib/utils";

export default function PortalCommissionsPage() {
  const { myAttributions, myPayouts, stats } = usePortal();

  const paidTotal = myPayouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.commissionAmount, 0);
  const pendingTotal = myPayouts.filter((p) => p.status !== "paid").reduce((s, p) => s + p.commissionAmount, 0);
  const totalEarned = myAttributions.reduce((s, a) => s + a.commissionAmount, 0);

  return (
    <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Commissions</h1>
            <p className="muted">Track your earnings and payout status</p>
          </div>
          <button className="btn-outline" onClick={() => {
            const header = "Deal,Deal Value,Attribution %,Commission";
            const rows = myAttributions.map((a) => `"${a.deal?.name || ""}",${a.deal?.amount || 0},${a.percentage.toFixed(1)},${a.commissionAmount}`);
            const csv = [header, ...rows].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `commissions-${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(url);
          }}><Download size={15} /> Export</button>
        </div>

        {/* Summary */}
        <div className="grid-3" style={{ marginBottom: "2rem", gap: "1.5rem" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Total Commission Earned</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#065f46" }}>{fmt(totalEarned)}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Paid Out</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{fmt(paidTotal)}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Pending</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#92400e" }}>{fmt(pendingTotal)}</p>
          </div>
        </div>

        {/* Commission Details */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Commission by Deal</h3>
          <div style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: ".8rem 0", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Deal</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Deal Value</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Attribution</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Commission</th>
                </tr>
              </thead>
              <tbody>
                {myAttributions.map((a) => (
                  <tr key={a._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: ".8rem 0", fontWeight: 600 }}>{a.deal?.name}</td>
                    <td style={{ padding: ".8rem" }}>{fmt(a.deal?.amount || 0)}</td>
                    <td style={{ padding: ".8rem" }}>{a.percentage.toFixed(1)}%</td>
                    <td style={{ padding: ".8rem", fontWeight: 700, color: "#065f46" }}>{fmt(a.commissionAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myAttributions.length === 0 && <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No commissions yet. When deals you&apos;ve influenced close in the CRM, commissions are calculated automatically.</p>}
          </div>
        </div>

        {/* Payout History */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Payout History</h3>
          {myPayouts.map((p, i) => (
            <div key={p.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".8rem 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>{p.dealName || "Payout"}</p>
                <p className="muted" style={{ fontSize: ".8rem" }}>{p.paidAt ? `Paid ${new Date(p.paidAt).toLocaleDateString()}` : new Date(p.date).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 700 }}>{fmt(p.commissionAmount)}</p>
                <span className={`badge badge-${p.status === "paid" ? "success" : p.status === "approved" ? "info" : "neutral"}`} style={{ fontSize: ".7rem" }}>{p.status.replace("_", " ")}</span>
              </div>
            </div>
          ))}
          {myPayouts.length === 0 && <p className="muted" style={{ textAlign: "center", padding: "1.5rem" }}>No payouts yet.</p>}
        </div>

        {/* How it works */}
        <div className="card" style={{ marginTop: "1.5rem", background: "var(--subtle)" }}>
          <h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>How are commissions calculated?</h3>
          <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>Your commission is based on your <strong>attributed revenue</strong> multiplied by your <strong>commission rate</strong>. When a deal closes in the CRM, attribution is calculated using the Role-Based model, which weights different types of partner activity. The more impact you have on a deal (referrals, demos, proposals), the higher your attribution percentage.</p>
        </div>
    </>
  );
}
