import { UserButton } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import DashboardSidebar from "@/components/DashboardSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { UserProvisioner } from "@/components/UserProvisioner";
import { DemoBanner } from "@/components/DemoBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DemoBanner />
      <UserProvisioner />
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
