"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Mail, Building2, Clock, TrendingUp, Users, CheckCircle2, XCircle, Calendar } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  demo_scheduled: "Demo Scheduled",
  demo_completed: "Demo Done",
  qualified: "Qualified",
  customer: "Customer",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#6366f1",
  contacted: "#f59e0b",
  demo_scheduled: "#3b82f6",
  demo_completed: "#8b5cf6",
  qualified: "#10b981",
  customer: "#22c55e",
  lost: "#6b7280",
};

function formatRelTime(ts: number) {
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d}d ago`;
}

export default function LeadsPage() {
  const leads = useQuery(api.leads.getLeads) ?? [];
  const updateStatus = useMutation(api.leads.updateLeadStatus);
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const sourceFiltered = sourceFilter === "all" ? leads
    : sourceFilter === "partner" ? leads.filter(l => l.source === "partner_submitted")
    : leads.filter(l => l.source !== "partner_submitted");
  const filtered = filter === "all" ? sourceFiltered : sourceFiltered.filter(l => l.status === filter);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    qualified: leads.filter(l => l.status === "qualified").length,
    customers: leads.filter(l => l.status === "customer").length,
  };

  async function handleStatusChange(leadId: Id<"leads">, status: string) {
    setUpdating(leadId);
    try {
      await updateStatus({ leadId, status: status as any });
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--fg)", marginBottom: ".25rem" }}>Leads</h1>
        <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>People who signed up for early access from the landing page.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Leads", value: stats.total, icon: <Users size={16} />, color: "#6366f1" },
          { label: "New", value: stats.new, icon: <Mail size={16} />, color: "#f59e0b" },
          { label: "Qualified", value: stats.qualified, icon: <TrendingUp size={16} />, color: "#10b981" },
          { label: "Customers", value: stats.customers, icon: <CheckCircle2 size={16} />, color: "#22c55e" },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: stat.color, marginBottom: ".5rem" }}>
              {stat.icon}
              <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--fg)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Source filter */}
      <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[
          { key: "all", label: `All Sources (${leads.length})` },
          { key: "organic", label: `Organic (${leads.filter(l => l.source !== "partner_submitted").length})` },
          { key: "partner", label: `Partner (${leads.filter(l => l.source === "partner_submitted").length})` },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setSourceFilter(s.key)}
            style={{
              padding: ".4rem .9rem",
              borderRadius: 20,
              border: "1px solid",
              borderColor: sourceFilter === s.key ? "#10b981" : "var(--border)",
              background: sourceFilter === s.key ? "#10b981" : "transparent",
              color: sourceFilter === s.key ? "#fff" : "var(--muted)",
              fontSize: ".8rem",
              cursor: "pointer",
              fontWeight: sourceFilter === s.key ? 600 : 400,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: ".5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {["all", "new", "contacted", "demo_scheduled", "qualified", "customer", "lost"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: ".4rem .9rem",
              borderRadius: 20,
              border: "1px solid",
              borderColor: filter === s ? "#6366f1" : "var(--border)",
              background: filter === s ? "#6366f1" : "transparent",
              color: filter === s ? "#fff" : "var(--muted)",
              fontSize: ".8rem",
              cursor: "pointer",
              fontWeight: filter === s ? 600 : 400,
            }}
          >
            {s === "all" ? `All (${leads.length})` : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <Mail size={32} style={{ color: "var(--muted)", marginBottom: "1rem", opacity: 0.5 }} />
          <p style={{ color: "var(--muted)" }}>
            {leads.length === 0
              ? "No leads yet. They'll appear here when someone signs up on the landing page."
              : "No leads match this filter."}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Email", "Company", "Source", "Status", "First Seen", "Last Seen"].map(h => (
                    <th key={h} style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: ".8rem", color: "var(--muted)", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr
                    key={lead._id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                  >
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f120", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: ".8rem", fontWeight: 600 }}>
                          {lead.email[0].toUpperCase()}
                        </div>
                        <span style={{ color: "var(--fg)", fontSize: ".9rem" }}>{lead.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ color: "var(--muted)", fontSize: ".9rem" }}>{lead.company || "—"}</span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{
                        fontSize: ".75rem",
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: lead.source === "partner_submitted" ? "#6366f120" : "var(--subtle)",
                        color: lead.source === "partner_submitted" ? "#6366f1" : "var(--muted)",
                        fontWeight: lead.source === "partner_submitted" ? 600 : 400,
                      }}>
                        {lead.source === "partner_submitted" ? "Partner" : "Organic"}
                      </span>
                      {lead.partnerName && (
                        <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 2 }}>{lead.partnerName}</div>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <select
                        value={lead.status}
                        onChange={e => handleStatusChange(lead._id, e.target.value)}
                        disabled={updating === lead._id}
                        style={{
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          color: STATUS_COLORS[lead.status] || "var(--fg)",
                          fontSize: ".8rem",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>{formatRelTime(lead.createdAt)}</span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>{formatRelTime(lead.lastSeenAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
