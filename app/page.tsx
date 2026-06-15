import GraphStory from "@/components/marketing/GraphStory";
import CTABand from "@/components/marketing/CTABand";

// Covant homepage — Partner Intelligence, anchored on the Channel Graph.
// The page is a pinned-graph spine: hero (graph assembles) → 6 sections
// (Connect → Graph forms → Channel TAM → Attribution → Plan & recommend →
// Ask) drive the pinned Channel Graph via scroll-linked activeSection →
// closing CTA. Copy: messaging.md · Tokens/layout: design-system.md.
// No fabricated proof: no stats block, no logo/trust strip, no testimonials.
export default function Home() {
  return (
    <main className="site site--story">
      <GraphStory />
      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="We build your first Channel Graph from your real partner data — not a demo dataset."
      />
    </main>
  );
}
