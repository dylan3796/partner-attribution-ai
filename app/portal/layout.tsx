"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Trophy,
  Rocket,
  HelpCircle,
} from "lucide-react";
import { PortalProvider, usePortal } from "@/lib/portal-context";
import PortalGate from "@/components/PortalGate";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

const sidebarLinks = [
  { name: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { name: "Getting Started", href: "/portal/onboarding", icon: Rocket },
  { name: "My Deals", href: "/portal/deals", icon: Briefcase },
  { name: "My Commissions", href: "/portal/commissions", icon: DollarSign },
  { name: "My Performance", href: "/portal/performance", icon: Trophy },
  { name: "Notifications", href: "/portal/notifications", icon: Bell },
  { name: "Help & Support", href: "/portal/support", icon: HelpCircle },
  { name: "Profile", href: "/portal/profile", icon: User },
];

function PortalSidebar() {
  const pathname = usePathname();
  const { partner, setPartner } = usePortal();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!partner) return null;

  const initials = partner.companyName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="portal-mobile-bar"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          zIndex: 200,
          padding: "0 1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span style={{ fontWeight: 700, fontSize: "1rem" }}>{partner.companyName}</span>
        </div>
        <span className="badge" style={{ textTransform: "capitalize" }}>
          {partner.tier}
        </span>
      </div>

      {/* Sidebar */}
      <aside
        className={`portal-sidebar ${mobileOpen ? "portal-sidebar-open" : ""}`}
        role="navigation"
        aria-label="Portal navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 260,
          background: "var(--bg)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 150,
          transition: "transform 0.2s ease",
        }}
      >
        {/* Company header */}
        <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#000",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.8rem",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {partner.companyName}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "capitalize" }}>
                {partner.tier} Tier · {partner.type}
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "0.75rem 0.75rem", overflowY: "auto" }}>
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: 8,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: isActive ? "var(--fg)" : "var(--muted)",
                  background: isActive ? "var(--subtle)" : "transparent",
                  transition: "all 0.15s",
                  marginBottom: "0.25rem",
                }}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)" }}>
          <Link
            href="/program"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginBottom: "0.5rem",
              transition: "color 0.15s",
            }}
          >
            View Partner Program →
          </Link>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginBottom: "0.75rem",
              transition: "color 0.15s",
            }}
          >
            ← Back to Main Site
          </Link>
          <button
            onClick={() => setPartner(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              color: "var(--muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
            <p style={{ fontSize: "0.7rem", color: "var(--muted)", opacity: 0.6 }}>Covant © 2026</p>
            <DarkModeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 140,
          }}
        />
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .portal-mobile-bar { display: flex !important; }
          .portal-sidebar { transform: translateX(-100%); }
          .portal-sidebar.portal-sidebar-open { transform: translateX(0); }
          .portal-main { margin-left: 0 !important; margin-top: 60px !important; padding: 1rem !important; }
          .portal-main .card { padding: 1.25rem !important; }
          .portal-main [style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; gap: 0.75rem !important; }
          .portal-main [style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
          .portal-main [style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .portal-main [style*="grid-template-columns: 3fr 2fr"] { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .portal-main [style*="flex: 1 1 300px"] { flex: 1 1 100% !important; }
          .portal-main h1 { font-size: 1.5rem !important; }
        }
        @media (max-width: 480px) {
          .portal-main [style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr !important; }
          .portal-main [style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalGate>
      <div style={{ minHeight: "100vh", background: "var(--subtle)" }}>
        <PortalSidebar />
        <main
          className="portal-main"
          style={{
            marginLeft: 260,
            minHeight: "100vh",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
        </main>
      </div>
    </PortalGate>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <PortalShell>{children}</PortalShell>
    </PortalProvider>
  );
}
