"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  Users,
  Package,
  Layers,
  Award,
  XCircle,
  ArrowLeft,
  Fingerprint,
  Loader2,
} from "lucide-react";

/* ── Helpers ── */

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function WinRateBar({ winRate, won, lost }: { winRate: number; won: number; lost: number }) {
  const w = Math.round(winRate * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <div style={{ flex: 1, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${w}%`, height: "100%", background: "#22c55e", borderRadius: "4px 0 0 4px", transition: "width .5s ease" }} />
        <div style={{ width: `${100 - w}%`, height: "100%", background: "#ef4444", borderRadius: "0 4px 4px 0", transition: "width .5s ease" }} />
      </div>
      <span style={{ fontSize: ".75rem", color: "var(--muted)", whiteSpace: "nowrap", minWidth: 56, textAlign: "right" }}>
        {won}W / {lost}L
      </span>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = "#6366f1" }: { icon: React.ReactNode; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-.02em" }}>{value}</div>
          {sub && <div className="muted" style={{ fontSize: ".72rem" }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, wonValue, lostValue, icon }: { label: string; wonValue: string; lostValue: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".85rem", fontWeight: 600 }}>
        <span style={{ color: "var(--muted)" }}>{icon}</span>
        {label}
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#22c55e" }}>{wonValue}</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#ef4444" }}>{lostValue}</span>
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    platinum: { bg: "#e5e7eb20", fg: "#d1d5db" },
    gold: { bg: "#fef3c720", fg: "#fbbf24" },
    silver: { bg: "#f3f4f620", fg: "#9ca3af" },
    bronze: { bg: "#fef2f220", fg: "#f87171" },
  };
  const c = colors[tier] || colors.bronze;
  return (
    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 10, fontSize: ".65rem", fontWeight: 700, background: c.bg, color: c.fg, textTransform: "uppercase", letterSpacing: ".04em" }}>
      {tier}
    </span>
  );
}

/* ── Page ── */

export default function WinLossAnalysisPage() {
  const data = useQuery(api.winLossAnalysis.getWinLossAnalysis);

  if (data === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  if (!data || data.summary.totalClosed === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/dashboard/reports" style={{ color: "var(--muted)" }}><ArrowLeft size={18} /></Link>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em" }}>Win/Loss Analysis</h1>
        </div>
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Target size={40} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>No closed deals yet</h3>
          <p className="muted" style={{ maxWidth: 360, margin: "0 auto" }}>
            Win/loss analysis requires closed-won or closed-lost deals. Close some deals and come back to see patterns.
          </p>
          <Link href="/dashboard/deals" className="btn" style={{ marginTop: 16, display: "inline-flex", textDecoration: "none" }}>View Deals →</Link>
        </div>
      </div>
    );
  }

  const { summary, byPartner, byProduct, byDealSize, monthlyTrend, topWonDeals, recentLosses } = data;

  // Find max monthly total for scaling bars
  const maxMonthly = Math.max(...monthlyTrend.map((m) => m.won + m.lost), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/dashboard/reports" style={{ color: "var(--muted)" }}><ArrowLeft size={18} /></Link>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em" }}>Win/Loss Analysis</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".8rem", color: "var(--muted)" }}>
          <Target size={14} />
          {summary.totalClosed} closed deals analyzed
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <StatCard
          icon={<Target size={18} />}
          label="Win Rate"
          value={pct(summary.overallWinRate)}
          sub={`${summary.totalWon} won · ${summary.totalLost} lost`}
          color={summary.overallWinRate >= 0.5 ? "#22c55e" : "#ef4444"}
        />
        <StatCard
          icon={<DollarSign size={18} />}
          label="Avg Won Deal"
          value={formatCurrency(summary.avgWonSize)}
          sub={`vs ${formatCurrency(summary.avgLostSize)} lost`}
          color="#22c55e"
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Avg Days to Win"
          value={`${summary.avgWonVelocity}d`}
          sub={`vs ${summary.avgLostVelocity}d to lose`}
          color="#6366f1"
        />
        <StatCard
          icon={<DollarSign size={18} />}
          label="Revenue Won"
          value={formatCurrency(summary.totalWonRevenue)}
          sub={`${formatCurrency(summary.totalLostRevenue)} lost`}
          color="#22c55e"
        />
      </div>

      {/* Won vs Lost Comparison Card */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontSize: ".95rem", fontWeight: 700, marginBottom: "1rem" }}>Won vs Lost — Key Differences</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
          <div style={{ fontSize: ".7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>Metric</div>
          <div style={{ textAlign: "center", fontSize: ".7rem", fontWeight: 600, color: "#22c55e", textTransform: "uppercase", letterSpacing: ".04em" }}>Won</div>
          <div style={{ textAlign: "center", fontSize: ".7rem", fontWeight: 600, color: "#ef4444", textTransform: "uppercase", letterSpacing: ".04em" }}>Lost</div>
        </div>
        <ComparisonRow label="Total Deals" wonValue={String(summary.totalWon)} lostValue={String(summary.totalLost)} icon={<BarChart3 size={14} />} />
        <ComparisonRow label="Total Revenue" wonValue={formatCurrency(summary.totalWonRevenue)} lostValue={formatCurrency(summary.totalLostRevenue)} icon={<DollarSign size={14} />} />
        <ComparisonRow label="Avg Deal Size" wonValue={formatCurrency(summary.avgWonSize)} lostValue={formatCurrency(summary.avgLostSize)} icon={<Layers size={14} />} />
        <ComparisonRow label="Avg Days to Close" wonValue={`${summary.avgWonVelocity}d`} lostValue={`${summary.avgLostVelocity}d`} icon={<Clock size={14} />} />
        <ComparisonRow label="Avg Touchpoints" wonValue={String(summary.avgWonTouchpoints)} lostValue={String(summary.avgLostTouchpoints)} icon={<Fingerprint size={14} />} />
      </div>

      {/* Two-column: Monthly Trend + Deal Size */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Monthly Win/Loss Trend */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: ".95rem", fontWeight: 700, marginBottom: "1rem" }}>Monthly Trend (6 Months)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {monthlyTrend.map((m) => (
              <div key={m.month} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: ".75rem", color: "var(--muted)", minWidth: 50, fontWeight: 600 }}>{m.month}</span>
                <div style={{ flex: 1, display: "flex", height: 20, borderRadius: 4, overflow: "hidden", background: "var(--border)" }}>
                  {m.won > 0 && (
                    <div style={{ width: `${(m.won / maxMonthly) * 100}%`, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {m.won > 0 && <span style={{ fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>{m.won}</span>}
                    </div>
                  )}
                  {m.lost > 0 && (
                    <div style={{ width: `${(m.lost / maxMonthly) * 100}%`, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {m.lost > 0 && <span style={{ fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>{m.lost}</span>}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: ".7rem", fontWeight: 700, color: m.winRate >= 0.5 ? "#22c55e" : "#ef4444", minWidth: 32, textAlign: "right" }}>
                  {m.won + m.lost > 0 ? pct(m.winRate) : "—"}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".7rem", color: "var(--muted)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "#22c55e" }} /> Won
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".7rem", color: "var(--muted)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "#ef4444" }} /> Lost
            </div>
          </div>
        </div>

        {/* Win Rate by Deal Size */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: ".95rem", fontWeight: 700, marginBottom: "1rem" }}>Win Rate by Deal Size</h3>
          {byDealSize.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: "2rem" }}>No data yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {byDealSize.map((b) => (
                <div key={b.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{b.name}</span>
                    <span style={{ fontSize: ".8rem", fontWeight: 700, color: b.winRate >= 0.5 ? "#22c55e" : "#ef4444" }}>{pct(b.winRate)}</span>
                  </div>
                  <WinRateBar winRate={b.winRate} won={b.won} lost={b.lost} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Win Rate by Partner */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
          <Users size={16} style={{ color: "var(--muted)" }} />
          <h3 style={{ fontSize: ".95rem", fontWeight: 700 }}>Win Rate by Partner</h3>
        </div>
        {byPartner.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "1.5rem" }}>No partner-attributed closed deals yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {byPartner.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 80px 1fr 60px", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: ".85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                  <TierBadge tier={p.tier} />
                </div>
                <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>{formatCurrency(p.wonRevenue)}</span>
                <WinRateBar winRate={p.winRate} won={p.won} lost={p.lost} />
                <span style={{ fontSize: ".85rem", fontWeight: 700, textAlign: "right", color: p.winRate >= 0.5 ? "#22c55e" : "#ef4444" }}>{pct(p.winRate)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Win Rate by Product */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
          <Package size={16} style={{ color: "var(--muted)" }} />
          <h3 style={{ fontSize: ".95rem", fontWeight: 700 }}>Win Rate by Product</h3>
        </div>
        {byProduct.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "1.5rem" }}>No product-tagged closed deals yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {byProduct.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 80px 1fr 60px", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: ".85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>{formatCurrency(p.wonRevenue)}</span>
                <WinRateBar winRate={p.winRate} won={p.won} lost={p.lost} />
                <span style={{ fontSize: ".85rem", fontWeight: 700, textAlign: "right", color: p.winRate >= 0.5 ? "#22c55e" : "#ef4444" }}>{pct(p.winRate)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two-column: Top Wins + Recent Losses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Top Won Deals */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <Award size={16} style={{ color: "#22c55e" }} />
            <h3 style={{ fontSize: ".95rem", fontWeight: 700 }}>Top Won Deals</h3>
          </div>
          {topWonDeals.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: "1rem" }}>No won deals yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {topWonDeals.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: ".85rem", fontWeight: 600 }}>{d.name}</div>
                    <div className="muted" style={{ fontSize: ".72rem" }}>
                      {d.partner} · {d.product}{d.daysToClose ? ` · ${d.daysToClose}d` : ""}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: ".9rem", color: "#22c55e" }}>{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Losses */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <XCircle size={16} style={{ color: "#ef4444" }} />
            <h3 style={{ fontSize: ".95rem", fontWeight: 700 }}>Recent Losses</h3>
          </div>
          {recentLosses.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: "1rem" }}>No lost deals — impressive!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentLosses.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: ".85rem", fontWeight: 600 }}>{d.name}</div>
                    <div className="muted" style={{ fontSize: ".72rem" }}>
                      {d.partner} · {d.product} · {new Date(d.closedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: ".9rem", color: "#ef4444" }}>{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insight Box */}
      <div className="card" style={{ padding: "1.25rem", background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.15)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <TrendingUp size={18} style={{ color: "#818cf8", marginTop: 2, flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 6, color: "#818cf8" }}>Key Insights</h4>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8, margin: 0, paddingLeft: 16 }}>
              {summary.avgWonSize > summary.avgLostSize * 1.2 && (
                <li>Won deals are <strong style={{ color: "#fff" }}>{Math.round((summary.avgWonSize / summary.avgLostSize - 1) * 100)}% larger</strong> than lost deals on average — larger deals may have stronger partner engagement.</li>
              )}
              {summary.avgWonSize < summary.avgLostSize * 0.8 && (
                <li>Lost deals are larger on average (<strong style={{ color: "#ef4444" }}>{formatCurrency(summary.avgLostSize)}</strong> vs {formatCurrency(summary.avgWonSize)}) — consider pricing strategy for enterprise deals.</li>
              )}
              {summary.avgWonVelocity > 0 && summary.avgLostVelocity > 0 && summary.avgWonVelocity < summary.avgLostVelocity && (
                <li>Winning deals close <strong style={{ color: "#fff" }}>{summary.avgLostVelocity - summary.avgWonVelocity} days faster</strong> than losses — velocity correlates with success.</li>
              )}
              {summary.avgWonTouchpoints > summary.avgLostTouchpoints && (
                <li>Won deals average <strong style={{ color: "#fff" }}>{summary.avgWonTouchpoints} touchpoints</strong> vs {summary.avgLostTouchpoints} for losses — more partner engagement drives wins.</li>
              )}
              {summary.overallWinRate >= 0.6 && (
                <li>Your <strong style={{ color: "#22c55e" }}>{pct(summary.overallWinRate)} win rate</strong> is strong. Focus on replicating winning patterns across more deals.</li>
              )}
              {summary.overallWinRate < 0.4 && (
                <li>Win rate is at <strong style={{ color: "#ef4444" }}>{pct(summary.overallWinRate)}</strong> — review lost deals for common patterns and consider partner enablement improvements.</li>
              )}
              {byPartner.length > 0 && byPartner[0].winRate > summary.overallWinRate + 0.1 && (
                <li><strong style={{ color: "#fff" }}>{byPartner[0].name}</strong> outperforms at {pct(byPartner[0].winRate)} win rate — study what makes their deals successful.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
