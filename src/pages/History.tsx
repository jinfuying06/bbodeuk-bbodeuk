import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

type HistoryTab = "일자별 기록" | "공간별 기록" | "자주 돌본 곳";

type CleaningRecord = {
  id: string;
  item: string;
  space: string;
  date: string;
  time: string;
};

const tabs: HistoryTab[] = ["일자별 기록", "공간별 기록", "자주 돌본 곳"];

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

const records: CleaningRecord[] = [
  { id: "r1", item: "세면대 수전 및 볼", space: "욕실", date: "2026-09-04", time: "오후 08:30" },
  { id: "r2", item: "싱크대 거름망", space: "주방", date: "2026-09-04", time: "오후 07:15" },
  { id: "r3", item: "침실 침구", space: "침실", date: "2026-09-02", time: "오전 10:20" },
  { id: "r4", item: "인덕션 상판 및 조리대", space: "주방", date: "2026-09-01", time: "오후 09:10" },
  { id: "r5", item: "싱크대 거름망", space: "주방", date: "2026-08-30", time: "오후 08:40" },
  { id: "r6", item: "거실 바닥", space: "거실", date: "2026-08-24", time: "오후 06:30" },
  { id: "r7", item: "공기청정기 프리필터", space: "거실", date: "2026-08-20", time: "오전 11:00" },
  { id: "r8", item: "양변기 안팎", space: "욕실", date: "2026-08-18", time: "오후 09:25" },
];

const today = new Date("2026-09-04T00:00:00");

const formatMonth = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "long",
});

const getMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getRecordMonthKey = (record: CleaningRecord) => record.date.slice(0, 7);

const getDateLabel = (dateText: string, selectedMonth: Date) => {
  const date = new Date(`${dateText}T00:00:00`);
  const selectedIsCurrentMonth = getMonthKey(selectedMonth) === getMonthKey(today);
  const isToday = dateText === "2026-09-04";
  const formatted = dateFormatter.format(date).replace(/\s/g, " ");

  return selectedIsCurrentMonth && isToday ? `오늘 (${formatted})` : formatted;
};

const shiftMonth = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

const getMonthlyFeedback = (monthRecords: CleaningRecord[], previousMonthRecords: CleaningRecord[]) => {
  if (monthRecords.length === 0) return "이달에는 아직 청소 기록이 없어요.";

  const currentBySpace = countBy(monthRecords, (record) => record.space);
  const previousBySpace = countBy(previousMonthRecords, (record) => record.space);
  const improvedSpace = Object.entries(currentBySpace)
    .map(([space, count]) => ({ space, diff: count - (previousBySpace[space] ?? 0) }))
    .filter((item) => item.diff > 0)
    .sort((a, b) => b.diff - a.diff)[0];

  if (improvedSpace) return `지난달보다 ${improvedSpace.space}을 ${improvedSpace.diff}번 더 챙겼어요.`;

  return `이번 달에는 ${monthRecords.length}번의 청소 기록을 남겼어요.`;
};

const countBy = <T,>(items: T[], getKey: (item: T) => string) =>
  items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

const itemHistoryPath = (item: string) => `/item-history?item=${encodeURIComponent(item)}`;

