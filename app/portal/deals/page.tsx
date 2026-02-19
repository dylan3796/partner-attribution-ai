"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePortal } from "@/lib/portal-context";
import { formatCurrency, formatCurrencyCompact as fmt } from "@/lib/utils";
import {
  Plus, X, CheckCircle2, Clock, XCircle, Briefcase, TrendingUp,
  DollarSign, Calendar, ChevronRight, Search, Filter,
} from "lucide-react";

const DAY = 86400000;
const now = Date.now();

type DemoDeal = {
  id: string;
  companyName: string;
  amount: number;
  status: "open" | "won" | "lost";
  registrationStatus: "pending" | "approved" | "rejected";
  contactName: string;
  contactEmail: string;
  expectedCloseDate?: number;
  notes?: string;
  createdAt: number;
  approvedAt?: number;
};

const initialDeals: DemoDeal[] = [
  {
    id: "d1", companyName: "Acme Corp", amount: 85000, status: "won", registrationStatus: "approved",
    contactName: "Jane Smith", contactEmail: "jane@acme.com", expectedCloseDate: now - 10 * DAY,
    notes: "Cloud migration project, referred by our SE team", createdAt: now - 45 * DAY, approvedAt: now - 43 * DAY,
  },
  {
    id: "d2", companyName: "Globex Industries", amount: 120000, status: "open", registrationStatus: "approved",
    contactName: "Bob Chen", contactEmail: "bob@globex.com", expectedCloseDate: now + 30 * DAY,
    notes: "Data platform modernization, strong champion", createdAt: now - 20 * DAY, approvedAt: now - 18 * DAY,
  },
  {
    id: "d3", companyName: "Initech", amount: 45000, status: "lost", registrationStatus: "approved",
    contactName: "Mike Johnson", contactEmail: "mike@initech.com",
    notes: "Budget frozen in Q4", createdAt: now - 60 * DAY, approvedAt: now - 58 * DAY,
  },
  {
    id: "d4", companyName: "Umbrella Corp", amount: 95000, status: "open", registrationStatus: "pending",
    contactName: "Sarah Lee", contactEmail: "sarah@umbrella.co", expectedCloseDate: now + 60 * DAY,
    notes: "Security platform deal, waiting on procurement", createdAt: now - 3 * DAY,
  },
  {
    id: "d5", companyName: "Stark Solutions", amount: 200000, status: "open", registrationStatus: "approved",
    contactName: "Tony Park", contactEmail: "tony@stark.io", expectedCloseDate: now + 45 * DAY,
    notes: "Enterprise license, multi-year", createdAt: now - 15 * DAY, approvedAt: now - 14 * DAY,
  },
];

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; fg: string; icon: React.ReactNode; label: string }> = {
    open: { bg: "#3b82f620", fg: "#3b82f6", icon: <Clock size={12} />, label: "Open" },
    won: { bg: "#22c55e20", fg: "#22c55e", icon: <CheckCircle2 size={12} />, label: "Won" },
    lost: { bg: "#ef444420", fg: "#ef4444", icon: <XCircle size={12} />, label: "Lost" },
    pending: { bg: "#eab30820", fg: "#eab308", icon: <Clock size={12} />, label: "Pending" },
    approved: { bg: "#22c55e20", fg: "#22c55e", icon: <CheckCircle2 size={12} />, label: "Approved" },
    rejected: { bg: "#ef444420", fg: "#ef4444", icon: <XCircle size={12} />, label: "Rejected" },
  };
  const c = cfg[status] || cfg.open;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, background: c.bg, color: c.fg }}>
      {c.icon} {c.label}
    </span>
  );
}

