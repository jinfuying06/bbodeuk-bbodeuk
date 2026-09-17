import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { markMember, resetToGuest } from "../data/points";
import { spaceTones } from "../data/spaceTones";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    markMember();
    navigate("/home");
  };

  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col">
        <div className="flex flex-col gap-space-xl pt-space-2xl">
          <section className="relative flex flex-col items-center text-center">
            <div className="pointer-events-none absolute left-1/2 top-2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-fixed/30 blur-3xl" />

            <div className="relative flex items-center gap-1.5">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${spaceTones.bathroom.fill}`}>
                <Icon name="water_drop" className={`text-[12px] ${spaceTones.bathroom.text}`} fill />
              </span>
              <span className={`text-body-md font-bold ${spaceTones.bathroom.text}`}>뽀득뽀득</span>
            </div>

            <div className="relative mt-space-lg flex flex-col items-center gap-space-sm px-margin-screen">
              <h1 className="whitespace-pre-line text-headline-lg text-on-surface">
                {"한 곳만 칠해도,\n오늘 청소는 성공."}
              </h1>
              <p className="whitespace-pre-line text-body-md text-on-surface-variant">
                {"해야 할 일을 쌓아두는 체크리스트 대신,\n내가 돌본 집의 흔적을 맑은 색으로 채워보세요."}
              </p>
            </div>
          </section>

          <form className="flex flex-col gap-space-md px-margin-screen" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="login-email">
                아이디
              </label>
              <input
                id="login-email"
                type="email"
                required
                className="h-12 w-full rounded-lg border border-surface-container bg-surface-container-lowest px-space-md text-body-lg text-on-surface outline-none placeholder:text-outline-variant focus:border-primary"
                placeholder="이메일주소를 입력해주세요"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="login-password">
                비밀번호
              </label>
              <div className="flex h-12 items-center gap-space-xs rounded-lg border border-surface-container bg-surface-container-lowest px-space-md focus-within:border-primary">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-body-lg text-on-surface outline-none placeholder:text-outline-variant"
                  placeholder="비밀번호를 입력해주세요"
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

            <button type="submit" className="mt-1 flex h-[52px] items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary shadow-md">
              로그인하기
            </button>

            <div className="flex items-center gap-space-sm py-1">
              <span className="h-px flex-1 bg-surface-container" />
              <span className="text-label-sm text-outline">또는</span>
              <span className="h-px flex-1 bg-surface-container" />
            </div>

            <div className="flex flex-col gap-space-sm pt-1">
              <button type="button" className="flex items-center justify-center gap-space-sm rounded-full bg-[#fee500] px-space-lg py-space-sm shadow-sm">
                <img src={`${import.meta.env.BASE_URL}assets/kakao_icon.svg`} alt="" className="h-5 w-5" />
                <span className="text-label-md text-[#191919]">카카오로 시작하기</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-space-sm rounded-full border border-surface-container bg-surface-container-lowest px-space-lg py-space-sm shadow-sm">
                <img src={`${import.meta.env.BASE_URL}assets/google_icon.svg`} alt="" className="h-5 w-5" />
                <span className="text-label-md text-on-surface">Google로 계속하기</span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center gap-space-sm px-margin-screen pb-space-xl pt-space-lg">
          <Link to="/signup" className={`text-body-md font-bold ${spaceTones.bathroom.text}`}>
            이메일로 회원가입
          </Link>
          <Link to="/setup" className="py-2 text-label-md text-on-surface-variant underline decoration-outline-variant" onClick={() => resetToGuest()}>
            로그인 없이 둘러보기
          </Link>
          <p className="max-w-[320px] text-center text-caption text-outline">
            시작하면 뽀득뽀득의 <span className="text-secondary">이용약관</span> 및{" "}
            <span className="text-secondary">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
