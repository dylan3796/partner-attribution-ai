import type React from "react";

export function MockWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="l-mock-window">
      <div className="l-mock-titlebar">
        <div className="l-mock-dots">
          <div className="l-mock-dot" />
          <div className="l-mock-dot" />
          <div className="l-mock-dot" />
        </div>
        <span className="l-mock-title">{title}</span>
      </div>
      <div className="l-mock-body">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="l-stat-card">
      <div className="l-stat-card-label">{label}</div>
      <div className="l-stat-card-value">{value}</div>
      <div className="l-stat-card-trend">{trend}</div>
    </div>
  );
}

export function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className="l-badge-inline" style={{ background: `${color}20`, color }}>
      {text}
    </span>
  );
}

export function TourSection({
  id, step, title, subtitle, description, children, reverse,
}: {
  id: string; step: string; title: string; subtitle: string; description: string; children: React.ReactNode; reverse?: boolean;
}) {
  return (
    <section id={id} className="l-tour-section">
      <div className="l-tour-grid">
        <div style={{ order: reverse ? 2 : 1 }}>
          <div className="l-tour-step">{step}</div>
          <h2 className="l-tour-title">{title}</h2>
          <p className="l-tour-subtitle">{subtitle}</p>
          <p className="l-tour-desc">{description}</p>
        </div>
        <div style={{ order: reverse ? 1 : 2 }}>{children}</div>
      </div>
    </section>
  );
}
