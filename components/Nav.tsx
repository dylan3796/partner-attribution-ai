"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Briefcase, PieChart, Settings, Activity, DollarSign, Trophy, Award, Menu, X, Sliders, BarChart3, Megaphone, AlertTriangle, Package } from "lucide-react";
import { usePlatformConfig } from "@/lib/platform-config";
import type { FeatureFlags } from "@/lib/types";

const marketingLinks = [
  { name: "Platform", href: "/platform" },
  { name: "Pricing", href: "/pricing" },
  { name: "Resources", href: "/resources" },
];

type DashLink = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  featureFlag?: keyof FeatureFlags;
};

const allDashboardLinks: DashLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Partners", href: "/dashboard/partners", icon: Users },
  { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
  { name: "Payouts", href: "/dashboard/payouts", icon: DollarSign },
  { name: "Reports", href: "/dashboard/reports", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Nav() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isPortal = pathname.startsWith("/portal");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isFeatureEnabled } = usePlatformConfig();
  
  const dashboardLinks = allDashboardLinks.filter(link => 
    !link.featureFlag || isFeatureEnabled(link.featureFlag)
  );

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Portal has its own nav in layout.tsx
  if (isPortal) return null;

  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/"><img src="/logo.svg" alt="Covant" height={18} style={{display:'block'}} /></Link>

          {isDashboard ? (
            // Sidebar handles all dashboard navigation — empty center cell
            <div />
          ) : (
            <div className="nav-links">
              {marketingLinks.map((link) => (
                <a key={link.name} href={link.href}>{link.name}</a>
              ))}
            </div>
          )}

          <div className="nav-actions">
            {isDashboard ? (
              // Sidebar handles navigation; keep nav minimal
              null
            ) : (
              <>
                <Link href="/sign-in" style={{ color: "#6b7280", fontSize: ".9rem", fontWeight: 500, textDecoration: "none", marginRight: ".5rem" }}>Sign in</Link>
                <Link href="/dashboard?demo=true" className="btn nav-cta-btn">Try it live</Link>
              </>
            )}
            <button
              className="menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {isDashboard ? (
              // Dashboard uses sidebar for navigation
              <>
                {dashboardLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                  const Icon = link.icon;
                  return (
                    <Link key={link.name} href={link.href} className={`mobile-menu-item ${isActive ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  );
                })}
                <div className="mobile-menu-divider" />
                <Link href="/portal" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  Partner Portal
                </Link>
                <Link href="/" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  ← Back to Site
                </Link>
              </>
            ) : (
              <>
                {marketingLinks.map((link) => (
                  <a key={link.name} href={link.href} className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                    {link.name}
                  </a>
                ))}
                <div className="mobile-menu-divider" />
                <Link href="/sign-in" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link href="/dashboard?demo=true" className="btn" style={{ margin: "0.5rem 1rem", textAlign: "center" }} onClick={() => setMobileOpen(false)}>
                  Try it live
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
