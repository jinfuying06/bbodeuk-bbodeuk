import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

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
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    service: false,
    privacy: false,
    marketing: false,
  });

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
    if (!requiredAgreed) return;
    navigate("/setup");
  };

  return (
    <PageShell bottomNav={false}>
      <main className="relative flex min-h-[100dvh] flex-col">
        <div className="flex items-center px-margin-screen pt-space-md">
          <button type="button" aria-label="이전 화면으로" className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface" onClick={() => navigate(-1)}>
            <Icon name="arrow_back_ios_new" className="text-[22px]" />
          </button>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[60px] h-64 w-64 -translate-x-[calc(50%+50px)] rounded-full bg-primary-fixed/30 blur-3xl" />

        <form className="relative flex flex-1 flex-col gap-space-xl px-margin-screen pb-space-2xl pt-space-lg" onSubmit={handleSubmit}>
          <section className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed">
                <Icon name="water_drop" className="text-[12px] text-primary-container" fill />
              </span>
              <span className="text-body-md font-bold text-primary-container">뽀득뽀득</span>
            </div>
            <h1 className="whitespace-pre-line text-headline-lg text-on-surface">
              {"새로운 청소 여정,\n지금 시작해 볼까요?"}
            </h1>
            <p className="text-body-md text-on-surface-variant">내가 가꾼 공간의 흔적을 맑은 색으로 뽀득하게 채워보세요.</p>
          </section>

          <section className="flex flex-col gap-space-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="signup-email">
                이메일 주소
              </label>
              <input
                id="signup-email"
                type="email"
                required
                className="h-12 w-full rounded-lg border border-surface-container bg-surface-container-lowest px-space-md text-body-lg text-on-surface outline-none placeholder:text-outline-variant focus:border-primary"
                placeholder="example@squeak.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="signup-password">
                비밀번호
              </label>
              <div className="flex h-12 items-center gap-space-xs rounded-lg border border-surface-container bg-surface-container-lowest px-space-md focus-within:border-primary">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="h-full min-w-0 flex-1 bg-transparent text-body-lg text-on-surface outline-none placeholder:text-outline-variant"
                  placeholder="영문, 숫자 포함 8자 이상"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-outline-variant"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <Icon name={showPassword ? "visibility" : "visibility_off"} className="text-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="signup-confirm-password">
                비밀번호 확인
              </label>
              <div className="flex h-12 items-center gap-space-xs rounded-lg border border-surface-container bg-surface-container-lowest px-space-md focus-within:border-primary">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-body-lg text-on-surface outline-none placeholder:text-outline-variant"
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-outline-variant"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  <Icon name={showConfirmPassword ? "visibility" : "visibility_off"} className="text-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="signup-nickname">
                사용할 닉네임
              </label>
              <input
                id="signup-nickname"
                type="text"
                required
                className="h-12 w-full rounded-lg border border-surface-container bg-surface-container-lowest px-space-md text-body-lg text-on-surface outline-none placeholder:text-outline-variant focus:border-primary"
                placeholder="어떻게 불러드릴까요?"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <h2 className="text-label-md text-on-surface-variant">서비스 이용 동의</h2>
            <button
              type="button"
              className="flex items-center gap-space-xs rounded-xl border border-surface-container bg-surface-container-lowest p-space-md shadow-sm"
              onClick={toggleAll}
              aria-pressed={allAgreed}
            >
              <Icon name="check_circle" fill className={`text-[22px] ${allAgreed ? "text-primary-container" : "text-surface-container"}`} />
              <span className="flex-1 text-left text-body-md font-bold text-on-surface">만 14세 이상이며, 모든 약관에 동의합니다</span>
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
                  <Icon name="check_circle" fill className={`text-[20px] ${agreed[term.key] ? "text-primary-container" : "text-surface-container"}`} />
                  <span className="flex-1 text-left text-body-md text-on-surface-variant">
                    <span>{term.required ? "[필수] " : "[선택] "}</span>
                    <span className="text-on-surface">{term.label}</span>
                  </span>
                  <Icon name="chevron_right" className="text-[16px] text-outline-variant" />
                </button>
              ))}
            </div>
          </section>

          <section className="mt-auto flex flex-col gap-space-md">
            <button
              type="submit"
              className="flex h-[52px] items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary shadow-md disabled:opacity-50"
              disabled={!requiredAgreed}
            >
              뽀득뽀득 가입 완료하기
            </button>
            <p className="flex items-center justify-center gap-1.5 text-body-md text-on-surface-variant">
              이미 계정이 있으신가요?
              <Link to="/login" className="font-bold text-primary-container underline decoration-primary-container">
                로그인하기
              </Link>
            </p>
          </section>
        </form>
      </main>
    </PageShell>
  );
}
