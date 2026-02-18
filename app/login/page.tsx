"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          padding: "2.5rem",
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          borderRadius: 16,
        }}
      >
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-.02em",
            }}
          >
            Covant
          </span>
          <p style={{ color: "#555", fontSize: ".85rem", marginTop: ".4rem" }}>
            Sign in to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: ".8rem", color: "#666", marginBottom: ".4rem" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoFocus
              style={{
                width: "100%",
                padding: ".75rem 1rem",
                background: "#111",
                border: `1px solid ${error ? "#dc2626" : "#222"}`,
                borderRadius: 10,
                color: "#fff",
                fontSize: ".95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ color: "#dc2626", fontSize: ".78rem", marginTop: ".4rem" }}>{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: ".875rem",
              background: loading || !password ? "#1a1a1a" : "#fff",
              color: loading || !password ? "#444" : "#000",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: ".9rem",
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "all .2s",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".78rem", color: "#333" }}>
          Covant Early Access
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
