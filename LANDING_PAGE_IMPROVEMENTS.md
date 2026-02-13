# Landing Page Improvements — PartnerBase

> Specific, actionable improvements to the marketing site at `/marketing/index.html`.
> Each section includes the exact copy, design direction, or implementation detail.

---

## 1. Copy Improvements

### Hero Section

**Current:**
```
Introducing Partner Attribution AI
Attribution reimagined, with AI to understand and intelligence to calculate
```

**Problem:** "Introducing" is weak — it buries the value. "AI to understand and intelligence to calculate" is vague. No specificity, no pain point, no outcome.

**Recommended (Option A — Pain-Focused):**
```html
<h1>Stop guessing which partners drive revenue</h1>
<p class="subtitle">AI-powered attribution that tracks every touchpoint, calculates fair credit splits, and automates partner payouts — in minutes, not spreadsheets.</p>
```

**Recommended (Option B — Outcome-Focused):**
```html
<h1>Attribution that runs your entire partner operation</h1>
<p class="subtitle">Most platforms treat attribution as a report. PartnerBase makes it the engine — powering commissions, program tiers, and revenue forecasting with real data.</p>
```

**Recommended (Option C — Bold / Short):**
```html
<h1>The partner platform powered by attribution intelligence</h1>
<p class="subtitle">Track touchpoints. Calculate credit. Automate payouts. All driven by AI that learns which partners actually close deals.</p>
```

### Feature Sections

**Feature 1 — Current:** "Your attribution expert"
**Improved:**
```html
<span class="tag">AI-Powered Attribution</span>
<h2>Seven attribution models. One clear answer.</h2>
<p>From first-touch to AI-weighted, run every model side by side. See which partners actually drive revenue — not just who registered the deal.</p>
<p>PartnerBase's ML model learns from your historical outcomes to recommend the attribution approach that best matches reality.</p>
```

**Feature 2 — Current:** "Every touchpoint, automatically tracked"
**Improved:**
```html
<span class="tag">Touchpoint Intelligence</span>
<h2>47 touchpoints. 6 partners. One deal. Full clarity.</h2>
<p>Every email, demo, case study share, and integration install — captured and timestamped. See the complete partner journey from first intro to closed deal.</p>
<p>No more "who sourced this?" arguments. The data speaks for itself.</p>
```

**Feature 3 — Current:** "Fair splits, zero manual work"
**Improved:**
```html
<span class="tag">Automated Payouts</span>
<h2>Commissions calculated in seconds, not spreadsheets</h2>
<p>Attribution drives commission calculations automatically. Configure tiered rates, SPIFs, and multi-currency payouts — then let the system do the math.</p>
<p>Partners see exactly how their credit was calculated. Transparent attribution builds trust.</p>
```

### CTA Section

**Current:**
```
The new standard in partner attribution
Partnerships got spreadsheets. Attribution gets Partner AI.
```

**Improved:**
```html
<h2>Your partners deserve better than a spreadsheet</h2>
<p class="subtitle">Join the companies replacing guesswork with AI-powered attribution. Start free, see results in 15 minutes.</p>
<a href="#signup" class="btn btn-lg">Start free →</a>
<p class="muted" style="margin-top: 1rem">No credit card required · Free for up to 5 partners</p>
```

### Benefits Section (3-Column)

**Current:** "Frontier models" / "Complete attribution" / "Enterprise security"

**Improved — more specific and outcome-oriented:**

```html
<div>
  <h3>7 attribution models</h3>
  <p>First-touch, last-touch, time-decay, AI-weighted, and more. Compare models side by side to find what matches your reality.</p>
</div>
<div>
  <h3>15-minute time to value</h3>
  <p>Upload your deals and partners via CSV. See attribution results immediately. No 6-month implementation project.</p>
</div>
<div>
  <h3>Built for enterprise trust</h3>
  <p>Your data is never used to train AI models. SOC 2 on the roadmap. Row-level access controls. Audit trails on every decision.</p>
</div>
```

---

## 2. Design Suggestions

### Overall Design Assessment
The current design is clean, modern, and well-executed. The Inter font, generous whitespace, and minimal color palette are solid. Here's what to refine:

### Add a "Problem → Solution" Section After Hero
Insert a section that viscerally describes the pain before showing features:

