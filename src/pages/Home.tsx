import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import Icon from "../components/Icon";

const recommendations = [
  {
    id: "basin",
    spaceKey: "bathroom",
    title: "욕실 · 세면대",
    shortTitle: "욕실 · 세면대 청소",
    meta: "마지막 가벼운 세척 6일 전",
    elapsedRatio: 0.86,
    icon: "wash",
  },
  {
    id: "sink",
    spaceKey: "kitchen",
    title: "주방 · 싱크대",
    shortTitle: "주방 · 싱크대 청소",
    meta: "마지막 물때 닦기 4일 전",
    elapsedRatio: 1.33,
    icon: "faucet",
  },
];

const spaceTones: Record<string, { fill: string; border: string; text: string; feedback: string }> = {
  bathroom: {
    fill: "bg-[#EAF4FF]",
    border: "border-[#B8DCFF]",
    text: "text-primary",
    feedback: "bg-[#EAF4FF]/80",
  },
  kitchen: {
    fill: "bg-[#FFF1E7]",
    border: "border-[#FFD6B8]",
    text: "text-[#8A4C00]",
    feedback: "bg-[#FFF1E7]/80",
  },
  living: {
    fill: "bg-[#FFECEF]",
    border: "border-[#F9C9D2]",
    text: "text-[#9A4251]",
    feedback: "bg-[#FFECEF]/80",
  },
  bedroom: {
    fill: "bg-[#EFF8F5]",
    border: "border-[#C9E8DE]",
    text: "text-tertiary",
    feedback: "bg-[#EFF8F5]/80",
  },
  entry: {
    fill: "bg-[#F7F4EE]",
    border: "border-[#DED7C9]",
    text: "text-[#5E5545]",
    feedback: "bg-[#F7F4EE]/80",
  },
  terrace: {
    fill: "bg-[#F3F8E6]",
    border: "border-[#DAE9B0]",
    text: "text-[#536B16]",
    feedback: "bg-[#F3F8E6]/80",
  },
};

type CanvasCard = {
  spaceKey: string;
  room: string;
  icon: string;
  status: string;
  elapsedRatio: number | null;
  fill: string;
  border: string;
  text: string;
  layout: string;
  line?: string;
  bottom: number;
};

const canvasCards: CanvasCard[] = [
  {
    spaceKey: "bathroom",
    room: "욕실",
    icon: "bathtub",
    status: "6일 전",
    elapsedRatio: 0.86,
    fill: "bg-[#EAF4FF]",
    border: "border-[#B8DCFF]",
    text: "text-primary",
    layout: "left-[10px] top-[8px] h-[96px] w-[86px]",
    line: "left-[96px] top-[56px] h-px w-[18px]",
    bottom: 104,
  },
  {
    spaceKey: "entry",
    room: "현관",
    icon: "door_front",
    status: "기록 없음",
    elapsedRatio: null,
    fill: "bg-[#F7F4EE]",
    border: "border-[#DED7C9] border-dashed",
    text: "text-[#5E5545]",
    layout: "left-[114px] top-[8px] h-[76px] w-[76px]",
    line: "left-[152px] top-[84px] h-[24px] w-px",
    bottom: 84,
  },
  {
    spaceKey: "kitchen",
    room: "주방/식당",
    icon: "countertops",
    status: "4일 전",
    elapsedRatio: 1.33,
    fill: "bg-[#FFF1E7]",
    border: "border-[#FFD6B8]",
    text: "text-[#8A4C00]",
    layout: "right-[10px] top-[104px] h-[86px] w-[128px]",
    line: "left-[96px] top-[148px] h-px w-[56px]",
    bottom: 190,
  },
  {
    spaceKey: "bedroom",
    room: "침실",
    icon: "bed",
    status: "어제",
    elapsedRatio: 0.14,
    fill: "bg-[#EFF8F5]",
    border: "border-[#C9E8DE]",
    text: "text-tertiary",
    layout: "left-[10px] top-[116px] h-[128px] w-[86px]",
    line: "left-[53px] top-[244px] h-[24px] w-px",
    bottom: 244,
  },
  {
    spaceKey: "living",
    room: "거실",
    icon: "chair",
    status: "3일 전",
    elapsedRatio: 0.43,
    fill: "bg-[#FFECEF]",
    border: "border-[#F9C9D2]",
    text: "text-[#9A4251]",
    layout: "right-[10px] top-[202px] h-[128px] w-[128px]",
    line: "left-[96px] top-[212px] h-px w-[56px]",
    bottom: 330,
  },
  {
    spaceKey: "terrace",
    room: "테라스",
    icon: "balcony",
    status: "기록 없음",
    elapsedRatio: null,
    fill: "bg-[#F3F8E6]",
    border: "border-[#DAE9B0] border-dashed",
    text: "text-[#536B16]",
    layout: "left-[10px] top-[268px] h-[62px] w-[86px]",
    bottom: 330,
  },
];

