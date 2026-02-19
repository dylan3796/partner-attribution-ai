import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function computeToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", enc.encode("covant:" + password));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function loginAction(formData: FormData) {
  "use server";
  const password = (formData.get("password") as string) ?? "";
  const next = (formData.get("next") as string) || "/dashboard";
  const expected = process.env.DASHBOARD_PASSWORD?.trim() ?? "";

  if (!expected || password.trim() !== expected) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await computeToken(expected);
  const cookieStore = await cookies();
  cookieStore.set("pb_auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(next);
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";
  const next = params.next ?? "/dashboard";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          padding: "2rem",
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          borderRadius: 16,
        }}
      >
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>
            Covant
          </span>
          <p style={{ color: "#555", fontSize: ".85rem", marginTop: ".4rem" }}>
            Sign in to your dashboard
          </p>
        </div>

        <form action={loginAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="hidden" name="next" value={next} />

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: ".8rem", color: "#666", marginBottom: ".4rem" }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: ".75rem 1rem",
                background: "#111",
                border: `1px solid ${hasError ? "#dc2626" : "#222"}`,
                borderRadius: 10,
                color: "#fff",
                fontSize: ".95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {hasError && (
              <p style={{ color: "#dc2626", fontSize: ".78rem", marginTop: ".4rem" }}>
                Incorrect password.
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              padding: ".875rem",
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: ".9rem",
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".78rem", color: "#333" }}>
          Covant Early Access
        </p>
      </div>
    </div>
  );
}
