import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

type CleaningRecord = {
  id: string;
  item: string;
  space: string;
  date: string;
  time: string;
};

type HistoryView = "daily" | "monthly";

const records: CleaningRecord[] = [
  { id: "r1", item: "세면대 수전 및 볼", space: "욕실", date: "2026-09-04", time: "오후 08:30" },
  { id: "r9", item: "세면대 수전 및 볼", space: "욕실", date: "2026-08-29", time: "오후 08:10" },
  { id: "r10", item: "세면대 수전 및 볼", space: "욕실", date: "2026-08-18", time: "오후 07:50" },
  { id: "r2", item: "싱크대 거름망", space: "주방", date: "2026-09-04", time: "오후 07:15" },
  { id: "r5", item: "싱크대 거름망", space: "주방", date: "2026-08-30", time: "오후 08:40" },
  { id: "r11", item: "싱크대 거름망", space: "주방", date: "2026-08-22", time: "오후 07:20" },
  { id: "r3", item: "침실 침구", space: "침실", date: "2026-09-02", time: "오전 10:20" },
  { id: "r4", item: "인덕션 상판 및 조리대", space: "주방", date: "2026-09-01", time: "오후 09:10" },
  { id: "r6", item: "거실 바닥", space: "거실", date: "2026-08-24", time: "오후 06:30" },
  { id: "r7", item: "공기청정기 프리필터", space: "거실", date: "2026-08-20", time: "오전 11:00" },
  { id: "r8", item: "양변기 안팎", space: "욕실", date: "2026-08-18", time: "오후 09:25" },
];

const spaceIcons: Record<string, string> = {
  욕실: "bathtub",
  주방: "countertops",
  침실: "bed",
  거실: "chair",
};

