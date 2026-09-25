import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Fistotex",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F0",
    theme_color: "#0B6E4F",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en-IN",
    categories: ["finance", "education", "utilities"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Financial Calculators",
        short_name: "Calculators",
        description: "Free SIP, EMI, FD, PPF and retirement calculators",
        url: "/toolkit/finance-calculator",
        icons: [{ src: "/favicon.svg", sizes: "96x96" }],
      },
      {
        name: "Financial News",
        short_name: "News",
        description: "Read latest financial news",
        url: "/news",
        icons: [{ src: "/favicon.svg", sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}