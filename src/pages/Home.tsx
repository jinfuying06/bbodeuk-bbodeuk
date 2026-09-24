import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { formatRecency, getActiveSpaces, getItem, isRecordedToday, spaceFade, todaysRecords, useRecords, type CleaningRecord } from "../data/cleaning";
import { getSpaceTone } from "../data/spaceTones";

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
    id: "drain",
    spaceKey: "bathroom",
    title: "배수구",
    meta: "숨은 관리 · 거름망만 헹궈도 좋아요",
    elapsedRatio: 0.95,
    icon: "object-drain",
  },
];

const spaceIcons: Record<string, string> = {
  bathroom: "space-bath",
  kitchen: "space-kitchen",
  living: "space-living",
  bedroom: "space-bed",
  entry: "door_front",
  terrace: "space-terrace",
};

type CanvasCard = {
  spaceKey: string;
  room: string;
  /** Recency fade 0…1 from src/data/cleaning (avg of per-item policy fades). */
  fade: number;
  layout: string;
};

const canvasLayouts: Record<string, string> = {
  bathroom: "h-[88px]",
  kitchen: "h-[96px]",
  bedroom: "h-[110px]",
  living: "h-[120px] flex-1",
  terrace: "h-[70px]",
};

/** The 5 most recently cared-for items (one row per item). */
const getRecentRecords = (records: CleaningRecord[]) => {
  const rows: Array<{ id: string; spaceKey: string; title: string; lastText: string }> = [];
  for (const record of records) {
    const item = getItem(record.itemId);
    if (!item || rows.some((row) => row.id === item.id)) continue;
    rows.push({ id: item.id, spaceKey: item.space, title: item.name, lastText: formatRecency(record.at) });
    if (rows.length === 5) break;
  }
  return rows;
};

