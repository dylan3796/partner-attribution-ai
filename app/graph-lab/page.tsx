import ChannelGraph from "@/components/marketing/ChannelGraph";

/**
 * THROWAWAY preview for the HOME visuals (hero + 4 crops). Not linked; delete
 * before merge. Lets us eyeball/tune crop boxes for each outcome section.
 */

const CROPS = [
  {
    title: "Revenue — attribution (state 4), short loop",
    props: { activeSection: 4, crop: { x: 110, y: 40, w: 610, h: 330 } },
  },
  {
    title: "Ecosystem — Channel TAM (state 3), still",
    props: { activeSection: 3, crop: { x: 40, y: 10, w: 520, h: 360 }, still: true },
  },
  {
    title: "Craft the program — recommend (state 5), still",
    props: {
      activeSection: 5,
      crop: { x: 380, y: 110, w: 470, h: 500 },
      still: true,
      recommendChip: "Strong in fins · HLS gap → build a solution",
    },
  },
  {
    title: "Every question — ask (state 6), short loop",
    props: { activeSection: 6, crop: { x: 270, y: 30, w: 680, h: 560 } },
  },
];

export default function GraphLab() {
  return (
    <main className="site site--story" style={{ padding: "3rem 0" }}>
      <div className="m-container" style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
        <section>
          <p className="m-eyebrow">Hero — assemble once, then drift</p>
          <div style={{ maxWidth: 900, margin: "1rem 0", border: "1px solid var(--m-border)", borderRadius: 8, padding: "1.5rem" }}>
            <ChannelGraph activeSection={2} ambient />
          </div>
        </section>

        <section>
          <p className="m-eyebrow">The 4 outcome crops</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", marginTop: "1rem" }}>
            {CROPS.map((c) => (
              <div key={c.title} style={{ border: "1px solid var(--m-border)", borderRadius: 8, padding: "1.25rem" }}>
                <p className="m-small" style={{ marginBottom: ".75rem", color: "var(--m-ink-2)" }}>{c.title}</p>
                <ChannelGraph {...c.props} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