const spaceTones: Record<string, { fill: string; text: string; border: string }> = {
  욕실: { fill: "bg-[#EAF4FF]", text: "text-primary", border: "border-[#B8DCFF]" },
  주방: { fill: "bg-[#FFF1E7]", text: "text-[#8A4C00]", border: "border-[#FFD6B8]" },
  침실: { fill: "bg-[#EFF8F5]", text: "text-tertiary", border: "border-[#C9E8DE]" },
  거실: { fill: "bg-[#FFECEF]", text: "text-[#9A4251]", border: "border-[#F9C9D2]" },
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

const formatDate = (dateText: string) => dateFormatter.format(new Date(`${dateText}T00:00:00`)).replace(/\s/g, " ");

const today = new Date("2026-09-04T00:00:00");

const getStartOfWeek = (date: Date) => {
  const next = new Date(date);
  const day = next.getDay() || 7;
  next.setDate(next.getDate() - day + 1);
  next.setHours(0, 0, 0, 0);
  return next;
};

const isSameMonth = (date: Date, target: Date) => date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth();

const isSameYear = (date: Date, target: Date) => date.getFullYear() === target.getFullYear();

const makeMonthCells = (target: Date) => {
  const firstDay = new Date(target.getFullYear(), target.getMonth(), 1);
  const startOffset = firstDay.getDay();
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export default function ItemHistory() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<HistoryView>("daily");
  const selectedItem = searchParams.get("item") ?? "세면대 수전 및 볼";
  const itemRecords = records.filter((record) => record.item === selectedItem).sort((a, b) => (a.date < b.date ? 1 : -1));
  const fallbackRecord = records.find((record) => record.item === selectedItem) ?? records[0];
  const tone = spaceTones[fallbackRecord.space] ?? { fill: "bg-surface-container-low", text: "text-on-surface-variant", border: "border-outline-variant" };
  const latestRecord = itemRecords[0];
  const currentWeekStart = getStartOfWeek(today);
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
  const thisWeekCount = itemRecords.filter((record) => {
    const recordDate = new Date(`${record.date}T00:00:00`);
    return recordDate >= currentWeekStart && recordDate <= currentWeekEnd;
  }).length;
  const thisMonthCount = itemRecords.filter((record) => isSameMonth(new Date(`${record.date}T00:00:00`), today)).length;
  const thisYearCount = itemRecords.filter((record) => isSameYear(new Date(`${record.date}T00:00:00`), today)).length;
  const [selectedMonth, setSelectedMonth] = useState(() => (latestRecord ? new Date(`${latestRecord.date}T00:00:00`) : today));
  const monthCells = useMemo(() => makeMonthCells(selectedMonth), [selectedMonth]);
  const selectedMonthCount = itemRecords.filter((record) => isSameMonth(new Date(`${record.date}T00:00:00`), selectedMonth)).length;
  const recordsByDate = useMemo(
    () =>
      itemRecords.reduce<Record<string, CleaningRecord[]>>((acc, record) => {
        acc[record.date] = [...(acc[record.date] ?? []), record];
        return acc;
      }, {}),
    [itemRecords],
  );
  const shiftMonth = (amount: number) => setSelectedMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));

  return (
    <PageShell>
      <AppHeader title="상세 히스토리" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-lg text-center shadow-sm">
          <span className={`mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
            <Icon name={spaceIcons[fallbackRecord.space] ?? "task_alt"} className="text-[32px]" />
          </span>
          <h1 className="text-headline-lg">{selectedItem}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {latestRecord ? `최근 청소 ${formatDate(latestRecord.date)} · ${latestRecord.time}` : "아직 청소 기록이 없어요."}
          </p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">기록 요약</h2>
          <div className="mt-space-sm grid grid-cols-4 gap-space-xs">
            {[
              ["이번주", thisWeekCount],
              ["이번달", thisMonthCount],
              ["올해", thisYearCount],
              ["총", itemRecords.length],
            ].map(([label, count]) => (
              <div key={label} className="rounded-lg bg-surface-container-low p-space-xs text-center">
                <p className="text-caption text-on-surface-variant">{label}</p>
                <p className={`mt-1 text-title-sm ${tone.text}`}>{count}회</p>
              </div>
            ))}
          </div>
        </section>

        {itemRecords.length > 0 ? (
          <section className="flex flex-col gap-space-sm">
            <div className="flex w-full items-center gap-space-xs rounded-full bg-surface-container p-space-xxs">
              {[
                ["daily", "일별"],
                ["monthly", "월별"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`flex min-h-10 flex-1 items-center justify-center rounded-full text-label-md transition-all ${
                    view === key ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                  type="button"
                  onClick={() => setView(key as HistoryView)}
                >
                  {label}
                </button>
              ))}
            </div>

            {view === "daily" ? (
              <div className="flex flex-col gap-space-xs">
                {itemRecords.map((record) => (
                  <article key={record.id} className={`rounded-xl border bg-surface-container-lowest p-space-md shadow-sm ${tone.border}`}>
                    <h2 className="text-title-sm">{formatDate(record.date)} {record.time}</h2>
                    <p className="mt-0.5 text-caption text-on-surface-variant">청소 완료</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
                <div className="mb-space-sm flex items-center justify-between">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant" type="button" onClick={() => shiftMonth(-1)} aria-label="이전달">
                    <Icon name="chevron_left" className="text-[20px]" />
                  </button>
                  <div className="text-center">
                    <h2 className="text-title-sm">{selectedMonth.getFullYear()}년 {selectedMonth.getMonth() + 1}월</h2>
                    <span className="text-caption text-on-surface-variant">{selectedMonthCount}회 기록</span>
                  </div>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant" type="button" onClick={() => shiftMonth(1)} aria-label="다음달">
                    <Icon name="chevron_right" className="text-[20px]" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-caption text-outline">
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <span key={day} className="py-1">{day}</span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {monthCells.map((date) => {
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                    const count = recordsByDate[key]?.length ?? 0;
                    const inMonth = isSameMonth(date, selectedMonth);

                    return (
                      <div
                        key={key}
                        className={`flex aspect-square flex-col items-center justify-center rounded-lg text-caption ${
                          count > 0 ? `${tone.fill} ${tone.text} font-semibold` : inMonth ? "bg-surface-container-low text-on-surface" : "bg-transparent text-outline-variant"
                        }`}
                      >
                        <span>{date.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <p className="text-title-sm text-on-surface">아직 청소 기록이 없어요.</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">청소를 기록하면 이 항목의 히스토리를 모아볼 수 있어요.</p>
          </section>
        )}

        <Link className="flex min-h-12 items-center justify-center rounded-xl bg-surface-container-lowest text-label-md text-primary shadow-sm" to="/history">
          히스토리로 돌아가기
        </Link>
      </main>
    </PageShell>
  );
}
