import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Brain,
  Coins,
  ClipboardList,
  Users,
  Eye,
  Shield,
  Zap,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileText,
  Bell,
} from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Product Tour — Covant",
  description:
    "See how Covant works: AI-powered setup, real-time attribution, partner portal, commission automation, and deal registration — all in one platform.",
};

/* ---------- mock UI building blocks ---------- */

function MockWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid #1a1a1a",
          background: "#050505",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
        </div>
        <span style={{ color: "#444", fontSize: ".75rem", marginLeft: 8 }}>{title}</span>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div
      style={{
        background: "#111",
        borderRadius: 8,
        padding: "14px 16px",
        flex: 1,
        minWidth: 120,
      }}
    >
      <div style={{ color: "#555", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{value}</div>
      <div style={{ color: "#22c55e", fontSize: ".7rem", marginTop: 2 }}>{trend}</div>
    </div>
  );
}

function MockTableRow({ cells, highlight }: { cells: string[]; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
        gap: 8,
        padding: "10px 0",
        borderBottom: "1px solid #111",
        background: highlight ? "#0d1117" : "transparent",
      }}
    >
      {cells.map((c, i) => (
        <span key={i} style={{ color: i === 0 ? "#ccc" : "#666", fontSize: ".8rem" }}>
          {c}
        </span>
      ))}
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: ".7rem",
        fontWeight: 600,
        background: `${color}20`,
        color,
      }}
    >
      {text}
    </span>
  );
}

/* ---------- tour sections ---------- */

