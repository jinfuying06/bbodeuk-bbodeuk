export const SETUP_KEY = "bbodeuk.setup.v1";

export type SetupData = {
  spaces: string[];
  roomName: string;
};

export function readSetup(): SetupData {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SETUP_KEY) ?? "{}") as Partial<SetupData>;
    return { spaces: parsed.spaces ?? [], roomName: parsed.roomName?.trim() || "방" };
  } catch {
    return { spaces: [], roomName: "방" };
  }
}

export function writeSetup(data: SetupData): void {
  try {
    window.localStorage.setItem(SETUP_KEY, JSON.stringify(data));
  } catch {
    // no-op: prototype has no server fallback
  }
}

export function hasCompletedSetup(): boolean {
  try {
    return window.localStorage.getItem(SETUP_KEY) !== null;
  } catch {
    return false;
  }
}

/** The four spaces offered free at Setup. Required ones can't be toggled off from space management. */
export const DEFAULT_SPACES: Array<{ key: string; label: string; icon: string; required: boolean }> = [
  { key: "거실", label: "거실", icon: "weekend", required: false },
  { key: "주방", label: "주방", icon: "soup_kitchen", required: true },
  { key: "욕실", label: "욕실", icon: "water_drop", required: true },
  { key: "침실 / 방", label: "방", icon: "bed", required: false },
];

/** Paid spaces a member can add beyond the four defaults. */
export const EXPANSION_CATALOG: Array<{ key: string; label: string; icon: string; price: number; previewItems: string[] }> = [
  {
    key: "베란다 / 다용도실",
    label: "베란다",
    icon: "balcony",
    price: 300,
    previewItems: ["베란다 바닥", "난간", "빨래 공간"],
  },
];
