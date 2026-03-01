"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/lib/store";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, Users, Briefcase, DollarSign, Clock, Sliders, AlertTriangle, BarChart3, Megaphone, Cloud, CloudOff, Link2, Sparkles, CheckCircle, X } from "lucide-react";
import { usePlatformConfig } from "@/lib/platform-config";
import type { Deal, Partner, Payout, AuditEntry } from "@/lib/types";

/** Format relative time for sync indicator */
function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

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

const REVENUE_TREND = [42, 55, 48, 67, 73, 80, 92, 85, 102, 110, 95, 125];
const PIPELINE_TREND = [180, 160, 200, 220, 195, 210, 240, 230, 250, 215, 270, 290];
const PARTNERS_TREND = [3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7];
const WINRATE_TREND = [50, 55, 48, 60, 58, 62, 55, 67, 65, 70, 68, 72];

function UpgradeBannerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgrade") === "success") {
      setVisible(true);
      // Clean the URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("upgrade");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px", borderRadius: 10, marginBottom: 20,
      background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)",
      color: "#22c55e",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <CheckCircle size={16} />
        <span style={{ fontWeight: 600, fontSize: ".9rem" }}>
          🎉 Welcome to Covant! Your subscription is now active.
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(34,197,94,.6)", padding: 4 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function UpgradeBanner() {
  return (
    <Suspense fallback={null}>
      <UpgradeBannerInner />
    </Suspense>
  );
}

