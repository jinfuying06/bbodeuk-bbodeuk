import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import PageShell from "../components/PageShell";
import Toast, { useToast } from "../components/Toast";
import { markMember, resetToGuest } from "../data/points";


/** Flow / 로그인 (27:247) + 로그인 확인 (32:1427). Visual only: no real auth in the MVP. */
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [toast, showToast] = useToast();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (error) {
      // 다시 입력하기
      setError(false);
      setPassword("");
      return;
    }
    // ponytail: mock check only (valid-looking email + non-empty password); no backend in the MVP.
    if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
      setError(true);
      return;
    }
    markMember();
    navigate("/home");
  };

  const comingSoon = () => showToast("아직 준비 중인 기능이에요");

  return (
    <PageShell bottomNav={false}>
      <AppHeader back="/welcome" right={null} title={error ? "로그인 확인" : "로그인"} />
      <main className="pt-header-flow">
        <form className="flex flex-col gap-3 px-margin-screen pb-5" noValidate onSubmit={submit}>
          <h1 className="text-bb-heading text-sky-ink">{error ? "입력한 정보를 확인해 주세요" : "다시 만나 반가워요"}</h1>
          <p className="text-bb-body text-sky-muted">
            {error ? "이메일 또는 비밀번호가 맞지 않아요. 다시 확인해 주세요." : "오늘의 작은 청소를 이어가요."}
          </p>

          <div className="flex min-h-[84px] flex-col gap-1.5">
            <label className="text-bb-label text-sky-ink" htmlFor="login-email">
              이메일 주소
            </label>
            <input
              autoComplete="email"
              className="bb-field"
              id="login-email"
              inputMode="email"
              placeholder="이메일을 입력해 주세요"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex min-h-[84px] flex-col gap-1.5">
            <label className="text-bb-label text-sky-ink" htmlFor="login-password">
              비밀번호
            </label>
            <input
              aria-describedby={error ? "login-password-help" : undefined}
              autoComplete="current-password"
              className="bb-field"
              id="login-password"
              placeholder="비밀번호를 입력해 주세요"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? (
              <p className="text-bb-caption text-sky-muted" id="login-password-help">
                비밀번호를 다시 확인해 주세요.
              </p>
            ) : null}
          </div>

          {error ? (
            <>
              <GlassButton size={52} type="submit">
                다시 입력하기
              </GlassButton>
              <button className="text-link w-full" type="button" onClick={comingSoon}>
                비밀번호 찾기
              </button>
            </>
          ) : (
            <>
              <button className="text-link w-full" type="button" onClick={comingSoon}>
                비밀번호를 잊으셨나요?
              </button>
              <GlassButton size={52} type="submit">
                로그인하기
              </GlassButton>
              <GlassButton size={52} variant="secondary" onClick={comingSoon}>
                Google로 계속하기
              </GlassButton>
              <GlassButton size={52} variant="secondary" onClick={comingSoon}>
                카카오로 계속하기
              </GlassButton>
              <Link className="text-link w-full" to="/signup">
                이메일로 회원가입
              </Link>
              <Link className="text-link w-full" to="/setup" onClick={() => resetToGuest()}>
                먼저 둘러보기
              </Link>
            </>
          )}
        </form>
      </main>
      <Toast icon={false} message={toast} visible={Boolean(toast)} pill />
    </PageShell>
  );
}
