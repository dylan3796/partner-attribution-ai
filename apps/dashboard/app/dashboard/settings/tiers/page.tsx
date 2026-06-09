"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Trophy,
  Settings2,
  DollarSign,
  Award,
  Star,
  Shield,
} from "lucide-react";

type CustomCriterion = {
  id: string;
  label: string;
  threshold: string;
};

type TierBenefits = {
  mdfBudget: string;
  mdfUnlimited: boolean;
  dealPriority: "High" | "Medium" | "Low";
  commissionRate: string;
  coSellSupport: string;
  portalBadge: string;
};

type Tier = {
  id: string;
  name: string;
  color: string;
  minARR: string;
  minDealCount: string;
  minCertifications: string;
  minActivityScore: string;
  customCriteria: CustomCriterion[];
  benefits: TierBenefits;
};

const TIER_COLORS = [
  "#cd7f32",
  "#c0c0c0",
  "#ffd700",
  "#e2e8f0",
  "#3b82f6",
  "#059669",
  "#7c3aed",
  "#dc2626",
];

const defaultTiers: Tier[] = [
  {
    id: "bronze",
    name: "Bronze",
    color: "#cd7f32",
    minARR: "0",
    minDealCount: "1",
    minCertifications: "0",
    minActivityScore: "10",
    customCriteria: [],
    benefits: {
      mdfBudget: "2500",
      mdfUnlimited: false,
      dealPriority: "Low",
      commissionRate: "5",
      coSellSupport: "Self-service portal",
      portalBadge: "Bronze Partner",
    },
  },
  {
    id: "silver",
    name: "Silver",
    color: "#a0a0a0",
    minARR: "25000",
    minDealCount: "3",
    minCertifications: "1",
    minActivityScore: "30",
    customCriteria: [],
    benefits: {
      mdfBudget: "10000",
      mdfUnlimited: false,
      dealPriority: "Medium",
      commissionRate: "10",
      coSellSupport: "Shared CSM",
      portalBadge: "Silver Partner",
    },
  },
  {
    id: "gold",
    name: "Gold",
    color: "#d97706",
    minARR: "100000",
    minDealCount: "8",
    minCertifications: "2",
    minActivityScore: "55",
    customCriteria: [],
    benefits: {
      mdfBudget: "25000",
      mdfUnlimited: false,
      dealPriority: "High",
      commissionRate: "15",
      coSellSupport: "Dedicated AE",
      portalBadge: "Gold Partner",
    },
  },
  {
    id: "platinum",
    name: "Platinum",
    color: "#6366f1",
    minARR: "500000",
    minDealCount: "20",
    minCertifications: "4",
    minActivityScore: "80",
    customCriteria: [],
    benefits: {
      mdfBudget: "0",
      mdfUnlimited: true,
      dealPriority: "High",
      commissionRate: "20",
      coSellSupport: "Strategic Alliance Manager",
      portalBadge: "Platinum Partner",
    },
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: checked ? "#059669" : "var(--border)",
        cursor: "pointer",
        position: "relative",
        transition: "background .2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }}
      />
    </button>
  );
}

