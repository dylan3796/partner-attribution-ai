import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import PartnerPulse from "@/components/marketing/PartnerPulse";
import CTABand from "@/components/marketing/CTABand";
import { ATTRIBUTION_FLEX } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Product — Covant",
  description:
    "One platform for the whole partner experience. Covant gives every partner their own home base — revenue, payments, where they stand, and their next move — in an experience you configure, brand, and control. Underneath: partner scoring, prescriptive actions, and attribution synced to your CRM. Multi-program from day one.",
};

// What the partner sees — their home base. All grounded in the live portal + scoring engine.
const PARTNER_VIEW = [
  {
    title: "Revenue, credited clearly.",
    body: "Every deal a partner sourced or influenced, attributed and visible — no more wondering how they're measured or chasing someone for the number.",
  },
  {
    title: "Payments, in the open.",
    body: "Commissions earned, paid, and pending — so partners always know exactly what's coming and when.",
  },
  {
    title: "Where they stand.",
    body: "Score, tier, and influence, with what “good” looks like made explicit — the bar is visible, not a mystery.",
  },
  {
    title: "Their next move.",
    body: "AI recommends the next best action to grow — the deal to chase, the renewal to protect, the step that moves them up a tier.",
  },
];

export default function ProductPage() {
  return (
    <main className="site">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Product</p>
            <h1 className="m-h1">One platform for the whole partner experience.</h1>
            <p className="m-lead">
              Covant gives every partner their own home base — the revenue they&apos;ve driven,
              what they&apos;ll be paid, and their next move — in an experience you control and
              brand. Underneath, it scores partners, tells your team who to back, and settles
              attribution to your CRM. Multi-program from day one.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">
                Request a demo
              </a>
            </div>
          </div>
          <Reveal>
            <PartnerPulse />
          </Reveal>
        </div>
      </section>

      {/* The partner's home base */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The partner experience</p>
            <h2 className="m-h2">Everything a partner needs, in one place.</h2>
          </Reveal>
          <div className="m-grid m-grid-2" style={{ marginTop: "3rem" }}>
            {PARTNER_VIEW.map((c) => (
              <Reveal className="m-card" key={c.title}>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {c.title}
                </h3>
                <p className="m-body">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Yours to shape — the customer / vehicle thesis */}
      <section className="m-section m-section--ink">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">Yours to shape</p>
              <h2 className="m-h2">You own the experience. We&apos;re the vehicle.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant is the rails, not the brand. Decide exactly what each partner sees —
                gated by tier and segment, under your rules. Run it as your own portal, embed
                it in your product, or pipe the data into your stack via API. Administer every
                program — tiers, payouts, the recommendations that fire — from one console, and
                roll partner-sourced revenue up to the CRO across all of it. And ask your
                partner data anything in plain language; Ask Covant answers, no report to build.
              </p>
              <p className="m-small" style={{ marginTop: "1.5rem" }}>
                <strong style={{ color: "#f8fafc" }}>In the product today:</strong> insights,
                payments, scorecards, next-best-actions, deal registration, partner recruiting,
                and guided onboarding — one experience, no re-platforming.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The attribution underneath — evidence for the team's call */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">{ATTRIBUTION_FLEX.eyebrow}</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                {ATTRIBUTION_FLEX.heading}
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                {ATTRIBUTION_FLEX.body}
              </p>
            </Reveal>
            <Reveal>
              <AttributionSplitVisual />
            </Reveal>
          </div>
          <Reveal style={{ marginTop: "2.5rem" }}>
            <ModelList />
          </Reveal>
        </div>
      </section>

      {/* Stack fit */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <Reveal>
              <p className="m-eyebrow">Sits in your stack</p>
              <h2 className="m-h2">Built on your CRM, not instead of it.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant runs the partner experience on top of the relationship — scoring,
                attribution, payments, and the next move. Your CRM stays the source of truth
                for deals; Covant reads from it, writes back the numbers your CRO can trust, and
                stands up in days, not a six-month rollout.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
