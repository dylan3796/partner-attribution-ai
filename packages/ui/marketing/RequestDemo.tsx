"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DEMO_SOURCE } from "@/lib/marketing";

/**
 * Inline "Request a demo" form. Posts to the existing Convex captureLead
 * mutation — no external scheduler. Used in each page's closing CTA band.
 */
export default function RequestDemo({ onLight = false }: { onLight?: boolean }) {
  const captureLead = useMutation(api.leads.captureLead);
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      await captureLead({
        email,
        contactName: contactName || undefined,
        company: company || undefined,
        source: DEMO_SOURCE,
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="m-body" style={{ color: onLight ? "var(--m-ink)" : undefined }}>
        Thanks — we&apos;ll be in touch shortly to set up your demo.
      </p>
    );
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
      <button className="m-btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request a demo"}
      </button>
      {status === "error" && (
        <span className="m-small" style={{ color: "var(--danger)" }}>
          Something went wrong. Email us at hello@covant.ai.
        </span>
      )}
    </form>
  );
}
