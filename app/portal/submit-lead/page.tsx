"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePortal } from "@/lib/portal-context";
import Link from "next/link";
import { Send, CheckCircle2, ArrowLeft } from "lucide-react";

const DEAL_SIZES = [
  { label: "Less than $10k", value: 10000 },
  { label: "$10k – $50k", value: 50000 },
  { label: "$50k – $100k", value: 100000 },
  { label: "$100k+", value: 200000 },
];

export default function SubmitLeadPage() {
  const { partner } = usePortal();
  const submitLead = useMutation(api.leads.submitLead);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    contactName: "",
    company: "",
    email: "",
    phone: "",
    estimatedValue: "",
    notes: "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!partner) return;
    setSubmitting(true);
    setError("");
    try {
      await submitLead({
        contactName: form.contactName,
        company: form.company,
        email: form.email,
        phone: form.phone || undefined,
        estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
        notes: form.notes || undefined,
        partnerEmail: partner.contactEmail,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit lead");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 500, margin: "4rem auto", textAlign: "center" }}>
        <CheckCircle2 size={48} style={{ color: "#22c55e", marginBottom: "1rem" }} />
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Lead Submitted!</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          We&apos;ll be in touch within 24 hours. You&apos;ll get attribution if this lead converts.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/portal" className="btn" style={{ padding: "0.6rem 1.25rem", borderRadius: 8, background: "var(--subtle)", border: "1px solid var(--border)", color: "var(--fg)", textDecoration: "none", fontSize: "0.9rem" }}>
            Back to Portal
          </Link>
          <Link href="/portal/leads" className="btn" style={{ padding: "0.6rem 1.25rem", borderRadius: 8, background: "#6366f1", color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>
            View My Leads
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--fg)",
    fontSize: "0.9rem",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginBottom: "0.35rem",
    color: "var(--fg)",
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <Link href="/portal" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "var(--muted)", fontSize: "0.85rem", textDecoration: "none", marginBottom: "1.5rem" }}>
        <ArrowLeft size={14} /> Back to Portal
      </Link>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Submit a Lead</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
        Refer a potential customer. You&apos;ll get attribution when the deal closes.
      </p>

      {error && (
        <div style={{ padding: "0.75rem 1rem", borderRadius: 8, background: "#ef444420", border: "1px solid #ef4444", color: "#ef4444", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={labelStyle}>Contact Name *</label>
          <input style={inputStyle} value={form.contactName} onChange={(e) => update("contactName", e.target.value)} required placeholder="Jane Smith" />
        </div>
        <div>
          <label style={labelStyle}>Company Name *</label>
          <input style={inputStyle} value={form.company} onChange={(e) => update("company", e.target.value)} required placeholder="Acme Corp" />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="jane@acme.com" />
        </div>
        <div>
          <label style={labelStyle}>Phone (optional)</label>
          <input style={inputStyle} type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
        </div>
        <div>
          <label style={labelStyle}>Estimated Deal Size (optional)</label>
          <select style={inputStyle} value={form.estimatedValue} onChange={(e) => update("estimatedValue", e.target.value)}>
            <option value="">Select…</option>
            {DEAL_SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Notes / How do you know them? (optional)</label>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Met at a conference, they're looking for a partner management solution…" />
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: 8,
            background: "#6366f1",
            color: "#fff",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.6 : 1,
            fontFamily: "inherit",
          }}
        >
          <Send size={16} />
          {submitting ? "Submitting…" : "Submit Lead"}
        </button>
      </form>
    </div>
  );
}
