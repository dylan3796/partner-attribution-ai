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
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-brand-logo">
            Covant.ai
          </Link>
          <span className="site-footer-brand-sep">|</span>
          <span className="site-footer-brand-copy">
            © {new Date().getFullYear()} Covant, Inc.
          </span>
        </div>
        <div className="site-footer-links">
          <Link href="/pricing">Pricing</Link>
          <Link href="/demo">Demo</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:hello@covant.ai">hello@covant.ai</a>
        </div>
      </div>
    </footer>
  );
}
