import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import PageShell from "../components/PageShell";
import Icon from "../components/Icon";
import { resetToGuest } from "../data/points";
import { spaceToneLabels, spaceTones, type SpaceToneKey } from "../data/spaceTones";

const FADE_TIERS = [
  { pct: 100, label: "방금 돌본 공간", desc: "청소한 항목 비율이 충분해요" },
  { pct: 72, label: "관리 상태가 좋아요", desc: "관리 주기에 맞춰 조금 옅어져요" },
  { pct: 48, label: "슬슬 청소해볼까요?", desc: "지난 기록을 다시 확인할 때에요" },
  { pct: 28, label: "청소가 필요해요", desc: "다시 돌볼 시점을 알려줘요" },
];

const START_SPACE_KEYS: { toneKey: SpaceToneKey; iconKey: string; label: string }[] = [
  { toneKey: "bathroom", iconKey: "bath", label: spaceToneLabels.bathroom },
  { toneKey: "kitchen", iconKey: "kitchen", label: spaceToneLabels.kitchen },
  { toneKey: "living", iconKey: "living", label: spaceToneLabels.living },
  // Setup.tsx displays this tone's "침실" key as "방" to the user — match that convention.
  { toneKey: "bedroom", iconKey: "bed", label: "방" },
];

const STEP_TITLES = ["톡 닦아보기", "공간 색 변화", "시작 방식 선택"];

/** Replays a short enter transition whenever its `key` (the step index) changes. */
function StepFade({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Plain effect, not requestAnimationFrame: rAF is paused by browsers on
    // hidden/background tabs, which left this permanently un-transitioned.
    setEntered(true);
  }, []);

  return (
    <div
      className={`flex flex-1 flex-col transition-all duration-[220ms] ease-out ${
        entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/** Tap-to-record demo: press shows a light sweep, settles into a "recorded" state, tap again cancels. */
function DemoCard() {
  const [recorded, setRecorded] = useState(false);
  const [sweeping, setSweeping] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);

  const handleTap = () => {
    if (recorded) {
      setRecorded(false);
      return;
    }
    setRecorded(true);
    setSweepKey((key) => key + 1);
    setSweeping(false);
    window.setTimeout(() => setSweeping(true), 10);
  };

  return (
    <button
      aria-pressed={recorded}
      className={`relative flex h-40 w-40 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300 active:scale-[0.97] ${
        recorded ? "border-sky-brand bg-sky-tint" : "border-sky-line bg-sky-white"
      }`}
      type="button"
      onClick={handleTap}
    >
      {recorded ? (
        <span
          key={sweepKey}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-white/70 blur-sm transition-transform duration-[480ms] ease-out ${
            sweeping ? "translate-x-[260%]" : "-translate-x-full"
          }`}
        />
      ) : null}
      <Icon className="relative text-[56px]" name="object-sink" />
      <span className={`relative text-label-md font-semibold ${recorded ? "text-sky-deep" : "text-sky-muted"}`}>
        {recorded ? "기록 완료" : "세면대"}
      </span>
    </button>
  );
}

/** A fade-tier swatch: outer ring always visible (so low tiers don't vanish into the card),
 *  inner fill at the tier's opacity, icon always full-opacity per the Figma rule that
 *  only the background fades while icon/name linework stays legible. */
function FadeSwatch({ pct }: { pct: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sky-line bg-sky-white"
    >
      <span className="absolute inset-0 bg-sky-brand" style={{ opacity: pct / 100 }} />
      <Icon className="relative text-[18px] text-sky-deep" name="auto_awesome" />
    </span>
  );
}

