"use client";

import { createContext, useContext, useState } from "react";
import type { AttributionModel } from "@/lib/types";

/**
 * Demo-wide state: the attribution lens currently selected in the topbar.
 * The demo never touches Convex or the app store — everything derives from
 * lib/meridian/* and this one piece of UI state.
 */
type MeridianDemoState = {
  model: AttributionModel;
  setModel: (model: AttributionModel) => void;
};

const MeridianDemoContext = createContext<MeridianDemoState | null>(null);

export function MeridianProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<AttributionModel>("first_touch_sourcer");
  return (
    <MeridianDemoContext.Provider value={{ model, setModel }}>
      {children}
    </MeridianDemoContext.Provider>
  );
}

export function useMeridianDemo(): MeridianDemoState {
  const ctx = useContext(MeridianDemoContext);
  if (!ctx) throw new Error("useMeridianDemo must be used inside MeridianProvider");
  return ctx;
}
