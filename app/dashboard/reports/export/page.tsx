"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Download, Users, Briefcase, DollarSign, Activity,
  FileText, Shield, Package, CheckCircle, Loader2, Database,
} from "lucide-react";

// ─── CSV helpers ─────────────────────────────────────────────────────────────

function escapeCsv(val: string | number | boolean | undefined | null): string {
  if (val === undefined || val === null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvRow(values: (string | number | boolean | undefined | null)[]): string {
  return values.map(escapeCsv).join(",");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function fmtDate(ts?: number | null): string {
  if (!ts) return "";
  return new Date(ts).toISOString().slice(0, 19).replace("T", " ");
}

// ─── Export definitions ──────────────────────────────────────────────────────

type ExportCard = {
  id: string;
  label: string;
  description: string;
  icon: typeof Users;
  color: string;
  countKey: string;
};

const EXPORTS: ExportCard[] = [
  { id: "partners", label: "Partners", description: "All partner records — name, email, type, tier, status, commission rate, territory", icon: Users, color: "#6366f1", countKey: "partners" },
  { id: "deals", label: "Deals", description: "All deal records — name, amount, status, stage, contact, product, dates", icon: Briefcase, color: "#22c55e", countKey: "deals" },
  { id: "payouts", label: "Payouts", description: "All payout records — partner, deal, amount, status, period, approval dates", icon: DollarSign, color: "#f59e0b", countKey: "payouts" },
  { id: "touchpoints", label: "Touchpoints", description: "All partner touchpoints — type, partner, deal, notes, timestamps", icon: Activity, color: "#8b5cf6", countKey: "touchpoints" },
  { id: "auditLog", label: "Audit Log", description: "Full audit trail — every action, user, entity, and detail", icon: FileText, color: "#ec4899", countKey: "auditLog" },
  { id: "commissionRules", label: "Commission Rules", description: "All commission rule configurations — type, value, conditions", icon: Shield, color: "#14b8a6", countKey: "commissionRules" },
  { id: "products", label: "Products", description: "Product catalog — SKU, name, category, pricing, margin, status", icon: Package, color: "#f97316", countKey: "products" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExportCenterPage() {
  const counts = useQuery(api.exports.getCounts);
  const partners = useQuery(api.partners.list);
  const deals = useQuery(api.exports.getAllDeals);
  const payouts = useQuery(api.exports.getAllPayouts);
  const touchpoints = useQuery(api.exports.getAllTouchpoints);
  const auditLog = useQuery(api.exports.getAllAuditLog);
  const commissionRules = useQuery(api.commissionRules.list);
  const products = useQuery(api.products.list);

  const [downloading, setDownloading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const today = new Date().toISOString().slice(0, 10);

  function handleExport(id: string) {
    setDownloading(id);

    try {
      switch (id) {
        case "partners": {
          if (!partners?.length) break;
          const header = "Name,Email,Type,Tier,Commission Rate %,Status,Contact,Territory,Created";
          const rows = partners.map((p: any) =>
            toCsvRow([p.name, p.email, p.type, p.tier, p.commissionRate, p.status, p.contactName, p.territory, fmtDate(p.createdAt)])
          );
          downloadCsv([header, ...rows].join("\n"), `covant-partners-${today}.csv`);
          break;
        }
        case "deals": {
          if (!deals?.length) break;
          const header = "Name,Amount,Status,Contact,Product,Registration Status,Created,Closed";
          const rows = deals.map((d: any) =>
            toCsvRow([d.name, d.amount, d.status, d.contactName, d.productName, d.registrationStatus, fmtDate(d.createdAt), fmtDate(d.closedAt)])
          );
          downloadCsv([header, ...rows].join("\n"), `covant-deals-${today}.csv`);
          break;
        }
        case "payouts": {
          if (!payouts?.length) break;
          const header = "Partner,Amount,Status,Period,Notes,Created,Approved At";
          const rows = payouts.map((p: any) =>
            toCsvRow([p.partnerName, p.amount, p.status, p.period, p.notes, fmtDate(p.createdAt), fmtDate(p.approvedAt)])
          );
          downloadCsv([header, ...rows].join("\n"), `covant-payouts-${today}.csv`);
          break;
        }
        case "touchpoints": {
          if (!touchpoints?.length) break;
          const header = "Type,Partner,Deal,Notes,Date";
          const rows = touchpoints.map((tp: any) =>
            toCsvRow([tp.type, tp.partnerName, tp.dealName, tp.notes, fmtDate(tp.createdAt ?? tp.date)])
          );
          downloadCsv([header, ...rows].join("\n"), `covant-touchpoints-${today}.csv`);
          break;
        }
        case "auditLog": {
          if (!auditLog?.length) break;
          const header = "Action,Entity Type,Entity ID,User,Details,Timestamp";
          const rows = auditLog.map((e: any) =>
            toCsvRow([e.action, e.entityType, e.entityId, e.userId ?? e.user, e.details ?? e.description, fmtDate(e.createdAt ?? e.timestamp)])
          );
          downloadCsv([header, ...rows].join("\n"), `covant-audit-log-${today}.csv`);
          break;
        }
        case "commissionRules": {
          if (!commissionRules?.length) break;
          const header = "Type,Label,Value,Unit,Tier,Product Line,Partner Type,Min Deal Size,Active";
          const rows = commissionRules.map((r: any) =>
            toCsvRow([r.type, r.label, r.value, r.unit, r.tier, r.productLine, r.partnerType, r.minDealSize, r.active ?? true])
          );
          downloadCsv([header, ...rows].join("\n"), `covant-commission-rules-${today}.csv`);
          break;
        }
        case "products": {
          if (!products?.length) break;
          const header = "SKU,Name,Category,MSRP,Distributor Price,Margin %,Status,Description";
          const rows = products.map((p: any) =>
            toCsvRow([p.sku, p.name, p.category, p.msrp, p.distributorPrice, p.margin, p.status, p.description])
          );
          downloadCsv([header, ...rows].join("\n"), `covant-products-${today}.csv`);
          break;
        }
      }
      setCompleted((prev) => new Set(prev).add(id));
    } finally {
      setTimeout(() => setDownloading(null), 300);
    }
  }

  const isLoading = counts === undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Data Export Center</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>
          Download your program data as CSV files. All exports include your full dataset, org-scoped.
        </p>
      </div>

      {/* Summary stats */}
      <div className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <Database size={20} color="#6366f1" />
        <span style={{ fontSize: ".9rem", fontWeight: 600 }}>
          {isLoading ? (
            <span className="muted">Loading data counts...</span>
          ) : (
            <>
              {(Object.values(counts) as number[]).reduce((a, b) => a + b, 0).toLocaleString()} total records across {EXPORTS.length} data types
            </>
          )}
        </span>
      </div>

      {/* Export cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
        {EXPORTS.map((exp) => {
          const count = counts?.[exp.countKey as keyof typeof counts] ?? 0;
          const isActive = downloading === exp.id;
          const isDone = completed.has(exp.id);
          const isEmpty = counts !== undefined && count === 0;

          return (
            <div
              key={exp.id}
              className="card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: isEmpty ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${exp.color}15`, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <exp.icon size={22} color={exp.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>{exp.label}</p>
                    <p className="muted" style={{ fontSize: ".8rem" }}>
                      {isLoading ? "—" : `${count.toLocaleString()} record${count !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
                {isDone && <CheckCircle size={18} color="#22c55e" />}
              </div>

              <p className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5, flex: 1 }}>{exp.description}</p>

              <button
                className="btn-outline"
                onClick={() => handleExport(exp.id)}
                disabled={isActive || isEmpty || isLoading}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "10px 16px", fontSize: ".875rem", fontWeight: 600,
                  cursor: isEmpty || isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isActive ? (
                  <><Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /> Exporting...</>
                ) : (
                  <><Download size={16} /> Download CSV</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="card" style={{ padding: "1rem 1.25rem" }}>
        <p className="muted" style={{ fontSize: ".8rem", lineHeight: 1.6 }}>
          📁 All exports are formatted as UTF-8 CSV files compatible with Excel, Google Sheets, and any data tool.
          Data is scoped to your organization — no cross-org data is ever included.
          For API-based data access, see <a href="/dashboard/settings/api-keys" style={{ color: "#6366f1", textDecoration: "underline" }}>API Keys</a>.
        </p>
      </div>
    </div>
  );
}
