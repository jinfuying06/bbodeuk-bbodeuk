import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

const discoveries = [
  ["레인지 후드 필터", "아직 기록이 없어요 · 30일 주기", "기름때가 쌓이기 전에 가볍게 확인해요.", "mode_fan"],
  ["욕실 배수구", "숨은 관리 추천", "눈에 잘 안 보여도 냄새 예방에 도움이 돼요.", "shower"],
  ["공기청정기 프리필터", "마지막 기록 12일 전", "한 달에 한 번 정도 먼지를 털어주세요.", "air"],
];

const guides = [
  ["세면대 물기 닦기", "마른 수건으로 수전과 볼을 닦아 반짝임을 남겨요."],
  ["싱크대 거름망", "음식물 찌꺼기를 비우고 따뜻한 물로 헹궈요."],
  ["침구 환기", "10분만 공기를 통하게 해도 쉼의 느낌이 달라져요."],
];

export default function Care() {
  return (
    <PageShell>
      <AppHeader title="청소 가이드" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-[88px] pt-16">
        <Link className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm" to="/deep-clean">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-fixed/40 blur-2xl" />
          <span className="mb-space-xs block text-label-sm text-secondary">대청소 하기</span>
          <h2 className="text-title-md">여러 공간을 한번에 훑어보기</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">전체 완료 없이, 실제로 한 곳만 골라 기록해도 괜찮아요.</p>
        </Link>
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-title-sm">숨은 관리 추천</h2>
          {discoveries.map(([title, meta, body, icon]) => (
            <Link key={title} className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm" to="/care-action">
              <div className="flex min-w-0 items-center gap-space-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                  <Icon name={icon} className="text-[22px]" />
                </span>
                <div className="min-w-0">
                  <span className="block truncate text-title-sm">{title}</span>
                  <span className="mt-0.5 block truncate text-caption text-on-surface-variant">{meta}</span>
                  <p className="truncate text-caption text-on-surface-variant">{body}</p>
                </div>
              </div>
              <Icon name="chevron_right" className="text-[20px] text-outline-variant" />
            </Link>
          ))}
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">기본 관리 가이드</h2>
          <div className="mt-space-sm flex flex-col gap-space-xs">
            {guides.map(([title, body]) => (
              <div key={title} className="rounded-xl bg-surface-container-low p-space-sm">
                <h3 className="text-body-md font-semibold">{title}</h3>
                <p className="mt-0.5 text-caption text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
