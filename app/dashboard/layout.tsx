"use client";

import { useState } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import DashboardSidebar from "@/components/DashboardSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { CommandPalette } from "@/components/ui/command-palette";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ToastProvider>
      <KeyboardShortcuts />
      <CommandPalette />
      <a href="#main-content" style={{
        position: "fixed", left: 8, top: -60, zIndex: 9999, padding: "8px 16px",
        background: "#6366f1", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: ".85rem",
        textDecoration: "none", transition: "top 0.2s",
      }} onFocus={(e) => { e.currentTarget.style.top = "8px"; }} onBlur={(e) => { e.currentTarget.style.top = "-60px"; }}>
        Skip to content
      </a>
      <div className="dash-layout-v2">
        <DashboardSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <main className="dash-main" id="main-content" tabIndex={-1}>
          <div className="dash-topbar">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="dash-topbar-right">
              <button
                className="search-btn"
                onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              >
                Search...
                <kbd>⌘K</kbd>
              </button>
              <DarkModeToggle />
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
          justify-content: space-between;
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
        .mobile-menu-btn {
          display: none;
          background: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: var(--fg);
          line-height: 0;
        }
        .search-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--subtle);
          cursor: pointer;
          font-size: .8rem;
          color: var(--muted);
          font-family: inherit;
        }
        .search-btn kbd {
          padding: 1px 5px;
          border-radius: 4px;
          font-size: .65rem;
          font-weight: 600;
          background: var(--bg);
          border: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }
          .dash-topbar {
            padding: 10px 16px;
          }
          .search-btn kbd {
            display: none;
          }
        }
      `}</style>
    </ToastProvider>
  );
}
