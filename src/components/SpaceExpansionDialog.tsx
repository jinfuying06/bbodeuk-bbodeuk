import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlassButton from "./GlassButton";
import { isMember, readPoints, SIGNUP_BONUS } from "../data/points";

const SPACE_PRICE = 300;

type SpaceExpansionDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Space being added (Figma 32:1012 interpolates it into the title). */
  spaceLabel?: string;
  /** Member with enough points confirmed. Omitted (Setup) → go to 공간 관리 to finish there. */
  onConfirm?: () => void;
};

/** 을/를 by final consonant. */
const objectParticle = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? "을" : "를";
};

/** Sky / Dialog (Figma 32:1012 공간 추가 확인): centered white card over the scrim. */
export default function SpaceExpansionDialog({ open, onClose, spaceLabel = "새 공간", onConfirm }: SpaceExpansionDialogProps) {
  const navigate = useNavigate();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

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

  const balance = readPoints();

  const content = !isMember()
    ? {
        title: `회원가입 하면 ${SIGNUP_BONUS}P를 드려요`,
        body: ["가입 시 받는 포인트로 공간 1개를", "바로 추가할 수 있어요."],
        primaryLabel: "회원가입 하러 가기",
        onPrimary: () => navigate("/signup"),
      }
    : balance >= SPACE_PRICE
      ? {
          title: `${spaceLabel}${objectParticle(spaceLabel)} 추가할까요?`,
          body: [`${SPACE_PRICE}P를 사용해 새 공간을 열어요.`, `현재 ${balance.toLocaleString()}P → 추가 후 ${(balance - SPACE_PRICE).toLocaleString()}P`],
          primaryLabel: `${SPACE_PRICE}P로 공간 추가`,
          onPrimary: onConfirm ?? (() => navigate("/space-manage")),
        }
      : {
          title: "포인트가 부족해요",
          body: [`공간 1개를 추가하려면 ${SPACE_PRICE}P가 필요해요.`, `지금 보유 포인트는 ${balance.toLocaleString()}P예요.`],
          primaryLabel: "포인트 충전하러 가기",
          onPrimary: () => navigate("/points?intent=short"),
        };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-scrim px-margin-screen" role="presentation" onClick={onClose}>
      <section
        aria-describedby="space-expansion-body"
        aria-labelledby="space-expansion-title"
        aria-modal="true"
        className="flex min-h-[292px] w-full max-w-[342px] flex-col gap-4 rounded-2xl bg-sky-white px-5 pb-5 pt-[22px]"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="space-expansion-title" className="text-bb-title text-sky-ink">
          {content.title}
        </h2>
        <p id="space-expansion-body" className="text-bb-body text-sky-muted">
          {content.body[0]}
          <br />
          {content.body[1]}
        </p>
        <GlassButton className="w-full" onClick={content.onPrimary}>
          {content.primaryLabel}
        </GlassButton>
        <button ref={cancelRef} className="flex h-11 w-full items-center justify-center text-bb-label text-sky-deep" type="button" onClick={onClose}>
          취소
        </button>
      </section>
    </div>
  );
}
