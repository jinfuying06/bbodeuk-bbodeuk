import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import SpaceTile from "../components/SpaceTile";
import { FADE_STAGES, getSpace, objectArtVars, type SpaceKey } from "../data/cleaning";

const BATH = getSpace("bathroom");

const START_SPACES: SpaceKey[] = ["bathroom", "kitchen", "living", "bedroom"];

const mix = (hex: string, pct: number) => `color-mix(in srgb, ${hex} ${pct}%, white)`;

/** Sky / Cleaning Card demo (27:700): tap → 120ms press → 480ms glass sweep + sparkle → stays coloured. Re-tap cancels. */
function DemoCard() {
  const [recorded, setRecorded] = useState(false);
  const [shine, setShine] = useState(0);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (!shine) return;
    setMoving(false);
    // Plain timeouts (not rAF): rAF pauses on background tabs.
    const start = window.setTimeout(() => setMoving(true), 20);
    const end = window.setTimeout(() => setMoving(false), 1200);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [shine]);

  const tap = () => {
    if (recorded) {
      setRecorded(false);
      setMoving(false);
      return;
    }
    setRecorded(true);
    setShine((n) => n + 1);
  };

  return (
    <button
      aria-pressed={recorded}
      className="press relative flex h-[210px] w-[250px] flex-col items-center justify-center overflow-hidden rounded-2xl pl-[14px] pt-2 transition-[background-color,transform] duration-300"
      // Starts as a faint 욕실 tint (not grey) so the tap visibly fills it with the full color (2026-10-16).
      style={{ ...objectArtVars("bathroom", recorded ? "filled" : "idle"), backgroundColor: recorded ? BATH.color : mix(BATH.color, 30) }}
      type="button"
      onClick={tap}
    >
      <span className="flex h-[62px] w-[76px] items-center justify-center" style={{ color: BATH.iconColor }}>
        <Icon className="text-[43px]" name="object-sink" />
      </span>
      <span className="text-bb-label text-sky-ink">세면대</span>
      <span className="text-bb-caption text-sky-muted">{recorded ? "방금 돌봤어요" : "여기를 톡 눌러보세요"}</span>
      {shine ? (
        <>
          <span
            key={`sweep-${shine}`}
            aria-hidden="true"
            className={`pointer-events-none absolute -top-[5px] left-[-174px] h-[220px] w-[118px] mix-blend-screen motion-reduce:hidden ${
              moving ? "translate-x-[440px] opacity-100 transition-transform duration-[480ms] ease-[cubic-bezier(.2,.7,.2,1)]" : "opacity-0"
            }`}
            style={{
              rotate: "10deg",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(225,243,255,.22) 32%, rgba(255,255,255,.88) 50%, rgba(225,243,255,.22) 68%, rgba(255,255,255,0) 100%)",
            }}
          />
          <Icon
            className={`pointer-events-none absolute left-[111px] top-[14px] text-[28px] text-sky-white transition-[opacity,transform] duration-300 motion-reduce:hidden ${
              moving ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            name="sparkle"
          />
        </>
      ) : null}
    </button>
  );
}

/** One-line title (2026-10-16 rule: every big title fits one line, 26px; overflow moves into the body). */
function StepHead({ label, title, body }: { label: string; title: string; body: [string, string?] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <>
      <p className="whitespace-pre text-[12px] leading-[22px] text-sky-muted">{label}</p>
      <h1
        ref={ref}
        className="text-bb-heading text-sky-ink outline-none"
        tabIndex={-1}
      >
        {title}
      </h1>
      <p className="text-bb-body text-sky-muted">
        {body[0]}
        {body[1] ? (
          <>
            <br />
            {body[1]}
          </>
        ) : null}
      </p>
    </>
  );
}

export default function Welcome() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const goSetup = () => {
    navigate("/setup");
  };

  return (
    <PageShell bottomNav={false}>
      {/* Brand / header, sub-page variant with empty Back/More slots (27:700). */}
      <header className="pt-safe">
        <div className="flex h-header items-center justify-center px-4">
          <span className="text-bb-label text-sky-ink">뽀득뽀득</span>
        </div>
      </header>

      <main key={step} className="flex flex-col gap-4 px-margin-screen pb-7 pt-4">
        {step === 0 ? (
          <>
            <StepHead
              body={["세면대를 닦았다고 생각하고", "아래 카드를 눌러보세요."]}
              label="처음 만나는 뽀득뽀득  ·  1 / 3"
              title="한 번 톡, 청소가 반짝."
            />
            <div className="flex h-[210px] justify-center">
              <DemoCard />
            </div>
            <GlassButton size={52} onClick={() => setStep(1)}>
              다음 · 색의 변화 알아보기
            </GlassButton>
            <GlassButton size={52} variant="secondary" onClick={() => setStep(2)}>
              체험 건너뛰기
            </GlassButton>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <StepHead
              body={["시간이 지나면 관리 주기에 맞춰", "천천히 옅어져요."]}
              label="공간의 색 변화  ·  2 / 3"
              title="기록하면 색이 채워져요"
            />
            <ul aria-label="공간 색상 단계" className="mt-[22px] flex flex-col gap-2">
              {FADE_STAGES.map((tier) => (
                <li
                  key={tier.pct}
                  className="flex h-14 items-center gap-[10px] rounded-tile px-3"
                  style={{ backgroundColor: mix(BATH.color, tier.pct) }}
                >
                  <SpaceTile space="bathroom" />
                  <span className="flex min-w-0 flex-col gap-px">
                    <span className="text-bb-title text-sky-ink">{tier.label}</span>
                    <span className="text-bb-caption text-sky-muted">{tier.desc}</span>
                  </span>
                  <span className="ml-auto shrink-0 text-bb-caption text-sky-muted">{tier.pct}%</span>
                </li>
              ))}
            </ul>
            <GlassButton size={52} onClick={() => setStep(2)}>
              이제 시작하기
            </GlassButton>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <StepHead
              body={["로그인하거나, 가입 없이 먼저 시작해보세요."]}
              label="나에게 맞는 시작  ·  3 / 3"
              title="이제 가볍게 시작해요"
            />
            <section className="flex flex-col gap-4 py-3">
              <h2 className="text-bb-title text-sky-ink">네 가지 기본 공간은 무료예요</h2>
              <ul className="grid grid-cols-4 gap-2.5">
                {START_SPACES.map((key) => {
                  const space = getSpace(key);
                  return (
                    <li key={key} className="flex flex-col items-center gap-1.5">
                      {/* All four at full color (2026-10-16; Figma had only 욕실 full). */}
                      <span className="flex aspect-square w-full items-center justify-center rounded-2xl" style={{ backgroundColor: space.color, color: space.iconColor }}>
                        <Icon className="text-[38px]" name={space.icon} />
                      </span>
                      <span className="text-bb-label text-sky-ink">
                        {key === "bedroom" ? "방" : space.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
            {/* The two start choices read as one pair (2026-10-16). */}
            <div className="flex flex-col gap-2">
              <GlassButton size={52} to="/login">
                로그인하기
              </GlassButton>
              <GlassButton size={52} variant="secondary" onClick={goSetup}>
                게스트 모드로 시작하기
              </GlassButton>
            </div>
            <GlassButton size={52} variant="secondary" onClick={() => setStep(0)}>
              체험 다시 보기
            </GlassButton>
          </>
        ) : null}
      </main>
    </PageShell>
  );
}
