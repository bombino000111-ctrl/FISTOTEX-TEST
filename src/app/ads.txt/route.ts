import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

/**
 * /ads.txt — the IAB authorised-digital-sellers file.
 *
 * Without it AdSense shows an "Earnings at risk" warning and some buyers will
 * not bid on the inventory at all, because they cannot verify that this domain
 * really authorises Google to sell its ad space.
 *
 * Generated from siteConfig so the publisher ID can never drift from the one in
 * the loader script. `f08c47fec0942fa0` is Google's own certification-authority
 * ID and is the same for every AdSense publisher.
 */
const GOOGLE_CERTIFICATION_AUTHORITY_ID = "f08c47fec0942fa0";

export function GET() {
  // ads.txt records take the publisher ID without the "ca-" prefix.
  const publisherId = siteConfig.adsense.clientId.replace(/^ca-/, "");

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, ${GOOGLE_CERTIFICATION_AUTHORITY_ID}\n`
    : "";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
