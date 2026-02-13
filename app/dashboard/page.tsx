"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, Users, Briefcase, DollarSign, Clock, Sliders, AlertTriangle, BarChart3, Megaphone } from "lucide-react";
import { usePlatformConfig } from "@/lib/platform-config";

/** Mini sparkline SVG component */
function Sparkline({ data, color = "#10b981", width = 80, height = 28 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  // Fill area
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`sparkGrad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sparkGrad-${color.replace("#","")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Simulated trend data for sparklines
const REVENUE_TREND = [42, 55, 48, 67, 73, 80, 92, 85, 102, 110, 95, 125];
const PIPELINE_TREND = [180, 160, 200, 220, 195, 210, 240, 230, 250, 215, 270, 290];
const PARTNERS_TREND = [3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7];
const WINRATE_TREND = [50, 55, 48, 60, 58, 62, 55, 67, 65, 70, 68, 72];

export default function DashboardPage() {
  const router = useRouter();
  const { stats, deals, partners, payouts, auditLog, channelConflicts, mdfRequests, partnerVolumes } = useStore();
  const { config, isFeatureEnabled } = usePlatformConfig();
  const openConflicts = channelConflicts.filter((c) => c.status === "open" || c.status === "under_review");
  const pendingMDF = mdfRequests.filter((r) => r.status === "pending");
  const recentDeals = [...deals].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const topPartners = partners.filter((p) => p.status === "active").slice(0, 5);
  const pendingPayouts = payouts.filter((p) => p.status === "pending_approval");

  // First-run detection: redirect to setup if new user
  useEffect(() => {
    const setupComplete = localStorage.getItem("partnerai_setup_complete");
    if (!setupComplete && partners.length === 0 && deals.length === 0) {
      router.push("/setup");
    }
  }, [partners.length, deals.length, router]);

  return (
    <>
      {/* Demo Environment Banner */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderRadius: 10,
          border: "2px solid #fbbf24",
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontWeight: 700, fontSize: "1rem", color: "#78350f", marginBottom: ".25rem" }}>
          🎬 Demo Environment – Early Access Preview
        </p>
        <p style={{ fontSize: ".85rem", color: "#92400e" }}>
          You're viewing a live demo of PartnerBase. Full product launches <strong>March 7, 2026</strong>. <Link href="/" style={{ textDecoration: "underline", fontWeight: 600 }}>Request early access →</Link>
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Dashboard</h1>
          <p className="muted">Partner-influenced revenue &amp; program overview</p>
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

      {/* Channel Conflict Alert */}
      {isFeatureEnabled("channelConflict") && openConflicts.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fca5a5", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <AlertTriangle size={20} color="#991b1b" />
            <div>
              <p style={{ fontWeight: 700, fontSize: ".9rem", color: "#991b1b" }}>{openConflicts.length} unresolved channel conflict{openConflicts.length !== 1 ? "s" : ""}</p>
              <p style={{ fontSize: ".8rem", color: "#b91c1c" }}>Multiple partners claiming the same accounts</p>
            </div>
          </div>
          <Link href="/dashboard/conflicts" className="btn" style={{ fontSize: ".8rem", padding: ".4rem 1rem", background: "#dc2626" }}>Review →</Link>
        </div>
      )}

      {/* Pending MDF Alert */}
      {isFeatureEnabled("mdf") && pendingMDF.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #fbbf24", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <Megaphone size={20} color="#92400e" />
            <div>
              <p style={{ fontWeight: 700, fontSize: ".9rem", color: "#78350f" }}>{pendingMDF.length} MDF request{pendingMDF.length !== 1 ? "s" : ""} awaiting approval</p>
              <p style={{ fontSize: ".8rem", color: "#92400e" }}>Partner marketing campaigns need review</p>
            </div>
          </div>
          <Link href="/dashboard/mdf" className="btn" style={{ fontSize: ".8rem", padding: ".4rem 1rem", background: "#d97706" }}>Review →</Link>
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: "2rem" }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Partner-Influenced Revenue</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{formatCurrencyCompact(stats.totalRevenue)}</p>
            </div>
            <div style={{ background: "#ecfdf5", padding: ".5rem", borderRadius: 8 }}><TrendingUp size={18} color="#065f46" /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginTop: ".5rem" }}>
            <Sparkline data={REVENUE_TREND} color="#10b981" />
            <p style={{ fontSize: ".8rem", color: "#065f46" }}>↑ {stats.wonDeals} won deals</p>
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Partner-Touched Pipeline</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{formatCurrencyCompact(stats.pipelineValue)}</p>
            </div>
            <div style={{ background: "#eef2ff", padding: ".5rem", borderRadius: 8 }}><Briefcase size={18} color="#3730a3" /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginTop: ".5rem" }}>
            <Sparkline data={PIPELINE_TREND} color="#6366f1" />
            <p style={{ fontSize: ".8rem", color: "#3730a3" }}>{stats.openDeals} active deals</p>
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Active Partners</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{stats.activePartners}</p>
            </div>
            <div style={{ background: "#f0fdf4", padding: ".5rem", borderRadius: 8 }}><Users size={18} color="#166534" /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginTop: ".5rem" }}>
            <Sparkline data={PARTNERS_TREND} color="#22c55e" />
            <p style={{ fontSize: ".8rem", color: "#166534" }}>{stats.totalPartners} total</p>
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Partner-Influenced Win Rate</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{stats.winRate}%</p>
            </div>
            <div style={{ background: "#fffbeb", padding: ".5rem", borderRadius: 8 }}><ArrowUpRight size={18} color="#92400e" /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginTop: ".5rem" }}>
            <Sparkline data={WINRATE_TREND} color="#f59e0b" />
            <p style={{ fontSize: ".8rem", color: "#92400e" }}>Avg deal: {formatCurrencyCompact(stats.avgDealSize)}</p>
          </div>
        </div>
      </div>

      <div className="dash-grid-2">
        {/* Recent Deals */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Recent Partner-Touched Deals</h3>
            <Link href="/dashboard/deals" className="muted" style={{ fontSize: ".85rem", fontWeight: 500 }}>View all →</Link>
          </div>
          {recentDeals.length === 0 ? (
            <div className="empty-state" style={{ padding: "2rem" }}>
              <Briefcase size={32} color="var(--muted)" style={{ marginBottom: ".5rem" }} />
              <p className="muted">No deals yet. Import from your CRM or add manually.</p>
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
