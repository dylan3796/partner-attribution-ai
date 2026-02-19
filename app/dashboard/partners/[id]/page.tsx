"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, MapPin, Edit, X, Save, Award, Shield, BookOpen, Star } from "lucide-react";
import { PARTNER_TYPE_LABELS, TIER_LABELS, TOUCHPOINT_LABELS, CERTIFICATION_LEVEL_LABELS, type CertificationLevel } from "@/lib/types";
import { usePlatformConfig } from "@/lib/platform-config";

function LoadingSkeleton() {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ height: 20, width: 120, background: "var(--border)", borderRadius: 4, marginBottom: "1.5rem" }} />
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--border)" }} />
          <div>
            <div style={{ height: 24, width: 180, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 20, width: 240, background: "var(--border)", borderRadius: 4 }} />
          </div>
        </div>
      </div>
      <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ height: 80 }}>
            <div style={{ height: 16, width: 100, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 28, width: 60, background: "var(--border)", borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const { isFeatureEnabled } = usePlatformConfig();
  const [editing, setEditing] = useState(false);

  // Convex queries
  const partnerData = useQuery(api.partners.getById, { id: id as Id<"partners"> });
  const updatePartner = useMutation(api.partners.update);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    commissionRate: 0,
    territory: "",
    notes: "",
  });

  // Update form when partner data loads
  useEffect(() => {
    if (partnerData) {
      setEditForm({
        name: partnerData.name || "",
        email: partnerData.email || "",
        commissionRate: partnerData.commissionRate || 0,
        territory: partnerData.territory || "",
        notes: partnerData.notes || "",
      });
    }
  }, [partnerData]);

  // Loading state
  if (partnerData === undefined) {
    return <LoadingSkeleton />;
  }

  // Not found state
  if (partnerData === null) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p className="muted" style={{ marginBottom: "1rem" }}>Partner not found.</p>
        <Link href="/dashboard/partners" className="btn-outline">← Back to partners</Link>
      </div>
    );
  }

  const partner = partnerData;
  const touchpoints = partner.touchpoints || [];
  const attributions = (partner.attributions || []).filter((a) => a.model === "role_based");
  const partnerPayouts = partner.payouts || [];
  const totalRevenue = attributions.reduce((s, a) => s + a.amount, 0);
  const totalCommission = attributions.reduce((s, a) => s + a.commissionAmount, 0);

  // For now, certs/badges/trainings/endorsements are not in Convex yet, so we'll show empty
  const showCerts = isFeatureEnabled("certifications");
  const activeCerts: any[] = [];
  const partnerBadges: any[] = [];
  const trainings: any[] = [];
  const endorsements: any[] = [];

  async function handleSaveEdit() {
    try {
      await updatePartner({
        id: id as Id<"partners">,
        name: editForm.name,
        email: editForm.email,
        commissionRate: editForm.commissionRate,
        territory: editForm.territory || undefined,
        notes: editForm.notes || undefined,
      });
      setEditing(false);
      toast("Partner updated successfully");
    } catch (err: any) {
      toast(err.message || "Failed to update partner", "error");
    }
  }

  return (
    <>
      <Link href="/dashboard/partners" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", marginBottom: "1.5rem", fontSize: ".9rem" }} className="muted"><ArrowLeft size={16} /> Back to partners</Link>

      {/* Header */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
            <div className="avatar" style={{ width: 56, height: 56, fontSize: "1.1rem" }}>{partner.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-.02em" }}>{partner.name}</h1>
              <div style={{ display: "flex", gap: ".75rem", marginTop: ".3rem", flexWrap: "wrap" }}>
                <span className="chip">{PARTNER_TYPE_LABELS[partner.type]}</span>
                <span className="badge badge-neutral">{partner.tier ? TIER_LABELS[partner.tier] : "No Tier"}</span>
                <span className={`badge badge-${partner.status === "active" ? "success" : partner.status === "pending" ? "info" : "danger"}`}>{partner.status}</span>
              </div>
            </div>
          </div>
          <button className="btn-outline" onClick={() => { setEditing(true); setEditForm({ name: partner.name, email: partner.email, commissionRate: partner.commissionRate, territory: partner.territory || "", notes: partner.notes || "" }); }}><Edit size={15} /> Edit Partner</button>
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
          <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{formatCurrencyCompact(totalRevenue)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Commission Earned</p>
          <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{formatCurrencyCompact(totalCommission)}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p className="muted" style={{ fontSize: ".8rem" }}>Touchpoints</p>
          <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{touchpoints.length}</p>
        </div>
      </div>

      {/* Certifications & Badges Section */}
      {showCerts && (activeCerts.length > 0 || partnerBadges.length > 0) && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
            <Award size={18} color="#6366f1" /> Certifications & Badges
          </h3>
          {/* Badges row */}
          {partnerBadges.length > 0 && (
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: activeCerts.length > 0 ? "1rem" : 0 }}>
              {partnerBadges.map((b: any) => (
                <span key={b._id} title={b.description} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 16, fontSize: ".8rem", fontWeight: 600, background: "var(--subtle)", border: "1px solid var(--border)" }}>
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          )}
          {/* Certs list */}
          {activeCerts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {activeCerts.map((c: any) => (
                <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem .75rem", borderRadius: 8, background: "var(--subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Shield size={14} color="#059669" />
                    <span style={{ fontWeight: 600, fontSize: ".85rem" }}>{c.name}</span>
                    <span className="muted" style={{ fontSize: ".75rem" }}>· {c.issuer}</span>
                  </div>
                  <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 700, background: c.level === "expert" ? "#ecfdf5" : c.level === "advanced" ? "#fef3c7" : "#dbeafe", color: c.level === "expert" ? "#065f46" : c.level === "advanced" ? "#92400e" : "#1e40af", textTransform: "uppercase" }}>
                    {CERTIFICATION_LEVEL_LABELS[c.level as CertificationLevel]}
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Training + Endorsement counts */}
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
            {trainings.length > 0 && (
              <span className="muted" style={{ fontSize: ".8rem", display: "flex", alignItems: "center", gap: 4 }}>
                <BookOpen size={13} /> {trainings.length} trainings completed
              </span>
            )}
            {endorsements.length > 0 && (
              <span className="muted" style={{ fontSize: ".8rem", display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={13} /> {endorsements.length} skill endorsements
              </span>
            )}
          </div>
        </div>
      )}

      <div className="dash-grid-2">
        {/* Activity Timeline */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1.2rem" }}>Activity Timeline</h3>
          <div className="timeline">
            {touchpoints.sort((a, b) => b.createdAt - a.createdAt).map((tp) => (
              <div key={tp._id} className="tl-item">
                <div className="tl-dot active"></div>
                <div>
                  <strong>{TOUCHPOINT_LABELS[tp.type as keyof typeof TOUCHPOINT_LABELS] || tp.type}</strong> — <Link href={`/dashboard/deals/${tp.dealId}`} style={{ fontWeight: 500 }}>{tp.deal?.name || tp.dealId}</Link>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, margin: 0 }}>Attribution (Role-Based)</h3>
              <Link href="/dashboard/deals" style={{ fontSize: ".78rem", color: "#6366f1", fontWeight: 600 }}>All Deals →</Link>
            </div>
            {attributions.map((a) => (
              <div key={a._id} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{a.deal?.name}</p>
                  <p className="muted" style={{ fontSize: ".75rem" }}>{a.percentage.toFixed(1)}% · {formatCurrency(a.amount)}</p>
                </div>
                <strong style={{ color: "#065f46" }}>{formatCurrency(a.commissionAmount)}</strong>
              </div>
            ))}
            {attributions.length === 0 && <p className="muted" style={{ fontSize: ".85rem" }}>No attributions yet.</p>}
          </div>

          {/* Payouts */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, margin: 0 }}>Payouts</h3>
              <Link href="/dashboard/payouts" style={{ fontSize: ".78rem", color: "#6366f1", fontWeight: 600 }}>View All →</Link>
            </div>
            {partnerPayouts.map((p) => (
              <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{p.period || "—"}</p>
                  <span className={`badge badge-${p.status === "paid" ? "success" : p.status === "approved" ? "info" : p.status.includes("pending") ? "neutral" : "danger"}`} style={{ fontSize: ".7rem" }}>{p.status.replace("_", " ")}</span>
                </div>
                <strong>{formatCurrency(p.amount)}</strong>
              </div>
            ))}
            {partnerPayouts.length === 0 && <p className="muted" style={{ fontSize: ".85rem" }}>No payouts yet.</p>}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setEditing(false)}>
          <div className="card animate-in" style={{ width: 500, maxWidth: "100%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Edit Partner</h2>
              <button onClick={() => setEditing(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Company Name</label><input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
              <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Email</label><input className="input" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Commission Rate %</label><input className="input" type="number" value={editForm.commissionRate} onChange={(e) => setEditForm({ ...editForm, commissionRate: Number(e.target.value) })} /></div>
                <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Territory</label><input className="input" value={editForm.territory} onChange={(e) => setEditForm({ ...editForm, territory: e.target.value })} /></div>
              </div>
              <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Notes</label><textarea className="input" rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} /></div>
              <button className="btn" style={{ width: "100%" }} onClick={handleSaveEdit}><Save size={15} /> Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
