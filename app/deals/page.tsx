"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function DealsPage() {
  // TODO: Replace with actual org ID from auth
  const orgId = "kjz7e8v9nh1n7q5j8h9k6m4r5s3t2u1v" as any;
  
  const pendingDeals = useQuery(api.deals.getPendingDealRegistrations, { organizationId: orgId });
  const allDeals = useQuery(api.deals.getAllDealRegistrations, { organizationId: orgId });

  const pending = allDeals?.filter((d) => d.registrationStatus === "pending") || [];
  const approved = allDeals?.filter((d) => d.registrationStatus === "approved") || [];
  const rejected = allDeals?.filter((d) => d.registrationStatus === "rejected") || [];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.02em" }}>Deal Registrations</h1>
        <p className="muted">Review and approve partner-submitted deals</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>Pending Approval</p>
          <p style={{ fontSize: "2rem", fontWeight: 800 }}>{pending.length}</p>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>Approved</p>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#065f46" }}>{approved.length}</p>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>Rejected</p>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#991b1b" }}>{rejected.length}</p>
        </div>
      </div>

      {/* Pending Deals Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "2rem" }}>
        <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Pending Approval</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
              <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Deal</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Value</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Contact</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Submitted</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((deal) => (
              <tr key={deal._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: ".8rem 1.2rem" }}>
                  <Link href={`/deals/${deal._id}`} style={{ fontWeight: 600 }}>{deal.name}</Link>
                  {deal.notes && <p className="muted" style={{ fontSize: ".75rem", marginTop: ".2rem" }}>{deal.notes}</p>}
                </td>
                <td style={{ padding: ".8rem" }}>
                  <span style={{ fontWeight: 600 }}>{deal.partner?.name || "Unknown"}</span>
                  <p className="muted" style={{ fontSize: ".75rem" }}>{deal.partner?.type}</p>
                </td>
                <td style={{ padding: ".8rem", fontWeight: 700 }}>{formatCurrency(deal.amount)}</td>
                <td style={{ padding: ".8rem" }}>
                  {deal.contactName && <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{deal.contactName}</p>}
                  {deal.contactEmail && <p className="muted" style={{ fontSize: ".75rem" }}>{deal.contactEmail}</p>}
                </td>
                <td style={{ padding: ".8rem" }}>
                  <p className="muted" style={{ fontSize: ".8rem" }}>{new Date(deal.createdAt).toLocaleDateString()}</p>
                </td>
                <td style={{ padding: ".8rem" }}>
                  <Link href={`/deals/${deal._id}`} className="btn" style={{ fontSize: ".8rem", padding: ".4rem .8rem" }}>Review</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pending.length === 0 && (
          <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No pending deal registrations</p>
        )}
      </div>

      {/* All Deals Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>All Deal Registrations</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
              <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Deal</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Value</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
              <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {allDeals?.map((deal) => (
              <tr key={deal._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: ".8rem 1.2rem" }}>
                  <Link href={`/deals/${deal._id}`} style={{ fontWeight: 600 }}>{deal.name}</Link>
                </td>
                <td style={{ padding: ".8rem", fontWeight: 600 }}>{deal.partner?.name || "Unknown"}</td>
                <td style={{ padding: ".8rem", fontWeight: 700 }}>{formatCurrency(deal.amount)}</td>
                <td style={{ padding: ".8rem" }}>
                  <span className={`badge badge-${
                    deal.registrationStatus === "approved" ? "success" :
                    deal.registrationStatus === "rejected" ? "danger" :
                    "info"
                  }`}>
                    {deal.registrationStatus}
                  </span>
                </td>
                <td style={{ padding: ".8rem" }}>
                  <p className="muted" style={{ fontSize: ".8rem" }}>{new Date(deal.createdAt).toLocaleDateString()}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
