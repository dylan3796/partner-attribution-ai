"use client";

import { useEffect, useRef, useState } from "react";
import { getKpis } from "@/lib/meridian/selectors";
import { useMeridianDemo } from "./MeridianProvider";
import { fmtMoney } from "./format";

/** Eases a number toward its target on change so model switches feel live. */
function useCountUp(target: number): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const duration = 350;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      setValue(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

export default function KpiCards() {
  const { model } = useMeridianDemo();
  const kpis = getKpis(model);
  const sourced = useCountUp(kpis.sourcedArr);
  const multi = useCountUp(kpis.multiPartnerDeals);

  return (
    <div className="d-kpis">
      <div className="d-card">
        <p className="d-kpi-label">Partner-influenced ARR</p>
        <p className="d-kpi-value">{fmtMoney(kpis.influencedArr)}</p>
        <p className="d-kpi-sub">won deals, trailing 12 months</p>
      </div>
      <div className="d-card">
        <p className="d-kpi-label">Sourced ARR</p>
        <p className="d-kpi-value">{fmtMoney(sourced)}</p>
        <p className="d-kpi-sub">credited to sourcers under this lens</p>
      </div>
      <div className="d-card">
        <p className="d-kpi-label">Multi-partner deals</p>
        <p className="d-kpi-value">{Math.round(multi)}</p>
        <p className="d-kpi-sub">won deals this lens credits to 2+ partners</p>
      </div>
      <div className="d-card">
        <p className="d-kpi-label">Active partners</p>
        <p className="d-kpi-value">{kpis.activePartners}</p>
        <p className="d-kpi-sub">touched a deal in the last 90 days</p>
      </div>
    </div>
  );
}
