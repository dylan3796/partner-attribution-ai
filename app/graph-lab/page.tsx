"use client";

import { useEffect, useRef, useState } from "react";
import ChannelGraph from "@/components/marketing/ChannelGraph";

/**
 * THROWAWAY test harness for the Channel Graph (Step 3, isolation).
 * Not linked anywhere; delete before/at integration. It fakes the real
 * page's scroll: 7 tall markers, each sets `activeSection` as it crosses
 * the viewport center via IntersectionObserver. No scroll-jacking.
 */

const SECTIONS = [
  { n: 0, title: "Hero / assembly", note: "Graph assembles from empty, then settles into idle." },
  { n: 1, title: "Connect everything", note: "Sources feed in; context tags snap onto edges." },
  { n: 2, title: "The graph is the asset", note: "Whole graph evenly lit, calm, fully labeled." },
  { n: 3, title: "Channel TAM", note: "Ghost nodes fade in, scan sweep, signal badges blink." },
  { n: 4, title: "Attribution", note: "Deal D2 active; sourced + influenced flow in; evidence chip." },
  { n: 5, title: "Plan & recommend", note: "Partners glide into tiers; one pulse on the recommendation." },
  { n: 6, title: "Ask Covant", note: "Query path lights, then collapses to a partner-scoped slice." },
];

export default function GraphLab() {
  const [active, setActive] = useState(0);
  const markers = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActive(idx);
          }
        }
      },
      // "intersecting" only while the marker straddles the vertical center
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    markers.current.forEach((m) => m && obs.observe(m));
    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ background: "var(--m-bg)", color: "var(--m-ink)" }}>
      {/* debug label — remove before integration */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 50,
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          fontSize: ".8rem",
          fontWeight: 700,
          letterSpacing: ".04em",
          background: "var(--m-ink)",
          color: "#fff",
          padding: ".4rem .7rem",
          borderRadius: 8,
        }}
      >
        activeSection: {active}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        {/* sticky pinned graph */}
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center" }}>
          <ChannelGraph activeSection={active} />
        </div>

        {/* scrolling content markers */}
        <div>
          {SECTIONS.map((s) => (
            <section
              key={s.n}
              ref={(el) => { markers.current[s.n] = el; }}
              data-index={s.n}
              style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", borderBottom: "1px solid var(--m-border)" }}
            >
              <p style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--m-accent)" }}>
                Section {s.n}
              </p>
              <h2 style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", lineHeight: 1.1, margin: ".5rem 0 1rem", color: "var(--m-ink)" }}>
                {s.title}
              </h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--m-ink-2)", maxWidth: "38ch" }}>{s.note}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
