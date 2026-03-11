"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowRight, ArrowLeft, CheckCircle2, BarChart3,
  Users, Zap, Shield, Target, TrendingUp, AlertTriangle,
} from "lucide-react";

type Question = {
  id: string;
  category: string;
  categoryIcon: typeof Users;
  question: string;
  options: { label: string; score: number; detail?: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "partner_count",
    category: "Program Scale",
    categoryIcon: Users,
    question: "How many active partners are in your program?",
    options: [
      { label: "1–5", score: 1, detail: "Just getting started" },
      { label: "6–25", score: 2, detail: "Growing program" },
      { label: "26–100", score: 3, detail: "Scaling fast" },
      { label: "100+", score: 4, detail: "Enterprise scale" },
    ],
  },
  {
    id: "attribution",
    category: "Attribution",
    categoryIcon: Target,
    question: "How do you attribute revenue to partners today?",
    options: [
      { label: "We don't — it's mostly gut feel", score: 1 },
      { label: "Spreadsheets and manual tracking", score: 2 },
      { label: "CRM fields (basic tagging)", score: 3 },
      { label: "Multi-touch attribution with clear rules", score: 4 },
    ],
  },
  {
    id: "commission_calc",
    category: "Commissions",
    categoryIcon: BarChart3,
    question: "How are partner commissions calculated?",
    options: [
      { label: "Flat rate, calculated manually", score: 1 },
      { label: "Tiered rates in a spreadsheet", score: 2 },
      { label: "Rules in our CRM (somewhat automated)", score: 3 },
      { label: "Fully automated with audit trails", score: 4 },
    ],
  },
  {
    id: "payout_time",
    category: "Payouts",
    categoryIcon: Zap,
    question: "How long does it take to pay partners after a deal closes?",
    options: [
      { label: "60+ days (or it varies wildly)", score: 1 },
      { label: "30–60 days", score: 2 },
      { label: "15–30 days", score: 3 },
      { label: "Under 15 days, like clockwork", score: 4 },
    ],
  },
  {
    id: "deal_reg",
    category: "Deal Registration",
    categoryIcon: Shield,
    question: "Do you have a deal registration process?",
    options: [
      { label: "No — partners just tell us about deals", score: 1 },
      { label: "Email-based requests", score: 2 },
      { label: "Form or portal, but approval is manual", score: 3 },
      { label: "Automated registration with SLA-backed approval", score: 4 },
    ],
  },
  {
    id: "portal",
    category: "Partner Experience",
    categoryIcon: Users,
    question: "What visibility do partners have into their performance?",
    options: [
      { label: "They ask us, and we send a report", score: 1 },
      { label: "Monthly email summary", score: 2 },
      { label: "Basic portal or shared dashboard", score: 3 },
      { label: "Self-serve portal with real-time data", score: 4 },
    ],
  },
  {
    id: "disputes",
    category: "Operations",
    categoryIcon: AlertTriangle,
    question: "How often do you deal with commission disputes?",
    options: [
      { label: "Constantly — it's a major pain point", score: 1 },
      { label: "Monthly, takes hours to resolve", score: 2 },
      { label: "Occasionally, usually resolved quickly", score: 3 },
      { label: "Rarely — clear rules prevent most disputes", score: 4 },
    ],
  },
  {
    id: "scaling",
    category: "Growth Readiness",
    categoryIcon: TrendingUp,
    question: "If you doubled your partner count tomorrow, what breaks first?",
    options: [
      { label: "Everything — we can barely manage what we have", score: 1 },
      { label: "Commission calculations and payouts", score: 2 },
      { label: "Onboarding and partner communication", score: 3 },
      { label: "Nothing — our systems scale", score: 4 },
    ],
  },
];

type MaturityLevel = {
  level: string;
  range: [number, number];
  color: string;
  headline: string;
  description: string;
  recommendations: string[];
};

