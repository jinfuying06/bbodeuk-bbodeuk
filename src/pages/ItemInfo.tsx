import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

type SpaceKey = "bathroom" | "kitchen" | "bedroom" | "living";

type ItemData = {
  id: string;
  name: string;
  space: SpaceKey;
  spaceLabel: string;
  icon: string;
  intervalDays: number;
};

const spaceTones: Record<SpaceKey, { fill: string; text: string }> = {
  bathroom: { fill: "bg-[#EAF4FF]", text: "text-primary" },
  kitchen: { fill: "bg-[#FFF1E7]", text: "text-[#8A4C00]" },
  bedroom: { fill: "bg-[#EFF8F5]", text: "text-tertiary" },
  living: { fill: "bg-[#FFECEF]", text: "text-[#9A4251]" },
};

const spaceIcons: Record<SpaceKey, string> = {
  bathroom: "bathtub",
  kitchen: "countertops",
  bedroom: "bed",
  living: "chair",
};

const items: ItemData[] = [
  { id: "basin", name: "세면대 수전 및 볼", space: "bathroom", spaceLabel: "욕실", icon: "wash", intervalDays: 7 },
  { id: "toilet", name: "양변기 안팎", space: "bathroom", spaceLabel: "욕실", icon: "cleaning_services", intervalDays: 7 },
  { id: "mirror", name: "욕실 유리거울", space: "bathroom", spaceLabel: "욕실", icon: "auto_awesome", intervalDays: 10 },
  { id: "drain", name: "바닥 배수구 유가 거름망", space: "bathroom", spaceLabel: "욕실", icon: "water_drop", intervalDays: 7 },
  { id: "sink", name: "싱크대 거름망", space: "kitchen", spaceLabel: "주방", icon: "faucet", intervalDays: 3 },
  { id: "countertop", name: "인덕션 상판 및 조리대", space: "kitchen", spaceLabel: "주방", icon: "countertops", intervalDays: 5 },
  { id: "hood", name: "레인지 후드 필터", space: "kitchen", spaceLabel: "주방", icon: "filter_alt", intervalDays: 21 },
  { id: "bedding", name: "침실 침구", space: "bedroom", spaceLabel: "침실", icon: "bed", intervalDays: 7 },
  { id: "pillow", name: "베개 커버", space: "bedroom", spaceLabel: "침실", icon: "hotel", intervalDays: 7 },
  { id: "living-floor", name: "거실 바닥", space: "living", spaceLabel: "거실", icon: "mop", intervalDays: 7 },
  { id: "air-filter", name: "공기청정기 프리필터", space: "living", spaceLabel: "거실", icon: "air", intervalDays: 30 },
  { id: "door-handle", name: "문 손잡이", space: "living", spaceLabel: "거실", icon: "sensor_door", intervalDays: 14 },
];

const spaceOptions: Array<{ key: SpaceKey; label: string }> = [
  { key: "bathroom", label: "욕실" },
  { key: "kitchen", label: "주방" },
  { key: "bedroom", label: "침실" },
  { key: "living", label: "거실" },
];

const isSpaceKey = (value: string): value is SpaceKey => value === "bathroom" || value === "kitchen" || value === "bedroom" || value === "living";

export default function ItemInfo() {
  const [searchParams] = useSearchParams();
  const item = items.find((entry) => entry.id === searchParams.get("item")) ?? items[0];
  const [name, setName] = useState(item.name);
  const [space, setSpace] = useState<SpaceKey>(item.space);
  const [intervalDays, setIntervalDays] = useState(String(item.intervalDays));
  const [saved, setSaved] = useState(false);
  const tone = spaceTones[space];
  const spaceLabel = spaceOptions.find((option) => option.key === space)?.label ?? item.spaceLabel;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !intervalDays.trim()) return;
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  return (
    <PageShell>
      <AppHeader title="아이템 상세 보기" />
      <form id="item-info-form" className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[156px] pt-16" onSubmit={handleSubmit}>
        <section className="rounded-xl bg-surface-container-lowest p-space-lg text-center shadow-sm">
          <span className={`mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
            <Icon name={spaceIcons[space]} className="text-[32px]" />
          </span>
          <h1 className="text-headline-lg">{name || item.name}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {spaceLabel} · {intervalDays || item.intervalDays}일에 한번
          </p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <label className="block text-label-md text-on-surface" htmlFor="item-name">
            명칭
          </label>
          <input id="item-name" required className="mt-space-xs h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm text-body-md outline-none focus:border-primary" value={name} onChange={(event) => setName(event.target.value)} />
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <label className="block text-label-md text-on-surface" htmlFor="item-space">
            공간 분류
          </label>
          <select id="item-space" required className="mt-space-xs h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm text-body-md outline-none focus:border-primary" value={space} onChange={(event) => isSpaceKey(event.target.value) && setSpace(event.target.value)}>
            {spaceOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <label className="block text-label-md text-on-surface" htmlFor="item-interval">
            설정된 청소주기
          </label>
          <div className="mt-space-xs flex items-center gap-space-xs">
            <input id="item-interval" required min={1} inputMode="numeric" type="number" className="h-12 min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm text-body-md outline-none focus:border-primary" value={intervalDays} onChange={(event) => setIntervalDays(event.target.value)} />
            <span className="shrink-0 text-body-md text-on-surface-variant">일에 한번</span>
          </div>
        </section>
      </form>

      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-surface/90 px-margin-screen py-space-sm backdrop-blur-xl">
        <button className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary-container text-title-sm font-semibold text-on-primary shadow-md transition-transform active:scale-[0.98]" type="submit" form="item-info-form">
          <Icon name="save" className="text-[20px]" />
          {saved ? "저장했어요" : "저장"}
        </button>
      </div>
    </PageShell>
  );
}