function PipelineBar({ deals }: { deals: DemoDeal[] }) {
  const open = deals.filter(d => d.status === "open");
  const won = deals.filter(d => d.status === "won");
  const lost = deals.filter(d => d.status === "lost");
  const total = deals.reduce((s, d) => s + d.amount, 0) || 1;

  const segments = [
    { label: "Won", value: won.reduce((s, d) => s + d.amount, 0), color: "#22c55e" },
    { label: "Open", value: open.reduce((s, d) => s + d.amount, 0), color: "#3b82f6" },
    { label: "Lost", value: lost.reduce((s, d) => s + d.amount, 0), color: "#ef4444" },
  ];

  return (
    <div>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", background: "var(--border)" }}>
        {segments.map((seg) => seg.value > 0 ? (
          <div key={seg.label} style={{ width: `${(seg.value / total) * 100}%`, background: seg.color, transition: "width 0.3s" }} title={`${seg.label}: ${fmt(seg.value)}`} />
        ) : null)}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
        {segments.map((seg) => (
          <span key={seg.label} style={{ fontSize: ".7rem", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: seg.color }} />
            <span className="muted">{seg.label}:</span>
            <span style={{ fontWeight: 700 }}>{fmt(seg.value)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PortalDealsPage() {
  const { partner } = usePortal();
  const [deals, setDeals] = useState<DemoDeal[]>(initialDeals);
  const [showRegister, setShowRegister] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ companyName: "", estimatedValue: "", contactName: "", contactEmail: "", notes: "", expectedCloseDate: "" });

  if (!partner) return null;

  const filtered = deals.filter((d) => {
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.companyName.toLowerCase().includes(q) || d.contactName.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const openPipeline = deals.filter(d => d.status === "open").reduce((s, d) => s + d.amount, 0);
  const wonRevenue = deals.filter(d => d.status === "won").reduce((s, d) => s + d.amount, 0);
  const pendingReg = deals.filter(d => d.registrationStatus === "pending").length;

  const handleSubmit = () => {
    const newDeal: DemoDeal = {
      id: `d${Date.now()}`,
      companyName: regForm.companyName,
      amount: parseFloat(regForm.estimatedValue) || 0,
      status: "open",
      registrationStatus: "pending",
      contactName: regForm.contactName,
      contactEmail: regForm.contactEmail,
      expectedCloseDate: regForm.expectedCloseDate ? new Date(regForm.expectedCloseDate).getTime() : undefined,
      notes: regForm.notes,
      createdAt: Date.now(),
    };
    setDeals((prev) => [newDeal, ...prev]);
    setSubmitted(true);
    setRegForm({ companyName: "", estimatedValue: "", contactName: "", contactEmail: "", notes: "", expectedCloseDate: "" });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>My Deal Registrations</h1>
          <p className="muted">{deals.length} deals · {fmt(openPipeline)} pipeline</p>
        </div>
        <button className="btn" onClick={() => { setShowRegister(true); setSubmitted(false); }}>
          <Plus size={15} /> Register a Deal
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { icon: <TrendingUp size={20} />, label: "Open Pipeline", value: fmt(openPipeline), color: "#3b82f6" },
          { icon: <DollarSign size={20} />, label: "Won Revenue", value: fmt(wonRevenue), color: "#22c55e" },
          { icon: <Briefcase size={20} />, label: "Total Deals", value: String(deals.length), color: "#6366f1" },
          { icon: <Clock size={20} />, label: "Pending Review", value: String(pendingReg), color: "#eab308" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "1rem", display: "flex", gap: ".75rem", alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline visualization */}
      <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: ".8rem", fontWeight: 700, marginBottom: 8 }}>Pipeline Breakdown</div>
        <PipelineBar deals={deals} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={16} style={{ position: "absolute", left: 10, top: 9, color: "var(--muted)" }} />
          <input className="input" placeholder="Search deals..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, width: "100%" }} />
        </div>
        <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: 140 }}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Deal cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((deal) => {
          const isExpanded = expandedId === deal.id;
          return (
            <div key={deal.id}>
              <div
                className="card"
                onClick={() => setExpandedId(isExpanded ? null : deal.id)}
                style={{ padding: "1rem 1.25rem", cursor: "pointer", border: isExpanded ? "1px solid #6366f1" : "1px solid var(--border)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1rem", fontWeight: 700 }}>{deal.companyName}</span>
                    <StatusBadge status={deal.status} />
                    <StatusBadge status={deal.registrationStatus} />
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>{formatCurrency(deal.amount)}</span>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", marginTop: 8, fontSize: ".78rem" }}>
                  <span className="muted">{deal.contactName} · {deal.contactEmail}</span>
                  {deal.expectedCloseDate && (
                    <span className="muted"><Calendar size={12} style={{ verticalAlign: -2 }} /> Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                  )}
                  <span className="muted">Registered {new Date(deal.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="card" style={{ marginTop: 4, padding: "1rem 1.25rem", borderLeft: "3px solid #6366f1" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: 12 }}>
                    <div>
                      <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Contact</div>
                      <div style={{ fontSize: ".875rem" }}>{deal.contactName}</div>
                      <div className="muted" style={{ fontSize: ".8rem" }}>{deal.contactEmail}</div>
                    </div>
                    <div>
                      <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Timeline</div>
                      <div style={{ fontSize: ".85rem" }}>Registered: {new Date(deal.createdAt).toLocaleDateString()}</div>
                      {deal.approvedAt && <div style={{ fontSize: ".85rem", color: "#22c55e" }}>Approved: {new Date(deal.approvedAt).toLocaleDateString()}</div>}
                      {deal.expectedCloseDate && <div style={{ fontSize: ".85rem" }}>Expected close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</div>}
                    </div>
                  </div>
                  {deal.notes && (
                    <div>
                      <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
                      <p style={{ fontSize: ".85rem", lineHeight: 1.5 }}>{deal.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <Briefcase size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600 }}>No deals found</p>
            <p className="muted" style={{ fontSize: ".875rem" }}>
              {search || filterStatus !== "all" ? "Try adjusting your filters" : "Register your first deal to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => { setShowRegister(false); setSubmitted(false); }}>
          <div className="card" style={{ width: 520, maxWidth: "100%" }} onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: "#22c55e20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle2 size={28} style={{ color: "#22c55e" }} />
                </div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Deal Registered!</h2>
                <p className="muted" style={{ marginBottom: 4 }}>Your deal registration is pending approval.</p>
                <p className="muted" style={{ fontSize: ".8rem" }}>You'll be notified when it's reviewed (typically within 24h).</p>
                <button className="btn" style={{ marginTop: "1.5rem" }} onClick={() => { setShowRegister(false); setSubmitted(false); }}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Register a Deal</h2>
                    <p className="muted" style={{ fontSize: ".8rem" }}>Submit an opportunity for approval and tracking</p>
                  </div>
                  <button onClick={() => setShowRegister(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Company Name *</label>
                    <input className="input" placeholder="Prospect company name" value={regForm.companyName} onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Estimated Deal Value ($) *</label>
                    <input className="input" type="number" placeholder="50000" value={regForm.estimatedValue} onChange={(e) => setRegForm({ ...regForm, estimatedValue: e.target.value })} style={{ width: "100%" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Contact Name *</label>
                      <input className="input" placeholder="Decision maker" value={regForm.contactName} onChange={(e) => setRegForm({ ...regForm, contactName: e.target.value })} style={{ width: "100%" }} />
                    </div>
                    <div>
                      <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Contact Email *</label>
                      <input className="input" type="email" placeholder="email@company.com" value={regForm.contactEmail} onChange={(e) => setRegForm({ ...regForm, contactEmail: e.target.value })} style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Expected Close Date</label>
                    <input className="input" type="date" value={regForm.expectedCloseDate} onChange={(e) => setRegForm({ ...regForm, expectedCloseDate: e.target.value })} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Notes</label>
                    <textarea className="input" rows={3} placeholder="How did you find this opportunity? Context helps with approval..." style={{ resize: "vertical", width: "100%" }} value={regForm.notes} onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })} />
                  </div>
                  <button
                    className="btn"
                    style={{ width: "100%", marginTop: 4 }}
                    disabled={!regForm.companyName || !regForm.estimatedValue || !regForm.contactName || !regForm.contactEmail}
                    onClick={handleSubmit}
                  >
                    Submit Registration
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
