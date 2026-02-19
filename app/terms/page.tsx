import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Covant",
  description: "Terms governing your use of the Covant partner intelligence platform.",
};

export default function TermsPage() {
  const lastUpdated = "February 18, 2026";

  return (
    <div style={{ background: "#0c0c0c", minHeight: "100vh", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/" style={{ color: "#6366f1", fontSize: ".9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: ".25rem", marginBottom: "1.5rem" }}>
            ← Back to Covant
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: ".5rem" }}>Terms of Service</h1>
          <p style={{ color: "#666", fontSize: ".9rem" }}>Last updated: {lastUpdated}</p>
        </div>

        <div style={{ color: "#aaa", lineHeight: 1.8, fontSize: ".95rem" }}>
          <Section title="1. Acceptance of Terms">
            By accessing or using the Covant platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these terms.
          </Section>

          <Section title="2. Description of Service">
            Covant provides partner program management software, including partner attribution tracking, commission calculation, payout automation, deal registration, and related features. The Service is provided &quot;as is&quot; and &quot;as available.&quot;
          </Section>

          <Section title="3. Account Registration">
            <p style={{ marginBottom: "1rem" }}>You must provide accurate information when creating an account. You are responsible for:</p>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li style={{ marginBottom: ".5rem" }}>Maintaining the security of your account credentials</li>
              <li style={{ marginBottom: ".5rem" }}>All activity that occurs under your account</li>
              <li style={{ marginBottom: ".5rem" }}>Ensuring your use complies with applicable laws and regulations</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p style={{ marginBottom: "1rem" }}>You agree not to:</p>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li style={{ marginBottom: ".5rem" }}>Use the Service for unlawful purposes or to violate any regulations</li>
              <li style={{ marginBottom: ".5rem" }}>Attempt to gain unauthorized access to the Service or other users&apos; accounts</li>
              <li style={{ marginBottom: ".5rem" }}>Transmit malware, viruses, or other harmful code</li>
              <li style={{ marginBottom: ".5rem" }}>Reverse engineer, decompile, or disassemble the Service</li>
              <li style={{ marginBottom: ".5rem" }}>Resell or redistribute the Service without written permission</li>
            </ul>
          </Section>

          <Section title="5. Data and Privacy">
            Your use of the Service is governed by our <Link href="/privacy" style={{ color: "#6366f1" }}>Privacy Policy</Link>. You retain ownership of all data you input into the Service. By using the Service, you grant Covant a limited license to process your data solely to provide the Service.
          </Section>

          <Section title="6. Payment and Billing">
            <p style={{ marginBottom: "1rem" }}>Paid plans are billed monthly or annually in advance. All fees are non-refundable except as required by law. Covant reserves the right to modify pricing with 30 days&apos; written notice.</p>
            <p>Failure to pay may result in suspension of service. Accounts suspended for non-payment may be terminated after 60 days.</p>
          </Section>

          <Section title="7. Intellectual Property">
            The Service, including all software, algorithms, and content, is owned by Covant and protected by intellectual property laws. These Terms do not grant you any rights to our intellectual property except the limited right to use the Service.
          </Section>

          <Section title="8. Confidentiality">
            Each party agrees to keep the other&apos;s non-public information confidential and to use it only in connection with the Service. This obligation survives termination for 3 years.
          </Section>

          <Section title="9. Warranties and Disclaimers">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. COVANT DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF SECURITY VULNERABILITIES. USE OF THE SERVICE IS AT YOUR OWN RISK.
          </Section>

          <Section title="10. Limitation of Liability">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, COVANT&apos;S TOTAL LIABILITY FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE FEES YOU PAID IN THE 12 MONTHS PRIOR TO THE CLAIM. COVANT IS NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.
          </Section>

          <Section title="11. Indemnification">
            You agree to indemnify and hold harmless Covant from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
          </Section>

          <Section title="12. Termination">
            Either party may terminate this agreement at any time. Covant may suspend or terminate your access immediately for violations of these Terms. Upon termination, your right to use the Service ceases and you must delete any cached data.
          </Section>

          <Section title="13. Governing Law">
            These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in San Francisco, California.
          </Section>

          <Section title="14. Changes to Terms">
            Covant may modify these Terms at any time. We will provide 30 days&apos; notice for material changes. Continued use of the Service after changes constitutes acceptance.
          </Section>

          <Section title="15. Contact">
            <p>Questions about these Terms?</p>
            <p style={{ marginTop: ".75rem" }}>
              <strong style={{ color: "#fff" }}>Covant</strong><br />
              Email: <a href="mailto:legal@covant.ai" style={{ color: "#6366f1" }}>legal@covant.ai</a><br />
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
