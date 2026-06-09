/** Deterministic display formatting for the demo (no locale surprises). */

export function fmtMoney(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m.toFixed(m >= 10 ? 1 : 2)}M`;
  }
  if (Math.abs(n) >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n)}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(ms: number): string {
  const d = new Date(ms);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
