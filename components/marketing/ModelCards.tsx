"use client";

import { useState } from "react";
import { MODELS } from "@/lib/marketing";

/** The five bounded models as expandable cards: the line, then when to use it. */
export default function ModelCards() {
  const [openId, setOpenId] = useState<string | null>("role_weighted");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
      {MODELS.map((model) => {
        const isOpen = openId === model.id;
        return (
          <button
            key={model.id}
            type="button"
            className={`m-model-card${isOpen ? " is-open" : ""}`}
            aria-expanded={isOpen}
            onClick={() => setOpenId(isOpen ? null : model.id)}
          >
            <div className="m-model-card-head">
              <div>
                <h3 className="m-h3" style={{ marginBottom: ".35rem" }}>
                  {model.label}
                </h3>
                <p className="m-body">{model.line}</p>
              </div>
              <svg
                className="m-model-card-chev"
                width="14"
                height="9"
                viewBox="0 0 14 9"
                fill="none"
                aria-hidden
              >
                <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            {isOpen && (
              <p className="m-model-when">
                <strong>When to use it:</strong> {model.whenToUse}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
