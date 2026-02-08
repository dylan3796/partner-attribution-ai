"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, PieChart, Settings } from "lucide-react";

const marketingLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
];

const dashboardLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Partners", href: "/dashboard/partners", icon: Users },
  { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
  { name: "Reports", href: "/dashboard/reports", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Nav() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isPortal = pathname.startsWith("/portal");

  // Portal has its own nav in layout.tsx
  if (isPortal) return null;

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="logo">Partner<span>AI</span></Link>

        {isDashboard ? (
          <div className="nav-links-dash">
            {dashboardLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link key={link.name} href={link.href} className={isActive ? "active" : ""}>
                  <Icon size={16} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="nav-links">
            {marketingLinks.map((link) => (
              <a key={link.name} href={link.href}>{link.name}</a>
            ))}
          </div>
        )}

        <div className="nav-actions">
          {isDashboard ? (
            <>
              <Link href="/portal" className="btn-outline" style={{ fontSize: ".8rem", padding: ".4rem .8rem" }}>Partner Portal</Link>
              <Link href="/" style={{ fontSize: ".85rem", fontWeight: 500 }}>← Site</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="link" style={{ fontWeight: 500, fontSize: ".9rem" }}>Log in</Link>
              <Link href="/dashboard" className="btn">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
