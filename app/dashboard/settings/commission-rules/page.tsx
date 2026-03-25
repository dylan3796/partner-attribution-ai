"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { Plus, Pencil, Trash2, X, Shield, Loader2, Sparkles, Save } from "lucide-react";

type RuleForm = {
  name: string;
  partnerType: string;
  partnerTier: string;
  productLine: string;
  rate: number;
  minDealSize: string;
  priority: number;
};

type ParsedRule = {
  name: string;
  field: string;
  operator: string;
  value: string;
  actionValue: string;
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
  const products = useQuery(api.products.list);
  const createRule = useMutation(api.commissionRules.create);
  const updateRule = useMutation(api.commissionRules.update);
  const removeRule = useMutation(api.commissionRules.remove);
  const { toast } = useToast();

  // NL parsing state
  const [nlText, setNlText] = useState("");
  const [parsedRules, setParsedRules] = useState<ParsedRule[]>([]);
  const [parsing, setParsing] = useState(false);
  const [savingNl, setSavingNl] = useState(false);

  // Build product options from catalog — group by category for readability
  const productOptions = useMemo(() => {
    if (!products || products.length === 0) return [];
    const active = products.filter((p) => p.status === "active");
    const byCategory = new Map<string, typeof active>();
    for (const p of active) {
      const cat = p.category || "Uncategorized";
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(p);
    }
    return Array.from(byCategory.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({
        category,
        products: items.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [products]);

  // Map product names for display in the table
  const productNameMap = useMemo(() => {
    if (!products) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const p of products) {
      map.set(p.name, p.name);
      map.set(p.category, p.category);
    }
    return map;
  }, [products]);

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

  // NL parsing functions
  async function handleParseNL() {
    if (!nlText.trim()) return;
    setParsing(true);
    setParsedRules([]);
    try {
      const res = await fetch("/api/parse-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nlText }),
      });
      const data = await res.json();
      if (data.rules && data.rules.length > 0) {
        setParsedRules(data.rules);
        toast(`Parsed ${data.rules.length} rule(s)`);
      } else {
        toast("No rules could be parsed from this text");
      }
    } catch (err) {
      toast("Failed to parse rules");
    }
    setParsing(false);
  }

  async function handleSaveNLRules() {
    if (parsedRules.length === 0) return;
    setSavingNl(true);
    try {
      const res = await fetch("/api/parse-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: nlText,
          save: true,
        }),
      });
      const data = await res.json();
      if (data.saved && data.savedRuleIds?.length > 0) {
        toast(`Saved ${data.savedRuleIds.length} rule(s) to your commission rules`);
        setParsedRules([]);
        setNlText("");
      } else {
        toast("Failed to save rules");
      }
    } catch (err) {
      toast("Failed to save rules");
    }
    setSavingNl(false);
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
          When a deal is attributed, the system matches rules top-to-bottom by priority. The first rule that matches the partner&apos;s type, tier, product, and deal size is applied. If no rule matches, the partner&apos;s default rate is used.
          {productOptions.length > 0 && " Product-specific rules pull from your product catalog."}
        </p>
      </div>

      {/* Natural Language Rule Parser */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Sparkles size={16} style={{ color: "#8b5cf6" }} />
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600 }}>Create Rules from Natural Language</h3>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
          Describe your commission structure in plain English. Example: &quot;Gold partners get 25%, Silver 20%, Bronze 15%&quot;
        </p>
        <textarea
          style={{
            ...inputStyle,
            minHeight: 80,
            resize: "vertical",
            marginBottom: "0.75rem",
          }}
          placeholder="e.g., Platinum tier partners earn 30% commission. Gold tier gets 25%. Deals over $100,000 add a 5% bonus."
          value={nlText}
          onChange={(e) => setNlText(e.target.value)}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn"
            onClick={handleParseNL}
            disabled={parsing || !nlText.trim()}
            style={{ background: "#8b5cf6" }}
          >
            {parsing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={14} />}
            {parsing ? "Parsing..." : "Parse Rules"}
          </button>
          {parsedRules.length > 0 && (
            <button
              className="btn"
              onClick={handleSaveNLRules}
              disabled={savingNl}
              style={{ background: "#22c55e" }}
            >
              {savingNl ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
              {savingNl ? "Saving..." : `Save ${parsedRules.length} Rule(s)`}
            </button>
          )}
        </div>

        {/* Parsed rules preview */}
        {parsedRules.length > 0 && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--subtle)", borderRadius: 8 }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)" }}>
              Preview ({parsedRules.length} rules parsed)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {parsedRules.map((rule, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "0.75rem" }}>
                    {rule.priority}
                  </span>
                  <span style={{ fontWeight: 600 }}>{rule.name}</span>
                  <span className="badge">{rule.field} {rule.operator} {rule.value}</span>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>{rule.actionValue}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
                  <td style={tdStyle}>
                    {rule.productLine ? (
                      <span className="badge" style={{ fontSize: "0.8rem" }}>{rule.productLine}</span>
                    ) : "—"}
                  </td>
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
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Product</label>
                {productOptions.length > 0 ? (
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={form.productLine}
                    onChange={(e) => setForm({ ...form, productLine: e.target.value })}
                  >
                    <option value="">All Products</option>
                    {productOptions.map((group) => (
                      <optgroup key={group.category} label={group.category}>
                        {group.products.map((p) => (
                          <option key={p._id} value={p.name}>{p.name} — {p.sku}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ) : (
                  <input style={inputStyle} value={form.productLine} onChange={(e) => setForm({ ...form, productLine: e.target.value })} placeholder="e.g. Enterprise (add products in catalog first)" />
                )}
                {productOptions.length > 0 && (
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                    Products from your <a href="/dashboard/products" style={{ color: "inherit", textDecoration: "underline" }}>catalog</a>
                  </p>
                )}
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
