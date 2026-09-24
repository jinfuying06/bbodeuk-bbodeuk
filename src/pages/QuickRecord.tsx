import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import Icon from "../components/Icon";
import Toast, { useToast } from "../components/Toast";
import { formatRecency, getActiveSpaces, getItems, isRecordedToday, isSpaceKey, lastRecord, toggleTodayRecord, useRecords, type Item, type SpaceKey } from "../data/cleaning";
import { spaceTones } from "../data/spaceTones";

type Filter = "recent" | "fav" | "space";

const filters: Array<{ key: Filter; icon: string; label: string }> = [
  { key: "recent", icon: "schedule", label: "최근 기록" },
  { key: "fav", icon: "favorite", label: "자주" },
  { key: "space", icon: "grid_view", label: "공간별 보기" },
];

function isFilter(value: string | null): value is Filter {
  return value === "recent" || value === "fav" || value === "space";
}

export default function QuickRecord() {
  const [searchParams, setSearchParams] = useSearchParams();
  const records = useRecords();
  const activeSpaces = useMemo(() => getActiveSpaces(), []);
  const availableSpaces = useMemo(() => activeSpaces.map((item) => item.key), [activeSpaces]);
  const allItems = useMemo(() => getItems().filter((item) => availableSpaces.includes(item.space)), [availableSpaces]);
  const [filter, setFilter] = useState<Filter>(() => {
    const initialFilter = searchParams.get("filter");
    return isFilter(initialFilter) ? initialFilter : "space";
  });
  const [space, setSpace] = useState<SpaceKey>(() => {
    const initialSpace = searchParams.get("space");
    return isSpaceKey(initialSpace) ? initialSpace : "bathroom";
  });
  const [flashCard, setFlashCard] = useState<string | null>(null);
  const [sweepingId, setSweepingId] = useState<string | null>(null);
  const [sweepKey, setSweepKey] = useState(0);
  const [toast, showToast] = useToast();
  const currentSpace = availableSpaces.includes(space) ? space : availableSpaces[0] ?? "bathroom";
  const selectedItemId = searchParams.get("item");

  // Per-item paint-cycle counter, so a stale timeout from an earlier tap can't
  // clobber a newer one's flash feedback on rapid untap->retap of the same item.
  const paintCycleRef = useRef<Record<string, number>>({});
  const pendingTimeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      pendingTimeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      pendingTimeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const nextFilter = searchParams.get("filter");
    const nextSpace = searchParams.get("space");
    if (isFilter(nextFilter)) setFilter(nextFilter);
    if (isSpaceKey(nextSpace)) setSpace(nextSpace);
  }, [searchParams]);

  useEffect(() => {
    if (space === currentSpace) return;
    setSpace(currentSpace);
    if (filter === "space") setSearchParams({ filter: "space", space: currentSpace }, { replace: true });
  }, [currentSpace, filter, setSearchParams, space]);

  const activeItems = useMemo(() => {
    if (filter === "recent") {
      // Most recently cared-for items first (records are newest-first).
      const recent: Item[] = [];
      for (const record of records) {
        const item = allItems.find((entry) => entry.id === record.itemId);
        if (item && !recent.includes(item)) recent.push(item);
        if (recent.length === 5) break;
      }
      return recent;
    }
    if (filter === "fav") {
      const counts: Record<string, number> = {};
      records.forEach((record) => {
        counts[record.itemId] = (counts[record.itemId] ?? 0) + 1;
      });
      return allItems
        .filter((item) => counts[item.id])
        .sort((a, b) => counts[b.id] - counts[a.id])
        .slice(0, 4);
    }
    return allItems.filter((item) => item.space === currentSpace);
  }, [allItems, currentSpace, filter, records]);

  const updateFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    const nextParams: Record<string, string> = { filter: nextFilter };
    if (nextFilter === "space") nextParams.space = currentSpace;
    setSearchParams(nextParams);
  };

  const updateSpace = (nextSpace: SpaceKey) => {
    if (!availableSpaces.includes(nextSpace)) return;
    setSpace(nextSpace);
    setFilter("space");
    setSearchParams({ filter: "space", space: nextSpace });
  };

  const selectedItem = filter === "space" ? activeItems.find((item) => item.id === selectedItemId) : undefined;

  const paintItem = (item: Item) => {
    if (toggleTodayRecord(item.id) === "removed") {
      setFlashCard(null);
      setSweepingId(null);
      showToast("공간 기록이 취소되었어요");
      return;
    }

    showToast("청소 기록이 저장됐어요");
    setFlashCard(item.id);
    // Glass-sweep feedback (Figma spec: 480ms sweep, ~1.2s total settle).
    // Deferred by one tick so the transform actually transitions from its
    // resting -translate-x-full instead of mounting already-translated.
    setSweepingId(null);
    setSweepKey((key) => key + 1);
    const cycle = (paintCycleRef.current[item.id] ?? 0) + 1;
    paintCycleRef.current[item.id] = cycle;
    const sweepTimeoutId = window.setTimeout(() => setSweepingId(item.id), 10);
    const clearTimeoutId = window.setTimeout(() => {
      setFlashCard((current) => (current === item.id && paintCycleRef.current[item.id] === cycle ? null : current));
    }, 1200);
    pendingTimeoutIdsRef.current.push(sweepTimeoutId, clearTimeoutId);
  };

  return (
    <div className="phone-shell bg-sky-bg text-sky-ink">
      <AppHeader title="청소 기록" />
      <main className="flex flex-col bg-sky-bg pb-24 pt-header">
        <section className="px-margin-screen pb-space-sm pt-space-md">
          <h1 className="text-headline-lg text-sky-ink">{selectedItem ? `${selectedItem.name} 청소를 기록할까요?` : "어디를 청소했나요?"}</h1>
        </section>

        <section className="px-margin-screen py-space-xs">
          <div className="flex w-full items-center gap-space-xs rounded-full bg-sky-bg p-space-xxs">
            {filters.map((item) => (
              <button
                key={item.key}
                aria-pressed={filter === item.key}
                className={`flex flex-1 items-center justify-center gap-1 rounded-full px-space-xs py-space-xs text-label-md transition-all duration-200 ${
                  filter === item.key ? "bg-sky-white text-sky-deep shadow-sm" : "text-sky-muted"
                }`}
                type="button"
                onClick={() => updateFilter(item.key)}
              >
                <Icon name={item.icon} className="text-[18px]" />
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {filter === "space" ? (
          <section className="mt-space-sm px-margin-screen">
            <div className="hide-scrollbar -mx-margin-screen overflow-x-auto px-margin-screen">
              <div className="flex min-w-max gap-space-xs">
                {activeSpaces.map((item) => (
                  <button
                    key={item.key}
                    aria-pressed={currentSpace === item.key}
                    className={`flex items-center gap-1.5 rounded-full border px-space-md py-space-xs text-label-md transition-colors duration-150 ${
                      currentSpace === item.key ? `${spaceTones[item.key].fill} ${spaceTones[item.key].border} ${spaceTones[item.key].text}` : "border-art-line bg-sky-white text-sky-muted"
                    }`}
                    type="button"
                    onClick={() => updateSpace(item.key)}
                  >
                    <Icon name={item.icon} className="text-[16px]" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-space-md px-margin-screen">
          {filter === "space" ? (
            <div className="grid grid-cols-3 gap-space-xs">
              {activeItems.map((item) => {
                const flashed = flashCard === item.id;
                const painted = isRecordedToday(item.id, records);
                const selected = selectedItemId === item.id;
                const sweeping = sweepingId === item.id;
                const tone = spaceTones[currentSpace];

                return (
                  <button
                    key={item.id}
                    aria-pressed={painted}
                    className={`relative flex aspect-square flex-col items-center justify-center gap-space-xs overflow-hidden rounded-lg border p-space-xs text-center transition-all active:scale-95 ${
                      painted || selected ? `${tone.border} ${tone.fill} ${tone.text} shadow-sm` : "border-art-line bg-sky-white text-sky-ink"
                    }`}
                    type="button"
                    onClick={() => paintItem(item)}
                    >
                    {selected ? <span className="absolute right-2 top-2 rounded-full bg-sky-white px-2 py-0.5 text-caption font-semibold">선택됨</span> : null}
                    <Icon name={item.icon} className="text-[32px]" />
                    <span className="text-label-sm font-semibold">{item.name}</span>
                    <span className="text-caption text-sky-muted">{formatRecency(lastRecord(item.id, records)?.at)}</span>
                    {painted ? (
                      <span
                        key={`${item.id}-${sweepKey}`}
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-white/70 blur-sm transition-transform duration-[480ms] ease-out ${
                          sweeping ? "translate-x-[260%]" : "-translate-x-full"
                        }`}
                      />
                    ) : null}
                    <div role="status" aria-live="polite" className={`pointer-events-none absolute inset-0 flex items-center justify-center ${tone.feedback} transition-opacity duration-500 ${flashed ? "opacity-100" : "opacity-0"}`}>
                      {flashed ? (
                        <span className={`rounded-full bg-sky-white px-3 py-1.5 text-label-md font-semibold ${tone.text} shadow-sm`}>
                          이제 깨끗해요!
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
              <Link className="flex aspect-square flex-col items-center justify-center gap-space-xs rounded-lg border border-dashed border-art-line bg-sky-white text-sky-muted" to={`/item-add?space=${currentSpace}`}>
                <Icon name="add" className="text-[24px]" />
                <span className="text-label-sm">항목 추가</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-space-xs">
              {activeItems.map((item) => {
                const flashed = flashCard === item.id;
                const painted = isRecordedToday(item.id, records);
                const sweeping = sweepingId === item.id;
                const itemSpace = activeSpaces.find((entry) => entry.key === item.space);
                const tone = spaceTones[item.space];

                return (
                  <button
                    key={item.id}
                    aria-pressed={painted}
                    className={`relative flex items-center overflow-hidden rounded-xl border p-space-sm text-left transition-all duration-200 active:scale-[0.99] ${
                      painted ? `${tone.border} ${tone.fill} shadow-sm` : "border-transparent bg-sky-white"
                    }`}
                    type="button"
                    onClick={() => paintItem(item)}
                  >
                    <div className="flex min-w-0 items-center gap-space-sm">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
                        <Icon name={itemSpace?.icon ?? "grid_view"} className="text-[22px]" />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className={`text-title-sm ${painted ? tone.text : "text-sky-ink"}`}>
                          {itemSpace?.label} · {item.name}
                        </span>
                        <span className="truncate text-caption text-sky-muted">{formatRecency(lastRecord(item.id, records)?.at)}</span>
                      </div>
                    </div>
                    {painted ? (
                      <span
                        key={`${item.id}-${sweepKey}`}
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/70 blur-sm transition-transform duration-[480ms] ease-out ${
                          sweeping ? "translate-x-[420%]" : "-translate-x-full"
                        }`}
                      />
                    ) : null}
                    <div role="status" aria-live="polite" className={`pointer-events-none absolute inset-0 flex items-center justify-center ${tone.feedback} transition-opacity duration-500 ${flashed ? "opacity-100" : "opacity-0"}`}>
                      {flashed ? (
                        <span className={`rounded-full bg-sky-white px-3 py-1.5 text-label-md font-semibold ${tone.text} shadow-sm`}>
                          이제 깨끗해요!
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Toast message={toast} visible={Boolean(toast)} />
      <BottomNavigation />
    </div>
  );
}
