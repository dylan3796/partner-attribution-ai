"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Send, MessageSquare, Database, CheckCircle, ExternalLink } from "lucide-react";

function SalesforceLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3 7.2C14.3 5.9 15.9 5 17.7 5c2.5 0 4.7 1.6 5.5 3.9.6-.3 1.3-.5 2-.5 2.6 0 4.8 2.1 4.8 4.8 0 .5-.1 1-.2 1.4C31 15.2 32 16.8 32 18.6c0 2.7-2.2 4.8-4.8 4.8H8.8C5.6 23.4 3 20.8 3 17.6c0-2.5 1.6-4.6 3.8-5.4-.1-.4-.1-.8-.1-1.2 0-3.3 2.7-6 6-6 .6 0 .4.1.6.2z" fill="#00A1E0"/>
    </svg>
  );
}

function HubSpotLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.5V9.2c.9-.4 1.5-1.3 1.5-2.4 0-1.4-1.1-2.6-2.5-2.6S17.5 5.4 17.5 6.8c0 1.1.6 2 1.5 2.4v3.3c-1.4.2-2.7.8-3.7 1.8L6.7 8.4c.1-.2.1-.4.1-.6C6.8 6.3 5.7 5 4.3 5 2.9 5 1.8 6.1 1.8 7.6c0 1.5 1.1 2.6 2.5 2.6.4 0 .8-.1 1.1-.3l8.4 5.7C13.3 16.4 13 17.2 13 18c0 .9.3 1.8.8 2.5L9.5 24.8c-.3-.1-.6-.2-.9-.2-1.5 0-2.6 1.2-2.6 2.6 0 1.4 1.2 2.6 2.6 2.6 1.4 0 2.6-1.2 2.6-2.6 0-.4-.1-.8-.3-1.1l4.1-4.4c.9.5 1.9.8 3 .8 3.3 0 5.9-2.7 5.9-6S24.3 10.5 21 12.5z" fill="#FF7A59"/>
    </svg>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InteractionType {
  id: string;
  label: string;
  weight: number;
  triggersAttribution: boolean;
  triggersPayout: boolean;
}

interface CommissionRule {
  type: string;
  value: number;
  unit: string;
  label: string;
}

interface ProgramConfig {
  programType: string;
  programName?: string;
  interactionTypes: InteractionType[];
  attributionModel: string;
  commissionRules: CommissionRule[];
  enabledModules: string[];
}

function parseConfig(text: string): ProgramConfig | null {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    if (
      parsed.programType &&
      Array.isArray(parsed.interactionTypes) &&
      parsed.attributionModel &&
      Array.isArray(parsed.commissionRules) &&
      Array.isArray(parsed.enabledModules)
    ) {
      return {
        programType: parsed.programType,
        programName: parsed.programName,
        interactionTypes: parsed.interactionTypes,
        attributionModel: parsed.attributionModel,
        commissionRules: parsed.commissionRules,
        enabledModules: parsed.enabledModules,
      };
    }
  } catch {
    // ignore parse errors during streaming
  }
  return null;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("covant_setup_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("covant_setup_session", id);
  }
  return id;
}

