import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import Icon from "../components/Icon";

type Filter = "recent" | "fav" | "space";
type Space = "bathroom" | "kitchen" | "living" | "bedroom" | "entry" | "terrace";

type RecordItem = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  meta?: string;
  space?: Space;
};

const spaceLabels: Record<Space, string> = {
  bathroom: "욕실",
  kitchen: "주방 / 식당",
  living: "거실",
  bedroom: "침실",
  entry: "현관",
  terrace: "테라스",
};

const spaceTabs: Array<{ key: Space; label: string; icon: string }> = [
  { key: "bathroom", label: "욕실", icon: "bathtub" },
  { key: "kitchen", label: "주방", icon: "countertops" },
  { key: "living", label: "거실", icon: "chair" },
  { key: "bedroom", label: "침실", icon: "bed" },
  { key: "entry", label: "현관", icon: "door_front" },
  { key: "terrace", label: "테라스", icon: "balcony" },
];

const spaceTones: Record<Space, { soft: string; active: string; border: string; text: string; feedback: string }> = {
  bathroom: {
    soft: "bg-[#EAF4FF]",
    active: "bg-[#EAF4FF]",
    border: "border-[#B8DCFF]",
    text: "text-primary",
    feedback: "bg-[#EAF4FF]/80",
  },
  kitchen: {
    soft: "bg-[#FFF1E7]",
    active: "bg-[#FFF1E7]",
    border: "border-[#FFD6B8]",
    text: "text-[#8A4C00]",
    feedback: "bg-[#FFF1E7]/80",
  },
  living: {
    soft: "bg-[#FFECEF]",
    active: "bg-[#FFECEF]",
    border: "border-[#F9C9D2]",
    text: "text-[#9A4251]",
    feedback: "bg-[#FFECEF]/80",
  },
  bedroom: {
    soft: "bg-[#EFF8F5]",
    active: "bg-[#EFF8F5]",
    border: "border-[#C9E8DE]",
    text: "text-tertiary",
    feedback: "bg-[#EFF8F5]/80",
  },
  entry: {
    soft: "bg-[#F7F4EE]",
    active: "bg-[#F7F4EE]",
    border: "border-[#DED7C9]",
    text: "text-[#5E5545]",
    feedback: "bg-[#F7F4EE]/80",
  },
  terrace: {
    soft: "bg-[#F3F8E6]",
    active: "bg-[#F3F8E6]",
    border: "border-[#DAE9B0]",
    text: "text-[#536B16]",
    feedback: "bg-[#F3F8E6]/80",
  },
};

const setupSpaceMap: Record<string, Space[]> = {
  현관: ["entry"],
  욕실: ["bathroom"],
  주방: ["kitchen"],
  거실: ["living"],
  "침실 / 방": ["bedroom"],
  "베란다 / 다용도실": ["terrace"],
};

