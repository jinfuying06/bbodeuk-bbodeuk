import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import Icon from "../components/Icon";
import Toast from "../components/Toast";

type Filter = "fav" | "recent" | "space";
type Space = "bathroom" | "kitchen";

const quickCards = [
  { id: "basin", name: "세면대", emoji: "🚰", badge: "6일 전", desc: "욕실 광택 케어", badgeClass: "bg-secondary-fixed text-secondary" },
  { id: "sink", name: "싱크대", emoji: "🍳", badge: "4일 전", desc: "배수구 물때 제거", badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
  { id: "toilet", name: "변기", emoji: "🚽", badge: "1일 전", desc: "노즐 및 림 정돈", badgeClass: "bg-secondary-fixed text-secondary" },
  { id: "mirror", name: "욕실 거울", emoji: "🪞", badge: "8일 전", desc: "얼룩 없이 뽀득하게", badgeClass: "bg-secondary-fixed text-secondary" },
];

const spaceItems = {
  bathroom: [
    { name: "세면대", emoji: "🚰", desc: "물때 및 수도꼭지 마감" },
    { name: "변기", emoji: "🚽", desc: "소독 및 안쪽 케어" },
    { name: "샤워부스", emoji: "🚿", desc: "유리벽 스퀴지 작업" },
    { name: "거울", emoji: "🪞", desc: "손자국 및 비누방울 닦기" },
    { name: "욕실 바닥", emoji: "🧹", desc: "타일 솔질 및 물기 정리" },
  ],
  kitchen: [
    { name: "싱크대", emoji: "🍳", desc: "배수망 헹굼 & 거름망" },
    { name: "인덕션/레인지", emoji: "🔥", desc: "기름 튄 자국 닦아내기" },
    { name: "조리대", emoji: "🔪", desc: "식탁 및 상판 소독 티슈 쓱" },
    { name: "냉장고 손잡이", emoji: "🧊", desc: "자주 닿는 곳 뽀송하게" },
  ],
};

export default function QuickRecord() {
  const [filter, setFilter] = useState<Filter>("fav");
  const [space, setSpace] = useState<Space>("bathroom");
  const [recent, setRecent] = useState<Record<string, string>>({});
  const [flashCard, setFlashCard] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [lastPainted, setLastPainted] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const paintSingle = (id: string, name: string) => {
    setRecent((current) => ({ ...current, [id]: "방금 전" }));
    setFlashCard(id);
    setLastPainted(id);
    setToast(`✨ ${name} 맑게 기록했어요!`);
    window.setTimeout(() => setFlashCard((current) => (current === id ? null : current)), 1800);
  };

  const undoSingle = () => {
    if (!lastPainted) return;
    setRecent((current) => ({ ...current, [lastPainted]: "기록 취소됨" }));
    setToast("");
  };

  const toggleBatch = (name: string) => {
    setSelected((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  };

  const confirmBatch = () => {
    setToast(`🌿 ${selected.length}곳 모두 산뜻하게 남겼어요!`);
    setSelected([]);
  };

  return (
    <div className="phone-shell bg-surface text-on-surface">
      <AppHeader
        title="Quick Record"
        right={
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
            <Icon name="water_drop" className="text-[18px]" />
          </div>
        }
      />
      <main className="flex min-h-[844px] flex-col bg-surface pb-28 pt-16">
        <section className="flex flex-col gap-space-xxs px-margin-screen pb-space-sm pt-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
              <Icon name="water_drop" className="text-[16px]" />
            </span>
            <span className="text-label-sm text-secondary">뿌듯한 청소 관리</span>
          </div>
          <h2 className="text-headline-lg text-on-surface">어디를 청소했나요?</h2>
          <p className="text-body-md text-on-surface-variant">터치 한 번으로 가볍게 색을 남겨보세요.</p>
        </section>

        <section className="px-margin-screen py-space-xs">
          <div className="flex w-full items-center gap-space-xs rounded-full bg-surface-container p-space-xxs">
            {[
              ["fav", "favorite", "자주 기록"],
              ["recent", "schedule", "최근 기록"],
              ["space", "grid_view", "공간별 보기"],
            ].map(([key, icon, label]) => (
              <button
                key={key}
                className={`flex flex-1 items-center justify-center gap-1 rounded-full px-space-sm py-space-xs text-label-md transition-all duration-200 ${
                  filter === key ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                }`}
                type="button"
                onClick={() => setFilter(key as Filter)}
              >
                <Icon name={icon} className="text-[18px]" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-space-md flex flex-col gap-space-sm px-margin-screen">
          <div className="grid grid-cols-2 gap-space-sm">
            {quickCards.map((card) => {
              const flashed = flashCard === card.id;

              return (
                <button
                  key={card.id}
                  className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-md text-left shadow-sm transition-all duration-300 active:scale-95"
                  type="button"
                  onClick={() => paintSingle(card.id, card.name)}
                >
                  <div className="flex w-full items-start justify-between">
                    <span className="text-2xl transition-transform group-active:scale-110">{card.emoji}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-label-sm ${
                        recent[card.id] ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : card.badgeClass
                      }`}
                    >
                      {recent[card.id] ?? card.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-title-sm text-on-surface">{card.name}</h3>
                    <p className="text-caption text-outline">{card.desc}</p>
                  </div>
                  <div
                    className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-primary-container/20 transition-opacity duration-300 ${
                      flashed ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Icon name="check_circle" className={`text-[32px] text-primary transition-transform duration-300 ${flashed ? "scale-100" : "scale-50"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-space-xl flex flex-col gap-space-sm px-margin-screen">
          <div className="flex items-center justify-between">
            <span className="text-title-sm text-on-surface">공간별 한번에 기록하기</span>
          </div>
          <div className="flex gap-space-xs">
            {[
              ["bathroom", "bathtub", "욕실"],
              ["kitchen", "soup_kitchen", "주방"],
            ].map(([key, icon, label]) => (
              <button
                key={key}
                className={`flex items-center gap-1.5 rounded-full px-space-md py-space-xs text-label-md transition-colors duration-150 ${
                  space === key ? "bg-secondary text-on-secondary" : "bg-surface-container text-on-surface-variant"
                }`}
                type="button"
                onClick={() => setSpace(key as Space)}
              >
                <Icon name={icon} className="text-[16px]" />
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-space-xs">
            {spaceItems[space].map((item) => {
              const checked = selected.includes(item.name);

              return (
                <button
                  key={item.name}
                  className={`flex items-center justify-between rounded-xl p-space-sm text-left transition-all duration-200 active:scale-[0.99] ${
                    checked ? "bg-primary-fixed/20" : "bg-surface-container-lowest"
                  }`}
                  type="button"
                  onClick={() => toggleBatch(item.name)}
                >
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-lg">{item.emoji}</div>
                    <div className="flex min-w-0 flex-col">
                      <span className={`text-title-sm ${checked ? "text-primary" : "text-on-surface"}`}>{item.name.replace("욕실 ", "")}</span>
                      <span className="truncate text-caption text-outline">{item.desc}</span>
                    </div>
                  </div>
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                      checked ? "bg-primary-container" : "bg-surface-container-highest"
                    }`}
                  >
                    <Icon name="done" className={`text-[16px] text-surface-container-lowest transition-transform duration-200 ${checked ? "scale-100" : "scale-0"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <Toast message={toast} visible={Boolean(toast)} actionLabel={lastPainted ? "실행 취소" : undefined} onAction={undoSingle} />

      <div
        className={`fixed bottom-24 left-1/2 z-40 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 transition-all duration-300 ${
          selected.length > 0 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        }`}
      >
        <button
          className="flex w-full items-center justify-center gap-space-xs rounded-full bg-primary-container px-space-lg py-3 text-title-sm text-surface-container-lowest shadow-lg transition-all active:scale-[0.98]"
          type="button"
          onClick={confirmBatch}
        >
          <Icon name="brush" className="text-[20px]" />
          {selected.length}곳 색 남기기
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}
