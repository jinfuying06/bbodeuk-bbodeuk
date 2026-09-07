import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

type SpaceKey = "bathroom" | "kitchen" | "living" | "entry";
type CareStatus = "확인 필요" | "슬슬 확인" | "관리 중" | "아직 기록 없음";

type GuideItem = {
  id: string;
  space: SpaceKey;
  spaceLabel: string;
  title: string;
  icon: string;
  description: string;
  status: CareStatus;
  interval: string;
  lastRecord: string;
  steps: string[];
  related: Array<{ title: string; description: string; icon: string }>;
  records: Array<{ date: string; result: string }>;
};

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

const guides: GuideItem[] = [
  {
    id: "basin",
    space: "bathroom",
    spaceLabel: "욕실",
    title: "세면대",
    icon: "wash",
    description: "수전과 볼 주변의 물기, 비누 자국을 가볍게 정리하는 관리예요.",
    status: "슬슬 확인",
    interval: "7일",
    lastRecord: "최근 청소 · 오늘 오후 8:30",
    steps: ["물기를 먼저 닦아요.", "수전 주변 얼룩을 부드럽게 닦아요.", "마른 수건으로 남은 물기를 정리해요."],
    related: [
      { title: "욕실 유리 거울", description: "물자국이 같이 남기 쉬워요.", icon: "auto_awesome" },
      { title: "바닥 배수구 유가 거름망", description: "세면대 주변 관리 후 함께 보기 좋아요.", icon: "water_drop" },
    ],
    records: [
      { date: "오늘 오후 8:30", result: "청소 완료" },
      { date: "8월 29일", result: "청소 완료" },
    ],
  },
  {
    id: "hood",
    space: "kitchen",
    spaceLabel: "주방",
    title: "레인지 후드 필터",
    icon: "filter_alt",
    description: "조리 중 생긴 기름때가 필터에 쌓이지 않도록 확인하는 관리예요.",
    status: "아직 기록 없음",
    interval: "2~4주",
    lastRecord: "최근 청소 기록이 없어요.",
    steps: ["필터를 분리해요.", "미지근한 물에 잠시 불려요.", "부드럽게 닦아요.", "완전히 말린 뒤 다시 장착해요."],
    related: [
      { title: "인덕션 상판 및 조리대", description: "조리 후 같이 닦기 좋아요.", icon: "countertops" },
      { title: "싱크대 거름망", description: "주방 마무리 관리로 이어져요.", icon: "faucet" },
    ],
    records: [],
  },
  {
    id: "drain",
    space: "bathroom",
    spaceLabel: "욕실",
    title: "바닥 배수구 유가 거름망",
    icon: "water_drop",
    description: "머리카락과 비누 찌꺼기가 쌓이기 쉬운 곳을 확인하는 관리예요.",
    status: "아직 기록 없음",
    interval: "1~2주",
    lastRecord: "최근 청소 기록이 없어요.",
    steps: ["거름망을 분리해요.", "쌓인 이물질을 제거해요.", "물로 가볍게 헹궈요.", "주변 물기를 정리해요."],
    related: [
      { title: "세면대", description: "욕실 물때 관리와 함께 보기 좋아요.", icon: "wash" },
      { title: "양변기 안팎", description: "욕실 기본 관리 항목이에요.", icon: "cleaning_services" },
    ],
    records: [],
  },
  {
    id: "door-handle",
    space: "entry",
    spaceLabel: "현관",
    title: "문손잡이",
    icon: "sensor_door",
    description: "손이 자주 닿는 부분을 짧게 닦아두는 관리예요.",
    status: "슬슬 확인",
    interval: "1~2주",
    lastRecord: "최근 청소 · 8월 24일",
    steps: ["마른 천으로 먼지를 닦아요.", "자주 닿는 면을 한 번 더 닦아요.", "주변 스위치까지 가볍게 확인해요."],
    related: [
      { title: "현관 바닥", description: "생활 동선에 함께 있는 관리 항목이에요.", icon: "door_front" },
      { title: "신발장", description: "가끔 같이 확인하면 좋아요.", icon: "steps" },
    ],
    records: [{ date: "8월 24일", result: "청소 완료" }],
  },
];

export default function CareAction() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("item") ?? "basin";
  const guide = guides.find((item) => item.id === itemId) ?? guides[0];
  const tone = spaceTones[guide.space];

  return (
    <PageShell>
      <AppHeader title="가이드 상세" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[156px] pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-lg text-center shadow-sm">
          <span className={`mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
            <Icon name={spaceIcons[guide.space]} className="text-[30px]" />
          </span>
          <div className="mt-space-sm flex items-center justify-center gap-space-xs">
            <h1 className="text-headline-lg">{guide.title}</h1>
            <span className={`rounded-full px-2.5 py-1 text-label-sm ${tone.fill} ${tone.text}`}>{guide.interval}</span>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">{guide.description}</p>
          <p className="mt-space-xs text-caption text-on-surface-variant">{guide.lastRecord}</p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">기본 관리 방법</h2>
          <ol className="mt-space-sm flex flex-col gap-space-xs">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex gap-space-xs rounded-lg bg-surface-container-low p-space-sm text-body-md text-on-surface-variant">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone.fill} text-label-sm ${tone.text}`}>{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">함께 관리하면 좋아요</h2>
          <div className="mt-space-sm flex flex-col gap-space-xs">
            {guide.related.map((item) => (
              <Link key={item.title} className="flex min-h-[64px] items-center justify-between rounded-lg bg-surface-container-low p-space-sm transition-transform active:scale-[0.99]" to="/care-action">
                <div className="flex min-w-0 items-center gap-space-sm">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.fill} ${tone.text}`}>
                    <Icon name={spaceIcons[guide.space]} className="text-[20px]" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-body-md font-semibold">{item.title}</h3>
                    <p className="mt-0.5 truncate text-caption text-on-surface-variant">{item.description}</p>
                  </div>
                </div>
                <Icon name="chevron_right" className="ml-space-sm shrink-0 text-[20px] text-outline-variant" />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-surface/90 px-margin-screen py-space-sm backdrop-blur-xl">
        <Link className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-primary-container text-title-sm font-semibold text-on-primary shadow-md transition-transform active:scale-[0.98]" to={`/quick-record?filter=space&space=${guide.space}`}>
          <Icon name="format_paint" className="text-[20px]" />
          청소 기록하러 가기
        </Link>
      </div>
    </PageShell>
  );
}
