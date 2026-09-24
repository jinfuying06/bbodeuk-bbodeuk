import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { formatDay, formatTime, getItem, getSpace, isSpaceKey, isToday, spaceColor, spaceFade, useRecords, type SpaceKey } from "../data/cleaning";

// No Figma frame for this screen — styled after 07/내 공간 + 17/공간 관리 (Sky/BB rows, space-color tiles).
const DETAILS: Record<SpaceKey, { cycle: string; detail: string }> = {
  bathroom: { cycle: "1주", detail: "세면대와 배수구처럼 물기가 남는 항목은 1주 안팎으로 확인하면 좋아요." },
  kitchen: { cycle: "3~7일", detail: "싱크대 거름망과 후드 필터는 조리 후 흔적이 남기 쉬워 먼저 확인해보면 좋아요." },
  living: { cycle: "1~2주", detail: "바닥과 손잡이처럼 자주 닿는 곳은 최근 기록을 기준으로 다시 확인하면 좋아요." },
  bedroom: { cycle: "1~2주", detail: "침구와 베개 커버 기록이 이어지고 있어요. 바닥 모서리만 가끔 함께 보면 좋아요." },
  terrace: { cycle: "2~3주", detail: "바닥과 난간은 먼지가 쌓이기 쉬워 2~3주마다 가볍게 확인하면 좋아요." },
};

/** Same thresholds as the recency-fade stops (100/72/48/28). */
const statusFor = (fade: number) => (fade === 0 ? "아직 기록 없음" : fade >= 0.72 ? "관리 중" : fade >= 0.48 ? "슬슬 확인" : "확인 필요");

export default function SpaceInfo() {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get("space");
  const key: SpaceKey = isSpaceKey(requested) ? requested : "bathroom";
  const space = getSpace(key);
  const records = useRecords();
  const fade = spaceFade(key, records);
  const recent = records
    .map((record) => ({ record, item: getItem(record.itemId) }))
    .filter(({ item }) => item?.space === key)
    .slice(0, 3);

  return (
    <PageShell>
      <AppHeader title="공간 정보" back="/spaces" />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        <section className="flex flex-col items-center gap-2 rounded-3xl bg-sky-white px-5 py-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: space.color, color: space.iconColor }}>
            <Icon name={space.icon} className="text-[40px]" />
          </span>
          <div className="flex items-center gap-2">
            <h1 className="text-bb-heading text-sky-ink">{space.label}</h1>
            <span className="rounded-full px-2.5 py-0.5 text-bb-caption text-sky-deep" style={{ backgroundColor: space.color }}>
              {DETAILS[key].cycle}
            </span>
          </div>
          <p className="text-bb-body text-sky-muted">{DETAILS[key].detail}</p>
        </section>

        <section className="flex h-[72px] items-center justify-between gap-3 rounded-row bg-sky-white px-4" style={{ backgroundImage: `linear-gradient(${spaceColor(key, fade)}, ${spaceColor(key, fade)})` }}>
          <span className="flex flex-col">
            <span className="text-bb-label text-sky-ink">내 관리 상태</span>
            <span className="text-bb-caption text-sky-muted">주기 기준으로 공간의 관리 흐름을 보여줘요.</span>
          </span>
          <span className="shrink-0 rounded-full bg-sky-white px-3 py-1 text-bb-caption font-bold text-sky-deep">{statusFor(fade)}</span>
        </section>

        <section className="flex flex-col gap-2 rounded-row border bg-sky-white p-3" style={{ borderColor: space.color }}>
          <div className="flex h-7 items-center justify-between px-1">
            <h2 className="text-bb-label font-bold text-sky-ink">최근 청소 기록</h2>
            <Link className="-mr-1 flex h-11 items-center px-1 text-bb-caption text-sky-muted" to="/history">
              히스토리 보기&nbsp;&nbsp;›
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-1 pb-2 text-bb-caption text-sky-muted">아직 이 공간의 기록이 없어요.</p>
          ) : (
            recent.map(({ record, item }) => (
              <Link key={record.id} className="press flex h-11 items-center justify-between rounded-xl bg-sky-bg px-[10px]" to={`/item-history?item=${item?.id}`}>
                <span className="truncate text-bb-label text-sky-ink">{item?.name}</span>
                <span className="shrink-0 pl-2 text-bb-caption text-sky-muted">{isToday(record.at) ? `오늘 ${formatTime(record.at)}` : formatDay(record.at)}</span>
              </Link>
            ))
          )}
        </section>

        <GlassButton className="w-full" to={`/quick-record?filter=space&space=${key}`}>
          {space.label} 기록하기
        </GlassButton>
        <Link className="text-link" to={`/item-add?space=${key}`}>
          ＋ 새 청소 항목
        </Link>
      </main>
    </PageShell>
  );
}
