import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { daysAgo, formatDay, formatTime, getItem, getSpace, recordsForItem, spaceColor, useRecords } from "../data/cleaning";
import { spaceIconClass } from "./QuickRecord";

/** 을/를 by the last syllable's final consonant (거실 바닥을, 세면대를). */
export const objectParticle = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? "을" : "를";
};

const relativeDay = (at: string) => {
  const days = daysAgo(at);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  return formatDay(at).replace(/ \S+요일$/, "");
};

/** Figma 개선 / 거실 바닥 기록 (76:2151) · 싱크대 기록 (76:2250) — per-item history. */
export default function ItemHistory() {
  const [searchParams] = useSearchParams();
  const records = useRecords();
  // ?item= takes an item id (legacy full names still resolve). Unknown → 세면대.
  const item = getItem(searchParams.get("item")) ?? getItem("basin")!;
  const space = getSpace(item.space);
  const itemRecords = recordsForItem(item.id, records);
  const latest = itemRecords[0];
  const now = new Date();
  const monthCount = itemRecords.filter((record) => {
    const at = new Date(record.at);
    return at.getFullYear() === now.getFullYear() && at.getMonth() === now.getMonth();
  }).length;

  return (
    <PageShell>
      <AppHeader title={`${item.fullName} 기록`} back="/history" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <section className="flex min-h-[88px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">
            {item.fullName}
            {objectParticle(item.fullName)} 돌본 날들
          </h1>
          <p className="text-bb-body text-sky-muted">
            {space.label} · {latest ? `최근 기록 ${relativeDay(latest.at)} ${formatTime(latest.at)}` : "아직 기록 없음"}
          </p>
        </section>

        <section className="flex flex-col gap-2 rounded-3xl bg-sky-tint px-5 pb-4 pt-4">
          <h2 className="text-bb-title text-sky-ink">이번 달 {monthCount}번의 작은 돌봄</h2>
          <p className="text-bb-body text-sky-muted">
            빈 날도 괜찮아요.
            <br />
            남긴 기록을 가볍게 돌아봐요.
          </p>
        </section>

        {itemRecords.length > 0 ? (
          <ol className="flex flex-col gap-3">
            {itemRecords.map((record) => (
              <li key={record.id} className="flex h-[72px] items-center gap-3 rounded-[18px] bg-sky-white px-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: spaceColor(item.space) }}>
                  <Icon name={space.icon} className={`text-[24px] ${spaceIconClass[item.space]}`} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-bb-label text-sky-ink">{formatDay(record.at)}</span>
                  <span className="text-bb-caption text-sky-muted">{formatTime(record.at)} · 청소 기록</span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-6 text-center text-bb-body text-sky-muted">아직 남긴 기록이 없어요.</p>
        )}
      </main>
    </PageShell>
  );
}
