"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Zap,
  Calendar,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

// ── Types ──────────────────────────────────────────────────────────────────────

type TierRow = {
  id: string;
  name: string;
  rate: number;
  bonusThreshold: number;
  bonusAmount: number;
};

type ProductLineRow = {
  id: string;
  product: string;
  rate: number;
  notes: string;
};

type BonusType = "multiplier" | "flat";

type Spif = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  products: string[];
  tiers: string[];
  bonusType: BonusType;
  multiplier: number;
  flatAmount: number;
  maxPayout: string;
  active: boolean;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function spifStatus(spif: Spif): "Active" | "Scheduled" | "Expired" | "Inactive" {
  if (!spif.active) return "Inactive";
  const now = new Date().toISOString().slice(0, 10);
  if (spif.endDate && spif.endDate < now) return "Expired";
  if (spif.startDate && spif.startDate > now) return "Scheduled";
  return "Active";
}

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: typeof CheckCircle }> = {
  Active: { bg: "#ecfdf5", color: "#065f46", icon: CheckCircle },
  Scheduled: { bg: "#eff6ff", color: "#1e40af", icon: Clock },
  Expired: { bg: "#f9fafb", color: "#6b7280", icon: AlertTriangle },
  Inactive: { bg: "#f9fafb", color: "#6b7280", icon: AlertTriangle },
};

const ALL_PRODUCTS = ["Software Licenses", "Professional Services", "Hardware", "Support Contracts", "Training"];
const ALL_TIERS = ["Platinum", "Gold", "Silver", "Bronze"];

