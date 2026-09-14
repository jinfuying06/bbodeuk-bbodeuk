import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { readPoints } from "../data/points";

export default function Settings() {
  const balance = readPoints();
  const availableRooms = Math.floor(balance / 300);

  return (
    <PageShell>
      <AppHeader title="설정" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex items-center justify-between gap-space-sm">
            <div>
              <span className="text-label-sm text-secondary">보유 포인트</span>
              <h1 className="mt-1 text-headline-lg text-on-surface">{balance.toLocaleString()}P</h1>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <Icon name="toll" className="text-[26px]" />
            </span>
          </div>
          <p className="mt-space-sm text-body-md text-on-surface-variant">
            {availableRooms > 0 ? `방 ${availableRooms}개를 추가할 수 있어요.` : "포인트를 구매하면 방을 추가할 수 있어요."}
          </p>
          <Link className="mt-space-md inline-flex min-h-11 items-center gap-space-xs text-label-md text-primary" to="/points">
            포인트 구매하기
            <Icon name="chevron_right" className="text-[18px]" />
          </Link>
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
