import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { formatRecency, getActiveSpaces, getItems, itemStaleness, lastRecord, useRecords } from "../data/cleaning";
import { spaceTones as sharedSpaceTones } from "../data/spaceTones";

type CareStatus = "확인 필요" | "슬슬 확인" | "관리 중" | "아직 기록 없음";

type CareItem = {
  id: string;
  title: string;
  status: CareStatus;
  lastRecord: string;
  intervalDays: number;
};

type Space = {
  key: string;
  title: string;
  icon: string;
  tone: string;
  iconTone: string;
  items: CareItem[];
};

const getStatus = (staleness: number): CareStatus => {
  if (staleness === Infinity) return "아직 기록 없음";
  if (staleness >= 1.1) return "확인 필요";
  if (staleness >= 0.6) return "슬슬 확인";
  return "관리 중";
};

const statusTone: Record<CareStatus, string> = {
  "확인 필요": "bg-sky-white text-sky-ink border border-sky-brand",
  "슬슬 확인": "bg-sky-bg text-sky-ink border border-art-line",
  "관리 중": "bg-sky-tint text-sky-deep",
  "아직 기록 없음": "bg-sky-white text-sky-muted border border-art-line",
};

const getSummary = (items: CareItem[]) => {
  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { "확인 필요": 0, "슬슬 확인": 0, "관리 중": 0, "아직 기록 없음": 0 } as Record<CareStatus, number>,
  );

  return [
    counts["확인 필요"] ? `확인 필요 ${counts["확인 필요"]}` : null,
    counts["슬슬 확인"] ? `슬슬 확인 ${counts["슬슬 확인"]}` : null,
    counts["관리 중"] ? `관리 중 ${counts["관리 중"]}` : null,
    counts["아직 기록 없음"] ? `기록 없음 ${counts["아직 기록 없음"]}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
};

export default function Spaces() {
  const [selectedTab, setSelectedTab] = useState("전체 보기");
  const records = useRecords();
  // Spaces/items/recency all come from src/data/cleaning (ItemInfo edits + deletes applied there).
  const availableSpaces: Space[] = getActiveSpaces().map((space) => ({
    key: space.key,
    title: space.label,
    icon: space.icon,
    tone: sharedSpaceTones[space.key].fill,
    iconTone: sharedSpaceTones[space.key].text,
    items: getItems(space.key).map((item) => ({
      id: item.id,
      title: item.fullName,
      status: getStatus(itemStaleness(item, records)),
      lastRecord: formatRecency(lastRecord(item.id, records)?.at),
      intervalDays: item.intervalDays,
    })),
  }));
  const tabs = [{ key: "전체 보기", label: "전체 보기" }, ...availableSpaces.map((space) => ({ key: space.key, label: space.title }))];
  const visibleSpaces = selectedTab === "전체 보기" ? availableSpaces : availableSpaces.filter((space) => space.key === selectedTab);

  return (
    <PageShell>
      <AppHeader title="내 공간" back />
      <main className="flex flex-col bg-surface pb-[88px] pt-header">
        <div className="flex flex-col gap-space-md px-margin-screen pb-space-2xl">
          <div className="hide-scrollbar -mx-margin-screen overflow-x-auto px-margin-screen">
            <div className="flex min-w-max gap-space-xs">
              {tabs.map(({ key, label }) => {
                const active = selectedTab === key;
                return (
                  <button key={key} aria-pressed={active} className={`min-h-11 rounded-full px-4 py-2 text-label-md ${active ? "bg-sky-brand text-onbrand shadow-sm" : "border border-art-line bg-sky-white text-sky-muted"}`} type="button" onClick={() => setSelectedTab(key)}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {visibleSpaces.map((space) => (
            <section key={space.key} className="rounded-xl bg-sky-white p-space-md shadow-sm">
              <div className="mb-space-md flex items-start justify-between gap-space-sm">
                <div className="flex min-w-0 items-center gap-space-xs">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${space.tone} ${space.iconTone}`}>
                    <Icon name={space.icon} className="text-[22px]" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-title-md text-sky-ink">{space.title}</h2>
                    <p className="text-caption text-sky-muted">{getSummary(space.items)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-space-xs">
                {space.items.map((item) => (
                  <Link key={item.id} className="flex min-h-[68px] items-center justify-between rounded-xl bg-sky-bg p-3 transition-transform active:scale-[0.99]" to={`/item-info?space=${space.key}&item=${item.id}`}>
                    <div className="min-w-0">
                      <span className="block truncate text-title-sm text-sky-ink">{item.title}</span>
                      <p className="mt-0.5 truncate text-caption text-sky-muted">{item.lastRecord}</p>
                    </div>
                    <div className="ml-space-sm flex shrink-0 items-center gap-space-xs">
                      <span className={`rounded-full px-2.5 py-1 text-label-sm ${statusTone[item.status]}`}>{item.status}</span>
                      <Icon name="chevron_right" className="text-[20px] text-sky-muted" />
                    </div>
                  </Link>
                ))}
                <Link className="flex min-h-[60px] items-center justify-center gap-space-xs rounded-xl border border-dashed border-art-line bg-sky-white text-label-md text-sky-muted transition-transform active:scale-[0.99]" to={`/item-add?space=${space.key}`}>
                  <Icon name="add" className="text-[20px]" />
                  항목 추가
                </Link>
              </div>
            </section>
          ))}

          <section className="rounded-xl bg-sky-tint p-space-md shadow-sm">
            <h2 className="text-title-sm text-sky-ink">우리 집에 다른 공간도 있나요?</h2>
            <p className="mt-1 text-body-md text-sky-muted">베란다, 드레스룸처럼 필요한 공간은 1개당 300P로 확장할 수 있어요.</p>
            <Link className="mt-space-sm flex min-h-11 w-full items-center justify-center gap-space-xs rounded-lg border border-sky-brand bg-sky-white px-space-sm text-label-md text-sky-deep transition-transform duration-[120ms] active:scale-[0.98]" to="/space-manage">
              <Icon name="add" className="text-[20px]" />
              공간 추가 · 300P
            </Link>
          </section>

          {visibleSpaces.length === 0 ? (
            <section className="rounded-xl bg-sky-white p-space-lg shadow-sm">
              <p className="text-title-sm text-sky-ink">이 공간에는 아직 관리 항목이 없어요.</p>
              <p className="mt-1 text-body-md text-sky-muted">관리할 곳을 추가하면 이 화면에서 모아볼 수 있어요.</p>
            </section>
          ) : null}
        </div>
      </main>
    </PageShell>
  );
}
