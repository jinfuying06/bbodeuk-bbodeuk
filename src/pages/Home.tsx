import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import ItemRow from "../components/ItemRow";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Toast, { useRouteToast } from "../components/Toast";
import {
  formatRecency,
  getActiveSpaces,
  getItem,
  getItems,
  isRecordedToday,
  itemStaleness,
  lastRecord,
  spaceColor,
  spaceFade,
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

/** Figma v2 card copy: "방금 돌봤어요" instead of the generic "방금 기록했어요". */
const cardRecency = (key: SpaceKey, records: CleaningRecord[]) => {
  const last = records.find((record) => getItem(record.itemId)?.space === key);
  const text = formatRecency(last?.at);
  return text === "방금 기록했어요" ? "방금 돌봤어요" : text;
};

/** One row per item, newest first. */
const recentRows = (records: CleaningRecord[], spaces: Set<string>) => {
  const seen = new Set<string>();
  const rows: Array<{ id: string; space: SpaceKey; name: string; at: string }> = [];
  for (const record of records) {
    const item = getItem(record.itemId);
    if (!item || seen.has(item.id) || !spaces.has(item.space)) continue;
    seen.add(item.id);
    rows.push({ id: item.id, space: item.space, name: item.name, at: record.at });
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

  // Headline variants: 31:1630 기록 직후 · 31:1495 가벼운 추천 · 29:136 / 31:791 default.
  const headline = todayCount > 0 ? ["오늘도,", "내 공간이 산뜻해요"] : hasRecords && anyOverdue ? ["오늘 눈에 들어온", "한 곳부터"] : ["오늘도,", "내 공간을 맑게."];
  const message = !hasRecords
    ? "아직 기록은 없지만, 내 공간은 여기에서 시작해요."
    : todayCount > 0
      ? `오늘 ${todayCount}곳을 돌봤어요`
      : "오늘은 아직 돌본 곳이 없어요";

  const recent = recentRows(records, spaceKeys);
  const lightCare = LIGHT_CARE.flatMap(({ itemId, tip }) => {
    const item = getItem(itemId);
    return item && spaceKeys.has(item.space) && !isRecordedToday(item.id, records) ? [{ item, tip }] : [];
  })
    .sort((a, b) => itemStaleness(b.item, records) - itemStaleness(a.item, records))
    .slice(0, 2);

  return (
    <PageShell>
      <AppHeader title="뽀득뽀득" />
      <main className="flex flex-1 flex-col px-margin-screen pb-nav pt-header">
        <section className="flex h-[110px] shrink-0 flex-col gap-1 pt-1">
          <h1 className="text-bb-heading text-sky-ink">
            {headline[0]}
            <br />
            {headline[1]}
          </h1>
          <p className="text-bb-body text-sky-muted">{message}</p>
        </section>

        <section className="flex flex-col gap-3 pb-1 pt-1">
          <div className="flex h-7 items-center justify-between">
            <h2 className="text-bb-title text-sky-ink">내 공간</h2>
            <Link className="-mr-2 flex h-11 items-center px-2 text-bb-caption text-sky-muted" to="/space-manage">
              공간 관리&nbsp;&nbsp;›
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {spaces.map((space, index) => {
              const fill = spaceColor(space.key, spaceFade(space.key, records));
              // Odd count (e.g. 베란다 added) → last card spans the row so no empty cell is left.
              const wide = spaces.length % 2 === 1 && index === spaces.length - 1;
              return (
                <Link
                  key={space.key}
                  className={`press relative flex h-[110px] flex-col justify-end gap-[3px] overflow-hidden rounded-2xl bg-sky-white px-4 py-[14px] ${wide ? "col-span-2" : ""}`}
                  style={{ backgroundImage: `linear-gradient(${fill}, ${fill})` }}
                  to={`/quick-record?filter=space&space=${space.key}`}
                >
                  <span className="absolute right-4 top-[14px]" style={{ color: space.iconColor }}>
                    <Icon name={space.icon} className="block text-[43.2px]" />
                  </span>
                  <span className="text-bb-label font-bold text-sky-ink">{space.label}</span>
                  <span className="text-bb-caption text-sky-muted">{cardRecency(space.key, records)}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="pb-4 pt-2">
          <GlassButton to="/quick-record">청소 기록하기&nbsp;&nbsp;&nbsp;+</GlassButton>
        </div>
        {hasRecords ? (
          <div className="pb-6">
            <GlassButton variant="secondary" size={52} className="w-full" to="/history">
              기록 모아보기
            </GlassButton>
          </div>
        ) : null}

        <section className={`flex flex-col pt-2 ${hasRecords ? "gap-1.5" : "gap-3"}`}>
          <div className="flex h-7 items-center justify-between">
            <h2 className="text-bb-title text-sky-ink">최근 돌본 흔적</h2>
            <Link className="-mr-2 flex h-11 items-center px-2 text-bb-caption text-sky-muted" to="/history">
              전체 보기&nbsp;&nbsp;›
            </Link>
          </div>
          {recent.length === 0 ? (
            <Link className="press flex min-h-[120px] flex-col gap-2 rounded-2xl bg-sky-white p-[18px]" to="/quick-record">
              <span className="text-bb-title text-sky-ink">아직 남긴 청소 기록이 없어요</span>
              <span className="text-bb-label-sm font-normal text-sky-muted">공간 카드를 보며 첫 청소를 가볍게 시작해보세요.</span>
              <span className="text-bb-label-sm font-bold text-sky-deep">첫 청소 기록하기&nbsp;&nbsp;→</span>
            </Link>
          ) : (
            recent.map((row) => (
              <ItemRow key={row.id} chevron="muted" space={row.space} sub={formatRecency(row.at)} title={row.name} to={`/item-history?item=${row.id}`} />
            ))
          )}
        </section>

        <section className="flex flex-col gap-3 pt-6">
          <div>
            <h2 className="text-bb-title text-sky-ink">오늘 가볍게 돌볼 곳</h2>
            <p className="text-bb-caption text-sky-muted">눈에 들어오는 한 곳만 골라도 괜찮아요.</p>
          </div>
          {lightCare.map(({ item, tip }) => (
            <ItemRow
              key={item.id}
              space={item.space}
              sub={`${item.hiddenCare ? "숨은 관리" : formatRecency(lastRecord(item.id, records)?.at)} · ${tip}`}
              title={item.name}
              to={`/quick-record?filter=space&space=${item.space}`}
            />
          ))}
          <GlassButton size={52} className="w-full" to="/deep-clean">
            여유 있는 날, 대청소 둘러보기
          </GlassButton>
        </section>
      </main>
      <Toast message={toast} visible={Boolean(toast)} />
    </PageShell>
  );
}
