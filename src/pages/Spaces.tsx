import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

type CareStatus = "확인 필요" | "슬슬 확인" | "관리 중" | "아직 기록 없음";

type CareItem = {
  id: string;
  title: string;
  status: CareStatus;
  lastRecord: string;
  intervalDays: number;
};

type Space = {
  key: string;
  title: string;
  icon: string;
  tone: string;
  iconTone: string;
  items: CareItem[];
};

const spaces: Space[] = [
  {
    key: "bathroom",
    title: "욕실",
    icon: "bathtub",
    tone: "bg-[#EAF4FF]",
    iconTone: "text-primary",
    items: [
      { id: "basin", title: "세면대 수전 및 볼", status: "슬슬 확인", lastRecord: "최근 관리 6일 전", intervalDays: 7 },
      { id: "toilet", title: "양변기 안팎", status: "관리 중", lastRecord: "최근 관리 1일 전", intervalDays: 7 },
      { id: "mirror", title: "욕실 유리 거울", status: "관리 중", lastRecord: "최근 관리 4일 전", intervalDays: 10 },
      { id: "drain", title: "바닥 배수구 유가 거름망", status: "아직 기록 없음", lastRecord: "최근 기록 없음", intervalDays: 7 },
    ],
  },
  {
    key: "kitchen",
    title: "주방",
    icon: "countertops",
    tone: "bg-[#FFF1E7]",
    iconTone: "text-[#8A4C00]",
    items: [
      { id: "sink", title: "싱크대 거름망", status: "확인 필요", lastRecord: "최근 관리 5일 전", intervalDays: 3 },
      { id: "countertop", title: "인덕션 상판 및 조리대", status: "관리 중", lastRecord: "최근 관리 어제", intervalDays: 5 },
      { id: "hood", title: "레인지 후드 필터", status: "아직 기록 없음", lastRecord: "최근 기록 없음", intervalDays: 21 },
    ],
  },
  {
    key: "bedroom",
    title: "침실",
    icon: "bed",
    tone: "bg-[#EFF8F5]",
    iconTone: "text-tertiary",
    items: [
      { id: "bedding", title: "침실 침구", status: "관리 중", lastRecord: "최근 관리 어제 저녁", intervalDays: 7 },
      { id: "pillow", title: "베개 커버", status: "관리 중", lastRecord: "최근 관리 2일 전", intervalDays: 7 },
    ],
  },
  {
    key: "living",
    title: "거실",
    icon: "chair",
    tone: "bg-[#FFECEF]",
    iconTone: "text-[#9A4251]",
    items: [
      { id: "living-floor", title: "거실 바닥", status: "슬슬 확인", lastRecord: "최근 관리 7일 전", intervalDays: 7 },
      { id: "air-filter", title: "공기청정기 프리필터", status: "관리 중", lastRecord: "최근 관리 12일 전", intervalDays: 30 },
      { id: "door-handle", title: "문 손잡이", status: "아직 기록 없음", lastRecord: "최근 기록 없음", intervalDays: 14 },
    ],
  },
];

const tabs = ["전체 보기", "욕실", "주방", "침실", "거실"];

const statusTone: Record<CareStatus, string> = {
  "확인 필요": "bg-secondary-fixed text-on-secondary-fixed-variant",
  "슬슬 확인": "bg-primary-fixed text-on-primary-fixed-variant",
  "관리 중": "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant",
  "아직 기록 없음": "bg-surface-container-high text-on-surface-variant",
};

const getSummary = (items: CareItem[]) => {
  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { "확인 필요": 0, "슬슬 확인": 0, "관리 중": 0, "아직 기록 없음": 0 } as Record<CareStatus, number>,
  );

  return [
    counts["확인 필요"] ? `확인 필요 ${counts["확인 필요"]}` : null,
    counts["슬슬 확인"] ? `슬슬 확인 ${counts["슬슬 확인"]}` : null,
    counts["관리 중"] ? `관리 중 ${counts["관리 중"]}` : null,
    counts["아직 기록 없음"] ? `기록 없음 ${counts["아직 기록 없음"]}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
};

export default function Spaces() {
  const [selectedTab, setSelectedTab] = useState("전체 보기");
  const visibleSpaces = selectedTab === "전체 보기" ? spaces : spaces.filter((space) => space.title === selectedTab);

  return (
    <PageShell>
      <AppHeader title="공간 정보" />
      <main className="flex min-h-[844px] flex-col bg-surface pb-[88px] pt-16">
        <div className="flex flex-col gap-space-md px-margin-screen pb-space-2xl">
          <div className="hide-scrollbar -mx-margin-screen overflow-x-auto px-margin-screen">
            <div className="flex min-w-max gap-space-xs">
              {tabs.map((label) => {
                const active = selectedTab === label;
                return (
                  <button key={label} className={`min-h-11 rounded-full px-4 py-2 text-label-md ${active ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant"}`} type="button" onClick={() => setSelectedTab(label)}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {visibleSpaces.map((space) => (
            <section key={space.key} className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
              <div className="mb-space-md flex items-start justify-between gap-space-sm">
                <div className="flex min-w-0 items-center gap-space-xs">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${space.tone} ${space.iconTone}`}>
                    <Icon name={space.icon} className="text-[22px]" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-title-md">{space.title}</h2>
                    <p className="text-caption text-on-surface-variant">{getSummary(space.items)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-space-xs">
                {space.items.map((item) => (
                  <Link key={item.id} className="flex min-h-[68px] items-center justify-between rounded-xl bg-surface-container-low p-3 transition-transform active:scale-[0.99]" to={`/item-info?space=${space.key}&item=${item.id}`}>
                    <div className="min-w-0">
                      <span className="block truncate text-title-sm">{item.title}</span>
                      <p className="mt-0.5 truncate text-caption text-on-surface-variant">{item.lastRecord}</p>
                    </div>
                    <div className="ml-space-sm flex shrink-0 items-center gap-space-xs">
                      <span className={`rounded-full px-2.5 py-1 text-label-sm ${statusTone[item.status]}`}>{item.status}</span>
                      <Icon name="chevron_right" className="text-[20px] text-outline-variant" />
                    </div>
                  </Link>
                ))}
                <Link className="flex min-h-[60px] items-center justify-center gap-space-xs rounded-xl border border-dashed border-outline-variant/70 bg-surface-container-lowest text-label-md text-on-surface-variant transition-transform active:scale-[0.99]" to={`/item-add?space=${space.key}`}>
                  <Icon name="add" className="text-[20px]" />
                  항목 추가
                </Link>
              </div>
            </section>
          ))}

          {visibleSpaces.length === 0 ? (
            <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <p className="text-title-sm text-on-surface">이 공간에는 아직 관리 항목이 없어요.</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">관리할 곳을 추가하면 이 화면에서 모아볼 수 있어요.</p>
            </section>
          ) : null}
        </div>
      </main>
    </PageShell>
  );
}
