import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPercent(n: number): string {
  return `${Math.round(n * 100) / 100}%`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDateShort(timestamp);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
    case "won":
      return "bg-emerald-50 text-emerald-600";
    case "inactive":
    case "lost":
      return "bg-red-50 text-red-600";
    case "pending":
    case "open":
      return "bg-indigo-50 text-indigo-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
}

export function getTouchpointColor(type: string): string {
  switch (type) {
    case "referral":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "demo":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "content_share":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "introduction":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "proposal":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "negotiation":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

// Color palette for charts
export const CHART_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
];

export const MODEL_COLORS: Record<string, string> = {
  equal_split: "#6366f1",
  first_touch: "#8b5cf6",
  last_touch: "#ec4899",
  time_decay: "#14b8a6",
  role_based: "#f59e0b",
};
