import { useLocation } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import houseCutaway from "../assets/house-cutaway.svg";

/** 27 / 가입 완료 (30:1782). Reached from SignUp; nickname comes via router state. */
export default function SignUpDone() {
  const nickname = (useLocation().state as { nickname?: string } | null)?.nickname || "하늘";

  return (
    <PageShell bottomNav={false}>
      <AppHeader back="/signup" title="가입 완료" />
      <main className="flex flex-col gap-3 px-margin-screen pb-7 pt-header">
        <PageIntro title={<>{nickname}님, 반가워요!</>} body="이제 나만의 작은 집을 준비해볼까요?" />
        <img alt="욕실, 주방, 거실, 방이 보이는 작은 집 일러스트" className="h-[180px] w-full" src={houseCutaway} />
        <p className="pb-2 text-center text-bb-body text-sky-muted">
          욕실·주방·거실·방은 무료로 바로 쓸 수 있어요.
        </p>
        <GlassButton to="/setup">내 공간 설정하러 가기</GlassButton>
      </main>
    </PageShell>
  );
}
