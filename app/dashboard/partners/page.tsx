"use client";
import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { Plus, Download, Upload, Search, X, Shield, Award, Loader2, Send, Copy, Check, Users, Tag, ChevronDown, Trash2, GitCompare } from "lucide-react";
import { exportPartnersCSV, parsePartnersCSV } from "@/lib/csv";
import { PARTNER_TYPE_LABELS, TIER_LABELS } from "@/lib/types";
import type { Partner } from "@/lib/types";
import { usePlatformConfig } from "@/lib/platform-config";
import { getActiveCertCount, getBadgeCount } from "@/lib/certifications-data";

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Top Performer": { bg: "rgba(34,197,94,.15)", text: "#22c55e", border: "rgba(34,197,94,.3)" },
  "Strategic": { bg: "rgba(99,102,241,.15)", text: "#818cf8", border: "rgba(99,102,241,.3)" },
  "At Risk": { bg: "rgba(239,68,68,.15)", text: "#ef4444", border: "rgba(239,68,68,.3)" },
  "Needs Attention": { bg: "rgba(245,158,11,.15)", text: "#f59e0b", border: "rgba(245,158,11,.3)" },
  "New": { bg: "rgba(6,182,212,.15)", text: "#06b6d4", border: "rgba(6,182,212,.3)" },
  "Expansion": { bg: "rgba(139,92,246,.15)", text: "#8b5cf6", border: "rgba(139,92,246,.3)" },
  "Enterprise": { bg: "rgba(236,72,153,.15)", text: "#ec4899", border: "rgba(236,72,153,.3)" },
  "VIP": { bg: "rgba(249,115,22,.15)", text: "#f97316", border: "rgba(249,115,22,.3)" },
};
const DEFAULT_TAG_COLOR = { bg: "rgba(148,163,184,.15)", text: "#94a3b8", border: "rgba(148,163,184,.3)" };
function getTagColor(tag: string) { return TAG_COLORS[tag] || DEFAULT_TAG_COLOR; }

const ALL_TAGS = ["Top Performer", "Strategic", "At Risk", "Needs Attention", "New", "Expansion", "Enterprise", "VIP"];

