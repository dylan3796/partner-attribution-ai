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

  if (!shouldShow) {
    return null;
  }

  function handleDismiss() {
    localStorage.setItem("covant_demo_banner_dismissed", "true");
    setDismissed(true);
  }

  // After dismissal, show a compact persistent indicator instead of hiding completely
  if (dismissed) {
    return (
      <div className="demo-badge-bar">
        <span className="demo-badge-pill">Demo mode</span>
        <Link href="/sign-up" className="demo-badge-link">
          Create account <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="demo-banner">
      <div className="demo-banner-left">
        <span className="demo-banner-icon">&#x1F680;</span>
        <span>You&apos;re exploring Covant with sample data.</span>
      </div>
      <div className="demo-banner-right">
        <Link href="/sign-up" className="demo-banner-cta">
          Create your free account <span>→</span>
        </Link>
        <button
          onClick={handleDismiss}
          className="demo-banner-close"
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
