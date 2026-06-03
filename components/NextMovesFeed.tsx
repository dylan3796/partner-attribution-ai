/**
 * NextMovesFeed — presentational feed of the moves the next-moves engine
 * surfaced. Each row shows the agent lens, a severity marker, the move, the
 * evidence ("why"), and the suggested action — with a link back to the deal or
 * partner it came from. Pure/props-driven; data is fetched by the parent.
 */

import Link from "next/link";
import type { NextMove, NextMoveAgent } from "@/convex/lib/nextMoves/types";

const AGENT_LABEL: Record<NextMoveAgent, string> = {
  psm: "PSM",
  pam: "PAM",
  program: "Program",
  ops: "Ops",
};

const SEVERITY_COLOR: Record<string, string> = {
  high: "#dc2626",
  med: "#d97706",
  low: "#6b7280",
};

function MoveRow({ move, last }: { move: NextMove; last: boolean }) {
  const sev = SEVERITY_COLOR[move.severity] ?? "#6b7280";
  const href = move.evidence.dealId
    ? `/dashboard/deals/${move.evidence.dealId}`
    : move.evidence.partnerId
      ? `/dashboard/partners/${move.evidence.partnerId}`
      : undefined;

  const body = (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "16px 4px",
        borderBottom: last ? "none" : "1px solid var(--border)",
        alignItems: "flex-start",
      }}
    >
      <span
        title={`${move.severity} priority`}
        style={{ width: 8, height: 8, borderRadius: 999, background: sev, marginTop: 7, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: ".62rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "var(--subtle)",
              color: "var(--muted)",
              padding: "3px 7px",
              borderRadius: 4,
              textTransform: "uppercase",
            }}
          >
            {AGENT_LABEL[move.agent]}
          </span>
          <span style={{ fontSize: ".92rem", fontWeight: 600 }}>{move.title}</span>
        </div>
        <div style={{ color: "var(--muted)", fontSize: ".83rem", lineHeight: 1.55, marginBottom: 6 }}>
          {move.detail}
        </div>
        <div style={{ color: "var(--muted)", fontSize: ".76rem", lineHeight: 1.5, fontStyle: "italic", marginBottom: 6 }}>
          ↳ why: {move.evidence.reason}
        </div>
        <div style={{ color: "var(--fg, #0a0a0a)", fontSize: ".8rem", lineHeight: 1.5, fontWeight: 500 }}>
          → {move.suggestedAction}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      {body}
    </Link>
  ) : (
    body
  );
}

export default function NextMovesFeed({
  moves,
  emptyHint = "No moves right now — you're all caught up.",
}: {
  moves: NextMove[];
  emptyHint?: string;
}) {
  if (moves.length === 0) {
    return (
      <div style={{ color: "var(--muted)", fontSize: ".88rem", padding: "1.5rem 0" }}>{emptyHint}</div>
    );
  }
  return (
    <div>
      {moves.map((m, i) => (
        <MoveRow key={m.id} move={m} last={i === moves.length - 1} />
      ))}
    </div>
  );
}
