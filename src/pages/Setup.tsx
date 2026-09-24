import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import PageShell from "../components/PageShell";
import Toast, { useToast } from "../components/Toast";
import { AX_ONBOARDING_ENABLED } from "../features/ax-onboarding";
import { writeSetup } from "../data/setup";

// Stored keys stay as before ("침실 / 방" is the internal key; SPACES[].setupKeys maps it). Figma order.
const BASIC_SPACES = [
  { key: "욕실", label: "욕실" },
  { key: "주방", label: "주방" },
  { key: "거실", label: "거실" },
  { key: "침실 / 방", label: "방" },
];

const aiCardClass =
  "press flex h-16 w-full items-center justify-between rounded-[16px] border border-sky-brand bg-sky-white px-[14px] text-left shadow-[0_3px_5px_rgba(0,0,0,0.08)]";

function AiCardBody() {
  return (
    <>
      <span className="flex items-center gap-3">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-tint text-[20px] font-bold leading-[31px] text-sky-deep">
          ✦
        </span>
        <span className="flex flex-col gap-px">
          <span className="text-[13px] font-bold leading-[20px] text-sky-ink">내 공간 사진으로 맞춤 설정하기</span>
          <span className="text-[11px] leading-[17px] text-sky-muted">AI가 사진 속 관리 항목을 추천해요</span>
        </span>
      </span>
      <span aria-hidden="true" className="text-[22px] font-bold leading-[34px] text-sky-deep">
        ›
      </span>
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
        <div className="flex h-[116px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">
            내 집에는
            <br />
            어떤 공간이 있나요?
          </h1>
          <p className="text-bb-body text-sky-muted">자주 돌보는 공간부터 시작해요.</p>
        </div>

        {AX_ONBOARDING_ENABLED ? (
          <Link className={aiCardClass} to="/setup/photo">
            <AiCardBody />
          </Link>
        ) : (
          <button className={aiCardClass} type="button" onClick={() => showToast("사진 맞춤 설정은 준비 중이에요")}>
            <AiCardBody />
          </button>
        )}

        <h2 className="text-bb-label text-sky-deep">기본 공간 4개는 무료예요</h2>
        {BASIC_SPACES.map(({ key, label }) => {
          const on = selected.includes(key);
          return (
            <button key={key} aria-pressed={on} className="flex h-12 items-center gap-3 rounded-2xl bg-sky-white pl-3 text-left" type="button" onClick={() => toggle(key)}>
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl text-bb-label transition-colors ${on ? "bg-sky-brand text-onbrand" : "bg-sky-line"}`}
              >
                {on ? "✓" : null}
              </span>
              <span className="text-bb-label text-sky-ink">{label}</span>
            </button>
          );
        })}

        <section className="flex flex-col gap-2 rounded-3xl bg-sky-tint px-5 pb-4 pt-4">
          <h2 className="text-bb-title text-sky-ink">공간은 언제든 바꿀 수 있어요</h2>
          <p className="text-bb-body text-sky-muted">
            필요한 공간만 골라 시작하고,
            <br />
            나중에 공간 화면에서 추가하거나 정리할 수 있어요.
          </p>
        </section>

        <GlassButton disabled={selected.length === 0} onClick={complete}>
          {selected.length > 0 ? "이 공간으로 시작하기" : "공간을 하나 이상 선택해 주세요"}
        </GlassButton>
      </main>
      <Toast message={toast} visible={Boolean(toast)} pill />
    </PageShell>
  );
}
