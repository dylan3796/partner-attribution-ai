"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { programTemplates, type ProgramTemplate } from "@/lib/templates";
import { Check } from "lucide-react";

export default function SetupWizard() {
  const router = useRouter();
  const applyTemplate = useMutation(api.setup.applyTemplate);
  const seedDemoData = useMutation(api.seedDemo.seedDemoData);
  
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);
  const [processing, setProcessing] = useState(false);
  const [config, setConfig] = useState({
    orgName: "",
    commissionRate: 0,
    payoutFrequency: "monthly" as "weekly" | "monthly" | "quarterly" | "annual",
    selectedTiers: [] as string[],
  });

  const handleTemplateSelect = (template: ProgramTemplate) => {
    setSelectedTemplate(template);
    setConfig({
      ...config,
      commissionRate: template.defaultCommissionRate,
      payoutFrequency: template.payoutFrequency,
      selectedTiers: template.tiers.map((t) => t.name),
    });
    setStep(2);
  };

  const handleFinish = async () => {
    if (!selectedTemplate) return;
    
    setProcessing(true);
    try {
      await applyTemplate({
        orgName: config.orgName,
        templateId: selectedTemplate.id,
        attributionModel: selectedTemplate.attributionModel,
        defaultCommissionRate: config.commissionRate,
        payoutFrequency: config.payoutFrequency,
        requireDealRegistration: selectedTemplate.requireDealRegistration,
        enableMDF: selectedTemplate.enableMDF,
        selectedTiers: config.selectedTiers,
      });

      // Auto-seed realistic example data so the dashboard isn't empty
      try { await seedDemoData(); } catch { /* non-critical */ }
      
      localStorage.setItem("covant_setup_complete", "true");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to apply template:", error);
      alert("Failed to complete setup. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "900px", width: "100%" }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: ".5rem" }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: "4px",
                  background: s <= step ? "var(--fg)" : "var(--border)",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
          <p className="muted" style={{ fontSize: ".85rem" }}>
            Step {step} of 3
          </p>
        </div>

        {/* Step 1: Welcome + Template Selection */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: ".5rem" }}>
              Welcome to Covant
            </h1>
            <p className="muted" style={{ fontSize: "1.1rem", marginBottom: "3rem" }}>
              Let's set up your partner program in 60 seconds
            </p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
              Choose your program type
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {programTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="card"
                  style={{
                    padding: "1.5rem",
                    textAlign: "left",
                    cursor: "pointer",
                    border: "2px solid var(--border)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--fg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>{template.icon}</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".3rem" }}>
                    {template.name}
                  </h3>
                  <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
                    {template.description}
                  </p>
                  <p style={{ fontSize: ".75rem", color: "var(--muted)", fontStyle: "italic" }}>
                    Best for: {template.bestFor}
                  </p>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "2rem", padding: "1rem", background: "var(--subtle)", borderRadius: "8px" }}>
              <p className="muted" style={{ fontSize: ".85rem" }}>
                💡 Don't worry — you can customize everything later. These are just starting points.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && selectedTemplate && (
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: ".5rem" }}>
              Configure Your {selectedTemplate.name}
            </h1>
            <p className="muted" style={{ marginBottom: "2rem" }}>
              Customize the defaults for your program
            </p>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                Organization Name
              </h3>
              <input
                className="input"
                placeholder="Your company name"
                value={config.orgName}
                onChange={(e) => setConfig({ ...config, orgName: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                Default Commission Rate
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={config.commissionRate}
                  onChange={(e) => setConfig({ ...config, commissionRate: Number(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: "1.5rem", fontWeight: 800, minWidth: "60px" }}>
                  {config.commissionRate}%
                </span>
              </div>
            </div>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                Payout Frequency
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".5rem" }}>
                {(["weekly", "monthly", "quarterly", "annual"] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setConfig({ ...config, payoutFrequency: freq })}
                    className="btn"
                    style={{
                      background: config.payoutFrequency === freq ? "var(--fg)" : "var(--subtle)",
                      color: config.payoutFrequency === freq ? "var(--bg)" : "var(--fg)",
                    }}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                Partner Tiers
              </h3>
              <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>
                Select which tiers you want to enable
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {selectedTemplate.tiers.map((tier) => (
                  <label
                    key={tier.name}
                    style={{
                      display: "flex",
                      alignItems: "start",
                      gap: ".8rem",
                      padding: ".8rem",
                      background: config.selectedTiers.includes(tier.name) ? "var(--subtle)" : "transparent",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={config.selectedTiers.includes(tier.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfig({ ...config, selectedTiers: [...config.selectedTiers, tier.name] });
                        } else {
                          setConfig({ ...config, selectedTiers: config.selectedTiers.filter((t) => t !== tier.name) });
                        }
                      }}
                      style={{ marginTop: "2px" }}
                    />
                    <div>
                      <p style={{ fontWeight: 600 }}>
                        {tier.name} — {tier.commissionRate}%
                      </p>
                      <ul className="muted" style={{ fontSize: ".8rem", marginTop: ".3rem", paddingLeft: "1.2rem" }}>
                        {tier.benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button className="btn" onClick={() => setStep(1)} style={{ flex: 1 }}>
                Back
              </button>
              <button
                className="btn"
                onClick={() => setStep(3)}
                disabled={!config.orgName}
                style={{ flex: 1, background: "var(--fg)", color: "var(--bg)" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && selectedTemplate && (
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: ".5rem" }}>
              You're All Set!
            </h1>
            <p className="muted" style={{ marginBottom: "2rem" }}>
              Here's what we configured for {config.orgName}
            </p>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Program Type</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {selectedTemplate.icon} {selectedTemplate.name}
                  </p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Attribution Model</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {selectedTemplate.attributionModel.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Commission Rate</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{config.commissionRate}%</p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".3rem" }}>Payout Frequency</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {config.payoutFrequency.charAt(0).toUpperCase() + config.payoutFrequency.slice(1)}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>Active Tiers</p>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {config.selectedTiers.map((tier) => (
                    <span key={tier} className="badge badge-info">
                      {tier}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: "1.5rem", background: "var(--subtle)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <Check size={18} style={{ color: "#065f46" }} /> What's Next?
              </h3>
              <ul className="muted" style={{ fontSize: ".85rem", paddingLeft: "1.2rem" }}>
                <li>Add your first partners</li>
                <li>Connect your CRM (optional)</li>
                <li>Start tracking deals and touchpoints</li>
                <li>View attribution and commission reports</li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn" onClick={() => setStep(2)} style={{ flex: 1 }}>
                Back
              </button>
              <button
                className="btn"
                onClick={handleFinish}
                disabled={processing}
                style={{ flex: 2, background: "var(--fg)", color: "var(--bg)", fontWeight: 700 }}
              >
                {processing ? "Setting up..." : "Go to Dashboard →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
