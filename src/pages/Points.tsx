import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Dialog from "../components/Dialog";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";
import Toast, { useToast } from "../components/Toast";
import { addPoints, readPoints, SPACE_PRICE } from "../data/points";
import { hasCompletedSetup } from "../data/setup";

const packages = [300, 500, 1000];

/** 64:4983 Flow / 포인트 확인 — shown for `/points?intent=short` (space add with too few points). */
function PointsShort() {
  return (
    <PageShell bottomNav={false}>
      <AppHeader title="포인트 확인" back right={null} />
      <main className="flex flex-col gap-3 px-margin-screen pb-5 pt-header-flow">
        <h1 className="text-bb-heading text-sky-ink">포인트가 조금 모자라요</h1>
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
  const [paying, setPaying] = useState(false);
  const [balance, setBalance] = useState(readPoints);
  const [toast, showToast] = useToast();
  const payTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(payTimer.current), []);

  if (searchParams.get("intent") === "short") return <PointsShort />;

  // Mock checkout: short "결제 중" beat, then the balance really increases (localStorage via addPoints).
  const purchase = () => {
    if (paying) return;
    setPaying(true);
    payTimer.current = window.setTimeout(() => {
      setBalance(addPoints(selectedPackage));
      setPaying(false);
      setDialogOpen(false);
      showToast(`${selectedPackage.toLocaleString()}P를 충전했어요`);
    }, 900);
  };
  const openable = Math.floor(balance / SPACE_PRICE);

  return (
    <PageShell bottomNav={hasCompletedSetup()}>
      <AppHeader title="내 포인트" back />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title="필요한 공간을 더해요" body="포인트는 추가 공간을 열 때 사용해요." />

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
            <Pill key={amount} className="flex-1" selected={selectedPackage === amount} size={72} onClick={() => setSelectedPackage(amount)}>
              {amount.toLocaleString()}P
            </Pill>
          ))}
        </div>

        <GlassButton onClick={() => setDialogOpen(true)}>선택한 포인트 구매하기</GlassButton>
      </main>
      {/* 32:1098 구매 안내 → mock purchase confirm */}
      <Dialog
        body={
          <>
            보유 {balance.toLocaleString()}P → <span className="text-sky-deep">{(balance + selectedPackage).toLocaleString()}P</span>
            <br />
            충전한 포인트는 추가 공간을 열 때 쓸 수 있어요.
          </>
        }
        open={dialogOpen}
        primaryLabel={paying ? "결제하는 중…" : `${selectedPackage.toLocaleString()}P 구매하기`}
        title={`${selectedPackage.toLocaleString()}P를 충전할까요?`}
        onClose={() => {
          if (!paying) setDialogOpen(false);
        }}
        onPrimary={purchase}
      />
      <Toast message={toast} visible={Boolean(toast)} />
    </PageShell>
  );
}
