import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import SpaceTile from "../components/SpaceTile";
import { getSpace, type SpaceKey } from "../data/cleaning";
import { resetToGuest } from "../data/points";

const BATH = getSpace("bathroom");

// Figma 33:2296 — bath policy fill ladder (space colour mixed toward white).
const FADE_TIERS = [
  { pct: 100, label: "방금 돌본 공간", desc: "청소한 항목 비율이 충분해요" },
  { pct: 72, label: "관리 상태가 좋아요", desc: "관리 주기에 맞춰 조금 옅어져요" },
  { pct: 48, label: "슬슬 청소해볼까요?", desc: "지난 기록을 다시 확인할 때예요" },
  { pct: 28, label: "청소가 필요해요", desc: "다시 돌볼 시점을 알려줘요" },
];

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
      className="press relative flex h-[210px] w-[250px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-sky-line pl-[14px] pt-2 transition-[background-color,transform] duration-300"
      style={{ backgroundColor: recorded ? BATH.color : "#ffffff" }}
      type="button"
      onClick={tap}
    >
      <span className="flex h-[62px] w-[76px] items-center justify-center">
        <Icon className="text-[43px]" name="object-sink" />
      </span>
      <span className="text-bb-label text-sky-ink">세면대</span>
      <span className="text-bb-caption text-sky-muted">{recorded ? "방금 기록했어요" : "여기를 톡 눌러보세요"}</span>
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
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(199,255,250,.22) 32%, rgba(255,255,255,.88) 50%, rgba(199,255,250,.22) 68%, rgba(255,255,255,0) 100%)",
            }}
          />
          <Icon
            className={`pointer-events-none absolute left-[111px] top-[14px] text-[28px] text-white transition-[opacity,transform] duration-300 motion-reduce:hidden ${
              moving ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            name="sparkle"
          />
        </>
      ) : null}
    </button>
  );
}

function StepHead({ label, title, body, size = 28 }: { label: string; title: [string, string]; body: [string, string?]; size?: 26 | 28 }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <>
      <p className="whitespace-pre text-[12px] leading-[22px] text-sky-muted">{label}</p>
      <h1
        ref={ref}
        className={`${size === 28 ? "text-[28px]" : "text-[26px]"} font-bold leading-[38px] text-sky-ink outline-none`}
        tabIndex={-1}
      >
        {title[0]}
        <br />
        {title[1]}
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

const Caption = ({ lines }: { lines: [string, string] }) => (
  <p className="text-[12px] leading-[22px] text-sky-muted">
    {lines[0]}
    <br />
    {lines[1]}
  </p>
);

export default function Welcome() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const goSetup = () => {
    resetToGuest();
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
              title={["한 번 톡,", "오늘의 청소가 반짝."]}
            />
            <div className="flex h-[210px] justify-center">
              <DemoCard />
            </div>
            <Caption lines={["빛이 스치면 기록 끝. 다시 누르면 취소돼요.", "체험한 내용은 실제 기록에 남지 않아요."]} />
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
              body={["공간 색은 청소한 항목의 비율과 관리 주기를 함께 보여줘요."]}
              label="공간의 색 변화  ·  2 / 3"
              size={26}
              title={["돌본 비율만큼 채워지고,", "필요할 때 천천히 옅어져요."]}
            />
            <ul aria-label="공간 색상 단계" className="mt-[22px] flex flex-col gap-2">
              {FADE_TIERS.map((tier) => (
                <li
                  key={tier.pct}
                  className="flex h-14 items-center gap-[10px] rounded-[14px] px-3"
                  style={{ backgroundColor: mix(BATH.color, tier.pct) }}
                >
                  <SpaceTile space="bathroom" />
                  <span className="flex min-w-0 flex-col gap-px">
                    <span className="text-[16px] font-bold leading-[22px] text-sky-ink">
                      {tier.label} · {tier.pct}%
                    </span>
                    <span className="text-bb-caption text-sky-muted">{tier.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Caption lines={["항목을 기록하면 공간의 완료 비율이 바뀌고,", "시간이 지나면 관리 주기에 맞춰 색이 옅어져요."]} />
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
              title={["이제, 내 공간을", "가볍게 돌봐요."]}
            />
            <section className="flex h-[184px] flex-col gap-3 rounded-2xl bg-sky-white p-5">
              <h2 className="text-[16px] font-bold leading-[22px] text-sky-ink">네 가지 기본 공간은 무료예요</h2>
              <ul className="flex justify-between">
                {START_SPACES.map((key) => {
                  const space = getSpace(key);
                  return (
                    <li key={key} className="flex w-[60px] flex-col items-center gap-1">
                      {/* Figma draws 욕실 at full colour (r14) and the rest at 28% (r12). */}
                      <span
                        className={`flex h-10 w-10 items-center justify-center ${key === "bathroom" ? "rounded-[14px]" : "rounded-xl"}`}
                        style={{ backgroundColor: key === "bathroom" ? space.color : mix(space.color, 28), color: space.iconColor }}
                      >
                        <Icon className="text-[24px]" name={space.icon} />
                      </span>
                      <span className="text-[12px] leading-[22px] text-sky-ink">
                        {key === "bedroom" ? "방" : space.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
            <GlassButton size={52} to="/login">
              로그인하기
            </GlassButton>
            <GlassButton size={52} variant="secondary" onClick={goSetup}>
              게스트 모드로 시작하기
            </GlassButton>
            <Caption lines={["게스트도 공간을 고르고 청소를 기록할 수 있어요.", "기본 공간 사용에 포인트는 필요하지 않아요."]} />
            <GlassButton size={52} variant="secondary" onClick={() => setStep(0)}>
              체험 다시 보기
            </GlassButton>
          </>
        ) : null}
      </main>
    </PageShell>
  );
}
