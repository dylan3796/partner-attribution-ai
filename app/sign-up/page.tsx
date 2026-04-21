"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SignUpPage() {
  const captureLead = useMutation(api.leads.captureLead);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email"); return; }
    setError("");
    try {
      await captureLead({ email, source: "sign_up_page" });
    } catch { /* ignore — still show success */ }
    setSubmitted(true);
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#f9fafb", padding: "2rem",
      fontFamily: "var(--font-inter), Inter, sans-serif",
    }}>
      <div style={{ maxWidth: 440, textAlign: "center" }}>
        <h1 style={{ color: "#0a0a0a", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: ".5rem" }}>
          Covant is in private beta.
        </h1>
        <p style={{ color: "#6b7280", fontSize: ".95rem", marginBottom: "2rem", lineHeight: 1.5 }}>
          Drop your email and we&apos;ll reach out when we&apos;re ready for your team.
        </p>

        {submitted ? (
          <div style={{ padding: "1.5rem", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, color: "#065f46" }}>
            <p style={{ fontWeight: 600, marginBottom: ".25rem" }}>You&apos;re on the list.</p>
            <p style={{ fontSize: ".85rem" }}>We&apos;ll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              style={{
                padding: "12px 16px", borderRadius: 10, border: "1px solid #e5e7eb",
                fontSize: ".95rem", fontFamily: "inherit", outline: "none",
              }}
            />
            {error && <p style={{ color: "#dc2626", fontSize: ".85rem", textAlign: "left" }}>{error}</p>}
            <button type="submit" style={{
              padding: "12px 20px", borderRadius: 10, border: "none", background: "#0a0a0a",
              color: "#fff", fontWeight: 700, fontSize: ".95rem", cursor: "pointer", fontFamily: "inherit",
            }}>
              Request Early Access →
            </button>
          </form>
        )}

        <p style={{ marginTop: "1.5rem", fontSize: ".85rem", color: "#6b7280" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "underline" }}>Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
