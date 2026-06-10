import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import PartnerPulse from "@/components/marketing/PartnerPulse";
import ProblemPanels from "@/components/marketing/ProblemPanels";
import LifecycleFlow from "@/components/marketing/LifecycleFlow";
import PxmSplitScreen from "@/components/marketing/PxmSplitScreen";
import EarlyAccessForm from "@/components/marketing/EarlyAccessForm";
import CTABand from "@/components/marketing/CTABand";
import { ATTRIBUTION_FLEX, EXPERIENCE_PILLARS, NEW_ERA } from "@/lib/marketing";
import { SCENARIO } from "@/lib/meridian/selectors";

export default function Home() {
  return (
    <main className="site">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Experience Management</p>
            <h1 className="m-h1">
              Every partner starts the day knowing their next move.
            </h1>
            <p className="m-lead" style={{ maxWidth: "54ch" }}>
              Covant turns your partner program into a white-glove experience —
              for every partner, whatever your program looks like. Each one gets
              a daily pulse: the deal to push, the payout in flight, the tier
              they&apos;re closing in on. Your team gets the ecosystem view: who
              to recruit, who to activate, who to grow.
            </p>
            <div className="m-hero-cta">
              <Link
                className="m-btn"
                href={`/demo/partner-view?partner=${SCENARIO.pulseHeroPartnerId}`}
              >
                See a partner&apos;s morning
              </Link>
              <a className="m-btn-ghost" href="#demo">
                Request early access
              </a>
            </div>
            <p className="m-hero-note">
              Built for mid-market B2B SaaS. Works beside your CRM and PRM.
            </p>
          </div>
          <Reveal>
            <PartnerPulse />
          </Reveal>
        </div>
      </section>

      {/* The problem */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The problem</p>
            <h2 className="m-h2" style={{ maxWidth: "26ch" }}>
              Your best partners get white-glove. The rest get a login.
            </h2>
            <p className="m-small" style={{ marginTop: ".9rem", maxWidth: "54ch" }}>
              Treating partners well is manual work — so it only happens for the
              few your team knows by name.
            </p>
          </Reveal>
          <ProblemPanels />
        </div>
      </section>

      {/* The lifecycle */}
      <section id="how" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">How it works</p>
            <h2 className="m-h2">One motion: recruit, activate, grow, reward.</h2>
          </Reveal>
          <Reveal>
            <LifecycleFlow />
          </Reveal>
        </div>
      </section>

      {/* PXM split-screen */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">{NEW_ERA.tagline}</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              One ledger. Two experiences.
            </h2>
          </Reveal>
          <Reveal>
            <PxmSplitScreen />
          </Reveal>
        </div>
      </section>

      {/* Experience pillars */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">In the product today</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              White-glove, without the headcount.
            </h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {EXPERIENCE_PILLARS.map((pillar) => (
              <Reveal className="m-card" key={pillar.title}>
                <p className="m-eyebrow" style={{ marginBottom: ".6rem" }}>
                  {pillar.eyebrow}
                </p>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {pillar.title}
                </h3>
                <p className="m-body">{pillar.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Attribution, demoted to a strip */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">{ATTRIBUTION_FLEX.eyebrow}</p>
            <h2 className="m-h2" style={{ maxWidth: "26ch" }}>
              {ATTRIBUTION_FLEX.heading}
            </h2>
            <p className="m-body" style={{ marginTop: "1rem", maxWidth: "62ch" }}>
              {ATTRIBUTION_FLEX.body}{" "}
              <Link
                href={ATTRIBUTION_FLEX.href}
                style={{ color: "var(--m-accent)", fontWeight: 600 }}
              >
                {ATTRIBUTION_FLEX.linkLabel}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* The new era */}
      <section className="m-section m-section--ink">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">{NEW_ERA.eyebrow}</p>
            <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
              {NEW_ERA.heading}
            </h2>
            {NEW_ERA.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="m-body"
                style={{ marginTop: "1.25rem", maxWidth: "62ch" }}
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <CTABand
        eyebrow="Early access"
        heading="Give every partner the white-glove treatment."
        body="Tell us what runs your program today, and we'll show you the experience your partners could be getting — on data shaped like yours."
        form={<EarlyAccessForm />}
      />
    </main>
  );
}
