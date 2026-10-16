import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import CheckRow from "../components/CheckRow";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import ShineOverlay from "../components/ShineOverlay";
import SpaceTile from "../components/SpaceTile";
import { addRecord, formatRecency, getActiveSpaces, getItems, itemStaleness, lastRecord, useRecords, type Item } from "../data/cleaning";

/** Per space: the 2 spots most worth a look — 숨은 관리 first (internal priority only, never shown as a badge since 2026-10-16), then the stalest. */
const PICKS = 2;

/** Figma 16 / 주말 대청소 (30:933). */
export default function WeekendBigClean() {
  const navigate = useNavigate();
  const records = useRecords();
  // Picks are fixed for the visit (don't reshuffle as records change).
  const [groups] = useState(
    () =>
      getActiveSpaces().map((space) => ({
        space,
        items: getItems(space.key)
          .map((item) => ({ item, score: (item.hiddenCare ? 100 : 0) + Math.min(itemStaleness(item, records), 50) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, PICKS)
          .map(({ item }) => item),
      })),
  );
  // Every space open by default (2026-10-16): a big clean is scanned as a whole, not one space at a time.
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState<Set<string>>(new Set());
  // Per-item replay counter for the glass sweep (same feedback as 기록).
  const [shine, setShine] = useState<Record<string, number>>({});
  const allItems = groups.flatMap(({ items }) => items);
  const allChecked = allItems.length > 0 && allItems.every((item) => checked.has(item.id));

  const flash = (ids: string[]) => setShine((current) => Object.fromEntries([...Object.entries(current), ...ids.map((id) => [id, (current[id] ?? 0) + 1])]));

  const toggle = (item: Item) => {
    const turningOn = !checked.has(item.id);
    setChecked((current) => {
      const next = new Set(current);
      if (!next.delete(item.id)) next.add(item.id);
      return next;
    });
    if (turningOn) flash([item.id]);
  };

  const toggleAll = () => {
    if (allChecked) {
      setChecked(new Set());
      return;
    }
    flash(allItems.filter((item) => !checked.has(item.id)).map((item) => item.id));
    setChecked(new Set(allItems.map((item) => item.id)));
  };

  const toggleOpen = (key: string) =>
    setClosed((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  const finish = () => {
    checked.forEach((id) => addRecord(id));
    // Same confirmation as every other record path; ending without checks is fine and silent.
    navigate("/home", checked.size > 0 ? { state: { toast: "청소 기록을 저장했어요" } } : undefined);
  };

  return (
    <PageShell>
      <AppHeader title="주말 대청소" back />
      <main className="flex flex-col px-margin-screen pb-nav-cta pt-header">
        <PageIntro title="오래 안 본 곳부터 가볍게" body="숨은 관리 자리도 함께 챙겨요." className="pb-3" />

        {groups.map(({ space, items }) => {
          const isOpen = !closed.has(space.key);
          const panelId = `deep-clean-${space.key}`;
          return (
            // Same list-style accordion as 내 공간 (2026-10-15).
            <section key={space.key} className="flex flex-col border-b border-sky-line">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="press flex h-[72px] items-center gap-3 text-left"
                type="button"
                onClick={() => toggleOpen(space.key)}
              >
                <SpaceTile space={space.key} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-bb-label text-sky-ink">
                    {space.label} · {items.length}곳
                  </span>
                  <span className="truncate text-bb-caption text-sky-muted">{isOpen && items[0] ? `${items[0].name}부터 가볍게 살펴봐요` : "눌러서 항목 펼치기"}</span>
                </span>
                <span aria-hidden="true" className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-sky-deep">
                  <Icon name="chevron-down" className={`text-[18px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              {isOpen ? (
                <div id={panelId} className="flex flex-col gap-1 pb-4 pl-10">
                  {items.map((item) => {
                    const done = checked.has(item.id);
                    const recency = formatRecency(lastRecord(item.id, records)?.at);
                    return (
                      <CheckRow
                        key={item.id}
                        fill={space.color}
                        list
                        label={item.name}
                        on={done}
                        onClick={() => toggle(item)}
                        overlay={shine[item.id] ? <ShineOverlay n={shine[item.id]} sparkleClass="right-3 top-1.5 text-[18px]" sweepClass="-left-[120px] -top-[30px] h-[110px] w-[80px]" /> : null}
                        trailing={<span className="shrink-0 text-right text-bb-caption text-sky-muted">{recency}</span>}
                      />
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </main>

      {/* Fixed 대청소 종료 bar, sitting right above the bottom nav (72px + safe area). */}
      <div className="bottom-nav fixed left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-sky-bg px-margin-screen py-3">
        <div className="flex flex-col gap-2">
          <GlassButton size={52} variant="secondary" onClick={toggleAll}>
            {allChecked ? "모두 해제하기" : "모두 체크하기"}
          </GlassButton>
          <GlassButton size={52} onClick={finish}>
            오늘의 대청소 종료
          </GlassButton>
        </div>
      </div>
    </PageShell>
  );
}
