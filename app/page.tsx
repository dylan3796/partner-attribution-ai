"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ROICalculator from "@/components/ROICalculator";

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

  // Typing animation for demo card
  const DEMO_QUERY = "Show me Q1 partner performance and recommend tier promotions";
  const [typedText, setTypedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const typingStarted = useRef(false);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typingStarted.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !typingStarted.current) {
          typingStarted.current = true;
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setTypedText(DEMO_QUERY.slice(0, i));
            if (i >= DEMO_QUERY.length) {
              clearInterval(interval);
              setTimeout(() => setShowResponse(true), 400);
            }
          }, 35);
        }
      },
      { threshold: 0.3 }
    );
    if (demoRef.current) observer.observe(demoRef.current);
    return () => observer.disconnect();
  }, []);

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
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" id="product">
        <div className="wrap">
          <div className="tag">Early Access</div>
          <h1>Stop Guessing Which Partners Drive Revenue</h1>
          <p className="subtitle" style={{ maxWidth: 680, margin: "0 auto 2.5rem" }}>
            Your partners are driving more revenue than you think. Covant shows you exactly how much — and makes sure they get paid for it, automatically.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#demo"
              className="btn btn-lg"
              style={{ textDecoration: "none" }}
            >
              See It In Action
            </a>
            <Link href="/dashboard" className="btn-outline btn-lg">
              Explore Demo →
            </Link>
          </div>

          <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem" }}>
            Free to start · Setup in 15 minutes
          </p>
        </div>

        {/* ── AI DEMO CARD ── */}
        <div className="hero-demo wrap-wide" id="demo" ref={demoRef}>
          <div className="orb"></div>
          <div className="card demo-card">
            <div className="demo-header">
              <strong>Ask Covant AI</strong>
              <span className="chip">VP Partnerships · Horizon Software</span>
            </div>
            <p className="demo-q">
              {typedText || <span style={{ opacity: 0.4 }}>Ask about attribution...</span>}
              {typedText && typedText.length < DEMO_QUERY.length && (
                <span
                  className="typing-cursor"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "1.1em",
                    background: "var(--fg)",
                    marginLeft: 2,
                    verticalAlign: "text-bottom",
                    animation: "blink 0.8s step-end infinite",
                  }}
                />
              )}
            </p>
            <div
              className="demo-response"
              style={{
                opacity: showResponse ? 1 : 0,
                maxHeight: showResponse ? 600 : 0,
                overflow: "hidden",
                transition: "opacity 0.5s ease, max-height 0.6s ease",
              }}
            >
              <div className="demo-meta">
                <span className="badge">AI</span> Analyzed 24 partners, 142 deals, 847 touchpoints
              </div>
              <div className="demo-results">
                <p>
                  <strong>TechStar Solutions (Reseller)</strong> — $124k attributed revenue (↑32%).
                  Exceeded Gold tier threshold by 40%.{" "}
                  <em>Recommend: Platinum promotion + $15k MDF increase.</em>
                </p>
                <p>
                  <strong>CloudBridge Partners (Referral)</strong> — $89k attributed, $215k pipeline
                  open. Highest first-touch conversion rate.{" "}
                  <em>Recommend: Co-sell enablement + joint webinar.</em>
                </p>
                <p>
                  <strong>3 partners flagged at-risk</strong> — No activity in 30+ days.
                  Re-engagement sequences auto-triggered via partner portal.
                </p>
              </div>
              <p className="demo-conf">
                Full report exported to dashboard · Tier promotions queued for approval ·
                Commissions recalculated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────── */}
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

      {/* ── HOW IT WORKS (3 beats) ───────────────────────── */}
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
                Add your partners
              </h3>
              <p className="muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Import your resellers and referral partners in minutes. Covant starts mapping deals automatically.
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
                We track every touchpoint
              </h3>
              <p className="muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Deal registrations, referrals, co-sell activities — every partner interaction
                is logged and linked to your deals. Full paper trail, always.
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
                Commissions calculated automatically
              </h3>
              <p className="muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                When a deal closes, attribution runs and commissions are calculated
                instantly — no manual work, no disputes. Partners get paid on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEMS ─────────────────────────────────────── */}
      <section className="problems">
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">The Problem</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Every channel team is flying blind
          </h2>
          <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.6 }}>
            You have partners driving revenue. But proving it? A pile of spreadsheets, manual reconciliation, and disputes that erode trust every quarter.
          </p>
          <div className="grid-3">
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>📊</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Spreadsheet hell</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Your partner attribution lives in 12 spreadsheets nobody trusts. Every QBR is a fight. Every quarter-end is a scramble.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>🤷</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Which partner gets credit?</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Two partners touched the same deal. You&apos;re the referee with no rulebook. The relationship damage is real.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>💸</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Payout chaos</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Manual commission calculations. Partners waiting weeks. Finance finding errors. Trust eroding every cycle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────── */}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
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

          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,.45)",
              fontSize: ".85rem",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            These pain points drove every product decision. We&apos;re building Covant
            with our early customers — not just for them.
          </p>
        </div>
      </section>

      {/* ── CRM INTEGRATION ──────────────────────────────── */}
      <section style={{ padding: "6rem 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">The Solution</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Works with what you already use
          </h2>
          <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.6 }}>
            Covant connects to your existing tools in minutes. Keep using what works — we handle the partner layer on top.
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

      {/* ── PLATFORM MODULES ─────────────────────────────── */}
      <section className="modules" id="platform">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">The Platform</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Everything your partner program needs
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Attribution that partners trust. Commissions that calculate themselves. A portal your team will actually use. All in one place.
          </p>
        </div>
        <div className="wrap-wide grid-6">
          <Link href="/dashboard/reports"><div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><span style={{ fontSize: '1.2rem' }}>🧠</span></div><h3>Attribution everyone trusts</h3><p>Every deal traced back to the partners who touched it. Transparent, auditable, and impossible to dispute.</p></div></Link>
          <Link href="/dashboard/payouts"><div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><span style={{ fontSize: '1.2rem' }}>💰</span></div><h3>Commissions that calculate themselves</h3><p>Set your rules once. Covant handles the math, the approvals, and the payouts. Partners get paid on time, every time.</p></div></Link>
          <Link href="/dashboard"><div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><span style={{ fontSize: '1.2rem' }}>📋</span></div><h3>Run your program, not spreadsheets</h3><p>Partner tiers, onboarding workflows, deal registration — everything in one place instead of scattered across docs and DMs.</p></div></Link>
          <Link href="/dashboard/deals"><div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><span style={{ fontSize: '1.2rem' }}>📊</span></div><h3>Prove partner ROI to your CFO</h3><p>See exactly which deals your partners influenced and by how much. The number you&apos;ve been trying to calculate manually.</p></div></Link>
          <Link href="/portal"><div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><span style={{ fontSize: '1.2rem' }}>🌐</span></div><h3>Partners who actually use their portal</h3><p>A self-service home for your partners. Submit deals, track commissions, access resources — without emailing your team.</p></div></Link>
          <Link href="/dashboard/activity"><div className="card module-card"><div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.8rem' }}><span style={{ fontSize: '1.2rem' }}>👁️</span></div><h3>Full transparency, zero disputes</h3><p>Every touchpoint logged. Every attribution decision auditable. When a partner asks &apos;why did I get that amount?&apos; — you have the answer.</p></div></Link>
        </div>
      </section>

      {/* ── FEATURE: ATTRIBUTION ─────────────────────────── */}
      <section className="feature">
        <div className="wrap-wide grid-2">
          <div>
            <div className="tag">AI-Powered Attribution</div>
            <h2>Attribution that partners actually trust</h2>
            <p>Choose how attribution works for your program — first touch, last touch, equal split, or your own custom rules. Every calculation is explainable. Partners see the logic. Disputes disappear.</p>
            <Link href="/dashboard/reports" className="arrow-link">Set up your attribution rules →</Link>
          </div>
          <div className="card">
            <h4 style={{ marginBottom: "1.2rem" }}>Deal: TechStar × CloudBridge</h4>
            <div className="bar-row"><span>TechStar (Reseller)</span><div className="bar"><div style={{ width: "55%" }}></div></div><span>55%</span></div>
            <div className="bar-row"><span>CloudBridge (Referral)</span><div className="bar"><div style={{ width: "30%" }}></div></div><span>30%</span></div>
            <div className="bar-row"><span>DataPipe (Integration)</span><div className="bar"><div style={{ width: "15%" }}></div></div><span>15%</span></div>
            <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem" }}>Model: Role-Based (custom weights) · <Link href="/dashboard/reports" style={{ fontWeight: 500 }}>Switch model</Link></p>
          </div>
        </div>
      </section>

      {/* ── FEATURE: ACTIVITY ────────────────────────────── */}
      <section className="feature">
        <div className="wrap-wide grid-2 grid-flip">
          <div>
            <div className="tag">Full Visibility</div>
            <h2>Every partner touchpoint, captured</h2>
            <p>Covant builds a complete picture of every partner interaction — referrals, demos, deal registrations, co-sell meetings. When a deal closes, you know exactly who did what.</p>
            <Link href="/dashboard/deals" className="arrow-link">See the full timeline →</Link>
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

      {/* ── FEATURE: INCENTIVES ──────────────────────────── */}
      <section className="feature">
        <div className="wrap-wide grid-2">
          <div>
            <div className="tag">Incentives & Payouts</div>
            <h2>Fair splits, zero manual work</h2>
            <p>Attribution drives automatic commission calculations. Partners see their earnings in real time. Finance gets clean reports. No more end-of-quarter surprises.</p>
            <Link href="/dashboard/payouts" className="arrow-link">Manage incentives →</Link>
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

      {/* ── GROW YOUR ECOSYSTEM ──────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "linear-gradient(180deg, rgba(255,255,255,.02) 0%, transparent 100%)" }}>
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">Grow Your Ecosystem</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            A partner program that grows itself
          </h2>
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>
            Most partner programs track what partners did. Covant makes partners want to do more.
          </p>
        </div>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          <div className="card" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>📈</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Engaged partners produce more</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>
              When partners can see their impact — real numbers, real deals — they sell harder. Visibility changes behavior.
            </p>
          </div>
          <div className="card" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>🎯</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Recruit better partners</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>
              Tell prospects your program pays on time, attribution is transparent, and they get a real portal. You&apos;ll win the conversation.
            </p>
          </div>
          <div className="card" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>💎</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Keep your best performers</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>
              Good partners churn when they don&apos;t trust the numbers. Transparent attribution and on-time payouts build the loyalty that compounds.
            </p>
          </div>
          <div className="card" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>🔍</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Know who to invest in</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>
              Ramp scores and pipeline data tell you who&apos;s climbing before it&apos;s obvious. Put MDF and co-sell resources behind the right partners early.
            </p>
          </div>
          <div className="card" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>🏆</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>Tiers that actually motivate</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>
              Partners can see their progress toward the next tier in real time. That visibility drives action in a way a quarterly email never will.
            </p>
          </div>
          <div className="card" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>💵</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem" }}>MDF that proves its ROI</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>
              Track what every MDF dollar produced. Stop guessing which investments worked. Reallocate to what actually drives revenue.
            </p>
          </div>
        </div>
      </section>

      {/* ── YOUR STRATEGY ────────────────────────────────── */}
      <section style={{ padding: "6rem 0" }} id="solutions">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">Your strategy, your rules</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Built for how your program actually works
          </h2>
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: 700, margin: "0 auto" }}>
            Whether you run resellers, referral networks, integration partners, or all three — Covant adapts to your program, not the other way around.
          </p>
        </div>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🏢</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Reseller Programs</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>Volume tiers, deal reg protection, MDF budgets, co-sell workflows</p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Deal registration with conflict resolution</li>
              <li>✓ Tiered commission structures</li>
              <li>✓ Volume rebates & SPIFFs</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🤝</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Referral Networks</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>Simple payouts, first-touch attribution, partner portal access</p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ One-time or recurring commissions</li>
              <li>✓ Automated payout scheduling</li>
              <li>✓ Partner self-service portal</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🔌</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Integration Partners</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>Multi-touch attribution, influence tracking, shared pipeline</p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Technical enablement tracking</li>
              <li>✓ Joint GTM campaign measurement</li>
              <li>✓ Bi-directional data sync</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>📊</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Agency & Affiliate</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>Performance-based payouts, transparent reporting, dispute workflows</p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Custom attribution models</li>
              <li>✓ Multi-currency payouts</li>
              <li>✓ White-label partner portal</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────── */}
      <section className="benefits">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>Built for partner teams who are done with spreadsheets</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 640, margin: "0 auto" }}>Whether you have 5 partners or 500, Covant gives you the visibility, automation, and trust your program needs to scale.</p>
        </div>
        <div className="wrap-wide grid-4">
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>SaaS & Tech</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5 }}>Resellers, VARs, integration partners. Track which deals your partners influenced and pay them automatically.</p>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Marketplaces & Platforms</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5 }}>App ecosystems and plugin networks. Know which partners drive platform adoption and reward the ones who actually deliver.</p>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Distribution Networks</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5 }}>Multi-tier channel programs. Attribution across distributor → reseller → customer chains, without the spreadsheet.</p>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Agencies & Services</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5 }}>Referral networks and consulting partners. Track lead quality, measure relationship value, automate the payout.</p>
          </div>
        </div>
      </section>

      {/* ── AS YOU GROW ──────────────────────────────────── */}
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
              { icon: "💰", label: "MDF Management" },
              { icon: "📈", label: "Volume Rebates" },
              { icon: "🏆", label: "Partner Tiering" },
              { icon: "🎓", label: "Certifications" },
              { icon: "🗺️", label: "Territory Management" },
              { icon: "⚖️", label: "Channel Conflict Resolution" },
              { icon: "🔀", label: "Custom Attribution Rules" },
              { icon: "🏷️", label: "White-Label Portal" },
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
                <span style={{ fontSize: ".82rem" }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0" }}>
        <div className="wrap grid-3">
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>AI-native, not AI-bolted</h3><p className="muted" style={{ lineHeight: 1.6 }}>Not a legacy tool with AI features added later. Covant was built from the ground up to make attribution automatic and payout calculations instant.</p></div>
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>15 minutes to value</h3><p className="muted" style={{ lineHeight: 1.6 }}>Connect your first integration, import your partners, and see your first report — in the time it takes to have a meeting about it.</p></div>
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>Enterprise security</h3><p className="muted" style={{ lineHeight: 1.6 }}>Your data is never used to train models. SOC 2 Type II in progress. Full audit trail on every action, every calculation.</p></div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ───────────────────────────────── */}
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

      {/* ── PRICING ──────────────────────────────────────── */}
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

            {/* ── FINAL CTA ─────────────────────────────────────── */}
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
              style={{ display: "flex", gap: ".5rem", maxWidth: 440 }}
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
            <Link href="/dashboard" className="btn-outline" style={{ whiteSpace: "nowrap" }}>
              Explore Demo →
            </Link>
          </div>
          {submitted && (
            <p style={{ marginTop: "1.2rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>
              🎉 We&apos;ll reach out within 24 hours.
            </p>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
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
              <Link href="/dashboard">Live Demo</Link>
              <Link href="/docs">API Docs</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/use-cases">Use Cases</Link>
              <Link href="/program">Partner Program</Link>
            </div>
            <div>
              <h4>Partners</h4>
              <Link href="/partners/apply">Become a Partner →</Link>
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
