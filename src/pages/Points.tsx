import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Toast from "../components/Toast";
import { isMember, readPoints, SIGNUP_BONUS } from "../data/points";

function hasCompletedSetup(): boolean {
  try {
    return window.localStorage.getItem("bbodeuk.setup.v1") !== null;
  } catch {
    return false;
  }
}

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent");
  const balance = readPoints();
  const member = isMember();
  const setupDone = hasCompletedSetup();
  const [selectedPackage, setSelectedPackage] = useState(300);
  const [showToast, setShowToast] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const purchaseSection = useRef<HTMLElement>(null);
  const signupConfirmButtonRef = useRef<HTMLButtonElement>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(toastTimerRef.current), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (intent !== "charge") return;

    const frame = window.requestAnimationFrame(() => revealOnlyIfNeeded(purchaseSection.current));
    return () => window.cancelAnimationFrame(frame);
  }, [intent]);

  useEffect(() => {
    if (!showSignupConfirm) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    signupConfirmButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSignupConfirm(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSignupConfirm]);

  const showComingSoon = () => {
    setShowToast(true);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setShowToast(false), 2400);
  };

  return (
    <PageShell bottomNav={setupDone}>
      {setupDone ? <AppHeader title="내 포인트" /> : <AppHeader title="내 포인트" onBack={() => navigate(-1)} />}
      <main className="flex flex-col gap-space-xl bg-surface px-margin-screen pb-[104px] pt-header-lg">
        {!member ? (
          <button className="flex items-center gap-space-xs rounded-xl bg-primary-fixed/50 px-space-md py-space-sm text-label-md text-primary" type="button" onClick={() => setShowSignupConfirm(true)}>
            <Icon name="redeem" className="text-[18px]" />
            <span className="flex-1 text-left">회원가입 하시면 {SIGNUP_BONUS}P를 드려요</span>
            <Icon name="chevron_right" className="text-[18px]" />
          </button>
        ) : null}
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

        <button className="flex items-center gap-space-xs rounded-xl bg-surface-container-lowest p-space-md text-left shadow-sm transition-transform active:scale-[0.99]" type="button" onClick={() => navigate("/space-manage")}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <Icon name="add_home" className="text-[26px]" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-title-sm text-on-surface">공간 추가하기</h3>
            <p className="mt-0.5 text-body-md text-on-surface-variant">공간 관리에서 원하는 공간을 골라 추가할 수 있어요.</p>
          </div>
          <Icon name="chevron_right" className="shrink-0 text-[20px] text-outline-variant" />
        </button>

        <section ref={purchaseSection} className="scroll-mt-20">
          <h2 className="mb-space-sm text-title-md">포인트 충전하기</h2>
          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-start gap-space-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <Icon name="add_card" className="text-[26px]" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-title-sm">충전할 금액을 선택해주세요</h3>
                <p className="mt-0.5 text-body-md text-on-surface-variant">충전한 포인트는 공간 추가에 사용할 수 있어요.</p>
              </div>
            </div>
            <div className="mt-space-md flex flex-col gap-space-xs">
              {packages.map((amount) => {
                const active = selectedPackage === amount;
                return (
                  <button
                    key={amount}
                    aria-pressed={active}
                    className={`flex min-h-[68px] w-full items-center justify-between gap-space-sm rounded-lg border p-space-md text-left transition-colors ${active ? "border-primary-container bg-primary-fixed/50" : "border-transparent bg-surface-container-low"}`}
                    type="button"
                    onClick={() => setSelectedPackage(amount)}
                  >
                    <span className="text-title-sm text-on-surface">{amount.toLocaleString()}P</span>
                    <Icon name={active ? "radio_button_checked" : "radio_button_unchecked"} className={`shrink-0 text-[24px] ${active ? "text-primary" : "text-outline"}`} />
                  </button>
                );
              })}
            </div>
            <button className="mt-space-md flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-container px-space-md text-label-md text-on-primary" type="button" onClick={showComingSoon}>
              {selectedPackage.toLocaleString()}P 구매하기
            </button>
            <p className="mt-space-sm text-caption text-on-surface-variant">원화 가격과 실제 결제는 추후 연결할 예정이에요.</p>
          </div>
        </section>
      </main>
      <Toast message="구매 기능은 추후 연결될 예정이에요" visible={showToast} pill />

      {showSignupConfirm ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-on-surface/40" role="presentation" onClick={() => setShowSignupConfirm(false)}>
          <section
            aria-labelledby="signup-confirm-title"
            aria-modal="true"
            className="w-full max-w-[430px] rounded-t-xl bg-surface-container-lowest px-margin-screen pb-[calc(24px+env(safe-area-inset-bottom,0px))] pt-space-lg text-center shadow-xl"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <span aria-hidden="true" className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <Icon name="redeem" className="text-[22px]" />
            </span>
            <h2 id="signup-confirm-title" className="mt-space-md text-headline-md">회원가입 페이지로 이동할까요?</h2>
            <p className="mt-space-sm text-body-md text-on-surface-variant">가입하면 시작 포인트 {SIGNUP_BONUS}P가 바로 지급돼요.</p>
            <button ref={signupConfirmButtonRef} type="button" className="mt-space-lg flex h-12 w-full items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary shadow-md" onClick={() => navigate("/signup")}>
              이동하기
            </button>
            <button type="button" className="mt-space-sm flex h-12 w-full items-center justify-center rounded-full text-title-sm text-on-surface-variant" onClick={() => setShowSignupConfirm(false)}>
              취소
            </button>
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}