const MATURITY_LEVELS: MaturityLevel[] = [
  {
    level: "Manual",
    range: [8, 13],
    color: "#ef4444",
    headline: "Your program is running on heroics, not systems.",
    description: "You're likely spending 10+ hours per week on partner ops that should be automated. Revenue attribution is guesswork, commission disputes drain trust, and scaling feels impossible.",
    recommendations: [
      "Start with deal registration — even a simple form eliminates 60% of disputes",
      "Pick ONE attribution model and document it (Deal Reg Protection is the safest start)",
      "Give partners any visibility — even a monthly email beats silence",
      "Automate commission calculations before you add more partners",
    ],
  },
  {
    level: "Reactive",
    range: [14, 19],
    color: "#eab308",
    headline: "You have the basics, but you're still firefighting.",
    description: "Some processes exist but they're fragile. When things go wrong — and they do — it takes too long to fix. You're spending time on operations that should be spent on strategy.",
    recommendations: [
      "Implement a partner portal — self-serve access reduces support load by 70%",
      "Move from spreadsheet commissions to rules-based automation",
      "Add an audit trail to attribution — the paper trail kills disputes",
      "Build an onboarding workflow so new partners ramp faster",
    ],
  },
  {
    level: "Structured",
    range: [20, 26],
    color: "#3b82f6",
    headline: "Solid foundation. Time to get strategic.",
    description: "Your operations work. Partners get paid, deals get tracked, basic reporting exists. The opportunity now is turning data into decisions — which partners to invest in, which motions drive the most revenue.",
    recommendations: [
      "Add partner scoring to identify top performers and at-risk partners",
      "Implement tiered commission structures to incentivize growth",
      "Use attribution data in QBRs to strengthen partner relationships",
      "Build forecasting models from your deal data",
    ],
  },
  {
    level: "Optimized",
    range: [27, 32],
    color: "#22c55e",
    headline: "Best-in-class. You're operating at the frontier.",
    description: "Your partner program is a competitive advantage. Attribution is clear, payouts are fast, partners trust the system. You're likely in the top 5% of partner programs.",
    recommendations: [
      "Share your attribution data with AEs to drive co-sell adoption",
      "Build partner cohort analysis to find repeatable success patterns",
      "Consider multi-program support for different partner motions",
      "Use your program maturity as a recruiting tool for new partners",
    ],
  },
];

function getMaturityLevel(score: number): MaturityLevel {
  return MATURITY_LEVELS.find((l) => score >= l.range[0] && score <= l.range[1]) || MATURITY_LEVELS[0];
}

function getCategoryScores(answers: Record<string, number>): { category: string; score: number; max: number }[] {
  const cats = new Map<string, { total: number; count: number }>();
  QUESTIONS.forEach((q) => {
    const s = answers[q.id] || 0;
    const existing = cats.get(q.category) || { total: 0, count: 0 };
    cats.set(q.category, { total: existing.total + s, count: existing.count + 1 });
  });
  return Array.from(cats.entries()).map(([category, { total, count }]) => ({
    category,
    score: total,
    max: count * 4,
  }));
}

