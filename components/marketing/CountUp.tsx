"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Number that counts up to its final value once, when it scrolls into view.
 * Server-renders the final value, so no-JS and reduced-motion readers see
 * the finished number; `delay` lets it sync with a surrounding vignette.
 */
export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 900,
  delay = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          timer = setTimeout(() => {
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(to * eased));
              if (t < 1) raf = requestAnimationFrame(tick);
            };
            setValue(0);
            raf = requestAnimationFrame(tick);
          }, delay);
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [to, duration, delay]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
