"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Award, Search, Shield, BookOpen, Star, Users } from "lucide-react";
import { CERTIFICATION_LEVEL_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";

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
      {CERTIFICATION_LEVEL_LABELS[level as keyof typeof CERTIFICATION_LEVEL_LABELS] || level}
    </span>
  );
}

export default function CertificationsPage() {
  const { partners, certifications, badges, trainingCompletions, skillEndorsements } = useStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"certs" | "badges" | "training" | "endorsements">("certs");

  const activeCerts = certifications.filter(c => c.status === "active");
  const expiredCerts = certifications.filter(c => c.status === "expired");

  const partnerMap = useMemo(() => {
    const map = new Map<string, string>();
    partners.forEach(p => map.set(p._id, p.name));
    return map;
  }, [partners]);

  // Summary stats
  const stats = useMemo(() => ({
    totalCerts: certifications.length,
    activeCerts: activeCerts.length,
    totalBadges: badges.length,
    totalTrainings: trainingCompletions.length,
    totalEndorsements: skillEndorsements.length,
    avgTrainingScore: trainingCompletions.length > 0
      ? Math.round(trainingCompletions.reduce((s, t) => s + (t.score || 0), 0) / trainingCompletions.length)
      : 0,
  }), [certifications, activeCerts, badges, trainingCompletions, skillEndorsements]);

  const filteredCerts = certifications.filter(c => {
    if (!search) return true;
    const pName = partnerMap.get(c.partnerId) || "";
    return pName.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
  });

  const filteredBadges = badges.filter(b => {
    if (!search) return true;
    const pName = partnerMap.get(b.partnerId) || "";
    return pName.toLowerCase().includes(search.toLowerCase()) || b.name.toLowerCase().includes(search.toLowerCase());
  });

  const filteredTrainings = trainingCompletions.filter(t => {
    if (!search) return true;
    const pName = partnerMap.get(t.partnerId) || "";
    return pName.toLowerCase().includes(search.toLowerCase()) || t.courseName.toLowerCase().includes(search.toLowerCase());
  });

  const filteredEndorsements = skillEndorsements.filter(e => {
    if (!search) return true;
    const pName = partnerMap.get(e.partnerId) || "";
    return pName.toLowerCase().includes(search.toLowerCase()) || e.skill.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
            <Award size={24} style={{ display: "inline", verticalAlign: "-3px", marginRight: 8, color: "#6366f1" }} />
            Certifications & Badges
          </h1>
          <p className="muted">Partner learning ecosystem and skill tracking</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Active Certifications</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#059669" }}>{stats.activeCerts}</p>
          {expiredCerts.length > 0 && <p className="muted" style={{ fontSize: ".7rem" }}>{expiredCerts.length} expired</p>}
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Badges Earned</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#d97706" }}>{stats.totalBadges}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Trainings Completed</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0284c7" }}>{stats.totalTrainings}</p>
          <p className="muted" style={{ fontSize: ".7rem" }}>Avg score: {stats.avgTrainingScore}%</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Skill Endorsements</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#6366f1" }}>{stats.totalEndorsements}</p>
        </div>
      </div>

      {/* Tab Bar + Search */}
      <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", padding: "1rem 1.5rem" }}>
        <div style={{ display: "flex", gap: ".25rem", background: "var(--subtle)", borderRadius: 8, padding: 3 }}>
          {([
            { key: "certs", label: "Certifications", icon: <Shield size={14} /> },
            { key: "badges", label: "Badges", icon: <Star size={14} /> },
            { key: "training", label: "Training", icon: <BookOpen size={14} /> },
            { key: "endorsements", label: "Endorsements", icon: <Users size={14} /> },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "6px 12px", borderRadius: 6, fontSize: ".8rem", fontWeight: 600,
                border: "none", cursor: "pointer",
                background: tab === t.key ? "var(--bg)" : "transparent",
                color: tab === t.key ? "var(--fg)" : "var(--muted)",
                boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,.1)" : "none",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input className="input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
      </div>

      {/* Certifications Tab */}
      {tab === "certs" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                  <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Certification</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Issuer</th>
                  <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Level</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Earned</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Expiry</th>
                  <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.sort((a, b) => b.dateEarned - a.dateEarned).map(cert => (
                  <tr key={cert._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: ".8rem 1.2rem" }}>
                      <Link href={`/dashboard/partners/${cert.partnerId}`} style={{ fontWeight: 600 }}>
                        {partnerMap.get(cert.partnerId) || cert.partnerId}
                      </Link>
                    </td>
                    <td style={{ padding: ".8rem", fontWeight: 500 }}>{cert.name}</td>
                    <td style={{ padding: ".8rem" }} className="muted">{cert.issuer}</td>
                    <td style={{ padding: ".8rem", textAlign: "center" }}><LevelBadge level={cert.level} /></td>
                    <td style={{ padding: ".8rem", fontSize: ".85rem" }}>{formatDate(cert.dateEarned)}</td>
                    <td style={{ padding: ".8rem", fontSize: ".85rem" }} className="muted">{cert.expiryDate ? formatDate(cert.expiryDate) : "—"}</td>
                    <td style={{ padding: ".8rem", textAlign: "center" }}>
                      <span className={`badge badge-${cert.status === "active" ? "success" : "danger"}`}>{cert.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCerts.length === 0 && <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No certifications found.</p>}
        </div>
      )}

      {/* Badges Tab */}
      {tab === "badges" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {filteredBadges.sort((a, b) => b.earnedAt - a.earnedAt).map(badge => (
            <div key={badge._id} className="card" style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
              <div style={{ fontSize: "2rem", lineHeight: 1 }}>{badge.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{badge.name}</p>
                <p className="muted" style={{ fontSize: ".8rem", margin: "4px 0" }}>{badge.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <Link href={`/dashboard/partners/${badge.partnerId}`} style={{ fontSize: ".8rem", fontWeight: 500 }}>
                    {partnerMap.get(badge.partnerId)}
                  </Link>
                  <span className="chip" style={{ fontSize: ".7rem" }}>{badge.category}</span>
                </div>
                <p className="muted" style={{ fontSize: ".75rem", marginTop: 4 }}>{formatDate(badge.earnedAt)}</p>
              </div>
            </div>
          ))}
          {filteredBadges.length === 0 && <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No badges found.</p>}
        </div>
      )}

      {/* Training Tab */}
      {tab === "training" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                  <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Course</th>
                  <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Score</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainings.sort((a, b) => b.completedAt - a.completedAt).map(t => (
                  <tr key={t._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: ".8rem 1.2rem" }}>
                      <Link href={`/dashboard/partners/${t.partnerId}`} style={{ fontWeight: 600 }}>{partnerMap.get(t.partnerId)}</Link>
                    </td>
                    <td style={{ padding: ".8rem", fontWeight: 500 }}>{t.courseName}</td>
                    <td style={{ padding: ".8rem", textAlign: "center" }}>
                      {t.score != null && (
                        <span style={{ fontWeight: 700, color: t.score >= 90 ? "#059669" : t.score >= 70 ? "#0284c7" : "#d97706" }}>
                          {t.score}%
                        </span>
                      )}
                    </td>
                    <td style={{ padding: ".8rem", fontSize: ".85rem" }} className="muted">{formatDate(t.completedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTrainings.length === 0 && <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No training completions found.</p>}
        </div>
      )}

      {/* Endorsements Tab */}
      {tab === "endorsements" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                  <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Skill</th>
                  <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Level</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Endorsed By</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEndorsements.sort((a, b) => b.endorsedAt - a.endorsedAt).map(e => (
                  <tr key={e._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: ".8rem 1.2rem" }}>
                      <Link href={`/dashboard/partners/${e.partnerId}`} style={{ fontWeight: 600 }}>{partnerMap.get(e.partnerId)}</Link>
                    </td>
                    <td style={{ padding: ".8rem", fontWeight: 500 }}>{e.skill}</td>
                    <td style={{ padding: ".8rem", textAlign: "center" }}>
                      <span className={`badge badge-${e.level === "expert" ? "success" : e.level === "proficient" ? "info" : "neutral"}`}>
                        {e.level}
                      </span>
                    </td>
                    <td style={{ padding: ".8rem" }} className="muted">{e.endorsedBy}</td>
                    <td style={{ padding: ".8rem", fontSize: ".85rem" }} className="muted">{formatDate(e.endorsedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEndorsements.length === 0 && <p className="muted" style={{ padding: "2rem", textAlign: "center" }}>No endorsements found.</p>}
        </div>
      )}
    </>
  );
}
