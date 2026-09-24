import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Toast from "../components/Toast";
import { isMember, readPoints, spendPoints } from "../data/points";
import { DEFAULT_SPACES, EXPANSION_CATALOG, hasCompletedSetup, readSetup, writeSetup, type SetupData } from "../data/setup";

function withRequiredSpaces(setup: SetupData): SetupData {
  const requiredKeys = DEFAULT_SPACES.filter((space) => space.required).map((space) => space.key);
  const missing = requiredKeys.filter((key) => !setup.spaces.includes(key));
  if (missing.length === 0) return setup;
  const normalized = { ...setup, spaces: [...setup.spaces, ...missing] };
  writeSetup(normalized);
  return normalized;
}

export default function SpaceManage() {
  const navigate = useNavigate();
  // Only normalize (and persist) an existing setup; before Setup is completed, show the defaults without writing.
  const [setup, setSetup] = useState<SetupData>(() =>
    hasCompletedSetup() ? withRequiredSpaces(readSetup()) : { spaces: DEFAULT_SPACES.map((space) => space.key), roomName: "방" },
  );
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(toastTimerRef.current), []);
  const member = isMember();
  const balance = readPoints();

  const notify = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setShowToast(false), 2400);
  };

  const toggleSpace = (key: string, required: boolean) => {
    if (required) return;
    const isOn = setup.spaces.includes(key);
    const next = { ...setup, spaces: isOn ? setup.spaces.filter((space) => space !== key) : [...setup.spaces, key] };
    setSetup(next);
    writeSetup(next);
  };

  const purchaseSpace = (key: string, label: string, price: number) => {
    if (!spendPoints(price)) return;
    const next = { ...setup, spaces: [...setup.spaces, key] };
    setSetup(next);
    writeSetup(next);
    setExpandedKey(null);
    notify(`${label} 공간이 추가됐어요!`);
  };

  const ownedExpansions = EXPANSION_CATALOG.filter((item) => setup.spaces.includes(item.key));
  const availableExpansions = EXPANSION_CATALOG.filter((item) => !setup.spaces.includes(item.key));

  const renderToggle = (key: string, label: string, active: boolean, required: boolean) => (
    <button
      aria-pressed={active}
      aria-label={`${label} ${active ? "끄기" : "켜기"}`}
      disabled={required}
      className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors disabled:opacity-50 ${
        active ? "justify-end bg-primary-container" : "justify-start bg-surface-container"
      }`}
      type="button"
      onClick={() => toggleSpace(key, required)}
    >
      <span className="block h-5 w-5 rounded-full bg-white shadow-sm" />
    </button>
  );

  return (
    <PageShell>
      <AppHeader title="공간 관리" back="/spaces" />
      <main className="flex flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-header">
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h1 className="text-headline-md text-on-surface">내 공간</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">필요 없는 공간은 꺼둘 수 있어요. 주방·욕실은 핵심 관리 공간이라 항상 켜져 있어요.</p>
          <div className="mt-space-md flex flex-col gap-space-md">
            {DEFAULT_SPACES.map((space) => {
              const active = setup.spaces.includes(space.key);
              const label = space.key === "침실 / 방" ? setup.roomName : space.label;
              return (
                <div key={space.key} className="flex items-center justify-between gap-space-sm">
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary">
                      <Icon name={space.icon} className="text-[22px]" />
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate text-title-sm text-on-surface">{label}</span>
                      {space.required ? <span className="text-caption text-secondary">필수 공간</span> : null}
                    </div>
                  </div>
                  {renderToggle(space.key, label, active, space.required)}
                </div>
              );
            })}
            {ownedExpansions.map((space) => {
              const active = setup.spaces.includes(space.key);
              return (
                <div key={space.key} className="flex items-center justify-between gap-space-sm">
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary">
                      <Icon name={space.icon} className="text-[22px]" />
                    </span>
                    <span className="block truncate text-title-sm text-on-surface">{space.label}</span>
                  </div>
                  {renderToggle(space.key, space.label, active, false)}
                </div>
              );
            })}
          </div>
        </section>

        {availableExpansions.length > 0 ? (
          <section className="flex flex-col gap-space-sm">
            <h2 className="text-title-sm">공간 추가하기</h2>
            {availableExpansions.map((space) => {
              const expanded = expandedKey === space.key;
              const panelId = `expansion-panel-${space.key}`;

              return (
                <section key={space.key} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                  <button
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between p-space-md text-left transition-colors active:bg-surface-container-low"
                    type="button"
                    onClick={() => setExpandedKey(expanded ? null : space.key)}
                  >
                    <div className="flex min-w-0 items-center gap-space-sm">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                        <Icon name={space.icon} className="text-[22px]" />
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate text-title-sm text-on-surface">{space.label}</span>
                        <span className="text-caption text-on-surface-variant">{space.price}P</span>
                      </div>
                    </div>
                    <Icon name="keyboard_arrow_down" className={`text-[22px] text-on-surface-variant transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  {expanded ? (
                    <div id={panelId} className="flex flex-col gap-space-sm px-space-md pb-space-md">
                      <div>
                        <p className="text-label-sm text-on-surface-variant">제공되는 관리 항목</p>
                        <ul className="mt-1 flex flex-col gap-1">
                          {space.previewItems.map((item) => (
                            <li key={item} className="flex items-center gap-1.5 text-body-md text-on-surface">
                              <Icon name="check" className="text-[16px] text-outline" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {!member ? (
                        <button className="flex h-11 w-full items-center justify-center rounded-full bg-primary-container text-label-md text-on-primary" type="button" onClick={() => navigate("/signup")}>
                          회원가입 하러 가기
                        </button>
                      ) : balance >= space.price ? (
                        <button className="flex h-11 w-full items-center justify-center rounded-full bg-primary-container text-label-md text-on-primary" type="button" onClick={() => purchaseSpace(space.key, space.label, space.price)}>
                          {space.price}P로 추가하기
                        </button>
                      ) : (
                        <button className="flex h-11 w-full items-center justify-center rounded-full bg-primary-container text-label-md text-on-primary" type="button" onClick={() => navigate("/points?intent=charge")}>
                          포인트 충전하러 가기
                        </button>
                      )}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </section>
        ) : null}
      </main>
      <Toast message={toastMessage} visible={showToast} pill />
    </PageShell>
  );
}
