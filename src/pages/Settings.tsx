import AppHeader from "../components/AppHeader";
import BrandLogo from "../components/BrandLogo";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

const intervals = [
  ["세면대", "기본 7일", "내 설정 10일"],
  ["싱크대", "기본 3일", "기본 추천 사용"],
  ["후드 필터", "기본 30일", "추천 켜짐"],
];

export default function Settings() {
  return (
    <PageShell>
      <AppHeader title="설정" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex items-center gap-space-sm">
            <BrandLogo className="h-12 w-12" />
            <div>
              <h1 className="text-title-md">설정</h1>
              <p className="text-caption text-on-surface-variant">권장 주기와 알림을 관리해요.</p>
            </div>
          </div>
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <span className="text-label-sm text-secondary">연속 4주째 관리 중</span>
          <h2 className="mt-space-sm text-headline-lg">이번 달 총 28번의 맑은 기록</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">이번 달 기록을 기준으로 자주 관리한 공간을 보여줘요.</p>
          <p className="mt-space-md text-caption text-on-surface-variant">욕실 12회 · 주방 9회 · 침실&거실 7회</p>
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">권장 주기 설정</h2>
          <div className="mt-space-sm flex flex-col gap-space-xs">
            {intervals.map(([title, base, setting]) => (
              <div key={title} className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-sm">
                <div>
                  <span className="block text-body-md font-semibold">{title}</span>
                  <span className="text-caption text-on-surface-variant">{base}</span>
                </div>
                <span className="text-caption text-on-surface-variant">{setting}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">추천과 알림</h2>
          {["기본 추천 사용", "부드러운 추천 알림", "숨은 관리 발견"].map((label) => (
            <div key={label} className="mt-space-sm flex items-center justify-between">
              <span className="text-body-md">{label}</span>
              <span className="h-7 w-12 rounded-full bg-primary-container p-1">
                <span className="block h-5 w-5 translate-x-5 rounded-full bg-white shadow-sm" />
              </span>
            </div>
          ))}
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">서비스 정보</h2>
          {["도움말", "개인정보 처리방침", "앱 버전 0.1.0"].map((item) => (
            <div key={item} className="flex min-h-[44px] items-center justify-between border-b border-outline-variant/30 last:border-b-0">
              <span className="text-body-md text-on-surface-variant">{item}</span>
              <Icon name="chevron_right" className="text-[18px] text-outline-variant" />
            </div>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
