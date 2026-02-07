import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ marginTop: 70, padding: "7rem 0 3rem", textAlign: "center" }} id="product">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.2rem" }}>
            Introducing Partner Attribution AI
          </h1>
          <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "var(--muted)", marginBottom: "2.5rem", lineHeight: 1.4 }}>
            Attribution reimagined, with AI to understand and intelligence to calculate
          </p>
          <div style={{ display: "flex", gap: "0.5rem", maxWidth: 480, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Enter your work email"
              className="input"
              style={{ flex: 1 }}
            />
            <button className="btn-primary" style={{ whiteSpace: "nowrap" }}>Get early access</button>
          </div>
          <p style={{ marginTop: "0.8rem", fontSize: "0.85rem", color: "var(--muted)" }}>Free to start · No credit card required</p>
        </div>

        {/* Demo Card */}
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", position: "relative", marginTop: "4rem" }}>
          <div className="orb" style={{ top: "-15%", left: "10%", right: "10%", height: 500, position: "absolute" }} />
          <div className="card" style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1.2rem", borderBottom: "1px solid var(--border)" }}>
              <strong>Partner AI</strong>
              <span className="badge badge-neutral">Michael Chen</span>
            </div>
            <p style={{ padding: "1.5rem 0", color: "var(--muted)", fontSize: "1.05rem" }}>Who should get credit for the Acme deal?</p>
            <div style={{ background: "var(--subtle)", padding: "1.5rem", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", fontSize: "0.95rem" }}>
                <span className="tag" style={{ margin: 0 }}>AI</span> Analyzed 47 touchpoints across 6 partners
              </div>
              <p style={{ margin: "0.6rem 0", lineHeight: 1.5 }}><strong>Sarah (Referral)</strong> — 40% · Initial intro, 3 follow-up emails</p>
              <p style={{ margin: "0.6rem 0", lineHeight: 1.5 }}><strong>Marcus (Integration)</strong> — 35% · Technical demo, implementation support</p>
              <p style={{ margin: "0.6rem 0", lineHeight: 1.5 }}><strong>Elena (Content)</strong> — 25% · Case study that influenced decision</p>
              <p style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--muted)" }}>
                Confidence: 97% · Based on timestamps and touchpoint types
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1 */}
      <section style={{ padding: "7rem 0" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="tag" style={{ marginBottom: "1.5rem" }}>AI-Powered Attribution</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.2rem" }}>Your attribution expert</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>Every partnership has someone who just <em style={{ fontWeight: 700 }}>gets it</em>. They know who touched what, when deals moved, and how credit should split.</p>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>That's your Partner AI assistant — a capable analyst who understands your partnerships and calculates attribution with remarkable precision.</p>
            <Link href="/dashboard/reports" style={{ fontWeight: 600, fontSize: "1rem", display: "inline-block", marginTop: "0.5rem" }}>See attribution models →</Link>
          </div>
          <div className="card">
            <h4 style={{ marginBottom: "1.2rem" }}>Attribution Model: Time-Weighted</h4>
            <BarRow label="Partner A" pct={45} />
            <BarRow label="Partner B" pct={30} />
            <BarRow label="Partner C" pct={25} />
          </div>
        </div>
      </section>

      {/* Feature 2 */}
      <section style={{ padding: "7rem 0" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", direction: "rtl" }}>
          <div style={{ direction: "ltr" }}>
            <span className="tag" style={{ marginBottom: "1.5rem" }}>Context Graph</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.2rem" }}>Every touchpoint, automatically tracked</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>Partner AI captures all interactions and updates itself automatically. You never lift a finger, but you're always in control.</p>
            <Link href="/dashboard/deals/1" style={{ fontWeight: 600, fontSize: "1rem", display: "inline-block", marginTop: "0.5rem" }}>See deal timeline →</Link>
          </div>
          <div className="card" style={{ direction: "ltr" }}>
            <TimelineItem title="Partner A introduced lead" sub="Jan 15 · Email referral" />
            <TimelineItem title="Partner B demo call" sub="Jan 22 · Technical walkthrough" />
            <TimelineItem title="Partner C case study shared" sub="Jan 28 · Content influence" />
            <TimelineItem title="Deal closed" sub="Feb 1 · $50,000 ARR" active />
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section style={{ padding: "7rem 0" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="tag" style={{ marginBottom: "1.5rem" }}>Automated Payouts</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.2rem" }}>Fair splits, zero manual work</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>Let Partner AI calculate payouts, create invoices, or pull context across your existing tools. Fair attribution means fair compensation.</p>
            <Link href="/dashboard/partners" style={{ fontWeight: 600, fontSize: "1rem", display: "inline-block", marginTop: "0.5rem" }}>Manage partners →</Link>
          </div>
          <div className="card">
            <h4 style={{ marginBottom: "1rem" }}>January Payouts</h4>
            <PayoutRow initials="SA" name="Sarah Anderson" amount="$12,450" />
            <PayoutRow initials="MJ" name="Marcus Johnson" amount="$8,920" />
            <PayoutRow initials="ER" name="Elena Rodriguez" amount="$5,630" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "5rem 0", background: "var(--subtle)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.8rem" }}>Frontier models</h3>
            <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.6 }}>Built on AI-native foundations that get smarter with every model release.</p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.8rem" }}>Complete attribution</h3>
            <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.6 }}>Give Partner AI your deals, touchpoints, and partners — it calculates like a seasoned expert.</p>
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
            The new standard in partner attribution
          </h2>
          <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "var(--muted)", marginBottom: "2.5rem", lineHeight: 1.4 }}>
            Partnerships got spreadsheets. Attribution gets Partner AI.
          </p>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "1rem 2.5rem", borderRadius: "var(--radius)", fontSize: "1.1rem" }}>
            Get started
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
            <FooterCol title="Product" links={["Features", "API & SDK", "Pricing"]} />
            <FooterCol title="Company" links={["About", "Blog", "Careers"]} />
            <FooterCol title="Legal" links={["Terms", "Privacy", "Data Policy"]} />
            <FooterCol title="Social" links={["LinkedIn", "X (Twitter)", "Discord"]} />
          </div>
        </div>
      </footer>
    </>
  );
}

function BarRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.2rem 0" }}>
      <span style={{ width: 90, fontWeight: 500, fontSize: "0.9rem" }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "var(--fg)", borderRadius: 4 }} />
      </div>
      <span style={{ width: 45, textAlign: "right", fontWeight: 600, fontSize: "0.9rem" }}>{pct}%</span>
    </div>
  );
}

function TimelineItem({ title, sub, active }: { title: string; sub: string; active?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "1.2rem", margin: "1.5rem 0", position: "relative" }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: active ? "var(--fg)" : "var(--border)", flexShrink: 0, marginTop: 3 }} />
      <div>
        <strong style={{ fontSize: "0.95rem" }}>{title}</strong><br />
        <small style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{sub}</small>
      </div>
    </div>
  );
}

function PayoutRow({ initials, name, amount }: { initials: string; name: string; amount: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.8rem", background: "var(--subtle)", borderRadius: 8, margin: "0.6rem 0" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--fg)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "0.75rem", flexShrink: 0 }}>{initials}</div>
      <span style={{ flex: 1 }}>{name}</span>
      <strong style={{ fontSize: "1.05rem" }}>{amount}</strong>
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
