import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import GlassButton from "../components/GlassButton";
import ItemRow from "../components/ItemRow";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import { getItems, getSpace, isSpaceKey } from "../data/cleaning";
import { particle } from "../data/josa";

/** Figma 34:2025 `43 / 공간 추가 완료` — reached from 공간 관리 after confirming 32:1012. */
export default function SpaceAdded() {
  const [params] = useSearchParams();
  const requested = params.get("space");
  const space = getSpace(isSpaceKey(requested) ? requested : "terrace");
  const subject = `${space.label}${particle(space.label, "이/가")}`;

  return (
    <PageShell>
      <AppHeader title="공간 추가 완료" back="/space-manage" />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title={<>{subject} 생겼어요</>} body="내 집의 새로운 공간을 준비했어요." className="pb-6" />

        <div role="status" className="flex min-h-[140px] flex-col gap-2 rounded-2xl bg-sky-tint px-5 pb-[18px] pt-[18px]">
          <Icon name="check" className="text-[22px] text-sky-deep" />
          <h2 className="text-bb-title text-sky-ink">새 공간을 추가했어요</h2>
          <p className="text-bb-body text-sky-muted">{space.label}의 작은 돌봄을 기록해보세요.</p>
        </div>

        <ItemRow height={72} space={space.key} sub={getItems(space.key).map((item) => item.name).join(" · ")} title={space.label} to={`/space-info?space=${space.key}`} />

        <GlassButton className="w-full" to="/spaces">
          내 공간으로 돌아가기
        </GlassButton>
      </main>
    </PageShell>
  );
}
