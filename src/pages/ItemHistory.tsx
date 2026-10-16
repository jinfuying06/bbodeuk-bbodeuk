import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import ItemRow, { RowList } from "../components/ItemRow";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import { formatDay, formatRecency, formatTime, getItem, getSpace, recordsForItem, useRecords } from "../data/cleaning";

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

  // 2026-10-17: same calm structure as 가이드 상세 / 히스토리 — no tinted card, one stats strip, list rows.
  const stats: Array<[string, string]> = [
    ["이번 달", `${monthCount}회`],
    ["전체", `${itemRecords.length}회`],
    ["관리 주기", `${item.intervalDays}일`],
  ];

  return (
    <PageShell>
      <AppHeader title="히스토리" back="/history?view=space" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title={item.fullName} body={`${space.label} · ${latest ? `마지막 청소 ${formatRecency(latest.at)}` : "아직 기록 없음"}`} />

        <dl className="grid grid-cols-3 divide-x divide-sky-line rounded-2xl border border-sky-line py-3">
          {stats.map(([label, value]) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <dt className="text-bb-caption text-sky-muted">{label}</dt>
              <dd className="text-bb-title text-sky-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="pt-3 text-bb-label text-sky-ink">돌본 날</h2>
        {itemRecords.length > 0 ? (
          <RowList>
            {itemRecords.map((record) => (
              <ItemRow key={record.id} list icon={item.icon} meta={formatTime(record.at)} space={item.space} sub={formatRecency(record.at)} title={formatDay(record.at)} />
            ))}
          </RowList>
        ) : (
          <p className="py-6 text-center text-bb-body text-sky-muted">아직 남긴 기록이 없어요.</p>
        )}
      </main>
    </PageShell>
  );
}
