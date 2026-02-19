"use client";

import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import DashboardSidebar from "@/components/DashboardSidebar";
import { NotificationBell } from "@/components/NotificationBell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <KeyboardShortcuts />
      <div className="dash-layout-v2">
        <DashboardSidebar />
        <main className="dash-main">
          <div className="dash-topbar">
            <div className="dash-topbar-right">
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