function StepProgress({ step }: { step: number }) {
  return (
    <div className="mb-space-lg flex items-center justify-center gap-1.5">
      <div aria-hidden="true" className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-200 ${i === step ? "w-6 bg-sky-brand" : "w-1.5 bg-sky-line"}`}
          />
        ))}
      </div>
      <span aria-live="polite" className="sr-only">
        {step + 1}/3 단계: {STEP_TITLES[step]}
      </span>
    </div>
  );
}

export default function Welcome() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const goSetup = () => {
    resetToGuest();
    navigate("/setup");
  };

  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col px-margin-screen pb-space-2xl pt-space-xl">
        <StepProgress step={step} />
        <StepFade key={step}>
          {step === 0 ? (
            <section className="flex flex-1 flex-col items-center pt-space-lg text-center">
              <h1 ref={headingRef} className="mb-space-xs text-headline-lg text-sky-ink" tabIndex={-1}>
                톡 닦아보기
              </h1>
              <p className="mb-space-2xl text-body-md text-sky-muted">
                세면대를 닦았다고 생각하고 아래 카드를 눌러보세요.
              </p>
              <DemoCard />
              <p className="mt-space-md text-caption text-sky-muted">빛이 스치면 기록 끝. 다시 누르면 취소돼요.</p>
              <div className="mt-auto w-full pb-[72px]">
                <button
                  className="flex h-14 w-full items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98]"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  다음 · 색의 변화 알아보기
                </button>
                <button
                  className="mt-space-sm flex h-11 w-full items-center justify-center text-label-md text-sky-muted"
                  type="button"
                  onClick={() => setStep(2)}
                >
                  체험 건너뛰기
                </button>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="flex flex-1 flex-col pt-space-lg text-center">
              <h1 ref={headingRef} className="mb-space-2xl text-headline-lg text-sky-ink" tabIndex={-1}>
                공간 색 변화
              </h1>
              <div className="space-y-space-xs text-left">
                {FADE_TIERS.map((tier) => (
                  <div
                    key={tier.pct}
                    className="flex items-center gap-space-sm rounded-2xl border border-sky-line bg-sky-white px-space-md py-space-sm"
                  >
                    <FadeSwatch pct={tier.pct} />
                    <div className="min-w-0">
                      <p className="text-label-md font-semibold text-sky-ink">
                        {tier.label} · {tier.pct}%
                      </p>
                      <p className="text-caption text-sky-muted">{tier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-space-lg text-body-md leading-relaxed text-sky-muted">
                항목을 기록하면 공간의 완료 비율이 바뀌고, 시간이 지나면 관리 주기에 맞춰 색이 옅어져요.
              </p>
              <div className="mt-auto w-full pb-[72px] pt-space-xl">
                <button
                  className="flex h-14 w-full items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98]"
                  type="button"
                  onClick={() => setStep(2)}
                >
                  이제 시작하기
                </button>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="relative flex flex-1 flex-col items-center pt-space-lg text-center">
              <div className="pointer-events-none absolute top-2 h-64 w-64 rounded-full bg-sky-brand/25 blur-3xl" />
              <div className="relative mb-space-xs flex h-24 w-24 items-center justify-center rounded-full bg-sky-white p-2 shadow-sm">
                <div className="absolute inset-0 scale-110 rounded-full bg-sky-tint blur-md" />
                <BrandLogo className="relative h-full w-full rounded-xl" />
              </div>
              <span className="mb-space-2xl text-label-md font-semibold text-sky-deep">뽀득뽀득</span>
              <h1 ref={headingRef} className="mb-space-lg text-headline-lg text-sky-ink" tabIndex={-1}>
                네 가지 기본 공간은 무료예요
              </h1>
              <div className="mb-space-2xl flex justify-center gap-space-md">
                {START_SPACE_KEYS.map(({ toneKey, iconKey, label }) => {
                  const tone = spaceTones[toneKey];
                  return (
                    <div key={toneKey} className="flex flex-col items-center gap-space-xxs">
                      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone.fill} ${tone.text}`}>
                        <Icon className="text-[26px]" name={`space-${iconKey}`} />
                      </span>
                      <span className="text-caption text-sky-muted">{label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-auto w-full pb-[72px]">
                <Link
                  className="flex h-14 items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98]"
                  to="/login"
                >
                  로그인하기
                </Link>
                <button
                  className="mt-space-sm flex h-14 w-full items-center justify-center rounded-full bg-sky-tint text-title-sm text-sky-deep transition-transform duration-[120ms] active:scale-[0.98]"
                  type="button"
                  onClick={goSetup}
                >
                  게스트 모드로 시작하기
                </button>
                <button
                  className="mt-space-sm flex h-11 w-full items-center justify-center text-label-md text-sky-muted"
                  type="button"
                  onClick={() => setStep(0)}
                >
                  체험 다시 보기
                </button>
              </div>
            </section>
          ) : null}
        </StepFade>
      </main>
    </PageShell>
  );
}
