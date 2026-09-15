import { useEffect, useRef } from "react";
import Icon from "./Icon";

type SpaceExpansionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function SpaceExpansionDialog({ open, onClose }: SpaceExpansionDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

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
        <div className="flex items-start justify-between gap-space-md">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <Icon name="add_home" className="text-[22px]" />
          </span>
          <button ref={closeButtonRef} aria-label="닫기" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-low" type="button" onClick={onClose}>
            <Icon name="close" className="text-[22px]" />
          </button>
        </div>
        <h2 id="space-expansion-title" className="mt-space-md text-headline-md">300P로 공간을 추가할 수 있어요</h2>
        <p className="mt-space-sm text-body-md text-on-surface-variant">회원가입 시 포인트 300P가 제공되어 공간 1개를 무료로 추가할 수 있어요.</p>
        <button className="mt-space-lg flex h-12 w-full items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary" type="button" onClick={onClose}>기본 공간으로 계속하기</button>
      </section>
    </div>
  );
}
