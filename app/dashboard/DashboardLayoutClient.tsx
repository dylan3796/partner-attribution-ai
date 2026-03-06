"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import DashboardSidebar from "@/components/DashboardSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { WhatsNewButton } from "@/components/WhatsNew";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Menu, X } from "lucide-react";

const CommandPalette = dynamic(
  () => import("@/components/ui/command-palette").then(m => ({ default: m.CommandPalette })),
  { ssr: false }
);

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <CommandPalette />
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
              <WhatsNewButton />
              <DarkModeToggle />
              <NotificationBell />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
          <div className="dash-main-inner">
            <Breadcrumbs />
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
    </>
  );
}
