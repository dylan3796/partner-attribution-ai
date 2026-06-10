"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/demo" },
  { name: "Partner view", href: "/demo/partner-view" },
];

export default function DemoTopbar() {
  const pathname = usePathname();
  return (
    <header className="d-topbar">
      <div className="d-topbar-inner">
        <Link href="/" className="d-topbar-brand">
          <img src="/favicon.svg" alt="" width={22} height={22} style={{ borderRadius: 5 }} />
          Covant
        </Link>
        <span className="d-topbar-badge">Meridian Analytics · demo — fictional data</span>
        <nav className="d-topbar-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "is-active" : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <Link href="/#demo" className="d-topbar-cta">
          Request early access →
        </Link>
      </div>
    </header>
  );
}
