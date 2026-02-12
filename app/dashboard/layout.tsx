"use client";

import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="dash-layout">
        <div className="dash-content">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
