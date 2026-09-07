import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";

type SpaceKey = "bathroom" | "kitchen" | "bedroom" | "living";

type SpaceInfoData = {
  key: SpaceKey;
  title: string;
  icon: string;
  tone: string;
  text: string;
  status: string;
  statusDetail: string;
  intervalBadge: string;
  records: Array<{ item: string; date: string }>;
};

const spaces: Record<SpaceKey, SpaceInfoData> = {
  bathroom: {
    key: "bathroom",
    title: "욕실",
    icon: "bathtub",
    tone: "bg-[#EAF4FF]",
    text: "text-primary",
    status: "슬슬 확인",
    statusDetail: "세면대와 배수구처럼 물기가 남는 항목은 1주 안팎으로 확인하면 좋아요.",
    intervalBadge: "1주",
    records: [
      { item: "세면대 수전 및 볼", date: "오늘 오후 8:30" },
      { item: "양변기 안팎", date: "9월 1일" },
      { item: "욕실 유리 거울", date: "8월 29일" },
    ],
  },
  kitchen: {
    key: "kitchen",
    title: "주방",
    icon: "countertops",
    tone: "bg-[#FFF1E7]",
    text: "text-[#8A4C00]",
    status: "확인 필요",
    statusDetail: "싱크대 거름망과 후드 필터는 조리 후 흔적이 남기 쉬워 먼저 확인해보면 좋아요.",
    intervalBadge: "3~7일",
    records: [
      { item: "싱크대 거름망", date: "오늘 오후 7:15" },
      { item: "인덕션 상판 및 조리대", date: "9월 1일" },
    ],
  },
  bedroom: {
    key: "bedroom",
    title: "침실",
    icon: "bed",
    tone: "bg-[#EFF8F5]",
    text: "text-tertiary",
    status: "관리 중",
    statusDetail: "침구와 베개 커버 기록이 이어지고 있어요. 바닥 모서리만 가끔 함께 보면 좋아요.",
    intervalBadge: "1~2주",
    records: [
      { item: "침실 침구", date: "9월 2일" },
      { item: "베개 커버", date: "8월 31일" },
    ],
  },
  living: {
    key: "living",
    title: "거실",
    icon: "chair",
    tone: "bg-[#FFECEF]",
    text: "text-[#9A4251]",
    status: "슬슬 확인",
    statusDetail: "바닥과 손잡이처럼 자주 닿는 곳은 최근 기록을 기준으로 다시 확인하면 좋아요.",
    intervalBadge: "1~2주",
    records: [
      { item: "거실 바닥", date: "8월 24일" },
      { item: "공기청정기 프리필터", date: "8월 20일" },
    ],
  },
};

const isSpaceKey = (value: string | null): value is SpaceKey => value === "bathroom" || value === "kitchen" || value === "bedroom" || value === "living";

export default function SpaceInfo() {
  const [searchParams] = useSearchParams();
  const requestedSpace = searchParams.get("space");
  const spaceKey: SpaceKey = isSpaceKey(requestedSpace) ? requestedSpace : "bathroom";
  const space = spaces[spaceKey];

  return (
    <PageShell>
      <AppHeader title="공간 정보" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-lg text-center shadow-sm">
          <span className={`mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-xl ${space.tone} ${space.text}`}>
            <Icon name={space.icon} className="text-[32px]" />
          </span>
          <div className="flex items-center justify-center gap-space-xs">
            <h1 className="text-headline-lg">{space.title}</h1>
            <Pill className={`${space.tone} ${space.text}`}>{space.intervalBadge}</Pill>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">{space.statusDetail}</p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex items-center justify-between gap-space-sm">
            <h2 className="text-title-sm">내 관리 상태</h2>
            <span className={`rounded-full px-2.5 py-1 text-label-sm ${space.tone} ${space.text}`}>{space.status}</span>
          </div>
          <p className="mt-space-xs text-caption text-on-surface-variant">주기 기준으로 현재 공간의 관리 흐름을 보여줘요.</p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="mb-space-sm flex items-center justify-between">
            <h2 className="text-title-sm">최근 청소 기록</h2>
            <Link className="text-label-sm text-primary" to="/history">
              히스토리 보기
            </Link>
          </div>
          <div className="flex flex-col gap-space-xs">
            {space.records.map((record) => (
              <article key={`${record.item}-${record.date}`} className="rounded-lg bg-surface-container-low p-space-sm">
                <h3 className="text-body-md font-semibold">{record.item}</h3>
                <p className="mt-0.5 text-caption text-on-surface-variant">{record.date} · 청소 완료</p>
              </article>
            ))}
          </div>
        </section>

        <Link className="flex min-h-12 items-center justify-center gap-space-xs rounded-xl border border-dashed border-outline-variant/70 bg-surface-container-lowest text-label-md text-on-surface-variant" to={`/quick-record?filter=space&space=${space.key}`}>
          <Icon name="add" className="text-[20px]" />
          청소 Item 추가하기
        </Link>
      </main>
    </PageShell>
  );
}
