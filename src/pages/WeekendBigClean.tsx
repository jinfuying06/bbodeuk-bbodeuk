import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import Icon from "../components/Icon";

type SpaceKey = "entry" | "bathroom" | "kitchen" | "living" | "bedroom" | "terrace";

type CleanItem = {
  id: string;
  title: string;
  lastText?: string;
  status?: string;
  tip: string;
  icon: string;
  priority: number;
  hidden?: boolean;
};

type CleanSpace = {
  key: SpaceKey;
  title: string;
  icon: string;
  items: CleanItem[];
};

const spaceTones: Record<SpaceKey, { fill: string; border: string; text: string; feedback: string; tint: string }> = {
  bathroom: {
    fill: "bg-[#EAF4FF]",
    border: "border-[#B8DCFF]",
    text: "text-primary",
    feedback: "bg-[#EAF4FF]/80",
    tint: "#EAF4FF",
  },
  kitchen: {
    fill: "bg-[#FFF1E7]",
    border: "border-[#FFD6B8]",
    text: "text-[#8A4C00]",
    feedback: "bg-[#FFF1E7]/80",
    tint: "#FFF1E7",
  },
  living: {
    fill: "bg-[#FFECEF]",
    border: "border-[#F9C9D2]",
    text: "text-[#9A4251]",
    feedback: "bg-[#FFECEF]/80",
    tint: "#FFECEF",
  },
  bedroom: {
    fill: "bg-[#EFF8F5]",
    border: "border-[#C9E8DE]",
    text: "text-tertiary",
    feedback: "bg-[#EFF8F5]/80",
    tint: "#EFF8F5",
  },
  entry: {
    fill: "bg-[#F7F4EE]",
    border: "border-[#DED7C9]",
    text: "text-[#5E5545]",
    feedback: "bg-[#F7F4EE]/80",
    tint: "#F7F4EE",
  },
  terrace: {
    fill: "bg-[#F3F8E6]",
    border: "border-[#DAE9B0]",
    text: "text-[#536B16]",
    feedback: "bg-[#F3F8E6]/80",
    tint: "#F3F8E6",
  },
};

const setupSpaceMap: Record<string, SpaceKey[]> = {
  현관: ["entry"],
  욕실: ["bathroom"],
  주방: ["kitchen"],
  거실: ["living"],
  "침실 / 방": ["bedroom"],
  "베란다 / 다용도실": ["terrace"],
};

const spaceLabels: Record<SpaceKey, string> = {
  entry: "현관",
  bathroom: "욕실",
  kitchen: "주방",
  living: "거실",
  bedroom: "침실",
  terrace: "테라스",
};

