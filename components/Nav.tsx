"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Briefcase, PieChart, Settings, Activity, DollarSign, Trophy, Award, Menu, X, Sliders, BarChart3, Megaphone, AlertTriangle, Package } from "lucide-react";
import { usePlatformConfig } from "@/lib/platform-config";
import type { FeatureFlags } from "@/lib/types";

const marketingLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
  { name: "Partners", href: "/partners/apply" },
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
  { name: "Scoring", href: "/dashboard/scoring", icon: Trophy, featureFlag: "scoring" },
  { name: "Certs", href: "/dashboard/certifications", icon: Award, featureFlag: "certifications" },
  { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
  { name: "Volume", href: "/dashboard/volume-rebates", icon: BarChart3, featureFlag: "volumeRebates" },
  { name: "MDF", href: "/dashboard/mdf", icon: Megaphone, featureFlag: "mdf" },
  { name: "Products", href: "/dashboard/products", icon: Package, featureFlag: "productCatalog" },
  { name: "Conflicts", href: "/dashboard/conflicts", icon: AlertTriangle, featureFlag: "channelConflict" },
  { name: "Reports", href: "/dashboard/reports", icon: PieChart, featureFlag: "reports" },
  { name: "Payouts", href: "/dashboard/payouts", icon: DollarSign, featureFlag: "payouts" },
  { name: "Activity", href: "/dashboard/activity", icon: Activity, featureFlag: "auditLog" },
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
          <Link href="/" className="logo">Covant</Link>

          {isDashboard ? (
            // Sidebar handles all dashboard navigation
            <div style={{ flex: 1 }} />
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
                <Link href="/dashboard" className="link nav-login-link" style={{ fontWeight: 500, fontSize: ".9rem" }}>View Demo</Link>
                <Link href="/dashboard" className="btn nav-cta-btn">Try Demo</Link>
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
                <Link href="/dashboard" className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
                  View Demo
                </Link>
                <Link href="/dashboard" className="btn" style={{ margin: "0.5rem 1rem", textAlign: "center" }} onClick={() => setMobileOpen(false)}>
                  Try Demo
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
