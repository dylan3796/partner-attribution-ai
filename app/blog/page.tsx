import Link from "next/link";
import { ArrowLeft, Rss } from "lucide-react";
import { BLOG_POSTS } from "./posts";
import BlogSubscribe from "@/components/BlogSubscribe";
import BlogPostList from "@/components/BlogPostList";

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
          Covant.ai
        </Link>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/resources" style={{ color: "#888", fontSize: "0.85rem", textDecoration: "none" }}>Resources</Link>
          <Link href="/beta" style={{ color: "#000", background: "#fff", fontSize: "0.85rem", textDecoration: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 600 }}>
            Join Beta
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ padding: "80px 0 48px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#555", fontSize: ".85rem", textDecoration: "none", marginBottom: 16 }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 16px" }}>
            Blog
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <p style={{ color: "#555", fontSize: "1.1rem", lineHeight: 1.6, maxWidth: 560, margin: 0 }}>
              Practical insights on partner attribution, commission ops, and building programs that scale.
            </p>
            <a
              href="/blog/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              title="RSS Feed"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #222",
                color: "#666",
                fontSize: ".78rem",
                fontWeight: 500,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <Rss size={13} /> RSS
            </a>
          </div>
        </div>

        {/* Filtered Post List */}
        <BlogPostList posts={BLOG_POSTS} />

        {/* Newsletter Subscribe */}
        <div style={{ padding: "48px 0 24px", borderTop: "1px solid #111" }}>
          <BlogSubscribe variant="card" />
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "32px 0 80px" }}>
          <p style={{ color: "#555", fontSize: ".95rem", marginBottom: 20 }}>
            Building a partner program? Join the beta and see Covant in action.
          </p>
          <Link href="/beta" style={{
            display: "inline-block", background: "#fff", color: "#000",
            padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: ".9rem", textDecoration: "none",
          }}>
            Request Beta Access →
          </Link>
        </div>
      </div>
    </div>
  );
}
