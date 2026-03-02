import Link from "next/link";
import { Shield, Lock, Eye, Server, RefreshCw, AlertTriangle } from "lucide-react";

export const metadata = { title: "Security — Covant" };

export default function SecurityPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <Link href="/" style={{ color: "#6b7280", fontSize: ".85rem", textDecoration: "none" }}>← covant.ai</Link>

        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "2rem", marginBottom: ".5rem", color: "#fff" }}>Security</h1>
        <p style={{ color: "#aaa", fontSize: "1rem", lineHeight: 1.7, marginBottom: "3rem" }}>
          Partner programs handle sensitive revenue data. Here's exactly how we protect yours.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "3rem" }}>
          <Card icon={<Lock size={18} />} title="Encryption in transit" body="All data is encrypted via TLS 1.2+ between your browser, our servers, and our database. No plaintext communication." />
          <Card icon={<Server size={18} />} title="Encryption at rest" body="Data stored in Convex (AWS us-east-1) is encrypted at rest using AES-256. Backups are also encrypted." />
          <Card icon={<Eye size={18} />} title="Audit logs" body="Every deal approval, commission calculation, and payout is logged with a timestamp and actor. Tamper-evident trail for every action." />
          <Card icon={<Shield size={18} />} title="Authentication" body="Powered by Clerk — industry-standard auth with bcrypt password hashing, optional MFA, and secure session management." />
          <Card icon={<RefreshCw size={18} />} title="Backups" body="Convex provides continuous, automatic backups with point-in-time recovery. We test restores periodically." />
          <Card icon={<AlertTriangle size={18} />} title="Incident response" body="Security incidents are logged, investigated, and disclosed within 72 hours per GDPR requirements. Email security@covant.ai to report." />
        </div>

        <Section title="Infrastructure">
          <p>Covant runs on:</p>
          <ul>
            <li><strong>Vercel</strong> — application hosting with global CDN, DDoS protection, and automatic SSL</li>
            <li><strong>Convex</strong> — managed database on AWS us-east-1 with automatic scaling and encrypted storage</li>
            <li><strong>Clerk</strong> — authentication infrastructure used by thousands of production applications</li>
            <li><strong>Stripe</strong> — PCI-DSS Level 1 certified payment processing; we never see raw card data</li>
          </ul>
          <p>We use Vercel's production environment with separate production and development deployments. No development data touches production infrastructure.</p>
        </Section>

        <Section title="Access control">
          <p>Covant enforces data isolation at the application layer:</p>
          <ul>
            <li>Each organization's data is scoped by their unique organization ID</li>
            <li>Partners only see data belonging to their own portal account</li>
            <li>Admin actions (payout approvals, deal approvals) require authenticated dashboard sessions</li>
            <li>Session tokens are HTTP-only cookies managed by Clerk with configurable expiry</li>
          </ul>
          <p>Internal access to production data is limited to engineers who require it for support or debugging. All internal access is logged.</p>
        </Section>

        <Section title="What we don't do">
          <ul>
            <li>We do not sell your data or your partners' data</li>
            <li>We do not use your data to train AI models</li>
            <li>We do not log or store payment card details</li>
            <li>We do not share data with third parties except our <Link href="/privacy#subprocessors" style={{ color: "#6366f1" }}>listed subprocessors</Link></li>
          </ul>
        </Section>

        <Section title="Compliance">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <Badge label="GDPR" status="Compliant" note="DPA available" />
            <Badge label="CCPA" status="Compliant" note="No data selling" />
            <Badge label="SOC 2" status="In progress" note="Target Q4 2026" />
          </div>
          <p style={{ marginTop: "1.5rem" }}>A Data Processing Agreement (DPA) for GDPR compliance is available at <Link href="/dpa" style={{ color: "#6366f1" }}>covant.ai/dpa</Link>. For enterprise security reviews, email <a href="mailto:security@covant.ai" style={{ color: "#6366f1" }}>security@covant.ai</a>.</p>
        </Section>

        <Section title="Vulnerability disclosure">
          <p>If you discover a security vulnerability in Covant, please email <a href="mailto:security@covant.ai" style={{ color: "#6366f1" }}>security@covant.ai</a>. We ask that you:</p>
          <ul>
            <li>Give us reasonable time to investigate and fix before public disclosure</li>
            <li>Not access or modify data you don't own</li>
            <li>Not perform attacks that degrade service availability</li>
          </ul>
          <p>We will acknowledge all reports within 48 hours and keep you updated on our progress.</p>
        </Section>

        <Section title="Questions">
          <p>Security questions or enterprise security review requests: <a href="mailto:security@covant.ai" style={{ color: "#6366f1" }}>security@covant.ai</a></p>
          <p>Privacy questions: <a href="mailto:privacy@covant.ai" style={{ color: "#6366f1" }}>privacy@covant.ai</a></p>
        </Section>
      </div>
    </div>
  );
}

function Card({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 10, padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".6rem", color: "#6366f1" }}>{icon}<strong style={{ color: "#fff", fontSize: ".9rem" }}>{title}</strong></div>
      <p style={{ color: "#aaa", fontSize: ".82rem", lineHeight: 1.6, margin: 0 }}>{body}</p>
    </div>
  );
}

function Badge({ label, status, note }: { label: string; status: string; note: string }) {
  const done = status === "Compliant";
  return (
    <div style={{ background: "#111", border: `1px solid ${done ? "rgba(16,185,129,.3)" : "#222"}`, borderRadius: 8, padding: "1rem", textAlign: "center" }}>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>{label}</div>
      <div style={{ fontSize: ".8rem", color: done ? "#10b981" : "#f59e0b", fontWeight: 600, margin: ".25rem 0" }}>{status}</div>
      <div style={{ fontSize: ".75rem", color: "#6b7280" }}>{note}</div>
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
