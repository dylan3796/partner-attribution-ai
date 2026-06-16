"use client";

import { useEffect, useRef, useState } from "react";
import ChannelGraph from "@/components/marketing/ChannelGraph";

/**
 * Hero centerpiece: the Channel Graph quietly reorganizing on a slow loop.
 * Cycles through a few of the graph's own states so edges light up and nodes
 * regroup — alive but restrained. Honors prefers-reduced-motion (holds the
 * organized state) and pauses while the tab is hidden.
 */
const CYCLE = [2, 3, 4, 5, 6];

export default function HeroGraph() {
  const [active, setActive] = useState(2);
  const idx = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setActive(2);
      return;
    }
    const id = setInterval(() => {
      if (document.hidden) return;
      idx.current = (idx.current + 1) % CYCLE.length;
      setActive(CYCLE[idx.current]);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  return <ChannelGraph activeSection={active} />;
}
