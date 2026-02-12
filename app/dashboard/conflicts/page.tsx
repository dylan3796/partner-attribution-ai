"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  AlertTriangle,
  Shield,
  MapPin,
  CheckCircle2,
  Users,
  ArrowUpRight,
  Clock,
  Scale,
} from "lucide-react";
import type { ChannelConflict, Territory } from "@/lib/types";
import { CONFLICT_STATUS_LABELS, CONFLICT_RESOLUTION_LABELS } from "@/lib/types";

function ConflictStatusBadge({ status }: { status: ChannelConflict["status"] }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    open: { bg: "#fee2e2", fg: "#991b1b" },
    under_review: { bg: "#fef3c7", fg: "#92400e" },
    resolved: { bg: "#dcfce7", fg: "#166534" },
    escalated: { bg: "#fce7f3", fg: "#9d174d" },
  };
  const c = colors[status] || colors.open;
  return (
    <span style={{ padding: ".2rem .65rem", borderRadius: 20, fontSize: ".75rem", fontWeight: 600, background: c.bg, color: c.fg }}>
      {CONFLICT_STATUS_LABELS[status]}
    </span>
  );
}

export default function ConflictsPage() {
  const { channelConflicts, updateConflict, territories, partners, deals } = useStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | ChannelConflict["status"]>("all");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState<string>("assign_primary");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [primaryPartner, setPrimaryPartner] = useState("");

  const filtered = filter === "all" ? channelConflicts : channelConflicts.filter((c) => c.status === filter);
  const openConflicts = channelConflicts.filter((c) => c.status === "open" || c.status === "under_review");

  function handleResolve(conflict: ChannelConflict) {
    updateConflict(conflict._id, {
      status: "resolved",
      resolution: resolution as ChannelConflict["resolution"],
      resolutionNotes,
      primaryPartnerId: primaryPartner || undefined,
      resolvedBy: "Admin User",
      resolvedAt: Date.now(),
    });
    toast(`Conflict for "${conflict.accountName}" resolved`);
    setResolvingId(null);
    setResolutionNotes("");
    setPrimaryPartner("");
  }

  function handleEscalate(conflict: ChannelConflict) {
    updateConflict(conflict._id, { status: "escalated" });
    toast(`Conflict for "${conflict.accountName}" escalated`, "error");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Channel Conflict Detection</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>Territory management, conflict resolution, and audit trail</p>
      </div>

      {/* Alerts */}
      {openConflicts.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fca5a5", background: "#fef2f2", display: "flex", alignItems: "center", gap: "1rem" }}>
          <AlertTriangle size={22} color="#991b1b" />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#991b1b" }}>{openConflicts.length} unresolved channel conflict{openConflicts.length !== 1 ? "s" : ""}</p>
            <p style={{ fontSize: ".85rem", color: "#b91c1c" }}>Multiple partners claiming the same accounts. Review and resolve to avoid deal friction.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <AlertTriangle size={22} color="#dc2626" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Open Conflicts</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#dc2626" }}>{channelConflicts.filter((c) => c.status === "open").length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Clock size={22} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Under Review</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#d97706" }}>{channelConflicts.filter((c) => c.status === "under_review").length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <CheckCircle2 size={22} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Resolved</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{channelConflicts.filter((c) => c.status === "resolved").length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <MapPin size={22} color="#6366f1" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Territories</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#6366f1" }}>{territories.length}</p>
        </div>
      </div>

      {/* Territory Map */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <MapPin size={18} /> Territory Assignments
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {territories.map((terr) => {
            const partner = partners.find((p) => p._id === terr.partnerId);
            const hasConflict = channelConflicts.some(
              (c) => (c.status === "open" || c.status === "under_review") && c.partnerIds.includes(terr.partnerId)
            );
            return (
              <div
                key={terr._id}
                style={{
                  padding: "1rem",
                  borderRadius: 10,
                  border: hasConflict ? "2px solid #fca5a5" : "1px solid var(--border)",
                  background: hasConflict ? "#fef2f2" : "var(--subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
                  <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{terr.name}</p>
                  <div style={{ display: "flex", gap: ".35rem", alignItems: "center" }}>
                    {terr.isExclusive && (
                      <span style={{ padding: ".15rem .5rem", borderRadius: 12, fontSize: ".7rem", fontWeight: 600, background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe" }}>
                        Exclusive
                      </span>
                    )}
                    {hasConflict && (
                      <span style={{ padding: ".15rem .5rem", borderRadius: 12, fontSize: ".7rem", fontWeight: 600, background: "#fee2e2", color: "#991b1b" }}>
                        ⚠️ Conflict
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".5rem" }}>{terr.region} · {partner?.name || "Unassigned"}</p>
                {terr.accounts.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
                    {terr.accounts.map((acc) => (
                      <span key={acc} style={{ padding: ".15rem .5rem", borderRadius: 6, fontSize: ".75rem", background: "var(--bg)", border: "1px solid var(--border)" }}>
                        {acc}
                      </span>
                    ))}
                  </div>
                )}
                {terr.accounts.length === 0 && (
                  <p className="muted" style={{ fontSize: ".8rem", fontStyle: "italic" }}>No accounts assigned yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {(["all", "open", "under_review", "resolved", "escalated"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: ".4rem .8rem",
              borderRadius: 6,
              border: filter === f ? "2px solid #6366f1" : "1px solid var(--border)",
              background: filter === f ? "#eef2ff" : "var(--bg)",
              color: filter === f ? "#4338ca" : "var(--fg)",
              fontSize: ".8rem",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? `All (${channelConflicts.length})` : `${CONFLICT_STATUS_LABELS[f] || f} (${channelConflicts.filter((c) => c.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Resolution Modal */}
      {resolvingId && (() => {
        const conflict = channelConflicts.find((c) => c._id === resolvingId);
        if (!conflict) return null;
        return (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setResolvingId(null)}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 520, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
                <Scale size={20} style={{ display: "inline", verticalAlign: "-3px", marginRight: ".4rem" }} />
                Resolve Conflict: {conflict.accountName}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Resolution Type</label>
                  <select className="input" value={resolution} onChange={(e) => setResolution(e.target.value)}>
                    <option value="assign_primary">Assign Primary Partner</option>
                    <option value="split_credit">Split Credit</option>
                    <option value="escalated">Escalate to Management</option>
                    <option value="dismissed">Dismiss</option>
                  </select>
                </div>
                {resolution === "assign_primary" && (
                  <div>
                    <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Primary Partner</label>
                    <select className="input" value={primaryPartner} onChange={(e) => setPrimaryPartner(e.target.value)}>
                      <option value="">Select partner...</option>
                      {conflict.partnerIds.map((pid) => {
                        const p = partners.find((pr) => pr._id === pid);
                        return <option key={pid} value={pid}>{p?.name || pid}</option>;
                      })}
                    </select>
                  </div>
                )}
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Resolution Notes</label>
                  <textarea
                    className="input"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={3}
                    placeholder="Explain the resolution decision..."
                    style={{ resize: "vertical" }}
                  />
                </div>
                <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
                  <button className="btn-outline" onClick={() => setResolvingId(null)}>Cancel</button>
                  <button className="btn" onClick={() => handleResolve(conflict)}>Resolve Conflict</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Conflicts List */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Conflict History & Active Cases</h2>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <Shield size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
            <p className="muted">No conflicts in this category</p>
          </div>
        ) : (
          filtered.map((conflict) => {
            const involvedPartners = conflict.partnerIds.map((pid) => partners.find((p) => p._id === pid));
            const primaryPartnerObj = conflict.primaryPartnerId ? partners.find((p) => p._id === conflict.primaryPartnerId) : null;
            const deal = conflict.dealId ? deals.find((d) => d._id === conflict.dealId) : null;

            return (
              <div key={conflict._id} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".25rem" }}>
                      <p style={{ fontWeight: 700, fontSize: "1rem" }}>{conflict.accountName}</p>
                      <ConflictStatusBadge status={conflict.status} />
                    </div>
                    {deal && <p className="muted" style={{ fontSize: ".8rem" }}>Deal: {deal.name}</p>}
                    <p className="muted" style={{ fontSize: ".8rem" }}>Reported: {formatDate(conflict.reportedAt)}</p>
                  </div>
                  <div style={{ display: "flex", gap: ".5rem" }}>
                    {(conflict.status === "open" || conflict.status === "under_review") && (
                      <>
                        <button className="btn" style={{ fontSize: ".8rem", padding: ".35rem .75rem" }} onClick={() => { setResolvingId(conflict._id); setPrimaryPartner(""); setResolutionNotes(""); setResolution("assign_primary"); }}>
                          Resolve
                        </button>
                        <button className="btn-outline" style={{ fontSize: ".8rem", padding: ".35rem .75rem", borderColor: "#fca5a5", color: "#991b1b" }} onClick={() => handleEscalate(conflict)}>
                          Escalate
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Involved Partners */}
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                  <Users size={15} color="var(--muted)" />
                  <span className="muted" style={{ fontSize: ".8rem" }}>Involved:</span>
                  {involvedPartners.map((p, i) => (
                    <span key={p?._id || i}>
                      <span style={{ fontSize: ".85rem", fontWeight: 600, color: p?._id === conflict.primaryPartnerId ? "#059669" : "var(--fg)" }}>
                        {p?.name || "Unknown"}
                        {p?._id === conflict.primaryPartnerId && " ★"}
                      </span>
                      {i < involvedPartners.length - 1 && <span className="muted"> vs </span>}
                    </span>
                  ))}
                </div>

                {/* Resolution */}
                {conflict.status === "resolved" && conflict.resolution && (
                  <div style={{ padding: ".75rem 1rem", borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                    <p style={{ fontWeight: 600, fontSize: ".85rem", color: "#065f46", marginBottom: ".25rem" }}>
                      Resolution: {CONFLICT_RESOLUTION_LABELS[conflict.resolution]}
                    </p>
                    {conflict.resolutionNotes && <p style={{ fontSize: ".85rem", color: "#065f46" }}>{conflict.resolutionNotes}</p>}
                    {primaryPartnerObj && <p style={{ fontSize: ".8rem", color: "#059669", marginTop: ".25rem" }}>Primary: {primaryPartnerObj.name}</p>}
                    <p className="muted" style={{ fontSize: ".75rem", marginTop: ".25rem" }}>Resolved by {conflict.resolvedBy} on {formatDate(conflict.resolvedAt!)}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
