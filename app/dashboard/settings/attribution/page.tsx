"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/toast";
import { MODEL_LABELS, type AttributionModel } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ─── Local types ─────────────────────────────────────────────────────────────

type PartnerTypeKey = "reseller" | "referral" | "integration" | "technology";

const PARTNER_TYPE_LABELS: Record<PartnerTypeKey, string> = {
  reseller: "Reseller",
  referral: "Referral",
  integration: "Integration Partner",
  technology: "Technology Partner",
};

const PARTNER_TYPES = Object.keys(PARTNER_TYPE_LABELS) as PartnerTypeKey[];

const ATTRIBUTION_MODELS: AttributionModel[] = [
  "equal_split",
  "first_touch",
  "last_touch",
  "time_decay",
  "role_based",
];

type TouchpointConfig = {
  id: string;
  name: string;
  weight: number;
  active: boolean;
  custom?: boolean;
  expandedOverrides: boolean;
  partnerOverrides: Partial<Record<PartnerTypeKey, number>>;
};

type AttributionRule = {
  id: string;
  touchpointType: string;
  partnerType: PartnerTypeKey;
  weightPercent: number;
};

const DEFAULT_TOUCHPOINTS: TouchpointConfig[] = [
  { id: "deal_registration", name: "Deal Registration", weight: 80, active: true, expandedOverrides: false, partnerOverrides: {} },
  { id: "demo_poc", name: "Demo / POC", weight: 70, active: true, expandedOverrides: false, partnerOverrides: {} },
  { id: "technical_evaluation", name: "Technical Evaluation", weight: 60, active: true, expandedOverrides: false, partnerOverrides: {} },
  { id: "referral", name: "Referral", weight: 50, active: true, expandedOverrides: false, partnerOverrides: {} },
  { id: "content_share", name: "Content Share", weight: 20, active: true, expandedOverrides: false, partnerOverrides: {} },
  { id: "event", name: "Event", weight: 30, active: true, expandedOverrides: false, partnerOverrides: {} },
  { id: "training", name: "Training", weight: 40, active: true, expandedOverrides: false, partnerOverrides: {} },
  { id: "support_ticket", name: "Support Ticket", weight: 15, active: false, expandedOverrides: false, partnerOverrides: {} },
];

// ─── Decay curve SVG ──────────────────────────────────────────────────────────

function DecayCurve({ halfLife }: { halfLife: number }) {
  const W = 480;
  const H = 130;
  const PAD = { top: 12, right: 20, bottom: 32, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxDays = Math.max(halfLife * 5, 90);

  const points: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * maxDays;
    const weight = Math.pow(0.5, t / halfLife);
    const x = PAD.left + (t / maxDays) * innerW;
    const y = PAD.top + (1 - weight) * innerH;
    points.push([x, y]);
  }

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");

  // Area fill path (close at bottom)
  const areaD =
    pathD +
    ` L ${(PAD.left + innerW).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${PAD.left} ${(PAD.top + innerH).toFixed(1)} Z`;

  const hlX = PAD.left + (halfLife / maxDays) * innerW;
  const hlY = PAD.top + 0.5 * innerH;

  const yLabels = [1, 0.75, 0.5, 0.25, 0];
  const xTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Grid */}
      {yLabels.map((pct) => {
        const y = PAD.top + (1 - pct) * innerH;
        return (
          <g key={pct}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#2a2a2a" strokeWidth={1} strokeDasharray="3,3" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={9} fill="#555">
              {Math.round(pct * 100)}%
            </text>
          </g>
        );
      })}

      {/* Axes */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#444" strokeWidth={1} />
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#444" strokeWidth={1} />

      {/* X labels */}
      {xTicks.map((pct) => {
        const x = PAD.left + pct * innerW;
        const days = Math.round(pct * maxDays);
        return (
          <text key={pct} x={x} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={9} fill="#555">
            {days}d
          </text>
        );
      })}

      {/* Area */}
      <path d={areaD} fill="url(#curveGrad)" />

      {/* Curve */}
      <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinejoin="round" />

      {/* Half-life marker */}
      <line x1={hlX} y1={PAD.top} x2={hlX} y2={H - PAD.bottom} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3" />
      <circle cx={hlX} cy={hlY} r={4} fill="#f59e0b" />
      <text x={hlX + 6} y={hlY - 5} fontSize={9} fill="#f59e0b" fontWeight={600}>
        50% @ {halfLife}d
      </text>
    </svg>
  );
}

