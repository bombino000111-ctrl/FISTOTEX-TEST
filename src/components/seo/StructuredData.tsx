import { siteConfig } from "@/config/site";
import { baseUrl as base, absoluteUrl } from "@/lib/seo";

interface StructuredDataProps {
  type:
    | "WebSite"
    | "Organization"
    | "WebPage"
    | "Article"
    | "FAQPage"
    | "BreadcrumbList"
    | "WebApplication";
  data?: {
    title?: string;
    description?: string;
    /** Absolute or site-relative URL of the page */
    url?: string;
    datePublished?: string;
    dateModified?: string;
    category?: string;
    tags?: string[];
    image?: string;
    questions?: Array<{ question: string; answer: string }>;
    items?: Array<{ name: string; url?: string }>;
  };
}

const orgId = `${base}/#organization`;
const siteId = `${base}/#website`;
const resolve = (url?: string) => (!url ? base : url.startsWith("http") ? url : absoluteUrl(url));

/**
 * Emits JSON-LD. Server-rendered (no "use client") so crawlers always see it
 * in the initial HTML. Entities reference each other by @id so Google and AI
 * search engines can join them into one knowledge graph for the site.
 */
export function StructuredData({ type, data = {} }: StructuredDataProps) {
  const pageUrl = resolve(data.url);

  const build: Record<StructuredDataProps["type"], () => Record<string, unknown>> = {
    WebSite: () => ({
      "@type": "WebSite",
      "@id": siteId,
      name: siteConfig.name,
      url: base,
      description: siteConfig.description,
      inLanguage: "en-IN",
      publisher: { "@id": orgId },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${base}/news?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    }),

    Organization: () => ({
      "@type": "Organization",
      "@id": orgId,
      name: siteConfig.ownerName,
      url: base,
      logo: { "@type": "ImageObject", url: `${base}/logo.png`, width: 512, height: 512 },
      image: `${base}${siteConfig.ogImage}`,
      description: siteConfig.description,
      email: siteConfig.contactEmail,
      founder: {
        "@type": "Person",
        "@id": `${base}/about#founder`,
        name: siteConfig.founder.name,
        jobTitle: siteConfig.founder.role,
        url: `${base}/about#founder`,
      },
      member: {
        "@type": "Person",
        "@id": `${base}/about#partner`,
        name: siteConfig.partner.name,
        jobTitle: siteConfig.partner.role,
        url: `${base}/about#partner`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contactEmail,
        url: `${base}/contact`,
        availableLanguage: ["en"],
        areaServed: "IN",
      },
      // Emitted only when a profile actually exists: `sameAs: []` tells Google
      // nothing and clutters the entity.
      ...(Object.values(siteConfig.social).filter(Boolean).length
        ? { sameAs: Object.values(siteConfig.social).filter(Boolean) }
        : {}),
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        ...(siteConfig.businessAddress ? { streetAddress: siteConfig.businessAddress } : {}),
      },
    }),

    WebPage: () => ({
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      name: data.title || siteConfig.name,
      description: data.description || siteConfig.description,
      url: pageUrl,
      inLanguage: "en-IN",
      isPartOf: { "@id": siteId },
      publisher: { "@id": orgId },
      ...(data.dateModified ? { dateModified: data.dateModified } : {}),
    }),

    Article: () => ({
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image || `${base}${siteConfig.ogImage}`,
      author: { "@id": orgId },
      publisher: { "@id": orgId },
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      articleSection: data.category,
      keywords: data.tags,
    }),

    FAQPage: () => ({
      "@type": "FAQPage",
      mainEntity: (data.questions || []).map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    }),

    BreadcrumbList: () => ({
      "@type": "BreadcrumbList",
      itemListElement: [
        ...(data.items?.[0]?.url === "/" ? [] : [{ name: "Home", url: "/" }]),
        ...(data.items || []),
      ].map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.url ? { item: resolve(item.url) } : {}),
      })),
    }),

    // Free online calculator: eligible for rich understanding as a web app
    WebApplication: () => ({
      "@type": "WebApplication",
      "@id": `${pageUrl}#app`,
      name: data.title,
      description: data.description,
      url: pageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      inLanguage: "en-IN",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      provider: { "@id": orgId },
      ...(data.dateModified ? { dateModified: data.dateModified } : {}),
    }),
  };

  const schema = { "@context": "https://schema.org", ...build[type]() };

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
