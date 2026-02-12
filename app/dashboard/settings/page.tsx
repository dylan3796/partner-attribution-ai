"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { MODEL_LABELS, MODEL_DESCRIPTIONS, type AttributionModel } from "@/lib/types";

export default function SettingsPage() {
  const { org, updateOrg } = useStore();
  const { toast } = useToast();
  const mode = "demo";
  const [orgName, setOrgName] = useState(org?.name || "");
  const [orgEmail, setOrgEmail] = useState(org?.email || "");
  const [defaultModel, setDefaultModel] = useState<AttributionModel>(org?.defaultAttributionModel || "equal_split");
  const [defaultRate, setDefaultRate] = useState("10");
  const [showApiKey, setShowApiKey] = useState(false);

  const apiKey = org?.apiKey || "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const maskedKey = apiKey.slice(0, 6) + "•".repeat(apiKey.length - 10) + apiKey.slice(-4);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateOrg({ name: orgName, email: orgEmail, defaultAttributionModel: defaultModel });
    toast("Settings saved successfully");
  }

  function copyApiKey() {
    navigator.clipboard.writeText(apiKey);
    toast("API key copied to clipboard", "info");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 800 }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Settings
        </h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>
          Manage your organization and platform configuration
        </p>
      </div>

      {/* Organization Settings */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          Organization
        </h2>
        <form
          onSubmit={handleSave}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Organization Name
            </label>
            <input
              className="input"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Your company name"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Email
            </label>
            <input
              className="input"
              type="email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              placeholder="admin@company.com"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Plan
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                className="badge"
                style={{ textTransform: "capitalize" }}
              >
                {org?.plan || "starter"}
              </span>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                {org?.plan === "enterprise"
                  ? "Full access, priority support"
                  : org?.plan === "growth"
                    ? "All features, standard support"
                    : "Basic features"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
            <button type="submit" className="btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Attribution Settings */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          Attribution Defaults
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Default Attribution Model
            </label>
            <select
              className="input"
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value as AttributionModel)}
            >
              {(Object.keys(MODEL_LABELS) as AttributionModel[]).map((model) => (
                <option key={model} value={model}>
                  {MODEL_LABELS[model]}
                </option>
              ))}
            </select>
            <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
              {MODEL_DESCRIPTIONS[defaultModel]}
            </p>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Default Commission Rate (%)
            </label>
            <input
              className="input"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={defaultRate}
              onChange={(e) => setDefaultRate(e.target.value)}
              style={{ maxWidth: 200 }}
            />
            <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
              Applied to new partners by default. Can be overridden per partner.
            </p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          Team Members
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              background: "var(--subtle)",
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                className="avatar"
                style={{ width: 32, height: 32, fontSize: "0.7rem" }}
              >
                AD
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>Admin User</p>
                <p className="muted" style={{ fontSize: "0.8rem" }}>
                  {org?.email || "admin@company.com"}
                </p>
              </div>
            </div>
            <span className="badge">Admin</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              border: "2px dashed var(--border)",
              borderRadius: 8,
            }}
          >
            <p className="muted" style={{ fontSize: "0.9rem" }}>
              Team management coming soon
            </p>
          </div>
        </div>
      </div>

      {/* API Key */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          API Access
        </h2>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: 500,
              marginBottom: "0.4rem",
            }}
          >
            API Key
          </label>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "0.7rem 1rem",
                background: "var(--subtle)",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: "0.85rem",
                color: "var(--muted)",
                border: "1px solid var(--border)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 200,
              }}
            >
              {showApiKey ? apiKey : maskedKey}
            </div>
            <button
              className="btn-outline"
              onClick={() => setShowApiKey(!showApiKey)}
              style={{ whiteSpace: "nowrap" }}
            >
              {showApiKey ? "Hide" : "Show"}
            </button>
            <button
              className="btn-outline"
              onClick={copyApiKey}
              style={{ whiteSpace: "nowrap" }}
            >
              Copy
            </button>
          </div>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
            Use this key to authenticate API requests. Keep it secret.
          </p>
        </div>
        {mode === "demo" && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: "var(--subtle)",
              borderRadius: 8,
              fontSize: "0.85rem",
              color: "var(--muted)",
            }}
          >
            ℹ️ Running in demo mode. Connect Convex backend by setting{" "}
            <code style={{ background: "var(--border)", padding: "0.1rem 0.3rem", borderRadius: 4 }}>
              NEXT_PUBLIC_CONVEX_URL
            </code>{" "}
            environment variable.
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div
        className="card"
        style={{
          borderColor: "#fecaca",
        }}
      >
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "#991b1b",
          }}
        >
          Danger Zone
        </h2>
        <p
          className="muted"
          style={{ fontSize: "0.85rem", marginBottom: "1rem" }}
        >
          Irreversible actions. Proceed with caution.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              border: "1px solid var(--border)",
              borderRadius: 8,
              flexWrap: "wrap",
              gap: ".5rem",
            }}
          >
            <div>
              <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Regenerate API Key
              </p>
              <p className="muted" style={{ fontSize: "0.8rem" }}>
                This will invalidate your current key
              </p>
            </div>
            <button
              className="btn-outline"
              style={{
                borderColor: "#fca5a5",
                color: "#991b1b",
              }}
              onClick={() => toast("This action is not available in demo mode", "error")}
            >
              Regenerate
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              border: "1px solid var(--border)",
              borderRadius: 8,
              flexWrap: "wrap",
              gap: ".5rem",
            }}
          >
            <div>
              <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Delete Organization
              </p>
              <p className="muted" style={{ fontSize: "0.8rem" }}>
                Permanently delete all data including partners, deals, and attributions
              </p>
            </div>
            <button
              className="btn"
              style={{
                background: "#dc2626",
                color: "white",
              }}
              onClick={() => toast("This action is not available in demo mode", "error")}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
