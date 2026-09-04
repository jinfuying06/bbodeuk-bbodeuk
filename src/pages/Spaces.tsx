import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

const spaces = [
  {
    title: "욕실",
    en: "Bathroom",
    icon: "bathtub",
    desc: "물때와 습기를 가볍게 다독여주는 시간",
    summary: "2곳 다시 볼 때 · 3곳 유지 중",
    items: [
      ["세면대 수전 및 볼", "마지막 기록 6일 전 · 주기 7일 권장", "슬슬 다시 볼 때예요", "bg-secondary-fixed text-on-secondary-fixed-variant"],
      ["양변기 안팎 살균", "마지막 기록 1일 전 · 깨끗함 유지 중", "최근 관리했어요", "bg-tertiary-fixed text-on-tertiary-fixed-variant"],
      ["욕실 유리 거울", "마지막 기록 4일 전 · 얼룩 없음", "잘 유지되고 있어요", "bg-surface-container-highest text-on-surface-variant"],
      ["바닥 배수구 유가 거름망", "아직 기록이 없어요 · 5분 루틴", "새로운 발견", "bg-surface-container-lowest text-primary"],
    ],
  },
  {
    title: "주방",
    en: "Kitchen",
    icon: "countertops",
    desc: "요리 후 한숨 돌리는 산뜻한 식탁 풍경",
    summary: "1곳 추천 · 2곳 안심",
    items: [
      ["싱크대 거름망 비우기", "마지막 기록 5일 전 · 가벼운 헹굼 추천", "한번 관리해볼까요?", "bg-secondary-fixed text-on-secondary-fixed-variant"],
      ["인덕션 상판 & 조리대 닦기", "마지막 기록 어제 · 반짝이는 상태", "최근 관리했어요", "bg-tertiary-fixed text-on-tertiary-fixed-variant"],
      ["레인지 후드 기름때 필터", "아직 기록이 없어요 · 30일 주기", "숨은 관리 추천", "bg-primary-fixed text-primary"],
    ],
  },
  {
    title: "침실 & 거실",
    en: "Living & Rest",
    icon: "bed",
    desc: "깊은 잠과 편안한 쉼을 채우는 공간",
    summary: "산뜻하게 안정권",
    items: [
      ["베개 커버 세탁 및 일광 소독", "마지막 기록 2일 전 · 뽀송뽀송 유지 중", "최근 관리했어요", "bg-tertiary-fixed text-on-tertiary-fixed-variant"],
      ["거실 바닥 정전기 밀대 청소", "마지막 기록 3일 전 · 10분 먼지 닦기 추천", "슬슬 다시 볼 때예요", "bg-secondary-fixed text-on-secondary-fixed-variant"],
      ["공기청정기 프리필터 먼지 흡입", "마지막 기록 12일 전 · 월 1회 주기", "잘 유지되고 있어요", "bg-surface-container-highest text-on-surface-variant"],
    ],
  },
];

export default function Spaces() {
  return (
    <PageShell>
      <AppHeader title="공간" />
      <main className="flex min-h-[844px] flex-col bg-surface pb-[88px] pt-16">
        <div className="flex flex-col gap-space-md px-margin-screen pb-space-2xl">
          <section>
            <div className="mt-0.5 flex items-center justify-between">
              <h1 className="text-headline-lg">공간별 관리 현황</h1>
            </div>
          </section>
          <div className="hide-scrollbar -mx-margin-screen overflow-x-auto px-margin-screen">
            <div className="flex min-w-max gap-space-xs">
              {["전체 보기", "욕실", "주방", "침실", "거실"].map((label, index) => (
                <button key={label} className={`rounded-full px-4 py-2 text-label-md ${index === 0 ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant"}`} type="button">
                  {label}
                </button>
              ))}
            </div>
          </div>
          {spaces.map((space) => (
            <section key={space.title} className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
              <div className="mb-space-md flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <Icon name={space.icon} className="text-[22px]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-space-xxs">
                      <h2 className="text-title-md">{space.title}</h2>
                    </div>
                    <p className="text-caption text-on-surface-variant">{space.en}</p>
                  </div>
                </div>
                <span className="max-w-[112px] text-right text-caption text-on-surface-variant">{space.summary}</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                {space.items.map(([title, meta, badge]) => (
                  <Link key={title} className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 active:scale-[0.99]" to="/care-action">
                    <div className="min-w-0">
                      <span className="block truncate text-title-sm">{title}</span>
                      <p className="truncate text-caption text-on-surface-variant">{meta} · {badge}</p>
                    </div>
                    <Icon name="chevron_right" className="ml-2 shrink-0 text-[20px] text-outline-variant" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
