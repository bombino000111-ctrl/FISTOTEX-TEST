const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * The three months a quarter covers, in plain words: "2026-09-30" →
 * "Jul–Sep 2026". Fiscal labels like "Q2 FY27" mean different months for
 * different companies, so this is what readers see first.
 */
export function quarterMonths(periodEnd: string): string {
  const [y, m] = periodEnd.split("-").map(Number);
  // A quarter ending in the first days of a month (e.g. Nvidia's late-July
  // year end, Apple's last-Saturday quarters) belongs to the month before
  const d = Number(periodEnd.slice(8, 10));
  const endMonth = d <= 7 ? (m + 10) % 12 : m - 1;
  const endYear = d <= 7 && m === 1 ? y - 1 : y;
  const startMonth = (endMonth + 10) % 12;
  const startYear = endMonth < 2 ? endYear - 1 : endYear;
  return startYear === endYear
    ? `${MON[startMonth]}–${MON[endMonth]} ${endYear}`
    : `${MON[startMonth]} ${startYear}–${MON[endMonth]} ${endYear}`;
}
