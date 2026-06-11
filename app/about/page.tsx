import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import CTABand from "@/components/marketing/CTABand";

export const metadata: Metadata = {
  title: "Company — Covant",
  description:
    "We started Covant on one conviction: partners are the most underused signal in B2B software, and no tool has ever used them to lift a single partner. We're building the system that does — the revenue engine for the channel, so 'better together' finally pays off for both sides.",
};

const BELIEFS = [
  {
    title: "Partners are signal, not overhead.",
    body: "Every partner interaction is data about where the business should grow next. Treat partners as a cost center and you throw away the most honest market intelligence you have.",
  },
  {
    title: "The relationship was never the problem. The blindness was.",
    body: "Teams don't lack partners. They lack the ability to see, across thousands of signals, what each one needs next — and to act before the moment passes.",
  },
  {
    title: "Software should do the figuring-out.",
    body: "“Better together” shouldn't take a decade of manual relationship-building. Intelligence can compress it to weeks — and free your people for the work only they can do.",
  },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "DPA", href: "/dpa" },
  { label: "Security", href: "/security" },
];

export default function CompanyPage() {
  return (
    <main className="site">
      {/* Mission */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container">
          <p className="m-eyebrow">Company</p>
          <h1 className="m-h1" style={{ maxWidth: "22ch" }}>
            Partnerships should pay off for everyone in them.
          </h1>
          <p className="m-lead" style={{ maxWidth: "58ch" }}>
            We started Covant on one conviction: partners are the most underused signal in
            B2B software — billions of datapoints about what&apos;s working, who to back, and
            where to grow — and no tool has ever used them to lift a single partner. We&apos;re
            building the system that does: the revenue engine for the channel, where partner
            pipeline registers, progresses, and gets credited — so &ldquo;better
            together&rdquo; finally pays off for both sides.
          </p>
        </div>
      </section>

      {/* What we believe */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">What we believe</p>
            <h2 className="m-h2">Three things we&apos;re betting on.</h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {BELIEFS.map((b, i) => (
              <Reveal className="m-card" key={b.title}>
                <span className="m-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-h3" style={{ margin: ".6rem 0 .5rem" }}>
                  {b.title}
                </h3>
                <p className="m-body">{b.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who's building it */}
      <section className="m-section m-section--ink">
        <div className="m-container" style={{ maxWidth: "820px" }}>
          <Reveal>
            <p className="m-eyebrow">Who&apos;s building it</p>
            <h2 className="m-h2">Operators who&apos;ve lived this.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
              Covant is built by a team of operators who&apos;ve run, measured, and been worn
              down by partner programs inside B2B SaaS. We&apos;ve lived the spreadsheet
              reconciliation, the quarter-end attribution fights, and the high-potential
              partner who slipped away because no one saw it in time. We&apos;re building the
              system we wished we&apos;d had — in the open, with our first customers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Who it's for */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2">
            <Reveal>
              <p className="m-eyebrow">Who it&apos;s for</p>
              <h2 className="m-h2">The missing middle.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                We built Covant for the people the old tools forgot: Heads of Partnerships
                running more than one motion, done explaining partner revenue from a
                spreadsheet; their partner managers, who deserve to be visible and freed from
                the reconciliation grind; and the CROs who just want a partner-revenue number
                they can trust. That middle is where the growth is — and where no one was
                building.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="m-section m-section--surface">
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
