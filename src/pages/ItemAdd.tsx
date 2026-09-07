import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

type SpaceKey = "bathroom" | "kitchen" | "bedroom" | "living";

const spaceOptions: Array<{ key: SpaceKey; label: string; fill: string; text: string }> = [
  { key: "bathroom", label: "욕실", fill: "bg-[#EAF4FF]", text: "text-primary" },
  { key: "kitchen", label: "주방", fill: "bg-[#FFF1E7]", text: "text-[#8A4C00]" },
  { key: "bedroom", label: "침실", fill: "bg-[#EFF8F5]", text: "text-tertiary" },
  { key: "living", label: "거실", fill: "bg-[#FFECEF]", text: "text-[#9A4251]" },
];

const isSpaceKey = (value: string | null): value is SpaceKey => value === "bathroom" || value === "kitchen" || value === "bedroom" || value === "living";

export default function ItemAdd() {
  const [searchParams] = useSearchParams();
  const requestedSpace = searchParams.get("space");
  const initialSpace: SpaceKey = isSpaceKey(requestedSpace) ? requestedSpace : "bathroom";
  const [name, setName] = useState("");
  const [space, setSpace] = useState<SpaceKey>(initialSpace);
  const [intervalDays, setIntervalDays] = useState("");
  const [saved, setSaved] = useState(false);
  const currentSpace = spaceOptions.find((option) => option.key === space) ?? spaceOptions[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !space || !intervalDays.trim()) return;
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  return (
    <PageShell>
      <AppHeader title="항목 추가" />
      <form id="item-add-form" className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[156px] pt-16" onSubmit={handleSubmit}>
        <section className="rounded-xl bg-surface-container-lowest p-space-lg text-center shadow-sm">
          <span className={`mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-xl ${currentSpace.fill} ${currentSpace.text}`}>
            <Icon name="add" className="text-[32px]" />
          </span>
          <h1 className="text-headline-lg">새 청소 항목</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">관리할 항목과 공간, 청소주기를 입력해요.</p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <label className="block text-label-md text-on-surface" htmlFor="add-name">
            명칭
          </label>
          <input id="add-name" required className="mt-space-xs h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm text-body-md outline-none focus:border-primary" value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 욕실 유리거울" />
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <label className="block text-label-md text-on-surface" htmlFor="add-space">
            공간 분류
          </label>
          <select id="add-space" required className="mt-space-xs h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm text-body-md outline-none focus:border-primary" value={space} onChange={(event) => isSpaceKey(event.target.value) && setSpace(event.target.value)}>
            {spaceOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <label className="block text-label-md text-on-surface" htmlFor="add-interval">
            청소주기
          </label>
          <div className="mt-space-xs flex items-center gap-space-xs">
            <input id="add-interval" required min={1} inputMode="numeric" type="number" className="h-12 min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm text-body-md outline-none focus:border-primary" value={intervalDays} onChange={(event) => setIntervalDays(event.target.value)} placeholder="7" />
            <span className="shrink-0 text-body-md text-on-surface-variant">일에 한번</span>
          </div>
        </section>
      </form>

      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-surface/90 px-margin-screen py-space-sm backdrop-blur-xl">
        <button className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary-container text-title-sm font-semibold text-on-primary shadow-md transition-transform active:scale-[0.98]" type="submit" form="item-add-form">
          <Icon name="save" className="text-[20px]" />
          {saved ? "저장했어요" : "저장"}
        </button>
      </div>
    </PageShell>
  );
}
