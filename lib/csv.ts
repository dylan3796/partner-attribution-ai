/**
 * CSV import/export utilities
 */
import type { Partner, Deal, Attribution } from "./types";

function escapeCsv(val: string | number | undefined): string {
  if (val === undefined || val === null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvRow(values: (string | number | undefined)[]): string {
  return values.map(escapeCsv).join(",");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// === EXPORTS ===

export function exportPartnersCSV(partners: Partner[]) {
  const header = "Name,Email,Type,Tier,Commission Rate %,Status,Contact,Territory,Created";
  const rows = partners.map((p) =>
    toCsvRow([p.name, p.email, p.type, p.tier, p.commissionRate, p.status, p.contactName, p.territory, new Date(p.createdAt).toISOString()])
  );
  downloadCsv([header, ...rows].join("\n"), `partners-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportDealsCSV(deals: Deal[]) {
  const header = "Name,Amount,Status,Contact,Created,Closed";
  const rows = deals.map((d) =>
    toCsvRow([d.name, d.amount, d.status, d.contactName, new Date(d.createdAt).toISOString(), d.closedAt ? new Date(d.closedAt).toISOString() : ""])
  );
  downloadCsv([header, ...rows].join("\n"), `deals-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportAttributionsCSV(attributions: Attribution[]) {
  const header = "Deal,Partner,Model,Attribution %,Amount,Commission";
  const rows = attributions.map((a) =>
    toCsvRow([a.deal?.name || a.dealId, a.partner?.name || a.partnerId, a.model, a.percentage, a.amount, a.commissionAmount])
  );
  downloadCsv([header, ...rows].join("\n"), `attributions-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportPayoutsCSV(payouts: { partner: string; amount: number; status: string; period?: string }[]) {
  const header = "Partner,Amount,Status,Period";
  const rows = payouts.map((p) => toCsvRow([p.partner, p.amount, p.status, p.period]));
  downloadCsv([header, ...rows].join("\n"), `payouts-${new Date().toISOString().slice(0, 10)}.csv`);
}

// === IMPORTS ===

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ",") { result.push(current.trim()); current = ""; }
      else { current += ch; }
    }
  }
  result.push(current.trim());
  return result;
}

export function parsePartnersCSV(csv: string): Omit<Partner, "_id" | "organizationId" | "createdAt">[] {
  const lines = csv.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  return lines.slice(1).map((line) => {
    const [name, email, type, tier, rate, status, contact, territory] = parseCsvLine(line);
    return {
      name: name || "Unknown",
      email: email || "",
      type: (["affiliate", "referral", "reseller", "integration"].includes(type) ? type : "referral") as Partner["type"],
      tier: (["bronze", "silver", "gold", "platinum"].includes(tier) ? tier : undefined) as Partner["tier"],
      commissionRate: parseFloat(rate) || 10,
      status: (["active", "inactive", "pending"].includes(status) ? status : "pending") as Partner["status"],
      contactName: contact || undefined,
      territory: territory || undefined,
    };
  });
}

export function parseDealsCSV(csv: string): Omit<Deal, "_id" | "organizationId" | "createdAt">[] {
  const lines = csv.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  return lines.slice(1).map((line) => {
    const [name, amount, status, contact] = parseCsvLine(line);
    return {
      name: name || "Unknown Deal",
      amount: parseFloat(amount) || 0,
      status: (["open", "won", "lost"].includes(status) ? status : "open") as Deal["status"],
      contactName: contact || undefined,
    };
  });
}
