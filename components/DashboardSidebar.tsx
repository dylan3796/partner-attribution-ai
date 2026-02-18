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

const lockedModules = [
  "Partner Scoring",
  "MDF Management",
  "Volume Rebates",
  "Certifications",
  "Channel Conflicts",
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [moreExpanded, setMoreExpanded] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

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

      {/* More Modules */}
      {!collapsed && (
        <div style={{ padding: "0 .75rem .25rem" }}>
          <button
            onClick={() => {
              setMoreExpanded(!moreExpanded);
              setActiveTooltip(null);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,.28)",
              fontSize: ".72rem",
              padding: ".4rem .5rem",
              width: "100%",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: ".3rem",
              letterSpacing: ".01em",
            }}
          >
            <span style={{ fontSize: ".85rem", lineHeight: 1 }}>
              {moreExpanded ? "−" : "+"}
            </span>
            More modules
          </button>
          {moreExpanded && (
            <div style={{ display: "flex", flexDirection: "column", paddingLeft: ".25rem" }}>
              {lockedModules.map((mod) => (
                <div key={mod}>
                  <button
                    onClick={() =>
                      setActiveTooltip(activeTooltip === mod ? null : mod)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,.28)",
                      fontSize: ".78rem",
                      padding: ".3rem .5rem",
                      width: "100%",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: ".4rem",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ fontSize: ".75rem" }}>🔒</span>
                    {mod}
                  </button>
                  {activeTooltip === mod && (
                    <div
                      style={{
                        fontSize: ".7rem",
                        color: "rgba(255,255,255,.35)",
                        padding: ".1rem .5rem .3rem 2rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Available on Growth plan ·{" "}
                      <a
                        href="mailto:hello@partnerbase.app"
                        style={{ color: "#818cf8", textDecoration: "none" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Contact us →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
