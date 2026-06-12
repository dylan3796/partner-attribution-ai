import type { ReactNode } from "react";

/**
 * Inline highlight chip: a key verb in the copy rendered as a soft accent
 * pill with a small line icon, so the sentence itself reads as product UI.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS = {
  /** clipboard — registering a deal */
  register: (
    <svg viewBox="0 0 16 16" {...stroke} aria-hidden="true">
      <rect x="3" y="2.8" width="10" height="11" rx="2" />
      <path d="M5.8 1.8h4.4M5.8 6.4h4.4M5.8 9.2h2.8" />
    </svg>
  ),
  /** percent — credit split */
  credit: (
    <svg viewBox="0 0 16 16" {...stroke} aria-hidden="true">
      <path d="M12.4 3.6l-8.8 8.8" />
      <circle cx="4.6" cy="4.6" r="1.7" />
      <circle cx="11.4" cy="11.4" r="1.7" />
    </svg>
  ),
  /** check — the why, verified */
  why: (
    <svg viewBox="0 0 16 16" {...stroke} aria-hidden="true">
      <path d="M2.8 8.6l3.4 3.2L13.2 4.4" />
    </svg>
  ),
  /** coin — commissions */
  pay: (
    <svg viewBox="0 0 16 16" {...stroke} aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.8v6.4M10.2 6.2c-.5-.8-1.3-1-2.2-1-1.2 0-2 .6-2 1.5 0 2 4.4 1 4.4 3 0 .9-1 1.5-2.2 1.5-1 0-1.9-.3-2.4-1.1" />
    </svg>
  ),
  /** arrow up-right — tier progress */
  grow: (
    <svg viewBox="0 0 16 16" {...stroke} aria-hidden="true">
      <path d="M3.5 12.5l9-9M6.5 3.5h6v6" />
    </svg>
  ),
} satisfies Record<string, ReactNode>;

export default function Chip({
  icon,
  children,
}: {
  icon?: keyof typeof ICONS;
  children: ReactNode;
}) {
  return (
    <span className="m-chip">
      {icon ? ICONS[icon] : null}
      {children}
    </span>
  );
}
