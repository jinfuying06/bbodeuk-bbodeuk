import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

type SpaceKey = "bathroom" | "kitchen" | "living" | "entry";

const spaceTones: Record<SpaceKey, { fill: string; border: string; text: string }> = {
  bathroom: {
    fill: "bg-[#EAF4FF]",
    border: "border-[#B8DCFF]",
    text: "text-primary",
  },
  kitchen: {
    fill: "bg-[#FFF1E7]",
    border: "border-[#FFD6B8]",
    text: "text-[#8A4C00]",
  },
  living: {
    fill: "bg-[#FFECEF]",
    border: "border-[#F9C9D2]",
    text: "text-[#9A4251]",
  },
  entry: {
    fill: "bg-[#F7F4EE]",
    border: "border-[#DED7C9]",
    text: "text-[#5E5545]",
  },
};

const spaceIcons: Record<SpaceKey, string> = {
  bathroom: "bathtub",
  kitchen: "countertops",
  living: "chair",
  entry: "door_front",
};

const discoveries = [
  {
    id: "hood",
    title: "레인지 후드 필터",
    space: "kitchen" as const,
    spaceLabel: "주방",
    status: "아직 기록 없음",
    interval: "2~4주",
    reason: "최근 청소 기록이 없어요.",
    description: "가끔 확인하면 좋은 관리 항목이에요.",
    icon: "filter_alt",
  },
  {
    id: "drain",
    title: "바닥 배수구 유가 거름망",
    space: "bathroom" as const,
    spaceLabel: "욕실",
    status: "아직 기록 없음",
    interval: "1~2주",
    reason: "최근 관리 기록이 없어요.",
    description: "냄새가 나기 전에 한 번씩 살펴보면 좋아요.",
    icon: "water_drop",
  },
  {
    id: "door-handle",
    title: "문손잡이",
    space: "entry" as const,
    spaceLabel: "현관",
    status: "슬슬 확인",
    interval: "1~2주",
    reason: "최근 기록이 없는 곳이 있어요.",
    description: "자주 닿는 곳이라 가볍게 확인하기 좋아요.",
    icon: "sensor_door",
  },
];

const basicGuides: Array<{
  key: SpaceKey;
  label: string;
  items: Array<{ id: string; title: string; description: string; interval: string }>;
}> = [
  {
    key: "bathroom",
    label: "욕실",
    items: [
      { id: "basin", title: "세면대", description: "수전과 볼 주변 물기, 비누 자국을 가볍게 정리해요.", interval: "7일" },
      { id: "drain", title: "바닥 배수구 유가 거름망", description: "머리카락과 비누 찌꺼기가 쌓이기 쉬운 곳이에요.", interval: "1~2주" },
    ],
  },
  {
    key: "kitchen",
    label: "주방",
    items: [
      { id: "hood", title: "레인지 후드 필터", description: "기름때가 깊게 쌓이기 전에 확인하면 좋아요.", interval: "2~4주" },
    ],
  },
  {
    key: "entry",
    label: "현관",
    items: [
      { id: "door-handle", title: "문손잡이", description: "자주 닿는 부분을 가볍게 닦아두는 관리예요.", interval: "1~2주" },
    ],
  },
];

export default function Care() {
  const [openSpaces, setOpenSpaces] = useState<Record<SpaceKey, boolean>>({ bathroom: true, kitchen: false, living: false, entry: false });

  return (
    <PageShell>
      <AppHeader title="청소가이드" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <section className="pb-space-sm pt-space-md">
          <h1 className="text-headline-lg text-on-surface">청소 방법을 확인해보세요</h1>
        </section>

        <section className="flex flex-col gap-space-sm">
          <h2 className="text-title-sm">놓치기 쉬운 관리</h2>
          {discoveries.map((item) => {
            const tone = spaceTones[item.space];

            return (
              <Link
                key={item.id}
                className="flex min-h-[92px] items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-transform active:scale-[0.99]"
                to={`/care-action?space=${item.space}&item=${item.id}`}
              >
                <div className="flex min-w-0 items-center gap-space-sm">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
                    <Icon name={spaceIcons[item.space]} className="text-[22px]" />
                  </span>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-space-xs">
                      <span className="truncate text-title-sm">{item.title}</span>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-label-sm ${tone.fill} ${tone.text}`}>{item.interval}</span>
                    </div>
                    <span className="block truncate text-caption text-on-surface-variant">{item.reason}</span>
                    <p className="mt-0.5 truncate text-caption text-on-surface-variant">{item.description}</p>
                  </div>
                </div>
                <Icon name="chevron_right" className="ml-space-sm shrink-0 text-[20px] text-outline-variant" />
              </Link>
            );
          })}
        </section>

        <section className="flex flex-col gap-space-sm">
          <h2 className="text-title-sm">기본 가이드</h2>
          {basicGuides.map((space) => {
            const tone = spaceTones[space.key];
            const open = Boolean(openSpaces[space.key]);

            return (
              <section key={space.key} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                <button
                  className="flex w-full items-center justify-between p-space-md text-left transition-colors active:bg-surface-container-low"
                  type="button"
                  onClick={() => setOpenSpaces((current) => ({ ...current, [space.key]: !current[space.key] }))}
                >
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
                      <Icon name={spaceIcons[space.key]} className="text-[22px]" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-title-sm">{space.label}</h3>
                      <p className="text-caption text-on-surface-variant">{space.items.length}개 가이드</p>
                    </div>
                  </div>
                  <Icon name="keyboard_arrow_down" className={`text-[22px] text-on-surface-variant transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </button>
                {open ? (
                  <div className="flex flex-col gap-space-xs px-space-md pb-space-md">
                    {space.items.map((item) => (
                      <Link key={item.id} className="flex min-h-[64px] items-center justify-between rounded-lg bg-surface-container-low p-space-sm transition-transform active:scale-[0.99]" to={`/care-action?space=${space.key}&item=${item.id}`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-space-xs">
                            <h4 className="truncate text-body-md font-semibold">{item.title}</h4>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-label-sm ${tone.fill} ${tone.text}`}>{item.interval}</span>
                          </div>
                          <p className="mt-0.5 truncate text-caption text-on-surface-variant">{item.description}</p>
                        </div>
                        <Icon name="chevron_right" className="ml-space-sm shrink-0 text-[20px] text-outline-variant" />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </section>
      </main>
    </PageShell>
  );
}
