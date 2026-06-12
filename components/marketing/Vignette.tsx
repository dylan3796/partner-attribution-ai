"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a product shot and plays its in-card vignette once — bars filling,
 * rows landing, toasts popping — when roughly a third of it is visible.
 * Children opt in via data-vig / .m-vig-bar / .m-vig-pop (globals.css);
 * prefers-reduced-motion is honored by the global media query.
 */
export default function Vignette({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setPlayed(true), 0);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlayed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`m-vig${played ? " is-played" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
