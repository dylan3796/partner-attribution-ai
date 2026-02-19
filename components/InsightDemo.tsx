"use client";

import { useState, useEffect, useRef } from "react";

interface QueryCard {
  question: string;
  answer: React.ReactNode;
}

const revenueData = [
  { name: "TechBridge Solutions", amount: "$247,400", trend: "↑32%", trendUp: true, pct: 100 },
  { name: "Apex Growth Group", amount: "$189,200", trend: "↑18%", trendUp: true, pct: 76.5 },
  { name: "Stackline Partners", amount: "$134,600", trend: "↓4%", trendUp: false, pct: 54.5 },
  { name: "Northlight Digital", amount: "$89,100", trend: "↑61%", trendUp: true, pct: 36 },
  { name: "Clearpath Ventures", amount: "$52,300", trend: "new", trendUp: null as boolean | null, pct: 21.2 },
];

const commissionData = [
  { name: "TechBridge Solutions", amount: "$18,550", tier: "10% · Gold tier", status: "Ready to pay", ready: true },
  { name: "Apex Growth Group", amount: "$14,190", tier: "10% · Gold tier", status: "Ready to pay", ready: true },
  { name: "Stackline Partners", amount: "$6,730", tier: "8% · Silver tier", status: "Pending approval", ready: false },
  { name: "Northlight Digital", amount: "$6,680", tier: "8% · Silver tier", status: "Ready to pay", ready: true },
  { name: "Clearpath Ventures", amount: "$2,615", tier: "8% · Silver tier", status: "Pending approval", ready: false },
];

const healthData = [
  { icon: "⚠", warn: true, name: "Clearpath Ventures", detail: "Last activity 34 days ago · No deals registered in Q3" },
  { icon: "⚠", warn: true, name: "Stackline Partners", detail: "Missed tier threshold by 12% · At risk of downgrade" },
  { icon: "✓", warn: false, name: "Northlight Digital", detail: "Up 61% QoQ · Eligible for Gold tier promotion → Review" },
  { icon: "✓", warn: false, name: "TechBridge Solutions", detail: "Closed 4 deals this month · On track for Platinum" },
];

