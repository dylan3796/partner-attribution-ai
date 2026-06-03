import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import CTABand from "@/components/marketing/CTABand";

export const metadata: Metadata = {
  title: "Product — Covant",
  description:
    "One platform for the whole partner experience: a partner portal and scorecards that guide every partner, scoring and prescriptive actions that tell your team who to back, and a bounded set of attribution models reconciled to your CRM. Partner Experience Management, multi-program from day one.",
};

const CAPABILITIES = [
  {
    title: "Partner portal & scorecards",
    body: "Each partner sees where they stand and what good looks like — tier, influence, commissions, deal registration, and a performance scorecard that points to their next move.",
  },
  {
    title: "Partner scoring & prescriptive actions",
    body: "Covant scores every partner across revenue, pipeline, engagement, and velocity, then ranks the week's moves: who to back, who's going quiet, what to do today.",
  },
  {
    title: "Multi-program attribution + CRO roll-up",
    body: "Five bounded models, one per motion — resellers, ISVs, referrals, co-sell. Partner managers see their program; the CRO sees partner-sourced revenue across all of them, reconciled to the CRM.",
  },
  {
    title: "Ask Covant",
    body: "Ask your partner data anything in plain language — who drove last quarter, which partners are ready for an upgrade, where the pipeline is stalling — and get the answer, not a report to build.",
  },
];

const NOT = [
  "Not a slow PRM rollout — Covant reads your CRM and you're live in days.",
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
            <h1 className="m-h1">One platform for the whole partner experience.</h1>
            <p className="m-lead">
              Covant guides your partners to their next win, tells your team who to back and
              what to do this week, and settles attribution underneath — intelligence running
              on your CRM, multi-program from day one.
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
            <p className="m-eyebrow">The attribution underneath</p>
            <h2 className="m-h2">One model per motion. Recommended, not guessed.</h2>
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
              <h2 className="m-h2">Replaces the stack you&apos;ve outgrown. Syncs your CRM.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant sits on top of the partner relationship and runs the experience —
                scoring, attribution, and the next move — so you can retire the old
                relationship-management and portal tools underneath it. Your CRM stays the
                source of truth for deals; Covant writes back the numbers your CRO can trust.
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
