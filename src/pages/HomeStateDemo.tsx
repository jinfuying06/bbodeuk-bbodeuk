import { Link, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";

const stateCopy = {
  empty: {
    label: "새로운 시작",
    title: "오늘 청소한 곳 하나만 기록해도 괜찮아요",
    body: "대단한 대청소가 아니어도 좋아요. 세면대, 싱크대, 바닥처럼 눈에 들어온 한 곳만 남겨보세요.",
    cta: "첫 청소 기록하기",
    icon: "format_paint",
  },
  maintained: {
    label: "관리 중인 집",
    title: "슬슬 다시 볼 곳이 있어요",
    body: "마지막 기록과 기본 권장 주기를 비교해 가볍게 다시 볼 곳만 골라봤어요.",
    cta: "추천 항목 기록하기",
    icon: "water_drop",
  },
  active: {
    label: "방금 이어진 기록",
    title: "오늘 벌써 3곳을 관리했어요",
    body: "오늘 기록한 항목을 이어서 확인할 수 있어요.",
    cta: "계속 기록하기",
    icon: "auto_awesome",
  },
} as const;

const suggestions = [
  ["shower", "욕실 배수구", "아직 기록이 없어요", "숨은 관리 추천"],
  ["countertops", "주방 싱크대", "마지막 기록 5일 전", "한번 관리해볼까요?"],
  ["air", "거실 환기", "오늘 아침 기록", "최근 관리했어요"],
];

const canvas = [
  ["욕실", "bathtub", "세면대 맑음", "bg-secondary-fixed/60 text-secondary"],
  ["주방", "restaurant", "싱크대 돌봄 전", "bg-primary-fixed/60 text-primary"],
  ["거실", "chair", "환기 완료 전", "bg-surface-container-high text-on-surface-variant"],
  ["침실", "bed", "침구 정리 전", "bg-surface-container-high text-on-surface-variant"],
];

export default function HomeStateDemo() {
  const { state = "empty" } = useParams();
  const copy = stateCopy[(state as keyof typeof stateCopy) in stateCopy ? (state as keyof typeof stateCopy) : "empty"];

  return (
    <PageShell>
      <AppHeader home />
      <main className="flex min-h-[844px] flex-col bg-surface pb-[88px] pt-16">
        <div className="flex flex-col gap-space-lg px-margin-screen pb-space-2xl">
          <section className="relative mt-space-sm overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary-fixed/40 blur-2xl" />
            <Pill className="mb-space-sm bg-secondary-fixed text-secondary">{copy.label}</Pill>
            <h1 className="max-w-[88%] text-headline-lg">{copy.title}</h1>
            <p className="mt-space-xs text-body-md text-on-surface-variant">{copy.body}</p>
            <Link className="mt-space-lg flex h-12 items-center justify-center gap-2 rounded-full bg-primary-container text-title-sm text-on-primary shadow-md" to="/quick-record">
              <Icon name={copy.icon} className="text-[20px]" />
              {copy.cta}
            </Link>
          </section>

          <section className="flex flex-col gap-space-sm">
            <h2 className="text-title-sm">오늘 눈에 들어온 곳</h2>
            {suggestions.map(([icon, title, meta, badge]) => (
              <Link key={title} className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm" to="/care-action">
                <div className="flex min-w-0 items-center gap-space-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <Icon name={icon} className="text-[20px]" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-title-sm">{title}</span>
                      <Pill className="bg-secondary-fixed text-on-secondary-fixed-variant">{badge}</Pill>
                    </div>
                    <span className="text-caption text-on-surface-variant">{meta}</span>
                  </div>
                </div>
                <Icon name="chevron_right" className="text-[20px] text-outline-variant" />
              </Link>
            ))}
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-title-sm">우리 집 청소 캔버스</h2>
              <span className="text-caption text-on-surface-variant">{state === "empty" ? "0 / 4 채색" : "3 / 4 채색"}</span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              {canvas.map(([room, icon, text, tone]) => (
                <div key={room} className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
                  <span className={`mb-space-sm flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
                    <Icon name={icon} className="text-[20px]" />
                  </span>
                  <h3 className="text-title-sm">{room}</h3>
                  <p className="text-caption text-on-surface-variant">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <Link className="flex items-center justify-between rounded-xl bg-surface-container-highest/60 p-space-md shadow-sm" to="/deep-clean">
            <div className="flex items-center gap-space-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary">
                <Icon name="brush" className="text-[20px]" />
              </span>
              <div>
                <span className="block text-title-sm">집 전체를 한번에 훑기</span>
                <span className="block text-caption text-on-surface-variant">대청소 모드로 여러 공간을 가볍게 기록</span>
              </div>
            </div>
            <Icon name="chevron_right" className="text-[20px] text-outline" />
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
