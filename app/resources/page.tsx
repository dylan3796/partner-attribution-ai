import Link from "next/link";
import type { Metadata } from "next";
import { Calculator, GitBranch, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources — Covant",
  description:
    "Tools to help you evaluate and build your partner program. ROI calculator and competitive analysis.",
  openGraph: {
    title: "Covant Resources",
    description:
      "ROI calculator and competitive breakdown for partner program evaluation.",
  },
};

type Resource = {
  title: string;
  description: string;
  href: string;
  icon: typeof Calculator;
  color: string;
  tag: string;
  tagColor: string;
};

const RESOURCES: Resource[] = [
  {
    title: "ROI Calculator",
    description:
      "Estimate the revenue impact of automating your partner program. Input your partners, deals, and commission rates — get a custom ROI projection showing time saved, revenue recovered, and cost of manual ops.",
    href: "/roi",
    icon: Calculator,
    color: "#22c55e",
    tag: "Interactive",
    tagColor: "#22c55e",
  },
  {
    title: "Competitive Comparison",
    description:
      "See how Covant stacks up against spreadsheets, legacy PRMs, and ecosystem tools. Feature-by-feature breakdown across attribution, commissions, partner portal, AI capabilities, and pricing — with honest positioning.",
    href: "/compare",
    icon: GitBranch,
    color: "#f59e0b",
    tag: "Analysis",
    tagColor: "#f59e0b",
  },
];

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = resource.icon;
  return (
    <Link href={resource.href} className="r-card">
      <div className="r-card-top">
        <div
          className="r-card-icon"
          style={{ background: `${resource.color}18`, color: resource.color }}
        >
          <Icon size={22} />
        </div>
        <span
          className="r-card-tag"
          style={{ color: resource.tagColor, background: `${resource.tagColor}18` }}
        >
          {resource.tag}
        </span>
      </div>
      <div>
        <h3 className="r-card-title">{resource.title}</h3>
        <p className="r-card-desc">{resource.description}</p>
      </div>
      <span className="r-card-link" style={{ color: resource.color }}>
        Explore <ArrowRight size={12} />
      </span>
    </Link>
  );
}

export default function ResourcesPage() {
  return (
    <div className="r-page">
      {/* Header */}
      <div className="r-header">
        <p
          style={{
            fontSize: ".8rem",
            fontWeight: 600,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "rgba(129,140,248,.8)",
            marginBottom: ".75rem",
          }}
        >
          Resources
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            marginBottom: "1rem",
          }}
        >
          Tools to evaluate and win
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          An ROI calculator and a competitive breakdown — the two things you actually need before making a call.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="r-grid">
        {RESOURCES.map((r) => (
          <ResourceCard key={r.href} resource={r} />
        ))}
      </div>

      {/* CTA */}
      <section className="r-cta">
        <h2 className="r-cta-title">Ready to see it in action?</h2>
        <p className="r-cta-text">
          Try the live demo with real data — no signup required.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/demo" className="btn" style={{ textDecoration: "none" }}>
            Try Live Demo
          </Link>
          <Link href="/contact" className="btn-outline" style={{ textDecoration: "none" }}>
            Talk to Us
          </Link>
        </div>
      </section>
    </div>
  );
}
