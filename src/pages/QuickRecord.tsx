import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import Pill from "../components/Pill";
import Toast, { useToast } from "../components/Toast";
import { formatRecency, getActiveSpaces, getItems, getSpace, isRecordedToday, isSpaceKey, lastRecord, spaceColor, toggleTodayRecord, useRecords, type Item, type SpaceKey } from "../data/cleaning";

type Filter = "recent" | "fav" | "space";

const filters: Array<{ key: Filter; label: string }> = [
  { key: "recent", label: "최근 기록" },
  { key: "fav", label: "자주" },
  { key: "space", label: "공간별 보기" },
];

const intro: Record<Filter, [string, string]> = {
  recent: ["최근 돌본 곳을 다시", "한 번 누르면 기록, 다시 누르면 취소돼요."],
  fav: ["자주 돌보는 곳부터", "한 번 누르면 기록, 다시 누르면 취소돼요."],
  space: ["어디를 청소했나요?", "청소한 곳을 톡 눌러 기록해요."],
};

/** Static class names so Tailwind keeps them (space icon colors). */
export const spaceIconClass: Record<SpaceKey, string> = {
  bathroom: "text-space-bath-icon",
  kitchen: "text-space-kitchen-icon",
  living: "text-space-living-icon",
  bedroom: "text-space-bed-icon",
  terrace: "text-sky-deep",
};

const isFilter = (value: string | null): value is Filter => value === "recent" || value === "fav" || value === "space";

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Figma Glass / light sweep: one left→right pass, 480ms. Stable ref → runs once per mount. */
const playSweep = (el: HTMLElement | null) => {
  if (!el || reducedMotion()) return;
  el.animate([{ transform: "translateX(0) rotate(10deg)", opacity: 1 }, { transform: "translateX(420px) rotate(10deg)", opacity: 1 }], {
    duration: 480,
    easing: "cubic-bezier(.2,.7,.2,1)",
    fill: "forwards",
  });
};

/** Figma Glass / sparkle: fades/scales in during the sweep, gone by ~1.2s. */
const playSparkle = (el: HTMLElement | null) => {
  if (!el || reducedMotion()) return;
  el.animate(
    [
      { opacity: 0, transform: "scale(.6)" },
      { opacity: 1, transform: "scale(1)", offset: 0.35 },
      { opacity: 1, transform: "scale(1)", offset: 0.7 },
      { opacity: 0, transform: "scale(.9)" },
    ],
    { duration: 1200, easing: "ease-out", fill: "forwards" },
  );
};

const sweepGradient = "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(199,255,250,.22) 32%, rgba(255,255,255,.88) 50%, rgba(199,255,250,.22) 68%, rgba(255,255,255,0) 100%)";

