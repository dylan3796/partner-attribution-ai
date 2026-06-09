"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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

// Convex IDs are ~20+ char alphanumeric strings — validate before querying
function isValidConvexId(id: string): boolean {
  return typeof id === "string" && id.length >= 10 && /^[a-zA-Z0-9_]+$/.test(id);
}

export default function PortalGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [session, setSession] = useState<PortalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check for existing session on mount — validate partnerId format
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PortalSession;
        // Clear stale/demo sessions with invalid Convex IDs
        if (parsed && isValidConvexId(parsed.partnerId)) {
          setSession(parsed);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
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

  function handleSubmit(e?: React.FormEvent, overrideEmail?: string) {
    e?.preventDefault();
    const target = (overrideEmail ?? email).trim().toLowerCase();
    if (!target) return;
    setError("");
    setEmail(target);
    setSubmittedEmail(target);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#ffffff", color: "#0a0a0a" }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#ffffff", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 420, background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, background: "#0a0a0a", borderRadius: 14,
              marginBottom: "1rem", fontSize: "1.5rem", fontWeight: 800, color: "#ffffff",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              C
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0a0a0a", marginBottom: ".4rem" }}>
              Partner Portal
            </div>
            <p style={{ color: "#6b7280", fontSize: ".9rem" }}>
              Enter your email to access your partner dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, color: "#374151", marginBottom: ".5rem" }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%", padding: ".75rem 1rem", background: "#ffffff",
                  border: "1px solid #d1d5db", borderRadius: 8, color: "#0a0a0a",
                  fontSize: ".9rem", boxSizing: "border-box", outline: "none",
                  transition: "border-color .15s",
                }}
                required
                autoFocus
              />
            </div>
            {error && (
              <p style={{ color: "#ef4444", fontSize: ".85rem", marginBottom: ".75rem" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={!email.trim() || submittedEmail !== null}
              style={{
                width: "100%", padding: ".75rem",
                background: !email.trim() || submittedEmail !== null ? "#d1d5db" : "#0a0a0a",
                color: "#ffffff", border: "none", borderRadius: 8,
                fontSize: ".95rem", fontWeight: 600,
                cursor: !email.trim() || submittedEmail !== null ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              {submittedEmail ? "Checking..." : "Access Portal"}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: "1.75rem", borderTop: "1px solid #f3f4f6", paddingTop: "1.5rem" }}>
            <p style={{ fontSize: ".78rem", fontWeight: 600, color: "#9ca3af", marginBottom: ".75rem", textAlign: "center", letterSpacing: ".06em", textTransform: "uppercase" }}>
              Try a demo account
            </p>
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
                  onClick={() => handleSubmit(undefined, account.email)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                    background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8,
                    cursor: "pointer", textAlign: "left", transition: "border-color 0.15s, background .15s",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#f3f4f6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: "#0a0a0a",
                    color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: ".7rem", flexShrink: 0,
                  }}>
                    {account.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 600, color: "#0a0a0a" }}>{account.name}</div>
                    <div style={{ fontSize: ".72rem", color: "#6b7280" }}>{account.company}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Logged in — render portal
  return <>{children}</>;
}