```html
<section class="problem">
  <div class="wrap">
    <h2>Sound familiar?</h2>
    <div class="grid-3">
      <div class="problem-card">
        <span class="problem-emoji">📊</span>
        <h4>The spreadsheet nightmare</h4>
        <p>Your partner attribution lives in a shared Google Sheet that three people update differently and nobody fully trusts.</p>
      </div>
      <div class="problem-card">
        <span class="problem-emoji">🤷</span>
        <h4>The "who gets credit?" fight</h4>
        <p>Every quarter, partners dispute their commission. You spend days reconstructing who did what. Both sides leave frustrated.</p>
      </div>
      <div class="problem-card">
        <span class="problem-emoji">💸</span>
        <h4>The invisible ROI</h4>
        <p>Leadership asks "what's the ROI of our partner program?" and you spend a week building a report you're not confident in.</p>
      </div>
    </div>
  </div>
</section>
```

### Color Accent
The site is entirely black & white except the hero orb gradient. Add **one** accent color for CTAs and interactive elements to improve conversion:
- Recommended: Deep violet `#7C3AED` (matches the orb gradient, feels AI/premium)
- Apply to: Primary buttons, link hovers, active states, tags
- Keep the rest monochrome

### Hero Demo Card Improvement
The demo card is the strongest element on the page. Enhance it:
- Add subtle typing animation to the question "Who should get credit for the Acme deal?"
- Animate the attribution percentages counting up (40%, 35%, 25%)
- Add a subtle shimmer/loading state before the AI response appears
- Consider making it interactive: let visitors click different attribution models and see results change

### Typography Hierarchy
- Hero `h1` is great at `clamp(2.5rem, 6vw, 5rem)`
- Feature `h2` could be slightly smaller to create more contrast with hero
- Add more line-height to body text (bump from `1.6` to `1.7` for readability)

### Micro-Interactions
- Button hover: Add subtle scale + shadow lift (current is good, maybe add `box-shadow`)
- Card hover: Slight border-color change or shadow increase
- Nav: Add active state indicator for current section

---

## 3. Social Proof (Pre-Launch Strategies)

You don't have customers yet. Here's how to build credibility anyway:

### Immediate (This Week)
```html
<!-- Add below the waitlist form -->
<div class="social-proof">
  <div class="proof-avatars">
    <!-- 5-8 small circular avatars (use Unsplash business headshots or real beta signups) -->
  </div>
  <p class="muted">Join 150+ partnership leaders on the waitlist</p>
</div>
```

### After First Beta Users (Week 3-4)
```html
<section class="testimonials">
  <div class="wrap">
    <div class="grid-3">
      <div class="testimonial-card">
        <p>"We were spending 2 days per quarter manually calculating partner commissions in spreadsheets. PartnerBase got us to real-time."</p>
        <div class="testimonial-author">
          <img src="..." alt="Sarah K." />
          <div>
            <strong>Sarah K.</strong>
            <span>VP Partnerships, [Company]</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Trust Badges to Add
```html
<div class="trust-badges">
  <!-- Row of logos/badges -->
  <span>🔒 SOC 2 Compliant</span>  <!-- When achieved; until then, "SOC 2 on roadmap" -->
  <span>🏗️ Built on Convex</span>   <!-- Leverages Convex's trust -->
  <span>🚀 Backed by Y Combinator</span>  <!-- If/when applicable -->
  <img src="..." alt="Stripe Verified" />  <!-- Stripe badge for payment trust -->
</div>
```

### Content-Based Proof
- **"Used by teams at"** — Even if you have 1 user from a known company, you can show the logo (with permission)
- **Investor logos** — If you have angel investors or advisors from known companies, show their logos
- **Press mentions** — Publish on Product Hunt, get featured on Partnership Leaders newsletter
- **Data points** — "$2.3M in partner revenue attributed in beta" (once you have real numbers)

---

## 4. CTA Optimization

### Current Issues
- "Get started" is generic — doesn't convey what happens next
- "Get early access" is better but could specify the value
- No secondary CTA for people not ready to commit

### Recommended CTA Hierarchy

**Primary CTA (Hero):**
```html
<button>See it in action →</button>
<!-- Links to live demo environment — lower friction than signup -->
```

**Secondary CTA (Hero):**
```html
<form class="waitlist">
  <input type="email" placeholder="Work email for early access" required>
  <button type="submit">Join waitlist</button>
