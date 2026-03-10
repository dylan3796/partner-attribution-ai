import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { BLOG_POSTS, CATEGORY_CONFIG } from "../posts";
import { ARTICLE_CONTENT } from "./content";
import type { Metadata } from "next";
import ShareButtons from "./ShareButtons";
import BlogSubscribe from "@/components/BlogSubscribe";
import ReadingProgressBar from "@/components/ReadingProgressBar";

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
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Covant"],
      url: `https://covant.ai/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function getAdjacentPosts(currentSlug: string) {
  const idx = BLOG_POSTS.findIndex((p) => p.slug === currentSlug);
  return {
    prev: idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null,
    next: idx > 0 ? BLOG_POSTS[idx - 1] : null,
  };
}

function getRelatedPosts(currentSlug: string, currentCategory: string) {
  // Prefer same category, then fill with other categories
  const sameCat = BLOG_POSTS.filter(
    (p) => p.slug !== currentSlug && p.category === currentCategory
  );
  const diffCat = BLOG_POSTS.filter(
    (p) => p.slug !== currentSlug && p.category !== currentCategory
  );
  const related = [...sameCat, ...diffCat];
  return related.slice(0, 3);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = ARTICLE_CONTENT[slug];
  if (!content) notFound();

  const cat = CATEGORY_CONFIG[post.category];
  const relatedPosts = getRelatedPosts(slug, post.category);
  const { prev, next } = getAdjacentPosts(slug);
  const headings = content.filter((s) => s.heading).map((s) => s.heading!);

  // Article JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Covant",
      url: "https://covant.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "Covant",
      url: "https://covant.ai",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://covant.ai/blog/${slug}`,
    },
    articleSection: cat.label,
    url: `https://covant.ai/blog/${slug}`,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <ReadingProgressBar />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
          Covant.ai
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
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
          <p style={{ color: "#666", fontSize: ".95rem", lineHeight: 1.6, marginTop: 16 }}>
            {post.description}
          </p>
        </div>

        {/* Table of Contents */}
        {headings.length >= 3 && (
          <div style={{
            borderTop: "1px solid #1a1a1a",
            borderBottom: "1px solid #1a1a1a",
            padding: "24px 0",
            marginBottom: 48,
          }}>
            <p style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 12 }}>
              In this article
            </p>
            <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
              {headings.map((h, i) => (
                <li key={i} style={{ color: "#777", fontSize: ".85rem", lineHeight: 1.5 }}>
                  {h}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Body */}
        <div className="blog-content" style={{ paddingBottom: 48 }}>
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

        {/* Share */}
        <div style={{ borderTop: "1px solid #1a1a1a", padding: "32px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "#555", fontSize: ".85rem", fontWeight: 600, margin: 0 }}>Share this article</p>
          <ShareButtons slug={slug} title={post.title} />
        </div>

        {/* Newsletter Subscribe */}
        <BlogSubscribe variant="inline" />

        {/* CTA */}
        <div style={{ borderTop: "1px solid #1a1a1a", padding: "48px 0", textAlign: "center" }}>
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

        {/* Previous / Next Article */}
        {(prev || next) && (
          <div style={{
            borderTop: "1px solid #1a1a1a",
            padding: "32px 0",
            display: "grid",
            gridTemplateColumns: prev && next ? "1fr 1fr" : "1fr",
            gap: 16,
          }}>
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  textDecoration: "none",
                  padding: "16px 20px",
                  border: "1px solid #1a1a1a",
                  borderRadius: 10,
                  transition: "border-color 0.2s",
                }}
              >
                <ChevronLeft size={18} style={{ color: "#555", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <span style={{ fontSize: ".7rem", fontWeight: 600, letterSpacing: "0.06em", color: "#444", textTransform: "uppercase" }}>
                    Previous
                  </span>
                  <p style={{ fontSize: ".85rem", fontWeight: 600, color: "#ccc", margin: "4px 0 0", lineHeight: 1.3 }}>
                    {prev.title}
                  </p>
                </div>
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  textDecoration: "none",
                  padding: "16px 20px",
                  border: "1px solid #1a1a1a",
                  borderRadius: 10,
                  textAlign: "right",
                  justifyContent: "flex-end",
                  transition: "border-color 0.2s",
                  gridColumn: !prev ? "1" : undefined,
                }}
              >
                <div>
                  <span style={{ fontSize: ".7rem", fontWeight: 600, letterSpacing: "0.06em", color: "#444", textTransform: "uppercase" }}>
                    Next
                  </span>
                  <p style={{ fontSize: ".85rem", fontWeight: 600, color: "#ccc", margin: "4px 0 0", lineHeight: 1.3 }}>
                    {next.title}
                  </p>
                </div>
                <ChevronRight size={18} style={{ color: "#555", flexShrink: 0, marginTop: 2 }} />
              </Link>
            )}
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div style={{ borderTop: "1px solid #1a1a1a", padding: "48px 0 80px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>
              Keep reading
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {relatedPosts.map((rp) => {
                const rpCat = CATEGORY_CONFIG[rp.category];
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      border: "1px solid #1a1a1a",
                      borderRadius: 10,
                      padding: 20,
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={undefined}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{
                        fontSize: ".65rem", fontWeight: 700, letterSpacing: "0.05em", color: rpCat.color,
                        background: `${rpCat.color}18`, padding: "2px 8px", borderRadius: 3,
                      }}>
                        {rpCat.label.toUpperCase()}
                      </span>
                      <span style={{ color: "#444", fontSize: ".75rem" }}>{rp.readTime}</span>
                    </div>
                    <h4 style={{ fontSize: ".9rem", fontWeight: 700, color: "#ccc", margin: "0 0 6px", lineHeight: 1.3 }}>
                      {rp.title}
                    </h4>
                    <p style={{ fontSize: ".8rem", color: "#555", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {rp.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
