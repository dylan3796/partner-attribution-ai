'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

const PAIN_POINTS = [
  { icon: '📊', text: 'Partner attribution disputed every quarter' },
  { icon: '⏱️', text: 'Commission calculations taking days, not minutes' },
  { icon: '🔍', text: 'No visibility into which partners actually drive revenue' },
  { icon: '📋', text: 'Deal registrations managed in spreadsheets' },
];

const WHAT_YOU_GET = [
  { title: 'Attribution engine', desc: 'Deal reg protection, source wins, role split — pick the model that matches how your program actually works.' },
  { title: 'Commission rules that stick', desc: 'Gold reseller gets 20%, referral gets 10%, enterprise deals >$100K get 12%. Set once, runs automatically.' },
  { title: 'Partner portal', desc: 'Partners register deals, check commissions, and track performance — without emailing you for every update.' },
  { title: 'Audit trail', desc: 'Every payout has a paper trail. When an AE questions the attribution number, you have the exact logic to show them.' },
];

export default function BetaPage() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [partners, setPartners] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const captureLead = useMutation(api.leads.captureLead);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await captureLead({
        email,
        company: company || undefined,
        source: `beta-page|role:${role}|partners:${partners}`,
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Try again or email us at hello@covant.ai');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #111' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
          covant
        </Link>
        <Link href="/sign-in" style={{ color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}>
          Already have an account →
        </Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '80px 0 64px' }}>
          <div style={{
            display: 'inline-block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
            color: '#888', border: '1px solid #222', borderRadius: 20, padding: '4px 14px', marginBottom: 28,
          }}>
            EARLY ACCESS · LIMITED SPOTS
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 24px' }}>
            Partner programs run on<br />spreadsheets. Yours doesn't have to.
          </h1>
          <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Covant automates attribution, commission rules, and partner payouts for B2B partner programs.
            Join the beta — we're onboarding hands-on with the first 20 teams.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80, alignItems: 'start', paddingBottom: 100 }}>

          {/* Left: content */}
          <div>
            {/* Pain points */}
            <div style={{ marginBottom: 56 }}>
              <p style={{ color: '#555', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 20 }}>IF THIS SOUNDS FAMILIAR</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {PAIN_POINTS.map(p => (
                  <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
                    <span style={{ color: '#aaa', fontSize: '0.95rem' }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What you get */}
            <div>
              <p style={{ color: '#555', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>WHAT YOU GET</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {WHAT_YOU_GET.map(item => (
                  <div key={item.title}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, paddingLeft: 16 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Beta terms */}
            <div style={{ marginTop: 56, padding: '24px', background: '#0a0a0a', borderRadius: 8, border: '1px solid #1a1a1a' }}>
              <p style={{ color: '#555', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16 }}>BETA PROGRAM</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Free during beta — no credit card',
                  'Hands-on onboarding with the Covant team',
                  'Direct access to the roadmap — your feedback shapes what we build',
                  'Locked-in pricing when we launch ($0 → Pro rate)',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#444', marginTop: 2 }}>✓</span>
                    <span style={{ color: '#888', fontSize: '0.875rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div style={{ position: 'sticky', top: 40 }}>
            <div style={{ background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12, padding: '36px 32px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 16 }}>✓</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.2rem', margin: '0 0 12px' }}>You're on the list.</h3>
                  <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 24px' }}>
                    We'll reach out within 48 hours to schedule your onboarding.
                    In the meantime, explore the demo.
                  </p>
                  <Link href="/demo" style={{
                    display: 'inline-block', color: '#fff', fontSize: '0.875rem',
                    border: '1px solid #333', borderRadius: 6, padding: '10px 20px',
                    textDecoration: 'none',
                  }}>
                    View demo →
                  </Link>
                </div>
              ) : (
                <>
                  <h2 style={{ fontWeight: 700, fontSize: '1.25rem', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                    Request beta access
                  </h2>
                  <p style={{ color: '#555', fontSize: '0.85rem', margin: '0 0 28px' }}>
                    We review every application — we're not just collecting emails.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', color: '#666', fontSize: '0.75rem', marginBottom: 6 }}>Work email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        style={{
                          width: '100%', background: '#0f0f0f', border: '1px solid #222',
                          borderRadius: 6, padding: '10px 12px', color: '#fff',
                          fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#666', fontSize: '0.75rem', marginBottom: 6 }}>Company</label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        style={{
                          width: '100%', background: '#0f0f0f', border: '1px solid #222',
                          borderRadius: 6, padding: '10px 12px', color: '#fff',
                          fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#666', fontSize: '0.75rem', marginBottom: 6 }}>Your role</label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{
                          width: '100%', background: '#0f0f0f', border: '1px solid #222',
                          borderRadius: 6, padding: '10px 12px', color: role ? '#fff' : '#555',
                          fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                          appearance: 'none',
                        }}
                      >
                        <option value="" disabled>Select role</option>
                        <option value="vp-partnerships">VP of Partnerships</option>
                        <option value="director-partnerships">Director of Partnerships</option>
                        <option value="partner-manager">Partner Manager</option>
                        <option value="revops">Revenue Operations</option>
                        <option value="founder">Founder / CEO</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#666', fontSize: '0.75rem', marginBottom: 6 }}>How many active partners?</label>
                      <select
                        value={partners}
                        onChange={e => setPartners(e.target.value)}
                        style={{
                          width: '100%', background: '#0f0f0f', border: '1px solid #222',
                          borderRadius: 6, padding: '10px 12px', color: partners ? '#fff' : '#555',
                          fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                          appearance: 'none',
                        }}
                      >
                        <option value="" disabled>Select range</option>
                        <option value="1-10">1–10</option>
                        <option value="11-30">11–30</option>
                        <option value="31-100">31–100</option>
                        <option value="100+">100+</option>
                      </select>
                    </div>

                    {error && (
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !email}
                      style={{
                        width: '100%', background: '#fff', color: '#000',
                        border: 'none', borderRadius: 6, padding: '12px',
                        fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'wait' : 'pointer',
                        opacity: loading || !email ? 0.6 : 1, marginTop: 4,
                      }}
                    >
                      {loading ? 'Submitting...' : 'Request Access →'}
                    </button>

                    <p style={{ color: '#333', fontSize: '0.75rem', textAlign: 'center', margin: 0 }}>
                      No credit card. We'll contact you within 48h.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
