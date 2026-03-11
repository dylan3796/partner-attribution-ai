"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Award, Search, Shield, Users, Plus, X, Trash2, CheckCircle2,
  Clock, AlertTriangle, BookOpen, Code, Briefcase, FileCheck,
  ChevronDown, RotateCcw, Star,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// ─── Types ───

type CertLevel = "beginner" | "intermediate" | "advanced" | "expert";
type CertCategory = "sales" | "technical" | "product" | "compliance";
type Tier = "bronze" | "silver" | "gold" | "platinum";

// ─── Badge Components ───

function LevelBadge({ level }: { level: CertLevel }) {
  const colors: Record<CertLevel, { bg: string; fg: string }> = {
    beginner: { bg: "rgba(59,130,246,0.15)", fg: "#60a5fa" },
    intermediate: { bg: "rgba(99,102,241,0.15)", fg: "#818cf8" },
    advanced: { bg: "rgba(245,158,11,0.15)", fg: "#fbbf24" },
    expert: { bg: "rgba(16,185,129,0.15)", fg: "#34d399" },
  };
  const c = colors[level];
  return (
    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg, textTransform: "uppercase", letterSpacing: ".04em" }}>
      {level}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    platinum: { bg: "rgba(148,163,184,0.15)", fg: "#94a3b8" },
    gold: { bg: "rgba(245,158,11,0.15)", fg: "#fbbf24" },
    silver: { bg: "rgba(148,163,184,0.15)", fg: "#cbd5e1" },
    bronze: { bg: "rgba(180,83,9,0.15)", fg: "#d97706" },
  };
  const c = colors[tier] || colors.bronze;
  return (
    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg, textTransform: "uppercase" }}>
      {tier}
    </span>
  );
}

function CategoryIcon({ category }: { category: CertCategory }) {
  const icons: Record<CertCategory, typeof Briefcase> = {
    sales: Briefcase,
    technical: Code,
    product: BookOpen,
    compliance: FileCheck,
  };
  const Icon = icons[category] || BookOpen;
  return <Icon size={16} />;
}

