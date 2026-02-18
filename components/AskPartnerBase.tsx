"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Trash2, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useStore } from "@/lib/store";
import { askCovant, processQuery, type QueryContext } from "@/lib/ask-engine";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  aiPowered?: boolean;
  model?: string;
};

const EXAMPLE_QUERIES = [
  "Who are my top 3 partners by revenue?",
  "Show me partner-influenced deals at risk",
  "What's my partner-touched pipeline?",
  "Which partners haven't engaged in 30 days?",
  "How much have I paid out this quarter?",
  "Show me partner scores and rankings",
];

export default function AskPartnerBase() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const store = useStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Hide pulse after first open
  useEffect(() => {
    if (isOpen) setShowPulse(false);
  }, [isOpen]);

  const buildContext = useCallback((): QueryContext => {
    return {
      partners: store.partners,
      deals: store.deals,
      touchpoints: store.touchpoints,
      attributions: store.attributions,
      payouts: store.payouts,
      auditLog: store.auditLog,
      stats: store.stats,
    };
  }, [store]);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || isProcessing) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: q,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    try {
      const ctx = buildContext();
      const result = await askCovant(q, ctx);

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: result.answer,
        timestamp: Date.now(),
        aiPowered: result.aiPowered,
        model: result.model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Last-resort fallback
      const ctx = buildContext();
      const answer = processQuery(q, ctx);
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: answer,
        timestamp: Date.now(),
        aiPowered: false,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, buildContext]);

  const handleExampleClick = useCallback(async (query: string) => {
    if (isProcessing) return;
    setInput("");

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const ctx = buildContext();
      const result = await askCovant(query, ctx);

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: result.answer,
        timestamp: Date.now(),
        aiPowered: result.aiPowered,
        model: result.model,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const ctx = buildContext();
      const answer = processQuery(query, ctx);
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: answer,
        timestamp: Date.now(),
        aiPowered: false,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, buildContext]);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ask-fab"
        aria-label={isOpen ? "Close Ask Covant" : "Open Ask Covant"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #000 0%, #333 100%)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
          zIndex: 1000,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {showPulse && !isOpen && (
          <>
            <span
              className="ask-fab-pulse"
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.3)",
                animation: "ask-pulse 2s ease-in-out infinite",
              }}
            />
            <span
              className="ask-try-me"
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontSize: "0.6rem",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 8,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
                animation: "ask-badge-bounce 2s ease-in-out infinite",
                zIndex: 1,
              }}
            >
              Try me!
            </span>
          </>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="ask-modal"
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            width: 420,
            maxWidth: "calc(100vw - 48px)",
            height: 560,
            maxHeight: "calc(100vh - 140px)",
            borderRadius: 16,
            background: "var(--bg, #fff)",
            border: "1px solid var(--border, #e9ecef)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "ask-slide-up 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border, #e9ecef)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg, #fff)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={18} style={{ color: "#6366f1" }} />
              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "var(--fg, #000)",
                  }}
                >
                  Ask Covant
                </h3>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--muted, #6c757d)",
                    lineHeight: 1.2,
                  }}
                >
                  Query your partner data with natural language
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* Claude badge */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: "#6366f1",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 6,
                  padding: "2px 6px",
                  letterSpacing: "0.02em",
                  flexShrink: 0,
                }}
              >
                <Zap size={9} />
                AI
              </span>
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  title="Clear history"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 6,
                    borderRadius: 8,
                    color: "var(--muted, #6c757d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--subtle, #f8f9fa)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 8,
                  color: "var(--muted, #6c757d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--subtle, #f8f9fa)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #f0f0ff 0%, #e8e8ff 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <Sparkles size={24} style={{ color: "#6366f1" }} />
                  </div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--fg, #000)",
                      marginBottom: 4,
                    }}
                  >
                    What would you like to know?
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted, #6c757d)",
                    }}
                  >
                    Ask about partners, deals, revenue, payouts, and more
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {EXAMPLE_QUERIES.map((eq) => (
                    <button
                      key={eq}
                      onClick={() => handleExampleClick(eq)}
                      disabled={isProcessing}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "1px solid var(--border, #e9ecef)",
                        background: "var(--bg, #fff)",
                        color: "var(--fg, #000)",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: isProcessing ? "default" : "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                        fontFamily: "inherit",
                        opacity: isProcessing ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isProcessing) {
                          e.currentTarget.style.background = "var(--subtle, #f8f9fa)";
                          e.currentTarget.style.borderColor = "var(--muted, #6c757d)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--bg, #fff)";
                        e.currentTarget.style.borderColor = "var(--border, #e9ecef)";
                      }}
                    >
                      💬 {eq}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                      gap: 4,
                    }}
                  >
                    <div
                      className={msg.role === "assistant" ? "ask-response-md" : ""}
                      style={{
                        padding: msg.role === "user" ? "10px 14px" : "12px 16px",
                        borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background:
                          msg.role === "user"
                            ? "linear-gradient(135deg, #000 0%, #222 100%)"
                            : "var(--subtle, #f8f9fa)",
                        color: msg.role === "user" ? "#fff" : "var(--fg, #000)",
                        maxWidth: "95%",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                        border: msg.role === "assistant" ? "1px solid var(--border, #e9ecef)" : "none",
                      }}
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--muted, #6c757d)",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.role === "assistant" && msg.aiPowered && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            fontSize: "0.6rem",
                            fontWeight: 600,
                            color: "#6366f1",
                            opacity: 0.8,
                          }}
                        >
                          <Zap size={8} />
                          {msg.model === "kimi-k2.5" ? "Kimi K2.5" : "Claude"}
                        </span>
                      )}
                      {msg.role === "assistant" && !msg.aiPowered && (
                        <span
                          style={{
                            fontSize: "0.6rem",
                            color: "var(--muted, #6c757d)",
                            opacity: 0.6,
                          }}
                        >
                          pattern match
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: "14px 14px 14px 4px",
                        background: "var(--subtle, #f8f9fa)",
                        border: "1px solid var(--border, #e9ecef)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div className="ask-typing">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--muted, #6c757d)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Zap size={10} style={{ color: "#6366f1" }} />
                        AI is thinking…
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--border, #e9ecef)",
              background: "var(--bg, #fff)",
              flexShrink: 0,
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--subtle, #f8f9fa)",
                borderRadius: 12,
                padding: "4px 4px 4px 14px",
                border: "1px solid var(--border, #e9ecef)",
                transition: "border-color 0.15s",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about your partners, deals, revenue..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "0.85rem",
                  color: "var(--fg, #000)",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: input.trim() && !isProcessing ? "#000" : "var(--border, #e9ecef)",
                  color: input.trim() && !isProcessing ? "#fff" : "var(--muted, #6c757d)",
                  border: "none",
                  cursor: input.trim() && !isProcessing ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            </form>
            {/* Footer badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                marginTop: 8,
                fontSize: "0.62rem",
                color: "var(--muted, #6c757d)",
                opacity: 0.7,
              }}
            >
              <Zap size={9} style={{ color: "#6366f1" }} />
              Powered by Kimi K2.5 · answers may contain errors
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes ask-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0; }
        }

        @keyframes ask-badge-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }

        @keyframes ask-slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes ask-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .ask-typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 4px 0;
        }
        .ask-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--muted, #6c757d);
          animation: ask-dot 1.2s infinite;
        }
        .ask-typing span:nth-child(2) { animation-delay: 0.15s; }
        .ask-typing span:nth-child(3) { animation-delay: 0.3s; }

        .ask-fab:hover {
          transform: ${false ? "rotate(90deg)" : "rotate(0deg)"} scale(1.08) !important;
          box-shadow: 0 6px 32px rgba(0,0,0,0.3) !important;
        }

        .ask-response-md h2 { font-size: 0.9rem; font-weight: 700; margin: 0 0 8px; }
        .ask-response-md h3 { font-size: 0.82rem; font-weight: 600; margin: 12px 0 6px; }
        .ask-response-md p { margin: 4px 0; }
        .ask-response-md ul { margin: 4px 0; padding-left: 18px; }
        .ask-response-md li { margin: 2px 0; }
        .ask-response-md strong { font-weight: 600; }
        .ask-response-md table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.75rem;
          margin: 8px 0;
        }
        .ask-response-md th,
        .ask-response-md td {
          padding: 4px 8px;
          border: 1px solid var(--border, #e9ecef);
          text-align: left;
        }
        .ask-response-md th {
          background: var(--subtle, #f8f9fa);
          font-weight: 600;
        }
        .ask-response-md blockquote {
          border-left: 3px solid var(--border, #e9ecef);
          padding-left: 10px;
          margin: 8px 0;
          color: var(--muted, #6c757d);
          font-style: italic;
        }
        .ask-response-md code {
          background: var(--subtle, #f8f9fa);
          padding: 1px 4px;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .ask-response-md em {
          color: var(--muted, #6c757d);
          font-size: 0.78rem;
        }

        /* Dark mode support */
        .dark .ask-fab {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
        }
        .dark .ask-modal {
          background: var(--bg) !important;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) !important;
        }
        .dark .ask-response-md th {
          background: rgba(255,255,255,0.05);
        }

        @media (max-width: 480px) {
          .ask-modal {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: calc(100vh - 80px) !important;
            max-height: 100vh !important;
            border-radius: 16px 16px 0 0 !important;
          }
          .ask-fab {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