function LivePreview({ config }: { config: ProgramConfig | null }) {
  return (
    <div className="setup-preview" style={{ width: 280, flexShrink: 0, alignSelf: "flex-start" }}>
      <div className="card" style={{ padding: "1rem" }}>
        <p style={{ fontWeight: 700, fontSize: ".85rem", marginBottom: ".75rem" }}>Your program</p>

        {!config ? (
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span className="setup-pulse-dot" />
            <span className="muted" style={{ fontSize: ".8rem" }}>Listening...</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div>
              <p className="muted" style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".25rem" }}>Type</p>
              <span className="badge badge-info" style={{ fontSize: ".78rem", padding: ".25rem .6rem" }}>{config.programType}</span>
            </div>

            {config.interactionTypes.length > 0 && (
              <div>
                <p className="muted" style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".3rem" }}>Interactions</p>
                <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap" }}>
                  {config.interactionTypes.map((t) => (
                    <span key={t.id} className="setup-chip">{t.label}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="muted" style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".25rem" }}>Attribution</p>
              <p style={{ fontSize: ".82rem", fontWeight: 600 }}>{config.attributionModel.replace(/_/g, " ")}</p>
            </div>

            <div>
              <p className="muted" style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".25rem" }}>Modules</p>
              <p style={{ fontSize: ".82rem", fontWeight: 600 }}>{config.enabledModules.length} enabled</p>
            </div>

            {config.commissionRules.length > 0 && (
              <div>
                <p className="muted" style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".25rem" }}>Payouts</p>
                <p style={{ fontSize: ".82rem", fontWeight: 600 }}>{config.commissionRules.map(r => r.label).join(", ")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SetupPage() {
  const router = useRouter();
  const saveProgramConfig = useMutation(api.programConfig.save);
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Tell me about your partner program — what kind of partners do you work with, what activities matter to you, and how do you typically pay them? The more you share, the better I can configure things." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ProgramConfig | null>(null);
  const [previewConfig, setPreviewConfig] = useState<ProgramConfig | null>(null);
  const [configReady, setConfigReady] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveToConvex = useCallback(async (parsed: ProgramConfig) => {
    const sessionId = getSessionId();
    try {
      await saveProgramConfig({
        sessionId,
        programName: parsed.programName,
        programType: parsed.programType,
        interactionTypes: parsed.interactionTypes,
        attributionModel: parsed.attributionModel,
        commissionRules: parsed.commissionRules,
        enabledModules: parsed.enabledModules,
        rawConfig: JSON.stringify(parsed),
      });
    } catch (e) {
      console.error("Failed to save config to Convex:", e);
    }
  }, [saveProgramConfig]);

  async function sendToAI(msgs: Message[]) {
    setLoading(true);
    try {
      const firstUserIdx = msgs.findIndex(m => m.role === "user");
      const apiMessages = firstUserIdx >= 0 ? msgs.slice(firstUserIdx) : msgs;

      const res = await fetch("/api/setup/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      const streamMessages = [...msgs, { role: "assistant" as const, content: "" }];
      setMessages(streamMessages);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages([...msgs, { role: "assistant" as const, content: fullText }]);

        // Live preview: try parsing partial config
        const partial = parseConfig(fullText);
        if (partial) {
          setPreviewConfig(partial);
        }
      }

      // Check for config in final text
      const parsed = parseConfig(fullText);
      if (parsed) {
        setConfig(parsed);
        setPreviewConfig(parsed);
        setConfigReady(true);
        localStorage.setItem("covant_setup_config", JSON.stringify(parsed));
        await saveToConvex(parsed);
      }
    } catch {
      setMessages([...msgs, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    await sendToAI(newMessages);
  }

  const stepLabels = ["Configure", "Connect", "Ready"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`
        .setup-msg-user {
          align-self: flex-end;
          background: var(--fg);
          color: var(--bg);
          border-radius: 16px 16px 4px 16px;
          padding: .75rem 1.1rem;
          max-width: 75%;
          font-size: .95rem;
          line-height: 1.5;
        }
        .setup-msg-ai {
          align-self: flex-start;
          background: var(--subtle);
          color: var(--fg);
          border-radius: 16px 16px 16px 4px;
          padding: .75rem 1.1rem;
          max-width: 75%;
          font-size: .95rem;
          line-height: 1.5;
        }
        .setup-msg-ai strong { font-weight: 700; }
        .setup-chat-input:focus { border-color: var(--fg); box-shadow: 0 0 0 3px rgba(255,255,255,.06); }
        .setup-connect-btn:hover { border-color: var(--fg) !important; background: var(--subtle) !important; }
        .setup-chip {
          display: inline-block;
          background: var(--info-bg);
          color: var(--info);
          padding: .3rem .7rem;
          border-radius: 6px;
          font-size: .8rem;
          font-weight: 600;
        }
        .setup-typing span {
          display: inline-block;
          width: 6px; height: 6px;
          background: var(--muted);
          border-radius: 50%;
          margin: 0 2px;
          animation: setupBounce .6s infinite alternate;
        }
        .setup-typing span:nth-child(2) { animation-delay: .2s; }
        .setup-typing span:nth-child(3) { animation-delay: .4s; }
        @keyframes setupBounce { to { transform: translateY(-4px); opacity: .4; } }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 4px #10b981); }
          50% { filter: drop-shadow(0 0 16px #10b981) drop-shadow(0 0 32px #10b98166); }
        }
        .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
        .setup-pulse-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--muted);
          animation: setupPulse 1.5s ease-in-out infinite;
        }
        @keyframes setupPulse {
          0%, 100% { opacity: .4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @media (max-width: 768px) {
          .setup-preview { display: none !important; }
          .setup-step1-layout { flex-direction: column !important; }
        }
        .setup-next-link {
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-size: .85rem;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
        }
        .setup-next-link:hover { color: var(--fg); }
      `}</style>

      <div style={{ maxWidth: currentStep === 1 ? "1020px" : "700px", width: "100%", transition: "max-width .3s" }}>
        {/* Progress */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: ".5rem" }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ flex: 1, height: "4px", background: s <= currentStep ? "var(--fg)" : "var(--border)", borderRadius: "2px", transition: "background .3s" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {stepLabels.map((label, i) => (
              <p key={label} className="muted" style={{ fontSize: ".8rem", fontWeight: i + 1 === currentStep ? 600 : 400, color: i + 1 === currentStep ? "var(--fg)" : undefined }}>{label}</p>
            ))}
          </div>
        </div>

        {/* Step 1: Conversation */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".5rem" }}>
              <MessageSquare size={20} />
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Set up your program</h1>
            </div>
            <p className="muted" style={{ marginBottom: "1.5rem" }}>Describe your program in your own words. We&apos;ll handle the rest.</p>

            <div className="setup-step1-layout" style={{ display: "flex", gap: "1.25rem" }}>
              {/* Chat */}
              <div className="card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
                <div style={{ height: "420px", overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
                  {messages.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "setup-msg-user" : "setup-msg-ai"} dangerouslySetInnerHTML={{ __html: m.content.replace(/```json[\s\S]*?```/g, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
                  ))}
                  {loading && messages[messages.length - 1]?.content === "" && (
                    <div className="setup-msg-ai setup-typing"><span /><span /><span /></div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {!configReady ? (
                  <div style={{ borderTop: "1px solid var(--border)", padding: ".75rem", display: "flex", gap: ".5rem" }}>
                    <input
                      className="setup-chat-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type your answer..."
                      disabled={loading}
                      style={{ flex: 1, padding: ".65rem 1rem", border: "1px solid var(--border)", borderRadius: "10px", fontSize: ".95rem", fontFamily: "inherit", outline: "none", background: "var(--subtle)", color: "var(--fg)", transition: "border-color .2s, box-shadow .2s" }}
                    />
                    <button className="btn" onClick={handleSend} disabled={loading || !input.trim()} style={{ padding: ".65rem .9rem" }}>
                      <Send size={18} />
                    </button>
                  </div>
                ) : (
                  <div style={{ borderTop: "1px solid var(--border)", padding: "1rem", textAlign: "center" }}>
                    <button className="btn" onClick={() => setCurrentStep(2)} style={{ background: "var(--fg)", color: "var(--bg)", fontWeight: 700, padding: ".7rem 2rem" }}>
                      Looks good →
                    </button>
                  </div>
                )}
              </div>

              {/* Live Preview (desktop only) */}
              <LivePreview config={previewConfig} />
            </div>
          </div>
        )}

        {/* Step 2: Connect Data */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".5rem" }}>
              <Database size={20} />
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Connect your data</h1>
            </div>
            <p className="muted" style={{ marginBottom: "2rem" }}>Bring in your existing partner and deal data.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button className="card setup-connect-btn" onClick={() => router.push("/dashboard/integrations")} style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", border: "1px solid var(--border)", transition: "all .2s", textAlign: "left" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#0070f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <SalesforceLogo />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>Connect Salesforce</p>
                  <p className="muted" style={{ fontSize: ".85rem" }}>Import deals, contacts, and partner data</p>
                </div>
                <ExternalLink size={16} style={{ color: "var(--muted)" }} />
              </button>

              <button className="card setup-connect-btn" onClick={() => router.push("/dashboard/integrations")} style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", border: "1px solid var(--border)", transition: "all .2s", textAlign: "left" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#ff7a59", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <HubSpotLogo />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>Connect HubSpot</p>
                  <p className="muted" style={{ fontSize: ".85rem" }}>Sync your CRM pipeline and contacts</p>
                </div>
                <ExternalLink size={16} style={{ color: "var(--muted)" }} />
              </button>
            </div>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <button onClick={() => setCurrentStep(3)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: ".95rem", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Skip for now →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Ready */}
        {currentStep === 3 && config && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".25rem" }}>
              <CheckCircle size={24} style={{ color: "#10b981" }} className="pulse-glow" />
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>You&apos;re live.</h1>
            </div>
            <p className="muted" style={{ marginBottom: "2rem" }}>Covant is configured for your program. Here&apos;s what we set up:</p>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>Program Type</p>
                <span className="badge badge-info" style={{ fontSize: ".85rem", padding: ".35rem .8rem" }}>{config.programType}</span>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".5rem" }}>Interaction Types</p>
                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                  {config.interactionTypes.map((item) => (
                    <span key={item.id} className="setup-chip">{item.label}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>Attribution Model</p>
                <p style={{ fontSize: "1rem", fontWeight: 600 }}>{config.attributionModel.replace(/_/g, " ")}</p>
              </div>

              <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>Payout Structure</p>
                {config.commissionRules.map((r, i) => (
                  <p key={i} style={{ fontSize: "1rem", fontWeight: 600 }}>{r.label}</p>
                ))}
              </div>

              <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>Enabled Modules</p>
                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                  {config.enabledModules.map((m) => (
                    <span key={m} className="setup-chip">{m.replace(/_/g, " ")}</span>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn" onClick={() => { localStorage.setItem("covant_setup_complete", "true"); router.push("/dashboard"); }} style={{ width: "100%", background: "var(--fg)", color: "var(--bg)", fontWeight: 700, padding: ".85rem", fontSize: "1.1rem", marginBottom: "1rem" }}>
              Open your dashboard →
            </button>

            <p style={{ textAlign: "center", fontSize: ".85rem", color: "var(--muted)" }}>
              Next:{" "}
              <button className="setup-next-link" onClick={() => { localStorage.setItem("covant_setup_complete", "true"); router.push("/dashboard/partners"); }}>
                Add your first partner →
              </button>
              {" "}or{" "}
              <button className="setup-next-link" onClick={() => { localStorage.setItem("covant_setup_complete", "true"); router.push("/dashboard/integrations"); }}>
                Import from CRM →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
