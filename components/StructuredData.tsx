/* JSON-LD structured data for SEO rich results */

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Covant",
    url: "https://covant.ai",
    description:
      "Partner Intelligence Platform — attribution, commission automation, and partner program management for B2B companies.",
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
      "Partner attribution, commission automation, and partner program management platform.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "Up to 5 partners, 3 commission rules",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "99",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "99",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
        description: "Up to 25 partners, Salesforce/HubSpot, multi-touch attribution",
      },
      {
        "@type": "Offer",
        name: "Scale",
        price: "349",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "349",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
        description: "Up to 100 partners, 2 programs, approval workflows",
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
      "Partner Intelligence Platform — attribution, commission automation, and partner program management.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://covant.ai/faq?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
