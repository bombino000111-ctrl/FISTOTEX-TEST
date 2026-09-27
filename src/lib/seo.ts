import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const baseUrl = siteConfig.url.replace(/\/$/, "");

/** Absolute URL for a site path ("/" → homepage). */
export const absoluteUrl = (path: string) => (path === "/" ? baseUrl : `${baseUrl}${path}`);

/**
 * Per-page metadata with a self-referencing canonical and matching Open Graph /
 * Twitter tags. Use this on every route: a page that sets no canonical inherits
 * the layout's, which would point it at the homepage.
 */
export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Title for social cards when it should differ from the <title> */
  socialTitle?: string;
  /** Skip the "| Fistotex" template (used by the homepage) */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const shareTitle = socialTitle ?? (absoluteTitle ? title : `${title} | ${siteConfig.name}`);
  const images = [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: shareTitle }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      url,
      title: shareTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
