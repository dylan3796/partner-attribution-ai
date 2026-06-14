import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ChannelGraphVisual from "@/components/marketing/ChannelGraphVisual";
import ChannelSignalVisual from "@/components/marketing/ChannelSignalVisual";
import JourneyVisual from "@/components/marketing/JourneyVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import AskGraphVisual from "@/components/marketing/AskGraphVisual";
import CTABand from "@/components/marketing/CTABand";

// Narrative spine: the category is Partner Intelligence. The asset is the
// Channel Graph — a semantic layer over the vendor's partner data, built from
// what they have plus the context they add (the way .md files brief an LLM).
// Hero states the category and the promise: run the partnerships org on the
// graph → market stakes show the work to prove it is still manual (third-party
// 2026 research) → the graph itself (01: the semantic layer) → what you run on
// it (02: reporting & attribution, which frees rev ops; 03: planning &
// recommendations, incl. Partner Finder) → the surfaces (04: journeys, 05: the
// portal, 06: ask in plain language) → how it starts (07). Eyebrow prefixes
// ("The graph" / "On the graph" / "The surfaces") carry the hierarchy so the
// page reads as one system, not a flat feature list.

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

const RECOMMENDATION_CARDS = [
  {
    title: "Put the right partner on the deal.",
    body: "New opportunity or stalled deal — the graph names the partner who can source or unblock it, evidence attached, right in your CRM.",
  },
  {
    title: "Recruit the partner you're missing.",
    body: "Partner Finder spots the gaps in your coverage and surfaces who to recruit next — by vertical, geography, and the deals they'd help you win.",
  },
  {
    title: "Plan on evidence, not instinct.",
    body: "Tiers, territories, quota, where the next investment goes — the calls you make on gut, grounded in what the graph already knows.",
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
    body: "Covant builds the initial Channel Graph from your data and the context you add. You refine it from there — it's your asset, and it compounds.",
  },
  {
    title: "Build what's missing. Activate what exists.",
    body: "Journeys and the portal go live where you had nothing. Infrastructure you already have gets ingested and put to work.",
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — the category (Partner Intelligence) and the promise */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Intelligence</p>
            <h1 className="m-h1">
              Run your partnerships org on the Channel Graph.
            </h1>
            <p className="m-lead" style={{ maxWidth: "56ch" }}>
              Pour your partner data into Covant — with a little context on what
              it is — and it builds the Channel Graph: a semantic layer over
              everything happening across your channel. Once it exists, the
              whole partner org runs on it — the attribution and reporting that
              buries rev ops, the planning you do on instinct (tiers, territory,
              quota, where the next investment goes), and proactive
              recommendations down to which partner to recruit next. It runs
              alongside your CRM, gives partners their own view, and answers in
              plain language.
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
            <p className="m-trust-label">The graph builds from your stack — and the context you add</p>
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

      {/* The stakes — the problem, in the market's own numbers */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The state of partnerships, 2026</p>
            <h2 className="m-h2" style={{ maxWidth: "28ch" }}>
              Most companies can&apos;t measure the partner pipeline they&apos;re betting on.
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

      {/* 01 — The Channel Graph: the semantic layer */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The graph · 01 — The semantic layer</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              A semantic layer over everything in your channel.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
              Covant makes a first pass over everything you have — opportunity
              records, activity logs, emails, Slack threads, deal notes — and
              you tell it what the data means, the way you&apos;d brief a new
              analyst. From that it builds the Channel Graph: what each partner
              does well, at what deal size, in which verticals, at what speed,
              and how every touch ladders up to revenue. You refine it; it
              sharpens. The graph is the durable asset, and it&apos;s yours —
              the foundation every report, plan, and recommendation runs on.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 — Reporting & attribution: the rev ops grind, automated */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">On the graph · 02 — Reporting &amp; attribution</p>
              <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
                The partner reporting your team builds by hand, built continuously.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Cloud co-sell, SI delivery, referrals, tech partners — most
                teams measure each in its own silo, and partner influence after
                the first deal goes unseen entirely. The graph reads
                contribution across all of them and across the lifecycle: who
                sourced, who unblocked, who drove the expansion. The board deck
                rev ops rebuilds before every QBR, the graph keeps live — every
                touch on the record, the reason attached.
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

      {/* 03 — Planning & recommendations: the graph at work, from live deals to the annual plan */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">On the graph · 03 — Planning &amp; recommendations</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                From the next deal to next year&apos;s plan.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The graph that names the right partner for a live deal answers
                the bigger calls too. Which tier a partner has earned. Which
                territory or market to move into. How to set quota and capacity
                for the year, and where the next dollar of partner investment
                pays back. And the partner you don&apos;t have yet but should —
                Partner Finder surfaces who to recruit, with the evidence behind
                it.
              </p>
            </Reveal>
            <Reveal>
              <NextMoveVisual />
            </Reveal>
          </div>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {RECOMMENDATION_CARDS.map((c) => (
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
              <p className="m-eyebrow">The surfaces · 04 — Partner journeys</p>
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
            <p className="m-eyebrow">The surfaces · 05 — The portal</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              The portal partners don&apos;t dread.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
              Most portals are painful to set up and worse to use.
              Covant&apos;s is lightweight: it walks each partner along the
              journey you defined and shows them their slice of the graph — the
              deals they&apos;re on, where each one stands, and what to do next —
              while keeping the channel two-way. When the graph names a partner
              for a deal, the ask lands here: call scheduled or outreach
              drafted.
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
              <p className="m-eyebrow">The surfaces · 06 — Ask the graph</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Queryable, not just viewable.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                The Channel Graph ships as MCP servers for Claude and OpenAI.
                Point your assistant at it and ask in plain language — no
                dashboard, no report builder. Your team asks which partners
                close fastest in healthcare, or what you&apos;d lose if a top
                partner churned. Rev ops pulls the board report without building
                it. Partners ask their own: what&apos;s my certification status,
                which of my deals need a push. Answers come back from the graph,
                records attached.
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
