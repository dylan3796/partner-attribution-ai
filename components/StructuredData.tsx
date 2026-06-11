/* JSON-LD structured data for SEO rich results */

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Covant",
    url: "https://covant.ai",
    description:
      "Covant is the revenue engine for your channel — the system partner pipeline runs in. Deals get registered, progress, and get credited in Covant, with every commission calculated and explained. Replaces the PRM-plus-CRM-reports patchwork; Salesforce and HubSpot sync underneath.",
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
      "The revenue engine for your channel. Partner deals get registered, progress, and get credited in Covant — explainable attribution, partner scoring, and next-best-actions underneath. Replaces the PRM-plus-CRM-reports patchwork; syncs your CRM.",
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
      "The revenue engine for your channel — partner deals register, progress, and get credited in one system, every commission explained.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
