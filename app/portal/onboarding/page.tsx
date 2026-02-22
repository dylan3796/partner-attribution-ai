"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePortal } from "@/lib/portal-context";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  Trophy,
  BookOpen,
  Rocket,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  Target,
  DollarSign,
  Shield,
  Gift,
  Users,
  BarChart3,
  FileText,
  ExternalLink,
  ChevronRight,
  PartyPopper,
  Zap,
} from "lucide-react";

/* ── Types ── */

type OnboardingStep = {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof User;
  color: string;
};

const STEPS: OnboardingStep[] = [
  { id: "welcome", title: "Welcome", subtitle: "Get started", icon: Sparkles, color: "#6366f1" },
  { id: "profile", title: "Your Profile", subtitle: "Complete your details", icon: User, color: "#3b82f6" },
  { id: "tier", title: "Tier & Benefits", subtitle: "Understand your perks", icon: Trophy, color: "#eab308" },
  { id: "resources", title: "Resources", subtitle: "Tools to succeed", icon: BookOpen, color: "#8b5cf6" },
  { id: "first-deal", title: "First Deal", subtitle: "Register an opportunity", icon: Briefcase, color: "#22c55e" },
  { id: "done", title: "You're Ready!", subtitle: "Start earning", icon: Rocket, color: "#f43f5e" },
];

const STORAGE_KEY = "covant_onboarding_step";
const COMPLETED_KEY = "covant_onboarding_done";
const PROFILE_KEY = "covant_onboarding_profile";

/* ── Tier Benefits Data ── */

const TIER_BENEFITS = {
  bronze: {
    rate: "8%", dealReg: "Standard (48h)", mdf: "Not eligible", coSell: "Self-serve",
    training: "Basic library", support: "Community forum",
  },
  silver: {
    rate: "10%", dealReg: "Priority (24h)", mdf: "Up to $2,500/qtr", coSell: "Shared SE support",
    training: "Full library + webinars", support: "Email support",
  },
  gold: {
    rate: "12%", dealReg: "Priority (12h)", mdf: "Up to $10,000/qtr", coSell: "Dedicated SE",
    training: "Full + certification", support: "Priority email + Slack",
  },
  platinum: {
    rate: "15%", dealReg: "Instant approval", mdf: "Up to $25,000/qtr", coSell: "Dedicated team",
    training: "Full + executive briefings", support: "24/7 + named CSM",
  },
};

/* ── Resource Quicklinks ── */

const RESOURCES = [
  { title: "Partner Playbook", desc: "Step-by-step guide to your first 90 days", icon: FileText, href: "/portal/resources", color: "#3b82f6" },
  { title: "Product Catalog", desc: "Solutions, pricing, and positioning", icon: BarChart3, href: "/portal/products", color: "#22c55e" },
  { title: "Sales Enablement", desc: "Pitch decks, case studies, and battle cards", icon: Target, href: "/portal/enablement", color: "#8b5cf6" },
  { title: "Training & Certs", desc: "Earn badges and boost your tier score", icon: BookOpen, href: "/portal/resources", color: "#f59e0b" },
  { title: "MDF Programs", desc: "Apply for marketing development funds", icon: Gift, href: "/portal/mdf", color: "#f43f5e" },
  { title: "Territory Map", desc: "See your assigned regions and accounts", icon: MapPin, href: "/portal/territory", color: "#06b6d4" },
];

/* ── Step Components ── */

