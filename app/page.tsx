import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import ProblemPanels from "@/components/marketing/ProblemPanels";
import AttributionFlow from "@/components/marketing/AttributionFlow";
import ModelCards from "@/components/marketing/ModelCards";
import PxmSplitScreen from "@/components/marketing/PxmSplitScreen";
import EarlyAccessForm from "@/components/marketing/EarlyAccessForm";
import CTABand from "@/components/marketing/CTABand";
import { NEW_ERA } from "@/lib/marketing";

export default function Home() {
  return (
    <main className="site">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Experience Management</p>
            <h1 className="m-h1">
              Your partners are driving more revenue than your CRM shows.
            </h1>
            <p className="m-lead" style={{ maxWidth: "54ch" }}>
              Deals get sourced by one partner, implemented by another, and closed
              with a third — and the CRM hands all the credit to whoever touched it
              first. Covant maps the full partner influence chain and turns it into
              the next move for your team and every partner.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#how">
                See how it works
              </a>
              <a className="m-btn-ghost" href="#demo">
                Request early access
              </a>
            </div>
            <p className="m-hero-note">
              Built for mid-market B2B SaaS. No PRM replacement needed.
            </p>
          </div>
          <Reveal>
            <AttributionSplitVisual />
          </Reveal>
        </div>
      </section>

      {/* The problem */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The problem</p>
            <h2 className="m-h2" style={{ maxWidth: "26ch" }}>
              Partner influence dies in three places.
            </h2>
            <p className="m-small" style={{ marginTop: ".9rem", maxWidth: "54ch" }}>
              The work happens. It just never makes it into anything your team can
              act on — or pay on.
            </p>
          </Reveal>
          <ProblemPanels />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">How it works</p>
            <h2 className="m-h2">From scattered touches to the next move.</h2>
          </Reveal>
          <Reveal>
            <AttributionFlow />
          </Reveal>
        </div>
      </section>

      {/* The five models */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The attribution underneath</p>
              <h2 className="m-h2" style={{ maxWidth: "18ch" }}>
                Five models. Zero black boxes.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Attribution isn&apos;t one-size-fits-all — a reseller motion and an SI
                motion deserve different math. Covant ships five bounded,
                deterministic models. Every split carries a written reason, so a
                credit dispute is a conversation about facts, not a black box.
              </p>
              <p className="m-body" style={{ marginTop: "1rem", maxWidth: "46ch" }}>
                Want to see them disagree on the same deal?{" "}
                <Link href="/demo" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
                  Explore the live demo →
                </Link>
              </p>
            </Reveal>
            <Reveal>
              <ModelCards />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PXM split-screen */}
      <section className="m-section">
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
        heading="Get your partner revenue story straight."
        body="Tell us how you track attribution today, and we'll show you what your current tooling can't see — on data shaped like yours."
        form={<EarlyAccessForm />}
      />
    </main>
  );
}
