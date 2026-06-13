import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import ChannelGraphVisual from "@/components/marketing/ChannelGraphVisual";
import ChannelSignalVisual from "@/components/marketing/ChannelSignalVisual";
import JourneyVisual from "@/components/marketing/JourneyVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import AskGraphVisual from "@/components/marketing/AskGraphVisual";
import AttributionExplainVisual from "@/components/marketing/AttributionExplainVisual";
import CTABand from "@/components/marketing/CTABand";
import { MOTIONS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Product — Covant",
  description:
    "Partner experience management, powered by the Channel Graph — a living model of your channel built from your data, structured or unstructured. The graph surfaces the right partner on live deals; journeys, the portal, and conversational access over MCP deliver it. Attribution on your terms.",
};

// Same narrative spine as the landing page, one level deeper: the category
// (hero) → the engine (graph, activation) → the experience (journeys,
// portal, ask the graph) → attribution on the customer's terms → ownership
// and fit (yours to shape, motions, plumbing).

export default function ProductPage() {
  return (
    <main className="site">
      {/* Hero — the category, then the engine */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Product</p>
            <h1 className="m-h1">
              Partner experience management, with an engine underneath.
            </h1>
            <p className="m-lead">
              Covant is the system your team and your partners run the channel
              through. The Channel Graph powers it: built from a first pass
              over your data, refined by your team, put to work on live deals.
              Journeys, the portal, and conversational access deliver it.
              Multi-program from day one.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">
                Request a demo
              </a>
            </div>
          </div>
          <Reveal>
            <ChannelGraphVisual />
          </Reveal>
        </div>
      </section>

      {/* The engine — the Channel Graph */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The engine — your Channel Graph</p>
              <h2 className="m-h2">Every parameter becomes signal.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant ingests whatever partner data you have — opportunity
                records, activity logs, tasks, emails, Slack threads, solution
                tables, deal notes. Structured or unstructured, every parameter
                becomes signal.
              </p>
              <p className="m-body" style={{ marginTop: "1rem" }}>
                The first pass builds the graph: what each partner does well —
                and doesn&apos;t — across time-to-close, deal size, verticals,
                and use cases. Your team refines it from there. The graph is
                the durable asset: a living model of how your channel actually
                operates, and it compounds.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The engine — activation */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The engine — at work on live deals</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                The graph in motion.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                On a live, open opportunity, the graph surfaces the partner who
                can source or unblock it — proven in the vertical, already in
                the account, fast at this deal size — with the records behind
                the call. Enlisting them is one click: Covant sets up the call
                or drafts the outreach. Recommendations land in your CRM, where
                your reps already work.
              </p>
            </Reveal>
            <Reveal>
              <ChannelSignalVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The experience — partner journeys */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The experience — partner journeys</p>
              <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
                Milestones you define. Flows that run themselves.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                One certification, one dollar of revenue, one solution launched
                — the milestones are yours to set. Covant validates each one
                against the data and advances the journey automatically. You
                and the partner monitor the same progress in real time. Works
                for any program type.
              </p>
            </Reveal>
            <Reveal>
              <JourneyVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The experience — the portal */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The experience — the portal</p>
              <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
                Lightweight for partners. Two-way for you.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The portal walks each partner along the journey you defined and
                shows them the deals they&apos;re part of. When the graph names
                a partner for a deal, the ask lands here — call scheduled or
                outreach drafted, one click on your side.
              </p>
              <p className="m-body" style={{ marginTop: "1rem", maxWidth: "46ch" }}>
                And it runs both directions: partners submit leads, customer
                stories, references, and posts. Under your brand throughout.
              </p>
            </Reveal>
            <Reveal>
              <NextMoveVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The experience — conversational access */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The experience — ask the graph</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Queryable, not just viewable.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The Channel Graph ships as MCP servers for Claude and OpenAI.
                Your team points an assistant at it and asks: which partners
                close fastest in healthcare; who belongs on this deal. Your
                partners do the same: what&apos;s my certification status.
                Answers come back from the graph, records attached.
              </p>
            </Reveal>
            <Reveal>
              <AskGraphVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Attribution — demoted, on the customer's terms */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">Attribution, on your terms</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Your model, your weights, your call.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                When you want credit formalized, Covant computes it the way you
                define it and shows its work — an input the graph respects, not
                a verdict Covant hands down. Five models cover the usual
                motions; pick per program.
              </p>
            </Reveal>
            <Reveal>
              <AttributionExplainVisual />
            </Reveal>
          </div>
          <Reveal style={{ marginTop: "2.5rem" }}>
            <ModelList />
          </Reveal>
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
                Covant is the rails, not the brand. Decide exactly what each
                partner sees — gated by tier and segment, under your rules. Run
                it as your own portal, embed it in your product, or pipe the
                data into your stack via API.
              </p>
              <p className="m-body" style={{ marginTop: "1rem" }}>
                Administer every program — journeys, incentive rules, payout
                approvals, the recommendations that fire — from one console,
                and roll partner-sourced revenue up to the CRO across all of
                it.
              </p>
              <p className="m-small" style={{ marginTop: "1.5rem" }}>
                <strong style={{ color: "#fbfaf6" }}>Today:</strong> the
                Channel Graph, deal registration, enlistment, credit and
                incentives on your terms.{" "}
                <strong style={{ color: "#fbfaf6" }}>Next:</strong> partner
                recruiting and guided onboarding — added to the same
                experience, no re-platforming.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The motions the engine and experience serve */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Built for how channels really run</p>
            <h2 className="m-h2">Whatever your motion, Covant speaks it.</h2>
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
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <Reveal>
              <p className="m-eyebrow">The plumbing</p>
              <h2 className="m-h2">Your CRM runs the deals. Covant runs the partner side.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Your CRM stays the system of record. Registrations flow into
                your pipeline; closed-deal data flows back to keep the graph
                current. The partner side — journeys, asks, submissions, credit
                — lives in Covant, under your brand. Self-serve in 15 minutes,
                not a six-month rollout.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
