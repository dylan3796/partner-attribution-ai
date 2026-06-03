"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import NextMovesFeed from "@/components/NextMovesFeed";
import type { NextMoveAgent } from "@/convex/lib/nextMoves/types";

const AGENTS: { key: NextMoveAgent; label: string }[] = [
  { key: "psm", label: "PSM" },
  { key: "pam", label: "PAM" },
  { key: "program", label: "Program" },
  { key: "ops", label: "Ops" },
];

function FeedInner() {
  const searchParams = useSearchParams();
  const isDemo = searchParams?.get("demo") === "true";

  const data = useQuery(api.feed.getNextMoves, { limit: 24, demo: isDemo || undefined });
  const seedDemoOrg = useMutation(api.seedDemo.seedDemoOrg);
  const seededRef = useRef(false);
  const [filter, setFilter] = useState<NextMoveAgent | "all">("all");

  // In demo mode, seed the shared demo org once if the feed comes back empty.
  useEffect(() => {
    if (isDemo && data && data.moves.length === 0 && !seededRef.current) {
      seededRef.current = true;
      seedDemoOrg().catch(() => {});
    }
  }, [isDemo, data, seedDemoOrg]);

  const counts = data?.counts ?? { psm: 0, pam: 0, program: 0, ops: 0 };
  const moves = useMemo(
    () => (data?.moves ?? []).filter((m) => filter === "all" || m.agent === filter),
    [data, filter]
  );

  const loading = data === undefined;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-.01em", margin: "0 0 .35rem" }}>
          Today&apos;s moves
        </h1>
        <p style={{ color: "var(--muted)", fontSize: ".92rem", margin: 0, lineHeight: 1.55 }}>
          The handful of moves worth making this week — ranked, with the evidence behind each one.
          {isDemo ? " You're viewing the Covant demo dataset." : ""}
        </p>
      </div>

      {/* Agent filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
        <FilterChip label="All" active={filter === "all"} count={data?.moves.length ?? 0} onClick={() => setFilter("all")} />
        {AGENTS.map((a) => (
          <FilterChip
            key={a.key}
            label={a.label}
            active={filter === a.key}
            count={counts[a.key]}
            onClick={() => setFilter(a.key)}
          />
        ))}
      </div>

      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "0.5rem 1.25rem",
        }}
      >
        {loading ? (
          <div style={{ color: "var(--muted)", fontSize: ".9rem", padding: "1.5rem 0" }}>Loading moves…</div>
        ) : (
          <NextMovesFeed
            moves={moves}
            emptyHint={
              isDemo
                ? "Spinning up the demo dataset… refresh in a moment."
                : "No moves right now — you're all caught up."
            }
          />
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: ".4rem .75rem",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: active ? "var(--fg, #0a0a0a)" : "var(--bg)",
        color: active ? "#fff" : "var(--muted)",
        fontSize: ".8rem",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
      <span style={{ opacity: 0.7, fontVariantNumeric: "tabular-nums" }}>{count}</span>
    </button>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={null}>
      <FeedInner />
    </Suspense>
  );
}
