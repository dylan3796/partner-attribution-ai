"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DemoPage() {
  const router = useRouter();
  const seedDemo = useMutation(api.seedDemo.seedDemoData);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    seedDemo({})
      .catch(() => { /* already seeded — that's fine */ })
      .finally(() => router.replace("/dashboard"));
  }, [seedDemo, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid #222",
          borderTop: "3px solid #6366f1",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
          Loading your demo…
        </p>
        <p style={{ fontSize: ".85rem", color: "#64748b", margin: "0.25rem 0 0" }}>
          Seeding partners, deals, and attribution data
        </p>
      </div>
    </div>
  );
}
