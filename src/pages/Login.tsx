import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthHero from "../components/AuthHero";
import CheckRow from "../components/CheckRow";
import GlassButton from "../components/GlassButton";
import PageShell from "../components/PageShell";
import Segmented from "../components/Segmented";
import Toast, { useToast } from "../components/Toast";
import { hasCompletedSetup } from "../data/setup";
import { hasAccount, logIn, signUp, startGuest } from "../data/session";

type Tab = "login" | "signup";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "login", label: "로그인" },
  { key: "signup", label: "회원가입" },
];

const TERMS = [
  { key: "terms", label: "[필수] 만 14세 이상 · 이용약관 동의" },
  { key: "privacy", label: "[필수] 개인정보 수집·이용 동의" },
] as const;

type TermKey = (typeof TERMS)[number]["key"];

const EMAIL = /^\S+@\S+\.\S+$/;

/**
 * `error` (string or false) gives the field a live message slot (`${id}-msg`) whose height is
 * always reserved, so the message appearing doesn't push the layout. `note` is a muted caption
 * shown under the error; its line is reserved too.
 */
function Field({ id, label, children, error, note }: { id: string; label: string; children: React.ReactNode; error?: string | false; note?: string }) {
  return (
    <div className="flex min-h-[84px] flex-col gap-1.5">
      <label className="text-bb-label text-sky-ink" htmlFor={id}>
        {label}
      </label>
      {children}
      {error === undefined ? null : (
        <div aria-live="polite" className={note ? "min-h-[37px]" : "min-h-[19px]"} id={`${id}-msg`}>
          {error ? (
            <>
              <p className="text-bb-label-sm text-sky-ink">{error}</p>
              {note ? <p className="text-bb-caption text-sky-muted">{note}</p> : null}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * App start screen (2026-10-21): 로그인 / 회원가입 tabs + 게스트로 시작하기.
 * Session-only mock auth (src/data/session.ts) — the account lives in this browser tab only.
 */
export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(params.get("tab") === "signup" ? "signup" : "login");
  const [toast, showToast] = useToast();

  // 로그인
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  // 회원가입
  const [signupEmail, setSignupEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({ terms: false, privacy: false });
  const mismatch = confirm !== "" && confirm !== signupPassword;
  const signupReady =
    EMAIL.test(signupEmail.trim()) && nickname.trim() !== "" && signupPassword !== "" && confirm !== "" && !mismatch && TERMS.every((term) => agreed[term.key]);

  const enterApp = () => navigate(hasCompletedSetup() ? "/home" : "/welcome", { replace: true });

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await logIn(email, password)) enterApp();
    else setLoginError(true);
  };

  const submitSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signupReady) return;
    try {
      await signUp({ email: signupEmail, password: signupPassword, nickname });
    } catch {
      // crypto.subtle only exists on https / localhost.
      showToast("이 주소에서는 가입할 수 없어요");
      return;
    }
    setEmail(signupEmail.trim());
    setPassword("");
    setLoginError(false);
    setTab("login");
    showToast("가입했어요. 로그인해 주세요.");
  };

  const startAsGuest = () => {
    startGuest();
    // The explicit guest button always shows the onboarding, even when setup is done (2026-10-22).
    navigate("/welcome", { replace: true });
  };

  return (
    <PageShell bottomNav={false}>
      {/* Start screen: no back button; same inline brand header as Welcome. */}
      <header className="pt-safe">
        <div className="flex h-header items-center justify-center px-4">
          <span className="text-bb-label text-sky-ink">{tab === "login" ? "로그인" : "회원가입"}</span>
        </div>
      </header>
      <main className="flex flex-col gap-3 px-margin-screen pb-7">
        <AuthHero />
        <h1 className="flex flex-col items-center gap-1 pb-2 text-center">
          <span className="text-bb-body text-sky-muted">색으로 채우는 나의 청소 기록</span>
          <span className="text-[32px] font-bold leading-[40px] text-sky-ink">뽀득뽀득</span>
        </h1>

        <Segmented label="로그인 또는 회원가입" options={TABS} tabsId="auth" value={tab} onChange={setTab} />

        {tab === "login" ? (
          <form aria-labelledby="auth-tab-login" className="flex flex-col gap-3" id="auth-panel-login" noValidate role="tabpanel" onSubmit={submitLogin}>
            <Field id="login-email" label="이메일">
              <input
                aria-describedby={loginError ? "login-password-msg" : undefined}
                aria-invalid={loginError || undefined}
                autoComplete="email"
                className="bb-field"
                id="login-email"
                inputMode="email"
                placeholder="이메일을 입력해 주세요"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setLoginError(false);
                }}
              />
            </Field>
            <Field
              error={loginError && "이메일 또는 비밀번호를 확인해 주세요."}
              id="login-password"
              label="비밀번호"
              note={hasAccount() ? undefined : "이 탭에서 가입한 계정만 로그인할 수 있어요."}
            >
              <input
                aria-describedby={loginError ? "login-password-msg" : undefined}
                aria-invalid={loginError || undefined}
                autoComplete="current-password"
                className="bb-field"
                id="login-password"
                placeholder="비밀번호를 입력해 주세요"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setLoginError(false);
                }}
              />
            </Field>
            <GlassButton disabled={!email || !password} size={52} type="submit">
              로그인하기
            </GlassButton>
          </form>
        ) : (
          <form aria-labelledby="auth-tab-signup" className="flex flex-col gap-2" id="auth-panel-signup" noValidate role="tabpanel" onSubmit={submitSignup}>
            <Field id="signup-email" label="이메일">
              <input
                autoComplete="email"
                className="bb-field"
                id="signup-email"
                inputMode="email"
                placeholder="이메일을 입력해 주세요"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </Field>
            <Field id="signup-nickname" label="닉네임">
              <input autoComplete="nickname" className="bb-field" id="signup-nickname" placeholder="불러드릴 이름을 알려주세요" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </Field>
            <Field id="signup-password" label="비밀번호">
              <input
                autoComplete="new-password"
                className="bb-field"
                id="signup-password"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </Field>
            <Field error={mismatch && "비밀번호가 일치하지 않아요."} id="signup-confirm" label="비밀번호 확인">
              <input
                aria-describedby={mismatch ? "signup-confirm-msg" : undefined}
                aria-invalid={mismatch || undefined}
                autoComplete="new-password"
                className="bb-field"
                id="signup-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Field>

            {TERMS.map((term) => (
              <CheckRow key={term.key} label={term.label} on={agreed[term.key]} onClick={() => setAgreed((current) => ({ ...current, [term.key]: !current[term.key] }))} />
            ))}

            <p className="py-1 text-bb-caption text-sky-muted">
              체험용 가입이에요. 이 브라우저 탭을 닫으면 가입 정보가 사라져요.
              <br />
              실제로 쓰는 비밀번호는 넣지 마세요.
            </p>
            <GlassButton disabled={!signupReady} size={52} type="submit">
              가입하기
            </GlassButton>
          </form>
        )}

        <button className="text-link w-full" type="button" onClick={startAsGuest}>
          게스트로 시작하기
        </button>
      </main>
      <Toast message={toast} visible={Boolean(toast)} pill />
    </PageShell>
  );
}
