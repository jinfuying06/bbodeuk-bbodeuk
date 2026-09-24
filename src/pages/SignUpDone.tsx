import { useLocation } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import PageShell from "../components/PageShell";
import houseCutaway from "../assets/house-cutaway.svg";
import { SIGNUP_BONUS } from "../data/points";

/** 27 / 가입 완료 (30:1782). Reached from SignUp; nickname comes via router state. */
export default function SignUpDone() {
  const nickname = (useLocation().state as { nickname?: string } | null)?.nickname || "하늘";

  return (
    <PageShell bottomNav={false}>
      <AppHeader back="/signup" title="가입 완료" />
      <main className="flex flex-col gap-3 px-margin-screen pb-7 pt-header">
        <div className="flex h-[88px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">{nickname}님, 반가워요!</h1>
          <p className="text-bb-body text-sky-muted">이제 나만의 작은 집을 준비해볼까요?</p>
        </div>
        <img alt="욕실, 주방, 거실, 방이 보이는 작은 집 일러스트" className="h-[180px] w-full" src={houseCutaway} />
        <section className="flex min-h-[112px] flex-col gap-2 rounded-3xl bg-sky-tint px-5 pb-4 pt-4">
          <h2 className="text-bb-title text-sky-ink">시작 포인트 {SIGNUP_BONUS}P를 받았어요</h2>
          <p className="text-bb-body text-sky-muted">
            기본 공간은 무료로 시작하고,
            <br />
            추가 공간은 필요할 때 선택해요.
          </p>
        </section>
        <GlassButton to="/setup">내 공간 설정하러 가기</GlassButton>
      </main>
    </PageShell>
  );
}
