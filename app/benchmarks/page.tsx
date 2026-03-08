"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, TrendingUp, DollarSign, Users, Target,
  BarChart3, Clock, Zap, Award, ChevronDown, ChevronUp,
  ArrowRight, Percent, Activity, Handshake,
} from "lucide-react";

/* ── Benchmark Data ────────────────────────────────── */

type Benchmark = {
  metric: string;
  description: string;
  low: number;
  median: number;
  top: number;
  unit: string;
  higherIsBetter: boolean;
  insight: string;
};

type Category = {
  id: string;
  title: string;
  icon: typeof TrendingUp;
  color: string;
  benchmarks: Benchmark[];
};

const CATEGORIES: Category[] = [
  {
    id: "attribution",
    title: "Attribution & Tracking",
    icon: Target,
    color: "#818cf8",
    benchmarks: [
      {
        metric: "Partner-Sourced Revenue",
        description: "% of total revenue attributed to partner-sourced deals",
        low: 8, median: 22, top: 45,
        unit: "%", higherIsBetter: true,
        insight: "Top programs attribute nearly half their revenue to partners. If you're below 15%, your attribution model may be under-counting partner influence.",
      },
      {
        metric: "Attribution Dispute Rate",
        description: "% of partner-attributed deals that face disputes",
        low: 25, median: 12, top: 3,
        unit: "%", higherIsBetter: false,
        insight: "High dispute rates signal a broken attribution model. Deal registration protection reduces disputes by 60–80% vs. first/last-touch.",
      },
      {
        metric: "Avg Touchpoints per Closed Deal",
        description: "Number of partner interactions before a deal closes",
        low: 1.5, median: 4.2, top: 8.5,
        unit: "", higherIsBetter: true,
        insight: "More touchpoints = deeper partner engagement. Top programs track technical enablement, co-sell, and nurture touches, not just referrals.",
      },
      {
        metric: "Time to Attribution",
        description: "Days from deal close to finalized partner credit",
        low: 30, median: 14, top: 2,
        unit: "days", higherIsBetter: false,
        insight: "Manual attribution takes weeks. Automated systems resolve credit within 48 hours. Partner trust erodes with every day of uncertainty.",
      },
    ],
  },
  {
    id: "commissions",
    title: "Commissions & Payouts",
    icon: DollarSign,
    color: "#34d399",
    benchmarks: [
      {
        metric: "Average Commission Rate",
        description: "Blended commission rate across all partner types",
        low: 5, median: 15, top: 30,
        unit: "%", higherIsBetter: false,
        insight: "Commission rates vary wildly by program type. Referral programs average 10–15%, resellers 15–25%, affiliates 20–35%. Higher isn't always better — ROI matters more.",
      },
      {
        metric: "Payout Cycle Time",
        description: "Days from deal close to partner payout",
        low: 90, median: 45, top: 14,
        unit: "days", higherIsBetter: false,
        insight: "Fast payouts drive loyalty. Top programs pay within 2 weeks of deal close. If your cycle exceeds 60 days, expect partner churn.",
      },
      {
        metric: "Commission-to-Revenue Ratio",
        description: "Total commissions paid as % of partner-attributed revenue",
        low: 4, median: 12, top: 22,
        unit: "%", higherIsBetter: false,
        insight: "This is your partner program cost basis. Below 8% may signal under-investment. Above 25% may indicate margin compression. Sweet spot is 10–18%.",
      },
      {
        metric: "Payout Accuracy",
        description: "% of payouts that require no manual correction",
        low: 72, median: 89, top: 99,
        unit: "%", higherIsBetter: true,
        insight: "Every payout correction costs 2–4 hours of ops time and damages partner trust. Rule-based automation eliminates 95%+ of calculation errors.",
      },
    ],
  },
  {
    id: "engagement",
    title: "Partner Engagement",
    icon: Activity,
    color: "#f59e0b",
    benchmarks: [
      {
        metric: "Active Partner Rate",
        description: "% of recruited partners who generate pipeline or revenue",
        low: 15, median: 35, top: 65,
        unit: "%", higherIsBetter: true,
        insight: "Most programs have 60–85% inactive partners. Top programs focus on enablement and tier incentives rather than recruiting more partners.",
      },
      {
        metric: "Portal Login Frequency",
        description: "Average partner portal logins per month",
        low: 0.5, median: 3, top: 12,
        unit: "/mo", higherIsBetter: true,
        insight: "If partners don't log in, they don't register deals. Top portals are 'sticky' because they surface commissions, leaderboards, and enablement content.",
      },
      {
        metric: "Deal Registration Rate",
        description: "% of partner deals submitted through deal registration",
        low: 20, median: 55, top: 90,
        unit: "%", higherIsBetter: true,
        insight: "Low deal reg means partners are going around the system — usually because the process is too slow. Best programs approve/reject within 24 hours.",
      },
      {
        metric: "Partner NPS",
        description: "Net promoter score from partner satisfaction surveys",
        low: 10, median: 35, top: 72,
        unit: "", higherIsBetter: true,
        insight: "Partner NPS below 20 predicts partner churn. The #1 driver of partner satisfaction isn't commission rates — it's transparency and speed of communication.",
      },
    ],
  },
  {
    id: "revenue",
    title: "Revenue & Performance",
    icon: TrendingUp,
    color: "#f87171",
    benchmarks: [
      {
        metric: "Partner Win Rate",
        description: "Close rate on partner-sourced or influenced deals",
        low: 15, median: 32, top: 55,
        unit: "%", higherIsBetter: true,
        insight: "Partner deals close at 2–3x the rate of direct sales. If your partner win rate is below direct, partners may be registering deals after the fact.",
      },
      {
        metric: "Average Partner Deal Size",
        description: "Mean deal size for partner-attributed revenue (as multiple of direct)",
        low: 0.8, median: 1.4, top: 2.5,
        unit: "x", higherIsBetter: true,
        insight: "Partners typically upsell and cross-sell better than direct reps. If partner deals are smaller than direct, your partners may lack product knowledge.",
      },
      {
        metric: "Revenue per Partner",
        description: "Annual revenue generated per active partner",
        low: 25, median: 120, top: 500,
        unit: "K", higherIsBetter: true,
        insight: "Revenue per partner (RPP) is the single best health metric. Low RPP + many partners = unfocused program. High RPP + fewer partners = scalable model.",
      },
      {
        metric: "Partner Sales Cycle",
        description: "Average days from opportunity to close for partner deals",
        low: 120, median: 75, top: 35,
        unit: "days", higherIsBetter: false,
        insight: "Partner deals typically close 20–40% faster than direct. If they're slower, check if deal registration is creating friction instead of removing it.",
      },
    ],
  },
];

