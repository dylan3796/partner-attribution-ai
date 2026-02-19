import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
        <div style={{ fontSize: "6rem", fontWeight: 800, color: "#1a1a1a", lineHeight: 1, marginBottom: "1rem" }}>404</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: ".75rem" }}>Page not found</h1>
        <p style={{ color: "#666", marginBottom: "2rem", lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, background: "#fff", color: "#000", fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
            ← Home
          </Link>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid #333", color: "#999", fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid #333", color: "#999", fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
            API Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
