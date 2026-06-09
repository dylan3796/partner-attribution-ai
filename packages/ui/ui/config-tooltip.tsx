"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

type ConfigTooltipProps = {
  children: React.ReactNode;
  tip?: string;
};

export function ConfigTooltip({ children, tip = "This can be customized in Settings" }: ConfigTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <div
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#6366f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          opacity: 0.7,
          transition: "opacity .2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget.style.opacity = "1"); }}
        onMouseLeave={(e) => { (e.currentTarget.style.opacity = "0.7"); }}
      >
        <Settings size={9} color="white" />
      </div>
      {show && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: 8,
            background: "var(--fg)",
            color: "var(--bg)",
            padding: ".5rem .75rem",
            borderRadius: 8,
            fontSize: ".75rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
            zIndex: 50,
            boxShadow: "0 4px 12px rgba(0,0,0,.15)",
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
          }}
        >
          <Settings size={11} />
          <Link href="/dashboard/settings#platform-config" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {tip}
          </Link>
        </div>
      )}
    </div>
  );
}

type ConfigTipBoxProps = {
  title?: string;
  tips: string[];
};

export function ConfigTipBox({ title = "Configuration Tips", tips }: ConfigTipBoxProps) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: 10,
        border: "1px solid #c7d2fe",
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
        <Settings size={15} color="#4338ca" />
        <span style={{ fontWeight: 700, fontSize: ".85rem", color: "#4338ca" }}>{title}</span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".35rem" }}>
        {tips.map((tip, i) => (
          <li key={i} style={{ fontSize: ".8rem", color: "#3730a3", display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
            <span style={{ color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>→</span>
            {tip}
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard/settings#platform-config"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: ".3rem",
          marginTop: ".6rem",
          fontSize: ".8rem",
          fontWeight: 600,
          color: "#4338ca",
        }}
      >
        Open Platform Configuration →
      </Link>
    </div>
  );
}
