import Link from "next/link";
import type { Metadata } from "next";
import {
  Calculator, ClipboardCheck, GitBranch, BookOpen, FileText,
  ArrowRight, Sparkles, BarChart3, Code2, Layers, HelpCircle, LayoutTemplate,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Resources — Covant",
  description:
    "Tools, guides, and insights to help you build a world-class partner program. ROI calculator, program assessment, competitive analysis, API docs, and more.",
  openGraph: {
    title: "Covant Resources — Partner Program Tools & Guides",
    description:
      "Everything you need to evaluate, build, and scale your partner program.",
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

const TOOLS: Resource[] = [
  {
    title: "ROI Calculator",
    description:
      "Estimate the revenue impact of automating your partner program. Input your partners, deals, and commission rates — get a custom ROI projection.",
    href: "/roi",
    icon: Calculator,
    color: "#22c55e",
    tag: "Interactive",
    tagColor: "#22c55e",
  },
  {
    title: "Program Assessment",
    description:
      "8-question maturity quiz that scores your partner program across attribution, commissions, deal reg, and operations. Get personalized recommendations.",
    href: "/assessment",
    icon: ClipboardCheck,
    color: "#8b5cf6",
    tag: "Interactive",
    tagColor: "#8b5cf6",
  },
  {
    title: "Program Templates",
    description:
      "Pre-built blueprints for SaaS reseller, referral, tech alliance, affiliate, and co-sell programs. Commission structures, tier configs, and KPIs included.",
    href: "/templates",
    icon: LayoutTemplate,
    color: "#ec4899",
    tag: "Interactive",
    tagColor: "#ec4899",
  },
  {
    title: "Competitive Comparison",
    description:
      "See how Covant stacks up against spreadsheets, legacy PRMs, and ecosystem tools. Feature-by-feature breakdown with honest positioning.",
    href: "/compare",
    icon: GitBranch,
    color: "#f59e0b",
    tag: "Analysis",
    tagColor: "#f59e0b",
  },
];

const LEARN: Resource[] = [
  {
    title: "Customer Stories",
    description:
      "See how partner teams use Covant to automate attribution, scale programs, and eliminate spreadsheet chaos. Before/after results included.",
    href: "/customers",
    icon: Layers,
    color: "#f59e0b",
    tag: "Stories",
    tagColor: "#f59e0b",
  },
  {
    title: "Use Cases",
    description:
      "How VPs of Partnerships, RevOps leaders, and Partner Managers use Covant to solve real partner attribution and commission problems.",
    href: "/use-cases",
    icon: Layers,
    color: "#6366f1",
    tag: "Guide",
    tagColor: "#6366f1",
  },
  {
    title: "Help Center",
    description:
      "Step-by-step guides for every product workflow — setup, attribution, commissions, partner portal, reporting, and integrations.",
    href: "/help",
    icon: BookOpen,
    color: "#22c55e",
    tag: "Guide",
    tagColor: "#22c55e",
  },
  {
    title: "API Documentation",
    description:
      "REST API reference for partners, deals, commissions, attribution, and webhooks. Everything you need to integrate Covant into your stack.",
    href: "/docs",
    icon: Code2,
    color: "#3b82f6",
    tag: "Technical",
    tagColor: "#3b82f6",
  },
  {
    title: "Integrations",
    description:
      "Connect Salesforce, HubSpot, Stripe, Slack, and more. See what's available today and what's coming next.",
    href: "/integrations",
    icon: Sparkles,
    color: "#ec4899",
    tag: "Guide",
    tagColor: "#ec4899",
  },
];

const COMPANY: Resource[] = [
  {
    title: "Changelog",
    description:
      "Every feature, fix, and improvement we ship — with commit hashes. We move fast and document everything.",
    href: "/changelog",
    icon: FileText,
    color: "#6b7280",
    tag: "Updates",
    tagColor: "#6b7280",
  },
  {
    title: "FAQ",
    description:
      "24 answers to the most common questions about attribution, commissions, integrations, security, and pricing.",
    href: "/faq",
    icon: HelpCircle,
    color: "#818cf8",
    tag: "Help",
    tagColor: "#818cf8",
  },
  {
    title: "Glossary",
    description:
      "33 partner program terms defined — attribution models, commission rules, deal registration, PRM, and more.",
    href: "/glossary",
    icon: BookOpen,
    color: "#22c55e",
    tag: "Learn",
    tagColor: "#22c55e",
  },
  {
    title: "About Covant",
    description:
      "Why we built Covant, the problem we're solving, and our approach to partner intelligence.",
    href: "/about",
    icon: BookOpen,
    color: "#14b8a6",
    tag: "Company",
    tagColor: "#14b8a6",
  },
  {
    title: "Pricing",
    description:
      "Free tier with Partner Portal. Add AI engines individually or bundled — Starter, Growth, and Scale tiers for every team size.",
    href: "/pricing",
    icon: BarChart3,
    color: "#f97316",
    tag: "Plans",
    tagColor: "#f97316",
  },
];

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = resource.icon;
  return (
    <Link
      href={resource.href}
      style={{
        display: "block",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius)",
        padding: "1.75rem",
        textDecoration: "none",
        transition: "transform .2s, box-shadow .2s, border-color .2s",
      }}
      className="card-hover"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${resource.color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={resource.color} />
        </div>
        <span
          style={{
            fontSize: ".65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".06em",
            color: resource.tagColor,
            background: `${resource.tagColor}18`,
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          {resource.tag}
        </span>
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>{resource.title}</h3>
      <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>
        {resource.description}
      </p>
      <span
        style={{
          fontSize: ".8rem",
          fontWeight: 600,
          color: resource.color,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        Explore <ArrowRight size={12} />
      </span>
    </Link>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-.01em" }}>{title}</h2>
      <p style={{ fontSize: ".9rem", color: "var(--muted)", marginTop: 4 }}>{subtitle}</p>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem 2rem 4rem" }}>
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
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            marginBottom: "1rem",
          }}
        >
          Everything you need to build a
          <br />
          world-class partner program
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Interactive tools, technical docs, and guides — whether you&apos;re evaluating
          Covant or scaling your existing program.
        </p>
      </div>

      {/* Featured: Tools */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeader title="Interactive Tools" subtitle="Hands-on calculators and assessments to evaluate your program" />
        <div className="grid-3" style={{ gap: "1.25rem" }}>
          {TOOLS.map((r) => (
            <ResourceCard key={r.href} resource={r} />
          ))}
        </div>
      </section>

      {/* Learn */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeader title="Learn" subtitle="Guides, docs, and use cases for every role" />
        <div className="grid-3" style={{ gap: "1.25rem" }}>
          {LEARN.map((r) => (
            <ResourceCard key={r.href} resource={r} />
          ))}
        </div>
      </section>

      {/* Company */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeader title="Company" subtitle="Plans, updates, and what drives us" />
        <div className="grid-3" style={{ gap: "1.25rem" }}>
          {COMPANY.map((r) => (
            <ResourceCard key={r.href} resource={r} />
          ))}
        </div>
      </section>

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
