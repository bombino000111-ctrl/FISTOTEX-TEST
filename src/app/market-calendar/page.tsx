import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { CalendarList } from "@/components/market-calendar/calendar-list";
import { marketEvents } from "@/lib/market-calendar/events";
import { recurringEvents } from "@/lib/market-calendar/recurring";
import { resultsEvents } from "@/lib/market-calendar/results";
import { upcomingResultsMeetings } from "@/lib/nse";
import { todayInIndia } from "@/lib/market-calendar/dates";
import { siteConfig } from "@/config/site";

// Re-render hourly so countdowns stay current and past events drop off
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Market Calendar: RBI, CPI, GDP & Results Dates",
  description:
    "Upcoming RBI rate decisions, inflation and GDP releases, the Budget and company results dates, with what each means for savers, borrowers and investors. Add any event to your calendar.",
  path: "/market-calendar",
});

export default async function MarketCalendarPage() {
  const today = todayInIndia();
  const meetings = await upcomingResultsMeetings(today);
  const events = [...recurringEvents(today), ...marketEvents, ...resultsEvents(meetings)];

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
        title="What's coming up for your money"
        description="Rate decisions, inflation and growth data, the Budget and company results, in date order. Each says what it means for you and links to the authority that sets it."
        crumbs={[{ name: "Market Calendar" }]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <CalendarList events={events} today={today} liveResults={meetings.length > 0} />

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
