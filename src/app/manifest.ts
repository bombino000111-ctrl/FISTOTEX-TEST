import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Fistotex",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
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
        src: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Financial Calculators",
        short_name: "Calculators",
        description: "Access 14+ financial calculators",
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