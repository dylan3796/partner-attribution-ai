"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  BarChart3, Users, DollarSign, Shield, Zap, ArrowRight,
  ArrowLeft, ChevronRight, Target, Eye, TrendingUp, CheckCircle,
  GitBranch, Briefcase, Clock, Sparkles,
} from "lucide-react";

/* ─── walkthrough steps ─── */
const STEPS = [
  {
    id: "dashboard",
    badge: "Command Center",
    title: "Real-time partner intelligence",
    subtitle: "Every metric that matters — revenue attribution, pipeline, partner health, and action items — in one view. No spreadsheets. No guessing.",
    icon: BarChart3,
    color: "#6366f1",
    features: [
      { icon: TrendingUp, text: "Live revenue attribution with 12-month trends" },
      { icon: Target, text: "Action items: pending deals, overdue payouts, at-risk partners" },
      { icon: Zap, text: "Getting started checklist auto-tracks your setup progress" },
    ],
    mockUI: "dashboard",
  },
  {
    id: "attribution",
    badge: "Attribution Engine",
    title: "Every dollar traced to the partner who earned it",
    subtitle: "Step-by-step audit trails show exactly how attribution was calculated — deal reg protection, source wins, or role-based splits. No black boxes.",
    icon: GitBranch,
    color: "#10b981",
    features: [
      { icon: Eye, text: "Full paper trail: touchpoints → credit % → commission amount" },
      { icon: Shield, text: "Three real-world models: Deal Reg, Source Wins, Role Split" },
      { icon: CheckCircle, text: "Compare models side-by-side to find optimal attribution" },
    ],
    mockUI: "attribution",
  },
  {
    id: "commissions",
    badge: "Commission Engine",
    title: "Complex rules, simple payouts",
    subtitle: "Tiered rates, product-line splits, performance bonuses — configure once, calculate automatically. Bulk approve and export for your finance team.",
    icon: DollarSign,
    color: "#f59e0b",
    features: [
      { icon: Briefcase, text: "Rules by partner tier, product line, deal size, or custom logic" },
      { icon: CheckCircle, text: "Bulk payout approval with full audit trail" },
      { icon: Clock, text: "End-of-quarter reconciliation with one-click CSV export" },
    ],
    mockUI: "commissions",
  },
  {
    id: "portal",
    badge: "Partner Portal",
    title: "A portal partners actually use",
    subtitle: "White-labeled, self-service. Partners register deals, track commissions, and see their performance — without emailing you.",
    icon: Users,
    color: "#8b5cf6",
    features: [
      { icon: Shield, text: "White-labeled: your brand, zero Covant branding" },
      { icon: Sparkles, text: "Deal registration → approval workflow → auto-commission" },
      { icon: Eye, text: "Partners see their own metrics, pipeline, and payouts" },
    ],
    mockUI: "portal",
  },
  {
    id: "launch",
    badge: "Ready?",
    title: "See it live with real data",
    subtitle: "We'll load a demo org with 5 partners, 22 deals, commissions, and attribution data. Explore everything — nothing is locked.",
    icon: Zap,
    color: "#ec4899",
    features: [
      { icon: Users, text: "5 partners across Gold, Silver, and Bronze tiers" },
      { icon: Briefcase, text: "22 deals with full attribution audit trails" },
      { icon: DollarSign, text: "Live commissions, payouts, and reconciliation" },
    ],
    mockUI: null,
  },
];

