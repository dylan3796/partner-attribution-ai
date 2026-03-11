import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Database, Globe, Webhook, Code2, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Integrations — Covant',
  description: 'Connect Covant to Salesforce, HubSpot, and your existing tech stack. CRM sync, webhooks, and a full REST API.',
  openGraph: {
    title: 'Covant Integrations — Connect Your Partner Stack',
    description: 'Salesforce, HubSpot, webhooks, and API. Covant fits into the tools your team already uses.',
  },
};

type Integration = {
  name: string;
  slug: string;
  category: string;
  description: string;
  features: string[];
  status: 'live' | 'beta' | 'coming';
  tier: string;
  logo: string;
};

const INTEGRATIONS: Integration[] = [
  {
    name: 'Salesforce',
    slug: 'salesforce',
    category: 'CRM',
    description: 'Two-way sync of deals, contacts, and partner accounts. Attribution data flows back into Salesforce so AEs see partner influence on every opportunity.',
    features: [
      'OAuth 2.0 connection — no admin needed',
      'Bi-directional deal sync',
      'Partner attribution fields on opportunities',
      'Custom object mapping',
    ],
    status: 'live',
    tier: 'Pro',
    logo: '☁️',
  },
  {
    name: 'HubSpot',
    slug: 'hubspot',
    category: 'CRM',
    description: 'Connect your HubSpot CRM to sync deals and contacts. Partner touchpoints are tracked automatically from HubSpot activity data.',
    features: [
      'One-click OAuth connection',
      'Deal pipeline sync',
      'Contact-to-partner mapping',
      'Automatic touchpoint creation',
    ],
    status: 'live',
    tier: 'Pro',
    logo: '🟠',
  },
  {
    name: 'Webhooks',
    slug: 'webhooks',
    category: 'Events',
    description: 'Send real-time events to Covant from any system. Deal closed, partner registered, commission paid — we process it and update attribution instantly.',
    features: [
      'Inbound event processing',
      'Outbound notifications (deal approved, payout sent)',
      'Retry logic with exponential backoff',
      'Signature verification for security',
    ],
    status: 'live',
    tier: 'Free',
    logo: '🔗',
  },
  {
    name: 'REST API',
    slug: 'api',
    category: 'Developer',
    description: 'Full programmatic access to partners, deals, commissions, and attribution data. Build custom workflows or integrate with internal tools.',
    features: [
      'Partners, deals, commissions, payouts endpoints',
      'API key authentication',
      'Rate limiting with clear headers',
      'Pagination and filtering',
    ],
    status: 'live',
    tier: 'Free',
    logo: '⚡',
  },
  {
    name: 'Slack',
    slug: 'slack',
    category: 'Notifications',
    description: 'Get notified in Slack when deals are registered, commissions are approved, or partners hit milestones. Keep the team in the loop without email.',
    features: [
      'Deal registration alerts',
      'Commission approval notifications',
      'Partner milestone announcements',
      'Configurable channels per event type',
    ],
    status: 'coming',
    tier: 'Pro',
    logo: '💬',
  },
  {
    name: 'Stripe',
    slug: 'stripe',
    category: 'Payments',
    description: 'Automate partner payouts through Stripe Connect. When commissions are approved, payments are initiated automatically — no spreadsheets, no delays.',
    features: [
      'Stripe Connect onboarding for partners',
      'Automated payout on commission approval',
      'Payout status tracking in dashboard',
      'Multi-currency support',
    ],
    status: 'beta',
    tier: 'Scale',
    logo: '💳',
  },
];

const STATUS_CONFIG = {
  live: { label: 'Live', color: '#22c55e', bg: '#22c55e15' },
  beta: { label: 'Beta', color: '#f59e0b', bg: '#f59e0b15' },
  coming: { label: 'Coming Soon', color: '#6b7280', bg: '#6b728015' },
};

const CATEGORIES = [
  { name: 'CRM', icon: Database, description: 'Sync deals and contacts from your CRM. Attribution data flows both ways.' },
  { name: 'Events & API', icon: Code2, description: 'Webhooks and REST API for custom integrations and internal tools.' },
  { name: 'Notifications', icon: Globe, description: 'Keep your team informed with real-time alerts in the tools they use.' },
  { name: 'Payments', icon: Webhook, description: 'Automate partner payouts when commissions are approved.' },
];

export default function IntegrationsPage() {
  const liveCount = INTEGRATIONS.filter(i => i.status === 'live').length;

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

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color:'#6b7280', fontSize: '.85rem', textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Hero */}
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color:'#0a0a0a', margin: '0 0 16px' }}>
          Connects to your stack.
        </h1>
        <p style={{ color:'#6b7280', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
          {liveCount} integrations live. Sync your CRM, push events via webhooks,
          or build custom workflows with the API. Your partner data stays in sync
          without manual exports.
        </p>

        {/* Category overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 56 }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} style={{
                background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
                padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <Icon size={20} style={{ color:'#6b7280' }} />
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color:'#0a0a0a', margin: 0 }}>{cat.name}</h3>
                <p style={{ fontSize: '0.75rem', color:'#6b7280', lineHeight: 1.5, margin: 0 }}>{cat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Integration cards */}
        <p style={{ color:'#374151', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>ALL INTEGRATIONS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {INTEGRATIONS.map((integration) => {
            const status = STATUS_CONFIG[integration.status];
            return (
              <div key={integration.name} style={{
                background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
                padding: '28px 32px', transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.5rem' }}>{integration.logo}</span>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color:'#0a0a0a', margin: 0 }}>{integration.name}</h3>
                      <span style={{ fontSize: '0.7rem', color:'#6b7280' }}>{integration.category} · {integration.tier} plan</span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, color: status.color,
                    background: status.bg, padding: '4px 10px', borderRadius: 6,
                  }}>
                    {status.label}
                  </span>
                </div>

                <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {integration.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {integration.features.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={13} style={{ color: '#333', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color:'#6b7280' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/integrations/${integration.slug}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: '#888', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
                }}>
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Build your own */}
        <section style={{ marginTop: 56, marginBottom: 56 }}>
          <p style={{ color:'#374151', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16 }}>BUILD YOUR OWN</p>
          <div style={{ background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12, padding: '28px 32px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color:'#0a0a0a', margin: '0 0 8px' }}>
              REST API + Webhooks = unlimited flexibility
            </h3>
            <p style={{ color:'#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px' }}>
              Every integration listed above uses the same API available to you.
              Create partners, register deals, query commissions, and receive
              real-time events — all programmatically.
            </p>
            <Link href="/docs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color:'#0a0a0a', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
            }}>
              Read the API docs <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/beta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 8, background: '#fff', color: '#000',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
          }}>
            Get started free →
          </Link>
          <Link href="/demo" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 8, border: '1px solid #333', color: '#999',
            fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
          }}>
            Try the demo
          </Link>
        </div>
      </div>
    </div>
  );
}
