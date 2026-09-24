import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import PageShell from "../components/PageShell";
import { readPoints } from "../data/points";

const SPACE_PRICE = 300;
const packages = [300, 500, 1000];

function hasCompletedSetup(): boolean {
  try {
    return window.localStorage.getItem("bbodeuk.setup.v1") !== null;
  } catch {
    return false;
  }
}

/** Sky / Dialog (Figma 31:1908) — 32:1098 구매 안내. */
function PurchaseDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-scrim px-margin-screen" role="presentation" onClick={onClose}>
      <section
        aria-labelledby="purchase-dialog-title"
        aria-modal="true"
        ref={dialogRef}
        tabIndex={-1}
        className="flex w-full max-w-[342px] flex-col gap-4 rounded-2xl bg-sky-white px-5 outline-none pb-[22px] pt-[22px]"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="purchase-dialog-title" className="text-bb-title text-sky-ink">
          포인트 구매는 준비 중이에요
        </h2>
        <p className="text-bb-body text-sky-muted">
          현재는 결제 화면 미리보기예요.
          <br />
          실제 결제나 포인트 차감은 발생하지 않아요.
        </p>
        <GlassButton onClick={onClose}>
          확인했어요
        </GlassButton>
        <button className="h-11 text-bb-label text-sky-deep" type="button" onClick={onClose}>
          취소
        </button>
      </section>
    </div>
  );
}

/** 64:4983 Flow / 포인트 확인 — shown for `/points?intent=short` (space add with too few points). */
function PointsShort() {
  return (
    <PageShell bottomNav={false}>
      <AppHeader title="포인트 확인" back right={null} />
      <main className="flex flex-col gap-3 px-margin-screen pb-5 pt-header">
        <h1 className="pt-5 text-bb-heading text-sky-ink">포인트가 조금 모자라요</h1>
        <p className="text-bb-body text-sky-muted">새 공간에 필요한 포인트와 보유 포인트를 확인해 주세요. 포인트는 차감되지 않았어요.</p>
        <p className="text-bb-label text-sky-deep">
          필요 {SPACE_PRICE}P&nbsp;&nbsp;·&nbsp;&nbsp;보유 {readPoints().toLocaleString()}P
        </p>
        <GlassButton size={52} to="/points">
          내 포인트 보기
        </GlassButton>
        <GlassButton size={52} variant="secondary" to="/space-manage">
          공간 관리로
        </GlassButton>
      </main>
    </PageShell>
  );
}

export default function Points() {
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState(300);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (searchParams.get("intent") === "short") return <PointsShort />;

  const balance = readPoints();
  const openable = Math.floor(balance / SPACE_PRICE);

  return (
    <PageShell bottomNav={hasCompletedSetup()}>
      <AppHeader title="내 포인트" back />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <div className="flex h-[88px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">필요한 공간을 더해요</h1>
          <p className="text-bb-body text-sky-muted">포인트는 추가 공간을 열 때 사용해요.</p>
        </div>

        <section className="flex h-[124px] flex-col gap-1.5 rounded-3xl bg-sky-tint pl-5 pt-[18px]">
          <p className="text-bb-label text-sky-muted">보유 포인트</p>
          <p className="text-bb-display text-sky-deep">{balance.toLocaleString()} P</p>
          <p className="text-bb-caption text-sky-muted">
            {openable > 0 ? `추가 공간 ${openable}개를 열 수 있어요` : `${SPACE_PRICE}P가 모이면 추가 공간을 열 수 있어요`}
          </p>
        </section>

        <GlassButton variant="secondary" to="/space-manage">
          추가 공간 살펴보기
        </GlassButton>

        <h2 className="text-bb-title text-sky-ink">포인트 충전</h2>
        <div aria-label="충전 패키지" className="flex gap-[9px]" role="group">
          {packages.map((amount) => (
            <button
              key={amount}
              aria-pressed={selectedPackage === amount}
              className={`h-[72px] flex-1 rounded-full text-bb-label transition-colors duration-150 ${selectedPackage === amount ? "bg-sky-brand text-onbrand" : "bg-sky-white text-sky-muted"}`}
              type="button"
              onClick={() => setSelectedPackage(amount)}
            >
              {amount.toLocaleString()}P
            </button>
          ))}
        </div>

        <GlassButton onClick={() => setDialogOpen(true)}>선택한 포인트 구매하기</GlassButton>
      </main>
      {dialogOpen ? <PurchaseDialog onClose={() => setDialogOpen(false)} /> : null}
    </PageShell>
  );
}
