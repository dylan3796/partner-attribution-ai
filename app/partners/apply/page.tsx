"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Loader2, Building2, Users, Zap, Briefcase } from "lucide-react";

type PartnerType = "reseller" | "referral" | "integration" | "agency";
type EstimatedDeals = "1-5" | "6-20" | "21-50" | "50+";

const partnerTypeOptions: { value: PartnerType; label: string; icon: typeof Building2; description: string }[] = [
  { value: "reseller", label: "Reseller", icon: Building2, description: "Sell our product directly to customers" },
  { value: "referral", label: "Referral", icon: Users, description: "Refer leads and earn commissions" },
  { value: "integration", label: "Integration", icon: Zap, description: "Build integrations with your product" },
  { value: "agency", label: "Agency", icon: Briefcase, description: "Implement and service customers" },
];

const estimatedDealsOptions: { value: EstimatedDeals; label: string }[] = [
  { value: "1-5", label: "1-5 deals per quarter" },
  { value: "6-20", label: "6-20 deals per quarter" },
  { value: "21-50", label: "21-50 deals per quarter" },
  { value: "50+", label: "50+ deals per quarter" },
];

export default function PartnerApplyPage() {
  const [formState, setFormState] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    website: "",
    partnerType: "" as PartnerType | "",
    estimatedDeals: "" as EstimatedDeals | "",
    description: "",
    source: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handlePartnerTypeSelect = (type: PartnerType) => {
    setFormState((prev) => ({ ...prev, partnerType: type }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formState.name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!formState.company.trim()) {
      setError("Please enter your company name");
      return;
    }
    if (!formState.email.trim() || !/\S+@\S+\.\S+/.test(formState.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formState.partnerType) {
      setError("Please select a partner type");
      return;
    }
    if (!formState.estimatedDeals) {
      setError("Please select estimated deals per quarter");
      return;
    }
    if (!formState.description.trim()) {
      setError("Please tell us about your business");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          title: formState.title.trim() || undefined,
          company: formState.company.trim(),
          email: formState.email.trim(),
          website: formState.website.trim() || undefined,
          partnerType: formState.partnerType,
          estimatedDeals: formState.estimatedDeals,
          description: formState.description.trim(),
          source: formState.source.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "var(--bg)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{ 
          maxWidth: 480, 
          textAlign: "center",
          animation: "slideUp 0.4s ease",
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
          }}>
            <CheckCircle size={40} color="white" />
          </div>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: 800, 
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}>
            Application Received
          </h1>
          <p style={{ 
            color: "var(--muted)", 
            fontSize: "1.1rem", 
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}>
            Thank you for your interest in partnering with Covant. We&apos;ll review your application and be in touch within 2 business days.
          </p>
          <Link 
            href="/" 
            className="btn"
            style={{ textDecoration: "none" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "var(--bg)",
      paddingTop: "100px",
      paddingBottom: "4rem",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Back link */}
        <Link 
          href="/"
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem",
            color: "var(--muted)",
            fontSize: "0.9rem",
            marginBottom: "2rem",
            transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={16} />
          Back to Covant
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="tag" style={{ marginBottom: "1rem" }}>Partner Program</div>
          <h1 style={{ 
            fontSize: "clamp(2rem, 4vw, 2.8rem)", 
            fontWeight: 800, 
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}>
            Become a Covant Partner
          </h1>
          <p style={{ 
            color: "var(--muted)", 
            fontSize: "1.1rem", 
            lineHeight: 1.6,
          }}>
            Join our partner program and help your clients track partner attribution, automate commissions, and grow their channel programs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: "2rem" }}>
            {/* Personal Info */}
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              👤 Your Information
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                  Your Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                  Title
                </label>
                <input
                  className="input"
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  placeholder="VP of Partnerships"
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                Email <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                className="input"
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="john@company.com"
              />
            </div>

            {/* Company Info */}
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              🏢 Company Information
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                  Company Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  className="input"
                  type="text"
                  name="company"
                  value={formState.company}
                  onChange={handleChange}
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                  Website
                </label>
                <input
                  className="input"
                  type="url"
                  name="website"
                  value={formState.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                />
              </div>
            </div>

            {/* Partner Type Selection */}
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              🤝 Partnership Details
            </h3>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.75rem" }}>
                Partner Type <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                {partnerTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formState.partnerType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePartnerTypeSelect(option.value)}
                      style={{
                        padding: "1rem",
                        borderRadius: "12px",
                        border: isSelected ? "2px solid #6366f1" : "1px solid var(--border)",
                        background: isSelected ? "rgba(99, 102, 241, 0.1)" : "var(--subtle)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <Icon size={16} color={isSelected ? "#6366f1" : "var(--muted)"} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: isSelected ? "#6366f1" : "var(--fg)" }}>
                          {option.label}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                Estimated Deals Per Quarter <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                className="input"
                name="estimatedDeals"
                value={formState.estimatedDeals}
                onChange={handleChange}
                style={{ cursor: "pointer" }}
              >
                <option value="">Select estimated volume...</option>
                {estimatedDealsOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                Tell us about your business <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                className="input"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Tell us about your company and why you'd be a good partner. What's your target market? How would you sell or integrate Covant?"
                style={{ minHeight: 120, resize: "vertical" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                How did you hear about us? <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                className="input"
                type="text"
                name="source"
                value={formState.source}
                onChange={handleChange}
                placeholder="e.g. LinkedIn, referral, search..."
              />
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="btn"
              disabled={submitting}
              style={{ 
                width: "100%", 
                padding: "1rem",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>

        {/* Footer note */}
        <p style={{ 
          textAlign: "center", 
          color: "var(--muted)", 
          fontSize: "0.85rem",
          marginTop: "1.5rem",
        }}>
          Questions? Email us at{" "}
          <a href="mailto:partners@covant.ai" style={{ color: "#6366f1" }}>
            partners@covant.ai
          </a>
        </p>
      </div>
    </div>
  );
}
