"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import PricingTiers from "@/components/PricingTiers";
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
    } catch (error) {
      console.error("Failed to capture lead:", error);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  }

  return (
    <>
      {/* Early Access Banner */}
      <div style={{
        background: "#0f172a",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        padding: ".6rem 1rem",
        textAlign: "center",
        fontSize: ".82rem",
        color: "rgba(255,255,255,.7)",
        letterSpacing: ".01em",
      }}>
        🛠️ <strong style={{ color: "#fff" }}>Early Access</strong> — We&apos;re building PartnerBase directly with our first customers. No corporate BS, just your feedback shaping the product.{" "}
        <a href="mailto:hello@partnerbase.app" style={{ color: "#818cf8", textDecoration: "underline", fontWeight: 500 }}>
          Work with us →
        </a>
      </div>

      {/* Hero */}
      <section className="hero" id="product">
        <div className="wrap">
          <div className="tag">Partner Intelligence Platform</div>
          <h1>Stop Guessing Which Partners Drive Revenue</h1>
          <p className="subtitle" style={{ maxWidth: 620, margin: "0 auto 2.5rem" }}>
            PartnerBase is the partner intelligence layer for your CRM — measuring partner ROI, automating commissions, and giving your channel team a single source of truth.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: ".75rem" }}>
            <form onSubmit={handleWaitlist} style={{ display: "flex", gap: ".5rem", maxWidth: 440 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="input"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  required
                />
                {emailError && <p style={{ position: "absolute", bottom: -20, left: 0, fontSize: ".75rem", color: "#dc2626" }}>{emailError}</p>}
              </div>
              <button type="submit" className="btn" disabled={submitted} style={{ whiteSpace: "nowrap" }}>
                {submitted ? "✓ We'll be in touch!" : "Book a Demo"}
              </button>
            </form>
            <Link href="/dashboard" className="btn-outline" style={{ whiteSpace: "nowrap" }}>
              Explore Demo →
            </Link>
          </div>
          {!submitted && (
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".85rem" }}>No credit card required · 14-day free trial · Setup in 15 minutes</p>
          )}
          {submitted && (
            <p style={{ marginTop: "1.2rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>
              🎉 Demo request received! We&apos;ll reach out within 24 hours.
            </p>
          )}
        </div>

        <div className="hero-demo wrap-wide" ref={demoRef}>
          <div className="orb"></div>
          <div className="card demo-card">
            <div className="demo-header">
              <strong>Partner AI</strong>
              <span className="chip">VP Partnerships · Acme Inc</span>
            </div>
            <p className="demo-q">
              {typedText || <span style={{ opacity: 0.4 }}>Ask about attribution...</span>}
              {typedText && typedText.length < DEMO_QUERY.length && (
                <span className="typing-cursor" style={{ display: "inline-block", width: 2, height: "1.1em", background: "var(--fg)", marginLeft: 2, verticalAlign: "text-bottom", animation: "blink 0.8s step-end infinite" }} />
              )}
            </p>
            <div className="demo-response" style={{ opacity: showResponse ? 1 : 0, maxHeight: showResponse ? 600 : 0, overflow: "hidden", transition: "opacity 0.5s ease, max-height 0.6s ease" }}>
              <div className="demo-meta"><span className="badge">AI</span> Analyzed 24 partners, 142 deals, 847 touchpoints</div>
              <div className="demo-results">
                <p><strong>TechStar Solutions (Reseller)</strong> — $124k attributed revenue (↑32%). Exceeded Gold tier threshold by 40%. <em>Recommend: Platinum promotion + $15k MDF increase.</em></p>
                <p><strong>CloudBridge Partners (Referral)</strong> — $89k attributed, $215k pipeline open. Highest first-touch conversion rate. <em>Recommend: Co-sell enablement + joint webinar.</em></p>
                <p><strong>3 partners flagged at-risk</strong> — No activity in 30+ days. Re-engagement sequences auto-triggered via partner portal.</p>
              </div>
              <p className="demo-conf">Full report exported to dashboard · Tier promotions queued for approval · Incentives recalculated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar / By the numbers */}
      <section className="trust-bar">
        <div className="wrap">
          <div className="trust-bar-inner">
            <div className="trust-stat">
              <span className="trust-stat-value">20+</span>
              <span className="trust-stat-label">channel leaders who shaped this product</span>
            </div>
            <div style={{ width: 1, height: 32, background: "var(--border)" }} />
            <div className="trust-stat">
              <span className="trust-stat-value">5</span>
              <span className="trust-stat-label">AI attribution models, fully auditable</span>
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

      {/* Problems — establish pain before solution */}
      <section className="problems">
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">The Problem</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Every channel team is flying blind
          </h2>
          <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.6 }}>
            You have partners. You have a CRM. But between them? A pile of spreadsheets, manual reconciliation, and disputes that erode trust every quarter.
          </p>
          <div className="grid-3">
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>📊</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Spreadsheet hell</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Partner attribution scattered across 12 spreadsheets. Nobody trusts the numbers. Every QBR is a fire drill.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>🤷</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Which partner gets credit?</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Multiple partners touched the same deal. You&apos;re the referee with no data. Disputes erode trust.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>💸</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Payout chaos</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Commissions calculated manually. Partners wait weeks. Finance flags errors. Everyone&apos;s frustrated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CRM Integration — the solution positioning */}
      <section style={{ padding: "5rem 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">The Solution</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Plugs into your stack, not the other way around
          </h2>
          <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.6 }}>
            Keep using Salesforce, HubSpot, or Pipedrive. PartnerBase layers partner intelligence on top — measuring influence, calculating attribution, and automating payouts based on YOUR rules.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "#e8f4fc" }}>
                <SalesforceLogo />
              </div>
              <span className="integration-logo-name">Salesforce</span>
            </div>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "#fff3ef" }}>
                <HubSpotLogo />
              </div>
              <span className="integration-logo-name">HubSpot</span>
            </div>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "#ecfdf5" }}>
                <PipedriveLogo />
              </div>
              <span className="integration-logo-name">Pipedrive</span>
            </div>
            <div className="integration-logo">
              <div className="integration-logo-icon" style={{ background: "#fef2f2" }}>
                <SlackLogo />
              </div>
              <span className="integration-logo-name">Slack</span>
            </div>
            <div className="integration-logo" style={{ border: "1px dashed var(--border)" }}>
              <div className="integration-logo-icon" style={{ background: "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <span className="integration-logo-name">REST API</span>
            </div>
          </div>
          <p className="muted" style={{ fontSize: ".8rem", marginTop: "1.5rem", textAlign: "center" }}>
            Native Salesforce integration via API &nbsp;·&nbsp; AppExchange listing in progress (Q2 2026)
          </p>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="modules" id="platform">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">The Platform</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            The partner ops platform that doesn&apos;t replace your stack
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Bring your CRM data, we add the partner intelligence. Attribution, incentives, program management, and a partner portal — all layered on top of your existing tools.
          </p>
        </div>
        <div className="wrap-wide grid-6">
          <Link href="/dashboard/reports"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>🧠</p><h3>AI Attribution</h3><p>5 built-in models plus custom attribution rules you define. Transparent, auditable, and trusted by every partner.</p></div></Link>
          <Link href="/dashboard/payouts"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>💰</p><h3>Incentives & Payouts</h3><p>Auto-calculated commissions, tiered structures, SPIFs, bonuses, and one-click payouts. Partners get paid on time.</p></div></Link>
          <Link href="/dashboard"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>📋</p><h3>Program Management</h3><p>Partner tiers, onboarding workflows, certifications, territory assignments. Run your program, not spreadsheets.</p></div></Link>
          <Link href="/dashboard/deals"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>📊</p><h3>Partner-Influenced Revenue</h3><p>See which CRM deals your partners influenced. Deal registration, co-sell tracking, and attribution on every opportunity.</p></div></Link>
          <Link href="/portal"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>🌐</p><h3>Partner Portal</h3><p>Self-service portal for partners to submit leads, register deals for approval, track their influence on CRM deals, and view commissions.</p></div></Link>
          <Link href="/dashboard/activity"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>👁️</p><h3>Activity & Paper Trail</h3><p>Every touchpoint, every interaction, every decision — logged and auditable. Full transparency for partners and your team.</p></div></Link>
        </div>
      </section>

      {/* Feature: Attribution */}
      <section className="feature">
        <div className="wrap-wide grid-2">
          <div>
            <div className="tag">AI-Powered Attribution</div>
            <h2>Attribution that partners actually trust</h2>
            <p>Choose from 5 built-in attribution models — or build your own custom rules. Every calculation is explainable and auditable.</p>
            <p>When a deal closes in your CRM, partners see exactly <em>why</em> they received their share. No black boxes. No disputes.</p>
            <Link href="/dashboard/reports" className="arrow-link">Explore attribution models →</Link>
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

      {/* Feature: Activity Tracking */}
      <section className="feature">
        <div className="wrap-wide grid-2 grid-flip">
          <div>
            <div className="tag">Full Visibility</div>
            <h2>Every partner touchpoint, captured</h2>
            <p>PartnerBase tracks all partner interactions across your ecosystem — referrals, demos, co-sell meetings, content shares, deal registrations. The complete paper trail layered on top of your CRM deals.</p>
            <p>Partners see their activity history. Your team sees the full picture. Everyone stays aligned.</p>
            <Link href="/dashboard/deals/d_001" className="arrow-link">View deal timelines →</Link>
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

      {/* Feature: Incentives */}
      <section className="feature">
        <div className="wrap-wide grid-2">
          <div>
            <div className="tag">Incentives & Payouts</div>
            <h2>Fair splits, zero manual work</h2>
            <p>Attribution powers automatic commission calculations. Set up tiered structures, SPIFs, bonuses — then let the platform handle the rest.</p>
            <p>Partners see pending and paid commissions in real time. Finance gets clean reports. No more end-of-month scrambles.</p>
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

      {/* Early Adopter Validation Strip */}
      <section className="testimonial-strip">
        <div className="wrap">
          <p style={{ textAlign: "center", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: "2rem" }}>
            What we&apos;re hearing from early access conversations
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            <div style={{ padding: "1.25rem 1.5rem", background: "rgba(255,255,255,.06)", borderRadius: 12, borderLeft: "3px solid rgba(129,140,248,.6)" }}>
              <p style={{ color: "rgba(255,255,255,.85)", fontSize: ".95rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: ".75rem" }}>
                &ldquo;Every QBR turns into a fight about attribution. Nobody trusts the spreadsheet.&rdquo;
              </p>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".78rem" }}>Heard in 8 of 10 early conversations</p>
            </div>
            <div style={{ padding: "1.25rem 1.5rem", background: "rgba(255,255,255,.06)", borderRadius: 12, borderLeft: "3px solid rgba(129,140,248,.6)" }}>
              <p style={{ color: "rgba(255,255,255,.85)", fontSize: ".95rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: ".75rem" }}>
                &ldquo;We know partners are driving revenue — we just can&apos;t prove it to the CFO.&rdquo;
              </p>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".78rem" }}>Heard in 6 of 10 early conversations</p>
            </div>
            <div style={{ padding: "1.25rem 1.5rem", background: "rgba(255,255,255,.06)", borderRadius: 12, borderLeft: "3px solid rgba(129,140,248,.6)" }}>
              <p style={{ color: "rgba(255,255,255,.85)", fontSize: ".95rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: ".75rem" }}>
                &ldquo;Commission disputes are killing partner trust. I&apos;m a referee, not a program manager.&rdquo;
              </p>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".78rem" }}>Heard in 7 of 10 early conversations</p>
            </div>
          </div>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,.45)", fontSize: ".85rem", maxWidth: 560, margin: "0 auto" }}>
            These pain points drove every product decision. We&apos;re building PartnerBase with our early customers — not just for them.
          </p>
        </div>
      </section>

      {/* Your Strategy Section */}
      <section style={{ padding: "5rem 0" }} id="solutions">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">Your strategy, your rules</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Configure PartnerBase to Match Your Playbook
          </h2>
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: 700, margin: "0 auto" }}>
            Every company runs partnerships differently. We give you the tools to design your program exactly how you want it.
          </p>
        </div>

        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🏢</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Reseller Programs</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Volume tiers, deal reg protection, MDF budgets, co-sell workflows
            </p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Deal registration with conflict resolution</li>
              <li>✓ Tiered commission structures</li>
              <li>✓ Volume rebates & SPIFFs</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🤝</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Referral Networks</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Simple payouts, first-touch attribution, partner portal access
            </p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ One-time or recurring commissions</li>
              <li>✓ Automated payout scheduling</li>
              <li>✓ Partner self-service portal</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🔌</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Integration Partners</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Multi-touch attribution, influence tracking, shared pipeline
            </p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Technical enablement tracking</li>
              <li>✓ Joint GTM campaign measurement</li>
              <li>✓ Bi-directional data sync</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>📊</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Agency & Affiliate</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Performance-based payouts, transparent reporting, dispute workflows
            </p>
            <ul style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>✓ Custom attribution models</li>
              <li>✓ Multi-currency payouts</li>
              <li>✓ White-label partner portal</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Fully Customizable */}
      <section className="customizable" id="customizable">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">Fully Customizable</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>Configure for your workflow — not the other way around</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>Every partnerships org operates differently. PartnerBase layers onto your existing CRM and adapts to your process — toggle features on or off, choose your complexity level, and enable only what you need.</p>
        </div>

        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "4rem" }}>
          <div className="card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
            <p style={{ fontSize: "2rem", marginBottom: ".8rem" }}>🎛️</p>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem", fontSize: "1.05rem" }}>Toggle Complexity</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5 }}>Simple, Standard, or Advanced — toggle complexity based on your team&apos;s needs. No unused features cluttering the UI.</p>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
            <p style={{ fontSize: "2rem", marginBottom: ".8rem" }}>✅</p>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem", fontSize: "1.05rem" }}>Enable Only What You Use</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5 }}>12 toggleable feature modules — from scoring to certifications to MCP integration. Turn on what matters, turn off what doesn&apos;t.</p>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
            <p style={{ fontSize: "2rem", marginBottom: ".8rem" }}>📈</p>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem", fontSize: "1.05rem" }}>Works for 5 Partners or 500</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5 }}>Simple tracking to enterprise-grade attribution. Built for YOUR partner program, not a generic template.</p>
          </div>
        </div>

        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div className="card" style={{ border: "2px solid #e5e7eb", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#6366f1" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <span className="badge" style={{ background: "#eef2ff", color: "#4338ca", marginBottom: ".5rem", display: "inline-block" }}>Simple Mode</span>
                <h3 style={{ fontWeight: 700, fontSize: "1.15rem" }}>Lean partner tracking</h3>
              </div>
              <span style={{ fontSize: "1.5rem" }}>🎯</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {["Partner directory & contacts", "Basic deal attribution", "Simple commission payouts"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                  <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: ".9rem" }}>{f}</span>
                </div>
              ))}
              {["Scoring & tier management", "Certifications & badges", "MCP / API integrations"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8, opacity: 0.4 }}>
                  <span style={{ color: "var(--muted)" }}>—</span>
                  <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>{f}</span>
                </div>
              ))}
            </div>
            <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem", fontStyle: "italic" }}>Perfect for small teams getting started with partner tracking</p>
          </div>

          <div className="card" style={{ border: "2px solid var(--fg)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--fg)" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <span className="badge" style={{ marginBottom: ".5rem", display: "inline-block" }}>Advanced Mode</span>
                <h3 style={{ fontWeight: 700, fontSize: "1.15rem" }}>Full-power partner platform</h3>
              </div>
              <span style={{ fontSize: "1.5rem" }}>⚡</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {["Everything in Simple, plus:", "Multi-model AI attribution (5 models)", "Partner scoring & tier automation", "Certifications, badges & training", "MCP integration & API access", "Deal registration & dispute workflows"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                  <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: ".9rem" }}>{f}</span>
                </div>
              ))}
            </div>
            <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem", fontStyle: "italic" }}>Enterprise-grade for complex multi-tier partner programs</p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="benefits">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>Built for how you run partnerships</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 640, margin: "0 auto" }}>Whether you manage channel partners, alliances, resellers, or referral networks — one intelligence layer sits on top of your CRM and adapts to your motion.</p>
        </div>
        <div className="wrap-wide grid-4">
          <div className="card" style={{ background: "var(--bg)" }}>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>SaaS Channel</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5, marginBottom: ".5rem" }}>Resellers, VARs, co-sell partners. Measure partner-influenced ARR on your Salesforce or HubSpot deals.</p>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", fontStyle: "italic" }}>Salesforce, HubSpot, AWS</p>
          </div>
          <div className="card" style={{ background: "var(--bg)" }}>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Marketplaces</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5, marginBottom: ".5rem" }}>App ecosystems and plugin marketplaces. Measure which partners drive platform adoption.</p>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", fontStyle: "italic" }}>Shopify, Atlassian, Stripe</p>
          </div>
          <div className="card" style={{ background: "var(--bg)" }}>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Distribution</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5, marginBottom: ".5rem" }}>Multi-tier channel networks. Attribution across distributor → reseller → end customer chains.</p>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", fontStyle: "italic" }}>Dell, Cisco, HP</p>
          </div>
          <div className="card" style={{ background: "var(--bg)" }}>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Agencies & Services</h3>
            <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.5, marginBottom: ".5rem" }}>Referral networks and consulting partners. Track lead quality and relationship value.</p>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", fontStyle: "italic" }}>Deloitte, boutique agencies</p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section style={{ padding: "5rem 0" }}>
        <div className="wrap grid-3">
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>AI-native, not AI-bolted</h3><p className="muted" style={{ lineHeight: 1.6 }}>Not a legacy PRM with AI tacked on. Built from the ground up for the AI era. Attribution is the brain, not a feature.</p></div>
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>15 minutes to value</h3><p className="muted" style={{ lineHeight: 1.6 }}>Connect your CRM, import partners, and see your first partner attribution report. Onboard a partner rep in minutes, not months.</p></div>
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>Enterprise security</h3><p className="muted" style={{ lineHeight: 1.6 }}>Your data is never used to train models. SOC 2 Type II in progress (target Q2 2026). Full audit trail on every action.</p></div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{ padding: "6rem 0", background: "#000" }} id="roi">
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="tag">Calculate Your ROI</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#fff" }}>
              See What PartnerBase Is Worth to You
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#a0a0a0", maxWidth: 640, margin: "0 auto" }}>
              Most customers see 8–12x ROI in the first year. Calculate yours.
            </p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* Pricing */}
      <PricingTiers />

      {/* Mid-page Demo CTA */}
      <section style={{ padding: "5rem 0", background: "var(--subtle)" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="tag">See it with your data</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
            Ready to make your partner program a revenue engine?
          </h2>
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: 600, margin: "0 auto 2rem" }}>
            Book a 30-minute demo and we&apos;ll show you exactly how PartnerBase maps to your partner program — your tiers, your attribution model, your payout rules.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <form onSubmit={handleWaitlist} style={{ display: "flex", gap: ".5rem", maxWidth: 400 }}>
              <input
                type="email"
                placeholder="Enter your work email"
                className="input"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                required
              />
              <button type="submit" className="btn" disabled={submitted} style={{ whiteSpace: "nowrap" }}>
                {submitted ? "✓ We'll be in touch!" : "Book a Demo"}
              </button>
            </form>
          </div>
          {submitted && (
            <p style={{ marginTop: "1.2rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>
              🎉 Demo request received! We&apos;ll reach out within 24 hours.
            </p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta">
        <div className="wrap">
          <h2>Partner programs are either a cost center or a revenue engine</h2>
          <p className="subtitle">PartnerBase turns yours into an engine. Add the partner intelligence layer to your CRM. Your partners deserve transparency. So does your team.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn btn-lg">Explore the Demo</Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn-outline btn-lg" style={{ fontWeight: 600 }}>Book a Demo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="wrap-wide footer-grid">
          <div>
            <span className="logo" style={{ color: "white" }}>PartnerBase</span>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".8rem", lineHeight: 1.6 }}>
              The partner intelligence layer<br />for modern channel teams.
            </p>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".75rem" }}>© 2026 PartnerBase, Inc.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Platform</h4>
              <Link href="/dashboard/reports">Attribution</Link>
              <Link href="/dashboard/payouts">Incentives</Link>
              <Link href="/dashboard">Program Mgmt</Link>
              <Link href="/portal">Partner Portal</Link>
              <Link href="/dashboard/activity">Activity Trail</Link>
            </div>
            <div>
              <h4>Solutions</h4>
              <a href="#solutions">SaaS Channel</a>
              <a href="#solutions">Marketplaces</a>
              <a href="#solutions">Distribution</a>
              <a href="#solutions">Agencies</a>
            </div>
            <div>
              <h4>Resources</h4>
              <Link href="/dashboard">Live Demo</Link>
              <a href="mailto:hello@partnerbase.app">API Access</a>
              <a href="mailto:hello@partnerbase.app">Security</a>
              <a href="mailto:hello@partnerbase.app">Changelog</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="mailto:hello@partnerbase.app">About</a>
              <a href="mailto:hello@partnerbase.app">Careers</a>
              <a href="mailto:hello@partnerbase.app">Security</a>
              <a href="mailto:hello@partnerbase.app">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
