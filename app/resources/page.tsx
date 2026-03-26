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
    <Link
      href={resource.href}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius)",
        padding: "1.75rem",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color .15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${resource.color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: resource.color,
          }}
        >
          <Icon size={22} />
        </div>
        <span
          style={{
            fontSize: ".72rem",
            fontWeight: 700,
            color: resource.tagColor,
            background: `${resource.tagColor}18`,
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          {resource.tag}
        </span>
      </div>
      <div>
        <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: ".5rem" }}>
          {resource.title}
        </h3>
        <p style={{ fontSize: ".88rem", color: "var(--muted)", lineHeight: 1.65 }}>
          {resource.description}
        </p>
      </div>
      <span
        style={{
          fontSize: ".8rem",
          fontWeight: 600,
          color: resource.color,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          marginTop: "auto",
        }}
      >
        Explore <ArrowRight size={12} />
      </span>
    </Link>
  );
}

export default function ResourcesPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "6rem 2rem 4rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {RESOURCES.map((r) => (
          <ResourceCard key={r.href} resource={r} />
        ))}
      </div>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius)",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>
          Ready to see it in action?
        </h2>
        <p style={{ color: "var(--muted)", fontSize: ".95rem", marginBottom: "1.5rem" }}>
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
