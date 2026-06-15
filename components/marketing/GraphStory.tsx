"use client";

import { useEffect, useRef, useState } from "react";
import ChannelGraph from "@/components/marketing/ChannelGraph";
import styles from "./GraphStory.module.css";

/**
 * Homepage spine: the Channel Graph pinned in a sticky column while the content
 * column scrolls through the hero + 5 sections. Each section, as it crosses the
 * viewport center, sets `activeSection` (the graph's own state value, carried in
 * data-index) — the same state machine the standalone component uses.
 *
 * Copy: messaging.md / copy-rewrite.md · Layout/tokens: design-system.md
 */

type Sub = { t: string; d: string };
type Section = { key: string; eyebrow: string; tag: string; graphState: number; headline: string; body: string; subs: Sub[] };

const SPINE: Section[] = [
  {
    key: "connect",
    eyebrow: "01 — Connect",
    tag: "Useful in days",
    graphState: 2,
    headline: "Reads the CRM you already have.",
    body: "Covant pulls the deals and partner touchpoints already sitting in Salesforce or HubSpot and builds a working model of your channel from them. Connected to current in days — no clean-room, no six-month rollout.",
    subs: [
      { t: "Salesforce and HubSpot", d: "Reads the deals and touchpoints you already have." },
      { t: "Beyond the CRM", d: "Registrations, logged touches, and portal activity, counted too." },
      { t: "Useful in days", d: "No migration, no blank slate." },
    ],
  },
  {
    key: "scoring",
    eyebrow: "02 — Scoring",
    tag: "Know who drives revenue",
    graphState: 3,
    headline: "Every partner, scored.",
    body: "Covant scores every partner on what they actually drive — sourced revenue, win rate, deal influence — not what they claim. The quiet over-performers surface; the logos that coast stop hiding.",
    subs: [
      { t: "Scored on outcomes", d: "Sourced revenue, win rate, influence." },
      { t: "Grounded decisions", d: "Tiers and investment set on the numbers." },
      { t: "The right partner, named", d: "Best fit for any open deal." },
    ],
  },
  {
    key: "attribution",
    eyebrow: "03 — Attribution",
    tag: "A model per motion",
    graphState: 4,
    headline: "A model per motion. Settled.",
    body: "Covant recommends the attribution model that fits each motion — resell, co-sell, services — instead of forcing one onto everything. Every deal is settled with a model and an audit trail, on your call.",
    subs: [
      { t: "The right model, per motion", d: "Recommended, not forced onto everything." },
      { t: "An audit trail per dollar", d: "Every split explained, every touchpoint cited." },
      { t: "Your call", d: "Covant proposes; you approve or adjust." },
    ],
  },
  {
    key: "reconstruct",
    eyebrow: "04 — Reconstruct",
    tag: "See the last twelve months",
    graphState: 5,
    headline: "Your last twelve months, attributed.",
    body: "Connect the CRM and watch Covant attribute the last twelve months of partner-sourced revenue under the right model — then hand your team the next move on every open deal.",
    subs: [
      { t: "History, reconstructed", d: "Twelve months of partner-sourced revenue, attributed." },
      { t: "The next move", d: "The best-fit partner for what's open now." },
      { t: "QBR-ready", d: "The answers pulled before you walk in." },
    ],
  },
  {
    key: "ask",
    eyebrow: "05 — Ask",
    tag: "Run it day to day",
    graphState: 6,
    headline: "Ask your channel anything.",
    body: "Ask in plain language — who closes fastest in healthcare, who belongs on this deal — and the answer comes back with the records attached. Each partner sees only their slice.",
    subs: [
      { t: "Plain-language answers", d: "With the records attached." },
      { t: "Two-sided by design", d: "Partners see only their slice." },
      { t: "On your terms", d: "You control what each partner can ask." },
    ],
  },
];

export default function GraphStory() {
  const [active, setActive] = useState(0);
  const markers = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Mobile: the sticky interaction doesn't apply — show one static "asset"
    // shot (state 2, the organized Channel Graph) and skip the observer.
    const mq = window.matchMedia("(max-width: 900px)");
    let obs: IntersectionObserver | null = null;

    const setup = () => {
      obs?.disconnect();
      obs = null;
      if (mq.matches) {
        setActive(2);
        return;
      }
      obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(Number((entry.target as HTMLElement).dataset.index));
            }
          }
        },
        { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
      );
      markers.current.forEach((m) => m && obs!.observe(m));
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      obs?.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* Hero — graph state 0 (assembly). DOM order hero -> graph -> sections
            so mobile stacks as hero -> static shot -> sections. */}
        <section
          ref={(el) => { markers.current[0] = el; }}
          data-index={0}
          className={styles.hero}
        >
          <p className="m-eyebrow">Partner Experience Management</p>
          <h1 className="m-h1" style={{ maxWidth: "16ch" }}>
            Make partner revenue accountable.
          </h1>
          <p className="m-lead">
            Covant is the AI-native successor to the PRM. It scores every
            partner, settles attribution across every motion, and reconstructs
            your last twelve months of partner-sourced revenue.
          </p>
          <div className={styles.heroCta}>
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="#spine">See how it works</a>
          </div>
        </section>

        {/* Pinned graph (desktop) / single static asset shot (mobile) */}
        <div className={styles.visual}>
          <ChannelGraph activeSection={active} />
          <p className={styles.caption}>Illustrative — sample data, not customer data</p>
        </div>

        {/* The 5 spine sections */}
        {SPINE.map((s, i) => (
          <section
            key={s.key}
            id={i === 0 ? "spine" : undefined}
            ref={(el) => { markers.current[i + 1] = el; }}
            data-index={s.graphState}
            className={styles.section}
          >
            <p className="m-eyebrow">
              {s.eyebrow} <span className={styles.tag}>· {s.tag}</span>
            </p>
            <h2 className="m-h2" style={{ maxWidth: "18ch" }}>{s.headline}</h2>
            <p className={`m-lead ${styles.body}`}>{s.body}</p>
            <div className={styles.subs}>
              {s.subs.map((sub) => (
                <div className={styles.sub} key={sub.t}>
                  <h3 className={styles.subTitle}>{sub.t}</h3>
                  <p className={styles.subBody}>{sub.d}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
