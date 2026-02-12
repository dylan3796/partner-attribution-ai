"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, Users, Briefcase, DollarSign, Clock, Sliders } from "lucide-react";
import { usePlatformConfig } from "@/lib/platform-config";

export default function DashboardPage() {
  const { stats, deals, partners, payouts, auditLog } = useStore();
  const { config } = usePlatformConfig();
  const recentDeals = [...deals].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const topPartners = partners.filter((p) => p.status === "active").slice(0, 5);
  const pendingPayouts = payouts.filter((p) => p.status === "pending_approval");

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Dashboard</h1>
          <p className="muted">Your partner program at a glance</p>
        </div>
        <Link
          href="/dashboard/settings#platform-config"
          className="btn-outline"
          style={{ fontSize: ".8rem", padding: ".5rem 1rem", display: "flex", alignItems: "center", gap: ".4rem" }}
        >
          <Sliders size={14} />
          Customize Platform
        </Link>
      </div>

      {/* Customization Callout */}
      {config.complexityLevel === "standard" && (
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: 10,
            border: "1px solid #c7d2fe",
            background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <Sliders size={18} color="#4338ca" />
            <div>
              <p style={{ fontWeight: 600, fontSize: ".85rem", color: "#312e81" }}>This dashboard adapts to your workflow</p>
              <p style={{ fontSize: ".8rem", color: "#4338ca" }}>Toggle features, adjust complexity, and enable only what you need in Platform Configuration.</p>
            </div>
          </div>
          <Link href="/dashboard/settings#platform-config" className="btn" style={{ fontSize: ".8rem", padding: ".4rem 1rem", background: "#6366f1", whiteSpace: "nowrap" }}>
            Configure →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: "2rem" }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Total Revenue</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{formatCurrencyCompact(stats.totalRevenue)}</p>
            </div>
            <div style={{ background: "#ecfdf5", padding: ".5rem", borderRadius: 8 }}><TrendingUp size={18} color="#065f46" /></div>
          </div>
          <p style={{ fontSize: ".8rem", color: "#065f46", marginTop: ".5rem" }}>↑ {stats.wonDeals} won deals</p>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Pipeline Value</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{formatCurrencyCompact(stats.pipelineValue)}</p>
            </div>
            <div style={{ background: "#eef2ff", padding: ".5rem", borderRadius: 8 }}><Briefcase size={18} color="#3730a3" /></div>
          </div>
          <p style={{ fontSize: ".8rem", color: "#3730a3", marginTop: ".5rem" }}>{stats.openDeals} active deals</p>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Active Partners</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{stats.activePartners}</p>
            </div>
            <div style={{ background: "#f0fdf4", padding: ".5rem", borderRadius: 8 }}><Users size={18} color="#166534" /></div>
          </div>
          <p style={{ fontSize: ".8rem", color: "#166534", marginTop: ".5rem" }}>{stats.totalPartners} total</p>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Win Rate</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{stats.winRate}%</p>
            </div>
            <div style={{ background: "#fffbeb", padding: ".5rem", borderRadius: 8 }}><ArrowUpRight size={18} color="#92400e" /></div>
          </div>
          <p style={{ fontSize: ".8rem", color: "#92400e", marginTop: ".5rem" }}>Avg deal: {formatCurrencyCompact(stats.avgDealSize)}</p>
        </div>
      </div>

      <div className="dash-grid-2">
        {/* Recent Deals */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Recent Deals</h3>
            <Link href="/dashboard/deals" className="muted" style={{ fontSize: ".85rem", fontWeight: 500 }}>View all →</Link>
          </div>
          {recentDeals.length === 0 ? (
            <div className="empty-state" style={{ padding: "2rem" }}>
              <Briefcase size={32} color="var(--muted)" style={{ marginBottom: ".5rem" }} />
              <p className="muted">No deals yet. Create your first deal!</p>
              <Link href="/dashboard/settings#platform-config" style={{ fontSize: ".75rem", color: "#6366f1", fontWeight: 500, marginTop: ".5rem" }}>
                ⚙️ Configure deal features in Platform Configuration
              </Link>
            </div>
          ) : (
            recentDeals.map((deal) => (
              <Link key={deal._id} href={`/dashboard/deals/${deal._id}`} className="list-item">
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".9rem" }}>{deal.name}</p>
                  <p className="muted" style={{ fontSize: ".8rem" }}>{new Date(deal.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{formatCurrencyCompact(deal.amount)}</p>
                  <span className={`badge badge-${deal.status === "won" ? "success" : deal.status === "lost" ? "danger" : "info"}`}>{deal.status}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Pending Approvals */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>
              <Clock size={16} style={{ display: "inline", marginRight: ".4rem", verticalAlign: "-2px" }} />
              Pending Approvals
            </h3>
            {pendingPayouts.length === 0 ? (
              <p className="muted" style={{ fontSize: ".85rem" }}>All clear! No pending approvals.</p>
            ) : (
              pendingPayouts.map((p) => {
                const partner = partners.find((pr) => pr._id === p.partnerId);
                return (
                  <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".6rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{partner?.name}</p>
                      <p className="muted" style={{ fontSize: ".75rem" }}>Payout · {p.period}</p>
                    </div>
                    <strong style={{ fontSize: ".9rem" }}>{formatCurrency(p.amount)}</strong>
                  </div>
                );
              })
            )}
          </div>

          {/* Top Partners */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Top Partners</h3>
            {topPartners.map((p) => (
              <Link key={p._id} href={`/dashboard/partners/${p._id}`} style={{ display: "flex", alignItems: "center", gap: ".8rem", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                <div className="avatar">{p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{p.name}</p>
                  <p className="muted" style={{ fontSize: ".75rem" }}>{p.type} · {p.tier || "—"}</p>
                </div>
                <span className="badge badge-success" style={{ fontSize: ".7rem" }}>{p.commissionRate}%</span>
              </Link>
            ))}
          </div>

          {/* Audit Trail */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Recent Activity</h3>
            {auditLog.slice(0, 5).map((entry) => (
              <div key={entry._id} style={{ padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: ".85rem" }}><strong>{entry.action}</strong></p>
                <p className="muted" style={{ fontSize: ".75rem" }}>{new Date(entry.createdAt).toLocaleString()} {entry.changes && `· ${entry.changes}`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
