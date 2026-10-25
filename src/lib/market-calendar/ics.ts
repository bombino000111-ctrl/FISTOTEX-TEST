import type { MarketEvent } from "@/types/market-calendar";

/** Escape text for an iCalendar property value (RFC 5545 §3.3.11). */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

const compact = (isoDate: string) => isoDate.replace(/-/g, "");

function nextDay(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * A one-event .ics file as an all-day entry, which every calendar app
 * (Google, Apple, Outlook) can import. The release time goes in the notes,
 * since many releases have no fixed minute.
 */
export function eventToIcs(event: MarketEvent): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const details = [event.time && `Time: ${event.time}`, event.forYou, `Source: ${event.sourceUrl}`]
    .filter(Boolean)
    .join("\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fistotex//Market calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@fistotex.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(event.nextDate)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(event.nextDate))}`,
    `SUMMARY:${esc(event.event)}`,
    `DESCRIPTION:${esc(details)}`,
    `URL:${event.sourceUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

/** Hand the visitor an .ics file to open in their calendar app. */
export function downloadIcs(event: MarketEvent) {
  const blob = new Blob([eventToIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
