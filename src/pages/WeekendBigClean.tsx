import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { addRecord, formatRecency, getActiveSpaces, getItems, itemStaleness, lastRecord, spaceColor, useRecords, type Item } from "../data/cleaning";
import { spaceIconClass } from "./QuickRecord";

/** Per space: the 2 spots most worth a look — 숨은 관리 first, then the stalest. */
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
  const [open, setOpen] = useState<string | null>(groups[0]?.space.key ?? null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (item: Item) =>
    setChecked((current) => {
      const next = new Set(current);
      if (!next.delete(item.id)) next.add(item.id);
      return next;
    });

  const finish = () => {
    checked.forEach((id) => addRecord(id));
    // Same confirmation as every other record path; ending without checks is fine and silent.
    navigate("/home", checked.size > 0 ? { state: { toast: "청소 기록이 저장됐어요" } } : undefined);
  };

  return (
    <PageShell>
      <AppHeader title="주말 대청소" back />
      <main className="flex flex-col gap-3 px-margin-screen pb-[calc(76px+72px+24px+env(safe-area-inset-bottom,0px))] pt-header">
        <h1 className="text-bb-heading text-sky-ink">여유 있는 날, 대청소</h1>
        <p className="text-bb-body text-sky-muted">오래 안 본 곳과 숨은 관리를 가볍게 훑어요.</p>
        <p className="rounded-xl bg-sky-tint p-3 text-bb-label text-sky-deep">먼지 털기 → 표면 닦기 → 바닥 정리</p>

        {groups.map(({ space, items }) => {
          const isOpen = open === space.key;
          const panelId = `deep-clean-${space.key}`;
          return (
            <section key={space.key} className="flex flex-col gap-3">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="press flex h-16 items-center gap-3 rounded-[18px] bg-sky-white px-3 text-left"
                type="button"
                onClick={() => setOpen(isOpen ? null : space.key)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: spaceColor(space.key) }}>
                  <Icon name={space.icon} className={`text-[24px] ${spaceIconClass[space.key]}`} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-bb-label text-sky-ink">
                    {space.label} · {items.length}곳
                  </span>
                  <span className="truncate text-bb-caption text-sky-muted">{isOpen && items[0] ? `${items[0].name}부터 가볍게 살펴봐요` : "눌러서 항목 펼치기"}</span>
                </span>
                <span aria-hidden="true" className={`w-11 text-center text-bb-title text-sky-deep transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  ⌄
                </span>
              </button>

              {isOpen ? (
                <div id={panelId} className="flex flex-col gap-2">
                  {items.map((item) => {
                    const done = checked.has(item.id);
                    const recency = formatRecency(lastRecord(item.id, records)?.at);
                    return (
                      <div key={item.id} className="flex flex-col gap-2">
                        <button
                          aria-pressed={done}
                          className="press flex h-12 items-center gap-3 rounded-[20px] pl-3 text-left transition-colors duration-300"
                          style={{ backgroundColor: done ? spaceColor(space.key) : "#ffffff" }}
                          type="button"
                          onClick={() => toggle(item)}
                        >
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl text-bb-label ${done ? "bg-sky-brand text-onbrand" : "bg-sky-line"}`}>{done ? "✓" : null}</span>
                          <span className="text-bb-label text-sky-ink">{item.name}</span>
                        </button>
                        <p className="text-bb-caption text-sky-muted">{item.hiddenCare ? `숨은 관리 · ${recency}` : recency}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </main>

      {/* Fixed 대청소 종료 bar, sitting right above the bottom nav (72px + safe area). */}
      <div className="fixed bottom-[calc(60px+max(12px,env(safe-area-inset-bottom)))] left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-sky-bg px-margin-screen py-3">
        <GlassButton size={52} onClick={finish}>
          오늘의 대청소 종료
        </GlassButton>
      </div>
    </PageShell>
  );
}
