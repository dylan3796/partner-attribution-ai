"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Check, ChevronRight, ChevronLeft, Sparkles, ArrowRight,
  Users, DollarSign, GitBranch, BarChart3, LayoutDashboard, Briefcase,
  Loader2, CheckCircle2,
} from "lucide-react";

/* ─── Types ─── */
type Flow = {
  id: string;
  icon: typeof Users;
  title: string;
  description: string;
  color: string;
};

type ParsedProgram = {
  partnerTypes: { type: string; rate: number }[];
  tiers: { name: string; rate: number; mdf?: number }[];
  bonuses: string[];
  summary: string;
};

/* ─── Constants ─── */
const FLOWS: Flow[] = [
  {
    id: "attribution",
    icon: GitBranch,
    title: "Attribution",
    description: "Track which partner drove each deal. Multi-touch, first touch, or role split.",
    color: "#6366f1",
  },
  {
    id: "incentives",
    icon: DollarSign,
    title: "Incentives & Commissions",
    description: "Tiered rates, SPIFs, MDF budgets, and automated payout calculations.",
    color: "#22c55e",
  },
  {
    id: "deal_registration",
    icon: Briefcase,
    title: "Deal Registration",
    description: "Partners register deals, get conflict detection, and approval workflows.",
    color: "#f59e0b",
  },
  {
    id: "portal",
    icon: LayoutDashboard,
    title: "Partner Portal",
    description: "A branded self-service view for partners: deals, commissions, performance.",
    color: "#3b82f6",
  },
  {
    id: "intelligence",
    icon: BarChart3,
    title: "Revenue Intelligence",
    description: "Partner health scores, leaderboards, benchmarks, and program analytics.",
    color: "#a78bfa",
  },
  {
    id: "program",
    icon: Users,
    title: "Program Management",
    description: "Tier management, onboarding tracking, certifications, partner announcements.",
    color: "#f472b6",
  },
];

const EXAMPLES = [
  "We have resellers who get 18%, referral partners at 12%, and gold tier partners get a $5k MDF budget per quarter.",
  "Simple setup — one type of partner, 15% commission on every closed deal. About 8 partners right now.",
  "Tiered commissions: bronze 10%, silver 15%, gold 20%. Plus a $2,500 new logo bonus.",
  "Channel resellers at 20%, tech integration partners at 8%. Gold gets 25% on deals over $100k.",
];

/* ─── NL parser (lightweight, client-side) ─── */
function parseProgram(text: string): ParsedProgram {
  const result: ParsedProgram = { partnerTypes: [], tiers: [], bonuses: [], summary: "" };

  const typePatterns = [
    { pattern: /reseller[s]?[^.]*?(\d+)%/gi, type: "reseller" },
    { pattern: /referral[s]?[^.]*?(\d+)%/gi, type: "referral" },
    { pattern: /affiliate[s]?[^.]*?(\d+)%/gi, type: "affiliate" },
    { pattern: /integration[s]?[^.]*?(\d+)%/gi, type: "integration" },
    { pattern: /channel[^.]*?(\d+)%/gi, type: "reseller" },
    { pattern: /tech[^.]*?(\d+)%/gi, type: "integration" },
  ];
  for (const { pattern, type } of typePatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const m of matches) {
      const rate = parseInt(m[1]);
      if (rate > 0 && rate <= 100 && !result.partnerTypes.find(p => p.type === type)) {
        result.partnerTypes.push({ type, rate });
      }
    }
  }

  const tierPatterns = [
    { pattern: /(?:gold|platinum)[^.]*?(\d+)%/gi, name: "gold" },
    { pattern: /silver[^.]*?(\d+)%/gi, name: "silver" },
    { pattern: /bronze[^.]*?(\d+)%/gi, name: "bronze" },
  ];
  for (const { pattern, name } of tierPatterns) {
    for (const m of [...text.matchAll(pattern)]) {
      const rate = parseInt(m[1]);
      if (rate > 0 && !result.tiers.find(t => t.name === name)) {
        result.tiers.push({ name, rate });
      }
    }
  }

  if (result.partnerTypes.length === 0 && result.tiers.length === 0) {
    const flat = text.match(/(\d+)%/);
    if (flat) result.partnerTypes.push({ type: "partner", rate: parseInt(flat[1]) });
  }

  const bonusMatch = text.match(/\$([\d,k]+)\s*(new logo|bonus|mdf|incentive)/gi);
  if (bonusMatch) result.bonuses = bonusMatch.slice(0, 3);

  const lines: string[] = [];
  if (result.tiers.length > 0) {
    lines.push("Tiers: " + result.tiers.map(t => `${t.name} ${t.rate}%`).join(", "));
  } else if (result.partnerTypes.length > 0) {
    lines.push(result.partnerTypes.map(p => `${p.type} at ${p.rate}%`).join(", "));
  }
  if (result.bonuses.length > 0) lines.push("Bonuses: " + result.bonuses.join(", "));
  result.summary = lines.join(" · ") || "Custom program";

  return result;
}

