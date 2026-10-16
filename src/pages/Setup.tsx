import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import SpaceTile from "../components/SpaceTile";
import Toast, { useToast } from "../components/Toast";
import { AX_ONBOARDING_ENABLED, AX_READY } from "../features/ax-onboarding";
import { SPACES } from "../data/cleaning";
import { DEFAULT_SPACES, writeSetup } from "../data/setup";

// Stored keys stay as before ("침실 / 방" is the internal key; SPACES[].setupKeys maps it). Figma order.
// 욕실/주방 are required (same rule as 공간 관리), so they show locked-on here instead of being silently re-added later.
const BASIC_SPACES = ["욕실", "주방", "거실", "침실 / 방"].map((key) => DEFAULT_SPACES.find((space) => space.key === key)!);

/** Setup label → app space (colors, icon). */
const spaceFor = (key: string) => SPACES.find((space) => space.setupKeys.includes(key))!;

const aiCardClass = "press flex h-16 w-full items-center justify-between rounded-row-sm border border-sky-line bg-sky-bg px-[14px] text-left";

/** Not ready yet: a small chip instead of the full grey "준비 중" cover (2026-10-16). */
function AiCardBody({ ready }: { ready: boolean }) {
  return (
    <>
      <span className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sky-deep"
          style={{ background: `linear-gradient(135deg, ${SPACES.slice(0, 4).map((space) => space.color).join(", ")})` }}
        >
          <Icon name="sparkle" className="text-[20px]" />
        </span>
        <span className="flex flex-col gap-px">
          <span className="text-bb-label-sm font-bold text-sky-ink">내 공간 사진으로 맞춤 설정하기</span>
          <span className="text-bb-caption text-sky-muted">AI가 사진 속 관리 항목을 추천해요</span>
        </span>
      </span>
      {ready ? (
        <Icon name="chevron-right" className="shrink-0 text-[20px] text-sky-deep" />
      ) : (
        <span className="shrink-0 rounded-full bg-sky-tint px-2.5 py-1 text-bb-caption text-sky-deep">준비 중</span>
      )}
    </>
  );
}

/** 05 / 내 공간 설정 (27:843). */
export default function Setup() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(BASIC_SPACES.map((space) => space.key));
  const [toast, showToast] = useToast();

  const toggle = (key: string) =>
    setSelected((current) => (current.includes(key) ? current.filter((space) => space !== key) : [...current, key]));

  const complete = () => {
    if (selected.length === 0) return;
    writeSetup({ spaces: selected, roomName: "방" });
    navigate("/home");
  };

  return (
    <PageShell bottomNav={false}>
      <AppHeader back="/welcome" title="내 공간 설정" />
      <main className="flex flex-col gap-3 px-margin-screen pb-7 pt-header">
        <PageIntro title={<>내 집에는<br />어떤 공간이 있나요?</>} body="자주 돌보는 공간부터 시작해요." className="min-h-[116px]" />

        {AX_ONBOARDING_ENABLED && AX_READY ? (
          <Link className={aiCardClass} to="/setup/photo">
            <AiCardBody ready />
          </Link>
        ) : (
          <button className={aiCardClass} type="button" onClick={() => showToast("사진 맞춤 설정은 준비 중이에요")}>
            <AiCardBody ready={false} />
          </button>
        )}

        <h2 className="text-bb-label text-sky-deep">기본 공간 4개는 무료예요</h2>
        {/* Space rows in their home colors (2026-10-16): on = filled like the home card, off = faint. */}
        {BASIC_SPACES.map(({ key, label, required }) => {
          const space = spaceFor(key);
          const on = selected.includes(key);
          return (
            <button
              key={key}
              aria-disabled={required || undefined}
              aria-pressed={on}
              className="press flex h-16 items-center gap-3 rounded-2xl pl-3 pr-4 text-left transition-colors duration-300"
              style={{ backgroundColor: on ? space.color : `color-mix(in srgb, ${space.color} 22%, white)` }}
              type="button"
              onClick={required ? undefined : () => toggle(key)}
            >
              <SpaceTile space={space.key} onFill />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-bb-label text-sky-ink">{label === "침실 / 방" ? "방" : label}</span>
                {required ? <span className="text-bb-caption text-sky-muted">기본 관리 공간</span> : null}
              </span>
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${on ? "text-sky-white" : "border-2 border-sky-white bg-sky-white/60"}`}
                style={on ? { backgroundColor: space.iconColor } : undefined}
              >
                {on ? <Icon name="check" className="text-[16px]" /> : null}
              </span>
            </button>
          );
        })}

        <p className="text-bb-caption text-sky-muted">공간 구성은 설정에서 바꿀 수 있어요.</p>

        <GlassButton disabled={selected.length === 0} onClick={complete}>
          {selected.length > 0 ? "이 공간으로 시작하기" : "공간을 하나 이상 선택해 주세요"}
        </GlassButton>
      </main>
      <Toast message={toast} visible={Boolean(toast)} pill />
    </PageShell>
  );
}
