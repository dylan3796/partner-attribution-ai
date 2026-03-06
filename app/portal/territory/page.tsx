"use client";

import { usePortal } from "@/lib/portal-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MapPin, Building2, Shield, AlertTriangle } from "lucide-react";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div style={{ width: 200, height: 28, background: "var(--border)", borderRadius: 6 }} />
        <div style={{ width: 280, height: 16, background: "var(--border)", borderRadius: 4, marginTop: 8 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ height: 100 }}>
            <div style={{ width: "60%", height: 12, background: "var(--border)", borderRadius: 4, margin: "16px auto 8px" }} />
            <div style={{ width: "40%", height: 24, background: "var(--border)", borderRadius: 4, margin: "0 auto" }} />
          </div>
        ))}
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="card" style={{ height: 140 }}>
          <div style={{ width: "30%", height: 16, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
          <div style={{ width: "20%", height: 12, background: "var(--border)", borderRadius: 4, marginBottom: 16 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[1, 2, 3].map((j) => (
              <div key={j} style={{ height: 36, background: "var(--border)", borderRadius: 8 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PortalTerritoryPage() {
  const { partner } = usePortal();

  const partnerId = partner?.linkedPartnerIds?.[0] as Id<"partners"> | undefined;
  const data = useQuery(
    api.portalTerritories.getByPartner,
    partnerId ? { partnerId } : "skip"
  );

  if (!partner) return null;
  if (!data) return <Skeleton />;

  const { territories, conflicts, partners, dealsByAccount } = data;
  const activeConflicts = conflicts.filter(
    (c) => c.status === "open" || c.status === "under_review"
  );
  const totalAccounts = territories.reduce((s, t) => s + t.accounts.length, 0);

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
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{territories.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Building2 size={20} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Assigned Accounts</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{totalAccounts}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <AlertTriangle size={20} color={activeConflicts.length > 0 ? "#dc2626" : "#059669"} style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Active Conflicts</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: activeConflicts.length > 0 ? "#dc2626" : "#059669" }}>{activeConflicts.length}</p>
        </div>
      </div>

      {/* Conflict Alert */}
      {activeConflicts.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }}>
            <AlertTriangle size={20} color="#ef4444" />
            <p style={{ fontWeight: 700, color: "#ef4444" }}>Active Conflict{activeConflicts.length !== 1 ? "s" : ""}</p>
          </div>
          {activeConflicts.map((conflict) => {
            const otherPartnerNames = conflict.partnerIds
              .filter((pid) => pid !== partnerId)
              .map((pid) => partners.find((p) => p.id === pid)?.name || "Unknown");
            return (
              <div key={conflict._id} style={{ padding: ".5rem .75rem", borderRadius: 6, background: "rgba(255,255,255,0.05)", marginBottom: ".35rem", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: ".85rem" }}>
                  <strong>{conflict.accountName}</strong> — also claimed by {otherPartnerNames.join(", ")}
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
      {territories.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <MapPin size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
          <p className="muted">No territories assigned yet. Contact your partner manager.</p>
        </div>
      ) : (
        territories.map((terr) => {
          return (
            <div key={terr._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{terr.name}</h2>
                  <p className="muted" style={{ fontSize: ".85rem" }}>{terr.region}</p>
                </div>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  {terr.isExclusive && (
                    <span style={{ padding: ".2rem .6rem", borderRadius: 12, fontSize: ".75rem", fontWeight: 600, background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", gap: ".25rem" }}>
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
                      const hasConflict = activeConflicts.some((c) => c.accountName === acc);
                      const dealStatus = dealsByAccount?.[acc]?.status;
                      return (
                        <div
                          key={acc}
                          style={{
                            padding: ".65rem .85rem",
                            borderRadius: 8,
                            border: hasConflict ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border)",
                            background: hasConflict ? "rgba(239,68,68,0.06)" : "var(--subtle)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                            <Building2 size={14} color={hasConflict ? "#ef4444" : "var(--muted)"} />
                            <span style={{ fontWeight: 500, fontSize: ".9rem" }}>{acc}</span>
                          </div>
                          {hasConflict && (
                            <span style={{ padding: ".1rem .4rem", borderRadius: 8, fontSize: ".65rem", fontWeight: 600, background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                              Conflict
                            </span>
                          )}
                          {dealStatus && !hasConflict && (
                            <span className={`badge badge-${dealStatus === "won" ? "success" : dealStatus === "open" ? "info" : "danger"}`} style={{ fontSize: ".65rem" }}>
                              {dealStatus}
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
          );
        })
      )}
    </div>
  );
}
