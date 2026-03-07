"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Keyboard } from "lucide-react";

type Shortcut = {
  keys: string[];
  label: string;
  action?: () => void;
};

type ShortcutSection = {
  title: string;
  shortcuts: Shortcut[];
};

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const [awaitingG, setAwaitingG] = useState(false);
  const router = useRouter();

  const sections: ShortcutSection[] = [
    {
      title: "General",
      shortcuts: [
        { keys: ["⌘", "K"], label: "Open search" },
        { keys: ["?"], label: "Show keyboard shortcuts" },
        { keys: ["Esc"], label: "Close dialog / cancel" },
      ],
    },
    {
      title: "Navigation (press G then…)",
      shortcuts: [
        { keys: ["G", "D"], label: "Go to Dashboard" },
        { keys: ["G", "P"], label: "Go to Partners" },
        { keys: ["G", "E"], label: "Go to Deals" },
        { keys: ["G", "I"], label: "Go to Pipeline" },
        { keys: ["G", "Y"], label: "Go to Payouts" },
        { keys: ["G", "R"], label: "Go to Reports" },
        { keys: ["G", "L"], label: "Go to Leaderboard" },
        { keys: ["G", "O"], label: "Go to Goals" },
        { keys: ["G", "F"], label: "Go to Forecasting" },
        { keys: ["G", "S"], label: "Go to Settings" },
        { keys: ["G", "N"], label: "Go to Notifications" },
        { keys: ["G", "H"], label: "Go to Partner Health" },
      ],
    },
  ];

  const navMap: Record<string, string> = {
    d: "/dashboard",
    p: "/dashboard/partners",
    e: "/dashboard/deals",
    i: "/dashboard/pipeline",
    y: "/dashboard/payouts",
    r: "/dashboard/reports",
    l: "/dashboard/leaderboard",
    o: "/dashboard/goals",
    f: "/dashboard/forecasting",
    s: "/dashboard/settings",
    n: "/dashboard/notifications",
    h: "/dashboard/partner-health",
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger in input fields
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      // ? key → toggle shortcuts dialog
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
        setAwaitingG(false);
        return;
      }

      // Esc → close dialog
      if (e.key === "Escape" && open) {
        setOpen(false);
        setAwaitingG(false);
        return;
      }

      // G-key navigation: press G, then a letter
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey && !open) {
        setAwaitingG(true);
        // Reset after 1.5s if no follow-up key
        setTimeout(() => setAwaitingG(false), 1500);
        return;
      }

      if (awaitingG && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const path = navMap[e.key.toLowerCase()];
        if (path) {
          e.preventDefault();
          router.push(path);
        }
        setAwaitingG(false);
        return;
      }
    },
    [open, awaitingG, router, navMap]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close on backdrop click
  if (!open) {
    return awaitingG ? (
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: ".8rem",
          color: "rgba(255,255,255,0.7)",
          fontFamily: "Inter, sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 6,
          animation: "fadeInKb 0.15s ease",
        }}
      >
        <kbd
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: ".7rem",
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          G
        </kbd>
        <span>then press a key…</span>
        <style>{`@keyframes fadeInKb { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    ) : null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          animation: "fadeInKb 0.15s ease",
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-label="Keyboard shortcuts"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: "min(480px, 90vw)",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: 0,
          fontFamily: "Inter, sans-serif",
          animation: "scaleInKb 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Keyboard size={18} style={{ color: "rgba(255,255,255,0.5)" }} />
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#fff" }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              padding: 4,
              lineHeight: 0,
              borderRadius: 4,
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sections */}
        <div style={{ padding: "12px 20px 20px" }}>
          {sections.map((section, si) => (
            <div key={si} style={{ marginBottom: si < sections.length - 1 ? 20 : 0 }}>
              <p
                style={{
                  fontSize: ".65rem",
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  margin: "0 0 8px",
                }}
              >
                {section.title}
              </p>
              {section.shortcuts.map((shortcut, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom:
                      idx < section.shortcuts.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <span style={{ fontSize: ".85rem", color: "rgba(255,255,255,0.7)" }}>
                    {shortcut.label}
                  </span>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {shortcut.keys.map((key, ki) => (
                      <span key={ki} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {ki > 0 && (
                          <span
                            style={{
                              fontSize: ".65rem",
                              color: "rgba(255,255,255,0.25)",
                              fontWeight: 500,
                            }}
                          >
                            then
                          </span>
                        )}
                        <kbd
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 24,
                            height: 24,
                            padding: "0 6px",
                            borderRadius: 5,
                            fontSize: ".7rem",
                            fontWeight: 600,
                            fontFamily: "inherit",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.6)",
                            boxShadow: "0 1px 0 rgba(255,255,255,0.05)",
                          }}
                        >
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes scaleInKb {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes fadeInKb {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}
