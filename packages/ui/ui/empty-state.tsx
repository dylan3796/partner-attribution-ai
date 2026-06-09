"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  configHint?: string;
};

export function EmptyState({ icon: Icon, title, description, action, configHint }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} color="var(--muted)" />
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: ".25rem" }}>{title}</h3>
      <p className="muted" style={{ maxWidth: 320, marginBottom: action || configHint ? "1rem" : 0 }}>{description}</p>
      {configHint && (
        <Link
          href="/dashboard/settings#platform-config"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            fontSize: ".8rem",
            fontWeight: 500,
            color: "#6366f1",
            padding: ".4rem .8rem",
            background: "#eef2ff",
            borderRadius: 6,
            marginBottom: action ? ".75rem" : 0,
          }}
        >
          ⚙️ {configHint}
        </Link>
      )}
      {action}
    </div>
  );
}
