"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["g", "d"], label: "Go to Dashboard" },
  { keys: ["g", "p"], label: "Go to Partners" },
  { keys: ["g", "l"], label: "Go to Deals" },
  { keys: ["g", "r"], label: "Go to Reports" },
  { keys: ["g", "a"], label: "Go to Activity" },
  { keys: ["g", "s"], label: "Go to Settings" },
  { keys: ["g", "o"], label: "Go to Payouts" },
  { keys: ["g", "c"], label: "Go to Scoring" },
  { keys: ["?"], label: "Show this help" },
];

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/dashboard")) return;

    let pending = "";
    let timeout: NodeJS.Timeout;

    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Escape closes modal
      if (e.key === "Escape") {
        setShowHelp(false);
        pending = "";
        return;
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => { pending = ""; }, 1000);

      if (pending === "g") {
        pending = "";
        switch (e.key) {
          case "d": router.push("/dashboard"); break;
          case "p": router.push("/dashboard/partners"); break;
          case "l": router.push("/dashboard/deals"); break;
          case "r": router.push("/dashboard/reports"); break;
          case "a": router.push("/dashboard/activity"); break;
          case "s": router.push("/dashboard/settings"); break;
          case "o": router.push("/dashboard/payouts"); break;
          case "c": router.push("/dashboard/scoring"); break;
        }
        return;
      }

      if (e.key === "g") {
        pending = "g";
        return;
      }

      if (e.key === "?") {
        setShowHelp((prev) => !prev);
      }

      pending = "";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeout);
    };
  }, [router, pathname]);

  if (!showHelp) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={() => setShowHelp(false)}
    >
      <div
        className="card animate-in"
        style={{ width: 420, maxWidth: "100%", padding: 0, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>⌨️ Keyboard Shortcuts</h2>
          <button
            onClick={() => setShowHelp(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "1rem 1.5rem" }}>
          {SHORTCUTS.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "var(--fg)" }}>{s.label}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 24,
                      height: 24,
                      padding: "0 6px",
                      background: "var(--subtle)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      color: "var(--fg)",
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--subtle)",
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <p className="muted" style={{ fontSize: "0.75rem" }}>
            Press <kbd style={{ padding: "1px 4px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, fontSize: "0.7rem" }}>Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
