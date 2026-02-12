"use client";

import { usePortal } from "@/lib/portal-context";
import { Building2, ChevronRight, Shield } from "lucide-react";

export default function PortalGate({ children }: { children: React.ReactNode }) {
  const { partner, setPartner, allPartners } = usePortal();

  if (partner) return <>{children}</>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--subtle) 0%, var(--border) 100%)",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
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
            }}
          >
            <Shield size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Partner<span style={{ fontWeight: 400 }}>AI</span> Portal
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Sign in to access your partner dashboard
          </p>
        </div>

        {/* Partner selection card */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              background: "var(--subtle)",
            }}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Demo — Select your company
            </p>
          </div>
          {allPartners.map((p) => (
            <button
              key={p.id}
              onClick={() => setPartner(p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                width: "100%",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                background: "none",
                border: "none",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "var(--border)",
                cursor: "pointer",
                transition: "background 0.15s",
                textAlign: "left",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--subtle)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "#000",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                {p.companyName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{p.companyName}</p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                  {p.contactName} · {p.type.charAt(0).toUpperCase() + p.type.slice(1)} · {p.tier.charAt(0).toUpperCase() + p.tier.slice(1)} Tier
                </p>
              </div>
              <ChevronRight size={18} color="var(--muted)" />
            </button>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "0.8rem",
            marginTop: "1.5rem",
          }}
        >
          This is a demo environment. In production, partners would sign in with SSO.
        </p>
      </div>
    </div>
  );
}
