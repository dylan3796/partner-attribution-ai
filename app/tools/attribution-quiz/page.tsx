"use client";

import { useState } from "react";
import Link from "next/link";

type Answer = string;

const QUESTIONS = [
  {
    id: "partners",
    q: "How many partners are typically involved in a single deal?",
    options: ["One partner", "2–3 partners", "4 or more partners"],
  },
  {
    id: "dealreg",
    q: "Do your partners register deals before closing?",
    options: ["Yes, always", "Sometimes", "No — we track after close"],
  },
  {
    id: "direct",
    q: "Do you have a direct sales team competing for the same accounts?",
    options: ["Yes", "No"],
  },
  {
    id: "cycle",
    q: "What's your average deal cycle length?",
    options: ["Under 30 days", "30–90 days", "90+ days"],
  },
  {
    id: "priority",
    q: "What matters most to you?",
    options: [
      "Protecting partner deal registrations",
      "Fairly splitting credit across partners",
      "Tracking who sourced the deal originally",
      "Understanding multi-partner influence",
    ],
  },
  {
    id: "scale",
    q: "How many active partners do you manage?",
    options: ["Under 10", "10–50", "50–200", "200+"],
  },
];

type ModelKey = "deal-reg" | "source-wins" | "role-split" | "multi-touch";

const MODELS: Record<ModelKey, { name: string; tagline: string; description: string; prevents: string; color: string }> = {
  "deal-reg": {
    name: "Deal Reg Protection",
    tagline: "Reward partners who claim first.",
    description: "You have deal registration. Reward the partner who registers a deal first and protect them from conflict with direct sales or other partners. The simplest model for reseller-heavy programs.",
    prevents: "Channel conflict, duplicate deal registrations, partner churn from unfair competition.",
    color: "#6366f1",
  },
  "source-wins": {
    name: "Source Wins",
    tagline: "Credit the partner who brought the deal.",
    description: "The partner who introduced the opportunity gets full credit. Works best when you have single-partner deals and care more about sourcing than assisted deals. Clean, simple, no disputes.",
    prevents: "Ambiguity about who 'owns' a deal, over-crediting partners who assist but don't source.",
    color: "#10b981",
  },
  "role-split": {
    name: "Role Split",
    tagline: "Pre-define credit by partner role.",
    description: "Multiple partners are involved in the same deal. Assign credit percentages by role — reseller, referral, co-sell, SI — before deals close. Each partner sees exactly what they'll earn.",
    prevents: "Commission disputes in multi-partner deals, unclear accountability, partner resentment.",
    color: "#f59e0b",
  },
  "multi-touch": {
    name: "Multi-Touch Influence",
    tagline: "Track every touchpoint, weight by stage.",
    description: "Long deal cycles with multiple partners touching the deal at different stages. Track all touchpoints and weight credit by when and how they influenced the deal. Best for complex enterprise programs.",
    prevents: "Missing influence from partners who don't close but matter, late-stage credit disputes.",
    color: "#ec4899",
  },
};

function score(answers: Record<string, Answer>): ModelKey {
  let dealReg = 0, sourceWins = 0, roleSplit = 0, multiTouch = 0;

  if (answers.partners === "One partner") { sourceWins += 2; dealReg += 1; }
  if (answers.partners === "2–3 partners") { roleSplit += 2; dealReg += 1; }
  if (answers.partners === "4 or more partners") { roleSplit += 2; multiTouch += 2; }

  if (answers.dealreg === "Yes, always") dealReg += 3;
  if (answers.dealreg === "Sometimes") { dealReg += 1; roleSplit += 1; }
  if (answers.dealreg === "No — we track after close") { sourceWins += 2; multiTouch += 1; }

  if (answers.direct === "Yes") dealReg += 2;

  if (answers.cycle === "Under 30 days") { sourceWins += 1; dealReg += 1; }
  if (answers.cycle === "30–90 days") roleSplit += 1;
  if (answers.cycle === "90+ days") multiTouch += 3;

  if (answers.priority === "Protecting partner deal registrations") dealReg += 3;
  if (answers.priority === "Fairly splitting credit across partners") roleSplit += 3;
  if (answers.priority === "Tracking who sourced the deal originally") sourceWins += 3;
  if (answers.priority === "Understanding multi-partner influence") multiTouch += 3;

  if (answers.scale === "200+") multiTouch += 1;
  if (answers.scale === "50–200") roleSplit += 1;

  const scores: Record<ModelKey, number> = { "deal-reg": dealReg, "source-wins": sourceWins, "role-split": roleSplit, "multi-touch": multiTouch };
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as ModelKey);
}