export default function History() {
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 1));
  const [activeTab, setActiveTab] = useState<HistoryTab>("일자별 기록");
  const [openSpaces, setOpenSpaces] = useState<Record<string, boolean>>({ 주방: true });
  const monthKey = getMonthKey(selectedDate);
  const previousMonthKey = getMonthKey(shiftMonth(selectedDate, -1));
  const monthRecords = records.filter((record) => getRecordMonthKey(record) === monthKey);
  const previousMonthRecords = records.filter((record) => getRecordMonthKey(record) === previousMonthKey);
  const monthlyFeedback = getMonthlyFeedback(monthRecords, previousMonthRecords);
  const spaceCounts = countBy(monthRecords, (record) => record.space);

  const recordsByDate = useMemo(() => {
    const grouped = monthRecords.reduce<Record<string, CleaningRecord[]>>((acc, record) => {
      acc[record.date] = [...(acc[record.date] ?? []), record];
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [monthRecords]);

  const recordsBySpace = useMemo(() => {
    const grouped = monthRecords.reduce<Record<string, CleaningRecord[]>>((acc, record) => {
      acc[record.space] = [...(acc[record.space] ?? []), record];
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, "ko"));
  }, [monthRecords]);

  const frequentItems = useMemo(() => {
    const grouped = monthRecords.reduce<Record<string, { count: number; latestDate: string; space: string }>>((acc, record) => {
      const current = acc[record.item] ?? { count: 0, latestDate: record.date, space: record.space };
      acc[record.item] = {
        count: current.count + 1,
        latestDate: current.latestDate > record.date ? current.latestDate : record.date,
        space: record.space,
      };
      return acc;
    }, {});

    return Object.entries(grouped).sort(([, a], [, b]) => b.count - a.count || (a.latestDate < b.latestDate ? 1 : -1));
  }, [monthRecords]);

  return (
    <PageShell>
      <AppHeader title="히스토리" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <span className="text-label-sm text-secondary">{formatMonth(selectedDate)}</span>
          <h1 className="mt-space-sm text-headline-lg">이번 달 총 {monthRecords.length}번 기록했어요</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{monthlyFeedback}</p>
          {monthRecords.length > 0 ? (
            <p className="mt-space-md text-caption text-on-surface-variant">
              {Object.entries(spaceCounts)
                .map(([space, count]) => `${space} ${count}회`)
                .join(" · ")}
            </p>
          ) : null}
        </section>

        <div className="flex items-center justify-between gap-space-sm">
          <button className="flex min-h-11 items-center gap-2 text-title-md" type="button" onClick={() => setSelectedDate((current) => shiftMonth(current, -1))}>
            <Icon name="chevron_left" className="text-[20px]" />
            {formatMonth(selectedDate)}
          </button>
          <div className="flex items-center gap-space-xs">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant" type="button" onClick={() => setSelectedDate((current) => shiftMonth(current, 1))} aria-label="다음 달">
              <Icon name="chevron_right" className="text-[20px]" />
            </button>
            {monthKey !== getMonthKey(today) ? (
              <button className="min-h-11 rounded-full bg-surface-container-low px-3 text-label-sm text-on-surface-variant" type="button" onClick={() => setSelectedDate(new Date(2026, 8, 1))}>
                오늘로 이동
              </button>
            ) : null}
          </div>
        </div>

        <div className="hide-scrollbar -mx-margin-screen overflow-x-auto px-margin-screen">
          <div className="flex min-w-max gap-space-xs">
            {tabs.map((tab) => (
              <button key={tab} className={`min-h-11 rounded-full px-4 py-2 text-label-md ${activeTab === tab ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface-variant shadow-sm"}`} type="button" onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {monthRecords.length === 0 ? (
          <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <p className="text-title-sm text-on-surface">이달에는 아직 청소 기록이 없어요.</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">청소를 기록하면 여기에서 월별로 모아볼 수 있어요.</p>
            <Link className="mt-space-md inline-flex min-h-11 items-center rounded-lg bg-primary-container px-space-md text-label-md font-semibold text-on-primary" to="/quick-record">
              청소 기록하러 가기
            </Link>
          </section>
        ) : null}

        {activeTab === "일자별 기록"
          ? recordsByDate.map(([date, dayRecords]) => (
              <section key={date}>
                <div className="mb-space-xs flex items-center justify-between">
                  <h2 className="text-title-sm">{getDateLabel(date, selectedDate)}</h2>
                  <span className="text-caption text-primary">{dayRecords.length}건 완료</span>
                </div>
                <div className="flex flex-col gap-space-xs">
                  {dayRecords.map((record) => {
                    const tone = spaceTones[record.space] ?? { fill: "bg-surface-container-low", text: "text-on-surface-variant", border: "border-outline-variant" };

                    return (
                      <Link key={record.id} className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-transform active:scale-[0.99]" to={itemHistoryPath(record.item)}>
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
                          <Icon name={spaceIcons[record.space] ?? "task_alt"} className="text-[22px]" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-title-sm">{record.item}</h3>
                          <p className="mt-0.5 text-caption text-on-surface-variant">{record.time}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))
          : null}

        {activeTab === "공간별 기록"
          ? recordsBySpace.map(([space, spaceRecords]) => {
              const tone = spaceTones[space] ?? { fill: "bg-surface-container-low", text: "text-on-surface-variant", border: "border-outline-variant" };
              const open = Boolean(openSpaces[space]);

              return (
                <section key={space} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                  <button className="flex w-full items-center justify-between p-space-md text-left transition-colors active:bg-surface-container-low" type="button" onClick={() => setOpenSpaces((current) => ({ ...current, [space]: !current[space] }))}>
                    <div className="flex min-w-0 items-center gap-space-sm">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
                        <Icon name={spaceIcons[space] ?? "grid_view"} className="text-[22px]" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-title-sm">{space}</h2>
                        <p className="text-caption text-on-surface-variant">{spaceRecords.length}건 기록</p>
                      </div>
                    </div>
                    <Icon name="keyboard_arrow_down" className={`text-[22px] text-on-surface-variant transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open ? (
                    <div className="flex flex-col gap-space-xs px-space-md pb-space-md">
                      {spaceRecords.map((record) => (
                        <Link key={record.id} className={`flex items-center gap-space-sm rounded-lg border bg-surface-container-low p-space-sm transition-transform active:scale-[0.99] ${tone.border}`} to={itemHistoryPath(record.item)}>
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.fill} ${tone.text}`}>
                            <Icon name={spaceIcons[space] ?? "task_alt"} className="text-[20px]" />
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate text-body-md font-semibold">{record.item}</h3>
                          <p className="mt-0.5 text-caption text-on-surface-variant">
                            {getDateLabel(record.date, selectedDate)} · {record.time}
                          </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })
          : null}

        {activeTab === "자주 돌본 곳" ? (
          <section className="flex flex-col gap-space-xs">
              {frequentItems.map(([item, info]) => (
                <Link key={item} className="flex min-h-[72px] items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-transform active:scale-[0.99]" to={itemHistoryPath(item)}>
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${spaceTones[info.space]?.fill ?? "bg-surface-container-low"} ${spaceTones[info.space]?.text ?? "text-on-surface-variant"}`}>
                      <Icon name={spaceIcons[info.space] ?? "task_alt"} className="text-[22px]" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-title-sm">{item}</h3>
                      <p className="mt-0.5 text-caption text-on-surface-variant">최근 청소 {info.latestDate.replace("2026-", "").replace("-", "월 ")}일</p>
                    </div>
                  </div>
                  <span className={`ml-space-sm shrink-0 rounded-full px-2.5 py-1 text-label-sm ${spaceTones[info.space]?.fill ?? "bg-surface-container-low"} ${spaceTones[info.space]?.text ?? "text-primary"}`}>{info.count}회</span>
                </Link>
              ))}
          </section>
        ) : null}
      </main>
    </PageShell>
  );
}
