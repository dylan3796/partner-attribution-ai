"use client";

import { usePortal } from "@/lib/portal-context";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { MapPin, Building2, Shield, AlertTriangle } from "lucide-react";

export default function PortalTerritoryPage() {
  const { partner } = usePortal();
  const { territories, channelConflicts, partners, deals } = useStore();

  if (!partner) return null;

  const linkedIds = partner.linkedPartnerIds;
  const myTerritories = territories.filter((t) => linkedIds.includes(t.partnerId));
  const myConflicts = channelConflicts.filter(
    (c) => c.partnerIds.some((pid) => linkedIds.includes(pid)) && (c.status === "open" || c.status === "under_review")
  );

  const totalAccounts = myTerritories.reduce((s, t) => s + t.accounts.length, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Your Territory</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>View your assigned territories and account list</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <MapPin size={20} color="#6366f1" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Territories</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{myTerritories.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Building2 size={20} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Assigned Accounts</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{totalAccounts}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <AlertTriangle size={20} color={myConflicts.length > 0 ? "#dc2626" : "#059669"} style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Active Conflicts</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: myConflicts.length > 0 ? "#dc2626" : "#059669" }}>{myConflicts.length}</p>
        </div>
      </div>

      {/* Conflict Alert */}
      {myConflicts.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fca5a5", background: "#fef2f2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }}>
            <AlertTriangle size={20} color="#991b1b" />
            <p style={{ fontWeight: 700, color: "#991b1b" }}>Active Conflict{myConflicts.length !== 1 ? "s" : ""}</p>
          </div>
          {myConflicts.map((conflict) => {
            const otherPartnerIds = conflict.partnerIds.filter((pid) => !linkedIds.includes(pid));
            const otherPartners = otherPartnerIds.map((pid) => partners.find((p) => p._id === pid)?.name || "Unknown");
            return (
              <div key={conflict._id} style={{ padding: ".5rem .75rem", borderRadius: 6, background: "rgba(255,255,255,0.7)", marginBottom: ".35rem" }}>
                <p style={{ fontSize: ".85rem" }}>
                  <strong>{conflict.accountName}</strong> — also claimed by {otherPartners.join(", ")}
                </p>
                <p className="muted" style={{ fontSize: ".75rem" }}>
                  Status: {conflict.status === "open" ? "Open — awaiting review" : "Under review"} · Reported {formatDate(conflict.reportedAt)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Territory Cards */}
      {myTerritories.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <MapPin size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
          <p className="muted">No territories assigned yet. Contact your partner manager.</p>
        </div>
      ) : (
        myTerritories.map((terr) => (
          <div key={terr._id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{terr.name}</h2>
                <p className="muted" style={{ fontSize: ".85rem" }}>{terr.region}</p>
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                {terr.isExclusive && (
                  <span style={{ padding: ".2rem .6rem", borderRadius: 12, fontSize: ".75rem", fontWeight: 600, background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe", display: "flex", alignItems: "center", gap: ".25rem" }}>
                    <Shield size={12} /> Exclusive
                  </span>
                )}
              </div>
            </div>

            {terr.accounts.length > 0 ? (
              <div>
                <p style={{ fontWeight: 600, fontSize: ".85rem", marginBottom: ".5rem" }}>Assigned Accounts ({terr.accounts.length})</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: ".5rem" }}>
                  {terr.accounts.map((acc) => {
                    const hasConflict = myConflicts.some((c) => c.accountName === acc);
                    const deal = deals.find((d) => d.name.includes(acc.split(" ")[0]));
                    return (
                      <div
                        key={acc}
                        style={{
                          padding: ".65rem .85rem",
                          borderRadius: 8,
                          border: hasConflict ? "1px solid #fca5a5" : "1px solid var(--border)",
                          background: hasConflict ? "#fef2f2" : "var(--subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                          <Building2 size={14} color={hasConflict ? "#991b1b" : "var(--muted)"} />
                          <span style={{ fontWeight: 500, fontSize: ".9rem" }}>{acc}</span>
                        </div>
                        {hasConflict && (
                          <span style={{ padding: ".1rem .4rem", borderRadius: 8, fontSize: ".65rem", fontWeight: 600, background: "#fee2e2", color: "#991b1b" }}>
                            Conflict
                          </span>
                        )}
                        {deal && !hasConflict && (
                          <span className={`badge badge-${deal.status === "won" ? "success" : deal.status === "open" ? "info" : "danger"}`} style={{ fontSize: ".65rem" }}>
                            {deal.status}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="muted" style={{ fontSize: ".85rem", fontStyle: "italic" }}>No specific accounts assigned to this territory yet</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
