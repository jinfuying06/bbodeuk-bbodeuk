import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import SpaceExpansionDialog from "../components/SpaceExpansionDialog";
import SwitchRow from "../components/Switch";
import { SPACES } from "../data/cleaning";
import { SPACE_PRICE, spendPoints } from "../data/points";
import { DEFAULT_SPACES, EXPANSION_CATALOG, hasCompletedSetup, readSetup, writeSetup, type SetupData } from "../data/setup";

// Figma 17 row order: 욕실, 주방, 거실, 방.
const ROWS = ["욕실", "주방", "거실", "침실 / 방"].map((key) => DEFAULT_SPACES.find((space) => space.key === key)!);

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const save = (next: SetupData) => {
    setSetup(next);
    writeSetup(next);
  };
  const toggle = (key: string) => save({ ...setup, spaces: setup.spaces.includes(key) ? setup.spaces.filter((space) => space !== key) : [...setup.spaces, key] });

  const owned = EXPANSION_CATALOG.filter((item) => setup.spaces.includes(item.key));
  const nextExpansion = EXPANSION_CATALOG.find((item) => !setup.spaces.includes(item.key));
  const nextSpace = nextExpansion ? SPACES.find((space) => space.setupKeys.includes(nextExpansion.key)) : undefined;

  const purchase = () => {
    if (!nextExpansion || !spendPoints(SPACE_PRICE)) return;
    save({ ...setup, spaces: [...setup.spaces, nextExpansion.key] });
    setDialogOpen(false);
    navigate(`/space-added?space=${nextSpace?.key ?? "terrace"}`);
  };

  const rows = [
    ...ROWS.map((space) => ({ key: space.key, label: space.key === "침실 / 방" ? setup.roomName : space.label, locked: space.required })),
    ...owned.map((space) => ({ key: space.key, label: space.label, locked: false })),
  ];

  return (
    <PageShell>
      <AppHeader title="공간 관리" back="/spaces" />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title="내 집에 맞게 관리해요" body="필요한 공간만 켜두세요." className="pb-6" />

        {rows.map((row) => (
          <SwitchRow key={row.key} label={row.label} locked={row.locked} on={row.locked || setup.spaces.includes(row.key)} onToggle={() => toggle(row.key)} />
        ))}

        <p className="text-bb-caption text-sky-muted">* 욕실과 주방은 기본 관리 공간이에요.</p>

        <section className="flex flex-col gap-2 rounded-3xl bg-sky-tint px-5 pb-4 pt-4">
          <h2 className="text-bb-title text-sky-ink">공간을 조금 더 넓혀볼까요?</h2>
          <p className="text-bb-body text-sky-muted">
            베란다·드레스룸 같은 추가 공간은
            <br />
            1개당 {SPACE_PRICE}P로 열 수 있어요.
          </p>
        </section>

        {nextExpansion ? (
          <GlassButton variant="secondary" className="w-full" onClick={() => setDialogOpen(true)}>
            ＋ 추가 공간 살펴보기
          </GlassButton>
        ) : null}
      </main>
      <SpaceExpansionDialog open={dialogOpen} spaceLabel={nextSpace?.label ?? nextExpansion?.label} onClose={() => setDialogOpen(false)} onConfirm={purchase} />
    </PageShell>
  );
}