/* ── Comparison Tool ─────────────────────────────── */

type UserMetric = {
  categoryId: string;
  metricIndex: number;
  value: number;
};

function getPercentile(value: number, b: Benchmark): number {
  if (b.higherIsBetter) {
    if (value <= b.low) return 10;
    if (value >= b.top) return 95;
    if (value <= b.median) return 10 + ((value - b.low) / (b.median - b.low)) * 40;
    return 50 + ((value - b.median) / (b.top - b.median)) * 45;
  } else {
    if (value >= b.low) return 10;
    if (value <= b.top) return 95;
    if (value >= b.median) return 10 + ((b.low - value) / (b.low - b.median)) * 40;
    return 50 + ((b.median - value) / (b.median - b.top)) * 45;
  }
}

function getGrade(percentile: number): { label: string; color: string; bg: string } {
  if (percentile >= 80) return { label: "Top Quartile", color: "#22c55e", bg: "#22c55e18" };
  if (percentile >= 50) return { label: "Above Average", color: "#3b82f6", bg: "#3b82f618" };
  if (percentile >= 30) return { label: "Below Average", color: "#f59e0b", bg: "#f59e0b18" };
  return { label: "Needs Attention", color: "#ef4444", bg: "#ef444418" };
}

/* ── Page Component ────────────────────────────────── */

