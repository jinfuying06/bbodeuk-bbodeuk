import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Toast from "../components/Toast";
import { readPoints } from "../data/points";

const SPACE_PRICE = 300;
const packages = [300, 500, 1000];

function revealOnlyIfNeeded(section: HTMLElement | null) {
  if (!section) return;
  const rect = section.getBoundingClientRect();
  const visibleTop = 80;
  const visibleBottom = window.innerHeight - 80;

  if (rect.top >= visibleTop && rect.bottom <= visibleBottom) return;

  const offset = rect.top < visibleTop ? rect.top - visibleTop : rect.bottom - visibleBottom;
  window.scrollBy({ top: offset, behavior: "smooth" });
}

export default function Points() {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent");
  const balance = readPoints();
  const [selectedPackage, setSelectedPackage] = useState(300);
  const [showToast, setShowToast] = useState(false);
  const itemSection = useRef<HTMLElement>(null);
  const purchaseSection = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (intent !== "space" && intent !== "charge") return;

    const frame = window.requestAnimationFrame(() => {
      const target = intent === "charge" || balance < SPACE_PRICE ? purchaseSection : itemSection;
      revealOnlyIfNeeded(target.current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [balance, intent]);

  const showComingSoon = () => {
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2400);
  };

  const handleSpacePurchase = () => {
    if (balance < SPACE_PRICE) {
      revealOnlyIfNeeded(purchaseSection.current);
      return;
    }
    showComingSoon();
  };

  return (
    <PageShell>
      <AppHeader title="내 포인트" />
      <main className="flex flex-col gap-space-xl bg-surface px-margin-screen pb-[104px] pt-header-lg">
        <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="flex items-center gap-space-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <Icon name="toll" className="text-[26px]" />
            </span>
            <div>
              <p className="text-label-sm text-on-surface-variant">보유 포인트</p>
              <h1 className="mt-1 text-headline-lg text-on-surface">{balance.toLocaleString()}P</h1>
            </div>
          </div>
        </section>

        <section ref={itemSection} className="scroll-mt-20">
          <h2 className="mb-space-sm text-title-md">포인트로 구매하기</h2>
          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-start gap-space-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <Icon name="add_home" className="text-[26px]" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-title-sm">공간 1개 추가</h3>
                <p className="mt-0.5 text-body-md text-on-surface-variant">우리 집에 필요한 공간을 하나 더 관리해요.</p>
                <p className="mt-space-xs text-title-sm text-primary">{SPACE_PRICE}P</p>
              </div>
            </div>
            <button className="mt-space-md flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-container px-space-md text-label-md text-on-primary" type="button" onClick={handleSpacePurchase}>
              {balance >= SPACE_PRICE ? `공간 추가하기` : "포인트가 부족해요 · 구매하러 가기"}
            </button>
          </div>
        </section>

        <section ref={purchaseSection} className="scroll-mt-20">
          <h2 className="mb-space-sm text-title-md">포인트 충전하기</h2>
          <div className="flex flex-col gap-space-xs">
            {packages.map((amount) => {
              const active = selectedPackage === amount;
              return (
                <button
                  key={amount}
                  aria-pressed={active}
                  className={`flex min-h-[68px] w-full items-center justify-between gap-space-sm rounded-xl border p-space-md text-left shadow-sm transition-colors ${active ? "border-primary-container bg-primary-fixed/50" : "border-transparent bg-surface-container-lowest"}`}
                  type="button"
                  onClick={() => setSelectedPackage(amount)}
                >
                  <span className="text-title-sm text-on-surface">{amount.toLocaleString()}P</span>
                  <Icon name={active ? "radio_button_checked" : "radio_button_unchecked"} className={`shrink-0 text-[24px] ${active ? "text-primary" : "text-outline"}`} />
                </button>
              );
            })}
          </div>
          <button className="mt-space-sm flex min-h-12 w-full items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary shadow-md" type="button" onClick={showComingSoon}>
            {selectedPackage.toLocaleString()}P 구매하기
          </button>
          <p className="mt-space-sm text-caption text-on-surface-variant">원화 가격과 실제 결제는 추후 연결할 예정이에요.</p>
        </section>
      </main>
      <Toast message="구매 기능은 추후 연결될 예정이에요" visible={showToast} pill />
    </PageShell>
  );
}
