import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import Icon from "../components/Icon";

const recommendations = [
  {
    id: "basin",
    title: "욕실 · 세면대",
    badge: "슬슬 다시 볼 때예요",
    meta: "마지막 가벼운 세척 6일 전",
    icon: "wash",
    iconBox: "bg-secondary-fixed/50 text-secondary",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
  },
  {
    id: "sink",
    title: "주방 · 싱크대",
    badge: "한번 관리해볼까요?",
    meta: "마지막 물때 닦기 4일 전",
    icon: "faucet",
    iconBox: "bg-tertiary-fixed/40 text-tertiary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed-variant",
  },
];

const canvasCards = [
  {
    room: "욕실",
    icon: "bathtub",
    badge: "재관리 시점",
    title: "세면대 재관리 시점",
    desc: "변기 청결 유지 중",
    border: "border-secondary-fixed/40",
    glow: "bg-secondary-fixed/30",
    iconBox: "bg-secondary-fixed/50 text-secondary",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    titleClass: "text-secondary",
  },
  {
    room: "주방",
    icon: "countertops",
    badge: "상쾌한 유지",
    title: "상쾌한 민트톤 유지",
    desc: "가스레인지 정돈됨",
    border: "border-tertiary-fixed/40",
    glow: "bg-tertiary-fixed/30",
    iconBox: "bg-tertiary-fixed/50 text-tertiary",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    titleClass: "text-tertiary",
  },
  {
    room: "침실",
    icon: "bed",
    badge: "어제 케어",
    title: "최근 관리했어요",
    desc: "어제 침구 교체 완료",
    border: "border-primary-fixed/40",
    glow: "bg-primary-fixed/30",
    iconBox: "bg-primary-fixed text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed-variant",
    titleClass: "text-primary",
  },
  {
    room: "거실",
    icon: "chair",
    badge: "평온한 상태",
    title: "잘 유지되고 있어요",
    desc: "바닥 먼지 정돈 양호",
    border: "border-outline-variant/30",
    glow: "bg-surface-container-highest/50",
    iconBox: "bg-surface-container-high text-on-surface-variant",
    badgeClass: "bg-surface-container-high text-on-surface-variant",
    titleClass: "text-on-surface-variant",
  },
];

const recentRecords = [
  { title: "침실 침구 정리", meta: "어제 저녁 뽀득함 달성", icon: "hotel", tone: "bg-tertiary-fixed/40 text-tertiary" },
  { title: "욕실 변기 세척", meta: "3일 전 개운한 소독", icon: "clean_hands", tone: "bg-secondary-fixed/50 text-secondary" },
];

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);

  return (
    <div className="phone-shell min-h-[844px] bg-surface text-on-surface">
      <AppHeader home />
      <main className="flex min-h-[844px] flex-1 flex-col bg-surface pb-[88px] pt-16">
        <div className="flex w-full flex-col gap-space-xl px-margin-screen pb-space-2xl">
          <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex max-w-[78%] flex-col gap-space-xxs">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary-container" />
                  <span className="text-label-sm text-secondary">기분 좋은 숨결이 감도는 중</span>
                </div>
                <h2 className="min-h-[32px] text-headline-lg text-on-surface" />
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-sm">
                <Icon name="water_drop" className="text-[26px]" fill />
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="arrow_back_ios_new" className="text-[18px] text-primary" />
              <span className="text-title-sm text-on-surface">오늘 이런 곳 청소는 어때요?</span>
            </div>
            <div className="flex flex-col gap-space-sm">
              {recommendations.map((item) => {
                const isDone = completed.includes(item.id);

                return (
                  <article
                    key={item.id}
                    className={`relative w-full rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all duration-300 ${
                      isDone ? "scale-[0.98] opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex min-w-0 items-center gap-space-sm">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBox}`}>
                          <Icon name={item.icon} className="text-[22px]" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="truncate text-title-sm text-on-surface">{item.title}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-caption ${
                                isDone ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : item.badgeClass
                              }`}
                            >
                              {isDone ? "방금 뽀득해졌어요 ✨" : item.badge}
                            </span>
                          </div>
                          <span className="mt-0.5 text-caption text-on-surface-variant">{item.meta}</span>
                        </div>
                      </div>
                      <button
                        aria-label={`${item.title} 완료 기록`}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-200 active:scale-95 ${
                          isDone ? "bg-tertiary-container text-on-tertiary" : "bg-surface-container-low text-primary"
                        }`}
                        type="button"
                        onClick={() => setCompleted((current) => (current.includes(item.id) ? current : [...current, item.id]))}
                      >
                        <Icon name={isDone ? "done_all" : "check"} className="text-[20px]" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="bubble_chart" className="text-[18px] text-primary" />
              <span className="text-title-sm text-on-surface">우리 집 캔버스</span>
              <span className="ml-1 text-caption text-on-surface-variant">손길 닿은 공간이 맑게 빛나요</span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              {canvasCards.map((card) => (
                <div
                  key={card.room}
                  className={`relative flex h-36 flex-col justify-between overflow-hidden rounded-xl border bg-surface-container-lowest p-space-md shadow-sm ${card.border}`}
                >
                  <div className={`pointer-events-none absolute -right-3 -top-3 h-20 w-20 rounded-full blur-xl ${card.glow}`} />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBox}`}>
                      <Icon name={card.icon} className="text-[18px]" />
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-caption font-semibold ${card.badgeClass}`}>{card.badge}</span>
                  </div>
                  <div className="relative z-10 mt-2 flex flex-col">
                    <span className="text-title-sm text-on-surface">{card.room}</span>
                    <span className={`mt-0.5 text-caption font-semibold ${card.titleClass}`}>{card.title}</span>
                    <span className="truncate text-caption text-on-surface-variant">{card.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="check_circle" className="text-[18px] text-tertiary" />
              <span className="text-title-sm text-on-surface">최근 관리한 흔적</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              {recentRecords.map((record) => (
                <div key={record.title} className="flex items-center justify-between rounded-xl bg-surface-container-lowest px-space-md py-space-sm shadow-sm">
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${record.tone}`}>
                      <Icon name={record.icon} className="text-[16px]" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-body-md text-on-surface">{record.title}</span>
                      <span className="text-caption text-on-surface-variant">{record.meta}</span>
                    </div>
                  </div>
                  <span className="text-[14px]">✨</span>
                </div>
              ))}
            </div>
          </section>

          <div className="relative h-32 w-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,#c4e7ff_0%,#ffffff_45%,#6ffbbe_100%)] shadow-sm" />

          <Link
            className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-surface-container-highest/60 p-space-md shadow-sm transition-transform active:scale-[0.99]"
            to="/weekend-bigclean"
          >
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary shadow-sm">
                <Icon name="brush" className="text-[20px]" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-title-sm text-on-surface">주말 맞이 집 전체 한번에 훑기</span>
                <span className="truncate text-caption text-on-surface-variant">음악과 함께 가볍게 20분 대청소 루틴</span>
              </div>
            </div>
            <Icon name="chevron_right" className="ml-2 shrink-0 text-[20px] text-on-surface-variant" />
          </Link>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
