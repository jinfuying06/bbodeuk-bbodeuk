import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import ItemRow, { RowList } from "../components/ItemRow";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import WaterFill from "../components/WaterFill";
import Toast, { useRouteToast } from "../components/Toast";
import {
  formatRecency,
  getActiveSpaces,
  getItem,
  getItems,
  getSpace,
  isRecordedToday,
  itemStaleness,
  lastRecord,
  metaTextOnFill,
  spaceFade,
  waterBase,
  todaysRecords,
  useRecords,
  type CleaningRecord,
  type SpaceKey,
} from "../data/cleaning";

/** "오늘 가볍게 돌볼 곳" candidates (Figma 77:2262) — the 2 stalest ones not recorded today are shown. */
const LIGHT_CARE: Array<{ itemId: string; tip: string }> = [
  { itemId: "sink", tip: "물기부터 가볍게" },
  { itemId: "drain", tip: "거름망만 헹궈도 좋아요" },
  { itemId: "basin", tip: "수전 물때만 닦아도 좋아요" },
  { itemId: "living-floor", tip: "눈에 띄는 곳만 밀어도 좋아요" },
  { itemId: "bedding", tip: "베개 커버만 바꿔도 좋아요" },
];

/**
 * Fades the home cards last showed. Coming back after recording (QuickRecord, CareAction …),
 * cards first paint at the old fade and then transition up, so the color visibly rises.
 */
const lastShownFade: Partial<Record<SpaceKey, number>> = {};

/** Space card recency = its most recent item record. */
const cardRecency = (key: SpaceKey, records: CleaningRecord[]) => formatRecency(records.find((record) => getItem(record.itemId)?.space === key)?.at);

/** One row per item, newest first. */
const recentRows = (records: CleaningRecord[], spaces: Set<string>) => {
  const seen = new Set<string>();
  const rows: Array<{ id: string; space: SpaceKey; name: string; icon: string; hidden: boolean; at: string }> = [];
  for (const record of records) {
    const item = getItem(record.itemId);
    if (!item || seen.has(item.id) || !spaces.has(item.space)) continue;
    seen.add(item.id);
    rows.push({ id: item.id, space: item.space, name: item.name, icon: item.icon, hidden: Boolean(item.hiddenCare), at: record.at });
    if (rows.length === 2) break;
  }
  return rows;
};

