import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";
import ItemRow from "../components/ItemRow";
import { getSpace } from "../data/cleaning";
import { GUIDES, type Guide } from "./CareAction";

type Filter = "전체" | Guide["filter"];

const filters: Array<[Filter, string]> = [
  ["전체", "w-[68px]"],
  ["욕실", "w-[76px]"],
  ["주방", "w-[76px]"],
  ["생활 팁", "w-[98px]"],
];

/** Figma 14 / 청소 가이드 (29:742). */
export default function Care() {
  const [filter, setFilter] = useState<Filter>("전체");
  // 세면대 is the featured card; the list holds the rest.
  const list = GUIDES.slice(1).filter((guide) => filter === "전체" || guide.filter === filter);

  return (
    <PageShell>
      <AppHeader title="청소 가이드" />
      <main className="flex flex-col gap-[10px] px-margin-screen pb-nav pt-header">
        <PageIntro title="작은 청소, 쉽게 시작해요" body="익숙하지 않아도 괜찮아요. 하나씩 함께해요." />

        <Link aria-label="추천 가이드: 세면대부터 산뜻하게" className="press flex min-h-[206px] flex-col gap-2 rounded-3xl bg-sky-tint pb-4 pl-5 pr-5 pt-4" to="/care-action?item=basin">
          <span className="whitespace-pre text-bb-caption text-sky-deep">{"오늘의 가벼운 청소  ·  약 3분"}</span>
          <span className="flex h-[120px] items-center justify-between">
            <span className="flex w-[172px] flex-col gap-1.5">
              <span className="text-bb-heading text-sky-ink">
                세면대부터
                <br />
                산뜻하게
              </span>
              <span className="text-bb-caption text-sky-muted">물때가 쌓이기 전, 가볍게.</span>
            </span>
            <Icon name="object-sink" className="text-[72px]" />
          </span>
          <span className="flex items-center text-bb-label text-sky-deep">
            청소 방법 보기
            <Icon name="chevron-right" className="ml-1.5 text-[14px]" />
          </span>
        </Link>

        <div aria-label="가이드 필터" className="flex gap-2" role="group">
          {filters.map(([key, width]) => (
            <Pill key={key} className={`${width} !px-0`} selected={filter === key} size={38} onClick={() => setFilter(key)}>
              {key}
            </Pill>
          ))}
        </div>

        <h2 className="text-bb-title text-sky-ink">나에게 필요한 청소법</h2>
        {list.map((guide) => (
          <ItemRow key={guide.id} height={72} space={guide.space} sub={`${getSpace(guide.space).label} · 약 ${guide.minutes}분`} title={guide.listTitle} to={`/care-action?item=${guide.id}`} />
        ))}
      </main>
    </PageShell>
  );
}
