import Link from "next/link";

export const metadata = { title: "Terms of Service — Covant" };

export default function TermsPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <Link href="/" style={{ color: "#6b7280", fontSize: ".85rem", textDecoration: "none" }}>← covant.ai</Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "2rem", marginBottom: ".5rem", color: "#fff" }}>Terms of Service</h1>
        <p style={{ color: "#6b7280", fontSize: ".9rem", marginBottom: "3rem" }}>Last updated: March 1, 2026</p>

        <Section title="Agreement">
          <p>By creating an account or using Covant ("Service"), you agree to these Terms of Service ("Terms"). If you're using Covant on behalf of an organization, you agree to these Terms on behalf of that organization.</p>
          <p>These Terms form a binding agreement between you and Covant, Inc. ("Covant," "we," "us").</p>
        </Section>

        <Section title="The Service">
          <p>Covant is a partner program management platform that provides attribution tracking, commission calculation, deal registration, and partner portal functionality.</p>
          <p>We reserve the right to modify or discontinue the Service at any time with reasonable notice. We'll provide at least 30 days notice for material changes that negatively impact you.</p>
        </Section>

        <Section title="Accounts">
          <p>You must provide accurate information when creating an account. You're responsible for keeping your credentials secure. Notify us immediately at <a href="mailto:security@covant.ai" style={{ color: "#6366f1" }}>security@covant.ai</a> if you suspect unauthorized access.</p>
          <p>You may not share your account, use it for illegal purposes, or use it to harm others.</p>
          <p>We may suspend or terminate accounts that violate these Terms.</p>
        </Section>

        <Section title="Your data">
          <p>You own your data. By using the Service, you grant Covant a limited license to store and process your data solely to provide the Service to you.</p>
          <p>We will not sell your data, use it for advertising, or share it except as described in our <Link href="/privacy" style={{ color: "#6366f1" }}>Privacy Policy</Link>.</p>
          <p>You're responsible for the legality of data you submit to the Service, including ensuring you have the right to upload partner and customer data.</p>
        </Section>

        <Section title="Acceptable use">
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for illegal purposes or to violate any laws</li>
            <li>Upload malware or attempt to compromise the Service's security</li>
            <li>Reverse engineer, copy, or create derivative works of the Service</li>
            <li>Use the Service to spam or harass others</li>
            <li>Resell or sublicense access to the Service without written consent</li>
            <li>Scrape or extract data from the Service in ways not supported by our API</li>
          </ul>
        </Section>

        <Section title="Billing">
          <p>Paid plans are billed monthly or annually in advance. All fees are in USD and non-refundable except where required by law.</p>
          <p>We use Stripe to process payments. By providing payment information, you authorize us to charge your payment method for your subscription.</p>
          <p>If payment fails, we'll notify you and provide a grace period of 7 days before downgrading your account. Your data will be retained during downgrade.</p>
          <p>You can cancel your subscription at any time from your billing settings. Cancellation takes effect at the end of the current billing period.</p>
          <p>We may change pricing with 30 days advance notice.</p>
        </Section>

        <Section title="Free tier">
          <p>The free tier is provided as-is with no SLA. We may modify or discontinue the free tier with 30 days notice. Paid plans are not affected by changes to the free tier.</p>
        </Section>

        <Section title="Intellectual property">
          <p>Covant and its underlying technology are owned by Covant, Inc. We grant you a limited, non-exclusive, non-transferable license to use the Service during your subscription.</p>
          <p>Any feedback you provide may be used by Covant to improve the Service without compensation to you.</p>
        </Section>

        <Section title="Confidentiality">
          <p>Each party agrees to keep the other's confidential information confidential and not to disclose it to third parties except as required by law.</p>
          <p>Your data is confidential. Our pricing, roadmap, and non-public features are confidential.</p>
        </Section>

        <Section title="Warranties and disclaimers">
          <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          <p>We do not warrant that the Service will be uninterrupted, error-free, or that data will never be lost. We maintain backups and uptime infrastructure, but cannot guarantee 100% availability.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, COVANT'S TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE SERVICE IS LIMITED TO THE AMOUNTS YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
          <p>IN NO EVENT WILL COVANT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
        </Section>

        <Section title="Indemnification">
          <p>You agree to indemnify and hold harmless Covant from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any third party's rights.</p>
        </Section>

        <Section title="Governing law">
          <p>These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Disputes will be resolved in the courts of San Francisco County, California.</p>
        </Section>

        <Section title="Changes to these Terms">
          <p>We'll notify you by email at least 14 days before material changes take effect. Continued use of the Service after changes constitutes acceptance.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these Terms? Email <a href="mailto:legal@covant.ai" style={{ color: "#6366f1" }}>legal@covant.ai</a>.</p>
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
