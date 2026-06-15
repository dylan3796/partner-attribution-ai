import CTABand from "@/components/marketing/CTABand";
import styles from "./Home.module.css";

// Covant HOME — sells the OUTCOME to the exec who signs (VP/SVP Partnerships,
// CRO, CPO). Type-forward and graph-free by design: the neural-net Channel Graph
// is the PRODUCT page's explainer, not HOME's. Four business outcomes, scannable.
// Copy: home-messaging.md. No fabricated proof.

type Outcome = {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: string[];
  surface?: boolean;
};

const OUTCOMES: Outcome[] = [
  {
    eyebrow: "Bring in more partner revenue",
    headline: "Prove your partner number.",
    body: "See sourced and influenced revenue, with the records — the number you take to the board.",
    bullets: [
      "Sourced and influenced, with the records",
      "A number that holds up in the QBR",
      "Grow what you can finally measure",
    ],
  },
  {
    eyebrow: "Build your ecosystem",
    headline: "Recruit the partners you're missing.",
    body: "See who fits your channel, who you're missing, and which moves to make before the market does.",
    bullets: [
      "The right partners, not more partners",
      "Recruit the gaps by vertical and geography",
      "See M&A and consolidation coming",
    ],
    surface: true,
  },
  {
    eyebrow: "Craft the program you want",
    headline: "Design the program you want.",
    body: "See where to add coverage, who to invest in, and who should build a solution — then design the program around it.",
    bullets: [
      "Launch incentives where they'll land",
      "Add managed coverage where it's thin",
      "Spot the partners who should build",
    ],
  },
  {
    eyebrow: "Every question at your fingertips",
    headline: "Answers without the ops ticket.",
    body: "Ask in plain language, get the answer with the records — no two-week ops project.",
    bullets: [
      "Plain-language answers, records attached",
      "No ops ticket, no waiting",
      "For your team and your partners",
    ],
    surface: true,
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — type-forward; the product visual lives on /product */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container">
          <p className="m-eyebrow">Covant</p>
          <h1 className="m-h1" style={{ maxWidth: "14ch" }}>
            Partner Intelligence for Startups.
          </h1>
          <p className="m-lead" style={{ maxWidth: "50ch" }}>
            Covant organizes your scattered partner data into the Channel Graph —
            so partner revenue, recruiting, and program decisions run on evidence.
          </p>
          <div className="m-hero-cta">
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="/product">See how it works</a>
          </div>
        </div>
      </section>

      {/* The 4 exec outcomes — type-forward */}
      <div id="outcomes">
        {OUTCOMES.map((o, i) => (
          <section
            key={o.headline}
            className={`m-section${o.surface ? " m-section--surface" : ""}`}
          >
            <div className="m-container">
              <div className={styles.grid}>
                <div>
                  <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="m-eyebrow">{o.eyebrow}</p>
                  <h2 className="m-h2" style={{ maxWidth: "16ch" }}>{o.headline}</h2>
                </div>
                <div>
                  <p className="m-lead" style={{ maxWidth: "44ch" }}>{o.body}</p>
                  <ul className={styles.bullets}>
                    {o.bullets.map((b) => (
                      <li className={styles.bullet} key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="We build your first Channel Graph from your real partner data — not a demo dataset."
      />
    </main>
  );
}