const recentRecords = [
  { spaceKey: "bedroom", title: "침실 침구", lastText: "어제 저녁", elapsedRatio: 0.14, icon: "hotel" },
  { spaceKey: "bathroom", title: "욕실 변기", lastText: "3일 전", elapsedRatio: 0.43, icon: "cleaning_services" },
  { spaceKey: "kitchen", title: "주방 싱크대", lastText: "4일 전", elapsedRatio: 1.33, icon: "faucet" },
  { spaceKey: "living", title: "거실 바닥", lastText: "7일 전", elapsedRatio: 1.12, icon: "mop" },
];

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

const getHomeStatus = (cards: CanvasCard[], sessionRecordCount: number, targetTitle?: string) => {
  const recordedCards = cards.filter((card) => card.elapsedRatio !== null);
  const needsCare = recordedCards.some((card) => (card.elapsedRatio ?? 0) >= 0.85);

  if (recordedCards.length === 0) {
    return {
      emoji: "🙂",
      title: "오늘 한 곳만 칠해도 충분해요",
      description: targetTitle ? `${targetTitle}를 추천드려요.` : "기록을 시작하면 청소 캔버스가 채워져요.",
      tone: "bg-surface-container-low",
    };
  }

  if (sessionRecordCount >= 2) {
    return {
      emoji: "😄",
      title: `오늘 ${sessionRecordCount}곳을 관리했어요`,
      description: targetTitle ? `${targetTitle}까지 가볍게 이어가도 좋아요.` : "방금 칠한 공간은 다시 선명하게 유지돼요.",
      tone: "bg-tertiary-fixed/40",
    };
  }

  if (needsCare) {
    return {
      emoji: "🧽",
      title: "오늘 가볍게 청소하고 색칠해볼까요?",
      description: targetTitle ? `${targetTitle}를 추천드려요.` : "이 부분 청소를 추천드려요.",
      tone: "bg-primary-fixed/55",
    };
  }

  return {
    emoji: "😊",
    title: "잘 유지되고 있어요",
    description: targetTitle ? `${targetTitle}를 가볍게 이어가도 좋아요.` : "최근 관리한 색이 아직 선명하게 남아 있어요.",
    tone: "bg-tertiary-fixed/40",
  };
};

const getCarePhrase = (elapsedRatio: number) => {
  if (elapsedRatio < 0.6) return "뽀득뽀득해요";
  if (elapsedRatio < 0.85) return "깨끗해요";
  if (elapsedRatio < 1.1) return "슬슬 청소해볼까요?";
  return "청소가 필요해요";
};

