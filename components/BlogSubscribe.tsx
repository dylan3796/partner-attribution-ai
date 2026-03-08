"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mail, Check, ArrowRight } from "lucide-react";

export default function BlogSubscribe({ variant = "inline" }: { variant?: "inline" | "card" }) {
  const captureLead = useMutation(api.leads.captureLead);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Enter your email");
      setState("error");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Enter a valid email");
      setState("error");
      return;
    }
    setState("loading");
    setErrorMsg("");
    try {
      await captureLead({ email, source: "blog_newsletter" });
      setState("success");
    } catch {
      // Duplicate or other error — still show success (they're already subscribed)
      setState("success");
    }
  }

  if (variant === "card") {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, rgba(129,140,248,.08) 0%, rgba(129,140,248,.02) 100%)",
          border: "1px solid rgba(129,140,248,.15)",
          borderRadius: 12,
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(129,140,248,.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Mail size={20} style={{ color: "#818cf8" }} />
          </div>
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          Get partner intelligence insights
        </h3>
        <p style={{ color: "#666", fontSize: ".85rem", lineHeight: 1.6, margin: "0 0 20px", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
          New articles on attribution, commissions, and scaling partner programs. No spam — just signal.
        </p>

        {state === "success" ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#22c55e", fontSize: ".9rem", fontWeight: 600 }}>
            <Check size={18} /> You&apos;re in. We&apos;ll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState("idle"); setErrorMsg(""); }}
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "rgba(255,255,255,.05)",
                border: errorMsg ? "1px solid #ef4444" : "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: ".85rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={state === "loading"}
              style={{
                padding: "10px 18px",
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: ".85rem",
                cursor: state === "loading" ? "wait" : "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                opacity: state === "loading" ? 0.7 : 1,
              }}
            >
              Subscribe
            </button>
          </form>
        )}
        {errorMsg && (
          <p style={{ color: "#ef4444", fontSize: ".78rem", marginTop: 8 }}>{errorMsg}</p>
        )}
      </div>
    );
  }

  // Inline variant — compact, for bottom of articles
  return (
    <div
      style={{
        borderTop: "1px solid #1a1a1a",
        padding: "40px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <p style={{ color: "#fff", fontSize: ".95rem", fontWeight: 700, margin: "0 0 4px" }}>
            Stay sharp on partner intelligence
          </p>
          <p style={{ color: "#555", fontSize: ".8rem", margin: 0, lineHeight: 1.5 }}>
            New insights on attribution, commissions, and program ops. No fluff.
          </p>
        </div>

        {state === "success" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: ".85rem", fontWeight: 600, padding: "10px 0" }}>
            <Check size={16} /> Subscribed
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState("idle"); setErrorMsg(""); }}
              style={{
                padding: "9px 14px",
                background: "rgba(255,255,255,.05)",
                border: errorMsg ? "1px solid #ef4444" : "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: ".85rem",
                outline: "none",
                width: 200,
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={state === "loading"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "9px 14px",
                background: "rgba(255,255,255,.08)",
                color: "#ccc",
                border: "1px solid #333",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: ".83rem",
                cursor: state === "loading" ? "wait" : "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                opacity: state === "loading" ? 0.7 : 1,
              }}
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
      {errorMsg && (
        <p style={{ color: "#ef4444", fontSize: ".78rem", marginTop: 6 }}>{errorMsg}</p>
      )}
    </div>
  );
}
