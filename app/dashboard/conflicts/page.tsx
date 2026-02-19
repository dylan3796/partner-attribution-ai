"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  AlertTriangle,
  Shield,
  CheckCircle2,
  Users,
  Clock,
  Scale,
  TrendingUp,
} from "lucide-react";

type ConflictStatus = "open" | "under_review" | "resolved";

interface DetectedConflict {
  dealId: string;
  dealName: string;
  dealAmount: number;
  dealStatus: string;
  partnerIds: string[];
  partnerNames: string[];
  touchpointCount: number;
  createdAt: number;
  localStatus: ConflictStatus;
  resolution?: string;
  resolvedAt?: number;
}

function ConflictStatusBadge({ status }: { status: ConflictStatus }) {
  const colors: Record<ConflictStatus, { bg: string; fg: string }> = {
    open: { bg: "#fee2e2", fg: "#991b1b" },
    under_review: { bg: "#fef3c7", fg: "#92400e" },
    resolved: { bg: "#dcfce7", fg: "#166534" },
  };
  const labels: Record<ConflictStatus, string> = {
    open: "Open",
    under_review: "Under Review",
    resolved: "Resolved",
  };
  const c = colors[status] || colors.open;
  return (
    <span style={{ padding: ".2rem .65rem", borderRadius: 20, fontSize: ".75rem", fontWeight: 600, background: c.bg, color: c.fg }}>
      {labels[status]}
    </span>
  );
}

