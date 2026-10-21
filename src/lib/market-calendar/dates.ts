/** Today's calendar date in India (YYYY-MM-DD), whatever the server's timezone. */
export function todayInIndia(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD
  return now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Whole days from one YYYY-MM-DD date to another. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}
