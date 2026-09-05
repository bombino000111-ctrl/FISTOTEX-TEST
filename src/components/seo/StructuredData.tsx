"use client";

import { useEffect } from "react";
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
    items?: Array<{ name: string; url: string }>;
    [key: string]: unknown;
  };
}

export function StructuredData({ type, data = {} }: StructuredDataProps) {
  useEffect(() => {
    // Remove any existing structured data of this type
    const existingScript = document.querySelector(`script[data-schema-type="${type}"]`);
    if (existingScript) {
      existingScript.remove();
    }
  }, [type]);

  const schemas = {
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
        },
      },
      ...data,
    },

    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
      sameAs: [
        siteConfig.social.twitter || "",
        siteConfig.social.facebook || "",
        siteConfig.social.linkedin || "",
        siteConfig.social.instagram || "",
        siteConfig.social.youtube || "",
      ].filter(Boolean),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
        email: siteConfig.contactEmail,
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        ...(siteConfig.businessAddress && { streetAddress: siteConfig.businessAddress }),
      },
      ...data,
    },

    WebPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: data.title || siteConfig.name,
      description: data.description || siteConfig.description,
      url: data.url || siteConfig.url,
      isPartOf: {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      ...data,
    },

    Article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image || siteConfig.ogImage,
      author: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
        },
      },
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": data.url,
      },
      articleSection: data.category,
      keywords: data.tags,
      ...data,
    },

    FAQPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.questions?.map((q: { question: string; answer: string }) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer,
        },
      })) || [],
      ...data,
    },

    BreadcrumbList: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data.items?.map((item: { name: string; url: string }, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
      })) || [],
      ...data,
    },
  };

  const schema = schemas[type];

  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      data-schema-type={type}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Helper to generate FAQ schema for calculator pages
export function generateCalculatorFAQ(calculatorId: string) {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    sip: [
      {
        question: "What is a SIP?",
        answer: "SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly in mutual funds at predetermined intervals, typically monthly.",
      },
      {
        question: "How is SIP return calculated?",
        answer: "SIP returns are calculated using the future value of annuity formula: FV = P × [((1+r)^n - 1) / r] × (1+r), where P is monthly investment, r is monthly rate, and n is number of months.",
      },
      {
        question: "Is SIP return guaranteed?",
        answer: "No, SIP returns are not guaranteed. They depend on market performance and the underlying assets of the mutual fund scheme.",
      },
      {
        question: "What is the minimum amount for SIP?",
        answer: "Most mutual funds allow SIP starting from ₹500 per month, though some may have higher minimums.",
      },
    ],
    emi: [
      {
        question: "What is EMI?",
        answer: "EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.",
      },
      {
        question: "How is EMI calculated?",
        answer: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal loan amount, r is monthly interest rate, and n is number of monthly installments.",
      },
      {
        question: "Can I prepay my loan?",
        answer: "Yes, most loans allow prepayment. Check with your lender for prepayment charges or conditions.",
      },
    ],
    fd: [
      {
        question: "What is a Fixed Deposit?",
        answer: "A Fixed Deposit (FD) is a financial instrument provided by banks which provides investors a higher rate of interest than a regular savings account, until the given maturity date.",
      },
      {
        question: "How is FD interest calculated?",
        answer: "FD interest is calculated using compound interest formula: A = P(1+r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time in years.",
      },
      {
        question: "Is FD interest taxable?",
        answer: "Yes, interest earned on FDs is taxable as per your income tax slab. TDS is deducted if interest exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year.",
      },
    ],
    ppf: [
      {
        question: "What is PPF?",
        answer: "Public Provident Fund (PPF) is a government-backed long-term savings scheme in India with tax benefits under Section 80C.",
      },
      {
        question: "What is the current PPF interest rate?",
        answer: "PPF interest rate is set by the government quarterly. As of 2024, it is 7.1% per annum (subject to change).",
      },
      {
        question: "What is the PPF lock-in period?",
        answer: "PPF has a 15-year lock-in period. Partial withdrawals are allowed from the 7th financial year.",
      },
    ],
    retirement: [
      {
        question: "How much do I need for retirement?",
        answer: "A common rule is 25-30 times your annual expenses. Use our calculator to estimate based on your specific situation.",
      },
      {
        question: "When should I start retirement planning?",
        answer: "The earlier the better. Starting in your 20s gives compound interest more time to work. It's never too late to start.",
      },
    ],
  };

  return faqs[calculatorId] || [];
}