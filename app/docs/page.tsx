"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Book, Code2, Zap, Key, Send, Webhook, Users, Briefcase,
  DollarSign, BarChart3, ChevronRight, Copy, Check, ExternalLink,
} from "lucide-react";

const BASE_URL = "https://api.covant.ai/v1";

type Endpoint = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  responseExample: string;
  requestExample?: string;
};

type Section = {
  id: string;
  title: string;
  icon: typeof Book;
  description: string;
  endpoints: Endpoint[];
};

const METHOD_COLORS: Record<string, { bg: string; fg: string }> = {
  GET: { bg: "#22c55e20", fg: "#22c55e" },
  POST: { bg: "#3b82f620", fg: "#3b82f6" },
  PUT: { bg: "#eab30820", fg: "#eab308" },
  PATCH: { bg: "#f59e0b20", fg: "#f59e0b" },
  DELETE: { bg: "#ef444420", fg: "#ef4444" },
};

const API_SECTIONS: Section[] = [
  {
    id: "partners",
    title: "Partners",
    icon: Users,
    description: "Create, list, and manage partner accounts",
    endpoints: [
      {
        method: "GET", path: "/partners", description: "List all partners with optional filtering",
        params: [
          { name: "status", type: "string", required: false, description: "Filter by status: active, inactive, pending" },
          { name: "tier", type: "string", required: false, description: "Filter by tier: bronze, silver, gold, platinum" },
          { name: "type", type: "string", required: false, description: "Filter by type: affiliate, referral, reseller, integration" },
          { name: "limit", type: "number", required: false, description: "Max results (default 50, max 200)" },
          { name: "offset", type: "number", required: false, description: "Pagination offset" },
        ],
        responseExample: `{
  "data": [
    {
      "id": "ptr_abc123",
      "name": "TechBridge",
      "email": "partner@techbridge.io",
      "type": "reseller",
      "tier": "gold",
      "commission_rate": 0.10,
      "status": "active",
      "score": 78,
      "created_at": "2025-09-15T00:00:00Z"
    }
  ],
  "total": 42,
  "has_more": true
}`,
      },
      {
        method: "POST", path: "/partners", description: "Create a new partner",
        requestExample: `{
  "name": "TechBridge Solutions",
  "email": "partners@acme.co",
  "type": "referral",
  "commission_rate": 0.08,
  "contact_name": "Jane Smith",
  "territory": "US-West"
}`,
        responseExample: `{
  "id": "ptr_def456",
  "name": "TechBridge Solutions",
  "status": "pending",
  "tier": "bronze",
  "created_at": "2026-02-18T17:30:00Z"
}`,
      },
      {
        method: "GET", path: "/partners/:id/score", description: "Get partner score breakdown",
        responseExample: `{
  "overall_score": 78,
  "recommended_tier": "gold",
  "dimensions": {
    "revenue": { "score": 85, "weight": 0.35 },
    "pipeline": { "score": 70, "weight": 0.25 },
    "engagement": { "score": 80, "weight": 0.25 },
    "velocity": { "score": 65, "weight": 0.15 }
  },
  "tier_change": "maintain"
}`,
      },
    ],
  },
  {
    id: "deals",
    title: "Deals",
    icon: Briefcase,
    description: "Manage deal registrations and pipeline",
    endpoints: [
      {
        method: "GET", path: "/deals", description: "List deals with filtering and attribution data",
        params: [
          { name: "status", type: "string", required: false, description: "open, won, lost" },
          { name: "partner_id", type: "string", required: false, description: "Filter by attributed partner" },
          { name: "since", type: "string", required: false, description: "ISO date — deals created after this date" },
        ],
        responseExample: `{
  "data": [
    {
      "id": "deal_xyz789",
      "name": "CloudSync Enterprise Migration",
      "amount": 85000,
      "status": "won",
      "registered_by": "ptr_abc123",
      "registration_status": "approved",
      "touchpoints": 4,
      "closed_at": "2026-02-10T00:00:00Z"
    }
  ],
  "total": 156
}`,
      },
      {
        method: "POST", path: "/deals/register", description: "Register a new deal (partner-initiated)",
        requestExample: `{
  "partner_id": "ptr_abc123",
  "company_name": "Globex Industries",
  "amount": 120000,
  "contact_name": "Bob Chen",
  "contact_email": "bob@globex.com",
  "expected_close_date": "2026-04-15",
  "notes": "Data platform modernization"
}`,
        responseExample: `{
  "id": "deal_new001",
  "registration_status": "pending",
  "exclusivity_days": 90,
  "created_at": "2026-02-18T17:30:00Z"
}`,
      },
    ],
  },
  {
    id: "attributions",
    title: "Attribution",
    icon: BarChart3,
    description: "Revenue attribution and touchpoint tracking",
    endpoints: [
      {
        method: "POST", path: "/touchpoints", description: "Record a partner touchpoint on a deal",
        requestExample: `{
  "deal_id": "deal_xyz789",
  "partner_id": "ptr_abc123",
  "type": "co_sell",
  "notes": "Joint demo with customer CTO",
  "weight": 1.5
}`,
        responseExample: `{
  "id": "tp_001",
  "deal_id": "deal_xyz789",
  "partner_id": "ptr_abc123",
  "type": "co_sell",
  "created_at": "2026-02-18T17:30:00Z"
}`,
      },
      {
        method: "GET", path: "/attributions", description: "Get attribution results across models",
        params: [
          { name: "deal_id", type: "string", required: false, description: "Filter by deal" },
          { name: "partner_id", type: "string", required: false, description: "Filter by partner" },
          { name: "model", type: "string", required: false, description: "equal_split, first_touch, last_touch, time_decay, role_based" },
        ],
        responseExample: `{
  "data": [
    {
      "deal_id": "deal_xyz789",
      "partner_id": "ptr_abc123",
      "model": "role_based",
      "percentage": 65.0,
      "attributed_amount": 55250,
      "commission_amount": 5525
    }
  ]
}`,
      },
    ],
  },
  {
    id: "payouts",
    title: "Payouts",
    icon: DollarSign,
    description: "Commission payouts and payment tracking",
    endpoints: [
      {
        method: "GET", path: "/payouts", description: "List payouts with status filtering",
        params: [
          { name: "partner_id", type: "string", required: false, description: "Filter by partner" },
          { name: "status", type: "string", required: false, description: "pending_approval, approved, processing, paid, failed" },
          { name: "period", type: "string", required: false, description: "Filter by period (e.g. 2026-Q1)" },
        ],
        responseExample: `{
  "data": [
    {
      "id": "pay_001",
      "partner_id": "ptr_abc123",
      "amount": 4200,
      "status": "paid",
      "period": "2026-Q1",
      "paid_at": "2026-02-15T00:00:00Z"
    }
  ]
}`,
      },
      {
        method: "POST", path: "/payouts/:id/approve", description: "Approve a pending payout",
        responseExample: `{ "id": "pay_001", "status": "approved", "approved_at": "2026-02-18T17:30:00Z" }`,
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: Webhook,
    description: "Inbound event ingestion from CRMs and external systems",
    endpoints: [
      {
        method: "POST", path: "/webhooks/:source_id/ingest", description: "Send events from an external source (Salesforce, HubSpot, etc.)",
        requestExample: `{
  "event_type": "deal.won",
  "timestamp": "2026-02-18T17:30:00Z",
  "payload": {
    "deal_id": "sf_opp_001",
    "amount": 85000,
    "account_name": "CloudSync Corp",
    "partner_email": "partner@techbridge.io"
  }
}`,
        responseExample: `{
  "id": "evt_abc123",
  "status": "accepted",
  "processed": true
}`,
        params: [
          { name: "X-Webhook-Secret", type: "header", required: true, description: "Source-specific webhook signing secret" },
        ],
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: copied ? "#22c55e" : "#555" }}
      title="Copy"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div style={{ background: "#0a0a0a", borderRadius: 10, overflow: "hidden", border: "1px solid #1a1a1a" }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
          <span style={{ fontSize: ".7rem", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre style={{ padding: "12px 16px", margin: 0, fontSize: ".8rem", lineHeight: 1.6, color: "#a3a3a3", overflowX: "auto", fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
        {code}
      </pre>
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const c = METHOD_COLORS[method] || METHOD_COLORS.GET;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: ".7rem", fontWeight: 800, background: c.bg, color: c.fg, fontFamily: "monospace" }}>
      {method}
    </span>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("partners");
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const section = API_SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff", textDecoration: "none", letterSpacing: "-.02em" }}>covant</Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ fontSize: ".9rem", color: "#888" }}>API Documentation</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/dashboard" style={{ fontSize: ".8rem", color: "#666", textDecoration: "none" }}>Dashboard →</Link>
        </div>
      </header>

      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
        {/* Sidebar */}
        <nav style={{ width: 220, flexShrink: 0, borderRight: "1px solid #1a1a1a", padding: "1.5rem 1rem", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#555", marginBottom: 8 }}>Getting Started</div>
            <a href="#auth" style={{ display: "block", fontSize: ".85rem", padding: "6px 10px", borderRadius: 6, color: "#888", textDecoration: "none" }}>Authentication</a>
            <a href="#errors" style={{ display: "block", fontSize: ".85rem", padding: "6px 10px", borderRadius: 6, color: "#888", textDecoration: "none" }}>Errors</a>
          </div>
          <div>
            <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#555", marginBottom: 8 }}>Endpoints</div>
            {API_SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 6,
                    fontSize: ".85rem", fontWeight: isActive ? 600 : 400, cursor: "pointer",
                    background: isActive ? "#1a1a1a" : "transparent", color: isActive ? "#fff" : "#888",
                    border: "none", textAlign: "left", fontFamily: "inherit",
                  }}
                >
                  <Icon size={15} /> {s.title}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: "2rem 2.5rem", maxWidth: 800 }}>
          {/* Auth section */}
          <section id="auth" style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: ".5rem" }}>Authentication</h2>
            <p style={{ color: "#888", lineHeight: 1.6, marginBottom: "1rem" }}>
              All API requests require an API key passed in the <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: 4, fontSize: ".85rem" }}>Authorization</code> header.
            </p>
            <CodeBlock label="Example" code={`curl ${BASE_URL}/partners \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`} />
            <p style={{ color: "#666", fontSize: ".8rem", marginTop: ".75rem" }}>
              Find your API key in <Link href="/dashboard/settings" style={{ color: "#6366f1" }}>Dashboard → Settings</Link>. Use <code style={{ background: "#1a1a1a", padding: "1px 4px", borderRadius: 3 }}>cv_test_</code> prefix for sandbox, <code style={{ background: "#1a1a1a", padding: "1px 4px", borderRadius: 3 }}>cv_live_</code> for production.
            </p>
          </section>

          {/* Error codes */}
          <section id="errors" style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: ".5rem" }}>Error Codes</h2>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                { code: "400", label: "Bad Request", desc: "Invalid parameters" },
                { code: "401", label: "Unauthorized", desc: "Missing or invalid API key" },
                { code: "403", label: "Forbidden", desc: "Insufficient permissions" },
                { code: "404", label: "Not Found", desc: "Resource doesn't exist" },
                { code: "429", label: "Rate Limited", desc: "Too many requests (100/min)" },
                { code: "500", label: "Server Error", desc: "Something went wrong" },
              ].map((e) => (
                <div key={e.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #111" }}>
                  <code style={{ fontSize: ".8rem", fontWeight: 700, color: parseInt(e.code) >= 500 ? "#ef4444" : parseInt(e.code) >= 400 ? "#eab308" : "#22c55e", width: 30 }}>{e.code}</code>
                  <span style={{ fontWeight: 600, fontSize: ".85rem", width: 120 }}>{e.label}</span>
                  <span style={{ color: "#666", fontSize: ".85rem" }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Active section endpoints */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".5rem" }}>
              <section.icon size={22} style={{ color: "#6366f1" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{section.title}</h2>
            </div>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>{section.description}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {section.endpoints.map((ep, i) => {
                const key = `${ep.method}-${ep.path}`;
                const isExpanded = expandedEndpoint === key;
                return (
                  <div key={i} style={{ border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
                    <div
                      onClick={() => setExpandedEndpoint(isExpanded ? null : key)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", background: isExpanded ? "#0d0d0d" : "transparent" }}
                    >
                      <MethodBadge method={ep.method} />
                      <code style={{ fontSize: ".85rem", color: "#ccc", flex: 1 }}>{ep.path}</code>
                      <span style={{ fontSize: ".8rem", color: "#666" }}>{ep.description}</span>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #1a1a1a", background: "#060606" }}>
                        <p style={{ color: "#999", fontSize: ".85rem", lineHeight: 1.6, marginBottom: "1rem" }}>{ep.description}</p>

                        {ep.params && ep.params.length > 0 && (
                          <div style={{ marginBottom: "1rem" }}>
                            <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "#555", marginBottom: 8 }}>Parameters</div>
                            {ep.params.map((p) => (
                              <div key={p.name} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: "1px solid #111", fontSize: ".85rem" }}>
                                <code style={{ color: "#e5e5e5", fontWeight: 600, minWidth: 120 }}>{p.name}</code>
                                <span style={{ color: "#6366f1", fontSize: ".75rem", minWidth: 60 }}>{p.type}</span>
                                {p.required && <span style={{ fontSize: ".65rem", padding: "1px 6px", borderRadius: 4, background: "#ef444420", color: "#ef4444", fontWeight: 700 }}>required</span>}
                                <span style={{ color: "#666" }}>{p.description}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {ep.requestExample && (
                          <div style={{ marginBottom: "1rem" }}>
                            <CodeBlock label="Request Body" code={ep.requestExample} />
                          </div>
                        )}

                        <CodeBlock label="Response" code={ep.responseExample} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
