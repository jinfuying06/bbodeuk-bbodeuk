/**
 * Single source of truth for spaces, cleaning items and cleaning records (2026-09-24).
 * Every screen reads from here so a record made anywhere shows up everywhere
 * (QuickRecord → History, ItemHistory, Home recency, Spaces …).
 *
 * - Spaces/items: static catalog (Figma page 02 names) + ItemInfo edits/deletes from itemStorage.
 * - Records: seeded relative to "now" on first load, then kept in sessionStorage
 *   (same session-scoped pattern the prototype used before). All dates are derived — no literals.
 */
import { useSyncExternalStore } from "react";
import { readHiddenItems, readOverrides } from "./itemStorage";
import { readSetup } from "./setup";

export type SpaceKey = "bathroom" | "kitchen" | "living" | "bedroom" | "terrace";

export type Space = {
  key: SpaceKey;
  label: string;
  /** Registry icon name (space-*). Use with `iconColor` / tailwind `text-space-*-icon`. */
  icon: string;
  /** Full space color (tailwind `sky-bath` etc.). */
  color: string;
  iconColor: string;
  /** Labels this space is stored under in bbodeuk.setup.v1 (legacy "침실 / 방" included). */
  setupKeys: string[];
};

export const SPACES: Space[] = [
  { key: "bathroom", label: "욕실", icon: "space-bath", color: "#dceefe", iconColor: "#41758e", setupKeys: ["욕실"] },
  { key: "kitchen", label: "주방", icon: "space-kitchen", color: "#fbe8d4", iconColor: "#95613c", setupKeys: ["주방"] },
  { key: "living", label: "거실", icon: "space-living", color: "#e9e1fa", iconColor: "#766095", setupKeys: ["거실"] },
  { key: "bedroom", label: "방", icon: "space-bed", color: "#e2efda", iconColor: "#5e7d4f", setupKeys: ["침실 / 방", "방"] },
  // Paid expansion space. Figma 43/공간 추가 완료 draws it with sky-bed + sky-deep icon.
  { key: "terrace", label: "테라스", icon: "space-terrace", color: "#e2efda", iconColor: "#146b63", setupKeys: ["베란다 / 다용도실", "테라스"] },
];

const FREE_SPACES: SpaceKey[] = ["bathroom", "kitchen", "living", "bedroom"];

export const isSpaceKey = (value: string | null | undefined): value is SpaceKey => SPACES.some((space) => space.key === value);

export function getSpace(key: SpaceKey): Space {
  const space = SPACES.find((entry) => entry.key === key) ?? SPACES[0];
  // The room's display name is user-editable at setup (default "방").
  return key === "bedroom" ? { ...space, label: readSetup().roomName } : space;
}

/** Spaces the user manages (from Setup), in Figma order. No setup yet → the 4 free spaces. */
export function getActiveSpaces(): Space[] {
  const chosen = readSetup().spaces;
  const keys = SPACES.filter((space) => space.setupKeys.some((label) => chosen.includes(label))).map((space) => space.key);
  return (keys.length > 0 ? keys : FREE_SPACES).map(getSpace);
}

