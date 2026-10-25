/* ────────────────────────────────────────────────────────────────
   Saved scenarios and recently used calculators.

   Kept in this browser's localStorage only — no account, nothing sent
   anywhere. Every read and write is guarded: storage can be blocked
   (private windows, strict settings), and the calculators must work the same
   without it.
   ──────────────────────────────────────────────────────────────── */

export interface SavedScenario {
  key: string;
  calcId: string;
  calcName: string;
  /** "key=value&…" — the same format as a shared link's hash */
  query: string;
  label: string;
  value: string;
  savedAt: number;
}

export interface RecentCalc {
  calcId: string;
  calcName: string;
  query: string;
  usedAt: number;
}

const SAVED_KEY = "fx-saved";
const RECENT_KEY = "fx-recent";
const MAX_SAVED = 24;
const MAX_RECENT = 6;
export const SCENARIOS_EVENT = "fx-scenarios-change";

function read<T>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Storage full or blocked: the scenario simply isn't kept
  }
  window.dispatchEvent(new Event(SCENARIOS_EVENT));
}

export function subscribeScenarios(onChange: () => void) {
  window.addEventListener(SCENARIOS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SCENARIOS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// useSyncExternalStore needs a stable snapshot between changes, so the raw
// string is cached and only re-parsed when it differs.
const cache: Record<string, { raw: string | null; list: unknown[] }> = {};
function snapshot<T>(key: string): T[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    // fall through with null
  }
  if (cache[key]?.raw !== raw) cache[key] = { raw, list: read<T>(key) };
  return cache[key].list as T[];
}

export const savedSnapshot = () => snapshot<SavedScenario>(SAVED_KEY);
export const recentSnapshot = () => snapshot<RecentCalc>(RECENT_KEY);
const EMPTY: never[] = [];
export const emptySnapshot = () => EMPTY;

export function saveScenario(s: Omit<SavedScenario, "key" | "savedAt">) {
  const list = read<SavedScenario>(SAVED_KEY).filter(
    (x) => !(x.calcId === s.calcId && x.query === s.query)
  );
  list.unshift({ ...s, key: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, savedAt: Date.now() });
  write(SAVED_KEY, list.slice(0, MAX_SAVED));
}

export function removeScenario(key: string) {
  write(SAVED_KEY, read<SavedScenario>(SAVED_KEY).filter((x) => x.key !== key));
}

export function recordRecent(r: Omit<RecentCalc, "usedAt">) {
  const list = read<RecentCalc>(RECENT_KEY).filter((x) => x.calcId !== r.calcId);
  list.unshift({ ...r, usedAt: Date.now() });
  write(RECENT_KEY, list.slice(0, MAX_RECENT));
}
