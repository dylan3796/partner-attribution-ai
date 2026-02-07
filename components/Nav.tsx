"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, Briefcase, PieChart, Settings, Menu, X } from "lucide-react";

const marketingLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Solutions", href: "#pricing" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e9ecef", zIndex: 100, padding: "0.8rem 0" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          Partner<span style={{ fontWeight: 400 }}>AI</span>
        </Link>

        <div style={{ display: "flex", gap: isDashboard ? "0.5rem" : "2rem", alignItems: "center" }} className="hidden md:flex">
          {isDashboard
            ? dashboardLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link key={link.name} href={link.href} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.8rem", borderRadius: 8, fontSize: "0.9rem", fontWeight: 500, background: isActive ? "#f8f9fa" : "transparent", color: isActive ? "#000" : "#6c757d", transition: "all 0.2s" }}>
                    <link.icon size={16} />
                    {link.name}
                  </Link>
                );
              })
            : marketingLinks.map((link) => (
                <a key={link.name} href={link.href} style={{ fontWeight: 500, fontSize: "0.9rem" }}>{link.name}</a>
              ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isDashboard ? (
            <>
              <span style={{ background: "#f8f9fa", padding: "0.25rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", color: "#6c757d" }} className="hidden sm:inline">Demo</span>
              <Link href="/" style={{ background: "white", border: "1px solid #e9ecef", padding: "0.4rem 1rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 500 }}>← Site</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" style={{ fontWeight: 500, fontSize: "0.9rem" }} className="hidden sm:inline">Log in</Link>
              <Link href="/dashboard" style={{ background: "#000", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600 }}>Get started</Link>
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer" }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", borderBottom: "1px solid #e9ecef", padding: "1rem 2rem" }}>
          {(isDashboard ? dashboardLinks : marketingLinks).map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 0", fontWeight: 500, fontSize: "0.95rem", borderBottom: "1px solid #e9ecef" }}>
              {"icon" in link && (() => { const Icon = (link as any).icon; return <Icon size={16} />; })()}
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
