import Link from "next/link";
import type { Metadata } from "next";
import { Calculator, GitBranch, ArrowRight, BookOpen, Layers, Wrench } from "lucide-react";
import { BLOG_POSTS, CATEGORY_CONFIG } from "@/app/blog/posts";

export const metadata: Metadata = {
  title: "Resources — Covant",
  description:
    "Essays, program templates, and free tools for partner ops teams. Everything you need to evaluate, design, and run a partner program.",
  openGraph: {
    title: "Covant Resources",
    description:
      "Essays, templates, and tools for partner ops teams.",
  },
};

const TEMPLATES = [
  { slug: "saas-reseller", name: "SaaS Reseller Program", desc: "For B2B SaaS selling through 10–500 reseller partners. Deal reg protection, tiered commissions." },
  { slug: "referral-network", name: "Referral Network", desc: "Lightweight program for trusted partners who introduce deals. Flat payout on closed-won." },
  { slug: "technology-alliance", name: "Technology Alliance", desc: "ISV/tech alliances with co-sell motions and joint pipeline accountability." },
  { slug: "affiliate", name: "Affiliate Program", desc: "High-volume low-touch affiliate model with click-to-conversion tracking." },
  { slug: "co-sell", name: "Co-Sell Program", desc: "Structured co-sell with a hyperscaler or platform partner — joint accounts, shared quotas." },
];

const TOOLS = [
  { href: "/tools/commission-calculator", name: "Commission Calculator", desc: "Model partner commission rates by type and tier. Monthly and annual totals in 30 seconds.", time: "30 sec" },
  { href: "/tools/attribution-quiz", name: "Attribution Model Quiz", desc: "Six questions that tell you which attribution model fits your program.", time: "2 min" },
  { href: "/tools/partner-health", name: "Partner Health Scorecard", desc: "Grade your program across four dimensions — see where you're leaving revenue on the table.", time: "60 sec" },
];

const EVAL_RESOURCES = [
  {
    title: "ROI Calculator",
    description: "Estimate the revenue impact of automating your partner program. Time saved, revenue recovered, cost of manual ops.",
    href: "/roi",
    icon: Calculator,
    color: "#22c55e",
    tag: "Interactive",
  },
  {
    title: "Competitive Comparison",
    description: "How Covant stacks up against spreadsheets, legacy PRMs, and ecosystem tools. Feature-by-feature with honest positioning.",
    href: "/compare",
    icon: GitBranch,
    color: "#f59e0b",
    tag: "Analysis",
  },
];

export default function ResourcesPage() {
  const recentPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div className="r-page">
      {/* Header */}
      <div className="r-header">
        <p style={{ fontSize: ".8rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(129,140,248,.8)", marginBottom: ".75rem" }}>
          Resources
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
          Essays, templates, and tools for partner ops teams
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
          Everything you need to evaluate a partner tech stack, design a program that scales, and run it without spreadsheets.
        </p>
      </div>

      {/* Evaluation Resources */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <Layers size={18} style={{ color: "#818cf8" }} />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, letterSpacing: "-.01em" }}>Evaluate Covant</h2>
        </div>
        <div className="r-grid">
          {EVAL_RESOURCES.map((r) => {
            const Icon = r.icon;
            return (
              <Link key={r.href} href={r.href} className="r-card">
                <div className="r-card-top">
                  <div className="r-card-icon" style={{ background: `${r.color}18`, color: r.color }}>
                    <Icon size={22} />
                  </div>
                  <span className="r-card-tag" style={{ color: r.color, background: `${r.color}18` }}>{r.tag}</span>
                </div>
                <div>
                  <h3 className="r-card-title">{r.title}</h3>
                  <p className="r-card-desc">{r.description}</p>
                </div>
                <span className="r-card-link" style={{ color: r.color }}>
                  Explore <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Essays — recent from blog */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={18} style={{ color: "#22c55e" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, letterSpacing: "-.01em" }}>Recent essays</h2>
          </div>
          <Link href="/blog" style={{ fontSize: ".85rem", color: "#6b7280", textDecoration: "none", fontWeight: 600 }}>
            All {BLOG_POSTS.length} essays →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {recentPosts.map((post) => {
            const cat = CATEGORY_CONFIG[post.category];
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block", padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff", transition: "border-color .15s" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: "0.05em", color: cat.color, background: `${cat.color}18`, padding: "2px 8px", borderRadius: 4 }}>
                    {cat.label.toUpperCase()}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: ".75rem" }}>{post.readTime}</span>
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0a0a0a", margin: "0 0 6px", lineHeight: 1.3, letterSpacing: "-.01em" }}>{post.title}</h3>
                <p style={{ color: "#6b7280", fontSize: ".85rem", lineHeight: 1.5, margin: 0 }}>{post.description.slice(0, 140)}{post.description.length > 140 ? "…" : ""}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Templates */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Layers size={18} style={{ color: "#f59e0b" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, letterSpacing: "-.01em" }}>Program templates</h2>
          </div>
          <Link href="/templates" style={{ fontSize: ".85rem", color: "#6b7280", textDecoration: "none", fontWeight: 600 }}>
            All templates →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {TEMPLATES.map((t) => (
            <Link key={t.slug} href={`/templates/${t.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block", padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
              <h3 style={{ fontSize: ".95rem", fontWeight: 700, color: "#0a0a0a", margin: "0 0 6px", letterSpacing: "-.01em" }}>{t.name}</h3>
              <p style={{ color: "#6b7280", fontSize: ".85rem", lineHeight: 1.5, margin: 0 }}>{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Wrench size={18} style={{ color: "#0ea5e9" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, letterSpacing: "-.01em" }}>Free tools</h2>
          </div>
          <Link href="/tools" style={{ fontSize: ".85rem", color: "#6b7280", textDecoration: "none", fontWeight: 600 }}>
            All tools →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} style={{ textDecoration: "none", color: "inherit", display: "block", padding: "1.25rem 1.5rem", border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <h3 style={{ fontSize: ".95rem", fontWeight: 700, color: "#0a0a0a", margin: 0, letterSpacing: "-.01em" }}>{t.name}</h3>
                <span style={{ fontSize: ".7rem", color: "#9ca3af", fontWeight: 600 }}>{t.time}</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: ".85rem", lineHeight: 1.5, margin: 0 }}>{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="r-cta">
        <h2 className="r-cta-title">Ready to see it in action?</h2>
        <p className="r-cta-text">Try the live demo with real data — no signup required.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard?demo=true" className="btn" style={{ textDecoration: "none" }}>Try Live Demo</Link>
          <Link href="/contact" className="btn-outline" style={{ textDecoration: "none" }}>Talk to Us</Link>
        </div>
      </section>
    </div>
  );
}
