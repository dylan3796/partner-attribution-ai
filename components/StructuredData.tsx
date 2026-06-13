/* JSON-LD structured data for SEO rich results */

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Covant",
    url: "https://covant.ai",
    description:
      "Covant is partner experience management, powered by the Channel Graph — a living model of how a company's channel operates, built from their data. The graph surfaces the right partner on live deals; journeys, the partner portal, and conversational access over MCP deliver it. Your CRM stays the system of record.",
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
      "Partner experience management powered by the Channel Graph. The graph models your channel from your data and surfaces the right partner on live deals; journeys, the partner portal, and MCP access deliver it. Your CRM stays the system of record.",
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
      "Partner experience management powered by the Channel Graph — the right partner on every live deal, journeys both sides track, a portal partners use.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
