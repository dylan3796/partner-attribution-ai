"use client";

import { useState } from "react";
import {
  Plug, CheckCircle2, XCircle, Clock, Settings, ExternalLink,
  RefreshCw, Zap, ArrowRight, Shield, AlertTriangle,
} from "lucide-react";

type IntegrationStatus = "connected" | "disconnected" | "error" | "syncing";

type Integration = {
  id: string;
  name: string;
  logo: string; // emoji for demo
  category: "crm" | "payments" | "communication" | "analytics" | "automation";
  description: string;
  status: IntegrationStatus;
  lastSync?: number;
  syncedRecords?: number;
  features: string[];
  popular?: boolean;
};

const DAY = 86400000;
const now = Date.now();

const demoIntegrations: Integration[] = [
  {
    id: "salesforce", name: "Salesforce", logo: "☁️", category: "crm",
    description: "Sync deals, contacts, and opportunities bi-directionally",
    status: "connected", lastSync: now - 15 * 60000, syncedRecords: 1247,
    features: ["Deal sync", "Contact import", "Opportunity mapping", "Custom field mapping", "Real-time webhooks"],
    popular: true,
  },
  {
    id: "hubspot", name: "HubSpot", logo: "🟠", category: "crm",
    description: "Import deals and contacts from HubSpot CRM",
    status: "disconnected",
    features: ["Deal pipeline sync", "Contact import", "Company matching", "Activity logging"],
    popular: true,
  },
  {
    id: "stripe", name: "Stripe", logo: "💳", category: "payments",
    description: "Automate partner commission payouts via Stripe Connect",
    status: "connected", lastSync: now - 2 * 3600000, syncedRecords: 89,
    features: ["Automated payouts", "Commission splitting", "Tax form generation", "Multi-currency"],
    popular: true,
  },
  {
    id: "slack", name: "Slack", logo: "💬", category: "communication",
    description: "Deal alerts, payout notifications, and partner activity in Slack channels",
    status: "connected", lastSync: now - 5 * 60000,
    features: ["Deal won alerts", "Payout notifications", "Weekly digest", "Partner activity feed"],
  },
  {
    id: "pipedrive", name: "Pipedrive", logo: "🟢", category: "crm",
    description: "Sync your Pipedrive pipeline with partner attribution",
    status: "disconnected",
    features: ["Deal sync", "Pipeline mapping", "Activity tracking"],
  },
  {
    id: "quickbooks", name: "QuickBooks", logo: "📗", category: "payments",
    description: "Sync payouts and commissions to QuickBooks for accounting",
    status: "disconnected",
    features: ["Invoice generation", "Payout reconciliation", "Tax reporting", "Expense tracking"],
  },
  {
    id: "zapier", name: "Zapier", logo: "⚡", category: "automation",
    description: "Connect Covant to 5,000+ apps with no-code automations",
    status: "connected", lastSync: now - 30 * 60000, syncedRecords: 342,
    features: ["Trigger on events", "Multi-step zaps", "Custom webhooks", "Scheduled automations"],
    popular: true,
  },
  {
    id: "google_analytics", name: "Google Analytics", logo: "📊", category: "analytics",
    description: "Track partner-referred traffic and conversion attribution",
    status: "disconnected",
    features: ["UTM tracking", "Conversion goals", "Partner traffic reports", "Multi-touch attribution"],
  },
  {
    id: "microsoft_teams", name: "Microsoft Teams", logo: "🟦", category: "communication",
    description: "Partner notifications and deal alerts in Teams channels",
    status: "disconnected",
    features: ["Channel notifications", "Deal alerts", "Adaptive cards", "Bot commands"],
  },
  {
    id: "segment", name: "Segment", logo: "🟩", category: "analytics",
    description: "Unified event tracking across your partner program",
    status: "disconnected",
    features: ["Event forwarding", "Identity resolution", "Data warehouse sync"],
  },
  {
    id: "xero", name: "Xero", logo: "🔵", category: "payments",
    description: "Accounting integration for partner payouts and invoicing",
    status: "disconnected",
    features: ["Invoice sync", "Payout tracking", "Tax compliance"],
  },
  {
    id: "make", name: "Make (Integromat)", logo: "🟣", category: "automation",
    description: "Advanced workflow automation for partner operations",
    status: "disconnected",
    features: ["Visual workflows", "Conditional logic", "Data transformation", "Scheduled runs"],
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  crm: { label: "CRM", color: "#3b82f6" },
  payments: { label: "Payments", color: "#22c55e" },
  communication: { label: "Communication", color: "#8b5cf6" },
  analytics: { label: "Analytics", color: "#f59e0b" },
  automation: { label: "Automation", color: "#ec4899" },
};

const STATUS_CONFIG: Record<IntegrationStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "Connected", color: "#22c55e", icon: CheckCircle2 },
  disconnected: { label: "Not connected", color: "#64748b", icon: XCircle },
  error: { label: "Error", color: "#ef4444", icon: AlertTriangle },
  syncing: { label: "Syncing...", color: "#6366f1", icon: RefreshCw },
};

