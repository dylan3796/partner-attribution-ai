"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PieChart,
  Settings,
  DollarSign,
  Trophy,
  Award,
  Megaphone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Gift,
  Rocket,
  Bell,
  GitBranch,
  Plug2,
  TrendingUp,
  FileText,
  BarChart2,
  Target,
  Crosshair,
  Heart,
  Scale,
  Star,
  ClipboardList,
  Package,
  HeartPulse,
  Lightbulb,
  Radio,
} from "lucide-react";

// ─── Nav structure ───────────────────────────────────────────────────────────
// Designed around the VP of Partnerships job-to-be-done:
// 1. Understand program health at a glance
// 2. Manage partners & their pipeline
// 3. Handle revenue & payouts
// 4. Run the program (incentives, certs, MDF)
// 5. Analyze & report
// ─────────────────────────────────────────────────────────────────────────────

type NavItem = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "",
    items: [
      { name: "Dashboard",      href: "/dashboard",         icon: LayoutDashboard, exact: true },
      { name: "Program Health", href: "/dashboard/health",  icon: Heart },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    label: "Partners",
    items: [
      { name: "All Partners",    href: "/dashboard/partners",             icon: Users },
      { name: "Partner Health", href: "/dashboard/partner-health",      icon: HeartPulse },
      { name: "Leads",          href: "/dashboard/leads",               icon: Star },
      { name: "Applications",   href: "/dashboard/partner-applications", icon: ClipboardList },
      { name: "Onboarding",     href: "/dashboard/onboarding",          icon: Rocket },
    ],
  },
  {
    label: "Revenue",
    items: [
      { name: "Deals",         href: "/dashboard/deals",       icon: Briefcase },
      { name: "Pipeline",      href: "/dashboard/pipeline",    icon: GitBranch },
      { name: "Payouts",       href: "/dashboard/payouts",     icon: DollarSign },
      { name: "Contracts",     href: "/dashboard/contracts",   icon: FileText },
      { name: "Products",      href: "/dashboard/products",    icon: Package },
      { name: "Disputes",      href: "/dashboard/conflicts",   icon: Scale },
    ],
  },
  {
    label: "Program",
    items: [
      { name: "Scoring & Tiers",  href: "/dashboard/scoring",       icon: Trophy },
      { name: "Incentives",       href: "/dashboard/incentives",    icon: Gift },
      { name: "Certifications",   href: "/dashboard/certifications", icon: Award },
      { name: "MDF",              href: "/dashboard/mdf",           icon: Megaphone },
      { name: "Announcements",    href: "/dashboard/announcements", icon: Radio },
      { name: "Volume Rebates",   href: "/dashboard/volume-rebates", icon: Scale },
    ],
  },
  {
    label: "Analytics",
    items: [
      { name: "Goals",           href: "/dashboard/goals",           icon: Target },
      { name: "Leaderboard",    href: "/dashboard/leaderboard",    icon: Trophy },
      { name: "Reports",        href: "/dashboard/reports",        icon: PieChart },
      { name: "Recommendations", href: "/dashboard/recommendations", icon: Lightbulb },
      { name: "Forecasting",    href: "/dashboard/forecasting",    icon: TrendingUp },
      { name: "Benchmarks",     href: "/dashboard/benchmarks",     icon: Crosshair },
      { name: "Cohorts",        href: "/dashboard/cohorts",        icon: BarChart2 },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Integrations", href: "/dashboard/integrations", icon: Plug2 },
      { name: "Settings",     href: "/dashboard/settings",     icon: Settings },
    ],
  },
];

// Pages moved out of main nav (still accessible via direct URL or Settings):
// - Tier Reviews     → /dashboard/scoring/tier-reviews  (accessible from Scoring)
// - Conflicts        → /dashboard/conflicts             (accessible from dashboard alerts)
// - Activity Log     → /dashboard/activity              (accessible from Settings)
// - Email Triggers   → /dashboard/emails                (accessible from Settings)
// - Products         → /dashboard/products              (accessible from Settings)

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function DashboardSidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pb_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("pb_sidebar_collapsed", String(next));
  }

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      {mobileOpen && (
        <div
          className="dash-sidebar-overlay"
          onClick={onMobileClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 89, display: "block",
          }}
        />
      )}

      <aside
        className={`dash-sidebar ${collapsed ? "dash-sidebar-collapsed" : ""} ${mobileOpen ? "dash-sidebar-mobile-open" : ""}`}
        role="navigation"
        aria-label="Dashboard navigation"
      >
        {/* Header */}
        <div className="dash-sidebar-header">
          {showLabels && (
            <Link href="/dashboard" className="dash-sidebar-brand"><img src="/logo.svg" alt="Covant" height={11} style={{display:'block'}} /></Link>
          )}
          <button
            onClick={toggleCollapsed}
            className="dash-sidebar-collapse-btn"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav sections */}
        <nav className="dash-sidebar-nav" aria-label="Main menu">
          {navSections.map((section, si) => (
            <div key={si} className={section.label ? "dash-sidebar-section" : "dash-sidebar-section-bare"}>
              {section.label && showLabels && (
                <p className="dash-sidebar-section-label">{section.label}</p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`dash-sidebar-link ${active ? "active" : ""}`}
                    title={collapsed && !mobileOpen ? item.name : undefined}
                  >
                    <Icon size={18} />
                    {showLabels && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="dash-sidebar-footer">
          {showLabels && (
            <>
              <Link href="/dashboard/settings#platform-config" className="dash-sidebar-footer-link">
                <SlidersHorizontal size={15} />
                <span>Customize Platform</span>
              </Link>
              <Link href="/portal" className="dash-sidebar-footer-link" target="_blank">
                <ExternalLink size={15} />
                <span>Partner Portal</span>
              </Link>
              <button
                className="dash-sidebar-footer-link"
                onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", width: "100%", textAlign: "left" }}
              >
                <span style={{ fontSize: 13, opacity: 0.5 }}>⌨</span>
                <span>Shortcuts</span>
                <kbd style={{ marginLeft: "auto", fontSize: ".6rem", padding: "1px 5px", borderRadius: 3, background: "var(--subtle)", border: "1px solid var(--border)", color: "var(--muted)", fontFamily: "inherit" }}>?</kbd>
              </button>
            </>
          )}
        </div>
      </aside>

      <style jsx>{`
        .dash-sidebar-section {
          margin-top: 1.25rem;
        }
        .dash-sidebar-section-bare {
          margin-top: 0;
        }
        .dash-sidebar-section-label {
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 0 .75rem .35rem;
          opacity: 0.5;
          margin: 0;
        }
      `}</style>
    </>
  );
}
