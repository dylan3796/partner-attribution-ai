import Link from "next/link";

export const metadata = { title: "Data Processing Agreement — Covant" };

export default function DPAPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <Link href="/" style={{ color: "#6b7280", fontSize: ".85rem", textDecoration: "none" }}>← covant.ai</Link>

        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "2rem", marginBottom: ".5rem", color: "#fff" }}>Data Processing Agreement</h1>
        <p style={{ color: "#6b7280", fontSize: ".9rem", marginBottom: ".5rem" }}>Last updated: March 1, 2026</p>
        <p style={{ color: "#aaa", fontSize: ".88rem", lineHeight: 1.65, marginBottom: "3rem" }}>
          This DPA applies to all customers of Covant who process personal data of EU/EEA, UK, or Swiss data subjects. By using Covant, you agree to this DPA as part of our <Link href="/terms" style={{ color: "#6366f1" }}>Terms of Service</Link>.
        </p>

        <Section title="1. Definitions">
          <ul>
            <li><strong>"Controller"</strong> — you (the Covant customer), who determines the purposes and means of processing personal data.</li>
            <li><strong>"Processor"</strong> — Covant, Inc., which processes personal data on your behalf.</li>
            <li><strong>"Personal Data"</strong> — any information relating to an identified or identifiable natural person, as defined in GDPR Article 4(1).</li>
            <li><strong>"Processing"</strong> — any operation performed on personal data, including storage, retrieval, and deletion.</li>
            <li><strong>"GDPR"</strong> — EU General Data Protection Regulation 2016/679.</li>
            <li><strong>"Sub-processor"</strong> — any third party engaged by Covant to process personal data.</li>
          </ul>
        </Section>

        <Section title="2. Scope and purpose">
          <p>Covant processes personal data submitted to the Service by you (the Controller) for the sole purpose of providing the Covant partner program management platform.</p>
          <p><strong>Categories of personal data processed:</strong></p>
          <ul>
            <li>Contact information of partners and customers (name, email, company)</li>
            <li>Deal and transaction records</li>
            <li>Commission and payout data</li>
            <li>Account credentials (hashed, managed by Clerk)</li>
            <li>Usage and activity logs</li>
          </ul>
          <p><strong>Categories of data subjects:</strong> Your employees, your partners, and your partners' contacts who interact with the Covant platform.</p>
        </Section>

        <Section title="3. Processor obligations">
          <p>Covant agrees to:</p>
          <ul>
            <li>Process personal data only on your documented instructions (i.e., to provide the Service)</li>
            <li>Ensure persons authorized to process personal data are bound by confidentiality</li>
            <li>Implement appropriate technical and organizational security measures (see <Link href="/security" style={{ color: "#6366f1" }}>Security page</Link>)</li>
            <li>Assist you in responding to data subject rights requests</li>
            <li>Assist you with breach notification obligations under GDPR Article 33</li>
            <li>Delete or return all personal data upon termination of the Service</li>
            <li>Make available information necessary to demonstrate compliance with GDPR Article 28</li>
          </ul>
        </Section>

        <Section title="4. Sub-processors">
          <p>You authorize Covant to use the following sub-processors to provide the Service:</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem", marginTop: "1rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                <Th>Sub-processor</Th><Th>Purpose</Th><Th>Location</Th>
              </tr>
            </thead>
            <tbody>
              <Tr v="Vercel, Inc." p="Application hosting" l="US + global CDN" />
              <Tr v="Convex, Inc." p="Database storage" l="US (AWS us-east-1)" />
              <Tr v="Clerk, Inc." p="Authentication" l="US" />
              <Tr v="Stripe, Inc." p="Payment processing" l="US" />
              <Tr v="Resend, Inc." p="Transactional email" l="US" />
              <Tr v="Groq, Inc." p="AI inference (setup only)" l="US" />
            </tbody>
          </table>
          <p style={{ marginTop: "1rem" }}>We will notify you at least 14 days before adding or changing a sub-processor. You may object to changes within 14 days of notification. If we cannot address your objection, you may terminate the Service for cause.</p>
        </Section>

        <Section title="5. International data transfers">
          <p>Personal data processed under this DPA may be transferred to and stored in the United States. Such transfers are based on:</p>
          <ul>
            <li>Standard Contractual Clauses (SCCs) adopted by the European Commission where applicable</li>
            <li>Our sub-processors' participation in recognized transfer mechanisms (e.g., Vercel, Stripe, and Clerk are all US entities with EU SCCs available)</li>
          </ul>
          <p>For transfers from the UK, we rely on the International Data Transfer Agreement (IDTA) as the transfer mechanism.</p>
        </Section>

        <Section title="6. Data subject rights">
          <p>When you receive a data subject rights request (access, correction, deletion, portability), we will:</p>
          <ul>
            <li>Assist you in fulfilling the request within the timelines required by GDPR</li>
            <li>Not respond directly to data subjects about their rights without your authorization, except to direct them to you as the Controller</li>
          </ul>
          <p>You can export all data from the Covant dashboard at any time. To request full deletion of an organization's data, email <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a>.</p>
        </Section>

        <Section title="7. Security and breach notification">
          <p>Covant maintains appropriate technical and organizational measures to protect personal data against unauthorized access, disclosure, alteration, or destruction. See our <Link href="/security" style={{ color: "#6366f1" }}>Security page</Link>.</p>
          <p>In the event of a personal data breach affecting your data, Covant will:</p>
          <ul>
            <li>Notify you without undue delay (within 72 hours of becoming aware) at the email address on your account</li>
            <li>Provide details sufficient for you to fulfill your GDPR Article 33 notification obligation to your supervisory authority</li>
            <li>Cooperate with your investigation and remediation efforts</li>
          </ul>
        </Section>

        <Section title="8. Audit rights">
          <p>You may request an audit of Covant's processing activities to verify compliance with this DPA. Requests must be:</p>
          <ul>
            <li>Made in writing to <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a></li>
            <li>Made no more than once per 12-month period unless required by a regulatory authority</li>
            <li>At your cost for any third-party auditor</li>
          </ul>
          <p>Once SOC 2 Type II certification is complete (target Q4 2026), we will provide our audit report in lieu of a direct audit.</p>
        </Section>

        <Section title="9. Term and termination">
          <p>This DPA is in effect for the duration of your Covant subscription. Upon termination:</p>
          <ul>
            <li>Covant will retain your data for 90 days to allow for recovery</li>
            <li>After 90 days, all personal data will be deleted from production systems</li>
            <li>Backup copies will be deleted within 180 days of termination</li>
            <li>You may request immediate deletion at any time</li>
          </ul>
        </Section>

        <Section title="10. Contact and signed copies">
          <p>This DPA is automatically incorporated into your agreement with Covant by accepting the Terms of Service. No separate signature is required for standard use.</p>
          <p>Enterprise customers requiring a countersigned DPA should email <a href="mailto:legal@covant.ai" style={{ color: "#6366f1" }}>legal@covant.ai</a>. We'll respond within 3 business days.</p>
          <p style={{ marginTop: "1.5rem", color: "#6b7280", fontSize: ".85rem" }}>Covant, Inc. · San Francisco, CA · legal@covant.ai</p>
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
