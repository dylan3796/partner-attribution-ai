"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
          <p className="subtitle" style={{ maxWidth: 580, margin: "0 auto 2.5rem" }}>
            PartnerBase automatically tracks attribution and calculates commissions.
            No more spreadsheets.
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
            Free to start · Works with Salesforce &amp; HubSpot · Setup in 15 minutes
          </p>
        </div>

        {/* ── AI DEMO CARD ── */}
        <div className="hero-demo wrap-wide" id="demo" ref={demoRef}>
          <div className="orb"></div>
          <div className="card demo-card">
            <div className="demo-header">
              <strong>Ask PartnerBase AI</strong>
              <span className="chip">VP Partnerships · Acme Inc</span>
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
                Import your resellers and referral partners in minutes. Connect to Salesforce
                or HubSpot and PartnerBase starts mapping deals automatically.
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
                is logged and linked to CRM opportunities. Full paper trail, always.
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
            These pain points drove every product decision. We&apos;re building PartnerBase
            with our early customers — not just for them.
          </p>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section
        style={{ padding: "6rem 0", background: "linear-gradient(180deg, #000 0%, #0a0a0a 100%)" }}
        id="pricing"
      >
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="tag">Pricing</div>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-.02em",
                marginBottom: "1rem",
                color: "#fff",
              }}
            >
              Free to start. Scales with your program.
            </h2>
            <p style={{ fontSize: "1rem", color: "#666", maxWidth: 480, margin: "0 auto" }}>
              No seat taxes. No hidden fees. Pay when you&apos;re tracking real revenue.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              maxWidth: 780,
              margin: "0 auto 2rem",
            }}
          >
            {/* Starter */}
            <div
              style={{
                background: "#0d0d0d",
                border: "1px solid #1a1a1a",
                borderRadius: 16,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontSize: ".7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  color: "#555",
                  marginBottom: "1rem",
                }}
              >
                Starter
              </p>
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-.03em",
                    lineHeight: 1,
                  }}
                >
                  $299
                </span>
                <span style={{ fontSize: ".875rem", color: "#444" }}>/mo</span>
                <p style={{ fontSize: ".8rem", color: "#555", marginTop: ".4rem" }}>
                  Up to $1M tracked partner ARR
                </p>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: ".55rem",
                }}
              >
                {[
                  "Up to 10 partners",
                  "AI attribution engine",
                  "Automated commission payouts",
                  "Partner self-service portal",
                  "Salesforce & HubSpot sync",
                  "14-day free trial",
                ].map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: ".6rem",
                      fontSize: ".85rem",
                      color: "#aaa",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: ".15rem" }}>
                      <path d="M13.5 4L6 11.5L2.5 8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: ".875rem",
                  borderRadius: 10,
                  border: "1px solid #222",
                  color: "#777",
                  fontWeight: 600,
                  fontSize: ".9rem",
                  textDecoration: "none",
                  transition: "all .2s",
                }}
              >
                Start free trial
              </Link>
            </div>

            {/* Growth */}
            <div
              style={{
                background: "#111",
                border: "1px solid #fff",
                borderRadius: 16,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: "0 0 0 1px rgba(255,255,255,.08), 0 20px 60px rgba(0,0,0,.5)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -13,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  color: "#000",
                  padding: ".3rem 1.1rem",
                  borderRadius: 20,
                  fontSize: ".7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  whiteSpace: "nowrap",
                }}
              >
                Most Popular
              </div>
              <p
                style={{
                  fontSize: ".7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  color: "#aaa",
                  marginBottom: "1rem",
                }}
              >
                Growth
              </p>
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-.03em",
                    lineHeight: 1,
                  }}
                >
                  $799
                </span>
                <span style={{ fontSize: ".875rem", color: "#444" }}>/mo</span>
                <p style={{ fontSize: ".8rem", color: "#555", marginTop: ".4rem" }}>
                  Up to $10M tracked partner ARR
                </p>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: ".55rem",
                }}
              >
                {[
                  "Up to 50 partners",
                  "Everything in Starter, plus:",
                  "Custom attribution rules",
                  "Commission automation",
                  "Slack integration",
                  "Priority support",
                  "API access & webhooks",
                ].map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: ".6rem",
                      fontSize: ".85rem",
                      color: f.endsWith(":") ? "#fff" : "#aaa",
                      fontWeight: f.endsWith(":") ? 700 : 400,
                    }}
                  >
                    {!f.endsWith(":") && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: ".15rem" }}>
                        <path d="M13.5 4L6 11.5L2.5 8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: ".875rem",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#000",
                  fontWeight: 600,
                  fontSize: ".9rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(255,255,255,.15)",
                  transition: "all .2s",
                }}
              >
                Start free trial
              </Link>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: ".85rem", color: "#444" }}>
            Larger program?{" "}
            <a
              href="mailto:hello@partnerbase.app"
              style={{ color: "#818cf8", textDecoration: "underline" }}
            >
              Talk to us about Enterprise
            </a>{" "}
            · All plans include 14-day free trial · No credit card required
          </p>
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
                {submitted ? "✓ We'll be in touch!" : "Start Free"}
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
              PartnerBase
            </span>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".8rem", lineHeight: 1.6 }}>
              Track attribution.
              <br />
              Calculate commissions.
              <br />
              Pay your partners on time.
            </p>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".75rem" }}>
              © 2026 PartnerBase, Inc.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <Link href="/dashboard/reports">Attribution</Link>
              <Link href="/dashboard/payouts">Payouts</Link>
              <Link href="/dashboard/deals">Deals</Link>
              <Link href="/portal">Partner Portal</Link>
            </div>
            <div>
              <h4>Resources</h4>
              <Link href="/dashboard">Live Demo</Link>
              <a href="mailto:hello@partnerbase.app">API Access</a>
              <a href="mailto:hello@partnerbase.app">Security</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="mailto:hello@partnerbase.app">About</a>
              <a href="mailto:hello@partnerbase.app">Careers</a>
              <a href="mailto:hello@partnerbase.app">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
