import CTABand from "@/components/marketing/CTABand";
import styles from "./Home.module.css";

// Covant HOME — Monaco-register pass. Short outcome-named declaratives,
// second person, enemy-as-a-stack, honesty-as-flex; the mechanism + Channel
// Graph stay on PRODUCT. Category noun: "the revenue engine for your channel"
// (PXM language deliberately omitted). No fabricated proof. Copy: home-messaging.md.

const FROM = [
  "Partners managed in a portal",
  "Last-touch credit, argued in spreadsheets",
  "Recruiting on gut",
  "QBRs reported after the fact",
];

const TO = [
  "Your whole ecosystem, known",
  "Sourced and influenced, with the receipts",
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
          <p className="m-eyebrow">The revenue engine for your channel</p>
          <h1 className="m-h1" style={{ maxWidth: "16ch" }}>
            Your partners are already selling for you.
          </h1>
          <p className="m-lead" style={{ maxWidth: "52ch" }}>
            Covant is where that becomes pipeline you can see, prove, and grow.
            One place for the whole partner side — every deal registered, every
            dollar of credit explained, every next move.
          </p>
          <div className="m-hero-cta">
            <a className="m-btn" href="#demo">Get your Channel Graph</a>
            <a className="m-btn-ghost" href="/product">See how it works</a>
          </div>
        </div>
      </section>

      {/* The blind spot */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <p className="m-eyebrow">The opportunity</p>
          <h2 className="m-h2" style={{ maxWidth: "16ch" }}>Your best channel is invisible.</h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "58ch" }}>
            It lives in CRM notes, email threads, and Slack. Real revenue you
            can&apos;t prove, plan, or grow. We make it a number.
          </p>
        </div>
      </section>

      {/* The category shift */}
      <section className="m-section">
        <div className="m-container">
          <p className="m-eyebrow">The shift</p>
          <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
            Stop managing partners. Start growing a channel.
          </h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "56ch" }}>
            Covant builds the Channel Graph from your data — one record of your
            whole ecosystem.
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

      {/* Honesty-as-flex — pre-empt the black-box objection, keep the CRM line */}
      <section className="m-section">
        <div className="m-container">
          <p className="m-eyebrow">How it stays honest</p>
          <h2 className="m-h2" style={{ maxWidth: "16ch" }}>No black-box credit.</h2>
          <p className="m-lead" style={{ marginTop: "1.25rem", maxWidth: "58ch" }}>
            Every dollar is sourced from your data and explained — or it
            doesn&apos;t ship. Your CRM stays your system of record. We make the
            partner side legible on top of it.
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