function timeAgo(ts: number): string {
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(diff / DAY)}d ago`;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(demoIntegrations);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const connected = integrations.filter((i) => i.status === "connected");
  const filtered = integrations.filter((i) => {
    if (filterCategory !== "all" && i.category !== filterCategory) return false;
    if (filterStatus === "connected" && i.status !== "connected") return false;
    if (filterStatus === "disconnected" && i.status !== "disconnected") return false;
    return true;
  });

  function toggleConnect(id: string) {
    setIntegrations((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: i.status === "connected" ? "disconnected" as const : "connected" as const, lastSync: i.status !== "connected" ? Date.now() : i.lastSync } : i
    ));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Integrations</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>Connect your tools to automate partner operations</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { icon: <Plug size={22} />, label: "Connected", value: String(connected.length), sub: `of ${integrations.length} available`, color: "#22c55e" },
          { icon: <Zap size={22} />, label: "Events Today", value: "1,847", color: "#6366f1" },
          { icon: <RefreshCw size={22} />, label: "Records Synced", value: connected.reduce((s, i) => s + (i.syncedRecords || 0), 0).toLocaleString(), color: "#f59e0b" },
          { icon: <Shield size={22} />, label: "API Health", value: "99.9%", sub: "uptime", color: "#22c55e" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
            <div>
              <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{s.value}</div>
              {s.sub && <div className="muted" style={{ fontSize: ".8rem" }}>{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["all", ...Object.keys(CATEGORY_LABELS)].map((cat) => {
          const cfg = CATEGORY_LABELS[cat];
          const count = cat === "all" ? integrations.length : integrations.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "4px 14px", borderRadius: 999, fontSize: ".8rem", fontWeight: 600, cursor: "pointer",
                border: filterCategory === cat ? `2px solid ${cfg?.color || "#6366f1"}` : "1px solid var(--border)",
                background: filterCategory === cat ? `${cfg?.color || "#6366f1"}15` : "transparent",
                color: filterCategory === cat ? (cfg?.color || "#6366f1") : "var(--muted)",
                textTransform: "capitalize",
              }}
            >
              {cat === "all" ? "All" : cfg.label} ({count})
            </button>
          );
        })}
        <div style={{ marginLeft: "auto" }}>
          <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: 160, fontSize: ".8rem" }}>
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="disconnected">Available</option>
          </select>
        </div>
      </div>

      {/* Integration cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
        {filtered.sort((a, b) => (a.status === "connected" ? 0 : 1) - (b.status === "connected" ? 0 : 1)).map((intg) => {
          const statusCfg = STATUS_CONFIG[intg.status];
          const StatusIcon = statusCfg.icon;
          const catCfg = CATEGORY_LABELS[intg.category];
          const isExpanded = expandedId === intg.id;

          return (
            <div
              key={intg.id}
              className="card"
              style={{
                padding: 0, overflow: "hidden",
                border: intg.status === "connected" ? `1px solid ${statusCfg.color}33` : "1px solid var(--border)",
              }}
            >
              <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.5rem" }}>{intg.logo}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: "1rem" }}>{intg.name}</span>
                        {intg.popular && <span style={{ padding: "1px 6px", borderRadius: 999, fontSize: ".6rem", fontWeight: 700, background: "#6366f120", color: "#6366f1" }}>Popular</span>}
                      </div>
                      <span style={{ padding: "1px 7px", borderRadius: 999, fontSize: ".65rem", fontWeight: 600, background: `${catCfg.color}15`, color: catCfg.color }}>{catCfg.label}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: statusCfg.color }}>
                    <StatusIcon size={14} />
                    <span style={{ fontSize: ".75rem", fontWeight: 600 }}>{statusCfg.label}</span>
                  </div>
                </div>

                <p className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5, marginBottom: 12 }}>{intg.description}</p>

                {/* Connected info */}
                {intg.status === "connected" && (
                  <div style={{ display: "flex", gap: "1rem", fontSize: ".75rem", marginBottom: 12 }}>
                    {intg.lastSync && <span className="muted">Last sync: {timeAgo(intg.lastSync)}</span>}
                    {intg.syncedRecords && <span className="muted">{intg.syncedRecords.toLocaleString()} records</span>}
                  </div>
                )}

                {/* Features preview */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                  {intg.features.slice(0, 3).map((f) => (
                    <span key={f} style={{ padding: "2px 8px", borderRadius: 6, fontSize: ".7rem", fontWeight: 500, background: "var(--subtle)", color: "var(--muted)" }}>{f}</span>
                  ))}
                  {intg.features.length > 3 && (
                    <span style={{ fontSize: ".7rem", color: "var(--muted)", padding: "2px 4px" }}>+{intg.features.length - 3} more</span>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={() => toggleConnect(intg.id)}
                  style={{
                    width: "100%", padding: "8px", borderRadius: 8, fontSize: ".85rem", fontWeight: 600, cursor: "pointer",
                    border: intg.status === "connected" ? "1px solid var(--border)" : "none",
                    background: intg.status === "connected" ? "transparent" : "#6366f1",
                    color: intg.status === "connected" ? "var(--muted)" : "#fff",
                    fontFamily: "inherit",
                  }}
                >
                  {intg.status === "connected" ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
