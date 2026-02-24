"use client";

import { useState, ReactNode } from "react";
import { Brain, Coins, ClipboardList, BarChart2, Globe, Eye, TrendingUp, Target, Gem, Search, Trophy, Banknote, Building2, Handshake, Plug, HelpCircle, Wallet, GraduationCap, Map, Scale, GitBranch, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ROICalculator from "@/components/ROICalculator";
import InsightDemo from "@/components/InsightDemo";

// Real SVG logos for integration partners
function SalesforceLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3 7.2C14.3 5.9 15.9 5 17.7 5c2.5 0 4.7 1.6 5.5 3.9.6-.3 1.3-.5 2-.5 2.6 0 4.8 2.1 4.8 4.8 0 .5-.1 1-.2 1.4C31 15.2 32 16.8 32 18.6c0 2.7-2.2 4.8-4.8 4.8H8.8C5.6 23.4 3 20.8 3 17.6c0-2.5 1.6-4.6 3.8-5.4-.1-.4-.1-.8-.1-1.2 0-3.3 2.7-6 6-6 .6 0 .4.1.6.2z" fill="#00A1E0"/>
    </svg>
  );
}
function HubSpotLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.5V9.2c.9-.4 1.5-1.3 1.5-2.4 0-1.4-1.1-2.6-2.5-2.6S17.5 5.4 17.5 6.8c0 1.1.6 2 1.5 2.4v3.3c-1.4.2-2.7.8-3.7 1.8L6.7 8.4c.1-.2.1-.4.1-.6C6.8 6.3 5.7 5 4.3 5 2.9 5 1.8 6.1 1.8 7.6c0 1.5 1.1 2.6 2.5 2.6.4 0 .8-.1 1.1-.3l8.4 5.7C13.3 16.4 13 17.2 13 18c0 .9.3 1.8.8 2.5L9.5 24.8c-.3-.1-.6-.2-.9-.2-1.5 0-2.6 1.2-2.6 2.6 0 1.4 1.2 2.6 2.6 2.6 1.4 0 2.6-1.2 2.6-2.6 0-.4-.1-.8-.3-1.1l4.1-4.4c.9.5 1.9.8 3 .8 3.3 0 5.9-2.7 5.9-6S24.3 10.5 21 12.5z" fill="#FF7A59"/>
    </svg>
  );
}
function PipedriveLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#172432"/>
      <path d="M13 8h3.5c3.6 0 6 2.2 6 5.5S20.1 19 16.5 19H16v5h-3V8zm3 8.2c1.8 0 3-.9 3-2.7s-1.2-2.7-3-2.7H16v5.4h0z" fill="#26D068"/>
    </svg>
  );
}
function SlackLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.75 20a2.25 2.25 0 1 1-2.25-2.25H6.75V20zM8.25 20a2.25 2.25 0 1 1 4.5 0v5.75a2.25 2.25 0 1 1-4.5 0V20zM12 6.75a2.25 2.25 0 1 1 2.25-2.25V6.75H12zM12 8.25a2.25 2.25 0 1 1 0 4.5H6.25a2.25 2.25 0 1 1 0-4.5H12zM25.25 12a2.25 2.25 0 1 1 2.25 2.25H25.25V12zM23.75 12a2.25 2.25 0 1 1-4.5 0V6.25a2.25 2.25 0 1 1 4.5 0V12zM20 25.25a2.25 2.25 0 1 1-2.25 2.25V25.25H20zM20 23.75a2.25 2.25 0 1 1 0-4.5h5.75a2.25 2.25 0 1 1 0 4.5H20z" fill="#E01E5A"/>
    </svg>
  );
}

