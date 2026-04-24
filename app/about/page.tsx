import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Zap, Shield, Users, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Covant — The platform your partner team runs on',
  description: 'Covant is the platform your partner team runs on. A ledger, a branded portal, revenue intelligence — plus four agents (PSM, PAM, Program, Ops) that help teams unlock, monitor, and measure channel revenue end-to-end.',
};

const VALUES = [
  {
    icon: Target,
    title: 'The ledger is the moat',
    description: 'Partner programs fail when nobody can agree on who drove the deal. The ledger is the single source of truth — every touchpoint, every rule, every dollar traces back to a row.',
  },
  {
    icon: Zap,
    title: 'Agents do the work',
    description: "You hired a Head of Partnerships. Covant ships with four in-product agents — PSM, PAM, Program, Ops — that cover the roles the team hasn't finished hiring. They propose; your team approves.",
  },
  {
    icon: Shield,
    title: 'Explainable by construction',
    description: 'Every commission has a paper trail. Every agent action is a logged proposal. When an AE questions a number, you open the ledger, not a spreadsheet.',
  },
  {
    icon: Users,
    title: 'Partners are users, not rows',
    description: 'Your partners deserve a real portal — branded, unlimited seats, free. They register deals, track commissions, request MDF, and see performance in real time.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background:'#f9fafb', color: '#e5e5e5', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #111' }}>
        <Link href="/" style={{ color:'#0a0a0a', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
          Covant.ai
        </Link>
        <Link href="/beta" style={{ color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}>
          Join the beta →
        </Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color:'#6b7280', fontSize: '.85rem', textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Hero */}
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color:'#0a0a0a', margin: '0 0 20px' }}>
          The platform your partner<br />team runs on.
        </h1>
        <p style={{ color:'#6b7280', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
          Most partner programs still run on spreadsheets, email threads, and quarterly
          true-ups that nobody trusts. Covant replaces that with a ledger, a branded
          portal, revenue intelligence — and four in-product agents that cover
          the roles the partner team hasn&apos;t finished hiring.
        </p>

        {/* The problem */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color:'#374151', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16 }}>THE PROBLEM</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '28px 32px' }}>
            <p style={{ color:'#6b7280', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              B2B companies spend 20-30% of revenue through partner channels, but the tooling
              hasn&apos;t kept up. CRMs track deals, not partner influence. Finance tools handle
              payments, not attribution logic. The gap between &quot;partner sourced this deal&quot;
              and &quot;partner got paid correctly&quot; is filled with manual work, disputes,
              and guesswork.
            </p>
            <p style={{ color:'#6b7280', fontSize: '0.95rem', lineHeight: 1.7, margin: '16px 0 0' }}>
              We talked to dozens of VPs of Partnerships. They all described the same problem:
              they know their partners drive revenue, but they can&apos;t <em>prove</em> it in
              a way that survives a quarterly business review.
            </p>
          </div>
        </section>

        {/* What we believe */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color:'#374151', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>WHAT WE BELIEVE</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background:'#f9fafb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: '#888',
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color:'#0a0a0a', margin: '0 0 6px' }}>{v.title}</h3>
                    <p style={{ color:'#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Status */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color:'#374151', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16 }}>WHERE WE ARE</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '28px 32px' }}>
            <p style={{ color:'#6b7280', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              Covant is in design-partner phase. The platform is live — ledger, branded
              partner portal, deal registration, and revenue intelligence are all
              shipping and handling real data. The four agents (PSM, PAM, Program, Ops)
              are rolling out in sequence.
            </p>
            <p style={{ color:'#6b7280', fontSize: '0.95rem', lineHeight: 1.7, margin: '16px 0 0' }}>
              We&apos;re onboarding a small cohort of design partners hands-on. If you run
              a partner program and you&apos;re tired of spreadsheets, we&apos;d love to talk.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/beta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 8, background: '#fff', color: '#000',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
          }}>
            Request beta access →
          </Link>
          <Link href="/demo" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 8, border: '1px solid #333', color:'#6b7280',
            fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
          }}>
            Try the demo
          </Link>
        </div>
      </div>
    </div>
  );
}
