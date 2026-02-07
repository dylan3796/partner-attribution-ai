"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, Briefcase, PieChart, Settings, Menu, X } from "lucide-react";

const marketingLinks = [
  { name: "Product", href: "#product" },
  { name: "Pricing", href: "#pricing" },
  { name: "Company", href: "#company" },
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
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        zIndex: 100,
        padding: "0.8rem 0",
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          Partner<span style={{ fontWeight: 400 }}>AI</span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            gap: isDashboard ? "0.5rem" : "2rem",
            alignItems: "center",
          }}
          className="hidden md:flex"
        >
          {isDashboard
            ? dashboardLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 0.8rem",
                      borderRadius: 8,
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      background: isActive ? "var(--subtle)" : "transparent",
                      color: isActive ? "var(--fg)" : "var(--muted)",
                      transition: "all 0.2s",
                    }}
                  >
                    <link.icon size={16} />
                    {link.name}
                  </Link>
                );
              })
            : marketingLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  style={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    transition: "opacity 0.2s",
                  }}
                >
                  {link.name}
                </a>
              ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isDashboard ? (
            <>
              <span className="badge badge-neutral hidden sm:inline">Demo Mode</span>
              <Link href="/" className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
                ← Site
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                style={{ fontWeight: 500, fontSize: "0.9rem" }}
                className="hidden sm:inline"
              >
                Log in
              </Link>
              <Link href="/dashboard" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
                Get started
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
            padding: "1rem 2rem",
          }}
        >
          {(isDashboard ? dashboardLinks : marketingLinks).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8rem 0",
                fontWeight: 500,
                fontSize: "0.95rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {"icon" in link && <link.icon size={16} />}
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