const spaceItems: Record<Space, RecordItem[]> = {
  bathroom: [
    { id: "basin", name: "세면대", icon: "wash", desc: "물때 및 수도꼭지 마감", meta: "6일 전" },
    { id: "toilet", name: "변기", icon: "cleaning_services", desc: "소독 및 안쪽 관리", meta: "1일 전" },
    { id: "shower", name: "샤워부스", icon: "shower", desc: "유리벽 스퀴지 작업" },
    { id: "mirror", name: "거울", icon: "auto_awesome", desc: "손자국 및 비누방울 닦기", meta: "8일 전" },
    { id: "bath-floor", name: "바닥", icon: "mop", desc: "타일 솔질 및 물기 정리" },
    { id: "drain", name: "배수구", icon: "water_drop", desc: "유가 및 거름망 헹굼" },
  ],
  kitchen: [
    { id: "sink", name: "싱크대", icon: "faucet", desc: "배수망 헹굼 & 거름망", meta: "4일 전" },
    { id: "table", name: "식탁", icon: "table_restaurant", desc: "상판 닦기" },
    { id: "hood", name: "후드 필터", icon: "filter_alt", desc: "기름때 필터 확인" },
    { id: "burner", name: "가스레인지", icon: "local_fire_department", desc: "기름 튄 자국 닦기" },
    { id: "fridge", name: "냉장고 겉면", icon: "kitchen", desc: "도어와 손잡이 닦기" },
    { id: "fridge-inside", name: "냉장고 안", icon: "inventory_2", desc: "선반 정리" },
    { id: "microwave", name: "전자레인지", icon: "microwave", desc: "내부 얼룩 닦기" },
    { id: "cabinet", name: "상부장", icon: "dresser", desc: "자주 닿는 손잡이" },
    { id: "drawer", name: "하부장", icon: "horizontal_rule", desc: "문 앞 먼지 닦기" },
    { id: "kitchen-floor", name: "바닥", icon: "mop", desc: "조리 공간 바닥" },
    { id: "window", name: "창틀", icon: "window", desc: "틈새 먼지 닦기" },
  ],
  living: [
    { id: "living-floor", name: "바닥", icon: "mop", desc: "정전기 청소포 밀기", meta: "3일 전" },
    { id: "shelf", name: "선반", icon: "shelves", desc: "먼지 털기", meta: "2일 전" },
    { id: "sofa", name: "소파", icon: "chair", desc: "쿠션 틈새 정리" },
    { id: "air", name: "환기", icon: "air", desc: "창문 열고 10분" },
  ],
  bedroom: [
    { id: "bedding", name: "침구", icon: "bed", desc: "침구 털기와 정리", meta: "어제" },
    { id: "pillow", name: "베개 커버", icon: "hotel", desc: "커버 교체" },
    { id: "bedroom-floor", name: "바닥", icon: "mop", desc: "머리카락 정리" },
    { id: "closet", name: "옷장", icon: "checkroom", desc: "문 손잡이 닦기" },
  ],
  entry: [
    { id: "entry-floor", name: "현관 바닥", icon: "door_front", desc: "먼지와 모래 쓸기" },
    { id: "shoes", name: "신발장", icon: "steps", desc: "손잡이와 상판 닦기" },
    { id: "door-handle", name: "문손잡이", icon: "sensor_door", desc: "자주 닿는 곳 닦기" },
  ],
  terrace: [
    { id: "terrace-floor", name: "테라스 바닥", icon: "balcony", desc: "먼지 쓸기" },
    { id: "rail", name: "난간", icon: "fence", desc: "외부 먼지 닦기" },
    { id: "laundry", name: "빨래 공간", icon: "local_laundry_service", desc: "세제 주변 정리" },
  ],
};

const recentItems: RecordItem[] = [
  { id: "recent-basin", name: "세면대", icon: "wash", desc: "욕실 · 물때 및 수도꼭지 마감", meta: "6일 전", space: "bathroom" },
  { id: "recent-sink", name: "싱크대", icon: "faucet", desc: "주방 · 배수망 헹굼 & 거름망", meta: "4일 전", space: "kitchen" },
  { id: "recent-bedding", name: "침구", icon: "bed", desc: "침실 · 침구 털기와 정리", meta: "어제", space: "bedroom" },
  { id: "recent-floor", name: "거실 바닥", icon: "mop", desc: "거실 · 정전기 청소포 밀기", meta: "3일 전", space: "living" },
];

const favoriteItems: RecordItem[] = [
  { id: "fav-basin", name: "세면대", icon: "wash", desc: "욕실 · 광택 관리", space: "bathroom" },
  { id: "fav-sink", name: "싱크대", icon: "faucet", desc: "주방 · 배수구 물때 제거", space: "kitchen" },
  { id: "fav-toilet", name: "변기", icon: "cleaning_services", desc: "욕실 · 노즐 및 림 정돈", space: "bathroom" },
  { id: "fav-mirror", name: "욕실 거울", icon: "auto_awesome", desc: "욕실 · 얼룩 없이 닦기", space: "bathroom" },
];

const filters: Array<{ key: Filter; icon: string; label: string }> = [
  { key: "recent", icon: "schedule", label: "최근 기록" },
  { key: "fav", icon: "favorite", label: "자주" },
  { key: "space", icon: "grid_view", label: "공간별 보기" },
];

function isFilter(value: string | null): value is Filter {
  return value === "recent" || value === "fav" || value === "space";
}

function isSpace(value: string | null): value is Space {
  return value === "bathroom" || value === "kitchen" || value === "living" || value === "bedroom" || value === "entry" || value === "terrace";
}

