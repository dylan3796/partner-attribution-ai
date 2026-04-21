import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <KeyboardShortcuts />

      <a href="#main-content" style={{
        position: "fixed", left: 8, top: -60, zIndex: 9999, padding: "8px 16px",
        background: "#6366f1", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: ".85rem",
        textDecoration: "none", transition: "top 0.2s",
      }}>
        Skip to content
      </a>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </ToastProvider>
  );
}
