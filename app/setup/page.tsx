"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, MessageSquare, Database, CheckCircle, ExternalLink, Upload } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ProgramConfig {
  programType: string;
  tracking: string;
  attribution: string;
  payouts: string;
}

function parseConfig(text: string): ProgramConfig | null {
  const pt = text.match(/\*\*Program type:\*\*\s*(.+)/i);
  const tr = text.match(/\*\*Tracking:\*\*\s*(.+)/i);
  const at = text.match(/\*\*Attribution:\*\*\s*(.+)/i);
  const pa = text.match(/\*\*Payouts:\*\*\s*(.+)/i);
  if (pt && tr && at && pa) {
    return {
      programType: pt[1].trim(),
      tracking: tr[1].trim(),
      attribution: at[1].trim(),
      payouts: pa[1].trim(),
    };
  }
  return null;
}

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ProgramConfig | null>(null);
  const [configReady, setConfigReady] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Start conversation on mount
  useEffect(() => {
    if (messages.length === 0) {
      sendToAI([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendToAI(msgs: Message[]) {
    setLoading(true);
    try {
      const res = await fetch("/api/setup/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
      const data = await res.json();
      const newMessages = [...msgs, { role: "assistant" as const, content: data.content }];
      setMessages(newMessages);

      // Check if the response contains the config summary
      const parsed = parseConfig(data.content);
      if (parsed) {
        setConfig(parsed);
        setConfigReady(true);
        localStorage.setItem("covant_setup_config", JSON.stringify(parsed));
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
      `}</style>

      <div style={{ maxWidth: "700px", width: "100%" }}>
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
            <p className="muted" style={{ marginBottom: "1.5rem" }}>Tell us about your partner program and we'll configure everything.</p>

            {/* Chat */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: "420px", overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "setup-msg-user" : "setup-msg-ai"} dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
                ))}
                {loading && (
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
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>S</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>Connect Salesforce</p>
                  <p className="muted" style={{ fontSize: ".85rem" }}>Import deals, contacts, and partner data</p>
                </div>
                <ExternalLink size={16} style={{ color: "var(--muted)" }} />
              </button>

              <button className="card setup-connect-btn" onClick={() => router.push("/dashboard/integrations")} style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", border: "1px solid var(--border)", transition: "all .2s", textAlign: "left" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#ff7a59", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>H</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>Connect HubSpot</p>
                  <p className="muted" style={{ fontSize: ".85rem" }}>Sync your CRM pipeline and contacts</p>
                </div>
                <ExternalLink size={16} style={{ color: "var(--muted)" }} />
              </button>

              <div className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", opacity: .5, cursor: "not-allowed", position: "relative" }} title="Coming soon">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Upload size={20} style={{ color: "var(--muted)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>Upload CSV</p>
                  <p className="muted" style={{ fontSize: ".85rem" }}>Coming soon</p>
                </div>
              </div>
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
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".5rem" }}>
              <CheckCircle size={20} style={{ color: "#10b981" }} />
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Your program is ready</h1>
            </div>
            <p className="muted" style={{ marginBottom: "2rem" }}>Here's what we configured based on your answers.</p>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>Program Type</p>
                <span className="badge badge-info" style={{ fontSize: ".85rem", padding: ".35rem .8rem" }}>{config.programType}</span>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".5rem" }}>Tracking</p>
                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                  {config.tracking.split(",").map((item) => (
                    <span key={item.trim()} className="setup-chip">{item.trim()}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>Attribution Model</p>
                <p style={{ fontSize: "1rem", fontWeight: 600 }}>{config.attribution}</p>
              </div>

              <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>Payout Structure</p>
                <p style={{ fontSize: "1rem", fontWeight: 600 }}>{config.payouts}</p>
              </div>
            </div>

            <button className="btn" onClick={() => { localStorage.setItem("covant_setup_complete", "true"); router.push("/dashboard"); }} style={{ width: "100%", background: "var(--fg)", color: "var(--bg)", fontWeight: 700, padding: ".85rem", fontSize: "1.05rem" }}>
              Go to dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
