import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { isMember, readPoints, SIGNUP_BONUS } from "../data/points";

const SPACE_PRICE = 300;

type SpaceExpansionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function SpaceExpansionDialog({ open, onClose }: SpaceExpansionDialogProps) {
  const navigate = useNavigate();
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

  const member = isMember();
  const balance = readPoints();
  const hasEnough = balance >= SPACE_PRICE;

  const content = !member
    ? {
        title: `회원가입 하면 ${SIGNUP_BONUS}P를 드려요`,
        body: "가입 시 받는 포인트로 공간 1개를 바로 추가할 수 있어요. 회원가입 후 진행해보세요.",
        primaryLabel: "회원가입 하러 가기",
        onPrimary: () => navigate("/signup"),
      }
    : hasEnough
      ? {
          title: `${SPACE_PRICE}P로 공간을 추가할 수 있어요`,
          body: `보유 포인트 ${balance.toLocaleString()}P로 공간 1개를 추가할 수 있어요. 공간 관리에서 이어서 진행해보세요.`,
          primaryLabel: "공간 추가하기",
          onPrimary: () => navigate("/space-manage"),
        }
      : {
          title: "포인트가 부족해요",
          body: `공간 1개를 추가하려면 ${SPACE_PRICE}P가 필요해요. 지금 보유 포인트는 ${balance.toLocaleString()}P예요.`,
          primaryLabel: "포인트 충전하러 가기",
          onPrimary: () => navigate("/points?intent=charge"),
        };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-on-surface/40" role="presentation" onClick={onClose}>
      <section
        aria-labelledby="space-expansion-title"
        aria-modal="true"
        className="w-full max-w-[430px] rounded-t-2xl bg-sky-white px-margin-screen pb-[calc(24px+env(safe-area-inset-bottom,0px))] pt-space-lg shadow-xl"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-space-md">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-tint text-sky-deep">
            <Icon name="add_home" className="text-[22px]" />
          </span>
          <button ref={closeButtonRef} aria-label="닫기" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-low" type="button" onClick={onClose}>
            <Icon name="close" className="text-[22px]" />
          </button>
        </div>
        <h2 id="space-expansion-title" className="mt-space-md text-headline-md text-sky-ink">{content.title}</h2>
        <p className="mt-space-sm text-body-md text-sky-muted">{content.body}</p>
        <button className="mt-space-lg flex h-12 w-full items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand transition-transform duration-[120ms] active:scale-[0.98]" type="button" onClick={content.onPrimary}>
          {content.primaryLabel}
        </button>
        <button className="mt-space-sm flex h-12 w-full items-center justify-center rounded-full text-title-sm text-sky-muted" type="button" onClick={onClose}>
          기본 공간으로 계속하기
        </button>
      </section>
    </div>
  );
}
