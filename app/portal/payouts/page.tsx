"use client";

import { useState } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronUp,
  BanknoteIcon,
} from "lucide-react";
import { usePortal } from "@/lib/portal-context";

/* ── Types ── */
interface Payout {
  id: string;
  period: string;
  periodLabel: string;
  amount: number;
  status: "paid" | "pending" | "processing" | "scheduled";
  paidDate: string | null;
  scheduledDate: string;
  method: string;
  deals: number;
  commissionRate: string;
  invoiceId: string;
}

interface EarningBreakdown {
  source: string;
  deals: number;
  amount: number;
  type: "commission" | "bonus" | "spiff" | "rebate";
}

/* ── Demo Data ── */
const PAYOUTS: Payout[] = [
  { id: "p1", period: "2026-02", periodLabel: "February 2026", amount: 8420, status: "pending", paidDate: null, scheduledDate: "2026-03-15", method: "ACH Transfer", deals: 6, commissionRate: "12%", invoiceId: "INV-2026-0218" },
  { id: "p2", period: "2026-01", periodLabel: "January 2026", amount: 12350, status: "paid", paidDate: "2026-02-15", scheduledDate: "2026-02-15", method: "ACH Transfer", deals: 9, commissionRate: "12%", invoiceId: "INV-2026-0115" },
  { id: "p3", period: "2025-12", periodLabel: "December 2025", amount: 15680, status: "paid", paidDate: "2026-01-15", scheduledDate: "2026-01-15", method: "ACH Transfer", deals: 11, commissionRate: "12%", invoiceId: "INV-2025-1215" },
  { id: "p4", period: "2025-11", periodLabel: "November 2025", amount: 9240, status: "paid", paidDate: "2025-12-15", scheduledDate: "2025-12-15", method: "ACH Transfer", deals: 7, commissionRate: "12%", invoiceId: "INV-2025-1115" },
  { id: "p5", period: "2025-10", periodLabel: "October 2025", amount: 7890, status: "paid", paidDate: "2025-11-15", scheduledDate: "2025-11-15", method: "ACH Transfer", deals: 5, commissionRate: "10%", invoiceId: "INV-2025-1015" },
  { id: "p6", period: "2025-09", periodLabel: "September 2025", amount: 6450, status: "paid", paidDate: "2025-10-15", scheduledDate: "2025-10-15", method: "Wire Transfer", deals: 4, commissionRate: "10%", invoiceId: "INV-2025-0915" },
  { id: "p7", period: "2025-08", periodLabel: "August 2025", amount: 4200, status: "paid", paidDate: "2025-09-15", scheduledDate: "2025-09-15", method: "Wire Transfer", deals: 3, commissionRate: "10%", invoiceId: "INV-2025-0815" },
];

const CURRENT_EARNINGS: EarningBreakdown[] = [
  { source: "Enterprise SSO Migration", deals: 1, amount: 3240, type: "commission" },
  { source: "API Gateway Upsell", deals: 1, amount: 1890, type: "commission" },
  { source: "Analytics Platform Renewal", deals: 1, amount: 1440, type: "commission" },
  { source: "Q1 Accelerator Bonus", deals: 0, amount: 1500, type: "bonus" },
  { source: "Cloud Migration SPIFF", deals: 1, amount: 350, type: "spiff" },
];