function StatusBadge({ status, expiresAt }: { status: string; expiresAt?: number }) {
  const now = Date.now();
  const isExpiringSoon = status === "completed" && expiresAt && expiresAt - now < 30 * 24 * 60 * 60 * 1000 && expiresAt > now;

  if (isExpiringSoon) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 700, background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
        <AlertTriangle size={10} /> Expiring Soon
      </span>
    );
  }
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    completed: { bg: "rgba(16,185,129,0.15)", fg: "#34d399", label: "Completed" },
    in_progress: { bg: "rgba(59,130,246,0.15)", fg: "#60a5fa", label: "In Progress" },
    expired: { bg: "rgba(107,114,128,0.15)", fg: "#9ca3af", label: "Expired" },
    revoked: { bg: "rgba(239,68,68,0.15)", fg: "#f87171", label: "Revoked" },
  };
  const s = map[status] || map.expired;
  return (
    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 700, background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

// ─── Main Page ───

export default function CertificationsPage() {
  const certs = useQuery(api.certifications.list) ?? [];
  const records = useQuery(api.certifications.listPartnerCerts) ?? [];
  const stats = useQuery(api.certifications.getStats);
  const partners = useQuery(api.partners.list) ?? [];

  const createCert = useMutation(api.certifications.create);
  const updateCert = useMutation(api.certifications.update);
  const removeCert = useMutation(api.certifications.remove);
  const awardCert = useMutation(api.certifications.award);
  const revokeCert = useMutation(api.certifications.revoke);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"programs" | "awarded">("programs");
  const [showCreate, setShowCreate] = useState(false);
  const [showAward, setShowAward] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CertCategory | "all">("all");

  // Create form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    level: "beginner" as CertLevel,
    category: "sales" as CertCategory,
    requiredForTier: "" as string,
    validityMonths: "",
  });

  // Award form state
  const [awardForm, setAwardForm] = useState({
    partnerId: "" as string,
    certificationId: "" as string,
    score: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  // Build lookup maps
  const certMap = useMemo(() => {
    const m: Record<string, typeof certs[0]> = {};
    for (const c of certs) m[c._id] = c;
    return m;
  }, [certs]);

  const partnerMap = useMemo(() => {
    const m: Record<string, typeof partners[0]> = {};
    for (const p of partners) m[p._id] = p;
    return m;
  }, [partners]);

  // Filter programs
  const filteredCerts = certs.filter((c) => {
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Filter awarded certs
  const filteredRecords = records.filter((r) => {
    if (search) {
      const cert = certMap[r.certificationId];
      const partner = partnerMap[r.partnerId];
      const text = `${cert?.name || ""} ${partner?.name || ""}`.toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => b.createdAt - a.createdAt);

  // Handlers
  async function handleCreate() {
    setSaving(true);
    try {
      await createCert({
        name: form.name,
        description: form.description || undefined,
        level: form.level,
        category: form.category,
        requiredForTier: form.requiredForTier ? form.requiredForTier as Tier : undefined,
        validityMonths: form.validityMonths ? parseInt(form.validityMonths) : undefined,
      });
      setForm({ name: "", description: "", level: "beginner", category: "sales", requiredForTier: "", validityMonths: "" });
      setShowCreate(false);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  async function handleAward() {
    if (!awardForm.partnerId || !awardForm.certificationId) return;
    setSaving(true);
    try {
      await awardCert({
        partnerId: awardForm.partnerId as Id<"partners">,
        certificationId: awardForm.certificationId as Id<"certifications">,
        score: awardForm.score ? parseInt(awardForm.score) : undefined,
        notes: awardForm.notes || undefined,
      });
      setAwardForm({ partnerId: "", certificationId: "", score: "", notes: "" });
      setShowAward(false);
    } catch (e: any) {
      alert(e.message || "Failed to award certification");
    }
    setSaving(false);
  }

  async function handleDelete(id: Id<"certifications">) {
    if (!confirm("Delete this certification program? All partner records for it will also be removed.")) return;
    await removeCert({ id });
  }

  async function handleRevoke(id: Id<"partnerCertifications">) {
    if (!confirm("Revoke this certification?")) return;
    await revokeCert({ id });
  }

  async function handleArchive(id: Id<"certifications">, current: string) {
    await updateCert({ id, status: current === "active" ? "archived" : "active" });
  }

  const activeCerts = certs.filter((c) => c.status === "active");
  const isLoading = stats === undefined;

  // ─── Skeleton ───
  if (isLoading) {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ width: 280, height: 28, background: "var(--subtle)", borderRadius: 8, marginBottom: 8 }} />
            <div style={{ width: 200, height: 16, background: "var(--border)", borderRadius: 6 }} />
          </div>
        </div>
        <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ textAlign: "center", padding: "1.25rem" }}>
              <div style={{ width: 80, height: 12, background: "var(--border)", borderRadius: 4, margin: "0 auto 8px" }} />
              <div style={{ width: 40, height: 28, background: "var(--subtle)", borderRadius: 6, margin: "0 auto" }} />
            </div>
          ))}
        </div>
        <div className="card" style={{ minHeight: 200 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ width: 40, height: 40, background: "var(--border)", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: 180, height: 14, background: "var(--subtle)", borderRadius: 4, marginBottom: 6 }} />
                <div style={{ width: 120, height: 10, background: "var(--border)", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
            <Award size={24} style={{ display: "inline", verticalAlign: "-3px", marginRight: 8, color: "#6366f1" }} />
            Partner Certifications
          </h1>
          <p className="muted">Create programs, award certifications, track partner enablement</p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn btn-secondary" onClick={() => setShowAward(true)} disabled={activeCerts.length === 0 || partners.length === 0}>
            <CheckCircle2 size={14} /> Award Cert
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> New Program
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="card" style={{ textAlign: "center", padding: "1.25rem" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Programs</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#6366f1" }}>{stats.activePrograms}</p>
          {stats.totalPrograms > stats.activePrograms && (
            <p className="muted" style={{ fontSize: ".7rem" }}>{stats.totalPrograms - stats.activePrograms} archived</p>
          )}
        </div>
        <div className="card" style={{ textAlign: "center", padding: "1.25rem" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Certifications Awarded</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10b981" }}>{stats.completedCount}</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "1.25rem" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Partner Coverage</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f59e0b" }}>
            {stats.totalPartners > 0 ? Math.round((stats.partnerCoverage / stats.totalPartners) * 100) : 0}%
          </p>
          <p className="muted" style={{ fontSize: ".7rem" }}>{stats.partnerCoverage} of {stats.totalPartners} partners</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "1.25rem" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Expiring Soon</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: stats.expiringCount > 0 ? "#ef4444" : "#6b7280" }}>
            {stats.expiringCount}
          </p>
          <p className="muted" style={{ fontSize: ".7rem" }}>within 30 days</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", padding: "1rem 1.5rem" }}>
        <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
          {(["programs", "awarded"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 16px",
                fontSize: ".85rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: tab === t ? "#6366f1" : "transparent",
                color: tab === t ? "var(--bg)" : "var(--muted)",
              }}
            >
              {t === "programs" ? "Programs" : "Awarded"}
              {t === "awarded" && records.length > 0 && (
                <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 8, fontSize: ".7rem", background: tab === t ? "rgba(255,255,255,0.2)" : "rgba(99,102,241,0.15)", color: tab === t ? "var(--bg)" : "#818cf8" }}>
                  {records.filter((r) => r.status === "completed").length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input className="input" placeholder={tab === "programs" ? "Search programs..." : "Search awarded..."} value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        {tab === "programs" && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CertCategory | "all")}
            className="input"
            style={{ width: "auto", minWidth: 120 }}
          >
            <option value="all">All Categories</option>
            <option value="sales">Sales</option>
            <option value="technical">Technical</option>
            <option value="product">Product</option>
            <option value="compliance">Compliance</option>
          </select>
        )}
      </div>

      {/* Programs Tab */}
      {tab === "programs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {filteredCerts.length === 0 && (
            <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
              <Award size={40} style={{ margin: "0 auto 1rem", color: "var(--muted)", opacity: 0.5 }} />
              <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: ".5rem" }}>No certification programs yet</p>
              <p className="muted" style={{ marginBottom: "1rem" }}>Create your first certification program to start tracking partner enablement.</p>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                <Plus size={14} /> Create Program
              </button>
            </div>
          )}
          {filteredCerts.map((cert) => {
            const awarded = records.filter((r) => r.certificationId === cert._id && r.status === "completed").length;
            const isArchived = cert.status === "archived";
            return (
              <div
                key={cert._id}
                className="card"
                style={{
                  padding: "1.25rem",
                  opacity: isArchived ? 0.6 : 1,
                  position: "relative",
                  borderLeft: `3px solid ${cert.category === "sales" ? "#6366f1" : cert.category === "technical" ? "#10b981" : cert.category === "product" ? "#f59e0b" : "#ef4444"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                    <CategoryIcon category={cert.category} />
                    <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{cert.name}</h3>
                  </div>
                  <div style={{ display: "flex", gap: ".25rem" }}>
                    <button
                      onClick={() => handleArchive(cert._id, cert.status)}
                      title={isArchived ? "Restore" : "Archive"}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--muted)" }}
                    >
                      {isArchived ? <RotateCcw size={14} /> : <Shield size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id)}
                      title="Delete"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--muted)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {cert.description && (
                  <p className="muted" style={{ fontSize: ".85rem", marginBottom: ".75rem", lineHeight: 1.4 }}>{cert.description}</p>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: ".75rem" }}>
                  <LevelBadge level={cert.level} />
                  <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 600, background: "var(--subtle)", color: "var(--muted)", textTransform: "capitalize" }}>
                    {cert.category}
                  </span>
                  {isArchived && (
                    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 600, background: "rgba(107,114,128,0.15)", color: "#9ca3af" }}>
                      Archived
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: ".75rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div>
                      <p className="muted" style={{ fontSize: ".7rem" }}>Awarded</p>
                      <p style={{ fontWeight: 700, fontSize: ".9rem" }}>{awarded}</p>
                    </div>
                    <div>
                      <p className="muted" style={{ fontSize: ".7rem" }}>Validity</p>
                      <p style={{ fontWeight: 700, fontSize: ".9rem" }}>
                        {cert.validityMonths ? `${cert.validityMonths}mo` : "∞"}
                      </p>
                    </div>
                    {cert.requiredForTier && (
                      <div>
                        <p className="muted" style={{ fontSize: ".7rem" }}>Required for</p>
                        <TierBadge tier={cert.requiredForTier} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Awarded Tab */}
      {tab === "awarded" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <Users size={18} /> Partner Certification Records
            </h2>
            <span className="badge badge-info">{filteredRecords.length} records</span>
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <CheckCircle2 size={40} style={{ margin: "0 auto 1rem", color: "var(--muted)", opacity: 0.5 }} />
              <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: ".5rem" }}>No certifications awarded yet</p>
              <p className="muted" style={{ marginBottom: "1rem" }}>Award certifications to partners to track their enablement progress.</p>
              <button className="btn btn-primary" onClick={() => setShowAward(true)} disabled={activeCerts.length === 0}>
                <CheckCircle2 size={14} /> Award Certification
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                    <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                    <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Certification</th>
                    <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Level</th>
                    <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
                    <th style={{ padding: ".8rem", textAlign: "center", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Score</th>
                    <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Completed</th>
                    <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Expires</th>
                    <th style={{ padding: ".8rem 1.2rem", textAlign: "right", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    const cert = certMap[record.certificationId];
                    const partner = partnerMap[record.partnerId];
                    return (
                      <tr key={record._id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: ".8rem 1.2rem" }}>
                          {partner ? (
                            <>
                              <Link href={`/dashboard/partners/${record.partnerId}`} style={{ fontWeight: 600 }}>
                                {partner.name}
                              </Link>
                              <p className="muted" style={{ fontSize: ".75rem" }}>{partner.type}</p>
                            </>
                          ) : (
                            <span className="muted">Unknown</span>
                          )}
                        </td>
                        <td style={{ padding: ".8rem" }}>
                          <span style={{ fontWeight: 600 }}>{cert?.name || "Deleted"}</span>
                          {cert && (
                            <p className="muted" style={{ fontSize: ".75rem", textTransform: "capitalize" }}>{cert.category}</p>
                          )}
                        </td>
                        <td style={{ padding: ".8rem", textAlign: "center" }}>
                          {cert && <LevelBadge level={cert.level} />}
                        </td>
                        <td style={{ padding: ".8rem", textAlign: "center" }}>
                          <StatusBadge status={record.status} expiresAt={record.expiresAt} />
                        </td>
                        <td style={{ padding: ".8rem", textAlign: "center" }}>
                          {record.score !== undefined ? (
                            <span style={{ fontWeight: 700, color: record.score >= 80 ? "#34d399" : record.score >= 60 ? "#fbbf24" : "#f87171" }}>
                              {record.score}%
                            </span>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>
                        <td style={{ padding: ".8rem", fontSize: ".85rem" }} className="muted">
                          {record.completedAt ? formatDate(record.completedAt) : "—"}
                        </td>
                        <td style={{ padding: ".8rem", fontSize: ".85rem" }} className="muted">
                          {record.expiresAt ? formatDate(record.expiresAt) : "Never"}
                        </td>
                        <td style={{ padding: ".8rem 1.2rem", textAlign: "right" }}>
                          {record.status === "completed" && (
                            <button
                              onClick={() => handleRevoke(record._id)}
                              title="Revoke"
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--muted)" }}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Program Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setShowCreate(false)} />
          <div className="card" style={{ position: "relative", width: "100%", maxWidth: 500, padding: "2rem", margin: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.2rem" }}>Create Certification Program</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Program Name *</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sales Fundamentals" style={{ width: "100%" }} />
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Description</label>
                <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What partners learn in this program..." rows={3} style={{ width: "100%", resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Level</label>
                  <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as CertLevel })} style={{ width: "100%" }}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Category</label>
                  <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CertCategory })} style={{ width: "100%" }}>
                    <option value="sales">Sales</option>
                    <option value="technical">Technical</option>
                    <option value="product">Product</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Required for Tier</label>
                  <select className="input" value={form.requiredForTier} onChange={(e) => setForm({ ...form, requiredForTier: e.target.value })} style={{ width: "100%" }}>
                    <option value="">None</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Valid for (months)</label>
                  <input className="input" type="number" value={form.validityMonths} onChange={(e) => setForm({ ...form, validityMonths: e.target.value })} placeholder="∞" style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", marginTop: "1.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!form.name || saving}>
                {saving ? "Creating..." : "Create Program"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Certification Modal */}
      {showAward && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setShowAward(false)} />
          <div className="card" style={{ position: "relative", width: "100%", maxWidth: 500, padding: "2rem", margin: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.2rem" }}>Award Certification</h2>
              <button onClick={() => setShowAward(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Partner *</label>
                <select className="input" value={awardForm.partnerId} onChange={(e) => setAwardForm({ ...awardForm, partnerId: e.target.value })} style={{ width: "100%" }}>
                  <option value="">Select partner...</option>
                  {partners.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Certification *</label>
                <select className="input" value={awardForm.certificationId} onChange={(e) => setAwardForm({ ...awardForm, certificationId: e.target.value })} style={{ width: "100%" }}>
                  <option value="">Select certification...</option>
                  {activeCerts.map((c) => (
                    <option key={c._id} value={c._id}>{c.name} ({c.level})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Score (0-100)</label>
                  <input className="input" type="number" min={0} max={100} value={awardForm.score} onChange={(e) => setAwardForm({ ...awardForm, score: e.target.value })} placeholder="Optional" style={{ width: "100%" }} />
                </div>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Notes</label>
                  <input className="input" value={awardForm.notes} onChange={(e) => setAwardForm({ ...awardForm, notes: e.target.value })} placeholder="Optional notes..." style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", marginTop: "1.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setShowAward(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAward} disabled={!awardForm.partnerId || !awardForm.certificationId || saving}>
                {saving ? "Awarding..." : "Award Certification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
