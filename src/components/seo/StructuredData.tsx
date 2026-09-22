import { siteConfig } from "@/config/site";

interface StructuredDataProps {
  type: "WebSite" | "Organization" | "WebPage" | "Article" | "FAQPage" | "BreadcrumbList";
  data?: {
    title?: string;
    description?: string;
    url?: string;
    datePublished?: string;
    dateModified?: string;
    category?: string;
    tags?: string[];
    image?: string;
    questions?: Array<{ question: string; answer: string }>;
    items?: Array<{ name: string; url?: string }>;
    [key: string]: unknown;
  };
}

/**
 * Emits JSON-LD. Server-rendered (no "use client") so crawlers always see it
 * in the initial HTML.
 */
export function StructuredData({ type, data = {} }: StructuredDataProps) {
  const base = siteConfig.url.replace(/\/$/, "");

  const schemas: Record<string, Record<string, unknown>> = {
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: base,
      description: siteConfig.description,
      inLanguage: "en-IN",
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: base,
      },
    },

    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.ownerName,
      url: base,
      logo: `${base}/icon.svg`,
      email: siteConfig.contactEmail,
      sameAs: [
        siteConfig.social.twitter,
        siteConfig.social.facebook,
        siteConfig.social.linkedin,
        siteConfig.social.instagram,
        siteConfig.social.youtube,
      ].filter(Boolean),
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        ...(siteConfig.businessAddress ? { streetAddress: siteConfig.businessAddress } : {}),
      },
    },

    WebPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: data.title || siteConfig.name,
      description: data.description || siteConfig.description,
      url: data.url || base,
      inLanguage: "en-IN",
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: base },
      publisher: { "@type": "Organization", name: siteConfig.name },
    },

    Article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image || `${base}${siteConfig.ogImage}`,
      author: { "@type": "Organization", name: siteConfig.name, url: base },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: { "@type": "ImageObject", url: `${base}/icon.svg` },
      },
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      mainEntityOfPage: { "@type": "WebPage", "@id": data.url },
      articleSection: data.category,
      keywords: data.tags,
    },

    FAQPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (data.questions || []).map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    },

    BreadcrumbList: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: (data.items || []).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.url ? { item: item.url.startsWith("http") ? item.url : `${base}${item.url}` } : {}),
      })),
    },
  };

  const schema = { ...schemas[type], ...data };
  if (data.items) schema.itemListElement = schemas.BreadcrumbList.itemListElement;
  if (data.questions) schema.mainEntity = schemas.FAQPage.mainEntity;

  return (
    <script
      type="application/ld+json"
      data-schema-type={type}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** FAQ content per calculator, reused for both schema and on-page copy. */
export function generateCalculatorFAQ(calculatorId: string) {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    sip: [
      {
        question: "What is a SIP?",
        answer:
          "SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly in mutual funds at predetermined intervals, typically monthly.",
      },
      {
        question: "How is SIP return calculated?",
        answer:
          "SIP returns are calculated using the future value of an annuity formula: FV = P × [((1+r)^n − 1) / r] × (1+r), where P is the monthly investment, r is the monthly rate, and n is the number of months.",
      },
      {
        question: "Is SIP return guaranteed?",
        answer:
          "No. SIP returns are not guaranteed. They depend on market performance and the underlying assets of the mutual fund scheme.",
      },
      {
        question: "What is the minimum amount for a SIP?",
        answer:
          "Most mutual funds allow a SIP starting from ₹500 per month, though some schemes have higher minimums.",
      },
    ],
    emi: [
      {
        question: "What is EMI?",
        answer:
          "EMI (Equated Monthly Instalment) is the fixed payment a borrower makes to a lender each month until the loan is fully repaid.",
      },
      {
        question: "How is EMI calculated?",
        answer:
          "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate, and n is the number of monthly instalments.",
      },
      {
        question: "Can I prepay my loan?",
        answer:
          "Most loans allow prepayment. Check with your lender, as some products carry prepayment charges.",
      },
    ],
    fd: [
      {
        question: "What is a Fixed Deposit?",
        answer:
          "A Fixed Deposit (FD) is a bank instrument that pays a fixed rate of interest on a lump sum for a fixed term, typically higher than a savings account.",
      },
      {
        question: "How is FD interest calculated?",
        answer:
          "A = P(1 + r/n)^(nt), where P is the principal, r the annual rate, n the compounding frequency per year, and t the tenure in years.",
      },
      {
        question: "Is FD interest taxable?",
        answer:
          "Yes. FD interest is taxed at your income-tax slab rate, and TDS applies once interest crosses the annual threshold.",
      },
    ],
    ppf: [
      {
        question: "What is PPF?",
        answer:
          "Public Provident Fund is a government-backed, long-term savings scheme in India with tax benefits under Section 80C.",
      },
      {
        question: "What is the current PPF interest rate?",
        answer:
          "The PPF rate is notified by the government every quarter. This calculator defaults to 7.1% — change it to the current notified rate.",
      },
      {
        question: "What is the PPF lock-in period?",
        answer:
          "PPF has a 15-year maturity. Partial withdrawals are permitted from the 7th financial year.",
      },
    ],
    retirement: [
      {
        question: "How much do I need for retirement?",
        answer:
          "A common rule of thumb is 25–30× your annual expenses. Use the calculator to model your own numbers, including inflation.",
      },
      {
        question: "When should I start retirement planning?",
        answer:
          "As early as possible. Starting in your 20s gives compounding the most time to work; it is never too late to begin.",
      },
    ],
  };

  return faqs[calculatorId] || [];
}