/* ── Helpers ── */
function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtExact(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusStyle(status: Payout["status"]): { bg: string; color: string; icon: React.ReactNode } {
  switch (status) {
    case "paid": return { bg: "#22c55e18", color: "#22c55e", icon: <CheckCircle2 size={14} /> };
    case "pending": return { bg: "#f59e0b18", color: "#f59e0b", icon: <Clock size={14} /> };
    case "processing": return { bg: "#3b82f618", color: "#3b82f6", icon: <Clock size={14} /> };
    case "scheduled": return { bg: "#6b728018", color: "#6b7280", icon: <Calendar size={14} /> };
  }
}

function typeStyle(type: EarningBreakdown["type"]): { bg: string; color: string } {
  switch (type) {
    case "commission": return { bg: "#6366f118", color: "#6366f1" };
    case "bonus": return { bg: "#22c55e18", color: "#22c55e" };
    case "spiff": return { bg: "#f59e0b18", color: "#f59e0b" };
    case "rebate": return { bg: "#3b82f618", color: "#3b82f6" };
  }
}

/* ── Component ── */
export default function PayoutsPage() {
  const { partner } = usePortal();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");

  const totalEarned = PAYOUTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pendingAmount = PAYOUTS.filter((p) => p.status === "pending" || p.status === "processing").reduce((s, p) => s + p.amount, 0);
  const currentEarnings = CURRENT_EARNINGS.reduce((s, e) => s + e.amount, 0);
  const ytdEarnings = PAYOUTS.filter((p) => p.period.startsWith("2026")).reduce((s, p) => s + p.amount, 0);

  // Monthly trend
  const paidPayouts = PAYOUTS.filter((p) => p.status === "paid").reverse();
  const maxPaid = Math.max(...paidPayouts.map((p) => p.amount));

  const filteredPayouts = PAYOUTS.filter((p) => {
    if (filter === "paid") return p.status === "paid";
    if (filter === "pending") return p.status !== "paid";
    return true;
  });

  const nextPayDate = "March 15, 2026";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            <Wallet size={22} style={{ marginRight: 8, verticalAlign: "middle", color: "#6366f1" }} />
            Payouts & Earnings
          </h1>
          <p style={{ color: "var(--muted)", fontSize: ".85rem", margin: "4px 0 0" }}>
            Track your commission payments and earnings history
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
          borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)",
          fontWeight: 600, fontSize: ".82rem", cursor: "pointer", fontFamily: "inherit", color: "var(--fg)",
        }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Earned", value: fmtExact(totalEarned), icon: <DollarSign size={18} />, color: "#22c55e", sub: "All time" },
          { label: "Pending Payout", value: fmtExact(pendingAmount), icon: <Clock size={18} />, color: "#f59e0b", sub: `Next: ${nextPayDate}` },
          { label: "Current Period", value: fmtExact(currentEarnings), icon: <TrendingUp size={18} />, color: "#6366f1", sub: "Feb 2026 (in progress)" },
          { label: "YTD Earnings", value: fmtExact(ytdEarnings), icon: <Calendar size={18} />, color: "#3b82f6", sub: "2026 year-to-date" },
        ].map((card, i) => (
          <div key={i} style={{ padding: 18, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".03em" }}>{card.label}</span>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 2 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Earnings Trend + Current Breakdown ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Earnings trend chart */}
        <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)" }}>
          <h3 style={{ fontSize: ".85rem", fontWeight: 700, margin: "0 0 14px" }}>Earnings Trend</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {paidPayouts.map((p) => {
              const h = (p.amount / maxPaid) * 100;
              return (
                <div key={p.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: ".6rem", fontWeight: 700, marginBottom: 3 }}>{fmt(p.amount)}</span>
                  <div style={{ height: h, width: "100%", maxWidth: 36, background: "#22c55e", borderRadius: 6, opacity: 0.8 }} />
                  <span style={{ fontSize: ".6rem", color: "var(--muted)", marginTop: 4, fontWeight: 600 }}>
                    {p.periodLabel.split(" ")[0].slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current period breakdown */}
        <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: ".85rem", fontWeight: 700, margin: 0 }}>February Earnings Breakdown</h3>
            <span style={{ fontSize: ".85rem", fontWeight: 800, color: "#6366f1" }}>{fmtExact(currentEarnings)}</span>
          </div>
          {CURRENT_EARNINGS.map((e, i) => {
            const ts = typeStyle(e.type);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < CURRENT_EARNINGS.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: ".65rem", fontWeight: 700, background: ts.bg, color: ts.color, textTransform: "capitalize" }}>
                    {e.type}
                  </span>
                  <span style={{ fontSize: ".8rem", fontWeight: 500 }}>{e.source}</span>
                </div>
                <span style={{ fontSize: ".85rem", fontWeight: 700 }}>{fmtExact(e.amount)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Payment Info Banner ── */}
      <div style={{ padding: 14, borderRadius: 10, background: "#3b82f610", border: "1px solid #3b82f630", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <CreditCard size={18} color="#3b82f6" />
        <span style={{ fontSize: ".82rem" }}>
          <strong>Payment method:</strong> ACH Transfer ending in •••4821 &nbsp;·&nbsp;
          <strong>Schedule:</strong> 15th of each month &nbsp;·&nbsp;
          <strong>Net terms:</strong> Net-30
        </span>
        <a href="/portal/profile" style={{ marginLeft: "auto", fontSize: ".78rem", color: "#6366f1", fontWeight: 600 }}>
          Update Payment Info →
        </a>
      </div>

      {/* ── Filter + Payout History ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["all", "paid", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 14px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
              border: filter === f ? "2px solid #6366f1" : "1px solid var(--border)",
              background: filter === f ? "#6366f120" : "var(--bg)",
              color: filter === f ? "#6366f1" : "var(--muted)",
              cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
            }}
          >
            {f} {f === "all" ? `(${PAYOUTS.length})` : f === "paid" ? `(${PAYOUTS.filter((p) => p.status === "paid").length})` : `(${PAYOUTS.filter((p) => p.status !== "paid").length})`}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredPayouts.map((p) => {
          const st = statusStyle(p.status);
          const isExpanded = expandedId === p.id;
          return (
            <div key={p.id} style={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)", overflow: "hidden" }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                  padding: "16px 20px", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", color: "var(--fg)", textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", color: st.color }}>
                    {st.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{p.periodLabel}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>
                      {p.deals} deals · {p.commissionRate} rate · {p.invoiceId}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 12, fontSize: ".7rem", fontWeight: 700,
                    background: st.bg, color: st.color, textTransform: "capitalize",
                  }}>
                    {p.status}
                  </span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, minWidth: 90, textAlign: "right" }}>
                    {fmtExact(p.amount)}
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div style={{ padding: "0 20px 16px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "14px 0" }}>
                    <div>
                      <div style={{ fontSize: ".65rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Amount</div>
                      <div style={{ fontWeight: 800, fontSize: "1rem" }}>{fmtExact(p.amount)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: ".65rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Method</div>
                      <div style={{ fontWeight: 600, fontSize: ".85rem" }}>{p.method}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: ".65rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>
                        {p.status === "paid" ? "Paid On" : "Scheduled"}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: ".85rem" }}>{p.paidDate || p.scheduledDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: ".65rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Invoice</div>
                      <a href="#" style={{ fontWeight: 600, fontSize: ".85rem", color: "#6366f1", display: "flex", alignItems: "center", gap: 4 }}>
                        <FileText size={13} /> {p.invoiceId}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Tax Info Note ── */}
      <div style={{ marginTop: 24, padding: 14, borderRadius: 10, background: "var(--subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <AlertCircle size={16} color="var(--muted)" style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.6 }}>
          <strong>Tax Documents:</strong> 1099 forms for 2025 earnings are available in your{" "}
          <a href="/portal/profile" style={{ color: "#6366f1", fontWeight: 600 }}>Profile settings</a>.
          Ensure your W-9 is up to date to avoid payment holds. Contact{" "}
          <a href="/portal/support" style={{ color: "#6366f1", fontWeight: 600 }}>support</a> for payment disputes.
        </div>
      </div>
    </div>
  );
}
