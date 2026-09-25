import Icon from "../../components/Icon";

/**
 * AppHeader(back 변형)와 같은 모양의 헤더. 이 흐름의 단계(사진 → 초안)는 라우트가 아니라 state라서
 * AppHeader의 navigate(-1) 대신 onBack을 직접 받는다.
 */
export default function FlowHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="fixed left-1/2 top-0 z-50 w-full max-w-[430px] -translate-x-1/2 bg-sky-bg pt-safe">
      <div className="flex h-header items-center justify-between px-4">
        <button aria-label="이전 화면으로" className="flex h-11 w-11 shrink-0 items-center justify-center text-sky-deep transition-opacity active:opacity-60" type="button" onClick={onBack}>
          <Icon name="chevron-left" className="text-[22px]" />
        </button>
        <span className="min-w-0 flex-1 truncate text-center text-bb-label text-sky-ink">{title}</span>
        <div className="h-11 w-11 shrink-0" />
      </div>
    </header>
  );
}
