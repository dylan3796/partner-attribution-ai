/* JSON-LD structured data for SEO rich results */

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Covant",
    url: "https://covant.ai",
    description:
      "Covant is the AI-native PRM for B2B SaaS running more than one partner motion. It scores every partner, recommends the attribution model that fits each motion, and hands the team the next move. Partner Experience Management — the successor to the PRM. Replaces legacy PRM, syncs your CRM.",
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
      "The AI-native PRM for partner revenue. Covant scores every partner, recommends the attribution model that fits each motion, reconstructs the last 12 months, and surfaces the next move. Replaces legacy PRM, syncs your CRM.",
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
      "The AI-native PRM that tells you which partners drive revenue, which model to attribute them with, and what to do next.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
