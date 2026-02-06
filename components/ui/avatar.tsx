"use client";

import { cn, getInitials, CHART_COLORS } from "@/lib/utils";

type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const colorIndex = hashCode(name) % CHART_COLORS.length;
  const color = CHART_COLORS[colorIndex];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}