export default function AssessmentPage() {
  const [step, setStep] = useState(0); // 0 = intro, 1-8 = questions, 9 = email, 10 = results
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const captureLead = useMutation(api.leads.captureLead);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maturity = getMaturityLevel(totalScore);
  const progress = step === 0 ? 0 : Math.min((step / (QUESTIONS.length + 1)) * 100, 100);

  const currentQuestion = step >= 1 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

  function selectAnswer(questionId: string, score: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    // Auto-advance after a short delay
    setTimeout(() => {
      if (step < QUESTIONS.length) {
        setStep(step + 1);
      } else {
        setStep(QUESTIONS.length + 1); // Go to email capture
      }
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await captureLead({
        email,
        company: name || undefined,
        source: `assessment:${maturity.level}:${totalScore}`,
      });
    } catch {
      // Lead capture is best-effort — still show results
    }
    setSubmitted(true);
    setStep(QUESTIONS.length + 2); // Results
  }

  function skipToResults() {
    setSubmitted(true);
    setStep(QUESTIONS.length + 2);
  }

  // --- INTRO ---
  if (step === 0) {
    return (
      <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "8rem 2rem 4rem" }}>
          <div className="tag" style={{ marginBottom: "1.5rem" }}>Free Assessment</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: "1.5rem" }}>
            How mature is your
            <br />
            partner program?
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#888", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 540 }}>
            8 questions. 2 minutes. Get a personalized maturity score with specific
            recommendations to level up your partner operations.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            <button
              onClick={() => setStep(1)}
              className="btn btn-lg"
              style={{ gap: 8 }}
            >
              Start Assessment <ArrowRight size={18} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {[
              { label: "8 questions", sub: "Takes ~2 min" },
              { label: "Instant score", sub: "No signup required" },
              { label: "Actionable recs", sub: "Specific to your level" },
            ].map((item) => (
              <div key={item.label} style={{ padding: "1rem", borderRadius: 12, border: "1px solid #1a1a1a" }}>
                <div style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: 4 }}>{item.label}</div>
                <div style={{ color:'#6b7280', fontSize: ".8rem" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION ---
  if (currentQuestion) {
    const Icon = currentQuestion.categoryIcon;
    return (
      <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5" }}>
        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background:'#f9fafb', zIndex: 50 }}>
          <div style={{ height: "100%", background: "#fff", width: `${progress}%`, transition: "width .3s ease" }} />
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "6rem 2rem 4rem" }}>
          {/* Back button + counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <button
              onClick={() => setStep(step - 1)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color:'#6b7280', cursor: "pointer", fontSize: ".85rem", fontFamily: "inherit" }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <span style={{ color:'#6b7280', fontSize: ".85rem", fontWeight: 500 }}>
              {step} of {QUESTIONS.length}
            </span>
          </div>

          {/* Category */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <Icon size={16} style={{ color:'#6b7280' }} />
            <span style={{ color:'#6b7280', fontSize: ".8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>
              {currentQuestion.category}
            </span>
          </div>

          {/* Question */}
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-.01em", marginBottom: "2rem" }}>
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.score;
              return (
                <button
                  key={opt.score}
                  onClick={() => selectAnswer(currentQuestion.id, opt.score)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1rem 1.25rem", borderRadius: 12,
                    border: `1px solid ${isSelected ? "#fff" : "#1a1a1a"}`,
                    background: isSelected ? "#111" : "transparent",
                    color: "#e5e5e5", cursor: "pointer", textAlign: "left",
                    fontFamily: "inherit", fontSize: ".95rem", transition: "all .15s",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{opt.label}</div>
                    {opt.detail && <div style={{ color:'#6b7280', fontSize: ".8rem", marginTop: 2 }}>{opt.detail}</div>}
                  </div>
                  {isSelected && <CheckCircle2 size={18} style={{ color:'#0a0a0a', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- EMAIL CAPTURE ---
  if (!submitted) {
    return (
      <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background:'#f9fafb', zIndex: 50 }}>
          <div style={{ height: "100%", background: "#fff", width: "100%", transition: "width .3s ease" }} />
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "8rem 2rem 4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: ".75rem" }}>
              Your results are ready
            </h2>
            <p style={{ color: "#888", lineHeight: 1.6 }}>
              Enter your email to get your full maturity report with personalized recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <input
              type="text"
              placeholder="Company (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
            <button type="submit" className="btn" style={{ width: "100%", marginTop: ".5rem" }}>
              See My Results <ArrowRight size={16} />
            </button>
          </form>

          <button
            onClick={skipToResults}
            style={{
              display: "block", width: "100%", textAlign: "center", marginTop: "1rem",
              background: "none", border: "none", color:'#6b7280', fontSize: ".8rem",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Skip — show results without email
          </button>
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  const categoryScores = getCategoryScores(answers);
  const maxScore = QUESTIONS.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100);

  return (
    <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "6rem 2rem 4rem" }}>
        {/* Score header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 120, height: 120, borderRadius: "50%",
              border: `3px solid ${maturity.color}`,
              fontSize: "2.5rem", fontWeight: 800,
            }}>
              {totalScore}
            </div>
            <div style={{ color:'#6b7280', fontSize: ".85rem", marginTop: ".5rem" }}>
              out of {maxScore}
            </div>
          </div>

          <div style={{
            display: "inline-block", padding: ".3rem 1rem", borderRadius: 20,
            background: `${maturity.color}20`, color: maturity.color,
            fontSize: ".85rem", fontWeight: 700, marginBottom: "1rem",
          }}>
            {maturity.level} Stage
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.3, marginBottom: ".75rem" }}>
            {maturity.headline}
          </h1>
          <p style={{ color: "#888", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            {maturity.description}
          </p>
        </div>

        {/* Category breakdown */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: ".04em", color:'#6b7280' }}>
            Score Breakdown
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {categoryScores.map((cat) => {
              const pct = Math.round((cat.score / cat.max) * 100);
              const barColor = pct >= 75 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444";
              return (
                <div key={cat.category}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: ".85rem" }}>
                    <span style={{ fontWeight: 500 }}>{cat.category}</span>
                    <span style={{ color:'#6b7280' }}>{cat.score}/{cat.max}</span>
                  </div>
                  <div style={{ height: 6, background:'#f9fafb', borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: barColor, borderRadius: 3, width: `${pct}%`, transition: "width .5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: ".04em", color:'#6b7280' }}>
            Recommendations
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {maturity.recommendations.map((rec, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "1rem", borderRadius: 12, border: "1px solid #1a1a1a", background:'#f9fafb' }}>
                <span style={{ color: maturity.color, fontWeight: 700, fontSize: ".85rem", flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: ".9rem", lineHeight: 1.6, color:'#374151' }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          padding: "2rem", borderRadius: 16, border: "1px solid #1a1a1a",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111 100%)",
          textAlign: "center",
        }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: ".5rem" }}>
            Ready to level up?
          </h3>
          <p style={{ color: "#888", fontSize: ".9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Covant automates attribution, commissions, and partner ops —
            so you can focus on growing your program, not managing spreadsheets.
          </p>
          <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" className="btn">
              Start Free <ArrowRight size={16} />
            </Link>
            <Link href="/demo" className="btn-outline">
              See the Demo
            </Link>
          </div>
        </div>

        {/* Retake */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => { setStep(0); setAnswers({}); setEmail(""); setName(""); setSubmitted(false); }}
            style={{ background: "none", border: "none", color:'#6b7280', fontSize: ".8rem", cursor: "pointer", fontFamily: "inherit" }}
          >
            Retake assessment
          </button>
          <span style={{ color: "#333", margin: "0 .75rem" }}>·</span>
          <Link href="/beta" style={{ color:'#6b7280', fontSize: ".8rem" }}>
            Join the beta
          </Link>
        </div>
      </div>
    </div>
  );
}
