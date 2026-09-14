const STORAGE_KEY = "bbodeuk.preview.points.v2";
const INITIAL_BALANCE = 500;

export function readPoints(): number {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return INITIAL_BALANCE;
    const value = Number(stored);
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : INITIAL_BALANCE;
  } catch {
    return INITIAL_BALANCE;
  }
}
