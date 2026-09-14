import Icon from "./Icon";

type SpaceExpansionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function SpaceExpansionDialog({ open, onClose }: SpaceExpansionDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-on-surface/40" role="presentation" onClick={onClose}>
      <section
        aria-labelledby="space-expansion-title"
        aria-modal="true"
        className="w-full max-w-[430px] rounded-t-xl bg-surface-container-lowest px-margin-screen pb-[calc(24px+env(safe-area-inset-bottom,0px))] pt-space-lg shadow-xl"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-space-sm">
          <div>
            <p className="text-label-sm text-secondary">공간 확장</p>
            <h2 id="space-expansion-title" className="mt-1 text-headline-md">공간 1개를 300P로 추가할 수 있어요</h2>
          </div>
          <button aria-label="닫기" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-low" type="button" onClick={onClose}>
            <Icon name="close" className="text-[22px]" />
          </button>
        </div>
        <p className="mt-space-md text-body-md text-on-surface-variant">가입하면 시작 포인트 300P가 제공되어 첫 공간을 추가할 수 있어요.</p>
        <p className="mt-space-xs text-body-md text-on-surface-variant">기본 공간은 포인트 없이 바로 사용할 수 있어요.</p>
        <p className="mt-space-md text-caption text-on-surface-variant">현재 체험판에서는 공간 구매와 회원가입이 제공되지 않아요.</p>
        <button className="mt-space-lg flex h-12 w-full items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary" type="button" onClick={onClose}>기본 공간으로 계속하기</button>
      </section>
    </div>
  );
}
