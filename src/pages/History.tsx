import { useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import ItemRow from "../components/ItemRow";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";
import { dayKey, formatDay, formatRecency, formatTime, getActiveSpaces, getItem, getItems, getSpace, lastRecord, useRecords } from "../data/cleaning";

type View = "date" | "space";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

const itemHistoryPath = (itemId: string) => `/item-history?item=${encodeURIComponent(itemId)}`;
const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth();

/** Month grid, week starts Monday. `null` = leading blank. */
function monthWeeks(month: Date): Array<Array<Date | null>> {
  const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function History() {
  const records = useRecords();
  const [view, setView] = useState<View>("date");
  const todayKey = dayKey(new Date());
  const [selected, setSelected] = useState(todayKey);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const recordedDays = useMemo(() => new Set(records.map((record) => dayKey(record.at))), [records]);
  const dayRecords = records.filter((record) => dayKey(record.at) === selected);

  // Browsable range: earliest record month (at least last month) … next month.
  const thisMonth = monthIndex(new Date());
  const earliest = records.length ? monthIndex(new Date(records[records.length - 1].at)) : thisMonth;
  const canPrev = monthIndex(month) > Math.min(earliest, thisMonth - 1);
  const canNext = monthIndex(month) < thisMonth + 1;
  const shift = (amount: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));

  const goToday = () => {
    const now = new Date();
    setSelected(todayKey);
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const chips = (
    <div className="flex gap-2" role="group" aria-label="히스토리 보기">
      <Pill className="flex-1" selected={view === "date"} onClick={() => setView("date")}>
        날짜별
      </Pill>
      <Pill className="flex-1" selected={view === "space"} onClick={() => setView("space")}>
        공간별
      </Pill>
    </div>
  );

  const arrow = (dir: -1 | 1, enabled: boolean) => (
    <button
      aria-label={dir < 0 ? "이전 달" : "다음 달"}
      className={`-my-1.5 flex h-11 w-11 items-center justify-center ${enabled ? "text-sky-muted" : "text-sky-line"}`}
      disabled={!enabled}
      type="button"
      onClick={() => shift(dir)}
    >
      <Icon name={dir < 0 ? "chevron-left" : "chevron-right"} className="text-[18px]" />
    </button>
  );

  return (
    <PageShell>
      <AppHeader title="히스토리" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        {view === "date" ? (
          <>
            <PageIntro title="차곡차곡 쌓인 흔적" body="조금씩 돌본 내 공간을 돌아봐요." />
            {chips}

            <section aria-label={`${month.getMonth() + 1}월 달력`} className="flex flex-col gap-2 rounded-3xl bg-sky-white px-[17px] pb-[18px] pt-[14px]">
              <div className="flex h-8 items-center justify-between">
                {arrow(-1, canPrev)}
                <h2 className="text-bb-title text-sky-ink">
                  {month.getFullYear()}년 {month.getMonth() + 1}월
                </h2>
                {arrow(1, canNext)}
              </div>
              <div className="grid h-[22px] grid-cols-7 text-center text-bb-caption text-sky-muted">
                {WEEKDAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              {monthWeeks(month).map((week, row) => (
                <div key={row} className="grid grid-cols-7">
                  {week.map((date, col) => {
                    if (!date) return <span key={col} />;
                    const key = dayKey(date);
                    const isSelected = key === selected;
                    return (
                      <button
                        key={key}
                        aria-label={`${formatDay(date)}${recordedDays.has(key) ? ", 기록 있음" : ""}`}
                        aria-pressed={isSelected}
                        className={`flex h-[34px] flex-col items-center rounded-xl pt-[3px] text-bb-caption ${isSelected ? "bg-sky-tint text-sky-deep" : "text-sky-ink"}`}
                        type="button"
                        onClick={() => setSelected(key)}
                      >
                        {date.getDate()}
                        {recordedDays.has(key) ? <span aria-hidden="true" className="mt-0.5 h-1 w-1 rounded-full bg-sky-deep" /> : null}
                      </button>
                    );
                  })}
                </div>
              ))}
              <p className="flex items-center justify-center gap-1.5 text-bb-caption text-sky-muted">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-deep" />
                공간을 돌본 날
              </p>
            </section>

            <h2 className="text-bb-title text-sky-ink">{formatDay(`${selected}T00:00:00`)}</h2>
            {selected === todayKey && dayRecords.length > 0 ? (
              <p className="text-bb-caption text-sky-deep">{new Set(dayRecords.map((record) => getItem(record.itemId)?.space).filter(Boolean)).size}곳을 돌봤어요</p>
            ) : null}
            {dayRecords.length > 0 ? (
              dayRecords.map((record) => {
                const item = getItem(record.itemId);
                if (!item) return null;
                return <ItemRow key={record.id} title={item.name} sub={`${getSpace(item.space).label} · ${formatTime(record.at)}`} to={itemHistoryPath(item.id)} />;
              })
            ) : (
              <p className="text-bb-body text-sky-muted">
                이 날은 남긴 기록이 없어요.
                <br />빈 날도 괜찮아요.
              </p>
            )}
            {selected !== todayKey ? (
              <Pill className="w-full" onClick={goToday}>
                오늘로 돌아가기
              </Pill>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="text-bb-heading text-sky-ink">공간마다 쌓이는 기록</h1>
            {chips}
            <p className="text-bb-body text-sky-muted">최근 돌본 항목을 공간별로 살펴봐요.</p>
            {getActiveSpaces().map((space) => {
              // Most recently cared-for first (never-recorded last), top 3.
              const items = getItems(space.key)
                .map((item) => ({ item, at: lastRecord(item.id, records)?.at }))
                .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""))
                .slice(0, 3);
              if (items.length === 0) return null;
              return (
                <section key={space.key} className="flex flex-col gap-3">
                  <h2 className="text-bb-title text-sky-ink">{space.label}</h2>
                  {items.map(({ item, at }) => (
                    <ItemRow key={item.id} space={space.key} title={item.name} sub={formatRecency(at)} to={itemHistoryPath(item.id)} />
                  ))}
                </section>
              );
            })}
          </>
        )}
      </main>
    </PageShell>
  );
}
