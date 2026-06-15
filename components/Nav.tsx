"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const marketingLinks = [
  { name: "Product", href: "/product" },
  { name: "Company", href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isPortal = pathname.startsWith("/portal");
  // Marketing pages carry an in-page #demo band; elsewhere route to home's.
  const isMarketing = pathname === "/" || pathname === "/product" || pathname === "/about";
  const demoHref = isMarketing ? "#demo" : "/#demo";

  // Portal has its own nav in layout.tsx
  if (isPortal) return null;

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link href="/" aria-label="Covant" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo-mark.svg" alt="" width={40} height={40} style={{ display: "block", width: 40, height: 40, flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: "2rem", letterSpacing: "-0.02em", color: "#16150f", lineHeight: 1 }}>Covant</span>
        </Link>

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
              <Link href="/sign-in" className="nav-login-link" style={{ color: "#6b7280", fontSize: ".9rem", fontWeight: 500, textDecoration: "none", marginRight: ".5rem" }}>Sign in</Link>
              <a href={demoHref} className="btn nav-cta-btn">Request a demo</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
