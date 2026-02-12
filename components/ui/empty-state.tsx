"use client";

import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} color="var(--muted)" />
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: ".25rem" }}>{title}</h3>
      <p className="muted" style={{ maxWidth: 320, marginBottom: action ? "1rem" : 0 }}>{description}</p>
      {action}
    </div>
  );
}