const spaces: CleanSpace[] = [
  {
    key: "entry",
    title: "현관",
    icon: "door_front",
    items: [
      { id: "entry-floor", title: "현관 바닥", tip: "먼지와 모래는 먼저 쓸어내면 좋아요.", icon: "door_front", priority: 8 },
      { id: "entry-shoes", title: "신발장 손잡이", tip: "자주 닿는 손잡이만 닦아도 산뜻해요.", icon: "steps", priority: 12, hidden: true },
    ],
  },
  {
    key: "bathroom",
    title: "욕실",
    icon: "bathtub",
    items: [
      { id: "bath-drain", title: "배수구", tip: "냄새가 나기 전에 거름망만 헹궈도 좋아요.", icon: "water_drop", priority: 1, hidden: true },
      { id: "bath-basin", title: "세면대", lastText: "6일 전", status: "슬슬 다시 볼 때", tip: "수전 주변 물기부터 가볍게 닦아보세요.", icon: "wash", priority: 3 },
      { id: "bath-mirror", title: "거울", lastText: "4일 전", tip: "마른 천으로 아래쪽 물자국을 먼저 훑어요.", icon: "auto_awesome", priority: 7 },
      { id: "bath-toilet", title: "변기", lastText: "1일 전", status: "최근 관리", tip: "오늘은 손잡이 주변만 확인해도 충분해요.", icon: "cleaning_services", priority: 10 },
    ],
  },
  {
    key: "kitchen",
    title: "주방",
    icon: "countertops",
    items: [
      { id: "kit-hood", title: "후드 필터", lastText: "28일 전", tip: "기름때는 오래 두면 닦기 어려워져요.", icon: "filter_alt", priority: 2, hidden: true },
      { id: "kit-sink", title: "싱크대", lastText: "4일 전", status: "청소가 필요해요", tip: "거름망을 비우고 따뜻한 물로 헹궈요.", icon: "faucet", priority: 4 },
      { id: "kit-fridge", title: "냉장고 손잡이", lastText: "12일 전", tip: "손이 자주 닿는 부분만 먼저 닦아도 좋아요.", icon: "kitchen", priority: 6, hidden: true },
      { id: "kit-top", title: "조리대", lastText: "어제", status: "최근 관리", tip: "상판에 남은 물기만 쓱 정리해요.", icon: "soup_kitchen", priority: 11 },
    ],
  },
  {
    key: "living",
    title: "거실",
    icon: "chair",
    items: [
      { id: "liv-window", title: "창틀", lastText: "18일 전", tip: "마른 티슈로 먼지를 먼저 걷어내요.", icon: "window", priority: 5, hidden: true },
      { id: "liv-floor", title: "바닥", lastText: "3일 전", status: "슬슬 다시 볼 때", tip: "눈에 보이는 먼지 구역만 밀어도 충분해요.", icon: "mop", priority: 9 },
      { id: "liv-dust", title: "선반", tip: "위쪽 선반부터 아래로 털면 다시 쌓이지 않아요.", icon: "shelves", priority: 13 },
    ],
  },
  {
    key: "bedroom",
    title: "침실",
    icon: "bed",
    items: [
      { id: "bed-pillow", title: "베개 커버", lastText: "9일 전", tip: "커버 교체만 해도 잠자리가 개운해요.", icon: "hotel", priority: 14, hidden: true },
      { id: "bed-bedding", title: "침구", lastText: "어제", status: "최근 관리", tip: "오늘은 가볍게 털고 환기만 해도 좋아요.", icon: "bed", priority: 15 },
      { id: "bed-floor", title: "바닥", tip: "머리카락이 모이는 모서리만 먼저 훑어요.", icon: "mop", priority: 16 },
    ],
  },
  {
    key: "terrace",
    title: "테라스",
    icon: "balcony",
    items: [
      { id: "ter-rail", title: "난간", lastText: "21일 전", tip: "바깥 먼지는 젖은 천보다 마른 천으로 먼저 닦아요.", icon: "fence", priority: 17, hidden: true },
      { id: "ter-floor", title: "바닥", tip: "물청소 전 먼지를 먼저 쓸어내요.", icon: "balcony", priority: 18 },
    ],
  },
];

