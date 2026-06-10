"use client";

import { MODEL_LABELS, type AttributionModel } from "@/lib/types";
import { useMeridianDemo } from "./MeridianProvider";

const MODELS = Object.keys(MODEL_LABELS) as AttributionModel[];

/** Segmented control for the five bounded models — the demo's main toggle. */
export default function ModelSelector() {
  const { model, setModel } = useMeridianDemo();
  return (
    <div className="d-seg" role="tablist" aria-label="Attribution model">
      {MODELS.map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={model === m}
          className={`d-seg-btn${model === m ? " is-active" : ""}`}
          onClick={() => setModel(m)}
        >
          {MODEL_LABELS[m]}
        </button>
      ))}
    </div>
  );
}