export default function PartnersPage() {
  // ── Convex ──────────────────────────────────────────────────────────────
  const convexPartners = useQuery(api.partners.list);
  const convexDeals = useQuery(api.dealsCrud.list);
  const convexAttributions = useQuery(api.dashboard.getAllAttributions);
  const allTags = useQuery(api.partners.listAllTags) ?? [];
  const createPartner = useMutation(api.partners.create);
  const createInvite = useMutation(api.invites.create);
  const bulkAddTag = useMutation(api.partners.bulkAddTag);
  const bulkRemoveTag = useMutation(api.partners.bulkRemoveTag);
  const bulkUpdateTier = useMutation(api.partners.bulkUpdateTier);
  const bulkUpdateStatus = useMutation(api.partners.bulkUpdateStatus);

  const partners = (convexPartners ?? []) as unknown as Partner[];
  const isLoading = convexPartners === undefined;

  const router = useRouter();
  const { toast } = useToast();
  const { isFeatureEnabled } = usePlatformConfig();
  const showCerts = isFeatureEnabled("certifications");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  // ── Bulk selection ────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMenu, setBulkMenu] = useState<"tag" | "tier" | "status" | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "reseller" as "reseller" | "referral" | "integration" | "affiliate",
    tier: "bronze" as "bronze" | "silver" | "gold" | "platinum",
    commissionRate: 15,
    contactName: "",
    territory: "",
  });

  // Onboarding progress
  const onboardingMap = new Map<string, { profile: boolean; deal: boolean; commission: boolean; pct: number }>();
  for (const p of partners) {
    const hasProfile = !!(p.contactName && p.email);
    const hasDeal = (convexDeals ?? []).some((d: any) => d.registeredBy === p._id);
    const hasCommission = (convexAttributions ?? []).some((a: any) => a.partnerId === p._id && a.commissionAmount > 0);
    const steps = [hasProfile, hasDeal, hasCommission].filter(Boolean).length;
    onboardingMap.set(p._id, { profile: hasProfile, deal: hasDeal, commission: hasCommission, pct: Math.round((steps / 3) * 100) });
  }

  const filtered = partners.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterTag !== "all" && !(p as any).tags?.includes(filterTag)) return false;
    return true;
  });

  const filteredIds = useMemo(() => new Set(filtered.map((p) => p._id)), [filtered]);
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p._id));
  const someSelected = selected.size > 0;
  const selectedCount = selected.size;

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p._id)));
    }
  }

  function clearSelection() {
    setSelected(new Set());
    setBulkMenu(null);
  }

  const selectedIds = useMemo(
    () => Array.from(selected).filter((id) => filteredIds.has(id)) as Id<"partners">[],
    [selected, filteredIds]
  );

  async function handleBulkTag(tag: string, action: "add" | "remove") {
    setBulkLoading(true);
    try {
      if (action === "add") {
        await bulkAddTag({ ids: selectedIds, tag });
        toast(`Added "${tag}" to ${selectedIds.length} partners`);
      } else {
        await bulkRemoveTag({ ids: selectedIds, tag });
        toast(`Removed "${tag}" from ${selectedIds.length} partners`);
      }
    } catch { toast("Bulk tag update failed", "error"); }
    setBulkLoading(false);
    setBulkMenu(null);
  }

  async function handleBulkTier(tier: "bronze" | "silver" | "gold" | "platinum") {
    setBulkLoading(true);
    try {
      await bulkUpdateTier({ ids: selectedIds, tier });
      toast(`Updated ${selectedIds.length} partners to ${TIER_LABELS[tier]}`);
    } catch { toast("Bulk tier update failed", "error"); }
    setBulkLoading(false);
    setBulkMenu(null);
  }

  async function handleBulkStatus(status: "active" | "pending" | "inactive") {
    setBulkLoading(true);
    try {
      await bulkUpdateStatus({ ids: selectedIds, status });
      toast(`Updated ${selectedIds.length} partners to ${status}`);
    } catch { toast("Bulk status update failed", "error"); }
    setBulkLoading(false);
    setBulkMenu(null);
  }

  function handleBulkExport() {
    const selectedPartners = partners.filter((p) => selected.has(p._id));
    exportPartnersCSV(selectedPartners);
    toast(`Exported ${selectedPartners.length} partners`);
    setBulkMenu(null);
  }

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
    } catch {
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

  // Merge all tags for dropdown
  const tagOptions = useMemo(() => {
    const s = new Set([...ALL_TAGS, ...allTags]);
    return Array.from(s).sort();
  }, [allTags]);

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
        {allTags.length > 0 && (
          <select className="input" style={{ width: "auto" }} value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
            <option value="all">All Tags</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      {/* ── Bulk Action Bar ───────────────────────────────────────────────── */}
      {someSelected && (
        <div
          className="card animate-in"
          style={{
            marginBottom: "1rem",
            padding: ".75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            background: "rgba(99,102,241,.08)",
            border: "1px solid rgba(99,102,241,.25)",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: ".9rem", whiteSpace: "nowrap" }}>
            {selectedCount} selected
          </span>
          <div style={{ width: 1, height: 20, background: "var(--border)" }} />

          {/* Tag actions */}
          <div style={{ position: "relative" }}>
            <button
              className="btn-outline"
              style={{ fontSize: ".8rem", padding: "5px 12px" }}
              onClick={() => setBulkMenu(bulkMenu === "tag" ? null : "tag")}
              disabled={bulkLoading}
            >
              <Tag size={13} /> Tag <ChevronDown size={12} />
            </button>
            {bulkMenu === "tag" && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  zIndex: 50,
                  width: 220,
                  padding: ".5rem 0",
                  maxHeight: 320,
                  overflow: "auto",
                }}
              >
                <div style={{ padding: "4px 12px", fontSize: ".7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>Add Tag</div>
                {tagOptions.map((tag) => {
                  const c = getTagColor(tag);
                  return (
                    <button
                      key={`add-${tag}`}
                      onClick={() => handleBulkTag(tag, "add")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "6px 12px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: ".85rem",
                        color: "inherit",
                        fontFamily: "inherit",
                        textAlign: "left",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.text, flexShrink: 0 }} />
                      {tag}
                    </button>
                  );
                })}
                <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                <div style={{ padding: "4px 12px", fontSize: ".7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>Remove Tag</div>
                {tagOptions.map((tag) => (
                  <button
                    key={`rm-${tag}`}
                    onClick={() => handleBulkTag(tag, "remove")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "6px 12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: ".85rem",
                      color: "var(--muted)",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <X size={12} /> {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tier actions */}
          <div style={{ position: "relative" }}>
            <button
              className="btn-outline"
              style={{ fontSize: ".8rem", padding: "5px 12px" }}
              onClick={() => setBulkMenu(bulkMenu === "tier" ? null : "tier")}
              disabled={bulkLoading}
            >
              <Shield size={13} /> Tier <ChevronDown size={12} />
            </button>
            {bulkMenu === "tier" && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  zIndex: 50,
                  width: 160,
                  padding: ".5rem 0",
                }}
              >
                {(["platinum", "gold", "silver", "bronze"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => handleBulkTier(tier)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "6px 12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: ".85rem",
                      color: "inherit",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                  >
                    {TIER_LABELS[tier]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status actions */}
          <div style={{ position: "relative" }}>
            <button
              className="btn-outline"
              style={{ fontSize: ".8rem", padding: "5px 12px" }}
              onClick={() => setBulkMenu(bulkMenu === "status" ? null : "status")}
              disabled={bulkLoading}
            >
              Status <ChevronDown size={12} />
            </button>
            {bulkMenu === "status" && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  zIndex: 50,
                  width: 140,
                  padding: ".5rem 0",
                }}
              >
                {(["active", "pending", "inactive"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleBulkStatus(status)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "6px 12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: ".85rem",
                      color: "inherit",
                      fontFamily: "inherit",
                      textAlign: "left",
                      textTransform: "capitalize",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compare (2-4 selected) */}
          {selectedCount >= 2 && selectedCount <= 4 && (
            <button
              className="btn-outline"
              style={{ fontSize: ".8rem", padding: "5px 12px", color: "#6366f1", borderColor: "rgba(99,102,241,.4)" }}
              onClick={() => router.push(`/dashboard/partners/compare?ids=${selectedIds.join(",")}`)}
            >
              <GitCompare size={13} /> Compare
            </button>
          )}

          {/* Export selected */}
          <button
            className="btn-outline"
            style={{ fontSize: ".8rem", padding: "5px 12px" }}
            onClick={handleBulkExport}
          >
            <Download size={13} /> Export Selected
          </button>

          <div style={{ flex: 1 }} />
          <button
            className="btn-outline"
            style={{ fontSize: ".8rem", padding: "5px 12px", color: "var(--muted)" }}
            onClick={clearSelection}
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

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
                  <th style={{ padding: ".8rem .6rem .8rem 1.2rem", width: 36 }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: "#6366f1" }}
                      title={allSelected ? "Deselect all" : "Select all"}
                    />
                  </th>
                  <th style={{ padding: ".8rem .8rem .8rem 0", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Type</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Tier</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Commission</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Territory</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Tags</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Onboarding</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isSelected = selected.has(p._id);
                  return (
                    <tr
                      key={p._id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        cursor: "pointer",
                        transition: "background .15s",
                        background: isSelected ? "rgba(99,102,241,.06)" : undefined,
                      }}
                      onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--subtle)"; }}
                      onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.background = ""; }}
                    >
                      <td style={{ padding: ".8rem .6rem .8rem 1.2rem", width: 36 }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p._id)}
                          style={{ cursor: "pointer", accentColor: "#6366f1" }}
                        />
                      </td>
                      <td style={{ padding: ".8rem .8rem .8rem 0" }}>
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
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {((p as any).tags || []).slice(0, 3).map((tag: string) => {
                            const c = getTagColor(tag);
                            return <span key={tag} style={{ padding: "2px 8px", borderRadius: 10, fontSize: ".7rem", fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}`, whiteSpace: "nowrap" }}>{tag}</span>;
                          })}
                          {((p as any).tags || []).length > 3 && <span className="muted" style={{ fontSize: ".7rem" }}>+{(p as any).tags.length - 3}</span>}
                          {!((p as any).tags?.length) && <span className="muted" style={{ fontSize: ".75rem" }}>—</span>}
                        </div>
                      </td>
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
                  );
                })}
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

      {/* Close dropdowns on outside click */}
      {bulkMenu && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40 }}
          onClick={() => setBulkMenu(null)}
        />
      )}
    </>
  );
}
