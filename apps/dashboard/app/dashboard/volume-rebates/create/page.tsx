"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import {
  Save,
  Plus,
  Trash2,
  BarChart3,
  ArrowLeft,
  Calendar,
  Users,
  Bell,
  DollarSign,
  Package,
} from "lucide-react";

type RebateTierRow = {
  id: string;
  minUnits: string;
  maxUnits: string;
  rebatePercent: string;
  bonusAmount: string;
};

const DEFAULT_REBATE_TIERS: RebateTierRow[] = [
  {
    id: "tier-1",
    minUnits: "0",
    maxUnits: "100",
    rebatePercent: "2",
    bonusAmount: "0",
  },
  {
    id: "tier-2",
    minUnits: "101",
    maxUnits: "500",
    rebatePercent: "5",
    bonusAmount: "0",
  },
  {
    id: "tier-3",
    minUnits: "501",
    maxUnits: "",
    rebatePercent: "8",
    bonusAmount: "5000",
  },
];

const PARTNER_TIERS = ["Bronze", "Silver", "Gold", "Platinum"];
const PARTNER_TYPES = [
  "Reseller",
  "Distributor",
  "Affiliate",
  "Referral",
  "Integration",
];
const PRODUCTS = [
  "All Products",
  "Platform Core",
  "Analytics Add-on",
  "Enterprise Suite",
  "Professional Services",
  "API Access",
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

function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: ".35rem .85rem",
              borderRadius: 20,
              border: active ? "2px solid #6366f1" : "1px solid var(--border)",
              background: active ? "#eef2ff" : "var(--subtle)",
              color: active ? "#4338ca" : "var(--fg)",
              fontSize: ".8rem",
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function CreateVolumeRebatePage() {
  const { toast } = useToast();

  // Program basics
  const [programName, setProgramName] = useState("");
  const [periodType, setPeriodType] = useState<
    "monthly" | "quarterly" | "annual"
  >("quarterly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productScope, setProductScope] = useState<"all" | "specific">("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Rebate tiers
  const [rebateTiers, setRebateTiers] =
    useState<RebateTierRow[]>(DEFAULT_REBATE_TIERS);

  // Eligibility
  const [eligiblePartnerTiers, setEligiblePartnerTiers] = useState<string[]>([
    "Gold",
    "Platinum",
  ]);
  const [eligiblePartnerTypes, setEligiblePartnerTypes] = useState<string[]>([
    "Reseller",
    "Distributor",
  ]);
  const [autoEnroll, setAutoEnroll] = useState(false);

  // Notifications
  const [notifyAtThresholds, setNotifyAtThresholds] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [payoutMethod, setPayoutMethod] = useState<
    "invoice_credit" | "direct_payment" | "account_credit"
  >("invoice_credit");

  function addRebateTier() {
    const last = rebateTiers[rebateTiers.length - 1];
    const newMin = last ? String(Number(last.maxUnits || 0) + 1) : "0";
    setRebateTiers([
      ...rebateTiers,
      {
        id: `rebate-${Date.now()}`,
        minUnits: newMin,
        maxUnits: "",
        rebatePercent: "0",
        bonusAmount: "0",
      },
    ]);
  }

  function removeRebateTier(id: string) {
    setRebateTiers(rebateTiers.filter((t) => t.id !== id));
  }

  function updateRebateTier(id: string, updates: Partial<RebateTierRow>) {
    setRebateTiers(
      rebateTiers.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  function handleSave() {
    if (!programName.trim()) {
      toast("Please enter a program name", "error");
      return;
    }
    toast(`Volume rebate program "${programName}" created successfully`);
  }

  const field: React.CSSProperties = {
    padding: ".6rem .85rem",
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
    fontSize: ".8rem",
    color: "var(--muted)",
    display: "block",
    marginBottom: ".35rem",
    fontWeight: 500,
  };

  const sectionCard = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    children: React.ReactNode
  ) => (
    <div className="card">
      <div style={{ marginBottom: "1.25rem" }}>
        <h2
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          {icon} {title}
        </h2>
        <p className="muted" style={{ fontSize: ".8rem", marginTop: ".2rem" }}>
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Header */}
      <div>
        <Link
          href="/dashboard/volume-rebates"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            fontSize: ".85rem",
            color: "var(--muted)",
            marginBottom: ".75rem",
          }}
        >
          <ArrowLeft size={14} /> Back to Volume Rebates
        </Link>
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
              <BarChart3
                size={22}
                style={{
                  display: "inline",
                  verticalAlign: "-3px",
                  marginRight: 8,
                  color: "#4338ca",
                }}
              />
              Create Volume Rebate Program
            </h1>
            <p className="muted" style={{ marginTop: ".25rem" }}>
              Set up a tiered volume-based incentive program with rebates and
              bonuses
            </p>
          </div>
          <button className="btn" onClick={handleSave}>
            <Save size={16} /> Create Program
          </button>
        </div>
      </div>

      {/* Section 1: Program Details */}
      {sectionCard(
        <Calendar size={17} />,
        "Program Details",
        "Basic information about this volume rebate program",
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={label}>Program Name *</label>
            <input
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              style={field}
              placeholder="e.g. 2026 Q1 Volume Accelerator"
            />
          </div>

          <div>
            <label style={label}>Period Type</label>
            <div style={{ display: "flex", gap: ".5rem" }}>
              {(["monthly", "quarterly", "annual"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriodType(p)}
                  style={{
                    flex: 1,
                    padding: ".5rem .4rem",
                    borderRadius: 7,
                    border:
                      periodType === p
                        ? "2px solid #6366f1"
                        : "1px solid var(--border)",
                    background:
                      periodType === p ? "#eef2ff" : "var(--bg)",
                    color: periodType === p ? "#4338ca" : "var(--fg)",
                    fontWeight: 600,
                    fontSize: ".8rem",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={label}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={field}
            />
          </div>

          <div>
            <label style={label}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={field}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={label}>Product Scope</label>
            <div style={{ display: "flex", gap: ".5rem", marginBottom: ".75rem" }}>
              {[
                {
                  value: "all",
                  label: "All Products",
                  desc: "Counts units across entire catalog",
                },
                {
                  value: "specific",
                  label: "Specific Products",
                  desc: "Select which products count",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".6rem",
                    padding: ".75rem 1rem",
                    borderRadius: 8,
                    border:
                      productScope === opt.value
                        ? "2px solid #6366f1"
                        : "1px solid var(--border)",
                    background:
                      productScope === opt.value ? "#eef2ff" : "var(--subtle)",
                    cursor: "pointer",
                    flex: 1,
                    maxWidth: 260,
                    transition: "all .15s",
                  }}
                >
                  <input
                    type="radio"
                    name="productScope"
                    value={opt.value}
                    checked={productScope === opt.value}
                    onChange={() =>
                      setProductScope(opt.value as "all" | "specific")
                    }
                    style={{ accentColor: "#6366f1" }}
                  />
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: ".875rem",
                        color:
                          productScope === opt.value
                            ? "#4338ca"
                            : "var(--fg)",
                      }}
                    >
                      {opt.label}
                    </p>
                    <p
                      style={{
                        fontSize: ".75rem",
                        color: "var(--muted)",
                      }}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {productScope === "specific" && (
              <div>
                <label style={label}>
                  <Package
                    size={11}
                    style={{
                      display: "inline",
                      verticalAlign: "-1px",
                      marginRight: 3,
                    }}
                  />
                  Select Products / Categories
                </label>
                <MultiSelect
                  options={PRODUCTS.filter((p) => p !== "All Products")}
                  selected={selectedProducts}
                  onChange={setSelectedProducts}
                />
                {selectedProducts.length === 0 && (
                  <p
                    className="muted"
                    style={{ fontSize: ".75rem", marginTop: ".4rem" }}
                  >
                    No products selected — select at least one
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 2: Rebate Tier Structure */}
      {sectionCard(
        <BarChart3 size={17} />,
        "Rebate Tier Structure",
        "Define unit thresholds and corresponding rebate rates",
        <>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 560,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {[
                    "Min Units",
                    "Max Units",
                    "Rebate %",
                    "Bonus ($)",
                    "Preview",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: ".6rem 1rem",
                        textAlign: "left",
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rebateTiers.map((row, idx) => {
                  const rebate = Number(row.rebatePercent);
                  const rebateColor =
                    rebate >= 8
                      ? "#059669"
                      : rebate >= 5
                      ? "#d97706"
                      : "#6b7280";

                  return (
                    <tr
                      key={row.id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <td style={{ padding: ".6rem 1rem" }}>
                        <input
                          type="number"
                          min={0}
                          value={row.minUnits}
                          onChange={(e) =>
                            updateRebateTier(row.id, {
                              minUnits: e.target.value,
                            })
                          }
                          style={{
                            ...field,
                            width: 100,
                            padding: ".4rem .6rem",
                          }}
                          placeholder="0"
                        />
                      </td>
                      <td style={{ padding: ".6rem 1rem" }}>
                        <input
                          type="number"
                          min={0}
                          value={row.maxUnits}
                          onChange={(e) =>
                            updateRebateTier(row.id, {
                              maxUnits: e.target.value,
                            })
                          }
                          style={{
                            ...field,
                            width: 110,
                            padding: ".4rem .6rem",
                          }}
                          placeholder="∞ (unlimited)"
                        />
                      </td>
                      <td style={{ padding: ".6rem 1rem" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: ".4rem" }}
                        >
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={row.rebatePercent}
                            onChange={(e) =>
                              updateRebateTier(row.id, {
                                rebatePercent: e.target.value,
                              })
                            }
                            style={{
                              ...field,
                              width: 80,
                              padding: ".4rem .6rem",
                            }}
                            placeholder="5"
                          />
                          <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>%</span>
                        </div>
                      </td>
                      <td style={{ padding: ".6rem 1rem" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: ".4rem" }}
                        >
                          <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>$</span>
                          <input
                            type="number"
                            min={0}
                            value={row.bonusAmount}
                            onChange={(e) =>
                              updateRebateTier(row.id, {
                                bonusAmount: e.target.value,
                              })
                            }
                            style={{
                              ...field,
                              width: 100,
                              padding: ".4rem .6rem",
                            }}
                            placeholder="0"
                          />
                        </div>
                      </td>
                      <td style={{ padding: ".6rem 1rem" }}>
                        <span
                          style={{
                            fontSize: ".78rem",
                            fontWeight: 600,
                            color: rebateColor,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.minUnits}–
                          {row.maxUnits || "∞"} units →{" "}
                          {row.rebatePercent}%
                          {Number(row.bonusAmount) > 0
                            ? ` + $${Number(row.bonusAmount).toLocaleString()}`
                            : ""}
                        </span>
                      </td>
                      <td style={{ padding: ".6rem 1rem" }}>
                        <button
                          onClick={() => removeRebateTier(row.id)}
                          disabled={rebateTiers.length <= 1}
                          style={{
                            background: "none",
                            border: "none",
                            cursor:
                              rebateTiers.length <= 1
                                ? "not-allowed"
                                : "pointer",
                            color: "var(--muted)",
                            padding: 4,
                            lineHeight: 0,
                            opacity: rebateTiers.length <= 1 ? 0.25 : 0.6,
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            className="btn-outline"
            onClick={addRebateTier}
            style={{ marginTop: "1rem", fontSize: ".85rem" }}
          >
            <Plus size={14} /> Add Tier
          </button>
          <p
            className="muted"
            style={{ fontSize: ".75rem", marginTop: ".6rem" }}
          >
            Example: 0–100 units = 2% rebate, 101–500 = 5%, 501+ = 8% +
            $5,000 bonus
          </p>
        </>
      )}

      {/* Section 3: Eligibility */}
      {sectionCard(
        <Users size={17} />,
        "Eligibility",
        "Define which partners can participate in this program",
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div>
            <label style={label}>Eligible Partner Tiers</label>
            <MultiSelect
              options={PARTNER_TIERS}
              selected={eligiblePartnerTiers}
              onChange={setEligiblePartnerTiers}
            />
            {eligiblePartnerTiers.length === 0 && (
              <p
                className="muted"
                style={{ fontSize: ".75rem", marginTop: ".4rem" }}
              >
                No tiers selected — program will be open to all tiers
              </p>
            )}
          </div>

          <div>
            <label style={label}>Eligible Partner Types</label>
            <MultiSelect
              options={PARTNER_TYPES}
              selected={eligiblePartnerTypes}
              onChange={setEligiblePartnerTypes}
            />
          </div>

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
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                  Enrollment Mode
                </p>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    marginTop: ".25rem",
                  }}
                >
                  {autoEnroll
                    ? "All eligible partners will be automatically enrolled when the program starts"
                    : "Partners will receive an invitation and must opt-in manually"}
                </p>
              </div>
              <Toggle checked={autoEnroll} onChange={setAutoEnroll} />
            </div>
            <p
              style={{
                fontSize: ".78rem",
                fontWeight: 500,
                color: autoEnroll ? "#059669" : "#d97706",
                marginTop: ".6rem",
              }}
            >
              {autoEnroll ? "✓ Auto-enroll eligible partners" : "Manual invitation only"}
            </p>
          </div>
        </div>
      )}

      {/* Section 4: Tracking & Notifications */}
      {sectionCard(
        <Bell size={17} />,
        "Tracking & Notifications",
        "Configure partner communications and visibility settings",
        <div
          style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
        >
          {/* Notify at thresholds */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              padding: "1rem 1.25rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: notifyAtThresholds ? "#f0fdf4" : "var(--subtle)",
              transition: "background .2s",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                Threshold Notifications
              </p>
              <p
                style={{
                  fontSize: ".8rem",
                  color: "var(--muted)",
                  marginTop: ".2rem",
                }}
              >
                Notify partners when they reach 50%, 75%, and 90% of their
                current tier threshold
              </p>
            </div>
            <Toggle
              checked={notifyAtThresholds}
              onChange={setNotifyAtThresholds}
            />
          </div>

          {/* Show leaderboard */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              padding: "1rem 1.25rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: showLeaderboard ? "#f0fdf4" : "var(--subtle)",
              transition: "background .2s",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                Show Leaderboard in Partner Portal
              </p>
              <p
                style={{
                  fontSize: ".8rem",
                  color: "var(--muted)",
                  marginTop: ".2rem",
                }}
              >
                Partners can see their ranking versus other participants in
                the portal
              </p>
            </div>
            <Toggle
              checked={showLeaderboard}
              onChange={setShowLeaderboard}
            />
          </div>

          {/* Payout method */}
          <div style={{ marginTop: ".25rem" }}>
            <label style={label}>
              <DollarSign
                size={11}
                style={{
                  display: "inline",
                  verticalAlign: "-1px",
                  marginRight: 3,
                }}
              />
              Payout Method
            </label>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              {[
                {
                  value: "invoice_credit",
                  label: "Credit to Next Invoice",
                  desc: "Rebate applied as a credit on the partner's next invoice",
                },
                {
                  value: "direct_payment",
                  label: "Direct Payment",
                  desc: "Rebate paid out via ACH/wire transfer",
                },
                {
                  value: "account_credit",
                  label: "Account Credit",
                  desc: "Credit added to partner's portal wallet",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: ".65rem",
                    padding: ".9rem 1.1rem",
                    borderRadius: 8,
                    border:
                      payoutMethod === opt.value
                        ? "2px solid #6366f1"
                        : "1px solid var(--border)",
                    background:
                      payoutMethod === opt.value
                        ? "#eef2ff"
                        : "var(--subtle)",
                    cursor: "pointer",
                    flex: "1 1 200px",
                    minWidth: 200,
                    maxWidth: 300,
                    transition: "all .15s",
                  }}
                >
                  <input
                    type="radio"
                    name="payoutMethod"
                    value={opt.value}
                    checked={payoutMethod === opt.value}
                    onChange={() =>
                      setPayoutMethod(
                        opt.value as
                          | "invoice_credit"
                          | "direct_payment"
                          | "account_credit"
                      )
                    }
                    style={{ accentColor: "#6366f1", marginTop: 2 }}
                  />
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: ".875rem",
                        color:
                          payoutMethod === opt.value
                            ? "#4338ca"
                            : "var(--fg)",
                      }}
                    >
                      {opt.label}
                    </p>
                    <p
                      style={{
                        fontSize: ".75rem",
                        color: "var(--muted)",
                        marginTop: ".2rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: ".5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Link href="/dashboard/volume-rebates" className="btn-outline">
          <ArrowLeft size={15} /> Cancel
        </Link>
        <button className="btn" onClick={handleSave}>
          <Save size={16} /> Create Volume Program
        </button>
      </div>
    </div>
  );
}
