import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ChannelGraphVisual from "@/components/marketing/ChannelGraphVisual";
import ChannelSignalVisual from "@/components/marketing/ChannelSignalVisual";
import JourneyVisual from "@/components/marketing/JourneyVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import AskGraphVisual from "@/components/marketing/AskGraphVisual";
import CTABand from "@/components/marketing/CTABand";

// Narrative spine: Partner Experience Management is the category (hero) →
// the Channel Graph is the engine that powers it (01: the context layer,
// 02: the graph at work on live deals) → delivered through the experience
// surfaces (03: journeys, 04: the portal, 05: conversational access) →
// how it starts (06: the complete map — build what's missing, activate
// what exists). Eyebrow prefixes ("The engine" / "The experience") carry
// the hierarchy so the page never reads as a flat feature list.

const ACTIVATION_CARDS = [
  {
    title: "See which engagements a partner could move.",
    body: "The Channel Graph flags the open deals where a partner's expertise — a reference architecture, an account relationship — could amp them up, including the ones that have stalled.",
  },
  {
    title: "In the tools reps already use.",
    body: "Recommendations land on the opportunity in your CRM — not in another tab reps have to remember to open.",
  },
];

const PORTAL_CARDS = [
  {
    title: "Deal visibility.",
    body: "Partners see the deals they're on and where each one stands. No chasing the channel manager.",
  },
  {
    title: "One-click outbound.",
    body: "Ask a partner to engage on a specific deal, straight from the opportunity. They accept or decline — you see the answer in Covant.",
  },
  {
    title: "Two-way by design.",
    body: "Leads, customer stories, references, posts — partners submit, you act. A channel, not a bulletin board.",
  },
];

const CHAT_CARDS = [
  {
    title: "Your team asks.",
    body: "Which partners close fastest in healthcare? Who belongs on this deal? Answers come straight from the graph, records attached.",
  },
  {
    title: "Your partners ask.",
    body: "What's my certification status? Which of my deals need action? Partners query their own slice of the channel the same way.",
  },
];

const START_STEPS = [
  {
    title: "Connect your data.",
    body: "CRM, spreadsheets, Slack, emails, notes — structured or not. Every parameter is signal.",
  },
  {
    title: "We take the first pass.",
    body: "Covant builds your Channel Graph — the most sophisticated read of your partner business you've had, because we understand what partner businesses actually look like. You refine it from there; it's yours, and it compounds.",
  },
  {
    title: "Watch your program come to life — and expand it as you go.",
    body: "Journeys and the portal go live where you had nothing, running on infrastructure you already had. Add programs and partners as you grow.",
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — the category, then the engine */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Experience Management</p>
            <h1 className="m-h1">
              More Revenue From The Channel You Already Built.
            </h1>
            <p className="m-lead" style={{ maxWidth: "50ch" }}>
              Covant is <strong>Partner Experience Management</strong> — the
              single system your team and your partners run the channel
              through, from progressing partners through your program to
              winning deals together. Its core is the{" "}
              <strong>Channel Graph</strong>: a living model of how your
              channel actually operates, built from your data and sharpened by
              your team.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">
                Request a demo
              </a>
              <a className="m-btn-ghost" href="#start">
                See how it starts
              </a>
            </div>
          </div>
          <Reveal>
            <ChannelGraphVisual />
          </Reveal>
        </div>
      </section>

      {/* Ingestion strip */}
      <section className="m-section m-section--flush" style={{ padding: 0 }}>
        <div className="m-container">
          <div className="m-trust">
            <p className="m-trust-label">The graph builds from whatever you have</p>
            <ul className="m-trust-items">
              <li>Salesforce</li>
              <li>HubSpot</li>
              <li>Emails &amp; Slack threads</li>
              <li>Notes, tasks &amp; spreadsheets</li>
              <li>Event API &amp; CSV</li>
            </ul>
            <p className="m-trust-note">
              Audit-logged end to end. GDPR &amp; CCPA ready. Your data never trains AI models.{" "}
              <Link href="/security">Security →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 01 — The Channel Graph: the context layer */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Your Channel Graph</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              A Living Model Of How Your Channel Actually Operates.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
              Covant reads everything you already have — CRM records, activity
              logs, emails, Slack threads, deal notes — and builds the Channel
              Graph: what each partner does well, at what deal size, in which
              verticals, how fast. You refine it; it sharpens. Everything else
              in Covant runs on it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 — Activation: the graph at work on live deals */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">At Work on Live Deals</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                The Right Partner, On The Deal That Needs Them.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The Channel Graph in motion. On an engagement, it surfaces the
                right partner to push the deal through — the one whose
                expertise or relationship with the account can move it — and
                shows the evidence behind the call. Your team brings them in
                with one click.
              </p>
            </Reveal>
            <Reveal>
              <ChannelSignalVisual />
            </Reveal>
          </div>
          <div className="m-grid m-grid-2" style={{ marginTop: "3rem" }}>
            {ACTIVATION_CARDS.map((c) => (
              <Reveal className="m-card" key={c.title}>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {c.title}
                </h3>
                <p className="m-body">{c.body}</p>
              </Reveal>
            ))}
          </div>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Attribution stays your call — your models, your weights. The graph
            treats credit as your input, not a verdict Covant hands down.
          </p>
        </div>
      </section>

      {/* 03 — Partner journeys */}
      {/* Future scope: the journey-flow engine and validation datasets shown
          here are not yet modeled in convex/ — see JourneyVisual. */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">Partner Journeys</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Define The Milestones. Covant Runs The Journey.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                One certification. One dollar of revenue. One solution
                launched. You decide which milestones matter; Covant validates
                each one against the data and moves the journey forward
                automatically. You and the partner watch the same progress,
                live. Works for any program type.
              </p>
            </Reveal>
            <Reveal>
              <JourneyVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — The portal */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The Portal</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Where Your Partners Run Their Deals.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Covant&apos;s portal is built for partners: it walks each one
                along the journey you defined, shows the deals they&apos;re part
                of, and keeps the channel two-way. When the Channel Graph names
                a partner for a deal, the ask lands right here.
              </p>
            </Reveal>
            <Reveal>
              <NextMoveVisual />
            </Reveal>
          </div>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {PORTAL_CARDS.map((c) => (
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

      {/* 05 — Ask the graph (conversational access over MCP) */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">Ask the Graph</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Queryable, Not Just Viewable.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The Channel Graph ships as MCP servers for Claude and OpenAI.
                Point an assistant at it and ask in natural language — no
                dashboard, no report builder. Both sides of the channel get it.
              </p>
            </Reveal>
            <Reveal>
              <AskGraphVisual />
            </Reveal>
          </div>
          <div className="m-grid m-grid-2" style={{ marginTop: "3rem" }}>
            {CHAT_CARDS.map((c) => (
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

      {/* 06 — How it starts */}
      <section id="start" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">How It Starts</p>
            <h2 className="m-h2">
              A Complete Map Of Your Program — What Exists And What Doesn&apos;t.
            </h2>
          </Reveal>
          <Reveal className="m-list" style={{ marginTop: "2.5rem" }}>
            {START_STEPS.map((s, i) => (
              <div className="m-list-item" key={s.title}>
                <span className="m-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="m-h3" style={{ marginBottom: ".35rem" }}>
                    {s.title}
                  </h3>
                  <p className="m-body">{s.body}</p>
                </div>
              </div>
            ))}
          </Reveal>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Transparent pricing, about a tenth the cost of legacy PRM — and you&apos;ll work
            directly with the team.
          </p>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
