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
        heading="See your Channel Graph."
        body="We make the first pass on your data and show you the graph — your partners and your channel, not a demo dataset. You take it from there."
      />
    </main>
  );
}
