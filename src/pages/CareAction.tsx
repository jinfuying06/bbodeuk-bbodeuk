import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";

const actions = ["세면볼 닦기", "수전 물때 제거", "배수구 주변 헹굼"];
const records = ["오늘 오후 8:30 · 물기 닦기", "6일 전 · 가벼운 세척", "13일 전 · 배수구 정리"];

export default function CareAction() {
  return (
    <PageShell>
      <AppHeader title="세면대 관리" />
      <main className="flex min-h-[844px] flex-col gap-space-md bg-surface px-margin-screen pb-28 pt-16">
        <section className="rounded-xl bg-surface-container-lowest p-space-lg text-center shadow-sm">
          <span className="mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
            <Icon name="wash" className="text-[34px]" />
          </span>
          <Pill className="bg-primary-fixed text-primary">욕실 Bathroom</Pill>
          <h1 className="mt-space-xs text-headline-lg">세면대</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">마지막 기록 6일 전 · 기본 권장 주기 7일</p>
          <Link className="mt-space-lg flex h-12 items-center justify-center gap-2 rounded-full bg-primary-container text-title-sm text-on-primary shadow-md" to="/quick-record">
            <Icon name="format_paint" className="text-[20px]" />
            세면대 맑게 기록하기
          </Link>
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">관리에 포함될 수 있어요</h2>
          <div className="mt-space-sm grid grid-cols-3 gap-space-xs">
            {actions.map((action) => (
              <div key={action} className="rounded-xl bg-surface-container-low p-space-sm text-center">
                <Icon name="check_circle" className="mx-auto mb-1 text-[20px] text-primary" />
                <span className="text-caption text-on-surface-variant">{action}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="mb-space-sm flex items-center justify-between">
            <h2 className="text-title-sm">권장 주기</h2>
            <Pill className="bg-secondary-fixed text-secondary">7일</Pill>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-container">
            <div className="h-full w-[86%] rounded-full bg-primary-container" />
          </div>
          <p className="mt-space-xs text-caption text-on-surface-variant">숫자 압박 대신, 슬슬 다시 볼 시점을 부드럽게 알려줘요.</p>
        </section>
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <h2 className="text-title-sm">최근 CleaningLog</h2>
          <div className="mt-space-sm flex flex-col gap-space-xs">
            {records.map((record) => (
              <div key={record} className="flex items-center gap-space-xs rounded-lg bg-surface-container-low p-space-sm">
                <Icon name="task_alt" className="text-[20px] text-tertiary" />
                <span className="text-body-md">{record}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
