"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  GitBranch,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  BarChart3,
  Handshake,
  Inbox,
  LayoutGrid,
  Columns3,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

function statusIcon(status: string) {
  if (status === "won") return <CheckCircle2 size={13} style={{ color: "#22c55e" }} />;
  if (status === "lost") return <XCircle size={13} style={{ color: "#ef4444" }} />;
  return <Clock size={13} style={{ color: "#eab308" }} />;
}

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent || "#6366f1"}18`, display: "flex", alignItems: "center", justifyContent: "center", color: accent || "#6366f1", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{value}</div>
        {sub && <div className="muted" style={{ fontSize: ".8rem" }}>{sub}</div>}
      </div>
    </div>
  );
}

function TouchpointBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    referral: "#8b5cf6",
    demo: "#3b82f6",
    co_sell: "#10b981",
    deal_registration: "#ec4899",
    introduction: "#f59e0b",
    proposal: "#6366f1",
    negotiation: "#ef4444",
    content_share: "#94a3b8",
    technical_enablement: "#14b8a6",
  };
  return (
    <span style={{
      padding: "1px 7px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700,
      background: `${colors[type] || "#64748b"}20`, color: colors[type] || "#64748b",
    }}>
      {type.replace(/_/g, " ")}
    </span>
  );
}

function TierBadge({ tier }: { tier?: string }) {
  if (!tier) return null;
  const colors: Record<string, { bg: string; fg: string }> = {
    platinum: { bg: "#a78bfa22", fg: "#a78bfa" },
    gold: { bg: "#eab30822", fg: "#eab308" },
    silver: { bg: "#94a3b822", fg: "#94a3b8" },
    bronze: { bg: "#d9770622", fg: "#d97706" },
  };
  const c = colors[tier] || colors.bronze;
  return (
    <span style={{ padding: "1px 8px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", background: c.bg, color: c.fg }}>
      {tier}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ width: 280, height: 32, background: "var(--border)", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ width: 320, height: 16, background: "var(--border)", borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem" }}>
            <div style={{ width: 44, height: 44, background: "var(--border)", borderRadius: 12 }} />
            <div>
              <div style={{ width: 80, height: 12, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: 60, height: 24, background: "var(--border)", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
      {[1,2,3].map(i => (
        <div key={i} className="card" style={{ padding: "1.25rem" }}>
          <div style={{ width: 120, height: 20, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[1,2,3].map(j => (
              <div key={j} style={{ width: 280, height: 100, background: "var(--border)", borderRadius: 8 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <Inbox size={48} style={{ color: "var(--muted)", margin: "0 auto 1rem" }} />
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: ".5rem" }}>No Pipeline Data Yet</h3>
      <p className="muted" style={{ marginBottom: "1.5rem", maxWidth: 400, margin: "0 auto 1.5rem" }}>
        Your partner-influenced pipeline will appear here once deals with partner touchpoints are created.
      </p>
      <Link href="/dashboard/deals" className="btn">
        <Target size={16} /> View All Deals
      </Link>
    </div>
  );
}

/* ─── Deal card used in both grid and board views ─── */

function DealCard({ deal, isExpanded, onToggle, compact }: { deal: any; isExpanded: boolean; onToggle: () => void; compact?: boolean }) {
  const statusColors: Record<string, { bg: string; fg: string }> = {
    open: { bg: "#fef3c7", fg: "#92400e" },
    won: { bg: "#dcfce7", fg: "#166534" },
    lost: { bg: "#fee2e2", fg: "#991b1b" },
  };
  const c = statusColors[deal.status] || statusColors.open;

  return (
    <div 
      className="card" 
      onClick={onToggle}
      style={{ 
        padding: compact ? ".85rem" : "1rem", 
        cursor: "pointer",
        border: isExpanded ? "1px solid #6366f1" : "1px solid var(--border)",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link 
            href={`/dashboard/deals/${deal._id}`} 
            onClick={(e) => e.stopPropagation()}
            style={{ fontWeight: 700, fontSize: compact ? ".85rem" : ".95rem", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {deal.name}
          </Link>
          {deal.contactName && <p className="muted" style={{ fontSize: ".75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.contactName}</p>}
        </div>
        {!compact && (
          <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg, flexShrink: 0 }}>
            {deal.status}
          </span>
        )}
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: compact ? "1rem" : "1.1rem", fontWeight: 800 }}>{formatCurrency(deal.amount)}</span>
        <span className="muted" style={{ fontSize: ".7rem" }}>{formatDate(deal.createdAt)}</span>
      </div>

      {/* Product badge */}
      {deal.productName && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ padding: "1px 7px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700, background: "#6366f118", color: "#6366f1" }}>
            {deal.productName}
          </span>
        </div>
      )}

      {/* Registration status badge (board view) */}
      {compact && deal.registrationStatus && (
        <div style={{ marginBottom: 6 }}>
          <span style={{
            padding: "1px 7px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700,
            background: deal.registrationStatus === "approved" ? "#22c55e18" : deal.registrationStatus === "rejected" ? "#ef444418" : "#eab30818",
            color: deal.registrationStatus === "approved" ? "#22c55e" : deal.registrationStatus === "rejected" ? "#ef4444" : "#eab308",
          }}>
            {deal.registrationStatus === "approved" ? "✓ Approved" : deal.registrationStatus === "rejected" ? "✗ Rejected" : "⏳ Pending"}
          </span>
        </div>
      )}
      
      {/* Partner info */}
      {deal.involvedPartners && deal.involvedPartners.length > 0 && (
        <div style={{ paddingTop: 6, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
            <Handshake size={12} style={{ color: "#6366f1", flexShrink: 0 }} />
            {deal.involvedPartners.slice(0, compact ? 1 : 2).map((p: any) => (
              <span key={p._id} style={{ fontSize: ".7rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
                {p.attributionPct > 0 && <span style={{ color: "#6366f1" }}> ({p.attributionPct}%)</span>}
              </span>
            ))}
            {deal.involvedPartners.length > (compact ? 1 : 2) && (
              <span className="muted" style={{ fontSize: ".7rem" }}>+{deal.involvedPartners.length - (compact ? 1 : 2)}</span>
            )}
          </div>
        </div>
      )}
      
      {/* Expanded details */}
      {isExpanded && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
          {deal.involvedPartners && deal.involvedPartners.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <p className="muted" style={{ fontSize: ".65rem", fontWeight: 600, marginBottom: 4 }}>PARTNERS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {deal.involvedPartners.map((p: any) => (
                  <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: ".8rem", fontWeight: 600 }}>{p.name}</span>
                      <TierBadge tier={p.tier} />
                    </div>
                    {p.attributionPct > 0 && (
                      <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#6366f1" }}>{p.attributionPct}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {deal.touchpoints && deal.touchpoints.length > 0 && (
            <div>
              <p className="muted" style={{ fontSize: ".65rem", fontWeight: 600, marginBottom: 4 }}>TOUCHPOINTS</p>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {deal.touchpoints.map((tp: any) => (
                  <TouchpointBadge key={tp._id} type={tp.type} />
                ))}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: 10 }}>
            <Link 
              href={`/dashboard/deals/${deal._id}`}
              className="btn-outline"
              style={{ fontSize: ".75rem", padding: ".35rem .7rem" }}
              onClick={(e) => e.stopPropagation()}
            >
              View Deal <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Kanban column ─── */

type KanbanColumn = {
  key: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  deals: any[];
};

function KanbanColumnView({ col, expandedDealId, setExpandedDealId }: { col: KanbanColumn; expandedDealId: string | null; setExpandedDealId: (id: string | null) => void }) {
  const totalValue = col.deals.reduce((s: number, d: any) => s + d.amount, 0);

  return (
    <div style={{
      flex: 1,
      minWidth: 260,
      maxWidth: 380,
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}>
      {/* Column header */}
      <div style={{
        padding: "12px 14px",
        borderRadius: "10px 10px 0 0",
        background: `${col.accent}0a`,
        borderBottom: `2px solid ${col.accent}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ color: col.accent }}>{col.icon}</div>
          <span style={{ fontWeight: 700, fontSize: ".85rem" }}>{col.label}</span>
          <span style={{
            background: `${col.accent}20`,
            color: col.accent,
            padding: "1px 8px",
            borderRadius: 999,
            fontSize: ".7rem",
            fontWeight: 700,
          }}>
            {col.deals.length}
          </span>
        </div>
        <span className="muted" style={{ fontSize: ".75rem", fontWeight: 600 }}>
          {formatCurrency(totalValue)}
        </span>
      </div>

      {/* Cards container */}
      <div style={{
        flex: 1,
        padding: "10px 6px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: `${col.accent}04`,
        borderRadius: "0 0 10px 10px",
        minHeight: 120,
        border: `1px solid ${col.accent}12`,
        borderTop: "none",
      }}>
        {col.deals.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem",
            color: "var(--muted)",
            fontSize: ".8rem",
            textAlign: "center",
          }}>
            <Inbox size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
            No deals
          </div>
        ) : (
          col.deals.map((deal: any) => (
            <DealCard
              key={deal._id}
              deal={deal}
              compact
              isExpanded={expandedDealId === deal._id}
              onToggle={() => setExpandedDealId(expandedDealId === deal._id ? null : deal._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Board view ─── */

function BoardView({ partnerDeals, expandedDealId, setExpandedDealId }: {
  partnerDeals: { open: any[]; won: any[]; lost: any[] };
  expandedDealId: string | null;
  setExpandedDealId: (id: string | null) => void;
}) {
  // Sub-segment open deals by registration status
  const pendingReg = partnerDeals.open.filter((d: any) => d.registrationStatus === "pending");
  const activePipeline = partnerDeals.open.filter((d: any) => d.registrationStatus !== "pending");

  const columns: KanbanColumn[] = [
    {
      key: "pending",
      label: "Pending Registration",
      icon: <AlertCircle size={16} />,
      accent: "#f59e0b",
      deals: pendingReg,
    },
    {
      key: "active",
      label: "Active Pipeline",
      icon: <Target size={16} />,
      accent: "#6366f1",
      deals: activePipeline,
    },
    {
      key: "won",
      label: "Closed Won",
      icon: <CheckCircle2 size={16} />,
      accent: "#22c55e",
      deals: partnerDeals.won,
    },
    {
      key: "lost",
      label: "Closed Lost",
      icon: <XCircle size={16} />,
      accent: "#ef4444",
      deals: partnerDeals.lost,
    },
  ];

  return (
    <div style={{
      display: "flex",
      gap: 12,
      overflowX: "auto",
      paddingBottom: 8,
    }}>
      {columns.map(col => (
        <KanbanColumnView
          key={col.key}
          col={col}
          expandedDealId={expandedDealId}
          setExpandedDealId={setExpandedDealId}
        />
      ))}
    </div>
  );
}

/* ─── Grid view (original layout) ─── */

function GridView({ partnerDeals, filterStatus, expandedDealId, setExpandedDealId }: {
  partnerDeals: { open: any[]; won: any[]; lost: any[] };
  filterStatus: string;
  expandedDealId: string | null;
  setExpandedDealId: (id: string | null) => void;
}) {
  return (
    <>
      {/* Open Deals */}
      {(filterStatus === "all" || filterStatus === "open") && partnerDeals.open.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".75rem", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={18} style={{ color: "#eab308" }} />
            Open Pipeline
            <span className="muted" style={{ fontSize: ".9rem", fontWeight: 400 }}>({partnerDeals.open.length})</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: ".75rem" }}>
            {partnerDeals.open.map((deal: any) => (
              <DealCard 
                key={deal._id} 
                deal={deal} 
                isExpanded={expandedDealId === deal._id}
                onToggle={() => setExpandedDealId(expandedDealId === deal._id ? null : deal._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Won Deals */}
      {(filterStatus === "all" || filterStatus === "won") && partnerDeals.won.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".75rem", display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
            Closed Won
            <span className="muted" style={{ fontSize: ".9rem", fontWeight: 400 }}>({partnerDeals.won.length})</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: ".75rem" }}>
            {partnerDeals.won.map((deal: any) => (
              <DealCard 
                key={deal._id} 
                deal={deal} 
                isExpanded={expandedDealId === deal._id}
                onToggle={() => setExpandedDealId(expandedDealId === deal._id ? null : deal._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lost Deals */}
      {(filterStatus === "all" || filterStatus === "lost") && partnerDeals.lost.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".75rem", display: "flex", alignItems: "center", gap: 8 }}>
            <XCircle size={18} style={{ color: "#ef4444" }} />
            Closed Lost
            <span className="muted" style={{ fontSize: ".9rem", fontWeight: 400 }}>({partnerDeals.lost.length})</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: ".75rem" }}>
            {partnerDeals.lost.map((deal: any) => (
              <DealCard 
                key={deal._id} 
                deal={deal} 
                isExpanded={expandedDealId === deal._id}
                onToggle={() => setExpandedDealId(expandedDealId === deal._id ? null : deal._id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Main page ─── */

export default function PipelinePage() {
  const pipelineData = useQuery(api.dashboard.getPipelineDeals);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "board">("board");

  if (pipelineData === undefined) {
    return <LoadingSkeleton />;
  }

  const { open, won, lost, total, openValue, wonValue, lostValue } = pipelineData;
  
  // Filter to only show deals with partner involvement
  const partnerDeals = {
    open: open.filter((d: any) => d.involvedPartners && d.involvedPartners.length > 0),
    won: won.filter((d: any) => d.involvedPartners && d.involvedPartners.length > 0),
    lost: lost.filter((d: any) => d.involvedPartners && d.involvedPartners.length > 0),
  };
  
  const hasPartnerDeals = partnerDeals.open.length > 0 || partnerDeals.won.length > 0 || partnerDeals.lost.length > 0;
  
  // Calculate partner-influenced metrics
  const partnerOpenValue = partnerDeals.open.reduce((s: number, d: any) => s + d.amount, 0);
  const partnerWonValue = partnerDeals.won.reduce((s: number, d: any) => s + d.amount, 0);
  const partnerTotalDeals = partnerDeals.open.length + partnerDeals.won.length + partnerDeals.lost.length;

  // Get unique partners involved
  const allPartners = [...partnerDeals.open, ...partnerDeals.won, ...partnerDeals.lost]
    .flatMap((d: any) => d.involvedPartners || []);
  const uniquePartnerIds = [...new Set(allPartners.map((p: any) => p._id))];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Pipeline & Co-Sell</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Partner-influenced deals and revenue pipeline</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
          {/* View toggle */}
          <div style={{
            display: "flex",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", fontSize: ".8rem", fontWeight: 600,
                background: viewMode === "grid" ? "var(--fg)" : "transparent",
                color: viewMode === "grid" ? "var(--bg)" : "var(--muted)",
                border: "none", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <LayoutGrid size={14} /> Grid
            </button>
            <button
              onClick={() => setViewMode("board")}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", fontSize: ".8rem", fontWeight: 600,
                background: viewMode === "board" ? "var(--fg)" : "transparent",
                color: viewMode === "board" ? "var(--bg)" : "var(--muted)",
                border: "none", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <Columns3 size={14} /> Board
            </button>
          </div>

          {viewMode === "grid" && (
            <select 
              className="input" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              style={{ maxWidth: 160 }}
            >
              <option value="all">All Stages</option>
              <option value="open">Open Only</option>
              <option value="won">Won Only</option>
              <option value="lost">Lost Only</option>
            </select>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <StatCard 
          icon={<Target size={22} />} 
          label="Open Pipeline" 
          value={formatCurrency(partnerOpenValue)} 
          sub={`${partnerDeals.open.length} deals`}
          accent="#6366f1" 
        />
        <StatCard 
          icon={<DollarSign size={22} />} 
          label="Partner-Won Revenue" 
          value={formatCurrency(partnerWonValue)} 
          sub={`${partnerDeals.won.length} closed won`}
          accent="#22c55e" 
        />
        <StatCard 
          icon={<Briefcase size={22} />} 
          label="Total Deals" 
          value={String(partnerTotalDeals)} 
          sub={`of ${total} total deals`}
          accent="#f59e0b" 
        />
        <StatCard 
          icon={<Handshake size={22} />} 
          label="Active Partners" 
          value={String(uniquePartnerIds.length)} 
          sub="with pipeline involvement"
          accent="#8b5cf6" 
        />
      </div>

      {/* Pipeline visualization bar (grid view only) */}
      {viewMode === "grid" && hasPartnerDeals && (
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: ".875rem", fontWeight: 700, marginBottom: 12 }}>Pipeline by Stage</div>
          <div style={{ display: "flex", gap: 4, height: 32, borderRadius: 8, overflow: "hidden" }}>
            {partnerDeals.open.length > 0 && (
              <div 
                style={{ 
                  flex: partnerOpenValue || 1, 
                  background: "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: ".75rem",
                  fontWeight: 700,
                }}
                title={`Open: ${formatCurrency(partnerOpenValue)}`}
              >
                Open
              </div>
            )}
            {partnerDeals.won.length > 0 && (
              <div 
                style={{ 
                  flex: partnerWonValue || 1, 
                  background: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: ".75rem",
                  fontWeight: 700,
                }}
                title={`Won: ${formatCurrency(partnerWonValue)}`}
              >
                Won
              </div>
            )}
            {partnerDeals.lost.length > 0 && (
              <div 
                style={{ 
                  flex: lostValue || 1, 
                  background: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: ".75rem",
                  fontWeight: 700,
                }}
                title={`Lost: ${formatCurrency(lostValue)}`}
              >
                Lost
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: ".8rem" }}>
            <span style={{ color: "#6366f1", fontWeight: 600 }}>{formatCurrency(partnerOpenValue)} open</span>
            <span style={{ color: "#22c55e", fontWeight: 600 }}>{formatCurrency(partnerWonValue)} won</span>
            <span style={{ color: "#ef4444", fontWeight: 600 }}>{formatCurrency(lostValue)} lost</span>
          </div>
        </div>
      )}

      {/* Content */}
      {!hasPartnerDeals ? (
        <EmptyState />
      ) : viewMode === "board" ? (
        <BoardView
          partnerDeals={partnerDeals}
          expandedDealId={expandedDealId}
          setExpandedDealId={setExpandedDealId}
        />
      ) : (
        <GridView
          partnerDeals={partnerDeals}
          filterStatus={filterStatus}
          expandedDealId={expandedDealId}
          setExpandedDealId={setExpandedDealId}
        />
      )}
    </div>
  );
}
