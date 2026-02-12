"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function LandingPage() {
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

  function handleWaitlist(e: React.FormEvent) {
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
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <>
      {/* Hero */}
      <section className="hero" id="product">
        <div className="wrap">
          <div className="tag">Now in early access</div>
          <h1>The Partner Intelligence Layer for Your CRM</h1>
          <p className="subtitle" style={{ maxWidth: 700, margin: "0 auto 2.5rem" }}>
            Measure partner impact, automate attribution, and run world-class partner programs — on top of the tools you already use.
          </p>
          <form className="waitlist" onSubmit={handleWaitlist}>
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
            <button type="submit" className="btn" disabled={submitted}>
              {submitted ? "✓ You're in!" : "Get early access"}
            </button>
          </form>
          {submitted && (
            <p style={{ marginTop: "1.2rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>
              🎉 Welcome aboard! We'll be in touch shortly.
            </p>
          )}
          {!submitted && (
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".85rem" }}>Free to start · No credit card required</p>
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

      {/* CRM Integration Banner */}
      <section className="problems">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>Works with your CRM, not against it</h2>
          <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 2rem", lineHeight: 1.6 }}>Your deals live in Salesforce, HubSpot, or Pipedrive. We add the partner intelligence layer on top — attribution, commissions, and program ops.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>☁️</div>
              <span style={{ fontSize: ".85rem", fontWeight: 600 }}>Salesforce</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🟠</div>
              <span style={{ fontSize: ".85rem", fontWeight: 600 }}>HubSpot</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🟢</div>
              <span style={{ fontSize: ".85rem", fontWeight: 600 }}>Pipedrive</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🔗</div>
              <span style={{ fontSize: ".85rem", fontWeight: 600 }}>REST API</span>
            </div>
          </div>
          <div className="grid-3">
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>📊</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Spreadsheet hell</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Partner attribution scattered across 12 spreadsheets. Nobody trusts the numbers. Every QBR is a fire drill.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>🤷</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Which partner gets credit?</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Multiple partners touched the same deal. You're the referee with no data. Disputes erode trust.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>💸</p>
              <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>Payout chaos</h3>
              <p className="muted" style={{ lineHeight: 1.5 }}>Commissions calculated manually. Partners wait weeks. Finance flags errors. Everyone's frustrated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="modules" id="platform">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">The Platform</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>The partner ops platform that doesn&apos;t replace your stack</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>Bring your CRM data, we add the partner intelligence. Attribution, incentives, program management, and a partner portal — all layered on top of your existing tools.</p>
        </div>
        <div className="wrap-wide grid-6">
          <Link href="/dashboard/reports"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>🧠</p><h3>AI Attribution</h3><p>5 built-in models plus custom attribution rules you define. Transparent, auditable, and trusted by every partner.</p></div></Link>
          <Link href="/dashboard/partners"><div className="card module-card"><p style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>💰</p><h3>Incentives & Payouts</h3><p>Auto-calculated commissions, tiered structures, SPIFs, bonuses, and one-click payouts. Partners get paid on time.</p></div></Link>
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
            <p>PartnerAI tracks all partner interactions across your ecosystem — referrals, demos, co-sell meetings, content shares, deal registrations. The complete paper trail layered on top of your CRM deals.</p>
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

      {/* Fully Customizable */}
      <section className="customizable" id="customizable">
        <div className="wrap" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="tag">Fully Customizable</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>Configure for your workflow — not the other way around</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>Every partnerships org operates differently. PartnerAI layers onto your existing CRM and adapts to your process — toggle features on or off, choose your complexity level, and enable only what you need.</p>
        </div>

        {/* Messaging callouts */}
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

        {/* Side-by-side: Simple vs Advanced */}
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Simple Mode */}
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
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Partner directory & contacts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Basic deal attribution</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Simple commission payouts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8, opacity: 0.4 }}>
                <span style={{ color: "var(--muted)" }}>—</span>
                <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>Scoring & tier management</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8, opacity: 0.4 }}>
                <span style={{ color: "var(--muted)" }}>—</span>
                <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>Certifications & badges</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8, opacity: 0.4 }}>
                <span style={{ color: "var(--muted)" }}>—</span>
                <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>MCP / API integrations</span>
              </div>
            </div>
            <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem", fontStyle: "italic" }}>Perfect for small teams getting started with partner tracking</p>
          </div>

          {/* Advanced Mode */}
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
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Everything in Simple, plus:</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Multi-model AI attribution (5 models)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Partner scoring & tier automation</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Certifications, badges & training</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>MCP integration & API access</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".6rem .8rem", background: "var(--subtle)", borderRadius: 8 }}>
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: ".9rem" }}>Deal registration & dispute workflows</span>
              </div>
            </div>
            <p className="muted" style={{ marginTop: "1rem", fontSize: ".85rem", fontStyle: "italic" }}>Enterprise-grade for complex multi-tier partner programs</p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="benefits" id="solutions">
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
          <div><h3 style={{ fontWeight: 700, marginBottom: ".8rem" }}>Enterprise security</h3><p className="muted" style={{ lineHeight: 1.6 }}>Your data is never used to train models. SOC 2 compliant. Full audit trail on every action.</p></div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "5rem 0", background: "var(--subtle)" }}>
        <div className="wrap" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="tag">Pricing</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 640, margin: "0 auto" }}>Start free. Upgrade when you need more.</p>
        </div>
        <div className="wrap grid-3" style={{ gap: "1.5rem" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Starter</h3>
            <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: ".5rem" }}>Free</p>
            <p className="muted" style={{ fontSize: ".9rem", marginBottom: "1.5rem" }}>Up to 10 partners, 1 user</p>
            <Link href="/dashboard" className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>Get started</Link>
          </div>
          <div className="card" style={{ textAlign: "center", border: "2px solid var(--fg)" }}>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Growth</h3>
            <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: ".5rem" }}>$299<span className="muted" style={{ fontSize: "1rem", fontWeight: 400 }}>/mo</span></p>
            <p className="muted" style={{ fontSize: ".9rem", marginBottom: "1.5rem" }}>Unlimited partners, 5 users, all models</p>
            <Link href="/dashboard" className="btn" style={{ width: "100%", justifyContent: "center" }}>Start free trial</Link>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Enterprise</h3>
            <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: ".5rem" }}>Custom</p>
            <p className="muted" style={{ fontSize: ".9rem", marginBottom: "1.5rem" }}>SSO, custom models, dedicated support</p>
            <a href="mailto:sales@partnerai.com" className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact sales</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="wrap">
          <h2>Stop guessing which partners drive revenue</h2>
          <p className="subtitle">Add the partner intelligence layer to your CRM. Your partners deserve transparency. So does your team.</p>
          <Link href="/dashboard" className="btn btn-lg">Get started free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="wrap-wide footer-grid">
          <div>
            <span className="logo" style={{ color: "white" }}>Partner<span>AI</span></span>
            <p className="muted" style={{ marginTop: ".8rem" }}>© 2026 Partner AI, Inc.</p>
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
              <a href="#" onClick={(e) => e.preventDefault()}>Blog</a>
              <a href="#" onClick={(e) => e.preventDefault()}>API Docs</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Case Studies</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Changelog</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#" onClick={(e) => e.preventDefault()}>About</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Careers</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Security</a>
              <a href="mailto:hello@partnerai.com">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
