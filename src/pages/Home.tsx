import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import Icon from "../components/Icon";

const recommendations = [
  {
    id: "basin",
    spaceKey: "bathroom",
    title: "세면대",
    meta: "최근 관리 기록이 오래된 곳이에요.",
    elapsedRatio: 0.86,
    icon: "wash",
  },
  {
    id: "sink",
    spaceKey: "kitchen",
    title: "싱크대",
    meta: "슬슬 다시 확인해볼 때예요.",
    elapsedRatio: 1.33,
    icon: "faucet",
  },
  {
    id: "door-handle",
    spaceKey: "living",
    title: "문 손잡이",
    meta: "최근 기록이 없는 곳이 있어요.",
    elapsedRatio: 0.95,
    icon: "door_open",
  },
];

const spaceIcons: Record<string, string> = {
  bathroom: "bathtub",
  kitchen: "countertops",
  living: "chair",
  bedroom: "bed",
  entry: "door_front",
  terrace: "balcony",
};

const spaceTones: Record<string, { fill: string; border: string; text: string; feedback: string; rgb: [number, number, number] }> = {
  bathroom: {
    fill: "bg-[#EAF4FF]",
    border: "border-[#B8DCFF]",
    text: "text-primary",
    feedback: "bg-[#EAF4FF]/80",
    rgb: [184, 220, 255],
  },
  kitchen: {
    fill: "bg-[#FFF1E7]",
    border: "border-[#FFD6B8]",
    text: "text-[#8A4C00]",
    feedback: "bg-[#FFF1E7]/80",
    rgb: [255, 214, 184],
  },
  living: {
    fill: "bg-[#FFECEF]",
    border: "border-[#F9C9D2]",
    text: "text-[#9A4251]",
    feedback: "bg-[#FFECEF]/80",
    rgb: [249, 201, 210],
  },
  bedroom: {
    fill: "bg-[#EFF8F5]",
    border: "border-[#C9E8DE]",
    text: "text-tertiary",
    feedback: "bg-[#EFF8F5]/80",
    rgb: [201, 232, 222],
  },
  entry: {
    fill: "bg-[#F7F4EE]",
    border: "border-[#DED7C9]",
    text: "text-[#5E5545]",
    feedback: "bg-[#F7F4EE]/80",
    rgb: [222, 215, 201],
  },
  terrace: {
    fill: "bg-[#F3F8E6]",
    border: "border-[#DAE9B0]",
    text: "text-[#536B16]",
    feedback: "bg-[#F3F8E6]/80",
    rgb: [218, 233, 176],
  },
};

type CanvasCard = {
  spaceKey: string;
  room: string;
  managedItems: number;
  healthyItems: number;
  layout: string;
};

const canvasCards: CanvasCard[] = [
  {
    spaceKey: "bathroom",
    room: "욕실",
    managedItems: 6,
    healthyItems: 1,
    layout: "h-[88px]",
  },
  {
    spaceKey: "entry",
    room: "현관",
    managedItems: 2,
    healthyItems: 0,
    layout: "h-[58px]",
  },
  {
    spaceKey: "kitchen",
    room: "주방/식당",
    managedItems: 12,
    healthyItems: 1,
    layout: "h-[96px]",
  },
  {
    spaceKey: "bedroom",
    room: "침실",
    managedItems: 6,
    healthyItems: 2,
    layout: "h-[110px]",
  },
  {
    spaceKey: "living",
    room: "거실",
    managedItems: 6,
    healthyItems: 4,
    layout: "h-[120px] flex-1",
  },
  {
    spaceKey: "terrace",
    room: "테라스",
    managedItems: 2,
    healthyItems: 0,
    layout: "h-[70px]",
  },
];

const recentRecords = [
  { id: "bedding", spaceKey: "bedroom", title: "침구", lastText: "어제 저녁" },
  { id: "toilet", spaceKey: "bathroom", title: "변기", lastText: "3일 전" },
  { id: "sink", spaceKey: "kitchen", title: "싱크대 거름망", lastText: "4일 전" },
  { id: "living-floor", spaceKey: "living", title: "바닥", lastText: "7일 전" },
  { id: "basin", spaceKey: "bathroom", title: "세면대 수전 및 볼", lastText: "8일 전" },
];

