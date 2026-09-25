import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import Toast, { useToast } from "../components/Toast";
import { getSpace, isRecordedToday, toggleTodayRecord, useRecords } from "../data/cleaning";
import { GUIDES } from "../data/guides";

// Figma reuses bath object art as placeholder 준비물 tiles (바닥/배수구/거울).
const materialArt = ["object-floor", "object-drain", "object-mirror"];

export default function CareAction() {
  const [searchParams] = useSearchParams();
  const guide = GUIDES.find((entry) => entry.id === searchParams.get("item")) ?? GUIDES[0];
  const space = getSpace(guide.space);
  const title = `${space.label} · ${guide.title}`;
  const recorded = isRecordedToday(guide.id, useRecords());
  const [toast, showToast] = useToast();

  // Same toggle as QuickRecord: recorded today (from any screen) → the tap cancels it.
  const toggle = () => showToast(toggleTodayRecord(guide.id) === "added" ? "청소 기록을 저장했어요" : "청소 기록을 취소했어요");

  return (
    <PageShell>
      <AppHeader title={title} back="/care" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title={title} body={guide.intro} />

        {guide.id === "basin" ? (
          <div className="flex h-[116px] items-center justify-center rounded-2xl" style={{ backgroundColor: space.color }}>
            <Icon name="object-sink" className="text-[70px]" />
          </div>
        ) : null}

        <ul aria-label="준비물" className="flex gap-[10px] pb-3">
          {guide.materials.map((label, index) => (
            <li key={label} className="flex h-[104px] flex-1 flex-col items-center justify-center gap-1.5 rounded-row border bg-sky-white" style={{ borderColor: space.color }}>
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-row-sm" style={{ backgroundColor: space.color }}>
                <Icon name={materialArt[index]} className="text-[34px]" />
              </span>
              <span className="w-[88px] text-center text-bb-caption font-medium text-sky-ink">{label}</span>
            </li>
          ))}
        </ul>

        <ol className="flex flex-col gap-3">
          {guide.steps.map(([stepTitle, desc], index) =>
            // 15 세면대 keeps its own (older) 78px step card; 40/41/42 use the 94px one.
            guide.id === "basin" ? (
              <li key={stepTitle} className="flex min-h-[78px] items-center gap-3 rounded-row bg-sky-white py-[10px] pl-4 pr-4">
                <span className="text-bb-title text-sky-deep">{`0${index + 1}`}</span>
                <span className="flex min-w-0 flex-col gap-1 self-start">
                  <h2 className="text-bb-label text-sky-ink">{stepTitle}</h2>
                  <span className="text-bb-caption text-sky-muted">{desc}</span>
                </span>
              </li>
            ) : (
              <li key={stepTitle} className="flex min-h-[94px] flex-col gap-2 rounded-3xl bg-sky-white px-5 pb-4 pt-4">
                <h2 className="whitespace-pre text-bb-title text-sky-ink">{`0${index + 1}  ${stepTitle}`}</h2>
                <p className="text-bb-body text-sky-muted">{desc}</p>
              </li>
            ),
          )}
        </ol>

        <GlassButton variant={recorded ? "secondary" : "primary"} aria-pressed={recorded} onClick={toggle}>
          {recorded ? "오늘 기록했어요 · 기록 취소" : "청소했어요 · 기록하기"}
        </GlassButton>
        {guide.id === "basin" ? (
          <Link className="text-link" to="/care">
            다른 청소법 보기
          </Link>
        ) : null}
      </main>
      <Toast message={toast} visible={Boolean(toast)} />
    </PageShell>
  );
}
