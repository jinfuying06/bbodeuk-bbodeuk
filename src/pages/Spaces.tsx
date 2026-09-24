import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import SpaceTile from "../components/SpaceTile";
import { formatRecency, getActiveSpaces, getItems, isSpaceKey, itemFade, lastRecord, spaceColor, useRecords, type SpaceKey } from "../data/cleaning";

export default function Spaces() {
  const records = useRecords();
  const spaces = getActiveSpaces();
  const requested = useSearchParams()[0].get("space");
  const [open, setOpen] = useState<SpaceKey | null>(isSpaceKey(requested) && spaces.some((space) => space.key === requested) ? requested : spaces[0]?.key ?? null);

  return (
    <PageShell>
      <AppHeader title="내 공간" back />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title={<>공간마다 쌓이는<br />작은 돌봄</>} body="오늘은 어디부터 살펴볼까요?" className="pb-4" />

        {spaces.map((space) => {
          const items = getItems(space.key);
          const expanded = open === space.key;
          return (
            <section key={space.key} className="flex flex-col gap-3">
              <button
                aria-controls={`space-panel-${space.key}`}
                aria-expanded={expanded}
                className="press flex h-[72px] w-full items-center gap-3 rounded-row bg-sky-white px-3 text-left"
                type="button"
                onClick={() => setOpen(expanded ? null : space.key)}
              >
                <SpaceTile space={space.key} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-bb-label text-sky-ink">{space.label}</span>
                  <span className="text-bb-caption text-sky-muted">{items.length}개 항목</span>
                </span>
                <Icon name="chevron-down" className={`ml-auto mr-3 shrink-0 text-[18px] text-sky-deep transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
              </button>

              {expanded ? (
                <div id={`space-panel-${space.key}`} className="flex flex-col gap-2 rounded-row border bg-sky-white p-3" style={{ borderColor: space.color }}>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      className="press flex h-11 items-center justify-between rounded-xl px-[10px]"
                      style={{ backgroundColor: spaceColor(space.key, itemFade(item, records)) }}
                      to={`/item-info?item=${item.id}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: space.iconColor }} />
                        <span className="truncate text-bb-label text-sky-ink">{item.name}</span>
                      </span>
                      <span className="shrink-0 pl-2 text-bb-caption text-sky-muted">{formatRecency(lastRecord(item.id, records)?.at, { short: true })}</span>
                    </Link>
                  ))}
                  <Link className="press flex h-11 items-center justify-center rounded-tile text-bb-label font-bold text-sky-deep" style={{ backgroundColor: space.color }} to={`/quick-record?filter=space&space=${space.key}`}>
                    {space.label} 기록하기
                  </Link>
                </div>
              ) : null}
            </section>
          );
        })}

        <GlassButton variant="secondary" className="w-full" to="/space-manage">
          공간 관리하기
        </GlassButton>
        <Link className="text-link" to="/item-add">
          <Icon name="plus" className="mr-1.5 text-[16px]" />
          새 청소 항목
        </Link>
      </main>
    </PageShell>
  );
}