export default function TierCriteriaPage() {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers);
  const [expandedTier, setExpandedTier] = useState<string | null>("gold");
  const [expandedBenefits, setExpandedBenefits] = useState<string | null>(null);
  const [autoPromote, setAutoPromote] = useState(true);
  const [demotionGrace, setDemotionGrace] = useState(30);
  const [notifyOnChange, setNotifyOnChange] = useState(true);

  function addTier() {
    const newTier: Tier = {
      id: `tier-${Date.now()}`,
      name: "New Tier",
      color: TIER_COLORS[tiers.length % TIER_COLORS.length],
      minARR: "0",
      minDealCount: "0",
      minCertifications: "0",
      minActivityScore: "0",
      customCriteria: [],
      benefits: {
        mdfBudget: "0",
        mdfUnlimited: false,
        dealPriority: "Medium",
        commissionRate: "0",
        coSellSupport: "Standard",
        portalBadge: "Partner",
      },
    };
    setTiers([...tiers, newTier]);
    setExpandedTier(newTier.id);
  }

  function removeTier(id: string) {
    setTiers(tiers.filter((t) => t.id !== id));
    if (expandedTier === id) setExpandedTier(null);
  }

  function moveTier(id: string, direction: "up" | "down") {
    const idx = tiers.findIndex((t) => t.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === tiers.length - 1) return;
    const newTiers = [...tiers];
    const swap = direction === "up" ? idx - 1 : idx + 1;
    [newTiers[idx], newTiers[swap]] = [newTiers[swap], newTiers[idx]];
    setTiers(newTiers);
  }

  function updateTier(id: string, updates: Partial<Tier>) {
    setTiers(tiers.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  function updateBenefits(id: string, updates: Partial<TierBenefits>) {
    setTiers(
      tiers.map((t) =>
        t.id === id ? { ...t, benefits: { ...t.benefits, ...updates } } : t
      )
    );
  }

  function addCustomCriterion(tierId: string) {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;
    const newCrit: CustomCriterion = {
      id: `crit-${Date.now()}`,
      label: "",
      threshold: "",
    };
    updateTier(tierId, { customCriteria: [...tier.customCriteria, newCrit] });
  }

  function updateCustomCriterion(
    tierId: string,
    critId: string,
    updates: Partial<CustomCriterion>
  ) {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;
    updateTier(tierId, {
      customCriteria: tier.customCriteria.map((c) =>
        c.id === critId ? { ...c, ...updates } : c
      ),
    });
  }

  function removeCustomCriterion(tierId: string, critId: string) {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;
    updateTier(tierId, {
      customCriteria: tier.customCriteria.filter((c) => c.id !== critId),
    });
  }

  function handleSave() {
    toast("Tier configuration saved successfully");
  }

  const field: React.CSSProperties = {
    padding: ".55rem .8rem",
    borderRadius: 7,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--fg)",
    fontSize: ".875rem",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
  };

  const label: React.CSSProperties = {
    fontSize: ".75rem",
    color: "var(--muted)",
    display: "block",
    marginBottom: ".3rem",
    fontWeight: 500,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              letterSpacing: "-.02em",
            }}
          >
            <Trophy
              size={22}
              style={{
                display: "inline",
                verticalAlign: "-3px",
                marginRight: 8,
                color: "#d97706",
              }}
            />
            Tier Criteria Builder
          </h1>
          <p className="muted" style={{ marginTop: ".25rem" }}>
            Define partner tiers, qualification criteria, and associated
            benefits
          </p>
        </div>
        <button className="btn" onClick={handleSave}>
          <Save size={16} /> Save Configuration
        </button>
      </div>

      {/* Promotion / Demotion Rules */}
      <div className="card">
        <h2
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <Settings2 size={17} /> Promotion &amp; Demotion Rules
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {/* Auto-promote */}
          <div
            style={{
              padding: "1.1rem 1.25rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--subtle)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                marginBottom: ".6rem",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                  Auto-Promote Partners
                </p>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    marginTop: ".2rem",
                    lineHeight: 1.4,
                  }}
                >
                  Automatically move partners to the next tier when all
                  criteria are met
                </p>
              </div>
              <Toggle checked={autoPromote} onChange={setAutoPromote} />
            </div>
            <p
              style={{
                fontSize: ".78rem",
                color: autoPromote ? "#059669" : "var(--muted)",
                fontWeight: 500,
              }}
            >
              {autoPromote
                ? "✓ Auto-promote when all criteria met"
                : "Recommend only — manual promotion required"}
            </p>
          </div>

          {/* Notify on change */}
          <div
            style={{
              padding: "1.1rem 1.25rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--subtle)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                marginBottom: ".6rem",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                  Notify on Tier Change
                </p>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    marginTop: ".2rem",
                    lineHeight: 1.4,
                  }}
                >
                  Send email notification to partner when their tier changes
                </p>
              </div>
              <Toggle checked={notifyOnChange} onChange={setNotifyOnChange} />
            </div>
            <p
              style={{
                fontSize: ".78rem",
                color: notifyOnChange ? "#059669" : "var(--muted)",
                fontWeight: 500,
              }}
            >
              {notifyOnChange
                ? "✓ Partner notified on promotion & demotion"
                : "Silent tier changes"}
            </p>
          </div>

          {/* Demotion grace period */}
          <div
            style={{
              padding: "1.1rem 1.25rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--subtle)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ".75rem",
              }}
            >
              <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                Demotion Grace Period
              </p>
              <span
                style={{ fontWeight: 800, fontSize: "1rem", color: "#d97706" }}
              >
                {demotionGrace} days
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              value={demotionGrace}
              onChange={(e) => setDemotionGrace(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".72rem",
                color: "var(--muted)",
                marginTop: ".3rem",
              }}
            >
              <span>Immediate</span>
              <span>90 days</span>
            </div>
            <p
              style={{
                fontSize: ".78rem",
                color: "var(--muted)",
                marginTop: ".4rem",
                lineHeight: 1.4,
              }}
            >
              Partners retain their tier for {demotionGrace} days after
              falling below criteria
            </p>
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>
              Partner Tiers
            </h2>
            <p
              className="muted"
              style={{ fontSize: ".8rem", marginTop: ".15rem" }}
            >
              Listed lowest → highest. Partners advance through tiers as they
              meet criteria.
            </p>
          </div>
          <button
            className="btn-outline"
            onClick={addTier}
            style={{ fontSize: ".85rem" }}
          >
            <Plus size={15} /> Add Tier
          </button>
        </div>

        {tiers.map((tier, idx) => {
          const isExpanded = expandedTier === tier.id;
          const bExpanded = expandedBenefits === tier.id;

          return (
            <div
              key={tier.id}
              className="card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.5rem",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setExpandedTier(isExpanded ? null : tier.id)
                }
              >
                {/* Up/down */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => moveTier(tier.id, "up")}
                    disabled={idx === 0}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: idx === 0 ? "not-allowed" : "pointer",
                      opacity: idx === 0 ? 0.25 : 0.7,
                      padding: 2,
                      lineHeight: 0,
                    }}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => moveTier(tier.id, "down")}
                    disabled={idx === tiers.length - 1}
                    style={{
                      background: "none",
                      border: "none",
                      cursor:
                        idx === tiers.length - 1 ? "not-allowed" : "pointer",
                      opacity: idx === tiers.length - 1 ? 0.25 : 0.7,
                      padding: 2,
                      lineHeight: 0,
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                {/* Color dot */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: tier.color,
                    flexShrink: 0,
                    boxShadow: `0 0 0 3px ${tier.color}33`,
                  }}
                />

                {/* Name input */}
                <input
                  value={tier.name}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateTier(tier.id, { name: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "transparent",
                    border: "1px solid transparent",
                    borderRadius: 6,
                    padding: ".3rem .5rem",
                    fontSize: ".95rem",
                    fontWeight: 700,
                    color: "var(--fg)",
                    fontFamily: "inherit",
                    outline: "none",
                    width: 150,
                    transition: "border-color .15s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--border)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "transparent")
                  }
                />

                {/* Color swatches */}
                <div
                  style={{ display: "flex", gap: 4 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {TIER_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateTier(tier.id, { color: c })}
                      title={c}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: c,
                        border:
                          tier.color === c
                            ? "2px solid var(--fg)"
                            : "2px solid transparent",
                        cursor: "pointer",
                        padding: 0,
                        transition: "border .15s",
                      }}
                    />
                  ))}
                </div>

                <div style={{ flex: 1 }} />

                {/* Summary */}
                <span
                  className="muted"
                  style={{ fontSize: ".78rem", whiteSpace: "nowrap" }}
                >
                  ARR ≥ ${Number(tier.minARR || 0).toLocaleString()} ·{" "}
                  {tier.minDealCount} deals · Score ≥ {tier.minActivityScore}
                </span>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTier(tier.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted)",
                    padding: 4,
                    lineHeight: 0,
                    opacity: 0.6,
                  }}
                  title="Remove tier"
                >
                  <Trash2 size={14} />
                </button>

                {isExpanded ? (
                  <ChevronUp size={16} color="var(--muted)" />
                ) : (
                  <ChevronDown size={16} color="var(--muted)" />
                )}
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div
                  style={{
                    padding: "1.5rem",
                    borderTop: "1px solid var(--border)",
                    background: "var(--subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  {/* Criteria */}
                  <div>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: ".9rem",
                        marginBottom: ".25rem",
                      }}
                    >
                      Qualification Criteria
                    </h3>
                    <p
                      className="muted"
                      style={{ fontSize: ".8rem", marginBottom: "1rem" }}
                    >
                      Partner must meet ALL requirements to qualify for this
                      tier
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(190px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <label style={label}>
                          <DollarSign
                            size={11}
                            style={{
                              display: "inline",
                              verticalAlign: "-1px",
                              marginRight: 3,
                            }}
                          />
                          Min Attributed ARR ($)
                        </label>
                        <input
                          type="number"
                          value={tier.minARR}
                          onChange={(e) =>
                            updateTier(tier.id, { minARR: e.target.value })
                          }
                          style={field}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label style={label}>Min Deal Count</label>
                        <input
                          type="number"
                          min={0}
                          value={tier.minDealCount}
                          onChange={(e) =>
                            updateTier(tier.id, {
                              minDealCount: e.target.value,
                            })
                          }
                          style={field}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label style={label}>
                          <Award
                            size={11}
                            style={{
                              display: "inline",
                              verticalAlign: "-1px",
                              marginRight: 3,
                            }}
                          />
                          Min Certifications
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={tier.minCertifications}
                          onChange={(e) =>
                            updateTier(tier.id, {
                              minCertifications: e.target.value,
                            })
                          }
                          style={field}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label style={label}>
                          <Star
                            size={11}
                            style={{
                              display: "inline",
                              verticalAlign: "-1px",
                              marginRight: 3,
                            }}
                          />
                          Min Activity Score (0–100)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tier.minActivityScore}
                          onChange={(e) =>
                            updateTier(tier.id, {
                              minActivityScore: e.target.value,
                            })
                          }
                          style={field}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Custom Criteria */}
                    {tier.customCriteria.length > 0 && (
                      <div style={{ marginTop: "1rem" }}>
                        <p
                          style={{
                            fontSize: ".8rem",
                            fontWeight: 600,
                            marginBottom: ".6rem",
                            color: "var(--muted)",
                          }}
                        >
                          Custom Requirements
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: ".5rem",
                          }}
                        >
                          {tier.customCriteria.map((c) => (
                            <div
                              key={c.id}
                              style={{
                                display: "flex",
                                gap: ".75rem",
                                alignItems: "center",
                              }}
                            >
                              <input
                                value={c.label}
                                onChange={(e) =>
                                  updateCustomCriterion(tier.id, c.id, {
                                    label: e.target.value,
                                  })
                                }
                                placeholder="Criterion name (e.g. NPS Score)"
                                style={{ ...field, flex: 2 }}
                              />
                              <input
                                value={c.threshold}
                                onChange={(e) =>
                                  updateCustomCriterion(tier.id, c.id, {
                                    threshold: e.target.value,
                                  })
                                }
                                placeholder="Threshold (e.g. ≥ 8.0)"
                                style={{ ...field, flex: 1 }}
                              />
                              <button
                                onClick={() =>
                                  removeCustomCriterion(tier.id, c.id)
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "var(--muted)",
                                  padding: 4,
                                  lineHeight: 0,
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      className="btn-outline"
                      onClick={() => addCustomCriterion(tier.id)}
                      style={{
                        fontSize: ".8rem",
                        padding: ".4rem .85rem",
                        marginTop: "1rem",
                      }}
                    >
                      <Plus size={13} /> Add Custom Requirement
                    </button>
                  </div>

                  {/* Benefits */}
                  <div
                    style={{
                      borderTop: "1px solid var(--border)",
                      paddingTop: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: bExpanded ? "1rem" : 0,
                      }}
                    >
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: ".9rem" }}>
                          <Shield
                            size={15}
                            style={{
                              display: "inline",
                              verticalAlign: "-2px",
                              marginRight: 5,
                            }}
                          />
                          Tier Benefits
                        </h3>
                        {!bExpanded && (
                          <p
                            className="muted"
                            style={{ fontSize: ".78rem", marginTop: ".2rem" }}
                          >
                            MDF: {tier.benefits.mdfUnlimited ? "Unlimited" : `$${Number(tier.benefits.mdfBudget).toLocaleString()}`}{" "}
                            · {tier.benefits.dealPriority} priority · {tier.benefits.commissionRate}% commission
                          </p>
                        )}
                      </div>
                      <button
                        className="btn-outline"
                        onClick={() =>
                          setExpandedBenefits(bExpanded ? null : tier.id)
                        }
                        style={{ fontSize: ".8rem", padding: ".35rem .75rem" }}
                      >
                        {bExpanded ? "Collapse" : "Edit Benefits"}
                        {bExpanded ? (
                          <ChevronUp size={13} />
                        ) : (
                          <ChevronDown size={13} />
                        )}
                      </button>
                    </div>

                    {bExpanded && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(210px, 1fr))",
                          gap: "1rem",
                        }}
                      >
                        {/* MDF Budget */}
                        <div
                          style={{
                            padding: "1.1rem",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                          }}
                        >
                          <label style={label}>
                            <DollarSign
                              size={11}
                              style={{
                                display: "inline",
                                verticalAlign: "-1px",
                                marginRight: 3,
                              }}
                            />
                            MDF Budget Allocation
                          </label>
                          <input
                            type="number"
                            value={tier.benefits.mdfBudget}
                            disabled={tier.benefits.mdfUnlimited}
                            onChange={(e) =>
                              updateBenefits(tier.id, {
                                mdfBudget: e.target.value,
                              })
                            }
                            style={{
                              ...field,
                              opacity: tier.benefits.mdfUnlimited ? 0.45 : 1,
                              marginBottom: ".5rem",
                            }}
                            placeholder="25000"
                          />
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: ".4rem",
                              fontSize: ".78rem",
                              cursor: "pointer",
                              color: "var(--muted)",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={tier.benefits.mdfUnlimited}
                              onChange={(e) =>
                                updateBenefits(tier.id, {
                                  mdfUnlimited: e.target.checked,
                                })
                              }
                            />
                            Unlimited MDF
                          </label>
                        </div>

                        {/* Deal Priority */}
                        <div
                          style={{
                            padding: "1.1rem",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                          }}
                        >
                          <label style={label}>
                            Deal Registration Priority
                          </label>
                          <select
                            value={tier.benefits.dealPriority}
                            onChange={(e) =>
                              updateBenefits(tier.id, {
                                dealPriority: e.target.value as
                                  | "High"
                                  | "Medium"
                                  | "Low",
                              })
                            }
                            style={{
                              ...field,
                              appearance: "auto",
                              cursor: "pointer",
                            }}
                          >
                            <option value="High">High — Priority review</option>
                            <option value="Medium">
                              Medium — Standard queue
                            </option>
                            <option value="Low">Low — Best effort</option>
                          </select>
                        </div>

                        {/* Commission */}
                        <div
                          style={{
                            padding: "1.1rem",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                          }}
                        >
                          <label style={label}>Base Commission Rate (%)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={tier.benefits.commissionRate}
                            onChange={(e) =>
                              updateBenefits(tier.id, {
                                commissionRate: e.target.value,
                              })
                            }
                            style={field}
                            placeholder="15"
                          />
                          <p
                            style={{
                              fontSize: ".72rem",
                              color: "var(--muted)",
                              marginTop: ".35rem",
                            }}
                          >
                            Applied to commission structure on won deals
                          </p>
                        </div>

                        {/* Co-sell Support */}
                        <div
                          style={{
                            padding: "1.1rem",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                          }}
                        >
                          <label style={label}>Co-Sell Support Level</label>
                          <input
                            value={tier.benefits.coSellSupport}
                            onChange={(e) =>
                              updateBenefits(tier.id, {
                                coSellSupport: e.target.value,
                              })
                            }
                            style={field}
                            placeholder="e.g. Dedicated AE"
                          />
                        </div>

                        {/* Portal Badge */}
                        <div
                          style={{
                            padding: "1.1rem",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                          }}
                        >
                          <label style={label}>Portal Badge / Label</label>
                          <input
                            value={tier.benefits.portalBadge}
                            onChange={(e) =>
                              updateBenefits(tier.id, {
                                portalBadge: e.target.value,
                              })
                            }
                            style={field}
                            placeholder="e.g. Gold Partner"
                          />
                          <div style={{ marginTop: ".6rem" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: ".2rem .65rem",
                                borderRadius: 20,
                                fontSize: ".75rem",
                                fontWeight: 700,
                                background: `${tier.color}22`,
                                color: tier.color,
                                border: `1px solid ${tier.color}55`,
                              }}
                            >
                              {tier.benefits.portalBadge || "Badge Preview"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: ".5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button className="btn" onClick={handleSave}>
          <Save size={16} /> Save Configuration
        </button>
      </div>
    </div>
  );
}
