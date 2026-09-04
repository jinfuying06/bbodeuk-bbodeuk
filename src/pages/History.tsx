import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

const logs = [
  {
    date: "오늘 (10월 24일 목요일)",
    count: "2건 완료",
    items: [
      ["세면대 수전 물기 닦기", "욕실 Bathroom · 오후 08:30", "마른 수건으로 쓱 닦아두니 반짝거린다."],
      ["싱크대 거름망 비우기 및 온수 헹굼", "주방 Kitchen · 오후 07:15", "저녁 식기 정리 후 가벼운 마무리 관리"],
    ],
  },
  {
    date: "10월 20일 일요일",
    count: "대청소 하기 · 5곳 묶음",
    items: [["5곳을 가볍게 돌봤어요", "욕실 2 · 주방 1 · 거실 2", "대청소로 가뿐하게 완료"]],
  },
  {
    date: "10월 15일 화요일",
    count: "2건 완료",
    items: [
      ["냉장고 도어 손잡이 소독 닦기", "주방 · 오후 09:10", "자주 닿는 곳을 산뜻하게"],
      ["공기청정기 프리필터 먼지 털기", "거실 · 숨은 관리 발견", "환절기 쾌적 공기 확보"],
    ],
  },
];

export default function History() {
  return (
    <PageShell>
      <AppHeader title="히스토리" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <span className="text-label-sm text-secondary">10월 누적</span>
          <h1 className="mt-space-sm text-headline-lg">이번 달 총 28번의 맑은 기록</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">최근 청소 기록을 날짜별로 확인해요.</p>
          <p className="mt-space-md text-caption text-on-surface-variant">욕실 12회 · 주방 9회 · 침실&거실 7회</p>
        </section>
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-title-md" type="button">
            <Icon name="chevron_left" className="text-[20px]" />
            2024년 10월
            <Icon name="chevron_right" className="text-[20px]" />
          </button>
          <button className="rounded-full bg-surface-container-low px-3 py-1.5 text-label-sm text-on-surface-variant" type="button">오늘로 이동</button>
        </div>
        <div className="hide-scrollbar -mx-margin-screen overflow-x-auto px-margin-screen">
          <div className="flex min-w-max gap-space-xs">
            {["전체 기록 (28)", "공간별 보기", "자주 돌본 곳", "사진"].map((tab, index) => (
              <button key={tab} className={`rounded-full px-4 py-2 text-label-md ${index === 0 ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface-variant shadow-sm"}`} type="button">
                {tab}
              </button>
            ))}
          </div>
        </div>
        {logs.map((day) => (
          <section key={day.date}>
            <div className="mb-space-xs flex items-center justify-between">
              <h2 className="text-title-sm">{day.date}</h2>
              <span className="text-caption text-primary">{day.count}</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              {day.items.map(([title, meta, body]) => (
                <article key={title} className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
                  <h3 className="text-title-sm">{title}</h3>
                  <p className="mt-0.5 text-caption text-on-surface-variant">{meta}</p>
                  <p className="mt-1 text-body-md text-on-surface-variant">{body}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex items-start gap-space-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <Icon name="self_improvement" className="text-[22px]" />
            </span>
            <div>
              <h2 className="text-title-sm">이번 달 기록 요약</h2>
              <p className="mt-1 text-body-md text-on-surface-variant">지난달보다 주방과 욕실을 4번 더 산뜻하게 챙겼어요.</p>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