export default function QuickRecord() {
  const [searchParams, setSearchParams] = useSearchParams();
  const setup = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("bbodeuk.setup.v1") ?? "{}") as { spaces?: string[] };
    } catch {
      return {};
    }
  }, []);
  const deepCleanRecent = useMemo(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem("bbodeuk.session.deepClean.recent.v1") ?? "[]") as RecordItem[];
    } catch {
      return [];
    }
  }, []);
  const selectedSpaceKeys = useMemo(() => (setup.spaces ?? []).flatMap((item) => setupSpaceMap[item] ?? []), [setup.spaces]);
  const hasSetup = selectedSpaceKeys.length > 0;
  const availableSpaces = hasSetup ? selectedSpaceKeys : spaceTabs.map((item) => item.key);
  const [filter, setFilter] = useState<Filter>(() => {
    const initialFilter = searchParams.get("filter");
    return isFilter(initialFilter) ? initialFilter : "space";
  });
  const [space, setSpace] = useState<Space>(() => {
    const initialSpace = searchParams.get("space");
    return isSpace(initialSpace) ? initialSpace : "bathroom";
  });
  const [paintedItems, setPaintedItems] = useState<string[]>(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem("bbodeuk.session.recordPainted.v1") ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const [flashCard, setFlashCard] = useState<string | null>(null);
  const currentSpace = availableSpaces.includes(space) ? space : availableSpaces[0] ?? "bathroom";
  const availableSpaceTabs = spaceTabs.filter((item) => availableSpaces.includes(item.key));
  const selectedItemId = searchParams.get("item");

  useEffect(() => {
    const nextFilter = searchParams.get("filter");
    const nextSpace = searchParams.get("space");
    if (isFilter(nextFilter)) setFilter(nextFilter);
    if (isSpace(nextSpace)) setSpace(nextSpace);
  }, [searchParams]);

  useEffect(() => {
    if (space === currentSpace) return;
    setSpace(currentSpace);
    if (filter === "space") setSearchParams({ filter: "space", space: currentSpace });
  }, [currentSpace, filter, setSearchParams, space]);

  const activeItems = useMemo(() => {
    if (filter === "recent") {
      const mergedRecent = [...deepCleanRecent, ...recentItems];
      return hasSetup ? mergedRecent.filter((item) => item.space && availableSpaces.includes(item.space)) : mergedRecent;
    }
    if (filter === "fav") return hasSetup ? favoriteItems.filter((item) => item.space && availableSpaces.includes(item.space)) : favoriteItems;
    return spaceItems[currentSpace];
  }, [availableSpaces, currentSpace, deepCleanRecent, filter, hasSetup]);

  const updateFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    const nextParams: Record<string, string> = { filter: nextFilter };
    if (nextFilter === "space") nextParams.space = currentSpace;
    setSearchParams(nextParams);
  };

  const updateSpace = (nextSpace: Space) => {
    if (!availableSpaces.includes(nextSpace)) return;
    setSpace(nextSpace);
    setFilter("space");
    setSearchParams({ filter: "space", space: nextSpace });
  };

  const selectedItem = filter === "space" ? activeItems.find((item) => item.id === selectedItemId) : undefined;

  const paintItem = (item: RecordItem) => {
    if (paintedItems.includes(item.id)) {
      setPaintedItems((current) => {
        const next = current.filter((id) => id !== item.id);
        window.sessionStorage.setItem("bbodeuk.session.recordPainted.v1", JSON.stringify(next));
        return next;
      });
      setFlashCard(null);
      return;
    }

    setPaintedItems((current) => {
      const next = [...current, item.id];
      window.sessionStorage.setItem("bbodeuk.session.recordPainted.v1", JSON.stringify(next));
      return next;
    });
    setFlashCard(item.id);
    window.setTimeout(() => setFlashCard((current) => (current === item.id ? null : current)), 1200);
  };

  return (
    <div className="phone-shell bg-surface text-on-surface">
      <AppHeader
        title={filter === "space" ? spaceLabels[currentSpace] : "기록"}
      />
      <main className="flex min-h-[844px] flex-col bg-surface pb-24 pt-16">
        <section className="px-margin-screen pb-space-sm pt-space-md">
          <h1 className="text-headline-lg text-on-surface">{selectedItem ? `${selectedItem.name} 청소를 기록할까요?` : "어디를 청소했나요?"}</h1>
        </section>

        <section className="px-margin-screen py-space-xs">
          <div className="flex w-full items-center gap-space-xs rounded-full bg-surface-container p-space-xxs">
            {filters.map((item) => (
              <button
                key={item.key}
                className={`flex flex-1 items-center justify-center gap-1 rounded-full px-space-xs py-space-xs text-label-md transition-all duration-200 ${
                  filter === item.key ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                }`}
                type="button"
                onClick={() => updateFilter(item.key)}
              >
                <Icon name={item.icon} className="text-[18px]" />
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {filter === "space" ? (
          <section className="mt-space-sm px-margin-screen">
            <div className="hide-scrollbar -mx-margin-screen overflow-x-auto px-margin-screen">
              <div className="flex min-w-max gap-space-xs">
                {availableSpaceTabs.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center gap-1.5 rounded-full border px-space-md py-space-xs text-label-md transition-colors duration-150 ${
                      currentSpace === item.key ? `${spaceTones[item.key].active} ${spaceTones[item.key].border} ${spaceTones[item.key].text}` : "border-transparent bg-surface-container text-on-surface-variant"
                    }`}
                    type="button"
                    onClick={() => updateSpace(item.key)}
                  >
                    <Icon name={item.icon} className="text-[16px]" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-space-md px-margin-screen">
          {filter === "space" ? (
            <div className="grid grid-cols-3 gap-space-xs">
              {activeItems.map((item) => {
                const flashed = flashCard === item.id;
                const painted = paintedItems.includes(item.id);
                const selected = selectedItemId === item.id;
                const tone = spaceTones[currentSpace];

                return (
                  <button
                    key={item.id}
                    className={`relative flex aspect-square flex-col items-center justify-center gap-space-xs overflow-hidden rounded-lg border p-space-xs text-center transition-all active:scale-95 ${
                      painted || selected ? `${tone.border} ${tone.active} ${tone.text} shadow-sm` : "border-outline-variant/60 bg-surface-container-lowest text-on-surface"
                    }`}
                    type="button"
                    onClick={() => paintItem(item)}
                    >
                    {selected ? <span className="absolute right-2 top-2 rounded-full bg-surface-container-lowest px-2 py-0.5 text-caption font-semibold">선택됨</span> : null}
                    <span className="text-label-sm font-semibold">{item.name}</span>
                    <span className="text-caption text-on-surface-variant">{item.meta ? `최근 청소 ${item.meta}` : "최근 기록 없음"}</span>
                    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${tone.feedback} transition-opacity duration-500 ${flashed ? "opacity-100" : "opacity-0"}`}>
                      <span className={`rounded-full bg-surface-container-lowest px-3 py-1.5 text-label-md font-semibold ${tone.text} shadow-sm`}>
                        이제 깨끗해요!
                      </span>
                    </div>
                  </button>
                );
              })}
              <Link className="flex aspect-square flex-col items-center justify-center gap-space-xs rounded-lg border border-dashed border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant" to={`/item-add?space=${currentSpace}`}>
                <Icon name="add" className="text-[24px]" />
                <span className="text-label-sm">항목 추가</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-space-xs">
              {activeItems.map((item) => {
                const flashed = flashCard === item.id;
                const painted = paintedItems.includes(item.id);
                const itemSpace = item.space ?? "bathroom";
                const tone = spaceTones[itemSpace];
                const spaceIcon = spaceTabs.find((tab) => tab.key === itemSpace)?.icon ?? "grid_view";

                return (
                  <button
                    key={item.id}
                    className={`relative flex items-center overflow-hidden rounded-xl border p-space-sm text-left transition-all duration-200 active:scale-[0.99] ${
                      painted ? `${tone.border} ${tone.active} shadow-sm` : "border-transparent bg-surface-container-lowest"
                    }`}
                    type="button"
                    onClick={() => paintItem(item)}
                  >
                    <div className="flex min-w-0 items-center gap-space-sm">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.soft} ${tone.text}`}>
                        <Icon name={spaceIcon} className="text-[22px]" />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className={`text-title-sm ${painted ? tone.text : "text-on-surface"}`}>{item.name}</span>
                        <span className="truncate text-caption text-on-surface-variant">{item.meta ? `최근 청소 ${item.meta}` : "최근 기록 없음"}</span>
                      </div>
                    </div>
                    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${tone.feedback} transition-opacity duration-500 ${flashed ? "opacity-100" : "opacity-0"}`}>
                      <span className={`rounded-full bg-surface-container-lowest px-3 py-1.5 text-label-md font-semibold ${tone.text} shadow-sm`}>
                        이제 깨끗해요!
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
