import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { daysAgo, getActiveSpaces, getItems, itemFade, lastRecord, spaceColor, useRecords, type SpaceKey } from "../data/cleaning";

/** Figma 07 short recency: 오늘 · N일 전 · 기록 없음. */
const shortRecency = (at: string | undefined) => {
  if (!at) return "기록 없음";
  const days = daysAgo(at);
  return days <= 0 ? "오늘" : `${days}일 전`;
};

export default function Spaces() {
  const records = useRecords();
  const spaces = getActiveSpaces();
  const [open, setOpen] = useState<SpaceKey | null>(spaces[0]?.key ?? null);

  return (
    <PageShell>
      <AppHeader title="내 공간" back />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        <div className="flex flex-col gap-2 pb-4">
          <h1 className="text-bb-heading text-sky-ink">
            공간마다 쌓이는
            <br />
            작은 돌봄
          </h1>
          <p className="text-bb-body text-sky-muted">오늘은 어디부터 살펴볼까요?</p>
        </div>

        {spaces.map((space) => {
          const items = getItems(space.key);
          const expanded = open === space.key;
          return (
            <section key={space.key} className="flex flex-col gap-3">
              <button
                aria-controls={`space-panel-${space.key}`}
                aria-expanded={expanded}
                className="press flex h-[72px] w-full items-center gap-3 rounded-[18px] bg-sky-white px-3 text-left"
                type="button"
                onClick={() => setOpen(expanded ? null : space.key)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: space.color, color: space.iconColor }}>
                  <Icon name={space.icon} className="text-[24px]" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-bb-label text-sky-ink">{space.label}</span>
                  <span className="text-bb-caption text-sky-muted">{items.length}개 항목</span>
                </span>
                <svg aria-hidden="true" className={`ml-auto mr-3 h-[18px] w-[18px] shrink-0 text-sky-deep transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5" />
                </svg>
              </button>

              {expanded ? (
                <div id={`space-panel-${space.key}`} className="flex flex-col gap-2 rounded-[18px] border bg-sky-white p-3" style={{ borderColor: space.color }}>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      className="press flex h-11 items-center justify-between rounded-xl px-[10px]"
                      style={{ backgroundColor: spaceColor(space.key, itemFade(item, records)) }}
                      to={`/item-info?item=${item.id}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: space.color }} />
                        <span className="truncate text-[14px] font-medium leading-5 text-sky-ink">{item.name}</span>
                      </span>
                      <span className="shrink-0 pl-2 text-[11px] leading-[17px] text-sky-muted">{shortRecency(lastRecord(item.id, records)?.at)}</span>
                    </Link>
                  ))}
                  <Link className="press flex h-11 items-center justify-center rounded-[14px] text-[14px] font-bold leading-5 text-sky-deep" style={{ backgroundColor: space.color }} to={`/quick-record?filter=space&space=${space.key}`}>
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
        <Link className="flex h-11 items-center justify-center text-bb-label text-sky-deep" to="/item-add">
          ＋ 새 청소 항목
        </Link>
      </main>
    </PageShell>
  );
}
