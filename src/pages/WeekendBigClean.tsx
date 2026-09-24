import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import CheckRow from "../components/CheckRow";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import SpaceTile from "../components/SpaceTile";
import { addRecord, formatRecency, getActiveSpaces, getItems, itemStaleness, lastRecord, useRecords, type Item } from "../data/cleaning";

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
        <PageIntro title="여유 있는 날, 대청소" body="오래 안 본 곳과 숨은 관리를 가볍게 훑어요." />
        <p className="rounded-xl bg-sky-tint p-3 text-bb-label text-sky-deep">먼지 털기 → 표면 닦기 → 바닥 정리</p>

        {groups.map(({ space, items }) => {
          const isOpen = open === space.key;
          const panelId = `deep-clean-${space.key}`;
          return (
            <section key={space.key} className="flex flex-col gap-3">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="press flex h-16 items-center gap-3 rounded-row bg-sky-white px-3 text-left"
                type="button"
                onClick={() => setOpen(isOpen ? null : space.key)}
              >
                <SpaceTile space={space.key} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-bb-label text-sky-ink">
                    {space.label} · {items.length}곳
                  </span>
                  <span className="truncate text-bb-caption text-sky-muted">{isOpen && items[0] ? `${items[0].name}부터 가볍게 살펴봐요` : "눌러서 항목 펼치기"}</span>
                </span>
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center text-sky-deep">
                  <Icon name="chevron-down" className={`text-[18px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              {isOpen ? (
                <div id={panelId} className="flex flex-col gap-2">
                  {items.map((item) => {
                    const done = checked.has(item.id);
                    const recency = formatRecency(lastRecord(item.id, records)?.at);
                    return (
                      <div key={item.id} className="flex flex-col gap-2">
                        <CheckRow fill={space.color} label={item.name} on={done} onClick={() => toggle(item)} />
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