export default function AttributionQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<ModelKey | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  function select(option: string) {
    const next = { ...answers, [current.id]: option };
    setAnswers(next);
    if (isLast) {
      setResult(score(next));
    } else {
      setStep(step + 1);
    }
  }

  function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    console.log("Email recommendation to:", email, result);
    setSent(true);
  }

  const model = result ? MODELS[result] : null;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Covant.ai</Link>
        <Link href="/tools" style={{ color: "#888", textDecoration: "none", fontSize: "0.875rem" }}>← All tools</Link>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "inline-block", background: "#111", border: "1px solid #6366f133", color: "#6366f1", fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "100px", marginBottom: "1rem", fontWeight: 500 }}>
            Attribution Engine
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
            Attribution Model Quiz
          </h1>
          <p style={{ color: "#888", fontSize: "0.95rem" }}>6 questions. Instant recommendation.</p>
        </div>

        {!result ? (
          <>
            {/* Progress */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#666", fontSize: "0.8rem" }}>Question {step + 1} of {QUESTIONS.length}</span>
                <span style={{ color: "#666", fontSize: "0.8rem" }}>{Math.round(((step) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div style={{ background: "#111", borderRadius: "4px", height: "4px" }}>
                <div style={{ background: "#6366f1", width: `${(step / QUESTIONS.length) * 100}%`, height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>

            {/* Question */}
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.5rem", lineHeight: 1.4 }}>{current.q}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => select(opt)}
                    style={{
                      background: answers[current.id] === opt ? "#6366f122" : "#111",
                      border: `1px solid ${answers[current.id] === opt ? "#6366f1" : "#222"}`,
                      color: "#fff",
                      padding: "0.85rem 1.25rem",
                      borderRadius: "8px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#6366f1"; }}
                    onMouseLeave={(e) => { if (answers[current.id] !== opt) (e.currentTarget as HTMLButtonElement).style.borderColor = "#222"; }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.875rem" }}>
                ← Back
              </button>
            )}
          </>
        ) : model ? (
          <>
            {/* Result */}
            <div style={{ background: "#0a0a0a", border: `1px solid ${model.color}33`, borderRadius: "16px", padding: "2.5rem", marginBottom: "1.5rem" }}>
              <div style={{ color: model.color, fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                Your model
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem", color: model.color }}>{model.name}</h2>
              <p style={{ color: "#888", fontSize: "0.95rem", fontStyle: "italic", marginBottom: "1.5rem" }}>{model.tagline}</p>
              <p style={{ color: "#ccc", lineHeight: 1.7, marginBottom: "1.5rem" }}>{model.description}</p>
              <div style={{ background: "#111", borderRadius: "8px", padding: "1rem" }}>
                <div style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>What it prevents</div>
                <p style={{ color: "#888", fontSize: "0.875rem", margin: 0 }}>{model.prevents}</p>
              </div>
            </div>

            {/* Email capture */}
            {!sent ? (
              <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <p style={{ color: "#888", fontSize: "0.875rem", margin: "0 0 1rem" }}>Email me this recommendation →</p>
                <form onSubmit={handleEmail} style={{ display: "flex", gap: "0.75rem" }}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1, background: "#111", border: "1px solid #222", borderRadius: "8px", color: "#fff", padding: "0.6rem 0.9rem", fontSize: "0.875rem", outline: "none" }} />
                  <button type="submit" style={{ background: "#fff", color: "#000", border: "none", padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>Send</button>
                </form>
              </div>
            ) : (
              <div style={{ color: "#10b981", fontSize: "0.875rem", marginBottom: "1.5rem" }}>✓ Sent.</div>
            )}

            {/* CTA */}
            <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: "1px solid #111" }}>
              <Link href="/pricing" style={{ background: model.color, color: "#000", padding: "0.85rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem", display: "inline-block" }}>
                See how Covant implements {model.name} →
              </Link>
              <div style={{ marginTop: "1rem" }}>
                <button onClick={() => { setResult(null); setStep(0); setAnswers({}); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "0.8rem" }}>
                  Retake quiz
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
