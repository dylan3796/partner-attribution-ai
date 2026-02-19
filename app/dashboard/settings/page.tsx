"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { MODEL_LABELS, MODEL_DESCRIPTIONS, type AttributionModel, FEATURE_FLAG_LABELS, type FeatureFlags, type ComplexityLevel, type UIDensity } from "@/lib/types";
import { usePlatformConfig } from "@/lib/platform-config";
import { ToggleLeft, ToggleRight, Sliders, Layout, RefreshCw, Server, Lightbulb, Sparkles, FileUp, Mail, CheckCircle, XCircle, Check, Loader2, Unplug, CreditCard, Zap, ExternalLink, AlertCircle } from "lucide-react";
import CSVImport from "@/components/CSVImport";

function SettingsPageInner() {
  const { org, updateOrg } = useStore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const mode = "demo";
  const { config, updateFeatureFlag, setComplexityLevel, setUIDensity, resetToDefaults } = usePlatformConfig();
  const [orgName, setOrgName] = useState(org?.name || "");
  const [orgEmail, setOrgEmail] = useState(org?.email || "");
  const [defaultModel, setDefaultModel] = useState<AttributionModel>(org?.defaultAttributionModel || "equal_split");
  const [defaultRate, setDefaultRate] = useState("10");
  const [showApiKey, setShowApiKey] = useState(false);
  const [sfSyncing, setSfSyncing] = useState(false);
  const [sfDisconnecting, setSfDisconnecting] = useState(false);
  
  // Get Salesforce connection status
  // In a real app, you'd get the orgId from auth context
  const demoOrgId = org?._id; // This would come from auth in production
  const sfStatus = useQuery(
    api.integrations.getSalesforceStatus,
    demoOrgId ? { organizationId: demoOrgId as any } : "skip"
  );
  
  // Show toast on OAuth callback
  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    
    if (connected === 'salesforce') {
      toast("Salesforce connected successfully! You can now sync deals.", "success");
    } else if (error) {
      toast(`Connection error: ${error.replace(/_/g, ' ')}`, "error");
    }
  }, [searchParams, toast]);
  
  // Salesforce sync handler
  async function handleSalesforceSync() {
    if (!demoOrgId) return;
    setSfSyncing(true);
    try {
      const res = await fetch('/api/integrations/salesforce/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: demoOrgId }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`Synced ${data.synced.total} opportunities (${data.synced.created} new, ${data.synced.updated} updated)`, "success");
      } else {
        toast(data.error || 'Sync failed', "error");
      }
    } catch {
      toast('Failed to sync with Salesforce', "error");
    } finally {
      setSfSyncing(false);
    }
  }
  
  // Salesforce disconnect handler
  async function handleSalesforceDisconnect() {
    if (!demoOrgId) return;
    if (!confirm('Are you sure you want to disconnect Salesforce? Synced deals will remain.')) return;
    setSfDisconnecting(true);
    try {
      const res = await fetch('/api/integrations/salesforce/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: demoOrgId }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Salesforce disconnected', "info");
      } else {
        toast(data.error || 'Disconnect failed', "error");
      }
    } catch {
      toast('Failed to disconnect Salesforce', "error");
    } finally {
      setSfDisconnecting(false);
    }
  }
  
  // Email notification settings
  const [emailSettings, setEmailSettings] = useState({
    notifyDealApproval: true,
    notifyCommissionPaid: true,
    sendPartnerInvites: true,
  });
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);
  const [emailSaving, setEmailSaving] = useState(false);
  
  // Stripe payout settings
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(null);

  // Check if email and Stripe are configured on mount
  useEffect(() => {
    async function checkEmailConfig() {
      try {
        const res = await fetch('/api/email/test');
        const data = await res.json();
        setEmailConfigured(data.configured ?? false);
      } catch {
        setEmailConfigured(false);
      }
    }
    async function checkStripeConfig() {
      try {
        const res = await fetch('/api/stripe/status');
        const data = await res.json();
        setStripeConfigured(data.configured ?? false);
      } catch {
        setStripeConfigured(false);
      }
    }
    checkEmailConfig();
    checkStripeConfig();
  }, []);

  function handleEmailSettingsSave() {
    setEmailSaving(true);
    // In a real app, this would save to backend/Convex
    setTimeout(() => {
      setEmailSaving(false);
      toast("Email notification settings saved");
    }, 500);
  }

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

      {/* Customization Hero Banner */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderRadius: 12,
          background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)",
          border: "1px solid #c7d2fe",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: ".25rem", color: "#312e81" }}>
            Built for YOUR partner program
          </h3>
          <p style={{ fontSize: ".85rem", color: "#4338ca", lineHeight: 1.5, margin: 0 }}>
            Covant is the intelligence layer on top of your CRM. Connect your deal data, then toggle features, adjust complexity, and customize the UI — make it yours.
            Enable only what you need, from simple partner attribution to enterprise-grade multi-model program management.
          </p>
        </div>
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

      {/* CRM Connection */}
      <div className="card" id="crm-connection">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
          🔗 CRM Connection
        </h2>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Covant layers on top of your CRM. Connect your system of record to automatically sync deals, contacts, and pipeline data. We add partner attribution and program intelligence on top.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Salesforce */}
          {sfStatus?.connected ? (
            <div style={{ padding: "1rem", border: "2px solid #22c55e", borderRadius: 10, background: "#f0fdf4" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>☁️</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Salesforce</p>
                      <span style={{ background: "#22c55e", color: "white", fontSize: ".65rem", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>CONNECTED</span>
                    </div>
                    <p className="muted" style={{ fontSize: ".8rem" }}>
                      {sfStatus.salesforceOrgName || sfStatus.salesforceOrgId} · {sfStatus.syncedDeals} deals synced
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: ".75rem", borderTop: "1px solid #bbf7d0" }}>
                <p style={{ fontSize: ".75rem", color: "#166534" }}>
                  {sfStatus.lastSyncedAt 
                    ? `Last synced ${new Date(sfStatus.lastSyncedAt).toLocaleString()}`
                    : 'Never synced'}
                </p>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <button 
                    className="btn" 
                    style={{ fontSize: ".8rem", padding: ".4rem .75rem", background: "#22c55e", display: "flex", alignItems: "center", gap: ".3rem" }} 
                    onClick={handleSalesforceSync}
                    disabled={sfSyncing}
                  >
                    {sfSyncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {sfSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ fontSize: ".8rem", padding: ".4rem .75rem", color: "#dc2626", borderColor: "#fca5a5", display: "flex", alignItems: "center", gap: ".3rem" }} 
                    onClick={handleSalesforceDisconnect}
                    disabled={sfDisconnecting}
                  >
                    {sfDisconnecting ? <Loader2 size={14} className="animate-spin" /> : <Unplug size={14} />}
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid var(--border)", borderRadius: 10, background: "var(--subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>☁️</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Salesforce</p>
                  <p className="muted" style={{ fontSize: ".8rem" }}>Sync deals, accounts, and opportunities</p>
                </div>
              </div>
              <button 
                className="btn" 
                style={{ fontSize: ".8rem", background: "#0176d3" }} 
                onClick={() => {
                  if (!demoOrgId) {
                    toast("Organization ID not available. Please set up your organization first.", "error");
                    return;
                  }
                  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
                    toast("Salesforce OAuth requires configuration. Contact support to enable.", "info");
                    return;
                  }
                  window.location.href = `/api/integrations/salesforce/connect?orgId=${demoOrgId}`;
                }}
              >
                Connect Salesforce
              </button>
            </div>
          )}

          {/* HubSpot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid var(--border)", borderRadius: 10, background: "var(--subtle)", opacity: 0.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🟠</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <p style={{ fontWeight: 600, fontSize: ".9rem" }}>HubSpot</p>
                  <span style={{ background: "#fbbf24", color: "#78350f", fontSize: ".6rem", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>COMING SOON</span>
                </div>
                <p className="muted" style={{ fontSize: ".8rem" }}>Sync deals, contacts, and pipeline stages</p>
              </div>
            </div>
            <button className="btn-outline" style={{ fontSize: ".8rem" }} disabled>
              Connect
            </button>
          </div>

          {/* Pipedrive */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid var(--border)", borderRadius: 10, background: "var(--subtle)", opacity: 0.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🟢</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Pipedrive</p>
                  <span style={{ background: "#fbbf24", color: "#78350f", fontSize: ".6rem", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>COMING SOON</span>
                </div>
                <p className="muted" style={{ fontSize: ".8rem" }}>Sync deals and pipeline data</p>
              </div>
            </div>
            <button className="btn-outline" style={{ fontSize: ".8rem" }} disabled>
              Connect
            </button>
          </div>

          {/* REST API */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid var(--border)", borderRadius: 10, background: "var(--subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🔗</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Custom CRM (REST API)</p>
                <p className="muted" style={{ fontSize: ".8rem" }}>Push deal data via API from any system</p>
              </div>
            </div>
            <button className="btn-outline" style={{ fontSize: ".8rem" }} onClick={() => toast("Use the API key below to push deal data from any CRM.", "info")}>
              View Docs
            </button>
          </div>
        </div>

        <div style={{ marginTop: "1.25rem", padding: "1rem", borderRadius: 8, background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)", border: "1px solid #c7d2fe" }}>
          <p style={{ fontSize: ".85rem", color: "#3730a3", lineHeight: 1.5 }}>
            <strong>💡 No CRM connected yet?</strong> You can import deals manually from the <a href="/dashboard/deals" style={{ fontWeight: 600, textDecoration: "underline" }}>Deals page</a>. When you connect a CRM, existing manual entries will be preserved alongside synced data.
          </p>
        </div>
      </div>

      {/* Data Import */}
      <div className="card" id="data-import">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
          <FileUp size={18} /> Data Import
        </h2>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          Upload a CSV file with your data, or download our template to get started.
          Import partners, deals, and touchpoints in bulk with validation and duplicate detection.
        </p>
        <CSVImport />
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

      {/* Email Notifications */}
      <div className="card" id="email-notifications">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
          <Mail size={18} /> Email Notifications
        </h2>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          Configure automated email notifications to keep partners informed about deal updates and payouts.
        </p>

        {/* Connection Status */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.75rem", 
          padding: "0.75rem 1rem", 
          borderRadius: 8, 
          marginBottom: "1.25rem",
          background: emailConfigured === null ? "var(--subtle)" : emailConfigured ? "#ecfdf5" : "#fef2f2",
          border: `1px solid ${emailConfigured === null ? "var(--border)" : emailConfigured ? "#86efac" : "#fecaca"}`
        }}>
          {emailConfigured === null ? (
            <>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--muted)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Checking email configuration...</span>
            </>
          ) : emailConfigured ? (
            <>
              <CheckCircle size={18} color="#22c55e" />
              <span style={{ fontSize: ".85rem", color: "#15803d", fontWeight: 500 }}>Email configured ✓</span>
              <span style={{ fontSize: ".8rem", color: "#166534", marginLeft: "auto" }}>Resend connected</span>
            </>
          ) : (
            <>
              <XCircle size={18} color="#ef4444" />
              <span style={{ fontSize: ".85rem", color: "#991b1b", fontWeight: 500 }}>Not configured</span>
              <span style={{ fontSize: ".8rem", color: "#b91c1c", marginLeft: "auto" }}>Add RESEND_API_KEY to enable</span>
            </>
          )}
        </div>

        {/* Notification Toggles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
          {[
            { key: "notifyDealApproval", label: "Notify partners on deal approval", description: "Send email when a deal registration is approved" },
            { key: "notifyCommissionPaid", label: "Notify partners on commission paid", description: "Send email when a commission payout is processed" },
            { key: "sendPartnerInvites", label: "Send partner invite emails", description: "Email partners when they're invited to the program" },
          ].map(({ key, label, description }) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: emailSettings[key as keyof typeof emailSettings] ? "var(--bg)" : "var(--subtle)",
                opacity: emailConfigured ? 1 : 0.6,
              }}
            >
              <div>
                <p style={{ fontSize: ".9rem", fontWeight: 600 }}>{label}</p>
                <p className="muted" style={{ fontSize: ".75rem" }}>{description}</p>
              </div>
              <button
                onClick={() => setEmailSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof emailSettings] }))}
                disabled={!emailConfigured}
                style={{ background: "none", border: "none", cursor: emailConfigured ? "pointer" : "not-allowed", padding: 4 }}
                title={emailSettings[key as keyof typeof emailSettings] ? "Disable" : "Enable"}
              >
                {emailSettings[key as keyof typeof emailSettings] ? (
                  <ToggleRight size={28} color={emailConfigured ? "#059669" : "#9ca3af"} />
                ) : (
                  <ToggleLeft size={28} color="#9ca3af" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button 
            className="btn" 
            onClick={handleEmailSettingsSave}
            disabled={!emailConfigured || emailSaving}
            style={{ opacity: emailConfigured ? 1 : 0.5 }}
          >
            {emailSaving ? "Saving..." : "Save Email Settings"}
          </button>
        </div>

        {/* Help text */}
        {!emailConfigured && (
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "var(--subtle)", borderRadius: 8, fontSize: ".8rem", color: "var(--muted)" }}>
            💡 To enable email notifications, add <code style={{ background: "var(--border)", padding: "0.1rem 0.3rem", borderRadius: 4 }}>RESEND_API_KEY</code> to your environment variables. Get your API key from <a href="https://resend.com" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>resend.com</a>.
          </div>
        )}
      </div>

      {/* Payouts & Stripe */}
      <div className="card" id="payouts">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
          <CreditCard size={18} /> Payouts
        </h2>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          Configure how partner commissions are paid out. Connect Stripe to enable automatic bank transfers.
        </p>

        {/* Stripe Connection Status */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.75rem", 
          padding: "0.75rem 1rem", 
          borderRadius: 8, 
          marginBottom: "1.25rem",
          background: stripeConfigured === null ? "var(--subtle)" : stripeConfigured ? "#eef2ff" : "#fef2f2",
          border: `1px solid ${stripeConfigured === null ? "var(--border)" : stripeConfigured ? "#c7d2fe" : "#fecaca"}`
        }}>
          {stripeConfigured === null ? (
            <>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--muted)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Checking Stripe configuration...</span>
            </>
          ) : stripeConfigured ? (
            <>
              <Zap size={18} color="#6366f1" />
              <span style={{ fontSize: ".85rem", color: "#4338ca", fontWeight: 500 }}>Stripe Connect enabled ✓</span>
              <a 
                href="https://dashboard.stripe.com/connect/accounts/overview" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: ".8rem", color: "#6366f1", marginLeft: "auto", display: "flex", alignItems: "center", gap: ".25rem" }}
              >
                View Dashboard <ExternalLink size={12} />
              </a>
            </>
          ) : (
            <>
              <AlertCircle size={18} color="#ef4444" />
              <span style={{ fontSize: ".85rem", color: "#991b1b", fontWeight: 500 }}>Not configured</span>
              <span style={{ fontSize: ".8rem", color: "#b91c1c", marginLeft: "auto" }}>Add STRIPE_SECRET_KEY to enable</span>
            </>
          )}
        </div>

        {/* Payout Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: stripeConfigured ? "var(--bg)" : "var(--subtle)",
              opacity: stripeConfigured ? 1 : 0.6,
            }}
          >
            <div>
              <p style={{ fontSize: ".9rem", fontWeight: 600 }}>Require Stripe Connect for payouts</p>
              <p className="muted" style={{ fontSize: ".75rem" }}>When enabled, only partners with connected Stripe accounts can receive payouts</p>
            </div>
            <button
              disabled={!stripeConfigured}
              style={{ background: "none", border: "none", cursor: stripeConfigured ? "pointer" : "not-allowed", padding: 4 }}
            >
              <ToggleLeft size={28} color="#9ca3af" />
            </button>
          </div>
        </div>

        {/* Help text */}
        {!stripeConfigured && (
          <div style={{ padding: "0.75rem 1rem", background: "var(--subtle)", borderRadius: 8, fontSize: ".8rem", color: "var(--muted)" }}>
            💡 To enable Stripe payouts, add <code style={{ background: "var(--border)", padding: "0.1rem 0.3rem", borderRadius: 4 }}>STRIPE_SECRET_KEY</code> to your environment variables. Get your API key from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>stripe.com</a>. For webhooks, also add <code style={{ background: "var(--border)", padding: "0.1rem 0.3rem", borderRadius: 4 }}>STRIPE_WEBHOOK_SECRET</code>.
          </div>
        )}
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
              gap: "0.75rem",
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
      </div>

      {/* Platform Configuration */}
      <div className="card" id="platform-config">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Sliders size={18} /> Platform Configuration
          </h2>
          <button className="btn-outline" onClick={resetToDefaults} style={{ fontSize: ".8rem", padding: "4px 12px", display: "flex", alignItems: "center", gap: 4 }}>
            <RefreshCw size={13} /> Reset to Defaults
          </button>
        </div>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Configure Covant&apos;s intelligence layer for your workflow. Toggle complexity, enable only the modules you use, and adapt the platform as your partner program grows. Your CRM stays your system of record — we add the partner ops on top.
        </p>

        {/* Configuration Tips */}
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
            <Lightbulb size={15} color="#4338ca" />
            <span style={{ fontWeight: 700, fontSize: ".85rem", color: "#4338ca" }}>Configuration Tips</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <li style={{ fontSize: ".8rem", color: "#3730a3", display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
              <span style={{ color: "#6366f1", fontWeight: 700 }}>→</span>
              Start with &quot;Simple&quot; complexity and enable features as your program matures
            </li>
            <li style={{ fontSize: ".8rem", color: "#3730a3", display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
              <span style={{ color: "#6366f1", fontWeight: 700 }}>→</span>
              Toggle individual features below to show/hide them from navigation and dashboards
            </li>
            <li style={{ fontSize: ".8rem", color: "#3730a3", display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
              <span style={{ color: "#6366f1", fontWeight: 700 }}>→</span>
              Use &quot;Compact&quot; density for data-heavy views, &quot;Spacious&quot; for readability
            </li>
            <li style={{ fontSize: ".8rem", color: "#3730a3", display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
              <span style={{ color: "#6366f1", fontWeight: 700 }}>→</span>
              Changes apply instantly — no restart needed. Experiment freely!
            </li>
          </ul>
        </div>

        {/* Complexity Level */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Complexity Level
          </label>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>
            Toggle complexity based on your team&apos;s needs. Simple for lean operations, Advanced for full power.
          </p>
          <div style={{ display: "flex", gap: ".75rem" }}>
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
          <div style={{ display: "flex", gap: ".75rem" }}>
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
            Feature Modules — Enable Only What You Use
          </label>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".75rem" }}>
            Every toggle instantly shows or hides the feature across the platform. Disabled features are fully hidden from navigation, dashboards, and your team&apos;s view.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
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
            Use the Model Context Protocol (MCP) to query your Covant data with natural language through any MCP-compatible LLM client.
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".75rem" }}>
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
              onClick={() => toast("Coming soon. Contact support to enable this feature.", "info")}
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
              onClick={() => toast("Coming soon. Contact support to enable this feature.", "info")}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#fff" }}>Loading settings…</div>}>
      <SettingsPageInner />
    </Suspense>
  );
}
