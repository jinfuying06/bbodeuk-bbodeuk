const STORAGE_KEY = "bbodeuk.preview.points.v2";
const MEMBER_KEY = "bbodeuk.preview.member.v1";
const INITIAL_BALANCE = 0;

export const SIGNUP_BONUS = 300;
/** Price of one paid expansion space. */
export const SPACE_PRICE = 300;

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

export function isMember(): boolean {
  try {
    return window.localStorage.getItem(MEMBER_KEY) === "true";
  } catch {
    return false;
  }
}

/** Prototype-only signup reward: adds SIGNUP_BONUS to the current balance and marks the browser as a member. */
export function grantSignupBonus(): number {
  const next = readPoints() + SIGNUP_BONUS;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
    window.localStorage.setItem(MEMBER_KEY, "true");
  } catch {
    // no-op: prototype has no server fallback
  }
  return next;
}

/** Marks the browser as an existing member without granting a fresh bonus (used by the login form). */
export function markMember(): void {
  try {
    window.localStorage.setItem(MEMBER_KEY, "true");
  } catch {
    // no-op: prototype has no server fallback
  }
}

/** Entering guest mode always starts from a clean 0P, non-member slate, even if this browser tested signup before. */
export function resetToGuest(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(INITIAL_BALANCE));
    window.localStorage.removeItem(MEMBER_KEY);
  } catch {
    // no-op: prototype has no server fallback
  }
}

/** Deducts `amount` if the balance covers it. Returns whether the spend went through; never goes negative. */
export function spendPoints(amount: number): boolean {
  const current = readPoints();
  if (current < amount) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(current - amount));
  } catch {
    // no-op: prototype has no server fallback
  }
  return true;
}
