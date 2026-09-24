import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { getItems, getSpace, isSpaceKey } from "../data/cleaning";
import { readPoints } from "../data/points";

const SPACE_PRICE = 300;

/** Figma 34:2025 `43 / 공간 추가 완료` — reached from 공간 관리 after confirming 32:1012. */
export default function SpaceAdded() {
  const [params] = useSearchParams();
  const requested = params.get("space");
  const space = getSpace(isSpaceKey(requested) ? requested : "terrace");
  const balance = readPoints();
  const subject = `${space.label}${/[가-힣]/.test(space.label) && (space.label.charCodeAt(space.label.length - 1) - 0xac00) % 28 !== 0 ? "이" : "가"}`;

  return (
    <PageShell>
      <AppHeader title="공간 추가 완료" back="/space-manage" />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        <div className="flex flex-col gap-2 pb-6">
          <h1 className="text-bb-heading text-sky-ink">{subject} 생겼어요</h1>
          <p className="text-bb-body text-sky-muted">내 집의 새로운 공간을 준비했어요.</p>
        </div>

        <div role="status" className="flex min-h-[140px] flex-col gap-2 rounded-2xl bg-sky-tint px-5 pb-[18px] pt-[18px]">
          <span aria-hidden="true" className="text-bb-title text-sky-deep">
            ✓
          </span>
          <h2 className="text-bb-title text-sky-ink">새 공간을 추가했어요</h2>
          <p className="text-bb-body text-sky-muted">{space.label}의 작은 돌봄을 기록해보세요.</p>
        </div>

        <Link className="press flex h-[72px] items-center gap-3 rounded-[18px] bg-sky-white px-3" to={`/space-info?space=${space.key}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: space.color, color: space.iconColor }}>
            <Icon name={space.icon} className="text-[24px]" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-bb-label text-sky-ink">{space.label}</span>
            <span className="truncate text-bb-caption text-sky-muted">{getItems(space.key).map((item) => item.name).join(" · ")}</span>
          </span>
          <span aria-hidden="true" className="ml-auto shrink-0 pl-2 pr-2 text-bb-title text-sky-deep">
            ›
          </span>
        </Link>

        <section className="flex flex-col gap-2 rounded-3xl bg-sky-tint px-5 pb-4 pt-4">
          <h2 className="text-bb-title text-sky-ink">보유 포인트 {balance.toLocaleString()}P</h2>
          <p className="text-bb-body text-sky-muted">
            {(balance + SPACE_PRICE).toLocaleString()}P에서 공간 추가에 {SPACE_PRICE}P를 사용했어요.
          </p>
        </section>

        <GlassButton className="w-full" to="/spaces">
          내 공간으로 돌아가기
        </GlassButton>
      </main>
    </PageShell>
  );
}
