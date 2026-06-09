"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ATTRIBUTION_TOOLS, AUDIT_SOURCE, EARLY_ACCESS_SOURCE } from "@/lib/marketing";

type Variant = "early_access" | "audit";

const COPY: Record<Variant, { button: string; sending: string; done: string; switchLabel: string }> = {
  early_access: {
    button: "Request early access",
    sending: "Sending…",
    done: "Thanks — you're on the list. We'll be in touch as early access opens up.",
    switchLabel: "Prefer a partner program audit first?",
  },
  audit: {
    button: "Request a program audit",
    sending: "Sending…",
    done: "Thanks — we'll be in touch to set up your partner program audit.",
    switchLabel: "Just want early access?",
  },
};

/**
 * Early-access capture for the landing page. Posts to the existing Convex
 * captureLead mutation; the "current attribution tool" answer rides in notes
 * so no schema change is needed. Falls back to mailto when Convex is
 * unavailable (e.g. demo deployments without a backend).
 */
export default function EarlyAccessForm({ defaultVariant = "early_access" }: { defaultVariant?: Variant }) {
  const captureLead = useMutation(api.leads.captureLead);
  const [variant, setVariant] = useState<Variant>(defaultVariant);
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [tool, setTool] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const copy = COPY[variant];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      await captureLead({
        email,
        contactName: contactName || undefined,
        company: company || undefined,
        notes: tool ? `attribution_tool: ${tool}` : undefined,
        source: variant === "audit" ? AUDIT_SOURCE : EARLY_ACCESS_SOURCE,
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="m-body">{copy.done}</p>;
  }

  return (
    <form className="m-form" onSubmit={handleSubmit}>
      <input
        className="m-input"
        type="text"
        placeholder="Your name"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        autoComplete="name"
      />
      <input
        className="m-input"
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <input
        className="m-input"
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        autoComplete="organization"
      />
      <select
        className="m-select"
        value={tool}
        onChange={(e) => setTool(e.target.value)}
        aria-label="How do you track partner attribution today?"
      >
        <option value="">How do you track attribution today?</option>
        {ATTRIBUTION_TOOLS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button className="m-btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? copy.sending : copy.button}
      </button>
      <button
        type="button"
        className="m-small"
        style={{ background: "none", border: 0, cursor: "pointer", textAlign: "left", padding: 0, color: "var(--m-muted)", textDecoration: "underline" }}
        onClick={() => setVariant(variant === "audit" ? "early_access" : "audit")}
      >
        {copy.switchLabel}
      </button>
      {status === "error" && (
        <span className="m-small" style={{ color: "var(--danger)" }}>
          Something went wrong. Email us at hello@covant.ai.
        </span>
      )}
    </form>
  );
}
