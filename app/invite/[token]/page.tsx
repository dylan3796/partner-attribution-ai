"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Building2, User, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const SESSION_KEY = "covant_portal_session";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const invite = useQuery(api.invites.getByToken, { token });
  const acceptInvite = useMutation(api.invites.accept);

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    type: "reseller" as "affiliate" | "referral" | "reseller" | "integration",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Loading state
  if (invite === undefined) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--subtle)" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Invalid or expired
  if (!invite || invite.expired) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--subtle)" }}>
        <div className="card" style={{ maxWidth: 480, width: "100%", padding: "2.5rem", textAlign: "center" }}>
          <AlertCircle size={48} style={{ color: "var(--muted)", marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            {invite?.expired ? "Invite Expired" : "Invalid Invite"}
          </h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            {invite?.expired
              ? "This invitation link has expired. Please ask your partner manager to send a new one."
              : "This invitation link is not valid. Please check the URL or contact your partner manager."}
          </p>
        </div>
      </div>
    );
  }

  // Pre-fill from invite data (once)
  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    if (prefilled || !invite || invite.expired) return;
    const updates: Partial<typeof form> = {};
    if (invite.email) updates.email = invite.email;
    if (invite.partnerType) updates.type = invite.partnerType;
    if (Object.keys(updates).length > 0) {
      setForm((f) => ({ ...f, ...updates }));
    }
    setPrefilled(true);
  }, [invite, prefilled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await acceptInvite({
        token,
        name: form.companyName,
        contactName: form.contactName,
        email: form.email,
        type: form.type,
      });

      // Set portal session in localStorage
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          partnerId: result.partnerId,
          partnerName: result.name,
          email: result.email,
        })
      );

      setSuccess(true);

      // Redirect to portal after brief delay
      setTimeout(() => router.push("/portal"), 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--subtle)" }}>
        <div className="card" style={{ maxWidth: 480, width: "100%", padding: "2.5rem", textAlign: "center" }}>
          <CheckCircle size={48} style={{ color: "#22c55e", marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Welcome aboard!</h1>
          <p style={{ color: "var(--muted)" }}>Your partner account is set up. Redirecting to your portal...</p>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    marginBottom: "0.4rem",
    color: "var(--fg)",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--subtle)", padding: "1rem" }}>
      <div className="card" style={{ maxWidth: 520, width: "100%", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Join {"organizationName" in invite ? invite.organizationName : "Partner Program"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            You&apos;ve been invited to join the partner program. Fill out your details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>
              <Building2 size={16} /> Company Name
            </label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Acme Partners Inc."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <User size={16} /> Your Name
            </label>
            <input
              type="text"
              required
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="Jane Smith"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jane@acme.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Partner Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="reseller">Reseller</option>
              <option value="referral">Referral</option>
              <option value="affiliate">Affiliate</option>
              <option value="integration">Integration</option>
            </select>
          </div>

          {error && (
            <div style={{ padding: "0.75rem 1rem", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: 8,
              border: "none",
              background: "#000",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              fontFamily: "inherit",
              marginTop: "0.5rem",
            }}
          >
            {submitting ? "Setting up your account..." : "Join Partner Program"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--muted)", marginTop: "1.5rem" }}>
          By joining, you agree to the partner program terms and conditions.
        </p>
      </div>
    </div>
  );
}
