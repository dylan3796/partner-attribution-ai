import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import GraphStory from "@/components/marketing/GraphStory";
import CTABand from "@/components/marketing/CTABand";
import { MOTIONS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Product — Covant",
  description:
    "How Covant works: the Channel Graph, built from your partner data, then recruiting, attribution, recommendations, and a channel copilot on top of it. The mechanism, step by step.",
};

// PRODUCT = the mechanism explainer. The pinned Channel Graph (GraphStory)
// transitions through the steps as you scroll; supporting sections cover the
// configurable models, ownership, motions, and stack fit. HOME, by contrast,
// is outcome-led and graph-free.

export default function ProductPage() {
  return (
    <main className="site site--story">
      {/* The pinned graph explainer: hero + Channel Graph → TAM → Attribution
          → Plan → Ask, scroll-linked. */}
      <GraphStory />

      {/* Attribution models — configurable */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Attribution, on your terms</p>
            <h2 className="m-h2">Your model, your way.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
              Covant supports every attribution model, and can help you build
              your own from your channel-graph data.
            </p>
          </Reveal>
          <Reveal style={{ marginTop: "2.5rem" }}>
            <ModelList />
          </Reveal>
        </div>
      </section>

      {/* Ownership / two-sided */}
      <section className="m-section m-section--ink">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">Yours to shape</p>
              <h2 className="m-h2">Your brand, your rules.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Decide exactly what each partner sees — gated by tier and
                segment, under your rules and your brand. Run it as your own
                portal, embed it in your product, or pipe it into your stack
                via API.
              </p>
              <p className="m-body" style={{ marginTop: "1rem" }}>
                Administer every program from one console, and roll
                partner-sourced revenue up to the CRO across all of it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Motions */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Built for how channels really run</p>
            <h2 className="m-h2">Built for every channel motion.</h2>
          </Reveal>
          <div className="m-grid m-grid-2" style={{ marginTop: "3rem" }}>
            {MOTIONS.map((m) => (
              <Reveal className="m-card" key={m.title}>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {m.title}
                </h3>
                <p className="m-body">{m.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stack fit */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <Reveal>
              <p className="m-eyebrow">The plumbing</p>
              <h2 className="m-h2">Works alongside your CRM.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant is the contextual layer for your partners, sitting
                alongside everything you already run. Your CRM stays the system
                of record; registrations flow into your pipeline and closed-deal
                data flows back to keep the channel graph current. From there,
                take it where you want — ask Covant to design an incentive
                program and it answers from your channel-graph patterns.
                Self-serve in 15 minutes, not a six-month rollout.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="We build your first Channel Graph from your real partner data — not a demo dataset."
      />
    </main>
  );
}
