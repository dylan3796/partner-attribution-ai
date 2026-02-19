import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Covant",
  description: "How Covant collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  const lastUpdated = "February 18, 2026";

  return (
    <div style={{ background: "#0c0c0c", minHeight: "100vh", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/" style={{ color: "#6366f1", fontSize: ".9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: ".25rem", marginBottom: "1.5rem" }}>
            ← Back to Covant
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: ".5rem" }}>Privacy Policy</h1>
          <p style={{ color: "#666", fontSize: ".9rem" }}>Last updated: {lastUpdated}</p>
        </div>

        <div style={{ color: "#aaa", lineHeight: 1.8, fontSize: ".95rem" }}>
          <Section title="1. Overview">
            Covant (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the partner intelligence platform at covant.ai. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </Section>

          <Section title="2. Information We Collect">
            <p style={{ marginBottom: "1rem" }}>We collect information you provide directly to us, including:</p>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
              <li style={{ marginBottom: ".5rem" }}>Account information (name, email address, company name)</li>
              <li style={{ marginBottom: ".5rem" }}>Partner program data (deal registrations, commission records, partner profiles)</li>
              <li style={{ marginBottom: ".5rem" }}>Usage data (pages visited, features used, actions taken in the platform)</li>
              <li style={{ marginBottom: ".5rem" }}>Communications you send to us</li>
            </ul>
            <p>We also automatically collect certain technical information, including IP address, browser type, device identifiers, and log data.</p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li style={{ marginBottom: ".5rem" }}>To provide and maintain the Covant platform</li>
              <li style={{ marginBottom: ".5rem" }}>To process partner program operations (attribution, commissions, payouts)</li>
              <li style={{ marginBottom: ".5rem" }}>To send transactional communications (deal approvals, commission notifications)</li>
              <li style={{ marginBottom: ".5rem" }}>To improve and develop new features</li>
              <li style={{ marginBottom: ".5rem" }}>To comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing">
            <p style={{ marginBottom: "1rem" }}>We do not sell your personal information. We may share data with:</p>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li style={{ marginBottom: ".5rem" }}><strong style={{ color: "#fff" }}>Service providers</strong> — infrastructure, hosting, payment processing (Stripe), email delivery (Resend)</li>
              <li style={{ marginBottom: ".5rem" }}><strong style={{ color: "#fff" }}>Your partners</strong> — attribution and payout data is shared with the relevant partner organizations you manage</li>
              <li style={{ marginBottom: ".5rem" }}><strong style={{ color: "#fff" }}>Legal requirements</strong> — when required by law or to protect rights and safety</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            We implement industry-standard security measures including encryption in transit (TLS), hashed session tokens, and access controls. Your data is stored on Convex infrastructure with built-in security guarantees. We are working toward SOC 2 Type II certification (expected Q4 2026).
          </Section>

          <Section title="6. Data Retention">
            We retain your data for as long as your account is active or as needed to provide services. Partner transaction records (deals, attributions, payouts) are retained for a minimum of 7 years for financial compliance purposes. You may request deletion of other data at any time.
          </Section>

          <Section title="7. Your Rights">
            <p style={{ marginBottom: "1rem" }}>Depending on your location, you may have the right to:</p>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li style={{ marginBottom: ".5rem" }}>Access the personal data we hold about you</li>
              <li style={{ marginBottom: ".5rem" }}>Correct inaccurate data</li>
              <li style={{ marginBottom: ".5rem" }}>Delete your data (subject to retention requirements)</li>
              <li style={{ marginBottom: ".5rem" }}>Export your data in a portable format</li>
              <li style={{ marginBottom: ".5rem" }}>Opt out of marketing communications</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a>.</p>
          </Section>

          <Section title="8. Cookies">
            We use strictly necessary cookies for session authentication. We do not use third-party tracking cookies or advertising cookies. You can control cookie settings in your browser, though disabling session cookies will prevent you from logging in.
          </Section>

          <Section title="9. International Transfers">
            Covant is based in the United States. If you are located outside the US, your data may be transferred to and processed in the US. We take appropriate safeguards to ensure your data remains protected.
          </Section>

          <Section title="10. Changes to This Policy">
            We may update this Privacy Policy periodically. We will notify you of significant changes by email or through the platform. Continued use of Covant after changes constitutes acceptance of the updated policy.
          </Section>

          <Section title="11. Contact">
            <p>Questions about this Privacy Policy? Contact us:</p>
            <p style={{ marginTop: ".75rem" }}>
              <strong style={{ color: "#fff" }}>Covant</strong><br />
              Email: <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a><br />
              Website: <a href="https://covant.ai" style={{ color: "#6366f1" }}>covant.ai</a>
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: "1rem" }}>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
