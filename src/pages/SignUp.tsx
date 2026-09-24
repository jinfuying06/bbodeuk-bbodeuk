import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import CheckRow from "../components/CheckRow";
import GlassButton from "../components/GlassButton";
import PageShell from "../components/PageShell";
import Toast, { useToast } from "../components/Toast";
import { grantSignupBonus } from "../data/points";

const TERMS = [
  { key: "terms", label: "[필수] 만 14세 이상 · 이용약관 동의" },
  { key: "privacy", label: "[필수] 개인정보 수집·이용 동의" },
] as const;

type TermKey = (typeof TERMS)[number]["key"];

function Field({ id, label, children, help }: { id: string; label: string; children: React.ReactNode; help?: string }) {
  return (
    <div className="flex min-h-[84px] flex-col gap-1.5">
      <label className="text-bb-label text-sky-ink" htmlFor={id}>
        {label}
      </label>
      {children}
      {help ? (
        <p className="text-bb-caption text-sky-muted" id={`${id}-help`} role="alert">
          {help}
        </p>
      ) : null}
    </div>
  );
}

/** Flow / 회원가입 (27:396). Prefilled with Figma's example values ("예시 입력"); no real account is created. */
export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sky@example.com");
  const [password, setPassword] = useState("password");
  const [confirm, setConfirm] = useState("password");
  const [nickname, setNickname] = useState("하늘");
  const [mismatch, setMismatch] = useState(false);
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({ terms: false, privacy: false });
  const [toast, showToast] = useToast();
  const ready = TERMS.every((term) => agreed[term.key]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    if (password !== confirm) {
      setMismatch(true);
      return;
    }
    grantSignupBonus();
    navigate("/signup-done", { state: { nickname: nickname.trim() } });
  };

  return (
    <PageShell bottomNav={false}>
      <AppHeader back="/login" right={null} title="회원가입" />
      <main className="pt-header">
        <form className="flex flex-col gap-2 px-margin-screen py-5" onSubmit={submit}>
          <h1 className="text-bb-heading text-sky-ink">작은 청결 관리를 시작해요</h1>
          <p className="text-bb-body text-sky-muted">예시 입력 · 필수 항목에 동의하면 시작할 수 있어요.</p>

          <Field id="signup-email" label="이메일">
            <input autoComplete="email" className="bb-field" id="signup-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field id="signup-password" label="비밀번호">
            <input
              autoComplete="new-password"
              className="bb-field"
              id="signup-password"
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMismatch(false);
              }}
            />
          </Field>
          <Field help={mismatch ? "비밀번호가 일치하지 않아요." : undefined} id="signup-confirm" label="비밀번호 확인">
            <input
              aria-describedby={mismatch ? "signup-confirm-help" : undefined}
              aria-invalid={mismatch}
              autoComplete="new-password"
              className="bb-field"
              id="signup-confirm"
              required
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setMismatch(false);
              }}
            />
          </Field>
          <Field id="signup-nickname" label="닉네임">
            <input className="bb-field" id="signup-nickname" required type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </Field>

          {TERMS.map((term) => (
            <CheckRow key={term.key} label={term.label} on={agreed[term.key]} onClick={() => setAgreed((current) => ({ ...current, [term.key]: !current[term.key] }))} />
          ))}

          <button className="text-link w-full" type="button" onClick={() => showToast("약관 안내는 준비 중이에요")}>
            이용약관 · 개인정보 안내 보기
          </button>
          {/* decisions §6: enabled label stays the same as the disabled label. */}
          <GlassButton disabled={!ready} size={52} type="submit">
            필수 항목에 동의해 주세요
          </GlassButton>
        </form>
      </main>
      <Toast message={toast} visible={Boolean(toast)} pill />
    </PageShell>
  );
}