</form>
```

**Tertiary CTAs (Features):**
```html
<a href="/demo" class="arrow-link">Try the live demo →</a>
<!-- Each feature section links to demo or relevant docs -->
```

**Bottom CTA (Closing):**
```html
<a href="#signup" class="btn btn-lg">Start free — no credit card</a>
```

### CTA Button Design
- Use the accent color (`#7C3AED`) instead of black for primary CTAs
- Add a right arrow `→` to indicate forward motion
- Ensure minimum 48px touch target height on mobile
- Add loading state for form submissions

### Waitlist vs Demo Request Strategy

**Recommended: Dual-path approach**

| Visitor Type | Path | CTA |
|-------------|------|-----|
| Curious / early stage | Self-serve demo | "See it in action →" → sandbox with sample data |
| Ready to evaluate | Book a demo | "Book a 15-min demo" → Calendly link |
| Want to be notified | Join waitlist | Email capture → drip sequence |

The self-serve demo is highest priority. People want to see the product before talking to sales.

---

## 5. SEO Considerations

### Current Issues
- `<title>` is good: "Partner AI — Attribution reimagined"
- `<meta description>` is decent but could include a keyword
- No structured data
- No blog or content pages for organic search
- Single page means limited keyword targeting

### Quick Wins
```html
<!-- Improved meta -->
<title>PartnerBase — AI-Powered Partner Attribution Platform</title>
<meta name="description" content="PartnerBase is the AI-powered partner attribution platform that tracks touchpoints, calculates fair credit splits, and automates partner commissions. Free to start.">

<!-- Add structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PartnerBase",
  "applicationCategory": "BusinessApplication",
  "description": "AI-powered partner attribution and commission management platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>

<!-- Add canonical URL -->
<link rel="canonical" href="https://partnerai.com/">

<!-- Add Open Graph image -->
<meta property="og:image" content="https://partnerai.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PartnerBase — AI-Powered Partner Attribution">
<meta name="twitter:description" content="Track touchpoints. Calculate credit. Automate payouts.">
<meta name="twitter:image" content="https://partnerai.com/og-image.png">
```

### Target Keywords
| Keyword | Monthly Volume (est.) | Difficulty | Priority |
|---------|----------------------|-----------|----------|
| partner attribution software | 200-500 | Medium | 🔴 High |
| partner commission management | 300-700 | Medium | 🔴 High |
| partner relationship management | 1K-2K | High | 🟡 Medium |
| channel partner management software | 500-1K | High | 🟡 Medium |
| partner program management tool | 200-500 | Medium | 🔴 High |
| AI attribution platform | 100-300 | Low | 🔴 High |

### Content Strategy (SEO-Driven)
Create a `/blog` section with these initial posts:
1. "What is Multi-Touch Partner Attribution? (The Complete Guide)" — target "partner attribution"
2. "Partner Commissions: How to Calculate Fair Credit Splits" — target "partner commission management"
3. "Spreadsheets vs Partner Attribution Software: When to Switch" — target "partner attribution software"
4. "7 Attribution Models Explained for Partnership Leaders" — target "attribution models"
5. "The Hidden Cost of Manual Partner Attribution" — thought leadership

---

## 6. Pages to Add

### Priority 1 (Before Launch)
| Page | URL | Purpose |
|------|-----|---------|
| **Pricing** | `/pricing` | Dedicated page with tier comparison, FAQ, annual toggle |
| **Product / Features** | `/product` | Deep dive on each module (attribution, payouts, portal) |
| **Demo** | `/demo` | Live sandbox or Loom walkthrough video |
| **About** | `/about` | Team, mission, why you built this |

### Priority 2 (Month 1-2)
| Page | URL | Purpose |
|------|-----|---------|
| **Blog** | `/blog` | SEO, thought leadership, product updates |
| **Changelog** | `/changelog` | Public product updates (builds trust) |
| **Docs** | `/docs` or `docs.partnerai.com` | User guide, API reference |
| **Use Cases** | `/use-cases/saas-channel` | One page per ICP segment |

### Priority 3 (Month 3+)
| Page | URL | Purpose |
|------|-----|---------|
| **Case Studies** | `/customers/[company]` | Deep-dive success stories |
| **Integrations** | `/integrations` | CRM, billing, communication tools |
| **Compare** | `/compare/impact-com` | Comparison pages (great for SEO) |
| **Security** | `/security` | Trust page for enterprise buyers |
| **Partners** | `/partners` | If you launch your own partner program (meta!) |

---

## 7. Case Study / Use Case Content Needed

