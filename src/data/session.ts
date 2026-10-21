// Session-only mock auth (sessionStorage = this browser tab only). No server: closing the tab drops the account and session.
const SESSION_KEY = "bbodeuk.session.v1";
const ACCOUNT_KEY = "bbodeuk.account.v1";

export type Session = { mode: "guest" | "member"; nickname?: string; email?: string };
type Account = { email: string; nickname: string; passwordHash: string };

function read<T>(key: string): T | null {
  try {
    return JSON.parse(window.sessionStorage.getItem(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op: prototype has no server fallback
  }
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const normalize = (email: string) => email.trim().toLowerCase();

export const getSession = () => read<Session>(SESSION_KEY);
export const hasAccount = () => read<Account>(ACCOUNT_KEY) !== null;
export const startGuest = () => write(SESSION_KEY, { mode: "guest" } satisfies Session);

/** One account per tab; signing up again replaces it. Only the SHA-256 hash of the password is stored. */
export async function signUp({ email, password, nickname }: { email: string; password: string; nickname: string }): Promise<void> {
  write(ACCOUNT_KEY, { email: normalize(email), nickname: nickname.trim(), passwordHash: await sha256(password) } satisfies Account);
}

export async function logIn(email: string, password: string): Promise<boolean> {
  const account = read<Account>(ACCOUNT_KEY);
  if (!account || account.email !== normalize(email) || account.passwordHash !== (await sha256(password))) return false;
  write(SESSION_KEY, { mode: "member", nickname: account.nickname, email: account.email } satisfies Session);
  return true;
}

export function logOut(): void {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // no-op
  }
}
