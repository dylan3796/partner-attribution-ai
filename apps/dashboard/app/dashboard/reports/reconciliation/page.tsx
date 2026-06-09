"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import { Download, Filter, Loader2, FileText, Calendar } from "lucide-react";

function quarterRange(year: number, q: number): [number, number] {
  const startMonth = (q - 1) * 3;
  const start = new Date(year, startMonth, 1).getTime();
  const end = new Date(year, startMonth + 3, 1).getTime() - 1;
  return [start, end];
}

function currentQuarter(): { year: number; q: number } {
  const now = new Date();
  return { year: now.getFullYear(), q: Math.floor(now.getMonth() / 3) + 1 };
}

type ReconciliationRow = {
  partnerId: string;
  partnerName: string;
  partnerType: string;
  tier: string;
  dealsAttributed: number;
  totalDealValue: number;
  commissionOwed: number;
  commissionPaid: number;
  commissionPending: number;
  avgRate: number;
};

export default function ReconciliationPage() {
  const partners = useQuery(api.partners.list);
  const allAttributions = useQuery(api.dashboard.getAllAttributions);
  const allPayouts = useQuery(api.payouts.list);

  const cq = currentQuarter();
  const [year, setYear] = useState(cq.year);
  const [quarter, setQuarter] = useState(cq.q);
  const [filterPartner, setFilterPartner] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [rangeStart, rangeEnd] = quarterRange(year, quarter);

  const rows = useMemo<ReconciliationRow[]>(() => {
    if (!partners || !allAttributions || !allPayouts) return [];

    // Filter attributions by date range
    const periodAttrs = (allAttributions as any[]).filter(
      (a: any) => a.calculatedAt >= rangeStart && a.calculatedAt <= rangeEnd
    );

    // Aggregate by partner
    const map = new Map<string, ReconciliationRow>();

    for (const attr of periodAttrs) {
      const partner = partners.find((p: any) => p._id === attr.partnerId);
      if (!partner) continue;

      const existing = map.get(attr.partnerId);
      if (existing) {
        existing.dealsAttributed += 1;
        existing.totalDealValue += attr.amount;
        existing.commissionOwed += attr.commissionAmount;
      } else {
        map.set(attr.partnerId, {
          partnerId: attr.partnerId,
          partnerName: partner.name,
          partnerType: partner.type,
          tier: (partner as any).tier || "bronze",
          dealsAttributed: 1,
          totalDealValue: attr.amount,
          commissionOwed: attr.commissionAmount,
          commissionPaid: 0,
          commissionPending: 0,
          avgRate: partner.commissionRate,
        });
      }
    }

    // Add payout data
    const periodPayouts = (allPayouts as any[]).filter(
      (p: any) => p.createdAt >= rangeStart && p.createdAt <= rangeEnd
    );
    for (const payout of periodPayouts) {
      const row = map.get(payout.partnerId);
      if (!row) continue;
      if (payout.status === "paid") {
        row.commissionPaid += payout.amount;
      } else {
        row.commissionPending += payout.amount;
      }
    }

    // Recalculate pending as owed - paid if no payout records
    for (const row of map.values()) {
      if (row.commissionPaid === 0 && row.commissionPending === 0) {
        row.commissionPending = row.commissionOwed;
      }
    }

    let result = Array.from(map.values());

    // Apply filters
    if (filterPartner !== "all") {
      result = result.filter((r) => r.partnerId === filterPartner);
    }
    if (filterType !== "all") {
      result = result.filter((r) => r.partnerType === filterType);
    }

    return result.sort((a, b) => b.commissionOwed - a.commissionOwed);
  }, [partners, allAttributions, allPayouts, rangeStart, rangeEnd, filterPartner, filterType]);

  // Totals
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => ({
        deals: acc.deals + r.dealsAttributed,
        dealValue: acc.dealValue + r.totalDealValue,
        owed: acc.owed + r.commissionOwed,
        paid: acc.paid + r.commissionPaid,
        pending: acc.pending + r.commissionPending,
      }),
      { deals: 0, dealValue: 0, owed: 0, paid: 0, pending: 0 }
    );
  }, [rows]);

  function exportCSV() {
    const header = "Partner,Type,Tier,Deals,Deal Value,Commission Owed,Commission Paid,Outstanding\n";
    const csvRows = rows.map((r) =>
      `"${r.partnerName}","${r.partnerType}","${r.tier}",${r.dealsAttributed},${r.totalDealValue.toFixed(2)},${r.commissionOwed.toFixed(2)},${r.commissionPaid.toFixed(2)},${r.commissionPending.toFixed(2)}`
    );
    const totalsRow = `"TOTAL","","",${totals.deals},${totals.dealValue.toFixed(2)},${totals.owed.toFixed(2)},${totals.paid.toFixed(2)},${totals.pending.toFixed(2)}`;
    const blob = new Blob([header + csvRows.join("\n") + "\n" + totalsRow], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-Q${quarter}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const isLoading = partners === undefined || allAttributions === undefined || allPayouts === undefined;

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "0.75rem 1rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    borderBottom: "1px solid var(--border)",
  };

  const selectStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    fontSize: "0.85rem",
    fontFamily: "inherit",
    cursor: "pointer",
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            <FileText size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5rem" }} />
            Reconciliation Report
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Q{quarter} {year} · End-of-quarter commission reconciliation by partner
          </p>
        </div>
        <button className="btn" onClick={exportCSV} disabled={rows.length === 0}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <Filter size={16} style={{ color: "var(--muted)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={14} style={{ color: "var(--muted)" }} />
          <select style={selectStyle} value={quarter} onChange={(e) => setQuarter(Number(e.target.value))}>
            <option value={1}>Q1 (Jan–Mar)</option>
            <option value={2}>Q2 (Apr–Jun)</option>
            <option value={3}>Q3 (Jul–Sep)</option>
            <option value={4}>Q4 (Oct–Dec)</option>
          </select>
          <select style={selectStyle} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <select style={selectStyle} value={filterPartner} onChange={(e) => setFilterPartner(e.target.value)}>
          <option value="all">All Partners</option>
          {(partners ?? []).map((p: any) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <select style={selectStyle} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="reseller">Reseller</option>
          <option value="referral">Referral</option>
          <option value="affiliate">Affiliate</option>
          <option value="integration">Integration</option>
        </select>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Partners", value: rows.length.toString() },
          { label: "Deals Attributed", value: totals.deals.toString() },
          { label: "Total Deal Value", value: formatCurrency(totals.dealValue) },
          { label: "Commission Owed", value: formatCurrency(totals.owed), color: "#eab308" },
          { label: "Commission Paid", value: formatCurrency(totals.paid), color: "#22c55e" },
          { label: "Outstanding", value: formatCurrency(totals.pending), color: "#ef4444" },
        ].map((card) => (
          <div key={card.label} className="card" style={{ padding: "1rem 1.25rem" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>{card.label}</p>
            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: card.color || "var(--fg)" }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "auto" }}>
        {isLoading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted)" }}>
            <p>No attribution data for Q{quarter} {year}.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr>
                <th style={thStyle}>Partner</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Tier</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Deals</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Deal Value</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Commission Owed</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Paid</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.partnerId}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{row.partnerName}</td>
                  <td style={tdStyle}>
                    <span className="badge" style={{ textTransform: "capitalize" }}>{row.partnerType}</span>
                  </td>
                  <td style={tdStyle}>
                    <span className="badge" style={{ textTransform: "capitalize" }}>{row.tier}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{row.dealsAttributed}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{formatCurrency(row.totalDealValue)}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: "#eab308" }}>{formatCurrency(row.commissionOwed)}</td>
                  <td style={{ ...tdStyle, textAlign: "right", color: "#22c55e" }}>{formatCurrency(row.commissionPaid)}</td>
                  <td style={{ ...tdStyle, textAlign: "right", color: row.commissionPending > 0 ? "#ef4444" : "var(--muted)" }}>
                    {formatCurrency(row.commissionPending)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--subtle)" }}>
                <td style={{ ...tdStyle, fontWeight: 700 }} colSpan={3}>TOTAL</td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{totals.deals}</td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{formatCurrency(totals.dealValue)}</td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#eab308" }}>{formatCurrency(totals.owed)}</td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#22c55e" }}>{formatCurrency(totals.paid)}</td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: totals.pending > 0 ? "#ef4444" : "var(--muted)" }}>{formatCurrency(totals.pending)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
}
