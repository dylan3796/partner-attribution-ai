"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPost, CATEGORY_CONFIG } from "@/app/blog/posts";

const ALL_CATEGORIES = [
  { key: "all" as const, label: "All", color: "#fff" },
  ...Object.entries(CATEGORY_CONFIG).map(([key, val]) => ({
    key: key as BlogPost["category"],
    label: val.label,
    color: val.color,
  })),
];

export default function BlogPostList({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState<"all" | BlogPost["category"]>("all");

  const filtered = active === "all" ? posts : posts.filter((p) => p.category === active);

  const counts = {
    all: posts.length,
    ...Object.fromEntries(
      Object.keys(CATEGORY_CONFIG).map((k) => [k, posts.filter((p) => p.category === k).length])
    ),
  } as Record<string, number>;

  return (
    <>
      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          paddingBottom: 32,
        }}
      >
        {ALL_CATEGORIES.map((cat) => {
          const isActive = active === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              style={{
                background: isActive ? (cat.key === "all" ? "#fff" : `${cat.color}20`) : "transparent",
                color: isActive ? (cat.key === "all" ? "#000" : cat.color) : "#555",
                border: `1px solid ${isActive ? (cat.key === "all" ? "#fff" : `${cat.color}40`) : "#222"}`,
                borderRadius: 20,
                padding: "7px 16px",
                fontSize: ".82rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
                letterSpacing: "-0.01em",
              }}
            >
              {cat.label}
              <span
                style={{
                  fontSize: ".72rem",
                  opacity: isActive ? 0.8 : 0.5,
                  fontWeight: 600,
                }}
              >
                {counts[cat.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingBottom: 80 }}>
        {filtered.map((post, i) => {
          const cat = CATEGORY_CONFIG[post.category];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                padding: "36px 0",
                borderTop: i === 0 ? "1px solid #1a1a1a" : "none",
                borderBottom: "1px solid #1a1a1a",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: ".7rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    color: cat.color,
                    background: `${cat.color}18`,
                    padding: "3px 10px",
                    borderRadius: 4,
                  }}
                >
                  {cat.label.toUpperCase()}
                </span>
                <span style={{ color: "#444", fontSize: ".8rem" }}>{post.date}</span>
                <span style={{ color: "#333", fontSize: ".8rem" }}>·</span>
                <span style={{ color: "#444", fontSize: ".8rem" }}>{post.readTime}</span>
              </div>
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 8px",
                  letterSpacing: "-0.02em",
                }}
              >
                {post.title}
              </h2>
              <p style={{ color: "#666", fontSize: ".95rem", lineHeight: 1.6, margin: "0 0 12px" }}>
                {post.description}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#888",
                  fontSize: ".85rem",
                  fontWeight: 500,
                }}
              >
                Read more <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ color: "#444", fontSize: ".95rem" }}>No articles in this category yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
