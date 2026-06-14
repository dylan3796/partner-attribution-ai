import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ChannelGraphVisual from "@/components/marketing/ChannelGraphVisual";
import ChannelSignalVisual from "@/components/marketing/ChannelSignalVisual";
import JourneyVisual from "@/components/marketing/JourneyVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import AskGraphVisual from "@/components/marketing/AskGraphVisual";
import CTABand from "@/components/marketing/CTABand";

// Narrative spine: the category is partner-first — every other tool is built
// for the vendor managing partners; Covant is built to bring the partner
// along the journey. Hero leads with that asymmetry → market stakes show the
// channel is huge and everyone's flying blind (third-party 2026 research) →
// the Channel Graph is the engine that powers it (01: the context layer, 02:
// credit both sides trust, 03: the graph at work on live deals) → the partner
// experience surfaces are the soul (04: journeys, 05: the portal, 06:
// conversational access) → how it starts (07). Eyebrow prefixes ("The engine"
// / "The experience") carry the hierarchy so the page never reads as a flat
// feature list.

const STAKES = [
  {
    stat: "42%",
    body: "of B2B SaaS can measure partner influence across the funnel. The rest are guessing.",
  },
  {
    stat: "35%",
    body: "of mid-market and enterprise pipeline is partner-influenced — most of it unattributed.",
  },
  {
    stat: "69%",
    body: "are increasing partner investment — into a measurement vacuum.",
  },
];

const ACTIVATION_CARDS = [
  {
    title: "Move the open ones.",
    body: "New opportunity, known territory — the graph names the partner who has closed there, with the records behind it.",
  },
  {
    title: "Unblock the stuck ones.",
    body: "Stalled deal, existing relationship — the graph finds the partner already in the account.",
  },
  {
    title: "Insights where reps live.",
    body: "Recommendations land in your CRM, on the record — not in another tab.",
  },
];

const PORTAL_CARDS = [
  {
    title: "Deal visibility.",
    body: "Partners see the deals they're on and where each one stands. No chasing the channel manager.",
  },
  {
    title: "One-click enlist.",
    body: "Pull a partner into a deal from the opportunity itself. Covant sets up the call or drafts the email.",
  },
  {
    title: "Two-way by design.",
    body: "Leads, customer stories, references, posts — partners submit, you act. A channel, not a bulletin board.",
  },
];

const START_STEPS = [
  {
    title: "Connect what you have.",
    body: "CRM, spreadsheets, emails, Slack, notes. Structured or not — every parameter is signal.",
  },
  {
    title: "First pass, then yours.",
    body: "Covant builds the initial Channel Graph from your data. You refine it from there — it's your asset, and it compounds.",
  },
  {
    title: "Build what's missing. Activate what exists.",
    body: "Journeys and the portal go live where you had nothing. Infrastructure you already have gets ingested and put to work.",
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — the category (Partner Intelligence), led by the wound */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Built for the partner</p>
            <h1 className="m-h1">
              Your partner program is built for you. Not for your partners.
            </h1>
            <p className="m-lead" style={{ maxWidth: "54ch" }}>
              Partners drive the revenue — and they&apos;re the one party every
              tool forgets. No view of their deals, no credit they trust, no
              idea what to do next. Covant brings every partner along the
              journey: they see where each deal stands, why they were credited,
              and their next best move — powered by the Channel Graph, a living
              model of how your channel actually operates. Partners who are
              brought along sell more. You get the revenue, and the proof.
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

      {/* The stakes — the wound, in the market's own numbers */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The state of partnerships, 2026</p>
            <h2 className="m-h2" style={{ maxWidth: "26ch" }}>
              Partners drive the pipeline. Everyone&apos;s flying blind — the partner most of all.
            </h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {STAKES.map((s) => (
              <Reveal className="m-card" key={s.stat}>
                <h3 className="m-h1" style={{ marginBottom: ".5rem" }}>
                  {s.stat}
                </h3>
                <p className="m-body">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Source: PartnerStack &amp; Wynter, The State of Partnerships in GTM
            2026 (100 senior B2B SaaS leaders).
          </p>
        </div>
      </section>

      {/* 01 — The Channel Graph: the context layer */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The graph · 01 — Your Channel Graph</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              A living model of how your channel actually operates.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
              Covant makes a first pass over everything you have — opportunity
              records, activity logs, emails, Slack threads, deal notes — and
              builds the Channel Graph: what each partner does well, at what
              deal size, in which verticals, at what speed. You refine it; it
              sharpens. The graph is the durable asset, and it&apos;s yours.
              It&apos;s the engine behind everything the partner sees and does in Covant.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 — Measurement: see what you couldn't (the wound, resolved) */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The graph · 02 — See what you couldn&apos;t</p>
              <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
                Sourced and influenced. Every channel, the whole lifecycle.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Cloud co-sell, SI delivery, referrals, tech partners — most
                teams measure each in its own silo, and partner influence after
                the first deal goes unseen entirely. The graph reads
                contribution across all of them and across the lifecycle: who
                sourced, who unblocked, who drove the expansion. Every touch on
                the record, the reason attached — so the partner trusts the
                number instead of disputing it.
              </p>
            </Reveal>
            <Reveal>
              <ChannelSignalVisual />
            </Reveal>
          </div>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Credit stays your call — your models, your weights. The graph makes
            contribution visible; you decide how it&apos;s split.
          </p>
        </div>
      </section>

      {/* 03 — Activation: the graph at work on live deals */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The graph · 03 — At work on live deals</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                The right partner, on the deal that needs them.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Measurement is the foundation; activation is the payoff. On a
                live, open deal, the Channel Graph surfaces the partner who can
                source or unblock it: a new opportunity opens in a vertical a
                partner owns; a deal stalls where a partner has the
                relationship. Covant names them, shows the evidence, and your
                team enlists them in one click.
              </p>
            </Reveal>
            <Reveal>
              <NextMoveVisual />
            </Reveal>
          </div>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {ACTIVATION_CARDS.map((c) => (
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

      {/* 04 — Partner journeys */}
      {/* Future scope: the journey-flow engine and validation datasets shown
          here are not yet modeled in convex/ — see JourneyVisual. */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The experience · 04 — Partner journeys</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Define the milestones. Covant runs the journey.
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

      {/* 05 — The portal */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The experience · 05 — The portal</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              The portal partners don&apos;t dread.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
              Most portals are painful to set up and worse to use.
              Covant&apos;s is lightweight: it walks each partner along the
              journey you defined, shows them the deals they&apos;re part of,
              and keeps the channel two-way. When the graph names a partner for
              a deal, the ask lands here — call scheduled or outreach drafted.
            </p>
          </Reveal>
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

      {/* 06 — Ask the graph (conversational access over MCP) */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The experience · 06 — Ask the graph</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Queryable, not just viewable.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The Channel Graph ships as MCP servers for Claude and OpenAI.
                Point your assistant at it and ask in natural language — no
                dashboard, no report builder. Your team asks: which partners
                close fastest in healthcare; who belongs on this deal. Your
                partners ask: what&apos;s my certification status. Answers come
                back from the graph, records attached.
              </p>
            </Reveal>
            <Reveal>
              <AskGraphVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 07 — How it starts */}
      <section id="start" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">07 — How it starts</p>
            <h2 className="m-h2">
              A complete map of your program — what exists and what doesn&apos;t.
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
