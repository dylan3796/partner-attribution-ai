"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import {
  Save,
  Plus,
  Trash2,
  Megaphone,
  ArrowLeft,
  DollarSign,
  Calendar,
  Users,
  CheckSquare,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type BudgetTierRow = {
  id: string;
  tierName: string;
  maxPerPartner: string;
  maxPerRequest: string;
  requestsPerPeriod: string;
};

type CustomCampaignType = {
  id: string;
  name: string;
};

const DEFAULT_BUDGET_TIERS: BudgetTierRow[] = [
  {
    id: "bronze-budget",
    tierName: "Bronze",
    maxPerPartner: "2500",
    maxPerRequest: "1000",
    requestsPerPeriod: "2",
  },
  {
    id: "silver-budget",
    tierName: "Silver",
    maxPerPartner: "10000",
    maxPerRequest: "5000",
    requestsPerPeriod: "3",
  },
  {
    id: "gold-budget",
    tierName: "Gold",
    maxPerPartner: "25000",
    maxPerRequest: "10000",
    requestsPerPeriod: "4",
  },
  {
    id: "platinum-budget",
    tierName: "Platinum",
    maxPerPartner: "75000",
    maxPerRequest: "25000",
    requestsPerPeriod: "6",
  },
];

const DEFAULT_CAMPAIGN_TYPES = [
  { key: "events", label: "Events & Trade Shows" },
  { key: "content", label: "Content / Collateral" },
  { key: "digital", label: "Digital Marketing" },
  { key: "training", label: "Training & Enablement" },
  { key: "webinars", label: "Webinars" },
  { key: "other", label: "Other" },
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

export default function MDFSetupPage() {
  const { toast } = useToast();

  // Program basics
  const [programName, setProgramName] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState<"quarterly" | "annual">(
    "quarterly"
  );
  const [totalBudget, setTotalBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Budget tiers
  const [budgetTiers, setBudgetTiers] =
    useState<BudgetTierRow[]>(DEFAULT_BUDGET_TIERS);

  // Campaign types
  const [enabledCampaignTypes, setEnabledCampaignTypes] = useState<
    Record<string, boolean>
  >({
    events: true,
    content: true,
    digital: true,
    training: true,
    webinars: false,
    other: false,
  });
  const [customCampaignTypes, setCustomCampaignTypes] = useState<
    CustomCampaignType[]
  >([]);
  const [newCampaignType, setNewCampaignType] = useState("");

  // Approval workflow
  const [approvalMode, setApprovalMode] = useState<"single" | "multi">(
    "single"
  );
  const [singleApproverRole, setSingleApproverRole] =
    useState("channel_manager");
  const [autoApproveEnabled, setAutoApproveEnabled] = useState(false);
  const [autoApproveThreshold, setAutoApproveThreshold] = useState("500");

  // Documentation
  const [requireCampaignPlan, setRequireCampaignPlan] = useState(true);
  const [requireROIEstimate, setRequireROIEstimate] = useState(false);
  const [requirePostCampaignReport, setRequirePostCampaignReport] =
    useState(true);

  function addBudgetTier() {
    setBudgetTiers([
      ...budgetTiers,
      {
        id: `budget-${Date.now()}`,
        tierName: "New Tier",
        maxPerPartner: "0",
        maxPerRequest: "0",
        requestsPerPeriod: "1",
      },
    ]);
  }

  function removeBudgetTier(id: string) {
    setBudgetTiers(budgetTiers.filter((t) => t.id !== id));
  }

  function updateBudgetTier(id: string, updates: Partial<BudgetTierRow>) {
    setBudgetTiers(
      budgetTiers.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  function addCustomCampaignType() {
    if (!newCampaignType.trim()) return;
    setCustomCampaignTypes([
      ...customCampaignTypes,
      { id: `custom-${Date.now()}`, name: newCampaignType.trim() },
    ]);
    setNewCampaignType("");
  }

  function handleSave() {
    if (!programName.trim()) {
      toast("Please enter a program name", "error");
      return;
    }
    toast(`MDF program "${programName}" created successfully`);
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

  const sectionHeader = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string
  ) => (
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
      {subtitle && (
        <p className="muted" style={{ fontSize: ".8rem", marginTop: ".2rem" }}>
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Header */}
      <div>
        <Link
          href="/dashboard/mdf"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            fontSize: ".85rem",
            color: "var(--muted)",
            marginBottom: ".75rem",
          }}
        >
          <ArrowLeft size={14} /> Back to MDF
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
              <Megaphone
                size={22}
                style={{
                  display: "inline",
                  verticalAlign: "-3px",
                  marginRight: 8,
                  color: "#7c3aed",
                }}
              />
              MDF Program Setup
            </h1>
            <p className="muted" style={{ marginTop: ".25rem" }}>
              Configure a new Market Development Fund program with budgets,
              approvals, and campaign types
            </p>
          </div>
          <button className="btn" onClick={handleSave}>
            <Save size={16} /> Create Program
          </button>
        </div>
      </div>

      {/* Section 1: Program Details */}
      <div className="card">
        {sectionHeader(
          <Calendar size={17} />,
          "Program Details",
          "Basic information about this MDF program"
        )}
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
              placeholder="e.g. Q1 2026 Partner Marketing Fund"
            />
          </div>

          <div>
            <label style={label}>Budget Period</label>
            <div style={{ display: "flex", gap: ".5rem" }}>
              {(["quarterly", "annual"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setBudgetPeriod(p)}
                  style={{
                    flex: 1,
                    padding: ".55rem",
                    borderRadius: 7,
                    border:
                      budgetPeriod === p
                        ? "2px solid #6366f1"
                        : "1px solid var(--border)",
                    background:
                      budgetPeriod === p ? "#eef2ff" : "var(--bg)",
                    color: budgetPeriod === p ? "#4338ca" : "var(--fg)",
                    fontWeight: 600,
                    fontSize: ".85rem",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={label}>Total Budget ($)</label>
            <div style={{ position: "relative" }}>
              <DollarSign
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted)",
                }}
              />
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                style={{ ...field, paddingLeft: "2rem" }}
                placeholder="500000"
              />
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
        </div>
      </div>

      {/* Section 2: Budget Allocation by Tier */}
      <div className="card">
        {sectionHeader(
          <Users size={17} />,
          "Budget Allocation by Tier",
          "Set limits on how much each tier can access from this program"
        )}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  "Tier",
                  "Max per Partner ($)",
                  "Max per Request ($)",
                  "Requests per Period",
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
              {budgetTiers.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={{ padding: ".6rem 1rem" }}>
                    <input
                      value={row.tierName}
                      onChange={(e) =>
                        updateBudgetTier(row.id, { tierName: e.target.value })
                      }
                      style={{
                        ...field,
                        width: 120,
                        fontWeight: 600,
                        padding: ".4rem .6rem",
                      }}
                    />
                  </td>
                  <td style={{ padding: ".6rem 1rem" }}>
                    <input
                      type="number"
                      value={row.maxPerPartner}
                      onChange={(e) =>
                        updateBudgetTier(row.id, {
                          maxPerPartner: e.target.value,
                        })
                      }
                      style={{ ...field, width: 140, padding: ".4rem .6rem" }}
                      placeholder="25000"
                    />
                  </td>
                  <td style={{ padding: ".6rem 1rem" }}>
                    <input
                      type="number"
                      value={row.maxPerRequest}
                      onChange={(e) =>
                        updateBudgetTier(row.id, {
                          maxPerRequest: e.target.value,
                        })
                      }
                      style={{ ...field, width: 140, padding: ".4rem .6rem" }}
                      placeholder="10000"
                    />
                  </td>
                  <td style={{ padding: ".6rem 1rem" }}>
                    <input
                      type="number"
                      min={1}
                      value={row.requestsPerPeriod}
                      onChange={(e) =>
                        updateBudgetTier(row.id, {
                          requestsPerPeriod: e.target.value,
                        })
                      }
                      style={{ ...field, width: 80, padding: ".4rem .6rem" }}
                      placeholder="3"
                    />
                  </td>
                  <td style={{ padding: ".6rem 1rem" }}>
                    <button
                      onClick={() => removeBudgetTier(row.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--muted)",
                        padding: 4,
                        lineHeight: 0,
                        opacity: 0.6,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="btn-outline"
          onClick={addBudgetTier}
          style={{ marginTop: "1rem", fontSize: ".85rem" }}
        >
          <Plus size={14} /> Add Tier Row
        </button>
        <p
          className="muted"
          style={{ fontSize: ".75rem", marginTop: ".6rem" }}
        >
          Example: Gold partners get up to $25K/{budgetPeriod === "quarterly" ? "quarter" : "year"}, max $10K per
          request, up to 3 requests
        </p>
      </div>

      {/* Section 3: Campaign Types */}
      <div className="card">
        {sectionHeader(
          <CheckSquare size={17} />,
          "Eligible Campaign Types",
          "Define which types of marketing activities qualify for MDF reimbursement"
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: ".75rem",
            marginBottom: "1.25rem",
          }}
        >
          {DEFAULT_CAMPAIGN_TYPES.map((ct) => (
            <label
              key={ct.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".75rem",
                padding: ".85rem 1rem",
                borderRadius: 8,
                border: enabledCampaignTypes[ct.key]
                  ? "2px solid #6366f1"
                  : "1px solid var(--border)",
                background: enabledCampaignTypes[ct.key]
                  ? "#eef2ff"
                  : "var(--subtle)",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <input
                type="checkbox"
                checked={!!enabledCampaignTypes[ct.key]}
                onChange={(e) =>
                  setEnabledCampaignTypes((prev) => ({
                    ...prev,
                    [ct.key]: e.target.checked,
                  }))
                }
                style={{ accentColor: "#6366f1" }}
              />
              <span
                style={{
                  fontSize: ".875rem",
                  fontWeight: enabledCampaignTypes[ct.key] ? 600 : 400,
                  color: enabledCampaignTypes[ct.key]
                    ? "#4338ca"
                    : "var(--fg)",
                }}
              >
                {ct.label}
              </span>
            </label>
          ))}

          {customCampaignTypes.map((ct) => (
            <div
              key={ct.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".85rem 1rem",
                borderRadius: 8,
                border: "2px solid #6366f1",
                background: "#eef2ff",
              }}
            >
              <input
                type="checkbox"
                checked
                readOnly
                style={{ accentColor: "#6366f1" }}
              />
              <span
                style={{
                  fontSize: ".875rem",
                  fontWeight: 600,
                  color: "#4338ca",
                  flex: 1,
                }}
              >
                {ct.name}
              </span>
              <button
                onClick={() =>
                  setCustomCampaignTypes((prev) =>
                    prev.filter((c) => c.id !== ct.id)
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#4338ca",
                  padding: 2,
                  lineHeight: 0,
                  opacity: 0.6,
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Add custom type */}
        <div style={{ display: "flex", gap: ".75rem", maxWidth: 420 }}>
          <input
            value={newCampaignType}
            onChange={(e) => setNewCampaignType(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomCampaignType()}
            style={field}
            placeholder="Custom campaign type name…"
          />
          <button
            className="btn-outline"
            onClick={addCustomCampaignType}
            style={{ whiteSpace: "nowrap", fontSize: ".85rem" }}
          >
            <Plus size={14} /> Add Type
          </button>
        </div>
      </div>

      {/* Section 4: Approval Workflow */}
      <div className="card">
        {sectionHeader(
          <Shield size={17} />,
          "Approval Workflow",
          "Configure how MDF requests are reviewed and approved"
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {/* Approval mode */}
          <div>
            <label style={label}>Approval Mode</label>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {[
                {
                  value: "single",
                  label: "Single Approver",
                  desc: "One person reviews all requests",
                },
                {
                  value: "multi",
                  label: "Multi-Step: Manager → VP",
                  desc: "Sequential approval chain",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".75rem",
                    padding: ".85rem 1rem",
                    borderRadius: 8,
                    border:
                      approvalMode === opt.value
                        ? "2px solid #6366f1"
                        : "1px solid var(--border)",
                    background:
                      approvalMode === opt.value ? "#eef2ff" : "var(--subtle)",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  <input
                    type="radio"
                    name="approvalMode"
                    value={opt.value}
                    checked={approvalMode === opt.value}
                    onChange={() =>
                      setApprovalMode(opt.value as "single" | "multi")
                    }
                    style={{ accentColor: "#6366f1" }}
                  />
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: ".875rem",
                        color:
                          approvalMode === opt.value ? "#4338ca" : "var(--fg)",
                      }}
                    >
                      {opt.label}
                    </p>
                    <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Approver role */}
          {approvalMode === "single" && (
            <div>
              <label style={label}>Approver Role</label>
              <select
                value={singleApproverRole}
                onChange={(e) => setSingleApproverRole(e.target.value)}
                style={{ ...field, appearance: "auto", cursor: "pointer" }}
              >
                <option value="channel_manager">Channel Manager</option>
                <option value="partner_manager">Partner Manager</option>
                <option value="vp_partnerships">VP Partnerships</option>
                <option value="finance">Finance Team</option>
                <option value="cro">CRO</option>
              </select>
              <p
                className="muted"
                style={{ fontSize: ".75rem", marginTop: ".4rem" }}
              >
                All MDF requests will be routed to this role for review
              </p>
            </div>
          )}

          {/* Auto-approve */}
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
                marginBottom: ".75rem",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                  Auto-Approve Small Requests
                </p>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    marginTop: ".2rem",
                  }}
                >
                  Skip manual review for requests below a threshold
                </p>
              </div>
              <Toggle
                checked={autoApproveEnabled}
                onChange={setAutoApproveEnabled}
              />
            </div>
            {autoApproveEnabled && (
              <div>
                <label style={label}>Auto-approve requests under ($)</label>
                <div style={{ position: "relative" }}>
                  <DollarSign
                    size={13}
                    style={{
                      position: "absolute",
                      left: 9,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted)",
                    }}
                  />
                  <input
                    type="number"
                    value={autoApproveThreshold}
                    onChange={(e) => setAutoApproveThreshold(e.target.value)}
                    style={{ ...field, paddingLeft: "1.75rem" }}
                    placeholder="500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 5: Required Documentation */}
      <div className="card">
        {sectionHeader(
          <FileText size={17} />,
          "Required Documentation",
          "Specify what partners must submit with their MDF requests"
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".75rem",
          }}
        >
          {[
            {
              key: "campaignPlan",
              label: "Require Campaign Plan Upload",
              desc: "Partners must attach a campaign brief or plan document",
              value: requireCampaignPlan,
              onChange: setRequireCampaignPlan,
            },
            {
              key: "roi",
              label: "Require ROI Estimate",
              desc: "Partners must provide expected leads, pipeline, and revenue projections",
              value: requireROIEstimate,
              onChange: setRequireROIEstimate,
            },
            {
              key: "postCampaign",
              label: "Require Post-Campaign Report",
              desc: "Partners must submit results report before future MDF requests are eligible",
              value: requirePostCampaignReport,
              onChange: setRequirePostCampaignReport,
            },
          ].map((item) => (
            <div
              key={item.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
                padding: "1rem 1.25rem",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: item.value ? "#f0fdf4" : "var(--subtle)",
                transition: "background .2s",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "var(--muted)",
                    marginTop: ".2rem",
                  }}
                >
                  {item.desc}
                </p>
              </div>
              <Toggle checked={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

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
        <Link href="/dashboard/mdf" className="btn-outline">
          <ArrowLeft size={15} /> Cancel
        </Link>
        <button className="btn" onClick={handleSave}>
          <Save size={16} /> Create MDF Program
        </button>
      </div>
    </div>
  );
}
