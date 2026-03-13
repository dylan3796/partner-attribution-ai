"use client";

import { useState } from "react";
import Link from "next/link";

type Category = "Attribution" | "Incentives" | "Portal" | "Intelligence";

const QUESTIONS: { q: string; cat: Category }[] = [
  { q: "Do you track which partner sourced each deal?", cat: "Attribution" },
  { q: "Do partners receive commission statements automatically?", cat: "Incentives" },
  { q: "Can partners see their own deal and commission status?", cat: "Portal" },
  { q: "Do you have a formal deal registration process?", cat: "Attribution" },
  { q: "Can you identify which partners are at risk of going inactive?", cat: "Intelligence" },
  { q: "Are commissions calculated automatically — no spreadsheets?", cat: "Incentives" },
  { q: "Do you run quarterly business reviews with top partners?", cat: "Intelligence" },
  { q: "Are partner disputes resolved in under 48 hours?", cat: "Attribution" },
  { q: "Do you have tiered commission rates by partner level?", cat: "Incentives" },
  { q: "Do you have a single dashboard showing all partner revenue?", cat: "Intelligence" },
];

const CAT_COLORS: Record<Category, string> = {
  Attribution: "#6366f1",
  Incentives: "#10b981",
  Portal: "#3b82f6",
  Intelligence: "#f59e0b",
};

const GRADES: { min: number; grade: string; label: string; color: string }[] = [
  { min: 9, grade: "A", label: "Your program is mature. Covant helps you scale it.", color: "#10b981" },
  { min: 7, grade: "B", label: "Solid foundation. A few gaps are costing you revenue.", color: "#6366f1" },
  { min: 5, grade: "C", label: "Growing pains. Manual processes are slowing you down.", color: "#f59e0b" },
  { min: 3, grade: "D", label: "High risk. Partners are likely frustrated.", color: "#f97316" },
  { min: 0, grade: "F", label: "Critical gaps. You're leaving significant revenue on the table.", color: "#ef4444" },
];

export default function PartnerHealth() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined && answers[i] !== null);
  const score = submitted ? QUESTIONS.filter((_, i) => answers[i] === true).length : 0;
  const gradeInfo = GRADES.find((g) => score >= g.min) ?? GRADES[GRADES.length - 1];

  const failingCats = submitted
    ? (["Attribution", "Incentives", "Portal", "Intelligence"] as Category[]).filter((cat) =>
        QUESTIONS.some((q, i) => q.cat === cat && answers[i] === false)
      )
    : [];

  function toggle(i: number, val: boolean) {
    setAnswers((prev) => ({ ...prev, [i]: val }));
  }

  function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    console.log("Scorecard report to:", email, { score, grade: gradeInfo.grade, answers });
    setSent(true);
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Covant.ai</Link>
        <Link href="/tools" style={{ color: "#888", textDecoration: "none", fontSize: "0.875rem" }}>← All tools</Link>
      </nav>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "inline-block", background: "#111", border: "1px solid #f59e0b33", color: "#f59e0b", fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "100px", marginBottom: "1rem", fontWeight: 500 }}>
            Intelligence Engine
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
            Partner Program Health Scorecard
          </h1>
          <p style={{ color: "#888", fontSize: "0.95rem" }}>
            10 yes/no questions. Grade your program in 60 seconds.
          </p>
        </div>

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
          {QUESTIONS.map((item, i) => {
            const ans = answers[i];
            return (
              <div key={i} style={{
                background: "#0a0a0a",
                border: `1px solid ${ans === true ? "#10b98133" : ans === false ? "#ef444433" : "#1a1a1a"}`,
                borderRadius: "10px",
                padding: "1.1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "border-color 0.15s",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "0.25rem", fontSize: "0.95rem", lineHeight: 1.4 }}>{item.q}</div>
                  <span style={{
                    display: "inline-block",
                    background: `${CAT_COLORS[item.cat]}22`,
                    color: CAT_COLORS[item.cat],
                    fontSize: "0.7rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontWeight: 600,
                  }}>
                    {item.cat}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button
                    onClick={() => toggle(i, true)}
                    style={{
                      background: ans === true ? "#10b981" : "#111",
                      border: `1px solid ${ans === true ? "#10b981" : "#333"}`,
                      color: ans === true ? "#000" : "#888",
                      padding: "0.4rem 0.9rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      transition: "all 0.15s",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => toggle(i, false)}
                    style={{
                      background: ans === false ? "#ef4444" : "#111",
                      border: `1px solid ${ans === false ? "#ef4444" : "#333"}`,
                      color: ans === false ? "#fff" : "#888",
                      padding: "0.4rem 0.9rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      transition: "all 0.15s",
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        {!submitted && (
          <button
            onClick={() => allAnswered && setSubmitted(true)}
            disabled={!allAnswered}
            style={{
              width: "100%",
              background: allAnswered ? "#fff" : "#111",
              color: allAnswered ? "#000" : "#444",
              border: "none",
              padding: "1rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: allAnswered ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              marginBottom: "3rem",
            }}
          >
            {allAnswered ? "See my score →" : `Answer all ${QUESTIONS.length} questions to see your score`}
          </button>
        )}

        {/* Results */}
        {submitted && (
          <div style={{ marginBottom: "2rem" }}>
            {/* Score card */}
            <div style={{
              background: "#0a0a0a",
              border: `1px solid ${gradeInfo.color}44`,
              borderRadius: "16px",
              padding: "2.5rem",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}>
              <div style={{ fontSize: "5rem", fontWeight: 800, color: gradeInfo.color, lineHeight: 1 }}>{gradeInfo.grade}</div>
              <div style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem" }}>{score}/10</div>
              <p style={{ color: "#888", marginTop: "0.75rem", fontSize: "1rem" }}>{gradeInfo.label}</p>
            </div>

            {/* Failing areas */}
            {failingCats.length > 0 && (
              <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem", fontWeight: 600 }}>
                  Areas needing attention
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {failingCats.map((cat) => (
                    <div key={cat} style={{
                      background: `${CAT_COLORS[cat]}18`,
                      border: `1px solid ${CAT_COLORS[cat]}44`,
                      color: CAT_COLORS[cat],
                      padding: "0.4rem 0.9rem",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}>
                      {cat} ✗
                    </div>
                  ))}
                  {(["Attribution", "Incentives", "Portal", "Intelligence"] as Category[]).filter((c) => !failingCats.includes(c)).map((cat) => (
                    <div key={cat} style={{
                      background: "#0d1a0d",
                      border: "1px solid #10b98133",
                      color: "#10b981",
                      padding: "0.4rem 0.9rem",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                    }}>
                      {cat} ✓
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email capture */}
            {!sent ? (
              <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <p style={{ color: "#888", fontSize: "0.875rem", margin: "0 0 1rem" }}>Get your full scorecard report →</p>
                <form onSubmit={handleEmail} style={{ display: "flex", gap: "0.75rem" }}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1, background: "#111", border: "1px solid #222", borderRadius: "8px", color: "#fff", padding: "0.6rem 0.9rem", fontSize: "0.875rem", outline: "none" }} />
                  <button type="submit" style={{ background: "#fff", color: "#000", border: "none", padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>Send</button>
                </form>
              </div>
            ) : (
              <div style={{ color: "#10b981", fontSize: "0.875rem", marginBottom: "1.5rem" }}>✓ Report sent.</div>
            )}

            {/* CTA */}
            <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: "1px solid #111" }}>
              <Link href="/pricing" style={{ background: "#f59e0b", color: "#000", padding: "0.85rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem", display: "inline-block" }}>
                Fix your gaps with the Intelligence Engine →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