/* ─── mini mock UI components ─── */
function DashboardMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Partner Revenue", value: "$712,600", change: "+24%", up: true },
          { label: "Active Pipeline", value: "$1.2M", change: "+18%", up: true },
          { label: "Partners", value: "5", change: "+2", up: true },
          { label: "Win Rate", value: "68%", change: "+5%", up: true },
        ].map((s) => (
          <div key={s.label} style={{ background: "#111", borderRadius: 8, padding: "14px 16px", border: "1px solid #1a1a1a" }}>
            <div style={{ fontSize: ".7rem", color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: ".75rem", color: s.up ? "#22c55e" : "#ef4444", marginTop: 4 }}>{s.change}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: ".75rem", color: "#666", marginBottom: 12, fontWeight: 600 }}>TOP PARTNERS BY REVENUE</div>
          {["TechBridge Solutions — $247,400", "Apex Growth Group — $189,200", "Stackline Partners — $134,600"].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: i > 0 ? "1px solid #1a1a1a" : "none" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: ["#6366f1", "#10b981", "#f59e0b"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700 }}>{i + 1}</div>
              <span style={{ fontSize: ".8rem", color: "#ccc" }}>{p}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: ".75rem", color: "#666", marginBottom: 12, fontWeight: 600 }}>ACTION ITEMS</div>
          {[
            { text: "3 pending deal registrations", color: "#f59e0b" },
            { text: "2 partners need onboarding", color: "#6366f1" },
            { text: "$18,550 in unpaid commissions", color: "#ef4444" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: i > 0 ? "1px solid #1a1a1a" : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
              <span style={{ fontSize: ".8rem", color: "#ccc" }}>{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AttributionMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: ".95rem", fontWeight: 600 }}>Acme Corp — Enterprise License</div>
            <div style={{ fontSize: ".8rem", color: "#666", marginTop: 2 }}>Deal value: $85,000 · Closed Won</div>
          </div>
          <div style={{ background: "#22c55e20", color: "#22c55e", fontSize: ".7rem", fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>ATTRIBUTED</div>
        </div>
        <div style={{ fontSize: ".7rem", color: "#666", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>ATTRIBUTION AUDIT TRAIL</div>
        {[
          { step: "1", text: "TechBridge registered deal on Jan 15", detail: "Deal Reg Protection → 100% credit", color: "#6366f1" },
          { step: "2", text: "Credit: $85,000 × 100% = $85,000", detail: "Full deal value attributed to registering partner", color: "#10b981" },
          { step: "3", text: "Commission: $85,000 × 10% (Gold tier) = $8,500", detail: "Rule: Gold partners earn 10% on closed deals", color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i > 0 ? "1px solid #1a1a1a" : "none" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
            <div>
              <div style={{ fontSize: ".8rem", color: "#e5e5e5", fontWeight: 500 }}>{s.text}</div>
              <div style={{ fontSize: ".75rem", color: "#555", marginTop: 2 }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommissionsMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: ".75rem", color: "#666", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>COMMISSION RULES</div>
        {[
          { tier: "Gold", rate: "10%", condition: "≥$200K revenue or ≥5 deals/quarter", color: "#f59e0b" },
          { tier: "Silver", rate: "8%", condition: "≥$50K revenue or ≥2 deals/quarter", color: "#94a3b8" },
          { tier: "Bronze", rate: "5%", condition: "Default tier for new partners", color: "#b45309" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i > 0 ? "1px solid #1a1a1a" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color }} />
              <div>
                <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#e5e5e5" }}>{r.tier} Tier</div>
                <div style={{ fontSize: ".7rem", color: "#555" }}>{r.condition}</div>
              </div>
            </div>
            <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#22c55e" }}>{r.rate}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: ".75rem", color: "#666", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>PENDING PAYOUTS</div>
        {[
          { partner: "TechBridge Solutions", amount: "$8,500", deals: "2 deals", status: "Ready" },
          { partner: "Apex Growth Group", amount: "$6,200", deals: "1 deal", status: "Ready" },
          { partner: "Northlight Digital", amount: "$3,400", deals: "1 deal", status: "Pending review" },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i > 0 ? "1px solid #1a1a1a" : "none" }}>
            <div>
              <div style={{ fontSize: ".8rem", fontWeight: 500, color: "#e5e5e5" }}>{p.partner}</div>
              <div style={{ fontSize: ".7rem", color: "#555" }}>{p.deals}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#22c55e" }}>{p.amount}</div>
              <div style={{ fontSize: ".65rem", color: p.status === "Ready" ? "#22c55e" : "#f59e0b" }}>{p.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#111", borderRadius: 8, border: "1px solid #1a1a1a", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: ".85rem", fontWeight: 600 }}>Horizon Software — Partner Portal</div>
          <div style={{ fontSize: ".7rem", color: "#666" }}>sarah.chen@techbridge.io</div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "My Revenue", value: "$247,400" },
              { label: "Commission Earned", value: "$18,550" },
              { label: "Active Deals", value: "8" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#0a0a0a", borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: ".65rem", color: "#555", textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: ".7rem", color: "#666", fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>RECENT DEALS</div>
          {[
            { name: "Acme Corp — Enterprise", value: "$85,000", status: "Closed Won" },
            { name: "TechStart Inc — Pro", value: "$24,000", status: "In Progress" },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: i > 0 ? "1px solid #1a1a1a" : "none" }}>
              <div>
                <div style={{ fontSize: ".8rem", color: "#e5e5e5" }}>{d.name}</div>
                <div style={{ fontSize: ".7rem", color: "#555" }}>{d.value}</div>
              </div>
              <div style={{ fontSize: ".7rem", color: d.status === "Closed Won" ? "#22c55e" : "#f59e0b", fontWeight: 500, alignSelf: "center" }}>{d.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MOCK_MAP: Record<string, () => React.JSX.Element> = {
  dashboard: DashboardMock,
  attribution: AttributionMock,
  commissions: CommissionsMock,
  portal: PortalMock,
};

/* ─── main page ─── */
export default function DemoPage() {
  const router = useRouter();
  const seedDemo = useMutation(api.seedDemo.seedDemoData);
  const [step, setStep] = useState(0);
  const [launching, setLaunching] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const seedRan = useRef(false);

  // Pre-seed in background on mount so dashboard loads instantly
  useEffect(() => {
    if (seedRan.current) return;
    seedRan.current = true;
    seedDemo({}).then(() => setSeeded(true)).catch(() => setSeeded(true));
  }, [seedDemo]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const MockComponent = current.mockUI ? MOCK_MAP[current.mockUI] : null;

  function handleLaunch() {
    setLaunching(true);
    if (seeded) {
      router.replace("/dashboard?demo=true");
    } else {
      // Wait for seed to finish
      const check = setInterval(() => {
        // seeded state will be true eventually; fallback after 5s
      }, 200);
      setTimeout(() => {
        clearInterval(check);
        router.replace("/dashboard?demo=true");
      }, 3000);
    }
  }

  function handleNext() {
    if (isLast) {
      handleLaunch();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleSkip() {
    handleLaunch();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid #111",
      }}>
        <Link href="/" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", textDecoration: "none", letterSpacing: "-0.02em" }}>
          Covant
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={handleSkip}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              fontSize: ".8rem",
              cursor: "pointer",
              padding: "6px 12px",
            }}
          >
            Skip to demo →
          </button>
          <Link
            href="/sign-up"
            style={{
              fontSize: ".8rem",
              fontWeight: 600,
              color: "#000",
              background: "#fff",
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 24px" }}>
        <div style={{
          display: "flex",
          gap: 4,
          padding: "16px 0 0",
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
        }}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: i <= step ? STEPS[step].color : "#1a1a1a",
                border: "none",
                cursor: "pointer",
                transition: "background 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{
          maxWidth: 1100,
          width: "100%",
          display: "grid",
          gridTemplateColumns: MockComponent ? "1fr 1.2fr" : "1fr",
          gap: 48,
          alignItems: "center",
        }}>
          {/* Left: text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: `${current.color}15`,
                border: `1px solid ${current.color}30`,
                borderRadius: 20,
                padding: "6px 14px",
                marginBottom: 20,
              }}>
                <current.icon size={14} color={current.color} />
                <span style={{ fontSize: ".75rem", fontWeight: 600, color: current.color }}>{current.badge}</span>
              </div>

              <h1 style={{
                fontSize: "2.4rem",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                margin: 0,
              }}>
                {current.title}
              </h1>

              <p style={{
                fontSize: "1.05rem",
                color: "#888",
                lineHeight: 1.6,
                margin: "16px 0 0",
                maxWidth: 480,
              }}>
                {current.subtitle}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {current.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${current.color}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <f.icon size={16} color={current.color} />
                  </div>
                  <span style={{ fontSize: ".9rem", color: "#ccc", lineHeight: 1.5, paddingTop: 5 }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {step > 0 && (
                <button
                  onClick={handlePrev}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 20px",
                    borderRadius: 8,
                    background: "none",
                    border: "1px solid #333",
                    color: "#999",
                    fontSize: ".85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={launching}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  borderRadius: 8,
                  background: isLast ? current.color : "#fff",
                  color: isLast ? "#fff" : "#000",
                  border: "none",
                  fontSize: ".9rem",
                  fontWeight: 700,
                  cursor: launching ? "wait" : "pointer",
                  opacity: launching ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {launching ? (
                  <>Loading demo…</>
                ) : isLast ? (
                  <>Launch Live Demo <ArrowRight size={16} /></>
                ) : (
                  <>Next <ChevronRight size={16} /></>
                )}
              </button>
            </div>

            {/* Step counter */}
            <div style={{ fontSize: ".75rem", color: "#444" }}>
              {step + 1} of {STEPS.length}
            </div>
          </div>

          {/* Right: mock UI */}
          {MockComponent && (
            <div style={{
              background: "#0a0a0a",
              borderRadius: 16,
              border: "1px solid #1a1a1a",
              padding: 20,
              boxShadow: `0 0 80px ${current.color}08`,
            }}>
              <MockComponent />
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div style={{
        borderTop: "1px solid #111",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}>
        <span style={{ fontSize: ".8rem", color: "#444" }}>
          Free forever for up to 5 partners · No credit card required
        </span>
        <Link
          href="/sign-up"
          style={{
            fontSize: ".8rem",
            fontWeight: 600,
            color: "#fff",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Create your account →
        </Link>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          h1 { font-size: 1.8rem !important; }
          [style*="gridTemplateColumns: 1fr 1.2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