export default function Home() {
  const allRecords = useRecords();
  const [toast] = useRouteToast();
  // `?state=empty` previews Figma 31:791 (첫 기록 전 홈) from 44/상태 미리보기 without touching real records.
  const [params] = useSearchParams();
  const records = params.get("state") === "empty" ? [] : allRecords;
  const spaces = getActiveSpaces();
  const spaceKeys = new Set<string>(spaces.map((space) => space.key));
  const hasRecords = records.some((record) => spaceKeys.has(getItem(record.itemId)?.space ?? ""));
  // Distinct spaces cared for today (not items): 세면대 + 변기 = 욕실 1곳.
  const todayCount = new Set(todaysRecords(records).map((record) => getItem(record.itemId)?.space).filter((space) => space && spaceKeys.has(space))).size;
  const items = getItems().filter((item) => spaceKeys.has(item.space));
  const anyOverdue = items.some((item) => itemStaleness(item, records) >= 1);

  // Status-driven intro (2026-10-15). No record CTA on Home: the second line points at the space cards
  // (each opens 기록 for that space) and the 기록 tab covers the rest.
  const allDoneToday = todayCount > 0 && todayCount >= spaces.length;
  const tapHint = "공간을 눌러 청소한 곳을 기록해요";
  // One-line headlines (2026-10-16 title rule).
  const [headline, message]: [string, string] = !hasRecords
    ? ["첫 기록을 남겨볼까요?", tapHint]
    : allDoneToday
      ? ["집 전체가 반짝여요", "모든 공간을 돌봤어요"]
      : todayCount > 0
        ? ["오늘도 산뜻해요", `오늘 ${todayCount}곳을 돌봤어요`]
        : anyOverdue
          ? ["한 곳부터 가볍게", tapHint]
          : ["오늘도 내 공간을 맑게", tapHint];

  const targetFade = Object.fromEntries(spaces.map((space) => [space.key, spaceFade(space.key, records)])) as Record<SpaceKey, number>;
  const fadeKey = JSON.stringify(targetFade);
  const [shownFade, setShownFade] = useState<Record<SpaceKey, number>>(() => ({ ...targetFade, ...lastShownFade }));
  useEffect(() => {
    Object.assign(lastShownFade, targetFade);
    const frame = requestAnimationFrame(() => setShownFade(targetFade));
    return () => cancelAnimationFrame(frame);
  }, [fadeKey]);

  const recent = recentRows(records, spaceKeys);
  const lightCare = LIGHT_CARE.flatMap(({ itemId, tip }) => {
    const item = getItem(itemId);
    return item && spaceKeys.has(item.space) && !isRecordedToday(item.id, records) ? [{ item, tip }] : [];
  })
    .sort((a, b) => itemStaleness(b.item, records) - itemStaleness(a.item, records))
    .slice(0, 2);

  return (
    <PageShell>
      <AppHeader brand title="뽀득뽀득" />
      <main className="flex flex-1 flex-col px-margin-screen pb-nav pt-header">
        <section className="flex shrink-0 flex-col gap-1 pb-5 pt-1">
          <h1 className="text-bb-heading text-sky-ink">{headline}</h1>
          <p className="text-bb-body text-sky-muted">{message}</p>
        </section>

        <section className="flex flex-col gap-3 pb-1 pt-1">
          <div className="flex h-7 items-center justify-between">
            <h2 className="text-bb-title text-sky-ink">내 공간</h2>
            <Link className="-mr-2 flex h-11 items-center px-2 text-bb-caption text-sky-muted" to="/space-manage">
              공간 관리<Icon name="chevron-right" className="ml-1 text-[12px]" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {spaces.map((space, index) => {
              const fade = shownFade[space.key] ?? targetFade[space.key];
              // Odd count (e.g. 베란다 added) → last card spans the row so no empty cell is left.
              const wide = spaces.length % 2 === 1 && index === spaces.length - 1;
              return (
                <Link
                  key={space.key}
                  className={`press relative flex h-[110px] flex-col justify-end gap-[3px] overflow-hidden rounded-2xl bg-sky-surface px-4 py-[14px] ${wide ? "col-span-2" : ""}`}
                  style={{ backgroundColor: waterBase(space.key, fade) }}
                  to={`/quick-record?filter=space&space=${space.key}`}
                >
                  <WaterFill direction="up" level={fade} color={space.color} phase={index} />
                  <span className="absolute right-4 top-[14px]" style={{ color: space.iconColor }}>
                    <Icon name={space.icon} className="block text-[43.2px]" />
                  </span>
                  <span className="relative text-bb-label font-bold text-sky-ink">{space.label}</span>
                  <span className={`relative text-bb-caption ${metaTextOnFill(space.key)}`}>{cardRecency(space.key, records)}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {hasRecords ? (
          <div className="pb-6 pt-2">
            <GlassButton variant="secondary" size={52} className="w-full" to="/history">
              기록 모아보기
            </GlassButton>
          </div>
        ) : (
          <div className="pb-4" />
        )}

        <section className={`flex flex-col pt-2 ${hasRecords ? "gap-1.5" : "gap-3"}`}>
          <div className="flex h-7 items-center justify-between">
            <h2 className="text-bb-title text-sky-ink">최근 돌본 흔적</h2>
            <Link className="-mr-2 flex h-11 items-center px-2 text-bb-caption text-sky-muted" to="/history">
              전체 보기<Icon name="chevron-right" className="ml-1 text-[12px]" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <Link className="press flex min-h-[120px] flex-col gap-2 rounded-2xl bg-sky-surface p-[18px]" to="/quick-record">
              <span className="text-bb-title text-sky-ink">아직 남긴 청소 기록이 없어요</span>
              <span className="text-bb-label-sm font-normal text-sky-muted">공간 카드를 보며 첫 청소를 가볍게 시작해보세요.</span>
              <span className="flex items-center text-bb-label-sm font-bold text-sky-deep">
                첫 청소 기록하기
                <Icon name="chevron-right" className="ml-1.5 text-[14px]" />
              </span>
            </Link>
          ) : (
            <RowList>
              {recent.map((row) => (
                <ItemRow key={row.id} list hidden={row.hidden} icon={row.icon} meta={formatRecency(row.at)} space={row.space} sub={getSpace(row.space).label} title={row.name} />
              ))}
            </RowList>
          )}
        </section>

        <section className="flex flex-col gap-3 pt-6">
          <h2 className="flex h-7 items-center text-bb-title text-sky-ink">이런 곳은 어때요?</h2>
          <RowList>
            {lightCare.map(({ item, tip }) => (
              <ItemRow
                key={item.id}
                list
                chevron="muted"
                hidden={Boolean(item.hiddenCare)}
                icon={item.icon}
                meta={formatRecency(lastRecord(item.id, records)?.at)}
                space={item.space}
                sub={`${getSpace(item.space).label} · ${tip}`}
                title={item.name}
                to={`/quick-record?filter=space&space=${item.space}`}
              />
            ))}
          </RowList>
          <GlassButton size={52} variant="secondary" className="w-full" to="/deep-clean">
            여유 있는 날, 대청소 둘러보기
          </GlassButton>
        </section>
      </main>
      <Toast message={toast} visible={Boolean(toast)} />
    </PageShell>
  );
}
