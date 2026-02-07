import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ marginTop: 70, padding: "7rem 0 3rem", textAlign: "center" }} id="product">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
          <span className="tag" style={{ marginBottom: "1.5rem" }}>Now in early access</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.2rem" }}>
            The AI-native partner platform
          </h1>
          <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "var(--muted)", marginBottom: "2.5rem", lineHeight: 1.4, maxWidth: 680, margin: "0 auto 2.5rem" }}>
            Run your entire partner program from one platform. Attribution, incentives, program management, partner portal — powered by AI that actually understands partnerships.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", maxWidth: 480, margin: "0 auto" }}>
            <input type="email" placeholder="Enter your work email" className="input" style={{ flex: 1 }} />
            <button className="btn-primary" style={{ whiteSpace: "nowrap" }}>Get early access</button>
          </div>
          <p style={{ marginTop: "0.8rem", fontSize: "0.85rem", color: "var(--muted)" }}>Free to start · No credit card required</p>
        </div>

        {/* Demo Card */}
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", position: "relative", marginTop: "4rem" }}>
          <div className="orb" style={{ top: "-15%", left: "10%", right: "10%", height: 500, position: "absolute" }} />
          <div className="card" style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1.2rem", borderBottom: "1px solid var(--border)" }}>
              <strong>Partner AI</strong>
              <span className="badge badge-neutral">VP Partnerships · Acme Inc</span>
            </div>
            <p style={{ padding: "1.5rem 0", color: "var(--muted)", fontSize: "1.05rem" }}>Show me Q1 partner performance and who's ready for tier promotion</p>
            <div style={{ background: "var(--subtle)", padding: "1.5rem", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", fontSize: "0.95rem" }}>
                <span className="tag" style={{ margin: 0 }}>AI</span> Analyzed 24 partners, 142 deals, 847 touchpoints
              </div>
              <p style={{ margin: "0.8rem 0", lineHeight: 1.6 }}><strong>TechStar Solutions</strong> — $124k attributed revenue (↑32%), 8 deals closed. Exceeded Gold tier by 40%. <em>Recommend: Platinum promotion + increased MDF.</em></p>
              <p style={{ margin: "0.8rem 0", lineHeight: 1.6 }}><strong>CloudBridge Partners</strong> — $89k attributed, strong pipeline ($215k open). First-touch leader. <em>Recommend: Co-sell training + joint webinar.</em></p>
              <p style={{ margin: "0.8rem 0", lineHeight: 1.6 }}><strong>3 partners at risk</strong> — No activity in 30+ days. Auto-triggered re-engagement sequences.</p>
              <p style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--muted)" }}>
                Full report exported to your dashboard · Tier promotions queued for approval
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section style={{ padding: "5rem 0", background: "var(--subtle)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "2rem" }}>Sound familiar?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", textAlign: "left" }}>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📊</p>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Spreadsheet hell</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Partner data lives in 12 different spreadsheets. Nobody trusts the numbers.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤷</p>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Who gets credit?</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Partners argue about attribution. You're the referee with no data to back it up.</p>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>💸</p>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Payout chaos</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Commissions are calculated manually. Partners wait weeks. Finance hates you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section style={{ padding: "7rem 0" }} id="platform">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", textAlign: "center", marginBottom: "4rem" }}>
          <span className="tag" style={{ marginBottom: "1.5rem" }}>The Platform</span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1rem" }}>One platform for your entire partner operation</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>Everything your partner team needs, powered by AI that learns how your partnerships actually work.</p>
        </div>

        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          <ModuleCard emoji="🧠" title="AI Attribution" desc="5 attribution models plus AI that learns which model best predicts your actual outcomes. Transparent, auditable, trusted." link="/dashboard/reports" />
          <ModuleCard emoji="💰" title="Incentives & Payouts" desc="Auto-calculated commissions, tiered structures, SPIFs, and one-click payouts. Partners get paid on time, every time." link="/dashboard/partners" />
          <ModuleCard emoji="📋" title="Program Management" desc="Partner tiers, onboarding workflows, certifications, territory management. Run your program, not spreadsheets." link="/dashboard" />
          <ModuleCard emoji="📊" title="Revenue Intelligence" desc="Pipeline visibility, revenue forecasting, deal registration, co-sell tracking. Know which partners actually drive growth." link="/dashboard/deals" />
          <ModuleCard emoji="🌐" title="Partner Portal" desc="Self-service portal where partners see their performance, register deals, access content, and track commissions." link="/dashboard/partners/1" />
          <ModuleCard emoji="🔗" title="Integrations" desc="Connect your CRM, marketing tools, and billing. Salesforce, HubSpot, Stripe — touchpoints flow in automatically." link="/dashboard/settings" />
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: "7rem 0" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="tag" style={{ marginBottom: "1.5rem" }}>How It Works</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.2rem" }}>Attribution powers everything</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>Most partner platforms treat attribution as a reporting feature. We made it the foundation.</p>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>Every module — incentives, program management, revenue ops, analytics — is powered by real-time attribution intelligence. The result: <em style={{ fontWeight: 700 }}>decisions backed by data, not gut feel.</em></p>
            <Link href="/dashboard" style={{ fontWeight: 600, fontSize: "1rem" }}>See the dashboard →</Link>
          </div>
          <div className="card">
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ display: "inline-block", padding: "1rem 2rem", background: "var(--fg)", color: "var(--bg)", borderRadius: 8, fontWeight: 700, fontSize: "0.9rem", marginBottom: "1.5rem" }}>🧠 Attribution Engine</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginTop: "0.5rem" }}>
                {["Incentive Calculations", "Tier Promotions", "Revenue Forecasts", "Partner Scoring", "Payout Amounts", "Program Decisions"].map((item) => (
                  <div key={item} style={{ padding: "0.7rem", background: "var(--subtle)", borderRadius: 8, fontSize: "0.85rem", fontWeight: 500 }}>
                    ↓ {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: "7rem 0", background: "var(--subtle)" }} id="pricing">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1rem" }}>Built for how you run partnerships</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 600, margin: "0 auto" }}>Whether you manage 5 partners or 5,000, one platform scales with you.</p>
        </div>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          <SegmentCard title="SaaS Channel" desc="Resellers, VARs, co-sell partners. Track ARR attribution through the full customer lifecycle." examples="Salesforce, HubSpot, AWS" />
          <SegmentCard title="Marketplaces" desc="App ecosystems, plugin marketplaces. Measure which partners drive platform adoption." examples="Shopify, Atlassian, Stripe" />
          <SegmentCard title="Distribution" desc="Multi-tier channel partners, distributors, resellers. Attribution across complex chains." examples="Dell, Cisco, HP" />
          <SegmentCard title="Agencies & Services" desc="Referral networks, consulting partners. Track lead quality, not just quantity." examples="Deloitte, boutique agencies" />
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: "5rem 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.8rem" }}>AI-native architecture</h3>
            <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.6 }}>Not a legacy PRM with AI bolted on. Built from scratch for the AI era.</p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.8rem" }}>15 minutes to value</h3>
            <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.6 }}>Import your partners, connect your CRM, and see your first attribution report in minutes.</p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.8rem" }}>Enterprise security</h3>
            <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.6 }}>Your data is never used to train models. SOC 2 Type 2 compliant from day one.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "9rem 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
            Stop managing partnerships in spreadsheets
          </h2>
          <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "var(--muted)", marginBottom: "2.5rem", lineHeight: 1.4 }}>
            Your partners deserve better. So does your team.
          </p>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "1rem 2.5rem", borderRadius: "var(--radius)", fontSize: "1.1rem" }}>
            Get started free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--fg)", color: "var(--bg)", padding: "3.5rem 0 2rem" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 3fr", gap: "3rem" }}>
          <div>
            <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "white" }}>Partner<span style={{ fontWeight: 400 }}>AI</span></span>
            <p style={{ color: "var(--muted)", marginTop: "0.8rem", fontSize: "0.9rem" }}>© 2026 Partner AI, Inc.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
            <FooterCol title="Platform" links={["Attribution", "Incentives", "Program Mgmt", "Partner Portal", "Integrations"]} />
            <FooterCol title="Solutions" links={["SaaS Channel", "Marketplaces", "Distribution", "Agencies"]} />
            <FooterCol title="Company" links={["About", "Blog", "Careers", "Contact"]} />
            <FooterCol title="Legal" links={["Terms", "Privacy", "Security", "DPA"]} />
          </div>
        </div>
      </footer>
    </>
  );
}

function ModuleCard({ emoji, title, desc, link }: { emoji: string; title: string; desc: string; link: string }) {
  return (
    <Link href={link}>
      <div className="card" style={{ height: "100%", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}>
        <p style={{ fontSize: "1.8rem", marginBottom: "0.8rem" }}>{emoji}</p>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.6rem" }}>{title}</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.5 }}>{desc}</p>
      </div>
    </Link>
  );
}

function SegmentCard({ title, desc, examples }: { title: string; desc: string; examples: string }) {
  return (
    <div className="card" style={{ background: "white" }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.6rem" }}>{title}</h3>
      <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "0.8rem" }}>{desc}</p>
      <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic" }}>{examples}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 style={{ fontSize: "0.85rem", marginBottom: "0.8rem", color: "white" }}>{title}</h4>
      {links.map((l) => (
        <a key={l} href="#" style={{ display: "block", color: "var(--muted)", fontSize: "0.85rem", margin: "0.4rem 0" }}>{l}</a>
      ))}
    </div>
  );
}
