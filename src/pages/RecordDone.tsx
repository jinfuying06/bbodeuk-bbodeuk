import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { getItem, getSpace, isRecordedToday, todaysRecords, toggleTodayRecord, useRecords } from "../data/cleaning";

/** Figma 09 / 기록 완료 (29:520) — large sink line art. */
function CleanSink() {
  return (
    <svg aria-hidden="true" className="absolute left-[45px] top-[18.5px] h-[104px] w-[97px]" fill="none" viewBox="0 0 99.5 106.532">
      <g className="stroke-art-line" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3">
        <path d="M1.15 49.4305H98.35V65.6744C98.35 92.7476 1.15 92.7476 1.15 65.6744V49.4305Z" className="fill-sky-white" />
        <path d="M49.75 67.4793C76.591 67.4793 98.35 59.3986 98.35 49.4305C98.35 39.4624 76.591 31.3817 49.75 31.3817C22.909 31.3817 1.15 39.4624 1.15 49.4305C1.15 59.3986 22.909 67.4793 49.75 67.4793Z" className="fill-sky-tint" />
        <path d="M49.75 34.9915V13.3329C49.75 -2.91098 80.35 -2.91098 80.35 13.3329V22.3573M44.35 78.3085V105.382H67.75" />
      </g>
    </svg>
  );
}

/** Figma 물빛 반짝임 52×66. */
function WaterSparkle() {
  return (
    <svg aria-hidden="true" className="absolute left-[236px] top-[33px] h-[66px] w-[52px]" fill="none" viewBox="0 0 52 66">
      <path d="M27 4L31 16L43 20L31 24L27 36L23 24L11 20L23 16L27 4Z" className="fill-sky-white stroke-art-line" strokeWidth="1.8" />
      <circle cx="9" cy="48" className="fill-sky-white stroke-art-line" r="6" strokeWidth="1.5" />
      <circle className="fill-sky-sky" cx="43" cy="50" r="3" />
    </svg>
  );
}

export default function RecordDone() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const records = useRecords();
  const item = getItem(searchParams.get("item")) ?? getItem(todaysRecords(records)[0]?.itemId);
  if (!item) return <Navigate replace to="/quick-record" />;

  const space = getSpace(item.space);
  const backToRecord = `/quick-record?filter=space&space=${item.space}`;

  const undo = () => {
    if (isRecordedToday(item.id, records)) toggleTodayRecord(item.id);
    navigate(backToRecord, { replace: true, state: { toast: "청소 기록을 취소했어요" } });
  };

  return (
    <PageShell>
      <AppHeader title="기록 완료" />
      <main className="flex flex-col gap-4 px-margin-screen pb-nav pt-header">
        <div className="relative flex h-[220px] flex-col items-center justify-center rounded-3xl bg-sky-tint">
          <div className="relative h-[148px] w-[180px]">
            {item.id === "basin" ? (
              <CleanSink />
            ) : (
              <Icon name={item.icon} className={`absolute left-1/2 top-3 -translate-x-1/2 ${item.icon.startsWith("object-") ? "text-[96px]" : "text-[88px] text-art-line"}`} />
            )}
          </div>
          <p className="flex items-center gap-1.5 text-bb-label text-sky-deep">
            <Icon name="check" className="text-[16px]" />
            {item.name} 기록 완료
          </p>
          <WaterSparkle />
        </div>

        <h1 className="text-center text-bb-heading text-sky-ink">
          {space.label}에 맑은 색을
          <br />
          채웠어요
        </h1>
        <p className="text-center text-bb-body text-sky-muted">작은 청소 하나로, 오늘의 공간이 산뜻해졌어요.</p>

        <GlassButton to={backToRecord}>다른 곳도 기록하기</GlassButton>
        {/* 44px tap boxes, negative margins keep Figma 16px text-to-text gaps (29:520). */}
        <Link className="text-link -my-[11px]" to="/home">
          홈으로 돌아가기
        </Link>
        <button className="-my-[13px] flex h-11 items-center justify-center whitespace-pre text-bb-caption text-sky-muted" type="button" onClick={undo}>
          {"잘못 눌렀나요?  기록 취소"}
        </button>
      </main>
    </PageShell>
  );
}
