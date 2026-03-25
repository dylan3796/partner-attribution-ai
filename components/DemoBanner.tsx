"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

function DemoBannerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth();
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

  useEffect(() => {
    const wasDismissed = localStorage.getItem("covant_demo_banner_dismissed");
    setDismissed(!!wasDismissed);
  }, []);

  // Don't show on auth or onboarding pages
  if (
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up") ||
    pathname?.startsWith("/onboard") ||
    pathname?.startsWith("/setup")
  ) {
    return null;
  }

  // Show when:
  // 1. URL contains ?demo=true, OR
  // 2. User is not signed in and is on a /dashboard route
  const isDemoMode = searchParams?.get("demo") === "true";
  const isDashboard = pathname?.startsWith("/dashboard");
  const shouldShow = isDemoMode || (isLoaded && !isSignedIn && isDashboard);

  if (!shouldShow || dismissed) {
    return null;
  }

  function handleDismiss() {
    localStorage.setItem("covant_demo_banner_dismissed", "true");
    setDismissed(true);
  }

  return (
    <div style={{
      background: "#0a0a0a",
      color: "#ffffff",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.85rem",
      position: "relative",
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span>🚀</span>
        <span>You&apos;re exploring Covant with sample data.</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link
          href="/sign-up"
          style={{
            color: "#ffffff",
            fontWeight: 600,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Create your free account <span>→</span>
        </Link>
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function DemoBanner() {
  return (
    <Suspense fallback={null}>
      <DemoBannerInner />
    </Suspense>
  );
}
