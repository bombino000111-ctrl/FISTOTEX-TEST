import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { CalendarList } from "@/components/market-calendar/calendar-list";
import { marketEvents } from "@/lib/market-calendar/events";
import { todayInIndia } from "@/lib/market-calendar/dates";
import { siteConfig } from "@/config/site";

// Re-render hourly so countdowns stay current and past events drop off
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Market Calendar — Upcoming Events That Move Indian Markets",
  description:
    "Dates for RBI MPC decisions, the US Fed FOMC, India GDP, CPI and IIP releases, the Union Budget and earnings season — each with its official source.",
  path: "/market-calendar",
});

export default function MarketCalendarPage() {
  const today = todayInIndia();

  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: "Market Calendar",
          description: "Upcoming events that move Indian stock markets.",
          url: `${siteConfig.url.replace(/\/$/, "")}/market-calendar`,
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [
            { name: "Home", url: "/" },
            { name: "Market Calendar" },
          ],
        }}
      />

      <PageHeader
        title="What moves the market next"
        description="Rate decisions, data releases, the Budget and results season, in date order, each linked to the authority that sets it. The outcome decides the direction, not the date."
        crumbs={[{ name: "Market Calendar" }]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <CalendarList events={marketEvents} today={today} />

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Dates are sourced from each issuing authority and can shift as official calendars are
            confirmed; those marked &ldquo;Estimated date&rdquo; are not yet official. Countdowns use
            Indian Standard Time. Each listed event can move the market either way, depending on the
            outcome.
          </p>
        </div>
      </section>
    </div>
  );
}
