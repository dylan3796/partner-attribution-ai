import Link from "next/link";

export default function SignInPage() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#f9fafb", padding: "2rem",
      fontFamily: "var(--font-inter), Inter, sans-serif",
    }}>
      <div style={{ maxWidth: 440, textAlign: "center" }}>
        <h1 style={{ color: "#0a0a0a", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: ".5rem" }}>
          Covant is in private beta.
        </h1>
        <p style={{ color: "#6b7280", fontSize: ".95rem", marginBottom: "2rem", lineHeight: 1.5 }}>
          Sign-in is temporarily disabled while we finalize our auth setup. Existing customers — we&apos;ll reach out with access details shortly.
        </p>

        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}>
          <Link href="/" style={{
            padding: "12px 20px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff",
            color: "#0a0a0a", fontWeight: 600, fontSize: ".9rem", textDecoration: "none",
          }}>
            Back to homepage
          </Link>
          <Link href="/sign-up" style={{
            padding: "12px 20px", borderRadius: 10, border: "none", background: "#0a0a0a",
            color: "#fff", fontWeight: 700, fontSize: ".9rem", textDecoration: "none",
          }}>
            Request access →
          </Link>
        </div>
      </div>
    </div>
  );
}
