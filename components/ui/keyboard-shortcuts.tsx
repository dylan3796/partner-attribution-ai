"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Global keyboard shortcuts for the dashboard.
 * 
 * Shortcuts:
 *   g d — Go to Dashboard
 *   g p — Go to Partners  
 *   g l — Go to Deals
 *   g r — Go to Reports
 *   g a — Go to Activity
 *   g s — Go to Settings
 *   g o — Go to Payouts
 *   g c — Go to Scoring
 *   ? — Show shortcuts help (console)
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/dashboard")) return;

    let pending = "";
    let timeout: NodeJS.Timeout;

    function handleKeyDown(e: KeyboardEvent) {
      // Skip if typing in an input/textarea/select
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Clear pending after 1 second of no input
      clearTimeout(timeout);
      timeout = setTimeout(() => { pending = ""; }, 1000);

      if (pending === "g") {
        pending = "";
        switch (e.key) {
          case "d": router.push("/dashboard"); break;
          case "p": router.push("/dashboard/partners"); break;
          case "l": router.push("/dashboard/deals"); break;
          case "r": router.push("/dashboard/reports"); break;
          case "a": router.push("/dashboard/activity"); break;
          case "s": router.push("/dashboard/settings"); break;
          case "o": router.push("/dashboard/payouts"); break;
          case "c": router.push("/dashboard/scoring"); break;
        }
        return;
      }

      if (e.key === "g") {
        pending = "g";
        return;
      }

      if (e.key === "?") {
        console.log(
          "%c⌨️ Keyboard Shortcuts",
          "font-weight:bold;font-size:14px",
          "\n\ng d → Dashboard\ng p → Partners\ng l → Deals\ng r → Reports\ng a → Activity\ng s → Settings\ng o → Payouts\ng c → Scoring"
        );
      }

      pending = "";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeout);
    };
  }, [router, pathname]);

  return null;
}
