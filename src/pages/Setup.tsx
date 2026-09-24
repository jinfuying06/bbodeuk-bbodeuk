import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import SpaceExpansionDialog from "../components/SpaceExpansionDialog";
import { AX_ONBOARDING_ENABLED } from "../features/ax-onboarding";
import { writeSetup } from "../data/setup";

const basicSpaces = [
  { key: "거실", icon: "weekend" },
  { key: "주방", icon: "soup_kitchen" },
  { key: "욕실", icon: "water_drop" },
  { key: "침실 / 방", icon: "bed" },
];

export default function Setup() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(basicSpaces.map((space) => space.key));
  const [showExpansion, setShowExpansion] = useState(false);

  const toggleSpace = (key: string) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((space) => space !== key) : [...current, key],
    );
  };

  const completeSetup = () => {
    if (selected.length === 0) return;
    writeSetup({ spaces: selected, roomName: "방" });
    navigate("/home");
  };

  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col px-margin-screen pb-space-2xl pt-space-md">
        <div className="mb-space-lg flex items-center">
          <Link className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface" to="/login" aria-label="이전 화면으로">
            <Icon name="arrow_back_ios_new" className="text-[22px]" />
          </Link>
        </div>

        <section className="mb-space-lg">
          <h1 className="text-headline-lg text-sky-ink">관리할 공간을 선택해주세요</h1>
          <p className="mt-2 text-body-md text-sky-muted">자주 관리하는 공간부터 먼저 시작해보세요.</p>
          {AX_ONBOARDING_ENABLED ? (
            <Link
              className="mt-space-sm flex items-center gap-space-sm rounded-xl bg-sky-white p-space-sm shadow-sm transition-colors"
              to="/setup/photo"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-tint text-sky-deep">
                <Icon name="photo_camera" className="text-[18px]" />
              </span>
              <span className="min-w-0 flex-1 text-label-md text-sky-ink">내 공간 사진으로 맞춤 설정하기</span>
              <Icon name="chevron_right" className="text-[18px] text-sky-muted" />
            </Link>
          ) : null}
        </section>

        <section className="mb-space-lg">
          <div className="mb-space-sm flex items-center justify-between gap-space-xs">
            <h2 className="text-title-sm text-sky-ink">기본 공간</h2>
            <span className="text-label-sm text-sky-deep">4개 공간 무료</span>
          </div>
          <div className="grid grid-cols-2 gap-space-xs">
            {basicSpaces.map(({ key, icon }) => {
              const active = selected.includes(key);
              return (
                <button
                  key={key}
                  className={`flex min-h-[88px] items-center gap-space-sm rounded-xl border p-space-md text-left shadow-sm transition-colors ${active ? "border-sky-brand bg-sky-tint text-sky-ink" : "border-art-line bg-sky-white text-sky-muted"}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleSpace(key)}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-sky-white text-sky-deep" : "bg-sky-tint text-sky-muted"}`}>
                    <Icon name={icon} className="text-[24px]" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-title-sm">{key === "침실 / 방" ? "방" : key}</span>
                  <Icon name={active ? "check_circle" : "radio_button_unchecked"} className={`text-[22px] ${active ? "text-sky-deep" : "text-sky-muted"}`} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-space-xl rounded-xl bg-sky-tint p-space-md shadow-sm">
          <h2 className="text-title-sm text-sky-ink">다른 공간도 관리하고 싶나요?</h2>
          <p className="mt-1 text-body-md text-sky-muted">베란다, 드레스룸처럼 필요한 공간은 1개당 300P로 확장할 수 있어요.</p>
          <button className="mt-space-sm flex min-h-11 w-full items-center justify-center gap-space-xs rounded-lg border border-sky-brand bg-sky-white px-space-sm text-label-md text-sky-deep transition-transform duration-[120ms] active:scale-[0.98]" type="button" onClick={() => setShowExpansion(true)}>
            <Icon name="add" className="text-[20px]" />
            공간 추가 · 300P
          </button>
        </section>

        <button className="mt-auto flex h-14 items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98] disabled:opacity-50" type="button" onClick={completeSetup} disabled={selected.length === 0}>
          {selected.length > 0 ? "기본 공간으로 시작하기" : "공간을 하나 이상 선택해주세요"}
        </button>
      </main>
      <SpaceExpansionDialog open={showExpansion} onClose={() => setShowExpansion(false)} />
    </PageShell>
  );
}