const itemHistoryNames: Record<string, string> = {
  bedding: "침실 침구",
  toilet: "변기",
  sink: "싱크대 거름망",
  "living-floor": "거실 바닥",
  basin: "세면대 수전 및 볼",
};

type SessionRecord = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  meta?: string;
  space?: string;
};

const setupSpaceMap: Record<string, string[]> = {
  현관: ["entry"],
  욕실: ["bathroom"],
  주방: ["kitchen"],
  거실: ["living"],
  "침실 / 방": ["bedroom"],
  "베란다 / 다용도실": ["terrace"],
};

const getManagementRatio = (card: CanvasCard) => {
  if (card.managedItems <= 0) return 0;
  return Math.min(1, card.healthyItems / card.managedItems);
};

const getCanvasTone = (spaceKey: string, ratio: number) => {
  const [r, g, b] = spaceTones[spaceKey].rgb;
  const alpha = ratio <= 0 ? 0.24 : ratio < 0.45 ? 0.38 : ratio < 0.75 ? 0.58 : 0.82;
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    borderColor: `rgba(${r}, ${g}, ${b}, ${Math.min(alpha + 0.12, 0.9)})`,
  };
};

const getSpaceStatusLabel = (ratio: number) => {
  if (ratio <= 0) return "아직 기록 없음";
  if (ratio < 0.45) return "확인 필요";
  if (ratio < 0.75) return "슬슬 확인";
  return "관리 중";
};

const getCanvasColumns = (cards: CanvasCard[]) => ({
  left: cards.filter((card) => ["bathroom", "bedroom", "terrace"].includes(card.spaceKey)),
  right: cards.filter((card) => ["entry", "kitchen", "living"].includes(card.spaceKey)),
});

const getHomeStatus = (cards: CanvasCard[], sessionRecordCount: number, target?: (typeof recommendations)[number]) => {
  const hasManagedItems = cards.some((card) => card.managedItems > 0);
  const lowestSpace = [...cards].sort((a, b) => getManagementRatio(a) - getManagementRatio(b))[0];

  if (!hasManagedItems) {
    return {
      icon: "info",
      title: "최근 기록이 없는 곳이 있어요",
      description: "청소를 기록하면 공간 상태가 조금씩 채워져요.",
      tone: "bg-surface-container-low",
    };
  }

  if (sessionRecordCount >= 2) {
    return {
      icon: "check_circle",
      title: `오늘 ${sessionRecordCount}곳을 관리했어요`,
      description: lowestSpace ? `${lowestSpace.room} 상태도 함께 확인해보세요.` : "방금 관리한 공간이 캔버스에 반영됐어요.",
      tone: "bg-tertiary-fixed/40",
    };
  }

  if (target) {
    return {
      icon: "manage_search",
      title: `${target.title} 청소는 어때요?`,
      description: target.meta,
      tone: "bg-primary-fixed/55",
    };
  }

  return {
    icon: "check_circle",
    title: "최근 자주 관리한 곳이에요",
    description: "공간 상태가 전반적으로 안정적으로 유지되고 있어요.",
    tone: "bg-tertiary-fixed/40",
  };
};

