"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PieChart,
  Settings,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";

type SidebarLink = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const coreLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Partners", href: "/dashboard/partners", icon: Users },
  { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
  { name: "Payouts", href: "/dashboard/payouts", icon: DollarSign },
  { name: "Reports", href: "/dashboard/reports", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pb_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("pb_sidebar_collapsed", String(next));
  }

  return (
    <aside className={`dash-sidebar ${collapsed ? "dash-sidebar-collapsed" : ""}`}>
      {/* Header */}
      <div className="dash-sidebar-header">
        {!collapsed && (
          <Link href="/" className="dash-sidebar-logo">
            PartnerBase
          </Link>
        )}
        <button
          onClick={toggleCollapsed}
          className="dash-sidebar-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="dash-sidebar-nav">
        {coreLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
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
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="dash-sidebar-footer">
          <Link
            href="/dashboard/settings#platform-config"
            className="dash-sidebar-footer-link"
          >
            <Sliders size={14} />
            Customize Platform
          </Link>
          <Link href="/portal" className="dash-sidebar-footer-link">
            <ExternalLink size={14} />
            Partner Portal
          </Link>
          <Link href="/" className="dash-sidebar-footer-link muted-link">
            ← Back to Site
          </Link>
        </div>
      )}
    </aside>
  );
}
