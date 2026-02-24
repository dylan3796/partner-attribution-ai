"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { Sparkles, TrendingUp, Award, Users, Brain, Loader2, X } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";

/* ── Types ── */
type RecommendedPartner = {
  partner: { _id: Id<"partners">; name: string; tier: string; type: string; email: string; commissionRate: number };
  winRate: number;
  totalRevenue: number;
  pipeline: number;
  dealCount: number;
  wonCount: number;
  recommendationScore: number;
};

/* ── Helpers ── */
function getReasoningTags(p: RecommendedPartner): string[] {
  const tags: string[] = [];
  if (p.wonCount > 0) {
    tags.push(`${p.wonCount} deal${p.wonCount !== 1 ? "s" : ""} won · ${formatCurrencyCompact(p.totalRevenue)} revenue`);
  }
  if (p.winRate >= 0.5 && p.dealCount >= 2) {
    tags.push(`${Math.round(p.winRate * 100)}% win rate across ${p.dealCount} deals`);
  }
  const tier = p.partner.tier?.toLowerCase();
  if (tier === "platinum" || tier === "gold") {
    tags.push(`${tier.charAt(0).toUpperCase() + tier.slice(1)} tier partner`);
  }
  if (p.pipeline > 0) {
    tags.push(`${formatCurrencyCompact(p.pipeline)} active pipeline`);
  }
  return tags.slice(0, 3);
}

