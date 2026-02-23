"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Upload, Table2, Settings2, Rocket, ChevronRight, ChevronLeft,
  FileSpreadsheet, Check, Sparkles, X, AtSign, Zap, ArrowRight,
} from "lucide-react";

/* ── Types ── */
type FieldMapping = {
  column: string;
  mappedTo: string;
  autoSuggested: boolean;
};

type ParsedRule = {
  id: string;
  field: string;
  operator: string;
  value: string;
  action: string;
  actionValue: string;
};

type WizardData = {
  headers: string[];
  rows: string[][];
  mappings: FieldMapping[];
  rules: ParsedRule[];
  ruleText: string;
  usedSample: boolean;
};

/* ── Constants ── */
const FIELD_OPTIONS = [
  { value: "partner_name", label: "Partner Name" },
  { value: "partner_type", label: "Partner Type" },
  { value: "partner_tier", label: "Partner Tier" },
  { value: "commission_rate", label: "Commission Rate" },
  { value: "deal_value", label: "Deal Value" },
  { value: "deal_status", label: "Deal Status" },
  { value: "deal_date", label: "Deal Date" },
  { value: "customer_name", label: "Customer Name" },
  { value: "contact_email", label: "Contact Email" },
  { value: "notes", label: "Notes" },
  { value: "_skip", label: "Skip this field" },
];

const FIELD_GUESS: Record<string, string> = {
  partner: "partner_name", name: "partner_name", company: "partner_name",
  type: "partner_type", category: "partner_type",
  tier: "partner_tier", level: "partner_tier", rank: "partner_tier",
  commission: "commission_rate", rate: "commission_rate", percent: "commission_rate",
  value: "deal_value", amount: "deal_value", revenue: "deal_value", price: "deal_value", deal: "deal_value",
  status: "deal_status", stage: "deal_status",
  date: "deal_date", created: "deal_date", closed: "deal_date",
  customer: "customer_name", client: "customer_name", account: "customer_name",
  email: "contact_email", contact: "contact_email",
  notes: "notes", description: "notes", comment: "notes",
};

const SAMPLE_CSV = `Partner Name,Type,Tier,Commission Rate,Deal,Value,Status,Customer,Date
TechBridge Partners,Reseller,Gold,18,CloudSync Enterprise License,85000,Won,Accenture,2026-01-18
TechBridge Partners,Reseller,Gold,18,Security Platform Overhaul,145000,Won,Databricks,2026-01-05
TechBridge Partners,Reseller,Gold,18,API Gateway Enterprise,67000,Open,Figma,2026-02-10
Apex Growth Group,Referral,Silver,20,DevOps Transformation Suite,42000,Won,Zendesk,2026-02-11
Apex Growth Group,Referral,Silver,20,Customer Success Analytics,38000,Won,Intercom,2026-01-26
Apex Growth Group,Referral,Silver,20,Revenue Intelligence Platform,95000,Open,HubSpot,2026-02-15
Stackline Agency,Reseller,Bronze,15,Compliance Dashboard,48000,Won,Plaid,2026-02-01
Stackline Agency,Reseller,Bronze,15,Data Analytics Platform,67000,Open,Salesforce,2026-02-08
Northlight Solutions,Reseller,Gold,18,Identity Management Platform,175000,Won,Okta,2026-02-05
Northlight Solutions,Reseller,Gold,18,Zero Trust Architecture,250000,Open,CrowdStrike,2026-02-18
Clearpath Consulting,Referral,Bronze,10,Content Management System,33000,Won,Contentful,2026-01-10
Clearpath Consulting,Referral,Bronze,10,Digital Experience Platform,72000,Open,Adobe,2026-02-12`;

const RULE_TEMPLATES = [
  "When @partner_tier is Gold, commission is 20%",
  "When @deal_value > $100,000, commission is 15%",
  "When @partner_type is Referral, commission is 10%",
  "When @partner_tier is Platinum, commission is 25%",
];

/* ── Helpers ── */
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((l) => l.split(",").map((c) => c.trim()));
  return { headers, rows };
}

