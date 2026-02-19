"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Award, Search, Shield, Users, Info } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Predefined certification types that partners can earn
const CERTIFICATION_TYPES = [
  { name: "Sales Fundamentals", level: "beginner", issuer: "Covant Academy" },
  { name: "Solution Selling", level: "intermediate", issuer: "Covant Academy" },
  { name: "Technical Integration", level: "advanced", issuer: "Covant Academy" },
  { name: "Enterprise Strategy", level: "expert", issuer: "Covant Academy" },
];

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    beginner: { bg: "#dbeafe", fg: "#1e40af" },
    intermediate: { bg: "#e0e7ff", fg: "#3730a3" },
    advanced: { bg: "#fef3c7", fg: "#92400e" },
    expert: { bg: "#ecfdf5", fg: "#065f46" },
  };
  const c = colors[level] || colors.beginner;
  return (
    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg, textTransform: "uppercase", letterSpacing: ".04em" }}>
      {level}
    </span>
  );
}

function TierBadge({ tier }: { tier?: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    platinum: { bg: "#e5e7eb", fg: "#1f2937" },
    gold: { bg: "#fef3c7", fg: "#92400e" },
    silver: { bg: "#f3f4f6", fg: "#4b5563" },
    bronze: { bg: "#fef2f2", fg: "#991b1b" },
  };
  const c = colors[tier || "bronze"] || colors.bronze;
  return (
    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg, textTransform: "uppercase" }}>
      {tier || "bronze"}
    </span>
  );
}

export default function CertificationsPage() {
  const partners = useQuery(api.partners.list) ?? [];
  const [search, setSearch] = useState("");

  const activePartners = partners.filter(p => p.status === "active");

  // Summary stats based on real partner data
  const stats = useMemo(() => ({
    totalPartners: partners.length,
    activePartners: activePartners.length,
    platinumTier: partners.filter(p => p.tier === "platinum").length,
    goldTier: partners.filter(p => p.tier === "gold").length,
  }), [partners, activePartners]);

  const filteredPartners = partners.filter(p => {
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
           p.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
            <Award size={24} style={{ display: "inline", verticalAlign: "-3px", marginRight: 8, color: "#6366f1" }} />
            Partner Certifications
          </h1>
          <p className="muted">Partner tiers and certification tracking</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div style={{ 
        padding: "1rem 1.25rem", 
        borderRadius: 10, 
        border: "1px solid #a5b4fc", 
        background: "#eef2ff", 
        display: "flex", 
        alignItems: "center", 
        gap: "1rem",
        marginBottom: "1.5rem"
      }}>
        <Info size={22} color="#4338ca" />
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#4338ca" }}>
            Full Certification Tracking Coming Soon
          </p>
          <p style={{ fontSize: ".85rem", color: "#6366f1" }}>
            Course completions, badges, and skill endorsements will be available in an upcoming release. 
            Partner tier data shown below is live from your database.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Total Partners</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#6366f1" }}>{stats.totalPartners}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Active Partners</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#059669" }}>{stats.activePartners}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Platinum Tier</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#4b5563" }}>{stats.platinumTier}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Gold Tier</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#d97706" }}>{stats.goldTier}</p>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", padding: "1rem 1.5rem" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input className="input" placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
      </div>

      {/* Partner Certification Status */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Users size={18} /> Partner Status & Tiers
          </h2>
          <span className="badge badge-info">{filteredPartners.length} partners</span>
        </div>
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Type</th>
                <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Tier</th>
                <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
                <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Territory</th>
                <th style={{ padding: ".8rem", textAlign: "right", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Commission</th>
                <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map(partner => (
                <tr key={partner._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: ".8rem 1.2rem" }}>
                    <Link href={`/dashboard/partners/${partner._id}`} style={{ fontWeight: 600 }}>
                      {partner.name}
                    </Link>
                    <p className="muted" style={{ fontSize: ".75rem" }}>{partner.email}</p>
                  </td>
                  <td style={{ padding: ".8rem" }}>
                    <span className="chip" style={{ fontSize: ".75rem", textTransform: "capitalize" }}>{partner.type}</span>
                  </td>
                  <td style={{ padding: ".8rem", textAlign: "center" }}>
                    <TierBadge tier={partner.tier} />
                  </td>
                  <td style={{ padding: ".8rem", textAlign: "center" }}>
                    <span className={`badge badge-${partner.status === "active" ? "success" : partner.status === "pending" ? "warning" : "danger"}`}>
                      {partner.status}
                    </span>
                  </td>
                  <td style={{ padding: ".8rem" }} className="muted">
                    {partner.territory || "—"}
                  </td>
                  <td style={{ padding: ".8rem", textAlign: "right", fontWeight: 600 }}>
                    {partner.commissionRate}%
                  </td>
                  <td style={{ padding: ".8rem 1.2rem", fontSize: ".85rem" }} className="muted">
                    {formatDate(partner.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPartners.length === 0 && (
          <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No partners found.</p>
        )}
      </div>

      {/* Available Certifications */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <Shield size={18} /> Available Certifications
        </h2>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
          These certifications will be trackable per partner in a future release.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {CERTIFICATION_TYPES.map((cert, i) => (
            <div key={i} style={{ padding: "1rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
                <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{cert.name}</p>
                <LevelBadge level={cert.level} />
              </div>
              <p className="muted" style={{ fontSize: ".8rem" }}>Issued by: {cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
