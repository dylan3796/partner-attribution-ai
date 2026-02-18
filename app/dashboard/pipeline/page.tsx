"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Deal, Partner, Touchpoint, Attribution } from "@/lib/types";
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
} from "lucide-react";

/* ── helpers ── */

type PartnerAccountSummary = {
  partner: Partner;
  accounts: AccountRollup[];
  totalRevenue: number;
  totalPipeline: number;
  dealsWon: number;
  dealsOpen: number;
  dealsLost: number;
  touchpointCount: number;
  avgDealSize: number;
  influence: number; // % of total org revenue this partner touches
};

type AccountRollup = {
  accountName: string;
  accountEmail: string;
  deals: (Deal & { touchpoints: Touchpoint[]; attributionPct?: number })[];
  totalValue: number;
  status: "active" | "won" | "lost";
};

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

function InfluenceBar({ pct }: { pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 80, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: "#6366f1", borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: ".75rem", fontWeight: 700 }}>{pct.toFixed(1)}%</span>
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

export default function PipelinePage() {
  const { partners, deals, touchpoints, attributions } = useStore();
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"revenue" | "pipeline" | "influence" | "deals">("revenue");

  const totalOrgRevenue = useMemo(() => deals.filter((d) => d.status === "won").reduce((s, d) => s + d.amount, 0), [deals]);

  const partnerSummaries = useMemo(() => {
    return partners.map((partner): PartnerAccountSummary => {
      // Get touchpoints for this partner
      const partnerTouchpoints = touchpoints.filter((t) => t.partnerId === partner._id);
      const dealIds = [...new Set(partnerTouchpoints.map((t) => t.dealId))];
      const partnerDeals = dealIds.map((id) => deals.find((d) => d._id === id)).filter(Boolean) as Deal[];

      // Group by account (contactEmail or contactName)
      const accountMap = new Map<string, AccountRollup>();
      for (const deal of partnerDeals) {
        const key = deal.contactEmail || deal.contactName || deal.name;
        const name = deal.contactName || deal.name;
        const email = deal.contactEmail || "";

        const existing = accountMap.get(key);
        const dealTouchpoints = partnerTouchpoints.filter((t) => t.dealId === deal._id);
        const attr = attributions.find((a) => a.partnerId === partner._id && a.dealId === deal._id);

        const enrichedDeal = { ...deal, touchpoints: dealTouchpoints, attributionPct: attr?.percentage };

        if (existing) {
          existing.deals.push(enrichedDeal);
          existing.totalValue += deal.amount;
          if (deal.status === "open") existing.status = "active";
        } else {
          accountMap.set(key, {
            accountName: name,
            accountEmail: email,
            deals: [enrichedDeal],
            totalValue: deal.amount,
            status: deal.status === "open" ? "active" : deal.status === "won" ? "won" : "lost",
          });
        }
      }

      const wonDeals = partnerDeals.filter((d) => d.status === "won");
      const openDeals = partnerDeals.filter((d) => d.status === "open");
      const totalRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
      const totalPipeline = openDeals.reduce((s, d) => s + d.amount, 0);

      return {
        partner,
        accounts: [...accountMap.values()].sort((a, b) => b.totalValue - a.totalValue),
        totalRevenue,
        totalPipeline,
        dealsWon: wonDeals.length,
        dealsOpen: openDeals.length,
        dealsLost: partnerDeals.filter((d) => d.status === "lost").length,
        touchpointCount: partnerTouchpoints.length,
        avgDealSize: wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0,
        influence: totalOrgRevenue > 0 ? (totalRevenue / totalOrgRevenue) * 100 : 0,
      };
    }).filter((s) => s.touchpointCount > 0); // Only show partners with deal involvement
  }, [partners, deals, touchpoints, attributions, totalOrgRevenue]);

  const filtered = useMemo(() => {
    let result = partnerSummaries;
    if (filterStatus === "has_pipeline") result = result.filter((s) => s.dealsOpen > 0);
    if (filterStatus === "has_revenue") result = result.filter((s) => s.totalRevenue > 0);
    if (filterStatus === "no_deals") result = result.filter((s) => s.dealsWon === 0 && s.dealsOpen === 0);

    result.sort((a, b) => {
      if (sortBy === "revenue") return b.totalRevenue - a.totalRevenue;
      if (sortBy === "pipeline") return b.totalPipeline - a.totalPipeline;
      if (sortBy === "influence") return b.influence - a.influence;
      return (b.dealsWon + b.dealsOpen) - (a.dealsWon + a.dealsOpen);
    });
    return result;
  }, [partnerSummaries, filterStatus, sortBy]);

  // Aggregate stats
  const totalPartnerRevenue = partnerSummaries.reduce((s, p) => s + p.totalRevenue, 0);
  const totalPipeline = partnerSummaries.reduce((s, p) => s + p.totalPipeline, 0);
  const totalAccounts = new Set(partnerSummaries.flatMap((p) => p.accounts.map((a) => a.accountName))).size;
  const avgInfluence = partnerSummaries.length > 0 ? partnerSummaries.reduce((s, p) => s + p.influence, 0) / partnerSummaries.length : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Pipeline & Co-Sell</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Partner relationships to revenue-driving accounts</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="all">All Partners</option>
            <option value="has_pipeline">Active Pipeline</option>
            <option value="has_revenue">Revenue Producing</option>
            <option value="no_deals">No Closed Deals</option>
          </select>
          <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ maxWidth: 160 }}>
            <option value="revenue">Sort: Revenue</option>
            <option value="pipeline">Sort: Pipeline</option>
            <option value="influence">Sort: Influence</option>
            <option value="deals">Sort: Deal Count</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <StatCard icon={<DollarSign size={22} />} label="Partner-Sourced Revenue" value={formatCurrency(totalPartnerRevenue)} accent="#22c55e" />
        <StatCard icon={<Target size={22} />} label="Active Pipeline" value={formatCurrency(totalPipeline)} sub={`${filtered.filter(f => f.dealsOpen > 0).length} partners with open deals`} accent="#6366f1" />
        <StatCard icon={<Briefcase size={22} />} label="Accounts Touched" value={String(totalAccounts)} accent="#f59e0b" />
        <StatCard icon={<Handshake size={22} />} label="Active Partners" value={`${partnerSummaries.length}`} sub={`of ${partners.length} total`} accent="#8b5cf6" />
      </div>

      {/* Partner Revenue Influence Chart */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: ".875rem", fontWeight: 700, marginBottom: 12 }}>Revenue Influence by Partner</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {partnerSummaries
            .sort((a, b) => b.influence - a.influence)
            .slice(0, 8)
            .map((s) => (
              <div key={s.partner._id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 140, fontSize: ".8rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.partner.name}</span>
                <div style={{ flex: 1, height: 20, background: "var(--border)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    width: `${Math.max(2, s.influence)}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, #6366f1, #8b5cf6)`,
                    borderRadius: 4,
                    transition: "width 0.5s",
                  }} />
                  <span style={{ position: "absolute", right: 8, top: 2, fontSize: ".7rem", fontWeight: 700 }}>
                    {formatCurrency(s.totalRevenue)}
                  </span>
                </div>
                <span style={{ fontSize: ".75rem", fontWeight: 700, width: 45, textAlign: "right" }}>{s.influence.toFixed(1)}%</span>
              </div>
            ))}
        </div>
      </div>

      {/* Partner-Account Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
        {filtered.map((summary) => {
          const isExpanded = expandedPartner === summary.partner._id;
          return (
            <div key={summary.partner._id}>
              <div
                className="card"
                onClick={() => setExpandedPartner(isExpanded ? null : summary.partner._id)}
                style={{ padding: "1rem 1.25rem", cursor: "pointer", border: isExpanded ? "1px solid #6366f1" : "1px solid var(--border)" }}
              >
                {/* Partner header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>{summary.partner.name}</span>
                    <span className="muted" style={{ fontSize: ".8rem" }}>{summary.partner.type}</span>
                    {summary.partner.tier && (
                      <span style={{
                        padding: "1px 8px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase",
                        background: summary.partner.tier === "platinum" ? "#a78bfa22" : summary.partner.tier === "gold" ? "#eab30822" : "#94a3b822",
                        color: summary.partner.tier === "platinum" ? "#a78bfa" : summary.partner.tier === "gold" ? "#eab308" : "#94a3b8",
                      }}>
                        {summary.partner.tier}
                      </span>
                    )}
                  </div>
                  <InfluenceBar pct={summary.influence} />
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: "1.5rem", marginTop: 10, fontSize: ".8rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#22c55e" }}>
                    <DollarSign size={13} style={{ verticalAlign: -2 }} /> {formatCurrency(summary.totalRevenue)} won
                  </span>
                  <span style={{ fontWeight: 600, color: "#6366f1" }}>
                    <Target size={13} style={{ verticalAlign: -2 }} /> {formatCurrency(summary.totalPipeline)} pipeline
                  </span>
                  <span className="muted">
                    <CheckCircle2 size={13} style={{ verticalAlign: -2 }} /> {summary.dealsWon} won
                  </span>
                  <span className="muted">
                    <Clock size={13} style={{ verticalAlign: -2 }} /> {summary.dealsOpen} open
                  </span>
                  <span className="muted">
                    <Briefcase size={13} style={{ verticalAlign: -2 }} /> {summary.accounts.length} accounts
                  </span>
                  <span className="muted">
                    <GitBranch size={13} style={{ verticalAlign: -2 }} /> {summary.touchpointCount} touchpoints
                  </span>
                </div>
              </div>

              {/* Expanded: Account breakdown */}
              {isExpanded && (
                <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                  {summary.accounts.map((acct, i) => (
                    <div key={i} className="card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid #6366f1" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{acct.accountName}</span>
                          {acct.accountEmail && <span className="muted" style={{ fontSize: ".8rem", marginLeft: 8 }}>{acct.accountEmail}</span>}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: ".9rem" }}>{formatCurrency(acct.totalValue)}</span>
                      </div>

                      {/* Deals under this account */}
                      {acct.deals.map((deal) => (
                        <div key={deal._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderTop: "1px solid var(--border)", fontSize: ".85rem" }}>
                          {statusIcon(deal.status)}
                          <Link href={`/dashboard/deals/${deal._id}`} style={{ fontWeight: 600, flex: 1, textDecoration: "none" }}>
                            {deal.name}
                          </Link>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {deal.touchpoints.map((tp, j) => (
                              <TouchpointBadge key={j} type={tp.type} />
                            ))}
                          </div>
                          {deal.attributionPct !== undefined && (
                            <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#6366f1" }}>{deal.attributionPct}%</span>
                          )}
                          <span style={{ fontWeight: 600, width: 90, textAlign: "right" }}>{formatCurrency(deal.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <p className="muted">No partners match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