function guessMapping(header: string): string {
  const lower = header.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, value] of Object.entries(FIELD_GUESS)) {
    if (lower.includes(key)) return value;
  }
  return "_skip";
}

function parseRuleText(text: string, mappedFields: string[]): ParsedRule[] {
  const rules: ParsedRule[] = [];
  const lines = text.split("\n").filter((l) => l.trim());
  for (const line of lines) {
    // Match: When @field is VALUE, action is VALUE
    const isMatch = line.match(/when\s+@(\w+)\s+is\s+(\w+).*?commission\s+is\s+(\d+)%/i);
    if (isMatch) {
      rules.push({
        id: Math.random().toString(36).slice(2),
        field: isMatch[1], operator: "is", value: isMatch[2],
        action: "commission", actionValue: isMatch[3] + "%",
      });
      continue;
    }
    // Match: When @field > NUMBER, action
    const gtMatch = line.match(/when\s+@(\w+)\s*>\s*\$?([\d,]+).*?commission\s+is\s+(\d+)%/i);
    if (gtMatch) {
      rules.push({
        id: Math.random().toString(36).slice(2),
        field: gtMatch[1], operator: ">", value: "$" + gtMatch[2],
        action: "commission", actionValue: gtMatch[3] + "%",
      });
    }
  }
  return rules;
}

/* ── Steps ── */
const STEPS = [
  { label: "Import Data", icon: Upload },
  { label: "Map Fields", icon: Table2 },
  { label: "Set Rules", icon: Settings2 },
  { label: "Review & Go", icon: Rocket },
];

