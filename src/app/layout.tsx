import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Dateline } from "@/components/layout/dateline";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GA4, GA4PageView } from "@/components/analytics/GA4";
import { StructuredData } from "@/components/seo/StructuredData";
import { themeInitScript } from "@/components/layout/theme-toggle";
import { consentInitScript } from "@/components/ads/consent";

// Body and UI. Variable font — no weight list needed.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

// Editorial serif for the masthead, headlines and money figures.
// Italic is loaded because the lead headline sets a clause in it.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// Datelines, slugs and statutory stamps are set in monospace, the way a
// wire service prints them.
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Financial News, Calculators & Money Tools`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  keywords: [
    "finance",
    "financial calculator",
    "investment calculator",
    "SIP calculator",
    "EMI calculator",
    "FD calculator",
    "PPF calculator",
    "mutual fund",
    "stock market",
    "personal finance",
    "financial news",
    "India",
    "Fistotex",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: `${siteConfig.name} — Financial News, Calculators & Money Tools`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Financial News, Calculators & Money Tools`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  // No site-wide canonical: each page sets its own via pageMetadata(), so
  // pages can never inherit the homepage URL by accident.
  formatDetection: { telephone: false, email: false, address: false },
  // AdSense verifies site ownership from this tag as well as from the loader
  // script and ads.txt. Having all three means verification cannot stall on a
  // single missing signal.
  ...(siteConfig.adsense.clientId
    ? { other: { "google-adsense-account": siteConfig.adsense.clientId } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#12151A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${jakarta.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Consent Mode v2 defaults. Must be the first script on the page: both
          gtag.js and the AdSense loader read this state as they initialise, so
          anything set after them is set too late.
        */}
        <script dangerouslySetInnerHTML={{ __html: consentInitScript }} />

        {/* Apply the saved/system theme before first paint (no flash) */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        {siteConfig.gaId && (
          <>
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          </>
        )}

        {/*
          AdSense loader. Deliberately a plain async <script> in <head> rather
          than next/script: AdSense verifies the site by fetching the raw HTML,
          and next/script's strategies inject after hydration, where the
          reviewer's fetch would not see it. `async` keeps it off the critical
          path so it costs nothing in Core Web Vitals.
        */}
        {siteConfig.adsense.enabled && siteConfig.adsense.clientId && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.clientId}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <GA4 />
        <GA4PageView />
        <Dateline />
        <Header />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />

        {/* Site-wide structured data, emitted once */}
        <StructuredData type="WebSite" />
        <StructuredData type="Organization" />
      </body>
    </html>
  );
}
