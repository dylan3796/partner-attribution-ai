import Vignette from "@/components/marketing/Vignette";

/**
 * Illustrative product shot: conversational access to the Channel Graph.
 * An assistant-style exchange with the mechanism visible — a connection
 * chip showing the graph is served over MCP, a customer query answered
 * from the graph with records attached, and a compact partner-side query.
 * Clearly labelled example data.
 *
 * Future scope: the MCP server surface this shot depicts (Claude and
 * OpenAI MCP servers exposing the graph to customers and partners) is not
 * yet built — this is marketing surface for the full vision, not shipped
 * product.
 *
 * Plays once on scroll-into-view: connection chip, then each exchange in
 * turn.
 */
export default function AskGraphVisual() {
  return (
    <Vignette>
    <div
      className="m-shot"
      role="img"
      aria-label="Example product screen: a conversational exchange with the Channel Graph over MCP — a customer asks which partners close fastest in healthcare and gets two ranked partners with their records; a partner asks for their certification status and gets a validated answer"
    >
      <div className="m-app">
        <div className="m-app-bar">
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-title">Ask the graph</span>
          <span className="m-app-tag">Example data</span>
        </div>
        <div className="m-chat">
          <div data-vig={1} style={{ alignSelf: "flex-start" }}>
            <span className="m-pill">Channel Graph · MCP server connected</span>
          </div>
          <div className="m-chat-q" data-vig={2}>
            Which partners close fastest in healthcare?
          </div>
          <div className="m-chat-a" data-vig={3}>
            <p style={{ margin: 0, fontWeight: 600, color: "var(--m-ink)" }}>
              1. Meridian Consulting — 41 days median
            </p>
            <p className="m-app-reason" style={{ marginTop: ".15rem" }}>
              4 healthcare closed-won, eval → close, last 24 months
            </p>
            <p style={{ margin: ".6rem 0 0", fontWeight: 600, color: "var(--m-ink)" }}>
              2. Brightline Apps — 52 days median
            </p>
            <p className="m-app-reason" style={{ marginTop: ".15rem" }}>
              4 healthcare deployments, two at $100K+
            </p>
            <p className="m-app-reason" style={{ marginTop: ".6rem" }}>
              Records attached — 8 deals cited.
            </p>
          </div>
          <div data-vig={4} style={{ alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".3rem", maxWidth: "85%" }}>
            <span className="m-chat-meta">Asked by a partner</span>
            <span className="m-chat-q" style={{ alignSelf: "auto" }}>
              What&apos;s my certification status?
            </span>
          </div>
          <div className="m-chat-a" data-vig={5}>
            Advanced certification — validated May 3. Next milestone on your
            journey: first solution launched.
          </div>
        </div>
        <div className="m-app-foot" data-vig={6}>
          <span>Served over MCP · Claude &amp; OpenAI</span>
          <span className="m-app-link">Connect your assistant →</span>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
