import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

export default function SamplePaint() {
  const [painted, setPainted] = useState(false);

  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col px-space-lg pb-space-2xl pt-space-xs">
        <div className="flex items-center justify-between pb-space-md pt-space-xs">
          <div className="flex items-center gap-space-xxs">
            <div className="h-1.5 w-7 rounded-full bg-primary" />
            <div className="h-1.5 w-2 rounded-full bg-surface-container-highest" />
            <div className="h-1.5 w-2 rounded-full bg-surface-container-highest" />
          </div>
          <span className="text-label-sm text-outline">체험 1단계</span>
        </div>
        <section className="mb-space-lg mt-space-xs">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed px-2.5 py-1 text-label-sm text-on-secondary-fixed">
            <Icon name="arrow_back_ios_new" className="text-[13px]" fill />
            60초 맛보기
          </span>
          <h1 className="text-headline-lg">시작하기 전에<br />딱 1초만 체험해 볼까요?</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">오늘 세면대를 가볍게 닦았다고 생각하고 아래 카드를 톡 터치해 보세요.</p>
        </section>
        {!painted ? (
          <div className="mx-auto mb-3 flex animate-bounce items-center gap-1.5 rounded-full bg-primary-container px-3.5 py-1.5 text-label-md text-on-primary shadow-md">
            <Icon name="touch_app" className="text-[16px]" />
            여기를 탭해보세요!
          </div>
        ) : null}
        <button
          className={`relative mb-space-md overflow-hidden rounded-xl p-space-lg text-left shadow-sm transition-all active:scale-95 ${
            painted ? "bg-primary-container text-on-primary" : "bg-surface-container-lowest"
          }`}
          type="button"
          onClick={() => setPainted((current) => !current)}
        >
          <div className="mb-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className={`rounded-xl p-2 ${painted ? "bg-white/80 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                <Icon name="bathtub" className="text-[20px]" />
              </span>
              <div>
                <span className={`block text-caption ${painted ? "text-on-primary/80" : "text-outline"}`}>욕실 일상 관리</span>
                <span className="text-title-sm">욕실 · 세면대</span>
              </div>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${painted ? "bg-white text-primary" : "bg-surface-container text-outline"}`}>
              <Icon name={painted ? "check" : "water_drop"} className="text-[22px]" fill={painted} />
            </span>
          </div>
          <div className="flex flex-col items-center py-space-sm">
            <div className={`mb-space-sm flex h-32 w-32 items-center justify-center rounded-full ${painted ? "bg-white/20" : "bg-surface-container-low"}`}>
              <Icon name="wash" className={`text-[76px] ${painted ? "text-white" : "text-outline-variant"}`} />
            </div>
            <span className={`rounded-full px-3.5 py-1 text-label-md ${painted ? "bg-white text-primary" : "bg-surface-container text-on-surface-variant"}`}>
              {painted ? "뽀득하게 기록 완료!" : "터치해서 맑게 채우기"}
            </span>
          </div>
          <div className="mt-space-xs flex items-center justify-between text-caption">
            <span>{painted ? "방금 전 깨끗이 관리함" : "아직 돌봄 기록이 없어요"}</span>
            <span className="font-bold">{painted ? "산뜻함 100%" : "가볍게 1초"}</span>
          </div>
        </button>
        <section className="rounded-xl bg-surface-container-low p-space-md">
          <div className="flex items-start gap-space-sm">
            <span className="rounded-xl bg-secondary-fixed p-2 text-on-secondary-fixed">
              <Icon name="colors" className="text-[20px]" fill />
            </span>
            <div>
              <h2 className="text-title-sm">압박 없는 채색 시스템</h2>
              <p className="mt-1 text-body-md text-on-surface-variant">체크리스트를 지우는 의무감 대신, 내가 보살핀 공간이 맑은 색으로 채워져요.</p>
            </div>
          </div>
        </section>
        <Link className="mt-auto flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-title-sm text-on-primary shadow-md" to="/setup">
          내 집 설정하러 가기
          <Icon name="arrow_forward" className="text-[20px]" />
        </Link>
      </main>
    </PageShell>
  );
}
