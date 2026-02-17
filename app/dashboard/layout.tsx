"use client";

import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <KeyboardShortcuts />
      <div className="dash-layout-v2">
        <DashboardSidebar />
        <main className="dash-main">
          <div className="dash-main-inner">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
