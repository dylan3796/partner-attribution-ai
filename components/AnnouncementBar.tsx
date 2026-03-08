"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Sparkles } from "lucide-react";

const DISMISS_KEY = "covant_announcement_dismissed_v1";

export default function AnnouncementBar() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  // Only show on marketing pages
  const isMarketing =
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/portal") &&
    !pathname.startsWith("/sign-") &&
    !pathname.startsWith("/onboard") &&
    !pathname.startsWith("/setup") &&
    !pathname.startsWith("/admin");

  useEffect(() => {
    try {
      const val = localStorage.getItem(DISMISS_KEY);
      if (!val) setDismissed(false);
    } catch {
      // localStorage unavailable
    }
  }, []);

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // ignore
    }
  }

  if (dismissed || !isMarketing) return null;

  return (
    <div
      style={{
        background: "linear-gradient(90deg, rgba(99,102,241,.15) 0%, rgba(129,140,248,.1) 50%, rgba(99,102,241,.15) 100%)",
        borderBottom: "1px solid rgba(129,140,248,.2)",
        position: "relative",
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 48px 10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: ".85rem",
          color: "rgba(255,255,255,.85)",
        }}
      >
        <Sparkles
          size={14}
          style={{ color: "#818cf8", flexShrink: 0 }}
        />
        <span>
          <strong style={{ color: "#a5b4fc", fontWeight: 600 }}>Early access is open.</strong>{" "}
          Be one of the first teams to automate partner attribution.
        </span>
        <Link
          href="/beta"
          style={{
            color: "#818cf8",
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
            marginLeft: 4,
            borderBottom: "1px solid rgba(129,140,248,.4)",
            paddingBottom: 1,
            transition: "border-color .15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(129,140,248,.8)")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(129,140,248,.4)")}
        >
          Join the beta →
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,.4)",
          cursor: "pointer",
          padding: 4,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color .15s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
        onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.4)")}
      >
        <X size={14} />
      </button>
    </div>
  );
}