function RevenueAnswer() {
  return (
    <div style={{ fontFamily: "monospace", fontSize: ".82rem", lineHeight: 1.8 }}>
      {revenueData.map((r) => (
        <div key={r.name} style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ minWidth: 180, color: "#e5e5e5" }}>{r.name}</span>
          <span style={{ minWidth: 80, textAlign: "right", color: "#e5e5e5", fontWeight: 600 }}>{r.amount}</span>
          <span style={{ minWidth: 45, textAlign: "right", color: r.trendUp === null ? "#a0a0a0" : r.trendUp ? "#22c55e" : "#ef4444", fontSize: ".8rem" }}>{r.trend}</span>
          <div style={{ flex: 1, minWidth: 120, height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${r.pct}%`, height: "100%", background: "#6366f1", borderRadius: 4 }} />
          </div>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #1e1e1e", marginTop: ".75rem", paddingTop: ".75rem", color: "#666", fontSize: ".8rem" }}>
        Total partner-attributed <span style={{ color: "#e5e5e5", fontWeight: 600 }}>$712,600</span> · 68% of closed revenue
      </div>
    </div>
  );
}

function CommissionAnswer() {
  return (
    <div style={{ fontFamily: "monospace", fontSize: ".82rem", lineHeight: 1.8 }}>
      {commissionData.map((c) => (
        <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ minWidth: 180, color: "#e5e5e5" }}>{c.name}</span>
          <span style={{ minWidth: 65, textAlign: "right", color: "#e5e5e5", fontWeight: 600 }}>{c.amount}</span>
          <span style={{ minWidth: 110, color: "#666", fontSize: ".78rem" }}>{c.tier}</span>
          <span style={{
            fontSize: ".72rem",
            padding: ".15rem .5rem",
            borderRadius: 4,
            background: c.ready ? "rgba(34,197,94,.12)" : "rgba(234,179,8,.12)",
            color: c.ready ? "#22c55e" : "#eab308",
            fontWeight: 500,
          }}>
            {c.status}
          </span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #1e1e1e", marginTop: ".75rem", paddingTop: ".75rem", color: "#666", fontSize: ".8rem" }}>
        Total due this quarter <span style={{ color: "#e5e5e5", fontWeight: 600 }}>$48,765</span> · Calculated automatically · 0 disputes
      </div>
    </div>
  );
}

function HealthAnswer() {
  return (
    <div style={{ fontFamily: "monospace", fontSize: ".82rem", lineHeight: 1.8 }}>
      {healthData.map((h) => (
        <div key={h.name} style={{ display: "flex", gap: ".6rem", alignItems: "flex-start" }}>
          <span style={{ color: h.warn ? "#eab308" : "#22c55e", flexShrink: 0 }}>{h.icon}</span>
          <div>
            <span style={{ color: "#e5e5e5", fontWeight: 600 }}>{h.name}</span>
            <span style={{ color: "#666", marginLeft: ".75rem" }}>{h.detail}</span>
          </div>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #1e1e1e", marginTop: ".75rem", paddingTop: ".75rem", color: "#666", fontSize: ".8rem" }}>
        2 partners need action this week
      </div>
    </div>
  );
}

const queries: QueryCard[] = [
  { question: "Which partners drove revenue this quarter?", answer: <RevenueAnswer /> },
  { question: "Who do I owe commissions this quarter?", answer: <CommissionAnswer /> },
  { question: "Who needs my attention right now?", answer: <HealthAnswer /> },
];

export default function InsightDemo() {
  const [activeCard, setActiveCard] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [visibleAnswers, setVisibleAnswers] = useState<boolean[]>([false, false, false]);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cardIdx = 0;
    let charIdx = 0;

    function typeNext() {
      const q = queries[cardIdx].question;
      if (charIdx < q.length) {
        charIdx++;
        setTypedChars(charIdx);
        setTimeout(typeNext, 35);
      } else {
        // Done typing — show answer after pause
        setTimeout(() => {
          setVisibleAnswers((prev) => {
            const next = [...prev];
            next[cardIdx] = true;
            return next;
          });
          // Move to next card
          setTimeout(() => {
            cardIdx++;
            if (cardIdx < queries.length) {
              charIdx = 0;
              setActiveCard(cardIdx);
              setTypedChars(0);
              setTimeout(typeNext, 100);
            }
          }, 800);
        }, 300);
      }
    }

    setTimeout(typeNext, 500);
  }, []);

  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #1a1a1a",
      borderRadius: 16,
      padding: "2rem",
      maxWidth: 800,
      margin: "0 auto",
    }}>
      {queries.map((q, i) => {
        const isActive = i === activeCard;
        const isPast = i < activeCard;
        const isFuture = i > activeCard;
        const displayedText = isPast ? q.question : isActive ? q.question.slice(0, typedChars) : "";
        const showCursor = isActive && typedChars < q.question.length;

        return (
          <div
            key={i}
            style={{
              background: "#0d0d0d",
              border: "1px solid #1e1e1e",
              borderRadius: 12,
              padding: "1.25rem 1.5rem",
              marginBottom: i < queries.length - 1 ? "1rem" : 0,
              opacity: isFuture ? 0.3 : 1,
              transition: "opacity 0.4s ease",
            }}
          >
            {/* Prompt */}
            <div style={{ marginBottom: visibleAnswers[i] ? ".75rem" : 0 }}>
              <span style={{ fontSize: ".7rem", color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>Covant AI</span>
              <div style={{ color: "#fff", fontSize: ".95rem", fontFamily: "'Inter', system-ui, sans-serif", marginTop: ".25rem", minHeight: "1.4em" }}>
                {displayedText}
                {showCursor && (
                  <span style={{
                    display: "inline-block",
                    width: 2,
                    height: "1.1em",
                    background: "#fff",
                    marginLeft: 2,
                    verticalAlign: "text-bottom",
                    animation: "blink 0.8s step-end infinite",
                  }} />
                )}
              </div>
            </div>
            {/* Answer */}
            <div style={{
              opacity: visibleAnswers[i] ? 1 : 0,
              maxHeight: visibleAnswers[i] ? 500 : 0,
              overflow: "hidden",
              transition: "opacity 0.4s ease, max-height 0.5s ease",
              paddingLeft: ".5rem",
            }}>
              {q.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