// ─── Shared style tokens ──────────────────────────────────────────────────────

const card: React.CSSProperties = {
  padding: "1.5rem",
  borderRadius: 12,
  background: "#1a1a1a",
  border: "1px solid #333",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 700,
  marginBottom: "1.25rem",
  color: "#fff",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.9rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  color: "#fff",
};

const muted: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#a0a0a0",
  lineHeight: 1.5,
};

const selectStyle: React.CSSProperties = {
  padding: "0.6rem 0.85rem",
  borderRadius: 8,
  border: "1px solid #333",
  background: "#000",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  cursor: "pointer",
};

const sliderStyle: React.CSSProperties = {
  width: "100%",
  accentColor: "#6366f1",
  cursor: "pointer",
};

const tableHeader: React.CSSProperties = {
  textAlign: "left",
  padding: "0.6rem 1rem",
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "#a0a0a0",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AttributionSettingsPage() {
  const { toast } = useToast();

  // ── Section 1 ──────────────────────────────────────────────────────────────
  const [defaultModel, setDefaultModel] = useState<AttributionModel>("equal_split");
  const [partnerModelOverrides, setPartnerModelOverrides] = useState<
    Record<PartnerTypeKey, AttributionModel | "">
  >({ reseller: "", referral: "", integration: "", technology: "" });

  // ── Section 2 ──────────────────────────────────────────────────────────────
  const [lookbackDays, setLookbackDays] = useState(90);
  const [halfLife, setHalfLife] = useState(30);

  // ── Section 3 ──────────────────────────────────────────────────────────────
  const [touchpoints, setTouchpoints] = useState<TouchpointConfig[]>(DEFAULT_TOUCHPOINTS);
  const [showAddTouchpoint, setShowAddTouchpoint] = useState(false);
  const [newTpName, setNewTpName] = useState("");
  const [newTpWeight, setNewTpWeight] = useState(50);

  // ── Section 4 ──────────────────────────────────────────────────────────────
  const [rules, setRules] = useState<AttributionRule[]>([]);
  const [showTestTooltip, setShowTestTooltip] = useState(false);

  // ── Section 5 ──────────────────────────────────────────────────────────────
  const [dealRegFloor, setDealRegFloor] = useState(20);
  const [coSellSplit, setCoSellSplit] = useState(50);
  const [autoFlagDisputes, setAutoFlagDisputes] = useState(true);
  const [conflictPriority, setConflictPriority] = useState<"deal_reg_first" | "recency_first">(
    "deal_reg_first"
  );

  // ── Touchpoint helpers ─────────────────────────────────────────────────────
  function updateTouchpoint(id: string, updates: Partial<TouchpointConfig>) {
    setTouchpoints((prev) => prev.map((tp) => (tp.id === id ? { ...tp, ...updates } : tp)));
  }

  function addCustomTouchpoint() {
    if (!newTpName.trim()) return;
    setTouchpoints((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: newTpName.trim(),
        weight: newTpWeight,
        active: true,
        custom: true,
        expandedOverrides: false,
        partnerOverrides: {},
      },
    ]);
    setNewTpName("");
    setNewTpWeight(50);
    setShowAddTouchpoint(false);
  }

  function removeTouchpoint(id: string) {
    setTouchpoints((prev) => prev.filter((tp) => tp.id !== id));
  }

  // ── Rule helpers ───────────────────────────────────────────────────────────
  function addRule() {
    setRules((prev) => [
      ...prev,
      {
        id: `rule_${Date.now()}`,
        touchpointType: touchpoints[0]?.id ?? "deal_registration",
        partnerType: "reseller",
        weightPercent: 100,
      },
    ]);
  }

  function updateRule(id: string, updates: Partial<AttributionRule>) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }

  function removeRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function moveRule(id: string, dir: "up" | "down") {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (dir === "up" && idx > 0) {
        const next = [...prev];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      }
      if (dir === "down" && idx < prev.length - 1) {
        const next = [...prev];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        return next;
      }
      return prev;
    });
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  function handleSave() {
    toast("Attribution configuration saved successfully");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 880 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Attribution Settings
        </h1>
        <p style={{ ...muted, marginTop: "0.25rem", fontSize: "0.9rem" }}>
          Configure how partner credit is calculated and distributed across your deals
        </p>
      </div>

      {/* ── Section 1: Default Attribution Model ── */}
      <div style={card}>
        <h2 style={sectionTitle}>1 — Default Attribution Model</h2>

        {/* Org-wide default */}
        <div style={{ marginBottom: "1.75rem" }}>
          <label style={label}>Org-Wide Default Model</label>
          <select
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value as AttributionModel)}
            style={{ ...selectStyle, minWidth: 260 }}
          >
            {ATTRIBUTION_MODELS.map((m) => (
              <option key={m} value={m}>
                {MODEL_LABELS[m]}
              </option>
            ))}
          </select>
          <p style={{ ...muted, marginTop: "0.4rem" }}>
            Applied to all deals unless a per-partner-type override is set below.
          </p>
        </div>

        {/* Per-partner-type overrides */}
        <div>
          <label style={{ ...label, marginBottom: "0.5rem" }}>Per-Partner-Type Overrides</label>
          <p style={{ ...muted, marginBottom: "0.75rem" }}>
            When no override is set, the org default ({MODEL_LABELS[defaultModel]}) applies.
          </p>
          <div style={{ border: "1px solid #2d2d2d", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #2d2d2d", background: "#111" }}>
                  <th style={tableHeader}>Partner Type</th>
                  <th style={tableHeader}>Attribution Model</th>
                </tr>
              </thead>
              <tbody>
                {PARTNER_TYPES.map((pt, i) => (
                  <tr
                    key={pt}
                    style={{ borderBottom: i < PARTNER_TYPES.length - 1 ? "1px solid #222" : "none" }}
                  >
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 500, fontSize: "0.9rem" }}>
                      {PARTNER_TYPE_LABELS[pt]}
                    </td>
                    <td style={{ padding: "0.6rem 1rem" }}>
                      <select
                        value={partnerModelOverrides[pt]}
                        onChange={(e) =>
                          setPartnerModelOverrides((prev) => ({
                            ...prev,
                            [pt]: e.target.value as AttributionModel | "",
                          }))
                        }
                        style={{ ...selectStyle, minWidth: 230 }}
                      >
                        <option value="">— Use org default —</option>
                        {ATTRIBUTION_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {MODEL_LABELS[m]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Section 2: Attribution Window ── */}
      <div style={card}>
        <h2 style={sectionTitle}>2 — Attribution Window</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Lookback period */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ ...label, marginBottom: 0 }}>Lookback Period</label>
              <span style={{ fontWeight: 700, color: "#6366f1", fontSize: "0.95rem" }}>
                {lookbackDays} days
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={365}
              step={5}
              value={lookbackDays}
              onChange={(e) => setLookbackDays(Number(e.target.value))}
              style={sliderStyle}
            />
            <div style={{ display: "flex", justifyContent: "space-between", ...muted, marginTop: 4 }}>
              <span>30 days</span>
              <span>Touchpoints older than this window are excluded from attribution</span>
              <span>365 days</span>
            </div>
          </div>

          {/* Time-decay half-life */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ ...label, marginBottom: 0 }}>Time Decay Half-Life</label>
              <span style={{ fontWeight: 700, color: "#6366f1", fontSize: "0.95rem" }}>
                {halfLife} days
              </span>
            </div>
            <input
              type="range"
              min={7}
              max={90}
              step={1}
              value={halfLife}
              onChange={(e) => setHalfLife(Number(e.target.value))}
              style={sliderStyle}
            />
            <p style={{ ...muted, marginTop: 4 }}>
              Touchpoints lose half their weight every {halfLife} days — applied when using the Time Decay
              model.
            </p>
          </div>

          {/* Decay curve preview */}
          <div>
            <p style={{ ...label, marginBottom: "0.75rem" }}>Decay Curve Preview</p>
            <div
              style={{
                background: "#0d0d0d",
                borderRadius: 10,
                border: "1px solid #2a2a2a",
                padding: "1rem 1rem 0.5rem",
              }}
            >
              <DecayCurve halfLife={halfLife} />
              <p style={{ ...muted, textAlign: "center", marginTop: "0.25rem" }}>
                At <strong style={{ color: "#f59e0b" }}>{halfLife}d</strong> a touchpoint retains 50%
                of its weight · At{" "}
                <strong style={{ color: "#f59e0b" }}>{halfLife * 2}d</strong> it retains 25%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Touchpoint Configuration ── */}
      <div style={card}>
        <h2 style={sectionTitle}>3 — Touchpoint Configuration</h2>

        <div style={{ border: "1px solid #2d2d2d", borderRadius: 10, overflow: "hidden", marginBottom: "1rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2d2d2d", background: "#111" }}>
                <th style={tableHeader}>Name</th>
                <th style={{ ...tableHeader, width: 240 }}>Weight (0 – 100)</th>
                <th style={{ ...tableHeader, textAlign: "center" }}>Active</th>
                <th style={{ ...tableHeader, textAlign: "center" }}>Overrides</th>
                <th style={{ width: 36 }} />
              </tr>
            </thead>
            <tbody>
              {touchpoints.map((tp, i) => (
                <>
                  {/* Main row */}
                  <tr
                    key={tp.id}
                    style={{
                      borderBottom:
                        tp.expandedOverrides || i < touchpoints.length - 1
                          ? "1px solid #222"
                          : "none",
                      opacity: tp.active ? 1 : 0.55,
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 500, fontSize: "0.9rem" }}>
                      {tp.name}
                      {tp.custom && (
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: "0.7rem",
                            background: "#1e1b4b",
                            color: "#818cf8",
                            padding: "1px 6px",
                            borderRadius: 4,
                          }}
                        >
                          Custom
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={tp.weight}
                          disabled={!tp.active}
                          onChange={(e) => updateTouchpoint(tp.id, { weight: Number(e.target.value) })}
                          style={{ ...sliderStyle, flex: 1 }}
                        />
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: tp.active ? "#6366f1" : "#444",
                            minWidth: 26,
                            textAlign: "right",
                          }}
                        >
                          {tp.weight}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                      <button
                        onClick={() => updateTouchpoint(tp.id, { active: !tp.active })}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "inline-flex" }}
                      >
                        {tp.active ? (
                          <ToggleRight size={24} color="#059669" />
                        ) : (
                          <ToggleLeft size={24} color="#444" />
                        )}
                      </button>
                    </td>

                    <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                      <button
                        onClick={() => updateTouchpoint(tp.id, { expandedOverrides: !tp.expandedOverrides })}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: tp.expandedOverrides ? "#6366f1" : "#a0a0a0",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: "0.78rem",
                          padding: 4,
                        }}
                      >
                        {tp.expandedOverrides ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        Per-type
                      </button>
                    </td>

                    <td style={{ padding: "0.75rem 0.5rem", textAlign: "center" }}>
                      {tp.custom && (
                        <button
                          onClick={() => removeTouchpoint(tp.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 4, display: "inline-flex" }}
                          title="Remove custom touchpoint"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Per-partner-type weight overrides */}
                  {tp.expandedOverrides && (
                    <tr key={`${tp.id}_overrides`}>
                      <td
                        colSpan={5}
                        style={{
                          background: "#0f0f0f",
                          padding: "0.75rem 1.25rem 1rem 2rem",
                          borderBottom: "1px solid #222",
                        }}
                      >
                        <p style={{ ...muted, marginBottom: "0.75rem" }}>
                          Per-partner-type weight overrides for "{tp.name}" — defaults to the row weight
                          above when not set.
                        </p>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "0.75rem",
                          }}
                        >
                          {PARTNER_TYPES.map((pt) => (
                            <div
                              key={pt}
                              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                            >
                              <span style={{ fontSize: "0.85rem", minWidth: 148, color: "#ccc" }}>
                                {PARTNER_TYPE_LABELS[pt]}
                              </span>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={tp.partnerOverrides[pt] ?? tp.weight}
                                onChange={(e) =>
                                  updateTouchpoint(tp.id, {
                                    partnerOverrides: {
                                      ...tp.partnerOverrides,
                                      [pt]: Number(e.target.value),
                                    },
                                  })
                                }
                                style={{ ...sliderStyle, flex: 1 }}
                              />
                              <span
                                style={{
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                  color: "#6366f1",
                                  minWidth: 26,
                                  textAlign: "right",
                                }}
                              >
                                {tp.partnerOverrides[pt] ?? tp.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add custom touchpoint */}
        {showAddTouchpoint ? (
          <div
            style={{
              border: "1px solid #333",
              borderRadius: 10,
              padding: "1rem 1.25rem",
              background: "#111",
              marginBottom: "0.5rem",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.75rem" }}>
              Add Custom Touchpoint
            </p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ ...muted, display: "block", marginBottom: 4 }}>Name</label>
                <input
                  className="input"
                  value={newTpName}
                  onChange={(e) => setNewTpName(e.target.value)}
                  placeholder="e.g. Partner Webinar"
                  onKeyDown={(e) => e.key === "Enter" && addCustomTouchpoint()}
                  autoFocus
                />
              </div>
              <div style={{ width: 180 }}>
                <label style={{ ...muted, display: "block", marginBottom: 4 }}>
                  Default Weight: {newTpWeight}
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={newTpWeight}
                  onChange={(e) => setNewTpWeight(Number(e.target.value))}
                  style={sliderStyle}
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn"
                  onClick={addCustomTouchpoint}
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Add
                </button>
                <button
                  className="btn-outline"
                  onClick={() => {
                    setShowAddTouchpoint(false);
                    setNewTpName("");
                  }}
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="btn-outline"
            onClick={() => setShowAddTouchpoint(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
          >
            <Plus size={14} />
            Add Custom Touchpoint
          </button>
        )}
      </div>

      {/* ── Section 4: Custom Attribution Rules ── */}
      <div style={card}>
        <h2 style={{ ...sectionTitle, marginBottom: "0.5rem" }}>
          4 — Custom Attribution Rules
        </h2>
        <p style={{ ...muted, marginBottom: "1.25rem" }}>
          Rules override the default model when conditions match. Higher-priority rules (lower number)
          are evaluated first.
        </p>

        {rules.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 1rem",
              border: "1px dashed #333",
              borderRadius: 10,
              color: "#a0a0a0",
              fontSize: "0.88rem",
              marginBottom: "1rem",
            }}
          >
            No custom rules yet. Add a rule to override attribution for specific touchpoint + partner
            combinations.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
            {rules.map((rule, idx) => (
              <div
                key={rule.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.75rem 1rem",
                  background: "#111",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                  flexWrap: "wrap",
                }}
              >
                {/* Priority badge */}
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: "#1e1b4b",
                    color: "#818cf8",
                    padding: "2px 8px",
                    borderRadius: 12,
                    minWidth: 32,
                    textAlign: "center",
                  }}
                >
                  #{idx + 1}
                </span>

                <span style={{ fontSize: "0.82rem", color: "#a0a0a0", fontWeight: 600 }}>IF</span>

                <select
                  value={rule.touchpointType}
                  onChange={(e) => updateRule(rule.id, { touchpointType: e.target.value })}
                  style={{ ...selectStyle, fontSize: "0.85rem" }}
                >
                  {touchpoints.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.name}
                    </option>
                  ))}
                </select>

                <span style={{ fontSize: "0.82rem", color: "#a0a0a0", fontWeight: 600 }}>AND</span>

                <select
                  value={rule.partnerType}
                  onChange={(e) =>
                    updateRule(rule.id, { partnerType: e.target.value as PartnerTypeKey })
                  }
                  style={{ ...selectStyle, fontSize: "0.85rem" }}
                >
                  {PARTNER_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {PARTNER_TYPE_LABELS[pt]}
                    </option>
                  ))}
                </select>

                <span style={{ fontSize: "0.82rem", color: "#a0a0a0", fontWeight: 600 }}>THEN</span>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={rule.weightPercent}
                    onChange={(e) => updateRule(rule.id, { weightPercent: Number(e.target.value) })}
                    style={{
                      ...selectStyle,
                      width: 72,
                      textAlign: "center",
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#a0a0a0" }}>%</span>
                </div>

                {/* Reorder + delete */}
                <div
                  style={{ display: "flex", gap: "0.2rem", marginLeft: "auto", alignItems: "center" }}
                >
                  <button
                    onClick={() => moveRule(rule.id, "up")}
                    disabled={idx === 0}
                    title="Move up"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: idx === 0 ? "not-allowed" : "pointer",
                      color: idx === 0 ? "#333" : "#888",
                      padding: 4,
                      display: "inline-flex",
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveRule(rule.id, "down")}
                    disabled={idx === rules.length - 1}
                    title="Move down"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: idx === rules.length - 1 ? "not-allowed" : "pointer",
                      color: idx === rules.length - 1 ? "#333" : "#888",
                      padding: 4,
                      display: "inline-flex",
                    }}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => removeRule(rule.id)}
                    title="Remove rule"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#555",
                      padding: 4,
                      display: "inline-flex",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            className="btn-outline"
            onClick={addRule}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
          >
            <Plus size={14} />
            Add Rule
          </button>

          {/* Test against sample data — placeholder */}
          <div style={{ position: "relative" }}>
            <button
              className="btn-outline"
              style={{ fontSize: "0.85rem", opacity: 0.65, cursor: "default" }}
              onMouseEnter={() => setShowTestTooltip(true)}
              onMouseLeave={() => setShowTestTooltip(false)}
            >
              🧪 Test Against Sample Data
            </button>
            {showTestTooltip && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 8,
                  padding: "0.45rem 0.8rem",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  color: "#a0a0a0",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                🚧 Coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 5: Deal Registration & Conflict Rules ── */}
      <div style={card}>
        <h2 style={sectionTitle}>5 — Deal Registration & Conflict Rules</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Credit floor */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ ...label, marginBottom: 0 }}>Deal Registration Credit Floor</label>
              <span style={{ fontWeight: 700, color: "#6366f1", fontSize: "0.95rem" }}>
                {dealRegFloor}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={dealRegFloor}
              onChange={(e) => setDealRegFloor(Number(e.target.value))}
              style={sliderStyle}
            />
            <div style={{ display: "flex", justifyContent: "space-between", ...muted, marginTop: 4 }}>
              <span>0%</span>
              <span>Registering partner always gets at least {dealRegFloor}% of attribution</span>
              <span>50%</span>
            </div>
          </div>

          {/* Co-sell split */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ ...label, marginBottom: 0 }}>Co-Sell Default Split</label>
              <span style={{ fontWeight: 700, color: "#6366f1", fontSize: "0.95rem" }}>
                {coSellSplit}% / {100 - coSellSplit}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={coSellSplit}
              onChange={(e) => setCoSellSplit(Number(e.target.value))}
              style={sliderStyle}
            />
            <p style={{ ...muted, marginTop: 4 }}>
              When 2+ partners both have approved deal registrations: primary partner gets{" "}
              {coSellSplit}%, secondary gets {100 - coSellSplit}%.
            </p>
          </div>

          {/* Dispute escalation toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.1rem",
              background: "#111",
              borderRadius: 10,
              border: "1px solid #2a2a2a",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.2rem" }}>
                Auto-Flag Disputes
              </p>
              <p style={muted}>
                Automatically flag deals with more than 3 partner claims for manual review
              </p>
            </div>
            <button
              onClick={() => setAutoFlagDisputes(!autoFlagDisputes)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, display: "inline-flex" }}
            >
              {autoFlagDisputes ? (
                <ToggleRight size={30} color="#059669" />
              ) : (
                <ToggleLeft size={30} color="#444" />
              )}
            </button>
          </div>

          {/* Conflict priority */}
          <div>
            <label style={label}>Conflict Priority Order</label>
            <select
              value={conflictPriority}
              onChange={(e) => setConflictPriority(e.target.value as typeof conflictPriority)}
              style={{ ...selectStyle, minWidth: 300 }}
            >
              <option value="deal_reg_first">Deal Registration › Recency</option>
              <option value="recency_first">Recency › Deal Registration</option>
            </select>
            <p style={{ ...muted, marginTop: "0.4rem" }}>
              Determines which signal takes precedence when resolving attribution conflicts between
              partners.
            </p>
          </div>
        </div>
      </div>

      {/* Save Configuration */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: "2.5rem",
        }}
      >
        <button
          className="btn"
          onClick={handleSave}
          style={{ padding: "0.75rem 2.25rem", fontSize: "0.95rem", fontWeight: 700 }}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
