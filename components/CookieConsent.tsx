"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "covant-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show on dashboard, portal, auth, or admin pages
    const path = window.location.pathname;
    if (
      path.startsWith("/dashboard") ||
      path.startsWith("/portal") ||
      path.startsWith("/sign-") ||
      path.startsWith("/admin") ||
      path.startsWith("/onboard")
    ) return;

    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "0 1rem 1rem",
        pointerEvents: "none",
        animation: "cookieSlideUp 0.4s ease-out",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto 0 0",
          marginLeft: "1rem",
          background: "#111",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 14,
          padding: "1.25rem 1.5rem",
          pointerEvents: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(129,140,248,.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <Cookie size={18} strokeWidth={1.5} style={{ color: "rgba(129,140,248,.8)" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.8)", lineHeight: 1.5, margin: 0 }}>
              We use cookies to improve your experience and analyze site traffic.{" "}
              <Link
                href="/privacy"
                style={{
                  color: "rgba(129,140,248,.8)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Privacy Policy
              </Link>
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button
                onClick={handleAccept}
                style={{
                  padding: ".4rem 1rem",
                  fontSize: ".8rem",
                  fontWeight: 600,
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "opacity .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                style={{
                  padding: ".4rem 1rem",
                  fontSize: ".8rem",
                  fontWeight: 600,
                  background: "transparent",
                  color: "rgba(255,255,255,.5)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,.7)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,.5)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                }}
              >
                Decline
              </button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            aria-label="Close cookie banner"
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,.3)",
              cursor: "pointer",
              padding: 4,
              flexShrink: 0,
              transition: "color .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.3)")}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cookieSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
