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
    "Dates for RBI MPC decisions, the US Fed FOMC, India GDP, CPI and IIP releases, the Union Budget and earnings season — each flagged bidirectional where the outcome decides market direction, with sources.",
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
        eyebrow="Market calendar"
        title={
          <>
            Events that move <span className="text-accent">Indian markets</span>
          </>
        }
        description="The next occurrence of every scheduled catalyst — rate decisions, data releases, the Budget and earnings season — each with its source. Most are flagged bidirectional: the outcome, not the date, decides market direction."
        crumbs={[{ name: "Market Calendar" }]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <CalendarList events={marketEvents} today={today} />

          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Dates are sourced from each issuing authority and can shift as official calendars are
            confirmed; those marked &ldquo;Estimated date&rdquo; are not yet official. Countdowns use
            Indian Standard Time. Sentiment tags reflect the typical market reaction to this event, not a
            prediction of the outcome — &ldquo;Bidirectional&rdquo; means the result can move the
            market either way.
          </p>
        </div>
      </section>
    </div>
  );
}
