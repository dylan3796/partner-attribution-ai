import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import CTABand from "@/components/marketing/CTABand";

export const metadata: Metadata = {
  title: "Company — Covant",
  description:
    "We're building AI-native Partner Experience Management. Partners are the most underused signal in B2B; Covant turns that data into each partner's next win — built for Heads of Partnerships, their partner managers, and the CROs who need a partner-revenue number they can trust.",
};

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "DPA", href: "/dpa" },
  { label: "Security", href: "/security" },
];

export default function CompanyPage() {
  return (
    <main className="site">
      {/* Belief */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container" style={{ maxWidth: "820px" }}>
          <p className="m-eyebrow">Company</p>
          <h1 className="m-h1">We&apos;re building Partner Experience Management.</h1>
          <p className="m-lead" style={{ maxWidth: "56ch" }}>
            Partners are the most underused signal in B2B — billions of datapoints about
            what&apos;s working, who to back, and where to grow. The tools that came before
            stored partners and mapped them; none of them used that signal to lift a single
            partner toward revenue. That&apos;s the job: AI that turns partner data into each
            partner&apos;s next win, and grows the business with them. No one else is building
            it. So we are.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2">
            <Reveal>
              <p className="m-eyebrow">Who it&apos;s for</p>
              <h2 className="m-h2">The missing middle.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Heads of Partnerships at B2B SaaS companies running more than one partner
                motion, who are done explaining partner revenue from a spreadsheet. Their
                partner managers, who get more visible and freed from the reconciliation grind
                to do relationships and BD. And the CROs who want that number to be
                trustworthy. Covant replaces the stack they&apos;ve outgrown: prescriptive,
                multi-program, and intelligent from day one.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="m-section">
        <div className="m-container" style={{ maxWidth: "820px" }}>
          <Reveal>
            <p className="m-eyebrow">Talk to us</p>
            <h2 className="m-h2">We&apos;re building this with our first customers.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "52ch" }}>
              If you run partners and you&apos;re tired of guessing who drove what, we want
              to hear from you. Reach the team directly at{" "}
              <a href="mailto:hello@covant.ai" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
                hello@covant.ai
              </a>
              , or request a demo below.
            </p>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "2rem" }}>
              {LEGAL.map((l) => (
                <Link key={l.href} href={l.href} className="m-small" style={{ color: "var(--m-muted)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand
        eyebrow="Get started"
        heading="See what your partners actually drive."
        body="Request a demo and we'll show you Covant on a pipeline that looks like yours."
      />
    </main>
  );
}