export default function LandingPage() {
  const captureLead = useMutation(api.leads.captureLead);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Demo animation is now in InsightDemo component

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Please enter your email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }
    setEmailError("");
    try {
      await captureLead({ email, source: "landing_hero" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  }

  return (
    <>
      {/* ── 1. HERO ──────────────────────────────────────── */}
      <section className="hero" id="product">
        <div className="wrap">
          <div className="tag">Early Access</div>
          <p style={{ fontSize: ".8rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(129,140,248,.8)", marginBottom: ".75rem" }}>Partner Intelligence Platform</p>
          <h1>The intelligence layer for your partner business.</h1>
          <p className="subtitle" style={{ maxWidth: 680, margin: "0 auto 2.5rem" }}>
            The rules engine between "someone did something" and "someone gets paid." Attribution, commission automation, and partner program management — built for the way modern partner programs actually work.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/demo"
              className="btn btn-lg"
              style={{ textDecoration: "none" }}
            >
              View Live Demo →
            </Link>
          </div>

          <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem" }}>
            No account required · Live demo with real data
          </p>
        </div>

        {/* ── PRODUCT PREVIEW ── */}
        <div style={{ maxWidth: 900, margin: "3rem auto 0", borderRadius: 12, overflow: "hidden", transform: "perspective(1200px) rotateX(6deg)", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
          {/* Browser chrome */}
          <div style={{ background: "#1a1a1a", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #2a2a2a" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <div style={{ flex: 1, background: "#0a0a0a", borderRadius: 6, padding: "4px 12px", fontSize: ".75rem", color: "#666", marginLeft: 8 }}>
              app.covant.ai/dashboard
            </div>
          </div>
          {/* Dashboard content */}
          <div style={{ background: "#0a0a0a", padding: "20px 24px" }}>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Partners", value: "22" },
                { label: "Pipeline", value: "$1.2M" },
                { label: "Commissions", value: "$84K" },
                { label: "Active Deals", value: "18" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ fontSize: ".7rem", color: "#666", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                </div>
              ))}
            </div>
            {/* Mini table */}
            <div style={{ border: "1px solid #222", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "8px 16px", background: "#111", fontSize: ".7rem", color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>
                <span>Partner</span><span>Tier</span><span>Revenue</span><span>Status</span>
              </div>
              {[
                { name: "TechBridge Partners", tier: "Gold", rev: "$340K", status: "Active" },
                { name: "Apex Growth Group", tier: "Silver", rev: "$215K", status: "Active" },
                { name: "Northlight Solutions", tier: "Gold", rev: "$189K", status: "Active" },
              ].map((r) => (
                <div key={r.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "10px 16px", borderTop: "1px solid #1a1a1a", fontSize: ".8rem", color: "#ccc" }}>
                  <span style={{ color: "#fff", fontWeight: 500 }}>{r.name}</span>
                  <span>{r.tier}</span>
                  <span>{r.rev}</span>
                  <span style={{ color: "#22c55e" }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI DEMO CARD ── */}
        <div className="hero-demo wrap-wide" id="demo">
          <InsightDemo />
        </div>
      </section>

      {/* ── 2. TRUST BAR ─────────────────────────────────── */}
      <section className="trust-bar">
        <div className="wrap">
          <div className="trust-bar-inner">
            <div className="trust-stat">
              <span className="trust-stat-value">20+</span>
              <span className="trust-stat-label">channel leaders who shaped this product</span>
            </div>
            <div style={{ width: 1, height: 32, background: "var(--border)" }} />
            <div className="trust-stat">
              <span className="trust-stat-value">Zero</span>
              <span className="trust-stat-label">spreadsheets required for partner attribution</span>
            </div>
            <div style={{ width: 1, height: 32, background: "var(--border)" }} />
            <div className="trust-stat">
              <span className="trust-stat-value">15 min</span>
              <span className="trust-stat-label">average time to first attribution report</span>
            </div>
            <div style={{ width: 1, height: 32, background: "var(--border)" }} />
            <div className="trust-stat">
              <span className="trust-stat-value">100%</span>
              <span className="trust-stat-label">of payouts calculated automatically</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SOCIAL PROOF ──────────────────────────────── */}
      <section className="testimonial-strip">
        <div className="wrap">
          <p
            style={{
              textAlign: "center",
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.4)",
              marginBottom: "2rem",
            }}
          >
            What we&apos;re hearing from early access conversations
          </p>

          <div className="grid-testimonials" style={{ marginBottom: "2.5rem" }}>
            {[
              {
                quote:
                  "Every QBR turns into a fight about attribution. Nobody trusts the spreadsheet.",
                freq: "Heard in 8 of 10 early conversations",
              },
              {
                quote:
                  "We know partners are driving revenue — we just can't prove it to the CFO.",
                freq: "Heard in 6 of 10 early conversations",
              },
              {
                quote:
                  "Commission disputes are killing partner trust. I'm a referee, not a program manager.",
                freq: "Heard in 7 of 10 early conversations",
              },
            ].map(({ quote, freq }) => (
              <div
                key={freq}
                style={{
                  padding: "1.25rem 1.5rem",
                  background: "rgba(255,255,255,.06)",
                  borderRadius: 12,
                  borderLeft: "3px solid rgba(129,140,248,.6)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,.85)",
                    fontSize: ".95rem",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                    marginBottom: ".75rem",
                  }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
                <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".78rem" }}>{freq}</p>
              </div>
            ))}
          </div>

          {/* removed */}
        </div>
      </section>

      {/* ── 4. PLATFORM MODULES ──────────────────────────── */}
      <section className="modules" id="platform">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">The Platform</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Everything your partner program needs
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Attribution, commissions, and a portal your team will actually use — all in one place.
          </p>
        </div>
        <div className="wrap-wide grid-6">
          <div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><Brain size={20} strokeWidth={1.5} /></div><h3>First-touch & multi-touch attribution</h3><p>Choose your model — first-touch, last-touch, or multi-touch. Every deal traced back, auditable, zero attribution disputes.</p></div>
          <div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><Coins size={20} strokeWidth={1.5} /></div><h3>Tier-based incentives & MDF tracking</h3><p>Configure commission tiers, SPIFFs, and MDF (marketing development funds). Payouts calculated automatically.</p></div>
          <div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><ClipboardList size={20} strokeWidth={1.5} /></div><h3>Deal registration & tier qualification</h3><p>Deal reg with conflict resolution, tier qualification rules, and partner onboarding — one place, not scattered docs.</p></div>
          <div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><BarChart2 size={20} strokeWidth={1.5} /></div><h3>Co-selling pipeline & partner ROI</h3><p>Track co-sell deals, measure partner-influenced pipeline, and prove ROI to your CFO with real numbers.</p></div>
          <div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><Globe size={20} strokeWidth={1.5} /></div><h3>Self-service partner portal</h3><p>Partners register deals, track commissions, and access co-branded assets — no more email chains.</p></div>
          <div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><Eye size={20} strokeWidth={1.5} /></div><h3>Full transparency, zero disputes</h3><p>Every touchpoint logged. Attribution disputes resolved automatically. Every decision auditable.</p></div>
          <div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><Sparkles size={20} strokeWidth={1.5} /></div><h3>AI Partner Recommendations</h3><p>Covant analyzes your historical deal data to recommend which partners to engage for each new opportunity.</p></div>
        </div>
      </section>

      {/* ── 5. ROI CALCULATOR ────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#000" }} id="roi">
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="tag">Calculate Your ROI</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#fff" }}>
              See What Covant Is Worth to You
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#a0a0a0", maxWidth: 640, margin: "0 auto" }}>
              Most customers see 8–12x ROI in the first year. Calculate yours.
            </p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* ── 6. HOW IT WORKS ──────────────────────────────── */}
      <section style={{ padding: "6rem 0" }} id="how-it-works">
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">How It Works</div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-.02em",
              marginBottom: "3.5rem",
            }}
          >
            Three steps. Zero spreadsheets.
          </h2>

          <div className="grid-3">
            <div className="card" style={{ textAlign: "left", padding: "2rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#1a1a2e",
                  border: "1px solid #2a2a4a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#818cf8",
                  marginBottom: "1.25rem",
                }}
              >
                1
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: ".6rem", fontSize: "1.1rem" }}>
                Connect your stack
              </h3>
              <p className="muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Import partners from your CRM and set attribution rules. Covant maps every partner to every deal from day one.
              </p>
            </div>

            <div className="card" style={{ textAlign: "left", padding: "2rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#1a1a2e",
                  border: "1px solid #2a2a4a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#818cf8",
                  marginBottom: "1.25rem",
                }}
              >
                2
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: ".6rem", fontSize: "1.1rem" }}>
                Every touchpoint, automatically attributed
              </h3>
              <p className="muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Every partner interaction — logged, linked, and weighted. Overlapping deals split by your rules, not gut feel.
              </p>
            </div>

            <div className="card" style={{ textAlign: "left", padding: "2rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#1a1a2e",
                  border: "1px solid #2a2a4a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#818cf8",
                  marginBottom: "1.25rem",
                }}
              >
                3
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: ".6rem", fontSize: "1.1rem" }}>
                Partners get paid. CFO gets proof.
              </h3>
              <p className="muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Commissions calculated automatically. Partners see earnings in real time, finance gets clean reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CRM INTEGRATION ───────────────────────────── */}
      <section style={{ padding: "6rem 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">The Solution</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Works with what you already use
          </h2>
          <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.6 }}>
            Connects to your existing tools in minutes. We handle the partner layer on top.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "rgba(255,255,255,.08)" }}><SalesforceLogo /></div>
              <span className="integration-logo-name">Salesforce</span>
            </div>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "rgba(255,255,255,.08)" }}><HubSpotLogo /></div>
              <span className="integration-logo-name">HubSpot</span>
            </div>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "rgba(255,255,255,.08)" }}><PipedriveLogo /></div>
              <span className="integration-logo-name">Pipedrive</span>
            </div>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "rgba(255,255,255,.08)" }}><SlackLogo /></div>
              <span className="integration-logo-name">Slack</span>
            </div>
            <div className="integration-logo" style={{ border: "1px dashed rgba(255,255,255,.15)" }}>
              <div className="integration-logo-icon" style={{ background: "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <span className="integration-logo-name">REST API</span>
            </div>
          </div>
          <p className="muted" style={{ fontSize: ".8rem", marginTop: "1.5rem" }}>
            Connect in minutes &nbsp;·&nbsp; No rip-and-replace required
          </p>
        </div>
      </section>

      {/* ── 8. FEATURE DEEP-DIVES ────────────────────────── */}
      <section className="feature">
        <div className="wrap-wide grid-2">
          <div>
            <div className="tag">AI-Powered Attribution</div>
            <h2>Attribution that partners actually trust</h2>
            <p>Choose from first-touch, last-touch, or multi-touch models. Configure once, apply automatically. Every calculation explainable — attribution disputes disappear.</p>
          </div>
          <div className="card">
            <h4 style={{ marginBottom: "1.2rem" }}>Deal: TechStar × CloudBridge</h4>
            <div className="bar-row"><span>TechStar (Reseller)</span><div className="bar"><div style={{ width: "55%" }}></div></div><span>55%</span></div>
            <div className="bar-row"><span>CloudBridge (Referral)</span><div className="bar"><div style={{ width: "30%" }}></div></div><span>30%</span></div>
            <div className="bar-row"><span>DataPipe (Integration)</span><div className="bar"><div style={{ width: "15%" }}></div></div><span>15%</span></div>
            <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem" }}>Model: Role-Based (custom weights)</p>
          </div>
        </div>
      </section>

      <section className="feature">
        <div className="wrap-wide grid-2 grid-flip">
          <div>
            <div className="tag">Full Visibility</div>
            <h2>Every partner touchpoint, captured</h2>
            <p>Every partner interaction — referrals, demos, deal reg, co-sell — logged and linked. When a deal closes, you know who did what.</p>
          </div>
          <div className="card">
            <div className="timeline">
              <div className="tl-item"><div className="tl-dot"></div><div><strong>TechStar registered the deal</strong><br /><small>Jan 15 · Deal registration</small></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div><strong>CloudBridge ran a technical demo</strong><br /><small>Jan 22 · Co-sell activity</small></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div><strong>DataPipe completed integration</strong><br /><small>Jan 28 · Technical enablement</small></div></div>
              <div className="tl-item"><div className="tl-dot active"></div><div><strong>Deal closed · $50,000 ARR</strong><br /><small>Feb 1 · Attribution calculated · Commissions queued</small></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature">
        <div className="wrap-wide grid-2">
          <div>
            <div className="tag">Incentives & Payouts</div>
            <h2>Fair splits, zero manual work</h2>
            <p>Attribution drives automatic commission calculations. Tier-based payouts, MDF allocations, and SPIFFs — no more end-of-quarter surprises.</p>
          </div>
          <div className="card">
            <h4 style={{ marginBottom: "1rem" }}>January Partner Payouts</h4>
            <div className="payout"><div className="avatar">TS</div><span>TechStar Solutions</span><strong>$12,450</strong></div>
            <div className="payout"><div className="avatar">CB</div><span>CloudBridge Partners</span><strong>$8,920</strong></div>
            <div className="payout"><div className="avatar">DP</div><span>DataPipe Agency</span><strong>$5,630</strong></div>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".85rem" }}>Total: $26,700 · Based on role-based attribution · Auto-approved</p>
          </div>
        </div>
      </section>

      {/* ── 9. WHO IT'S FOR (consolidated) ────────────────── */}
      <section style={{ padding: "6rem 0" }} id="solutions">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">Your strategy, your rules</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Built for how your program actually works
          </h2>
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: 700, margin: "0 auto" }}>
            Covant adapts to your program, not the other way around.
          </p>
        </div>
        <div className="wrap-wide grid-strategy" style={{ gap: "2rem" }}>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}><Building2 size={24} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Reseller Programs</h3>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Deal registration with conflict resolution</li>
              <li>✓ Tiered commission structures</li>
              <li>✓ Volume rebates & SPIFFs</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}><Handshake size={24} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Referral Networks</h3>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ One-time or recurring commissions</li>
              <li>✓ Automated payout scheduling</li>
              <li>✓ Partner self-service portal</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}><Plug size={24} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Integration Partners</h3>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Technical enablement tracking</li>
              <li>✓ Joint GTM campaign measurement</li>
              <li>✓ Bi-directional data sync</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}><BarChart2 size={24} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Agency & Affiliate</h3>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Custom attribution models</li>
              <li>✓ Multi-currency payouts</li>
              <li>✓ White-label partner portal</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 10. AS YOU GROW ──────────────────────────────── */}
      <section
        style={{
          padding: "4rem 0",
          borderTop: "1px solid rgba(255,255,255,.06)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          background: "rgba(255,255,255,.02)",
        }}
      >
        <div className="wrap" style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "rgba(255,255,255,.55)",
              marginBottom: ".5rem",
              letterSpacing: "-.01em",
            }}
          >
            Covant grows with your program
          </h3>
          <p
            style={{
              fontSize: ".85rem",
              color: "rgba(255,255,255,.3)",
              marginBottom: "1.75rem",
              maxWidth: 440,
              margin: "0 auto 1.75rem",
            }}
          >
            Start with attribution and payouts. Unlock more as your partner program scales.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: ".5rem",
              justifyContent: "center",
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {[
              { icon: <Coins size={14} strokeWidth={1.5} />, label: "MDF Management" },
              { icon: <TrendingUp size={14} strokeWidth={1.5} />, label: "Volume Rebates" },
              { icon: <Trophy size={14} strokeWidth={1.5} />, label: "Partner Tiering" },
              { icon: <GraduationCap size={14} strokeWidth={1.5} />, label: "Certifications" },
              { icon: <Map size={14} strokeWidth={1.5} />, label: "Territory Management" },
              { icon: <Scale size={14} strokeWidth={1.5} />, label: "Channel Conflict Resolution" },
              { icon: <GitBranch size={14} strokeWidth={1.5} />, label: "Custom Attribution Rules" },
              { icon: <Tag size={14} strokeWidth={1.5} />, label: "White-Label Portal" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".35rem",
                  padding: ".3rem .8rem",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                  borderRadius: 20,
                  fontSize: ".78rem",
                  color: "rgba(255,255,255,.35)",
                }}
              >
                {icon}
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. TRUST ────────────────────────────────────── */}
      <section style={{ padding: "6rem 0" }}>
        <div className="wrap grid-3">
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>AI-native, not AI-bolted</h3><p className="muted" style={{ lineHeight: 1.6 }}>Built from the ground up for automatic attribution and instant payout calculations.</p></div>
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>15 minutes to value</h3><p className="muted" style={{ lineHeight: 1.6 }}>First integration to first report — faster than a meeting about it.</p></div>
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>Enterprise security</h3><p className="muted" style={{ lineHeight: 1.6 }}>Data never used for training. SOC 2 Type II in progress. Full audit trail on every action.</p></div>
        </div>
      </section>

      {/* ── 12. PRICING CTA ──────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "#000" }} id="pricing">
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">Pricing</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#fff" }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: "1rem", color: "#666", maxWidth: 480, margin: "0 auto 2.5rem" }}>
            Starter · Growth · Enterprise. 14-day free trial on all plans. No credit card required.
          </p>
          <Link href="/pricing" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontSize: "1rem", padding: ".9rem 2.25rem" }}>
            See Pricing →
          </Link>
        </div>
      </section>

      {/* ── 13. FINAL CTA ────────────────────────────────── */}
      <section className="cta">
        <div className="wrap">
          <h2>Your partners are driving revenue. Start proving it.</h2>
          <p className="subtitle">
            Add the attribution layer. Calculate commissions automatically.
            Give your partners a portal they&apos;ll actually use.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <form
              onSubmit={handleWaitlist}
              className="cta-form"
            >
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  required
                />
                {emailError && (
                  <p
                    style={{
                      position: "absolute",
                      bottom: -20,
                      left: 0,
                      fontSize: ".75rem",
                      color: "#dc2626",
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn"
                disabled={submitted}
                style={{ whiteSpace: "nowrap" }}
              >
                {submitted ? "✓ We'll be in touch!" : "Get Early Access"}
              </button>
            </form>
            <Link href="/demo" className="btn-outline" style={{ whiteSpace: "nowrap" }}>
              View Live Demo →
            </Link>
          </div>
          {submitted && (
            <p style={{ marginTop: "1.2rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>
              🎉 We&apos;ll reach out within 24 hours.
            </p>
          )}
        </div>
      </section>

      {/* ── 14. FOOTER ───────────────────────────────────── */}
      <footer className="site-footer">
        <div className="wrap-wide footer-grid">
          <div>
            <span className="logo" style={{ color: "white" }}>
              Covant
            </span>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".8rem", lineHeight: 1.6 }}>
              Track attribution.
              <br />
              Calculate commissions.
              <br />
              Pay your partners on time.
            </p>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".75rem" }}>
              © 2026 Covant, Inc.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <Link href="/dashboard/reports">Attribution</Link>
              <Link href="/dashboard/payouts">Payouts</Link>
              <Link href="/dashboard/deals">Deals</Link>
              <Link href="/portal">Partner Portal</Link>
              <Link href="/dashboard/integrations">Integrations</Link>
            </div>
            <div>
              <h4>Resources</h4>
              <Link href="/demo">Live Demo</Link>
              <Link href="/docs">API Docs</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/use-cases">Use Cases</Link>
            </div>
            <div>
              <h4>Partners</h4>
              <Link href="/portal">Partner Portal</Link>
              <Link href="/portal/resources">Resource Hub</Link>
            </div>
            <div>
              <h4>Company</h4>
              <a href="mailto:hello@covant.ai">About</a>
              <a href="mailto:hello@covant.ai">Careers</a>
              <a href="mailto:hello@covant.ai">Contact</a>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
