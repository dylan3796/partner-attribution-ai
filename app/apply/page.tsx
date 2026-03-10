"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Handshake,
  CheckCircle,
  ArrowRight,
  Building2,
  Users,
  Globe,
  DollarSign,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";
import Footer from "@/components/Footer";

const PARTNER_TYPES = [
  { value: "reseller", label: "Reseller", desc: "Sell our product alongside yours" },
  { value: "referral", label: "Referral", desc: "Refer leads and earn commissions" },
  { value: "integration", label: "Technology / Integration", desc: "Build integrations with your product" },
  { value: "affiliate", label: "Affiliate", desc: "Promote and earn per conversion" },
] as const;

const PARTNER_COUNTS = [
  "Just me",
  "2-5 team members",
  "6-20 team members",
  "20+ team members",
];

const BENEFITS = [
  { icon: DollarSign, title: "Competitive Commissions", desc: "Transparent, tiered commission structure that grows with you" },
  { icon: BarChart3, title: "Real-Time Dashboard", desc: "Track your deals, commissions, and performance in your own portal" },
  { icon: Shield, title: "Deal Registration", desc: "Protect your pipeline with automated deal reg and attribution" },
  { icon: Zap, title: "Fast Onboarding", desc: "Go from application to active partner in under 10 minutes" },
];

export default function ApplyPage() {
  const submit = useMutation(api.partnerApplications.submit);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    website: "",
    partnerType: "" as string,
    partnerCount: "",
    message: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.companyName.trim()) { setError("Company name is required"); return; }
    if (!form.contactName.trim()) { setError("Your name is required"); return; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setError("Valid email is required"); return; }
    if (!form.partnerType) { setError("Please select a partnership type"); return; }

    setSubmitting(true);
    try {
      await submit({
        companyName: form.companyName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim(),
        website: form.website.trim() || undefined,
        partnerType: form.partnerType as "reseller" | "referral" | "integration" | "affiliate",
        partnerCount: form.partnerCount || undefined,
        message: form.message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
        <nav style={{ padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-.02em", color: "#fff", textDecoration: "none" }}>
            Covant.ai
          </Link>
        </nav>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <CheckCircle size={36} color="#22c55e" />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: ".75rem" }}>
            Application Received
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,.6)", lineHeight: 1.6, marginBottom: "2rem" }}>
            Thanks, {form.contactName.split(" ")[0]}! We&apos;ll review your application and get back to you within 1-2 business days.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.5rem", borderRadius: 10, background: "#fff", color: "#000", fontWeight: 700, fontSize: ".9rem", textDecoration: "none" }}>
              Back to Covant
            </Link>
            <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.5rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.15)", color: "#fff", fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
              Try the Demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      {/* Nav */}
      <nav style={{ padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-.02em", color: "#fff", textDecoration: "none" }}>
          Covant.ai
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/sign-up" style={{ padding: ".5rem 1rem", borderRadius: 8, background: "#fff", color: "#000", fontWeight: 700, fontSize: ".85rem", textDecoration: "none" }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".35rem .85rem", borderRadius: 999, background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)", marginBottom: "1rem", fontSize: ".8rem", fontWeight: 600, color: "#818cf8" }}>
            <Handshake size={14} /> Partner Program
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: "1rem" }}>
            Grow with Covant
          </h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,.55)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Join our partner program and earn commissions for every deal you bring. Real-time attribution, transparent payouts, and a portal built for you.
          </p>
        </div>

        {/* Benefits */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {BENEFITS.map((b) => (
            <div key={b.title} style={{ padding: "1.25rem", borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
              <b.icon size={22} style={{ color: "#818cf8", marginBottom: ".75rem" }} />
              <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".25rem" }}>{b.title}</h3>
              <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 2rem 6rem" }}>
        <div style={{ padding: "2rem", borderRadius: 16, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: ".25rem" }}>
            Apply to Partner
          </h2>
          <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.5)", marginBottom: "1.5rem" }}>
            Fill in the basics — we&apos;ll follow up within 1-2 business days.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Company + Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: ".35rem" }}>
                  Company Name *
                </label>
                <input
                  value={form.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="Acme Corp"
                  style={{ width: "100%", padding: ".65rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".9rem", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: ".35rem" }}>
                  Your Name *
                </label>
                <input
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  placeholder="Jane Smith"
                  style={{ width: "100%", padding: ".65rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".9rem", outline: "none" }}
                />
              </div>
            </div>

            {/* Email + Website */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: ".35rem" }}>
                  Work Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="jane@acme.com"
                  style={{ width: "100%", padding: ".65rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".9rem", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: ".35rem" }}>
                  Website
                </label>
                <input
                  value={form.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://acme.com"
                  style={{ width: "100%", padding: ".65rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".9rem", outline: "none" }}
                />
              </div>
            </div>

            {/* Partnership Type */}
            <div>
              <label style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: ".5rem" }}>
                Partnership Type *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                {PARTNER_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => updateField("partnerType", pt.value)}
                    style={{
                      padding: ".7rem .85rem",
                      borderRadius: 10,
                      border: form.partnerType === pt.value ? "2px solid #6366f1" : "1px solid rgba(255,255,255,.1)",
                      background: form.partnerType === pt.value ? "rgba(99,102,241,.1)" : "transparent",
                      color: "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{pt.label}</div>
                    <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.45)", marginTop: ".1rem" }}>{pt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Team Size */}
            <div>
              <label style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: ".35rem" }}>
                Team Size
              </label>
              <select
                value={form.partnerCount}
                onChange={(e) => updateField("partnerCount", e.target.value)}
                style={{ width: "100%", padding: ".65rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".9rem", outline: "none" }}
              >
                <option value="" style={{ color: "#000" }}>Select team size</option>
                {PARTNER_COUNTS.map((pc) => (
                  <option key={pc} value={pc} style={{ color: "#000" }}>{pc}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: ".35rem" }}>
                Why do you want to partner with us?
              </label>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={3}
                placeholder="Tell us about your business and how you'd like to work together..."
                style={{ width: "100%", padding: ".65rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".9rem", outline: "none", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: ".6rem .85rem", borderRadius: 8, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#fca5a5", fontSize: ".85rem" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: ".85rem 1.5rem",
                borderRadius: 10,
                border: "none",
                background: "#fff",
                color: "#000",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: submitting ? "wait" : "pointer",
                opacity: submitting ? 0.7 : 1,
                transition: "opacity .15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: ".5rem",
              }}
            >
              {submitting ? "Submitting..." : "Submit Application"}
              {!submitting && <ArrowRight size={18} />}
            </button>

            <p style={{ fontSize: ".75rem", color: "rgba(255,255,255,.35)", textAlign: "center" }}>
              By applying, you agree to our{" "}
              <Link href="/terms" style={{ color: "rgba(255,255,255,.5)", textDecoration: "underline" }}>Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" style={{ color: "rgba(255,255,255,.5)", textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
