"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { Plus, Pencil, Trash2, X, Shield, Loader2 } from "lucide-react";

type RuleForm = {
  name: string;
  partnerType: string;
  partnerTier: string;
  productLine: string;
  rate: number;
  minDealSize: string;
  priority: number;
};

const EMPTY_FORM: RuleForm = {
  name: "",
  partnerType: "",
  partnerTier: "",
  productLine: "",
  rate: 15,
  minDealSize: "",
  priority: 10,
};

const PARTNER_TYPES = [
  { value: "", label: "All Types" },
  { value: "reseller", label: "Reseller" },
  { value: "referral", label: "Referral" },
  { value: "affiliate", label: "Affiliate" },
  { value: "integration", label: "Integration" },
];

const PARTNER_TIERS = [
  { value: "", label: "All Tiers" },
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
];

export default function CommissionRulesPage() {
  const rules = useQuery(api.commissionRules.list);
  const createRule = useMutation(api.commissionRules.create);
  const updateRule = useMutation(api.commissionRules.update);
  const removeRule = useMutation(api.commissionRules.remove);
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"commissionRules"> | null>(null);
  const [form, setForm] = useState<RuleForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(rule: any) {
    setForm({
      name: rule.name,
      partnerType: rule.partnerType || "",
      partnerTier: rule.partnerTier || "",
      productLine: rule.productLine || "",
      rate: Math.round(rule.rate * 100),
      minDealSize: rule.minDealSize ? String(rule.minDealSize) : "",
      priority: rule.priority,
    });
    setEditingId(rule._id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const args = {
        name: form.name,
        partnerType: form.partnerType || undefined,
        partnerTier: form.partnerTier || undefined,
        productLine: form.productLine || undefined,
        rate: form.rate / 100,
        minDealSize: form.minDealSize ? Number(form.minDealSize) : undefined,
        priority: form.priority,
      } as any;

      if (editingId) {
        await updateRule({ id: editingId, ...args });
        toast("Rule updated");
      } else {
        await createRule(args);
        toast("Rule created");
      }
      setShowForm(false);
    } catch (err: any) {
      toast(err.message || "Failed to save rule");
    }
    setSaving(false);
  }

  async function handleDelete(id: Id<"commissionRules">) {
    if (!confirm("Delete this commission rule?")) return;
    await removeRule({ id });
    toast("Rule deleted");
  }

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "0.75rem 1rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid var(--border)",
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    borderBottom: "1px solid var(--border)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Commission Rules</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Define tiered commission rates by partner type, tier, product line, and deal size. Rules are matched by priority (lowest first).
          </p>
        </div>
        <button className="btn" onClick={openAdd}><Plus size={15} /> Add Rule</button>
      </div>

      {/* Info card */}
      <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--subtle)" }}>
        <Shield size={18} style={{ color: "var(--muted)", flexShrink: 0 }} />
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5 }}>
          When a deal is attributed, the system matches rules top-to-bottom by priority. The first rule that matches the partner&apos;s type, tier, and deal size is applied. If no rule matches, the partner&apos;s default rate is used.
        </p>
      </div>

      {/* Rules table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {rules === undefined ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : rules.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted)" }}>
            <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>No commission rules yet.</p>
            <p style={{ fontSize: "0.85rem" }}>All partners will use their default flat rate until rules are configured.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Partner Type</th>
                <th style={thStyle}>Tier</th>
                <th style={thStyle}>Product Line</th>
                <th style={thStyle}>Rate</th>
                <th style={thStyle}>Min Deal</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule._id}>
                  <td style={tdStyle}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: "var(--subtle)", fontSize: "0.85rem", fontWeight: 600 }}>
                      {rule.priority}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{rule.name}</td>
                  <td style={tdStyle}>
                    <span className="badge" style={{ textTransform: "capitalize" }}>
                      {rule.partnerType || "All"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span className="badge" style={{ textTransform: "capitalize" }}>
                      {rule.partnerTier || "All"}
                    </span>
                  </td>
                  <td style={tdStyle}>{rule.productLine || "—"}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: "#22c55e" }}>
                    {Math.round(rule.rate * 100)}%
                  </td>
                  <td style={tdStyle}>
                    {rule.minDealSize ? `$${rule.minDealSize.toLocaleString()}` : "—"}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button className="btn-ghost" onClick={() => openEdit(rule)} style={{ marginRight: "0.25rem" }}>
                      <Pencil size={14} />
                    </button>
                    <button className="btn-ghost" onClick={() => handleDelete(rule._id)} style={{ color: "#ef4444" }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: 520, padding: "2rem" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{editingId ? "Edit Rule" : "Add Commission Rule"}</h2>
              <button className="btn-ghost" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Rule Name *</label>
                <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gold Reseller" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Partner Type</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.partnerType} onChange={(e) => setForm({ ...form, partnerType: e.target.value })}>
                    {PARTNER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Partner Tier</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.partnerTier} onChange={(e) => setForm({ ...form, partnerTier: e.target.value })}>
                    {PARTNER_TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Product Line</label>
                <input style={inputStyle} value={form.productLine} onChange={(e) => setForm({ ...form, productLine: e.target.value })} placeholder="e.g. Enterprise (leave blank for all)" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Commission Rate %</label>
                  <input style={inputStyle} type="number" min={0} max={100} value={form.rate} onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Min Deal Size</label>
                  <input style={inputStyle} type="number" min={0} value={form.minDealSize} onChange={(e) => setForm({ ...form, minDealSize: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Priority</label>
                  <input style={inputStyle} type="number" min={1} value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
                </div>
              </div>

              <button className="btn" style={{ width: "100%", marginTop: "0.5rem" }} onClick={handleSave} disabled={saving || !form.name.trim()}>
                {saving ? "Saving..." : editingId ? "Update Rule" : "Create Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
