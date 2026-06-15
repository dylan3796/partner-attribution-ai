import GraphStory from "@/components/marketing/GraphStory";
import CTABand from "@/components/marketing/CTABand";

// Covant homepage — Partner Experience Management, the successor to the PRM.
// Pinned-graph spine: hero → 5 sections (Connect → Scoring → Attribution →
// Reconstruct → Ask) drive the pinned channel visual via scroll-linked
// activeSection → closing CTA. Voice mirrors the live site: short, declarative,
// shipped-true. No fabricated proof: no stats block, no logos, no testimonials.
export default function Home() {
  return (
    <main className="site site--story">
      <GraphStory />
      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="Connect your CRM and watch Covant attribute the last twelve months of partner-sourced revenue."
      />
    </main>
  );
}