### Use Case Pages (Write These)

**1. SaaS Channel Partners**
```
Headline: "Finally know which channel partners drive ARR"
Pain: "Your resellers register deals, but you can't tell who influenced vs who just filled out a form"
Solution: Multi-touch attribution across the entire SaaS lifecycle (trial → close → expand → renew)
Key metric: "Companies using PartnerBase see 30% more accurate partner-attributed revenue" (placeholder — validate with beta)
```

**2. Technology Alliances & ISVs**
```
Headline: "Measure the true value of your integration partnerships"
Pain: "Your integrations drive adoption, but you can't prove it to leadership"
Solution: Track integration installs → product usage → deal influence → expansion revenue
Key metric: "Identify integration-influenced deals that your CRM misses entirely"
```

**3. Referral Programs**
```
Headline: "Scale your referral program with fair, transparent attribution"
Pain: "Partners dispute commissions every quarter because the spreadsheet says different things to different people"
Solution: Real-time attribution visible to both you and your partners via the partner portal
Key metric: "Reduce commission disputes by 90%"
```

### Case Study Template (For First Customers)
```
Company: [Name]
Industry: [SaaS / Marketplace / Services]
Challenge: [2-3 sentences about their attribution pain]
Solution: [How they use PartnerBase]
Results:
  - [Quantified metric 1: e.g., "Reduced commission calculation time from 2 days to 15 minutes"]
  - [Quantified metric 2: e.g., "Increased partner satisfaction scores by 40%"]
  - [Quantified metric 3: e.g., "Identified $200K in previously unattributed partner revenue"]
Quote: "[Direct quote from champion]"
```

---

## 8. Trust Signals to Add

### Immediately (No Dependencies)
- [ ] **"Your data is never used to train AI models"** — Add prominently in benefits section
- [ ] **"Bank-level encryption"** — SSL + at-rest encryption via Convex
- [ ] **"Built on enterprise infrastructure"** — Convex (real-time database), Vercel (edge network)
- [ ] **Transparent pricing** — No hidden fees, no "contact sales" for basic plans
- [ ] **Public changelog** — Shows active development
- [ ] **GitHub link** — If any open-source components, link them

### After Beta (Week 4+)
- [ ] **Customer logos** (with permission)
- [ ] **Testimonial quotes with real names and headshots**
- [ ] **"Trusted by X partnership teams"** counter
- [ ] **G2 / Capterra listing** (takes time but establishes legitimacy)

### Enterprise Trust (Month 3+)
- [ ] **SOC 2 Type 1** badge (when achieved)
- [ ] **Security whitepaper** (PDF download, also captures leads)
- [ ] **GDPR compliance statement**
- [ ] **Uptime SLA** with public status page
- [ ] **Data residency options** (US, EU)

---

## 9. Mobile Optimization

### Current State
The CSS has responsive breakpoints at 1024px and 768px. Grid collapses to single column. Mobile menu toggle exists. This is solid groundwork.

### Improvements Needed
- [ ] **Waitlist form stacking** — At 480px, stack the email input and button vertically:
  ```css
  @media (max-width: 480px) {
    .waitlist { flex-direction: column; }
    .waitlist input, .waitlist .btn { width: 100%; }
  }
  ```
- [ ] **Touch targets** — Ensure all buttons are minimum 48×48px on mobile
- [ ] **Hero padding** — Reduce hero padding on mobile (current `5rem 0 2rem` could be `3.5rem 0 1.5rem`)
- [ ] **Demo card on mobile** — The demo card may overflow on small screens. Add:
  ```css
  @media (max-width: 480px) {
    .demo-card { padding: 1.2rem; font-size: 0.9rem; }
    .demo-results p { font-size: 0.85rem; }
  }
  ```
- [ ] **Nav actions** — The "Get started" button should be visible on mobile nav (currently only shows hamburger):
  ```css
  @media (max-width: 768px) {
    .nav-actions .btn { display: inline-block; } /* Keep CTA visible */
    .nav-actions .link { display: none; } /* Hide "Log in" text link */
  }
  ```
- [ ] **Sticky mobile CTA** — Add a fixed bottom bar on mobile:
  ```html
  <div class="mobile-sticky-cta">
    <a href="#signup" class="btn btn-lg">Get early access</a>
  </div>
  ```
  ```css
  .mobile-sticky-cta { display: none; }
  @media (max-width: 768px) {
    .mobile-sticky-cta {
      display: block; position: fixed; bottom: 0; left: 0; right: 0;
      padding: 1rem; background: white; border-top: 1px solid var(--border);
      text-align: center; z-index: 99;
    }
  }
  ```
