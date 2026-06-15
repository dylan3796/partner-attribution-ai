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
            <h1 className="m-h1">Your whole channel, in one place.</h1>
            <p className="m-lead">
              Covant organizes your partner data into the Channel Graph, then
              runs attribution, planning, and recommendations on it.
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
              <p className="m-eyebrow">The Channel Graph</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                All your partner data, organized.
              </h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant reads whatever you have — opportunity records, activity
                logs, tasks, emails, Slack threads, deal notes — and organizes
                it into one connected place: Partners, Accounts, Opportunities,
                Program, Definitions, Personnel.
              </p>
              <p className="m-body" style={{ marginTop: "1rem" }}>
                The first pass is intelligent, not a blank slate: who partners
                with whom, who drives what, across time-to-close, deal size, and
                verticals. You refine it from there, and it compounds. That&apos;s
                the Channel Graph — the durable asset everything runs on.
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
                Find the partners you&apos;re missing.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Covant maps who fits your ecosystem and flags who you&apos;re
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
                Attribution, proposed with evidence.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Covant proposes who sourced and who influenced each deal — or
                whatever your team measures — and attaches the records behind
                every claim. You approve or adjust, and every call carries a
                reason. Covant remembers that reasoning and brings it to the
                next deal, so each round it proposes more of what your team
                would have decided anyway — and asks less of you. It never
                decides credit on its own. Your model, your weights, your call.
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
                The right partner, every deal.
              </h2>
            </Reveal>
            <Reveal>
              <p className="m-body">
                Covant names the best-fit partner for a live, open deal —
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
                Ask your channel anything.
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

      {/* The motions the engine serves */}
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
                Your CRM stays the system of record. Registrations flow into your
                pipeline; closed-deal data flows back to keep Covant current.
                The partner side — attribution, planning, asks, submissions —
                lives in Covant. Self-serve in 15 minutes, not a six-month
                rollout.
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
