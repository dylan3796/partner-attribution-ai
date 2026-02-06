"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-shadow", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          {trend && (
            <p className={cn("text-sm font-medium", trend.value >= 0 ? "text-emerald-600" : "text-red-600")}>
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-indigo-50 p-2.5">
          <Icon className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
    </div>
  );
}
