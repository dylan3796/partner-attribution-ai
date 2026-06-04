/**
 * NextMovesFeed — presentational feed of the moves the next-moves engine
 * surfaced. Each row shows the agent lens, a severity marker, the move, the
 * evidence ("why"), and the suggested action, linked back to the deal/partner.
 *
 * When an `onFeedback` handler is passed, each row also gets accept / dismiss /
 * snooze controls — the explicit half of the learning loop. Pure/props-driven;
 * data + persistence live in the parent.
 */

import Link from "next/link";
import { Check, X, Clock } from "lucide-react";
import type { NextMove, NextMoveAgent } from "@/convex/lib/nextMoves/types";

export type MoveFeedbackAction = "accepted" | "dismissed" | "snoozed";

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

/** Default evidence link — points at the admin dashboard deal/partner pages. */
function dashboardLinkFor(move: NextMove): string | undefined {
  if (move.evidence.dealId) return `/dashboard/deals/${move.evidence.dealId}`;
  if (move.evidence.partnerId) return `/dashboard/partners/${move.evidence.partnerId}`;
  return undefined;
}

function FeedbackButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "1px solid var(--border)",
        background: "var(--bg)",
        color: "var(--muted)",
        cursor: "pointer",
      }}
    >
      {icon}
    </button>
  );
}

function MoveRow({
  move,
  last,
  linkFor,
  onFeedback,
}: {
  move: NextMove;
  last: boolean;
  linkFor: (move: NextMove) => string | undefined;
  onFeedback?: (move: NextMove, action: MoveFeedbackAction) => void;
}) {
  const sev = SEVERITY_COLOR[move.severity] ?? "#6b7280";
  const href = linkFor(move);

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
      {onFeedback && (
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <FeedbackButton label="Mark done / accept" icon={<Check size={14} />} onClick={() => onFeedback(move, "accepted")} />
          <FeedbackButton label="Snooze for a week" icon={<Clock size={14} />} onClick={() => onFeedback(move, "snoozed")} />
          <FeedbackButton label="Dismiss" icon={<X size={14} />} onClick={() => onFeedback(move, "dismissed")} />
        </div>
      )}
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
  linkFor = dashboardLinkFor,
  onFeedback,
}: {
  moves: NextMove[];
  emptyHint?: string;
  /** Resolve a row's href; return undefined for no link. Defaults to the admin dashboard. */
  linkFor?: (move: NextMove) => string | undefined;
  /** When provided, renders accept/dismiss/snooze controls per move. */
  onFeedback?: (move: NextMove, action: MoveFeedbackAction) => void;
}) {
  if (moves.length === 0) {
    return (
      <div style={{ color: "var(--muted)", fontSize: ".88rem", padding: "1.5rem 0" }}>{emptyHint}</div>
    );
  }
  return (
    <div>
      {moves.map((m, i) => (
        <MoveRow key={m.id} move={m} last={i === moves.length - 1} linkFor={linkFor} onFeedback={onFeedback} />
      ))}
    </div>
  );
}
