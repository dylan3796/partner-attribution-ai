"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const leadsCount = useQuery(api.leads.getLeadsCount) ?? 0;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

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
    <div className="landing">
      {/* ── 1. HERO ──────────────────────────────────────── */}
      <section style={{ padding: "9rem 0 7rem", textAlign: "center", background: "#ffffff" }}>
        <div className="wrap">
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-.03em",
            marginBottom: "1.5rem",
            color: "#0a0a0a"
          }}>
            The intelligence layer for your partner business.
          </h1>
          <p className="l-muted" style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            maxWidth: 580,
            margin: "0 auto 2.5rem",
            lineHeight: 1.5
          }}>
            Covant tracks every partner touchpoint, calculates commissions automatically, and gives partners a portal they&apos;ll actually use.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">
              Get Started Free <span>→</span>
            </Link>
            <Link href="/demo" className="l-btn-outline">
              Try with sample data <span>→</span>
            </Link>
          </div>

          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            Join early access
          </p>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF QUOTES ──────────────────────── */}
      <section className="l-section-light" style={{ padding: "5rem 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <div className="l-card">
              <p style={{ fontStyle: "italic", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1rem", color: "#374151" }}>
                &ldquo;Every QBR turns into a fight about attribution. Nobody trusts the spreadsheet.&rdquo;
              </p>
              <p className="l-muted" style={{ fontSize: ".8rem" }}>
                VP of Partnerships, Series B SaaS
              </p>
            </div>

            <div className="l-card">
              <p style={{ fontStyle: "italic", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1rem", color: "#374151" }}>
                &ldquo;We know partners are driving revenue — we just can&apos;t prove it to the CFO.&rdquo;
              </p>
              <p className="l-muted" style={{ fontSize: ".8rem" }}>
                Director of Channel Sales
              </p>
            </div>

            <div className="l-card">
              <p style={{ fontStyle: "italic", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1rem", color: "#374151" }}>
                &ldquo;Commission disputes are killing partner trust. I&apos;m a referee, not a program manager.&rdquo;
              </p>
              <p className="l-muted" style={{ fontSize: ".8rem" }}>
                Head of Partner Programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ──────────────────────────────── */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            marginBottom: "3.5rem",
            color: "#0a0a0a"
          }}>
            Your program structure. Your rules. Automated.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", textAlign: "left" }}>
            <div className="l-card">
              <div style={{
                fontSize: "2.5rem",
                fontWeight: 300,
                color: "#d1d5db",
                marginBottom: "1rem",
                lineHeight: 1
              }}>
                01
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Connect your stack
              </h3>
              <p className="l-muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Import partners from your CRM and set attribution rules. Covant maps every partner to every deal from day one.
              </p>
            </div>

            <div className="l-card">
              <div style={{
                fontSize: "2.5rem",
                fontWeight: 300,
                color: "#d1d5db",
                marginBottom: "1rem",
                lineHeight: 1
              }}>
                02
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Every touchpoint attributed
              </h3>
              <p className="l-muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Every partner interaction logged, linked, and weighted. Overlapping deals split by your rules, not gut feel.
              </p>
            </div>

            <div className="l-card">
              <div style={{
                fontSize: "2.5rem",
                fontWeight: 300,
                color: "#d1d5db",
                marginBottom: "1rem",
                lineHeight: 1
              }}>
                03
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Partners get paid. Nobody questions it.
              </h3>
              <p className="l-muted" style={{ lineHeight: 1.6, fontSize: ".95rem" }}>
                Commissions calculated automatically. Partners see earnings in real time, finance gets clean reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURE DEEP-DIVES ────────────────────────── */}
      {/* Deep-dive 1: Attribution (text left, card right) */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Attribution</span>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-.02em",
              marginBottom: "1.2rem",
              color: "#0a0a0a"
            }}>
              Attribution that partners actually trust
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Choose from first-touch, last-touch, or multi-touch models. Configure once, apply automatically. Every calculation explainable — attribution disputes disappear.
            </p>
          </div>
          <div className="l-card">
            <h4 style={{ marginBottom: "1.2rem", fontWeight: 600, color: "#0a0a0a" }}>Deal: TechStar × CloudBridge</h4>
            <div className="l-bar-row">
              <span>TechStar (Reseller)</span>
              <div className="l-bar-track">
                <div className="l-bar-fill" style={{ width: "55%" }}></div>
              </div>
              <span style={{ fontWeight: 600 }}>55%</span>
            </div>
            <div className="l-bar-row">
              <span>CloudBridge (Referral)</span>
              <div className="l-bar-track">
                <div className="l-bar-fill" style={{ width: "30%" }}></div>
              </div>
              <span style={{ fontWeight: 600 }}>30%</span>
            </div>
            <div className="l-bar-row">
              <span>DataPipe (Integration)</span>
              <div className="l-bar-track">
                <div className="l-bar-fill" style={{ width: "15%" }}></div>
              </div>
              <span style={{ fontWeight: 600 }}>15%</span>
            </div>
            <p className="l-muted" style={{ marginTop: "1rem", fontSize: ".85rem" }}>Model: Role-Based (custom weights)</p>
          </div>
        </div>
      </section>

      {/* Deep-dive 2: Visibility (card left, text right) */}
      <section style={{ padding: "7rem 0", background: "#f9fafb" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div className="l-card">
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              <div className="l-timeline-item">
                <div className="l-avatar">TS</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: "block", marginBottom: ".25rem" }}>TechStar registered deal</strong>
                  <small className="l-muted">Jan 15 · Deal registration</small>
                </div>
              </div>
              <div className="l-timeline-item">
                <div className="l-avatar">CB</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: "block", marginBottom: ".25rem" }}>CloudBridge demo</strong>
                  <small className="l-muted">Jan 22 · Co-sell activity</small>
                </div>
              </div>
              <div className="l-timeline-item">
                <div className="l-avatar">DP</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: "block", marginBottom: ".25rem" }}>DataPipe integration</strong>
                  <small className="l-muted">Jan 28 · Technical enablement</small>
                </div>
              </div>
              <div className="l-timeline-item">
                <div className="l-avatar" style={{ background: "#0a0a0a", color: "#fff" }}>✓</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: "block", marginBottom: ".25rem" }}>Deal closed · $50,000</strong>
                  <small className="l-muted">Feb 1 · Attribution calculated</small>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="l-label">Visibility</span>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-.02em",
              marginBottom: "1.2rem",
              color: "#0a0a0a"
            }}>
              Every partner touchpoint, captured
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Every interaction — referrals, demos, deal reg, co-sell — logged and linked. When a deal closes, you know who did what.
            </p>
          </div>
        </div>
      </section>

      {/* Deep-dive 3: Payouts (text left, card right) */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Payouts</span>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-.02em",
              marginBottom: "1.2rem",
              color: "#0a0a0a"
            }}>
              Fair splits, zero manual work
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Attribution drives automatic commission calculations. Tier-based payouts, MDF allocations, SPIFFs — no more end-of-quarter surprises.
            </p>
          </div>
          <div className="l-card">
            <h4 style={{ marginBottom: "1rem", fontWeight: 600, color: "#0a0a0a" }}>January Partner Payouts</h4>
            <div className="l-payout-row">
              <div className="l-avatar">TS</div>
              <span style={{ flex: 1 }}>TechStar Solutions</span>
              <strong style={{ fontSize: "1rem" }}>$12,450</strong>
            </div>
            <div className="l-payout-row">
              <div className="l-avatar">CB</div>
              <span style={{ flex: 1 }}>CloudBridge Partners</span>
              <strong style={{ fontSize: "1rem" }}>$8,920</strong>
            </div>
            <div className="l-payout-row">
              <div className="l-avatar">DP</div>
              <span style={{ flex: 1 }}>DataPipe Agency</span>
              <strong style={{ fontSize: "1rem" }}>$5,630</strong>
            </div>
            <p className="l-muted" style={{ marginTop: ".8rem", fontSize: ".85rem" }}>Total: $27,000 · Based on role-based attribution</p>
          </div>
        </div>
      </section>

      {/* ── 5. INTEGRATIONS ──────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#ffffff" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            marginBottom: ".75rem",
            color: "#0a0a0a"
          }}>
            Works with what you already use
          </h2>
          <p className="l-muted" style={{ fontSize: "1.05rem", maxWidth: 560, margin: "0 auto 3rem", lineHeight: 1.6 }}>
            Connects in minutes. No rip-and-replace required.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div className="l-logo-box">
              <SalesforceLogo />
              <span className="l-logo-name">Salesforce</span>
            </div>
            <div className="l-logo-box">
              <HubSpotLogo />
              <span className="l-logo-name">HubSpot</span>
            </div>
            <div className="l-logo-box">
              <PipedriveLogo />
              <span className="l-logo-name">Pipedrive</span>
            </div>
            <div className="l-logo-box">
              <SlackLogo />
              <span className="l-logo-name">Slack</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ──────────────────────────────────── */}
      <section className="l-section-light" style={{ padding: "7rem 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            marginBottom: "1rem",
            color: "#0a0a0a"
          }}>
            Your partners are driving revenue. Start proving it.
          </h2>
          <p className="l-muted" style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            maxWidth: 600,
            margin: "0 auto 2.5rem",
            lineHeight: 1.5
          }}>
            Add attribution. Automate commissions. Give partners a portal.
          </p>

          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: ".75rem", maxWidth: 480, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1 1 280px", position: "relative" }}>
              <input
                type="email"
                placeholder="Enter your work email"
                className="l-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                required
              />
              {emailError && (
                <p style={{ position: "absolute", bottom: -20, left: 0, fontSize: ".75rem", color: "#dc2626" }}>
                  {emailError}
                </p>
              )}
            </div>
            <button type="submit" className="l-btn" disabled={submitted} style={{ whiteSpace: "nowrap" }}>
              {submitted ? "✓ We'll be in touch!" : "Get Early Access"}
            </button>
          </form>

          {submitted && (
            <p style={{ marginTop: "1.5rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>
              We&apos;ll reach out within 24 hours.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