export default function Home() {
  const [completed] = useState<string[]>(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem("bbodeuk.session.homeCompleted.v1") ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const deepCleanRecent = (() => {
    try {
      return JSON.parse(window.sessionStorage.getItem("bbodeuk.session.deepClean.recent.v1") ?? "[]") as SessionRecord[];
    } catch {
      return [];
    }
  })();
  const setup = (() => {
    try {
      return JSON.parse(window.localStorage.getItem("bbodeuk.setup.v1") ?? "{}") as { spaces?: string[]; homeType?: string };
    } catch {
      return {};
    }
  })();
  const enabledSpaceKeys = new Set((setup.spaces ?? []).flatMap((space) => setupSpaceMap[space] ?? []));
  const hasSetup = enabledSpaceKeys.size > 0;
  const deepCleanSpaces = new Set(deepCleanRecent.map((item) => item.space).filter(Boolean));
  const sessionRecentRecords = deepCleanRecent.map((item) => ({
    id: item.id.replace(/^deep-/, ""),
    spaceKey: item.space ?? "bathroom",
    title: item.name,
    lastText: item.meta ?? "방금",
  }));
  const visibleCanvasCards = hasSetup ? canvasCards.filter((card) => enabledSpaceKeys.has(card.spaceKey)) : canvasCards;
  const effectiveCanvasCards = visibleCanvasCards.map((card) => {
    const completedCount = recommendations.filter((item) => completed.includes(item.id) && item.spaceKey === card.spaceKey).length;
    const sessionBoost = deepCleanSpaces.has(card.spaceKey) ? 1 : 0;
    return { ...card, healthyItems: Math.min(card.managedItems, card.healthyItems + completedCount + sessionBoost) };
  });
  const baseRecentRecords = hasSetup ? recentRecords.filter((record) => enabledSpaceKeys.has(record.spaceKey)) : recentRecords;
  const allRecentRecords = [...sessionRecentRecords, ...baseRecentRecords];
  const maxRecentRecords = 4;
  const visibleRecentRecords = allRecentRecords.slice(0, maxRecentRecords);
  const visibleRecommendations = hasSetup ? recommendations.filter((item) => enabledSpaceKeys.has(item.spaceKey)) : recommendations;
  const activeRecommendations = visibleRecommendations.filter((item) => !completed.includes(item.id));
  const heroTarget = [...activeRecommendations].sort((a, b) => b.elapsedRatio - a.elapsedRatio)[0];
  const homeStatus = getHomeStatus(effectiveCanvasCards, completed.length + deepCleanRecent.length, heroTarget);
  const canvasColumns = getCanvasColumns(effectiveCanvasCards);

  return (
    <div className="phone-shell min-h-[844px] bg-surface text-on-surface">
      <AppHeader home />
      <main className="flex min-h-[844px] flex-1 flex-col bg-surface pb-[88px] pt-16">
        <div className="flex w-full flex-col gap-space-xl px-margin-screen pb-space-2xl">
          <Link className="relative block w-full overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-transform active:scale-[0.99]" to={`/quick-record?filter=space&space=${heroTarget?.spaceKey ?? effectiveCanvasCards[0]?.spaceKey ?? "bathroom"}`}>
            <div className="flex items-start justify-between">
              <div className="relative z-10 flex max-w-[78%] flex-col gap-space-xxs">
                <h1 className="text-headline-lg text-on-surface">{homeStatus.title}</h1>
                <p className="text-body-md text-on-surface-variant">{homeStatus.description}</p>
              </div>
              <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${homeStatus.tone} text-[24px] leading-none shadow-sm`} aria-hidden="true">
                <span className="translate-y-[1px] leading-none">{homeStatus.icon === "check_circle" ? "🙂" : homeStatus.icon === "info" ? "🫧" : "🧽"}</span>
              </div>
            </div>
          </Link>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="bubble_chart" className="text-[18px] text-primary" />
              <span className="text-title-sm text-on-surface">청소 캔버스</span>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
              <p className="mb-space-sm text-caption text-on-surface-variant">각 공간을 누르면 공간별 기록으로 이동해요.</p>
              <div className="flex h-[304px] gap-1.5 rounded-lg bg-surface-container-low p-1.5">
                {[canvasColumns.left, canvasColumns.right].map((column, index) => (
                  <div key={index === 0 ? "left" : "right"} className={`${index === 0 ? "w-[43%]" : "flex-1"} flex min-w-0 flex-col gap-1.5`}>
                    {column.map((card) => {
                      const ratio = getManagementRatio(card);
                      const tone = spaceTones[card.spaceKey];
                      const style = getCanvasTone(card.spaceKey, ratio);

                      return (
                        <Link
                          key={card.room}
                          aria-label={`${card.room} 관리 상태 ${getSpaceStatusLabel(ratio)}`}
                          className={`flex min-h-[52px] items-center justify-center gap-1.5 rounded-lg border px-2 py-space-xs text-center transition-transform active:scale-[0.98] ${card.layout}`}
                          style={style}
                          to={`/quick-record?filter=space&space=${card.spaceKey}`}
                        >
                          <Icon name={spaceIcons[card.spaceKey]} className={`shrink-0 text-[17px] ${tone.text}`} />
                          <span className="block max-w-full truncate text-label-md font-bold text-on-surface">{card.room}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="check_circle" className="text-[18px] text-tertiary" />
              <span className="text-title-sm text-on-surface">최근 관리 흔적</span>
            </div>
            {visibleRecentRecords.length <= 1 ? (
              <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <p className="text-title-sm text-on-surface">아직 최근 청소 기록이 많지 않아요.</p>
                <p className="mt-1 text-body-sm text-on-surface-variant">작은 청소부터 하나씩 기록해보세요.</p>
                <Link className="mt-space-md inline-flex min-h-11 items-center rounded-lg bg-primary-container px-space-md text-label-md font-semibold text-on-primary" to="/quick-record">
                  청소 기록하기
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-space-xs">
                  {visibleRecentRecords.map((record) => (
                    <Link key={`${record.spaceKey}-${record.title}-${record.lastText}`} className="block rounded-xl bg-surface-container-lowest p-space-sm shadow-sm transition-transform active:scale-[0.99]" to={`/item-history?item=${encodeURIComponent(itemHistoryNames[record.id] ?? record.title)}`}>
                      <div className="mb-space-xs flex items-center gap-space-xs">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${spaceTones[record.spaceKey].fill} ${spaceTones[record.spaceKey].text}`}>
                          <Icon name={spaceIcons[record.spaceKey]} className="text-[18px]" />
                        </span>
                        <span className="min-w-0 truncate text-body-md font-semibold text-on-surface">{record.title}</span>
                      </div>
                      <p className="text-caption text-on-surface-variant">최근 관리 {record.lastText}</p>
                    </Link>
                  ))}
                  {visibleRecentRecords.length > 1 && visibleRecentRecords.length < maxRecentRecords ? (
                    <Link className="flex min-h-[92px] flex-col justify-between rounded-xl bg-surface-container-lowest p-space-sm shadow-sm transition-transform active:scale-[0.99]" to="/care">
                      <span className="text-body-md font-semibold text-on-surface">다음에 관리할 곳을 찾아보세요</span>
                      <span className="text-caption font-semibold text-primary">청소가이드 보기</span>
                    </Link>
                  ) : null}
                </div>
                {allRecentRecords.length > maxRecentRecords ? (
                  <Link className="self-center px-space-sm py-space-xs text-label-md text-primary transition-opacity active:opacity-70" to="/history">
                    청소 기록 더보기
                  </Link>
                ) : null}
              </>
            )}
          </section>

          {activeRecommendations.length > 0 ? (
            <section className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-1.5">
                <Icon name="lightbulb" className="text-[18px] text-primary" />
                <span className="text-title-sm text-on-surface">여기 청소는 어때요?</span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {activeRecommendations.map((item) => {
                  const tone = spaceTones[item.spaceKey];

                  return (
                    <Link
                      key={item.id}
                      className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-md text-left shadow-sm transition-transform active:scale-[0.99]"
                      to={`/quick-record?filter=space&space=${item.spaceKey}`}
                    >
                      <div className="flex items-center justify-between gap-space-sm">
                        <div className="flex min-w-0 items-center gap-space-sm">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
                            <Icon name={spaceIcons[item.spaceKey]} className="text-[22px]" />
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-title-sm text-on-surface">{item.title}</span>
                            <span className="mt-0.5 text-caption text-on-surface-variant">{item.meta}</span>
                          </div>
                        </div>
                        <Icon name="chevron_right" className="ml-space-sm shrink-0 text-[20px] text-outline-variant" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          <Link
            className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-transform active:scale-[0.99]"
            to="/deep-clean"
          >
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary">
                <Icon name="cleaning_services" className="text-[20px]" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-title-sm text-on-surface">대청소 어떠세요?</span>
                <span className="truncate text-caption text-on-surface-variant">오래 안 한 곳과 숨은 관리까지 훑어봐요.</span>
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
