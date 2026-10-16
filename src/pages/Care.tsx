import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";
import ItemRow, { RowList } from "../components/ItemRow";
import { getItem, getSpace, objectArtVars, spaceColor } from "../data/cleaning";
import { GUIDES, type Guide } from "../data/guides";

type Filter = "전체" | Guide["filter"];

const filters: Filter[] = ["전체", "욕실", "주방", "생활 팁"];

/** Figma 14 / 청소 가이드 (29:742). */
export default function Care() {
  const [filter, setFilter] = useState<Filter>("전체");
  // 세면대 is the featured card; the list holds the rest.
  const list = GUIDES.slice(1).filter((guide) => filter === "전체" || guide.filter === filter);

  return (
    <PageShell>
      <AppHeader title="가이드" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title="작은 청소, 쉽게 시작해요" body="하나씩 따라 하면 돼요." />

        <Link aria-label="추천 가이드: 세면대부터 산뜻하게" className="press flex min-h-[206px] flex-col gap-2 rounded-3xl pb-4 pl-5 pr-5 pt-4"
          // Featured card wears its space color at 50% (2026-10-16): 세면대 → 욕실.
          style={{ ...objectArtVars("bathroom", "filled"), backgroundColor: spaceColor("bathroom", 0.5) }}
          to="/care-action?item=basin"
        >
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
          {filters.map((key) => (
            <Pill key={key} className="min-w-0 flex-1 !px-0" selected={filter === key} size={38} onClick={() => setFilter(key)}>
              {key}
            </Pill>
          ))}
        </div>

        <h2 className="text-bb-title text-sky-ink">나에게 필요한 청소법</h2>
        <RowList>
          {list.map((guide) => (
            <ItemRow key={guide.id} list chevron="muted" height={72} icon={getItem(guide.id)?.icon} meta={`약 ${guide.minutes}분`} space={guide.space} sub={getSpace(guide.space).label} title={guide.listTitle} to={`/care-action?item=${guide.id}`} />
          ))}
        </RowList>
      </main>
    </PageShell>
  );
}
