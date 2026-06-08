/**
 * CSV Import — parsing, validation, duplicate detection, and mapping to store types.
 * No external dependencies (no papaparse). Handles quoted fields, newlines, etc.
 */
import type { Partner, Deal, Touchpoint, TouchpointType } from "./types";

// ── Types ──

export type ImportDataType = "deals" | "partners" | "touchpoints";

export type ValidationError = {
  row: number;
  field: string;
  message: string;
};

export type ImportPreview<T> = {
  headers: string[];
  rows: T[];
  totalRows: number;
  validRows: number;
  errors: ValidationError[];
  duplicates: number[];
};

// ── CSV Parsing ──

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  // Handle different line endings
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter((l) => l.trim());
  if (lines.length < 1) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });

  return { headers, rows };
}

// ── Validation Helpers ──

const VALID_PARTNER_TYPES = ["affiliate", "referral", "reseller", "integration"];
const VALID_TIERS = ["bronze", "silver", "gold", "platinum", ""];
const VALID_STATUSES = ["active", "inactive", "pending"];
const VALID_DEAL_STAGES = ["open", "won", "lost"];
const VALID_TOUCHPOINT_TYPES = [
  "referral", "demo", "content_share", "introduction",
  "proposal", "negotiation", "deal_registration", "co_sell", "technical_enablement",
];

function isValidEmail(email: string): boolean {
  if (!email) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(dateStr: string): boolean {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function isPositiveNumber(val: string): boolean {
  if (!val) return true;
  const n = parseFloat(val);
  return !isNaN(n) && n >= 0;
}

// ── Partner Import ──

export type PartnerImportRow = Omit<Partner, "_id" | "organizationId" | "createdAt">;

export function validateAndParsePartners(
  csvText: string,
  existingPartners: Partner[] = []
): ImportPreview<PartnerImportRow> {
  const { headers, rows } = parseCsv(csvText);
  const errors: ValidationError[] = [];
  const duplicates: number[] = [];
  const parsed: PartnerImportRow[] = [];

  const existingEmails = new Set(existingPartners.map((p) => p.email.toLowerCase()));
  const existingNames = new Set(existingPartners.map((p) => p.name.toLowerCase()));
  const seenEmails = new Set<string>();

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // 1-indexed + header

    // Required: name
    if (!row.name) {
      errors.push({ row: rowNum, field: "name", message: "Name is required" });
    }

    // Type validation
    const type = (row.type || "referral").toLowerCase();
    if (type && !VALID_PARTNER_TYPES.includes(type)) {
      errors.push({ row: rowNum, field: "type", message: `Invalid type "${row.type}". Must be: ${VALID_PARTNER_TYPES.join(", ")}` });
    }

    // Tier validation
    const tier = (row.tier || "").toLowerCase();
    if (tier && !VALID_TIERS.includes(tier)) {
      errors.push({ row: rowNum, field: "tier", message: `Invalid tier "${row.tier}". Must be: ${VALID_TIERS.filter(Boolean).join(", ")}` });
    }

    // Email validation
    if (row.email && !isValidEmail(row.email)) {
      errors.push({ row: rowNum, field: "email", message: `Invalid email "${row.email}"` });
    }

    // Status validation
    const status = (row.status || "active").toLowerCase();
    if (status && !VALID_STATUSES.includes(status)) {
      errors.push({ row: rowNum, field: "status", message: `Invalid status "${row.status}". Must be: ${VALID_STATUSES.join(", ")}` });
    }

    // Duplicate detection
    const emailLower = (row.email || "").toLowerCase();
    const nameLower = (row.name || "").toLowerCase();
    if (emailLower && (existingEmails.has(emailLower) || seenEmails.has(emailLower))) {
      duplicates.push(rowNum);
    }
    if (nameLower && existingNames.has(nameLower)) {
      duplicates.push(rowNum);
    }
    if (emailLower) seenEmails.add(emailLower);

    parsed.push({
      name: row.name || "Unknown",
      email: row.email || "",
      type: (VALID_PARTNER_TYPES.includes(type) ? type : "referral") as Partner["type"],
      tier: (VALID_TIERS.includes(tier) && tier ? tier : undefined) as Partner["tier"],
      commissionRate: parseFloat(row.commission_rate || "10") || 10,
      status: (VALID_STATUSES.includes(status) ? status : "active") as Partner["status"],
      contactName: row.contact_name || undefined,
    });
  });

  return {
    headers,
    rows: parsed,
    totalRows: rows.length,
    validRows: rows.length - errors.filter((e, i, arr) => arr.findIndex((x) => x.row === e.row) === i).length,
    errors,
    duplicates: [...new Set(duplicates)],
  };
}

// ── Deal Import ──

export type DealImportRow = Omit<Deal, "_id" | "organizationId" | "createdAt">;

