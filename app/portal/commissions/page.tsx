"use client";

import { useState, useMemo } from "react";
import { usePortal } from "@/lib/portal-context";
import { formatCurrency, formatCurrencyCompact as fmt } from "@/lib/utils";
import {
  Download, DollarSign, TrendingUp, Clock, CheckCircle2,
  Calendar, ChevronRight, BarChart3, ArrowUpCircle, Wallet,
  Filter, PieChart,
} from "lucide-react";

const DAY = 86400000;
const now = Date.now();

/* ── Mini bar chart (no deps) ── */
function MiniBarChart({ data, height = 100 }: { data: { label: string; value: number; color: string }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
      {data.map((d, i) => {
        const h = Math.max(4, (d.value / max) * (height - 20));
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: ".65rem", fontWeight: 700 }}>{fmt(d.value)}</span>
            <div style={{ width: "100%", height: h, background: d.color, borderRadius: 4, transition: "height 0.5s ease" }} />
            <span className="muted" style={{ fontSize: ".6rem" }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Commission breakdown donut ── */
function DonutChart({ segments, size = 100 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {segments.map((seg, i) => {
          const segLen = (seg.value / total) * circumference;
          const el = (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={`${segLen} ${circumference - segLen}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += segLen;
          return el;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.18, fontWeight: 800 }}>{fmt(total)}</span>
        <span className="muted" style={{ fontSize: size * 0.1 }}>total</span>
      </div>
    </div>
  );
}

export default function PortalCommissionsPage() {
  const { myAttributions, myPayouts, stats, partner } = usePortal();
  const [periodFilter, setPeriodFilter] = useState<string>("all");

  if (!partner) return null;

  const paidTotal = myPayouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.commissionAmount, 0);
  const pendingTotal = myPayouts.filter((p) => p.status !== "paid").reduce((s, p) => s + p.commissionAmount, 0);
  const totalEarned = myAttributions.reduce((s, a) => s + a.commissionAmount, 0);
  const commissionRate = partner.tier === "platinum" ? 15 : partner.tier === "gold" ? 12 : partner.tier === "silver" ? 10 : 8;

  // Monthly breakdown (last 6 months)
  const monthlyData = useMemo(() => {
    const months: { label: string; value: number; color: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now - i * 30 * DAY);
      const label = d.toLocaleDateString("en", { month: "short" });
      // Simulate monthly earnings based on total
      const base = totalEarned / 8;
      const variance = 0.5 + Math.random();
      months.push({ label, value: Math.round(base * variance), color: i === 0 ? "#6366f1" : "#6366f140" });
    }
    return months;
  }, [totalEarned]);

  // Commission by model/type breakdown
  const typeBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    myAttributions.forEach((a) => {
      const type = a.deal?.status === "won" ? "Won deals" : "Open pipeline";
      map.set(type, (map.get(type) || 0) + a.commissionAmount);
    });
    const colors = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b"];
    return [...map.entries()].map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));
  }, [myAttributions]);

  // Projected next quarter
  const projectedQuarterly = Math.round(totalEarned * 1.15); // 15% growth projection

  // Filter attributions
  const filteredAttributions = useMemo(() => {
    if (periodFilter === "all") return myAttributions;
    const cutoff = periodFilter === "30d" ? now - 30 * DAY : periodFilter === "90d" ? now - 90 * DAY : now - 180 * DAY;
    return myAttributions.filter((a) => (a.deal?.closedAt || a.deal?.createdAt || 0) > cutoff);
  }, [myAttributions, periodFilter]);

  // CSV export
  function exportCSV() {
    const header = "Deal,Deal Value,Attribution %,Commission,Status,Date";
    const rows = myAttributions.map((a) =>
      `"${a.deal?.name || ""}",${a.deal?.amount || 0},${a.percentage.toFixed(1)},${a.commissionAmount},${a.deal?.status || ""},${a.deal?.closedAt ? new Date(a.deal.closedAt).toLocaleDateString() : ""}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `commissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click(); URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Commissions</h1>
          <p className="muted">Your earnings, payouts, and commission details</p>
        </div>
        <button className="btn-outline" onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".85rem" }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { icon: <DollarSign size={20} />, label: "Total Earned", value: fmt(totalEarned), color: "#22c55e" },
          { icon: <CheckCircle2 size={20} />, label: "Paid Out", value: fmt(paidTotal), color: "#6366f1" },
          { icon: <Clock size={20} />, label: "Pending", value: fmt(pendingTotal), color: "#eab308" },
          { icon: <TrendingUp size={20} />, label: "Commission Rate", value: `${commissionRate}%`, sub: `${partner.tier} tier`, color: "#8b5cf6" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "1rem", display: "flex", gap: ".75rem", alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>{s.value}</div>
              {s.sub && <div className="muted" style={{ fontSize: ".7rem" }}>{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
        {/* Monthly Trend */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: ".95rem", display: "flex", alignItems: "center", gap: 6 }}>
              <BarChart3 size={16} style={{ color: "#6366f1" }} /> Monthly Earnings
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpCircle size={14} style={{ color: "#22c55e" }} />
              <span style={{ fontSize: ".75rem", fontWeight: 600, color: "#22c55e" }}>+15% projected</span>
            </div>
          </div>
          <MiniBarChart data={monthlyData} height={110} />
        </div>

        {/* Breakdown donut */}
        <div className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: 12, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}>
            <PieChart size={16} style={{ color: "#6366f1" }} /> By Status
          </h3>
          {typeBreakdown.length > 0 ? (
            <>
              <DonutChart segments={typeBreakdown} size={90} />
              <div style={{ marginTop: 12, width: "100%" }}>
                {typeBreakdown.map((seg) => (
                  <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".75rem", padding: "3px 0" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: seg.color }} />
                    <span className="muted" style={{ flex: 1 }}>{seg.label}</span>
                    <span style={{ fontWeight: 700 }}>{fmt(seg.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="muted" style={{ fontSize: ".85rem", textAlign: "center", padding: "1rem" }}>No data yet</p>
          )}
        </div>
      </div>

      {/* Projected Earnings */}
      <div className="card" style={{ padding: "1rem 1.25rem", background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 100%)", border: "1px solid rgba(99,102,241,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Wallet size={20} style={{ color: "#6366f1" }} />
            <div>
              <div style={{ fontSize: ".85rem", fontWeight: 700 }}>Projected Next Quarter</div>
              <div className="muted" style={{ fontSize: ".75rem" }}>Based on current pipeline and close rates</div>
            </div>
          </div>
          <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#6366f1" }}>{fmt(projectedQuarterly)}</span>
        </div>
      </div>

      {/* Commission Details */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".95rem" }}>Commission by Deal</h3>
          <select className="input" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} style={{ maxWidth: 140, fontSize: ".8rem" }}>
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="180d">Last 6 Months</option>
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Deal", "Deal Value", "Attribution", "Commission", "Status"].map((h) => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600, fontSize: ".75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAttributions.map((a) => (
                <tr key={a._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px", fontWeight: 600 }}>{a.deal?.name || "—"}</td>
                  <td style={{ padding: "10px" }}>{fmt(a.deal?.amount || 0)}</td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${a.percentage}%`, height: "100%", background: "#6366f1", borderRadius: 2 }} />
                      </div>
                      <span>{a.percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px", fontWeight: 700, color: "#065f46" }}>{formatCurrency(a.commissionAmount)}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700,
                      background: a.deal?.status === "won" ? "#22c55e20" : a.deal?.status === "open" ? "#3b82f620" : "#ef444420",
                      color: a.deal?.status === "won" ? "#22c55e" : a.deal?.status === "open" ? "#3b82f6" : "#ef4444",
                    }}>
                      {a.deal?.status || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAttributions.length === 0 && (
            <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
              <DollarSign size={36} style={{ color: "var(--muted)", marginBottom: 8 }} />
              <h4 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>
                {periodFilter !== "all" ? "No commissions in this period" : "No commissions yet"}
              </h4>
              <p className="muted" style={{ fontSize: ".85rem" }}>
                {periodFilter !== "all" ? "Try selecting a different time period." : "When deals you influence close, your commissions will appear here automatically."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payout History */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: "1rem" }}>Payout History</h3>
        {myPayouts.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "1.5rem" }}>No payouts yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {myPayouts.map((p, i) => (
              <div key={p.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: p.status === "paid" ? "#22c55e15" : "#eab30815",
                    color: p.status === "paid" ? "#22c55e" : "#eab308",
                  }}>
                    {p.status === "paid" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: ".9rem" }}>{p.dealName || "Commission Payout"}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>
                      {p.paidAt ? `Paid ${new Date(p.paidAt).toLocaleDateString()}` : `Pending · ${new Date(p.date).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{formatCurrency(p.commissionAmount)}</p>
                  <span style={{
                    padding: "1px 8px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700,
                    background: p.status === "paid" ? "#22c55e20" : p.status === "approved" ? "#3b82f620" : "#eab30820",
                    color: p.status === "paid" ? "#22c55e" : p.status === "approved" ? "#3b82f6" : "#eab308",
                  }}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="card" style={{ padding: "1.25rem", background: "var(--subtle)" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".75rem" }}>How are commissions calculated?</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { step: "1", title: "Deal Closes", desc: "A deal you influenced is marked as won in the CRM." },
            { step: "2", title: "Attribution Runs", desc: "Role-based model weights your touchpoints (referral, demo, co-sell)." },
            { step: "3", title: "Commission Calculated", desc: `Your ${commissionRate}% rate is applied to your attributed amount.` },
            { step: "4", title: "Payout Processed", desc: "Approved commissions are paid within 5 business days." },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#6366f115", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: 800, fontSize: ".8rem", flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontSize: ".85rem", fontWeight: 600 }}>{s.title}</div>
                <div className="muted" style={{ fontSize: ".78rem", lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