function WelcomeStep({ partner, onNext }: { partner: any; onNext: () => void }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem",
        boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
      }}>
        <PartyPopper size={36} style={{ color: "#fff" }} />
      </div>

      <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>
        Welcome, {partner?.contactName?.split(" ")[0] || "Partner"}!
      </h2>
      <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
        You've joined a network of top-performing partners driving revenue together.
        Let's get you set up in just a few minutes.
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem",
        marginBottom: "2rem", textAlign: "left",
      }}>
        {[
          { icon: DollarSign, label: "Earn commissions", desc: "On every deal you influence", color: "#22c55e" },
          { icon: Shield, label: "Deal protection", desc: "Register & lock your deals", color: "#3b82f6" },
          { icon: Users, label: "Co-sell support", desc: "Our team helps you close", color: "#8b5cf6" },
        ].map((item) => (
          <div key={item.label} className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: `${item.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 0.75rem", color: item.color,
            }}>
              <item.icon size={20} />
            </div>
            <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 4 }}>{item.label}</div>
            <div className="muted" style={{ fontSize: ".8rem" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 32px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff", fontWeight: 700, fontSize: "1rem",
          cursor: "pointer", transition: "all .2s",
          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
        }}
      >
        Let's Get Started <ArrowRight size={18} />
      </button>
    </div>
  );
}

function ProfileStep({
  partner,
  profile,
  setProfile,
  onNext,
  onBack,
}: {
  partner: any;
  profile: Record<string, string>;
  setProfile: (p: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const fields = [
    { key: "companyName", label: "Company Name", icon: Building2, placeholder: partner?.companyName || "Your Company", prefill: partner?.companyName },
    { key: "contactName", label: "Your Name", icon: User, placeholder: "Jane Smith", prefill: partner?.contactName },
    { key: "email", label: "Email", icon: Mail, placeholder: "jane@acme.com", prefill: partner?.contactEmail },
    { key: "phone", label: "Phone", icon: Phone, placeholder: "+1 (555) 123-4567", prefill: "" },
    { key: "website", label: "Website", icon: Globe, placeholder: "https://acme.com", prefill: partner?.website || "" },
    { key: "address", label: "Location", icon: MapPin, placeholder: "San Francisco, CA", prefill: partner?.address || "" },
  ];

  // Prefill on mount
  useEffect(() => {
    if (Object.keys(profile).length === 0) {
      const initial: Record<string, string> = {};
      fields.forEach((f) => {
        if (f.prefill) initial[f.key] = f.prefill;
      });
      setProfile(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filledCount = fields.filter((f) => profile[f.key]?.trim()).length;
  const progress = Math.round((filledCount / fields.length) * 100);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
        Complete Your Profile
      </h2>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        A complete profile helps us match you with the right opportunities and support.
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span className="muted" style={{ fontSize: ".8rem" }}>Profile completeness</span>
          <span style={{ fontSize: ".8rem", fontWeight: 700, color: progress === 100 ? "#22c55e" : "#6366f1" }}>{progress}%</span>
        </div>
        <div style={{ width: "100%", height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%", borderRadius: 3,
            background: progress === 100 ? "#22c55e" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
            transition: "width .4s ease",
          }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".85rem", fontWeight: 600, marginBottom: 6 }}>
                <Icon size={15} style={{ color: "var(--muted)" }} />
                {field.label}
              </label>
              <input
                className="input"
                type={field.key === "email" ? "email" : "text"}
                placeholder={field.placeholder}
                value={profile[field.key] || ""}
                onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button onClick={onBack} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TierStep({ partner, onNext, onBack }: { partner: any; onNext: () => void; onBack: () => void }) {
  const tier = (partner?.tier || "bronze") as keyof typeof TIER_BENEFITS;
  const benefits = TIER_BENEFITS[tier];
  const tiers = ["bronze", "silver", "gold", "platinum"] as const;
  const currentIndex = tiers.indexOf(tier);

  const TIER_COLORS: Record<string, { bg: string; fg: string; gradient: string }> = {
    bronze: { bg: "#cd7f3215", fg: "#cd7f32", gradient: "linear-gradient(135deg, #cd7f32, #b8860b)" },
    silver: { bg: "#94a3b815", fg: "#94a3b8", gradient: "linear-gradient(135deg, #94a3b8, #cbd5e1)" },
    gold: { bg: "#eab30815", fg: "#eab308", gradient: "linear-gradient(135deg, #eab308, #f59e0b)" },
    platinum: { bg: "#a78bfa15", fg: "#a78bfa", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)" },
  };

  const tc = TIER_COLORS[tier];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
        Your Tier & Benefits
      </h2>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        You're starting as a <strong style={{ textTransform: "capitalize" }}>{tier}</strong> partner. Here's what you get — and how to level up.
      </p>

      {/* Tier progress */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.25rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: tc.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 16px ${tc.fg}33`,
          }}>
            <Trophy size={28} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>
              Current Tier
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "capitalize" }}>{tier}</div>
          </div>
        </div>

        {/* Tier ladder */}
        <div style={{ display: "flex", gap: 4, marginBottom: "1rem" }}>
          {tiers.map((t, i) => (
            <div key={t} style={{
              flex: 1, height: 8, borderRadius: 4,
              background: i <= currentIndex ? TIER_COLORS[t].fg : "var(--border)",
              transition: "background .3s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {tiers.map((t) => (
            <span key={t} style={{
              fontSize: ".7rem", fontWeight: t === tier ? 700 : 500,
              textTransform: "capitalize",
              color: t === tier ? TIER_COLORS[t].fg : "var(--muted)",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Benefits grid */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Your Benefits</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { label: "Commission Rate", value: benefits.rate, icon: DollarSign, color: "#22c55e" },
            { label: "Deal Registration", value: benefits.dealReg, icon: Shield, color: "#3b82f6" },
            { label: "MDF Budget", value: benefits.mdf, icon: Gift, color: "#f43f5e" },
            { label: "Co-Sell Support", value: benefits.coSell, icon: Users, color: "#8b5cf6" },
            { label: "Training Access", value: benefits.training, icon: BookOpen, color: "#f59e0b" },
            { label: "Support Level", value: benefits.support, icon: Zap, color: "#06b6d4" },
          ].map((b) => (
            <div key={b.label} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "12px", borderRadius: 10, background: `${b.color}08`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: `${b.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: b.color, flexShrink: 0,
              }}>
                <b.icon size={16} />
              </div>
              <div>
                <div className="muted" style={{ fontSize: ".75rem", marginBottom: 2 }}>{b.label}</div>
                <div style={{ fontSize: ".85rem", fontWeight: 600 }}>{b.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next tier hint */}
      {currentIndex < 3 && (
        <div style={{
          marginTop: "1rem", padding: "12px 16px", borderRadius: 10,
          background: TIER_COLORS[tiers[currentIndex + 1]].bg,
          border: `1px solid ${TIER_COLORS[tiers[currentIndex + 1]].fg}33`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Target size={18} style={{ color: TIER_COLORS[tiers[currentIndex + 1]].fg }} />
          <span style={{ fontSize: ".85rem" }}>
            <strong>Next tier:</strong> Close more deals and increase engagement to reach{" "}
            <strong style={{ textTransform: "capitalize" }}>{tiers[currentIndex + 1]}</strong> and unlock higher commissions.
          </span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button onClick={onBack} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ResourcesStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
        Resources to Help You Succeed
      </h2>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Everything you need to start selling — pitch decks, product info, training, and more.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {RESOURCES.map((r) => (
          <Link
            key={r.title}
            href={r.href}
            className="card"
            style={{
              padding: "1.25rem", textDecoration: "none", color: "inherit",
              display: "flex", flexDirection: "column", gap: 10,
              transition: "all .15s", cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: `${r.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center", color: r.color,
              }}>
                <r.icon size={20} />
              </div>
              <ExternalLink size={14} style={{ color: "var(--muted)" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 2 }}>{r.title}</div>
              <div className="muted" style={{ fontSize: ".8rem" }}>{r.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button onClick={onBack} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function FirstDealStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
        Register Your First Deal
      </h2>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Deal registration protects your pipeline and ensures you get credit. Here's how it works:
      </p>

      {/* How it works */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem" }}>How Deal Registration Works</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            { step: 1, title: "Submit the opportunity", desc: "Enter the company name, deal size, and your contact at the account.", color: "#3b82f6" },
            { step: 2, title: "We review & approve", desc: "Our team checks for conflicts and approves within your tier's SLA.", color: "#8b5cf6" },
            { step: 3, title: "You're protected", desc: "The deal is locked to you. No other partner can claim it.", color: "#22c55e" },
            { step: 4, title: "Close & earn", desc: "When the deal closes, your commission is calculated and paid automatically.", color: "#f59e0b" },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: `${s.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: s.color, fontWeight: 800, fontSize: ".9rem", flexShrink: 0,
              }}>
                {s.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 2 }}>{s.title}</div>
                <div className="muted" style={{ fontSize: ".85rem" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="card" style={{
        padding: "1.5rem", textAlign: "center",
        background: "linear-gradient(135deg, #22c55e08, #22c55e15)",
        border: "1px solid #22c55e33",
      }}>
        <Briefcase size={32} style={{ color: "#22c55e", marginBottom: 8 }} />
        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Ready to register a deal?</h3>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
          You can register your first deal now, or come back later from the Deals page.
        </p>
        <Link
          href="/portal/deals"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 10, background: "#22c55e",
            color: "#fff", fontWeight: 700, fontSize: ".9rem",
            textDecoration: "none", transition: "all .2s",
          }}
        >
          Go to Deals <ChevronRight size={16} />
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button onClick={onBack} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function DoneStep({ partner }: { partner: any }) {
  const router = useRouter();

  function handleFinish() {
    localStorage.setItem(COMPLETED_KEY, "true");
    router.push("/portal");
  }

  return (
    <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: "linear-gradient(135deg, #22c55e, #10b981)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1.5rem",
        boxShadow: "0 8px 32px rgba(34, 197, 94, 0.3)",
      }}>
        <CheckCircle2 size={40} style={{ color: "#fff" }} />
      </div>

      <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>
        You're All Set!
      </h2>
      <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
        Your portal is ready. Start registering deals, track your commissions, and grow your partnership.
      </p>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem", textAlign: "left" }}>
        {[
          { label: "Register a Deal", href: "/portal/deals", icon: Briefcase, color: "#22c55e" },
          { label: "View Commissions", href: "/portal/commissions", icon: DollarSign, color: "#3b82f6" },
          { label: "My Performance", href: "/portal/performance", icon: BarChart3, color: "#8b5cf6" },
          { label: "Browse Resources", href: "/portal/resources", icon: BookOpen, color: "#f59e0b" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="card"
            style={{
              padding: "1rem 1.25rem", textDecoration: "none", color: "inherit",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: `${a.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: a.color, flexShrink: 0,
            }}>
              <a.icon size={18} />
            </div>
            <span style={{ fontWeight: 600, fontSize: ".9rem" }}>{a.label}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={handleFinish}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 32px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff", fontWeight: 700, fontSize: "1rem",
          cursor: "pointer", transition: "all .2s",
          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
        }}
      >
        Go to Dashboard <ArrowRight size={18} />
      </button>
    </div>
  );
}

/* ── Progress Indicator ── */

function StepIndicator({ steps, currentIndex }: { steps: OnboardingStep[]; currentIndex: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 0, marginBottom: "2.5rem",
    }}>
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              opacity: isCompleted || isCurrent ? 1 : 0.4,
              transition: "opacity .3s",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: isCompleted ? "#22c55e" : isCurrent ? step.color : "var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .3s",
                boxShadow: isCurrent ? `0 4px 12px ${step.color}33` : "none",
              }}>
                {isCompleted ? (
                  <CheckCircle2 size={20} style={{ color: "#fff" }} />
                ) : (
                  <Icon size={18} style={{ color: isCurrent ? "#fff" : "var(--muted)" }} />
                )}
              </div>
              <span style={{
                fontSize: ".7rem", fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? "var(--fg)" : "var(--muted)",
                whiteSpace: "nowrap",
              }}>
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 32, height: 2, borderRadius: 1, margin: "0 4px",
                marginBottom: 20,
                background: isCompleted ? "#22c55e" : "var(--border)",
                transition: "background .3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Page ── */

export default function PortalOnboardingPage() {
  const { partner } = usePortal();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Record<string, string>>({});

  // Load saved state
  useEffect(() => {
    const savedStep = localStorage.getItem(STORAGE_KEY);
    if (savedStep) setCurrentStep(parseInt(savedStep, 10) || 0);
    const savedProfile = localStorage.getItem(PROFILE_KEY);
    if (savedProfile) {
      try { setProfile(JSON.parse(savedProfile)); } catch {}
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(currentStep));
  }, [currentStep]);

  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  if (!partner) return null;

  const onNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const onBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 800, margin: "0 auto" }}>
      <StepIndicator steps={STEPS} currentIndex={currentStep} />

      {currentStep === 0 && <WelcomeStep partner={partner} onNext={onNext} />}
      {currentStep === 1 && <ProfileStep partner={partner} profile={profile} setProfile={setProfile} onNext={onNext} onBack={onBack} />}
      {currentStep === 2 && <TierStep partner={partner} onNext={onNext} onBack={onBack} />}
      {currentStep === 3 && <ResourcesStep onNext={onNext} onBack={onBack} />}
      {currentStep === 4 && <FirstDealStep onNext={onNext} onBack={onBack} />}
      {currentStep === 5 && <DoneStep partner={partner} />}
    </div>
  );
}
