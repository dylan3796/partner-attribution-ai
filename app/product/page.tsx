import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import CTABand from "@/components/marketing/CTABand";

export const metadata: Metadata = {
  title: "Product — Covant",
  description:
    "A bounded set of attribution models, recommended per motion. Multi-program scoping, a per-program and CRO roll-up reconciled to your CRM, and prescriptive next-actions. The AI-native PRM.",
};

const CAPABILITIES = [
  {
    title: "A bounded set of models",
    body: "Five models, not a blank formula builder. Fewer choices, defensible numbers, no quarter-end debate about who gets credit.",
  },
  {
    title: "Multi-program scoping",
    body: "Resellers, ISVs, referrals, co-sell — each program gets its own attribution model and rules, managed in one place.",
  },
  {
    title: "Per-program + CRO roll-up",
    body: "Partner managers see their own program. The CRO sees partner-sourced revenue across all of them, reconciled to the CRM.",
  },
  {
    title: "Prescriptive next-actions",
    body: "Covant ranks what matters this week: the partner going quiet, the deal stalling, the renewal nobody owns.",
  },
];

const NOT = [
  "Not a CRM. Covant reads yours and stays in sync.",
  "Not a contracts or billing system.",
  "Not a marketplace.",
  "Not a no-code formula sandbox — the models are bounded on purpose.",
];

export default function ProductPage() {
  return (
    <main className="site">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Product</p>
            <h1 className="m-h1">A bounded set of models. The right one, recommended.</h1>
            <p className="m-lead">
              Covant doesn&apos;t ship infinite knobs. It ships a small, opinionated set of
              attribution models, scopes them per program, rolls them up for the CRO, and
              tells your team what to do next.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">
                Request a demo
              </a>
            </div>
          </div>
          <Reveal>
            <AttributionSplitVisual />
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2">
            {CAPABILITIES.map((c) => (
              <Reveal className="m-card" key={c.title}>
                <h2 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {c.title}
                </h2>
                <p className="m-body">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The five models */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The five models</p>
            <h2 className="m-h2">One per motion. Recommended, not guessed.</h2>
          </Reveal>
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
              <h2 className="m-h2">Replaces legacy PRM. Syncs your CRM.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant is the system of action on top of the partner record. Your CRM stays
                the source of truth for deals. Covant owns partners, attribution, and the
                next move — and writes back the numbers your CRO can trust.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What Covant is not */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Honest scope</p>
            <h2 className="m-h2">What Covant is not.</h2>
          </Reveal>
          <Reveal className="m-list" style={{ marginTop: "2.5rem" }}>
            {NOT.map((n) => (
              <div className="m-list-item" key={n}>
                <span className="m-num">—</span>
                <p className="m-body" style={{ color: "var(--m-ink)" }}>
                  {n}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CTABand
        heading="See the models on your pipeline."
        body="We'll reconstruct your last 12 months of partner-sourced revenue under the model that fits each motion."
      />
    </main>
  );
}