/* ── Component ── */
export default function SetupWizard() {
  const router = useRouter();
  const saveProgramConfig = useMutation(api.programConfig.save);
  const createPartner = useMutation(api.partners.create);
  const createDeal = useMutation(api.dealsCrud.create);
  const seedDemo = useMutation(api.seedDemo.seedDemoData);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [launchStatus, setLaunchStatus] = useState("");
  const [data, setData] = useState<WizardData>({
    headers: [], rows: [], mappings: [], rules: [], ruleText: "", usedSample: false,
  });
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteFilter, setAutocompleteFilter] = useState("");
  const [autocompletePos, setAutocompletePos] = useState({ top: 0, left: 0 });

  // Derived
  const mappedFields = useMemo(
    () => data.mappings.filter((m) => m.mappedTo !== "_skip").map((m) => m.mappedTo),
    [data.mappings]
  );
  const hasPartnerName = mappedFields.includes("partner_name");
  const hasDealField = mappedFields.some((f) => f.startsWith("deal_"));
  const canProceedStep1 = data.headers.length > 0;
  const canProceedStep2 = hasPartnerName && hasDealField;
  const canProceedStep3 = data.rules.length > 0;

  const parsedRules = useMemo(
    () => parseRuleText(data.ruleText, mappedFields),
    [data.ruleText, mappedFields]
  );

  // Update rules when text changes
  useEffect(() => {
    if (parsedRules.length > 0) {
      setData((d) => ({ ...d, rules: parsedRules }));
    }
  }, [parsedRules]);

  /* ── CSV Handling ── */
  function handleCSV(text: string, isSample = false) {
    const { headers, rows } = parseCSV(text);
    const mappings: FieldMapping[] = headers.map((h) => ({
      column: h,
      mappedTo: guessMapping(h),
      autoSuggested: guessMapping(h) !== "_skip",
    }));
    setData((d) => ({ ...d, headers, rows, mappings, usedSample: isSample }));
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => handleCSV(e.target?.result as string);
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  /* ── @ Autocomplete ── */
  function handleRuleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "@") {
      setShowAutocomplete(true);
      setAutocompleteFilter("");
      // Position dropdown near cursor
      const ta = textareaRef.current;
      if (ta) {
        setAutocompletePos({ top: ta.offsetTop + ta.offsetHeight + 4, left: ta.offsetLeft });
      }
    } else if (showAutocomplete) {
      if (e.key === "Escape") {
        setShowAutocomplete(false);
      }
    }
  }

  function handleRuleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setData((d) => ({ ...d, ruleText: val }));
    // Track filter after last @
    const lastAt = val.lastIndexOf("@");
    if (lastAt >= 0 && showAutocomplete) {
      setAutocompleteFilter(val.slice(lastAt + 1).split(/[\s,]/)[0].toLowerCase());
    }
  }

  function insertField(fieldValue: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const val = data.ruleText;
    const lastAt = val.lastIndexOf("@");
    const before = val.slice(0, lastAt);
    const afterParts = val.slice(lastAt).split(/[\s,]/);
    afterParts[0] = "@" + fieldValue;
    const newText = before + afterParts.join(" ");
    setData((d) => ({ ...d, ruleText: newText }));
    setShowAutocomplete(false);
    ta.focus();
  }

  const filteredFields = FIELD_OPTIONS.filter(
    (f) => f.value !== "_skip" && mappedFields.includes(f.value) && f.value.includes(autocompleteFilter)
  );

  /* ── Save & Launch ── */
  /* ── Helper: get column index for a mapped field ── */
  function colIdx(field: string): number {
    return data.mappings.findIndex((m) => m.mappedTo === field);
  }
  function cellVal(row: string[], field: string): string {
    const idx = colIdx(field);
    return idx >= 0 && idx < row.length ? row[idx].trim() : "";
  }

  async function handleLaunch() {
    setSaving(true);
    try {
      // ── 1. Save program config ──
      setLaunchStatus("Saving configuration...");
      const commissionRules = data.rules.map((r) => ({
        type: r.field,
        value: parseFloat(r.actionValue) / 100,
        unit: "percentage",
        label: `When ${r.field} ${r.operator} ${r.value} → ${r.actionValue} commission`,
      }));

      await saveProgramConfig({
        sessionId: "setup-wizard-" + Date.now(),
        programName: "My Partner Program",
        programType: "reseller",
        interactionTypes: [
          { id: "deal_registration", label: "Deal Registration", weight: 1, triggersAttribution: true, triggersPayout: true },
          { id: "referral", label: "Referral", weight: 0.8, triggersAttribution: true, triggersPayout: true },
          { id: "demo", label: "Demo", weight: 0.5, triggersAttribution: true, triggersPayout: false },
        ],
        attributionModel: "deal_reg_protection",
        commissionRules,
        enabledModules: ["deals", "partners", "payouts", "reports", "scoring"],
        rawConfig: JSON.stringify({
          mappings: data.mappings,
          rules: data.rules,
          usedSample: data.usedSample,
        }),
      });

      // ── 2. Import data ──
      if (data.usedSample) {
        // Sample data path: call the seed mutation which creates rich demo data
        setLaunchStatus("Seeding demo data...");
        try { await seedDemo({}); } catch { /* already seeded, ok */ }
      } else if (data.rows.length > 0) {
        // CSV import path: create real partners + deals from user's CSV

        // 2a. Deduplicate and import partners
        const partnerNameIdx = colIdx("partner_name");
        const uniquePartnerNames = [...new Set(
          data.rows.map((r) => partnerNameIdx >= 0 ? r[partnerNameIdx]?.trim() : "").filter(Boolean)
        )];

        setLaunchStatus(`Importing ${uniquePartnerNames.length} partners...`);
        const partnerIdMap: Record<string, string> = {};

        for (const name of uniquePartnerNames) {
          // Find first row with this partner name for metadata
          const row = data.rows.find((r) => cellVal(r, "partner_name") === name);
          if (!row) continue;

          const rawType = cellVal(row, "partner_type").toLowerCase();
          const type = (["affiliate", "referral", "reseller", "integration"].includes(rawType) ? rawType : "reseller") as "affiliate" | "referral" | "reseller" | "integration";

          const rawTier = cellVal(row, "partner_tier").toLowerCase();
          const tier = (["bronze", "silver", "gold", "platinum"].includes(rawTier) ? rawTier : "bronze") as "bronze" | "silver" | "gold" | "platinum";

          const rawRate = parseFloat(cellVal(row, "commission_rate"));
          const commissionRate = !isNaN(rawRate) ? (rawRate > 1 ? rawRate : rawRate * 100) : 10;

          const email = cellVal(row, "contact_email") || `${name.toLowerCase().replace(/\s+/g, ".")}@partner.com`;

          try {
            const id = await createPartner({
              name,
              email,
              type,
              tier,
              commissionRate,
              status: "active" as const,
            });
            partnerIdMap[name] = id;
          } catch {
            // partner might already exist, continue
          }
        }

        // 2b. Import deals (if deal columns mapped)
        const hasDealValue = colIdx("deal_value") >= 0;
        if (hasDealValue) {
          const dealRows = data.rows.filter((r) => {
            const val = parseFloat(cellVal(r, "deal_value").replace(/[,$]/g, ""));
            return !isNaN(val) && val > 0;
          });

          setLaunchStatus(`Importing ${dealRows.length} deals...`);

          for (let i = 0; i < dealRows.length; i++) {
            const row = dealRows[i];
            const amount = parseFloat(cellVal(row, "deal_value").replace(/[,$]/g, ""));
            const customerName = cellVal(row, "customer_name");
            const dealName = customerName ? `${customerName} Deal` : `Deal ${i + 1}`;

            // Normalize status
            const rawStatus = cellVal(row, "deal_status").toLowerCase();
            const status = rawStatus.includes("won") || rawStatus.includes("closed won") ? "won" as const
              : rawStatus.includes("lost") || rawStatus.includes("closed lost") ? "lost" as const
              : "open" as const;

            // Match partner
            const partnerName = cellVal(row, "partner_name");
            const partnerId = partnerIdMap[partnerName];

            // Parse date
            const rawDate = cellVal(row, "deal_date");
            const parsedDate = rawDate ? new Date(rawDate).getTime() : undefined;
            const closedAt = (status === "won" || status === "lost") ? (parsedDate && !isNaN(parsedDate) ? parsedDate : Date.now()) : undefined;

            try {
              await createDeal({
                name: dealName,
                amount,
                status,
                contactName: customerName || undefined,
                contactEmail: cellVal(row, "contact_email") || undefined,
                registeredBy: partnerId ? partnerId as any : undefined,
                closedAt,
                source: "manual" as const,
              });
            } catch {
              // continue on error
            }
          }
        }
      }

      setLaunchStatus("Redirecting to dashboard...");
      router.push("/dashboard");
    } catch {
      setLaunchStatus("Setup failed — redirecting anyway...");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }

  /* ── Render ── */
  const stepStyle = { display: "flex", flexDirection: "column" as const, gap: "1.5rem" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0" }}>
      {/* Progress Bar */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2.5rem" }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div
                  onClick={() => i < step && setStep(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, cursor: i < step ? "pointer" : "default",
                    opacity: active ? 1 : done ? 0.8 : 0.35,
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "#22c55e" : active ? "#6366f1" : "#1e1e2e",
                    border: active ? "2px solid #6366f1" : "1px solid #2a2a3a",
                  }}>
                    {done ? <Check size={16} color="#fff" /> : <Icon size={16} color={active ? "#fff" : "#64748b"} />}
                  </div>
                  <span style={{ fontSize: ".8rem", fontWeight: 600, whiteSpace: "nowrap" }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? "#22c55e" : "#1e1e2e", margin: "0 12px", borderRadius: 1 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ══════════════ STEP 1: Import Data ══════════════ */}
        {step === 0 && (
          <div style={stepStyle}>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 4 }}>Import your data</h1>
              <p style={{ color: "#94a3b8", fontSize: ".9rem" }}>Upload a CSV with your partner and deal data, or use our sample dataset to explore.</p>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                padding: "3rem 2rem", borderRadius: 12, textAlign: "center", cursor: "pointer",
                border: `2px dashed ${dragOver ? "#6366f1" : data.headers.length > 0 ? "#22c55e50" : "#2a2a3a"}`,
                background: dragOver ? "#6366f108" : data.headers.length > 0 ? "#22c55e08" : "#0f0f18",
                transition: "all .2s",
              }}
            >
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {data.headers.length > 0 ? (
                <>
                  <FileSpreadsheet size={36} style={{ color: "#22c55e", marginBottom: 8 }} />
                  <p style={{ fontWeight: 700, color: "#22c55e" }}>
                    {data.usedSample ? "Sample data loaded" : "CSV uploaded"} — {data.rows.length} rows, {data.headers.length} columns
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: ".8rem", marginTop: 4 }}>Click to upload a different file</p>
                </>
              ) : (
                <>
                  <Upload size={36} style={{ color: "#6366f1", marginBottom: 8 }} />
                  <p style={{ fontWeight: 700 }}>Drag & drop your CSV here</p>
                  <p style={{ color: "#94a3b8", fontSize: ".8rem", marginTop: 4 }}>or click to browse · CSV format, first row as headers</p>
                </>
              )}
            </div>

            {/* Sample Data Button */}
            <button
              onClick={() => handleCSV(SAMPLE_CSV, true)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 20px",
                borderRadius: 8, border: "1px solid #2a2a3a", background: "#0f0f18", color: "#94a3b8",
                fontSize: ".85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <Sparkles size={16} style={{ color: "#6366f1" }} />
              Use sample data (Horizon Software — 5 partners, 12 deals)
            </button>

            {/* Preview Table */}
            {data.headers.length > 0 && (
              <div style={{ borderRadius: 10, border: "1px solid #1e1e2e", overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", background: "#111118", fontSize: ".75rem", fontWeight: 600, color: "#94a3b8" }}>
                  Preview (first 5 rows)
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".8rem" }}>
                    <thead>
                      <tr>
                        {data.headers.map((h, i) => (
                          <th key={i} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "#e2e8f0", background: "#0f0f18", borderBottom: "1px solid #1e1e2e", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.rows.slice(0, 5).map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} style={{ padding: "6px 12px", color: "#94a3b8", borderBottom: "1px solid #1e1e2e10", whiteSpace: "nowrap" }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ STEP 2: Map Fields ══════════════ */}
        {step === 1 && (
          <div style={stepStyle}>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 4 }}>Map your fields</h1>
              <p style={{ color: "#94a3b8", fontSize: ".9rem" }}>Tell us what each column represents. We&apos;ve auto-detected what we can.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.mappings.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: "#0f0f18", border: "1px solid #1e1e2e" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                    <code style={{ fontSize: ".8rem", color: "#e2e8f0", fontWeight: 600 }}>{m.column}</code>
                    {m.autoSuggested && m.mappedTo !== "_skip" && (
                      <span style={{ fontSize: ".6rem", padding: "1px 6px", borderRadius: 4, background: "#6366f118", color: "#6366f1", fontWeight: 700 }}>auto</span>
                    )}
                  </div>
                  <ArrowRight size={14} style={{ color: "#3a3a4a", flexShrink: 0 }} />
                  <select
                    value={m.mappedTo}
                    onChange={(e) => {
                      const newMappings = [...data.mappings];
                      newMappings[i] = { ...m, mappedTo: e.target.value, autoSuggested: false };
                      setData((d) => ({ ...d, mappings: newMappings }));
                    }}
                    style={{
                      width: 180, padding: "6px 10px", borderRadius: 6, fontSize: ".8rem",
                      background: "#1a1a28", border: "1px solid #2a2a3a", color: m.mappedTo === "_skip" ? "#64748b" : "#e2e8f0",
                      fontFamily: "inherit", cursor: "pointer",
                    }}
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Mapped fields preview */}
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "#6366f108", border: "1px solid #6366f120" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#6366f1", marginBottom: 6 }}>Available @ fields for rules</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {mappedFields.length > 0 ? mappedFields.map((f) => (
                  <span key={f} style={{ padding: "3px 10px", borderRadius: 6, background: "#6366f120", color: "#a5b4fc", fontSize: ".75rem", fontWeight: 600 }}>@{f}</span>
                )) : (
                  <span style={{ color: "#64748b", fontSize: ".8rem" }}>Map fields above to create @ references</span>
                )}
              </div>
            </div>

            {!canProceedStep2 && (
              <div style={{ fontSize: ".8rem", color: "#f59e0b", padding: "8px 12px", borderRadius: 6, background: "#f59e0b08", border: "1px solid #f59e0b20" }}>
                {!hasPartnerName && "⚠ Map at least one column to Partner Name. "}
                {!hasDealField && "⚠ Map at least one column to a Deal field (Value, Status, or Date)."}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ STEP 3: Natural Language Rules ══════════════ */}
        {step === 2 && (
          <div style={stepStyle}>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 4 }}>Configure your rules</h1>
              <p style={{ color: "#94a3b8", fontSize: ".9rem" }}>Type rules in plain English. Use @field to reference your data. Or pick a template below.</p>
            </div>

            {/* Templates */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {RULE_TEMPLATES.filter((t) => {
                const fieldMatch = t.match(/@(\w+)/);
                return !fieldMatch || mappedFields.includes(fieldMatch[1]);
              }).map((t, i) => (
                <button
                  key={i}
                  onClick={() => setData((d) => ({ ...d, ruleText: d.ruleText ? d.ruleText + "\n" + t : t }))}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
                    border: "1px solid #2a2a3a", background: "#0f0f18", color: "#94a3b8",
                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  }}
                >
                  <Zap size={12} style={{ marginRight: 4, verticalAlign: "middle", color: "#6366f1" }} />
                  {t}
                </button>
              ))}
            </div>

            {/* Textarea with @ autocomplete */}
            <div style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                value={data.ruleText}
                onChange={handleRuleInput}
                onKeyDown={handleRuleKeyDown}
                placeholder={"Type your rules here...\nExample: When @partner_tier is Gold, commission is 20%"}
                rows={6}
                style={{
                  width: "100%", padding: "14px", borderRadius: 10, fontSize: ".9rem",
                  background: "#0f0f18", border: "1px solid #2a2a3a", color: "#e2e8f0",
                  fontFamily: "inherit", resize: "vertical", lineHeight: 1.6,
                }}
              />

              {/* Autocomplete dropdown */}
              {showAutocomplete && filteredFields.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, marginTop: 4, zIndex: 50,
                  background: "#1a1a28", border: "1px solid #2a2a3a", borderRadius: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,.5)", overflow: "hidden", minWidth: 200,
                }}>
                  {filteredFields.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => insertField(f.value)}
                      style={{
                        display: "block", width: "100%", padding: "8px 14px", textAlign: "left",
                        background: "transparent", border: "none", color: "#e2e8f0",
                        fontSize: ".8rem", cursor: "pointer", fontFamily: "inherit",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#6366f118")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <AtSign size={12} style={{ marginRight: 6, color: "#6366f1", verticalAlign: "middle" }} />
                      <span style={{ fontWeight: 600 }}>{f.value}</span>
                      <span style={{ marginLeft: 8, color: "#64748b" }}>{f.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live rule preview */}
            <div style={{ borderRadius: 10, border: "1px solid #1e1e2e", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: "#111118", fontSize: ".75rem", fontWeight: 700, color: "#94a3b8" }}>
                Rules I understood ({parsedRules.length})
              </div>
              {parsedRules.length > 0 ? (
                <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {parsedRules.map((r) => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#22c55e08", border: "1px solid #22c55e20" }}>
                      <Check size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                      <span style={{ fontSize: ".85rem" }}>
                        When <span style={{ padding: "1px 6px", borderRadius: 4, background: "#6366f120", color: "#a5b4fc", fontWeight: 600 }}>@{r.field}</span>
                        {" "}{r.operator}{" "}
                        <strong>{r.value}</strong> → commission is <strong style={{ color: "#22c55e" }}>{r.actionValue}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontSize: ".85rem" }}>
                  Type or select rules above to see them parsed here
                </div>
              )}
            </div>

            {/* Use defaults button */}
            {parsedRules.length === 0 && (
              <button
                onClick={() => {
                  const defaultRules: ParsedRule[] = [
                    { id: "d1", field: "partner_tier", operator: "is", value: "Gold", action: "commission", actionValue: "20%" },
                    { id: "d2", field: "partner_tier", operator: "is", value: "Silver", action: "commission", actionValue: "15%" },
                    { id: "d3", field: "partner_tier", operator: "is", value: "Bronze", action: "commission", actionValue: "10%" },
                  ];
                  setData((d) => ({
                    ...d,
                    rules: defaultRules,
                    ruleText: "When @partner_tier is Gold, commission is 20%\nWhen @partner_tier is Silver, commission is 15%\nWhen @partner_tier is Bronze, commission is 10%",
                  }));
                }}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: "1px solid #2a2a3a",
                  background: "#0f0f18", color: "#94a3b8", fontSize: ".85rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Use default rules (tier-based commissions)
              </button>
            )}
          </div>
        )}

        {/* ══════════════ STEP 4: Review & Go ══════════════ */}
        {step === 3 && (
          <div style={stepStyle}>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 4 }}>Ready to launch</h1>
              <p style={{ color: "#94a3b8", fontSize: ".9rem" }}>Here&apos;s what we&apos;ll set up for you.</p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {(() => {
                const partnerIdx = data.mappings.findIndex((m) => m.mappedTo === "partner_name");
                const uniquePartners = new Set(data.rows.map((r) => partnerIdx >= 0 ? r[partnerIdx] : "").filter(Boolean));
                return [
                  { label: "Partners", value: uniquePartners.size, color: "#6366f1" },
                  { label: "Deals", value: data.rows.length, color: "#22c55e" },
                  { label: "Rules", value: data.rules.length, color: "#f59e0b" },
                ];
              })().map((s) => (
                <div key={s.label} style={{ padding: "1.25rem", borderRadius: 10, background: "#0f0f18", border: "1px solid #1e1e2e", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: ".8rem", color: "#94a3b8", fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Field Mappings */}
            <div style={{ borderRadius: 10, border: "1px solid #1e1e2e", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: "#111118", fontSize: ".75rem", fontWeight: 700, color: "#94a3b8" }}>Field Mappings</div>
              <div style={{ padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.mappings.filter((m) => m.mappedTo !== "_skip").map((m) => (
                  <div key={m.column} style={{ padding: "4px 10px", borderRadius: 6, background: "#1a1a28", fontSize: ".78rem" }}>
                    <span style={{ color: "#64748b" }}>{m.column}</span>
                    <span style={{ margin: "0 6px", color: "#3a3a4a" }}>→</span>
                    <span style={{ color: "#a5b4fc", fontWeight: 600 }}>@{m.mappedTo}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div style={{ borderRadius: 10, border: "1px solid #1e1e2e", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: "#111118", fontSize: ".75rem", fontWeight: 700, color: "#94a3b8" }}>Commission Rules</div>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                {data.rules.map((r) => (
                  <div key={r.id} style={{ padding: "6px 12px", borderRadius: 6, background: "#22c55e08", border: "1px solid #22c55e20", fontSize: ".85rem" }}>
                    When <strong>@{r.field}</strong> {r.operator} <strong>{r.value}</strong> → <strong style={{ color: "#22c55e" }}>{r.actionValue}</strong> commission
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 28px", borderRadius: 10, border: "none",
                background: saving ? "#4a4a5a" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: saving ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {saving ? (launchStatus || "Setting up...") : <><Rocket size={18} /> Launch Covant →</>}
            </button>
          </div>
        )}

        {/* ── Navigation ── */}
        {step < 3 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                borderRadius: 8, border: "1px solid #2a2a3a", background: "transparent",
                color: step === 0 ? "#3a3a4a" : "#94a3b8", fontSize: ".85rem", fontWeight: 600,
                cursor: step === 0 ? "default" : "pointer", fontFamily: "inherit",
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={(step === 0 && !canProceedStep1) || (step === 1 && !canProceedStep2) || (step === 2 && !canProceedStep3)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
                borderRadius: 8, border: "none",
                background: ((step === 0 && canProceedStep1) || (step === 1 && canProceedStep2) || (step === 2 && canProceedStep3))
                  ? "#6366f1" : "#2a2a3a",
                color: "#fff", fontSize: ".85rem", fontWeight: 600,
                cursor: ((step === 0 && canProceedStep1) || (step === 1 && canProceedStep2) || (step === 2 && canProceedStep3))
                  ? "pointer" : "default",
                fontFamily: "inherit",
              }}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
