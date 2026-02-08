"use client";
import { use } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowLeft, Mail, Phone, MapPin, Edit } from "lucide-react";
import { PARTNER_TYPE_LABELS, TIER_LABELS, TOUCHPOINT_LABELS } from "@/lib/types";

function fmt(n: number) { return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`; }

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPartner, getTouchpointsByPartner, getAttributionsByPartner, payouts } = useStore();
  const partner = getPartner(id);
  if (!partner) return <div className="dash-layout"><div className="dash-content"><p>Partner not found.</p></div></div>;

  const touchpoints = getTouchpointsByPartner(id);
  const attributions = getAttributionsByPartner(id).filter((a) => a.model === "role_based");
  const partnerPayouts = payouts.filter((p) => p.partnerId === id);
  const totalRevenue = attributions.reduce((s, a) => s + a.amount, 0);
  const totalCommission = attributions.reduce((s, a) => s + a.commissionAmount, 0);

  return (
    <div className="dash-layout">
      <div className="dash-content">
        <Link href="/dashboard/partners" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", marginBottom: "1.5rem", fontSize: ".9rem" }} className="muted"><ArrowLeft size={16} /> Back to partners</Link>

        {/* Header */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
              <div className="avatar" style={{ width: 56, height: 56, fontSize: "1.1rem" }}>{partner.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
              <div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-.02em" }}>{partner.name}</h1>
                <div style={{ display: "flex", gap: ".5rem", marginTop: ".3rem", flexWrap: "wrap" }}>
                  <span className="chip">{PARTNER_TYPE_LABELS[partner.type]}</span>
                  <span className="badge badge-neutral">{partner.tier ? TIER_LABELS[partner.tier] : "No Tier"}</span>
                  <span className={`badge badge-${partner.status === "active" ? "success" : partner.status === "pending" ? "info" : "danger"}`}>{partner.status}</span>
                </div>
              </div>
            </div>
            <button className="btn-outline"><Edit size={15} /> Edit Partner</button>
          </div>
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
            <span className="muted" style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".85rem" }}><Mail size={14} /> {partner.email}</span>
            {partner.contactPhone && <span className="muted" style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".85rem" }}><Phone size={14} /> {partner.contactPhone}</span>}
            {partner.territory && <span className="muted" style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".85rem" }}><MapPin size={14} /> {partner.territory}</span>}
          </div>
          {partner.notes && <p className="muted" style={{ marginTop: ".8rem", fontSize: ".9rem", fontStyle: "italic" }}>{partner.notes}</p>}
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Commission Rate</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{partner.commissionRate}%</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Attributed Revenue</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{fmt(totalRevenue)}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Commission Earned</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{fmt(totalCommission)}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="muted" style={{ fontSize: ".8rem" }}>Touchpoints</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{touchpoints.length}</p>
          </div>
        </div>

        <div className="dash-grid-2">
          {/* Activity Timeline */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: "1.2rem" }}>Activity Timeline</h3>
            <div className="timeline">
              {touchpoints.sort((a, b) => b.createdAt - a.createdAt).map((tp) => (
                <div key={tp._id} className="tl-item">
                  <div className="tl-dot active"></div>
                  <div>
                    <strong>{TOUCHPOINT_LABELS[tp.type]}</strong> — <Link href={`/dashboard/deals/${tp.dealId}`} style={{ fontWeight: 500 }}>{tp.deal?.name || tp.dealId}</Link>
                    <br /><small className="muted">{new Date(tp.createdAt).toLocaleDateString()} {tp.notes && `· ${tp.notes}`}</small>
                  </div>
                </div>
              ))}
              {touchpoints.length === 0 && <p className="muted">No activity yet.</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Attributions */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Attribution (Role-Based)</h3>
              {attributions.map((a) => (
                <div key={a._id} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{a.deal?.name}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>{a.percentage.toFixed(1)}% · {fmt(a.amount)}</p>
                  </div>
                  <strong style={{ color: "#065f46" }}>{fmt(a.commissionAmount)}</strong>
                </div>
              ))}
              {attributions.length === 0 && <p className="muted" style={{ fontSize: ".85rem" }}>No attributions yet.</p>}
            </div>

            {/* Payouts */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Payouts</h3>
              {partnerPayouts.map((p) => (
                <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{p.period || "—"}</p>
                    <span className={`badge badge-${p.status === "paid" ? "success" : p.status === "approved" ? "info" : p.status.includes("pending") ? "neutral" : "danger"}`} style={{ fontSize: ".7rem" }}>{p.status.replace("_", " ")}</span>
                  </div>
                  <strong>{fmt(p.amount)}</strong>
                </div>
              ))}
              {partnerPayouts.length === 0 && <p className="muted" style={{ fontSize: ".85rem" }}>No payouts yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
