"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { Sparkles, TrendingUp, Award, ArrowUpRight, Users, Brain, Loader2, ChevronRight } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

function ScoreBadge({ score }: { score: number }) {
  const label =
    score >= 0.7 ? "Highly Recommended" : score >= 0.4 ? "Recommended" : "Rising";
  const bg =
    score >= 0.7 ? "#dcfce7" : score >= 0.4 ? "#dbeafe" : "#fef9c3";
  const color =
    score >= 0.7 ? "#166534" : score >= 0.4 ? "#1e40af" : "#854d0e";
  const border =
    score >= 0.7 ? "#22c55e" : score >= 0.4 ? "#3b82f6" : "#eab308";

  return (
    <span
      style={{
        fontSize: ".7rem",
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 6,
        background: bg,
        color,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    platinum: { bg: "#f0f0ff", color: "#4338ca" },
    gold: { bg: "#fef9c3", color: "#854d0e" },
    silver: { bg: "#f1f5f9", color: "#475569" },
    bronze: { bg: "#fed7aa", color: "#9a3412" },
  };
  const c = colors[tier] ?? colors.bronze;
  return (
    <span
      style={{
        fontSize: ".65rem",
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 4,
        background: c.bg,
        color: c.color,
        textTransform: "capitalize",
      }}
    >
      {tier}
    </span>
  );
}

function DealRecommendations({ dealId, dealName, dealAmount }: { dealId: Id<"deals">; dealName: string; dealAmount: number }) {
  const recs = useQuery(api.recommendations.getForDeal, { dealId });

  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: ".9rem" }}>{dealName}</p>
          <p className="muted" style={{ fontSize: ".8rem" }}>{formatCurrency(dealAmount)}</p>
        </div>
        <Link
          href={`/dashboard/deals/${dealId}`}
          style={{ fontSize: ".75rem", color: "#6366f1", fontWeight: 500, textDecoration: "none" }}
        >
          View deal →
        </Link>
      </div>
      {recs === undefined ? (
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".5rem 0" }}>
          <Loader2 size={14} style={{ animation: "spin 1s linear infinite", color: "var(--muted)" }} />
          <span className="muted" style={{ fontSize: ".8rem" }}>Analyzing similar deals…</span>
        </div>
      ) : recs.length === 0 ? (
        <p className="muted" style={{ fontSize: ".8rem" }}>No partner matches found for this deal size yet.</p>
      ) : (
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          {recs.map((r) => (
            <Link
              key={r.partnerId}
              href={`/dashboard/partners/${r.partnerId}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--subtle)",
                textDecoration: "none",
                transition: "border-color .15s",
                minWidth: 180,
              }}
            >
              <div
                className="avatar"
                style={{
                  width: 32,
                  height: 32,
                  fontSize: ".7rem",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                }}
              >
                {r.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: ".8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.name}
                </p>
                <p className="muted" style={{ fontSize: ".7rem" }}>
                  {r.wins} similar win{r.wins !== 1 ? "s" : ""} · {formatCurrencyCompact(r.revenue)}
                </p>
              </div>
              <TierBadge tier={r.tier} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AskCovant() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Based on our partner program data, which partners would you recommend for the following opportunity? Consider partner tier, win rate, deal size experience, and territory. Here's the deal:\n\n${input}`,
        }),
      });
      const data = await res.json();
      setResponse(data.response ?? data.error ?? "No response");
    } catch {
      setResponse("Failed to get recommendation. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div
      className="card"
      style={{
        padding: "1.5rem",
        background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)",
        border: "1px solid #c7d2fe",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem" }}>
        <Brain size={20} color="#6366f1" />
        <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>Ask Covant AI</h3>
      </div>
      <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
        Describe a deal you&apos;re working on and Covant will recommend the best partner match.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. $85K enterprise SaaS deal in healthcare, 6-month sales cycle, needs technical integration support..."
        style={{
          width: "100%",
          minHeight: 80,
          padding: ".75rem",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--bg)",
          fontFamily: "inherit",
          fontSize: ".85rem",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: ".75rem" }}>
        <button
          onClick={handleAsk}
          disabled={loading || !input.trim()}
          className="btn"
          style={{
            fontSize: ".85rem",
            padding: ".5rem 1.25rem",
            background: loading ? "#a5b4fc" : "#6366f1",
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              Thinking…
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Get Recommendation
            </>
          )}
        </button>
      </div>
      {response && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: 8,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            fontSize: ".85rem",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  const topRecommended = useQuery(api.recommendations.getTopRecommended);
  const openDeals = useQuery(api.recommendations.getOpenDeals);

  const hasData = topRecommended && topRecommended.length > 0;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Sparkles size={24} color="#6366f1" />
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
              Partner Recommendations
            </h1>
          </div>
          <p className="muted" style={{ marginTop: ".25rem" }}>
            Powered by your historical deal data — Covant analyzes win patterns to recommend the best partners.
          </p>
        </div>
      </div>

      {!hasData && topRecommended !== undefined ? (
        /* Empty state */
        <div
          className="card"
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Users size={48} color="var(--muted)" />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Not enough historical data yet</h3>
          <p className="muted" style={{ maxWidth: 400, fontSize: ".9rem" }}>
            Add more deals and track partner attributions to unlock AI-powered recommendations.
          </p>
          <Link href="/dashboard/deals" className="btn" style={{ marginTop: ".5rem" }}>
            Go to Deals →
          </Link>
        </div>
      ) : (
        <>
          {/* ── Open Deals: Per-deal recommendations ── */}
          {openDeals && openDeals.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
                <Award size={18} color="#f59e0b" />
                Best Partners for Your Open Deals
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {openDeals.slice(0, 8).map((deal) => (
                  <DealRecommendations
                    key={deal._id}
                    dealId={deal._id}
                    dealName={deal.name}
                    dealAmount={deal.amount}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Top Performing Partners ── */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
              <TrendingUp size={18} color="#10b981" />
              Top Performing Partners
            </h2>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                  padding: ".75rem 1.25rem",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--subtle)",
                  fontSize: ".75rem",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                <span>Partner</span>
                <span style={{ textAlign: "right" }}>Win Rate</span>
                <span style={{ textAlign: "right" }}>Deals Won</span>
                <span style={{ textAlign: "right" }}>Revenue</span>
                <span style={{ textAlign: "right" }}>Pipeline</span>
                <span style={{ textAlign: "right" }}>Score</span>
              </div>
              {topRecommended === undefined ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--muted)" }} />
                </div>
              ) : (
                topRecommended.map((r, i) => (
                  <Link
                    key={r.partner._id}
                    href={`/dashboard/partners/${r.partner._id}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                      padding: ".75rem 1.25rem",
                      borderBottom: i < topRecommended.length - 1 ? "1px solid var(--border)" : "none",
                      textDecoration: "none",
                      alignItems: "center",
                      transition: "background .15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                      <div
                        className="avatar"
                        style={{
                          width: 32,
                          height: 32,
                          fontSize: ".7rem",
                        }}
                      >
                        {r.partner.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{r.partner.name}</p>
                        <div style={{ display: "flex", gap: ".4rem", alignItems: "center", marginTop: 2 }}>
                          <TierBadge tier={r.partner.tier} />
                          <span className="muted" style={{ fontSize: ".7rem" }}>{r.partner.type}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ textAlign: "right", fontWeight: 600, fontSize: ".85rem" }}>
                      {Math.round(r.winRate * 100)}%
                    </span>
                    <span style={{ textAlign: "right", fontSize: ".85rem" }}>{r.wonCount}</span>
                    <span style={{ textAlign: "right", fontWeight: 600, fontSize: ".85rem" }}>
                      {formatCurrencyCompact(r.totalRevenue)}
                    </span>
                    <span style={{ textAlign: "right", fontSize: ".85rem", color: "var(--muted)" }}>
                      {formatCurrencyCompact(r.pipeline)}
                    </span>
                    <span style={{ textAlign: "right" }}>
                      <ScoreBadge score={r.recommendationScore} />
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ── Ask Covant AI ── */}
          <AskCovant />
        </>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
