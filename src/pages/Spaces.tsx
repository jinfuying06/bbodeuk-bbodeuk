import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import SpaceTile from "../components/SpaceTile";
import { formatRecency, getActiveSpaces, getItems, isSpaceKey, itemFade, lastRecord, metaTextOnFill, spaceFill, useRecords, type SpaceKey } from "../data/cleaning";

export default function Spaces() {
  const records = useRecords();
  const spaces = getActiveSpaces();
  const requested = useSearchParams()[0].get("space");
  const [open, setOpen] = useState<SpaceKey | null>(isSpaceKey(requested) && spaces.some((space) => space.key === requested) ? requested : spaces[0]?.key ?? null);

  return (
    <PageShell>
      <AppHeader title="공간" />
      <main className="flex flex-1 flex-col px-margin-screen pb-nav pt-header">
        <PageIntro title="공간마다 쌓이는 작은 돌봄" body="오늘은 어디부터 살펴볼까요?" className="pb-3" />

        {spaces.map((space) => {
          const items = getItems(space.key);
          const expanded = open === space.key;
          return (
            // List-style accordion (2026-10-15): no Surface card, a hairline under each space.
            <section key={space.key} className="flex flex-col border-b border-sky-line">
              <button
                aria-controls={`space-panel-${space.key}`}
                aria-expanded={expanded}
                className="press flex h-[72px] w-full items-center gap-3 text-left"
                type="button"
                onClick={() => setOpen(expanded ? null : space.key)}
              >
                <SpaceTile space={space.key} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-bb-label text-sky-ink">{space.label}</span>
                  <span className="text-bb-caption text-sky-muted">{items.length}개 항목</span>
                </span>
                <Icon name="chevron-down" className={`ml-auto mr-1 shrink-0 text-[18px] text-sky-deep transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
              </button>

              {expanded ? (
                <div id={`space-panel-${space.key}`} className="flex flex-col gap-2 pb-4 pl-[52px]">
                  {items.map((item) => {
                    const fade = itemFade(item, records);
                    return (
                      <Link
                        key={item.id}
                        // Never-recorded rows: faint Surface so the row still reads as a row on the white page.
                        className="press relative flex h-11 items-center justify-between overflow-hidden rounded-xl bg-sky-surface px-[10px] transition-colors duration-500"
                        // Recency as the row color fading (2026-10-17): whole row at the fade level, no water bar (read like progress bars).
                        style={{ backgroundColor: fade > 0 ? spaceFill(space.key, fade) : undefined }}
                        to={`/item-info?item=${item.id}`}
                      >
                        <span className="relative min-w-0 truncate text-bb-label text-sky-ink">{item.name}</span>
                        <span className={`relative shrink-0 pl-2 text-bb-caption ${metaTextOnFill(space.key)}`}>{formatRecency(lastRecord(item.id, records)?.at, { short: true })}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}

        <GlassButton variant="secondary" className="mt-6 w-full" to="/space-manage">
          공간 관리하기
        </GlassButton>
        <Link className="text-link mt-3" to="/item-add">
          <Icon name="plus" className="mr-1.5 text-[16px]" />
          새 청소 항목
        </Link>
      </main>
    </PageShell>
  );
}
