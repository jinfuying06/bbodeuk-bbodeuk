import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { grantSignupBonus, SIGNUP_BONUS } from "../data/points";
import { spaceTones } from "../data/spaceTones";

const termsList = [
  { key: "service", required: true, label: "뽀득뽀득 서비스 이용약관 동의" },
  { key: "privacy", required: true, label: "개인정보 수집 및 이용 동의" },
  { key: "marketing", required: false, label: "이벤트 및 마케팅 혜택 알림 수신" },
] as const;

type TermKey = (typeof termsList)[number]["key"];

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    service: false,
    privacy: false,
    marketing: false,
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const [grantedBalance, setGrantedBalance] = useState(0);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  const allAgreed = termsList.every((term) => agreed[term.key]);
  const requiredAgreed = termsList.filter((term) => term.required).every((term) => agreed[term.key]);

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreed({ service: next, privacy: next, marketing: next });
  };

  const toggleTerm = (key: TermKey) => {
    setAgreed((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    if (!requiredAgreed) return;
    setGrantedBalance(grantSignupBonus());
    setShowWelcome(true);
  };

  useEffect(() => {
    if (!showWelcome) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    continueButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showWelcome]);

  return (
    <PageShell bottomNav={false}>
      <main className="relative flex min-h-[100dvh] flex-col">
        <div className="flex items-center px-margin-screen pt-space-md">
          <button type="button" aria-label="이전 화면으로" className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface" onClick={() => navigate(-1)}>
            <Icon name="arrow_back_ios_new" className="text-[22px]" />
          </button>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[60px] h-64 w-64 -translate-x-[calc(50%+50px)] rounded-full bg-sky-brand/25 blur-3xl" />

        <form className="relative flex flex-1 flex-col gap-space-xl px-margin-screen pb-space-2xl pt-space-lg" onSubmit={handleSubmit}>
          <section className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-1.5">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${spaceTones.bathroom.fill}`}>
                <Icon name="water_drop" className={`text-[12px] ${spaceTones.bathroom.text}`} fill />
              </span>
              <span className={`text-body-md font-bold ${spaceTones.bathroom.text}`}>뽀득뽀득</span>
            </div>
            <h1 className="whitespace-pre-line text-headline-lg text-sky-ink">
              {"새로운 청소 여정,\n지금 시작해 볼까요?"}
            </h1>
            <p className="text-body-md text-sky-muted">내가 가꾼 공간의 흔적을 맑은 색으로 뽀득하게 채워보세요.</p>
          </section>

          <section className="flex flex-col gap-space-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-sky-muted" htmlFor="signup-email">
                이메일 주소
              </label>
              <input
                id="signup-email"
                type="email"
                required
                className="h-12 w-full rounded-xl border border-art-line bg-sky-white px-space-md text-body-lg text-sky-ink outline-none transition-colors placeholder:text-sky-muted focus:border-sky-deep"
                placeholder="example@squeak.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-sky-muted" htmlFor="signup-password">
                비밀번호
              </label>
              <div className="flex h-12 items-center gap-space-xs rounded-xl border border-art-line bg-sky-white px-space-md transition-colors focus-within:border-sky-deep">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="h-full min-w-0 flex-1 bg-transparent text-body-lg text-sky-ink outline-none placeholder:text-sky-muted"
                  placeholder="영문, 숫자 포함 8자 이상"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-sky-muted"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <Icon name={showPassword ? "visibility" : "visibility_off"} className="text-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-sky-muted" htmlFor="signup-confirm-password">
                비밀번호 확인
              </label>
              <div className="flex h-12 items-center gap-space-xs rounded-xl border border-art-line bg-sky-white px-space-md transition-colors focus-within:border-sky-deep">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-body-lg text-sky-ink outline-none placeholder:text-sky-muted"
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                  value={confirmPassword}
                  aria-invalid={passwordMismatch}
                  aria-describedby={passwordMismatch ? "signup-confirm-password-error" : undefined}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordMismatch(false);
                  }}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-sky-muted"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  <Icon name={showConfirmPassword ? "visibility" : "visibility_off"} className="text-[18px]" />
                </button>
              </div>
              {passwordMismatch ? (
                <p id="signup-confirm-password-error" role="alert" className="text-label-sm text-sky-deep">
                  비밀번호가 일치하지 않아요.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-sky-muted" htmlFor="signup-nickname">
                사용할 닉네임
              </label>
              <input
                id="signup-nickname"
                type="text"
                required
                className="h-12 w-full rounded-xl border border-art-line bg-sky-white px-space-md text-body-lg text-sky-ink outline-none transition-colors placeholder:text-sky-muted focus:border-sky-deep"
                placeholder="어떻게 불러드릴까요?"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <h2 className="text-label-md text-sky-muted">서비스 이용 동의</h2>
            <button
              type="button"
              className={`flex items-center gap-space-xs rounded-xl border p-space-md shadow-sm transition-colors ${
                allAgreed ? "border-sky-brand bg-sky-tint" : "border-art-line bg-sky-white"
              }`}
              onClick={toggleAll}
              aria-pressed={allAgreed}
            >
              <Icon name="check_circle" fill className={`text-[22px] ${allAgreed ? "text-sky-deep" : "text-sky-muted"}`} />
              <span className="flex-1 text-left text-body-md font-bold text-sky-ink">만 14세 이상이며, 모든 약관에 동의합니다</span>
            </button>

            <div className="flex flex-col gap-1 px-space-xs">
              {termsList.map((term) => (
                <button
                  key={term.key}
                  type="button"
                  className="flex items-center gap-space-sm py-1"
                  onClick={() => toggleTerm(term.key)}
                  aria-pressed={agreed[term.key]}
                >
                  <Icon name="check_circle" fill className={`text-[20px] ${agreed[term.key] ? "text-sky-deep" : "text-sky-muted"}`} />
                  <span className="flex-1 text-left text-body-md text-sky-muted">
                    <span>{term.required ? "[필수] " : "[선택] "}</span>
                    <span className="text-sky-ink">{term.label}</span>
                  </span>
                  <Icon name="chevron_right" className="text-[16px] text-sky-muted" />
                </button>
              ))}
            </div>
          </section>

          <section className="mt-auto flex flex-col gap-space-md">
            <button
              type="submit"
              className="flex h-14 items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98] disabled:opacity-50"
              disabled={!requiredAgreed}
            >
              뽀득뽀득 가입 완료하기
            </button>
            <p className="flex items-center justify-center gap-1.5 text-body-md text-sky-muted">
              이미 계정이 있으신가요?
              <Link to="/login" className={`font-bold underline decoration-current ${spaceTones.bathroom.text}`}>
                로그인하기
              </Link>
            </p>
          </section>
        </form>
      </main>

      {showWelcome ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-on-surface/40" role="presentation">
          <section aria-labelledby="signup-welcome-title" aria-modal="true" className="w-full max-w-[430px] rounded-t-2xl bg-surface-container-lowest px-margin-screen pb-[calc(24px+env(safe-area-inset-bottom,0px))] pt-space-lg text-center shadow-xl" role="dialog">
            <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-tint text-sky-deep">
              <Icon name="celebration" className="text-[30px]" fill />
            </span>
            <h2 id="signup-welcome-title" className="mt-space-md text-headline-md text-sky-ink">
              {nickname.trim() || "회원"}님, 뽀득뽀득에 오신 걸 환영해요!
            </h2>
            <p className="mt-space-sm text-body-md text-sky-muted">가입 축하로 시작 포인트 {SIGNUP_BONUS}P가 지급됐어요. 공간을 추가할 때 사용해보세요.</p>
            <p className="mt-space-xs text-title-sm text-sky-deep">현재 보유 포인트 {grantedBalance.toLocaleString()}P</p>
            <button
              ref={continueButtonRef}
              type="button"
              className="mt-space-lg flex h-12 w-full items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98]"
              onClick={() => navigate("/setup")}
            >
              공간 설정하러 가기
            </button>
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}