/* ─── Step indicator ─── */
function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: done ? "#0a0a0a" : active ? "#0a0a0a" : "#f3f4f6",
      color: done || active ? "#fff" : "#9ca3af",
      fontSize: ".8rem", fontWeight: 700,
      border: active ? "2px solid #0a0a0a" : "2px solid transparent",
      flexShrink: 0,
    }}>
      {done ? <Check size={14} /> : n}
    </div>
  );
}

/* ─── Main ─── */
export default function SetupPage() {
  const router = useRouter();
  const seedDemo = useMutation(api.seedDemo.seedDemoData);
  const [step, setStep] = useState(0); // 0=load, 1=describe, 2=flows
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const seedRan = useRef(false);

  // Step 1 — description
  const [descText, setDescText] = useState("");
  const [parsed, setParsed] = useState<ParsedProgram | null>(null);
  const [exampleIdx, setExampleIdx] = useState(0);

  // Step 2 — flows
  const [selectedFlows, setSelectedFlows] = useState<Set<string>>(new Set(["attribution", "incentives"]));

  // Rotate placeholder examples
  useEffect(() => {
    const t = setInterval(() => setExampleIdx(i => (i + 1) % EXAMPLES.length), 3500);
    return () => clearInterval(t);
  }, []);

  /* ── Seed on step 0 ── */
  async function handleLoadData() {
    if (seedRan.current) { setStep(1); return; }
    seedRan.current = true;
    setSeeding(true);
    try { await seedDemo({}); } catch { /* best effort */ }
    setSeeded(true);
    setSeeding(false);
  }

  function handleDescribeNext() {
    if (!descText.trim()) return;
    const p = parseProgram(descText);
    setParsed(p);
    setStep(2);
  }

  function toggleFlow(id: string) {
    setSelectedFlows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleFinish() {
    router.replace("/dashboard?setup=done");
  }

  /* ── Layout ── */
  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      fontFamily: "var(--font-inter, Inter, sans-serif)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: "1px solid #f3f4f6", padding: "1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-.02em" }}>Covant.ai</span>
        <button
          onClick={() => router.replace("/dashboard")}
          style={{ background: "none", border: "none", color: "#9ca3af", fontSize: ".85rem", cursor: "pointer" }}
        >
          Skip setup →
        </button>
      </div>

      {/* Step indicators */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "0.75rem", padding: "1.5rem 0 0",
      }}>
        {["Load data", "Describe program", "Choose flows"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <StepDot n={i + 1} active={step === i} done={step > i} />
            <span style={{ fontSize: ".8rem", color: step >= i ? "#0a0a0a" : "#9ca3af", fontWeight: step === i ? 600 : 400 }}>
              {label}
            </span>
            {i < 2 && <ChevronRight size={14} style={{ color: "#d1d5db", marginLeft: "0.25rem" }} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "3rem 1.5rem",
      }}>

        {/* ── STEP 0: Load data ── */}
        {step === 0 && (
          <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f9fafb", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: ".35rem .9rem", marginBottom: "1.5rem",
            }}>
              <Sparkles size={13} style={{ color: "#6366f1" }} />
              <span style={{ fontSize: ".8rem", fontWeight: 600, color: "#6b7280" }}>Step 1 of 3</span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: ".75rem" }}>
              Start with sample data
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
              We&apos;ll load 5 partners, 17 deals, commissions, and attribution data so you can see
              Covant working before you connect your real program.
            </p>

            {/* Data preview cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem", textAlign: "left" }}>
              {[
                { label: "Partners", value: "5", sub: "Gold, Silver, Bronze tiers", color: "#6366f1" },
                { label: "Deals", value: "17", sub: "With full attribution trails", color: "#22c55e" },
                { label: "Commissions", value: "$38,400", sub: "Calculated & queued", color: "#f59e0b" },
                { label: "Deal registrations", value: "9", sub: "Across partner types", color: "#3b82f6" },
              ].map(c => (
                <div key={c.label} style={{
                  background: "#f9fafb", border: "1px solid #e5e7eb",
                  borderRadius: 10, padding: "1rem 1.25rem",
                }}>
                  <div style={{ fontSize: ".75rem", color: "#9ca3af", marginBottom: ".25rem" }}>{c.label}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0a0a0a" }}>{c.value}</div>
                  <div style={{ fontSize: ".75rem", color: "#6b7280", marginTop: ".15rem" }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {seeded ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#22c55e", fontWeight: 600 }}>
                  <CheckCircle2 size={18} /> Sample data loaded
                </div>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "#0a0a0a", color: "#fff",
                    padding: ".85rem 2.5rem", borderRadius: 8,
                    border: "none", fontWeight: 700, fontSize: ".95rem",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoadData}
                disabled={seeding}
                style={{
                  background: "#0a0a0a", color: "#fff",
                  padding: ".85rem 2.5rem", borderRadius: 8,
                  border: "none", fontWeight: 700, fontSize: ".95rem",
                  cursor: seeding ? "wait" : "pointer",
                  opacity: seeding ? 0.8 : 1,
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}
              >
                {seeding ? (
                  <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Loading data…</>
                ) : (
                  <>Load sample data <ArrowRight size={16} /></>
                )}
              </button>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── STEP 1: Describe program ── */}
        {step === 1 && (
          <div style={{ maxWidth: 580, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#f9fafb", border: "1px solid #e5e7eb",
                borderRadius: 8, padding: ".35rem .9rem", marginBottom: "1.25rem",
              }}>
                <Sparkles size={13} style={{ color: "#6366f1" }} />
                <span style={{ fontSize: ".8rem", fontWeight: 600, color: "#6b7280" }}>Step 2 of 3</span>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: ".6rem" }}>
                Describe your partner program
              </h1>
              <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.5 }}>
                Tell us how it works in plain English. We&apos;ll extract the rules.
              </p>
            </div>

            <textarea
              value={descText}
              onChange={e => { setDescText(e.target.value); setParsed(null); }}
              placeholder={EXAMPLES[exampleIdx]}
              rows={4}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "1rem", borderRadius: 10,
                border: "1px solid #e5e7eb", fontSize: ".95rem",
                lineHeight: 1.6, resize: "none", outline: "none",
                color: "#0a0a0a", background: "#fff",
                fontFamily: "inherit",
              }}
            />

            {/* Parsed preview */}
            {parsed && (
              <div style={{
                marginTop: ".75rem", padding: "1rem 1.25rem",
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: 10,
              }}>
                <div style={{ fontSize: ".75rem", fontWeight: 600, color: "#16a34a", marginBottom: ".4rem" }}>
                  ✓ We understood this as:
                </div>
                <div style={{ fontSize: ".9rem", color: "#166534" }}>{parsed.summary}</div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
              <button
                onClick={() => setStep(0)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "1px solid #e5e7eb",
                  borderRadius: 8, padding: ".75rem 1.25rem",
                  color: "#6b7280", fontSize: ".875rem", cursor: "pointer",
                }}
              >
                <ChevronLeft size={14} /> Back
              </button>
              <div style={{ display: "flex", gap: ".75rem" }}>
                {!parsed && descText.trim() && (
                  <button
                    onClick={() => setParsed(parseProgram(descText))}
                    style={{
                      background: "#f9fafb", border: "1px solid #e5e7eb",
                      borderRadius: 8, padding: ".75rem 1.25rem",
                      color: "#374151", fontSize: ".875rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Preview rules
                  </button>
                )}
                <button
                  onClick={handleDescribeNext}
                  disabled={!descText.trim()}
                  style={{
                    background: "#0a0a0a", color: "#fff",
                    padding: ".75rem 1.75rem", borderRadius: 8,
                    border: "none", fontWeight: 700, fontSize: ".875rem",
                    cursor: descText.trim() ? "pointer" : "not-allowed",
                    opacity: descText.trim() ? 1 : 0.4,
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <p style={{ textAlign: "center", marginTop: "1rem", color: "#9ca3af", fontSize: ".8rem" }}>
              Not sure?{" "}
              <button
                onClick={() => { setDescText(EXAMPLES[0]); setParsed(parseProgram(EXAMPLES[0])); }}
                style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: ".8rem", textDecoration: "underline" }}
              >
                Use an example
              </button>
            </p>
          </div>
        )}

        {/* ── STEP 2: Pick flows ── */}
        {step === 2 && (
          <div style={{ maxWidth: 700, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#f9fafb", border: "1px solid #e5e7eb",
                borderRadius: 8, padding: ".35rem .9rem", marginBottom: "1.25rem",
              }}>
                <Sparkles size={13} style={{ color: "#6366f1" }} />
                <span style={{ fontSize: ".8rem", fontWeight: 600, color: "#6b7280" }}>Step 3 of 3</span>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: ".6rem" }}>
                Which flows do you want to activate?
              </h1>
              <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.5 }}>
                Pick the ones that apply. You can turn others on later.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {FLOWS.map(flow => {
                const selected = selectedFlows.has(flow.id);
                const Icon = flow.icon;
                return (
                  <button
                    key={flow.id}
                    onClick={() => toggleFlow(flow.id)}
                    style={{
                      background: selected ? "#0a0a0a" : "#fff",
                      border: selected ? "2px solid #0a0a0a" : "2px solid #e5e7eb",
                      borderRadius: 12, padding: "1.25rem",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s",
                      position: "relative",
                    }}
                  >
                    {selected && (
                      <div style={{
                        position: "absolute", top: 10, right: 10,
                        background: "#fff", borderRadius: "50%",
                        width: 18, height: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={11} style={{ color: "#0a0a0a" }} />
                      </div>
                    )}
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, marginBottom: ".75rem",
                      background: selected ? "rgba(255,255,255,0.1)" : `${flow.color}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={18} style={{ color: selected ? "#fff" : flow.color }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: ".9rem", color: selected ? "#fff" : "#0a0a0a", marginBottom: ".3rem" }}>
                      {flow.title}
                    </div>
                    <div style={{ fontSize: ".8rem", color: selected ? "#9ca3af" : "#6b7280", lineHeight: 1.5 }}>
                      {flow.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Summary of what they said */}
            {parsed && (
              <div style={{
                padding: ".75rem 1.25rem", background: "#f9fafb",
                border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: "1.5rem",
                fontSize: ".85rem", color: "#6b7280",
              }}>
                📋 Your program: <strong style={{ color: "#0a0a0a" }}>{parsed.summary}</strong>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "1px solid #e5e7eb",
                  borderRadius: 8, padding: ".75rem 1.25rem",
                  color: "#6b7280", fontSize: ".875rem", cursor: "pointer",
                }}
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={handleFinish}
                disabled={selectedFlows.size === 0}
                style={{
                  background: "#0a0a0a", color: "#fff",
                  padding: ".85rem 2rem", borderRadius: 8,
                  border: "none", fontWeight: 700, fontSize: ".95rem",
                  cursor: selectedFlows.size > 0 ? "pointer" : "not-allowed",
                  opacity: selectedFlows.size > 0 ? 1 : 0.4,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                Go to dashboard <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
