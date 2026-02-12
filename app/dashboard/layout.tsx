"use client";

import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <KeyboardShortcuts />
      <div className="dash-layout">
        <div className="dash-content">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
