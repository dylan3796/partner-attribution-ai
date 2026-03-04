import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { BLOG_POSTS, CATEGORY_CONFIG } from "../posts";
import { ARTICLE_CONTENT } from "./content";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Covant Blog`,
    description: post.description,
    openGraph: { title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = ARTICLE_CONTENT[slug];
  if (!content) notFound();

  const cat = CATEGORY_CONFIG[post.category];

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
          covant
        </Link>
        <Link href="/beta" style={{ color: "#000", background: "#fff", fontSize: "0.85rem", textDecoration: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 600 }}>
          Join Beta
        </Link>
      </nav>

      <article style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ padding: "64px 0 48px" }}>
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#555", fontSize: ".85rem", textDecoration: "none", marginBottom: 24 }}>
            <ArrowLeft size={14} /> All posts
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{
              fontSize: ".7rem", fontWeight: 700, letterSpacing: "0.05em", color: cat.color,
              background: `${cat.color}18`, padding: "3px 10px", borderRadius: 4,
            }}>
              {cat.label.toUpperCase()}
            </span>
            <span style={{ color: "#444", fontSize: ".8rem" }}>{post.date}</span>
            <span style={{ color: "#333", fontSize: ".8rem" }}>·</span>
            <span style={{ color: "#444", fontSize: ".8rem" }}>{post.readTime}</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.2, margin: 0 }}>
            {post.title}
          </h1>
        </div>

        {/* Body */}
        <div className="blog-content" style={{ paddingBottom: 64 }}>
          {content.map((section, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              {section.heading && (
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j} style={{ color: "#999", fontSize: ".95rem", lineHeight: 1.8, margin: "0 0 16px" }}>
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul style={{ margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {section.bullets.map((b, k) => (
                    <li key={k} style={{ color: "#888", fontSize: ".9rem", lineHeight: 1.6 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ borderTop: "1px solid #1a1a1a", padding: "48px 0 80px", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
            Ready to fix partner attribution?
          </h3>
          <p style={{ color: "#555", fontSize: ".9rem", marginBottom: 24 }}>
            Covant automates attribution, commissions, and payouts. Join the beta.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/beta" style={{
              display: "inline-block", background: "#fff", color: "#000",
              padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: ".9rem", textDecoration: "none",
            }}>
              Request Access →
            </Link>
            <Link href="/product" style={{
              display: "inline-block", border: "1px solid #333", color: "#999",
              padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none",
            }}>
              See the product
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
