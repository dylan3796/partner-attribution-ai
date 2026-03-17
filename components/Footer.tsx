"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/onboard") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/invite")
  ) {
    return null;
  }

  return (
    <footer style={{
      borderTop: "1px solid #e5e7eb",
      background: "#ffffff",
      padding: "2rem",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "1rem", color: "#0a0a0a", textDecoration: "none", letterSpacing: "-0.02em" }}>
            Covant.ai
          </Link>
          <span style={{ color: "#d1d5db" }}>|</span>
          <span style={{ fontSize: ".8rem", color: "#9ca3af" }}>
            © {new Date().getFullYear()} Covant, Inc.
          </span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/pricing" style={{ fontSize: ".82rem", color: "#6b7280", textDecoration: "none" }}>Pricing</Link>
          <Link href="/demo" style={{ fontSize: ".82rem", color: "#6b7280", textDecoration: "none" }}>Demo</Link>
          <Link href="/privacy" style={{ fontSize: ".82rem", color: "#6b7280", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: ".82rem", color: "#6b7280", textDecoration: "none" }}>Terms</Link>
          <a href="mailto:hello@covant.ai" style={{ fontSize: ".82rem", color: "#6b7280", textDecoration: "none" }}>hello@covant.ai</a>
        </div>
      </div>
    </footer>
  );
}