export default function WeekendBigClean() {
  const navigate = useNavigate();
  const setup = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("bbodeuk.setup.v1") ?? "{}") as { spaces?: string[] };
    } catch {
      return {};
    }
  }, []);
  const availableSpaceKeys = useMemo(() => (setup.spaces ?? []).flatMap((item) => setupSpaceMap[item] ?? []), [setup.spaces]);
  const visibleSpaces = availableSpaceKeys.length > 0 ? spaces.filter((space) => availableSpaceKeys.includes(space.key)) : spaces;
  const visibleIds = visibleSpaces.flatMap((space) => space.items.map((item) => item.id));
  const prioritySpaces = [...visibleSpaces]
    .map((space) => ({
      ...space,
      hiddenCount: space.items.filter((item) => item.hidden).length,
      revisitCount: space.items.filter((item) => item.status?.includes("필요") || item.status?.includes("슬슬")).length,
      priorityScore: Math.min(...space.items.map((item) => item.priority)),
    }))
    .sort((a, b) => a.priorityScore - b.priorityScore)
    .slice(0, 3);
  const rankedSpaces = [...visibleSpaces].sort((a, b) => Math.min(...a.items.map((item) => item.priority)) - Math.min(...b.items.map((item) => item.priority)));
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ [rankedSpaces[0]?.key ?? "bathroom"]: true }));
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [flashItem, setFlashItem] = useState<string | null>(null);

  const total = useMemo(() => visibleIds.filter((id) => checked[id]).length, [checked, visibleIds]);
  const allSelected = total > 0 && total === visibleIds.length;

  const countFor = (space: CleanSpace) => space.items.filter((item) => checked[item.id]).length;

  const toggleItem = (id: string) => {
    if (checked[id]) {
      setChecked((current) => ({ ...current, [id]: false }));
      setFlashItem(null);
      return;
    }

    setChecked((current) => ({ ...current, [id]: true }));
    setFlashItem(id);
    window.setTimeout(() => setFlashItem((current) => (current === id ? null : current)), 1200);
  };

  const toggleAll = () => {
    setChecked((current) => {
      const next = { ...current };
      visibleIds.forEach((id) => {
        next[id] = !allSelected;
      });
      return next;
    });
  };

  const submit = () => {
    const selectedItems = rankedSpaces.flatMap((space) =>
      space.items
        .filter((item) => checked[item.id])
        .map((item) => ({
          id: `deep-${item.id}`,
          name: item.title,
          icon: item.icon,
          desc: `${spaceLabels[space.key]} · 대청소`,
          meta: "방금",
          space: space.key,
        })),
    );
    window.sessionStorage.setItem("bbodeuk.session.deepClean.recent.v1", JSON.stringify(selectedItems));
    if (selectedItems.length > 0) {
      const savedPaintedItems = JSON.parse(window.sessionStorage.getItem("bbodeuk.session.recordPainted.v1") ?? "[]") as string[];
      const nextPaintedItems = Array.from(new Set([...savedPaintedItems, ...selectedItems.map((item) => item.id)]));
      window.sessionStorage.setItem("bbodeuk.session.recordPainted.v1", JSON.stringify(nextPaintedItems));
    }

    navigate("/home");
  };

  const itemMeta = (item: CleanItem) => {
    if (item.hidden) return `숨은 관리 · ${item.lastText ?? "놓치기 쉬워요"}`;
    if (!item.lastText) return "";
    return item.status ? `${item.lastText} · ${item.status}` : item.lastText;
  };

  return (
    <div className="phone-shell bg-surface text-on-surface">
      <AppHeader title="대청소 하기" />

      <main className="flex min-h-[844px] flex-col bg-surface pb-[176px] pt-16">
        <div className="flex w-full flex-col gap-space-lg px-margin-screen pb-space-md pt-space-md">
          <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="relative z-10">
              <div className="min-w-0">
                <span className="text-label-sm text-secondary">대청소 하기</span>
                <h1 className="mt-1 text-headline-lg text-on-surface">오래 안 한 곳부터 훑어요</h1>
                <p className="mt-1 text-body-md text-on-surface-variant">숨은 관리까지 한 번에 확인해요.</p>
              </div>
            </div>
            <div className="relative z-10 mt-space-md border-t border-outline-variant/30 pt-space-sm">
              <p className="mb-space-xs text-label-sm text-on-surface">이 순서로 청소하는 건 어때요?</p>
              {prioritySpaces.map((space, index) => (
                <div key={space.key} className="flex items-center gap-space-xs py-1">
                  <span className="w-4 shrink-0 text-caption text-outline">{index + 1}</span>
                  <span className="shrink-0 text-body-md font-semibold text-on-surface">{space.title}</span>
                  <span className="min-w-0 truncate text-caption text-on-surface-variant">
                    숨은 관리 {space.hiddenCount}곳 · 다시 볼 곳 {space.revisitCount}곳
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-space-sm">
            {rankedSpaces.map((space) => {
              const isOpen = Boolean(open[space.key]);
              const count = countFor(space);
              const tone = spaceTones[space.key];
              const fillPercent = space.items.length === 0 ? 0 : Math.round((count / space.items.length) * 100);

              return (
                <section key={space.key} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                  <button
                    className="flex w-full items-center justify-between p-space-md text-left transition-colors active:bg-surface-container-low"
                    type="button"
                    onClick={() => setOpen((current) => ({ ...current, [space.key]: !current[space.key] }))}
                  >
                    <div className="flex min-w-0 items-center gap-space-sm">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container text-on-surface-variant">
                        <span className="absolute inset-x-0 bottom-0 transition-all duration-300" style={{ height: `${fillPercent}%`, backgroundColor: tone.tint }} />
                        <Icon name={space.icon} className={`relative z-10 text-[20px] ${count > 0 ? tone.text : "text-on-surface-variant"}`} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-title-sm text-on-surface">{space.title}</span>
                        {count > 0 ? <span className="ml-2 text-caption text-on-surface-variant">{count}곳</span> : null}
                      </div>
                    </div>
                    <Icon name="keyboard_arrow_down" className={`text-[22px] text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`${isOpen ? "flex" : "hidden"} flex-col gap-space-xs px-space-md pb-space-md`}>
                    {[...space.items].sort((a, b) => a.priority - b.priority).map((item) => {
                      const isChecked = Boolean(checked[item.id]);
                      const flashed = flashItem === item.id;
                      const meta = itemMeta(item);

                      return (
                        <button
                          key={item.id}
                          className={`relative flex items-center justify-between overflow-hidden rounded-lg border p-space-sm text-left transition-all active:scale-[0.99] ${
                            isChecked ? `${tone.fill} ${tone.border}` : "border-transparent bg-surface-container-low"
                          }`}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                        >
                          <div className="flex min-w-0 items-center gap-space-sm pr-space-xs">
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isChecked ? `bg-surface-container-lowest ${tone.text}` : "bg-surface-container-lowest text-on-surface-variant"}`}>
                              <Icon name={item.icon} className="text-[20px]" />
                            </span>
                            <div className="flex min-w-0 flex-col">
                              <span className={`truncate text-body-md ${isChecked ? tone.text : "text-on-surface"}`}>{item.title}</span>
                              {!isChecked && meta ? <span className="mt-0.5 truncate text-caption text-on-surface-variant">{meta}</span> : null}
                              {!isChecked ? <span className="mt-0.5 line-clamp-1 text-caption text-outline">{item.tip}</span> : null}
                            </div>
                          </div>
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 ${
                              isChecked ? `${tone.border} bg-surface-container-lowest ${tone.text}` : "border-outline-variant/50 bg-surface-container-low text-on-surface-variant"
                            }`}
                          >
                            <Icon name="check" className={`text-[20px] transition-transform duration-200 ${isChecked ? "scale-100" : "scale-0"}`} />
                          </span>
                          <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${tone.feedback} transition-opacity duration-500 ${flashed ? "opacity-100" : "opacity-0"}`}>
                            <span className={`rounded-full bg-surface-container-lowest px-3 py-1.5 text-label-md font-semibold ${tone.text} shadow-sm`}>
                              이제 깨끗해요!
                            </span>
                          </div>
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

      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-surface/90 px-margin-screen pt-space-sm backdrop-blur-xl">
        <div className="mx-auto mb-space-xs flex max-w-md flex-col gap-space-xs">
          <button
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary-container text-title-sm font-semibold text-on-primary shadow-md transition-all active:scale-[0.98]"
            type="button"
            onClick={submit}
          >
            <Icon name="task_alt" className="text-[20px]" />
            {total === 0 ? "오늘의 대청소 종료" : `${total}건 · 오늘의 대청소 종료`}
          </button>
          <button className="w-full py-2 text-center text-label-md text-secondary transition-colors active:opacity-75" type="button" onClick={toggleAll}>
            {allSelected ? "전체 선택 해제" : "전체 선택"}
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
