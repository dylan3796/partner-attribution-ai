"use client";

import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import DashboardSidebar from "@/components/DashboardSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { CommandPalette } from "@/components/ui/command-palette";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <KeyboardShortcuts />
      <CommandPalette />
      <div className="dash-layout-v2">
        <DashboardSidebar />
        <main className="dash-main">
          <div className="dash-topbar">
            <div className="dash-topbar-right">
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
                  borderRadius: 8, border: "1px solid var(--border)", background: "var(--subtle)",
                  cursor: "pointer", fontSize: ".8rem", color: "var(--muted)", fontFamily: "inherit",
                }}
              >
                Search...
                <kbd style={{ padding: "1px 5px", borderRadius: 4, fontSize: ".65rem", fontWeight: 600, background: "var(--bg)", border: "1px solid var(--border)" }}>⌘K</kbd>
              </button>
              <NotificationBell />
            </div>
          </div>
          <div className="dash-main-inner">
            {children}
          </div>
        </main>
      </div>
      <style jsx>{`
        .dash-topbar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 12px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--background);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .dash-topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </ToastProvider>
  );
}
