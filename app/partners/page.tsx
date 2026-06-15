import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ChannelGraph from "@/components/marketing/ChannelGraph";

export const metadata: Metadata = {
  title: "For partners — Covant",
  description:
    "When your vendor runs their channel on Covant, your work is on the record: register deals in two minutes, see credit and commissions with the why attached, and get matched into deals that need what you've proven. Free for partners.",
};

// Partner-facing page: the other side of the market. Vendors buy Covant;
// partners are why it sticks — and partners asking for it is a sales
// channel. Second person throughout, zero vendor jargon, no demo form
// (partners don't book demos — they sign in or nudge their vendor).

const ASK_VENDOR_MAILTO =
  "mailto:?subject=" +
  encodeURIComponent("Covant for our partner program") +
  "&body=" +
  encodeURIComponent(
    "Hi — we work deals together, and I'd love for us to run registrations and credit through Covant (https://covant.ai).\n\n" +
      "From the partner side: registering a deal takes about two minutes, credit and commissions are calculated in the open with the reasoning attached, and proven work gets partners matched into new deals.\n\n" +
      "Worth a look for the partner program?"
  );

const MONEY_ANSWERS = [
  {
    title: "Why you earned that number.",
    body: "Every percentage arrives with its reason attached — the deal you registered, the demo you ran, the work you delivered.",
  },
  {
    title: "What you're owed, down to the dollar.",
    body: "Earned, pending, paid — every commission calculated and visible the moment it changes. No quarter-end chasing.",
  },
  {
    title: "Where you stand, and what's next.",
    body: "If your vendor runs tiers, you see the bar, your progress, and the payoff — with the next move that closes the gap.",
  },
];

export default function PartnersPage() {
  return (
    <main className="site site--story">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">For partners</p>
            <h1 className="m-h1">
              Get credited for the work. Get found for the next deal.
            </h1>
            <p className="m-lead" style={{ maxWidth: "50ch" }}>
              When a vendor runs their channel on Covant, nothing you do
              disappears: register a deal in two minutes, watch credit and
              commissions calculated in the open, and get pulled into deals that
              need exactly what you&apos;ve proven you can do. Free for partners,
              always.
            </p>
            <div className="m-hero-cta">
              <Link className="m-btn" href="/sign-in">
                Sign in to your portal
              </Link>
              <a className="m-btn-ghost" href={ASK_VENDOR_MAILTO}>
                Ask your vendor about Covant
              </a>
            </div>
          </div>
          <Reveal>
            <ChannelGraph activeSection={2} />
          </Reveal>
        </div>
      </section>

      {/* 01 — Get pulled into deals */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">01. Get pulled into deals</p>
              <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
                Your track record works while you sleep.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Every win you log builds a verified record — verticals, solutions,
                deployments, closed deals. When your vendor&apos;s deal needs what
                you&apos;ve done before, you&apos;re the one who gets flagged — and
                the ask lands in your portal: the deal, the context, and a discovery
                call with the right contacts already attached. Not the loudest
                partner. The proven one.
              </p>
            </Reveal>
            <Reveal>
              <ChannelGraph activeSection={5} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 — Know where the money is */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">02. Know where the money is</p>
            <h2 className="m-h2">No more chasing the channel manager.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              The portal answers the questions you&apos;re tired of asking — in the
              open, with the records behind every number.
            </p>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {MONEY_ANSWERS.map((c) => (
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

      {/* 03 — Two minutes, nothing to learn */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">03. Nothing to learn, nothing to pay</p>
            <h2 className="m-h2">Register a deal in two minutes. That&apos;s the training.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              No license fee, no certification course, no portal you dread. You
              register the deal, the vendor approves it, and from there the credit
              tracks itself — every touch you log makes your record stronger.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Closing — the ask-your-vendor loop */}
      <section className="m-section m-section--ink">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "center" }}>
            <div>
              <p className="m-eyebrow">Both sides win</p>
              <h2 className="m-h2">Your vendor isn&apos;t on Covant yet?</h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Vendors adopt Covant because partners show up for it — registrations
                go up when credit is worth trusting. One intro is usually all it
                takes.
              </p>
            </div>
            <div className="m-hero-cta" style={{ marginTop: 0 }}>
              <a className="m-btn" href={ASK_VENDOR_MAILTO}>
                Ask your vendor about Covant
              </a>
              <Link className="m-btn-ghost" href="/">
                See what they&apos;d get →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
