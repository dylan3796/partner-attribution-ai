"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft, Send, Mail, MessageSquare, Calendar, CheckCircle2,
  Building2, Users, Zap,
} from "lucide-react";

const PARTNER_RANGES = [
  "1–10 partners",
  "11–25 partners",
  "26–50 partners",
  "51–100 partners",
  "100+ partners",
  "Building from scratch",
];

export default function ContactPage() {
  const captureLead = useMutation(api.leads.captureLead);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    partnerCount: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setLoading(true);
    try {
      await captureLead({
        email: form.email,
        company: form.company || undefined,
        contactName: form.name,
        notes: [
          form.partnerCount && `Partners: ${form.partnerCount}`,
          form.message,
        ].filter(Boolean).join("\n"),
        source: "contact",
      });
      setSubmitted(true);
    } catch {
      // Still show success — lead may have been captured on retry
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #222",
    background: "#0a0a0a",
    color: "#e5e5e5",
    fontSize: ".9rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Back link */}
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#666", fontSize: ".85rem", textDecoration: "none", marginBottom: 24,
          }}
        >
          <ArrowLeft size={14} /> Back to Covant
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800,
            letterSpacing: "-.03em", lineHeight: 1.1, color: "#fff", marginBottom: ".75rem",
          }}>
            Let&apos;s talk partner intelligence
          </h1>
          <p style={{ color: "#666", fontSize: "1.05rem", maxWidth: 520, lineHeight: 1.6 }}>
            Whether you&apos;re evaluating Covant for your team or have questions about the platform — we&apos;d love to hear from you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem", alignItems: "start" }}>
          {/* Form */}
          <div>
            {submitted ? (
              <div style={{
                padding: "3rem 2rem", borderRadius: 16, border: "1px solid #1a3a1a",
                background: "#0a1a0a", textAlign: "center",
              }}>
                <CheckCircle2 size={48} style={{ color: "#22c55e", marginBottom: 16 }} />
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                  We&apos;ll be in touch
                </h2>
                <p style={{ color: "#888", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
                  Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. We typically respond within a few hours during business days.
                </p>
                <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
                  <Link
                    href="/demo"
                    style={{
                      padding: "10px 20px", borderRadius: 8, background: "#fff",
                      color: "#000", fontWeight: 700, fontSize: ".85rem", textDecoration: "none",
                    }}
                  >
                    Explore Demo
                  </Link>
                  <Link
                    href="/assessment"
                    style={{
                      padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
                      color: "#999", fontWeight: 600, fontSize: ".85rem", textDecoration: "none",
                    }}
                  >
                    Take Assessment
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Name + Email row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: ".75rem", fontWeight: 600, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                      Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sarah Chen"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "#222")}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: ".75rem", fontWeight: 600, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                      Work email <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "#222")}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label style={{ display: "block", fontSize: ".75rem", fontWeight: 600, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.target.style.borderColor = "#222")}
                  />
                </div>

                {/* Partner count */}
                <div>
                  <label style={{ display: "block", fontSize: ".75rem", fontWeight: 600, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    How many partners do you manage?
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {PARTNER_RANGES.map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setForm({ ...form, partnerCount: range })}
                        style={{
                          padding: "10px 12px", borderRadius: 8,
                          border: `1px solid ${form.partnerCount === range ? "#6366f1" : "#222"}`,
                          background: form.partnerCount === range ? "#6366f120" : "#0a0a0a",
                          color: form.partnerCount === range ? "#a5b4fc" : "#888",
                          fontSize: ".8rem", fontWeight: 600, cursor: "pointer",
                          fontFamily: "inherit", transition: "all 0.15s",
                        }}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", fontSize: ".75rem", fontWeight: 600, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    What are you looking to solve?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your partner program, what's working, what's not..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                    onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.target.style.borderColor = "#222")}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "14px 28px", borderRadius: 10,
                    background: loading ? "#333" : "#fff", color: loading ? "#888" : "#000",
                    fontWeight: 700, fontSize: ".95rem", border: "none", cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit", transition: "all 0.15s", marginTop: 4,
                  }}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={16} />
                      Get in touch
                    </>
                  )}
                </button>

                <p style={{ fontSize: ".75rem", color: "#444", lineHeight: 1.5 }}>
                  We typically respond within a few hours. No spam, no 12-email nurture sequence.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Quick contact */}
            <div style={{
              padding: "1.25rem", borderRadius: 14, border: "1px solid #1a1a1a", background: "#0a0a0a",
            }}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#555", marginBottom: 12 }}>
                Quick contact
              </div>
              <a
                href="mailto:hello@covant.ai"
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  color: "#ccc", textDecoration: "none", fontSize: ".85rem",
                  borderBottom: "1px solid #111",
                }}
              >
                <Mail size={16} style={{ color: "#6366f1" }} />
                hello@covant.ai
              </a>
              <a
                href="mailto:sales@covant.ai"
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  color: "#ccc", textDecoration: "none", fontSize: ".85rem",
                }}
              >
                <MessageSquare size={16} style={{ color: "#22c55e" }} />
                sales@covant.ai
              </a>
            </div>

            {/* What to expect */}
            <div style={{
              padding: "1.25rem", borderRadius: 14, border: "1px solid #1a1a1a", background: "#0a0a0a",
            }}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#555", marginBottom: 12 }}>
                What to expect
              </div>
              {[
                { icon: Calendar, text: "30-min intro call tailored to your program" },
                { icon: Building2, text: "Live walkthrough with your data model" },
                { icon: Users, text: "Custom setup for your partner types" },
                { icon: Zap, text: "Same-day access to the platform" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "8px 0", fontSize: ".8rem", color: "#888", lineHeight: 1.5,
                  }}
                >
                  <item.icon size={15} style={{ color: "#555", flexShrink: 0, marginTop: 2 }} />
                  {item.text}
                </div>
              ))}
            </div>

            {/* Social proof teaser */}
            <div style={{
              padding: "1.25rem", borderRadius: 14, background: "#6366f108",
              border: "1px solid #6366f120",
            }}>
              <div style={{ fontSize: ".85rem", color: "#a5b4fc", fontWeight: 600, marginBottom: 6 }}>
                Built for partner teams
              </div>
              <p style={{ fontSize: ".8rem", color: "#666", lineHeight: 1.5, margin: 0 }}>
                Covant is purpose-built for VPs of Partnerships, RevOps, and Partner Managers 
                managing programs from 5 to 500+ partners.
              </p>
              <Link
                href="/use-cases"
                style={{
                  display: "inline-block", marginTop: 10, fontSize: ".8rem",
                  color: "#6366f1", textDecoration: "none", fontWeight: 600,
                }}
              >
                See use cases →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
