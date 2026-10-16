import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import Toast, { useToast } from "../components/Toast";
import { getItem, getSpace, isRecordedToday, objectArtVars, spaceColor, toggleTodayRecord, useRecords } from "../data/cleaning";
import { GUIDES } from "../data/guides";

export default function CareAction() {
  const [searchParams] = useSearchParams();
  const guide = GUIDES.find((entry) => entry.id === searchParams.get("item")) ?? GUIDES[0];
  const space = getSpace(guide.space);
  const item = getItem(guide.id);
  const recorded = isRecordedToday(guide.id, useRecords());
  const [toast, showToast] = useToast();

  // Same toggle as QuickRecord: recorded today (from any screen) → the tap cancels it.
  const toggle = () => showToast(toggleTodayRecord(guide.id) === "added" ? "청소 기록을 저장했어요" : "청소 기록을 취소했어요");

  return (
    <PageShell>
      <AppHeader title="청소 가이드" back="/care" />
      {/* 2026-10-16 layout: item art hero → 준비물 chips → numbered steps (the main block) → record. Same for every guide. */}
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header" style={objectArtVars(space.key, "filled")}>
        <PageIntro title={guide.title} body={`${space.label} · 약 ${guide.minutes}분 · 가벼운 청소`} />

        <div className="flex h-[132px] items-center justify-center rounded-3xl" style={{ backgroundColor: spaceColor(space.key, 0.5) }}>
          <Icon name={item?.icon ?? space.icon} className="text-[64px]" />
        </div>

        <section aria-label="준비물" className="flex flex-col gap-2 pt-3">
          <h2 className="text-bb-label text-sky-ink">준비물</h2>
          <ul className="flex flex-wrap gap-2">
            {guide.materials.map((label) => (
              <li key={label} className="rounded-full bg-sky-surface px-3 py-1.5 text-bb-label-sm text-sky-ink">
                {label}
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="청소 단계" className="flex flex-col pt-3">
          <h2 className="pb-1 text-bb-label text-sky-ink">이렇게 해요</h2>
          <ol className="flex flex-col divide-y divide-sky-line">
            {guide.steps.map(([stepTitle, desc], index) => (
              <li key={stepTitle} className="flex gap-3 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-tint text-bb-label-sm font-bold text-sky-deep">{index + 1}</span>
                <span className="flex min-w-0 flex-col gap-1 pt-0.5">
                  <h3 className="text-bb-label font-bold text-sky-ink">{stepTitle}</h3>
                  <p className="text-bb-caption text-sky-muted">{desc}</p>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <GlassButton variant={recorded ? "secondary" : "primary"} aria-pressed={recorded} onClick={toggle}>
          {recorded ? "오늘 기록했어요 · 기록 취소" : "청소했어요 · 기록하기"}
        </GlassButton>
        <Link className="text-link" to="/care">
          다른 청소법 보기
        </Link>
      </main>
      <Toast message={toast} visible={Boolean(toast)} />
    </PageShell>
  );
}
