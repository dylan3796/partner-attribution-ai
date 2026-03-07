import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Zap, Shield, Clock, RefreshCw, Code2, Database, Globe, Webhook, BarChart3, Users, DollarSign, Settings } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Integration data                                                   */
/* ------------------------------------------------------------------ */

type IntegrationDetail = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  status: 'live' | 'beta' | 'coming';
  tier: string;
  logo: string;
  heroStats: { label: string; value: string }[];
  keyFeatures: { title: string; description: string; icon: string }[];
  dataFlow: { from: string; arrow: string; to: string; label: string }[];
  setupSteps: { step: number; title: string; description: string }[];
  useCases: { persona: string; scenario: string }[];
  faq: { q: string; a: string }[];
};

const INTEGRATIONS: Record<string, IntegrationDetail> = {
  salesforce: {
    slug: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    tagline: 'Partner attribution inside the CRM your team already lives in.',
    description: 'Two-way sync of deals, contacts, and partner accounts. Attribution data flows back into Salesforce so AEs see partner influence on every opportunity — no tab switching, no manual exports, no "trust me" conversations.',
    status: 'live',
    tier: 'Pro',
    logo: '☁️',
    heroStats: [
      { label: 'Sync frequency', value: 'Real-time' },
      { label: 'Setup time', value: '< 5 min' },
      { label: 'Objects synced', value: '4' },
      { label: 'Required plan', value: 'Pro+' },
    ],
    keyFeatures: [
      { title: 'OAuth 2.0 Connection', description: 'Connect with a single click — no admin credentials needed. Standard Salesforce OAuth flow with automatic token refresh.', icon: 'shield' },
      { title: 'Bi-directional Deal Sync', description: 'Opportunities created or updated in Salesforce flow into Covant. Attribution and commission data flow back. Both systems stay current.', icon: 'refresh' },
      { title: 'Attribution Fields on Opportunities', description: 'Custom fields appear on every Salesforce opportunity: Partner Source, Attribution %, Commission Amount. AEs see partner contribution without leaving Salesforce.', icon: 'chart' },
      { title: 'Custom Object Mapping', description: 'Map your Salesforce fields to Covant\'s data model during setup. Custom objects, picklist values, and record types are all supported.', icon: 'settings' },
      { title: 'Partner Account Sync', description: 'Salesforce Accounts tagged as partners auto-create partner records in Covant. Tier, territory, and contact data stays in sync.', icon: 'users' },
      { title: 'Audit Trail in Both Systems', description: 'Every sync event is logged. If a deal amount changes in Salesforce, Covant\'s attribution recalculates and the audit trail shows the delta.', icon: 'clock' },
    ],
    dataFlow: [
      { from: 'Salesforce', arrow: '→', to: 'Covant', label: 'Opportunities, Contacts, Accounts' },
      { from: 'Covant', arrow: '→', to: 'Salesforce', label: 'Attribution %, Commission $, Partner Source' },
      { from: 'Covant', arrow: '→', to: 'Salesforce', label: 'Deal Registration Status' },
      { from: 'Salesforce', arrow: '→', to: 'Covant', label: 'Stage Changes, Close Dates, Amounts' },
    ],
    setupSteps: [
      { step: 1, title: 'Connect your Salesforce org', description: 'Click "Connect Salesforce" in Settings → Integrations. Authorize via OAuth — takes 30 seconds.' },
      { step: 2, title: 'Map your fields', description: 'Covant auto-detects your Opportunity fields. Confirm the mapping or customize for custom objects and picklists.' },
      { step: 3, title: 'Choose sync direction', description: 'Select bi-directional (recommended) or one-way sync. Set conflict resolution rules for edge cases.' },
      { step: 4, title: 'Initial sync', description: 'Covant pulls existing opportunities and partner accounts. Historical data is available immediately for attribution analysis.' },
    ],
    useCases: [
      { persona: 'VP of Partnerships', scenario: 'Sarah runs her partner program from Salesforce. She needs AEs to see which deals have partner attribution so they stop claiming 100% credit. With Covant\'s Salesforce sync, attribution data appears directly on the opportunity record.' },
      { persona: 'RevOps', scenario: 'The RevOps team builds pipeline reports in Salesforce. Covant pushes "Partner-Sourced" and "Partner-Influenced" fields so pipeline reports slice by channel automatically — no manual tagging.' },
      { persona: 'Partner Manager', scenario: 'When a partner registers a deal, the registration status syncs to the Salesforce opportunity. AEs see "Partner Registered" before they start working the account, preventing channel conflict.' },
    ],
    faq: [
      { q: 'Which Salesforce editions are supported?', a: 'Professional, Enterprise, Unlimited, and Developer editions. Essentials is not supported due to API limitations.' },
      { q: 'Does this require a Salesforce admin?', a: 'No. Any user with API access can connect via OAuth. No packages to install, no custom objects to create — Covant uses standard Salesforce APIs.' },
      { q: 'What happens if a deal is updated in both systems?', a: 'Covant uses last-write-wins with conflict detection. If the same field is updated in both systems within the sync window, you\'ll see a conflict flag in the audit log. Amount and stage always defer to Salesforce as the source of truth.' },
      { q: 'Can I sync historical data?', a: 'Yes. On initial connection, Covant pulls all opportunities from the last 24 months (configurable). Historical attribution analysis works immediately.' },
    ],
  },
  hubspot: {
    slug: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    tagline: 'Partner touchpoints tracked automatically from your HubSpot activity.',
    description: 'Connect your HubSpot CRM to sync deals and contacts. Partner touchpoints are created automatically from HubSpot activity data — emails, meetings, and form submissions become attribution evidence without manual logging.',
    status: 'live',
    tier: 'Pro',
    logo: '🟠',
    heroStats: [
      { label: 'Sync frequency', value: 'Real-time' },
      { label: 'Setup time', value: '< 3 min' },
      { label: 'Auto-touchpoints', value: 'Yes' },
      { label: 'Required plan', value: 'Pro+' },
    ],
    keyFeatures: [
      { title: 'One-Click OAuth', description: 'Connect HubSpot in seconds. Standard OAuth flow — no API keys to copy, no developer portal access needed.', icon: 'shield' },
      { title: 'Deal Pipeline Sync', description: 'HubSpot deals flow into Covant with stage, amount, close date, and associated contacts. Pipeline changes sync automatically.', icon: 'refresh' },
      { title: 'Automatic Touchpoint Creation', description: 'Emails sent, meetings booked, form submissions, and calls logged in HubSpot automatically create attribution touchpoints in Covant. No manual data entry.', icon: 'zap' },
      { title: 'Contact-to-Partner Mapping', description: 'Covant matches HubSpot contacts to partner records using email domain, company name, and custom properties. Partner influence is detected automatically.', icon: 'users' },
      { title: 'HubSpot Properties', description: 'Custom properties appear on HubSpot deals: Partner Name, Attribution Model, Commission Status. Your sales team sees partner data in their workflow.', icon: 'settings' },
      { title: 'Activity Timeline', description: 'Covant events (attribution calculated, commission approved, deal registered) appear in the HubSpot activity timeline for full context.', icon: 'clock' },
    ],
    dataFlow: [
      { from: 'HubSpot', arrow: '→', to: 'Covant', label: 'Deals, Contacts, Companies' },
      { from: 'HubSpot', arrow: '→', to: 'Covant', label: 'Emails, Meetings, Calls, Forms' },
      { from: 'Covant', arrow: '→', to: 'HubSpot', label: 'Partner Name, Attribution %, Commission' },
      { from: 'Covant', arrow: '→', to: 'HubSpot', label: 'Timeline Events (attribution, payouts)' },
    ],
    setupSteps: [
      { step: 1, title: 'Connect HubSpot', description: 'Click "Connect HubSpot" in Settings → Integrations. Authorize with your HubSpot login — no admin role required.' },
      { step: 2, title: 'Review auto-detection', description: 'Covant scans your HubSpot for partner-related contacts and companies. Review the auto-detected partner mapping.' },
      { step: 3, title: 'Enable touchpoint auto-creation', description: 'Choose which HubSpot activities should create touchpoints: emails, meetings, calls, form submissions, or all of them.' },
      { step: 4, title: 'Start tracking', description: 'New HubSpot activity creates touchpoints in real time. Existing deals sync on first connection for historical analysis.' },
    ],
    useCases: [
      { persona: 'VP of Partnerships', scenario: 'Sarah\'s team uses HubSpot for everything. Partners send introductions via email — those emails automatically become touchpoints in Covant, building the attribution case without anyone logging anything manually.' },
      { persona: 'Partner Manager', scenario: 'When a partner books a meeting with a prospect through HubSpot\'s meeting tool, that touchpoint is captured automatically. The partner manager sees real engagement data, not self-reported activity.' },
      { persona: 'Sales Leader', scenario: 'The CRO wants to know which deals had partner involvement. HubSpot deal properties show partner attribution inline — no separate dashboard login needed for the sales team.' },
    ],
    faq: [
      { q: 'Which HubSpot plans are supported?', a: 'Starter, Professional, and Enterprise for Marketing, Sales, and Service hubs. Free HubSpot CRM is supported with limited activity sync.' },
      { q: 'How are partners detected from HubSpot data?', a: 'Covant matches contacts by email domain against known partner domains, company name matching, and optional custom properties you define. You can always manually link contacts to partners.' },
      { q: 'Does this slow down HubSpot?', a: 'No. Covant uses HubSpot\'s webhook subscriptions for real-time events and batch API for historical sync. Zero impact on HubSpot performance.' },
      { q: 'Can I choose which pipelines sync?', a: 'Yes. During setup, select which HubSpot deal pipelines should sync to Covant. You can include or exclude specific pipelines at any time.' },
    ],
  },
  webhooks: {
    slug: 'webhooks',
    name: 'Webhooks',
    category: 'Events',
    tagline: 'Real-time events in and out — your systems stay in sync automatically.',
    description: 'Send events to Covant from any system and receive notifications when things happen. Deal closed, partner registered, commission paid — webhooks keep your entire stack informed without polling or manual exports.',
    status: 'live',
    tier: 'Free',
    logo: '🔗',
    heroStats: [
      { label: 'Latency', value: '< 500ms' },
      { label: 'Event types', value: '15+' },
      { label: 'Retry logic', value: 'Auto' },
      { label: 'Required plan', value: 'Free' },
    ],
    keyFeatures: [
      { title: 'Inbound Event Processing', description: 'POST events to Covant\'s webhook endpoint. Deal registrations, partner sign-ups, and CRM updates can all be sent via webhook from any system.', icon: 'zap' },
      { title: 'Outbound Notifications', description: 'Subscribe to 15+ event types: deal.created, deal.approved, payout.sent, partner.tier_changed, and more. Get notified the moment something happens.', icon: 'refresh' },
      { title: 'HMAC Signature Verification', description: 'Every outbound webhook includes an HMAC-SHA256 signature. Verify the payload came from Covant — not a spoofed request.', icon: 'shield' },
      { title: 'Automatic Retries', description: 'Failed deliveries retry with exponential backoff: 1 min, 5 min, 30 min, 2 hr, 24 hr. After 5 attempts, the event is logged for manual review.', icon: 'refresh' },
      { title: 'Delivery Logs', description: 'Full delivery history with HTTP status codes, response times, and payload previews. Debug integration issues without guessing.', icon: 'clock' },
      { title: 'Event Filtering', description: 'Subscribe to specific event types per endpoint. Send deal events to Slack, payout events to your accounting system, and partner events to your CRM.', icon: 'settings' },
    ],
    dataFlow: [
      { from: 'Your System', arrow: '→', to: 'Covant', label: 'Inbound: deal.registered, partner.created' },
      { from: 'Covant', arrow: '→', to: 'Your System', label: 'Outbound: deal.approved, payout.sent' },
      { from: 'Covant', arrow: '→', to: 'Slack / Teams', label: 'Notifications: partner.tier_changed' },
      { from: 'Covant', arrow: '→', to: 'Accounting', label: 'Financial: commission.calculated' },
    ],
    setupSteps: [
      { step: 1, title: 'Create an endpoint', description: 'Go to Settings → Webhooks → Add Endpoint. Enter your URL and select which events to subscribe to.' },
      { step: 2, title: 'Copy your signing secret', description: 'Each endpoint gets a unique HMAC signing secret. Use it to verify payloads in your receiving service.' },
      { step: 3, title: 'Send a test event', description: 'Click "Send Test" to verify your endpoint receives and processes events correctly before going live.' },
      { step: 4, title: 'Monitor deliveries', description: 'The delivery log shows every webhook sent: status code, response time, and payload. Failed deliveries retry automatically.' },
    ],
    useCases: [
      { persona: 'DevOps Engineer', scenario: 'The engineering team builds a custom Slack bot that posts deal approvals to #partnerships. A webhook endpoint receives deal.approved events and formats a Slack message with partner name, deal value, and commission amount.' },
      { persona: 'Finance Team', scenario: 'When commissions are calculated, a webhook sends the payout details to the accounting system. No one manually exports CSVs at month-end anymore.' },
      { persona: 'VP of Partnerships', scenario: 'Marcus uses Airtable to track partner activities. Inbound webhooks from Airtable create touchpoints in Covant whenever his team logs a partner interaction.' },
    ],
    faq: [
      { q: 'What format are webhook payloads?', a: 'JSON. Every payload includes event type, timestamp, and the full object (deal, partner, payout, etc.) with all fields. Schema documentation is in the API docs.' },
      { q: 'How do I verify webhook signatures?', a: 'Each request includes an X-Covant-Signature header with an HMAC-SHA256 hash. Compute the hash of the raw body using your signing secret and compare. Code samples available in the docs.' },
      { q: 'Is there a rate limit?', a: 'Outbound webhooks are not rate-limited — events fire as they happen. Inbound webhooks accept up to 100 requests per second per endpoint.' },
      { q: 'Can I replay failed webhooks?', a: 'Yes. The delivery log shows failed attempts with full payloads. Click "Retry" to resend any individual delivery, or use the API to replay a batch.' },
    ],
  },
  api: {
    slug: 'api',
    name: 'REST API',
    category: 'Developer',
    tagline: 'Full programmatic access to your partner program data.',
    description: 'Every feature in Covant is available through the REST API. Create partners, register deals, query commissions, export attribution data — build custom workflows or integrate with any internal tool.',
    status: 'live',
    tier: 'Free',
    logo: '⚡',
    heroStats: [
      { label: 'Endpoints', value: '30+' },
      { label: 'Auth', value: 'API Key' },
      { label: 'Rate limit', value: '1000/min' },
      { label: 'Required plan', value: 'Free' },
    ],
    keyFeatures: [
      { title: 'Complete Coverage', description: 'Partners, deals, commissions, payouts, touchpoints, attribution, products, contracts — every resource has full CRUD endpoints.', icon: 'database' },
      { title: 'API Key Authentication', description: 'Generate scoped API keys from Settings → API Keys. Each key has granular permissions (read/write per resource) and optional expiration.', icon: 'shield' },
      { title: 'Pagination & Filtering', description: 'All list endpoints support cursor pagination, date range filters, status filters, and full-text search. Retrieve exactly the data you need.', icon: 'settings' },
      { title: 'Rate Limiting with Headers', description: 'Clear X-RateLimit-* headers on every response. 1000 requests per minute per key. Burst allowance for batch operations.', icon: 'clock' },
      { title: 'Bulk Operations', description: 'Create, update, or delete up to 100 records per request. Import partners from a spreadsheet, bulk-approve payouts, or batch-update deal stages.', icon: 'zap' },
      { title: 'Idempotency Keys', description: 'Include an Idempotency-Key header on write operations. Safe to retry on network failures without creating duplicate records.', icon: 'shield' },
    ],
    dataFlow: [
      { from: 'Your App', arrow: '→', to: 'Covant API', label: 'POST /partners, POST /deals' },
      { from: 'Covant API', arrow: '→', to: 'Your App', label: 'GET /commissions, GET /attributions' },
      { from: 'CI/CD', arrow: '→', to: 'Covant API', label: 'POST /deals/bulk-import' },
      { from: 'Covant API', arrow: '→', to: 'Data Warehouse', label: 'GET /exports/full' },
    ],
    setupSteps: [
      { step: 1, title: 'Generate an API key', description: 'Go to Settings → API Keys → Create Key. Name it, select permission scopes, and set an expiration if needed.' },
      { step: 2, title: 'Make your first request', description: 'GET /api/v1/partners with your API key in the Authorization header. You\'ll get a paginated list of all partners.' },
      { step: 3, title: 'Explore the docs', description: 'Full API reference at /docs with request/response examples, error codes, and pagination guides.' },
      { step: 4, title: 'Build your integration', description: 'Use the API to sync data, build custom dashboards, automate workflows, or feed your data warehouse.' },
    ],
    useCases: [
      { persona: 'Developer', scenario: 'Build a custom partner portal that matches your brand. Pull partner data, deals, and commission history from the API. Submit deal registrations and touchpoints programmatically.' },
      { persona: 'Data Engineer', scenario: 'Nightly ETL job pulls all attribution data into Snowflake. The data team builds cross-functional reports combining partner performance with product usage metrics.' },
      { persona: 'RevOps', scenario: 'Bulk import 500 historical deals from a CSV via the API\'s batch endpoint. Map fields during import. Historical attribution analysis is available immediately.' },
    ],
    faq: [
      { q: 'Is there a sandbox environment?', a: 'Yes. The demo org (accessible via /demo) acts as a sandbox. Generate API keys in the demo dashboard to test without affecting production data.' },
      { q: 'What response format is used?', a: 'All responses are JSON. List endpoints return { data: [...], cursor: "..." } for pagination. Error responses include { error: "...", code: "..." }.' },
      { q: 'Are there SDKs available?', a: 'Not yet — the API follows REST conventions closely so any HTTP client works. Official TypeScript and Python SDKs are on the roadmap.' },
      { q: 'How do I handle rate limits?', a: 'Check X-RateLimit-Remaining on responses. If you hit the limit, the response includes Retry-After in seconds. For bulk operations, use the batch endpoints instead of individual requests.' },
    ],
  },
  slack: {
    slug: 'slack',
    name: 'Slack',
    category: 'Notifications',
    tagline: 'Partner program updates where your team already communicates.',
    description: 'Get notified in Slack when deals are registered, commissions are approved, or partners hit milestones. Keep the entire team in the loop without email overload or dashboard checking.',
    status: 'coming',
    tier: 'Pro',
    logo: '💬',
    heroStats: [
      { label: 'Event types', value: '10+' },
      { label: 'Channel routing', value: 'Per event' },
      { label: 'Setup time', value: '< 2 min' },
      { label: 'Required plan', value: 'Pro+' },
    ],
    keyFeatures: [
      { title: 'Deal Registration Alerts', description: 'When a partner registers a deal, a formatted Slack message posts to your configured channel with deal details, partner name, and a link to approve or reject.', icon: 'zap' },
      { title: 'Commission Notifications', description: 'Commission calculated, approved, or paid — your finance and partnerships team sees it in Slack instantly. No more "is my commission processed?" emails from partners.', icon: 'dollar' },
      { title: 'Partner Milestone Alerts', description: 'Partner reached Gold tier? Closed their 10th deal? First deal registration? Milestone alerts celebrate wins and keep the team informed.', icon: 'chart' },
      { title: 'Channel Routing', description: 'Route events to different Slack channels: deal events to #partnerships, payout events to #finance, partner milestones to #wins. Each event type maps to a specific channel.', icon: 'settings' },
      { title: 'Actionable Messages', description: 'Slack messages include action buttons where supported — approve a deal registration, view the partner profile, or open the full audit trail, all from Slack.', icon: 'zap' },
      { title: 'Quiet Hours', description: 'Set notification hours so your team isn\'t pinged at midnight. Events outside quiet hours are batched and delivered as a summary when hours resume.', icon: 'clock' },
    ],
    dataFlow: [
      { from: 'Covant', arrow: '→', to: '#partnerships', label: 'Deal registered, partner joined' },
      { from: 'Covant', arrow: '→', to: '#finance', label: 'Commission calculated, payout sent' },
      { from: 'Covant', arrow: '→', to: '#wins', label: 'Deal closed, partner milestone' },
      { from: 'Slack Actions', arrow: '→', to: 'Covant', label: 'Approve deal, view partner' },
    ],
    setupSteps: [
      { step: 1, title: 'Add Covant to Slack', description: 'Click "Add to Slack" in Settings → Integrations. Authorize the Covant app in your Slack workspace.' },
      { step: 2, title: 'Choose your channels', description: 'Map event categories to Slack channels. Deal events go to #partnerships, financial events to #finance, etc.' },
      { step: 3, title: 'Set notification preferences', description: 'Choose which events trigger Slack notifications. Enable quiet hours if your team spans time zones.' },
      { step: 4, title: 'Test the connection', description: 'Covant sends a test message to each configured channel to verify the setup works before going live.' },
    ],
    useCases: [
      { persona: 'VP of Partnerships', scenario: 'Sarah starts every morning in Slack. Instead of logging into Covant to check for new deal registrations, she sees them in #partnerships with enough context to approve or escalate — all before her first meeting.' },
      { persona: 'Partner Manager', scenario: 'When a partner\'s deal closes, the partner manager gets a Slack notification with the deal value and commission amount. They can send a congratulations message to the partner within minutes.' },
      { persona: 'Finance', scenario: 'The finance team receives commission approval notifications in #finance. They know exactly when payouts need to be processed without checking the dashboard daily.' },
    ],
    faq: [
      { q: 'When will Slack integration be available?', a: 'Slack integration is in development and expected in Q2 2026. Join the beta to get early access when it launches.' },
      { q: 'Will it work with Slack Connect?', a: 'Yes. You\'ll be able to post partner-specific notifications to Slack Connect channels shared with your partners — deal status updates, commission notifications, and milestone celebrations.' },
      { q: 'Can I use it with Microsoft Teams?', a: 'Teams integration is on the roadmap for Q3 2026. In the meantime, use webhooks to build a custom Teams integration with Power Automate.' },
      { q: 'Is there a Slack bot I can query?', a: 'The initial launch focuses on notifications. A conversational Slack bot (ask for partner stats, query pipeline, etc.) is planned for a future release.' },
    ],
  },
  stripe: {
    slug: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    tagline: 'Commissions approved → partners paid. Automatically.',
    description: 'Automate partner payouts through Stripe Connect. When commissions are approved in Covant, payments are initiated automatically — no spreadsheets, no manual bank transfers, no month-end scramble.',
    status: 'beta',
    tier: 'Scale',
    logo: '💳',
    heroStats: [
      { label: 'Payout speed', value: '2-3 days' },
      { label: 'Currencies', value: '135+' },
      { label: 'Partner onboarding', value: 'Self-serve' },
      { label: 'Required plan', value: 'Scale+' },
    ],
    keyFeatures: [
      { title: 'Stripe Connect Onboarding', description: 'Partners complete Stripe\'s identity verification and banking setup through a branded onboarding link. KYC, tax info, and bank details — handled by Stripe, not you.', icon: 'users' },
      { title: 'Automated Payouts', description: 'When a commission is approved in Covant, a Stripe transfer is initiated automatically. Partners receive funds in 2-3 business days. No manual processing.', icon: 'zap' },
      { title: 'Payout Status Tracking', description: 'Real-time payout status in the Covant dashboard: initiated, in_transit, paid, failed. Partners see their payout history in the portal.', icon: 'refresh' },
      { title: 'Multi-Currency', description: 'Pay partners in their local currency. Stripe handles conversion for 135+ currencies. Covant tracks the USD equivalent for reporting.', icon: 'dollar' },
      { title: 'Tax Form Generation', description: 'Stripe automatically generates 1099 forms for US-based partners and equivalent tax documentation internationally. Tax season is handled.', icon: 'shield' },
      { title: 'Payout Scheduling', description: 'Set payout frequency: immediate on approval, weekly batch, or monthly batch. Align with your finance team\'s existing payout cadence.', icon: 'clock' },
    ],
    dataFlow: [
      { from: 'Covant', arrow: '→', to: 'Stripe', label: 'Commission approved → initiate transfer' },
      { from: 'Stripe', arrow: '→', to: 'Partner Bank', label: 'Funds transferred in 2-3 days' },
      { from: 'Stripe', arrow: '→', to: 'Covant', label: 'Payout status updates (webhook)' },
      { from: 'Partner', arrow: '→', to: 'Stripe Connect', label: 'Self-serve onboarding + KYC' },
    ],
    setupSteps: [
      { step: 1, title: 'Connect Stripe', description: 'Link your Stripe account in Settings → Integrations. Covant uses Stripe Connect for partner payouts — no custom payment infrastructure.' },
      { step: 2, title: 'Invite partners to onboard', description: 'Partners receive a Stripe onboarding link via the portal. They complete identity verification and add bank details through Stripe\'s hosted flow.' },
      { step: 3, title: 'Set payout rules', description: 'Configure payout frequency (immediate, weekly, monthly), minimum payout threshold, and currency preferences.' },
      { step: 4, title: 'Approve and pay', description: 'When you approve a commission in Covant, the payout is initiated automatically. Track status in real time from both the dashboard and portal.' },
    ],
    useCases: [
      { persona: 'VP of Partnerships', scenario: 'Elena manages 140 partners across 3 tiers. Month-end used to mean a week of spreadsheet exports, manual bank transfers, and "where\'s my commission?" emails. Now commissions flow from approval to bank account automatically.' },
      { persona: 'Finance', scenario: 'The CFO needs audit-ready payout records. Every Stripe transfer is linked to the original deal, attribution calculation, and commission rule. Tax forms are generated automatically.' },
      { persona: 'Partner', scenario: 'Partners see their commission earned, pending, and paid in the portal. When a payout hits their bank, they see the exact deal it came from. No more opaque lump-sum payments.' },
    ],
    faq: [
      { q: 'Do partners need a Stripe account?', a: 'Partners create a Stripe Connect account through a simple onboarding flow. If they already have Stripe, they can link their existing account.' },
      { q: 'What are the fees?', a: 'Stripe charges their standard Connect transfer fees (0.25% + $0.25 per payout for US, varies internationally). Covant does not add additional payout fees.' },
      { q: 'Can I pay partners outside of Stripe?', a: 'Yes. Stripe is optional. You can continue to process payouts manually and mark them as paid in Covant. Stripe just automates the process.' },
      { q: 'What about international partners?', a: 'Stripe Connect supports payouts in 40+ countries with local currency. Partners outside Stripe\'s coverage can be paid manually through Covant\'s standard payout workflow.' },
    ],
  },
};

