"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield } from "lucide-react";

const SESSION_KEY = "covant_portal_session";

export type PortalSession = {
  partnerId: string;
  partnerName: string;
  email: string;
};

export function usePortalSession() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return { session, loading, logout };
}

export default function PortalGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [session, setSession] = useState<PortalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Look up partner by email when submitted
  const partnerByEmail = useQuery(
    api.partners.getByEmail,
    submittedEmail ? { email: submittedEmail } : "skip"
  );

  // When Convex returns a result for the email lookup
  useEffect(() => {
    if (submittedEmail && partnerByEmail !== undefined) {
      if (partnerByEmail) {
        const newSession: PortalSession = {
          partnerId: partnerByEmail._id,
          partnerName: partnerByEmail.name,
          email: partnerByEmail.email,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        setSession(newSession);
        setError("");
      } else {
        setError("No partner account found with that email. Contact your program manager.");
        setSubmittedEmail(null);
      }
    }
  }, [partnerByEmail, submittedEmail]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmittedEmail(email.trim().toLowerCase());
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#0c0c0c",
          color: "#fff",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#0c0c0c",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#161616",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: "2.5rem",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                background: "#000",
                borderRadius: 14,
                marginBottom: "1rem",
                border: "1px solid #333",
              }}
            >
              <Shield size={28} color="#fff" />
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: ".5rem",
              }}
            >
              Partner Portal
            </div>
            <p style={{ color: "#888", fontSize: ".9rem" }}>
              Enter your email to access your partner dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: ".85rem",
                  color: "#aaa",
                  marginBottom: ".5rem",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%",
                  padding: ".75rem 1rem",
                  background: "#0c0c0c",
                  border: "1px solid #333",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: ".9rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                required
                autoFocus
              />
            </div>
            {error && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!email.trim() || submittedEmail !== null}
              style={{
                width: "100%",
                padding: ".75rem",
                background:
                  !email.trim() || submittedEmail !== null ? "#333" : "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: ".95rem",
                fontWeight: 600,
                cursor:
                  !email.trim() || submittedEmail !== null
                    ? "not-allowed"
                    : "pointer",
                transition: "background 0.15s",
              }}
            >
              {submittedEmail ? "Checking..." : "Access Portal"}
            </button>
          </form>
          <p
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: ".8rem",
              color: "#555",
            }}
          >
            Don&apos;t have an account?{" "}
            <a href="/setup" style={{ color: "#6366f1" }}>
              Apply to join
            </a>
          </p>

          {/* Demo accounts */}
          <div style={{ marginTop: "1.5rem", borderTop: "1px solid #2a2a2a", paddingTop: "1.5rem" }}>
            <p style={{ fontSize: ".85rem", fontWeight: 600, color: "#aaa", marginBottom: ".75rem", textAlign: "center" }}>Try a demo account</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { name: "Sarah Chen", company: "TechBridge Partners", email: "sarah.chen@techbridge.io" },
                { name: "Marcus Webb", company: "Apex Growth Group", email: "marcus.webb@apexgrowth.com" },
                { name: "Priya Patel", company: "Stackline Agency", email: "priya.patel@stackline.co" },
                { name: "James Kim", company: "Northlight Solutions", email: "james.kim@northlight.io" },
                { name: "Elena Torres", company: "Clearpath Consulting", email: "elena.torres@clearpath.io" },
              ].map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => setEmail(account.email)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    background: "#111",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.15s",
                    width: "100%",
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1a1a2e", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".7rem", flexShrink: 0 }}>
                    {account.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: ".8rem", fontWeight: 600, color: "#ddd" }}>{account.name}</div>
                    <div style={{ fontSize: ".7rem", color: "#666" }}>{account.company}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in — render children
  return <>{children}</>;
}