export default function ConflictsPage() {
  const partners = useQuery(api.partners.list) ?? [];
  const deals = useQuery(api.dealsCrud.list) ?? [];
  const dashboardStats = useQuery(api.dashboard.getRecentDeals) ?? [];
  
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | ConflictStatus>("all");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState<string>("assign_primary");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [primaryPartner, setPrimaryPartner] = useState("");
  
  // Track local resolution state (since we don't have a conflicts table)
  const [resolvedConflicts, setResolvedConflicts] = useState<Record<string, { status: ConflictStatus; resolution?: string; resolvedAt?: number }>>({});

  // Build partner lookup
  const partnerMap = useMemo(() => {
    const map = new Map<string, string>();
    partners.forEach(p => map.set(p._id, p.name));
    return map;
  }, [partners]);

  // Detect conflicts: deals where multiple partners are involved via registrations
  // A "conflict" is when we have deals that different partners registered, or deals with overlapping contact info
  const detectedConflicts = useMemo(() => {
    const conflicts: DetectedConflict[] = [];
    
    // Group deals by contact email to find potential duplicates/conflicts
    const dealsByContact = new Map<string, typeof deals>();
    deals.forEach(deal => {
      if (deal.contactEmail) {
        const key = deal.contactEmail.toLowerCase();
        const existing = dealsByContact.get(key) ?? [];
        existing.push(deal);
        dealsByContact.set(key, existing);
      }
    });

    // Find deals where multiple partners registered deals for the same contact
    dealsByContact.forEach((contactDeals, contactEmail) => {
      if (contactDeals.length > 1) {
        // Multiple deals for same contact = potential conflict
        const partnerIds = [...new Set(contactDeals.map(d => d.registeredBy).filter(Boolean))] as string[];
        
        if (partnerIds.length > 1) {
          // Multiple partners registered deals for the same contact
          contactDeals.forEach(deal => {
            const localState = resolvedConflicts[deal._id];
            conflicts.push({
              dealId: deal._id,
              dealName: deal.name,
              dealAmount: deal.amount,
              dealStatus: deal.status,
              partnerIds,
              partnerNames: partnerIds.map(id => partnerMap.get(id) || "Unknown"),
              touchpointCount: partnerIds.length,
              createdAt: deal.createdAt,
              localStatus: localState?.status || "open",
              resolution: localState?.resolution,
              resolvedAt: localState?.resolvedAt,
            });
          });
        }
      }
    });

    // Also flag deals where the same partner registered multiple times (edge case)
    // or deals that have pending registration status
    deals.forEach(deal => {
      if (deal.registrationStatus === "pending" && deal.registeredBy) {
        const alreadyInConflicts = conflicts.some(c => c.dealId === deal._id);
        if (!alreadyInConflicts) {
          const localState = resolvedConflicts[deal._id];
          // Check if there's another deal from a different partner for similar account
          const similarDeals = deals.filter(d => 
            d._id !== deal._id && 
            d.registeredBy && 
            d.registeredBy !== deal.registeredBy &&
            d.contactEmail?.toLowerCase() === deal.contactEmail?.toLowerCase()
          );
          
          if (similarDeals.length > 0) {
            const partnerIds = [deal.registeredBy, ...similarDeals.map(d => d.registeredBy!).filter(Boolean)];
            conflicts.push({
              dealId: deal._id,
              dealName: deal.name,
              dealAmount: deal.amount,
              dealStatus: deal.status,
              partnerIds,
              partnerNames: partnerIds.map(id => partnerMap.get(id) || "Unknown"),
              touchpointCount: partnerIds.length,
              createdAt: deal.createdAt,
              localStatus: localState?.status || "open",
              resolution: localState?.resolution,
              resolvedAt: localState?.resolvedAt,
            });
          }
        }
      }
    });

    return conflicts;
  }, [deals, partnerMap, resolvedConflicts]);

  const filtered = filter === "all" 
    ? detectedConflicts 
    : detectedConflicts.filter((c) => c.localStatus === filter);
    
  const openConflicts = detectedConflicts.filter((c) => c.localStatus === "open" || c.localStatus === "under_review");

  function handleResolve(conflict: DetectedConflict) {
    setResolvedConflicts(prev => ({
      ...prev,
      [conflict.dealId]: {
        status: "resolved",
        resolution: `${resolution}: ${resolutionNotes || "No notes"}`,
        resolvedAt: Date.now(),
      }
    }));
    toast(`Conflict for "${conflict.dealName}" resolved`);
    setResolvingId(null);
    setResolutionNotes("");
    setPrimaryPartner("");
  }

  function handleMarkUnderReview(conflict: DetectedConflict) {
    setResolvedConflicts(prev => ({
      ...prev,
      [conflict.dealId]: { status: "under_review" }
    }));
    toast(`Conflict for "${conflict.dealName}" marked as under review`);
  }

  // Stats
  const stats = {
    open: detectedConflicts.filter(c => c.localStatus === "open").length,
    underReview: detectedConflicts.filter(c => c.localStatus === "under_review").length,
    resolved: detectedConflicts.filter(c => c.localStatus === "resolved").length,
    totalDeals: deals.length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Channel Conflict Detection</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>Identify and resolve deals with multiple partner claims</p>
      </div>

      {/* Alerts */}
      {openConflicts.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fca5a5", background: "#fef2f2", display: "flex", alignItems: "center", gap: "1rem" }}>
          <AlertTriangle size={22} color="#991b1b" />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#991b1b" }}>{openConflicts.length} potential channel conflict{openConflicts.length !== 1 ? "s" : ""}</p>
            <p style={{ fontSize: ".85rem", color: "#b91c1c" }}>Deals with multiple partners claiming the same account. Review and resolve to avoid commission disputes.</p>
          </div>
        </div>
      )}

      {openConflicts.length === 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #86efac", background: "#dcfce7", display: "flex", alignItems: "center", gap: "1rem" }}>
          <CheckCircle2 size={22} color="#166534" />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#166534" }}>No active conflicts detected</p>
            <p style={{ fontSize: ".85rem", color: "#15803d" }}>All deals have clear partner assignments. Monitoring {deals.length} deals from {partners.length} partners.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <AlertTriangle size={22} color="#dc2626" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Open Conflicts</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#dc2626" }}>{stats.open}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Clock size={22} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Under Review</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#d97706" }}>{stats.underReview}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <CheckCircle2 size={22} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Resolved</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{stats.resolved}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <TrendingUp size={22} color="#6366f1" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Total Deals</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#6366f1" }}>{stats.totalDeals}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {(["all", "open", "under_review", "resolved"] as const).map((f) => {
          const labels: Record<string, string> = { all: "All", open: "Open", under_review: "Under Review", resolved: "Resolved" };
          const count = f === "all" ? detectedConflicts.length : detectedConflicts.filter(c => c.localStatus === f).length;
          return (
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
              }}
            >
              {labels[f]} ({count})
            </button>
          );
        })}
      </div>

      {/* Resolution Modal */}
      {resolvingId && (() => {
        const conflict = detectedConflicts.find((c) => c.dealId === resolvingId);
        if (!conflict) return null;
        return (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setResolvingId(null)}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 520, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
                <Scale size={20} style={{ display: "inline", verticalAlign: "-3px", marginRight: ".4rem" }} />
                Resolve Conflict: {conflict.dealName}
              </h2>
              <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
                Involved partners: {conflict.partnerNames.join(" vs ")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Resolution Type</label>
                  <select className="input" value={resolution} onChange={(e) => setResolution(e.target.value)}>
                    <option value="assign_primary">Assign Primary Partner</option>
                    <option value="split_credit">Split Credit</option>
                    <option value="dismissed">Dismiss — No Conflict</option>
                  </select>
                </div>
                {resolution === "assign_primary" && (
                  <div>
                    <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Primary Partner</label>
                    <select className="input" value={primaryPartner} onChange={(e) => setPrimaryPartner(e.target.value)}>
                      <option value="">Select partner...</option>
                      {conflict.partnerIds.map((pid) => (
                        <option key={pid} value={pid}>{partnerMap.get(pid) || pid}</option>
                      ))}
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
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Detected Conflicts & History</h2>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <Shield size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
            <p className="muted">No conflicts in this category</p>
            <p className="muted" style={{ fontSize: ".85rem", marginTop: ".5rem" }}>
              Conflicts are detected when multiple partners register deals for the same contact.
            </p>
          </div>
        ) : (
          filtered.map((conflict) => (
            <div key={conflict.dealId} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".25rem" }}>
                    <Link href={`/dashboard/deals/${conflict.dealId}`} style={{ fontWeight: 700, fontSize: "1rem" }}>
                      {conflict.dealName}
                    </Link>
                    <ConflictStatusBadge status={conflict.localStatus} />
                    <span className={`badge badge-${conflict.dealStatus === "won" ? "success" : conflict.dealStatus === "lost" ? "danger" : "info"}`}>
                      {conflict.dealStatus}
                    </span>
                  </div>
                  <p className="muted" style={{ fontSize: ".8rem" }}>
                    Deal value: {formatCurrency(conflict.dealAmount)} · Created: {formatDate(conflict.createdAt)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  {conflict.localStatus === "open" && (
                    <>
                      <button 
                        className="btn" 
                        style={{ fontSize: ".8rem", padding: ".35rem .75rem" }} 
                        onClick={() => { 
                          setResolvingId(conflict.dealId); 
                          setPrimaryPartner(""); 
                          setResolutionNotes(""); 
                          setResolution("assign_primary"); 
                        }}
                      >
                        Resolve
                      </button>
                      <button 
                        className="btn-outline" 
                        style={{ fontSize: ".8rem", padding: ".35rem .75rem" }} 
                        onClick={() => handleMarkUnderReview(conflict)}
                      >
                        Review
                      </button>
                    </>
                  )}
                  {conflict.localStatus === "under_review" && (
                    <button 
                      className="btn" 
                      style={{ fontSize: ".8rem", padding: ".35rem .75rem" }} 
                      onClick={() => { 
                        setResolvingId(conflict.dealId); 
                        setPrimaryPartner(""); 
                        setResolutionNotes(""); 
                        setResolution("assign_primary"); 
                      }}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Involved Partners */}
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                <Users size={15} color="var(--muted)" />
                <span className="muted" style={{ fontSize: ".8rem" }}>Claiming partners:</span>
                {conflict.partnerNames.map((name, i) => (
                  <span key={i}>
                    <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{name}</span>
                    {i < conflict.partnerNames.length - 1 && <span className="muted"> vs </span>}
                  </span>
                ))}
              </div>

              {/* Resolution */}
              {conflict.localStatus === "resolved" && conflict.resolution && (
                <div style={{ padding: ".75rem 1rem", borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                  <p style={{ fontWeight: 600, fontSize: ".85rem", color: "#065f46", marginBottom: ".25rem" }}>
                    Resolution: {conflict.resolution}
                  </p>
                  {conflict.resolvedAt && (
                    <p className="muted" style={{ fontSize: ".75rem", marginTop: ".25rem" }}>
                      Resolved on {formatDate(conflict.resolvedAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