const getCanvasTone = (spaceKey: string, fade: number) => {
  const [r, g, b] = getSpaceTone(spaceKey).rgb;
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${fade})`,
    borderColor: `rgba(${r}, ${g}, ${b}, ${Math.min(fade + 0.12, 0.95)})`,
  };
};

const getSpaceStatusLabel = (fade: number) => {
  if (fade <= 0.28) return "확인 필요";
  if (fade <= 0.48) return "슬슬 확인";
  return "관리 중";
};

const getCanvasColumns = (cards: CanvasCard[]) => ({
  left: cards.filter((card) => ["bathroom", "bedroom", "terrace"].includes(card.spaceKey)),
  right: cards.filter((card) => ["kitchen", "living"].includes(card.spaceKey)),
});

const getHomeStatus = (cards: CanvasCard[], sessionRecordCount: number, target?: (typeof recommendations)[number]) => {
  const hasManagedItems = cards.length > 0;
  const mostStaleSpace = [...cards].sort((a, b) => a.fade - b.fade)[0];

  if (!hasManagedItems) {
    return {
      icon: "info",
      title: "최근 기록이 없는 곳이 있어요",
      description: "청소를 기록하면 공간 상태가 조금씩 채워져요.",
      tone: "bg-sky-line",
    };
  }

  if (sessionRecordCount >= 2) {
    return {
      icon: "check_circle",
      title: `오늘 ${sessionRecordCount}곳을 관리했어요`,
      description: mostStaleSpace ? `${mostStaleSpace.room} 상태도 함께 확인해보세요.` : "방금 관리한 공간이 캔버스에 반영됐어요.",
      tone: "bg-sky-tint",
    };
  }

  if (target) {
    return {
      icon: "manage_search",
      title: `${target.title} 청소는 어때요?`,
      description: target.meta,
      tone: "bg-sky-brand/25",
    };
  }

  return {
    icon: "check_circle",
    title: "최근 자주 관리한 곳이에요",
    description: "공간 상태가 전반적으로 안정적으로 유지되고 있어요.",
    tone: "bg-sky-tint",
  };
};

export default function Home() {
  const records = useRecords();
  const activeSpaces = getActiveSpaces();
  const enabledSpaceKeys = new Set<string>(activeSpaces.map((space) => space.key));
  const effectiveCanvasCards: CanvasCard[] = activeSpaces.map((space) => ({
    spaceKey: space.key,
    room: space.label,
    fade: spaceFade(space.key, records),
    layout: canvasLayouts[space.key] ?? "h-[70px]",
  }));
  const allRecentRecords = getRecentRecords(records).filter((record) => enabledSpaceKeys.has(record.spaceKey));
  const maxRecentRecords = 4;
  const visibleRecentRecords = allRecentRecords.slice(0, maxRecentRecords);
  const visibleRecommendations = recommendations.filter((item) => enabledSpaceKeys.has(item.spaceKey));
  const activeRecommendations = visibleRecommendations.filter((item) => !isRecordedToday(item.id, records));
  const heroTarget = [...activeRecommendations].sort((a, b) => b.elapsedRatio - a.elapsedRatio)[0];
  const homeStatus = getHomeStatus(effectiveCanvasCards, todaysRecords(records).length, heroTarget);
  const canvasColumns = getCanvasColumns(effectiveCanvasCards);

  return (
    <PageShell>
      <AppHeader title="뽀득뽀득" />
      <main className="flex flex-1 flex-col bg-sky-bg pb-[88px] pt-header">
        <div className="flex w-full flex-col gap-space-xl px-margin-screen pb-space-2xl">
          <Link className="relative block w-full overflow-hidden rounded-xl bg-sky-white p-space-lg shadow-sm transition-transform active:scale-[0.99]" to={`/quick-record?filter=space&space=${heroTarget?.spaceKey ?? effectiveCanvasCards[0]?.spaceKey ?? "bathroom"}`}>
            <div className="flex items-start justify-between">
              <div className="relative z-10 flex max-w-[78%] flex-col gap-space-xxs">
                <h1 className="text-headline-lg text-sky-ink">{homeStatus.title}</h1>
                <p className="text-body-md text-sky-muted">{homeStatus.description}</p>
              </div>
              <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${homeStatus.tone} shadow-sm`} aria-hidden="true">
                <Icon name={homeStatus.icon} className="text-[24px] text-sky-deep" />
              </div>
            </div>
          </Link>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="bubble_chart" className="text-[18px] text-sky-deep" />
              <span className="text-title-sm text-sky-ink">청소 캔버스</span>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-sky-white p-space-md shadow-sm">
              <p className="mb-space-sm text-caption text-sky-muted">각 공간을 누르면 공간별 기록으로 이동해요.</p>
              <div className="flex h-[304px] gap-1.5 rounded-lg bg-sky-bg p-1.5">
                {[canvasColumns.left, canvasColumns.right].map((column, index) => (
                  <div key={index === 0 ? "left" : "right"} className={`${index === 0 ? "w-[43%]" : "flex-1"} flex min-w-0 flex-col gap-1.5`}>
                    {column.map((card) => {
                      const tone = getSpaceTone(card.spaceKey);
                      const style = getCanvasTone(card.spaceKey, card.fade);

                      return (
                        <Link
                          key={card.room}
                          aria-label={`${card.room} 관리 상태 ${getSpaceStatusLabel(card.fade)}`}
                          className={`flex min-h-[52px] items-center justify-center gap-1.5 rounded-lg border px-2 py-space-xs text-center transition-transform active:scale-[0.98] ${card.layout}`}
                          style={style}
                          to={`/quick-record?filter=space&space=${card.spaceKey}`}
                        >
                          <Icon name={spaceIcons[card.spaceKey]} className={`shrink-0 text-[17px] ${tone.text}`} />
                          <span className="block max-w-full truncate text-label-md font-bold text-sky-ink">{card.room}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <Link className="flex min-h-11 items-center justify-center gap-space-xs rounded-xl border border-dashed border-art-line bg-sky-white px-space-md text-label-md text-sky-deep" to="/space-manage">
              <Icon name="add" className="text-[20px]" />
              공간을 추가하고 싶나요?
            </Link>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="check_circle" className="text-[18px] text-sky-deep" />
              <span className="text-title-sm text-sky-ink">최근 관리 흔적</span>
            </div>
            {visibleRecentRecords.length <= 1 ? (
              <div className="rounded-xl bg-sky-white p-space-lg shadow-sm">
                <p className="text-title-sm text-sky-ink">아직 최근 청소 기록이 많지 않아요.</p>
                <p className="mt-1 text-body-md text-sky-muted">작은 청소부터 하나씩 기록해보세요.</p>
                <Link
                  className="mt-space-md inline-flex min-h-11 items-center rounded-lg bg-sky-brand px-space-md text-label-md font-semibold text-onbrand transition-transform duration-[120ms] active:scale-[0.98]"
                  to="/quick-record"
                >
                  청소 기록하기
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-space-xs">
                  {visibleRecentRecords.map((record) => (
                    <Link key={`${record.spaceKey}-${record.title}-${record.lastText}`} className="block rounded-xl bg-sky-white p-space-sm shadow-sm transition-transform active:scale-[0.99]" to={`/item-history?item=${record.id}`}>
                      <div className="mb-space-xs flex items-center gap-space-xs">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getSpaceTone(record.spaceKey).fill} ${getSpaceTone(record.spaceKey).text}`}>
                          <Icon name={spaceIcons[record.spaceKey]} className="text-[18px]" />
                        </span>
                        <span className="min-w-0 truncate text-body-md font-semibold text-sky-ink">{record.title}</span>
                      </div>
                      <p className="text-caption text-sky-muted">최근 관리 {record.lastText}</p>
                    </Link>
                  ))}
                  {visibleRecentRecords.length > 1 && visibleRecentRecords.length < maxRecentRecords ? (
                    <Link className="flex min-h-[92px] flex-col justify-between rounded-xl bg-sky-white p-space-sm shadow-sm transition-transform active:scale-[0.99]" to="/care">
                      <span className="text-body-md font-semibold text-sky-ink">다음에 관리할 곳을 찾아보세요</span>
                      <span className="text-caption font-semibold text-sky-deep">청소가이드 보기</span>
                    </Link>
                  ) : null}
                </div>
                {allRecentRecords.length > maxRecentRecords ? (
                  <Link className="self-center px-space-sm py-space-xs text-label-md text-sky-deep transition-opacity active:opacity-70" to="/history">
                    청소 기록 더보기
                  </Link>
                ) : null}
              </>
            )}
          </section>

          {activeRecommendations.length > 0 ? (
            <section className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-1.5">
                <Icon name="lightbulb" className="text-[18px] text-sky-deep" />
                <span className="text-title-sm text-sky-ink">여기 청소는 어때요?</span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {activeRecommendations.map((item) => {
                  const tone = getSpaceTone(item.spaceKey);

                  return (
                    <Link
                      key={item.id}
                      className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-sky-white p-space-md text-left shadow-sm transition-transform active:scale-[0.99]"
                      to={`/quick-record?filter=space&space=${item.spaceKey}`}
                    >
                      <div className="flex items-center justify-between gap-space-sm">
                        <div className="flex min-w-0 items-center gap-space-sm">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
                            <Icon name={spaceIcons[item.spaceKey]} className="text-[22px]" />
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-title-sm text-sky-ink">{item.title}</span>
                            <span className="mt-0.5 text-caption text-sky-muted">{item.meta}</span>
                          </div>
                        </div>
                        <Icon name="chevron_right" className="ml-space-sm shrink-0 text-[20px] text-sky-muted" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          <Link
            className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-sky-white p-space-md shadow-sm transition-transform active:scale-[0.99]"
            to="/deep-clean"
          >
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-tint text-sky-deep">
                <Icon name="cleaning_services" className="text-[20px]" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-title-sm text-sky-ink">대청소 어떠세요?</span>
                <span className="truncate text-caption text-sky-muted">오래 안 한 곳과 숨은 관리까지 훑어봐요.</span>
              </div>
            </div>
            <Icon name="chevron_right" className="ml-2 shrink-0 text-[20px] text-sky-muted" />
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
