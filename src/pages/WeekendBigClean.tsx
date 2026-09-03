import { useEffect, useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import Toast from "../components/Toast";

type SpaceKey = "bathroom" | "kitchen" | "living";

const spaces: Array<{
  key: SpaceKey;
  title: string;
  subtitle: string;
  icon: string;
  iconClass: string;
  initiallyOpen?: boolean;
  items: Array<{ id: string; title: string; meta: string; helper?: string; icon: string; checked: boolean; helperClass?: string }>;
}> = [
  {
    key: "bathroom",
    title: "욕실",
    subtitle: "샤워부스 · 세면대 · 배수구",
    icon: "bathtub",
    iconClass: "bg-secondary-fixed text-secondary",
    items: [
      { id: "bath-basin", title: "세면대 수전 물기 닦기", meta: "마지막 기록 6일 전", helper: "슬슬 다시 볼 때", icon: "water_drop", checked: true, helperClass: "text-primary" },
      { id: "bath-toilet", title: "변기 안팎 가벼운 솔질", meta: "마지막 기록 1일 전", helper: "깨끗함 유지 중", icon: "cleaning_services", checked: true, helperClass: "text-tertiary" },
      { id: "bath-mirror", title: "욕실 유리 거울 얼룩 닦기", meta: "마지막 기록 4일 전", icon: "auto_awesome", checked: false },
      { id: "bath-drain", title: "바닥 배수구 유가 세척", meta: "숨은 케어 추천", icon: "shower", checked: false, helperClass: "text-primary" },
    ],
  },
  {
    key: "kitchen",
    title: "주방",
    subtitle: "싱크대 · 조리대 · 환풍기",
    icon: "countertops",
    iconClass: "bg-primary-fixed text-primary",
    items: [
      { id: "kit-sink", title: "싱크대 거름망 비우기", meta: "마지막 기록 4일 전", helper: "슬슬 다시 볼 때", icon: "recycling", checked: true, helperClass: "text-primary" },
      { id: "kit-top", title: "인덕션 / 조리대 상판 닦기", meta: "마지막 기록 어제", icon: "soup_kitchen", checked: false },
      { id: "kit-hood", title: "레인지 후드 필터 청소", meta: "숨은 케어 · 30일 주기", icon: "mode_fan", checked: false },
      { id: "kit-fridge", title: "냉장고 도어 및 손잡이", meta: "가벼운 관리", icon: "kitchen", checked: false, helperClass: "text-tertiary" },
    ],
  },
  {
    key: "living",
    title: "거실 & 침실",
    subtitle: "바닥 밀대 · 선반 먼지 · 침구 환기",
    icon: "chair",
    iconClass: "bg-tertiary-fixed text-on-tertiary-container",
    initiallyOpen: true,
    items: [
      { id: "liv-floor", title: "바닥 정전기 청소포 밀기", meta: "마지막 기록 3일 전", icon: "mop", checked: true },
      { id: "liv-dust", title: "테이블 및 선반 먼지 털기", meta: "마지막 기록 2일 전", icon: "nest_heat_link_gen_3", checked: true },
      { id: "liv-air", title: "침구 털기 & 환기 10분", meta: "쾌적 루틴", icon: "air", checked: false, helperClass: "text-tertiary" },
      { id: "liv-window", title: "창틀 틈새 먼지 닦기", meta: "새로운 케어", icon: "window", checked: false },
    ],
  },
];

const initialChecked = spaces.reduce<Record<string, boolean>>((acc, space) => {
  space.items.forEach((item) => {
    acc[item.id] = item.checked;
  });
  return acc;
}, {});

export default function WeekendBigClean() {
  const [open, setOpen] = useState<Record<SpaceKey, boolean>>({
    bathroom: false,
    kitchen: false,
    living: true,
  });
  const [checked, setChecked] = useState(initialChecked);
  const [toast, setToast] = useState("");

  const total = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const countFor = (key: SpaceKey) => spaces.find((space) => space.key === key)?.items.filter((item) => checked[item.id]).length ?? 0;

  const submit = () => {
    setToast(total === 0 ? "오늘은 둘러보기만 해도 충분해요. 언제든 다시 오세요!" : `${total}곳의 손길이 새 기록으로 안전하게 남겨졌어요 ✨`);
  };

  return (
    <div className="phone-shell bg-surface text-on-surface">
      <AppHeader
        title="대청소 하기"
        right={
          <button
            aria-label="도움말 안내"
            className="-mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-on-surface-variant transition-all active:scale-95 active:bg-surface-container active:text-primary"
            type="button"
          >
            <Icon name="help_outline" className="text-[22px]" />
          </button>
        }
      />

      <main className="flex min-h-[844px] flex-col bg-surface pb-32 pt-14">
        <div className="flex w-full flex-col px-margin-screen pb-32">
          <section className="relative mb-5 mt-4 min-h-[96px] overflow-hidden rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-fixed/30 blur-2xl" />
          </section>

          <div className="flex flex-col gap-4">
            {spaces.map((space) => {
              const isOpen = open[space.key];
              const count = countFor(space.key);

              return (
                <section key={space.key} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                  <button
                    className="flex w-full items-center justify-between p-4 text-left transition-colors active:bg-surface-container-low"
                    type="button"
                    onClick={() => setOpen((current) => ({ ...current, [space.key]: !current[space.key] }))}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${space.iconClass}`}>
                        <Icon name={space.icon} className="text-[20px]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-title-sm text-on-surface">{space.title}</span>
                          <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-caption font-medium text-primary">
                            {count > 0 ? `${count}곳 선택됨` : "선택 없음"}
                          </span>
                        </div>
                        <span className="block truncate text-caption text-on-surface-variant">{space.subtitle}</span>
                      </div>
                    </div>
                    <Icon name="keyboard_arrow_down" className={`text-[22px] text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`${isOpen ? "flex" : "hidden"} flex-col gap-2.5 px-4 pb-4`}>
                    {space.items.map((item) => {
                      const isChecked = checked[item.id];

                      return (
                        <button
                          key={item.id}
                          className={`flex items-center justify-between rounded-lg p-3 text-left transition-all active:scale-[0.99] ${
                            isChecked ? "bg-primary-fixed/20" : "bg-surface-container-low"
                          }`}
                          type="button"
                          onClick={() => setChecked((current) => ({ ...current, [item.id]: !current[item.id] }))}
                        >
                          <div className="flex min-w-0 items-center gap-3 pr-2">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm ${
                                isChecked ? "bg-primary-container text-on-primary" : "bg-surface-container-lowest"
                              }`}
                            >
                              <Icon name="check" className={`text-[16px] ${isChecked ? "font-bold" : "text-transparent"}`} />
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-body-md text-on-surface">{item.title}</span>
                              {item.helper ? (
                                <div className="mt-0.5 flex items-center gap-1.5">
                                  <span className={`text-caption ${item.helperClass ?? "text-on-surface-variant"}`}>{item.meta}</span>
                                  <span className="h-1 w-1 rounded-full bg-outline-variant" />
                                  <span className={`text-caption ${item.helperClass ?? "text-on-surface-variant"}`}>{item.helper}</span>
                                </div>
                              ) : (
                                <span className={`mt-0.5 text-caption ${item.helperClass ?? "text-on-surface-variant"}`}>{item.meta}</span>
                              )}
                            </div>
                          </div>
                          <Icon name={item.icon} className="shrink-0 text-[18px] text-outline-variant" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-surface/90 px-margin-screen pb-safe pt-3 backdrop-blur-xl">
        <div className="mx-auto mb-2 flex max-w-md flex-col gap-2">
          <button
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary-container text-title-sm font-semibold text-on-primary shadow-md transition-all active:scale-[0.98]"
            type="button"
            onClick={submit}
          >
            <Icon name="check_circle" className="text-[20px]" />
            {total === 0 ? "선택한 곳 저장하기" : `${total}곳 맑게 칠하기 (기록 완료)`}
          </button>
          <button className="w-full py-2 text-center text-label-md text-secondary transition-colors active:opacity-75" type="button" onClick={submit}>
            오늘은 여기까지 (현재 상태로 저장)
          </button>
        </div>
      </div>

      <Toast message={toast} visible={Boolean(toast)} pill />
    </div>
  );
}
