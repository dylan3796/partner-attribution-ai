"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LandingPage() {
  const captureLead = useMutation(api.leads.captureLead);
  const leadsCountRaw = useQuery(api.leads.getLeadsCount);
  const leadsCount = typeof leadsCountRaw === "number" ? leadsCountRaw : 0;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setEmailError("Please enter your email"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Please enter a valid email"); return; }
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

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ padding: "9rem 0 7rem", textAlign: "center", background: "#ffffff" }}>
        <div className="wrap">
          <p className="l-label" style={{ marginBottom: "1.25rem" }}>Partner Intelligence Platform</p>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-.03em",
            marginBottom: "1.5rem",
            color: "#0a0a0a",
          }}>
The intelligence layer<br />for your partner business.
          </h1>
          <p className="l-muted" style={{
            fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
            maxWidth: 600,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}>
            Covant&apos;s Attribution Engine discovers every partner relationship across your pipeline. Then a Recommendation Engine, account mapping, automated QBR reporting, and a partner portal run on top of that foundation.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">Get Started Free <span>→</span></Link>
            <Link href="/dashboard?demo=true" className="l-btn-outline">Try it live <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for up to 5 partners · No credit card required"}
          </p>
        </div>
      </section>

      {/* ── ENGINES + PLATFORM ───────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#ffffff", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#818cf8", marginBottom: ".75rem" }}>
              Two engines. One platform.
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.025em", color: "#0a0a0a", marginBottom: "1rem" }}>
              Two engines. One platform.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
              Everything runs on what the Attribution Engine knows. The Recommendation Engine reads from it. Account mapping enriches it. QBR reports pull from it. The portal surfaces it to partners.
            </p>
          </div>

          {/* Attribution Engine — hero card */}
          <div style={{
            background: "rgba(99,102,241,.04)",
            border: "1px solid rgba(99,102,241,.15)",
            borderRadius: 16,
            padding: "2.5rem",
            marginBottom: "1px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 16, right: 20, fontSize: ".7rem", fontWeight: 700, color: "#818cf8", background: "rgba(129,140,248,.15)", border: "1px solid rgba(129,140,248,.3)", padding: "3px 12px", borderRadius: 20 }}>
              Focal Engine
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", alignItems: "flex-start" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#818cf8", marginBottom: "1rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", display: "inline-block", boxShadow: "0 0 8px #818cf8" }} />
                  Attribution Engine
                </span>
                <h3 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)", fontWeight: 800, color: "#0a0a0a", lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: ".75rem" }}>
                  Discovers every partner relationship across your entire pipeline — automatically.
                </h3>
                <p style={{ fontSize: ".9rem", color: "#6b7280", lineHeight: 1.7 }}>
                  The source of truth your entire program runs on. Tracks full history of a partner, a customer, or a partner+customer combination across every metric you feed in. Multi-touch attribution models, explainable calculations, zero disputes.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {[
                  { label: "Full partner history", desc: "Every touchpoint, deal, and interaction — searchable, timestamped, auditable" },
                  { label: "Multi-touch attribution", desc: "First-touch, last-touch, custom weights — runs on every deal automatically" },
                  { label: "Hidden relationship discovery", desc: "Surfaces partner influence that was never officially registered" },
                  { label: "Customer + partner combo view", desc: "See the full relationship between any customer and any partner across all time" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#818cf8", fontSize: ".8rem", marginTop: 2, flexShrink: 0 }}>✦</span>
                    <div>
                      <div style={{ fontSize: ".82rem", fontWeight: 600, color: "#0a0a0a", marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: ".75rem", color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation Engine */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", marginBottom: "2rem" }}>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", borderRadius: "0 0 0 16px" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#22c55e", marginBottom: ".75rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                  Recommendation Engine
                </span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0a0a0a", lineHeight: 1.25, letterSpacing: "-.01em", marginBottom: ".65rem" }}>
                  Tells you which partner belongs on every open deal.
                </h3>
                <p style={{ fontSize: ".85rem", color: "#6b7280", lineHeight: 1.65 }}>
                  Reads from Attribution Engine data. Recommends the right partner for every account based on history, relationships, territory, and vertical — and explains exactly why. Learns from accepted and rejected recs. Manual override and prompting for edge cases.
                </p>
              </div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "auto" }}>
                {["Explainable recs", "Learns from feedback", "Manual prompting"].map((t) => (
                  <span key={t} style={{ fontSize: ".7rem", fontWeight: 600, padding: "3px 9px", borderRadius: 20, border: "1px solid rgba(34,197,94,.3)", color: "#22c55e", background: "rgba(34,197,94,.1)" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Platform capabilities */}
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", borderRadius: "0 0 16px 0" }}>
              <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em", margin: 0 }}>Platform Capabilities</p>
              {[
                {
                  accent: "#f59e0b",
                  name: "Account Mapping & List Sharing",
                  desc: "Share prospect lists with partners, find overlaps, surface where partners have existing relationships on your target accounts.",
                },
                {
                  accent: "#fb923c",
                  name: "Workflow Builder",
                  desc: "Custom automations for your program — MDF eligibility, SPIFF triggers, tier progression, co-sell motions. The logic that lives in email threads today, running automatically tomorrow.",
                },
                {
                  accent: "#38bdf8",
                  name: "QBR Automation",
                  desc: "Define metrics and slide format once. Reports generate automatically on your schedule, ready to present.",
                },
              ].map((c) => (
                <div key={c.name} style={{ display: "flex", gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent, flexShrink: 0, marginTop: 6 }} />
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#0a0a0a", marginBottom: 3 }}>{c.name}</div>
                    <div style={{ fontSize: ".78rem", color: "#6b7280", lineHeight: 1.55 }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portal strip */}
          <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: ".72rem", fontWeight: 700, color: "#10b981", letterSpacing: ".06em", textTransform: "uppercase", background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)", padding: "3px 10px", borderRadius: 20 }}>
                Always Free
              </span>
              <span style={{ color: "#0a0a0a", fontSize: ".9rem", fontWeight: 600 }}>Partner Portal</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>—</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>AI-powered workspace. Bi-directional syncs. Fully customizable. Included with every plan.</span>
            </div>
            <Link href="/pricing" style={{ fontSize: ".82rem", fontWeight: 600, color: "#818cf8", textDecoration: "none", flexShrink: 0 }}>
              See pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: ATTRIBUTION ENGINE ───────────────── */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Attribution Engine · Focal</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Every deal. Every partner. Every relationship. Discovered automatically.
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              The Attribution Engine is the foundation. It builds and maintains a full record of every partner relationship across your pipeline — touchpoints, deals, and influence you didn&apos;t even know existed. Everything else in Covant reads from what it knows.
            </p>
          </div>
          <div className="l-card">
            <h4 style={{ marginBottom: "1.2rem", fontWeight: 600, color: "#0a0a0a" }}>Deal: Acme Corp · $50,000</h4>
            <div className="l-bar-row">
              <span>TechStar (Reseller)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "55%" }}></div></div>
              <span style={{ fontWeight: 600 }}>55%</span>
            </div>
            <div className="l-bar-row">
              <span>CloudBridge (Referral)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "30%" }}></div></div>
              <span style={{ fontWeight: 600 }}>30%</span>
            </div>
            <div className="l-bar-row">
              <span>DataPipe (Integration)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "15%" }}></div></div>
              <span style={{ fontWeight: 600 }}>15%</span>
            </div>
            <div style={{ marginTop: "1rem", padding: "10px 12px", background: "#f9fafb", borderRadius: 8, fontSize: ".78rem", color: "#6b7280" }}>
              <strong style={{ color: "#374151" }}>DataPipe flagged by engine</strong> — no deal registration, but 3 touchpoints detected in CRM. Attribution applied automatically.
            </div>
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: RECOMMENDATION ENGINE ────────────── */}
      <section style={{ padding: "7rem 0", background: "#f9fafb" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div style={{ order: 2 }}>
            <span className="l-label">Recommendation Engine</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Which partner should be on this deal?
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65, marginBottom: "1.2rem" }}>
              Reads from Attribution data to recommend the right partner for every open account — based on relationship history, vertical, territory, deal size, and past close rates. Explains the reasoning. Learns from every accepted or rejected recommendation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {[
                "Configurable signals — use ours or define your own",
                "Explains every recommendation with evidence",
                "Manual prompting: 'find a partner with APAC fintech experience'",
                "Gets smarter with every piece of feedback",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".6rem", fontSize: ".88rem", color: "#374151" }}>
                  <span style={{ color: "#34d399", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="l-card" style={{ order: 1 }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Open Account</div>
              <div style={{ fontWeight: 600, color: "#0a0a0a", fontSize: ".95rem" }}>GlobalTech Inc · $220K ACV · Fintech · APAC</div>
            </div>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Recommended Partners</div>
            {[
              {
                name: "TechBridge Solutions",
                score: 94,
                reason: "3 closed deals in APAC fintech · existing contact at GlobalTech · Gold tier",
                color: "#22c55e",
              },
              {
                name: "Stackline Partners",
                score: 71,
                reason: "Strong fintech vertical, no existing GlobalTech relationship",
                color: "#f59e0b",
              },
            ].map((r, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < 1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#374151" }}>{r.name}</span>
                  <span style={{ fontSize: ".9rem", fontWeight: 700, color: r.color }}>Match {r.score}%</span>
                </div>
                <div style={{ fontSize: ".75rem", color: "#9ca3af", lineHeight: 1.5 }}>{r.reason}</div>
              </div>
            ))}
            <div style={{ marginTop: "1rem", display: "flex", gap: ".5rem" }}>
              <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: "#0a0a0a", color: "#fff", fontSize: ".78rem", fontWeight: 600, textAlign: "center", cursor: "pointer" }}>Assign TechBridge</div>
              <div style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", color: "#6b7280", fontSize: ".78rem", cursor: "pointer" }}>Prompt manually</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: ACCOUNT MAPPING ───────────────────── */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Account Mapping & List Sharing</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Find where your partners already have the relationship.
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Share prospect lists with partners securely. Map against each other to surface overlaps — accounts you&apos;re both pursuing, accounts where a partner already has a foot in the door. That overlap feeds directly into the Recommendation Engine.
            </p>
          </div>
          <div className="l-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h4 style={{ fontWeight: 600, color: "#0a0a0a", margin: 0 }}>List Overlap · TechBridge</h4>
              <span style={{ fontSize: ".72rem", fontWeight: 700, color: "#818cf8", background: "rgba(129,140,248,.1)", padding: "2px 8px", borderRadius: 6 }}>14 overlaps found</span>
            </div>
            {[
              { account: "GlobalTech Inc", status: "TechBridge has existing contact", action: "High priority", color: "#22c55e" },
              { account: "DataFlow Systems", status: "Both pursuing — Q2 close target", action: "Co-sell opportunity", color: "#818cf8" },
              { account: "NexaCloud", status: "TechBridge closed similar deal in 2024", action: "Warm intro available", color: "#f59e0b" },
            ].map((r, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                  <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#374151" }}>{r.account}</span>
                  <span style={{ fontSize: ".72rem", fontWeight: 700, color: r.color, background: `${r.color}18`, padding: "2px 7px", borderRadius: 8 }}>{r.action}</span>
                </div>
                <div style={{ fontSize: ".75rem", color: "#9ca3af" }}>{r.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: WORKFLOW BUILDER ──────────────────── */}
      <section style={{ padding: "7rem 0", background: "#f9fafb" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div style={{ order: 2 }}>
            <span className="l-label">Workflow Builder</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              The custom layer your CRM was never built for.
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65, marginBottom: "1.2rem" }}>
              Every partner team has bespoke logic — MDF eligibility rules, SPIFF programs, co-sell motions, tier triggers, deal protection agreements. Today it lives in Slack and spreadsheets. Covant lets you configure it once and run it automatically.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {[
                "Trigger → conditions → actions, built on partner-program primitives",
                "MDF programs, SPIFFs, tier progression — all configurable",
                "When a partner hits a threshold, the engine acts — not you",
                "Encode your institutional knowledge so it doesn't walk out the door",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".6rem", fontSize: ".88rem", color: "#374151" }}>
                  <span style={{ color: "#fb923c", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="l-card" style={{ order: 1 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "1rem" }}>Active Workflows</div>
            {[
              {
                name: "Gold Tier Promotion",
                trigger: "Partner closes 5 deals in a quarter",
                actions: ["Auto-promote to Gold", "Unlock MDF budget ($5K)", "Send partner congrats + new rate card"],
                status: "Running",
                color: "#22c55e",
              },
              {
                name: "APAC Q3 SPIFF",
                trigger: "Deal closed in APAC territory, deal value >$50K",
                actions: ["Calculate 2% bonus", "Queue for approval", "Notify channel manager"],
                status: "Running",
                color: "#22c55e",
              },
              {
                name: "Partner Re-engagement",
                trigger: "No deal activity for 45 days",
                actions: ["Flag as at-risk in Intelligence Engine", "Create task for channel manager", "Send partner check-in email"],
                status: "Running",
                color: "#22c55e",
              },
            ].map((w, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#374151" }}>{w.name}</span>
                  <span style={{ fontSize: ".7rem", fontWeight: 700, color: w.color, background: `${w.color}15`, padding: "2px 7px", borderRadius: 8 }}>{w.status}</span>
                </div>
                <div style={{ fontSize: ".75rem", color: "#9ca3af", marginBottom: 3 }}>When: {w.trigger}</div>
                <div style={{ fontSize: ".72rem", color: "#b0b7c3" }}>→ {w.actions[0]}{w.actions.length > 1 ? ` + ${w.actions.length - 1} more` : ""}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: PARTNER PORTAL ────────────────────── */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Partner Portal · Always Free</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              The portal partners have always wanted
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65, marginBottom: "1.2rem" }}>
              A fully branded workspace for every partner — deals, commissions, performance, and an AI layer that answers their questions instantly. Bi-directional syncs, customizable per-partner flows, white-labeled to your brand. Free, forever.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {[
                `Ask AI: "What's my Q2 commission if I close these 3 deals?"`,
                "Bi-directional deal sync — no manual re-entry",
                "Customize portal views per partner tier or type",
                "White-labeled with your brand in under 10 minutes",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".6rem", fontSize: ".88rem", color: "#374151" }}>
                  <span style={{ color: "#818cf8", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="l-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h4 style={{ fontWeight: 600, color: "#0a0a0a", margin: 0 }}>TechStar · Partner Portal</h4>
              <span style={{ fontSize: ".75rem", color: "#059669", fontWeight: 600, background: "#d1fae5", padding: ".2rem .55rem", borderRadius: "6px" }}>Gold Tier</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Commissions (Q1)", val: "$24,320" },
                { label: "Open Deals", val: "8" },
                { label: "Pending Payout", val: "$6,150" },
                { label: "MDF Remaining", val: "$3,200" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#f9fafb", borderRadius: "8px", padding: ".75rem 1rem" }}>
                  <p className="l-muted" style={{ fontSize: ".72rem", marginBottom: ".25rem" }}>{s.label}</p>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0a0a0a", margin: 0 }}>{s.val}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <Link href="/dashboard/deals?demo=true" style={{ flex: 1, padding: ".55rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#0a0a0a", color: "#fff", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>Register Deal</Link>
              <Link href="/dashboard/deals?demo=true" style={{ flex: 1, padding: ".55rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>View Pipeline</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "#f9fafb" }}>
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <p style={{ fontSize: "clamp(1.15rem, 2vw, 1.4rem)", lineHeight: 1.65, color: "#374151", fontStyle: "italic", marginBottom: "1.25rem" }}>
            &ldquo;Every QBR turns into a fight about attribution. Nobody trusts the spreadsheet. I need something my CFO and my partners both believe.&rdquo;
          </p>
          <p className="l-muted" style={{ fontSize: ".85rem", fontWeight: 600 }}>VP of Partnerships · Series B SaaS</p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="l-section-light" style={{ padding: "7rem 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#0a0a0a" }}>
            Your partners are driving revenue.<br />Start proving it.
          </h2>
          <p className="l-muted" style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.5 }}>
            Free for up to 5 partners. No credit card required.
          </p>
          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: ".75rem", maxWidth: 460, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1 1 260px", position: "relative" }}>
              <input
                type="email"
                placeholder="Enter your work email"
                className="l-input"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                required
              />
              {emailError && (
                <p style={{ position: "absolute", bottom: -20, left: 0, fontSize: ".75rem", color: "#dc2626" }}>{emailError}</p>
              )}
            </div>
            <button type="submit" className="l-btn" disabled={submitted} style={{ whiteSpace: "nowrap" }}>
              {submitted ? "✓ We'll be in touch!" : "Get Early Access"}
            </button>
          </form>
          {submitted && (
            <p style={{ marginTop: "1.5rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>We&apos;ll reach out within 24 hours.</p>
          )}
        </div>
      </section>

    </div>
  );
}