function WelcomeBanner() {
  const [visible, setVisible] = useState(true);
  const [configData, setConfigData] = useState<{ programType: string; interactionTypes: { id: string }[]; attributionModel: string; commissionRules: { label: string }[] } | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("covant_welcome_dismissed");
    if (dismissed) { setVisible(false); return; }
    const raw = localStorage.getItem("covant_setup_config");
    if (!raw) { setVisible(false); return; }
    try { setConfigData(JSON.parse(raw)); } catch { setVisible(false); }
  }, []);

  if (!visible || !configData) return null;

  return (
    <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--subtle)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
      <p style={{ fontSize: ".85rem", color: "var(--fg)" }}>
        <strong>Welcome!</strong> Your {configData.programType} program is configured. {configData.interactionTypes.length} interaction type{configData.interactionTypes.length !== 1 ? "s" : ""} · {configData.attributionModel.replace(/_/g, " ")} attribution{configData.commissionRules.length > 0 ? ` · ${configData.commissionRules[0].label}` : ""}
      </p>
      <button onClick={() => { setVisible(false); localStorage.setItem("covant_welcome_dismissed", "true"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1.1rem", lineHeight: 1, padding: "0 .25rem", fontFamily: "inherit" }}>×</button>
    </div>
  );
}

function DemoBanner() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("covant_demo_banner_dismissed")) setVisible(false);
  }, []);
  if (!visible) return null;
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #333", padding: "10px 16px", borderRadius: 8, marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
      <p style={{ fontSize: ".85rem", color: "#e5e5e5", margin: 0 }}>
        👋 You&apos;re in the Covant demo. Want to see it from a partner&apos;s perspective?{" "}
        <Link href="/portal" style={{ color: "#fff", fontWeight: 600, textDecoration: "underline" }}>View Partner Portal →</Link>
      </p>
      <button onClick={() => { setVisible(false); localStorage.setItem("covant_demo_banner_dismissed", "true"); }} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "1.1rem", padding: "0 4px", fontFamily: "inherit" }}>×</button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  // ── Convex real data ───────────────────────────────────────────────────
  const convexStats = useQuery(api.dashboard.getStats);
  const convexRecentDeals = useQuery(api.dashboard.getRecentDeals);
  const convexTopPartners = useQuery(api.dashboard.getTopPartners);
  const convexPendingPayouts = useQuery(api.dashboard.getPendingPayouts);
  const convexAuditLog = useQuery(api.dashboard.getRecentAuditLog);

  // ── Store (for non-wired modules only) ─────────────────────────────────
  const { stats: storeStats, deals: storeDeals, partners: storePartners, payouts: storePayouts, auditLog: storeAuditLog } = useStore();
  
  // ── Convex data for alerts ─────────────────────────────────────────────
  const convexTopRecommended = useQuery(api.recommendations.getTopRecommended);
  const convexChannelConflicts = useQuery(api.dashboard.getChannelConflicts);
  const convexMdfRequests = useQuery(api.mdf.list);
  const { config, isFeatureEnabled } = usePlatformConfig();
  
  // ── Salesforce connection status ───────────────────────────────────────
  // Always skip — store org ID ("org_demo_001") is not a valid Convex ID and
  // causes Convex to throw. Will enable once we have multi-org with real IDs.
  const sfStatus = useQuery(api.integrations.getSalesforceStatus, "skip");

  // Prefer Convex data; fall back to in-memory store while loading
  const stats = convexStats ?? storeStats;
  const recentDeals = (convexRecentDeals ?? [...storeDeals].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)) as unknown as Deal[];
  const topPartners = (convexTopPartners ?? storePartners.filter((p) => p.status === "active").slice(0, 5)) as unknown as Partner[];
  const pendingPayouts = (convexPendingPayouts ?? storePayouts.filter((p) => p.status === "pending_approval")) as unknown as (Payout & { partner?: Partner })[];
  const auditLog = (convexAuditLog ?? storeAuditLog.slice(0, 5)) as unknown as AuditEntry[];

  // Use Convex data for alerts (or empty arrays if loading)
  const openConflicts = convexChannelConflicts ?? [];
  const pendingMDF = (convexMdfRequests ?? []).filter((r: any) => r.status === "pending");

  // First-run detection: redirect to setup if truly empty (no Convex data loaded yet, no store data)
  useEffect(() => {
    const setupComplete = localStorage.getItem("covant_setup_complete");
    if (!setupComplete && storePartners.length === 0 && storeDeals.length === 0 && convexStats !== undefined && convexStats.totalPartners === 0) {
      router.push("/setup");
    }
  }, [storePartners.length, storeDeals.length, convexStats, router]);

  return (
    <>
      <DemoBanner />
      <UpgradeBanner />
      <WelcomeBanner />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Dashboard</h1>
            {/* Salesforce Connection Indicator */}
            {sfStatus?.connected ? (
              <Link 
                href="/dashboard/settings#crm-connection" 
                style={{ 
                  display: "flex", alignItems: "center", gap: ".35rem",
                  background: "#dcfce7", border: "1px solid #22c55e", 
                  padding: "4px 10px", borderRadius: 6, 
                  fontSize: ".7rem", fontWeight: 600, color: "#166534",
                  textDecoration: "none",
                }}
                title={`Salesforce connected · ${sfStatus.syncedDeals} deals synced`}
              >
                <Cloud size={13} />
                SF
                {sfStatus.lastSyncedAt && (
                  <span style={{ color: "#22c55e", marginLeft: ".2rem" }}>
                    · {formatRelativeTime(sfStatus.lastSyncedAt)}
                  </span>
                )}
              </Link>
            ) : sfStatus === undefined ? null : (
              <Link 
                href="/dashboard/settings#crm-connection" 
                style={{ 
                  display: "flex", alignItems: "center", gap: ".35rem",
                  background: "var(--subtle)", border: "1px solid var(--border)", 
                  padding: "4px 10px", borderRadius: 6, 
                  fontSize: ".7rem", fontWeight: 500, color: "var(--muted)",
                  textDecoration: "none",
                }}
                title="Connect your CRM to sync deals automatically"
              >
                <Link2 size={12} />
                Connect CRM
              </Link>
            )}
          </div>
          <p className="muted">Partner-influenced revenue &amp; program overview</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <Link href="/dashboard/settings#platform-config" className="btn-outline" style={{ fontSize: ".8rem", padding: ".5rem 1rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
            <Sliders size={14} />
            Customize Platform
          </Link>
        </div>
      </div>

      {/* Customization Callout */}
      {config.complexityLevel === "standard" && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #c7d2fe", background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <Sliders size={18} color="#4338ca" />
            <div>
              <p style={{ fontWeight: 600, fontSize: ".85rem", color: "#312e81" }}>This dashboard adapts to your workflow</p>
              <p style={{ fontSize: ".8rem", color: "#4338ca" }}>Toggle features, adjust complexity, and enable only what you need in Platform Configuration.</p>
            </div>
          </div>
          <Link href="/dashboard/settings#platform-config" className="btn" style={{ fontSize: ".8rem", padding: ".4rem 1rem", background: "#6366f1", whiteSpace: "nowrap" }}>Configure →</Link>
        </div>
      )}

      {/* Channel Conflict Alert (in-memory store) */}
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

      {/* Pending MDF Alert (in-memory store) */}
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

      {/* ── Action Items Widget ── */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#ef4444", display: "inline-block" }} />
            Action Items
          </h3>
          <span className="muted" style={{ fontSize: ".75rem" }}>Across your partner program</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: ".75rem" }}>
          {[
            { label: "Tier reviews pending", value: "3", href: "/dashboard/scoring/tier-reviews", color: "#8b5cf6", icon: "🏆" },
            { label: "Partners in onboarding", value: "4", href: "/dashboard/onboarding", color: "#f97316", icon: "🚀" },
            { label: "Unpaid commissions", value: "$12.4K", href: "/dashboard/payouts", color: "#ef4444", icon: "💰" },
            { label: "Incentive enrollments", value: "8", href: "/dashboard/incentives", color: "#eab308", icon: "🎁" },
            { label: "Email triggers active", value: "10/11", href: "/dashboard/emails", color: "#3b82f6", icon: "📧" },
            { label: "Integrations connected", value: "4", href: "/dashboard/integrations", color: "#22c55e", icon: "🔌" },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 8, border: "1px solid var(--border)", textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".8rem", fontWeight: 700, color: item.color }}>{item.value}</div>
                <div className="muted" style={{ fontSize: ".72rem" }}>{item.label}</div>
              </div>
              <ArrowUpRight size={14} style={{ color: "var(--muted)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Partner Recommendations Widget ── */}
      {convexTopRecommended && convexTopRecommended.filter((r) => r.wonCount > 0 || r.totalRevenue > 0).length > 0 && (
        <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <Sparkles size={16} color="#6366f1" />
              Recommended Partners
            </h3>
            <Link href="/dashboard/recommendations" className="muted" style={{ fontSize: ".8rem", fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: ".75rem" }}>
            {convexTopRecommended.filter((r) => r.wonCount > 0 || r.totalRevenue > 0).slice(0, 3).map((r) => (
              <Link
                key={r.partner._id}
                href={`/dashboard/partners/${r.partner._id}`}
                style={{
                  display: "flex", alignItems: "center", gap: ".6rem", padding: "10px 12px",
                  borderRadius: 8, border: "1px solid var(--border)", textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <div className="avatar" style={{ width: 36, height: 36, fontSize: ".7rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
                  {r.partner.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: ".85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.partner.name}</p>
                  <p className="muted" style={{ fontSize: ".72rem" }}>
                    {Math.round(r.winRate * 100)}% win rate · {formatCurrencyCompact(r.totalRevenue)}
                  </p>
                </div>
                <span style={{ fontSize: ".65rem", fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: r.recommendationScore >= 0.7 ? "#dcfce7" : r.recommendationScore >= 0.4 ? "#dbeafe" : "#fef9c3", color: r.recommendationScore >= 0.7 ? "#166534" : r.recommendationScore >= 0.4 ? "#1e40af" : "#854d0e" }}>
                  {r.recommendationScore >= 0.7 ? "★★★" : r.recommendationScore >= 0.4 ? "★★" : "★"}
                </span>
              </Link>
            ))}
          </div>
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
              <p className="muted">No deals yet. Add your first deal from the Deals page.</p>
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
              pendingPayouts.map((p) => (
                <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".6rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{p.partner?.name ?? "Unknown"}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>Payout · {p.period}</p>
                  </div>
                  <strong style={{ fontSize: ".9rem" }}>{formatCurrency(p.amount)}</strong>
                </div>
              ))
            )}
            <Link href="/dashboard/payouts" style={{ fontSize: ".8rem", color: "#6366f1", fontWeight: 500, marginTop: ".75rem", display: "block" }}>
              View all payouts →
            </Link>
          </div>

          {/* Top Partners */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>Top Partners</h3>
              <Link href="/dashboard/partners" className="muted" style={{ fontSize: ".8rem", fontWeight: 500 }}>View all →</Link>
            </div>
            {topPartners.length === 0 ? (
              <p className="muted" style={{ fontSize: ".85rem" }}>No active partners yet.</p>
            ) : (
              topPartners.map((p) => (
                <Link key={p._id} href={`/dashboard/partners/${p._id}`} style={{ display: "flex", alignItems: "center", gap: ".8rem", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="avatar">{p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{p.name}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>{p.type} · {p.tier || "—"}</p>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: ".7rem" }}>{p.commissionRate}%</span>
                </Link>
              ))
            )}
          </div>

          {/* Audit Trail */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>Recent Activity</h3>
              <Link href="/dashboard/activity" className="muted" style={{ fontSize: ".8rem", fontWeight: 500 }}>View all →</Link>
            </div>
            {auditLog.length === 0 ? (
              <p className="muted" style={{ fontSize: ".85rem" }}>No activity yet.</p>
            ) : (
              auditLog.map((entry) => (
                <div key={entry._id} style={{ padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: ".85rem" }}><strong>{entry.action}</strong></p>
                  <p className="muted" style={{ fontSize: ".75rem" }}>{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
