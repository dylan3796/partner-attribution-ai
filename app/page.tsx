import CTABand from "@/components/marketing/CTABand";
import styles from "./Home.module.css";

// Covant HOME — partner intelligence, built on the channel graph (the context
// layer). Outcome-led and graph-free; the mechanism + Channel Graph live on
// PRODUCT. No old-world/new-world contrast, no "ask anything" (copilot only),
// attribution demoted to the unlock. No fabricated proof. Copy: home-messaging.md.

const OUTCOMES = [
  {
    title: "Prove the number.",
    body: "The revenue your partners drive becomes your most defensible line — with a paper trail behind every piece of credit.",
  },
  {
    title: "Build where the market moves.",
    body: "Design the program — incentives, coverage, and investment — on evidence, not gut.",
  },
  {
    title: "Ask your copilot.",
    body: "Your own partner-program copilot, fluent in your channel graph.",
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — partner intelligence on the channel graph */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container">
          <p className="m-eyebrow">Partner intelligence</p>
          <h1 className="m-h1" style={{ maxWidth: "15ch" }}>
            The context layer for your channel.
          </h1>
          <p className="m-lead" style={{ maxWidth: "42ch", fontWeight: 600 }}>
            Your partners are already selling for you.
          </p>
          <p className="m-lead" style={{ maxWidth: "56ch" }}>
            Most of your channel&apos;s real work happens in your partners&apos;
            world — and never crosses into yours. Covant captures it: the data,
            the rules, the relationships. So the work that actually drives
            revenue becomes visible, provable, and something you can finally
            reward the right partners for.
          </p>
          <div className="m-hero-cta">
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="/product">See how it works</a>
          </div>
        </div>
      </section>

      {/* It's already revenue — surface the number, don't invent it */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <p className="m-eyebrow">The opportunity</p>
          <h2 className="m-h2" style={{ maxWidth: "16ch" }}>It&apos;s already revenue.</h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "60ch" }}>
            Most of it lives across your systems, notes, and documents, so it
            never rolls up. This is revenue that&apos;s already happening in your
            channel. Covant doesn&apos;t invent the number — it surfaces the one
            that&apos;s been there the whole time, so you can prove it, plan
            around it, and grow it.
          </p>
        </div>
      </section>

      {/* Keep running your channel — Covant is the intelligence on top */}
      <section className="m-section">
        <div className="m-container">
          <p className="m-eyebrow">The approach</p>
          <h2 className="m-h2" style={{ maxWidth: "18ch" }}>
            Keep running your channel.
          </h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
            Covant gives you the intelligence to grow it. Pour in your
            definitions, rules of engagement, metrics, and your data — Covant
            builds the channel graph and answers questions about your channel in
            a snap.
          </p>
        </div>
      </section>

      {/* What you can finally do — prove / build / ask */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <p className="m-eyebrow">What you get</p>
          <h2 className="m-h2">What you can finally do.</h2>
          <div className={styles.outcomes}>
            {OUTCOMES.map((o) => (
              <div key={o.title}>
                <h3 className={styles.outcomeTitle}>{o.title}</h3>
                <p className={styles.outcomeBody}>{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honesty-as-flex + attribution demoted to the unlock */}
      <section className="m-section">
        <div className="m-container">
          <p className="m-eyebrow">How it stays honest</p>
          <h2 className="m-h2" style={{ maxWidth: "16ch" }}>No black-box credit.</h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "60ch" }}>
            Every recommendation Covant makes comes with the evidence behind it —
            a paper trail you can stand behind in any partner conversation.
          </p>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "60ch" }}>
            Attribution is the starting point, not the product. Once Covant has
            your channel graph, getting credit right is just the unlock —
            it&apos;s what lets Covant recommend who to recruit, what to
            incentivize, and where to invest next.
          </p>
        </div>
      </section>

      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="We build your first Channel Graph from your real partner data in a week. Not a demo. Yours."
      />
    </main>
  );
}