export default function QuickRecord() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const records = useRecords();
  const activeSpaces = useMemo(() => getActiveSpaces(), []);
  const allItems = useMemo(() => getItems().filter((item) => activeSpaces.some((space) => space.key === item.space)), [activeSpaces]);
  const paramFilter = searchParams.get("filter");
  const filter: Filter = isFilter(paramFilter) ? paramFilter : "space";
  const paramSpace = searchParams.get("space");
  const currentSpace: SpaceKey = activeSpaces.find((space) => space.key === paramSpace)?.key ?? activeSpaces[0]?.key ?? "bathroom";
  // Keyed per tap so the sweep/sparkle overlays remount and replay.
  const [shine, setShine] = useState<{ id: string; n: number } | null>(null);
  const [toast, showToast] = useToast();
  const doneTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(doneTimer.current), []);

  // Toast handed over from 기록 완료 → "기록 취소".
  useEffect(() => {
    const message = (location.state as { toast?: string } | null)?.toast;
    if (message) {
      showToast(message);
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [location, navigate, showToast]);

  const items = useMemo(() => {
    if (filter === "recent") {
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

  const setView = (nextFilter: Filter, nextSpace = currentSpace) =>
    setSearchParams(nextFilter === "space" ? { filter: nextFilter, space: nextSpace } : { filter: nextFilter }, { replace: true });

  const record = (item: Item) => {
    window.clearTimeout(doneTimer.current);
    if (toggleTodayRecord(item.id) === "removed") {
      setShine(null);
      showToast("공간 기록이 취소되었어요");
      return;
    }
    setShine((prev) => ({ id: item.id, n: (prev?.n ?? 0) + 1 }));
    // 탭 → 유리광 480ms + 반짝임 → ~1.2s 후 09/기록 완료.
    doneTimer.current = window.setTimeout(() => navigate(`/record-done?item=${item.id}`), 1200);
  };

  const overlays = (item: Item, sparkleClass: string, sweepClass: string) =>
    shine?.id === item.id ? (
      <>
        <span key={`sw-${shine.n}`} ref={playSweep} aria-hidden="true" className={`pointer-events-none absolute opacity-0 mix-blend-screen ${sweepClass}`} style={{ background: sweepGradient }} />
        <span key={`sp-${shine.n}`} ref={playSparkle} aria-hidden="true" className={`pointer-events-none absolute opacity-0 text-sky-white ${sparkleClass}`}>
          <Icon name="sparkle" className="drop-shadow-[0_0_2px_rgba(20,107,99,.35)]" />
        </span>
      </>
    ) : null;

  const [heading, body] = intro[filter];

  return (
    <div className="phone-shell">
      <AppHeader title="청소 기록" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <section className="flex min-h-[88px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">{heading}</h1>
          <p className="text-bb-body text-sky-muted">{body}</p>
        </section>

        <div aria-label="기록 보기 방식" className="flex gap-2" role="group">
          {filters.map((entry) => (
            <Pill key={entry.key} className="flex-1" selected={filter === entry.key} onClick={() => setView(entry.key)}>
              {entry.label}
            </Pill>
          ))}
        </div>

        {filter === "space" ? (
          <>
            <div aria-label="공간 선택" className="flex gap-2" role="group">
              {activeSpaces.map((space) => (
                <Pill
                  key={space.key}
                  className="min-w-0 flex-1 !px-[7px]"
                  icon={space.icon}
                  iconClassName={spaceIconClass[space.key]}
                  selected={currentSpace === space.key}
                  size={38}
                  onClick={() => setView("space", space.key)}
                >
                  {space.label}
                </Pill>
              ))}
            </div>

            <p className="h-[62px] rounded-[16px] bg-sky-tint pl-4 pr-4 pt-[11px] text-[12px] font-medium leading-[22px] text-sky-deep">색이 채워진 항목을 한 번 더 누르면 기록을 취소해요.</p>

            <div aria-label="청소 항목" className="grid grid-cols-2 gap-[10px]">
              {items.map((item) => {
                const recorded = isRecordedToday(item.id, records);
                const space = getSpace(item.space);
                const objectArt = item.icon.startsWith("object-");
                return (
                  <button
                    key={item.id}
                    aria-pressed={recorded}
                    className="press relative flex h-[122px] flex-col items-start overflow-hidden rounded-[20px] border pl-[14px] pt-2 text-left transition-colors duration-300"
                    style={{ borderColor: space.iconColor, backgroundColor: recorded ? spaceColor(item.space) : "#ffffff" }}
                    type="button"
                    onClick={() => record(item)}
                  >
                    <span className="flex h-[62px] w-[76px] items-start">
                      {objectArt ? (
                        <Icon name={item.icon} className="ml-3 mt-1 text-[46px]" />
                      ) : (
                        <Icon name={item.icon} className={`mt-1 text-[24px] ${spaceIconClass[item.space]}`} />
                      )}
                    </span>
                    <span className="text-bb-label text-sky-ink">{item.name}</span>
                    <span className="text-bb-caption text-sky-muted">{formatRecency(lastRecord(item.id, records)?.at)}</span>
                    {overlays(item, "left-[111px] top-[14px] text-[28px]", "-left-[174px] -top-[49px] h-[220px] w-[118px]")}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const recorded = isRecordedToday(item.id, records);
                const space = getSpace(item.space);
                return (
                  <button
                    key={item.id}
                    aria-pressed={recorded}
                    className="press relative flex h-20 items-center gap-3 overflow-hidden rounded-[20px] px-[14px] text-left transition-colors duration-300"
                    style={{ backgroundColor: recorded ? spaceColor(item.space) : "#ffffff" }}
                    type="button"
                    onClick={() => record(item)}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: spaceColor(item.space) }}>
                      <Icon name={space.icon} className={`text-[24px] ${spaceIconClass[item.space]}`} />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-bb-label text-sky-ink">
                        {space.label} · {item.name}
                      </span>
                      <span className="text-bb-caption text-sky-muted">{formatRecency(lastRecord(item.id, records)?.at)}</span>
                    </span>
                    {overlays(item, "right-4 top-3 text-[24px]", "-left-[120px] -top-10 h-[160px] w-[110px]")}
                  </button>
                );
              })}
              {items.length === 0 ? <p className="py-6 text-center text-bb-body text-sky-muted">아직 남긴 기록이 없어요. 공간별 보기에서 시작해보세요.</p> : null}
            </div>
            <GlassButton size={52} to="/history" variant="secondary">
              기록 모아보기
            </GlassButton>
          </>
        )}
      </main>

      <Toast message={toast} visible={Boolean(toast)} />
      <BottomNavigation />
    </div>
  );
}