export default function Home() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem("bbodeuk.session.homeCompleted.v1") ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const [recommendationFlash, setRecommendationFlash] = useState<string | null>(null);
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
    spaceKey: item.space ?? "bathroom",
    title: item.name,
    lastText: item.meta ?? "방금",
    elapsedRatio: 0,
    icon: item.icon,
  }));
  const visibleCanvasCards = hasSetup ? canvasCards.filter((card) => enabledSpaceKeys.has(card.spaceKey)) : canvasCards;
  const effectiveCanvasCards = visibleCanvasCards.map((card) =>
    completed.some((id) => recommendations.find((item) => item.id === id)?.spaceKey === card.spaceKey) || deepCleanSpaces.has(card.spaceKey)
      ? { ...card, status: "방금", elapsedRatio: 0 }
      : card,
  );
  const baseRecentRecords = hasSetup ? recentRecords.filter((record) => enabledSpaceKeys.has(record.spaceKey)) : recentRecords;
  const visibleRecentRecords = [...sessionRecentRecords, ...baseRecentRecords].slice(0, 4);
  const visibleRecommendations = hasSetup ? recommendations.filter((item) => enabledSpaceKeys.has(item.spaceKey)) : recommendations;
  const heroTarget = [...visibleRecommendations].sort((a, b) => b.elapsedRatio - a.elapsedRatio)[0];
  const canvasHeight = Math.max(180, ...effectiveCanvasCards.map((card) => card.bottom)) + 8;
  const homeStatus = getHomeStatus(effectiveCanvasCards, completed.length + deepCleanRecent.length, heroTarget?.shortTitle);
  const toggleRecommendation = (id: string) => {
    if (completed.includes(id)) {
      setCompleted((current) => {
        const next = current.filter((item) => item !== id);
        window.sessionStorage.setItem("bbodeuk.session.homeCompleted.v1", JSON.stringify(next));
        return next;
      });
      setRecommendationFlash(null);
      return;
    }

    setCompleted((current) => {
      const next = [...current, id];
      window.sessionStorage.setItem("bbodeuk.session.homeCompleted.v1", JSON.stringify(next));
      return next;
    });
    setRecommendationFlash(id);
    window.setTimeout(() => setRecommendationFlash((current) => (current === id ? null : current)), 1200);
  };

  return (
    <div className="phone-shell min-h-[844px] bg-surface text-on-surface">
      <AppHeader home />
      <main className="flex min-h-[844px] flex-1 flex-col bg-surface pb-[88px] pt-16">
        <div className="flex w-full flex-col gap-space-xl px-margin-screen pb-space-2xl">
          <section className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-fixed/35 blur-2xl" />
            <div className="flex items-start justify-between">
              <div className="relative z-10 flex max-w-[78%] flex-col gap-space-xxs">
                <h1 className="text-headline-lg text-on-surface">{homeStatus.title}</h1>
                <p className="text-body-md text-on-surface-variant">{homeStatus.description}</p>
              </div>
              <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${homeStatus.tone} text-[24px] leading-none shadow-sm`} aria-hidden="true">
                <span className="translate-y-[1px] leading-none">{homeStatus.emoji}</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="check_circle" className="text-[18px] text-tertiary" />
              <span className="text-title-sm text-on-surface">최근 관리 흔적</span>
            </div>
            <div className="grid grid-cols-2 gap-space-xs">
              {visibleRecentRecords.map((record) => (
                <div key={record.title} className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm">
                  <div className="mb-space-xs flex items-center gap-space-xs">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${spaceTones[record.spaceKey].fill} ${spaceTones[record.spaceKey].text}`}>
                      <Icon name={record.icon} className="text-[18px]" />
                    </span>
                    <span className="min-w-0 truncate text-body-md font-semibold text-on-surface">{record.title}</span>
                  </div>
                  <p className="text-caption text-on-surface-variant">
                    {record.lastText} · {getCarePhrase(record.elapsedRatio)}
                  </p>
                </div>
              ))}
            </div>
            <Link className="self-center px-space-sm py-space-xs text-label-md text-primary transition-opacity active:opacity-70" to="/history">
              청소 기록 더보기
            </Link>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="bubble_chart" className="text-[18px] text-primary" />
              <span className="text-title-sm text-on-surface">청소 캔버스</span>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
              <p className="mb-space-sm text-caption text-on-surface-variant">각 공간을 누르면 기록 화면으로 이동해요.</p>
              <div className="relative mx-auto w-full max-w-[304px]" style={{ height: `${canvasHeight}px` }}>
                {effectiveCanvasCards.map((card) =>
                  card.line ? <span key={`${card.room}-line`} className={`absolute rounded-full bg-outline-variant/40 ${card.line}`} /> : null,
                )}
                {effectiveCanvasCards.map((card) => {
                  return (
                    <Link
                      key={card.room}
                      aria-label={`${card.room} 청소 상태 ${card.status}`}
                      className={`absolute flex flex-col justify-between rounded-xl border p-space-sm text-left transition-all active:scale-[0.98] ${card.layout} ${card.fill} ${card.border}`}
                      to={`/quick-record?filter=space&space=${card.spaceKey}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <Icon name={card.icon} className={`text-[18px] ${card.text}`} />
                      </div>
                      <div>
                        <span className="block text-label-md font-bold text-on-surface">{card.room}</span>
                        <span className="block text-caption text-on-surface-variant">{card.status}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="lightbulb" className="text-[18px] text-primary" />
              <span className="text-title-sm text-on-surface">여기 청소는 어때요?</span>
            </div>
            <div className="flex flex-col gap-space-sm">
              {visibleRecommendations.map((item) => {
                const isDone = completed.includes(item.id);
                const flashed = recommendationFlash === item.id;
                const tone = spaceTones[item.spaceKey];

                return (
                  <article
                    key={item.id}
                    className={`relative w-full overflow-hidden rounded-xl border p-space-md text-left shadow-sm transition-all duration-300 ${
                      isDone ? `${tone.fill} ${tone.border}` : "border-transparent bg-surface-container-lowest"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-space-sm">
                      <div className="flex min-w-0 items-center gap-space-sm">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isDone ? `bg-surface-container-lowest ${tone.text}` : "bg-surface-container text-on-surface-variant"}`}>
                          <Icon name={item.icon} className="text-[22px]" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className={`truncate text-title-sm ${isDone ? tone.text : "text-on-surface"}`}>{item.title}</span>
                          <span className="mt-0.5 text-caption text-on-surface-variant">{item.meta}</span>
                        </div>
                      </div>
                      <button
                        aria-label={`${item.title} 기록`}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 active:scale-95 ${
                          isDone ? `${tone.border} bg-surface-container-lowest ${tone.text}` : "border-outline-variant/50 bg-surface-container-low text-on-surface-variant"
                        }`}
                        type="button"
                        onClick={() => toggleRecommendation(item.id)}
                      >
                        <Icon name="check" className={`text-[20px] transition-transform duration-200 ${isDone ? "scale-100" : "scale-0"}`} />
                      </button>
                    </div>
                    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${tone.feedback} transition-opacity duration-500 ${flashed ? "opacity-100" : "opacity-0"}`}>
                      <span className={`rounded-full bg-surface-container-lowest px-3 py-1.5 text-label-md font-semibold ${tone.text} shadow-sm`}>
                        이제 깨끗해요!
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

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
