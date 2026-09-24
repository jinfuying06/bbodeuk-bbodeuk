import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import ItemRow from "../components/ItemRow";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";

/**
 * Figma state screens (`/home/:state`): 21 연결 확인 (error), 22 기록 불러오는 중 (loading),
 * 23 아직 없는 기록 (empty), 44 상태 미리보기 (preview, default).
 */

const PREVIEW_ROWS = [
  ["첫 기록 전 홈", "아직 기록이 없는 시작", "/home?state=empty"],
  ["기록 없는 히스토리", "비어 있는 달력과 기록 안내", "/home/empty"],
  ["연결 오류와 재시도", "다시 불러오기 → 로딩 → 기록", "/home/error"],
  ["로그인 입력 오류", "잘못된 이메일 형식 안내", "/login"],
  ["가벼운 추천 홈", "지나간 기록을 다시 살펴보기", "/home"],
  ["터치와 유리광", "컴포넌트의 상태 전환 체험", "/welcome"],
] as const;

const PREVIEW_LINKS = [
  ["로그인 · 가입 흐름", "/welcome"],
  ["연결 없는 로그인", "/home/error"],
  ["기록 저장 실패", "/home/error"],
  ["포인트 부족", "/points?intent=short"],
  ["기록·공간 이용 정책", "/help"],
] as const;

const TITLES: Record<string, string> = { error: "연결 확인", loading: "기록 불러오는 중", empty: "아직 없는 기록", preview: "상태 미리보기" };

function Feedback({ glyph, title, body }: { glyph: string; title: string; body: string }) {
  return (
    <div className="flex min-h-[140px] flex-col gap-2 rounded-2xl bg-sky-white pb-[18px] pl-5 pr-5 pt-[18px]">
      <span aria-hidden="true" className="text-bb-title text-sky-deep">
        {glyph}
      </span>
      <h2 className="text-bb-title text-sky-ink">{title}</h2>
      <p className="text-bb-body text-sky-muted">{body}</p>
    </div>
  );
}

export default function HomeStateDemo() {
  const { state = "preview" } = useParams();
  const navigate = useNavigate();
  const view = state in TITLES ? state : "preview";

  // 22 → 기록: the fake load finishes and lands on the history screen.
  useEffect(() => {
    if (view !== "loading") return;
    const timer = window.setTimeout(() => navigate("/history", { replace: true }), 1500);
    return () => window.clearTimeout(timer);
  }, [view, navigate]);

  return (
    <PageShell>
      <AppHeader title={TITLES[view]} back />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        {view === "error" ? (
          <>
            <div aria-hidden="true" className="h-[108px] shrink-0" />
            <Feedback glyph="!" title="기록을 불러오지 못했어요" body="잠시 후 다시 시도해주세요." />
            <GlassButton className="w-full" onClick={() => navigate("/home/loading")}>
              다시 불러오기
            </GlassButton>
            <Link className="text-link" to="/home">
              홈으로 돌아가기
            </Link>
          </>
        ) : null}

        {view === "loading" ? (
          <>
            <PageIntro title="기록을 가져오고 있어요" body="잠시만 기다려주세요." />
            <div aria-busy="true" aria-label="기록 불러오는 중" className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex h-[92px] animate-pulse items-center gap-[14px] rounded-2xl bg-sky-white pl-4">
                  <span className="h-12 w-12 shrink-0 rounded-row-sm bg-sky-tint" />
                  <span className="flex flex-col gap-[10px]">
                    <span className="h-4 w-[174px] rounded-[8px] bg-sky-line" />
                    <span className="h-3 w-[120px] rounded-[6px] bg-sky-tint" />
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {view === "empty" ? (
          <>
            <PageIntro title="기록이 쌓일 자리예요" body="빈 날도 괜찮아요. 내 속도로 시작해요." />
            <Feedback glyph="○" title="첫 기록을 기다리고 있어요" body="작은 청소 하나부터 남겨보세요." />
            <GlassButton className="w-full" to="/quick-record">
              청소 기록하러 가기
            </GlassButton>
            <Link className="text-link" to="/history">
              전체 기록 보기
            </Link>
          </>
        ) : null}

        {view === "preview" ? (
          <>
            <PageIntro title="예외 상황도 같은 톤으로" body="빈 화면·오류·로딩 상태를 확인해요." />
            <div className="flex flex-col gap-3">
              {PREVIEW_ROWS.map(([title, sub, to]) => (
                <ItemRow key={title} height={72} space="bathroom" sub={sub} title={title} to={to} />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {PREVIEW_LINKS.map(([label, to]) => (
                <Link key={label} className="text-link" to={to}>
                  {label}&nbsp;&nbsp;›
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </main>
    </PageShell>
  );
}