export default function BenchmarksPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("attribution");
  const [compareMode, setCompareMode] = useState(false);
  const [userMetrics, setUserMetrics] = useState<UserMetric[]>([]);

  function getUserValue(catId: string, idx: number): string {
    const m = userMetrics.find((u) => u.categoryId === catId && u.metricIndex === idx);
    return m ? String(m.value) : "";
  }

  function setUserValue(catId: string, idx: number, val: string) {
    const num = parseFloat(val);
    if (val === "" || isNaN(num)) {
      setUserMetrics((prev) => prev.filter((u) => !(u.categoryId === catId && u.metricIndex === idx)));
      return;
    }
    setUserMetrics((prev) => {
      const exists = prev.find((u) => u.categoryId === catId && u.metricIndex === idx);
      if (exists) return prev.map((u) => (u.categoryId === catId && u.metricIndex === idx ? { ...u, value: num } : u));
      return [...prev, { categoryId: catId, metricIndex: idx, value: num }];
    });
  }

  const totalBenchmarks = CATEGORIES.reduce((s, c) => s + c.benchmarks.length, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      {/* Back */}
      <Link href="/resources" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: ".85rem", textDecoration: "none", marginBottom: 16 }}>
        <ArrowLeft size={14} /> Resources
      </Link>

      {/* Hero */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ padding: 8, background: "#818cf818", borderRadius: 10 }}>
            <BarChart3 size={22} color="#818cf8" />
          </div>
          <span style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#818cf8" }}>Industry Benchmarks</span>
        </div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12 }}>
          Partner Program Benchmarks 2026
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: 680, fontSize: ".95rem" }}>
          {totalBenchmarks} key metrics across attribution, commissions, engagement, and revenue — with bottom-quartile, median, and top-quartile ranges from programs managing 10 to 500+ partners.
        </p>
        <p style={{ color: "rgba(255,255,255,.35)", fontSize: ".8rem", marginTop: 8 }}>
          Based on aggregate patterns across partner programs. Updated March 2026.
        </p>
      </div>

      {/* Compare toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem", padding: "12px 16px", background: compareMode ? "#818cf812" : "var(--card)", border: `1px solid ${compareMode ? "#818cf840" : "var(--border)"}`, borderRadius: 10 }}>
        <button
          onClick={() => setCompareMode(!compareMode)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
            background: compareMode ? "#818cf8" : "transparent", color: compareMode ? "#fff" : "var(--muted)",
            border: compareMode ? "none" : "1px solid var(--border)", borderRadius: 8,
            cursor: "pointer", fontSize: ".85rem", fontWeight: 600,
          }}
        >
          <Percent size={14} /> {compareMode ? "Comparing Your Program" : "Compare Your Program"}
        </button>
        <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>
          {compareMode ? "Enter your metrics below to see how you stack up" : "Click to enter your own metrics and see your percentile ranking"}
        </span>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isExpanded = expandedCategory === cat.id;

          return (
            <div key={cat.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "16px 20px",
                  background: "transparent", border: "none", cursor: "pointer", color: "#fff", textAlign: "left",
                }}
              >
                <div style={{ padding: 6, background: `${cat.color}18`, borderRadius: 8 }}>
                  <Icon size={18} color={cat.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: ".95rem" }}>{cat.title}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{cat.benchmarks.length} metrics</div>
                </div>
                {isExpanded ? <ChevronUp size={16} color="var(--muted)" /> : <ChevronDown size={16} color="var(--muted)" />}
              </button>

              {/* Benchmarks Grid */}
              {isExpanded && (
                <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {cat.benchmarks.map((b, bi) => {
                    const userVal = getUserValue(cat.id, bi);
                    const hasUserVal = userVal !== "" && compareMode;
                    const percentile = hasUserVal ? getPercentile(parseFloat(userVal), b) : null;
                    const grade = percentile !== null ? getGrade(percentile) : null;

                    return (
                      <div key={bi} style={{ padding: 16, background: "#ffffff05", border: "1px solid var(--border)", borderRadius: 10 }}>
                        {/* Metric name + description */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 2 }}>{b.metric}</div>
                            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{b.description}</div>
                          </div>
                          {compareMode && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                              <input
                                type="number"
                                value={userVal}
                                onChange={(e) => setUserValue(cat.id, bi, e.target.value)}
                                placeholder="Your value"
                                style={{
                                  width: 90, padding: "6px 10px", background: "#ffffff10", border: "1px solid var(--border)",
                                  borderRadius: 6, color: "#fff", fontSize: ".8rem", textAlign: "right",
                                }}
                              />
                              <span style={{ fontSize: ".75rem", color: "var(--muted)", minWidth: 28 }}>{b.unit}</span>
                            </div>
                          )}
                        </div>

                        {/* Range bar */}
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: ".7rem", color: b.higherIsBetter ? "#ef4444" : "#22c55e" }}>
                              {b.higherIsBetter ? "Bottom" : "Top"}: {b.higherIsBetter ? b.low : b.top}{b.unit}
                            </span>
                            <span style={{ fontSize: ".7rem", color: "#6b7280" }}>
                              Median: {b.median}{b.unit}
                            </span>
                            <span style={{ fontSize: ".7rem", color: b.higherIsBetter ? "#22c55e" : "#ef4444" }}>
                              {b.higherIsBetter ? "Top" : "Bottom"}: {b.higherIsBetter ? b.top : b.low}{b.unit}
                            </span>
                          </div>
                          <div style={{ position: "relative", height: 8, background: "#ffffff10", borderRadius: 4, overflow: "hidden" }}>
                            {/* Gradient bar */}
                            <div style={{
                              position: "absolute", inset: 0, borderRadius: 4,
                              background: b.higherIsBetter
                                ? "linear-gradient(to right, #ef4444, #f59e0b, #22c55e)"
                                : "linear-gradient(to right, #22c55e, #f59e0b, #ef4444)",
                              opacity: 0.5,
                            }} />
                            {/* Median marker */}
                            <div style={{
                              position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)",
                              width: 2, height: 12, background: "#6b7280", borderRadius: 1,
                            }} />
                            {/* User marker */}
                            {hasUserVal && percentile !== null && (
                              <div style={{
                                position: "absolute", top: -4, left: `${percentile}%`, transform: "translateX(-50%)",
                                width: 14, height: 14, background: grade!.color, borderRadius: "50%",
                                border: "2px solid #000", zIndex: 2,
                                transition: "left 0.3s ease",
                              }} />
                            )}
                          </div>
                        </div>

                        {/* User grade */}
                        {hasUserVal && grade && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                            padding: "6px 10px", background: grade.bg, borderRadius: 6,
                          }}>
                            <Award size={14} color={grade.color} />
                            <span style={{ fontSize: ".8rem", fontWeight: 600, color: grade.color }}>{grade.label}</span>
                            <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>
                              — {Math.round(percentile!)}th percentile
                            </span>
                          </div>
                        )}

                        {/* Insight */}
                        <p style={{ fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                          💡 {b.insight}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary section */}
      {compareMode && userMetrics.length > 0 && (
        <div style={{ marginTop: "2.5rem", padding: "24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>Your Program Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {userMetrics.map((um) => {
              const cat = CATEGORIES.find((c) => c.id === um.categoryId);
              if (!cat) return null;
              const b = cat.benchmarks[um.metricIndex];
              const pct = getPercentile(um.value, b);
              const grade = getGrade(pct);
              return (
                <div key={`${um.categoryId}-${um.metricIndex}`} style={{
                  padding: 12, background: "#ffffff05", borderRadius: 8,
                  borderLeft: `3px solid ${grade.color}`,
                }}>
                  <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 4 }}>{b.metric}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>{um.value}{b.unit}</span>
                    <span style={{ fontSize: ".7rem", fontWeight: 600, color: grade.color }}>{Math.round(pct)}th %ile</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall score */}
          {userMetrics.length >= 4 && (() => {
            const avgPct = Math.round(userMetrics.reduce((sum, um) => {
              const cat = CATEGORIES.find((c) => c.id === um.categoryId);
              if (!cat) return sum;
              return sum + getPercentile(um.value, cat.benchmarks[um.metricIndex]);
            }, 0) / userMetrics.length);
            const overallGrade = getGrade(avgPct);
            return (
              <div style={{ marginTop: 16, padding: "12px 16px", background: overallGrade.bg, borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <Award size={20} color={overallGrade.color} />
                <div>
                  <div style={{ fontSize: ".85rem", fontWeight: 700, color: overallGrade.color }}>
                    Overall: {overallGrade.label} — {avgPct}th percentile
                  </div>
                  <div style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: 2 }}>
                    Based on {userMetrics.length} metrics you entered
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Key Takeaways */}
      <div style={{ marginTop: "3rem", padding: "24px", background: "#818cf808", border: "1px solid #818cf825", borderRadius: 12 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={18} color="#818cf8" /> Key Takeaways for 2026
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { title: "Attribution is the biggest gap", text: "72% of partner programs still rely on manual attribution. Programs with automated deal registration protection see 3x fewer disputes and 40% faster payouts." },
            { title: "Active partner rate matters more than partner count", text: "Programs with 30 highly-active partners outperform programs with 200 inactive ones. Focus on enablement and tier incentives, not recruitment volume." },
            { title: "Speed wins", text: "The fastest-paying programs have 2x higher partner retention. If your payout cycle exceeds 45 days, you're losing partners to competitors who pay faster." },
            { title: "Revenue per Partner is the north star", text: "Top-quartile programs generate $500K+ per active partner annually. If your RPP is below $100K, your program needs deeper partner enablement, not more partners." },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "#818cf818", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontSize: ".7rem", fontWeight: 800, color: "#818cf8" }}>{i + 1}</span>
              </div>
              <div>
                <div style={{ fontSize: ".85rem", fontWeight: 700, marginBottom: 2 }}>{t.title}</div>
                <div style={{ fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.6 }}>{t.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: "3rem", padding: "32px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, textAlign: "center" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8 }}>See how Covant improves these metrics</h2>
        <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: 20, maxWidth: 500, margin: "0 auto 20px" }}>
          Automated attribution, real-time commission calculations, and partner intelligence — purpose-built to move every benchmark in the right direction.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/demo" className="btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Try the Demo <ArrowRight size={14} />
          </Link>
          <Link href="/assessment" style={{
            textDecoration: "none", color: "#9ca3af", fontSize: ".85rem",
            display: "inline-flex", alignItems: "center", gap: 6,
            border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px",
          }}>
            <Handshake size={14} /> Take the Program Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
