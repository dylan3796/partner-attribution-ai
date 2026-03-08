"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRODUCT_LINKS = [
  { name: "All Features", href: "/features" },
  { name: "Product Tour", href: "/product" },
  { name: "Attribution", href: "/dashboard/reports/attribution" },
  { name: "Payouts", href: "/dashboard/payouts" },
  { name: "Partner Portal", href: "/portal-preview" },
  { name: "Dashboard Preview", href: "/dashboard-preview" },
  { name: "Become a Partner", href: "/apply" },
  { name: "Integrations", href: "/integrations" },
  { name: "Compare", href: "/compare" },
  { name: "ROI Calculator", href: "/roi" },
];

const RESOURCE_LINKS = [
  { name: "Early Access", href: "/beta" },
  { name: "Live Demo", href: "/demo" },
  { name: "Customer Stories", href: "/customers" },
  { name: "Help Center", href: "/help" },
  { name: "API Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog" },
  { name: "Use Cases", href: "/use-cases" },
  { name: "Program Assessment", href: "/assessment" },
  { name: "Roadmap", href: "/roadmap" },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blog" },
  { name: "Glossary", href: "/glossary" },
  { name: "Templates", href: "/templates" },
  { name: "All Resources", href: "/resources" },
];

const COMPANY_LINKS = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "System Status", href: "/status" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Security", href: "/security" },
  { name: "DPA", href: "/dpa" },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard, portal, setup, onboard, sign-in/sign-up, and admin pages
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
    <>
    <style>{`
      .covant-footer-grid {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.2fr 1fr 1fr 1fr;
        gap: 2rem;
      }
      .covant-footer-bottom {
        max-width: 1100px;
        margin: 2rem auto 0;
        padding-top: 1.5rem;
        border-top: 1px solid #111;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      @media (max-width: 768px) {
        .covant-footer-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 480px) {
        .covant-footer-grid {
          grid-template-columns: 1fr;
        }
      }
      .covant-footer-link {
        font-size: 0.8rem;
        color: #555;
        text-decoration: none;
        transition: color 0.15s;
      }
      .covant-footer-link:hover {
        color: #999;
      }
    `}</style>
    <footer style={{
      borderTop: "1px solid #1a1a1a",
      background: "#000",
      padding: "3rem 2rem 2rem",
    }}>
      <div className="covant-footer-grid">
        {/* Brand */}
        <div>
          <Link href="/" style={{
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}>
            Covant
          </Link>
          <p style={{
            marginTop: "0.8rem",
            fontSize: "0.8rem",
            lineHeight: 1.6,
            color: "#666",
          }}>
            Track attribution.<br />
            Calculate commissions.<br />
            Pay your partners on time.
          </p>
          <p style={{
            marginTop: "0.8rem",
            fontSize: "0.75rem",
            color: "#444",
          }}>
            © {new Date().getFullYear()} Covant, Inc.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#888",
            marginBottom: "0.75rem",
          }}>
            Product
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {PRODUCT_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={{
                fontSize: "0.8rem",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.15s",
              }}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#888",
            marginBottom: "0.75rem",
          }}>
            Resources
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {RESOURCE_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={{
                fontSize: "0.8rem",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.15s",
              }}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#888",
            marginBottom: "0.75rem",
          }}>
            Company
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {COMPANY_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={{
                fontSize: "0.8rem",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.15s",
              }}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1100,
        margin: "2rem auto 0",
        paddingTop: "1.5rem",
        borderTop: "1px solid #111",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        <p style={{ fontSize: "0.75rem", color: "#333" }}>
          Built for partner teams that want to stop guessing.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/pricing" style={{ fontSize: "0.75rem", color: "#444", textDecoration: "none" }}>Pricing</Link>
          <Link href="/beta" style={{ fontSize: "0.75rem", color: "#444", textDecoration: "none" }}>Join Beta</Link>
          <a href="mailto:hello@covant.ai" style={{ fontSize: "0.75rem", color: "#444", textDecoration: "none" }}>hello@covant.ai</a>
        </div>
      </div>
    </footer>
    </>
  );
}
