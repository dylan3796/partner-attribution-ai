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
  Activity,
  DollarSign,
  Trophy,
  Award,
  BarChart3,
  Megaphone,
  AlertTriangle,
  Package,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  PlusCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Gift,
  Rocket,
  GitBranch,
  Shield,
} from "lucide-react";
import { usePlatformConfig } from "@/lib/platform-config";
import type { FeatureFlags } from "@/lib/types";

type SidebarLink = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  featureFlag?: keyof FeatureFlags;
};

const allLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Partners", href: "/dashboard/partners", icon: Users },
  { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
  { name: "Pipeline & Co-Sell", href: "/dashboard/pipeline", icon: GitBranch, featureFlag: "coSell" },
  { name: "Reports", href: "/dashboard/reports", icon: PieChart, featureFlag: "reports" },
  { name: "Payouts", href: "/dashboard/payouts", icon: DollarSign, featureFlag: "payouts" },
  { name: "Scoring", href: "/dashboard/scoring", icon: Trophy, featureFlag: "scoring" },
  { name: "Tier Reviews", href: "/dashboard/scoring/tier-reviews", icon: Shield, featureFlag: "scoring" },
  { name: "Certifications", href: "/dashboard/certifications", icon: Award, featureFlag: "certifications" },
  { name: "Onboarding", href: "/dashboard/onboarding", icon: Rocket, featureFlag: "certifications" },
  { name: "Incentives", href: "/dashboard/incentives", icon: Gift, featureFlag: "incentivePrograms" },
  { name: "Volume Rebates", href: "/dashboard/volume-rebates", icon: BarChart3, featureFlag: "volumeRebates" },
  { name: "MDF", href: "/dashboard/mdf", icon: Megaphone, featureFlag: "mdf" },
  { name: "Products", href: "/dashboard/products", icon: Package, featureFlag: "productCatalog" },
  { name: "Conflicts", href: "/dashboard/conflicts", icon: AlertTriangle, featureFlag: "channelConflict" },
  { name: "Activity", href: "/dashboard/activity", icon: Activity, featureFlag: "auditLog" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const setupLinks: SidebarLink[] = [
  { name: "Tier Criteria", href: "/dashboard/settings/tiers", icon: SlidersHorizontal },
  { name: "MDF Setup", href: "/dashboard/mdf/setup", icon: PlusCircle, featureFlag: "mdf" },
  { name: "Rebate Creator", href: "/dashboard/volume-rebates/create", icon: Layers, featureFlag: "volumeRebates" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isFeatureEnabled } = usePlatformConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pb_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // Auto-open setup section if on a setup page
  useEffect(() => {
    const isOnSetup = setupLinks.some((l) => pathname.startsWith(l.href));
    if (isOnSetup) setSetupOpen(true);
  }, [pathname]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("pb_sidebar_collapsed", String(next));
  }

  const visibleLinks = allLinks.filter(
    (l) => !l.featureFlag || isFeatureEnabled(l.featureFlag)
  );

  const visibleSetupLinks = setupLinks.filter(
    (l) => !l.featureFlag || isFeatureEnabled(l.featureFlag)
  );

  return (
    <aside className={`dash-sidebar ${collapsed ? "dash-sidebar-collapsed" : ""}`}>
      {/* Header */}
      <div className="dash-sidebar-header">
        {!collapsed && (
          <Link href="/dashboard" className="dash-sidebar-brand">
            Covant
          </Link>
        )}
        <button
          onClick={toggleCollapsed}
          className="dash-sidebar-collapse-btn"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="dash-sidebar-nav">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href) &&
                !setupLinks.some((sl) => pathname.startsWith(sl.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`dash-sidebar-link ${isActive ? "active" : ""}`}
              title={collapsed ? link.name : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}

        {/* Program Setup section */}
        {!collapsed && visibleSetupLinks.length > 0 && (
          <div style={{ marginTop: ".5rem" }}>
            <button
              onClick={() => setSetupOpen(!setupOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: ".45rem .65rem",
                borderRadius: 8,
                color: "var(--muted)",
                fontSize: ".75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                justifyContent: "space-between",
                transition: "all .15s",
              }}
            >
              <span>Program Setup</span>
              {setupOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {setupOpen &&
              visibleSetupLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`dash-sidebar-link ${isActive ? "active" : ""}`}
                    style={{ paddingLeft: "1.25rem" }}
                    title={collapsed ? link.name : undefined}
                  >
                    <Icon size={16} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
          </div>
        )}

        {/* Collapsed: show setup icons without label */}
        {collapsed && visibleSetupLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`dash-sidebar-link ${isActive ? "active" : ""}`}
              title={link.name}
            >
              <Icon size={18} />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="dash-sidebar-footer">
        {!collapsed && (
          <>
            <Link
              href="/dashboard/settings#platform-config"
              className="dash-sidebar-footer-link"
            >
              <SlidersHorizontal size={15} />
              <span>Customize Platform</span>
            </Link>
            <Link href="/portal" className="dash-sidebar-footer-link" target="_blank">
              <ExternalLink size={15} />
              <span>Partner Portal</span>
            </Link>
            <Link href="/" className="dash-sidebar-footer-link">
              <span>← Back to Site</span>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
