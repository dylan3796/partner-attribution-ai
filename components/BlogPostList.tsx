"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘/ or Ctrl+/ to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const q = query.toLowerCase().trim();
  const byCategory = active === "all" ? posts : posts.filter((p) => p.category === active);
  const filtered = q
    ? byCategory.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      )
    : byCategory;

  const counts = {
    all: posts.length,
    ...Object.fromEntries(
      Object.keys(CATEGORY_CONFIG).map((k) => [k, posts.filter((p) => p.category === k).length])
    ),
  } as Record<string, number>;

  return (
    <>
      {/* Search Bar */}
      <div
        style={{
          position: "relative",
          marginBottom: 20,
        }}
      >
        <Search
          size={16}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: searchFocused ? "#888" : "#444",
            transition: "color 0.15s",
            pointerEvents: "none",
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search articles…"
          style={{
            width: "100%",
            background: searchFocused ? "#111" : "#0a0a0a",
            border: `1px solid ${searchFocused ? "#333" : "#1a1a1a"}`,
            borderRadius: 10,
            padding: "12px 80px 12px 40px",
            fontSize: ".9rem",
            color: "#e5e5e5",
            outline: "none",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
          }}
        />
        {query ? (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#222",
              border: "none",
              borderRadius: 4,
              padding: "3px 5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#888",
            }}
          >
            <X size={14} />
          </button>
        ) : (
          <kbd
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#1a1a1a",
              border: "1px solid #222",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: ".7rem",
              color: "#555",
              fontFamily: "inherit",
              pointerEvents: "none",
            }}
          >
            ⌘/
          </kbd>
        )}
      </div>

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

      {/* Search result count */}
      {q && filtered.length > 0 && (
        <p style={{ color: "#555", fontSize: ".82rem", marginBottom: 16, marginTop: -16 }}>
          {filtered.length} {filtered.length === 1 ? "article" : "articles"} matching &ldquo;{query}&rdquo;
        </p>
      )}

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
            <p style={{ color: "#444", fontSize: ".95rem" }}>
              {q
                ? `No articles matching "${query}"${active !== "all" ? ` in ${CATEGORY_CONFIG[active].label}` : ""}.`
                : "No articles in this category yet."}
            </p>
            {q && (
              <button
                onClick={() => { setQuery(""); setActive("all"); }}
                style={{
                  marginTop: 12,
                  background: "transparent",
                  border: "1px solid #222",
                  borderRadius: 6,
                  padding: "8px 16px",
                  color: "#888",
                  fontSize: ".85rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