// ── Toggle component ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0 }}
    >
      {checked ? <ToggleRight size={28} color="#059669" /> : <ToggleLeft size={28} color="#9ca3af" />}
    </button>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ title, subtitle, icon: Icon, children }: {
  title: string;
  subtitle?: string;
  icon: typeof DollarSign;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color="#6366f1" />
        </div>
        <div>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{title}</h2>
          {subtitle && <p className="muted" style={{ fontSize: ".82rem", marginTop: ".15rem" }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Table helpers ──────────────────────────────────────────────────────────────

const TH_STYLE: React.CSSProperties = {
  padding: ".6rem 1rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: ".78rem",
  color: "var(--muted)",
  background: "var(--subtle)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const TD_STYLE: React.CSSProperties = {
  padding: ".55rem .8rem",
  borderBottom: "1px solid var(--border)",
  fontSize: ".88rem",
  verticalAlign: "middle",
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function CommissionsPage() {
  const { toast } = useToast();

  // ── Section 1: Global ──────────────────────────────────────────────────────
  const [globalRate, setGlobalRate] = useState(10);
  const [autoCalculate, setAutoCalculate] = useState(true);

  // ── Section 2: Tiers ───────────────────────────────────────────────────────
  const [tiers, setTiers] = useState<TierRow[]>([
    { id: uid(), name: "Platinum", rate: 15, bonusThreshold: 500000, bonusAmount: 5000 },
    { id: uid(), name: "Gold", rate: 12, bonusThreshold: 250000, bonusAmount: 2500 },
    { id: uid(), name: "Silver", rate: 8, bonusThreshold: 100000, bonusAmount: 1000 },
    { id: uid(), name: "Bronze", rate: 5, bonusThreshold: 50000, bonusAmount: 500 },
  ]);

  function addTier() {
    setTiers((prev) => [...prev, { id: uid(), name: "Custom Tier", rate: 10, bonusThreshold: 0, bonusAmount: 0 }]);
  }

  function updateTier(id: string, field: keyof TierRow, value: string | number) {
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function removeTier(id: string) {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  }

  // ── Section 3: Product Lines ───────────────────────────────────────────────
  const [productLines, setProductLines] = useState<ProductLineRow[]>([
    { id: uid(), product: "Software Licenses", rate: 15, notes: "Highest margin products" },
    { id: uid(), product: "Professional Services", rate: 8, notes: "Labor-intensive, lower margin" },
    { id: uid(), product: "Hardware", rate: 3, notes: "Thin margins" },
  ]);

  function addProductLine() {
    setProductLines((prev) => [...prev, { id: uid(), product: "", rate: 10, notes: "" }]);
  }

  function updateProductLine(id: string, field: keyof ProductLineRow, value: string | number) {
    setProductLines((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function removeProductLine(id: string) {
    setProductLines((prev) => prev.filter((p) => p.id !== id));
  }

  // ── Section 4: SPIFs ──────────────────────────────────────────────────────
  const [spifs, setSpifs] = useState<Spif[]>([
    {
      id: uid(),
      name: "Q1 Software Push",
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      products: ["Software Licenses"],
      tiers: ["Platinum", "Gold"],
      bonusType: "multiplier",
      multiplier: 2,
      flatAmount: 500,
      maxPayout: "25000",
      active: true,
    },
    {
      id: uid(),
      name: "New Partner Ramp",
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      products: [],
      tiers: ["Silver", "Bronze"],
      bonusType: "flat",
      multiplier: 1,
      flatAmount: 1000,
      maxPayout: "",
      active: true,
    },
  ]);

  const [showSpifForm, setShowSpifForm] = useState(false);
  const [editingSpif, setEditingSpif] = useState<Spif | null>(null);

  const emptySpif: Omit<Spif, "id"> = {
    name: "",
    startDate: "",
    endDate: "",
    products: [],
    tiers: [],
    bonusType: "multiplier",
    multiplier: 2,
    flatAmount: 500,
    maxPayout: "",
    active: true,
  };

  const [spifForm, setSpifForm] = useState<Omit<Spif, "id">>(emptySpif);

  function openCreateSpif() {
    setSpifForm(emptySpif);
    setEditingSpif(null);
    setShowSpifForm(true);
  }

  function openEditSpif(spif: Spif) {
    setSpifForm({ ...spif });
    setEditingSpif(spif);
    setShowSpifForm(true);
  }

  function saveSpif() {
    if (!spifForm.name) return;
    if (editingSpif) {
      setSpifs((prev) => prev.map((s) => (s.id === editingSpif.id ? { ...spifForm, id: editingSpif.id } : s)));
    } else {
      setSpifs((prev) => [...prev, { ...spifForm, id: uid() }]);
    }
    setShowSpifForm(false);
  }

  function removeSpif(id: string) {
    setSpifs((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleSpif(id: string) {
    setSpifs((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  }

  function toggleMultiSelect<T extends string>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  }

  // ── Section 5: Advanced Rules ──────────────────────────────────────────────
  const [clawbackEnabled, setClawbackEnabled] = useState(false);
  const [clawbackMonths, setClawbackMonths] = useState(3);
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringRate, setRecurringRate] = useState(50);
  const [minDealSize, setMinDealSize] = useState(0);
  const [commissionCap, setCommissionCap] = useState("");
  const [splitProportionally, setSplitProportionally] = useState(true);

  // ── Save ──────────────────────────────────────────────────────────────────
  function handleSave() {
    toast("Commission structure saved successfully", "success" as never);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Commission Structure</h1>
          <p className="muted">Define how partners earn commissions, bonuses, and incentives</p>
        </div>
        <button className="btn" onClick={handleSave}>
          <CheckCircle size={15} /> Save Commission Structure
        </button>
      </div>

      {/* Link to commission rules */}
      <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Tiered Commission Rules</p>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Set different rates by partner type, tier, product line, and deal size</p>
        </div>
        <Link href="/dashboard/settings/commission-rules" className="btn-outline" style={{ whiteSpace: "nowrap" }}>
          Manage Rules →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 860 }}>

        {/* ── Section 1: Global Rate ──────────────────────────────────────── */}
        <Section
          title="Global Commission Rate"
          subtitle="Default rate applied to all deals unless overridden by rules below"
          icon={DollarSign}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                <label style={{ fontSize: ".85rem", fontWeight: 600 }}>Default Commission Rate</label>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={globalRate}
                    onChange={(e) => setGlobalRate(Number(e.target.value))}
                    style={{ width: 100, textAlign: "center" }}
                  />
                  <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--muted)" }}>%</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: "1rem 1.25rem", background: "var(--subtle)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.55 }}>
                  💡 Applies to all deals unless overridden by tier rules, product-line rates, or SPIFs below.
                  Partners without a specific rule assigned earn <strong>{globalRate}%</strong> on attributed deal value.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".8rem 1rem", border: "1px solid var(--border)", borderRadius: 8, background: autoCalculate ? "var(--bg)" : "var(--subtle)" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Calculate commissions automatically on deal close</p>
                <p className="muted" style={{ fontSize: ".78rem" }}>Commission amounts are computed when a deal moves to &quot;Won&quot; status</p>
              </div>
              <Toggle checked={autoCalculate} onChange={setAutoCalculate} />
            </div>
          </div>
        </Section>

        {/* ── Section 2: Tier-Based Rates ────────────────────────────────── */}
        <Section
          title="Tier-Based Commission Rates"
          subtitle="Set different rates for each partner tier. Bonuses trigger when quarterly attributed revenue exceeds the threshold."
          icon={Zap}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH_STYLE}>Tier Name</th>
                  <th style={{ ...TH_STYLE, textAlign: "right" }}>Commission Rate (%)</th>
                  <th style={{ ...TH_STYLE, textAlign: "right" }}>Bonus Threshold ($)</th>
                  <th style={{ ...TH_STYLE, textAlign: "right" }}>Bonus Amount ($)</th>
                  <th style={{ ...TH_STYLE, textAlign: "center", width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr key={tier.id} style={{ transition: "background .12s" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td style={TD_STYLE}>
                      <input
                        className="input"
                        value={tier.name}
                        onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                        style={{ padding: ".35rem .6rem", fontSize: ".88rem" }}
                      />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "flex-end" }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          value={tier.rate}
                          onChange={(e) => updateTier(tier.id, "rate", Number(e.target.value))}
                          style={{ padding: ".35rem .6rem", fontSize: ".88rem", width: 70, textAlign: "right" }}
                        />
                        <span className="muted" style={{ fontSize: ".85rem" }}>%</span>
                      </div>
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "flex-end" }}>
                        <span className="muted" style={{ fontSize: ".85rem" }}>$</span>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          step={1000}
                          value={tier.bonusThreshold}
                          onChange={(e) => updateTier(tier.id, "bonusThreshold", Number(e.target.value))}
                          style={{ padding: ".35rem .6rem", fontSize: ".88rem", width: 110, textAlign: "right" }}
                        />
                      </div>
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "flex-end" }}>
                        <span className="muted" style={{ fontSize: ".85rem" }}>$</span>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          step={100}
                          value={tier.bonusAmount}
                          onChange={(e) => updateTier(tier.id, "bonusAmount", Number(e.target.value))}
                          style={{ padding: ".35rem .6rem", fontSize: ".88rem", width: 90, textAlign: "right" }}
                        />
                      </div>
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <button
                        onClick={() => removeTier(tier.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4, lineHeight: 0, borderRadius: 6 }}
                        title="Remove tier"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem" }}>
            <p className="muted" style={{ fontSize: ".78rem" }}>
              Example: Earn an extra <strong>$5,000</strong> when quarterly attributed revenue exceeds <strong>$500K</strong>
            </p>
            <button className="btn-outline" onClick={addTier} style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>
              <Plus size={14} /> Add Tier
            </button>
          </div>
        </Section>

        {/* ── Section 3: Product-Line Rates ──────────────────────────────── */}
        <Section
          title="Product-Line Commission Rates"
          subtitle="Product rates override tier rates when both apply to a deal."
          icon={Calendar}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr>
                  <th style={TH_STYLE}>Product / Category</th>
                  <th style={{ ...TH_STYLE, textAlign: "right" }}>Commission Rate (%)</th>
                  <th style={TH_STYLE}>Notes</th>
                  <th style={{ ...TH_STYLE, textAlign: "center", width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {productLines.map((pl) => (
                  <tr key={pl.id}
                    style={{ transition: "background .12s" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td style={TD_STYLE}>
                      <input
                        className="input"
                        value={pl.product}
                        onChange={(e) => updateProductLine(pl.id, "product", e.target.value)}
                        placeholder="Product or category name"
                        style={{ padding: ".35rem .6rem", fontSize: ".88rem" }}
                      />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "flex-end" }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          value={pl.rate}
                          onChange={(e) => updateProductLine(pl.id, "rate", Number(e.target.value))}
                          style={{ padding: ".35rem .6rem", fontSize: ".88rem", width: 70, textAlign: "right" }}
                        />
                        <span className="muted" style={{ fontSize: ".85rem" }}>%</span>
                      </div>
                    </td>
                    <td style={TD_STYLE}>
                      <input
                        className="input"
                        value={pl.notes}
                        onChange={(e) => updateProductLine(pl.id, "notes", e.target.value)}
                        placeholder="Optional note"
                        style={{ padding: ".35rem .6rem", fontSize: ".88rem" }}
                      />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <button
                        onClick={() => removeProductLine(pl.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4, lineHeight: 0, borderRadius: 6 }}
                        title="Remove product line"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem" }}>
            <div style={{ padding: ".6rem 1rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, fontSize: ".8rem", color: "#92400e" }}>
              ⚡ Product rates override tier rates when both apply
            </div>
            <button className="btn-outline" onClick={addProductLine} style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>
              <Plus size={14} /> Add Product Line
            </button>
          </div>
        </Section>

        {/* ── Section 4: SPIFs ───────────────────────────────────────────── */}
        <Section
          title="SPIFs & Time-Limited Incentives"
          subtitle="Create short-term performance incentives with defined start/end dates, eligible partners, and bonus structures."
          icon={Zap}
        >
          {/* SPIF cards */}
          {spifs.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", border: "2px dashed var(--border)", borderRadius: 8 }}>
              <Zap size={28} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
              <p style={{ fontWeight: 600, fontSize: ".9rem" }}>No SPIFs yet</p>
              <p className="muted" style={{ fontSize: ".82rem", marginTop: ".25rem" }}>Create your first time-limited incentive to boost partner performance</p>
            </div>
          )}

          {spifs.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {spifs.map((spif) => {
                const status = spifStatus(spif);
                const meta = STATUS_STYLES[status];
                const StatusIcon = meta.icon;
                return (
                  <div
                    key={spif.id}
                    style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: ".75rem", background: spif.active ? "var(--bg)" : "var(--subtle)", opacity: spif.active ? 1 : 0.7 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{spif.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginTop: ".3rem" }}>
                          <span style={{ background: meta.bg, color: meta.color, padding: ".15rem .5rem", borderRadius: 5, fontSize: ".72rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: ".25rem" }}>
                            <StatusIcon size={11} /> {status}
                          </span>
                          {spif.startDate && spif.endDate && (
                            <span className="muted" style={{ fontSize: ".75rem" }}>{spif.startDate} → {spif.endDate}</span>
                          )}
                        </div>
                      </div>
                      <Toggle checked={spif.active} onChange={() => toggleSpif(spif.id)} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: ".3rem", fontSize: ".82rem" }}>
                      <div style={{ display: "flex", gap: ".5rem" }}>
                        <span className="muted" style={{ minWidth: 70 }}>Bonus:</span>
                        <span style={{ fontWeight: 600 }}>
                          {spif.bonusType === "multiplier"
                            ? `${spif.multiplier}× commission multiplier`
                            : `$${spif.flatAmount.toLocaleString()} flat per deal`}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: ".5rem" }}>
                        <span className="muted" style={{ minWidth: 70 }}>Products:</span>
                        <span>{spif.products.length === 0 ? "All" : spif.products.join(", ")}</span>
                      </div>
                      <div style={{ display: "flex", gap: ".5rem" }}>
                        <span className="muted" style={{ minWidth: 70 }}>Tiers:</span>
                        <span>{spif.tiers.length === 0 ? "All" : spif.tiers.join(", ")}</span>
                      </div>
                      {spif.maxPayout && (
                        <div style={{ display: "flex", gap: ".5rem" }}>
                          <span className="muted" style={{ minWidth: 70 }}>Cap:</span>
                          <span>${Number(spif.maxPayout).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: ".5rem", borderTop: "1px solid var(--border)", paddingTop: ".6rem" }}>
                      <button
                        className="btn-outline"
                        style={{ fontSize: ".78rem", padding: ".3rem .7rem", flex: 1 }}
                        onClick={() => openEditSpif(spif)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeSpif(spif.id)}
                        style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: ".3rem .6rem", cursor: "pointer", color: "var(--muted)", fontSize: ".78rem" }}
                        title="Delete SPIF"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-outline" onClick={openCreateSpif} style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>
              <Plus size={14} /> Create SPIF
            </button>
          </div>
        </Section>

        {/* ── Section 5: Advanced Rules ──────────────────────────────────── */}
        <Section
          title="Advanced Rules"
          subtitle="Fine-tune commission behavior with clawbacks, recurring commissions, deal thresholds, and split logic."
          icon={ChevronDown}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Clawback */}
            <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: 8, background: clawbackEnabled ? "var(--bg)" : "var(--subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Commission clawback</p>
                  <p className="muted" style={{ fontSize: ".78rem" }}>Claw back commissions if customer churns within X months</p>
                </div>
                <Toggle checked={clawbackEnabled} onChange={setClawbackEnabled} />
              </div>
              {clawbackEnabled && (
                <div style={{ marginTop: ".9rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".4rem" }}>
                    <label style={{ fontSize: ".84rem", fontWeight: 500 }}>Clawback window</label>
                    <span style={{ fontWeight: 700, fontSize: ".9rem", color: "#6366f1" }}>{clawbackMonths} month{clawbackMonths !== 1 ? "s" : ""}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={clawbackMonths}
                    onChange={(e) => setClawbackMonths(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#6366f1" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="muted" style={{ fontSize: ".72rem" }}>0 mo</span>
                    <span className="muted" style={{ fontSize: ".72rem" }}>12 mo</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recurring commissions */}
            <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: 8, background: recurringEnabled ? "var(--bg)" : "var(--subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Recurring commissions</p>
                  <p className="muted" style={{ fontSize: ".78rem" }}>Pay ongoing commission for subscription renewals</p>
                </div>
                <Toggle checked={recurringEnabled} onChange={setRecurringEnabled} />
              </div>
              {recurringEnabled && (
                <div style={{ marginTop: ".9rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <label style={{ fontSize: ".84rem", fontWeight: 500, whiteSpace: "nowrap" }}>Renewal rate:</label>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={recurringRate}
                    onChange={(e) => setRecurringRate(Number(e.target.value))}
                    style={{ width: 80, padding: ".35rem .6rem", textAlign: "center" }}
                  />
                  <span className="muted">% of initial commission rate</span>
                  <span className="muted" style={{ fontSize: ".78rem" }}>
                    (→ {((globalRate * recurringRate) / 100).toFixed(1)}% effective)
                  </span>
                </div>
              )}
            </div>

            {/* Min deal size & commission cap */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: 8 }}>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".5rem" }}>Minimum deal size for commission</label>
                <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                  <span className="muted">$</span>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    step={100}
                    value={minDealSize}
                    onChange={(e) => setMinDealSize(Number(e.target.value))}
                    style={{ padding: ".4rem .6rem" }}
                    placeholder="0"
                  />
                </div>
                <p className="muted" style={{ fontSize: ".75rem", marginTop: ".35rem" }}>Deals below this amount earn no commission</p>
              </div>
              <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: 8 }}>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".5rem" }}>Commission cap per partner / quarter</label>
                <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                  <span className="muted">$</span>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    step={1000}
                    value={commissionCap}
                    onChange={(e) => setCommissionCap(e.target.value)}
                    style={{ padding: ".4rem .6rem" }}
                    placeholder="No cap"
                  />
                </div>
                <p className="muted" style={{ fontSize: ".75rem", marginTop: ".35rem" }}>Leave blank to apply no cap</p>
              </div>
            </div>

            {/* Split proportionally */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".8rem 1rem", border: "1px solid var(--border)", borderRadius: 8, background: splitProportionally ? "var(--bg)" : "var(--subtle)" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Proportional attribution split</p>
                <p className="muted" style={{ fontSize: ".78rem" }}>When multiple partners are attributed, split commission proportionally to attribution %</p>
              </div>
              <Toggle checked={splitProportionally} onChange={setSplitProportionally} />
            </div>
          </div>
        </Section>

        {/* Save button */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "2rem" }}>
          <button className="btn" onClick={handleSave} style={{ padding: ".7rem 2rem" }}>
            <CheckCircle size={15} /> Save Commission Structure
          </button>
        </div>
      </div>

      {/* ── SPIF Form Modal ────────────────────────────────────────────────── */}
      {showSpifForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setShowSpifForm(false)}
        >
          <div
            className="card"
            style={{ width: 540, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{editingSpif ? "Edit SPIF" : "Create SPIF"}</h2>
              <button onClick={() => setShowSpifForm(false)} style={{ background: "none", border: "none", cursor: "pointer", lineHeight: 0 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".35rem" }}>SPIF Name *</label>
                <input
                  className="input"
                  value={spifForm.name}
                  onChange={(e) => setSpifForm({ ...spifForm, name: e.target.value })}
                  placeholder="e.g. Q2 Software Push"
                />
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".35rem" }}>Start Date</label>
                  <input
                    className="input"
                    type="date"
                    value={spifForm.startDate}
                    onChange={(e) => setSpifForm({ ...spifForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".35rem" }}>End Date</label>
                  <input
                    className="input"
                    type="date"
                    value={spifForm.endDate}
                    onChange={(e) => setSpifForm({ ...spifForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Products */}
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".35rem" }}>
                  Applicable Products&nbsp;
                  <span className="muted" style={{ fontSize: ".78rem", fontWeight: 400 }}>(leave empty for All)</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                  {ALL_PRODUCTS.map((prod) => {
                    const sel = spifForm.products.includes(prod);
                    return (
                      <button
                        key={prod}
                        onClick={() => setSpifForm({ ...spifForm, products: toggleMultiSelect(spifForm.products, prod) })}
                        style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", border: sel ? "2px solid #6366f1" : "1px solid var(--border)", background: sel ? "#eef2ff" : "var(--bg)", color: sel ? "#4338ca" : "var(--fg)" }}
                      >
                        {prod}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tiers */}
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".35rem" }}>
                  Applicable Partner Tiers&nbsp;
                  <span className="muted" style={{ fontSize: ".78rem", fontWeight: 400 }}>(leave empty for All)</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                  {ALL_TIERS.map((tier) => {
                    const sel = spifForm.tiers.includes(tier);
                    return (
                      <button
                        key={tier}
                        onClick={() => setSpifForm({ ...spifForm, tiers: toggleMultiSelect(spifForm.tiers, tier) })}
                        style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", border: sel ? "2px solid #6366f1" : "1px solid var(--border)", background: sel ? "#eef2ff" : "var(--bg)", color: sel ? "#4338ca" : "var(--fg)" }}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bonus type */}
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".5rem" }}>Bonus Type</label>
                <div style={{ display: "flex", gap: ".75rem", marginBottom: ".75rem" }}>
                  {(["multiplier", "flat"] as BonusType[]).map((bt) => (
                    <button
                      key={bt}
                      onClick={() => setSpifForm({ ...spifForm, bonusType: bt })}
                      style={{ flex: 1, padding: ".5rem", borderRadius: 8, fontSize: ".85rem", fontWeight: 600, cursor: "pointer", border: spifForm.bonusType === bt ? "2px solid #6366f1" : "1px solid var(--border)", background: spifForm.bonusType === bt ? "#eef2ff" : "var(--bg)", color: spifForm.bonusType === bt ? "#4338ca" : "var(--fg)" }}
                    >
                      {bt === "multiplier" ? "⚡ Multiplier" : "💵 Flat Bonus"}
                    </button>
                  ))}
                </div>

                {spifForm.bonusType === "multiplier" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <label style={{ fontSize: ".84rem", fontWeight: 500 }}>Multiplier:</label>
                    {([1.5, 2, 2.5, 3] as number[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSpifForm({ ...spifForm, multiplier: m })}
                        style={{ padding: ".3rem .65rem", borderRadius: 7, fontSize: ".85rem", fontWeight: 700, cursor: "pointer", border: spifForm.multiplier === m ? "2px solid #6366f1" : "1px solid var(--border)", background: spifForm.multiplier === m ? "#eef2ff" : "var(--bg)", color: spifForm.multiplier === m ? "#4338ca" : "var(--fg)" }}
                      >
                        {m}×
                      </button>
                    ))}
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={10}
                      step={0.5}
                      value={spifForm.multiplier}
                      onChange={(e) => setSpifForm({ ...spifForm, multiplier: Number(e.target.value) })}
                      placeholder="custom"
                      style={{ width: 80, padding: ".35rem .6rem" }}
                    />
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <label style={{ fontSize: ".84rem", fontWeight: 500 }}>Amount per deal:</label>
                    <span className="muted">$</span>
                    <input
                      className="input"
                      type="number"
                      min={0}
                      step={100}
                      value={spifForm.flatAmount}
                      onChange={(e) => setSpifForm({ ...spifForm, flatAmount: Number(e.target.value) })}
                      placeholder="500"
                      style={{ width: 120, padding: ".35rem .6rem" }}
                    />
                  </div>
                )}
              </div>

              {/* Max payout */}
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".35rem" }}>Max Payout Cap (optional)</label>
                <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                  <span className="muted">$</span>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    step={1000}
                    value={spifForm.maxPayout}
                    onChange={(e) => setSpifForm({ ...spifForm, maxPayout: e.target.value })}
                    placeholder="No cap"
                    style={{ maxWidth: 180 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowSpifForm(false)}>Cancel</button>
                <button
                  className="btn"
                  style={{ flex: 1 }}
                  onClick={saveSpif}
                  disabled={!spifForm.name}
                >
                  {editingSpif ? "Update SPIF" : "Create SPIF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