const ICON_MAP: Record<string, typeof Zap> = {
  zap: Zap,
  shield: Shield,
  clock: Clock,
  refresh: RefreshCw,
  settings: Settings,
  users: Users,
  dollar: DollarSign,
  chart: BarChart3,
  database: Database,
};

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return Object.keys(INTEGRATIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const integration = INTEGRATIONS[slug];
  if (!integration) return { title: 'Integration — Covant' };

  return {
    title: `${integration.name} Integration — Covant`,
    description: integration.description.slice(0, 160),
    openGraph: {
      title: `Covant + ${integration.name} — Partner Attribution Integration`,
      description: integration.tagline,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG = {
  live: { label: 'Live', color: '#22c55e', bg: '#22c55e15' },
  beta: { label: 'Beta', color: '#f59e0b', bg: '#f59e0b15' },
  coming: { label: 'Coming Soon', color: '#6b7280', bg: '#6b728015' },
};

export default async function IntegrationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const integration = INTEGRATIONS[slug];
  if (!integration) notFound();

  const status = STATUS_CONFIG[integration.status];

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#e5e5e5', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #111' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
          covant
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/integrations" style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none' }}>
            All Integrations
          </Link>
          <Link href="/beta" style={{ color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}>
            Join the beta →
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <Link href="/integrations" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#555', fontSize: '.85rem', textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={14} /> All Integrations
        </Link>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <span style={{ fontSize: '2.5rem' }}>{integration.logo}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', margin: 0 }}>
                  {integration.name}
                </h1>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, color: status.color,
                  background: status.bg, padding: '4px 12px', borderRadius: 6,
                }}>
                  {status.label}
                </span>
              </div>
              <p style={{ color: '#555', fontSize: '0.8rem', margin: '4px 0 0' }}>{integration.category} · {integration.tier} plan</p>
            </div>
          </div>
          <p style={{ color: '#999', fontSize: '1.15rem', lineHeight: 1.6, fontWeight: 500, margin: '0 0 8px' }}>
            {integration.tagline}
          </p>
          <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, maxWidth: 700 }}>
            {integration.description}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
          {integration.heroStats.map((stat) => (
            <div key={stat.label} style={{
              background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
              padding: '20px', textAlign: 'center',
            }}>
              <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ color: '#555', fontSize: '0.75rem', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Key Features */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color: '#444', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>KEY FEATURES</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {integration.keyFeatures.map((feature) => {
              const Icon = ICON_MAP[feature.icon] || Zap;
              return (
                <div key={feature.title} style={{
                  background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
                  padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Icon size={16} style={{ color: '#555' }} />
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>{feature.title}</h3>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Data Flow */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color: '#444', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>HOW DATA FLOWS</p>
          <div style={{ background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12, padding: '28px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {integration.dataFlow.map((flow, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                    background: '#111', border: '1px solid #222', borderRadius: 8,
                    padding: '6px 14px', minWidth: 100, textAlign: 'center',
                  }}>
                    {flow.from}
                  </span>
                  <ArrowRight size={16} style={{ color: '#333' }} />
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                    background: '#111', border: '1px solid #222', borderRadius: 8,
                    padding: '6px 14px', minWidth: 100, textAlign: 'center',
                  }}>
                    {flow.to}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#555' }}>{flow.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Setup Steps */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color: '#444', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>SETUP IN {integration.setupSteps.length} STEPS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {integration.setupSteps.map((step) => (
              <div key={step.step} style={{
                background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
                padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start',
              }}>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 800, color: '#fff',
                  background: '#111', border: '1px solid #222', borderRadius: '50%',
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {step.step}
                </span>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{step.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color: '#444', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>USE CASES</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {integration.useCases.map((uc, i) => (
              <div key={i} style={{
                background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
                padding: '24px 28px',
              }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#444', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  {uc.persona.toUpperCase()}
                </p>
                <p style={{ color: '#888', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{uc.scenario}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color: '#444', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>FAQ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {integration.faq.map((item, i) => (
              <div key={i} style={{
                background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
                padding: '24px 28px',
              }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{item.q}</h3>
                <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.65, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other integrations */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ color: '#444', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24 }}>OTHER INTEGRATIONS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {Object.values(INTEGRATIONS)
              .filter((i) => i.slug !== slug)
              .map((i) => {
                const s = STATUS_CONFIG[i.status];
                return (
                  <Link
                    key={i.slug}
                    href={`/integrations/${i.slug}`}
                    style={{
                      background: '#080808', border: '1px solid #1a1a1a', borderRadius: 12,
                      padding: '16px 20px', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{i.logo}</span>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: 0 }}>{i.name}</p>
                      <span style={{ fontSize: '0.6rem', color: s.color }}>{s.label}</span>
                    </div>
                  </Link>
                );
              })}
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
