"use client";

import { useEffect, useRef, useState } from "react";
import ChannelGraph from "@/components/marketing/ChannelGraph";
import styles from "./GraphStory.module.css";

/**
 * Homepage spine: the Channel Graph pinned in a sticky column while the content
 * column scrolls through the hero + 6 sections. Each section, as it crosses the
 * viewport center, sets `activeSection` — the SAME state machine the standalone
 * component uses (not forked). Pinned visual + scroll-linked state via
 * IntersectionObserver; the user scrolls normally.
 *
 * Copy: messaging.md · Layout/tokens: design-system.md
 */

type Sub = { t: string; d: string };
type Section = { n: number; eyebrow: string; tag: string; headline: string; body: string; subs: Sub[] };

const SPINE: Section[] = [
  {
    n: 1,
    eyebrow: "01 — Connect everything",
    tag: "Build the Graph",
    headline: "Every source you already have feeds one graph.",
    body: "Covant reads the systems your channel already lives in — structured or not — and connects them into one model. Your deals stay where they are; nothing to migrate.",
    subs: [
      { t: "Reads your whole stack", d: "CRM, email, Slack, deal notes, and spreadsheets — structured or unstructured." },
      { t: "Every field is signal", d: "Verticals, deal size, time-to-close, and use cases are pulled from real records." },
      { t: "Connected, not dumped", d: "Sources become relationships in a graph, not rows in another dashboard." },
    ],
  },
  {
    n: 2,
    eyebrow: "02 — The Channel Graph",
    tag: "Build the Graph",
    headline: "Covant builds your first Channel Graph. You make it yours.",
    body: "Covant takes an intelligent first pass — inferring who partners with whom and who drives what — so you start from a working model, not a blank slate. You iterate from there, and every correction compounds.",
    subs: [
      { t: "An intelligent first pass", d: "Covant drafts the graph from your data on day one, not a blank canvas." },
      { t: "You iterate, it sharpens", d: "Adjust a partner profile or a relationship and the graph updates around it." },
      { t: "A durable asset you own", d: "The context compounds with you, not locked inside a vendor report." },
    ],
  },
  {
    n: 3,
    eyebrow: "03 — Channel TAM",
    tag: "Grow your channel",
    headline: "Recruit and activate the partners who fit your program.",
    body: "The graph maps who fits your ecosystem and flags who you're missing, then reads the market for the right moment to move. Recruit the gaps; activate the partners you already have.",
    subs: [
      { t: "Fit, not a list", d: "Surfaces partners matched to your verticals, deal sizes, and motions." },
      { t: "Timing signals", d: "M&A, consolidation, and new-practice moves flag who to approach now." },
      { t: "Recruit and activate", d: "Close the gaps, and wake up partners already in your program." },
    ],
  },
  {
    n: 4,
    eyebrow: "04 — Attribution",
    tag: "Prove the impact",
    headline: "Proposed attribution, with the paper trail, awaiting your approval.",
    body: "Covant proposes who sourced and who influenced each deal and attaches the records behind every claim. You approve or adjust — Covant never decides credit on its own, and your corrections train the graph.",
    subs: [
      { t: "Sourced and influenced, proposed", d: "Covant drafts the split; the call stays yours." },
      { t: "The paper trail is attached", d: "Every claim cites the touchpoints and records behind it." },
      { t: "You approve; it learns", d: "Adjustments train the graph, so the next proposal is sharper." },
    ],
  },
  {
    n: 5,
    eyebrow: "05 — Plan & recommend",
    tag: "Plan with evidence",
    headline: "From the next deal to next year's plan.",
    body: "The graph names the best-fit partner for a live deal and grounds the calls you used to make on instinct — tiers, territories, quota, and investment. Partner Finder surfaces who to recruit next.",
    subs: [
      { t: "The right partner, this deal", d: "Best-fit partner named for an open or stalled deal, evidence attached." },
      { t: "Plan on evidence", d: "Tiers, territories, quota, and investment grounded in the graph." },
      { t: "Partner Finder", d: "Spots the gaps and surfaces who to add, by vertical and geography." },
    ],
  },
  {
    n: 6,
    eyebrow: "06 — Ask Covant",
    tag: "Run it day to day",
    headline: "A Partner Manager for every partner. A CPO for you.",
    body: "Ask in plain language and the answer comes back with the records attached. For partners, Covant is like a dedicated Partner Manager; for you, it's like a Chief Partnership Officer who already knows the whole channel.",
    subs: [
      { t: "For partners — a dedicated Partner Manager", d: "Their deals, status, and next step, on demand." },
      { t: "For vendors — your CPO", d: "The channel's priorities and answers, surfaced proactively." },
      { t: "Two-sided by design", d: "Ships as MCP servers for Claude and OpenAI; each partner controls their scoped slice." },
    ],
  },
];

export default function GraphStory() {
  const [active, setActive] = useState(0);
  const markers = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Mobile: the sticky interaction doesn't apply — show one static "asset"
    // shot (section 2) and skip the observer entirely. Desktop: scroll-link it.
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
        {/* Hero — section 0 (assembly). DOM order hero -> graph -> sections so
            mobile stacks as hero -> static shot -> sections. */}
        <section
          ref={(el) => { markers.current[0] = el; }}
          data-index={0}
          className={styles.hero}
        >
          <p className="m-eyebrow">Covant · Partner Intelligence</p>
          <h1 className="m-h1" style={{ maxWidth: "16ch" }}>
            The first Partner Intelligence Engine for startups.
          </h1>
          <p className="m-lead">
            The AI-native platform that turns scattered partner data into one
            connected source of truth.
          </p>
          <div className={styles.heroCta}>
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="#spine">See how it works</a>
          </div>
        </section>

        {/* Pinned graph (desktop) / single static asset shot (mobile) */}
        <div className={styles.visual}>
          <ChannelGraph activeSection={active} />
        </div>

        {/* The 6 spine sections */}
        {SPINE.map((s, i) => (
          <section
            key={s.n}
            id={i === 0 ? "spine" : undefined}
            ref={(el) => { markers.current[s.n] = el; }}
            data-index={s.n}
            className={styles.section}
          >
            <p className="m-eyebrow">
              {s.eyebrow} <span className={styles.tag}>· {s.tag}</span>
            </p>
            <h2 className="m-h2" style={{ maxWidth: "20ch" }}>{s.headline}</h2>
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