/** Space color at `alpha` (0–1) as rgba — for policy fills / the v2 home card. On white this equals Figma's `--space-*-fill-N`. */
export function spaceColor(key: SpaceKey, alpha = 1): string {
  const hex = getSpace(key).color;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 1000) / 1000})`;
}

// ---------------------------------------------------------------------------------------------
// Items

export type Item = {
  id: string;
  /** Short name as shown in Figma cards/rows (세면대, 바닥 …). */
  name: string;
  /** Unambiguous name for titles ("거실 바닥 기록"). */
  fullName: string;
  space: SpaceKey;
  /** Recommended cycle in days (drives recency fade). */
  intervalDays: number;
  /** Registry icon: object-* art for 욕실, otherwise the space icon (Figma 34/35/36). */
  icon: string;
  /** "숨은 관리" — easy-to-miss spot (배수구, 후드 필터 …). */
  hiddenCare?: boolean;
};

type CatalogItem = Omit<Item, "fullName" | "icon"> & { fullName?: string; icon?: string };

const CATALOG: CatalogItem[] = [
  { id: "basin", name: "세면대", space: "bathroom", intervalDays: 7, icon: "object-sink" },
  { id: "toilet", name: "변기", space: "bathroom", intervalDays: 7, icon: "object-toilet" },
  { id: "shower", name: "샤워부스", space: "bathroom", intervalDays: 7, icon: "object-shower" },
  { id: "mirror", name: "거울", space: "bathroom", intervalDays: 10, icon: "object-mirror" },
  { id: "bath-floor", name: "바닥", fullName: "욕실 바닥", space: "bathroom", intervalDays: 7, icon: "object-floor" },
  { id: "drain", name: "배수구", space: "bathroom", intervalDays: 7, icon: "object-drain", hiddenCare: true },
  { id: "sink", name: "싱크대", space: "kitchen", intervalDays: 3 },
  { id: "countertop", name: "조리대", space: "kitchen", intervalDays: 5 },
  { id: "hood", name: "후드 필터", space: "kitchen", intervalDays: 21, hiddenCare: true },
  { id: "living-floor", name: "바닥", fullName: "거실 바닥", space: "living", intervalDays: 7 },
  { id: "shelf", name: "선반", space: "living", intervalDays: 7 },
  { id: "air-filter", name: "공기청정기", space: "living", intervalDays: 30, hiddenCare: true },
  { id: "bedding", name: "침구", space: "bedroom", intervalDays: 7 },
  { id: "pillow", name: "베개 커버", space: "bedroom", intervalDays: 7 },
  { id: "bedroom-floor", name: "바닥", fullName: "방 바닥", space: "bedroom", intervalDays: 7 },
  { id: "terrace-floor", name: "바닥", fullName: "테라스 바닥", space: "terrace", intervalDays: 14 },
  { id: "rail", name: "난간", space: "terrace", intervalDays: 21 },
  { id: "laundry", name: "빨래 공간", space: "terrace", intervalDays: 14 },
];

const toItem = (entry: CatalogItem): Item => ({
  ...entry,
  fullName: entry.fullName ?? entry.name,
  icon: entry.icon ?? getSpace(entry.space).icon,
});

/** All items (ItemInfo edits applied, deleted ones removed). Pass a space to filter. */
export function getItems(space?: SpaceKey): Item[] {
  const hidden = readHiddenItems();
  const overrides = readOverrides();
  return CATALOG.filter((entry) => !hidden.includes(entry.id))
    .map((entry) => {
      const override = overrides[entry.id];
      if (!override) return toItem(entry);
      return toItem({
        ...entry,
        name: override.name,
        fullName: override.name,
        space: isSpaceKey(override.space) ? override.space : entry.space,
        intervalDays: override.intervalDays,
        icon: isSpaceKey(override.space) && override.space !== entry.space ? undefined : entry.icon,
      });
    })
    .filter((item) => !space || item.space === space);
}

/** Looks up an item by id (also accepts a legacy name/fullName query param). Includes deleted items so old records still resolve. */
export function getItem(idOrName: string | null | undefined): Item | undefined {
  if (!idOrName) return undefined;
  const live = getItems().find((item) => item.id === idOrName || item.fullName === idOrName);
  if (live) return live;
  const raw = CATALOG.find((entry) => entry.id === idOrName || entry.fullName === idOrName || entry.name === idOrName);
  return raw ? toItem(raw) : undefined;
}

// ---------------------------------------------------------------------------------------------
// Records

export type CleaningRecord = { id: string; itemId: string; /** ISO timestamp */ at: string };

const RECORDS_KEY = "bbodeuk.session.records.v1";

/** [itemId, days ago, "HH:MM"] — nothing seeded for today, so "오늘 N곳" starts at 0 in a test. */
const SEED: Array<[string, number, string]> = [
  ["basin", 6, "20:10"],
  ["basin", 13, "19:50"],
  ["basin", 20, "07:10"],
  ["toilet", 3, "21:25"],
  ["toilet", 17, "21:00"],
  ["shower", 3, "21:40"],
  ["mirror", 1, "08:40"],
  ["bath-floor", 3, "21:50"],
  ["sink", 1, "19:15"],
  ["sink", 5, "20:40"],
  ["sink", 13, "19:20"],
  ["countertop", 3, "21:10"],
  ["hood", 28, "11:30"],
  ["living-floor", 3, "18:30"],
  ["living-floor", 11, "18:10"],
  ["shelf", 3, "18:45"],
  ["air-filter", 3, "11:00"],
  ["air-filter", 33, "10:30"],
  ["bedding", 1, "10:20"],
  ["bedding", 9, "10:05"],
  ["pillow", 9, "10:10"],
  ["bedroom-floor", 3, "22:00"],
];

function seedRecords(): CleaningRecord[] {
  const now = new Date();
  return SEED.map(([itemId, daysAgo, time], index) => {
    const [h, m] = time.split(":").map(Number);
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, h, m);
    return { id: `seed-${index}`, itemId, at: at.toISOString() };
  });
}

const byNewest = (a: CleaningRecord, b: CleaningRecord) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0);

let cache: CleaningRecord[] | null = null;
const listeners = new Set<() => void>();

function load(): CleaningRecord[] {
  try {
    const stored = window.sessionStorage.getItem(RECORDS_KEY);
    if (stored) return (JSON.parse(stored) as CleaningRecord[]).sort(byNewest);
  } catch {
    // corrupted / unavailable → reseed
  }
  return seedRecords().sort(byNewest);
}

function save(next: CleaningRecord[]) {
  cache = [...next].sort(byNewest);
  try {
    window.sessionStorage.setItem(RECORDS_KEY, JSON.stringify(cache));
  } catch {
    // storage unavailable — in-memory cache still updates this session
  }
  listeners.forEach((listener) => listener());
}

/** All records, newest first. Stable reference until something changes. */
export function getRecords(): CleaningRecord[] {
  if (!cache) cache = load();
  return cache;
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** React hook: re-renders when records are added/removed anywhere. */
export function useRecords(): CleaningRecord[] {
  return useSyncExternalStore(subscribe, getRecords, getRecords);
}

export function addRecord(itemId: string, at: Date = new Date()): CleaningRecord {
  const record = { id: `r-${at.getTime()}-${Math.random().toString(36).slice(2, 6)}`, itemId, at: at.toISOString() };
  save([record, ...getRecords()]);
  return record;
}

/** Undo: removes one record by id. */
export function removeRecord(recordId: string): void {
  save(getRecords().filter((record) => record.id !== recordId));
}

/**
 * QuickRecord-style tap: records the item, or — if it was already recorded today —
 * cancels today's record(s) for it ("재탭은 취소"). Returns what happened.
 */
export function toggleTodayRecord(itemId: string): "added" | "removed" {
  const today = getRecords().filter((record) => record.itemId === itemId && isToday(record.at));
  if (today.length > 0) {
    const ids = new Set(today.map((record) => record.id));
    save(getRecords().filter((record) => !ids.has(record.id)));
    return "removed";
  }
  addRecord(itemId);
  return "added";
}

// ---------------------------------------------------------------------------------------------
// Derived helpers (pass `records` from useRecords() so components re-render)

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Whole calendar days between `at` and now (0 = today, 1 = yesterday). */
export function daysAgo(at: string, now = new Date()): number {
  return Math.round((startOfDay(now).getTime() - startOfDay(new Date(at)).getTime()) / 86_400_000);
}

export const isToday = (at: string) => daysAgo(at) === 0;

export const recordsForItem = (itemId: string, records = getRecords()) => records.filter((record) => record.itemId === itemId);

export const lastRecord = (itemId: string, records = getRecords()) => records.find((record) => record.itemId === itemId);

export const isRecordedToday = (itemId: string, records = getRecords()) => records.some((record) => record.itemId === itemId && isToday(record.at));

export const todaysRecords = (records = getRecords()) => records.filter((record) => isToday(record.at));

/** Figma recency copy: 방금 기록했어요 (<10 min) · 오늘 기록 · 어제 기록 · N일 전 기록 · 아직 기록 없음. */
export function formatRecency(at: string | undefined, now = new Date()): string {
  if (!at) return "아직 기록 없음";
  if (now.getTime() - new Date(at).getTime() < 10 * 60_000) return "방금 기록했어요";
  const days = daysAgo(at, now);
  if (days <= 0) return "오늘 기록";
  if (days === 1) return "어제 기록";
  return `${days}일 전 기록`;
}

const timeFormatter = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" });
const dayFormatter = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "long" });

/** "오전 9:41" */
export const formatTime = (at: string) => timeFormatter.format(new Date(at));
/** "9월 16일 수요일" */
export const formatDay = (at: string | Date) => dayFormatter.format(new Date(at));
/** Local "YYYY-MM-DD" key for grouping by calendar day. */
export const dayKey = (at: string | Date) => {
  const date = new Date(at);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

// ---------------------------------------------------------------------------------------------
// Recency fade policy (AGENTS.md §6): staleness = elapsed ÷ cycle →
// 100/72/48/28% at 0 / 0.6 / 0.85 / ≥1.1, smoothly interpolated. Icons/text never fade.

const FADE_STOPS: Array<[number, number]> = [
  [0, 1],
  [0.6, 0.72],
  [0.85, 0.48],
  [1.1, 0.28],
];

export function fadeForStaleness(staleness: number): number {
  if (staleness <= 0) return 1;
  for (let i = 1; i < FADE_STOPS.length; i += 1) {
    const [s0, f0] = FADE_STOPS[i - 1];
    const [s1, f1] = FADE_STOPS[i];
    if (staleness <= s1) return f0 + ((f1 - f0) * (staleness - s0)) / (s1 - s0);
  }
  return FADE_STOPS[FADE_STOPS.length - 1][1];
}

/** elapsed days ÷ intervalDays; Infinity if never recorded. */
export function itemStaleness(item: Item, records = getRecords(), now = new Date()): number {
  const last = lastRecord(item.id, records);
  if (!last) return Infinity;
  return (now.getTime() - new Date(last.at).getTime()) / 86_400_000 / item.intervalDays;
}

/**
 * Per-item fade (1 … 0.28). Never-recorded items are 0 (Figma "fill-0" = white,
 * see Home/기록 없음) rather than the 28% floor.
 */
export const itemFade = (item: Item, records = getRecords()) => {
  const staleness = itemStaleness(item, records);
  return staleness === Infinity ? 0 : fadeForStaleness(staleness);
};

/** Space fade = average of its items' fades (Figma v2 card: "항목별 관리 주기 농도의 평균"). */
export function spaceFade(space: SpaceKey, records = getRecords()): number {
  const items = getItems(space);
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + itemFade(item, records), 0) / items.length;
}
