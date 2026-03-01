"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { Plus, Download, Upload, Search, X, Shield, Award, Loader2, Send, Copy, Check, Users } from "lucide-react";
import { exportPartnersCSV, parsePartnersCSV } from "@/lib/csv";
import { PARTNER_TYPE_LABELS, TIER_LABELS } from "@/lib/types";
import type { Partner } from "@/lib/types";
// ConfigTipBox removed — no longer used on this page
import { usePlatformConfig } from "@/lib/platform-config";
import { getActiveCertCount, getBadgeCount } from "@/lib/certifications-data";

export default function PartnersPage() {
  // ── Convex ──────────────────────────────────────────────────────────────
  const convexPartners = useQuery(api.partners.list);
  const convexDeals = useQuery(api.dealsCrud.list);
  const convexAttributions = useQuery(api.dashboard.getAllAttributions);
  const createPartner = useMutation(api.partners.create);
  const createInvite = useMutation(api.invites.create);

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
  const [showInvite, setShowInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "reseller" as "reseller" | "referral" | "integration" | "affiliate",
    tier: "bronze" as "bronze" | "silver" | "gold" | "platinum",
    commissionRate: 15,
    contactName: "",
    territory: "",
  });

  // Onboarding progress: profile complete, first deal, first commission
  const onboardingMap = new Map<string, { profile: boolean; deal: boolean; commission: boolean; pct: number }>();
  for (const p of partners) {
    const hasProfile = !!(p.contactName && p.email);
    const hasDeal = (convexDeals ?? []).some((d: any) => d.registeredBy === p._id);
    const hasCommission = (convexAttributions ?? []).some((a: any) => a.partnerId === p._id && a.commissionAmount > 0);
    const steps = [hasProfile, hasDeal, hasCommission].filter(Boolean).length;
    onboardingMap.set(p._id, { profile: hasProfile, deal: hasDeal, commission: hasCommission, pct: Math.round((steps / 3) * 100) });
  }

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
          <button className="btn-outline" onClick={async () => {
            setInviteLoading(true);
            try {
              const result = await createInvite({});
              const origin = typeof window !== "undefined" ? window.location.origin : "https://covant.ai";
              setInviteLink(`${origin}/invite/${result.token}`);
              setInviteCopied(false);
              setShowInvite(true);
            } catch { toast("Failed to create invite"); }
            setInviteLoading(false);
          }} disabled={inviteLoading}><Send size={15} /> {inviteLoading ? "Creating..." : "Invite Partner"}</button>
          <button className="btn" onClick={() => setShowAdd(true)}><Plus size={15} /> Add Partner</button>
        </div>
      </div>

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
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Onboarding</th>
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
                      {(() => {
                        const ob = onboardingMap.get(p._id);
                        if (!ob) return "—";
                        const color = ob.pct === 100 ? "#22c55e" : ob.pct >= 66 ? "#eab308" : "#ef4444";
                        return (
                          <div title={`Profile: ${ob.profile ? "✓" : "✗"} | Deal: ${ob.deal ? "✓" : "✗"} | Commission: ${ob.commission ? "✓" : "✗"}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: 48, height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
                              <div style={{ width: `${ob.pct}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.3s" }} />
                            </div>
                            <span style={{ fontSize: ".75rem", fontWeight: 600, color }}>{ob.pct}%</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td style={{ padding: ".8rem" }}>
                      <span className={`badge badge-${p.status === "active" ? "success" : p.status === "pending" ? "info" : "danger"}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <Users size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>
                {partners.length === 0 ? "No partners yet" : "No partners match your filters"}
              </h3>
              <p className="muted" style={{ fontSize: ".85rem", marginBottom: 16 }}>
                {partners.length === 0
                  ? "Partners are the foundation of your program. Add your first partner to get started."
                  : "Try adjusting your search or filters."}
              </p>
              {partners.length === 0 && (
                <button
                  onClick={() => setShowAdd(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px",
                    borderRadius: 8, background: "#6366f1", color: "#fff", border: "none",
                    fontWeight: 600, fontSize: ".85rem", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  + Add First Partner
                </button>
              )}
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

      {/* Invite Link Modal */}
      {showInvite && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowInvite(false)}>
          <div className="card" style={{ width: 480, padding: "2rem" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Partner Invite Link</h2>
              <button className="btn-ghost" onClick={() => setShowInvite(false)}><X size={18} /></button>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Share this link with your partner. They&apos;ll create their own profile and get instant portal access. Link expires in 7 days.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className="input"
                value={inviteLink}
                readOnly
                style={{ flex: 1, fontSize: "0.85rem" }}
                onFocus={(e) => e.target.select()}
              />
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  setInviteCopied(true);
                  toast("Link copied!");
                  setTimeout(() => setInviteCopied(false), 2000);
                }}
                style={{ whiteSpace: "nowrap" }}
              >
                {inviteCopied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
