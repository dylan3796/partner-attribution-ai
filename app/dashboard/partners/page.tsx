"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { Plus, Download, Upload, Search, X, Shield, Award, Loader2 } from "lucide-react";
import { exportPartnersCSV, parsePartnersCSV } from "@/lib/csv";
import { PARTNER_TYPE_LABELS, TIER_LABELS } from "@/lib/types";
import type { Partner } from "@/lib/types";
import { ConfigTipBox } from "@/components/ui/config-tooltip";
import { usePlatformConfig } from "@/lib/platform-config";
import { getActiveCertCount, getBadgeCount } from "@/lib/certifications-data";

export default function PartnersPage() {
  // ── Convex ──────────────────────────────────────────────────────────────
  const convexPartners = useQuery(api.partners.list);
  const createPartner = useMutation(api.partners.create);

  // Cast to Partner[] — Convex Id types are string subtypes so this is safe at runtime
  const partners = (convexPartners ?? []) as unknown as Partner[];
  const isLoading = convexPartners === undefined;

  const { toast } = useToast();
  const { isFeatureEnabled } = usePlatformConfig();
  const showCerts = isFeatureEnabled("certifications");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "reseller" as "reseller" | "referral" | "integration" | "affiliate",
    tier: "bronze" as "bronze" | "silver" | "gold" | "platinum",
    commissionRate: 15,
    contactName: "",
    territory: "",
  });

  const filtered = partners.filter((p) => {
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    return true;
  });

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Company name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email format";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleAdd() {
    if (!validate()) return;
    setSaving(true);
    try {
      await createPartner({
        name: form.name,
        email: form.email,
        type: form.type,
        tier: form.tier,
        commissionRate: Number(form.commissionRate),
        status: "pending",
        contactName: form.contactName || undefined,
        territory: form.territory || undefined,
      });
      setShowAdd(false);
      setForm({ name: "", email: "", type: "reseller", tier: "bronze", commissionRate: 15, contactName: "", territory: "" });
      setFormErrors({});
      toast("Partner added successfully");
    } catch (err) {
      toast("Failed to add partner. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const csv = ev.target?.result as string;
      const parsed = parsePartnersCSV(csv);
      for (const p of parsed) {
        try {
          await createPartner({
            name: p.name,
            email: p.email,
            type: (p.type as any) === "distributor" ? "reseller" : (p.type as any),
            tier: p.tier,
            commissionRate: p.commissionRate,
            status: p.status ?? "pending",
            contactName: (p as any).contactName || undefined,
            territory: p.territory || undefined,
          });
        } catch {}
      }
      toast(`Imported ${parsed.length} partners`, "success");
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Partners</h1>
          <p className="muted">
            {isLoading ? "Loading…" : `${partners.length} partners · ${partners.filter((p) => p.status === "active").length} active`}
          </p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <button className="btn-outline" onClick={() => { exportPartnersCSV(partners); toast("Partners exported"); }}><Download size={15} /> Export</button>
          <button className="btn-outline" onClick={() => fileRef.current?.click()}><Upload size={15} /> Import</button>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} style={{ display: "none" }} />
          <button className="btn" onClick={() => setShowAdd(true)}><Plus size={15} /> Add Partner</button>
        </div>
      </div>

      <ConfigTipBox
        title="Adapt Partner Management"
        tips={[
          "Enable/disable Certifications & Badges, Scoring, and Tier management in Settings",
          "Commission rates can be set per-partner or as a default in Settings",
          "Toggle the Partner Portal to give partners self-service access",
        ]}
      />

      {/* Filters */}
      <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", padding: "1rem 1.5rem" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input className="input" placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        <select className="input" style={{ width: "auto" }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {Object.entries(PARTNER_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Loader2 size={28} className="spin" color="var(--muted)" style={{ marginBottom: ".5rem" }} />
          <p className="muted">Loading partners from database…</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                  <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Type</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Tier</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Commission</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Territory</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background .15s" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")} onMouseOut={(e) => (e.currentTarget.style.background = "")}>
                    <td style={{ padding: ".8rem 1.2rem" }}>
                      <Link href={`/dashboard/partners/${p._id}`} style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
                        <div className="avatar">{p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                            <p style={{ fontWeight: 600 }}>{p.name}</p>
                            {showCerts && getActiveCertCount(p._id) > 0 && (
                              <span title={`${getActiveCertCount(p._id)} certifications`} style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "1px 5px", borderRadius: 8, fontSize: ".65rem", fontWeight: 700, background: "#ecfdf5", color: "#059669" }}>
                                <Shield size={10} />{getActiveCertCount(p._id)}
                              </span>
                            )}
                            {showCerts && getBadgeCount(p._id) > 0 && (
                              <span title={`${getBadgeCount(p._id)} badges`} style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "1px 5px", borderRadius: 8, fontSize: ".65rem", fontWeight: 700, background: "#fef3c7", color: "#92400e" }}>
                                <Award size={10} />{getBadgeCount(p._id)}
                              </span>
                            )}
                          </div>
                          <p className="muted" style={{ fontSize: ".8rem" }}>{p.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: ".8rem" }}><span className="chip">{PARTNER_TYPE_LABELS[p.type] ?? p.type}</span></td>
                    <td style={{ padding: ".8rem" }}><span className="badge badge-neutral">{p.tier ? TIER_LABELS[p.tier] : "—"}</span></td>
                    <td style={{ padding: ".8rem", fontWeight: 600 }}>{p.commissionRate}%</td>
                    <td style={{ padding: ".8rem" }} className="muted">{p.territory || "—"}</td>
                    <td style={{ padding: ".8rem" }}>
                      <span className={`badge badge-${p.status === "active" ? "success" : p.status === "pending" ? "info" : "danger"}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: "2rem" }}>
              <Search size={32} color="var(--muted)" style={{ marginBottom: ".5rem" }} />
              <p className="muted">
                {partners.length === 0
                  ? "No partners yet. Add your first partner using the button above."
                  : "No partners match your filters."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowAdd(false)}>
          <div className="card animate-in" style={{ width: 500, maxWidth: "100%", maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Add Partner</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Company Name *</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="TechStar Solutions" />
                {formErrors.name && <p style={{ fontSize: ".75rem", color: "#dc2626", marginTop: ".25rem" }}>{formErrors.name}</p>}
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Email *</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="partnerships@techstar.io" />
                {formErrors.email && <p style={{ fontSize: ".75rem", color: "#dc2626", marginTop: ".25rem" }}>{formErrors.email}</p>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Type</label>
                  <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                    <option value="reseller">Reseller</option>
                    <option value="referral">Referral</option>
                    <option value="integration">Integration</option>
                    <option value="affiliate">Affiliate</option>
                  </select>
                </div>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Tier</label>
                  <select className="input" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as any })}>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Commission Rate %</label>
                  <input className="input" type="number" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Territory</label>
                  <input className="input" value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} placeholder="West Coast" />
                </div>
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Primary Contact</label>
                <input className="input" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Sarah Anderson" />
              </div>
              <button className="btn" style={{ width: "100%", marginTop: ".5rem" }} onClick={handleAdd} disabled={!form.name || !form.email || saving}>
                {saving ? "Saving…" : "Add Partner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
