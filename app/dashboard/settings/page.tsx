"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { MODEL_LABELS, MODEL_DESCRIPTIONS, type AttributionModel, FEATURE_FLAG_LABELS, type FeatureFlags, type ComplexityLevel, type UIDensity } from "@/lib/types";
import { usePlatformConfig } from "@/lib/platform-config";
import { ToggleLeft, ToggleRight, Sliders, Layout, RefreshCw, Server } from "lucide-react";

export default function SettingsPage() {
  const { org, updateOrg } = useStore();
  const { toast } = useToast();
  const mode = "demo";
  const { config, updateFeatureFlag, setComplexityLevel, setUIDensity, resetToDefaults } = usePlatformConfig();
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

      {/* Platform Configuration */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Sliders size={18} /> Platform Configuration
          </h2>
          <button className="btn-outline" onClick={resetToDefaults} style={{ fontSize: ".8rem", padding: "4px 12px", display: "flex", alignItems: "center", gap: 4 }}>
            <RefreshCw size={13} /> Reset to Defaults
          </button>
        </div>

        {/* Complexity Level */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Complexity Level
          </label>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>
            Controls how many features and options are visible across the platform.
          </p>
          <div style={{ display: "flex", gap: ".5rem" }}>
            {(["simple", "standard", "advanced"] as ComplexityLevel[]).map(level => (
              <button
                key={level}
                onClick={() => setComplexityLevel(level)}
                style={{
                  flex: 1, padding: ".6rem 1rem", borderRadius: 8, fontSize: ".85rem", fontWeight: 600,
                  border: config.complexityLevel === level ? "2px solid #6366f1" : "1px solid var(--border)",
                  background: config.complexityLevel === level ? "#eef2ff" : "var(--bg)",
                  color: config.complexityLevel === level ? "#4338ca" : "var(--fg)",
                  cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {level}
                <br />
                <span style={{ fontSize: ".7rem", fontWeight: 400, color: "var(--muted)" }}>
                  {level === "simple" ? "Core features only" : level === "standard" ? "Most features" : "Full power"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* UI Density */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem", alignItems: "center", gap: 6 }}>
            <Layout size={15} /> UI Density
          </label>
          <div style={{ display: "flex", gap: ".5rem" }}>
            {(["compact", "comfortable", "spacious"] as UIDensity[]).map(density => (
              <button
                key={density}
                onClick={() => setUIDensity(density)}
                style={{
                  flex: 1, padding: ".5rem .75rem", borderRadius: 8, fontSize: ".85rem", fontWeight: 600,
                  border: config.uiDensity === density ? "2px solid #6366f1" : "1px solid var(--border)",
                  background: config.uiDensity === density ? "#eef2ff" : "var(--bg)",
                  color: config.uiDensity === density ? "#4338ca" : "var(--fg)",
                  cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {density}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Flags */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Feature Flags
          </label>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".75rem" }}>
            Toggle features on/off based on your organization&apos;s needs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {(Object.keys(FEATURE_FLAG_LABELS) as (keyof FeatureFlags)[]).map(flag => {
              const meta = FEATURE_FLAG_LABELS[flag];
              const enabled = config.featureFlags[flag];
              return (
                <div
                  key={flag}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: ".6rem .75rem", borderRadius: 8, border: "1px solid var(--border)",
                    background: enabled ? "var(--bg)" : "var(--subtle)",
                    opacity: enabled ? 1 : 0.7,
                  }}
                >
                  <div>
                    <p style={{ fontSize: ".85rem", fontWeight: 600 }}>{meta.label}</p>
                    <p className="muted" style={{ fontSize: ".75rem" }}>{meta.description}</p>
                  </div>
                  <button
                    onClick={() => updateFeatureFlag(flag, !enabled)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                    title={enabled ? "Disable" : "Enable"}
                  >
                    {enabled ? (
                      <ToggleRight size={28} color="#059669" />
                    ) : (
                      <ToggleLeft size={28} color="#9ca3af" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MCP Integration Info */}
      {config.featureFlags.mcpIntegration && (
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
            <Server size={18} /> MCP Integration
          </h2>
          <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
            Use the Model Context Protocol (MCP) to query your PartnerAI data with natural language through any MCP-compatible LLM client.
          </p>
          <div style={{ background: "var(--subtle)", borderRadius: 8, padding: "1rem", fontFamily: "monospace", fontSize: ".8rem", border: "1px solid var(--border)" }}>
            <p style={{ fontWeight: 600, marginBottom: ".5rem", fontFamily: "inherit" }}>Connection Instructions:</p>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{`# The MCP server is in ../partner-attribution-ai-mcp/
# Install and run:
cd ../partner-attribution-ai-mcp/
npm install
npm start

# Or add to your MCP client config:
{
  "mcpServers": {
    "partnerai": {
      "command": "node",
      "args": ["path/to/partner-attribution-ai-mcp/dist/index.js"],
      "env": {
        "PARTNERAI_API_KEY": "${apiKey}"
      }
    }
  }
}`}</pre>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontWeight: 600, fontSize: ".85rem", marginBottom: ".5rem" }}>Available Tools:</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".5rem" }}>
              {[
                "query_partners — Search and filter partners",
                "query_deals — Search deals pipeline",
                "get_attribution — Get deal attribution data",
                "query_payouts — View payout status",
                "get_partner_score — Get partner scores",
                "query_revenue — Revenue analytics",
              ].map(tool => (
                <div key={tool} style={{ fontSize: ".8rem", padding: ".4rem .6rem", background: "var(--subtle)", borderRadius: 6, border: "1px solid var(--border)" }}>
                  <code>{tool}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
