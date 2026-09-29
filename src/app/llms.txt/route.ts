import { siteConfig } from "@/config/site";
import { baseUrl } from "@/lib/seo";
import {
  calculators,
  categories,
  calculatorsByCategory,
  calculatorPath,
  categoryPath,
  calculatorsPath,
} from "@/lib/calculators/registry";
import { calculatorSeo, categorySeo } from "@/lib/calculators/seo-content";

export const dynamic = "force-static";

/**
 * /llms.txt: a plain-Markdown map of the site for AI assistants and answer
 * engines (https://llmstxt.org). Generated from the calculator registry so it
 * never drifts from the real pages.
 */
export function GET() {
  const calcLines = calculators
    .map((c) => {
      const seo = calculatorSeo[c.id];
      return `- [${c.name}](${baseUrl}${calculatorPath(c.id)}): ${seo?.description ?? c.tagline} Formula: ${c.formula.expression}`;
    })
    .join("\n");

  const categoryLines = categories
    .filter((cat) => calculatorsByCategory(cat.id).length > 0)
    .map((cat) => {
      const seo = categorySeo[cat.id];
      const names = calculatorsByCategory(cat.id)
        .map((c) => c.name)
        .join(", ");
      return `- [${cat.name} calculators](${baseUrl}${categoryPath(cat.id)}): ${seo?.description ?? cat.blurb} Includes: ${names}.`;
    })
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is an Indian personal-finance website. Every calculator is free, needs no sign-up, runs entirely in the browser and shows the exact formula and assumptions it uses. Amounts are in Indian rupees (₹). The news section aggregates headlines from established Indian financial publishers and links each one to the original article. Content is educational and is not investment, tax or legal advice.

## Calculators

${calcLines}

## Calculator categories

${categoryLines}

## Other pages

- [All finance calculators](${baseUrl}${calculatorsPath}): Index of every calculator grouped by goal.
- [Latest financial news](${baseUrl}/news): Live Indian market and personal-finance headlines with source attribution.
- [About](${baseUrl}/about): Who runs ${siteConfig.name} and how the calculators are checked.
- [Disclaimer](${baseUrl}/disclaimer): Limits of the estimates and the educational nature of the site.
- [Contact](${baseUrl}/contact): ${siteConfig.contactEmail}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
