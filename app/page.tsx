import CTABand from "@/components/marketing/CTABand";
import styles from "./Home.module.css";

// Covant HOME — the big picture, for the exec who signs (VP/SVP Partnerships,
// CRO, CPO). States the category thesis (partner management -> partner
// intelligence) and consolidates the capabilities into one pithy beat. The
// mechanism and the Channel Graph live on PRODUCT. Type-forward, no fabricated
// proof. Copy: home-messaging.md.

const FROM = [
  "Managing partners in a portal",
  "Last-touch credit, argued in spreadsheets",
  "Recruiting on gut",
  "QBRs reported after the fact",
];

const TO = [
  "Knowing your whole ecosystem",
  "Sourced + influenced, with the records",
  "Building where the market moves",
  "Answers the moment you ask",
];

const OUTCOMES = [
  { title: "Prove the number.", body: "Partner-influenced revenue becomes your most defensible line." },
  { title: "Build on purpose.", body: "Grow the right ecosystem, ahead of where the market moves." },
  { title: "Design the program.", body: "Incentives, coverage, and investment, grounded in what works." },
  { title: "Ask anything.", body: "Every question about your channel, answered on the spot." },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — the thesis */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container">
          <p className="m-eyebrow">Partner Intelligence</p>
          <h1 className="m-h1" style={{ maxWidth: "14ch" }}>
            Partner Intelligence for Startups.
          </h1>
          <p className="m-lead" style={{ maxWidth: "48ch" }}>
            Your fastest-growing channel is the one you can&apos;t see. Covant changes that.
          </p>
          <div className="m-hero-cta">
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="/product">See how it works</a>
          </div>
        </div>
      </section>

      {/* The blind spot */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <p className="m-eyebrow">The opportunity</p>
          <h2 className="m-h2" style={{ maxWidth: "16ch" }}>The ecosystem you can&apos;t see.</h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "60ch" }}>
            Partners shape more of every deal — and almost none of it is visible.
            Influence hides in CRM notes, email, and Slack: real revenue you
            can&apos;t prove, plan, or grow. The teams that see their ecosystem
            win the next decade.
          </p>
        </div>
      </section>

      {/* The category shift */}
      <section className="m-section">
        <div className="m-container">
          <p className="m-eyebrow">The shift</p>
          <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
            From partner management to partner intelligence.
          </h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
            Covant builds the Channel Graph from your data — one system of record
            for your whole ecosystem.
          </p>
          <div className={styles.shiftGrid}>
            <div>
              <p className={`${styles.shiftLabel} ${styles.fromLabel}`}>The old world</p>
              <ul className={styles.shiftList}>
                {FROM.map((f) => (
                  <li className={styles.fromItem} key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className={styles.toCol}>
              <p className={`${styles.shiftLabel} ${styles.toLabel}`}>With Covant</p>
              <ul className={styles.shiftList}>
                {TO.map((t) => (
                  <li className={styles.toItem} key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What you can finally do — consolidated */}
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

      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="We build your first Channel Graph from your real partner data — not a demo dataset."
      />
    </main>
  );
}