function ScoreBadge({ score }: { score: number }) {
  const label = score >= 0.7 ? "Highly Recommended" : score >= 0.4 ? "Recommended" : "Rising";
  const bg = score >= 0.7 ? "#dcfce7" : score >= 0.4 ? "#dbeafe" : "#fef9c3";
  const color = score >= 0.7 ? "#166534" : score >= 0.4 ? "#1e40af" : "#854d0e";
  const border = score >= 0.7 ? "#22c55e" : score >= 0.4 ? "#3b82f6" : "#eab308";
  return (
    <span style={{ fontSize: ".7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: bg, color, border: `1px solid ${border}`, whiteSpace: "nowrap" }}>
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
    <span style={{ fontSize: ".65rem", fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: c.bg, color: c.color, textTransform: "capitalize" }}>
      {tier}
    </span>
  );
}

/* ── Deal Recommendations ── */
function DealRecommendations({ dealId, dealName, dealAmount }: { dealId: Id<"deals">; dealName: string; dealAmount: number }) {
  const recs = useQuery(api.recommendations.getForDeal, { dealId });
  return (
    <div style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: ".9rem" }}>{dealName}</p>
          <p className="muted" style={{ fontSize: ".8rem" }}>{formatCurrency(dealAmount)}</p>
        </div>
        <Link href={`/dashboard/deals/${dealId}`} style={{ fontSize: ".75rem", color: "#6366f1", fontWeight: 500, textDecoration: "none" }}>
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
                display: "flex", alignItems: "center", gap: ".5rem", padding: "8px 12px",
                borderRadius: 8, border: "1px solid var(--border)", background: "var(--subtle)",
                textDecoration: "none", transition: "border-color .15s", minWidth: 180,
              }}
            >
              <div className="avatar" style={{ width: 32, height: 32, fontSize: ".7rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
                {r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: ".8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</p>
                <p className="muted" style={{ fontSize: ".7rem" }}>
                  {r.wins} similar win{r.wins !== 1 ? "s" : ""} · {formatCurrencyCompact(r.revenue)} · {r.tier} tier
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

/* ── Structured Deal Context Form ── */
function RefineDealForm({ topPartners, openDeals }: { topPartners: RecommendedPartner[]; openDeals: Doc<"deals">[] }) {
  const [selectedDealId, setSelectedDealId] = useState<string>("");
  const [otherContext, setOtherContext] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedDeal = useMemo(
    () => openDeals.find((d) => d._id === selectedDealId) ?? null,
    [openDeals, selectedDealId]
  );

  function handleDealSelect(id: string) {
    setSelectedDealId(id);
  }

  function clearSelectedDeal() {
    setSelectedDealId("");
  }

  const hasInput = otherContext || selectedDealId;

  async function handleRefine() {
    if (!hasInput) return;
    setLoading(true);
    setResponse("");

    const partnerData = topPartners.slice(0, 5).map((p) => (
      `${p.partner.name} (${p.partner.tier} tier, ${p.partner.type}): ${Math.round(p.winRate * 100)}% win rate, ${p.wonCount} deals won, ${formatCurrencyCompact(p.totalRevenue)} revenue, ${formatCurrencyCompact(p.pipeline)} pipeline, score ${(p.recommendationScore * 100).toFixed(0)}`
    )).join("\n");

    const selectedDealContext = selectedDeal
      ? `Deal: ${selectedDeal.name}, Amount: $${selectedDeal.amount}, Stage: open`
      : "";

    const dealContext = [
      selectedDealContext,
      otherContext && `Considerations: ${otherContext}`,
    ].filter(Boolean).join("\n");

    const prompt = `Given the following partner performance data:\n${partnerData}\n\nAnd this deal context:\n${dealContext}\n\nWhich 3 partners would you recommend and why? Be specific about why each partner fits this deal. Consider tier, win rate, deal volume, and revenue track record.`;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt }),
      });
      const data = await res.json();
      setResponse(data.answer ?? data.response ?? data.error ?? "No response");
    } catch {
      setResponse("Failed to get recommendation. Please try again.");
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: ".6rem .75rem", borderRadius: 8,
    border: "1px solid var(--border)", background: "var(--bg)",
    fontFamily: "inherit", fontSize: ".85rem", boxSizing: "border-box",
    color: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", marginBottom: ".3rem", display: "block",
  };

  return (
    <div className="card" style={{ padding: "1.5rem", background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)", border: "1px solid #c7d2fe" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
        <Brain size={20} color="#6366f1" />
        <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>Refine for a Specific Deal</h3>
      </div>
      <p className="muted" style={{ fontSize: ".8rem", marginBottom: "1.25rem" }}>
        Add deal context to get tailored partner recommendations from Covant AI.
      </p>

      {/* Deal Selector */}
      {openDeals.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Select a deal from your pipeline (optional)</label>
          {selectedDeal ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              padding: ".4rem .75rem", borderRadius: 8, background: "#eef2ff",
              border: "1px solid #c7d2fe", fontSize: ".85rem", fontWeight: 600, color: "#4338ca",
            }}>
              {selectedDeal.name} — {formatCurrency(selectedDeal.amount)}
              <button
                onClick={clearSelectedDeal}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center", color: "#6366f1",
                }}
                aria-label="Clear selected deal"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <select
              value={selectedDealId}
              onChange={(e) => handleDealSelect(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select a deal…</option>
              {openDeals.map((deal) => (
                <option key={deal._id} value={deal._id}>
                  {deal.name} — {formatCurrency(deal.amount)}
                </option>
              ))}
            </select>
          )}
          {!selectedDeal && (
            <p className="muted" style={{ fontSize: ".7rem", marginTop: ".3rem" }}>
              Or describe your deal manually below
            </p>
          )}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Any considerations?</label>
        <textarea value={otherContext} onChange={(e) => setOtherContext(e.target.value)} placeholder="e.g. customer prefers East Coast partners, healthcare vertical, needs technical integration support…" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleRefine}
          disabled={loading || !hasInput}
          className="btn"
          style={{
            fontSize: ".85rem", padding: ".5rem 1.25rem",
            background: loading ? "#a5b4fc" : "#6366f1",
            display: "flex", alignItems: "center", gap: ".4rem",
          }}
        >
          {loading ? (
            <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analyzing…</>
          ) : (
            <><Sparkles size={14} /> Refine Recommendations</>
          )}
        </button>
      </div>

      {response && (
        <div style={{
          marginTop: "1.25rem", padding: "1.25rem", borderRadius: 10,
          background: "var(--bg)", border: "1px solid var(--border)",
          borderLeft: "3px solid #6366f1",
        }}>
          <p style={{ fontSize: ".7rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".5rem" }}>
            AI Analysis
          </p>
          <div style={{ fontSize: ".85rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {response}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
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
        <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <Users size={48} color="var(--muted)" />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Not enough historical data yet</h3>
          <p className="muted" style={{ maxWidth: 400, fontSize: ".9rem" }}>
            Add more deals and track partner attributions to unlock AI-powered recommendations.
          </p>
          <Link href="/dashboard/deals" className="btn" style={{ marginTop: ".5rem" }}>Go to Deals →</Link>
        </div>
      ) : (
        <>
          {/* ── Section 1: Top Performing Partners with Reasoning ── */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
              <TrendingUp size={18} color="#10b981" />
              Recommended Partners
            </h2>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
                padding: ".75rem 1.25rem", borderBottom: "1px solid var(--border)",
                background: "var(--subtle)", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)",
              }}>
                <span>Partner</span>
                <span style={{ textAlign: "right" }}>Win Rate</span>
                <span style={{ textAlign: "right" }}>Deals Won</span>
                <span style={{ textAlign: "right" }}>Revenue</span>
                <span style={{ textAlign: "right" }}>Score</span>
              </div>
              {topRecommended === undefined ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--muted)" }} />
                </div>
              ) : (
                topRecommended.map((r, i) => {
                  const reasons = getReasoningTags(r as RecommendedPartner);
                  return (
                    <Link
                      key={r.partner._id}
                      href={`/dashboard/partners/${r.partner._id}`}
                      style={{
                        display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
                        padding: ".75rem 1.25rem",
                        borderBottom: i < topRecommended.length - 1 ? "1px solid var(--border)" : "none",
                        textDecoration: "none", alignItems: "center", transition: "background .15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: ".7rem" }}>
                          {r.partner.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                            <p style={{ fontWeight: 600, fontSize: ".85rem" }}>{r.partner.name}</p>
                            <TierBadge tier={r.partner.tier} />
                          </div>
                          {reasons.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem", marginTop: 3 }}>
                              {reasons.map((tag, ti) => (
                                <span key={ti} style={{
                                  fontSize: ".65rem", color: "#6366f1", background: "#eef2ff",
                                  padding: "1px 6px", borderRadius: 4, fontWeight: 500,
                                }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <span style={{ textAlign: "right", fontWeight: 600, fontSize: ".85rem" }}>
                        {Math.round(r.winRate * 100)}%
                      </span>
                      <span style={{ textAlign: "right", fontSize: ".85rem" }}>{r.wonCount}</span>
                      <span style={{ textAlign: "right", fontWeight: 600, fontSize: ".85rem" }}>
                        {formatCurrencyCompact(r.totalRevenue)}
                      </span>
                      <span style={{ textAlign: "right" }}>
                        <ScoreBadge score={r.recommendationScore} />
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Section 2: Refine for a Specific Deal ── */}
          <div style={{ marginBottom: "2rem" }}>
            <RefineDealForm topPartners={(topRecommended ?? []) as RecommendedPartner[]} openDeals={openDeals ?? []} />
          </div>

          {/* ── Section 3: Open Deals — Partner Suggestions ── */}
          {openDeals && openDeals.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
                <Award size={18} color="#f59e0b" />
                Your Open Deals — Partner Suggestions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {openDeals.slice(0, 8).map((deal) => (
                  <DealRecommendations key={deal._id} dealId={deal._id} dealName={deal.name} dealAmount={deal.amount} />
                ))}
              </div>
            </div>
          )}
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