- [ ] **Test on real devices** — iPhone SE (smallest common), iPhone 14 Pro, Samsung Galaxy S23, iPad

---

## 10. Page Speed Considerations

### Current Positives
- Minimal CSS (single file, no framework bloat)
- Single Google Font (Inter)
- No images (all UI is CSS/HTML)
- No heavy JavaScript frameworks on the marketing page
- Intersection Observer for lazy animations

### Improvements
- [ ] **Preload the font** — Already using `preconnect` ✅. Add `font-display: swap` to prevent FOIT:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ```
  ✅ Already has `display=swap` in the URL. Good.

- [ ] **Inline critical CSS** — The CSS file is small enough (~5KB) to inline in `<head>`:
  ```html
  <style>/* Inline above-the-fold CSS here */</style>
  <link rel="stylesheet" href="css/style.css" media="print" onload="this.media='all'">
  ```

- [ ] **Add OG image** — Create a 1200×630 PNG for social sharing. Use a tool like OG Image Generator or design in Figma. Will be the most impactful visual investment.

- [ ] **Minify CSS** — Use a build step or deploy through Vercel (auto-minifies):
  ```bash
  npx csso css/style.css --output css/style.min.css
  ```

- [ ] **Add resource hints:**
  ```html
  <link rel="dns-prefetch" href="https://formspree.io">
  ```

- [ ] **Performance budget targets:**
  - Lighthouse Performance: >95
  - First Contentful Paint: <1.0s
  - Largest Contentful Paint: <1.5s
  - Cumulative Layout Shift: <0.05
  - Total page weight: <100KB (easily achievable with current approach)

---

## 11. A/B Testing Ideas for Launch

### Tools
- **PostHog Feature Flags** (free tier) — for server-side or client-side experiments
- **Vercel Edge Config** — for instant A/B test bucketing at CDN level
- **Simple approach:** Different landing page variants deployed as separate routes

### High-Impact Tests (Run These First)

| Test | Variant A (Control) | Variant B | Metric |
|------|---------------------|-----------|--------|
| **Hero headline** | "Stop guessing which partners drive revenue" | "Attribution that runs your entire partner operation" | Waitlist signups |
| **CTA text** | "Get early access" | "See it in action →" | Click-through rate |
| **CTA strategy** | Email waitlist form | "Book a 15-min demo" (Calendly) | Qualified leads |
| **Social proof** | No proof | Waitlist count + avatar row | Conversion rate |
| **Hero demo** | Static demo card | Animated/interactive demo | Time on page, signups |
| **Page length** | Current (concise) | Longer with use cases + FAQ | Scroll depth, signups |
| **Pricing visibility** | Pricing on separate page | Pricing section on homepage | Signup rate |

### Testing Protocol
1. Run each test for minimum 2 weeks or 200 conversions (whichever comes first)
2. Only test one variable at a time
3. Track: primary (waitlist signups), secondary (time on page, scroll depth, demo clicks)
4. Document results in a shared spreadsheet
5. Winner becomes the new control

### Post-Launch Tests (Month 2+)
- Landing page vs dedicated use-case pages for different traffic sources
- Long-form vs short-form product descriptions
- Video demo vs interactive demo vs screenshot walkthrough
- Pricing page: slider vs tiers vs calculator
- Annual vs monthly as default pricing toggle position

---

## Summary: Quick Wins (Do This Week)

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| 🔴 | Rewrite hero headline and subtitle | 30 min | High |
| 🔴 | Add social proof below waitlist form | 1 hour | High |
| 🔴 | Add "Sound familiar?" problem section | 2 hours | High |
| 🔴 | Improve meta tags + add OG image | 1 hour | Medium |
| 🟡 | Add accent color to CTAs | 30 min | Medium |
| 🟡 | Mobile sticky CTA bar | 1 hour | Medium |
| 🟡 | Inline critical CSS | 30 min | Low |
| 🟡 | Create demo sandbox page | 4 hours | High |
| 🟢 | Set up blog with first post | 4 hours | Medium (long-term) |
| 🟢 | Add structured data | 30 min | Low (long-term) |

---

*Last updated: 2026-02-06*
*Owner: Dylan*
