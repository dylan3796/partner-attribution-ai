import Link from "next/link";

export const metadata = { title: "Privacy Policy — Covant" };

export default function PrivacyPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <Link href="/" style={{ color: "#6b7280", fontSize: ".85rem", textDecoration: "none" }}>← covant.ai</Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "2rem", marginBottom: ".5rem", color: "#fff" }}>Privacy Policy</h1>
        <p style={{ color: "#6b7280", fontSize: ".9rem", marginBottom: "3rem" }}>Last updated: March 1, 2026</p>

        <Section title="Overview">
          <p>Covant, Inc. ("Covant," "we," "us") operates covant.ai and related services. This policy explains what data we collect, how we use it, and your rights.</p>
          <p>We built Covant to handle partner programs, commissions, and attribution. Your data — and your partners' data — is yours. We don't sell it, train models on it, or share it except as described below.</p>
        </Section>

        <Section title="What we collect">
          <h3>Account data</h3>
          <p>When you sign up: email address, name, and password (hashed via Clerk). If you use Google SSO, we receive your email and name from Google.</p>

          <h3>Program data</h3>
          <p>Data you enter into Covant: partner names and contact info, deal records, commission configurations, payout history, attribution rules, and audit logs. This data is stored in our database (Convex) and is scoped to your organization.</p>

          <h3>Usage data</h3>
          <p>Basic analytics: pages visited, features used, error logs. We use this to improve the product. We do not build profiles for advertising purposes.</p>

          <h3>Billing data</h3>
          <p>Payment details are handled entirely by Stripe. We never see or store raw card numbers. We store your Stripe customer ID and subscription status.</p>

          <h3>Communications</h3>
          <p>If you email us or reply to onboarding emails, we keep those records to provide support.</p>
        </Section>

        <Section title="How we use your data">
          <ul>
            <li>To operate and improve Covant</li>
            <li>To send transactional emails (deal notifications, commission alerts, invoices) via Resend</li>
            <li>To process payments via Stripe</li>
            <li>To authenticate your account via Clerk</li>
            <li>To provide customer support</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p>We do not use your data to train AI models. We do not sell your data to third parties.</p>
        </Section>

        <Section title="Subprocessors">
          <p>We use the following services to operate Covant. Each has their own privacy program:</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem", marginTop: "1rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                <Th>Vendor</Th><Th>Purpose</Th><Th>Data location</Th>
              </tr>
            </thead>
            <tbody>
              <Tr v="Vercel" p="Hosting / CDN" l="US + global edge" />
              <Tr v="Convex" p="Database" l="US (AWS us-east-1)" />
              <Tr v="Clerk" p="Authentication" l="US" />
              <Tr v="Stripe" p="Billing" l="US" />
              <Tr v="Resend" p="Transactional email" l="US" />
              <Tr v="Groq" p="AI inference (program setup)" l="US" />
            </tbody>
          </table>
          <p style={{ marginTop: "1rem" }}>For a full, up-to-date list email <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a>.</p>
        </Section>

        <Section title="Data retention">
          <p>We retain your data for as long as your account is active. If you cancel, we retain data for 90 days to allow for recovery, then delete it.</p>
          <p>You can request immediate deletion at any time — see "Your rights" below.</p>
          <p>Audit logs are retained per your plan (30 days on Free, 90 days on Starter, 1 year on Growth, unlimited on Scale).</p>
        </Section>

        <Section title="Your rights">
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of all data we hold about you</li>
            <li><strong>Correction</strong> — fix inaccurate data</li>
            <li><strong>Deletion</strong> — request we delete your account and all associated data</li>
            <li><strong>Portability</strong> — export your data in a machine-readable format (CSV export is available in the dashboard)</li>
            <li><strong>Objection</strong> — object to certain processing</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a>. We respond within 30 days.</p>
        </Section>

        <Section title="GDPR">
          <p>If you're in the European Economic Area (EEA), UK, or Switzerland, you have additional rights under GDPR. Our legal basis for processing is:</p>
          <ul>
            <li><strong>Contract performance</strong> — processing needed to operate the service you signed up for</li>
            <li><strong>Legitimate interests</strong> — product improvement, fraud prevention, security</li>
            <li><strong>Legal obligation</strong> — where required by law</li>
          </ul>
          <p>For EU customers, a Data Processing Agreement (DPA) is available at <Link href="/dpa" style={{ color: "#6366f1" }}>covant.ai/dpa</Link>.</p>
        </Section>

        <Section title="CCPA (California)">
          <p>California residents have the right to know what personal information we collect, delete it, and opt out of its sale. We do not sell personal information. To exercise your rights, email <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a>.</p>
        </Section>

        <Section title="Cookies">
          <p>We use cookies for authentication (Clerk session tokens) and to remember your preferences. We do not use third-party advertising cookies.</p>
        </Section>

        <Section title="Security">
          <p>See our <Link href="/security" style={{ color: "#6366f1" }}>Security page</Link> for details on how we protect your data.</p>
        </Section>

        <Section title="Changes">
          <p>We'll notify you by email if we make material changes to this policy. The "last updated" date at the top always reflects the current version.</p>
        </Section>

        <Section title="Contact">
          <p>Questions? Email <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a>.</p>
          <p style={{ marginTop: ".5rem", color: "#6b7280", fontSize: ".85rem" }}>Covant, Inc. · San Francisco, CA</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#fff", marginBottom: "1rem", paddingBottom: ".5rem", borderBottom: "1px solid #1f1f1f" }}>{title}</h2>
      <div style={{ color: "#aaa", fontSize: ".9rem", lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500 }}>{children}</th>;
}

function Tr({ v, p, l }: { v: string; p: string; l: string }) {
  return (
    <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
      <td style={{ padding: "8px 12px", color: "#e5e5e5" }}>{v}</td>
      <td style={{ padding: "8px 12px" }}>{p}</td>
      <td style={{ padding: "8px 12px" }}>{l}</td>
    </tr>
  );
}
