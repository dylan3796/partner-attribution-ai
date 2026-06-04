/* JSON-LD structured data for SEO rich results */

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Covant",
    url: "https://covant.ai",
    description:
      "Covant is Partner Experience Management for B2B SaaS running more than one partner motion. It guides every partner to their next win, scores and ranks partners so the team knows who to back, and settles attribution underneath. Replaces the PRM-plus-portal stack, syncs your CRM.",
    foundingDate: "2026",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@covant.ai",
      contactType: "sales",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Covant",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://covant.ai",
    description:
      "Partner Experience Management for partner revenue. Covant guides every partner to their next win, scores and ranks partners so the team knows who to back, recommends the attribution model that fits each motion, and surfaces the next move. Replaces the PRM-plus-portal stack, syncs your CRM.",
    offers: [
      {
        "@type": "Offer",
        name: "Design Partner Pilot",
        price: "0",
        priceCurrency: "USD",
        description: "Free during pilot for design partners. Full platform access. Locked-in pricing at general availability.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQSchema({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Covant",
    url: "https://covant.ai",
    description:
      "Partner Experience Management that guides every partner to their next win, tells you which partners to back, and settles attribution underneath.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