export function validateAndParseDeals(
  csvText: string,
  existingDeals: Deal[] = []
): ImportPreview<DealImportRow> {
  const { headers, rows } = parseCsv(csvText);
  const errors: ValidationError[] = [];
  const duplicates: number[] = [];
  const parsed: DealImportRow[] = [];

  const existingNames = new Set(existingDeals.map((d) => d.name.toLowerCase()));
  const seenNames = new Set<string>();

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;

    // Required: name
    if (!row.name) {
      errors.push({ row: rowNum, field: "name", message: "Deal name is required" });
    }

    // Amount validation
    if (row.amount && !isPositiveNumber(row.amount)) {
      errors.push({ row: rowNum, field: "amount", message: `Invalid amount "${row.amount}". Must be a positive number` });
    }

    // Stage validation
    const stage = (row.stage || "open").toLowerCase();
    if (stage && !VALID_DEAL_STAGES.includes(stage)) {
      errors.push({ row: rowNum, field: "stage", message: `Invalid stage "${row.stage}". Must be: ${VALID_DEAL_STAGES.join(", ")}` });
    }

    // Close date validation
    if (row.close_date && !isValidDate(row.close_date)) {
      errors.push({ row: rowNum, field: "close_date", message: `Invalid date "${row.close_date}". Use YYYY-MM-DD format` });
    }

    // Contact email validation
    if (row.contact_email && !isValidEmail(row.contact_email)) {
      errors.push({ row: rowNum, field: "contact_email", message: `Invalid email "${row.contact_email}"` });
    }

    // Duplicate detection
    const nameLower = (row.name || "").toLowerCase();
    if (nameLower && (existingNames.has(nameLower) || seenNames.has(nameLower))) {
      duplicates.push(rowNum);
    }
    if (nameLower) seenNames.add(nameLower);

    parsed.push({
      name: row.name || "Unknown Deal",
      amount: parseFloat(row.amount) || 0,
      status: (VALID_DEAL_STAGES.includes(stage) ? stage : "open") as Deal["status"],
      expectedCloseDate: row.close_date ? new Date(row.close_date).getTime() : undefined,
      contactName: row.contact_name || undefined,
      contactEmail: row.contact_email || undefined,
    });
  });

  return {
    headers,
    rows: parsed,
    totalRows: rows.length,
    validRows: rows.length - errors.filter((e, i, arr) => arr.findIndex((x) => x.row === e.row) === i).length,
    errors,
    duplicates: [...new Set(duplicates)],
  };
}

// ── Touchpoint Import ──

export type TouchpointImportRow = Omit<Touchpoint, "_id" | "organizationId" | "createdAt">;

export function validateAndParseTouchpoints(
  csvText: string,
  existingDealIds: string[] = [],
  existingPartnerIds: string[] = []
): ImportPreview<TouchpointImportRow> {
  const { headers, rows } = parseCsv(csvText);
  const errors: ValidationError[] = [];
  const parsed: TouchpointImportRow[] = [];

  const dealIdSet = new Set(existingDealIds);
  const partnerIdSet = new Set(existingPartnerIds);

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;

    // Required: deal_id
    if (!row.deal_id) {
      errors.push({ row: rowNum, field: "deal_id", message: "Deal ID is required" });
    } else if (dealIdSet.size > 0 && !dealIdSet.has(row.deal_id)) {
      errors.push({ row: rowNum, field: "deal_id", message: `Deal "${row.deal_id}" not found` });
    }

    // Required: partner_id
    if (!row.partner_id) {
      errors.push({ row: rowNum, field: "partner_id", message: "Partner ID is required" });
    } else if (partnerIdSet.size > 0 && !partnerIdSet.has(row.partner_id)) {
      errors.push({ row: rowNum, field: "partner_id", message: `Partner "${row.partner_id}" not found` });
    }

    // Type validation
    const tpType = (row.type || "referral").toLowerCase();
    if (tpType && !VALID_TOUCHPOINT_TYPES.includes(tpType)) {
      errors.push({ row: rowNum, field: "type", message: `Invalid type "${row.type}". Must be: ${VALID_TOUCHPOINT_TYPES.join(", ")}` });
    }

    // Date validation
    if (row.date && !isValidDate(row.date)) {
      errors.push({ row: rowNum, field: "date", message: `Invalid date "${row.date}". Use YYYY-MM-DD format` });
    }

    parsed.push({
      dealId: row.deal_id || "",
      partnerId: row.partner_id || "",
      type: (VALID_TOUCHPOINT_TYPES.includes(tpType) ? tpType : "referral") as TouchpointType,
      notes: row.notes || undefined,
    });
  });

  return {
    headers,
    rows: parsed,
    totalRows: rows.length,
    validRows: rows.length - errors.filter((e, i, arr) => arr.findIndex((x) => x.row === e.row) === i).length,
    errors,
    duplicates: [],
  };
}

// ── File Reading Helper ──

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

// ── Format Helpers ──

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
