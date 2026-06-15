import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import ChannelGraph from "@/components/marketing/ChannelGraph";
import CTABand from "@/components/marketing/CTABand";
import { MOTIONS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Product — Covant",
  description:
    "The Partner Intelligence Engine. Covant builds the Channel Graph from your data — Partners, Accounts, Opportunities, Program, Definitions, Personnel — then runs attribution, planning, recommendations, and plain-language answers on top of it. Attribution on your terms.",
};

// Product page, one level deeper than the homepage and on the same system:
// the engine (the Channel Graph built from your data domains) → what runs on
// it (Channel TAM, attribution on your terms, plan & recommend, ask) →
// ownership and stack fit. Same design language (editorial serif headlines,
// the data-domain graph). No fabricated proof.

export default function ProductPage() {
  return (
    <main className="site site--story">
      {/* Hero — the category, the engine */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Product</p>
            <h1 className="m-h1">Every signal in your channel, in one graph.</h1>
            <p className="m-lead">
              Covant builds the Channel Graph from the data you already have —
              Partners, Accounts, Opportunities, Program, Definitions, Personnel
              — then runs attribution, planning, recommendations, and
              plain-language answers on top of it.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">Request a demo</a>
            </div>
          </div>
          <Reveal>
            <ChannelGraph activeSection={2} />
          </Reveal>
        </div>
      </section>

      {/* The engine — the Channel Graph */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The engine — your Channel Graph</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Covant builds the first graph. You make it yours.
              </h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant reads whatever you have — opportunity records, activity
                logs, tasks, emails, Slack threads, deal notes. Structured or
                not, every field becomes signal, mapped into the domains your
                channel runs on.
              </p>
              <p className="m-body" style={{ marginTop: "1rem" }}>
                The first pass is intelligent, not a blank slate: who partners
                with whom, who drives what, across time-to-close, deal size,
                verticals, and use cases. You refine it from there, and every
                correction compounds. The graph is the durable asset you own.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Channel TAM */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <Reveal>
              <p className="m-eyebrow">Grow your channel — Channel TAM</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Recruit and activate the partners who fit.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The graph maps who fits your ecosystem and flags who you&apos;re
                missing, then reads the market — M&amp;A, consolidation,
                new-practice moves — for the right moment to act. Recruit the
                gaps; activate the partners already in your program.
              </p>
            </Reveal>
            <Reveal>
              <ChannelGraph activeSection={3} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Attribution — on your terms */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <Reveal>
              <p className="m-eyebrow">Attribution, on your terms</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Proposed attribution, with the paper trail.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Covant proposes who sourced and who influenced each deal and
                attaches the records behind every claim. You approve or adjust —
                Covant never decides credit on its own, and your corrections
                train the graph. Your model, your weights, your call.
              </p>
            </Reveal>
            <Reveal>
              <ChannelGraph activeSection={4} />
            </Reveal>
          </div>
          <Reveal style={{ marginTop: "2.5rem" }}>
            <ModelList />
          </Reveal>
        </div>
      </section>

      {/* Plan & recommend */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">Plan with evidence</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                From the next deal to next year&apos;s plan.
              </h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                The graph names the best-fit partner for a live, open deal —
                proven in the vertical, already in the account — with the records
                behind the call, in your CRM where reps work.
              </p>
              <p className="m-body" style={{ marginTop: "1rem" }}>
                It grounds the calls you used to make on instinct, too: tiers,
                territories, quota, and investment. Partner Finder surfaces who
                to recruit next, by vertical and geography.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ask Covant */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <Reveal>
              <p className="m-eyebrow">Run it day to day — Ask Covant</p>
              <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
                A Partner Manager for every partner. A CPO for you.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The Channel Graph ships as MCP servers for Claude and OpenAI. Ask
                in plain language — which partners close fastest in healthcare,
                who belongs on this deal — and the answer comes back with the
                records attached. Each partner sees only their scoped slice, and
                controls what you can ask.
              </p>
            </Reveal>
            <Reveal>
              <ChannelGraph activeSection={6} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Yours to shape — ownership / two-sided */}
      <section className="m-section m-section--ink">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">Yours to shape</p>
              <h2 className="m-h2">You own the experience. Covant is the rails.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Decide exactly what each partner sees — gated by tier and
                segment, under your rules and your brand. Run it as your own
                portal, embed it in your product, or pipe the graph into your
                stack via API.
              </p>
              <p className="m-body" style={{ marginTop: "1rem" }}>
                Administer every program from one console, and roll
                partner-sourced revenue up to the CRO across all of it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The motions the engine serves */}
      <section className="m-section">
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
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <Reveal>
              <p className="m-eyebrow">The plumbing</p>
              <h2 className="m-h2">Your CRM runs the deals. Covant makes the channel legible.</h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Your CRM stays the system of record. Registrations flow into your
                pipeline; closed-deal data flows back to keep the graph current.
                The partner side — attribution, planning, asks, submissions —
                lives in Covant. Self-serve in 15 minutes, not a six-month
                rollout.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