function TourSection({
  id,
  step,
  title,
  subtitle,
  description,
  children,
  reverse,
}: {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} style={{ padding: "5rem 0", borderBottom: "1px solid #0a0a0a" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
        className="tour-grid"
      >
        <div style={{ order: reverse ? 2 : 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 20,
              border: "1px solid #222",
              color: "#666",
              fontSize: ".7rem",
              textTransform: "uppercase",
              letterSpacing: ".1em",
              marginBottom: 16,
            }}
          >
            {step}
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-.02em",
              marginBottom: 8,
            }}
          >
            {title}
          </h2>
          <p style={{ color: "#888", fontSize: ".95rem", marginBottom: 12 }}>{subtitle}</p>
          <p style={{ color: "#555", fontSize: ".85rem", lineHeight: 1.7 }}>{description}</p>
        </div>
        <div style={{ order: reverse ? 1 : 2 }}>{children}</div>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function ProductTourPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#e5e5e5",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid #111",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "-0.03em",
          }}
        >
          Covant.ai
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/demo" style={{ color: "#888", fontSize: ".85rem", textDecoration: "none" }}>
            Live Demo
          </Link>
          <Link
            href="/beta"
            style={{
              color: "#000",
              background: "#fff",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: ".85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Join Beta
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "5rem 0 3rem", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 1.5rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#555",
              fontSize: ".85rem",
              textDecoration: "none",
              marginBottom: 32,
            }}
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-.03em",
              marginBottom: 16,
            }}
          >
            See the product.
          </h1>
          <p
            style={{
              color: "#666",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            From AI-powered setup to attribution audit trails — here&apos;s what Covant actually looks
            like when you&apos;re running a partner program.
          </p>
        </div>
      </section>

      {/* Jump links */}
      <section style={{ padding: "0 0 4rem", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            padding: "0 1.5rem",
          }}
        >
          {[
            { label: "Setup", href: "#setup" },
            { label: "Dashboard", href: "#dashboard" },
            { label: "Attribution", href: "#attribution" },
            { label: "Portal", href: "#portal" },
            { label: "Commissions", href: "#commissions" },
            { label: "Deal Reg", href: "#deals" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid #222",
                color: "#888",
                fontSize: ".8rem",
                textDecoration: "none",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </section>

      {/* 1 — AI Setup */}
      <TourSection
        id="setup"
        step="Step 1"
        title="Tell us about your program. We'll configure everything."
        subtitle="AI-powered setup in under 5 minutes."
        description="No forms. No 40-field wizards. Just describe your partner program in plain English — Covant's AI extracts your attribution model, commission rules, interaction types, and module preferences. A live preview panel updates in real time as you talk."
      >
        <MockWindow title="covant.ai/setup">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: "#111",
                borderRadius: 8,
                padding: 14,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <Brain size={16} style={{ color: "#888", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ color: "#888", fontSize: ".7rem", marginBottom: 4 }}>Covant AI</div>
                <div style={{ color: "#ccc", fontSize: ".82rem", lineHeight: 1.6 }}>
                  Tell me about your partner program — how many partners, what types, how do you
                  attribute deals today?
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#0d1a0d",
                border: "1px solid #1a331a",
                borderRadius: 8,
                padding: 14,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <Users size={16} style={{ color: "#22c55e", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ color: "#22c55e", fontSize: ".7rem", marginBottom: 4 }}>You</div>
                <div style={{ color: "#ccc", fontSize: ".82rem", lineHeight: 1.6 }}>
                  We have 35 reseller partners. Deal registration is how we attribute — whoever registers
                  first gets credit. 15% commission on closed-won.
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 4,
              }}
            >
              <Badge text="Deal Reg Protection" color="#3b82f6" />
              <Badge text="35 Partners" color="#22c55e" />
              <Badge text="15% Commission" color="#eab308" />
            </div>
            <div style={{ color: "#333", fontSize: ".7rem", textAlign: "center", marginTop: 4 }}>
              Live config preview updates as you talk ↑
            </div>
          </div>
        </MockWindow>
      </TourSection>

      {/* 2 — Dashboard */}
      <TourSection
        id="dashboard"
        step="Step 2"
        title="Your partner program, at a glance."
        subtitle="Real-time metrics, action items, and trends."
        description="No more logging into Salesforce, exporting to Excel, and building a pivot table to figure out how your partners are doing. Covant shows partner-sourced revenue, pipeline, win rates, and commission burn — all updating in real time from your CRM."
        reverse
      >
        <MockWindow title="covant.ai/dashboard">
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <StatCard label="Partner Revenue" value="$2.4M" trend="↑ 18% vs last quarter" />
            <StatCard label="Active Partners" value="28" trend="↑ 3 this month" />
            <StatCard label="Win Rate" value="34%" trend="↑ 6pts vs direct" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                color: "#888",
                fontSize: ".75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 8,
              }}
            >
              Action Items
            </div>
            {[
              { icon: ClipboardList, text: "3 deal registrations pending review", color: "#3b82f6" },
              { icon: Coins, text: "$12,400 in commissions ready to pay", color: "#eab308" },
              { icon: Users, text: "2 partners haven't completed onboarding", color: "#ef4444" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: i < 2 ? "1px solid #111" : "none",
                }}
              >
                <item.icon size={14} style={{ color: item.color, flexShrink: 0 }} />
                <span style={{ color: "#aaa", fontSize: ".8rem" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </MockWindow>
      </TourSection>

      {/* 3 — Attribution */}
      <TourSection
        id="attribution"
        step="Step 3"
        title="Attribution that partners actually trust."
        subtitle="Every number has a paper trail."
        description="When an AE questions a partner's credit, you don't open a spreadsheet — you open the audit trail. Every deal shows exactly which partner touched it, when, what model was applied, and how the commission was calculated. Step by step. No black boxes."
      >
        <MockWindow title="covant.ai/dashboard/deals/d-7291">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 700 }}>Acme Corp — Enterprise</div>
                <div style={{ color: "#555", fontSize: ".75rem" }}>Deal value: $180,000</div>
              </div>
              <Badge text="Closed Won" color="#22c55e" />
            </div>
            <div
              style={{
                color: "#888",
                fontSize: ".75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 8,
              }}
            >
              Attribution Audit Trail
            </div>
            {[
              {
                partner: "TechBridge Solutions",
                action: "Registered deal",
                date: "Jan 12",
                credit: "100%",
              },
              {
                partner: "TechBridge Solutions",
                action: "Sourced intro meeting",
                date: "Jan 8",
                credit: "—",
              },
              {
                partner: "Apex Growth",
                action: "Technical demo assist",
                date: "Jan 22",
                credit: "0%",
              },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 10px",
                  background: i === 0 ? "#0d1a0d" : "transparent",
                  border: i === 0 ? "1px solid #1a331a" : "none",
                  borderRadius: 6,
                  marginBottom: 4,
                }}
              >
                <div>
                  <span style={{ color: i === 0 ? "#22c55e" : "#666", fontSize: ".8rem", fontWeight: 600 }}>
                    {row.partner}
                  </span>
                  <span style={{ color: "#444", fontSize: ".75rem", marginLeft: 8 }}>{row.action}</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ color: "#444", fontSize: ".7rem" }}>{row.date}</span>
                  <span
                    style={{
                      color: i === 0 ? "#22c55e" : "#333",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      minWidth: 40,
                      textAlign: "right",
                    }}
                  >
                    {row.credit}
                  </span>
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "#111",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Shield size={14} style={{ color: "#3b82f6", flexShrink: 0 }} />
              <span style={{ color: "#666", fontSize: ".75rem", lineHeight: 1.5 }}>
                <strong style={{ color: "#aaa" }}>Model: Deal Reg Protection</strong> — TechBridge
                registered first (Jan 12). Credit: 100% → $180,000 × 15% = <strong style={{ color: "#22c55e" }}>$27,000 commission</strong>
              </span>
            </div>
          </div>
        </MockWindow>
      </TourSection>

      {/* 4 — Partner Portal */}
      <TourSection
        id="portal"
        step="Step 4"
        title="Partners get their own portal."
        subtitle="No more emailing spreadsheets."
        description="Every partner gets a branded portal where they can register deals, track commissions, view their performance metrics, and see their tier status. White-labeled with your branding. Invite link to active in under 10 minutes."
        reverse
      >
        <MockWindow title="partners.covant.ai/portal">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ color: "#fff", fontSize: ".95rem", fontWeight: 700 }}>Welcome back, Sarah</div>
                <div style={{ color: "#555", fontSize: ".75rem" }}>TechBridge Solutions · Gold Partner</div>
              </div>
              <Badge text="Gold" color="#eab308" />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <StatCard label="Your Revenue" value="$840K" trend="↑ 24% YoY" />
              <StatCard label="Commissions" value="$126K" trend="3 pending" />
            </div>
            <div
              style={{
                color: "#888",
                fontSize: ".75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 8,
              }}
            >
              Recent Activity
            </div>
            {[
              { icon: CheckCircle2, text: "Deal approved: Acme Corp ($180K)", color: "#22c55e", time: "2h ago" },
              { icon: Coins, text: "Commission paid: $14,200", color: "#eab308", time: "1d ago" },
              { icon: Bell, text: "New deal registered: GlobalTech", color: "#3b82f6", time: "3d ago" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: i < 2 ? "1px solid #111" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <item.icon size={14} style={{ color: item.color }} />
                  <span style={{ color: "#aaa", fontSize: ".8rem" }}>{item.text}</span>
                </div>
                <span style={{ color: "#333", fontSize: ".7rem" }}>{item.time}</span>
              </div>
            ))}
          </div>
        </MockWindow>
      </TourSection>

      {/* 5 — Commissions */}
      <TourSection
        id="commissions"
        step="Step 5"
        title="Commission rules that match reality."
        subtitle="Not just flat percentages."
        description="Configure commission rules by product line, partner tier, deal size, or geography. Stack rules with priority ordering. Bulk approve payouts at end of quarter. Every payout links back to the deal, the attribution, and the rule that triggered it."
      >
        <MockWindow title="covant.ai/dashboard/settings/commission-rules">
          <div
            style={{
              color: "#888",
              fontSize: ".75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginBottom: 12,
            }}
          >
            Commission Rules
          </div>
          {[
            {
              name: "Enterprise Reseller",
              condition: "Deal > $100K + Gold tier",
              rate: "18%",
              active: true,
            },
            {
              name: "Standard Referral",
              condition: "All referral partners",
              rate: "12%",
              active: true,
            },
            {
              name: "New Partner Bonus",
              condition: "First 3 deals, any tier",
              rate: "20%",
              active: true,
            },
            {
              name: "APAC Override",
              condition: "Territory = APAC",
              rate: "+3%",
              active: false,
            },
          ].map((rule, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                background: "#111",
                borderRadius: 6,
                marginBottom: 6,
                opacity: rule.active ? 1 : 0.5,
              }}
            >
              <div>
                <div style={{ color: "#ccc", fontSize: ".82rem", fontWeight: 600 }}>{rule.name}</div>
                <div style={{ color: "#555", fontSize: ".7rem" }}>{rule.condition}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#22c55e", fontSize: ".85rem", fontWeight: 700 }}>{rule.rate}</span>
                <div
                  style={{
                    width: 32,
                    height: 18,
                    borderRadius: 9,
                    background: rule.active ? "#22c55e" : "#333",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 2,
                      left: rule.active ? 16 : 2,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </MockWindow>
      </TourSection>

      {/* 6 — Deal Registration */}
      <TourSection
        id="deals"
        step="Step 6"
        title="Deal registration that actually works."
        subtitle="Partners register. You approve. Attribution happens."
        description="Partners submit deals through their portal. You review, approve, or reject from your dashboard. Approved deals automatically trigger the right commission rule. No CSV imports, no email chains, no 'who registered this?' debates."
        reverse
      >
        <MockWindow title="covant.ai/dashboard/deals">
          <div
            style={{
              color: "#888",
              fontSize: ".75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginBottom: 12,
            }}
          >
            Pending Deal Registrations
          </div>
          {[
            {
              company: "GlobalTech Inc",
              partner: "TechBridge Solutions",
              value: "$95,000",
              status: "pending",
              date: "Mar 1",
            },
            {
              company: "DataFlow Systems",
              partner: "Apex Growth",
              value: "$220,000",
              status: "pending",
              date: "Feb 28",
            },
            {
              company: "NexaCloud",
              partner: "Stackline",
              value: "$45,000",
              status: "approved",
              date: "Feb 25",
            },
          ].map((deal, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 12px",
                background: "#111",
                borderRadius: 6,
                marginBottom: 6,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: "#ccc", fontSize: ".82rem", fontWeight: 600 }}>{deal.company}</div>
                <div style={{ color: "#555", fontSize: ".7rem" }}>
                  via {deal.partner} · {deal.date}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#aaa", fontSize: ".82rem", fontWeight: 600 }}>{deal.value}</span>
                {deal.status === "pending" ? (
                  <div style={{ display: "flex", gap: 4 }}>
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: 4,
                        background: "#22c55e20",
                        color: "#22c55e",
                        fontSize: ".7rem",
                        fontWeight: 600,
                      }}
                    >
                      Approve
                    </div>
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: 4,
                        background: "#ef444420",
                        color: "#ef4444",
                        fontSize: ".7rem",
                        fontWeight: 600,
                      }}
                    >
                      Reject
                    </div>
                  </div>
                ) : (
                  <Badge text="Approved" color="#22c55e" />
                )}
              </div>
            </div>
          ))}
        </MockWindow>
      </TourSection>

      {/* CTA */}
      <section style={{ padding: "6rem 0 4rem", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 1.5rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-.02em",
              marginBottom: 12,
            }}
          >
            Ready to see it live?
          </h2>
          <p style={{ color: "#666", fontSize: ".95rem", marginBottom: 28, lineHeight: 1.6 }}>
            Explore the full product with sample data — no signup required. Or start building your
            program for free.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 10,
                background: "#fff",
                color: "#000",
                fontWeight: 700,
                fontSize: ".95rem",
                textDecoration: "none",
              }}
            >
              Try the Demo <ArrowRight size={16} />
            </Link>
            <Link
              href="/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 10,
                border: "1px solid #333",
                color: "#ccc",
                fontWeight: 600,
                fontSize: ".95rem",
                textDecoration: "none",
              }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .tour-grid {
            grid-template-columns: 1fr !important;
          }
          .tour-grid > div {
            order: unset !important;
          }
        }
      `}</style>
    </div>
  );
}
