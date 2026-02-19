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

function DealCard({ deal, isExpanded, onToggle }: { deal: any; isExpanded: boolean; onToggle: () => void }) {
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
        padding: "1rem", 
        cursor: "pointer",
        border: isExpanded ? "1px solid #6366f1" : "1px solid var(--border)",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <Link 
            href={`/dashboard/deals/${deal._id}`} 
            onClick={(e) => e.stopPropagation()}
            style={{ fontWeight: 700, fontSize: ".95rem", textDecoration: "none" }}
          >
            {deal.name}
          </Link>
          {deal.contactName && <p className="muted" style={{ fontSize: ".8rem" }}>{deal.contactName}</p>}
        </div>
        <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg }}>
          {deal.status}
        </span>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>{formatCurrency(deal.amount)}</span>
        <span className="muted" style={{ fontSize: ".75rem" }}>{formatDate(deal.createdAt)}</span>
      </div>
      
      {/* Partner info */}
      {deal.involvedPartners && deal.involvedPartners.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
            <Handshake size={13} style={{ color: "#6366f1" }} />
            {deal.involvedPartners.slice(0, 2).map((p: any) => (
              <span key={p._id} style={{ fontSize: ".75rem", fontWeight: 600 }}>
                {p.name}
                {p.attributionPct > 0 && <span style={{ color: "#6366f1" }}> ({p.attributionPct}%)</span>}
              </span>
            ))}
            {deal.involvedPartners.length > 2 && (
              <span className="muted" style={{ fontSize: ".75rem" }}>+{deal.involvedPartners.length - 2} more</span>
            )}
          </div>
        </div>
      )}
      
      {/* Expanded details */}
      {isExpanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          {/* All partners */}
          {deal.involvedPartners && deal.involvedPartners.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p className="muted" style={{ fontSize: ".7rem", fontWeight: 600, marginBottom: 6 }}>PARTNERS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {deal.involvedPartners.map((p: any) => (
                  <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{p.name}</span>
                      <TierBadge tier={p.tier} />
                    </div>
                    {p.attributionPct > 0 && (
                      <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#6366f1" }}>{p.attributionPct}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Touchpoints */}
          {deal.touchpoints && deal.touchpoints.length > 0 && (
            <div>
              <p className="muted" style={{ fontSize: ".7rem", fontWeight: 600, marginBottom: 6 }}>TOUCHPOINTS</p>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {deal.touchpoints.map((tp: any) => (
                  <TouchpointBadge key={tp._id} type={tp.type} />
                ))}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: 12 }}>
            <Link 
              href={`/dashboard/deals/${deal._id}`}
              className="btn-outline"
              style={{ fontSize: ".8rem", padding: ".4rem .8rem" }}
              onClick={(e) => e.stopPropagation()}
            >
              View Deal <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PipelinePage() {
  const pipelineData = useQuery(api.dashboard.getPipelineDeals);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

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
        <div style={{ display: "flex", gap: ".75rem" }}>
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

      {/* Pipeline visualization */}
      {hasPartnerDeals && (
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: ".875rem", fontWeight: 700, marginBottom: 12 }}>Pipeline by Stage</div>
          <div style={{ display: "flex", gap: 4, height: 32, borderRadius: 8, overflow: "hidden" }}>
            {partnerDeals.open.length > 0 && (
              <div 
                style={{ 
                  flex: partnerOpenValue, 
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
                  flex: partnerWonValue, 
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
                  flex: lostValue, 
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

      {/* Empty state or deal cards */}
      {!hasPartnerDeals ? (
        <EmptyState />
      ) : (
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
      )}
    </div>
  );
}
