"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type SortDirection = "asc" | "desc" | null;

type SortableHeaderProps = {
  label: string;
  active: boolean;
  direction: SortDirection;
  onSort: () => void;
  style?: React.CSSProperties;
};

export function SortableHeader({ label, active, direction, onSort, style }: SortableHeaderProps) {
  return (
    <th
      onClick={onSort}
      style={{
        padding: ".8rem",
        textAlign: "left",
        fontWeight: 600,
        fontSize: ".8rem",
        color: active ? "var(--fg)" : "var(--muted)",
        cursor: "pointer",
        userSelect: "none",
        transition: "color .15s",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
        {label}
        {active ? (
          direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        ) : (
          <ChevronsUpDown size={14} style={{ opacity: 0.3 }} />
        )}
      </span>
    </th>
  );
}

export function useSortState<T extends string>(defaultField: T, defaultDir: "asc" | "desc" = "desc") {
  const [sortField, setSortField] = useState<T>(defaultField);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultDir);

  function handleSort(field: T) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  return { sortField, sortDir, handleSort };
}
