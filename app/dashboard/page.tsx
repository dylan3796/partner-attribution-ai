"use client";

import Link from "next/link";

const stats = [
  { name: "Total Revenue", value: "$284,500", change: "+12.5%" },
  { name: "Active Partners", value: "24", change: "+3" },
  { name: "Open Deals", value: "18", change: "+5" },
  { name: "Attribution Score", value: "87%", change: "-2%" },
];

const recentDeals = [
  { id: "1", name: "Acme Corp Enterprise", amount: 48000, status: "won", partner: "TechStar Solutions" },
  { id: "2", name: "GlobalTech Migration", amount: 32000, status: "open", partner: "CloudBridge Partners" },
  { id: "3", name: "Startup Suite Bundle", amount: 12500, status: "won", partner: "InnovateCo" },
  { id: "4", name: "DataFlow Integration", amount: 85000, status: "open", partner: "DataPipe Agency" },
  { id: "5", name: "SecureNet Rollout", amount: 23000, status: "lost", partner: "CyberShield Partners" },
  { id: "6", name: "FinServ Platform Deal", amount: 67000, status: "won", partner: "FinTech Allies" },
];

const topPartners = [
  { name: "TechStar Solutions", revenue: 124500, deals: 8, type: "Reseller" },
  { name: "CloudBridge Partners", revenue: 89000, deals: 5, type: "Referral" },
  { name: "FinTech Allies", revenue: 67000, deals: 4, type: "Alliance" },
  { name: "InnovateCo", revenue: 45000, deals: 6, type: "Affiliate" },
  { name: "DataPipe Agency", revenue: 38000, deals: 3, type: "Integration" },
];

const statusBadge: Record<string, string> = { won: "badge-success", open: "badge-info", lost: "badge-danger" };

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Dashboard</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>Your partner program at a glance</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {stats.map((s) => (
          <div key={s.name} className="card">
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.5rem" }}>{s.name}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 700 }}>{s.value}</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 500, color: s.change.startsWith("+") ? "#059669" : "#dc2626" }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Recent Deals */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <strong>Recent Deals</strong>
          </div>
          {recentDeals.map((deal) => (
            <Link key={deal.id} href={`/dashboard/deals/${deal.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.95rem" }}>{deal.name}</p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{deal.partner}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.95rem", fontVariantNumeric: "tabular-nums" }}>${deal.amount.toLocaleString()}</span>
                <span className={`badge ${statusBadge[deal.status]}`} style={{ textTransform: "capitalize" }}>{deal.status}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Top Partners */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <strong>Top Partners</strong>
          </div>
          {topPartners.map((p, i) => (
            <Link key={p.name} href="/dashboard/partners/1" style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
              <span style={{ fontWeight: 700, color: "var(--muted)", width: 20, fontSize: "0.85rem" }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{p.type} · {p.deals} deals</p>
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.9rem", fontVariantNumeric: "tabular-nums" }}>${(p.revenue / 1000).toFixed(0)}k</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Attribution Comparison */}
      <div className="card">
        <div style={{ marginBottom: "1rem" }}>
          <strong>Attribution Model Comparison</strong>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.25rem" }}>Same deals, different models</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
          {[
            { model: "Equal Split", partner: "TechStar", pct: "20%" },
            { model: "First Touch", partner: "CloudBridge", pct: "35%" },
            { model: "Last Touch", partner: "TechStar", pct: "42%" },
            { model: "Time Decay", partner: "TechStar", pct: "31%" },
            { model: "Role-Based", partner: "FinTech Allies", pct: "28%" },
          ].map((m) => (
            <div key={m.model} style={{ textAlign: "center", padding: "1.2rem", background: "var(--subtle)", borderRadius: "var(--radius)" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>{m.model}</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.5rem" }}>{m.pct}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>Top: {m.partner}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
