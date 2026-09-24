// Item edits/deletions made on ItemInfo, read back by Spaces.
const HIDDEN_ITEMS_KEY = "bbodeuk.hiddenItems.v1";
const OVERRIDES_KEY = "bbodeuk.itemOverrides.v1";

export type ItemOverride = { name: string; space: string; intervalDays: number };

export function readHiddenItems(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(HIDDEN_ITEMS_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function hideItem(id: string): void {
  try {
    const current = readHiddenItems();
    if (!current.includes(id)) {
      window.localStorage.setItem(HIDDEN_ITEMS_KEY, JSON.stringify([...current, id]));
    }
  } catch {
    // localStorage unavailable — deletion still reflects in this session's UI state.
  }
}

export function readOverrides(): Record<string, ItemOverride> {
  try {
    return JSON.parse(window.localStorage.getItem(OVERRIDES_KEY) ?? "{}") as Record<string, ItemOverride>;
  } catch {
    return {};
  }
}

export function writeOverride(id: string, override: ItemOverride): void {
  try {
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify({ ...readOverrides(), [id]: override }));
  } catch {
    // localStorage unavailable — edit still reflects in this session's UI state.
  }
}
