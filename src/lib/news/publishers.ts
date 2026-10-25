/**
 * House colours for the publishers we syndicate. Each is a single ink tone;
 * the `.stamp` / `.tint-text` classes derive the wash behind it and lift the
 * tone in dark mode, so one value per publisher is all that's needed.
 */
const publisherTints: Record<string, string> = {
  mint: "#A3430B",
  moneycontrol: "#0B5C99",
  "business-standard": "#8E1F1F",
  "economic-times": "#0A6C35",
  businessline: "#7A4B12",
};

/** Short slug the wire prints, e.g. "BS" rather than "Business Standard". */
const publisherSlugs: Record<string, string> = {
  mint: "MINT",
  moneycontrol: "MONEYCONTROL",
  "business-standard": "BS",
  "economic-times": "ET",
  businessline: "BL",
};

/** Falls back to the house gold-brown for any source we haven't styled. */
export function publisherTint(sourceId: string): string {
  return publisherTints[sourceId] ?? "#8A5A1F";
}

export function publisherSlug(sourceId: string, fallback: string): string {
  return publisherSlugs[sourceId] ?? fallback.toUpperCase();
}
